import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Users,
  UserPlus,
  Tag,
  MessageSquare,
  Edit2,
  Trash2,
  Mail,
  Loader2,
} from "lucide-react";
import { ContactImportExport } from "@/components/contacts/ContactImportExport";
import { ContextualHelp } from "@/components/help/ContextualHelp";
import { HelpTooltip } from "@/components/help/HelpTooltip";
import { useContacts } from "@/hooks/useContacts";
import { useTenants } from "@/hooks/useTenants";
import { format } from "date-fns";

const Contacts = () => {
  const { currentTenant } = useTenants();
  const { contacts, isLoading, createContact, deleteContact, bulkDelete, bulkAddTag } = useContacts();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showTagDialog, setShowTagDialog] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", phone: "", email: "" });
  const [newTag, setNewTag] = useState("");

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map((c) => c.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedContacts.includes(id)) {
      setSelectedContacts(selectedContacts.filter((i) => i !== id));
    } else {
      setSelectedContacts([...selectedContacts, id]);
    }
  };

  const handleAddContact = async () => {
    if (!newContact.phone) return;
    
    await createContact.mutateAsync({
      name: newContact.name || null,
      phone: newContact.phone,
      email: newContact.email || null,
    });
    
    setNewContact({ name: "", phone: "", email: "" });
    setShowAddDialog(false);
  };

  const handleImportComplete = async (importedContacts: { name: string; phone: string; email?: string; tags?: string[] }[]) => {
    // The import happens through the component, but we could do bulk insert here if needed
    console.log("Imported contacts:", importedContacts);
  };

  const handleBulkDelete = async () => {
    if (selectedContacts.length === 0) return;
    await bulkDelete.mutateAsync(selectedContacts);
    setSelectedContacts([]);
  };

  const handleBulkAddTag = async () => {
    if (!newTag || selectedContacts.length === 0) return;
    await bulkAddTag.mutateAsync({ contactIds: selectedContacts, tag: newTag });
    setNewTag("");
    setShowTagDialog(false);
    setSelectedContacts([]);
  };

  const subscribedCount = contacts.filter((c) => c.opted_in).length;

  return (
    <DashboardLayout
      title="Contacts"
      subtitle="Manage your contact list and segments"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Contextual Help */}
        <ContextualHelp
          title="Contact Management Tips"
          description="Build your contact list to start sending WhatsApp messages. Ensure all contacts have opted in to receive messages."
          variant="tip"
          tips={[
            "Always get explicit consent before adding contacts - WhatsApp requires opt-in",
            "Use tags to segment your audience for targeted campaigns",
            "Import contacts via CSV for bulk additions - include phone, name, and email columns",
            "Contacts without opt-in cannot receive marketing messages",
          ]}
          defaultExpanded={false}
        />

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="metric-card-primary">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Contacts</p>
                  <p className="text-2xl font-bold">{contacts.length.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <Users className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="metric-card-success">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Opted In</p>
                  <p className="text-2xl font-bold">{subscribedCount.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-green-500/10">
                  <UserPlus className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="metric-card-info">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">With Tags</p>
                  <p className="text-2xl font-bold">
                    {contacts.filter((c) => c.tags && c.tags.length > 0).length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <Tag className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="metric-card-warning">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Recently Active</p>
                  <p className="text-2xl font-bold">
                    {contacts.filter((c) => {
                      if (!c.last_message_at) return false;
                      const dayAgo = new Date();
                      dayAgo.setDate(dayAgo.getDate() - 1);
                      return new Date(c.last_message_at) > dayAgo;
                    }).length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10">
                  <MessageSquare className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <ContactImportExport
              onImportComplete={handleImportComplete}
              existingContacts={contacts.map((c) => ({
                name: c.name || "",
                phone: c.phone,
                email: c.email || undefined,
                tags: c.tags || undefined,
              }))}
              tenantId={currentTenant?.id || ""}
            />
            <Button className="btn-whatsapp gap-2" onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4" />
              Add Contact
            </Button>
          </div>
        </div>

        {/* Selected Actions */}
        {selectedContacts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20"
          >
            <span className="text-sm font-medium">
              {selectedContacts.length} contact(s) selected
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1.5"
                onClick={() => setShowTagDialog(true)}
              >
                <Tag className="w-3.5 h-3.5" />
                Add Tag
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1.5 text-destructive"
                onClick={handleBulkDelete}
                disabled={bulkDelete.isPending}
              >
                {bulkDelete.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                Delete
              </Button>
            </div>
          </motion.div>
        )}

        {/* Contacts Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg">No contacts yet</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Add your first contact or import from a CSV file
                </p>
                <Button className="mt-4" onClick={() => setShowAddDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Contact
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Last Message</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map((contact, index) => (
                    <motion.tr
                      key={contact.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="group hover:bg-muted/50"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedContacts.includes(contact.id)}
                          onCheckedChange={() => toggleSelect(contact.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-9 h-9">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.name || contact.phone}`}
                            />
                            <AvatarFallback>{contact.name?.[0] || contact.phone[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{contact.name || "Unknown"}</p>
                            <p className="text-xs text-muted-foreground">{contact.email || "-"}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {contact.phone}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {contact.tags?.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {contact.tags && contact.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{contact.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {contact.last_message_at
                          ? format(new Date(contact.last_message_at), "MMM d, h:mm a")
                          : "Never"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={contact.opted_in ? "default" : "secondary"}
                          className={
                            contact.opted_in
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : ""
                          }
                        >
                          {contact.opted_in ? "Opted In" : "Not Opted"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit2 className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            {contact.email && (
                              <DropdownMenuItem>
                                <Mail className="w-4 h-4 mr-2" />
                                Send Email
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => deleteContact.mutate(contact.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Contact Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                placeholder="+91 98765 43210"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddContact}
              disabled={!newContact.phone || createContact.isPending}
            >
              {createContact.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Add Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Tag Dialog */}
      <Dialog open={showTagDialog} onOpenChange={setShowTagDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tag to Selected Contacts</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tag">Tag Name</Label>
              <Input
                id="tag"
                placeholder="e.g., VIP, Lead, Customer"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              This tag will be added to {selectedContacts.length} selected contact(s).
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTagDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleBulkAddTag}
              disabled={!newTag || bulkAddTag.isPending}
            >
              {bulkAddTag.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Add Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Contacts;
