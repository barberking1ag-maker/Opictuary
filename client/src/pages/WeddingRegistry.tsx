import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Heart, Gift, DollarSign, Users, Video, Plus, Share2, Copy, Check,
  ExternalLink, Trash2, Edit, Calendar, MapPin, Clock, Send,
  CreditCard, Wallet, CheckCircle, Mail, Lock, Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User, WeddingRegistry as WeddingRegistryType, RegistryItem, RegistryGift } from "@shared/schema";

const createRegistrySchema = z.object({
  eventName: z.string().min(2, "Event name is required"),
  eventType: z.string().default("wedding"),
  eventDate: z.string().optional(),
  eventLocation: z.string().optional(),
  primaryPersonName: z.string().min(1, "Your name is required"),
  secondaryPersonName: z.string().optional(),
  weddingStory: z.string().optional(),
  cashGiftGoal: z.string().optional(),
  isPublic: z.boolean().default(true),
  allowCashGifts: z.boolean().default(true),
});

const addItemSchema = z.object({
  productName: z.string().min(1, "Item name is required"),
  productDescription: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  category: z.string().default("home"),
  productUrl: z.string().url().optional().or(z.literal("")),
  productImageUrl: z.string().optional(),
  quantityRequested: z.coerce.number().min(1).default(1),
  priority: z.string().default("normal"),
});

type CreateRegistryFormData = z.infer<typeof createRegistrySchema>;
type AddItemFormData = z.infer<typeof addItemSchema>;

const categories = [
  { value: "home", label: "Home & Living" },
  { value: "kitchen", label: "Kitchen" },
  { value: "bedroom", label: "Bedroom" },
  { value: "bathroom", label: "Bathroom" },
  { value: "outdoor", label: "Outdoor" },
  { value: "experience", label: "Experiences" },
  { value: "honeymoon", label: "Honeymoon Fund" },
  { value: "cash", label: "Cash Contribution" },
  { value: "other", label: "Other" },
];

