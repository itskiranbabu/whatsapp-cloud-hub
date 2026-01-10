import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  TrendingUp,
  LayoutGrid,
  Star,
  ShoppingBag,
  GraduationCap,
  Building2,
  Calendar,
  Heart,
  Gift,
  Megaphone,
  Eye,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import { WhatsAppPhonePreview } from "@/components/whatsapp/WhatsAppPhonePreview";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TemplateGalleryItem {
  id: string;
  name: string;
  category: string;
  headerType?: "text" | "image" | "video" | "document";
  body: string;
  footer?: string;
  badge?: string;
  badgeColor?: string;
  buttons?: Array<{ type: string; text: string; url?: string }>;
}

const galleryTemplates: TemplateGalleryItem[] = [
  {
    id: "1",
    name: "Special Offer",
    category: "ecommerce",
    badge: "SPECIAL OFFER",
    badgeColor: "bg-primary",
    headerType: "image",
    body: "Hi {{1}}, 🎉\n\nWe've got something special just for you!\n\n✨ Get *{{2}}% OFF* on your next purchase.\n\nUse code: *{{3}}*\n\nHurry, offer ends soon! 🛒",
    footer: "Reply STOP to opt out",
    buttons: [{ type: "URL", text: "Shop Now", url: "https://example.com" }],
  },
  {
    id: "2",
    name: "Order Confirmation",
    category: "ecommerce",
    badge: "UTILITY",
    badgeColor: "bg-blue-500",
    body: "Hi {{1}}, ✅\n\nYour order *#{{2}}* has been confirmed!\n\n📦 Items: {{3}}\n💰 Total: ₹{{4}}\n\nWe'll notify you when it ships. Track your order below.",
    footer: "Powered by YourBusiness",
    buttons: [{ type: "URL", text: "Track Order", url: "https://example.com" }],
  },
  {
    id: "3",
    name: "Abandoned Cart",
    category: "ecommerce",
    badge: "MARKETING",
    badgeColor: "bg-purple-500",
    headerType: "image",
    body: "Hey {{1}}! 👋\n\nLooks like you left something in your cart!\n\n🛒 *{{2}}* is waiting for you.\n\nComplete your purchase now and get *{{3}}% OFF*!\n\nUse code: *COMEBACK{{4}}*",
    buttons: [{ type: "URL", text: "Complete Purchase", url: "https://example.com" }],
  },
  {
    id: "4",
    name: "Birthday Wishes",
    category: "promotional",
    badge: "BIRTHDAY",
    badgeColor: "bg-pink-500",
    headerType: "image",
    body: "Happy Birthday, {{1}}! 🎂🎈\n\nWishing you a fantastic year ahead!\n\n🎁 Here's a special gift:\n*{{2}}% OFF* on your birthday order!\n\nCode: *BDAY{{3}}*\n\nValid for 7 days. Enjoy! 🥳",
    buttons: [{ type: "URL", text: "Claim Gift", url: "https://example.com" }],
  },
  {
    id: "5",
    name: "Event Invitation",
    category: "events",
    badge: "EVENT",
    badgeColor: "bg-orange-500",
    headerType: "image",
    body: "Dear {{1}}, 📅\n\nYou're invited to *{{2}}*!\n\n🗓 Date: {{3}}\n⏰ Time: {{4}}\n📍 Venue: {{5}}\n\nWe'd love to see you there!\n\nRSVP below to confirm your spot.",
    buttons: [
      { type: "URL", text: "RSVP Now", url: "https://example.com" },
      { type: "QUICK_REPLY", text: "Maybe Later" },
    ],
  },
  {
    id: "6",
    name: "Feedback Request",
    category: "utility",
    badge: "FEEDBACK",
    badgeColor: "bg-teal-500",
    body: "Hi {{1}}! 👋\n\nThank you for your recent purchase!\n\nWe'd love to hear your feedback about *{{2}}*.\n\n⭐ Your review helps us serve you better.\n\nTap below to share your experience:",
    buttons: [
      { type: "URL", text: "Leave Review", url: "https://example.com" },
    ],
  },
  {
    id: "7",
    name: "Payment Reminder",
    category: "utility",
    badge: "REMINDER",
    badgeColor: "bg-amber-500",
    body: "Hi {{1}}, 📢\n\nThis is a friendly reminder that your payment of *₹{{2}}* for *{{3}}* is due on *{{4}}*.\n\n💳 Click below to make payment:\n\nIgnore if already paid.",
    buttons: [{ type: "URL", text: "Pay Now", url: "https://example.com" }],
  },
  {
    id: "8",
    name: "Course Enrollment",
    category: "education",
    badge: "EDUCATION",
    badgeColor: "bg-indigo-500",
    headerType: "image",
    body: "Hello {{1}}! 📚\n\nCongratulations on enrolling in *{{2}}*!\n\n📅 Start Date: {{3}}\n👨‍🏫 Instructor: {{4}}\n⏱ Duration: {{5}}\n\nAccess your course materials below:",
    buttons: [{ type: "URL", text: "Start Learning", url: "https://example.com" }],
  },
  {
    id: "9",
    name: "Flash Sale",
    category: "ecommerce",
    badge: "FLASH SALE",
    badgeColor: "bg-red-500",
    headerType: "image",
    body: "⚡ *FLASH SALE* ⚡\n\nHey {{1}}!\n\n🔥 Get up to *{{2}}% OFF* on everything!\n\n⏰ Only for the next {{3}} hours!\n\nDon't miss out on these incredible deals! 🛍️",
    buttons: [{ type: "URL", text: "Shop Now", url: "https://example.com" }],
  },
];

