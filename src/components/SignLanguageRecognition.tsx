import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Camera, CameraOff, Info, Hand, Loader2, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHandLandmarker } from "@/hooks/useHandLandmarker";
import { classifyGesture, type GestureResult } from "@/lib/gestureClassifier";
import { HandLandmarkCanvas } from "@/components/HandLandmarkCanvas";
import { SignLanguageLibrary } from "@/components/SignLanguageLibrary";
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

type SignTab = "camera" | "library";

interface SignLanguageRecognitionProps {
  onBack: () => void;
}

const commonSigns = [
  { sign: "Hello", emoji: "👋", description: "All fingers extended, open hand", category: "greeting" },
  { sign: "Thumbs Up", emoji: "👍", description: "Thumb up, fingers closed", category: "response" },
  { sign: "Thumbs Down", emoji: "👎", description: "Thumb down, fingers closed", category: "response" },
  { sign: "Fist", emoji: "✊", description: "All fingers closed into a fist", category: "response" },
  { sign: "OK", emoji: "👌", description: "Thumb + index tips touching, others up", category: "response" },
  { sign: "Peace", emoji: "✌️", description: "Index + middle up, rest closed", category: "expression" },
  { sign: "I Love You", emoji: "🤟", description: "Thumb + index + pinky extended", category: "expression" },
  { sign: "Rock On", emoji: "🤘", description: "Index + pinky up, no thumb", category: "expression" },
  { sign: "Call Me", emoji: "🤙", description: "Thumb + pinky extended like a phone", category: "expression" },
  { sign: "Finger Gun", emoji: "👉", description: "Thumb + index extended, rest closed", category: "expression" },
  { sign: "One", emoji: "☝️", description: "Only index finger up", category: "number" },
  { sign: "Two", emoji: "2️⃣", description: "Index + middle up + thumb", category: "number" },
  { sign: "Three", emoji: "3️⃣", description: "Index + middle + ring up", category: "number" },
  { sign: "Four", emoji: "4️⃣", description: "All fingers up, thumb closed", category: "number" },
];

