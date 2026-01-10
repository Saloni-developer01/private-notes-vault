import connectDB from "@/lib/mongodb";
import Note from "@/models/Note";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params; 
    
    await Note.findByIdAndDelete(id);
    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}


export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const { title, content } = await request.json();

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );

    return NextResponse.json(updatedNote);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}