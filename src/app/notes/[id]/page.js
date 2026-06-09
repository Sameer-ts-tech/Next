import connectDB from "@/lib/db";
import Note from "@/models/Note";
import { updateNoteAction } from "@/app/actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save, FileEdit, Calendar } from "lucide-react";
import DeleteButton from "@/components/DeleteButton";

export const metadata = {
  title: "Edit Note | Emerald Notes",
  description: "View and edit your note details.",
};

async function getNote(id) {
  try {
    await connectDB();
    return await Note.findById(id);
  } catch (error) {
    console.error("Failed to fetch note:", error);
    return null;
  }
}

export default async function NoteDetailPage({ params }) {
  const { id } = await params;
  const note = await getNote(id);

  if (!note) {
    notFound();
  }

  // Pre-bind update action with note ID for the server form action
  const updateNoteWithId = updateNoteAction.bind(null, id);

  return (
    <div className="p-8 md:p-12 max-w-2xl mx-auto flex flex-col gap-6 animate-fade-in">
      {/* Navigation & Actions */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div>
          <DeleteButton id={id} redirectAfterDelete={true} />
        </div>
      </div>

      {/* Header Info */}
      <div className="flex items-center gap-2.5 text-zinc-100 mb-2">
        <div className="p-2 rounded-xl bg-primary-glow border border-primary/20 text-primary">
          <FileEdit className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Edit Note</h1>
          <p className="text-xs text-zinc-500">ID: {id}</p>
        </div>
      </div>

      {/* Edit Form */}
      <form action={updateNoteWithId} className="flex flex-col gap-5">
        <div className="glass-panel p-6 rounded-2xl border border-zinc-800 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400 font-bold uppercase">Note Title</label>
            <input
              type="text"
              name="title"
              defaultValue={note.title}
              className="w-full bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-zinc-700"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400 font-bold uppercase">Content</label>
            <textarea
              name="content"
              defaultValue={note.content}
              rows={8}
              className="w-full bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-zinc-700 resize-none leading-relaxed"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400 font-bold uppercase">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              defaultValue={note.tags ? note.tags.join(", ") : ""}
              placeholder="work, ideas, list"
              className="w-full bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-zinc-700"
            />
          </div>

          {/* Toggle Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <label className="flex items-center gap-3 p-3 bg-zinc-900/40 border border-zinc-850 rounded-xl cursor-pointer hover:border-zinc-800 transition-all select-none">
              <input
                type="checkbox"
                name="isPinned"
                defaultChecked={note.isPinned}
                className="w-4 h-4 rounded border-zinc-800 text-primary focus:ring-primary bg-zinc-900 cursor-pointer accent-primary"
              />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-200">Pin to Top</span>
                <span className="text-[10px] text-zinc-500">Keep it pinned on dashboard</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-zinc-900/40 border border-zinc-850 rounded-xl cursor-pointer hover:border-zinc-800 transition-all select-none">
              <input
                type="checkbox"
                name="isPublic"
                defaultChecked={note.isPublic}
                className="w-4 h-4 rounded border-zinc-800 text-primary focus:ring-primary bg-zinc-900 cursor-pointer accent-primary"
              />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-200">Share Publicly</span>
                <span className="text-[10px] text-zinc-500">Show on static public feed</span>
              </div>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Link
            href="/"
            className="px-5 py-3 rounded-xl border border-zinc-850 hover:bg-zinc-900 hover:text-zinc-200 text-zinc-400 font-semibold text-sm transition-all duration-200 flex items-center justify-center cursor-pointer"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all duration-200 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.1)]"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
      
      {/* Date metadata */}
      <div className="flex justify-between text-[11px] text-zinc-500 px-2 mt-4">
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          Created: {new Date(note.createdAt).toLocaleString()}
        </span>
        <span>
          Last updated: {new Date(note.updatedAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
