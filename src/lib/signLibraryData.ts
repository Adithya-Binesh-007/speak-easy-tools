export interface SignEntry {
  name: string;
  emoji: string;
  category: "greeting" | "response" | "expression" | "number" | "letter" | "question" | "common" | "emotion";
  description: string;
  howTo: string;
  detectable: boolean;
}

export const signLibrary: SignEntry[] = [
  // Detectable gestures
  { name: "Hello", emoji: "👋", category: "greeting", description: "A friendly greeting or wave.", howTo: "Extend all five fingers and wave your open hand.", detectable: true },
  { name: "Thumbs Up", emoji: "👍", category: "response", description: "Means 'yes', 'good', or agreement.", howTo: "Make a fist with thumb pointing upward, other fingers closed.", detectable: true },
  { name: "Thumbs Down", emoji: "👎", category: "response", description: "Means 'no', 'bad', or disagreement.", howTo: "Make a fist with thumb pointing downward.", detectable: true },
  { name: "Fist", emoji: "✊", category: "response", description: "Represents solidarity, strength, or 'stop'.", howTo: "Close all fingers tightly into a fist, thumb over fingers.", detectable: true },
  { name: "OK", emoji: "👌", category: "response", description: "Means 'okay', 'perfect', or 'fine'.", howTo: "Touch thumb and index finger tips together forming a circle, extend other fingers.", detectable: true },
  { name: "Peace", emoji: "✌️", category: "expression", description: "Peace sign or the number two.", howTo: "Extend index and middle fingers in a V shape, close other fingers.", detectable: true },
  { name: "I Love You", emoji: "🤟", category: "expression", description: "Combines I, L, and Y in ASL to mean 'I love you'.", howTo: "Extend thumb, index finger, and pinky. Keep middle and ring fingers closed.", detectable: true },
  { name: "Rock On", emoji: "🤘", category: "expression", description: "Sign of the horns, used in rock culture.", howTo: "Extend index and pinky fingers, keep middle, ring, and thumb closed.", detectable: true },
  { name: "Call Me", emoji: "🤙", category: "expression", description: "Mimics holding a phone, meaning 'call me'.", howTo: "Extend thumb and pinky, curl other three fingers in.", detectable: true },
  { name: "Finger Gun", emoji: "👉", category: "expression", description: "Playful pointing gesture.", howTo: "Extend thumb and index finger like a gun shape, close other fingers.", detectable: true },
  { name: "One", emoji: "☝️", category: "number", description: "The number one or pointing up.", howTo: "Extend only the index finger upward, close all others.", detectable: true },
  { name: "Two", emoji: "2️⃣", category: "number", description: "The number two.", howTo: "Extend index and middle fingers with thumb out, close ring and pinky.", detectable: true },
  { name: "Three", emoji: "3️⃣", category: "number", description: "The number three.", howTo: "Extend index, middle, and ring fingers, close pinky and thumb.", detectable: true },
  { name: "Four", emoji: "4️⃣", category: "number", description: "The number four.", howTo: "Extend all four fingers (no thumb), keep thumb folded across palm.", detectable: true },

  // Non-detectable signs (reference only)
  { name: "Five", emoji: "5️⃣", category: "number", description: "The number five — same as open hand.", howTo: "Spread all five fingers wide apart.", detectable: false },
  { name: "Thank You", emoji: "🙏", category: "common", description: "Express gratitude.", howTo: "Touch your chin or lips with fingertips of flat hand, then move hand forward and down.", detectable: false },
  { name: "Please", emoji: "🤲", category: "common", description: "Used when making a polite request.", howTo: "Place flat hand on chest and move in a circular motion.", detectable: false },
  { name: "Sorry", emoji: "😔", category: "emotion", description: "Express apology or regret.", howTo: "Make a fist and rub it in a circle over your chest.", detectable: false },
  { name: "Help", emoji: "🆘", category: "common", description: "Request for assistance.", howTo: "Place a fist on an open palm and lift both hands upward together.", detectable: false },
  { name: "Yes", emoji: "✅", category: "response", description: "Affirmative response.", howTo: "Make a fist and nod it up and down (like a nodding head).", detectable: false },
  { name: "No", emoji: "❌", category: "response", description: "Negative response.", howTo: "Extend index and middle finger, snap them together with thumb (like closing a mouth).", detectable: false },
  { name: "Good", emoji: "😊", category: "emotion", description: "Something is good or well.", howTo: "Touch lips with fingers of flat hand, then move hand down to palm of other hand.", detectable: false },
  { name: "Bad", emoji: "😞", category: "emotion", description: "Something is bad or wrong.", howTo: "Touch lips with fingers of flat hand, then flip hand over moving downward.", detectable: false },
  { name: "Friend", emoji: "🤝", category: "common", description: "A person you know and like.", howTo: "Hook index fingers together, then reverse the hook.", detectable: false },
  { name: "Family", emoji: "👨‍👩‍👧‍👦", category: "common", description: "A group of related people.", howTo: "Make an 'F' handshape with both hands, move them in a circle in front of you.", detectable: false },
  { name: "Water", emoji: "💧", category: "common", description: "The liquid we drink.", howTo: "Make a 'W' with three fingers and tap your chin twice.", detectable: false },
  { name: "Food", emoji: "🍽️", category: "common", description: "Something to eat.", howTo: "Bring fingers and thumb together (flat O) and tap lips.", detectable: false },
  { name: "Happy", emoji: "😄", category: "emotion", description: "Feeling of joy.", howTo: "Brush both flat hands upward on chest repeatedly.", detectable: false },
  { name: "Sad", emoji: "😢", category: "emotion", description: "Feeling of sorrow.", howTo: "Draw both hands down in front of face with spread fingers.", detectable: false },
  { name: "Love", emoji: "❤️", category: "emotion", description: "Deep affection.", howTo: "Cross both fists over your chest (over your heart).", detectable: false },
  { name: "What", emoji: "❓", category: "question", description: "Asking about something.", howTo: "Hold palms up, shake hands side to side slightly.", detectable: false },
  { name: "Where", emoji: "📍", category: "question", description: "Asking about a place.", howTo: "Point index finger and shake it side to side.", detectable: false },
  { name: "When", emoji: "🕐", category: "question", description: "Asking about time.", howTo: "Circle index finger around the other index finger, then point.", detectable: false },
  { name: "Why", emoji: "🤔", category: "question", description: "Asking for a reason.", howTo: "Touch forehead with middle finger, then bring hand forward changing to a 'Y' shape.", detectable: false },
  { name: "How", emoji: "⚙️", category: "question", description: "Asking about manner or method.", howTo: "Put both fists together, knuckles touching, then roll them forward while opening fingers.", detectable: false },
  { name: "Name", emoji: "🏷️", category: "common", description: "What someone is called.", howTo: "Tap the middle fingers of both H-hands together twice.", detectable: false },
  { name: "Home", emoji: "🏠", category: "common", description: "Where you live.", howTo: "Touch fingertips to chin, then move to cheek area.", detectable: false },
  { name: "School", emoji: "🏫", category: "common", description: "Place of learning.", howTo: "Clap hands twice (teacher clapping for attention).", detectable: false },
  { name: "Work", emoji: "💼", category: "common", description: "Employment or labor.", howTo: "Tap one fist on top of the other fist twice.", detectable: false },
];

export const categories = [
  { id: "all", label: "All", emoji: "📚" },
  { id: "greeting", label: "Greetings", emoji: "👋" },
  { id: "response", label: "Responses", emoji: "👍" },
  { id: "expression", label: "Expressions", emoji: "🤟" },
  { id: "number", label: "Numbers", emoji: "🔢" },
  { id: "common", label: "Common", emoji: "💬" },
  { id: "emotion", label: "Emotions", emoji: "😊" },
  { id: "question", label: "Questions", emoji: "❓" },
] as const;
