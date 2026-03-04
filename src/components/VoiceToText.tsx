import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Mic,
  MicOff,
  Copy,
  Download,
  ArrowLeft,
  Check,
  Search,
} from "lucide-react";
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

  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef("");
  const lastFinalRef = useRef("");

  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      setIsSupported(false);
    }
  }, []);

  const startRecording = () => {
    if (isRecording) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

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
        const transcriptPiece = result[0].transcript.trim();

        if (result.isFinal) {
          // 🔥 Android duplicate prevention
          if (transcriptPiece !== lastFinalRef.current) {
            final += transcriptPiece + " ";
            lastFinalRef.current = transcriptPiece;
          }
        } else {
          interim += transcriptPiece;
        }
      }

      if (final) {
        finalTranscriptRef.current += final;
        setTranscript(finalTranscriptRef.current);
      }

      setInterimTranscript(interim);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
    setInterimTranscript("");
  };

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
    a.download = `transcript-${new Date()
      .toISOString()
      .slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const searchTranscript = () => {
    if (!transcript.trim()) return;
    const query = encodeURIComponent(transcript);
    window.open(`https://www.google.com/search?q=${query}`, "_blank");
  };

  const clearTranscript = () => {
    setTranscript("");
    setInterimTranscript("");
    finalTranscriptRef.current = "";
    lastFinalRef.current = "";
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
            <h1 className="text-2xl font-bold text-foreground">
              Voice to Text
            </h1>
            <p className="text-muted-foreground">
              Perfect for exams and note-taking
            </p>
          </div>
        </div>

        {!isSupported ? (
          <p className="text-destructive text-center">
            Speech recognition not supported in this browser.
          </p>
        ) : (
          <>
            {/* Recording Button */}
            <div className="mb-8 flex flex-col items-center gap-6">
              <Button
                variant="record"
                size="iconLg"
                onClick={isRecording ? stopRecording : startRecording}
                className={cn(
                  "h-24 w-24",
                  isRecording && "animate-pulse-record"
                )}
              >
                {isRecording ? (
                  <MicOff className="h-10 w-10" />
                ) : (
                  <Mic className="h-10 w-10" />
                )}
              </Button>

              <p className="text-muted-foreground">
                {isRecording
                  ? "Listening... Tap to stop"
                  : "Tap the microphone to start"}
              </p>
            </div>

            {/* Transcript Box */}
            <div className="min-h-[300px] rounded-2xl border-2 border-border bg-card p-6 shadow-soft">
              {transcript || interimTranscript ? (
                <div className="whitespace-pre-wrap text-lg leading-relaxed text-foreground">
                  {transcript}
                  <span className="text-muted-foreground">
                    {interimTranscript}
                  </span>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  Your transcription will appear here...
                </p>
              )}

              {transcript && (
                <div className="mt-6 flex flex-wrap justify-end gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {copied ? "Copied!" : "Copy"}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadTranscript}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={searchTranscript}
                  >
                    <Search className="h-4 w-4" />
                    Search
                  </Button>

                  <Button variant="ghost" size="sm" onClick={clearTranscript}>
                    Clear
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
