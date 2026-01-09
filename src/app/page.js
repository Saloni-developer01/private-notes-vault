"use client"
import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Plus, Trash2, LogOut, FileText, X, Eye } from "lucide-react";

export default function Home() {
  const { data: session } = useSession();
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Auth States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  
  // View Note State
  const [selectedNote, setSelectedNote] = useState(null);

  const fetchNotes = async () => {
    if (!session?.user?.email) return;
    const res = await fetch(`/api/notes?email=${session.user.email}`);
    const data = await res.json();
    setNotes(data);
  };

  useEffect(() => { fetchNotes(); }, [session]);

  // const handleAuth = async (e) => {
  //   e.preventDefault();
  //   if (isRegister) {
  //     const res = await fetch("/api/auth/register", {
  //       method: "POST",
  //       body: JSON.stringify({ email, password }),
  //     });
  //     if (res.ok) alert("Registered! Now Login.");
  //     else alert("Error registering");
  //   } else {
  //     await signIn("credentials", { email, password });
  //   }
  // };

  
  // Updated handleAuth function
const handleAuth = async (e) => {
  e.preventDefault();
  if (isRegister) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }), // Name bheja
    });
    if (res.ok) {
      alert("Registration Successful! Redirecting to Login...");
      setIsRegister(false); // AUTOMATICALLY LOGIN PAGE PAR LE JAYEGA
      setName(""); // Clear name
    } else {
      alert("Error: User might already exist.");
    }
  } else {
    const result = await signIn("credentials", { 
      email, password, redirect: false 
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
    setTitle(""); setContent(""); setLoading(false);
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
    fetchNotes();
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 border border-slate-100">
          <div className="text-center mb-8">
            <FileText className="text-blue-600 w-12 h-12 mx-auto mb-2" />
            <h1 className="text-3xl font-bold text-slate-800">Private Vault</h1>
            <p className="text-slate-500">{isRegister ? "Create an account" : "Welcome back"}</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {isRegister && (
    <input 
      type="text" 
      placeholder="Full Name" 
      className="w-full p-3 rounded-xl border border-slate-200 outline-blue-500" 
      onChange={(e) => setName(e.target.value)} 
      required 
    />
  )}
            <input type="email" placeholder="Email" className="w-full p-3 rounded-xl border border-slate-200 outline-blue-500" onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" className="w-full p-3 rounded-xl border border-slate-200 outline-blue-500" onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
              {isRegister ? "Sign Up" : "Login"}
            </button>
          </form>

          <div className="relative my-6 text-center">
             <span className="bg-white px-2 text-slate-400 text-sm relative z-10">OR</span>
             <div className="absolute top-1/2 w-full h-[1px] bg-slate-100"></div>
          </div>

          <button onClick={() => signIn("google")} className="w-full border border-slate-200 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition font-medium">
            <img src="https://www.google.com/favicon.ico" className="w-4" alt="G" /> Sign in with Google
          </button>

          <p className="text-center mt-6 text-sm text-slate-500">
            {isRegister ? "Already have an account?" : "Don't have an account?"}
            <button onClick={() => setIsRegister(!isRegister)} className="ml-1 text-blue-600 font-bold hover:underline">
              {isRegister ? "Login" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2"><FileText className="text-blue-600" /> Vault</h1>
        <button onClick={() => signOut()} className="flex items-center gap-2 text-slate-500 hover:text-red-600 font-medium transition">
          {/* <span className="hidden sm:block text-sm font-medium text-slate-700">Hello, {session.user.name || session.user.email.split('@')[0]}</span> <LogOut size={20} /> */}

          <span className="hidden sm:block text-sm font-medium text-slate-700">
  Hello, {session.user.name || session.user.email.split('@')[0]}
</span> <LogOut size={20} />
        </button>
      </nav>

      <main className="max-w-4xl mx-auto mt-10 px-6">
        <form onSubmit={addNote} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <input type="text" placeholder="Note Title..." className="w-full text-xl font-semibold outline-none mb-3" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea placeholder="Write your note here..." className="w-full text-slate-600 outline-none resize-none min-h-[80px]" value={content} onChange={(e) => setContent(e.target.value)} />
          <div className="flex justify-end"><button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition disabled:opacity-50"><Plus size={24} /></button></div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map((note) => (
            <div key={note._id} className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all relative cursor-pointer" onClick={() => setSelectedNote(note)}>
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={(e) => { e.stopPropagation(); deleteNote(note._id); }} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
              </div>
              <h3 className="font-bold text-slate-800 mb-2 truncate pr-10">{note.title}</h3>
              <p className="text-slate-600 text-sm line-clamp-3 mb-4">{note.content}</p>
              <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-50">
                 <span className="text-[10px] text-slate-400 font-bold uppercase">{new Date(note.createdAt).toLocaleDateString()}</span>
                 <Eye size={16} className="text-slate-300" />
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* VIEW SINGLE NOTE MODAL */}
      {selectedNote && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setSelectedNote(null)}>
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="p-8 border-b border-slate-100 flex justify-between items-start">
              <h2 className="text-2xl font-bold text-slate-800">{selectedNote.title}</h2>
              <button onClick={() => setSelectedNote(null)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition"><X size={20}/></button>
            </div>
            <div className="p-8 max-h-[60vh] overflow-y-auto">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedNote.content}</p>
            </div>
            <div className="p-4 bg-slate-50 text-center text-xs text-slate-400 font-medium uppercase tracking-widest">Created on {new Date(selectedNote.createdAt).toLocaleString()}</div>
          </div>
        </div>
      )}
    </div>
  );
}