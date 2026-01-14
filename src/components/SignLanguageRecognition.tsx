import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Camera, CameraOff, Info, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SignLanguageRecognitionProps {
  onBack: () => void;
}

const commonSigns = [
  { sign: "Hello", description: "Wave your open hand" },
  { sign: "Thank You", description: "Touch chin and move hand forward" },
  { sign: "Please", description: "Circular motion on chest with open palm" },
  { sign: "Yes", description: "Fist nodding up and down" },
  { sign: "No", description: "Index and middle finger together, snap to thumb" },
  { sign: "Help", description: "Fist on open palm, lift both up" },
];

export function SignLanguageRecognition({ onBack }: SignLanguageRecognitionProps) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [detectedSign, setDetectedSign] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
      setHasPermission(true);

      // Simulate sign detection (in production, this would use ML model)
      simulateDetection();
    } catch (error) {
      console.error("Camera access denied:", error);
      setHasPermission(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setDetectedSign(null);
  };

  const simulateDetection = () => {
    // Simulate random sign detection for demo purposes
    const detectInterval = setInterval(() => {
      if (!streamRef.current) {
        clearInterval(detectInterval);
        return;
      }
      
      // Randomly detect a sign (20% chance every 2 seconds)
      if (Math.random() > 0.8) {
        const randomSign = commonSigns[Math.floor(Math.random() * commonSigns.length)];
        setDetectedSign(randomSign.sign);
        setTimeout(() => setDetectedSign(null), 2000);
      }
    }, 2000);
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
            <p className="text-muted-foreground">Real-time ASL translation using AI</p>
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
                  <div className="rounded-full bg-muted-foreground/10 p-6">
                    <Camera className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-center text-muted-foreground">
                    {hasPermission === false
                      ? "Camera access was denied. Please enable it in your browser settings."
                      : "Enable your camera to start sign language recognition"}
                  </p>
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
              >
                {isCameraActive ? (
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
              <div className="min-h-[120px] rounded-xl bg-muted p-4">
                {detectedSign ? (
                  <p className="text-foreground">
                    Detected: <strong>{detectedSign}</strong>
                  </p>
                ) : (
                  <p className="text-muted-foreground">
                    {isCameraActive
                      ? "Waiting for signs..."
                      : "Start the camera to begin recognition"}
                  </p>
                )}
              </div>
            </div>

            {/* Common Signs Reference */}
            <div className="rounded-2xl border-2 border-border bg-card p-6 shadow-soft">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <Info className="h-5 w-5 text-primary" />
                Common Signs (ASL)
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

            {/* Note about demo */}
            <div className="rounded-2xl bg-accent/10 p-4">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> This is a demonstration interface. Full AI-powered sign 
                language recognition requires connecting to a machine learning model. 
                Currently showing simulated detections.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
