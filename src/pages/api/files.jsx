import { getAuth } from "@clerk/nextjs/server";
import { getPDFs } from "../../lib/mongo/files";

const handler = async (req, res) => {
  if (req.method === "GET") {
    const { userId } = getAuth(req);
    console.log(userId);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const { pdfs, error } = await getPDFs(userId);
      if (error) throw new Error(error);

      return res.status(200).json({ pdfs });
    } catch (error) {
      console.log("sd");
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} is not allowed.`);
  }
};

export default handler;
