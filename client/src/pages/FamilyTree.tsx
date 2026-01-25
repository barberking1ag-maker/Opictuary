import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  TreeDeciduous, Leaf, Plus, Users, Crown, Baby, Heart, 
  CreditCard, Check, Lock, Image, MessageSquare, Calendar,
  Mail, Sparkles, ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User, FamilyTree as FamilyTreeType, FamilyTreeLeaf, FamilyTreeSubscription } from "@shared/schema";

const pricingPlans = {
  primary: {
    monthly: 9.99,
    annual: 95.90,
    annualSavings: 24,
  },
  family: {
    monthly: 5.00,
    annual: 48.00,
    annualSavings: 12,
  },
};

const relationshipTypes = [
  { value: "self", label: "Myself", icon: Crown },
  { value: "parent", label: "Parent", icon: Crown },
  { value: "child", label: "Child", icon: Baby },
  { value: "sibling", label: "Sibling", icon: Users },
  { value: "spouse", label: "Spouse/Partner", icon: Heart },
  { value: "grandparent", label: "Grandparent", icon: Crown },
  { value: "grandchild", label: "Grandchild", icon: Baby },
  { value: "aunt_uncle", label: "Aunt/Uncle", icon: Users },
  { value: "niece_nephew", label: "Niece/Nephew", icon: Users },
  { value: "cousin", label: "Cousin", icon: Users },
];

const treeFormSchema = z.object({
  name: z.string().min(1, "Tree name is required"),
  description: z.string().optional(),
});

