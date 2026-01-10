import { cn } from "@/lib/utils";
import { CheckCheck, Image as ImageIcon, Video, FileText, Link2 } from "lucide-react";

interface WhatsAppPhonePreviewProps {
  headerType?: "text" | "image" | "video" | "document" | null;
  headerContent?: string | null;
  body: string;
  footer?: string | null;
  buttons?: Array<{ type: string; text: string; url?: string; phone_number?: string }>;
  variables?: Record<string, string>;
  className?: string;
  recipientName?: string;
  businessName?: string;
}

export const WhatsAppPhonePreview = ({
  headerType,
  headerContent,
  body,
  footer,
  buttons = [],
  variables = {},
  className,
  recipientName = "Customer",
  businessName = "Your Business",
}: WhatsAppPhonePreviewProps) => {
  // Replace template variables with actual values
  const processText = (text: string) => {
    let processed = text;
    // Replace {{1}}, {{2}}, etc. with variable values or placeholders
    processed = processed.replace(/\{\{(\d+)\}\}/g, (_, num) => {
      return variables[num] || `[Variable ${num}]`;
    });
    // Replace named variables like {{name}}
    processed = processed.replace(/\{\{(\w+)\}\}/g, (_, name) => {
      return variables[name] || `[${name}]`;
    });
    return processed;
  };

  // Format body text with WhatsApp formatting
  const formatBody = (text: string) => {
    let formatted = processText(text);
    // Bold: *text*
    formatted = formatted.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
    // Italic: _text_
    formatted = formatted.replace(/_([^_]+)_/g, '<em>$1</em>');
    // Strikethrough: ~text~
    formatted = formatted.replace(/~([^~]+)~/g, '<del>$1</del>');
    // Monospace: ```text```
    formatted = formatted.replace(/```([^`]+)```/g, '<code>$1</code>');
    return formatted;
  };

  const renderHeader = () => {
    if (!headerType || !headerContent) return null;

    switch (headerType) {
      case "image":
        return (
          <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg mb-2 flex items-center justify-center">
            {headerContent.startsWith("http") ? (
              <img src={headerContent} alt="Header" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <div className="text-center">
                <ImageIcon className="w-8 h-8 text-primary/50 mx-auto mb-1" />
                <span className="text-xs text-muted-foreground">Image Header</span>
              </div>
            )}
          </div>
        );
      case "video":
        return (
          <div className="w-full h-32 bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-lg mb-2 flex items-center justify-center">
            <div className="text-center">
              <Video className="w-8 h-8 text-blue-500/50 mx-auto mb-1" />
              <span className="text-xs text-muted-foreground">Video Header</span>
            </div>
          </div>
        );
      case "document":
        return (
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg mb-2">
            <FileText className="w-6 h-6 text-red-500" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{headerContent || "Document"}</p>
              <p className="text-xs text-muted-foreground">PDF</p>
            </div>
          </div>
        );
      case "text":
        return (
          <p className="font-semibold text-foreground mb-1">{processText(headerContent)}</p>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Phone Frame */}
      <div className="relative w-[280px] h-[560px] bg-[#111b21] rounded-[40px] p-3 shadow-2xl">
        {/* Screen */}
        <div className="relative w-full h-full bg-[#0b141a] rounded-[32px] overflow-hidden flex flex-col">
          {/* Status Bar */}
          <div className="flex items-center justify-between px-6 py-2 text-white/70 text-xs">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.5c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10z" />
              </svg>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 7h4v10h-4zm-6-2h4v12h-4zM5 13h4v4H5z" />
              </svg>
              <div className="w-6 h-3 border border-white/50 rounded-sm relative">
                <div className="absolute inset-0.5 bg-white/70 rounded-sm" style={{ width: '75%' }} />
              </div>
            </div>
          </div>

          {/* Chat Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-[#202c33]">
            <div className="w-2 h-2" />
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {businessName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">{businessName}</p>
              <p className="text-white/50 text-xs">online</p>
            </div>
          </div>

          {/* Chat Background */}
          <div 
            className="flex-1 p-3 overflow-y-auto"
            style={{
              backgroundColor: "#0b141a",
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          >
            {/* Message Bubble */}
            <div className="max-w-[90%] ml-auto">
              <div className="bg-[#005c4b] rounded-lg rounded-tr-none p-3 shadow-sm">
                {renderHeader()}
                
                <p 
                  className="text-white text-sm leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: formatBody(body) || "Your message preview will appear here..." }}
                />
                
                {footer && (
                  <p className="text-white/60 text-xs mt-2">{processText(footer)}</p>
                )}

                {/* Timestamp */}
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-white/50 text-[10px]">9:41 AM</span>
                  <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                </div>
              </div>

              {/* Buttons */}
              {buttons && buttons.length > 0 && (
                <div className="mt-1 space-y-1">
                  {buttons.map((button, index) => (
                    <div
                      key={index}
                      className="bg-[#005c4b] rounded-lg p-2.5 text-center cursor-pointer hover:bg-[#006d5b] transition-colors"
                    >
                      <div className="flex items-center justify-center gap-2">
                        {button.type === "URL" && <Link2 className="w-3.5 h-3.5 text-[#53bdeb]" />}
                        <span className="text-[#53bdeb] text-sm font-medium">{button.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-2 bg-[#202c33]">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#2a3942] rounded-full px-4 py-2">
                <span className="text-white/30 text-sm">Message</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#111b21] rounded-b-2xl" />
      </div>

      {/* Phone Label */}
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">Live Preview</p>
        <p className="text-xs text-muted-foreground/70">This is how your message will appear</p>
      </div>
    </div>
  );
};
