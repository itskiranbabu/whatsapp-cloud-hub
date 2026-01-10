import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Edit, 
  ExternalLink, 
  Copy, 
  CheckCircle2,
  Phone,
  Building,
  Link2
} from "lucide-react";
import { useTenants } from "@/hooks/useTenants";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useState } from "react";

export const BusinessProfileCard = () => {
  const { currentTenant } = useTenants();
  const [copied, setCopied] = useState(false);

  const businessName = currentTenant?.business_name || currentTenant?.name || "Your Business";
  const phoneNumber = currentTenant?.phone_number_id ? `+${currentTenant.phone_number_id}` : "Not configured";
  const waLink = currentTenant?.phone_number_id 
    ? `wa.me/${currentTenant.phone_number_id}` 
    : null;

  const handleCopyLink = () => {
    if (waLink) {
      navigator.clipboard.writeText(`https://${waLink}`);
      setCopied(true);
      toast.success("WhatsApp link copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Business Profile</CardTitle>
          <Link to="/settings">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center text-center mb-4">
          <Avatar className="w-16 h-16 mb-3">
            <AvatarImage src={currentTenant?.logo_url || undefined} />
            <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
              {businessName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-foreground">{businessName}</h3>
          <p className="text-sm text-muted-foreground capitalize">{currentTenant?.plan || "Starter"} Plan</p>
        </div>

        <div className="space-y-3">
          {/* Phone Number */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{phoneNumber}</p>
            </div>
            {currentTenant?.phone_number_id && (
              <Badge className="bg-green-500/10 text-green-600" variant="secondary">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>

          {/* WhatsApp Link */}
          {waLink && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Link2 className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary truncate">{waLink}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </Button>
            </div>
          )}

          {/* Quick Actions */}
          <div className="pt-2 space-y-2">
            <Link to="/settings" className="block">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Building className="w-4 h-4" />
                Edit Business Profile
              </Button>
            </Link>
            {waLink && (
              <a href={`https://${waLink}`} target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Test WhatsApp Link
                </Button>
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
