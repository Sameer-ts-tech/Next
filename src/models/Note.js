import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title for this note."],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters."],
    },
    content: {
      type: String,
      required: [true, "Please provide content for this note."],
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose from compiling the model multiple times during development hot-reloads
const Note = mongoose.models.Note || mongoose.model("Note", NoteSchema);

export default Note;
