import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  contactName?: string;
  className?: string;
}

export const TypingIndicator = ({ contactName, className }: TypingIndicatorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={cn("flex items-center gap-2 px-4 py-2", className)}
    >
      <div className="flex items-center gap-1 bg-muted px-4 py-3 rounded-2xl rounded-bl-md">
        <motion.span
          className="w-2 h-2 bg-muted-foreground/60 rounded-full"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
        />
        <motion.span
          className="w-2 h-2 bg-muted-foreground/60 rounded-full"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
        />
        <motion.span
          className="w-2 h-2 bg-muted-foreground/60 rounded-full"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
        />
      </div>
      <span className="text-xs text-muted-foreground">
        {contactName ? `${contactName} is typing...` : "Typing..."}
      </span>
    </motion.div>
  );
};
