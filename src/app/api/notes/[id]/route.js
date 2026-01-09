// import connectDB from "@/lib/mongodb";
// import Note from "@/models/Note";
// import { NextResponse } from "next/server";

// export async function DELETE(request, { params }) {
//   try {
//     await connectDB();
//     const { id } = params;
//     await Note.findByIdAndDelete(id);
//     return NextResponse.json({ message: "Note deleted" });
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
//   }
// }





import connectDB from "@/lib/mongodb";
import Note from "@/models/Note";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    // Yahan await lagana zaroori hai naye Next.js version mein
    const { id } = await params; 
    
    await Note.findByIdAndDelete(id);
    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}