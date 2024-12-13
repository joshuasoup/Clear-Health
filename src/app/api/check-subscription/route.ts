// src/app/api/check-subscription/route.ts
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongo/db";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ active: false }, { status: 401 });
    }

    const userId = user.id;
    const client = await clientPromise;
    const database = client.db("userdata");
    const usersCollection = database.collection("Users");

    const userSubscription = await usersCollection.findOne({
      clerkUserId: userId,
    });

    if (!userSubscription) {
      return NextResponse.json({ active: false });
    }

    // Check the subscriptionStatus field
    if (userSubscription.subscriptionStatus === true) {
      return NextResponse.json({ active: true });
    } else {
      return NextResponse.json({ active: false });
    }
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
