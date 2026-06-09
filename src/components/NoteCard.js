"use client";

import { useTransition } from "react";
import Link from "next/link";
import { togglePinAction, togglePublicAction } from "@/app/actions";
import DeleteButton from "./DeleteButton";
import { Bookmark, Globe, Tag, Calendar, Edit3 } from "lucide-react";

export default function NoteCard({ note }) {
  const [isPinPending, startPinTransition] = useTransition();
  const [isPublicPending, startPublicTransition] = useTransition();

  const handleTogglePin = () => {
    startPinTransition(async () => {
      await togglePinAction(note._id.toString(), note.isPinned);
    });
  };

  const handleTogglePublic = () => {
    startPublicTransition(async () => {
      await togglePublicAction(note._id.toString(), note.isPublic);
    });
  };

  return (
    <div
      className={`glass-panel p-6 rounded-2xl border flex flex-col justify-between gap-5 relative group transition-all duration-300 ${
        note.isPinned ? "border-warning/30 glow-amber bg-warning-glow" : "border-zinc-800 bg-zinc-900/40"
      }`}
    >
      {/* Background Gradient Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col gap-2 relative z-10">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-bold text-lg text-zinc-150 leading-snug group-hover:text-primary transition-colors">
            {note.title}
          </h3>
          
          <button
            onClick={handleTogglePin}
            disabled={isPinPending}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              note.isPinned
                ? "bg-warning/10 border-warning/30 text-warning hover:bg-warning/20"
                : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-warning hover:border-warning/20"
            }`}
            title={note.isPinned ? "Unpin note" : "Pin note"}
          >
            <Bookmark className={`w-4 h-4 ${note.isPinned ? "fill-warning" : ""}`} />
          </button>
        </div>

        <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">
          {note.content}
        </p>
      </div>

      {/* Footer Details */}
      <div className="flex flex-col gap-4 relative z-10 pt-4 border-t border-zinc-850/50">
        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2.5 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-400 flex items-center gap-1 font-mono"
              >
                <Tag className="w-2.5 h-2.5 text-zinc-550" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] text-zinc-550 mt-1">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-zinc-600" />
            {new Date(note.createdAt).toLocaleDateString()}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePublic}
              disabled={isPublicPending}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                note.isPublic
                  ? "bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
                  : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-primary hover:border-primary/20"
              }`}
              title={note.isPublic ? "Make private" : "Share publicly"}
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold">{note.isPublic ? "Public" : "Private"}</span>
            </button>

            <Link
              href={`/notes/${note._id.toString()}`}
              className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-550 hover:text-zinc-300 hover:border-zinc-700 transition-all cursor-pointer"
              title="Edit note"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </Link>

            <DeleteButton id={note._id.toString()} />
          </div>
        </div>
      </div>
    </div>
  );
}
