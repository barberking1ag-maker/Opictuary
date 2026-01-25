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

function TreeVisualization({ leaves, hasAccess }: { leaves: FamilyTreeLeaf[]; hasAccess: boolean }) {
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
                className="relative group"
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

function PricingSection({ onSubscribe, isLoading }: { onSubscribe: (type: string, cycle: string) => void; isLoading: boolean }) {
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

export default function FamilyTree() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAddLeafDialog, setShowAddLeafDialog] = useState(false);
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

  const handleSubscribe = async (type: string, cycle: string) => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to start your family tree subscription.",
      });
      return;
    }
    toast({
      title: "Coming Soon",
      description: "Subscription payments will be available soon!",
    });
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
        <PricingSection onSubscribe={handleSubscribe} isLoading={false} />
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
        <PricingSection onSubscribe={handleSubscribe} isLoading={false} />
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
                <TreeVisualization leaves={leaves} hasAccess={hasActiveSubscription || leaves.length <= 3} />
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
            <PricingSection onSubscribe={handleSubscribe} isLoading={false} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
