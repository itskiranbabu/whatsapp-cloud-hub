import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Send, 
  FileText, 
  Users, 
  Bot, 
  Upload, 
  Settings,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  {
    icon: Send,
    label: "Send Broadcast",
    description: "Send messages to multiple contacts",
    path: "/campaigns/new",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: FileText,
    label: "Create Template",
    description: "Design a new message template",
    path: "/templates/new",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: Users,
    label: "Import Contacts",
    description: "Upload your contact list",
    path: "/contacts/import",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    icon: Bot,
    label: "Build Chatbot",
    description: "Create automated responses",
    path: "/automation/new",
    color: "bg-amber-500/10 text-amber-600",
  },
];

export const QuickActions = () => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <Zap className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <p className="text-sm text-muted-foreground">Get started quickly</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={action.path}
              className="flex flex-col items-center p-4 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-primary/30 transition-all duration-200 text-center group"
            >
              <div className={`p-3 rounded-xl ${action.color} mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-5 h-5" />
              </div>
              <p className="font-medium text-sm text-foreground">{action.label}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {action.description}
              </p>
            </Link>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};
