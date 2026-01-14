import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Type, Sun, Minus, Plus, AlignLeft, AlignCenter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface DyslexiaReaderProps {
  onBack: () => void;
}

const sampleText = `The quick brown fox jumps over the lazy dog. This sample text demonstrates how the dyslexia-friendly settings can help improve readability.

Reading can be challenging for people with dyslexia, but research shows that certain fonts, spacing, and color combinations can significantly improve comprehension and reduce reading fatigue.

Try adjusting the settings on the right to find what works best for you. You can change the font size, line spacing, letter spacing, and background color to create your optimal reading experience.

Remember, everyone's needs are different. What works for one person may not work for another. Take your time to experiment with the different options.`;

const backgroundColors = [
  { name: "Cream", value: "bg-[hsl(40,33%,96%)]", text: "text-foreground" },
  { name: "Soft Yellow", value: "bg-[hsl(50,70%,90%)]", text: "text-foreground" },
  { name: "Soft Blue", value: "bg-[hsl(200,50%,92%)]", text: "text-foreground" },
  { name: "Soft Green", value: "bg-[hsl(120,30%,90%)]", text: "text-foreground" },
  { name: "Soft Pink", value: "bg-[hsl(350,50%,92%)]", text: "text-foreground" },
];

export function DyslexiaReader({ onBack }: DyslexiaReaderProps) {
  const [text, setText] = useState(sampleText);
  const [fontSize, setFontSize] = useState(18);
  const [lineSpacing, setLineSpacing] = useState(2);
  const [letterSpacing, setLetterSpacing] = useState(0.05);
  const [selectedBg, setSelectedBg] = useState(0);
  const [useDyslexicFont, setUseDyslexicFont] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-background px-4 py-8"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dyslexia-Friendly Reader</h1>
            <p className="text-muted-foreground">Customize text for optimal readability</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Reader Area */}
          <div className="lg:col-span-2">
            <div
              className={cn(
                "min-h-[500px] rounded-2xl border-2 border-border p-8 shadow-soft transition-all duration-300",
                backgroundColors[selectedBg].value,
                backgroundColors[selectedBg].text
              )}
            >
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className={cn(
                  "w-full resize-none border-none bg-transparent focus:outline-none focus:ring-0",
                  useDyslexicFont && "font-dyslexic"
                )}
                style={{
                  fontSize: `${fontSize}px`,
                  lineHeight: lineSpacing,
                  letterSpacing: `${letterSpacing}em`,
                  minHeight: "400px",
                }}
                placeholder="Paste or type your text here..."
              />
            </div>
          </div>

          {/* Settings Panel */}
          <div className="space-y-6 rounded-2xl border-2 border-border bg-card p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-foreground">Reading Settings</h2>

            {/* Font Toggle */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Type className="h-4 w-4" />
                Dyslexia-Friendly Font
              </label>
              <Button
                variant={useDyslexicFont ? "default" : "outline"}
                className="w-full"
                onClick={() => setUseDyslexicFont(!useDyslexicFont)}
              >
                {useDyslexicFont ? "Enabled" : "Disabled"}
              </Button>
            </div>

            {/* Font Size */}
            <div className="space-y-3">
              <label className="flex items-center justify-between text-sm font-medium text-foreground">
                <span className="flex items-center gap-2">
                  <AlignLeft className="h-4 w-4" />
                  Font Size
                </span>
                <span className="text-muted-foreground">{fontSize}px</span>
              </label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Slider
                  value={[fontSize]}
                  onValueChange={([val]) => setFontSize(val)}
                  min={12}
                  max={32}
                  step={1}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setFontSize(Math.min(32, fontSize + 2))}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Line Spacing */}
            <div className="space-y-3">
              <label className="flex items-center justify-between text-sm font-medium text-foreground">
                <span className="flex items-center gap-2">
                  <AlignCenter className="h-4 w-4" />
                  Line Spacing
                </span>
                <span className="text-muted-foreground">{lineSpacing.toFixed(1)}</span>
              </label>
              <Slider
                value={[lineSpacing]}
                onValueChange={([val]) => setLineSpacing(val)}
                min={1.2}
                max={3}
                step={0.1}
              />
            </div>

            {/* Letter Spacing */}
            <div className="space-y-3">
              <label className="flex items-center justify-between text-sm font-medium text-foreground">
                <span>Letter Spacing</span>
                <span className="text-muted-foreground">{letterSpacing.toFixed(2)}em</span>
              </label>
              <Slider
                value={[letterSpacing]}
                onValueChange={([val]) => setLetterSpacing(val)}
                min={0}
                max={0.2}
                step={0.01}
              />
            </div>

            {/* Background Color */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Sun className="h-4 w-4" />
                Background Color
              </label>
              <div className="grid grid-cols-5 gap-2">
                {backgroundColors.map((color, index) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedBg(index)}
                    className={cn(
                      "h-10 w-full rounded-lg border-2 transition-all",
                      color.value,
                      selectedBg === index
                        ? "border-primary ring-2 ring-primary ring-offset-2"
                        : "border-border hover:border-muted-foreground"
                    )}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setFontSize(18);
                setLineSpacing(2);
                setLetterSpacing(0.05);
                setSelectedBg(0);
                setUseDyslexicFont(true);
              }}
            >
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
