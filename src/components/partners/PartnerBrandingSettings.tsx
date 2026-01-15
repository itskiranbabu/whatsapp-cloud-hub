import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

interface BrandingData {
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  company_name?: string;
  tagline?: string;
  favicon_url?: string;
}

interface PartnerBrandingSettingsProps {
  partnerId: string;
  currentBranding: Json | null;
  onBrandingUpdated?: () => void;
}

export function PartnerBrandingSettings({ 
  partnerId, 
  currentBranding, 
  onBrandingUpdated 
}: PartnerBrandingSettingsProps) {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Parse existing branding or use defaults
  const parsedBranding = (typeof currentBranding === "object" && currentBranding && !Array.isArray(currentBranding)) 
    ? (currentBranding as BrandingData) 
    : {};

  const [branding, setBranding] = useState<BrandingData>({
    logo_url: parsedBranding.logo_url || "",
    primary_color: parsedBranding.primary_color || "#22c55e",
    secondary_color: parsedBranding.secondary_color || "#16a34a",
    accent_color: parsedBranding.accent_color || "#86efac",
    company_name: parsedBranding.company_name || "",
    tagline: parsedBranding.tagline || "",
    favicon_url: parsedBranding.favicon_url || "",
  });

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("partners")
        .update({ branding: branding as unknown as Json })
        .eq("id", partnerId);

      if (error) throw error;

      toast({ title: "Branding saved successfully" });
      onBrandingUpdated?.();
    } catch (err) {
      console.error("Error saving branding:", err);
      toast({ title: "Failed to save branding", variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };

  const updateField = (field: keyof BrandingData, value: string) => {
    setBranding(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          <CardTitle>Brand Customization</CardTitle>
        </div>
        <CardDescription>
          Customize the look and feel of your white-label platform
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Company Info */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Company Name</Label>
            <Input 
              value={branding.company_name}
              onChange={(e) => updateField("company_name", e.target.value)}
              placeholder="Your Company Name"
            />
          </div>
          <div className="space-y-2">
            <Label>Tagline</Label>
            <Input 
              value={branding.tagline}
              onChange={(e) => updateField("tagline", e.target.value)}
              placeholder="Your tagline or slogan"
            />
          </div>
        </div>

        {/* Logo URLs */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Logo URL</Label>
            <Input 
              value={branding.logo_url}
              onChange={(e) => updateField("logo_url", e.target.value)}
              placeholder="https://example.com/logo.png"
            />
            <p className="text-xs text-muted-foreground">Recommended: 200x50px PNG with transparent background</p>
          </div>
          <div className="space-y-2">
            <Label>Favicon URL</Label>
            <Input 
              value={branding.favicon_url}
              onChange={(e) => updateField("favicon_url", e.target.value)}
              placeholder="https://example.com/favicon.ico"
            />
            <p className="text-xs text-muted-foreground">Recommended: 32x32px or 64x64px ICO/PNG</p>
          </div>
        </div>

        {/* Color Pickers */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">Brand Colors</Label>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Primary Color</Label>
              <div className="flex items-center gap-2">
                <input 
                  type="color"
                  value={branding.primary_color}
                  onChange={(e) => updateField("primary_color", e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border-0"
                />
                <Input 
                  value={branding.primary_color}
                  onChange={(e) => updateField("primary_color", e.target.value)}
                  placeholder="#22c55e"
                  className="font-mono uppercase"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Secondary Color</Label>
              <div className="flex items-center gap-2">
                <input 
                  type="color"
                  value={branding.secondary_color}
                  onChange={(e) => updateField("secondary_color", e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border-0"
                />
                <Input 
                  value={branding.secondary_color}
                  onChange={(e) => updateField("secondary_color", e.target.value)}
                  placeholder="#16a34a"
                  className="font-mono uppercase"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Accent Color</Label>
              <div className="flex items-center gap-2">
                <input 
                  type="color"
                  value={branding.accent_color}
                  onChange={(e) => updateField("accent_color", e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border-0"
                />
                <Input 
                  value={branding.accent_color}
                  onChange={(e) => updateField("accent_color", e.target.value)}
                  placeholder="#86efac"
                  className="font-mono uppercase"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">Preview</Label>
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              background: `linear-gradient(135deg, ${branding.primary_color}15, ${branding.secondary_color}10)` 
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              {branding.logo_url ? (
                <img 
                  src={branding.logo_url} 
                  alt="Logo preview" 
                  className="h-8 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: branding.primary_color }}
                >
                  {branding.company_name?.charAt(0) || "W"}
                </div>
              )}
              <div>
                <h3 className="font-semibold">{branding.company_name || "Your Company"}</h3>
                <p className="text-sm text-muted-foreground">{branding.tagline || "Your tagline here"}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm"
                style={{ 
                  backgroundColor: branding.primary_color,
                  color: "white"
                }}
              >
                Primary Button
              </Button>
              <Button 
                size="sm"
                variant="outline"
                style={{ 
                  borderColor: branding.primary_color,
                  color: branding.primary_color
                }}
              >
                Secondary Button
              </Button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isUpdating}>
            {isUpdating ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
            ) : (
              "Save Branding"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
