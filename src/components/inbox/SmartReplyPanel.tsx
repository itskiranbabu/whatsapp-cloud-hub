import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Loader2, 
  RefreshCw,
  MessageSquare,
  Heart,
  Briefcase,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SmartReplySuggestion {
  text: string;
  tone: "formal" | "friendly" | "empathetic";
  label: string;
}

interface SmartReplyPanelProps {
  customerMessage: string | null;
  conversationHistory: Array<{ direction: string; content: string | null }>;
  contactName: string | null;
  onSelectReply: (text: string) => void;
  isVisible: boolean;
}

const toneIcons = {
  formal: Briefcase,
  friendly: MessageSquare,
  empathetic: Heart,
};

const toneColors = {
  formal: "bg-blue-500/10 text-blue-600 border-blue-200",
  friendly: "bg-green-500/10 text-green-600 border-green-200",
  empathetic: "bg-purple-500/10 text-purple-600 border-purple-200",
};

export const SmartReplyPanel = ({
  customerMessage,
  conversationHistory,
  contactName,
  onSelectReply,
  isVisible,
}: SmartReplyPanelProps) => {
  const [suggestions, setSuggestions] = useState<SmartReplySuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [hasGenerated, setHasGenerated] = useState(false);
  const { toast } = useToast();

  const generateSuggestions = async () => {
    if (!customerMessage) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-smart-reply", {
        body: {
          customerMessage,
          conversationHistory: conversationHistory.slice(-10),
          contactName,
        },
      });

      if (error) throw error;
      
      if (data?.suggestions && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
        setHasGenerated(true);
      }
    } catch (error: any) {
      console.error("Failed to generate smart replies:", error);
      toast({
        title: "Failed to generate suggestions",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectReply = (text: string) => {
    onSelectReply(text);
    toast({
      title: "Reply selected",
      description: "The suggested reply has been added to your message",
    });
  };

  if (!isVisible || !customerMessage) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="border-t border-border bg-muted/30"
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">AI Smart Replies</span>
          <Badge variant="secondary" className="text-xs">Beta</Badge>
        </div>
        <div className="flex items-center gap-2">
          {!hasGenerated && !isLoading && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                generateSuggestions();
              }}
              className="text-xs gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate
            </Button>
          )}
          {hasGenerated && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                generateSuggestions();
              }}
              disabled={isLoading}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          )}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground mr-2" />
                  <span className="text-sm text-muted-foreground">Generating suggestions...</span>
                </div>
              ) : suggestions.length > 0 ? (
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => {
                    const ToneIcon = toneIcons[suggestion.tone] || MessageSquare;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group p-3 rounded-lg border border-border bg-background hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
                        onClick={() => handleSelectReply(suggestion.text)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${toneColors[suggestion.tone]}`}>
                            <ToneIcon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-muted-foreground">{suggestion.label}</span>
                              <Badge variant="outline" className="text-xs capitalize">
                                {suggestion.tone}
                              </Badge>
                            </div>
                            <p className="text-sm text-foreground line-clamp-2 group-hover:line-clamp-none transition-all">
                              {suggestion.text}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Sparkles className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click "Generate" to get AI-powered reply suggestions
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on conversation context and customer message
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
