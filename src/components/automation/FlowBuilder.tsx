import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Zap,
  MessageSquare,
  GitBranch,
  Clock,
  Plus,
  Trash2,
  Settings,
  Play,
  ArrowDown,
  Bot,
  Reply,
  Image,
  FileText,
  UserCheck,
  Tag,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FlowNode {
  id: string;
  type: "trigger" | "message" | "condition" | "delay" | "action";
  title: string;
  config: Record<string, unknown>;
  position: number;
}

interface FlowBuilderProps {
  flowName: string;
  onFlowNameChange: (name: string) => void;
  nodes: FlowNode[];
  onNodesChange: (nodes: FlowNode[]) => void;
  onSave: () => void;
  onTest: () => void;
}

const nodeTypes = [
  {
    type: "trigger",
    label: "Trigger",
    icon: Zap,
    color: "bg-amber-500/10 text-amber-600 border-amber-500/30",
    description: "Start the automation",
  },
  {
    type: "message",
    label: "Send Message",
    icon: MessageSquare,
    color: "bg-primary/10 text-primary border-primary/30",
    description: "Send a WhatsApp message",
  },
  {
    type: "condition",
    label: "Condition",
    icon: GitBranch,
    color: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    description: "Branch based on conditions",
  },
  {
    type: "delay",
    label: "Wait/Delay",
    icon: Clock,
    color: "bg-purple-500/10 text-purple-600 border-purple-500/30",
    description: "Wait before continuing",
  },
  {
    type: "action",
    label: "Action",
    icon: UserCheck,
    color: "bg-green-500/10 text-green-600 border-green-500/30",
    description: "Perform an action",
  },
];

const triggerOptions = [
  { value: "keyword", label: "Keyword Match" },
  { value: "new_contact", label: "New Contact Created" },
  { value: "cart_abandoned", label: "Cart Abandoned" },
  { value: "appointment", label: "Appointment Reminder" },
  { value: "manual", label: "Manual Trigger" },
];

const actionOptions = [
  { value: "add_tag", label: "Add Tag to Contact" },
  { value: "remove_tag", label: "Remove Tag" },
  { value: "assign_agent", label: "Assign to Agent" },
  { value: "update_contact", label: "Update Contact" },
  { value: "webhook", label: "Call Webhook" },
];

