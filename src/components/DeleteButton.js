"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteNoteAction } from "@/app/actions";
import { Trash2 } from "lucide-react";

export default function DeleteButton({ id, redirectAfterDelete = false }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirming) {
      setConfirming(true);
      // Auto-cancel confirmation after 3 seconds
      setTimeout(() => setConfirming(false), 3000);
      return;
    }

    setPending(true);
    try {
      const res = await deleteNoteAction(id);
      if (res.success) {
        if (redirectAfterDelete) {
          router.push("/");
          router.refresh();
        }
      } else {
        alert("Delete failed: " + res.error);
        setPending(false);
        setConfirming(false);
      }
    } catch (error) {
      alert("Delete failed: " + error.message);
      setPending(false);
      setConfirming(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer disabled:opacity-50 ${
        confirming
          ? "bg-danger border-danger-dark text-white hover:bg-danger-dark"
          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-danger hover:border-danger/20"
      }`}
    >
      <Trash2 className="w-3.5 h-3.5" />
      <span>{pending ? "Deleting..." : confirming ? "Click again to confirm" : "Delete"}</span>
    </button>
  );
}
