import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Note from "@/models/Note";

// GET /api/notes/[id]
// Fetches a single note by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    await connectDB();
    const note = await Note.findById(id);

    if (!note) {
      return NextResponse.json(
        { success: false, error: "Note not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: note },
      { status: 200 }
    );
  } catch (error) {
    console.error(`GET /api/notes/[id] error:`, error);
    return NextResponse.json(
      { success: false, error: "Retrieval failed: " + error.message },
      { status: 500 }
    );
  }
}

// PUT /api/notes/[id]
// Updates a single note by ID (handles partial updates too)
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body provided." },
        { status: 400 }
      );
    }

    await connectDB();
    const note = await Note.findById(id);
    if (!note) {
      return NextResponse.json(
        { success: false, error: "Note not found." },
        { status: 404 }
      );
    }

    // Update fields conditionally
    if (body.title !== undefined) {
      if (typeof body.title !== "string" || !body.title.trim()) {
        return NextResponse.json(
          { success: false, error: "Title must be a valid non-empty string." },
          { status: 400 }
        );
      }
      note.title = body.title.trim();
    }

    if (body.content !== undefined) {
      if (typeof body.content !== "string" || !body.content.trim()) {
        return NextResponse.json(
          { success: false, error: "Content must be a valid non-empty string." },
          { status: 400 }
        );
      }
      note.content = body.content.trim();
    }

    if (body.tags !== undefined) {
      note.tags = Array.isArray(body.tags) ? body.tags.map(t => String(t).trim()) : [];
    }

    if (body.isPinned !== undefined) {
      note.isPinned = Boolean(body.isPinned);
    }

    if (body.isPublic !== undefined) {
      note.isPublic = Boolean(body.isPublic);
    }

    await note.save();

    return NextResponse.json(
      { success: true, data: note },
      { status: 200 }
    );
  } catch (error) {
    console.error(`PUT /api/notes/[id] error:`, error);
    return NextResponse.json(
      { success: false, error: "Update failed: " + error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/notes/[id]
// Deletes a note by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    await connectDB();
    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      return NextResponse.json(
        { success: false, error: "Note not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Note deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error(`DELETE /api/notes/[id] error:`, error);
    return NextResponse.json(
      { success: false, error: "Deletion failed: " + error.message },
      { status: 500 }
    );
  }
}
