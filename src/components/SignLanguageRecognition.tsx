import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Camera, CameraOff, Info, Hand, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHandLandmarker } from "@/hooks/useHandLandmarker";
import { classifyGesture } from "@/lib/gestureClassifier";
import { HandLandmarkCanvas } from "@/components/HandLandmarkCanvas";
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

interface SignLanguageRecognitionProps {
  onBack: () => void;
}

const commonSigns = [
  { sign: "Hello", description: "Wave your open hand (all fingers extended)" },
  { sign: "Yes", description: "Thumbs up (thumb up, fingers closed)" },
  { sign: "No", description: "Closed fist (all fingers closed)" },
  { sign: "Peace", description: "Index + middle finger up, rest closed" },
  { sign: "One", description: "Only index finger pointing up" },
  { sign: "I Love You", description: "Thumb + pinky extended, rest closed" },
  { sign: "Call Me", description: "Thumb + pinky extended like a phone" },
];

export function SignLanguageRecognition({ onBack }: SignLanguageRecognitionProps) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [detectedSign, setDetectedSign] = useState<string | null>(null);
  const [currentLandmarks, setCurrentLandmarks] = useState<NormalizedLandmark[][]>([]);
  const [detectionLog, setDetectionLog] = useState<string[]>([]);
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
        setDetectionLog((prev) => {
          const updated = [`${gesture} — ${new Date().toLocaleTimeString()}`, ...prev];
          return updated.slice(0, 10); // keep last 10
        });
      } else {
        setDetectedSign(null);
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
            <h1 className="text-2xl font-bold text-foreground">Sign Language Recognition</h1>
            <p className="text-muted-foreground">Real-time hand detection powered by MediaPipe</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Camera View */}
          <div className="lg:col-span-2">
            <div className="relative aspect-video overflow-hidden rounded-2xl border-2 border-border bg-muted shadow-soft">
              {isCameraActive ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full object-cover"
                  />
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
                        <p className="text-lg font-semibold">Detected: {detectedSign}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Recording indicator */}
                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-card/90 px-3 py-1.5 backdrop-blur-sm">
                    <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-destructive" />
                    <span className="text-sm font-medium text-foreground">Live</span>
                  </div>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
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
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <Hand className="h-5 w-5 text-primary" />
                Recognition Log
              </h2>
              <div className="min-h-[120px] max-h-[200px] overflow-y-auto rounded-xl bg-muted p-4">
                {detectionLog.length > 0 ? (
                  <ul className="space-y-1 text-sm">
                    {detectionLog.map((entry, i) => (
                      <li key={i} className="text-foreground">
                        {entry}
                      </li>
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
              </h2>
              <div className="space-y-3">
                {commonSigns.map((item) => (
                  <div
                    key={item.sign}
                    className="rounded-lg bg-secondary/50 p-3"
                  >
                    <p className="font-medium text-foreground">{item.sign}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
