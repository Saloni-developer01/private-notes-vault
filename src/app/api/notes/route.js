import connectDB from "@/lib/mongodb";
import Note from "@/models/Note";
import { NextResponse } from "next/server";

// 1. Saare notes GET karne ke liye
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    
    const notes = await Note.find({ userEmail: email }).sort({ createdAt: -1 });
    return NextResponse.json(notes);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}

// 2. Naya note POST karne ke liye
export async function POST(request) {
  try {
    await connectDB();
    const { title, content, userEmail } = await request.json();
    
    const newNote = await Note.create({ title, content, userEmail });
    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}