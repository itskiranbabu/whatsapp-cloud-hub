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
  AlertTriangle,
  RefreshCw,
  Settings2,
  Phone,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTenants } from "@/hooks/useTenants";
import { supabase } from "@/integrations/supabase/client";

interface MetaCredentials {
  wabaId: string;
  phoneNumberId: string;
  accessToken?: string;
  displayPhoneNumber?: string;
  verifiedName?: string;
}

interface ConnectionStatus {
  isValid: boolean;
  expiresAt?: number;
  scopes?: string[];
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
  const [isSDKError, setIsSDKError] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState<{
    wabaId?: string;
    phoneNumberId?: string;
    businessName?: string;
    displayPhoneNumber?: string;
  } | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null);
  const [isCheckingConfig, setIsCheckingConfig] = useState(true);
  const [metaConfig, setMetaConfig] = useState<{
    appId: string | null;
    configId: string | null;
    hasSecret: boolean;
    configured: boolean;
  }>({ appId: null, configId: null, hasSecret: false, configured: false });
  const { currentTenant, refetch } = useTenants();
  const { toast } = useToast();

  // Check Meta config from backend on mount
  useEffect(() => {
    const checkConfig = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("whatsapp-meta-auth", {
          body: { action: "check_config" },
        });

        if (error) {
          console.error('Config check error:', error);
          setIsSDKError(true);
          return;
        }

        console.log('Meta config:', data);
        setMetaConfig({
          appId: data.app_id,
          configId: data.config_id,
          hasSecret: data.has_secret,
          configured: data.configured,
        });

        if (!data.configured) {
          setIsSDKError(true);
        }
      } catch (err) {
        console.error('Failed to check config:', err);
        setIsSDKError(true);
      } finally {
        setIsCheckingConfig(false);
      }
    };

    checkConfig();
  }, []);

  // Check if already connected
  useEffect(() => {
    if (currentTenant?.phone_number_id && currentTenant?.waba_id) {
      setIsConnected(true);
      const tenantData = currentTenant as any;
      setConnectionDetails({
        wabaId: currentTenant.waba_id,
        phoneNumberId: currentTenant.phone_number_id,
        businessName: tenantData.business_name || currentTenant.business_name,
      });
    }
  }, [currentTenant]);

  // Load Facebook SDK after config is verified
  useEffect(() => {
    if (isCheckingConfig || !metaConfig.configured) return;

    // Check if SDK is already loaded
    if (window.FB) {
      setIsSDKLoaded(true);
      return;
    }

    // Initialize FB SDK when it loads
    window.fbAsyncInit = function () {
      try {
        window.FB.init({
          appId: metaConfig.appId!,
          cookie: true,
          xfbml: true,
          version: "v21.0",
        });
        window.FB.AppEvents.logPageView();
        setIsSDKLoaded(true);
        setIsSDKError(false);
        console.log('Facebook SDK initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Facebook SDK:', error);
        setIsSDKError(true);
      }
    };

    // Load the SDK asynchronously
    const loadSDK = () => {
      const d = document;
      const s = "script";
      const id = "facebook-jssdk";
      
      // Remove existing script if any
      const existingScript = d.getElementById(id);
      if (existingScript) {
        existingScript.remove();
      }
      
      const fjs = d.getElementsByTagName(s)[0];
      const js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      js.async = true;
      js.defer = true;
      js.crossOrigin = "anonymous";
      
      js.onerror = () => {
        console.error('Failed to load Facebook SDK');
        setIsSDKError(true);
      };
      
      fjs.parentNode?.insertBefore(js, fjs);
    };

    loadSDK();

    // Set a timeout to detect if SDK fails to load
    const timeout = setTimeout(() => {
      if (!window.FB) {
        console.warn('Facebook SDK load timeout');
        setIsSDKError(true);
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [metaConfig.appId, metaConfig.configured, isCheckingConfig]);

  // Validate connection status
  const validateConnection = useCallback(async () => {
    if (!currentTenant?.id || !isConnected) return;

    setIsValidating(true);
    try {
      const { data, error } = await supabase.functions.invoke("whatsapp-meta-auth", {
        body: {
          action: "debug_connection",
          tenant_id: currentTenant.id,
        },
      });

      if (error) throw error;

      if (data?.success) {
        setConnectionStatus({
          isValid: data.token_info?.is_valid ?? true,
          expiresAt: data.token_info?.expires_at,
          scopes: data.token_info?.scopes,
        });
        
        if (data.connection?.business_name) {
          setConnectionDetails(prev => ({
            ...prev,
            businessName: data.connection.business_name,
          }));
        }
      } else {
        setConnectionStatus({ isValid: false });
      }
    } catch (error) {
      console.error('Validation error:', error);
      setConnectionStatus({ isValid: false });
    } finally {
      setIsValidating(false);
    }
  }, [currentTenant?.id, isConnected]);

  useEffect(() => {
    if (isConnected && currentTenant?.id) {
      validateConnection();
    }
  }, [isConnected, currentTenant?.id, validateConnection]);

  const handleEmbeddedSignup = useCallback(async () => {
    if (!isSDKLoaded || !window.FB) {
      toast({
        title: "SDK not loaded",
        description: "Facebook SDK is not loaded. Please refresh the page and try again.",
        variant: "destructive",
      });
      return;
    }

    if (!metaConfig.configId) {
      toast({
        title: "Configuration Missing",
        description: "Meta Config ID is not configured. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    if (!currentTenant?.id) {
      toast({
        title: "Tenant Required",
        description: "Please select a workspace before connecting WhatsApp.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      window.FB.login(
        async (response) => {
          console.log('Facebook login response:', response);

          if (response.authResponse?.code) {
            // Exchange the code for access token via our edge function
            try {
              toast({
                title: "Processing...",
                description: "Connecting your WhatsApp Business Account...",
              });

              const { data, error } = await supabase.functions.invoke("whatsapp-meta-auth", {
                body: {
                  action: "exchange_code",
                  code: response.authResponse.code,
                  tenant_id: currentTenant.id,
                },
              });

              if (error) {
                console.error('Exchange error:', error);
                throw new Error(error.message || 'Failed to exchange authorization code');
              }

              if (data?.success) {
                setIsConnected(true);
                setConnectionDetails({
                  wabaId: data.waba_id,
                  phoneNumberId: data.phone_number_id,
                  businessName: data.verified_name || data.waba_name,
                  displayPhoneNumber: data.display_phone_number,
                });
                setConnectionStatus({ isValid: true });
                
                await refetch();
                
                toast({
                  title: "WhatsApp Connected! 🎉",
                  description: `Connected to ${data.verified_name || data.waba_name} (${data.display_phone_number})`,
                });

                onSuccess?.({
                  wabaId: data.waba_id,
                  phoneNumberId: data.phone_number_id,
                  displayPhoneNumber: data.display_phone_number,
                  verifiedName: data.verified_name,
                });
              } else {
                throw new Error(data?.error || "Failed to complete WhatsApp setup");
              }
            } catch (err) {
              console.error('Connection error:', err);
              const message = err instanceof Error ? err.message : "Failed to complete signup";
              toast({
                title: "Connection Failed",
                description: message,
                variant: "destructive",
              });
              onError?.(message);
            }
          } else if (response.status === 'unknown') {
            toast({
              title: "Popup Blocked",
              description: "Please allow popups and try again, or check if you cancelled the signup.",
              variant: "destructive",
            });
            onError?.("Popup blocked or cancelled");
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
          config_id: metaConfig.configId!,
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
      console.error('Login error:', error);
      const message = error instanceof Error ? error.message : "An error occurred";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      onError?.(message);
    }
  }, [isSDKLoaded, metaConfig.configId, currentTenant?.id, onSuccess, onError, toast, refetch]);

  const handleDisconnect = async () => {
    if (!currentTenant?.id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("whatsapp-meta-auth", {
        body: {
          action: "disconnect",
          tenant_id: currentTenant.id,
        },
      });

      if (error) throw error;

      setIsConnected(false);
      setConnectionDetails(null);
      setConnectionStatus(null);
      await refetch();

      toast({
        title: "Disconnected",
        description: "WhatsApp Business Account has been disconnected",
      });
    } catch (error) {
      console.error('Disconnect error:', error);
      toast({
        title: "Error",
        description: "Failed to disconnect. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    { icon: Gift, text: "FREE webhook access (worth ₹2,399+/month)" },
    { icon: Zap, text: "0% message markup - direct Meta pricing" },
    { icon: Shield, text: "Full white-label control" },
  ];

  // Connected state UI
  if (isConnected) {
    return (
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50/50">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-green-800">WhatsApp Business Connected</h3>
                <p className="text-sm text-green-600">
                  Connected via Meta Direct integration
                </p>
                {connectionDetails && (
                  <div className="mt-3 space-y-2 text-sm">
                    {connectionDetails.businessName && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Settings2 className="w-4 h-4" />
                        <span>{connectionDetails.businessName}</span>
                      </div>
                    )}
                    {connectionDetails.displayPhoneNumber && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{connectionDetails.displayPhoneNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      {isValidating ? (
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                      ) : connectionStatus?.isValid ? (
                        <Badge variant="outline" className="text-green-600 border-green-300">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Token Valid
                        </Badge>
                      ) : connectionStatus ? (
                        <Badge variant="outline" className="text-amber-600 border-amber-300">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Token Expired
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={validateConnection}
                disabled={isValidating}
              >
                {isValidating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleDisconnect}
                disabled={isLoading}
              >
                Disconnect
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (isCheckingConfig) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-8 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking configuration...</p>
        </CardContent>
      </Card>
    );
  }

  // Error state - credentials not configured
  if (isSDKError || !metaConfig.configured) {
    return (
      <Card className="overflow-hidden border-amber-200">
        <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-white">Configuration Required</CardTitle>
              <CardDescription className="text-amber-100">
                Meta App credentials need to be configured
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-700">
              <strong>Meta App credentials are not configured.</strong>
              <br />
              Please add the following secrets to enable WhatsApp connection:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><code className="bg-amber-100 px-1 rounded">VITE_META_APP_ID</code> - Your Meta App ID</li>
                <li><code className="bg-amber-100 px-1 rounded">VITE_META_CONFIG_ID</code> - Your Embedded Signup Config ID</li>
                <li><code className="bg-amber-100 px-1 rounded">META_APP_SECRET</code> - Your Meta App Secret</li>
              </ul>
            </AlertDescription>
          </Alert>
          <Button variant="outline" className="w-full" asChild>
            <a 
              href="https://developers.facebook.com/docs/whatsapp/embedded-signup" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View Meta Setup Guide
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Default signup state
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
              Loading Facebook SDK...
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
          <a 
            href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            Prefer manual setup? View guide
          </a>
        </div>
      </CardContent>
    </Card>
  );
};
