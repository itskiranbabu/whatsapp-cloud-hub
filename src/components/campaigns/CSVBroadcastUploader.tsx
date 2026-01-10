import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BroadcastContact {
  phone: string;
  name: string;
  variables: Record<string, string>;
}

interface CSVBroadcastUploaderProps {
  onContactsReady: (contacts: BroadcastContact[]) => void;
  templateVariables?: string[];
}

export const CSVBroadcastUploader = ({
  onContactsReady,
  templateVariables = [],
}: CSVBroadcastUploaderProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<"upload" | "mapping" | "preview">("upload");
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [previewContacts, setPreviewContacts] = useState<BroadcastContact[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const parseCSV = (text: string): string[][] => {
    const lines = text.split("\n").filter((line) => line.trim());
    return lines.map((line) => {
      const result: string[] = [];
      let current = "";
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          result.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    });
  };

  const normalizePhone = (phone: string): string => {
    let normalized = phone.replace(/[^\d+]/g, "");
    if (!normalized.startsWith("+")) {
      if (normalized.length === 10) {
        normalized = "+91" + normalized;
      } else {
        normalized = "+" + normalized;
      }
    }
    return normalized;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCSV(text);

      if (parsed.length < 2) {
        toast({
          title: "Invalid file",
          description: "CSV must have at least a header row and one data row",
          variant: "destructive",
        });
        return;
      }

      setCsvHeaders(parsed[0]);
      setCsvData(parsed.slice(1));

      // Auto-detect column mapping
      const autoMapping: Record<string, string> = {};
      parsed[0].forEach((header, index) => {
        const lowerHeader = header.toLowerCase();
        if (lowerHeader.includes("phone") || lowerHeader.includes("mobile") || lowerHeader.includes("whatsapp")) {
          autoMapping.phone = index.toString();
        } else if (lowerHeader.includes("name") || lowerHeader.includes("full_name")) {
          autoMapping.name = index.toString();
        } else if (lowerHeader.includes("variable1") || lowerHeader.includes("var1")) {
          autoMapping.variable1 = index.toString();
        } else if (lowerHeader.includes("variable2") || lowerHeader.includes("var2")) {
          autoMapping.variable2 = index.toString();
        } else if (lowerHeader.includes("variable3") || lowerHeader.includes("var3")) {
          autoMapping.variable3 = index.toString();
        }
      });
      setColumnMapping(autoMapping);
      setStep("mapping");
    };
    reader.readAsText(file);
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = "/templates/broadcast_template.csv";
    link.download = "broadcast_template.csv";
    link.click();
    toast({
      title: "Template downloaded",
      description: "Fill in your data and upload the file",
    });
  };

  const processContacts = () => {
    if (!columnMapping.phone) {
      toast({
        title: "Phone column required",
        description: "Please map the phone number column",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    const contacts: BroadcastContact[] = csvData
      .map((row) => {
        const phone = normalizePhone(row[parseInt(columnMapping.phone)] || "");
        if (phone.length < 10) return null;

        const variables: Record<string, string> = {};
        Object.entries(columnMapping).forEach(([key, colIndex]) => {
          if (key.startsWith("variable") && colIndex) {
            const varNum = key.replace("variable", "");
            variables[varNum] = row[parseInt(colIndex)] || "";
          }
        });

        return {
          phone,
          name: columnMapping.name ? row[parseInt(columnMapping.name)] || "" : "",
          variables,
        };
      })
      .filter((c): c is BroadcastContact => c !== null);

    setPreviewContacts(contacts);
    setIsProcessing(false);
    setStep("preview");
  };

  const handleConfirm = () => {
    onContactsReady(previewContacts);
    toast({
      title: "Contacts ready",
      description: `${previewContacts.length} contacts prepared for broadcast`,
    });
  };

  const resetUploader = () => {
    setStep("upload");
    setCsvData([]);
    setCsvHeaders([]);
    setColumnMapping({});
    setPreviewContacts([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {["Upload", "Mapping", "Preview"].map((stepName, index) => {
            const stepIndex = ["upload", "mapping", "preview"].indexOf(step);
            const isComplete = index < stepIndex;
            const isCurrent = index === stepIndex;

            return (
              <div key={stepName} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    isComplete
                      ? "bg-primary text-primary-foreground"
                      : isCurrent
                      ? "bg-primary/20 text-primary border-2 border-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isComplete ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                </div>
                <span className={`ml-2 text-sm ${isCurrent ? "font-medium" : "text-muted-foreground"}`}>
                  {stepName}
                </span>
                {index < 2 && <ArrowRight className="w-4 h-4 mx-4 text-muted-foreground" />}
              </div>
            );
          })}
        </div>

        {/* Upload Step */}
        {step === "upload" && (
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:border-primary/50 transition-colors"
            >
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Drop your CSV file here</p>
              <p className="text-sm text-muted-foreground mt-2">or click to browse</p>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Need a template?</p>
                <p className="text-sm text-muted-foreground">
                  Download our CSV template with the correct format
                </p>
              </div>
              <Button variant="outline" onClick={handleDownloadTemplate} className="gap-2">
                <Download className="w-4 h-4" />
                Download Template
              </Button>
            </div>
          </div>
        )}

        {/* Mapping Step */}
        {step === "mapping" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Found {csvData.length} records. Map your CSV columns:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Phone Number <span className="text-destructive">*</span>
                </label>
                <Select
                  value={columnMapping.phone || ""}
                  onValueChange={(v) => setColumnMapping({ ...columnMapping, phone: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    {csvHeaders.map((header, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Select
                  value={columnMapping.name || ""}
                  onValueChange={(v) => setColumnMapping({ ...columnMapping, name: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">-- Skip --</SelectItem>
                    {csvHeaders.map((header, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {[1, 2, 3].map((varNum) => (
                <div key={varNum} className="space-y-2">
                  <label className="text-sm font-medium">Variable {varNum}</label>
                  <Select
                    value={columnMapping[`variable${varNum}`] || ""}
                    onValueChange={(v) =>
                      setColumnMapping({ ...columnMapping, [`variable${varNum}`]: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">-- Skip --</SelectItem>
                      {csvHeaders.map((header, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={resetUploader}>
                Back
              </Button>
              <Button onClick={processContacts} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Preview Step */}
        {step === "preview" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Ready to broadcast to {previewContacts.length} contacts
              </p>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {previewContacts.length} valid
              </Badge>
            </div>
            <ScrollArea className="h-64 border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Variables</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewContacts.slice(0, 20).map((contact, index) => (
                    <TableRow key={index}>
                      <TableCell>{contact.name || "-"}</TableCell>
                      <TableCell className="font-mono text-sm">{contact.phone}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {Object.entries(contact.variables)
                          .map(([k, v]) => `{{${k}}}: ${v}`)
                          .join(", ") || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
            {previewContacts.length > 20 && (
              <p className="text-sm text-muted-foreground text-center">
                Showing first 20 of {previewContacts.length} contacts
              </p>
            )}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setStep("mapping")}>
                Back
              </Button>
              <Button onClick={handleConfirm} className="btn-whatsapp">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Confirm & Continue
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
