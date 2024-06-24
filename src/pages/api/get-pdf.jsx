import { getAuth } from "@clerk/nextjs/server";
import { getUserInfo } from "../../lib/mongo/files";

const handler = async (req, res) => {
  if (req.method === "GET") {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const { userCollection, error } = await getUserInfo(userId);
      if (error) throw new Error(error);

      return res.status(200).json({ userCollection });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} is not allowed.`);
  }
};

export default handler;
