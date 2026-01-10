import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  History,
  Smile,
  Flame,
  Feather,
  Zap,
  MousePointer,
  MessageSquare,
  Loader2,
} from "lucide-react";

interface AITemplateGeneratorProps {
  onGenerate: (template: { body: string; buttons?: Array<{ type: string; text: string; url?: string }> }) => void;
}

const messageStyles = [
  { id: "normal", label: "Normal", icon: Smile, description: "Clear and professional" },
  { id: "poetic", label: "Poetic", icon: Feather, description: "Elegant and artistic" },
  { id: "exciting", label: "Exciting", icon: Flame, description: "Energetic and enthusiastic" },
  { id: "funny", label: "Funny", icon: Smile, description: "Playful and humorous" },
];

const optimizationOptions = [
  { id: "click", label: "Click Rate", icon: MousePointer, description: "Optimized for CTA clicks" },
  { id: "reply", label: "Reply Rate", icon: MessageSquare, description: "Encourages responses" },
];

const previousPrompts = [
  "Create a promotional message for a 20% discount on electronics",
  "Welcome message for new subscribers with onboarding steps",
  "Reminder for upcoming webinar registration",
  "Thank you message after purchase with tracking info",
];

export const AITemplateGenerator = ({ onGenerate }: AITemplateGeneratorProps) => {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("normal");
  const [selectedOptimization, setSelectedOptimization] = useState("click");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreviousPrompts, setShowPreviousPrompts] = useState(false);
  const [generationsLeft] = useState(3);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation (in production, this would call an AI API)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a template based on the prompt and style
    const generatedBody = generateTemplate(prompt, selectedStyle);
    
    onGenerate({
      body: generatedBody,
      buttons: [{ type: "URL", text: "Learn More", url: "https://example.com" }],
    });
    
    setIsGenerating(false);
  };

  const generateTemplate = (userPrompt: string, style: string): string => {
    // This is a simplified template generation logic
    // In production, this would be handled by an AI model
    const baseTemplates: Record<string, string> = {
      normal: `Hi {{1}},\n\n${userPrompt}\n\nWe're here to help you get the most out of our services.\n\nBest regards,\nYour Business`,
      poetic: `Dear {{1}},\n\n✨ ${userPrompt} ✨\n\nLike stars that guide the way,\nWe're here to brighten your day.\n\nWarmly yours`,
      exciting: `Hey {{1}}! 🎉🔥\n\n${userPrompt.toUpperCase()}!\n\n⚡ Don't miss out!\n🚀 Limited time only!\n💥 Act NOW!\n\nLet's GO! 🙌`,
      funny: `Yo {{1}}! 👋😄\n\n${userPrompt}\n\nNo joke - this is the real deal! 🎭\n\nP.S. Our team mascot says hi 🐱`,
    };
    
    return baseTemplates[style] || baseTemplates.normal;
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Generate with AI</h3>
            <p className="text-sm text-muted-foreground">Create customized variations with AI</p>
          </div>
        </div>

        {/* Prompt Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Write your prompt*</label>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={() => setShowPreviousPrompts(!showPreviousPrompts)}
            >
              <History className="w-3.5 h-3.5" />
              Previous prompts
            </Button>
          </div>
          
          {showPreviousPrompts && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-2 pb-2"
            >
              {previousPrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPrompt(p);
                    setShowPreviousPrompts(false);
                  }}
                  className="w-full text-left text-sm p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  {p}
                </button>
              ))}
            </motion.div>
          )}
          
          <Textarea
            placeholder="e.g. Please generate a promotional message to give a discount of 20% on our product line."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <div className="text-right text-xs text-muted-foreground">
            {prompt.length}/1024
          </div>
        </div>

        {/* Message Style */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Choose your message style:</label>
          <div className="flex flex-wrap gap-2">
            {messageStyles.map((style) => (
              <Button
                key={style.id}
                variant={selectedStyle === style.id ? "default" : "outline"}
                size="sm"
                className="gap-2"
                onClick={() => setSelectedStyle(style.id)}
              >
                <style.icon className="w-3.5 h-3.5" />
                {style.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Optimization */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Optimize your message for:</label>
          <div className="flex gap-2">
            {optimizationOptions.map((opt) => (
              <Button
                key={opt.id}
                variant={selectedOptimization === opt.id ? "default" : "outline"}
                size="sm"
                className="gap-2"
                onClick={() => setSelectedOptimization(opt.id)}
              >
                <opt.icon className="w-3.5 h-3.5" />
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          className="w-full btn-whatsapp gap-2"
          disabled={!prompt.trim() || isGenerating}
          onClick={handleGenerate}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate ({generationsLeft} free generations left)
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
