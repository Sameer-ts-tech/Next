import connectDB from "@/lib/db";
import Note from "@/models/Note";
import { Globe, RefreshCw, Calendar, Tag } from "lucide-react";

export const revalidate = 10; // ISR - revalidate every 10 seconds

async function getPublicNotes() {
  try {
    await connectDB();
    return await Note.find({ isPublic: true }).sort({ createdAt: -1 });
  } catch (error) {
    console.error("Failed to fetch public notes:", error);
    return [];
  }
}

export default async function PublicPage() {
  const notes = await getPublicNotes();
  const generatedTime = new Date().toLocaleTimeString();

  return (
    <div className="p-8 md:p-12 max-w-4xl mx-auto flex flex-col gap-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-primary font-bold tracking-widest uppercase">
            <Globe className="w-4 h-4" />
            <span>Incremental Static Regeneration (ISR)</span>
          </div>
          <h1 className="text-4xl font-extrabold text-zinc-100 tracking-tight">
            Shared <span className="text-primary">Notes Feed</span>
          </h1>
          <p className="text-zinc-400 text-sm">
            Public notes shared by community members. This page regenerates every 10 seconds.
          </p>
        </div>

        {/* ISR Status Card */}
        <div className="glass-panel px-4 py-2.5 rounded-xl border border-zinc-800/80 flex items-center gap-3">
          <div className="bg-primary/10 border border-primary/20 p-2 rounded-lg text-primary">
            <RefreshCw className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Last Generated</div>
            <div className="text-sm font-semibold text-zinc-200">{generatedTime}</div>
          </div>
        </div>
      </div>

      {/* Grid of Notes */}
      {notes.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-zinc-800 flex flex-col items-center justify-center text-center gap-3">
          <Globe className="w-12 h-12 text-zinc-600 mb-2" />
          <h3 className="text-xl font-bold text-zinc-300">No Public Notes</h3>
          <p className="text-zinc-500 text-sm max-w-sm">
            Go back to the Dashboard and toggle the "Public" setting on a note to publish it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notes.map((note) => (
            <div
              key={note._id.toString()}
              className="glass-panel p-6 rounded-2xl border border-zinc-800/80 flex flex-col justify-between gap-4 relative group overflow-hidden"
            >
              {/* Background gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex flex-col gap-2 relative z-10">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-zinc-100 group-hover:text-primary transition-colors duration-200">
                    {note.title}
                  </h3>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">
                  {note.content}
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-3 border-t border-zinc-900 relative z-10">
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center gap-1"
                      >
                        <Tag className="w-2.5 h-2.5 text-zinc-500" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between text-[11px] text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                  <span className="font-semibold text-zinc-650 bg-zinc-900/50 px-2.5 py-0.5 rounded border border-zinc-800">
                    Public Note
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
