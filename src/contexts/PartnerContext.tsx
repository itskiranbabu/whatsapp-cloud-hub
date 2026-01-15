import React, { createContext, useContext, useEffect } from "react";
import { usePartnerBranding, applyPartnerBranding, PartnerBranding } from "@/hooks/usePartnerBranding";

interface PartnerContextType extends PartnerBranding {}

const PartnerContext = createContext<PartnerContextType | undefined>(undefined);

export const usePartner = () => {
  const context = useContext(PartnerContext);
  if (!context) {
    throw new Error("usePartner must be used within a PartnerProvider");
  }
  return context;
};

export const PartnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const partnerBranding = usePartnerBranding();

  // Apply branding CSS variables when partner is detected
  useEffect(() => {
    if (partnerBranding.isPartnerDomain && partnerBranding.branding) {
      applyPartnerBranding(partnerBranding.branding);
    }
  }, [partnerBranding.isPartnerDomain, partnerBranding.branding]);

  return (
    <PartnerContext.Provider value={partnerBranding}>
      {children}
    </PartnerContext.Provider>
  );
};
