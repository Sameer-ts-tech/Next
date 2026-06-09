import connectDB from "@/lib/db";
import Note from "@/models/Note";
import { BarChart2, Hash, FileText, CheckCircle2, Bookmark, Globe, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic"; // SSR - Force dynamic rendering on every request

async function getStats() {
  try {
    await connectDB();
    const notes = await Note.find({});
    
    const total = notes.length;
    const pinned = notes.filter(n => n.isPinned).length;
    const publicCount = notes.filter(n => n.isPublic).length;
    const privateCount = total - publicCount;

    // Word count calculation
    let totalWords = 0;
    notes.forEach(n => {
      const words = n.content.trim().split(/\s+/).filter(Boolean).length;
      totalWords += words;
    });
    const avgWords = total > 0 ? Math.round(totalWords / total) : 0;

    // Tag counts
    const tagMap = {};
    notes.forEach(n => {
      if (Array.isArray(n.tags)) {
        n.tags.forEach(t => {
          tagMap[t] = (tagMap[t] || 0) + 1;
        });
      }
    });

    const tagsList = Object.entries(tagMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      total,
      pinned,
      publicCount,
      privateCount,
      avgWords,
      tagsList,
    };
  } catch (error) {
    console.error("Failed to generate stats:", error);
    return null;
  }
}

export default async function StatsPage() {
  const stats = await getStats();
  const requestTime = new Date().toLocaleTimeString();

  if (!stats) {
    return (
      <div className="p-8 md:p-12 text-center max-w-xl mx-auto flex flex-col items-center justify-center gap-4">
        <div className="bg-danger/10 border border-danger/20 p-4 rounded-full text-danger mb-2">
          <BarChart2 className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-zinc-200">Database Connection Failed</h3>
        <p className="text-zinc-500 text-sm">
          Failed to load live metrics. Please verify that your MongoDB connection string in `.env.local` is correct and your database is running.
        </p>
      </div>
    );
  }

  // Percentages for indicators
  const pinnedPercent = stats.total > 0 ? Math.round((stats.pinned / stats.total) * 100) : 0;
  const publicPercent = stats.total > 0 ? Math.round((stats.publicCount / stats.total) * 100) : 0;

  return (
    <div className="p-8 md:p-12 max-w-4xl mx-auto flex flex-col gap-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-primary font-bold tracking-widest uppercase">
            <BarChart2 className="w-4 h-4" />
            <span>Server Side Rendering (SSR)</span>
          </div>
          <h1 className="text-4xl font-extrabold text-zinc-100 tracking-tight">
            Database <span className="text-primary">Live Metrics</span>
          </h1>
          <p className="text-zinc-400 text-sm">
            This page runs live aggregation queries on MongoDB on every single request.
          </p>
        </div>

        {/* SSR Timestamp */}
        <div className="glass-panel px-4 py-2.5 rounded-xl border border-zinc-800/80 flex items-center gap-3">
          <div className="bg-primary/10 border border-primary/20 p-2 rounded-lg text-primary">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Request Rendered At</div>
            <div className="text-sm font-semibold text-zinc-200">{requestTime}</div>
          </div>
        </div>
      </div>

      {/* Grid of Main Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-zinc-800/60 flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-500 font-bold uppercase">Total Notes</span>
            <h2 className="text-3xl font-extrabold text-zinc-100 mt-1">{stats.total}</h2>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-primary">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-zinc-800/60 flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-500 font-bold uppercase">Pinned Notes</span>
            <h2 className="text-3xl font-extrabold text-warning mt-1">{stats.pinned}</h2>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-warning">
            <Bookmark className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-zinc-800/60 flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-500 font-bold uppercase">Avg. Word Count</span>
            <h2 className="text-3xl font-extrabold text-zinc-100 mt-1">{stats.avgWords}</h2>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-zinc-400">
            <ArrowRight className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Distribution meters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-zinc-800 flex flex-col gap-6">
          <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-warning" />
            <span>Pin Ratio</span>
          </h3>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Pinned ({stats.pinned})</span>
              <span className="font-bold text-zinc-200">{pinnedPercent}%</span>
            </div>
            <div className="w-full bg-zinc-900 rounded-full h-3 overflow-hidden border border-zinc-800">
              <div
                className="bg-warning h-full rounded-full transition-all duration-500"
                style={{ width: `${pinnedPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-zinc-800 flex flex-col gap-6">
          <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            <span>Public Distribution</span>
          </h3>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Shared Publicly ({stats.publicCount})</span>
              <span className="font-bold text-zinc-200">{publicPercent}%</span>
            </div>
            <div className="w-full bg-zinc-900 rounded-full h-3 overflow-hidden border border-zinc-800">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${publicPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tag Cloud */}
      <div className="glass-panel p-6 rounded-2xl border border-zinc-800">
        <h3 className="text-lg font-bold text-zinc-100 mb-6 flex items-center gap-2">
          <Hash className="w-4 h-4 text-primary" />
          <span>Active Tag Cloud</span>
        </h3>
        {stats.tagsList.length === 0 ? (
          <p className="text-zinc-500 text-sm">No tags created yet. Write tags separated by commas on any note.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {stats.tagsList.map((tag) => (
              <div
                key={tag.name}
                className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl flex items-center gap-2 hover:border-primary/30 transition-all duration-200"
              >
                <span className="text-sm font-semibold text-zinc-200">#{tag.name}</span>
                <span className="text-xs bg-primary-glow border border-primary/20 text-primary px-2 py-0.5 rounded-md font-bold">
                  {tag.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
