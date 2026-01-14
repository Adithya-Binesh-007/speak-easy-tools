import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Copy, Download, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VoiceToTextProps {
  onBack: () => void;
}

export function VoiceToText({ onBack }: VoiceToTextProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setIsSupported(false);
    }
  }, []);

  const startRecording = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript + " ";
        } else {
          interim += result[0].transcript;
        }
      }

      if (final) {
        setTranscript((prev) => prev + final);
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      if (isRecording) {
        recognition.start();
      }
    };

    recognition.start();
    setIsRecording(true);

    (window as any).currentRecognition = recognition;
  }, [isRecording]);

  const stopRecording = useCallback(() => {
    if ((window as any).currentRecognition) {
      (window as any).currentRecognition.stop();
      (window as any).currentRecognition = null;
    }
    setIsRecording(false);
    setInterimTranscript("");
  }, []);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTranscript = () => {
    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcript-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-background px-4 py-8"
    >
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Voice to Text</h1>
            <p className="text-muted-foreground">Perfect for exams and note-taking</p>
          </div>
        </div>

        {!isSupported ? (
          <div className="rounded-2xl border-2 border-destructive/30 bg-destructive/10 p-8 text-center">
            <p className="text-destructive">
              Speech recognition is not supported in your browser. Please try Chrome, Edge, or Safari.
            </p>
          </div>
        ) : (
          <>
            {/* Recording Control */}
            <div className="mb-8 flex flex-col items-center gap-6">
              <div className="relative">
                <Button
                  variant="record"
                  size="iconLg"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={cn(
                    "h-24 w-24 transition-all",
                    isRecording && "animate-pulse-record"
                  )}
                >
                  {isRecording ? (
                    <MicOff className="h-10 w-10" />
                  ) : (
                    <Mic className="h-10 w-10" />
                  )}
                </Button>

                {/* Audio visualization */}
                <AnimatePresence>
                  {isRecording && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute -bottom-8 left-1/2 flex -translate-x-1/2 gap-1"
                    >
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "h-6 w-1.5 rounded-full bg-primary",
                            i === 0 && "animate-wave",
                            i === 1 && "animate-wave-delay-1",
                            i === 2 && "animate-wave-delay-2",
                            i === 3 && "animate-wave-delay-3",
                            i === 4 && "animate-wave-delay-4"
                          )}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <p className="text-center text-muted-foreground">
                {isRecording
                  ? "Listening... Click to stop"
                  : "Click the microphone to start recording"}
              </p>
            </div>

            {/* Transcript Area */}
            <div className="relative min-h-[300px] rounded-2xl border-2 border-border bg-card p-6 shadow-soft">
              {transcript || interimTranscript ? (
                <div className="whitespace-pre-wrap text-lg leading-relaxed text-foreground">
                  {transcript}
                  <span className="text-muted-foreground">{interimTranscript}</span>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  Your transcription will appear here...
                </p>
              )}

              {/* Action buttons */}
              {transcript && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex justify-end gap-3"
                >
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadTranscript}>
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setTranscript("");
                      setInterimTranscript("");
                    }}
                  >
                    Clear
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Tips */}
            <div className="mt-8 rounded-2xl bg-secondary/50 p-6">
              <h3 className="mb-3 font-semibold text-foreground">Tips for best results:</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Speak clearly and at a moderate pace</li>
                <li>• Use a quiet environment when possible</li>
                <li>• Say punctuation like "period" or "comma" for formatting</li>
                <li>• The transcript auto-saves as you speak</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
