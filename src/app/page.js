"use client";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import {Plus,Trash2,LogOut,X,Eye,Pencil,Check,Inbox} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { data: session } = useSession();
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);

  const fetchNotes = async () => {
    if (!session?.user?.email) return;
    const res = await fetch(`/api/notes?email=${session.user.email}`);
    const data = await res.json();
    setNotes(data);
  };

  useEffect(() => {
    fetchNotes();
  }, [session]);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (isRegister) {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      if (res.ok) {
        alert("Success! Now Login.");
        setIsRegister(false);
      }
    } else {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result.error) alert("Invalid Credentials");
    }
  };

  const addNote = async (e) => {
    e.preventDefault();
    if (!title || !content) return;
    setLoading(true);
    await fetch("/api/notes", {
      method: "POST",
      body: JSON.stringify({ title, content, userEmail: session.user.email }),
    });
    resetForm();
    fetchNotes();
  };

  const updateNote = async (e) => {
    e.preventDefault();
    setLoading(true);
    await fetch(`/api/notes/${editId}`, {
      method: "PUT",
      body: JSON.stringify({ title, content }),
    });
    resetForm();
    fetchNotes();
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setIsEditing(false);
    setEditId(null);
    setLoading(false);
  };

  const handleEditClick = (note, e) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditId(note._id);
    setTitle(note.title);
    setContent(note.content);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteNote = async (id, e) => {
    e.stopPropagation();
    if (confirm("Delete this note?")) {
      await fetch(`/api/notes/${id}`, { method: "DELETE" });
      fetchNotes();
    }
  };

  // Login & Signup form
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white shadow-2xl rounded-3xl p-10 border border-slate-100"
        >
          <div className="text-center mb-8">
            <div className="rounded-2xl flex items-center justify-center mx-auto mb-4">
              <img src="logo.png" width={60} height={40} />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Private Vault
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              {isRegister ? "Create your account" : "Welcome back"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {isRegister && (
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#2A2E95] transition-all"
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#2A2E95] transition-all"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#2A2E95] transition-all"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-[#2A2E95] text-white py-4 rounded-xl font-bold hover:bg-[#1a1c55] transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              {isRegister ? "Sign Up" : "Login"}
            </button>
          </form>

          <div className="relative my-8 text-center">
            <div className="absolute top-1/2 w-full h-[1px] bg-slate-100"></div>
            <span className="bg-white px-4 text-slate-400 text-xs font-bold uppercase relative z-10">
              OR
            </span>
          </div>

          <button
            onClick={() => signIn("google")}
            className="w-full border border-slate-200 py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all font-semibold text-slate-700"
          >
            <img
              src="https://www.google.com/favicon.ico"
              className="w-5 h-5"
              alt="G"
            />{" "}
            Google Login
          </button>

          <p className="text-center mt-8 text-sm text-slate-500">
            {isRegister ? "Already member?" : "New user?"}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="ml-2 text-[#2A2E95] font-bold hover:underline cursor-pointer"
            >
              {isRegister ? "Login" : "Register"}
            </button>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-1">
          <img src="logo.png" width={50} height={50} />
          <h1 className="text-xl font-bold text-slate-800 mt-1">VaultNote</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-md font-bold text-slate-700 mt-1">
            <span className="text-slate-400 font-medium">Hi,</span>{" "}
            {session.user.name?.split(" ")[0] ||
              session.user.email.split("@")[0]}
          </div>
          <div
            className="flex items-center gap-3  rounded-full border"
            style={{ border: "2px solid #FFC941" }}
          >
            <img
              src="profile.jpg"
              alt="Profile"
              className="w-8 h-8 rounded-full shadow-sm"
            />
          </div>

          <button
            onClick={() => signOut()}
            className="p-2.5 bg-white text-slate-500 rounded-xl border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all shadow-sm cursor-pointer"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto mt-10 px-6">
        <motion.header
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            {isEditing ? "✨ Update your note" : "📝 New Note"}
          </h2>
          <p className="text-slate-500 font-medium">
            Keep your thoughts organized and safe.
          </p>
        </motion.header>

        <motion.form
          layout
          onSubmit={isEditing ? updateNote : addNote}
          className={`bg-white p-6 rounded-3xl shadow-sm border-2 transition-all duration-300 ${
            isEditing
              ? "border-amber-200 shadow-amber-50"
              : "border-white focus-within:border-blue-100"
          } mb-10`}
        >
          <input
            type="text"
            placeholder="Note Title..."
            className="w-full text-xl font-bold outline-none mb-3 text-slate-800"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Write something..."
            className="w-full text-slate-600 outline-none resize-none min-h-[100px] text-lg"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-50">
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="text-slate-400 font-bold text-sm hover:text-slate-600"
              >
                Cancel
              </button>
            )}
            <div className="ml-auto">
              <button
                type="submit"
                disabled={loading}
                className={`${
                  isEditing
                    ? "bg-amber-500 hover:bg-amber-600 shadow-amber-100"
                    : "bg-[#2A2E94] hover:bg-[#252a7c] shadow-blue-100"
                } text-white px-8 py-3 rounded-2xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer`}
              >
                {loading ? (
                  "Processing..."
                ) : isEditing ? (
                  <>
                    <Check size={20} /> Update
                  </>
                ) : (
                  <>
                    <Plus size={20} /> Save Note
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.form>

        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-600 uppercase text-xs tracking-[0.1em]">
            Your Notes • {notes.length}
          </h3>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {notes.map((note) => (
              <motion.div
                key={note._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                whileHover={{ y: -5 }}
                className="group bg-white p-6 rounded-3xl border border-slate-100 hover:border-[#2A2E94] hover:shadow-2xl hover:shadow-[#c9cbff] transition-all relative cursor-pointer flex flex-col min-h-[180px]"
                onClick={() => setSelectedNote(note)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-slate-800 text-lg truncate pr-16 leading-tight">
                    {note.title}
                  </h3>
                  <div className="flex gap-1 absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleEditClick(note, e)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={(e) => deleteNote(note._id, e)}
                      className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed flex-grow">
                  {note.content}
                </p>
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-50">
                  <span className="text-[13px] font-bold text-[#7e7e7e] uppercase">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-1 text-[#2A2E94] text-[10px] font-black uppercase tracking-widest">
                    Read <Eye size={12} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {notes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-400"
          >
            <Inbox className="mx-auto text-slate-300 w-16 h-16 mb-4" />
            <h3 className="text-slate-400 font-bold uppercase text-xs tracking-widest">
              Vault is empty
            </h3>
          </motion.div>
        )}
      </main>

      <AnimatePresence>
        {selectedNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setSelectedNote(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 pb-4 flex justify-between items-start">
                <div className="bg-[#2A2E94] px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                  Encrypted Note
                </div>
                <button
                  onClick={() => setSelectedNote(null)}
                  className="p-2 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="px-10 pb-4">
                <h2 className="text-3xl font-black text-slate-800 leading-tight">
                  {selectedNote.title}
                </h2>
              </div>
              <div className="px-10 py-6 max-h-[50vh] overflow-y-auto custom-scrollbar text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">
                {selectedNote.content}
              </div>
              <div className="p-8 bg-slate-50 flex justify-between items-center border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
                  Created: {new Date(selectedNote.createdAt).toLocaleString()}
                </span>
                <button
                  onClick={() => setSelectedNote(null)}
                  className="bg-slate-800 text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-700 transition-all cursor-pointer"
                >
                  Close Vault
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
