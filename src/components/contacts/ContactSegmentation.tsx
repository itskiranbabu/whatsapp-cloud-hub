import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Filter,
  Plus,
  X,
  Save,
  Trash2,
  Tag,
  Users,
  CalendarDays,
  CheckCircle,
  XCircle,
  Folder,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, subDays } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

type Contact = Tables<"contacts">;

interface FilterCondition {
  id: string;
  field: "tags" | "opted_in" | "last_message_at" | "attributes";
  operator: "contains" | "not_contains" | "equals" | "not_equals" | "before" | "after" | "in_last" | "is";
  value: string | boolean | number;
}

interface SavedSegment {
  id: string;
  name: string;
  conditions: FilterCondition[];
  createdAt: Date;
}

interface ContactSegmentationProps {
  contacts: Contact[];
  onFilteredContactsChange: (contacts: Contact[]) => void;
  availableTags: string[];
}

const fieldOptions = [
  { value: "tags", label: "Tags", icon: Tag },
  { value: "opted_in", label: "Opt-in Status", icon: CheckCircle },
  { value: "last_message_at", label: "Last Activity", icon: CalendarDays },
];

const operatorsByField: Record<string, { value: string; label: string }[]> = {
  tags: [
    { value: "contains", label: "contains" },
    { value: "not_contains", label: "does not contain" },
  ],
  opted_in: [
    { value: "is", label: "is" },
  ],
  last_message_at: [
    { value: "in_last", label: "in the last" },
    { value: "before", label: "before" },
    { value: "after", label: "after" },
  ],
};

