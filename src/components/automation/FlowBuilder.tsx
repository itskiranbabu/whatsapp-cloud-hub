import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
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
  UserCheck,
  Webhook,
  Globe,
  Split,
  Database,
  Send,
  Tag,
  GripVertical,
  Copy,
  CornerDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FlowNode {
  id: string;
  type: "trigger" | "message" | "condition" | "delay" | "action" | "api_call" | "webhook" | "split";
  title: string;
  config: Record<string, unknown>;
  position: number;
  branches?: FlowBranch[];
}

export interface FlowBranch {
  id: string;
  label: string;
  condition: string;
  nodes: FlowNode[];
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
    category: "start",
  },
  {
    type: "message",
    label: "Send Message",
    icon: MessageSquare,
    color: "bg-primary/10 text-primary border-primary/30",
    description: "Send a WhatsApp message",
    category: "communication",
  },
  {
    type: "condition",
    label: "Condition",
    icon: GitBranch,
    color: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    description: "Branch based on conditions",
    category: "logic",
  },
  {
    type: "split",
    label: "A/B Split",
    icon: Split,
    color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/30",
    description: "Split traffic for A/B testing",
    category: "logic",
  },
  {
    type: "delay",
    label: "Wait/Delay",
    icon: Clock,
    color: "bg-purple-500/10 text-purple-600 border-purple-500/30",
    description: "Wait before continuing",
    category: "timing",
  },
  {
    type: "action",
    label: "Action",
    icon: UserCheck,
    color: "bg-green-500/10 text-green-600 border-green-500/30",
    description: "Perform an action",
    category: "actions",
  },
  {
    type: "api_call",
    label: "API Call",
    icon: Globe,
    color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/30",
    description: "Call an external API",
    category: "integrations",
  },
  {
    type: "webhook",
    label: "Webhook",
    icon: Webhook,
    color: "bg-orange-500/10 text-orange-600 border-orange-500/30",
    description: "Receive webhook events",
    category: "integrations",
  },
];

const triggerOptions = [
  { value: "keyword", label: "Keyword Match" },
  { value: "new_contact", label: "New Contact Created" },
  { value: "cart_abandoned", label: "Cart Abandoned" },
  { value: "appointment", label: "Appointment Reminder" },
  { value: "order_status", label: "Order Status Change" },
  { value: "payment_received", label: "Payment Received" },
  { value: "form_submit", label: "Form Submission" },
  { value: "manual", label: "Manual Trigger" },
];

const actionOptions = [
  { value: "add_tag", label: "Add Tag to Contact" },
  { value: "remove_tag", label: "Remove Tag" },
  { value: "assign_agent", label: "Assign to Agent" },
  { value: "update_contact", label: "Update Contact" },
  { value: "create_ticket", label: "Create Support Ticket" },
  { value: "send_email", label: "Send Email Notification" },
  { value: "add_to_campaign", label: "Add to Campaign" },
  { value: "update_crm", label: "Update CRM Record" },
];

const httpMethods = [
  { value: "GET", label: "GET" },
  { value: "POST", label: "POST" },
  { value: "PUT", label: "PUT" },
  { value: "PATCH", label: "PATCH" },
  { value: "DELETE", label: "DELETE" },
];

const conditionTypes = [
  { value: "keyword_match", label: "Keyword Match" },
  { value: "has_tag", label: "Has Tag" },
  { value: "no_tag", label: "Does Not Have Tag" },
  { value: "time_based", label: "Time Based" },
  { value: "contact_attribute", label: "Contact Attribute" },
  { value: "message_count", label: "Message Count" },
  { value: "api_response", label: "API Response Value" },
];

