import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, BookOpen, Hand, Heart } from "lucide-react";
import { Hero } from "@/components/Hero";
import { FeatureCard } from "@/components/FeatureCard";
import { VoiceToText } from "@/components/VoiceToText";
import { DyslexiaReader } from "@/components/DyslexiaReader";
import { SignLanguageRecognition } from "@/components/SignLanguageRecognition";

type ActiveTool = "home" | "voice" | "dyslexia" | "sign";

const Index = () => {
  const [activeTool, setActiveTool] = useState<ActiveTool>("home");

  const renderActiveTool = () => {
    switch (activeTool) {
      case "voice":
        return <VoiceToText onBack={() => setActiveTool("home")} />;
      case "dyslexia":
        return <DyslexiaReader onBack={() => setActiveTool("home")} />;
      case "sign":
        return <SignLanguageRecognition onBack={() => setActiveTool("home")} />;
      default:
        return null;
    }
  };

  if (activeTool !== "home") {
    return (
      <AnimatePresence mode="wait">
        {renderActiveTool()}
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Hero />

      {/* Tools Section */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Choose Your Tool
            </h2>
            <p className="text-muted-foreground">
              Select an accessibility tool to get started
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <FeatureCard
                icon={<Mic className="h-7 w-7" />}
                title="Voice to Text"
                description="Convert speech to text in real-time. Perfect for exams, lectures, and note-taking."
                color="teal"
                onClick={() => setActiveTool("voice")}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <FeatureCard
                icon={<BookOpen className="h-7 w-7" />}
                title="Dyslexia Reader"
                description="Customize text with dyslexia-friendly fonts, colors, and spacing for easier reading."
                color="coral"
                onClick={() => setActiveTool("dyslexia")}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <FeatureCard
                icon={<Hand className="h-7 w-7" />}
                title="Sign Language"
                description="Real-time sign language recognition using your camera. Supports ASL translation."
                color="teal"
                onClick={() => setActiveTool("sign")}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 py-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="flex items-center justify-center gap-2 text-muted-foreground">
            Made with <Heart className="h-4 w-4 text-accent" /> for accessibility
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