export function SignLanguageRecognition({ onBack }: SignLanguageRecognitionProps) {
  const [activeTab, setActiveTab] = useState<SignTab>("camera");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [detectedSign, setDetectedSign] = useState<GestureResult | null>(null);
  const [currentLandmarks, setCurrentLandmarks] = useState<NormalizedLandmark[][]>([]);
  const [detectionLog, setDetectionLog] = useState<{ gesture: GestureResult; time: string }[]>([]);
  const lastDetectedRef = useRef<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);

  const { initModel, detect, isModelLoading, isModelReady } = useHandLandmarker();

  const runDetectionLoop = useCallback(() => {
    const video = videoRef.current;
    if (!video || !streamRef.current) return;

    const result = detect(video);
    if (result && result.landmarks.length > 0) {
      setCurrentLandmarks(result.landmarks);

      // Classify the first detected hand
      const gesture = classifyGesture(result.landmarks[0]);
      if (gesture) {
        setDetectedSign(gesture);
        // Only log if different from last detection to avoid spam
        if (gesture.name !== lastDetectedRef.current) {
          lastDetectedRef.current = gesture.name;
          setDetectionLog((prev) => {
            const updated = [{ gesture, time: new Date().toLocaleTimeString() }, ...prev];
            return updated.slice(0, 20);
          });
        }
      } else {
        setDetectedSign(null);
        lastDetectedRef.current = null;
      }
    } else {
      setCurrentLandmarks([]);
      setDetectedSign(null);
    }

    animFrameRef.current = requestAnimationFrame(runDetectionLoop);
  }, [detect]);

  const startCamera = async () => {
    try {
      // getUserMedia MUST be called first to preserve user gesture context
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
      setHasPermission(true);

      // Init model after camera is running
      await initModel();
    } catch (error) {
      console.error("Camera access denied:", error);
      setHasPermission(false);
    }
  };

  // Start detection loop once camera is active and model ready
  useEffect(() => {
    if (isCameraActive && isModelReady) {
      animFrameRef.current = requestAnimationFrame(runDetectionLoop);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isCameraActive, isModelReady, runDetectionLoop]);

  const stopCamera = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setDetectedSign(null);
    setCurrentLandmarks([]);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-background px-4 py-8"
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sign Language</h1>
            <p className="text-muted-foreground">Recognition & Library</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mb-6 flex gap-2 rounded-xl bg-muted p-1">
          <button
            onClick={() => setActiveTab("camera")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "camera"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Camera className="h-4 w-4" />
            Live Recognition
          </button>
          <button
            onClick={() => setActiveTab("library")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "library"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Sign Library
          </button>
        </div>

        {activeTab === "camera" ? (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Camera View */}
          <div className="lg:col-span-2">
            <div className="relative aspect-video overflow-hidden rounded-2xl border-2 border-border bg-muted shadow-soft">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`h-full w-full object-cover ${isCameraActive ? '' : 'hidden'}`}
              />
              {isCameraActive && (
                <>
                  <HandLandmarkCanvas
                    landmarks={currentLandmarks}
                    width={640}
                    height={480}
                  />

                  {/* Detection overlay */}
                  <AnimatePresence>
                    {detectedSign && (
                       <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-xl bg-success px-6 py-3 text-success-foreground shadow-medium"
                      >
                        <p className="text-lg font-semibold">{detectedSign.emoji} {detectedSign.name}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Recording indicator */}
                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-card/90 px-3 py-1.5 backdrop-blur-sm">
                    <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-destructive" />
                    <span className="text-sm font-medium text-foreground">Live</span>
                  </div>
                </>
              )}
              {!isCameraActive && (
                <div className="absolute inset-0 flex h-full flex-col items-center justify-center gap-4 p-8">
                  {isModelLoading ? (
                    <>
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                      <p className="text-center text-muted-foreground">
                        Loading AI model...
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="rounded-full bg-muted-foreground/10 p-6">
                        <Camera className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <p className="text-center text-muted-foreground">
                        {hasPermission === false
                          ? "Camera access was denied. Please enable it in your browser settings."
                          : "Enable your camera to start sign language recognition"}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Camera Controls */}
            <div className="mt-4 flex justify-center">
              <Button
                variant={isCameraActive ? "destructive" : "hero"}
                size="lg"
                onClick={isCameraActive ? stopCamera : startCamera}
                className="gap-2"
                disabled={isModelLoading}
              >
                {isModelLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading Model...
                  </>
                ) : isCameraActive ? (
                  <>
                    <CameraOff className="h-5 w-5" />
                    Stop Camera
                  </>
                ) : (
                  <>
                    <Camera className="h-5 w-5" />
                    Start Camera
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Detection Log */}
            <div className="rounded-2xl border-2 border-border bg-card p-6 shadow-soft">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Hand className="h-5 w-5 text-primary" />
                  Recognition Log
                  {detectionLog.length > 0 && (
                    <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {detectionLog.length}
                    </span>
                  )}
                </h2>
                {detectionLog.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => setDetectionLog([])} className="h-7 gap-1 text-xs text-muted-foreground">
                    <Trash2 className="h-3 w-3" /> Clear
                  </Button>
                )}
              </div>
              <div className="min-h-[120px] max-h-[280px] overflow-y-auto rounded-xl bg-muted p-3">
                {detectionLog.length > 0 ? (
                  <ul className="space-y-2">
                    {detectionLog.map((entry, i) => (
                      <motion.li
                        key={`${entry.gesture.name}-${entry.time}-${i}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 rounded-lg bg-card p-2.5 shadow-sm"
                      >
                        <span className="text-xl">{entry.gesture.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{entry.gesture.name}</p>
                          <p className="text-xs text-muted-foreground">{entry.gesture.category}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{entry.time}</span>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">
                    {isCameraActive
                      ? "Show a hand gesture to the camera..."
                      : "Start the camera to begin recognition"}
                  </p>
                )}
              </div>
            </div>

            {/* Common Signs Reference */}
            <div className="rounded-2xl border-2 border-border bg-card p-6 shadow-soft">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <Info className="h-5 w-5 text-primary" />
                Supported Gestures
                <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {commonSigns.length}
                </span>
              </h2>
              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {commonSigns.map((item) => (
                  <div
                    key={item.sign}
                    className="flex items-center gap-3 rounded-lg bg-secondary/50 p-2.5"
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.sign}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        ) : (
          <SignLanguageLibrary />
        )}
      </div>
    </motion.div>
  );
}