export const FlowBuilder = ({
  flowName,
  onFlowNameChange,
  nodes,
  onNodesChange,
  onSave,
  onTest,
}: FlowBuilderProps) => {
  const [showNodePicker, setShowNodePicker] = useState(false);
  const [editingNode, setEditingNode] = useState<FlowNode | null>(null);
  const [insertPosition, setInsertPosition] = useState<number>(0);

  const addNode = useCallback(
    (type: FlowNode["type"]) => {
      const newNode: FlowNode = {
        id: `node_${Date.now()}`,
        type,
        title: nodeTypes.find((n) => n.type === type)?.label || "Node",
        config: {},
        position: insertPosition,
      };

      const updatedNodes = [...nodes];
      updatedNodes.splice(insertPosition, 0, newNode);
      updatedNodes.forEach((n, i) => (n.position = i));
      onNodesChange(updatedNodes);
      setShowNodePicker(false);
      setEditingNode(newNode);
    },
    [nodes, onNodesChange, insertPosition]
  );

  const updateNode = useCallback(
    (nodeId: string, updates: Partial<FlowNode>) => {
      onNodesChange(
        nodes.map((n) => (n.id === nodeId ? { ...n, ...updates } : n))
      );
    },
    [nodes, onNodesChange]
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      const updatedNodes = nodes.filter((n) => n.id !== nodeId);
      updatedNodes.forEach((n, i) => (n.position = i));
      onNodesChange(updatedNodes);
    },
    [nodes, onNodesChange]
  );

  const getNodeStyle = (type: string) => {
    return (
      nodeTypes.find((n) => n.type === type)?.color ||
      "bg-muted text-muted-foreground"
    );
  };

  const getNodeIcon = (type: string) => {
    const NodeIcon =
      nodeTypes.find((n) => n.type === type)?.icon || MessageSquare;
    return NodeIcon;
  };

  return (
    <div className="flex h-full gap-6">
      {/* Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Input
              value={flowName}
              onChange={(e) => onFlowNameChange(e.target.value)}
              placeholder="Flow Name"
              className="text-lg font-semibold w-64"
            />
            <Badge variant="secondary">Draft</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onTest} className="gap-2">
              <Play className="w-4 h-4" />
              Test Flow
            </Button>
            <Button onClick={onSave} className="btn-whatsapp gap-2">
              Save Flow
            </Button>
          </div>
        </div>

        {/* Flow Canvas */}
        <ScrollArea className="flex-1">
          <div className="flex flex-col items-center py-8 px-4 min-h-[500px]">
            {/* Start Node */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                <Bot className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium mt-2">Start</span>
            </div>

            {nodes.length === 0 ? (
              <>
                <div className="w-px h-8 bg-border" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInsertPosition(0);
                    setShowNodePicker(true);
                  }}
                  className="rounded-full w-10 h-10 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <p className="text-muted-foreground text-sm mt-4">
                  Click to add your first node
                </p>
              </>
            ) : (
              nodes.map((node, index) => {
                const NodeIcon = getNodeIcon(node.type);
                return (
                  <div key={node.id} className="flex flex-col items-center">
                    <div className="w-px h-6 bg-border" />
                    <ArrowDown className="w-4 h-4 text-muted-foreground -my-1" />
                    <div className="w-px h-6 bg-border" />

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group"
                    >
                      <Card
                        className={cn(
                          "w-80 cursor-pointer border-2 transition-all hover:shadow-md",
                          getNodeStyle(node.type)
                        )}
                        onClick={() => setEditingNode(node)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "p-2 rounded-lg",
                                getNodeStyle(node.type)
                              )}
                            >
                              <NodeIcon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-foreground truncate">
                                {node.title}
                              </h4>
                              <p className="text-xs text-muted-foreground truncate">
                                {node.type === "trigger" &&
                                  ((node.config as { triggerType?: string })
                                    .triggerType ||
                                    "Configure trigger")}
                                {node.type === "message" &&
                                  ((node.config as { content?: string })
                                    .content || "Set message content")}
                                {node.type === "condition" &&
                                  ((node.config as { condition?: string })
                                    .condition || "Set condition")}
                                {node.type === "delay" &&
                                  ((node.config as { delay?: string }).delay ||
                                    "Set delay")}
                                {node.type === "action" &&
                                  ((node.config as { actionType?: string })
                                    .actionType || "Configure action")}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNode(node.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {index === nodes.length - 1 && (
                      <>
                        <div className="w-px h-6 bg-border" />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setInsertPosition(nodes.length);
                            setShowNodePicker(true);
                          }}
                          className="rounded-full w-10 h-10 p-0"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                );
              })
            )}

            {/* End Node */}
            {nodes.length > 0 && (
              <div className="flex flex-col items-center mt-8">
                <div className="w-px h-8 bg-border" />
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-xs font-medium">END</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Node Picker Sidebar */}
      <div className="w-72 border-l border-border p-4">
        <h3 className="font-semibold mb-4">Add Node</h3>
        <div className="space-y-2">
          {nodeTypes.map((nodeType) => {
            const Icon = nodeType.icon;
            return (
              <Card
                key={nodeType.type}
                className={cn(
                  "cursor-pointer border transition-all hover:border-primary/50",
                  getNodeStyle(nodeType.type)
                )}
                onClick={() => {
                  setInsertPosition(nodes.length);
                  addNode(nodeType.type as FlowNode["type"]);
                }}
              >
                <CardContent className="p-3 flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", getNodeStyle(nodeType.type))}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">
                      {nodeType.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {nodeType.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Node Editor Dialog */}
      <Dialog open={!!editingNode} onOpenChange={() => setEditingNode(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configure{" "}
              {editingNode &&
                nodeTypes.find((n) => n.type === editingNode.type)?.label}
            </DialogTitle>
          </DialogHeader>

          {editingNode && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Node Title</label>
                <Input
                  value={editingNode.title}
                  onChange={(e) =>
                    setEditingNode({ ...editingNode, title: e.target.value })
                  }
                  placeholder="Enter title"
                />
              </div>

              {editingNode.type === "trigger" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Trigger Type</label>
                  <Select
                    value={
                      (editingNode.config as { triggerType?: string })
                        .triggerType || ""
                    }
                    onValueChange={(v) =>
                      setEditingNode({
                        ...editingNode,
                        config: { ...editingNode.config, triggerType: v },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select trigger" />
                    </SelectTrigger>
                    <SelectContent>
                      {triggerOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {(editingNode.config as { triggerType?: string })
                    .triggerType === "keyword" && (
                    <div className="space-y-2 mt-2">
                      <label className="text-sm font-medium">Keywords</label>
                      <Input
                        value={
                          (editingNode.config as { keywords?: string })
                            .keywords || ""
                        }
                        onChange={(e) =>
                          setEditingNode({
                            ...editingNode,
                            config: {
                              ...editingNode.config,
                              keywords: e.target.value,
                            },
                          })
                        }
                        placeholder="order, status, help"
                      />
                    </div>
                  )}
                </div>
              )}

              {editingNode.type === "message" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message Type</label>
                    <Select
                      value={
                        (editingNode.config as { messageType?: string })
                          .messageType || "text"
                      }
                      onValueChange={(v) =>
                        setEditingNode({
                          ...editingNode,
                          config: { ...editingNode.config, messageType: v },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text Message</SelectItem>
                        <SelectItem value="template">Template</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message Content</label>
                    <Textarea
                      value={
                        (editingNode.config as { content?: string }).content ||
                        ""
                      }
                      onChange={(e) =>
                        setEditingNode({
                          ...editingNode,
                          config: {
                            ...editingNode.config,
                            content: e.target.value,
                          },
                        })
                      }
                      placeholder="Enter your message..."
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      Use {"{{name}}"} for contact name, {"{{phone}}"} for phone
                    </p>
                  </div>
                </div>
              )}

              {editingNode.type === "condition" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Condition Type</label>
                    <Select
                      value={
                        (editingNode.config as { conditionType?: string })
                          .conditionType || ""
                      }
                      onValueChange={(v) =>
                        setEditingNode({
                          ...editingNode,
                          config: { ...editingNode.config, conditionType: v },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="keyword_match">
                          Keyword Match
                        </SelectItem>
                        <SelectItem value="has_tag">Has Tag</SelectItem>
                        <SelectItem value="time_based">Time Based</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Condition Value</label>
                    <Input
                      value={
                        (editingNode.config as { condition?: string })
                          .condition || ""
                      }
                      onChange={(e) =>
                        setEditingNode({
                          ...editingNode,
                          config: {
                            ...editingNode.config,
                            condition: e.target.value,
                          },
                        })
                      }
                      placeholder="Enter condition value"
                    />
                  </div>
                </div>
              )}

              {editingNode.type === "delay" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Duration</label>
                      <Input
                        type="number"
                        value={
                          (editingNode.config as { duration?: number })
                            .duration || 1
                        }
                        onChange={(e) =>
                          setEditingNode({
                            ...editingNode,
                            config: {
                              ...editingNode.config,
                              duration: parseInt(e.target.value),
                            },
                          })
                        }
                        min={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Unit</label>
                      <Select
                        value={
                          (editingNode.config as { unit?: string }).unit ||
                          "minutes"
                        }
                        onValueChange={(v) =>
                          setEditingNode({
                            ...editingNode,
                            config: { ...editingNode.config, unit: v },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minutes">Minutes</SelectItem>
                          <SelectItem value="hours">Hours</SelectItem>
                          <SelectItem value="days">Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {editingNode.type === "action" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Action Type</label>
                    <Select
                      value={
                        (editingNode.config as { actionType?: string })
                          .actionType || ""
                      }
                      onValueChange={(v) =>
                        setEditingNode({
                          ...editingNode,
                          config: { ...editingNode.config, actionType: v },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select action" />
                      </SelectTrigger>
                      <SelectContent>
                        {actionOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Action Value</label>
                    <Input
                      value={
                        (editingNode.config as { actionValue?: string })
                          .actionValue || ""
                      }
                      onChange={(e) =>
                        setEditingNode({
                          ...editingNode,
                          config: {
                            ...editingNode.config,
                            actionValue: e.target.value,
                          },
                        })
                      }
                      placeholder="Enter value"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingNode(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editingNode) {
                  updateNode(editingNode.id, editingNode);
                  setEditingNode(null);
                }
              }}
            >
              Save Node
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
