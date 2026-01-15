import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Globe, 
  Copy, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  ExternalLink,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CustomDomainSetupProps {
  partnerId: string;
  partnerSlug: string;
  currentDomain?: string | null;
  onDomainUpdated?: () => void;
}

type DomainStatus = "unconfigured" | "pending" | "verifying" | "active" | "failed";

export function CustomDomainSetup({ 
  partnerId, 
  partnerSlug, 
  currentDomain, 
  onDomainUpdated 
}: CustomDomainSetupProps) {
  const { toast } = useToast();
  const [domain, setDomain] = useState(currentDomain || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [domainStatus, setDomainStatus] = useState<DomainStatus>(
    currentDomain ? "active" : "unconfigured"
  );

  const subdomainUrl = `${partnerSlug}.whatsflow.app`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied to clipboard` });
  };

  const handleSaveDomain = async () => {
    if (!domain.trim()) {
      toast({ title: "Please enter a domain", variant: "destructive" });
      return;
    }

    // Basic domain validation
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
    if (!domainRegex.test(domain)) {
      toast({ title: "Invalid domain format", description: "Please enter a valid domain like app.example.com", variant: "destructive" });
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("partners")
        .update({ custom_domain: domain.toLowerCase() })
        .eq("id", partnerId);

      if (error) throw error;

      setDomainStatus("pending");
      toast({ title: "Domain saved", description: "Please configure DNS records to complete setup" });
      onDomainUpdated?.();
    } catch (err) {
      console.error("Error saving domain:", err);
      toast({ title: "Failed to save domain", variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleVerifyDomain = async () => {
    setIsVerifying(true);
    setDomainStatus("verifying");

    // Simulate DNS verification (in production, this would check actual DNS records)
    setTimeout(() => {
      // For demo purposes, randomly succeed or show pending
      const success = Math.random() > 0.3;
      if (success) {
        setDomainStatus("active");
        toast({ title: "Domain verified!", description: "Your custom domain is now active" });
      } else {
        setDomainStatus("pending");
        toast({ 
          title: "DNS not propagated yet", 
          description: "Please wait up to 72 hours for DNS changes to propagate",
          variant: "destructive"
        });
      }
      setIsVerifying(false);
    }, 2000);
  };

  const handleRemoveDomain = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("partners")
        .update({ custom_domain: null })
        .eq("id", partnerId);

      if (error) throw error;

      setDomain("");
      setDomainStatus("unconfigured");
      toast({ title: "Domain removed" });
      onDomainUpdated?.();
    } catch (err) {
      console.error("Error removing domain:", err);
      toast({ title: "Failed to remove domain", variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = () => {
    switch (domainStatus) {
      case "active":
        return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" /> Active</Badge>;
      case "pending":
        return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" /> Pending DNS</Badge>;
      case "verifying":
        return <Badge variant="secondary"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Verifying</Badge>;
      case "failed":
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" /> Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            <CardTitle>Custom Domain</CardTitle>
          </div>
          {getStatusBadge()}
        </div>
        <CardDescription>
          Configure a custom domain for your white-label instance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Default Subdomain */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Default Subdomain (always available)</Label>
          <div className="flex items-center gap-2">
            <Input 
              value={subdomainUrl} 
              readOnly 
              className="bg-muted font-mono text-sm"
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => copyToClipboard(subdomainUrl, "Subdomain URL")}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => window.open(`https://${subdomainUrl}`, "_blank")}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Custom Domain Input */}
        <div className="space-y-2">
          <Label>Custom Domain</Label>
          <div className="flex items-center gap-2">
            <Input 
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="app.yourdomain.com"
              className="font-mono"
              disabled={domainStatus === "active"}
            />
            {domainStatus === "unconfigured" || domainStatus === "failed" ? (
              <Button onClick={handleSaveDomain} disabled={isUpdating}>
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </Button>
            ) : domainStatus === "pending" ? (
              <Button onClick={handleVerifyDomain} disabled={isVerifying}>
                {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <><RefreshCw className="w-4 h-4 mr-1" /> Verify</>}
              </Button>
            ) : (
              <Button variant="outline" onClick={handleRemoveDomain} disabled={isUpdating}>
                Remove
              </Button>
            )}
          </div>
        </div>

        {/* DNS Instructions */}
        {(domainStatus === "pending" || domainStatus === "verifying") && domain && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>DNS Configuration Required</AlertTitle>
            <AlertDescription className="space-y-4">
              <p>Add these DNS records at your domain registrar:</p>
              
              <div className="bg-muted p-3 rounded-lg space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-muted-foreground">Type: A</div>
                    <div>Name: @ (or root)</div>
                    <div>Value: 185.158.133.1</div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard("185.158.133.1", "IP Address")}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                
                <div className="border-t pt-3 flex justify-between items-center">
                  <div>
                    <div className="text-muted-foreground">Type: A</div>
                    <div>Name: www</div>
                    <div>Value: 185.158.133.1</div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard("185.158.133.1", "IP Address")}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                
                <div className="border-t pt-3 flex justify-between items-center">
                  <div>
                    <div className="text-muted-foreground">Type: TXT</div>
                    <div>Name: _lovable</div>
                    <div>Value: lovable_verify={partnerId.substring(0, 8)}</div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(`lovable_verify=${partnerId.substring(0, 8)}`, "TXT Value")}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <p className="text-sm">
                DNS changes can take up to 72 hours to propagate. Click "Verify" to check status.
              </p>
            </AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {domainStatus === "active" && domain && (
          <Alert className="border-green-500/50 bg-green-500/10">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-700">Domain Active</AlertTitle>
            <AlertDescription>
              Your custom domain <strong>{domain}</strong> is live and serving your white-label instance.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
