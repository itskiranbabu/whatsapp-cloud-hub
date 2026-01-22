import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface GlobalLoadingStateProps {
  message?: string;
}

export const GlobalLoadingState = ({ message = "Loading..." }: GlobalLoadingStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20" />
          <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-primary animate-spin" />
        </div>
        <p className="text-lg font-medium text-foreground">{message}</p>
      </div>
    </motion.div>
  );
};

export const InlineLoadingState = ({ message = "Loading..." }: GlobalLoadingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-muted rounded-lg h-28 w-full" />
    </div>
  );
};

export const SkeletonTable = ({ rows = 5 }: { rows?: number }) => {
  return (
    <div className="space-y-3">
      <div className="animate-pulse bg-muted rounded-lg h-12 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="animate-pulse bg-muted/50 rounded-lg h-14 w-full" />
      ))}
    </div>
  );
};
