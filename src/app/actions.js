"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db";
import Note from "@/models/Note";

// Create a new note using Server Actions
export async function createNoteAction(prevState, formData) {
  try {
    const title = formData.get("title")?.toString() || "";
    const content = formData.get("content")?.toString() || "";
    const tagsString = formData.get("tags")?.toString() || "";
    const isPinned = formData.get("isPinned") === "on";
    const isPublic = formData.get("isPublic") === "on";

    // Server-side validation
    if (!title.trim() || !content.trim()) {
      return { success: false, error: "Title and content are required." };
    }

    const tags = tagsString
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    await connectDB();
    await Note.create({
      title: title.trim(),
      content: content.trim(),
      tags,
      isPinned,
      isPublic,
    });

    // Revalidate paths to update the cached versions
    revalidatePath("/");
    revalidatePath("/public");
    revalidatePath("/stats");

    return { success: true, message: "Note created successfully." };
  } catch (error) {
    console.error("createNoteAction error:", error);
    return { success: false, error: error.message || "Failed to create note." };
  }
}

// Toggle dynamic pin state
export async function togglePinAction(id, currentStatus) {
  try {
    await connectDB();
    const updated = await Note.findByIdAndUpdate(id, { isPinned: !currentStatus }, { new: true });
    if (!updated) return { success: false, error: "Note not found." };
    
    revalidatePath("/");
    revalidatePath("/stats");
    return { success: true };
  } catch (error) {
    console.error("togglePinAction error:", error);
    return { success: false, error: error.message };
  }
}

// Toggle dynamic public share state
export async function togglePublicAction(id, currentStatus) {
  try {
    await connectDB();
    const updated = await Note.findByIdAndUpdate(id, { isPublic: !currentStatus }, { new: true });
    if (!updated) return { success: false, error: "Note not found." };
    
    revalidatePath("/");
    revalidatePath("/public");
    revalidatePath("/stats");
    return { success: true };
  } catch (error) {
    console.error("togglePublicAction error:", error);
    return { success: false, error: error.message };
  }
}

// Delete a note
export async function deleteNoteAction(id) {
  try {
    await connectDB();
    const deleted = await Note.findByIdAndDelete(id);
    if (!deleted) return { success: false, error: "Note not found." };

    revalidatePath("/");
    revalidatePath("/public");
    revalidatePath("/stats");
    return { success: true };
  } catch (error) {
    console.error("deleteNoteAction error:", error);
    return { success: false, error: error.message };
  }
}

// Update a note
export async function updateNoteAction(id, prevState, formData) {
  try {
    const title = formData.get("title")?.toString() || "";
    const content = formData.get("content")?.toString() || "";
    const tagsString = formData.get("tags")?.toString() || "";
    const isPinned = formData.get("isPinned") === "on";
    const isPublic = formData.get("isPublic") === "on";

    if (!title.trim() || !content.trim()) {
      return { success: false, error: "Title and content are required." };
    }

    const tags = tagsString
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    await connectDB();
    const note = await Note.findById(id);
    if (!note) {
      return { success: false, error: "Note not found." };
    }

    note.title = title.trim();
    note.content = content.trim();
    note.tags = tags;
    note.isPinned = isPinned;
    note.isPublic = isPublic;

    await note.save();

    revalidatePath("/");
    revalidatePath(`/notes/${id}`);
    revalidatePath("/public");
    revalidatePath("/stats");

    return { success: true, message: "Note updated successfully." };
  } catch (error) {
    console.error("updateNoteAction error:", error);
    return { success: false, error: error.message };
  }
}
