import { downloadFromS3 } from "../../lib/pinecone/s3-server";
import { getEmbeddings } from "../../lib/pinecone/embeddings";
import { getPineconeClient } from "../../lib/pinecone/pinecone"
import pdfParse from 'pdf-parse';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import md5 from "md5";
import { convertToAscii } from "../../lib/pinecone/utils";

// Pinecone setup


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

export default async function handler(req , res) {
  if (req.method === "POST") {
    const { fileKey } = req.body;

    if (!fileKey) {
      return res.status(400).json({ error: "Missing fileKey in the request body" });
    }

    try {
        // Step 1: Download PDF from S3
        console.log("Downloading PDF from S3...");
        console.log(fileKey)
        const fileBuffer = await downloadFromS3(fileKey);
        if (!fileBuffer) {
          throw new Error("Failed to download PDF");
        }

        // Step 2: Load PDF content
        const loader = await pdfParse(fileBuffer);
        // Step 3: Process and split PDF into smaller chunks
        const documents = await processAndSplitPDF(loader.text);

        // Step 4: Embed the documents
        const vectors = await embedDocuments(documents);

        // Step 5: Upload to Pinecone
        const pineconeClient = getPineconeClient();
        const pineconeIndex = await pineconeClient.index("clearhealth");
        const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
        await namespace.upsert(vectors);

        res.status(200).json({ message: "Successfully loaded into Pinecone", result: vectors });
      
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Failed to process and upload PDF" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
