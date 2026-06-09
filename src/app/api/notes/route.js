import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Note from "@/models/Note";

// GET /api/notes
// Fetches all notes, sorted by pinned status (descending) and creation date (descending)
export async function GET() {
  try {
    await connectDB();
    const notes = await Note.find({}).sort({ isPinned: -1, createdAt: -1 });
    return NextResponse.json(
      { success: true, data: notes },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/notes error:", error);
    return NextResponse.json(
      { success: false, error: "Database retrieval failed: " + error.message },
      { status: 500 }
    );
  }
}

// POST /api/notes
// Creates a new note with validation
export async function POST(request) {
  try {
    await connectDB();
    
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body provided." },
        { status: 400 }
      );
    }

    const { title, content, tags, isPinned, isPublic } = body;

    // Server-side validation
    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required and must be a valid string." },
        { status: 400 }
      );
    }

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { success: false, error: "Content is required and must be a valid string." },
        { status: 400 }
      );
    }

    const note = await Note.create({
      title: title.trim(),
      content: content.trim(),
      tags: Array.isArray(tags) ? tags.map(t => String(t).trim()) : [],
      isPinned: Boolean(isPinned),
      isPublic: Boolean(isPublic),
    });

    return NextResponse.json(
      { success: true, data: note },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/notes error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create note: " + error.message },
      { status: 500 }
    );
  }
}