const categories = [
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "general", label: "General", icon: LayoutGrid },
  { id: "top-rated", label: "Top Rated", icon: Star },
];

const industries = [
  { id: "ecommerce", label: "Ecommerce", icon: ShoppingBag },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "banking", label: "Banking", icon: Building2 },
  { id: "events", label: "Events", icon: Calendar },
  { id: "healthcare", label: "Healthcare", icon: Heart },
  { id: "promotional", label: "Promotional", icon: Gift },
  { id: "utility", label: "Utility", icon: Megaphone },
];

interface TemplateGalleryProps {
  onSelectTemplate: (template: TemplateGalleryItem) => void;
}

export const TemplateGallery = ({ onSelectTemplate }: TemplateGalleryProps) => {
  const [activeCategory, setActiveCategory] = useState("trending");
  const [previewTemplate, setPreviewTemplate] = useState<TemplateGalleryItem | null>(null);

  const filteredTemplates = activeCategory === "trending" || activeCategory === "general" || activeCategory === "top-rated"
    ? galleryTemplates
    : galleryTemplates.filter(t => t.category === activeCategory);

  return (
    <div className="flex gap-6">
      {/* Sidebar Categories */}
      <div className="w-48 flex-shrink-0">
        <ScrollArea className="h-[500px]">
          <div className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
            
            <div className="pt-4 pb-2">
              <span className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Industry
              </span>
            </div>
            
            {industries.map((ind) => (
              <button
                key={ind.id}
                onClick={() => setActiveCategory(ind.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeCategory === ind.id
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <ind.icon className="w-4 h-4" />
                {ind.label}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Template Grid */}
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/30 overflow-hidden">
                <CardContent className="p-0">
                  {/* Header with badge */}
                  <div className="relative p-4 pb-2">
                    {template.badge && (
                      <Badge className={`${template.badgeColor} text-white text-[10px] absolute top-2 left-2`}>
                        {template.badge}
                      </Badge>
                    )}
                    {template.headerType === "image" && (
                      <div className="w-16 h-16 mx-auto rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-2">
                        <ImageIcon className="w-8 h-8 text-primary/50" />
                      </div>
                    )}
                    <h3 className="font-semibold text-center text-foreground mt-4">
                      {template.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px]">
                        {template.headerType ? template.headerType.toUpperCase() : "TEXT"}
                      </Badge>
                    </div>
                  </div>

                  {/* Preview text */}
                  <div className="px-4 pb-3">
                    <p className="text-xs text-muted-foreground line-clamp-3 text-center">
                      {template.body.replace(/\{\{\d+\}\}/g, "[value]").replace(/\*/g, "")}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex border-t">
                    <Button
                      variant="ghost"
                      className="flex-1 rounded-none h-10 text-xs"
                      onClick={() => setPreviewTemplate(template)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      Preview
                    </Button>
                    <Button
                      className="flex-1 rounded-none h-10 text-xs btn-whatsapp rounded-tl-none rounded-tr-none"
                      onClick={() => onSelectTemplate(template)}
                    >
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{previewTemplate?.name}</DialogTitle>
          </DialogHeader>
          {previewTemplate && (
            <div className="flex justify-center py-4">
              <WhatsAppPhonePreview
                headerType={previewTemplate.headerType}
                headerContent={previewTemplate.headerType === "image" ? "preview" : undefined}
                body={previewTemplate.body}
                footer={previewTemplate.footer}
                buttons={previewTemplate.buttons}
                variables={{ "1": "John", "2": "50", "3": "SAVE50", "4": "24", "5": "Main Hall" }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
