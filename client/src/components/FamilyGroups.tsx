import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Users, Plus, Send, Lock, UserPlus, Copy, Check, 
  MessageCircle, Image, Heart
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FamilyGroupsProps {
  memorialId: string;
  memorialName: string;
  className?: string;
}

interface FamilyGroup {
  id: string;
  name: string;
  description?: string;
  inviteCode: string;
  memberCount?: number;
}

interface GroupMember {
  id: string;
  name?: string;
  email?: string;
  relationship?: string;
  role: string;
  status: string;
}

interface GroupMessage {
  id: string;
  authorName: string;
  content: string;
  mediaUrl?: string;
  createdAt: string;
}

export function FamilyGroups({ memorialId, memorialName, className }: FamilyGroupsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedGroup, setSelectedGroup] = useState<FamilyGroup | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: groups = [] } = useQuery<FamilyGroup[]>({
    queryKey: ["/api/memorials", memorialId, "family-groups"],
    enabled: !!memorialId,
  });

  const { data: messages = [] } = useQuery<GroupMessage[]>({
    queryKey: ["/api/family-groups", selectedGroup?.id, "messages"],
    enabled: !!selectedGroup?.id,
  });

  const { data: members = [] } = useQuery<GroupMember[]>({
    queryKey: ["/api/family-groups", selectedGroup?.id, "members"],
    enabled: !!selectedGroup?.id,
  });

  const createGroupMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      return apiRequest("POST", `/api/memorials/${memorialId}/family-groups`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memorials", memorialId, "family-groups"] });
      setNewGroupName("");
      setNewGroupDescription("");
      setShowCreateDialog(false);
      toast({ title: "Group Created", description: "Your private family group has been created" });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", `/api/family-groups/${selectedGroup?.id}/messages`, {
        content,
        authorName: "Family Member",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/family-groups", selectedGroup?.id, "messages"] });
      setNewMessage("");
    },
  });

  const copyInviteCode = async () => {
    if (!selectedGroup) return;
    try {
      await navigator.clipboard.writeText(selectedGroup.inviteCode);
      setCopiedCode(true);
      toast({ title: "Copied!", description: "Invite code copied to clipboard" });
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      toast({ title: "Error", description: "Failed to copy invite code", variant: "destructive" });
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    sendMessageMutation.mutate(newMessage);
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    createGroupMutation.mutate({ name: newGroupName, description: newGroupDescription });
  };

  return (
    <Card className={cn("", className)} data-testid="family-groups">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lock className="h-5 w-5 text-primary" />
            Private Family Groups
          </CardTitle>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="sm" data-testid="button-create-group">
                <Plus className="h-4 w-4 mr-1" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Private Family Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Group Name</label>
                  <Input
                    placeholder="e.g., Immediate Family, Close Friends"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    data-testid="input-group-name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description (optional)</label>
                  <Textarea
                    placeholder="A private space for our family to share memories..."
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    data-testid="input-group-description"
                  />
                </div>
                <Button 
                  onClick={handleCreateGroup} 
                  className="w-full"
                  disabled={!newGroupName.trim() || createGroupMutation.isPending}
                  data-testid="button-confirm-create"
                >
                  {createGroupMutation.isPending ? "Creating..." : "Create Group"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {groups.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <Users className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <div>
              <p className="text-muted-foreground">No family groups yet</p>
              <p className="text-sm text-muted-foreground/70">
                Create a private space for close family to share memories
              </p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Your Groups</h4>
              {groups.map((group) => (
                <button
                  key={group.id}
                  onClick={() => setSelectedGroup(group)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border transition-colors",
                    selectedGroup?.id === group.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                  data-testid={`button-group-${group.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="font-medium">{group.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {group.memberCount || 0} members
                    </Badge>
                  </div>
                  {group.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                      {group.description}
                    </p>
                  )}
                </button>
              ))}
            </div>

            {selectedGroup && (
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted/50 p-3 border-b flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{selectedGroup.name}</h4>
                    <p className="text-xs text-muted-foreground">{members.length} members</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={copyInviteCode}
                    data-testid="button-copy-invite"
                  >
                    {copiedCode ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <ScrollArea className="h-48 p-3">
                  {messages.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No messages yet</p>
                      <p className="text-xs">Start a conversation with your family</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <div key={msg.id} className="flex gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {msg.authorName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-baseline gap-2">
                              <span className="text-sm font-medium">{msg.authorName}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(msg.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>

                <div className="border-t p-2 flex gap-2">
                  <Input
                    placeholder="Share a memory..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                    data-testid="input-message"
                  />
                  <Button 
                    size="icon" 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sendMessageMutation.isPending}
                    data-testid="button-send"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
