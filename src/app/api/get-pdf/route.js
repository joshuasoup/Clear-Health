import { getAuth } from "@clerk/nextjs/server";
import { getUserInfo } from "../../../lib/mongo/files";

export async function GET(req) {
  const { userId } = getAuth(req);
  if (!userId) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  try {
    const { userCollection, error } = await getUserInfo(userId);
    if (error) throw new Error(error);

    return new Response(JSON.stringify({ userCollection }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