export const FlowBuilder = ({
  flowName,
  onFlowNameChange,
  nodes,
  onNodesChange,
  onSave,
  onTest,
}: FlowBuilderProps) => {
  const [editingNode, setEditingNode] = useState<FlowNode | null>(null);
  const [insertPosition, setInsertPosition] = useState<number>(0);
  const [draggedNode, setDraggedNode] = useState<FlowNode | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const addNode = useCallback(
    (type: FlowNode["type"]) => {
      const nodeType = nodeTypes.find((n) => n.type === type);
      const newNode: FlowNode = {
        id: `node_${Date.now()}`,
        type,
        title: nodeType?.label || "Node",
        config: type === "split" ? { splitRatio: 50 } : {},
        position: insertPosition,
        branches: type === "split" || type === "condition" ? [
          { id: `branch_${Date.now()}_a`, label: type === "split" ? "Path A (50%)" : "Yes", condition: "true", nodes: [] },
          { id: `branch_${Date.now()}_b`, label: type === "split" ? "Path B (50%)" : "No", condition: "false", nodes: [] },
        ] : undefined,
      };

      const updatedNodes = [...nodes];
      updatedNodes.splice(insertPosition, 0, newNode);
      updatedNodes.forEach((n, i) => (n.position = i));
      onNodesChange(updatedNodes);
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

  const duplicateNode = useCallback(
    (node: FlowNode) => {
      const newNode: FlowNode = {
        ...node,
        id: `node_${Date.now()}`,
        title: `${node.title} (Copy)`,
        position: node.position + 1,
      };
      const updatedNodes = [...nodes];
      updatedNodes.splice(node.position + 1, 0, newNode);
      updatedNodes.forEach((n, i) => (n.position = i));
      onNodesChange(updatedNodes);
    },
    [nodes, onNodesChange]
  );

  const handleDragStart = (e: React.DragEvent, node: FlowNode) => {
    setDraggedNode(node);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (!draggedNode) return;

    const updatedNodes = nodes.filter((n) => n.id !== draggedNode.id);
    updatedNodes.splice(targetIndex, 0, draggedNode);
    updatedNodes.forEach((n, i) => (n.position = i));
    onNodesChange(updatedNodes);
    setDraggedNode(null);
  };

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

  const groupedNodeTypes = {
    start: nodeTypes.filter((n) => n.category === "start"),
    communication: nodeTypes.filter((n) => n.category === "communication"),
    logic: nodeTypes.filter((n) => n.category === "logic"),
    timing: nodeTypes.filter((n) => n.category === "timing"),
    actions: nodeTypes.filter((n) => n.category === "actions"),
    integrations: nodeTypes.filter((n) => n.category === "integrations"),
  };

  return (
    <div className="flex h-full gap-6 p-4">
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
            <Badge variant="outline" className="gap-1">
              <Database className="w-3 h-3" />
              {nodes.length} nodes
            </Badge>
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
          <div 
            ref={canvasRef}
            className="flex flex-col items-center py-8 px-4 min-h-[500px]"
          >
            {/* Start Node */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
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
                    addNode("trigger");
                  }}
                  className="rounded-full w-10 h-10 p-0 border-dashed border-2 hover:border-primary hover:bg-primary/5"
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <p className="text-muted-foreground text-sm mt-4">
                  Click to add a trigger to start your automation
                </p>
              </>
            ) : (
              nodes.map((node, index) => {
                const NodeIcon = getNodeIcon(node.type);
                return (
                  <div 
                    key={node.id} 
                    className="flex flex-col items-center"
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <div className="w-px h-6 bg-border" />
                    <ArrowDown className="w-4 h-4 text-muted-foreground -my-1" />
                    <div className="w-px h-6 bg-border" />

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group"
                      draggable
                      onDragStart={(e) => handleDragStart(e as any, node)}
                    >
                      <Card
                        className={cn(
                          "w-80 cursor-pointer border-2 transition-all hover:shadow-lg",
                          getNodeStyle(node.type),
                          draggedNode?.id === node.id && "opacity-50"
                        )}
                        onClick={() => setEditingNode(node)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                              <GripVertical className="w-4 h-4 text-muted-foreground" />
                            </div>
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
                                  (triggerOptions.find(o => o.value === (node.config as { triggerType?: string }).triggerType)?.label || "Configure trigger")}
                                {node.type === "message" &&
                                  ((node.config as { content?: string }).content?.substring(0, 30) || "Set message content")}
                                {node.type === "condition" &&
                                  ((node.config as { condition?: string }).condition || "Set condition")}
                                {node.type === "delay" &&
                                  `Wait ${(node.config as { duration?: number }).duration || 0} ${(node.config as { unit?: string }).unit || "minutes"}`}
                                {node.type === "action" &&
                                  (actionOptions.find(o => o.value === (node.config as { actionType?: string }).actionType)?.label || "Configure action")}
                                {node.type === "api_call" &&
                                  ((node.config as { url?: string }).url || "Configure API endpoint")}
                                {node.type === "webhook" &&
                                  ((node.config as { webhookUrl?: string }).webhookUrl || "Set webhook URL")}
                                {node.type === "split" &&
                                  `A/B Split (${(node.config as { splitRatio?: number }).splitRatio || 50}%)`}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  duplicateNode(node);
                                }}
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNode(node.id);
                                }}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                          
                          {/* Show branches for split/condition nodes */}
                          {(node.type === "split" || node.type === "condition") && node.branches && (
                            <div className="mt-3 pt-3 border-t border-border/50">
                              <div className="flex gap-2">
                                {node.branches.map((branch, idx) => (
                                  <Badge 
                                    key={branch.id} 
                                    variant="outline" 
                                    className="gap-1 text-xs"
                                  >
                                    <CornerDownRight className="w-3 h-3" />
                                    {branch.label}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
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
                          }}
                          className="rounded-full w-10 h-10 p-0 border-dashed border-2 hover:border-primary hover:bg-primary/5"
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
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shadow">
                  <span className="text-xs font-medium">END</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Node Picker Sidebar */}
      <div className="w-80 border-l border-border">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Add Node</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Click or drag nodes to add them to your flow
              </p>
            </div>

            {Object.entries(groupedNodeTypes).map(([category, types]) => (
              <div key={category}>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  {category}
                </h4>
                <div className="space-y-2">
                  {types.map((nodeType) => {
                    const Icon = nodeType.icon;
                    return (
                      <Card
                        key={nodeType.type}
                        className={cn(
                          "cursor-pointer border transition-all hover:border-primary/50 hover:shadow-sm",
                          getNodeStyle(nodeType.type)
                        )}
                        draggable
                        onClick={() => {
                          setInsertPosition(nodes.length);
                          addNode(nodeType.type as FlowNode["type"]);
                        }}
                      >
                        <CardContent className="p-3 flex items-center gap-3">
                          <div className={cn("p-2 rounded-lg", getNodeStyle(nodeType.type))}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
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
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Node Editor Dialog */}
      <Dialog open={!!editingNode} onOpenChange={() => setEditingNode(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
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

              {/* Trigger Configuration */}
              {editingNode.type === "trigger" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Trigger Type</label>
                    <Select
                      value={(editingNode.config as { triggerType?: string }).triggerType || ""}
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
                  </div>
                  
                  {(editingNode.config as { triggerType?: string }).triggerType === "keyword" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Keywords (comma-separated)</label>
                      <Input
                        value={(editingNode.config as { keywords?: string }).keywords || ""}
                        onChange={(e) =>
                          setEditingNode({
                            ...editingNode,
                            config: { ...editingNode.config, keywords: e.target.value },
                          })
                        }
                        placeholder="order, status, help, hi"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Message Configuration */}
              {editingNode.type === "message" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message Type</label>
                    <Select
                      value={(editingNode.config as { messageType?: string }).messageType || "text"}
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
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="interactive">Interactive Buttons</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message Content</label>
                    <Textarea
                      value={(editingNode.config as { content?: string }).content || ""}
                      onChange={(e) =>
                        setEditingNode({
                          ...editingNode,
                          config: { ...editingNode.config, content: e.target.value },
                        })
                      }
                      placeholder="Enter your message..."
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      Use {"{{name}}"} for contact name, {"{{phone}}"} for phone, {"{{order_id}}"} for order
                    </p>
                  </div>
                </div>
              )}

              {/* Condition Configuration */}
              {editingNode.type === "condition" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Condition Type</label>
                    <Select
                      value={(editingNode.config as { conditionType?: string }).conditionType || ""}
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
                        {conditionTypes.map((ct) => (
                          <SelectItem key={ct.value} value={ct.value}>
                            {ct.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Condition Value</label>
                    <Input
                      value={(editingNode.config as { condition?: string }).condition || ""}
                      onChange={(e) =>
                        setEditingNode({
                          ...editingNode,
                          config: { ...editingNode.config, condition: e.target.value },
                        })
                      }
                      placeholder="Enter condition value"
                    />
                  </div>
                </div>
              )}

              {/* Delay Configuration */}
              {editingNode.type === "delay" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Duration</label>
                      <Input
                        type="number"
                        value={(editingNode.config as { duration?: number }).duration || 1}
                        onChange={(e) =>
                          setEditingNode({
                            ...editingNode,
                            config: { ...editingNode.config, duration: parseInt(e.target.value) },
                          })
                        }
                        min={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Unit</label>
                      <Select
                        value={(editingNode.config as { unit?: string }).unit || "minutes"}
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
                          <SelectItem value="seconds">Seconds</SelectItem>
                          <SelectItem value="minutes">Minutes</SelectItem>
                          <SelectItem value="hours">Hours</SelectItem>
                          <SelectItem value="days">Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Configuration */}
              {editingNode.type === "action" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Action Type</label>
                    <Select
                      value={(editingNode.config as { actionType?: string }).actionType || ""}
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
                      value={(editingNode.config as { actionValue?: string }).actionValue || ""}
                      onChange={(e) =>
                        setEditingNode({
                          ...editingNode,
                          config: { ...editingNode.config, actionValue: e.target.value },
                        })
                      }
                      placeholder="Enter value"
                    />
                  </div>
                </div>
              )}

              {/* API Call Configuration */}
              {editingNode.type === "api_call" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">HTTP Method</label>
                    <Select
                      value={(editingNode.config as { method?: string }).method || "GET"}
                      onValueChange={(v) =>
                        setEditingNode({
                          ...editingNode,
                          config: { ...editingNode.config, method: v },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {httpMethods.map((m) => (
                          <SelectItem key={m.value} value={m.value}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">API URL</label>
                    <Input
                      value={(editingNode.config as { url?: string }).url || ""}
                      onChange={(e) =>
                        setEditingNode({
                          ...editingNode,
                          config: { ...editingNode.config, url: e.target.value },
                        })
                      }
                      placeholder="https://api.example.com/endpoint"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Headers (JSON)</label>
                    <Textarea
                      value={(editingNode.config as { headers?: string }).headers || "{}"}
                      onChange={(e) =>
                        setEditingNode({
                          ...editingNode,
                          config: { ...editingNode.config, headers: e.target.value },
                        })
                      }
                      placeholder='{"Authorization": "Bearer token"}'
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Request Body (JSON)</label>
                    <Textarea
                      value={(editingNode.config as { body?: string }).body || ""}
                      onChange={(e) =>
                        setEditingNode({
                          ...editingNode,
                          config: { ...editingNode.config, body: e.target.value },
                        })
                      }
                      placeholder='{"key": "value"}'
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Store Response As</label>
                    <Input
                      value={(editingNode.config as { responseVariable?: string }).responseVariable || "api_response"}
                      onChange={(e) =>
                        setEditingNode({
                          ...editingNode,
                          config: { ...editingNode.config, responseVariable: e.target.value },
                        })
                      }
                      placeholder="api_response"
                    />
                    <p className="text-xs text-muted-foreground">
                      Access in later nodes as {"{{api_response.field}}"}
                    </p>
                  </div>
                </div>
              )}

              {/* Webhook Configuration */}
              {editingNode.type === "webhook" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Webhook URL</label>
                    <Input
                      value={(editingNode.config as { webhookUrl?: string }).webhookUrl || ""}
                      onChange={(e) =>
                        setEditingNode({
                          ...editingNode,
                          config: { ...editingNode.config, webhookUrl: e.target.value },
                        })
                      }
                      placeholder="https://your-app.com/webhook"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Secret Key (Optional)</label>
                    <Input
                      value={(editingNode.config as { secret?: string }).secret || ""}
                      onChange={(e) =>
                        setEditingNode({
                          ...editingNode,
                          config: { ...editingNode.config, secret: e.target.value },
                        })
                      }
                      placeholder="webhook_secret_key"
                      type="password"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Include Contact Data</label>
                    <Switch
                      checked={(editingNode.config as { includeContact?: boolean }).includeContact ?? true}
                      onCheckedChange={(v) =>
                        setEditingNode({
                          ...editingNode,
                          config: { ...editingNode.config, includeContact: v },
                        })
                      }
                    />
                  </div>
                </div>
              )}

              {/* Split Configuration */}
              {editingNode.type === "split" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Split Ratio (Path A %)</label>
                    <Input
                      type="number"
                      min={1}
                      max={99}
                      value={(editingNode.config as { splitRatio?: number }).splitRatio || 50}
                      onChange={(e) => {
                        const ratio = Math.min(99, Math.max(1, parseInt(e.target.value) || 50));
                        setEditingNode({
                          ...editingNode,
                          config: { ...editingNode.config, splitRatio: ratio },
                          branches: [
                            { id: editingNode.branches?.[0]?.id || `branch_a`, label: `Path A (${ratio}%)`, condition: "true", nodes: [] },
                            { id: editingNode.branches?.[1]?.id || `branch_b`, label: `Path B (${100 - ratio}%)`, condition: "false", nodes: [] },
                          ],
                        });
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Path A: {(editingNode.config as { splitRatio?: number }).splitRatio || 50}% | 
                      Path B: {100 - ((editingNode.config as { splitRatio?: number }).splitRatio || 50)}%
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Track Conversion</label>
                    <Switch
                      checked={(editingNode.config as { trackConversion?: boolean }).trackConversion ?? true}
                      onCheckedChange={(v) =>
                        setEditingNode({
                          ...editingNode,
                          config: { ...editingNode.config, trackConversion: v },
                        })
                      }
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
