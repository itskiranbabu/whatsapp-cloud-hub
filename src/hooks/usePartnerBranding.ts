import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export interface PartnerBranding {
  partnerId: string | null;
  partnerName: string | null;
  partnerSlug: string | null;
  customDomain: string | null;
  branding: {
    logo_url?: string;
    primary_color?: string;
    secondary_color?: string;
    accent_color?: string;
    company_name?: string;
    tagline?: string;
    favicon_url?: string;
  } | null;
  isPartnerDomain: boolean;
  isLoading: boolean;
}

const DEFAULT_DOMAINS = [
  "localhost",
  "lovable.app",
  "lovable.dev",
  "whatsflow.app",
  "whatsflow.com",
  "keyrundigital.com",
];

function isDefaultDomain(hostname: string): boolean {
  return DEFAULT_DOMAINS.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
  );
}

function parseBranding(branding: Json | null): PartnerBranding["branding"] {
  if (!branding || typeof branding !== "object" || Array.isArray(branding)) {
    return null;
  }
  return branding as PartnerBranding["branding"];
}

export function usePartnerBranding(): PartnerBranding {
  const [state, setState] = useState<PartnerBranding>({
    partnerId: null,
    partnerName: null,
    partnerSlug: null,
    customDomain: null,
    branding: null,
    isPartnerDomain: false,
    isLoading: true,
  });

  useEffect(() => {
    const detectPartner = async () => {
      const hostname = window.location.hostname;

      // Skip partner detection for default domains
      if (isDefaultDomain(hostname)) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        // Try to find partner by custom domain
        const { data: partner, error } = await supabase
          .from("partners")
          .select("id, name, slug, custom_domain, branding")
          .eq("custom_domain", hostname)
          .eq("status", "active")
          .single();

        if (error || !partner) {
          // Try matching subdomain pattern: {slug}.whatsflow.app
          const subdomainMatch = hostname.match(/^([a-z0-9-]+)\.(whatsflow\.app|whatsflow\.com)$/);
          if (subdomainMatch) {
            const slug = subdomainMatch[1];
            const { data: partnerBySlug } = await supabase
              .from("partners")
              .select("id, name, slug, custom_domain, branding")
              .eq("slug", slug)
              .eq("status", "active")
              .single();

            if (partnerBySlug) {
              setState({
                partnerId: partnerBySlug.id,
                partnerName: partnerBySlug.name,
                partnerSlug: partnerBySlug.slug,
                customDomain: partnerBySlug.custom_domain,
                branding: parseBranding(partnerBySlug.branding),
                isPartnerDomain: true,
                isLoading: false,
              });
              return;
            }
          }

          setState((prev) => ({ ...prev, isLoading: false }));
          return;
        }

        setState({
          partnerId: partner.id,
          partnerName: partner.name,
          partnerSlug: partner.slug,
          customDomain: partner.custom_domain,
          branding: parseBranding(partner.branding),
          isPartnerDomain: true,
          isLoading: false,
        });
      } catch (err) {
        console.error("Error detecting partner branding:", err);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    detectPartner();
  }, []);

  return state;
}

export function applyPartnerBranding(branding: PartnerBranding["branding"]) {
  if (!branding) return;

  const root = document.documentElement;

  if (branding.primary_color) {
    // Convert hex to HSL for CSS variables
    const hsl = hexToHSL(branding.primary_color);
    if (hsl) {
      root.style.setProperty("--primary", `${hsl.h} ${hsl.s}% ${hsl.l}%`);
    }
  }

  if (branding.secondary_color) {
    const hsl = hexToHSL(branding.secondary_color);
    if (hsl) {
      root.style.setProperty("--secondary", `${hsl.h} ${hsl.s}% ${hsl.l}%`);
    }
  }

  if (branding.accent_color) {
    const hsl = hexToHSL(branding.accent_color);
    if (hsl) {
      root.style.setProperty("--accent", `${hsl.h} ${hsl.s}% ${hsl.l}%`);
    }
  }

  if (branding.favicon_url) {
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (link) {
      link.href = branding.favicon_url;
    }
  }

  if (branding.company_name) {
    document.title = branding.company_name;
  }
}

function hexToHSL(hex: string): { h: number; s: number; l: number } | null {
  // Remove # if present
  hex = hex.replace(/^#/, "");

  if (hex.length !== 6) return null;

  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}
