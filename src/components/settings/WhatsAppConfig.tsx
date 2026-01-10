import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  MessageSquare,
  Key,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
  Eye,
  EyeOff,
  RefreshCw,
  Settings2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTenants } from "@/hooks/useTenants";

interface BSPConfig {
  id: string;
  name: string;
  logo: string;
  description: string;
  docsUrl: string;
  fields: { key: string; label: string; placeholder: string; type: "text" | "password" }[];
}

const bspProviders: BSPConfig[] = [
  {
    id: "twilio",
    name: "Twilio",
    logo: "🔴",
    description: "Enterprise-grade WhatsApp API with global reach",
    docsUrl: "https://www.twilio.com/docs/whatsapp",
    fields: [
      { key: "account_sid", label: "Account SID", placeholder: "AC...", type: "text" },
      { key: "auth_token", label: "Auth Token", placeholder: "Your auth token", type: "password" },
      { key: "phone_number_sid", label: "Phone Number SID", placeholder: "PN...", type: "text" },
    ],
  },
  {
    id: "360dialog",
    name: "360dialog",
    logo: "🟢",
    description: "Official WhatsApp Business Solution Provider",
    docsUrl: "https://docs.360dialog.com/",
    fields: [
      { key: "api_key", label: "API Key", placeholder: "Your 360dialog API key", type: "password" },
      { key: "waba_id", label: "WABA ID", placeholder: "WhatsApp Business Account ID", type: "text" },
      { key: "phone_number_id", label: "Phone Number ID", placeholder: "Your phone number ID", type: "text" },
    ],
  },
  {
    id: "gupshup",
    name: "Gupshup",
    logo: "🟡",
    description: "Conversational messaging platform with rich features",
    docsUrl: "https://docs.gupshup.io/",
    fields: [
      { key: "api_key", label: "API Key", placeholder: "Your Gupshup API key", type: "password" },
      { key: "app_name", label: "App Name", placeholder: "Your app name", type: "text" },
      { key: "source_number", label: "Source Number", placeholder: "+1234567890", type: "text" },
    ],
  },
  {
    id: "meta_direct",
    name: "Meta Direct",
    logo: "🔵",
    description: "Direct integration with Meta's WhatsApp Cloud API",
    docsUrl: "https://developers.facebook.com/docs/whatsapp/cloud-api",
    fields: [
      { key: "access_token", label: "Permanent Access Token", placeholder: "Your access token", type: "password" },
      { key: "phone_number_id", label: "Phone Number ID", placeholder: "Your phone number ID", type: "text" },
      { key: "waba_id", label: "WABA ID", placeholder: "WhatsApp Business Account ID", type: "text" },
      { key: "webhook_verify_token", label: "Webhook Verify Token", placeholder: "Your verify token", type: "password" },
    ],
  },
];

export const WhatsAppConfig = () => {
  const { currentTenant } = useTenants();
  const [selectedProvider, setSelectedProvider] = useState<BSPConfig | null>(null);
  const [configValues, setConfigValues] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  // Simulated connection status
  const isConnected = !!currentTenant?.phone_number_id;
  const connectedProvider = currentTenant?.waba_id ? "360dialog" : null;

  const handleSave = async () => {
    if (!selectedProvider) return;
    
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setSelectedProvider(null);
    
    toast({
      title: "Configuration saved",
      description: `${selectedProvider.name} has been configured successfully`,
    });
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsTesting(false);
    
    toast({
      title: "Connection successful",
      description: "Your WhatsApp API credentials are valid",
    });
  };

  const togglePasswordVisibility = (key: string) => {
    setShowPasswords(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              WhatsApp Configuration
            </CardTitle>
            <CardDescription>
              Connect your WhatsApp Business API provider
            </CardDescription>
          </div>
          {isConnected && (
            <Badge className="bg-green-100 text-green-700">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Connected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isConnected && connectedProvider && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-green-50 border border-green-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-xl">
                  {bspProviders.find(p => p.id === connectedProvider)?.logo}
                </div>
                <div>
                  <p className="font-medium text-green-800">
                    Connected to {bspProviders.find(p => p.id === connectedProvider)?.name}
                  </p>
                  <p className="text-sm text-green-600">
                    Phone: {currentTenant?.phone_number_id || "Not configured"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                >
                  {isTesting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Test
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedProvider(bspProviders.find(p => p.id === connectedProvider) || null)}
                >
                  <Settings2 className="w-4 h-4 mr-1" />
                  Configure
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bspProviders.map((provider, index) => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                setSelectedProvider(provider);
                setConfigValues({});
              }}
              className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                connectedProvider === provider.id
                  ? "border-green-300 bg-green-50/50"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
                  {provider.logo}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{provider.name}</h3>
                    {connectedProvider === provider.id && (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {provider.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {!isConnected && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              Connect a WhatsApp Business API provider to start sending messages
            </span>
          </div>
        )}
      </CardContent>

      <Dialog open={!!selectedProvider} onOpenChange={(open) => !open && setSelectedProvider(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-xl">{selectedProvider?.logo}</span>
              Configure {selectedProvider?.name}
            </DialogTitle>
            <DialogDescription>
              Enter your API credentials to connect your WhatsApp Business account
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedProvider?.fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key}>{field.label}</Label>
                <div className="relative">
                  <Input
                    id={field.key}
                    type={field.type === "password" && !showPasswords[field.key] ? "password" : "text"}
                    placeholder={field.placeholder}
                    value={configValues[field.key] || ""}
                    onChange={(e) => setConfigValues({ ...configValues, [field.key]: e.target.value })}
                    className={field.type === "password" ? "pr-10" : ""}
                  />
                  {field.type === "password" && (
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(field.key)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords[field.key] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            <a 
              href={selectedProvider?.docsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View documentation
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedProvider(null)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 mr-2" />
                  Save Configuration
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
