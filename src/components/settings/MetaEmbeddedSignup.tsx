import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle2,
  Loader2,
  ExternalLink,
  Shield,
  Zap,
  Gift,
  ArrowRight,
  Info,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTenants } from "@/hooks/useTenants";
import { supabase } from "@/integrations/supabase/client";

interface MetaCredentials {
  wabaId: string;
  phoneNumberId: string;
  accessToken: string;
}

declare global {
  interface Window {
    FB: {
      init: (params: {
        appId: string;
        cookie?: boolean;
        xfbml?: boolean;
        version: string;
      }) => void;
      login: (
        callback: (response: {
          authResponse?: {
            code?: string;
            accessToken?: string;
            userID?: string;
          };
          status?: string;
        }) => void,
        options: {
          config_id: string;
          response_type: string;
          override_default_response_type: boolean;
          extras?: {
            sessionInfoVersion?: number;
            featureType?: string;
            setup?: object;
          };
        }
      ) => void;
      AppEvents: {
        logPageView: () => void;
      };
    };
    fbAsyncInit: () => void;
  }
}

interface MetaEmbeddedSignupProps {
  onSuccess?: (credentials: MetaCredentials) => void;
  onError?: (error: string) => void;
}

export const MetaEmbeddedSignup = ({ onSuccess, onError }: MetaEmbeddedSignupProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { currentTenant, refetch } = useTenants();
  const { toast } = useToast();

  // Check if already connected
  useEffect(() => {
    if (currentTenant?.phone_number_id && currentTenant?.waba_id) {
      setIsConnected(true);
    }
  }, [currentTenant]);

  // Load Facebook SDK
  useEffect(() => {
    // Check if SDK is already loaded
    if (window.FB) {
      setIsSDKLoaded(true);
      return;
    }

    // Initialize FB SDK when it loads
    window.fbAsyncInit = function () {
      // Get Meta App ID from environment or use fallback for demo
      const metaAppId = import.meta.env.VITE_META_APP_ID;
      if (!metaAppId) {
        console.warn('Meta App ID not configured. Please add VITE_META_APP_ID secret.');
      }
      window.FB.init({
        appId: metaAppId || "YOUR_META_APP_ID",
        cookie: true,
        xfbml: true,
        version: "v21.0",
      });
      window.FB.AppEvents.logPageView();
      setIsSDKLoaded(true);
    };

    // Load the SDK asynchronously
    const loadSDK = () => {
      const d = document;
      const s = "script";
      const id = "facebook-jssdk";
      
      if (d.getElementById(id)) return;
      
      const fjs = d.getElementsByTagName(s)[0];
      const js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      js.async = true;
      js.defer = true;
      fjs.parentNode?.insertBefore(js, fjs);
    };

    loadSDK();
  }, []);

  const handleEmbeddedSignup = useCallback(async () => {
    if (!isSDKLoaded || !window.FB) {
      toast({
        title: "SDK not loaded",
        description: "Please wait for Facebook SDK to load and try again",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      window.FB.login(
        async (response) => {
          if (response.authResponse?.code) {
            // Exchange the code for access token via our edge function
            try {
              const { data, error } = await supabase.functions.invoke("whatsapp-meta-webhook", {
                body: {
                  action: "exchange_code",
                  code: response.authResponse.code,
                  tenant_id: currentTenant?.id,
                },
              });

              if (error) throw error;

              if (data?.success) {
                setIsConnected(true);
                refetch();
                
                toast({
                  title: "WhatsApp Connected!",
                  description: "Your WhatsApp Business Account has been connected successfully",
                });

                onSuccess?.({
                  wabaId: data.waba_id,
                  phoneNumberId: data.phone_number_id,
                  accessToken: data.access_token,
                });
              } else {
                throw new Error(data?.error || "Failed to complete signup");
              }
            } catch (err) {
              const message = err instanceof Error ? err.message : "Failed to complete signup";
              toast({
                title: "Connection Failed",
                description: message,
                variant: "destructive",
              });
              onError?.(message);
            }
          } else {
            toast({
              title: "Signup Cancelled",
              description: "WhatsApp Business signup was cancelled",
              variant: "destructive",
            });
            onError?.("User cancelled signup");
          }
          setIsLoading(false);
        },
        {
          config_id: import.meta.env.VITE_META_CONFIG_ID || "YOUR_CONFIG_ID",
          response_type: "code",
          override_default_response_type: true,
          extras: {
            sessionInfoVersion: 3,
            featureType: "only_waba_sharing",
            setup: {},
          },
        }
      );
    } catch (error) {
      setIsLoading(false);
      const message = error instanceof Error ? error.message : "An error occurred";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      onError?.(message);
    }
  }, [isSDKLoaded, currentTenant?.id, onSuccess, onError, toast, refetch]);

  const benefits = [
    { icon: Gift, text: "FREE webhook access (worth ₹2,399+/month)" },
    { icon: Zap, text: "0% message markup - direct Meta pricing" },
    { icon: Shield, text: "Full white-label control" },
  ];

  if (isConnected) {
    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">WhatsApp Business Connected</h3>
              <p className="text-sm text-green-600">
                Your account is connected via Meta Direct integration
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/20">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
          <div>
            <CardTitle className="text-white">Connect with Meta Direct</CardTitle>
            <CardDescription className="text-blue-100">
              One-click WhatsApp Business API setup
            </CardDescription>
          </div>
          <Badge className="ml-auto bg-white/20 text-white border-white/30">
            Recommended
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Benefits */}
        <div className="space-y-3">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="p-1.5 rounded-full bg-green-100">
                <benefit.icon className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm">{benefit.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Info Alert */}
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700 text-sm">
            Connect directly to Meta's Cloud API - no third-party BSP needed. 
            You'll need a Meta Business Account and a verified business.
          </AlertDescription>
        </Alert>

        {/* Connect Button */}
        <Button
          size="lg"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
          onClick={handleEmbeddedSignup}
          disabled={isLoading || !isSDKLoaded}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Connecting...
            </>
          ) : !isSDKLoaded ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Connect with Meta
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>

        {/* Manual Setup Link */}
        <div className="text-center">
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
            <ExternalLink className="w-3 h-3" />
            Prefer manual setup? View guide
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
