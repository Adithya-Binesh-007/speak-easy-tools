import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Camera, BookOpen, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { signLibrary, categories, type SignEntry } from "@/lib/signLibraryData";

interface SignLanguageLibraryProps {
  onTrySign?: (signName: string) => void;
}

function SignDetailCard({ sign, onClose }: { sign: SignEntry; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border-2 border-border bg-card p-6 shadow-lg"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{sign.emoji}</span>
            <div>
              <h3 className="text-xl font-bold text-foreground">{sign.name}</h3>
              <Badge variant="secondary" className="mt-1 capitalize">{sign.category}</Badge>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-muted-foreground mb-4">{sign.description}</p>

        <div className="rounded-xl bg-muted p-4">
          <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            How to Sign
          </h4>
          <p className="text-sm text-foreground leading-relaxed">{sign.howTo}</p>
        </div>

        <div className="mt-4 flex items-center gap-2">
          {sign.detectable ? (
            <div className="flex items-center gap-2 text-sm text-primary">
              <Camera className="h-4 w-4" />
              <span>Detectable by camera</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Camera className="h-4 w-4" />
              <span>Reference only — not yet detectable</span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function SignLanguageLibrary({ onTrySign }: SignLanguageLibraryProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedSign, setSelectedSign] = useState<SignEntry | null>(null);

  const filtered = signLibrary.filter((sign) => {
    const matchesSearch =
      sign.name.toLowerCase().includes(search.toLowerCase()) ||
      sign.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || sign.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search signs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/60 text-muted-foreground hover:bg-secondary"
            }`}
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {filtered.length} sign{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* Sign Grid */}
      <div className="grid gap-2 sm:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((sign) => (
            <motion.button
              key={sign.name}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setSelectedSign(sign)}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition-colors hover:bg-accent/50 hover:border-primary/30"
            >
              <span className="text-2xl">{sign.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{sign.name}</p>
                <p className="text-xs text-muted-foreground truncate">{sign.description}</p>
              </div>
              {sign.detectable && (
                <Camera className="h-3.5 w-3.5 text-primary shrink-0" />
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl bg-muted p-8 text-center">
          <p className="text-muted-foreground">No signs found matching "{search}"</p>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedSign && (
          <SignDetailCard sign={selectedSign} onClose={() => setSelectedSign(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
