import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

// Landmark indices
const WRIST = 0;
const THUMB_CMC = 1;
const THUMB_MCP = 2;
const THUMB_IP = 3;
const THUMB_TIP = 4;
const INDEX_MCP = 5;
const INDEX_PIP = 6;
const INDEX_DIP = 7;
const INDEX_TIP = 8;
const MIDDLE_MCP = 9;
const MIDDLE_PIP = 10;
const MIDDLE_DIP = 11;
const MIDDLE_TIP = 12;
const RING_MCP = 13;
const RING_PIP = 14;
const RING_DIP = 15;
const RING_TIP = 16;
const PINKY_MCP = 17;
const PINKY_PIP = 18;
const PINKY_DIP = 19;
const PINKY_TIP = 20;

function isFingerExtended(landmarks: NormalizedLandmark[], tip: number, pip: number, mcp: number): boolean {
  return landmarks[tip].y < landmarks[pip].y && landmarks[pip].y < landmarks[mcp].y;
}

function isFingerCurled(landmarks: NormalizedLandmark[], tip: number, pip: number): boolean {
  return landmarks[tip].y > landmarks[pip].y;
}

function isThumbExtended(landmarks: NormalizedLandmark[]): boolean {
  return landmarks[THUMB_TIP].y < landmarks[THUMB_IP].y;
}

function isThumbExtendedSideways(landmarks: NormalizedLandmark[]): boolean {
  return Math.abs(landmarks[THUMB_TIP].x - landmarks[THUMB_CMC].x) > 0.06;
}

function distance(a: NormalizedLandmark, b: NormalizedLandmark): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function isTipsClose(landmarks: NormalizedLandmark[], tipA: number, tipB: number, threshold = 0.06): boolean {
  return distance(landmarks[tipA], landmarks[tipB]) < threshold;
}

export interface GestureResult {
  name: string;
  emoji: string;
  category: "greeting" | "number" | "response" | "expression" | "letter";
}

export function classifyGesture(landmarks: NormalizedLandmark[]): GestureResult | null {
  if (landmarks.length < 21) return null;

  const indexUp = isFingerExtended(landmarks, INDEX_TIP, INDEX_PIP, INDEX_MCP);
  const middleUp = isFingerExtended(landmarks, MIDDLE_TIP, MIDDLE_PIP, MIDDLE_MCP);
  const ringUp = isFingerExtended(landmarks, RING_TIP, RING_PIP, RING_MCP);
  const pinkyUp = isFingerExtended(landmarks, PINKY_TIP, PINKY_PIP, PINKY_MCP);
  const thumbUp = isThumbExtended(landmarks);
  const thumbSide = isThumbExtendedSideways(landmarks);

  const allFingersUp = indexUp && middleUp && ringUp && pinkyUp;
  const allFingersClosed = !indexUp && !middleUp && !ringUp && !pinkyUp;

  // OK sign — thumb + index tips touching, other fingers up
  if (isTipsClose(landmarks, THUMB_TIP, INDEX_TIP, 0.05) && middleUp && ringUp && pinkyUp) {
    return { name: "OK", emoji: "👌", category: "response" };
  }

  // Open hand = Hello / Wave
  if (allFingersUp && thumbUp) {
    return { name: "Hello", emoji: "👋", category: "greeting" };
  }

  // Thumbs up = Yes
  if (thumbUp && allFingersClosed) {
    return { name: "Thumbs Up", emoji: "👍", category: "response" };
  }

  // Thumbs down — thumb pointing down, fingers closed
  if (!thumbUp && landmarks[THUMB_TIP].y > landmarks[THUMB_CMC].y && allFingersClosed) {
    return { name: "Thumbs Down", emoji: "👎", category: "response" };
  }

  // I Love You — thumb + index + pinky extended, middle + ring closed
  if (thumbSide && indexUp && !middleUp && !ringUp && pinkyUp) {
    return { name: "I Love You", emoji: "🤟", category: "expression" };
  }

  // Rock On / Horns — index + pinky up, middle + ring closed, no thumb
  if (indexUp && !middleUp && !ringUp && pinkyUp && !thumbUp) {
    return { name: "Rock On", emoji: "🤘", category: "expression" };
  }

  // Call Me / Hang Loose — thumb + pinky extended, rest closed
  if (thumbSide && !indexUp && !middleUp && !ringUp && pinkyUp) {
    return { name: "Call Me", emoji: "🤙", category: "expression" };
  }

  // Peace / V — index + middle up, rest closed
  if (indexUp && middleUp && !ringUp && !pinkyUp) {
    return { name: "Peace", emoji: "✌️", category: "expression" };
  }

  // Three — index + middle + ring up
  if (indexUp && middleUp && ringUp && !pinkyUp) {
    return { name: "Three", emoji: "3️⃣", category: "number" };
  }

  // Four — index + middle + ring + pinky up, thumb closed
  if (allFingersUp && !thumbUp) {
    return { name: "Four", emoji: "4️⃣", category: "number" };
  }

  // One / Point — only index up
  if (indexUp && !middleUp && !ringUp && !pinkyUp && !thumbUp) {
    return { name: "One", emoji: "☝️", category: "number" };
  }

  // Two — index + middle up (with thumb, unlike Peace)
  if (indexUp && middleUp && !ringUp && !pinkyUp && thumbUp) {
    return { name: "Two", emoji: "2️⃣", category: "number" };
  }

  // Pinky Promise — only pinky up
  if (!indexUp && !middleUp && !ringUp && pinkyUp && !thumbUp) {
    return { name: "Pinky", emoji: "🤙", category: "expression" };
  }

  // Fist = No / Stop
  if (!thumbUp && allFingersClosed) {
    return { name: "Fist", emoji: "✊", category: "response" };
  }

  // Finger gun — thumb + index extended, rest closed
  if (thumbUp && indexUp && !middleUp && !ringUp && !pinkyUp) {
    return { name: "Finger Gun", emoji: "👉", category: "expression" };
  }

  return null;
}
