import connectDB from "@/lib/db";
import Note from "@/models/Note";
import DashboardContainer from "@/components/DashboardContainer";
import QuickForm from "@/components/QuickForm";
import { Sparkles, Terminal } from "lucide-react";

export const metadata = {
  title: "Dashboard | Emerald Notes",
  description: "Next.js concept notes app dashboard.",
};

async function getNotes() {
  try {
    await connectDB();
    // Fetch notes sorted by pinned status first, then by creation date (newest first)
    // Convert Mongoose documents into plain JS objects to avoid hydration warnings
    const docs = await Note.find({}).sort({ isPinned: -1, createdAt: -1 });
    return JSON.parse(JSON.stringify(docs));
  } catch (error) {
    console.error("Failed to load notes in Page:", error);
    return null;
  }
}

export default async function DashboardPage() {
  const notes = await getNotes();

  // If DB connection fails, show a helpful setup guide instead of throwing a generic error
  if (notes === null) {
    return (
      <div className="p-8 md:p-12 max-w-xl mx-auto flex flex-col gap-6 items-center text-center justify-center min-h-[80vh] animate-fade-in">
        <div className="bg-warning-glow border border-warning/30 p-4 rounded-3xl text-warning">
          <Terminal className="w-10 h-10" />
        </div>
        <div className="flex flex-col gap-2 select-none">
          <h1 className="text-2xl font-bold text-zinc-100">MongoDB Connection Required</h1>
          <p className="text-zinc-400 text-sm max-w-sm leading-relaxed">
            We couldn't connect to your MongoDB database. Please configure your connection string inside the environment file.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl w-full text-left font-mono text-xs text-zinc-400 flex flex-col gap-2.5 border border-zinc-800">
          <p className="font-bold text-zinc-300">Quick Setup Instructions:</p>
          <ol className="list-decimal pl-4 flex flex-col gap-1.5">
            <li>Open the file [notes/.env.local](file:///c:/Users/Sameer/OneDrive/Desktop/Next-Notes/notes/.env.local)</li>
            <li>Ensure `MONGODB_URI` points to a running instance (local or MongoDB Atlas)</li>
            <li>Restart your development server (`pnpm dev`)</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 w-full flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col gap-1 border-b border-zinc-800 pb-6 select-none">
        <h1 className="text-4xl font-extrabold text-zinc-100 tracking-tight flex items-center gap-2">
          Notes <span className="text-primary">Dashboard</span>
        </h1>
        <p className="text-zinc-500 text-sm">
          A note-taking interface showcasing layouts, dynamic rendering, and React server actions.
        </p>
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Side: Note List with Live Search/Filter */}
        <div className="w-full lg:w-2/3 order-2 lg:order-1">
          {notes.length === 0 ? (
            <div className="glass-panel p-16 rounded-3xl border border-zinc-800 flex flex-col items-center justify-center text-center gap-3">
              <Sparkles className="w-12 h-12 text-primary animate-pulse" />
              <h3 className="text-xl font-bold text-zinc-300">Welcome to Emerald Notes!</h3>
              <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
                Your board is currently empty. Use the quick draft form on the right to save your first note to MongoDB.
              </p>
            </div>
          ) : (
            <DashboardContainer initialNotes={notes} />
          )}
        </div>

        {/* Right Side: Sticky Quick Form */}
        <div className="w-full lg:w-1/3 order-1 lg:order-2 lg:sticky lg:top-8 flex flex-col gap-4">
          <QuickForm />
        </div>
      </div>
    </div>
  );
}
