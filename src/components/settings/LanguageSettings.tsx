import { Check, Globe, Languages } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage, availableLanguages, Language } from "@/contexts/LanguageContext";

export const LanguageSettings = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Language Settings
        </CardTitle>
        <CardDescription>
          Choose your preferred language for the application interface
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {availableLanguages.map((lang) => (
            <Button
              key={lang.code}
              variant={language === lang.code ? "default" : "outline"}
              className={`justify-start gap-3 h-auto py-3 ${
                language === lang.code ? "bg-primary" : ""
              }`}
              onClick={() => setLanguage(lang.code as Language)}
            >
              <div className="flex items-center gap-3 flex-1">
                <Languages className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">{lang.name}</p>
                  <p className="text-xs opacity-80">{lang.nativeName}</p>
                </div>
              </div>
              {language === lang.code && (
                <Check className="h-4 w-4" />
              )}
            </Button>
          ))}
        </div>

        <div className="mt-4 p-4 rounded-lg bg-muted/50 space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Preview</Badge>
          </div>
          <div className="space-y-1 text-sm">
            <p><strong>{t("nav.dashboard")}</strong> - {t("dashboard.welcome")}</p>
            <p><strong>{t("action.save")}</strong> | <strong>{t("action.cancel")}</strong> | <strong>{t("action.delete")}</strong></p>
            <p className="text-muted-foreground">{t("common.loading")}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