export default function WeddingRegistry() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [selectedRegistry, setSelectedRegistry] = useState<WeddingRegistryType | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const { toast } = useToast();

  const { data: user } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const { data: myRegistries, isLoading } = useQuery<WeddingRegistryType[]>({
    queryKey: ["/api/wedding-registries/my"],
    enabled: !!user,
  });

  const { data: registryItems } = useQuery<RegistryItem[]>({
    queryKey: ["/api/wedding-registries", selectedRegistry?.id, "items"],
    enabled: !!selectedRegistry,
  });

  const { data: registryGifts } = useQuery<RegistryGift[]>({
    queryKey: ["/api/wedding-registries", selectedRegistry?.id, "gifts"],
    enabled: !!selectedRegistry,
  });

  const createForm = useForm<CreateRegistryFormData>({
    resolver: zodResolver(createRegistrySchema),
    defaultValues: {
      eventName: "",
      eventType: "wedding",
      primaryPersonName: "",
      secondaryPersonName: "",
      isPublic: true,
      allowCashGifts: true,
    },
  });

  const addItemForm = useForm<AddItemFormData>({
    resolver: zodResolver(addItemSchema),
    defaultValues: {
      productName: "",
      productDescription: "",
      price: "",
      category: "home",
      quantityRequested: 1,
      priority: "normal",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateRegistryFormData) => {
      return apiRequest("POST", "/api/wedding-registries", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wedding-registries/my"] });
      setShowCreateDialog(false);
      createForm.reset();
      toast({
        title: "Registry Created",
        description: "Your gift registry has been created successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create registry",
        variant: "destructive",
      });
    },
  });

  const addItemMutation = useMutation({
    mutationFn: async (data: AddItemFormData) => {
      return apiRequest("POST", `/api/wedding-registries/${selectedRegistry?.id}/items`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wedding-registries", selectedRegistry?.id, "items"] });
      setShowAddItemDialog(false);
      addItemForm.reset({
        productName: "",
        productDescription: "",
        price: "",
        category: "home",
        quantityRequested: 1,
        priority: "normal",
      });
      toast({
        title: "Item Added",
        description: "Gift item has been added to your registry!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add item",
        variant: "destructive",
      });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      return apiRequest("DELETE", `/api/registry-items/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wedding-registries", selectedRegistry?.id, "items"] });
      toast({ title: "Item Removed" });
    },
  });

  const copyShareLink = async () => {
    if (selectedRegistry) {
      const link = `${window.location.origin}/registry/${selectedRegistry.shareCode}`;
      await navigator.clipboard.writeText(link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      toast({ title: "Link Copied!", description: "Share this link with your guests" });
    }
  };

  const totalGiftValue = registryItems?.reduce((sum, item) => {
    const price = parseFloat(item.price || "0");
    return sum + (price * (item.quantityPurchased || 0));
  }, 0) || 0;

  const totalNeededValue = registryItems?.reduce((sum, item) => {
    const price = parseFloat(item.price || "0");
    return sum + (price * (item.quantityRequested || 1));
  }, 0) || 0;

  const progressPercent = totalNeededValue > 0 ? (totalGiftValue / totalNeededValue) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-900 dark:to-rose-950">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="h-10 w-10 text-rose-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent">
              Wedding Gift Registry
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create beautiful gift registries, accept cash gifts, and share your special day with everyone.
          </p>
        </div>

        {!user ? (
          <Card className="max-w-lg mx-auto">
            <CardHeader className="text-center">
              <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <CardTitle>Sign In Required</CardTitle>
              <CardDescription>
                Please sign in to create and manage your wedding registry
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
              <Button asChild data-testid="button-login-registry">
                <Link href="/login">Sign In to Get Started</Link>
              </Button>
            </CardFooter>
          </Card>
        ) : selectedRegistry ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <Button variant="ghost" onClick={() => setSelectedRegistry(null)} data-testid="button-back-registries">
                  Back to Registries
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={copyShareLink} data-testid="button-copy-link">
                  {copiedLink ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copiedLink ? "Copied!" : "Copy Link"}
                </Button>
                <Button variant="outline" asChild data-testid="button-preview-registry">
                  <Link href={`/registry/${selectedRegistry.shareCode}`}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Preview
                  </Link>
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <CardTitle className="text-2xl">{selectedRegistry.eventName}</CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-4 mt-2">
                      {selectedRegistry.eventDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(selectedRegistry.eventDate).toLocaleDateString()}
                        </span>
                      )}
                      {selectedRegistry.eventLocation && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {selectedRegistry.eventLocation}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <Badge variant={selectedRegistry.isPublic ? "default" : "secondary"}>
                    {selectedRegistry.isPublic ? <Globe className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
                    {selectedRegistry.isPublic ? "Public" : "Private"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Registry Progress</span>
                      <span className="font-medium">${totalGiftValue.toFixed(2)} of ${totalNeededValue.toFixed(2)}</span>
                    </div>
                    <Progress value={progressPercent} className="h-3" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-900/20">
                      <Gift className="h-6 w-6 mx-auto text-rose-500 mb-2" />
                      <div className="text-2xl font-bold">{registryItems?.length || 0}</div>
                      <div className="text-xs text-muted-foreground">Items</div>
                    </div>
                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                      <CheckCircle className="h-6 w-6 mx-auto text-green-500 mb-2" />
                      <div className="text-2xl font-bold">{registryGifts?.length || 0}</div>
                      <div className="text-xs text-muted-foreground">Gifts Received</div>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <Mail className="h-6 w-6 mx-auto text-blue-500 mb-2" />
                      <div className="text-2xl font-bold">
                        {registryGifts?.filter(g => !g.thankYouSent).length || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Pending Thanks</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="items" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="items" data-testid="tab-items">
                  <Gift className="h-4 w-4 mr-2" />
                  Gift Items
                </TabsTrigger>
                <TabsTrigger value="gifts" data-testid="tab-gifts">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Received Gifts
                </TabsTrigger>
                <TabsTrigger value="thank-you" data-testid="tab-thank-you">
                  <Send className="h-4 w-4 mr-2" />
                  Thank You Notes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="items" className="mt-6">
                <div className="flex justify-between mb-4">
                  <h3 className="text-lg font-semibold">Registry Items</h3>
                  <Dialog open={showAddItemDialog} onOpenChange={setShowAddItemDialog}>
                    <DialogTrigger asChild>
                      <Button data-testid="button-add-item">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Add Gift Item</DialogTitle>
                        <DialogDescription>
                          Add an item to your registry from any store
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...addItemForm}>
                        <form onSubmit={addItemForm.handleSubmit((data) => addItemMutation.mutate(data))} className="space-y-4">
                          <FormField
                            control={addItemForm.control}
                            name="productName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Item Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., KitchenAid Stand Mixer" {...field} data-testid="input-item-name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={addItemForm.control}
                              name="price"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Price ($)</FormLabel>
                                  <FormControl>
                                    <Input type="number" step="0.01" placeholder="299.99" {...field} data-testid="input-item-price" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={addItemForm.control}
                              name="category"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Category</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger data-testid="select-category">
                                        <SelectValue placeholder="Select category" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {categories.map(cat => (
                                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={addItemForm.control}
                            name="productDescription"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Add notes about color, size, etc." {...field} data-testid="input-item-description" />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={addItemForm.control}
                            name="productUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Product Link (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://amazon.com/..." {...field} data-testid="input-item-url" />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={addItemForm.control}
                              name="quantityRequested"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Quantity Needed</FormLabel>
                                  <FormControl>
                                    <Input type="number" min="1" {...field} data-testid="input-item-quantity" />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={addItemForm.control}
                              name="priority"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Priority</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger data-testid="select-priority">
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="high">High</SelectItem>
                                      <SelectItem value="medium">Medium</SelectItem>
                                      <SelectItem value="low">Low</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormItem>
                              )}
                            />
                          </div>

                          <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowAddItemDialog(false)}>
                              Cancel
                            </Button>
                            <Button type="submit" disabled={addItemMutation.isPending} data-testid="button-submit-item">
                              {addItemMutation.isPending ? "Adding..." : "Add Item"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>

                {registryItems && registryItems.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {registryItems.map((item) => {
                      const fulfilled = (item.quantityPurchased || 0) >= (item.quantityRequested || 1);
                      return (
                        <Card key={item.id} className={fulfilled ? "opacity-75" : ""} data-testid={`card-item-${item.id}`}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start gap-2">
                              <CardTitle className="text-base">{item.productName}</CardTitle>
                              {fulfilled && (
                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                  <Check className="h-3 w-3 mr-1" />
                                  Fulfilled
                                </Badge>
                              )}
                            </div>
                            <CardDescription>
                              <Badge variant="outline">{categories.find(c => c.value === item.category)?.label || item.category}</Badge>
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="text-2xl font-bold text-rose-600">${item.price}</div>
                            {item.productDescription && (
                              <p className="text-sm text-muted-foreground mt-2">{item.productDescription}</p>
                            )}
                            <div className="flex items-center justify-between mt-3 text-sm">
                              <span>{item.quantityPurchased || 0} of {item.quantityRequested || 1} purchased</span>
                              <Progress value={((item.quantityPurchased || 0) / (item.quantityRequested || 1)) * 100} className="w-20 h-2" />
                            </div>
                          </CardContent>
                          <CardFooter className="pt-2 gap-2">
                            {item.productUrl && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={item.productUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  View
                                </a>
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => deleteItemMutation.mutate(item.id)}
                              data-testid={`button-delete-item-${item.id}`}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Items Yet</h3>
                      <p className="text-muted-foreground mb-4">Add items from any store to your registry</p>
                      <Button onClick={() => setShowAddItemDialog(true)} data-testid="button-add-first-item">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Item
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="gifts" className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Received Gifts</h3>
                {registryGifts && registryGifts.length > 0 ? (
                  <div className="space-y-3">
                    {registryGifts.map((gift) => (
                      <Card key={gift.id} data-testid={`card-gift-${gift.id}`}>
                        <CardContent className="py-4">
                          <div className="flex items-center justify-between gap-4 flex-wrap">
                            <div>
                              <p className="font-medium">{gift.gifterName || "Anonymous"}</p>
                              <p className="text-sm text-muted-foreground">{gift.gifterEmail}</p>
                              {gift.giftMessage && (
                                <p className="text-sm mt-2 italic">"{gift.giftMessage}"</p>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">
                                ${gift.amount || "0"}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {gift.createdAt ? new Date(gift.createdAt).toLocaleDateString() : ""}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Gifts Yet</h3>
                      <p className="text-muted-foreground">Share your registry link to start receiving gifts</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="thank-you" className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Thank You Notes</h3>
                {registryGifts && registryGifts.filter(g => !g.thankYouSent).length > 0 ? (
                  <div className="space-y-3">
                    {registryGifts.filter(g => !g.thankYouSent).map((gift) => (
                      <Card key={gift.id}>
                        <CardContent className="py-4">
                          <div className="flex items-center justify-between gap-4 flex-wrap">
                            <div>
                              <p className="font-medium">{gift.gifterName}</p>
                              <p className="text-sm text-muted-foreground">{gift.gifterEmail}</p>
                            </div>
                            <Button size="sm" data-testid={`button-send-thanks-${gift.id}`}>
                              <Send className="h-4 w-4 mr-2" />
                              Send Thank You
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
                      <p className="text-muted-foreground">You've thanked all your gift givers</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-6">
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-rose-500 to-pink-500" data-testid="button-create-registry">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Registry
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-rose-500" />
                      Create Your Gift Registry
                    </DialogTitle>
                  </DialogHeader>
                  
                  <Form {...createForm}>
                    <form onSubmit={createForm.handleSubmit((data) => createMutation.mutate(data))} className="space-y-6">
                      <FormField
                        control={createForm.control}
                        name="eventName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., John & Jane's Wedding" {...field} data-testid="input-event-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={createForm.control}
                          name="primaryPersonName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" {...field} data-testid="input-primary-name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={createForm.control}
                          name="secondaryPersonName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Partner's Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Partner's name" {...field} data-testid="input-secondary-name" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={createForm.control}
                          name="eventDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Wedding Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} data-testid="input-event-date" />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={createForm.control}
                          name="eventLocation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="City, State" {...field} data-testid="input-event-location" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={createForm.control}
                        name="weddingStory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Story (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Share how you met, your journey together..." 
                                className="min-h-24"
                                {...field} 
                                data-testid="input-wedding-story"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <Separator />

                      <div className="space-y-4">
                        <h4 className="font-medium">Settings</h4>
                        
                        <FormField
                          control={createForm.control}
                          name="allowCashGifts"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between p-4 rounded-lg border">
                              <div>
                                <FormLabel className="text-base">Accept Cash Gifts</FormLabel>
                                <FormDescription>
                                  Allow guests to contribute money through secure payment
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="switch-cash-gifts"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={createForm.control}
                          name="cashGiftGoal"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cash Gift Goal (Optional)</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="5000" {...field} data-testid="input-cash-goal" />
                              </FormControl>
                              <FormDescription>Set a honeymoon or house fund goal</FormDescription>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={createForm.control}
                          name="isPublic"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between p-4 rounded-lg border">
                              <div>
                                <FormLabel className="text-base">Public Registry</FormLabel>
                                <FormDescription>
                                  Allow anyone with the link to view
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="switch-public"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={createMutation.isPending}
                          className="bg-gradient-to-r from-rose-500 to-pink-500"
                          data-testid="button-submit-registry"
                        >
                          {createMutation.isPending ? "Creating..." : "Create Registry"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2 mt-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-gray-200 rounded w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : myRegistries && myRegistries.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {myRegistries.map((registry) => (
                  <Card 
                    key={registry.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer" 
                    onClick={() => setSelectedRegistry(registry)}
                    data-testid={`card-registry-${registry.id}`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-xl">{registry.eventName}</CardTitle>
                        <Badge variant={registry.isPublic ? "default" : "secondary"}>
                          {registry.isPublic ? "Public" : "Private"}
                        </Badge>
                      </div>
                      <CardDescription className="flex flex-wrap items-center gap-3">
                        {registry.eventDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(registry.eventDate).toLocaleDateString()}
                          </span>
                        )}
                        {registry.eventLocation && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {registry.eventLocation}
                          </span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{registry.primaryPersonName}</span>
                          {registry.secondaryPersonName && (
                            <>
                              <span className="text-muted-foreground">&</span>
                              <span className="text-sm">{registry.secondaryPersonName}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" data-testid={`button-manage-${registry.id}`}>
                        Manage Registry
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="max-w-2xl mx-auto text-center">
                <CardContent className="pt-8 pb-8">
                  <Heart className="h-16 w-16 mx-auto text-rose-300 mb-6" />
                  <h3 className="text-2xl font-bold mb-3">Create Your First Registry</h3>
                  <p className="text-muted-foreground mb-6">
                    Build a beautiful gift registry for your wedding day
                  </p>
                  <Button 
                    onClick={() => setShowCreateDialog(true)} 
                    className="bg-gradient-to-r from-rose-500 to-pink-500"
                    data-testid="button-create-first-registry"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Registry
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="mt-12 grid gap-6 md:grid-cols-4">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Gift className="h-10 w-10 mx-auto text-rose-500 mb-3" />
                  <h3 className="font-semibold">Gift Registry</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add items from any store
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <DollarSign className="h-10 w-10 mx-auto text-green-500 mb-3" />
                  <h3 className="font-semibold">Cash Gifts</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Accept secure payments
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Users className="h-10 w-10 mx-auto text-blue-500 mb-3" />
                  <h3 className="font-semibold">Guest Management</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Track RSVPs & notes
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Video className="h-10 w-10 mx-auto text-purple-500 mb-3" />
                  <h3 className="font-semibold">Live Stream</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Share with remote guests
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
