"use client";

import { useState } from "react";
import NoteCard from "./NoteCard";
import { Search, Tag, Sparkles } from "lucide-react";

export default function DashboardContainer({ initialNotes }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);

  // Parse all unique tags for filter badges
  const allTags = Array.from(
    new Set(initialNotes.flatMap((note) => note.tags || []))
  );

  // Filter notes
  const filteredNotes = initialNotes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = selectedTag ? note.tags?.includes(selectedTag) : true;
    
    return matchesSearch && matchesTag;
  });

  const pinnedNotes = filteredNotes.filter((note) => note.isPinned);
  const standardNotes = filteredNotes.filter((note) => !note.isPinned);

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      {/* Search & Tag Filter Header */}
      <div className="flex flex-col gap-4">
        {/* Search Input */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search notes by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/40 border border-zinc-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-zinc-150 focus:outline-none focus:border-primary/45 focus:ring-1 focus:ring-primary/20 placeholder:text-zinc-550 transition-all"
          />
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center select-none">
            <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider mr-1">Filter Tags:</span>
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                !selectedTag
                  ? "bg-primary-glow border-primary/20 text-primary"
                  : "bg-zinc-900 border-zinc-850 text-zinc-455 hover:border-zinc-700"
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
                  selectedTag === tag
                    ? "bg-primary-glow border-primary/20 text-primary"
                    : "bg-zinc-900 border-zinc-850 text-zinc-455 hover:border-zinc-700"
                }`}
              >
                <Tag className="w-3 h-3 text-zinc-550" />
                <span>{tag}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Pinned Notes Grid */}
      {pinnedNotes.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-xs text-warning font-bold uppercase tracking-wider flex items-center gap-1.5 px-1 select-none">
            <Sparkles className="w-3.5 h-3.5 fill-warning" />
            <span>Pinned Notes</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {pinnedNotes.map((note) => (
              <NoteCard key={note._id.toString()} note={note} />
            ))}
          </div>
        </div>
      )}

      {/* Standard Notes Grid */}
      <div className="flex flex-col gap-3">
        {pinnedNotes.length > 0 && standardNotes.length > 0 && (
          <h2 className="text-xs text-zinc-550 font-bold uppercase tracking-wider px-1 select-none mt-2">
            <span>Recent Notes</span>
          </h2>
        )}
        {filteredNotes.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl border border-zinc-800 flex flex-col items-center justify-center text-center gap-3">
            <Search className="w-10 h-10 text-zinc-600" />
            <h3 className="text-lg font-bold text-zinc-300">No notes found</h3>
            <p className="text-zinc-500 text-xs max-w-xs leading-relaxed">
              We couldn't find any notes matching "{searchQuery}" {selectedTag && `with tag #${selectedTag}`}. Try adjusting your keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {standardNotes.map((note) => (
              <NoteCard key={note._id.toString()} note={note} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
