// src/app/api/reset/[token]/route.ts - Password reset token validation

import { ObjectId } from "mongodb";
import { hash } from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Extract token from the URL
  const url = new URL(req.url);
  const token = url.pathname.split("/").pop();

  const { password } = await req.json();

  const client = await clientPromise;
  const db = client.db();

  const reset = await db.collection("password_resets").findOne({ token });

  if (!reset || reset.expires < new Date()) {
    return NextResponse.json({ error: "Token invalid or expired" }, { status: 400 });
  }

  const hashed = await hash(password, 12);
  await db.collection("users").updateOne(
    { _id: new ObjectId(reset.userId) },
    { $set: { password: hashed } }
  );

  await db.collection("password_resets").deleteOne({ _id: reset._id });

  return NextResponse.json({ success: true });
}
