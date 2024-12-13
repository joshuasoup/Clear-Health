import { downloadFromS3 } from "../../../lib/pinecone/s3-server";
import { getEmbeddings } from "../../../lib/pinecone/embeddings";
import { getPineconeClient } from "../../../lib/pinecone/pinecone";
import pdfParse from 'pdf-parse/lib/pdf-parse'
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import md5 from "md5";
import { convertToAscii } from "../../../lib/pinecone/utils";

export const config = {
  api: {
    bodyParser: false,
  },
};



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

export async function POST(req) {
  try {

    // Use NextRequest's json() method
    const body = await req.json();

    const fileKey = body?.fileKey;

    if (!fileKey) {
      console.error('No fileKey found in request body');
      return new Response(
        JSON.stringify({ error: "Missing fileKey in the request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Detailed S3 download logging
    console.log("Attempting to download PDF from S3...");
    const fileBuffer = await downloadFromS3(fileKey);
    
    if (!fileBuffer) {
      console.error('Failed to download file buffer');
      throw new Error("Failed to download PDF");
    }

    console.log('File Buffer Details:', {
      type: typeof fileBuffer,
      length: fileBuffer.length,
      isBuffer: Buffer.isBuffer(fileBuffer)
    });

    // Detailed PDF parsing
    try {
      const loader = await pdfParse(fileBuffer, {
        max: 1 // Limit to first page for testing
      });

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
          result: vectors,
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

    return new Response(
      JSON.stringify({ 
        error: "Failed to process and upload PDF",
        errorDetails: error.message
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}




