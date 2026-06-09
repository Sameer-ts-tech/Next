"use client";

import { useActionState, useRef, useEffect } from "react";
import { createNoteAction } from "@/app/actions";
import { Plus, Bookmark, Globe } from "lucide-react";

export default function QuickForm() {
  const [state, formAction, isPending] = useActionState(createNoteAction, null);
  const formRef = useRef(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="glass-panel p-6 rounded-3xl border border-zinc-800 flex flex-col gap-4 w-full select-none"
    >
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-zinc-100 text-lg">Create a Note</h3>
        <p className="text-xs text-zinc-500">Draft notes quickly and save them directly to MongoDB.</p>
      </div>

      {state?.error && (
        <div className="bg-danger/10 border border-danger/20 px-4 py-3 rounded-xl text-xs text-danger font-semibold">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="bg-primary/10 border border-primary/20 px-4 py-3 rounded-xl text-xs text-primary font-semibold">
          {state.message}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          placeholder="Note Title"
          className="w-full bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-3 text-sm text-zinc-150 placeholder:text-zinc-550 focus:outline-none focus:border-zinc-700"
          required
        />

        <textarea
          name="content"
          placeholder="Take a note..."
          rows={3}
          className="w-full bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-3 text-sm text-zinc-150 placeholder:text-zinc-550 focus:outline-none focus:border-zinc-700 resize-none leading-relaxed"
          required
        />

        <input
          type="text"
          name="tags"
          placeholder="Tags (separated by commas: meeting, ideas, work)"
          className="w-full bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-zinc-150 placeholder:text-zinc-550 focus:outline-none focus:border-zinc-700"
        />

        {/* Toggles & Submit Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-zinc-900">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="isPinned"
                className="w-3.5 h-3.5 rounded border-zinc-800 text-primary focus:ring-primary bg-zinc-900 accent-primary cursor-pointer"
              />
              <span className="text-xs text-zinc-400 font-medium flex items-center gap-1">
                <Bookmark className="w-3.5 h-3.5 text-warning" />
                Pin Note
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="isPublic"
                className="w-3.5 h-3.5 rounded border-zinc-800 text-primary focus:ring-primary bg-zinc-900 accent-primary cursor-pointer"
              />
              <span className="text-xs text-zinc-400 font-medium flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-primary" />
                Share Publicly
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="bg-primary hover:bg-primary-dark disabled:opacity-50 text-white text-xs font-semibold py-2.5 px-5 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.1)]"
          >
            {isPending ? (
              <>
                <div className="spinner !border-l-white" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add Note</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
