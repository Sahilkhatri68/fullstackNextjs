import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("test"); // You can change 'test' to your actual db name

    const collections = await db.listCollections().toArray();

    return NextResponse.json({
      success: true,
      message: "Connected to MongoDB successfully!",
      collections: collections.map((col) => col.name),
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return NextResponse.json(
      { success: false, message: "MongoDB connection failed." },
      { status: 500 }
    );
  }
}
