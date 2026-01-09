import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  userEmail: { type: String, required: true }, // Auth ke baad user ko identify karne ke liye
}, { timestamps: true });

export default mongoose.models.Note || mongoose.model("Note", NoteSchema);