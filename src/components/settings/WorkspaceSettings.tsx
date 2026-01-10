import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Building2,
  Upload,
  Loader2,
  Globe,
  Phone,
  Mail,
  MapPin,
  Palette,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTenants } from "@/hooks/useTenants";

export const WorkspaceSettings = () => {
  const { currentTenant } = useTenants();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    businessName: currentTenant?.business_name || "",
    name: currentTenant?.name || "",
    website: "",
    phone: "",
    email: "",
    address: "",
    description: "",
    primaryColor: currentTenant?.primary_color || "#25D366",
  });
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    
    toast({
      title: "Settings saved",
      description: "Your workspace settings have been updated",
    });
  };

  const handleLogoUpload = () => {
    // Simulate logo upload
    toast({
      title: "Logo updated",
      description: "Your business logo has been uploaded",
    });
  };

  return (
    <div className="space-y-6">
      {/* Business Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Business Profile
          </CardTitle>
          <CardDescription>
            Your business information visible to customers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo Upload */}
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24 rounded-xl">
                <AvatarImage src={currentTenant?.logo_url || ""} />
                <AvatarFallback className="rounded-xl bg-primary/10 text-primary text-2xl">
                  {formData.businessName?.[0] || "W"}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full shadow-md"
                onClick={handleLogoUpload}
              >
                <Upload className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1">
              <h4 className="font-medium">Business Logo</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Upload a square logo (recommended 512x512px). This will appear in your WhatsApp business profile.
              </p>
              <Button variant="outline" size="sm" className="mt-3" onClick={handleLogoUpload}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Logo
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                placeholder="Your Business Name"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workspaceName">Workspace Name</Label>
              <Input
                id="workspaceName"
                placeholder="My Workspace"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Business Description</Label>
            <Textarea
              id="description"
              placeholder="Tell customers about your business..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Website
              </Label>
              <Input
                id="website"
                placeholder="https://yourwebsite.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                placeholder="+1 234 567 8900"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@business.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Address
              </Label>
              <Input
                id="address"
                placeholder="Your business address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            Branding
          </CardTitle>
          <CardDescription>
            Customize the appearance of your workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg border-2 border-border cursor-pointer"
                style={{ backgroundColor: formData.primaryColor }}
              />
              <Input
                id="primaryColor"
                value={formData.primaryColor}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                className="w-32 font-mono"
              />
              <div className="flex gap-2">
                {["#25D366", "#128C7E", "#075E54", "#3B82F6", "#8B5CF6"].map((color) => (
                  <button
                    key={color}
                    onClick={() => setFormData({ ...formData, primaryColor: color })}
                    className="w-8 h-8 rounded-lg border-2 border-transparent hover:border-foreground transition-colors"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} className="min-w-[120px]">
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
};