export const ContactSegmentation = ({
  contacts,
  onFilteredContactsChange,
  availableTags,
}: ContactSegmentationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [conditions, setConditions] = useState<FilterCondition[]>([]);
  const [savedSegments, setSavedSegments] = useState<SavedSegment[]>([
    {
      id: "1",
      name: "Active Subscribers",
      conditions: [
        { id: "c1", field: "opted_in", operator: "is", value: true },
        { id: "c2", field: "last_message_at", operator: "in_last", value: 7 },
      ],
      createdAt: new Date(),
    },
    {
      id: "2",
      name: "VIP Customers",
      conditions: [
        { id: "c3", field: "tags", operator: "contains", value: "vip" },
      ],
      createdAt: new Date(),
    },
  ]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();

  const addCondition = () => {
    const newCondition: FilterCondition = {
      id: `cond_${Date.now()}`,
      field: "tags",
      operator: "contains",
      value: "",
    };
    setConditions([...conditions, newCondition]);
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter((c) => c.id !== id));
  };

  const updateCondition = (id: string, updates: Partial<FilterCondition>) => {
    setConditions(
      conditions.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const applyFilters = () => {
    const filtered = contacts.filter((contact) => {
      return conditions.every((condition) => {
        switch (condition.field) {
          case "tags":
            const contactTags = contact.tags || [];
            if (condition.operator === "contains") {
              return contactTags.some((t) =>
                t.toLowerCase().includes(String(condition.value).toLowerCase())
              );
            }
            return !contactTags.some((t) =>
              t.toLowerCase().includes(String(condition.value).toLowerCase())
            );

          case "opted_in":
            return contact.opted_in === condition.value;

          case "last_message_at":
            if (!contact.last_message_at) return false;
            const lastMessage = new Date(contact.last_message_at);
            const now = new Date();
            
            if (condition.operator === "in_last") {
              const daysAgo = subDays(now, Number(condition.value));
              return lastMessage >= daysAgo;
            }
            if (condition.operator === "before" && condition.value) {
              return lastMessage < new Date(String(condition.value));
            }
            if (condition.operator === "after" && condition.value) {
              return lastMessage > new Date(String(condition.value));
            }
            return true;

          default:
            return true;
        }
      });
    });

    onFilteredContactsChange(filtered);
  };

  const clearFilters = () => {
    setConditions([]);
    onFilteredContactsChange(contacts);
  };

  const loadSegment = (segment: SavedSegment) => {
    setConditions(segment.conditions);
    setTimeout(applyFilters, 100);
  };

  const saveSegment = () => {
    if (!segmentName.trim()) return;
    const newSegment: SavedSegment = {
      id: `seg_${Date.now()}`,
      name: segmentName,
      conditions: [...conditions],
      createdAt: new Date(),
    };
    setSavedSegments([...savedSegments, newSegment]);
    setSegmentName("");
    setShowSaveDialog(false);
  };

  const deleteSegment = (id: string) => {
    setSavedSegments(savedSegments.filter((s) => s.id !== id));
  };

  const filteredCount = useMemo(() => {
    if (conditions.length === 0) return contacts.length;
    
    return contacts.filter((contact) => {
      return conditions.every((condition) => {
        switch (condition.field) {
          case "tags":
            const contactTags = contact.tags || [];
            if (condition.operator === "contains") {
              return contactTags.some((t) =>
                t.toLowerCase().includes(String(condition.value).toLowerCase())
              );
            }
            return !contactTags.some((t) =>
              t.toLowerCase().includes(String(condition.value).toLowerCase())
            );
          case "opted_in":
            return contact.opted_in === condition.value;
          case "last_message_at":
            if (!contact.last_message_at) return false;
            const lastMessage = new Date(contact.last_message_at);
            if (condition.operator === "in_last") {
              return lastMessage >= subDays(new Date(), Number(condition.value));
            }
            return true;
          default:
            return true;
        }
      });
    }).length;
  }, [contacts, conditions]);

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Segment
            {conditions.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {conditions.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[480px] p-0" align="start">
          <div className="p-4 border-b border-border">
            <h4 className="font-semibold flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Contact Segmentation
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              Create filters to segment your contacts
            </p>
          </div>

          <ScrollArea className="max-h-[400px]">
            <div className="p-4 space-y-4">
              {/* Saved Segments */}
              {savedSegments.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase">
                    Saved Segments
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {savedSegments.map((segment) => (
                      <Badge
                        key={segment.id}
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80 gap-1.5 pr-1"
                        onClick={() => loadSegment(segment)}
                      >
                        <Folder className="w-3 h-3" />
                        {segment.name}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1 hover:bg-destructive/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSegment(segment.id);
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Filter Conditions */}
              <div className="space-y-3">
                <Label className="text-xs text-muted-foreground uppercase">
                  Filter Conditions
                </Label>

                <AnimatePresence>
                  {conditions.map((condition, index) => (
                    <motion.div
                      key={condition.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2"
                    >
                      {index > 0 && (
                        <span className="text-xs text-muted-foreground w-8">AND</span>
                      )}
                      <div className={cn("flex-1 grid gap-2", index > 0 ? "grid-cols-3" : "grid-cols-3")}>
                        <Select
                          value={condition.field}
                          onValueChange={(v) =>
                            updateCondition(condition.id, {
                              field: v as FilterCondition["field"],
                              operator: operatorsByField[v][0].value as FilterCondition["operator"],
                              value: "",
                            })
                          }
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fieldOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                <div className="flex items-center gap-2">
                                  <opt.icon className="w-3.5 h-3.5" />
                                  {opt.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={condition.operator}
                          onValueChange={(v) =>
                            updateCondition(condition.id, {
                              operator: v as FilterCondition["operator"],
                            })
                          }
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {operatorsByField[condition.field]?.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Value Input */}
                        {condition.field === "tags" && (
                          <Select
                            value={String(condition.value)}
                            onValueChange={(v) =>
                              updateCondition(condition.id, { value: v })
                            }
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select tag" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableTags.map((tag) => (
                                <SelectItem key={tag} value={tag}>
                                  {tag}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}

                        {condition.field === "opted_in" && (
                          <Select
                            value={String(condition.value)}
                            onValueChange={(v) =>
                              updateCondition(condition.id, { value: v === "true" })
                            }
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                                  Opted In
                                </div>
                              </SelectItem>
                              <SelectItem value="false">
                                <div className="flex items-center gap-2">
                                  <XCircle className="w-3.5 h-3.5 text-red-600" />
                                  Not Opted In
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}

                        {condition.field === "last_message_at" &&
                          condition.operator === "in_last" && (
                            <Select
                              value={String(condition.value)}
                              onValueChange={(v) =>
                                updateCondition(condition.id, { value: Number(v) })
                              }
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select period" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 day</SelectItem>
                                <SelectItem value="7">7 days</SelectItem>
                                <SelectItem value="14">14 days</SelectItem>
                                <SelectItem value="30">30 days</SelectItem>
                                <SelectItem value="90">90 days</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeCondition(condition.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-1.5"
                  onClick={addCondition}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Condition
                </Button>
              </div>

              {/* Preview */}
              {conditions.length > 0 && (
                <Card className="bg-muted/50">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          <strong>{filteredCount}</strong> contacts match
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        of {contacts.length} total
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              disabled={conditions.length === 0}
            >
              Clear All
            </Button>
            <div className="flex items-center gap-2">
              {conditions.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setShowSaveDialog(true)}
                >
                  <Save className="w-3.5 h-3.5" />
                  Save
                </Button>
              )}
              <Button
                size="sm"
                className="btn-whatsapp"
                onClick={() => {
                  applyFilters();
                  setIsOpen(false);
                }}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Save Segment Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Save Segment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Segment Name</Label>
              <Input
                value={segmentName}
                onChange={(e) => setSegmentName(e.target.value)}
                placeholder="e.g., Active VIP Customers"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              This segment includes {conditions.length} filter condition(s) and
              matches {filteredCount} contacts.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveSegment} disabled={!segmentName.trim()}>
              Save Segment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
