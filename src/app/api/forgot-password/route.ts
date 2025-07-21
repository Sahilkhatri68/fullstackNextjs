import { randomBytes } from "crypto";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend("re_NmuTZDKW_DffLE7dAebqdBNPq3mxWNyvU");

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection("users").findOne({ email });

  // Always respond with success to prevent email enumeration
  if (!user) {
    return NextResponse.json({ success: true });
  }

  // Generate a secure random token
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now

  await db.collection("password_resets").insertOne({
    userId: user._id,
    token,
    expires,
  });

  // Send real email with Resend
  const resetUrl = `http://localhost:3000/reset/${token}`;
  await resend.emails.send({
    from: "Stock Market<onboarding@resend.dev>",
    to: email,
    subject: "Password Reset",
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link will expire in 1 hour.</p>`,
  });

  return NextResponse.json({ success: true });
} 