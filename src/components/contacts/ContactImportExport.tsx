import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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

interface ContactData {
  name: string;
  phone: string;
  email?: string;
  tags?: string[];
}

interface ImportResult {
  success: number;
  failed: number;
  duplicates: number;
  errors: string[];
}

interface ContactImportExportProps {
  onImportComplete: (contacts: ContactData[]) => void;
  existingContacts: ContactData[];
  tenantId: string;
}

export const ContactImportExport = ({
  onImportComplete,
  existingContacts,
  tenantId,
}: ContactImportExportProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [importStep, setImportStep] = useState<"upload" | "mapping" | "preview" | "importing" | "complete">("upload");
  
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [previewData, setPreviewData] = useState<ContactData[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const [exportFormat, setExportFormat] = useState<"csv" | "xlsx">("csv");
  const [exportFilter, setExportFilter] = useState<"all" | "subscribed" | "tagged">("all");

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
        if (lowerHeader.includes("name") || lowerHeader.includes("full_name")) {
          autoMapping.name = index.toString();
        } else if (lowerHeader.includes("phone") || lowerHeader.includes("mobile") || lowerHeader.includes("whatsapp")) {
          autoMapping.phone = index.toString();
        } else if (lowerHeader.includes("email") || lowerHeader.includes("e-mail")) {
          autoMapping.email = index.toString();
        } else if (lowerHeader.includes("tag")) {
          autoMapping.tags = index.toString();
        }
      });
      setColumnMapping(autoMapping);
      setImportStep("mapping");
    };
    reader.readAsText(file);
  };

  const validateAndPreview = () => {
    if (!columnMapping.phone) {
      toast({
        title: "Phone column required",
        description: "Please map the phone number column",
        variant: "destructive",
      });
      return;
    }

    const contacts: ContactData[] = csvData.map((row) => ({
      name: columnMapping.name ? row[parseInt(columnMapping.name)] || "" : "",
      phone: normalizePhone(row[parseInt(columnMapping.phone)] || ""),
      email: columnMapping.email ? row[parseInt(columnMapping.email)] : undefined,
      tags: columnMapping.tags ? row[parseInt(columnMapping.tags)]?.split(";").map((t) => t.trim()).filter(Boolean) : undefined,
    })).filter((c) => c.phone);

    setPreviewData(contacts);
    setImportStep("preview");
  };

  const normalizePhone = (phone: string): string => {
    // Remove all non-numeric characters except +
    let normalized = phone.replace(/[^\d+]/g, "");
    // Ensure it starts with +
    if (!normalized.startsWith("+")) {
      // Assume Indian number if 10 digits
      if (normalized.length === 10) {
        normalized = "+91" + normalized;
      } else {
        normalized = "+" + normalized;
      }
    }
    return normalized;
  };

  const processImport = async () => {
    setImportStep("importing");
    setImportProgress(0);

    const result: ImportResult = {
      success: 0,
      failed: 0,
      duplicates: 0,
      errors: [],
    };

    const existingPhones = new Set(existingContacts.map((c) => c.phone));
    const validContacts: ContactData[] = [];

    for (let i = 0; i < previewData.length; i++) {
      const contact = previewData[i];
      
      // Check for duplicates
      if (existingPhones.has(contact.phone)) {
        result.duplicates++;
        continue;
      }

      // Validate phone format
      if (contact.phone.length < 10) {
        result.failed++;
        result.errors.push(`Row ${i + 1}: Invalid phone number ${contact.phone}`);
        continue;
      }

      validContacts.push(contact);
      existingPhones.add(contact.phone);
      result.success++;

      setImportProgress(Math.round(((i + 1) / previewData.length) * 100));
      
      // Simulate processing delay
      await new Promise((r) => setTimeout(r, 20));
    }

    setImportResult(result);
    setImportStep("complete");
    
    if (validContacts.length > 0) {
      onImportComplete(validContacts);
    }
  };

  const handleExport = () => {
    let contactsToExport = existingContacts;
    
    if (exportFilter === "subscribed") {
      contactsToExport = existingContacts.filter((c) => (c as any).status === "subscribed");
    }

    const headers = ["Name", "Phone", "Email", "Tags"];
    const rows = contactsToExport.map((c) => [
      c.name || "",
      c.phone,
      c.email || "",
      c.tags?.join(";") || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `contacts_export_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();

    toast({
      title: "Export complete",
      description: `${contactsToExport.length} contacts exported successfully`,
    });
    setShowExportDialog(false);
  };

  const resetImport = () => {
    setImportStep("upload");
    setCsvData([]);
    setCsvHeaders([]);
    setColumnMapping({});
    setPreviewData([]);
    setImportProgress(0);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setShowImportDialog(true)}
        >
          <Upload className="w-4 h-4" />
          Import
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setShowExportDialog(true)}
        >
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={(open) => {
        if (!open) resetImport();
        setShowImportDialog(open);
      }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5" />
              Import Contacts
            </DialogTitle>
            <DialogDescription>
              Import contacts from a CSV file. The file should contain at least a phone number column.
            </DialogDescription>
          </DialogHeader>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 py-4">
            {["Upload", "Mapping", "Preview", "Import"].map((step, index) => {
              const stepIndex = ["upload", "mapping", "preview", "importing"].indexOf(importStep);
              const isComplete = index < stepIndex || importStep === "complete";
              const isCurrent = (index === stepIndex && importStep !== "complete") || (importStep === "complete" && index === 3);
              
              return (
                <div key={step} className="flex items-center">
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
                    {step}
                  </span>
                  {index < 3 && <ArrowRight className="w-4 h-4 mx-4 text-muted-foreground" />}
                </div>
              );
            })}
          </div>

          {/* Upload Step */}
          {importStep === "upload" && (
            <div className="py-8">
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
                <p className="text-sm text-muted-foreground mt-2">
                  or click to browse
                </p>
              </div>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-2">CSV Format Tips:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Include headers in the first row</li>
                  <li>• Phone numbers should include country code</li>
                  <li>• Multiple tags can be separated by semicolons</li>
                </ul>
              </div>
            </div>
          )}

          {/* Mapping Step */}
          {importStep === "mapping" && (
            <div className="py-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Found {csvData.length} records. Map your CSV columns to contact fields:
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
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Select
                    value={columnMapping.email || ""}
                    onValueChange={(v) => setColumnMapping({ ...columnMapping, email: v })}
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
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <Select
                    value={columnMapping.tags || ""}
                    onValueChange={(v) => setColumnMapping({ ...columnMapping, tags: v })}
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
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setImportStep("upload")}>
                  Back
                </Button>
                <Button onClick={validateAndPreview}>
                  Continue
                </Button>
              </DialogFooter>
            </div>
          )}

          {/* Preview Step */}
          {importStep === "preview" && (
            <div className="py-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Preview of {previewData.length} contacts to import:
                </p>
                <Badge variant="outline">{previewData.length} ready</Badge>
              </div>
              <ScrollArea className="h-64 border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Tags</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.slice(0, 50).map((contact, index) => (
                      <TableRow key={index}>
                        <TableCell>{contact.name || "-"}</TableCell>
                        <TableCell className="font-mono text-sm">{contact.phone}</TableCell>
                        <TableCell>{contact.email || "-"}</TableCell>
                        <TableCell>
                          {contact.tags?.map((tag) => (
                            <Badge key={tag} variant="secondary" className="mr-1 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
              {previewData.length > 50 && (
                <p className="text-sm text-muted-foreground text-center">
                  Showing first 50 of {previewData.length} contacts
                </p>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setImportStep("mapping")}>
                  Back
                </Button>
                <Button onClick={processImport} className="btn-whatsapp">
                  Import {previewData.length} Contacts
                </Button>
              </DialogFooter>
            </div>
          )}

          {/* Importing Step */}
          {importStep === "importing" && (
            <div className="py-12 text-center space-y-4">
              <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin" />
              <p className="text-lg font-medium">Importing contacts...</p>
              <Progress value={importProgress} className="w-full max-w-md mx-auto" />
              <p className="text-sm text-muted-foreground">{importProgress}% complete</p>
            </div>
          )}

          {/* Complete Step */}
          {importStep === "complete" && importResult && (
            <div className="py-8 space-y-6">
              <div className="text-center">
                <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
                <p className="text-xl font-semibold">Import Complete!</p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                  <p className="text-2xl font-bold text-green-600">{importResult.success}</p>
                  <p className="text-sm text-muted-foreground">Imported</p>
                </div>
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20">
                  <p className="text-2xl font-bold text-amber-600">{importResult.duplicates}</p>
                  <p className="text-sm text-muted-foreground">Duplicates</p>
                </div>
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20">
                  <p className="text-2xl font-bold text-red-600">{importResult.failed}</p>
                  <p className="text-sm text-muted-foreground">Failed</p>
                </div>
              </div>
              {importResult.errors.length > 0 && (
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm font-medium mb-2">Errors:</p>
                  <ScrollArea className="h-24">
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {importResult.errors.slice(0, 10).map((err, i) => (
                        <li key={i}>• {err}</li>
                      ))}
                    </ul>
                  </ScrollArea>
                </div>
              )}
              <DialogFooter>
                <Button onClick={() => {
                  setShowImportDialog(false);
                  resetImport();
                }}>
                  Done
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export Contacts
            </DialogTitle>
            <DialogDescription>
              Export your contacts to a CSV file
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Export Filter</label>
              <Select value={exportFilter} onValueChange={(v: any) => setExportFilter(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Contacts ({existingContacts.length})</SelectItem>
                  <SelectItem value="subscribed">Subscribed Only</SelectItem>
                  <SelectItem value="tagged">With Tags</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm">
                <strong>Columns included:</strong> Name, Phone, Email, Tags
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport} className="btn-whatsapp gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
