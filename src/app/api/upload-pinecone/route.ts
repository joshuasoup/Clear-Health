import { getEmbeddings } from "../../../lib/pinecone/embeddings";
import { getPineconeClient } from "../../../lib/pinecone/pinecone";
import pdfParse from 'pdf-parse/lib/pdf-parse'
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import md5 from "md5";
import { convertToAscii } from "../../../lib/pinecone/utils";

type DocumentType = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

// Helper function to process and split the PDF
async function processAndSplitPDF(pdfContent: string): Promise<DocumentType[]> {
  const splitter = new RecursiveCharacterTextSplitter();
  const documents: DocumentType[] = [];

  const pages = pdfContent.split(/\f|\n{2,}/);

  for (let i = 0; i < pages.length; i++) {
    let pageContent = pages[i].replace(/\n/g, " ").trim();

    try {
      const docs = await splitter.splitDocuments([
        {
          pageContent,
          metadata: {
            pageNumber: i + 1, // Assign page numbers manually
            text: pageContent.substring(0, 36000), // Limit text size for splitting
          },
        },
      ]);

      // Push split documents into the array
      documents.push(...(docs as DocumentType[]));
    } catch (error) {
      console.error(`Error processing page ${i + 1}: `, error);
    }
  }

  return documents;
}

async function embedDocuments(documents) {
  return await Promise.all(
    documents.map(async (doc) => {
      const embeddings = await getEmbeddings(doc.pageContent);
      const hash = md5(doc.pageContent);

      return {
        id: hash,
        values: embeddings,
        metadata: {
          pageNumber: doc.metadata.pageNumber,
          text: doc.pageContent,
        },
      };
    })
  );
}

async function extractFileBuffer(req: Request) {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const file = formData.get("file");
    const providedKey = formData.get("fileKey")?.toString();

    if (!file || typeof file === "string") {
      throw new Error("No file found in form-data payload");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = (file as File).name || "upload.pdf";
    const fileKey =
      providedKey ||
      `${Date.now()}-${convertToAscii(fileName).replace(/\s+/g, "-")}`;

    return { fileBuffer: buffer, fileKey };
  }

  // Support legacy JSON body containing fileKey only (expected to be handled upstream).
  const body = await req.json().catch(() => null);
  const legacyKey = body?.fileKey;

  if (legacyKey) {
    throw new Error(
      "Direct file uploads are required now. Send multipart/form-data with a `file` field."
    );
  }

  throw new Error("Unsupported payload. Send multipart/form-data with a file.");
}

export async function POST(req) {
  try {
    const { fileBuffer, fileKey } = await extractFileBuffer(req);

    // Detailed PDF parsing
    try {
      const loader = await pdfParse(fileBuffer);

      console.log('PDF Parse Result:', {
        textLength: loader.text ? loader.text.length : 0,
        numPages: loader.numpages,
        numRender: loader.numrender
      });

      // Proceed with embedding and Pinecone upload
      const documents = await processAndSplitPDF(loader.text);
      const vectors = await embedDocuments(documents);

      const pineconeClient = getPineconeClient();
      const pineconeIndex = await pineconeClient.index("clearhealth");
      const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
      await namespace.upsert(vectors);

      return new Response(
        JSON.stringify({
          message: "Successfully loaded into Pinecone",
          fileKey,
          namespace: convertToAscii(fileKey),
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );

    } catch (parseError) {
      console.error('PDF Parsing Specific Error:', {
        name: parseError.name,
        message: parseError.message,
        stack: parseError.stack
      });

      return new Response(
        JSON.stringify({ 
          error: "PDF parsing failed",
          errorDetails: parseError.message
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

  } catch (error) {
    console.error('Overall Route Processing Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    const badRequest =
      error?.message?.includes("Direct file uploads are required") ||
      error?.message?.includes("Unsupported payload") ||
      error?.message?.includes("No file found");

    return new Response(
      JSON.stringify({ 
        error: "Failed to process and upload PDF",
        errorDetails: error.message
      }),
      { status: badRequest ? 400 : 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