const leafFormSchema = z.object({
  personName: z.string().min(1, "Name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  birthDate: z.string().optional(),
  invitedEmail: z.string().email().optional().or(z.literal("")),
});

type TreeFormData = z.infer<typeof treeFormSchema>;
type LeafFormData = z.infer<typeof leafFormSchema>;

interface LeafContent {
  id: string;
  leafId: string;
  contentType: string;
  title?: string;
  content?: string;
  mediaUrl?: string;
  scheduledDeliveryDate?: string;
  isDelivered?: boolean;
  createdAt?: string;
}

function TreeVisualization({ leaves, hasAccess, onLeafClick }: { leaves: FamilyTreeLeaf[]; hasAccess: boolean; onLeafClick?: (leaf: FamilyTreeLeaf) => void }) {
  const groupedByGeneration = leaves.reduce((acc, leaf) => {
    const gen = leaf.generation || 0;
    if (!acc[gen]) acc[gen] = [];
    acc[gen].push(leaf);
    return acc;
  }, {} as Record<number, FamilyTreeLeaf[]>);

  const sortedGenerations = Object.keys(groupedByGeneration)
    .map(Number)
    .sort((a, b) => a - b);

  if (leaves.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <TreeDeciduous className="w-24 h-24 text-primary/30 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Your Tree is Ready to Grow</h3>
        <p className="text-muted-foreground max-w-md">
          Start by adding yourself, then invite family members to connect their leaves and build your family legacy together.
        </p>
      </div>
    );
  }

  return (
    <div className="relative py-8">
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 -translate-x-1/2" />
      
      {sortedGenerations.map((generation) => (
        <div key={generation} className="relative mb-8">
          <div className="text-center mb-4">
            <Badge variant="secondary" className="text-xs">
              {generation === 0 ? "You" : generation < 0 ? `${Math.abs(generation)} Generation${Math.abs(generation) > 1 ? "s" : ""} Up` : `${generation} Generation${generation > 1 ? "s" : ""} Down`}
            </Badge>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {groupedByGeneration[generation].map((leaf) => (
              <div 
                key={leaf.id} 
                className="relative group cursor-pointer"
                onClick={() => hasAccess && onLeafClick?.(leaf)}
                data-testid={`leaf-card-${leaf.id}`}
              >
                <div className={`
                  flex flex-col items-center p-4 rounded-2xl transition-all
                  ${hasAccess ? 'bg-card border border-border hover-elevate' : 'bg-muted/50 opacity-60'}
                `}>
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-br from-green-400 to-green-600 rounded-full opacity-20 animate-pulse" />
                    <Avatar className="w-16 h-16 border-2 border-primary/30">
                      <AvatarImage src={leaf.profilePhoto || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                        {leaf.personName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <Leaf className="absolute -bottom-1 -right-1 w-5 h-5 text-green-500 fill-green-500/30" />
                  </div>
                  
                  <p className="mt-2 font-medium text-sm text-center max-w-[120px] truncate">
                    {hasAccess ? leaf.personName : "••••••"}
                  </p>
                  
                  <Badge variant="outline" className="mt-1 text-xs">
                    {relationshipTypes.find(r => r.value === leaf.relationship)?.label || leaf.relationship}
                  </Badge>
                  
                  {leaf.invitationStatus === "pending" && leaf.invitedEmail && (
                    <Badge variant="secondary" className="mt-1 text-xs gap-1">
                      <Mail className="w-3 h-3" />
                      Invited
                    </Badge>
                  )}
                  
                  {hasAccess && (
                    <p className="text-xs text-muted-foreground mt-2">Click to view</p>
                  )}
                </div>
                
                {!hasAccess && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const contentFormSchema = z.object({
  contentType: z.enum(['story', 'photo', 'video', 'future_message']),
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  mediaUrl: z.string().optional(),
  scheduledDeliveryDate: z.string().optional(),
});

type ContentFormData = z.infer<typeof contentFormSchema>;

function LeafContentDialog({ 
  leaf, 
  open, 
  onOpenChange 
}: { 
  leaf: FamilyTreeLeaf | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  
  const form = useForm<ContentFormData>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      contentType: 'story',
      title: '',
      content: '',
      mediaUrl: '',
    },
  });

  const { data: contents = [], isLoading } = useQuery<LeafContent[]>({
    queryKey: ['/api/family-trees/leaves', leaf?.id, 'content'],
    enabled: !!leaf?.id && open,
  });

  const addContentMutation = useMutation({
    mutationFn: async (data: ContentFormData) => {
      const res = await apiRequest(`/api/family-trees/leaves/${leaf?.id}/content`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/family-trees/leaves', leaf?.id, 'content'] });
      toast({ title: "Content Added", description: "Your content has been saved to this leaf." });
      setShowAddForm(false);
      form.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add content.", variant: "destructive" });
    },
  });

  const deleteContentMutation = useMutation({
    mutationFn: async (contentId: string) => {
      await apiRequest(`/api/family-trees/leaves/${leaf?.id}/content/${contentId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/family-trees/leaves', leaf?.id, 'content'] });
      toast({ title: "Deleted", description: "Content has been removed." });
    },
  });

  if (!leaf) return null;

  const onSubmit = (data: ContentFormData) => {
    addContentMutation.mutate(data);
  };

  const contentTypeIcons: Record<string, any> = {
    story: MessageSquare,
    photo: Image,
    video: Image,
    future_message: Calendar,
    document: MessageSquare,
    audio: MessageSquare,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={leaf.profilePhoto || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {leaf.personName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <span>{leaf.personName}</span>
              <p className="text-sm font-normal text-muted-foreground">
                {relationshipTypes.find(r => r.value === leaf.relationship)?.label}
                {leaf.birthDate && ` • Born ${leaf.birthDate}`}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Stories & Memories</h3>
            <Button 
              size="sm" 
              onClick={() => setShowAddForm(!showAddForm)}
              data-testid="button-add-content"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Content
            </Button>
          </div>

          {showAddForm && (
            <Card className="p-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="contentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-content-type">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="story">Story / Memory</SelectItem>
                            <SelectItem value="photo">Photo</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="future_message">Future Message</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Give this memory a title" data-testid="input-content-title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch('contentType') === 'story' && (
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Story</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Share a story or memory..." 
                              className="min-h-[120px]"
                              data-testid="textarea-content"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {(form.watch('contentType') === 'photo' || form.watch('contentType') === 'video') && (
                    <FormField
                      control={form.control}
                      name="mediaUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Media URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://..." data-testid="input-media-url" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {form.watch('contentType') === 'future_message' && (
                    <>
                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Write a message to be delivered in the future..." 
                                className="min-h-[100px]"
                                data-testid="textarea-future-message"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="scheduledDeliveryDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Delivery Date</FormLabel>
                            <FormControl>
                              <Input {...field} type="date" data-testid="input-delivery-date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  <div className="flex gap-2">
                    <Button type="submit" disabled={addContentMutation.isPending} data-testid="button-save-content">
                      {addContentMutation.isPending ? "Saving..." : "Save Content"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </Card>
          )}

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading content...</div>
          ) : contents.length === 0 ? (
            <Card className="p-8 text-center">
              <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h4 className="font-medium mb-2">No content yet</h4>
              <p className="text-sm text-muted-foreground">
                Add stories, photos, and memories to preserve this person's legacy.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {contents.map((item) => {
                const IconComponent = contentTypeIcons[item.contentType] || MessageSquare;
                return (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-medium">{item.title}</h4>
                          <Badge variant="secondary" className="text-xs capitalize">
                            {item.contentType.replace('_', ' ')}
                          </Badge>
                        </div>
                        {item.content && (
                          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                            {item.content}
                          </p>
                        )}
                        {item.mediaUrl && (
                          <img 
                            src={item.mediaUrl} 
                            alt={item.title} 
                            className="mt-2 rounded-lg max-h-48 object-cover"
                          />
                        )}
                        {item.scheduledDeliveryDate && (
                          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Scheduled for {new Date(item.scheduledDeliveryDate).toLocaleDateString()}
                            {item.isDelivered && <Badge variant="secondary" className="ml-2">Delivered</Badge>}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteContentMutation.mutate(item.id)}
                        data-testid={`button-delete-content-${item.id}`}
                      >
                        <span className="text-destructive">×</span>
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PricingSection({ onSubscribe, onJoinTree, isLoading }: { onSubscribe: (type: string, cycle: string) => void; onJoinTree: () => void; isLoading: boolean }) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  return (
    <div className="py-12 px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-bold mb-2">Grow Your Family Legacy</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Start your family tree and invite loved ones to add their leaves. 
          Content stays forever, even if subscriptions lapse.
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-8">
        <Button
          variant={billingCycle === "monthly" ? "default" : "outline"}
          size="sm"
          onClick={() => setBillingCycle("monthly")}
          data-testid="billing-monthly"
        >
          Monthly
        </Button>
        <Button
          variant={billingCycle === "annual" ? "default" : "outline"}
          size="sm"
          onClick={() => setBillingCycle("annual")}
          data-testid="billing-annual"
        >
          Annual
          <Badge variant="secondary" className="ml-2">Save 20%</Badge>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
            Start Here
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" />
              Primary Owner
            </CardTitle>
            <CardDescription>Start your family tree</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="text-4xl font-bold">
                ${billingCycle === "monthly" ? pricingPlans.primary.monthly.toFixed(2) : pricingPlans.primary.annual.toFixed(2)}
              </span>
              <span className="text-muted-foreground">/{billingCycle === "monthly" ? "month" : "year"}</span>
              {billingCycle === "annual" && (
                <p className="text-sm text-green-600 mt-1">
                  Save ${pricingPlans.primary.annualSavings}/year
                </p>
              )}
            </div>
            <ul className="space-y-2 text-sm mb-6">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Create your family tree
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Unlimited leaves on your tree
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Add photos, stories & future messages
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Invite family members
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Content preserved forever
              </li>
            </ul>
            <Button 
              className="w-full" 
              onClick={() => onSubscribe("primary", billingCycle)}
              disabled={isLoading}
              data-testid="button-subscribe-primary"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Start Your Tree
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Family Member
            </CardTitle>
            <CardDescription>Join a family tree</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="text-4xl font-bold">
                ${billingCycle === "monthly" ? pricingPlans.family.monthly.toFixed(2) : pricingPlans.family.annual.toFixed(2)}
              </span>
              <span className="text-muted-foreground">/{billingCycle === "monthly" ? "month" : "year"}</span>
              {billingCycle === "annual" && (
                <p className="text-sm text-green-600 mt-1">
                  Save ${pricingPlans.family.annualSavings}/year
                </p>
              )}
            </div>
            <ul className="space-y-2 text-sm mb-6">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Connect to an existing tree
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Add content to your leaf
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                View all family leaves
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Schedule future messages
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Your content stays forever
              </li>
            </ul>
            <Button 
              variant="outline" 
              className="w-full"
              disabled={isLoading}
              onClick={onJoinTree}
              data-testid="button-subscribe-family"
            >
              Join with Invite Code
            </Button>
          </CardContent>
        </Card>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Cancel anytime. Your content remains on the tree even after cancellation, 
        but viewing requires an active subscription.
      </p>
    </div>
  );
}

function JoinTreeDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const [inviteCode, setInviteCode] = useState("");
  const [foundTree, setFoundTree] = useState<FamilyTreeType | null>(null);
  const [joinForm, setJoinForm] = useState({ personName: "", relationship: "sibling", birthDate: "" });

  const lookupMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await apiRequest("/api/family-trees/join", {
        method: "POST",
        body: JSON.stringify({ inviteCode: code }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to find tree");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setFoundTree(data.tree);
      toast({ title: "Tree Found!", description: `You can now join "${data.tree.name}"` });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const joinMutation = useMutation({
    mutationFn: async () => {
      if (!foundTree) throw new Error("No tree selected");
      const res = await apiRequest(`/api/family-trees/${foundTree.id}/join-as-leaf`, {
        method: "POST",
        body: JSON.stringify(joinForm),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to join");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/family-trees/my-trees"] });
      toast({ title: "Welcome!", description: "You've joined the family tree!" });
      onOpenChange(false);
      setFoundTree(null);
      setInviteCode("");
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join a Family Tree</DialogTitle>
          <DialogDescription>
            Enter the invite code shared by a family member to join their tree.
          </DialogDescription>
        </DialogHeader>
        
        {!foundTree ? (
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="invite-code">Invite Code</Label>
              <Input
                id="invite-code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="Enter 8-character code"
                className="font-mono text-lg tracking-widest"
                maxLength={8}
                data-testid="input-invite-code"
              />
            </div>
            <Button 
              onClick={() => lookupMutation.mutate(inviteCode)}
              disabled={inviteCode.length < 4 || lookupMutation.isPending}
              className="w-full"
              data-testid="button-lookup-tree"
            >
              {lookupMutation.isPending ? "Looking up..." : "Find Tree"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <Card className="p-4 bg-green-500/10 border-green-500/30">
              <div className="flex items-center gap-3">
                <TreeDeciduous className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="font-semibold">{foundTree.name}</h3>
                  <p className="text-sm text-muted-foreground">{foundTree.description || "A family legacy"}</p>
                </div>
              </div>
            </Card>
            
            <div>
              <Label htmlFor="join-name">Your Name</Label>
              <Input
                id="join-name"
                value={joinForm.personName}
                onChange={(e) => setJoinForm(f => ({ ...f, personName: e.target.value }))}
                placeholder="Your full name"
                data-testid="input-join-name"
              />
            </div>
            
            <div>
              <Label htmlFor="join-relationship">Your Relationship to Tree Creator</Label>
              <Select 
                value={joinForm.relationship} 
                onValueChange={(v) => setJoinForm(f => ({ ...f, relationship: v }))}
              >
                <SelectTrigger data-testid="select-join-relationship">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {relationshipTypes.filter(r => r.value !== 'self').map(r => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="join-birthdate">Birth Date (optional)</Label>
              <Input
                id="join-birthdate"
                type="date"
                value={joinForm.birthDate}
                onChange={(e) => setJoinForm(f => ({ ...f, birthDate: e.target.value }))}
                data-testid="input-join-birthdate"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => joinMutation.mutate()}
                disabled={!joinForm.personName || joinMutation.isPending}
                className="flex-1"
                data-testid="button-join-tree"
              >
                {joinMutation.isPending ? "Joining..." : "Join Tree"}
              </Button>
              <Button variant="outline" onClick={() => setFoundTree(null)}>
                Back
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function FamilyTree() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAddLeafDialog, setShowAddLeafDialog] = useState(false);
  const [selectedLeaf, setSelectedLeaf] = useState<FamilyTreeLeaf | null>(null);
  const [showLeafDialog, setShowLeafDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const { toast } = useToast();

  const { data: user } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const { data: myTrees = [], isLoading: treesLoading } = useQuery<FamilyTreeType[]>({
    queryKey: ["/api/family-trees/my-trees"],
    enabled: !!user,
  });

  const { data: subscription } = useQuery<FamilyTreeSubscription>({
    queryKey: ["/api/family-trees/subscription"],
    enabled: !!user,
  });

  const activeTree = myTrees[0];
  const hasActiveSubscription = subscription?.status === "active" && subscription?.hasActiveAccess;

  const { data: leaves = [] } = useQuery<FamilyTreeLeaf[]>({
    queryKey: [`/api/family-trees/${activeTree?.id}/leaves`],
    enabled: !!activeTree?.id,
  });

  const treeForm = useForm<TreeFormData>({
    resolver: zodResolver(treeFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const leafForm = useForm<LeafFormData>({
    resolver: zodResolver(leafFormSchema),
    defaultValues: {
      personName: "",
      relationship: "",
      birthDate: "",
      invitedEmail: "",
    },
  });

  const createTreeMutation = useMutation({
    mutationFn: async (data: TreeFormData) => {
      const res = await apiRequest("POST", "/api/family-trees", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/family-trees/my-trees"] });
      setShowCreateDialog(false);
      treeForm.reset();
      toast({
        title: "Family Tree Created!",
        description: "Your family tree has been created. Start adding leaves!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create family tree. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addLeafMutation = useMutation({
    mutationFn: async (data: LeafFormData) => {
      const res = await apiRequest("POST", `/api/family-trees/${activeTree?.id}/leaves`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/family-trees/${activeTree?.id}/leaves`] });
      setShowAddLeafDialog(false);
      leafForm.reset();
      toast({
        title: "Leaf Added!",
        description: "A new leaf has been added to your family tree.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add leaf. Please try again.",
        variant: "destructive",
      });
    },
  });

  const [subscribeLoading, setSubscribeLoading] = useState(false);

  const handleSubscribe = async (type: string, cycle: string) => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to start your family tree subscription.",
      });
      return;
    }

    // Need a tree first - create one if none exists
    let treeId = activeTree?.id;
    
    if (!treeId) {
      // Will need to create tree first via the dialog
      toast({
        title: "Create Your Tree First",
        description: "Use the 'Create Your Tree' form above to start, then subscribe.",
      });
      return;
    }

    setSubscribeLoading(true);
    
    try {
      const response = await apiRequest("/api/stripe/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({
          type: "family_tree_subscription",
          treeId,
          subscriptionTier: type === "primary" ? "primary" : "family",
          billingPeriod: cycle === "annual" ? "yearly" : "monthly",
          userId: user.id,
          successUrl: `${window.location.origin}/family-tree?success=true`,
          cancelUrl: `${window.location.origin}/family-tree?canceled=true`,
          customerEmail: user.email,
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Subscription Error",
        description: "Unable to start subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubscribeLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background" data-testid="family-tree-page">
        <div className="bg-gradient-to-br from-green-900/20 via-primary/10 to-background border-b border-border">
          <div className="max-w-6xl mx-auto px-4 py-16 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <TreeDeciduous className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4">
              Family Tree
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Build your family legacy across generations. Add your leaf, invite family members, 
              and create a living tree of memories that lasts forever.
            </p>
            <Link href="/api/login">
              <Button size="lg" className="gap-2" data-testid="button-login-tree">
                Sign In to Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
        <PricingSection onSubscribe={handleSubscribe} onJoinTree={() => setShowJoinDialog(true)} isLoading={subscribeLoading} />
      </div>
    );
  }

  if (!activeTree && !treesLoading) {
    return (
      <div className="min-h-screen bg-background" data-testid="family-tree-page">
        <div className="bg-gradient-to-br from-green-900/20 via-primary/10 to-background border-b border-border">
          <div className="max-w-6xl mx-auto px-4 py-16 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <TreeDeciduous className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4">
              Start Your Family Tree
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Create a lasting legacy for your family. Add stories, photos, and future messages 
              that will be preserved across generations.
            </p>
            
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2" data-testid="button-create-tree">
                  <Plus className="w-5 h-5" />
                  Create Your Family Tree
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Your Family Tree</DialogTitle>
                  <DialogDescription>
                    Give your family tree a name to get started.
                  </DialogDescription>
                </DialogHeader>
                <Form {...treeForm}>
                  <form onSubmit={treeForm.handleSubmit((data) => createTreeMutation.mutate(data))} className="space-y-4">
                    <FormField
                      control={treeForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tree Name</FormLabel>
                          <FormControl>
                            <Input placeholder="The Johnson Family Tree" {...field} data-testid="input-tree-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={treeForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="A brief description of your family..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" disabled={createTreeMutation.isPending} data-testid="button-submit-tree">
                        {createTreeMutation.isPending ? "Creating..." : "Create Tree"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <PricingSection onSubscribe={handleSubscribe} onJoinTree={() => setShowJoinDialog(true)} isLoading={subscribeLoading} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="family-tree-page">
      <div className="bg-gradient-to-br from-green-900/20 via-primary/10 to-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <TreeDeciduous className="w-8 h-8 text-green-600" />
                <h1 className="text-3xl font-serif font-bold">{activeTree?.name || "Family Tree"}</h1>
              </div>
              <p className="text-muted-foreground">
                {leaves.length} {leaves.length === 1 ? "leaf" : "leaves"} on your tree
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {!hasActiveSubscription && (
                <Badge variant="secondary" className="gap-1">
                  <Lock className="w-3 h-3" />
                  Limited Access
                </Badge>
              )}
              
              <Dialog open={showAddLeafDialog} onOpenChange={setShowAddLeafDialog}>
                <DialogTrigger asChild>
                  <Button className="gap-2" data-testid="button-add-leaf">
                    <Plus className="w-4 h-4" />
                    Add Leaf
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add a New Leaf</DialogTitle>
                    <DialogDescription>
                      Add a family member to your tree. You can invite them to add their own content.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...leafForm}>
                    <form onSubmit={leafForm.handleSubmit((data) => addLeafMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={leafForm.control}
                        name="personName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Full name" {...field} data-testid="input-leaf-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={leafForm.control}
                        name="relationship"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relationship to You</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-relationship">
                                  <SelectValue placeholder="Select relationship" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {relationshipTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={leafForm.control}
                        name="birthDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Birth Date (Optional)</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={leafForm.control}
                        name="invitedEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email to Invite (Optional)</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="family@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button type="submit" disabled={addLeafMutation.isPending} data-testid="button-submit-leaf">
                          {addLeafMutation.isPending ? "Adding..." : "Add Leaf"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="tree" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="tree" className="gap-2" data-testid="tab-tree">
              <TreeDeciduous className="w-4 h-4" />
              Tree View
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-2" data-testid="tab-content">
              <MessageSquare className="w-4 h-4" />
              My Content
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2" data-testid="tab-settings">
              <CreditCard className="w-4 h-4" />
              Subscription
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tree">
            <Card>
              <CardContent className="pt-6">
                <TreeVisualization 
                  leaves={leaves} 
                  hasAccess={hasActiveSubscription || leaves.length <= 3}
                  onLeafClick={(leaf) => {
                    setSelectedLeaf(leaf);
                    setShowLeafDialog(true);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Your Leaf Content</CardTitle>
                <CardDescription>
                  Add stories, photos, and future messages to your leaf
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-24 flex-col gap-2" data-testid="button-add-story">
                    <MessageSquare className="w-6 h-6 text-primary" />
                    <span>Add Story</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col gap-2" data-testid="button-add-photo">
                    <Image className="w-6 h-6 text-primary" />
                    <span>Add Photo</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col gap-2" data-testid="button-add-future-message">
                    <Calendar className="w-6 h-6 text-primary" />
                    <span>Future Message</span>
                  </Button>
                </div>
                
                <div className="mt-8 text-center py-8 border-2 border-dashed border-border rounded-lg">
                  <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">Start Building Your Legacy</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Add content to your leaf that will be preserved for future generations. 
                    Your stories, photos, and messages will live on forever.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <PricingSection onSubscribe={handleSubscribe} onJoinTree={() => setShowJoinDialog(true)} isLoading={subscribeLoading} />
          </TabsContent>
        </Tabs>
      </div>

      <LeafContentDialog 
        leaf={selectedLeaf}
        open={showLeafDialog}
        onOpenChange={setShowLeafDialog}
      />

      <JoinTreeDialog
        open={showJoinDialog}
        onOpenChange={setShowJoinDialog}
      />
    </div>
  );
}
