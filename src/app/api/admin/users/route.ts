import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { ObjectId } from "mongodb";

const resend = new Resend("re_NmuTZDKW_DffLE7dAebqdBNPq3mxWNyvU");

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  type UserWithRole = { role?: string };
  if (!session || (session.user && (session.user as UserWithRole).role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const client = await clientPromise;
  const db = client.db("stockmarketDatabase");
  const users = await db
    .collection("users")
    .find({}, { projection: { password: 0 } })
    .toArray();
  return NextResponse.json({ users });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  type UserWithRole = { role?: string; name?: string; email?: string };
  if (!session || (session.user && (session.user as UserWithRole).role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { userId, newRole } = await req.json();
  if (!userId || !["user", "admin"].includes(newRole)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  const client = await clientPromise;
  const db = client.db("stockmarketDatabase");
  const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const result = await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    { $set: { role: newRole } }
  );
  if (result.modifiedCount === 1) {
    // Send email notification using Resend
    await resend.emails.send({
      from: "Stock Market<onboarding@resend.dev>",
      to: user.email,
      subject: "Your Role Has Been Updated",
      html: `<p>Hello ${(user as UserWithRole).name || (user as UserWithRole).email},<br>Your role has been changed to <b>${newRole}</b> by an admin.</p>`,
    });
    return NextResponse.json({ success: true, message: "Role updated and email sent" });
  }
  return NextResponse.json({ error: "User not found or role unchanged" }, { status: 404 });
} 