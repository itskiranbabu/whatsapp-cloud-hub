import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Plus,
  X,
  Link2,
  Phone,
  MessageSquare,
  Image as ImageIcon,
  Video,
  FileText,
  AlertCircle,
  Info,
} from "lucide-react";
import { WhatsAppPhonePreview } from "@/components/whatsapp/WhatsAppPhonePreview";
import { AITemplateGenerator } from "./AITemplateGenerator";

interface TemplateBuilderProps {
  initialData?: {
    name?: string;
    body?: string;
    category?: "marketing" | "utility" | "authentication";
    language?: string;
    headerType?: string;
    headerContent?: string;
    footer?: string;
    buttons?: Array<{ type: string; text: string; url?: string; phone_number?: string }>;
  };
  onSave: (template: {
    name: string;
    body: string;
    category: "marketing" | "utility" | "authentication";
    language: string;
    header_type: string | null;
    header_content: string | null;
    footer: string | null;
    buttons: Array<{ type: string; text: string; url?: string }> | null;
    variables: Record<string, string> | null;
  }) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

const languages = [
  { value: "en", label: "English" },
  { value: "en_US", label: "English (US)" },
  { value: "hi", label: "Hindi" },
  { value: "es", label: "Spanish" },
  { value: "pt_BR", label: "Portuguese (BR)" },
  { value: "ar", label: "Arabic" },
  { value: "id", label: "Indonesian" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
];

const categories = [
  { value: "marketing", label: "MARKETING", description: "Promotional content and offers" },
  { value: "utility", label: "UTILITY", description: "Transactional and informational" },
  { value: "authentication", label: "AUTHENTICATION", description: "OTP and verification codes" },
];

const templateTypes = [
  { value: "TEXT", label: "TEXT" },
  { value: "IMAGE", label: "IMAGE" },
  { value: "VIDEO", label: "VIDEO" },
  { value: "DOCUMENT", label: "DOCUMENT" },
];

export const TemplateBuilder = ({
  initialData,
  onSave,
  onCancel,
  isSaving,
}: TemplateBuilderProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [body, setBody] = useState(initialData?.body || "");
  const [category, setCategory] = useState<"marketing" | "utility" | "authentication">(
    initialData?.category || "marketing"
  );
  const [language, setLanguage] = useState(initialData?.language || "en");
  const [templateType, setTemplateType] = useState(
    initialData?.headerType?.toUpperCase() || "TEXT"
  );
  const [headerText, setHeaderText] = useState(initialData?.headerContent || "");
  const [footer, setFooter] = useState(initialData?.footer || "");
  const [buttons, setButtons] = useState<Array<{ type: string; text: string; url?: string; phone_number?: string }>>(
    initialData?.buttons || []
  );
  const [buttonType, setButtonType] = useState<"none" | "cta" | "quick_reply" | "all">("none");
  const [enableClickTracking, setEnableClickTracking] = useState(false);
  
  // Sample values for variables
  const [sampleValues, setSampleValues] = useState<Record<string, string>>({});

  // Extract variables from body
  useEffect(() => {
    const variableMatches = body.match(/\{\{(\d+)\}\}/g) || [];
    const uniqueVars = [...new Set(variableMatches)];
    const newSampleValues: Record<string, string> = {};
    
    uniqueVars.forEach((v) => {
      const num = v.replace(/[{}]/g, "");
      newSampleValues[num] = sampleValues[num] || "";
    });
    
    setSampleValues(newSampleValues);
  }, [body]);

  const handleAddButton = (type: "URL" | "PHONE" | "QUICK_REPLY") => {
    if (buttons.length < 3) {
      setButtons([...buttons, { type, text: "", url: type === "URL" ? "" : undefined }]);
    }
  };

  const handleRemoveButton = (index: number) => {
    setButtons(buttons.filter((_, i) => i !== index));
  };

  const handleUpdateButton = (index: number, field: string, value: string) => {
    const updated = [...buttons];
    updated[index] = { ...updated[index], [field]: value };
    setButtons(updated);
  };

  const handleAIGenerate = (generated: { body: string; buttons?: Array<{ type: string; text: string; url?: string }> }) => {
    setBody(generated.body);
    if (generated.buttons) {
      setButtons(generated.buttons);
      setButtonType("cta");
    }
  };

  const handleSubmit = () => {
    onSave({
      name,
      body,
      category,
      language,
      header_type: templateType === "TEXT" ? (headerText ? "text" : null) : templateType.toLowerCase(),
      header_content: templateType === "TEXT" ? headerText : null,
      footer: footer || null,
      buttons: buttons.length > 0 ? buttons : null,
      variables: Object.keys(sampleValues).length > 0 ? sampleValues : null,
    });
  };

  const isValid = name.trim() && body.trim();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Form */}
      <div className="lg:col-span-2 space-y-6">
        {/* Category & Language */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Template Category</Label>
            <p className="text-xs text-muted-foreground">Your template should fall under one of these categories.</p>
            <Select value={category} onValueChange={(v) => setCategory(v as typeof category)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Template Language</Label>
            <p className="text-xs text-muted-foreground">Specify the language for your message template.</p>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* AI Generator */}
        <AITemplateGenerator onGenerate={handleAIGenerate} />

        {/* Template Name */}
        <div className="space-y-2">
          <Label>Template Name</Label>
          <p className="text-xs text-muted-foreground">
            Name can only be in lowercase alphanumeric characters and underscores. Special characters and white-space are not allowed.
          </p>
          <Input
            placeholder="e.g. order_confirmation"
            value={name}
            onChange={(e) => setName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_"))}
          />
        </div>

        {/* Template Type */}
        <div className="space-y-2">
          <Label>Template Type</Label>
          <p className="text-xs text-muted-foreground">Your template type should fall under one of these categories.</p>
          <Select value={templateType} onValueChange={setTemplateType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {templateTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    {type.value === "IMAGE" && <ImageIcon className="w-4 h-4" />}
                    {type.value === "VIDEO" && <Video className="w-4 h-4" />}
                    {type.value === "DOCUMENT" && <FileText className="w-4 h-4" />}
                    {type.value === "TEXT" && <MessageSquare className="w-4 h-4" />}
                    {type.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Header Text (for TEXT type) */}
        {templateType === "TEXT" && (
          <div className="space-y-2">
            <Label>Template Header Text (Optional)</Label>
            <p className="text-xs text-muted-foreground">Header text is optional and only up to 60 characters are allowed.</p>
            <Input
              placeholder="Enter header text here"
              value={headerText}
              onChange={(e) => setHeaderText(e.target.value.slice(0, 60))}
              maxLength={60}
            />
            <p className="text-xs text-right text-muted-foreground">{headerText.length}/60</p>
          </div>
        )}

        {/* Template Body */}
        <div className="space-y-2">
          <Label>Template Format</Label>
          <p className="text-xs text-muted-foreground">
            Use text formatting: *bold*, _italic_, & ~strikethrough~. Your message content. Up to 1024 characters are allowed.
            e.g. Hello {"{{1}}"}, your code will expire in {"{{2}}"} mins.
          </p>
          <Textarea
            placeholder="Hey {{1}},&#10;&#10;Double the joy this Rakhi! 🎁&#10;&#10;Buy 1 {{2}} for your brother/sister & get the 2nd at 50% OFF.&#10;&#10;Perfect for matching gifts and shared smiles."
            value={body}
            onChange={(e) => setBody(e.target.value.slice(0, 1024))}
            className="min-h-[150px] font-mono text-sm"
          />
          <p className="text-xs text-right text-muted-foreground">{body.length}/1024</p>
        </div>

        {/* Sample Values */}
        {Object.keys(sampleValues).length > 0 && (
          <div className="space-y-3">
            <Label>Sample Values</Label>
            <p className="text-xs text-muted-foreground">
              Specify sample values for your parameters. These values can be changed at the time of sending.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(sampleValues).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-sm font-mono text-muted-foreground w-12">{`{{${key}}}`}</span>
                  <Input
                    placeholder={`Value for {{${key}}}`}
                    value={value}
                    onChange={(e) => setSampleValues({ ...sampleValues, [key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="space-y-2">
          <Label>Template Footer (Optional)</Label>
          <p className="text-xs text-muted-foreground">Your message content. Up to 60 characters are allowed.</p>
          <Input
            placeholder="Enter footer text here"
            value={footer}
            onChange={(e) => setFooter(e.target.value.slice(0, 60))}
            maxLength={60}
          />
        </div>

        {/* Interactive Actions */}
        <div className="space-y-4">
          <Label>Interactive Actions</Label>
          <p className="text-xs text-muted-foreground">
            In addition to your message, you can send actions with your message. Maximum 25 characters are allowed in CTA button title & Quick Replies.
          </p>
          
          <RadioGroup value={buttonType} onValueChange={(v) => {
            setButtonType(v as typeof buttonType);
            if (v === "none") setButtons([]);
          }}>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none" className="font-normal">None</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cta" id="cta" />
                <Label htmlFor="cta" className="font-normal">Call to Actions</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="quick_reply" id="quick_reply" />
                <Label htmlFor="quick_reply" className="font-normal">Quick Replies</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="font-normal">All</Label>
              </div>
            </div>
          </RadioGroup>

          {buttonType !== "none" && (
            <div className="space-y-3">
              {buttons.map((button, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2"
                >
                  <Select
                    value={button.type}
                    onValueChange={(v) => handleUpdateButton(index, "type", v)}
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(buttonType === "cta" || buttonType === "all") && (
                        <>
                          <SelectItem value="URL">URL</SelectItem>
                          <SelectItem value="PHONE">Phone</SelectItem>
                        </>
                      )}
                      {(buttonType === "quick_reply" || buttonType === "all") && (
                        <SelectItem value="QUICK_REPLY">Quick Reply</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  
                  <Input
                    placeholder="Button text"
                    value={button.text}
                    onChange={(e) => handleUpdateButton(index, "text", e.target.value.slice(0, 25))}
                    className="flex-1"
                    maxLength={25}
                  />
                  <span className="text-xs text-muted-foreground w-10">{button.text.length}/25</span>
                  
                  {button.type === "URL" && (
                    <Input
                      placeholder="https://yourwebsite.com"
                      value={button.url || ""}
                      onChange={(e) => handleUpdateButton(index, "url", e.target.value)}
                      className="flex-1"
                    />
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveButton(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
              
              {buttons.length < 3 && (
                <div className="flex gap-2">
                  {(buttonType === "cta" || buttonType === "all") && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddButton("URL")}
                        className="gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        URL Button
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddButton("PHONE")}
                        className="gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Phone Button
                      </Button>
                    </>
                  )}
                  {(buttonType === "quick_reply" || buttonType === "all") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddButton("QUICK_REPLY")}
                      className="gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Quick Reply
                    </Button>
                  )}
                </div>
              )}
              
              {buttonType === "cta" && (
                <div className="flex items-center gap-2 pt-2">
                  <Switch
                    id="click-tracking"
                    checked={enableClickTracking}
                    onCheckedChange={setEnableClickTracking}
                  />
                  <Label htmlFor="click-tracking" className="font-normal text-sm">
                    Enable Click Tracking
                  </Label>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                    PRO
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <Button
            className="btn-whatsapp flex-1"
            onClick={handleSubmit}
            disabled={!isValid || isSaving}
          >
            {isSaving ? "Submitting..." : "Submit for Approval"}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>

      {/* Right Column - Preview */}
      <div className="lg:col-span-1">
        <div className="sticky top-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Template Preview</CardTitle>
              <p className="text-xs text-muted-foreground">
                Your template message preview. It will update as you fill in the form.
              </p>
            </CardHeader>
            <CardContent>
              <WhatsAppPhonePreview
                headerType={templateType === "TEXT" ? (headerText ? "text" : undefined) : templateType.toLowerCase() as "image" | "video" | "document"}
                headerContent={templateType === "TEXT" ? headerText : "media"}
                body={body || "Your message preview will appear here..."}
                footer={footer}
                buttons={buttons}
                variables={sampleValues}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
