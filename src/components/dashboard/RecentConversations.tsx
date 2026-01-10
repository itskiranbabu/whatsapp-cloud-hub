import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useConversations } from "@/hooks/useConversations";
import { formatDistanceToNow } from "date-fns";

export const RecentConversations = () => {
  const { conversations, isLoading } = useConversations();
  const navigate = useNavigate();

  const items = conversations.slice(0, 6);

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Recent Conversations</CardTitle>
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Loading…" : "Your latest customer chats"}
            </p>
          </div>
        </div>
        <Link
          to="/inbox"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View all
          <ArrowRight className="w-4 h-4" />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {items.length === 0 && !isLoading ? (
            <div className="p-6 text-sm text-muted-foreground">No conversations yet.</div>
          ) : (
            items.map((conversation, index) => {
              const name = conversation.contact?.name || conversation.contact?.phone || "Unknown";
              const lastAt = conversation.last_message_at || conversation.created_at;
              const time = lastAt
                ? formatDistanceToNow(new Date(lastAt), { addSuffix: true })
                : "";

              return (
                <motion.button
                  key={conversation.id}
                  type="button"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate("/inbox", { state: { conversationId: conversation.id } })}
                  className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="relative">
                    <Avatar className="w-11 h-11">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`}
                        alt={`${name} avatar`}
                      />
                      <AvatarFallback>{name[0]?.toUpperCase?.() ?? "U"}</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card bg-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground truncate">{name}</p>
                      <span className="text-xs text-muted-foreground">{time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-0.5">
                      {conversation.status ? `Status: ${conversation.status}` : ""}
                    </p>
                  </div>

                  {(conversation.unread_count ?? 0) > 0 && (
                    <Badge className="bg-primary text-primary-foreground h-5 min-w-5 justify-center">
                      {conversation.unread_count}
                    </Badge>
                  )}
                </motion.button>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};
