import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Baby, Heart, Gift, Star, Plus, Copy, Check, ExternalLink,
  Sparkles, Mail, Users, ShoppingBag, Milk, Shirt, Sofa,
  Sun, Moon, Cloud
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { WeddingRegistry, RegistryItem, RegistryGift } from "@shared/schema";

const createRegistrySchema = z.object({
  eventName: z.string().min(1, "Event name is required"),
  eventDate: z.string().optional(),
  eventLocation: z.string().optional(),
  primaryPersonName: z.string().min(1, "Parent name is required"),
  secondaryPersonName: z.string().optional(),
  message: z.string().optional(),
  weddingStory: z.string().optional(),
  themeColor: z.string().default("pink"),
  isPublic: z.boolean().default(true),
  allowCashGifts: z.boolean().default(true),
});

const addItemSchema = z.object({
  productName: z.string().min(1, "Item name is required"),
  productDescription: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  category: z.string().default("nursery"),
  productUrl: z.string().url().optional().or(z.literal("")),
  productImageUrl: z.string().optional(),
  quantityRequested: z.coerce.number().min(1).default(1),
  priority: z.string().default("normal"),
});

type CreateRegistryFormData = z.infer<typeof createRegistrySchema>;
type AddItemFormData = z.infer<typeof addItemSchema>;

const categories = [
  { value: "nursery", label: "Nursery & Sleep", icon: Moon },
  { value: "feeding", label: "Feeding & Bottles", icon: Milk },
  { value: "clothing", label: "Clothing & Outfits", icon: Shirt },
  { value: "gear", label: "Gear & Travel", icon: ShoppingBag },
  { value: "bath", label: "Bath & Skincare", icon: Cloud },
  { value: "toys", label: "Toys & Books", icon: Star },
  { value: "furniture", label: "Furniture", icon: Sofa },
  { value: "diaper", label: "Diapers & Essentials", icon: Baby },
  { value: "experience", label: "Experiences & Services", icon: Sparkles },
  { value: "cash", label: "Baby Fund", icon: Gift },
  { value: "other", label: "Other", icon: Heart },
];

const themeColors = [
  { value: "pink", label: "Sweet Pink", color: "bg-pink-400" },
  { value: "blue", label: "Sky Blue", color: "bg-blue-400" },
  { value: "yellow", label: "Sunny Yellow", color: "bg-yellow-400" },
  { value: "green", label: "Mint Green", color: "bg-green-400" },
  { value: "purple", label: "Lavender", color: "bg-purple-400" },
  { value: "neutral", label: "Neutral Beige", color: "bg-amber-200" },
];

export default function BabyShower() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedRegistry, setSelectedRegistry] = useState<WeddingRegistry | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);

  const { data: registries, isLoading } = useQuery<WeddingRegistry[]>({
    queryKey: ["/api/wedding-registries"],
    enabled: !!user,
  });

  const babyShowerRegistries = registries?.filter(r => r.eventType === "baby_shower") || [];

  const { data: registryItems } = useQuery<RegistryItem[]>({
    queryKey: ["/api/wedding-registries", selectedRegistry?.id, "items"],
    enabled: !!selectedRegistry?.id,
  });

  const { data: registryGifts } = useQuery<RegistryGift[]>({
    queryKey: ["/api/wedding-registries", selectedRegistry?.id, "gifts"],
    enabled: !!selectedRegistry?.id,
  });

  const createForm = useForm<CreateRegistryFormData>({
    resolver: zodResolver(createRegistrySchema),
    defaultValues: {
      eventName: "",
      primaryPersonName: "",
      themeColor: "pink",
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
      category: "nursery",
      quantityRequested: 1,
      priority: "normal",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateRegistryFormData) => {
      return apiRequest("POST", "/api/wedding-registries", {
        ...data,
        eventType: "baby_shower",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wedding-registries"] });
      setShowCreateDialog(false);
      createForm.reset();
      toast({
        title: "Registry Created!",
        description: "Your baby shower registry is ready to share!",
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
        category: "nursery",
        quantityRequested: 1,
        priority: "normal",
      });
      toast({
        title: "Item Added!",
        description: "Gift item has been added to your baby registry!",
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

  const copyShareLink = () => {
    if (selectedRegistry?.shareCode) {
      const link = `${window.location.origin}/registry/${selectedRegistry.shareCode}`;
      navigator.clipboard.writeText(link);
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-pink-950">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Baby className="h-20 w-20 text-pink-400" />
                <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-4 font-serif">
              Baby Shower Registry
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Create an adorable registry for your little one on the way!
            </p>
            <Button size="lg" className="bg-pink-500 hover:bg-pink-600" data-testid="button-login-prompt">
              Sign In to Create Your Registry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-pink-950">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Baby className="h-16 w-16 text-pink-400" />
              <Heart className="h-5 w-5 text-red-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-pink-600 dark:text-pink-400 font-serif">
            Baby Shower Registry
          </h1>
          <p className="text-muted-foreground mt-2">
            Create a beautiful registry to welcome your bundle of joy
          </p>
        </div>

        {!selectedRegistry ? (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Baby Registries</h2>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-pink-500 hover:bg-pink-600" data-testid="button-create-registry">
                    <Plus className="h-4 w-4 mr-2" />
                    New Baby Registry
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Baby className="h-5 w-5 text-pink-500" />
                      Create Baby Shower Registry
                    </DialogTitle>
                    <DialogDescription>
                      Set up your registry to share with friends and family
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...createForm}>
                    <form onSubmit={createForm.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={createForm.control}
                        name="eventName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Baby Johnson's Shower" {...field} data-testid="input-event-name" />
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
                              <FormLabel>Parent Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Sarah Johnson" {...field} data-testid="input-parent-name" />
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
                              <FormLabel>Partner Name (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Mike Johnson" {...field} data-testid="input-partner-name" />
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
                              <FormLabel>Shower Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} data-testid="input-event-date" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={createForm.control}
                          name="themeColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Theme Color</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-theme-color">
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {themeColors.map((color) => (
                                    <SelectItem key={color.value} value={color.value}>
                                      <div className="flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded-full ${color.color}`} />
                                        {color.label}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={createForm.control}
                        name="eventLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Baby Lane, City" {...field} data-testid="input-location" />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={createForm.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Welcome Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="We're so excited to welcome our little one! Thank you for celebrating with us..." 
                                {...field} 
                                data-testid="input-message"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="flex items-center justify-between py-2">
                        <div>
                          <FormLabel>Allow Cash Gifts</FormLabel>
                          <p className="text-sm text-muted-foreground">Let guests contribute to baby fund</p>
                        </div>
                        <FormField
                          control={createForm.control}
                          name="allowCashGifts"
                          render={({ field }) => (
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          )}
                        />
                      </div>

                      <DialogFooter>
                        <Button type="submit" disabled={createMutation.isPending} className="bg-pink-500 hover:bg-pink-600" data-testid="button-submit-registry">
                          {createMutation.isPending ? "Creating..." : "Create Registry"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2 mt-2" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : babyShowerRegistries.length === 0 ? (
              <Card className="border-dashed border-2 border-pink-200 dark:border-pink-800">
                <CardContent className="py-12 text-center">
                  <Baby className="h-16 w-16 mx-auto text-pink-300 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Baby Registries Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first baby shower registry to start adding adorable items!
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)} className="bg-pink-500 hover:bg-pink-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Baby Registry
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {babyShowerRegistries.map((registry) => (
                  <Card 
                    key={registry.id} 
                    className="hover-elevate cursor-pointer border-pink-100 dark:border-pink-900"
                    onClick={() => setSelectedRegistry(registry)}
                    data-testid={`card-registry-${registry.id}`}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-pink-100 dark:bg-pink-900">
                          <Baby className="h-6 w-6 text-pink-500" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{registry.eventName}</CardTitle>
                          <CardDescription>
                            {registry.primaryPersonName}
                            {registry.secondaryPersonName && ` & ${registry.secondaryPersonName}`}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {registry.eventDate && (
                          <span>{new Date(registry.eventDate).toLocaleDateString()}</span>
                        )}
                        <Badge variant={registry.isPublic ? "default" : "secondary"} className="bg-pink-100 text-pink-700 border-pink-200">
                          {registry.isPublic ? "Public" : "Private"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedRegistry(null)} 
              className="mb-4"
              data-testid="button-back"
            >
              Back to Registries
            </Button>

            <Card className="mb-6 overflow-hidden border-pink-100 dark:border-pink-900">
              <div className={`h-24 bg-gradient-to-r ${
                selectedRegistry.themeColor === 'blue' ? 'from-blue-300 to-blue-400' :
                selectedRegistry.themeColor === 'yellow' ? 'from-yellow-300 to-yellow-400' :
                selectedRegistry.themeColor === 'green' ? 'from-green-300 to-green-400' :
                selectedRegistry.themeColor === 'purple' ? 'from-purple-300 to-purple-400' :
                selectedRegistry.themeColor === 'neutral' ? 'from-amber-200 to-amber-300' :
                'from-pink-300 to-pink-400'
              }`}>
                <div className="flex justify-center pt-4">
                  <Sun className="h-8 w-8 text-white/50 animate-pulse" />
                  <Cloud className="h-6 w-6 text-white/70 ml-4" />
                  <Star className="h-5 w-5 text-white/60 ml-6" />
                </div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start gap-4 flex-wrap">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Baby className="h-6 w-6 text-pink-500" />
                      {selectedRegistry.eventName}
                    </CardTitle>
                    <CardDescription className="text-base mt-1">
                      {selectedRegistry.primaryPersonName}
                      {selectedRegistry.secondaryPersonName && ` & ${selectedRegistry.secondaryPersonName}`}
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={copyShareLink} data-testid="button-copy-link">
                    <Copy className="h-4 w-4 mr-2" />
                    Share Link
                  </Button>
                </div>

                {selectedRegistry.message && (
                  <p className="text-muted-foreground mt-4 italic">"{selectedRegistry.message}"</p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-center">
                  <div className="p-4 rounded-lg bg-pink-50 dark:bg-pink-900/20">
                    <Gift className="h-6 w-6 mx-auto text-pink-500 mb-2" />
                    <div className="text-2xl font-bold">{registryItems?.length || 0}</div>
                    <div className="text-xs text-muted-foreground">Items</div>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <Check className="h-6 w-6 mx-auto text-green-500 mb-2" />
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
                  <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <Sparkles className="h-6 w-6 mx-auto text-purple-500 mb-2" />
                    <div className="text-2xl font-bold">{Math.round(progressPercent)}%</div>
                    <div className="text-xs text-muted-foreground">Complete</div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Tabs defaultValue="items" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3 max-w-md">
                <TabsTrigger value="items" data-testid="tab-items">Gift Items</TabsTrigger>
                <TabsTrigger value="gifts" data-testid="tab-gifts">Received</TabsTrigger>
                <TabsTrigger value="thank-you" data-testid="tab-thanks">Thank You</TabsTrigger>
              </TabsList>

              <TabsContent value="items" className="mt-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Registry Items</h3>
                  <Dialog open={showAddItemDialog} onOpenChange={setShowAddItemDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-pink-500 hover:bg-pink-600" data-testid="button-add-item">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add Registry Item</DialogTitle>
                        <DialogDescription>
                          Add a gift item from any store
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
                                  <Input placeholder="e.g., Baby Monitor, Stroller" {...field} data-testid="input-item-name" />
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
                                    <Input type="number" step="0.01" placeholder="0.00" {...field} data-testid="input-price" />
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
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {categories.map((cat) => (
                                        <SelectItem key={cat.value} value={cat.value}>
                                          <div className="flex items-center gap-2">
                                            <cat.icon className="h-4 w-4" />
                                            {cat.label}
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
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
                                  <Textarea placeholder="Add notes about color, size, etc." {...field} data-testid="input-description" />
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
                                  <Input placeholder="https://store.com/product" {...field} data-testid="input-url" />
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
                                    <Input type="number" min="1" {...field} data-testid="input-quantity" />
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
                                      <SelectItem value="must_have">Must Have</SelectItem>
                                      <SelectItem value="high">High</SelectItem>
                                      <SelectItem value="normal">Normal</SelectItem>
                                      <SelectItem value="nice_to_have">Nice to Have</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormItem>
                              )}
                            />
                          </div>

                          <DialogFooter>
                            <Button type="submit" disabled={addItemMutation.isPending} className="bg-pink-500 hover:bg-pink-600" data-testid="button-submit-item">
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
                      const CategoryIcon = categories.find(c => c.value === item.category)?.icon || Gift;
                      return (
                        <Card key={item.id} className={`${fulfilled ? "opacity-75" : ""} border-pink-100 dark:border-pink-900`} data-testid={`card-item-${item.id}`}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex items-center gap-2">
                                <CategoryIcon className="h-4 w-4 text-pink-500" />
                                <CardTitle className="text-base">{item.productName}</CardTitle>
                              </div>
                              {fulfilled && (
                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                  <Check className="h-3 w-3 mr-1" />
                                  Fulfilled
                                </Badge>
                              )}
                            </div>
                            <CardDescription>
                              <Badge variant="outline" className="border-pink-200">
                                {categories.find(c => c.value === item.category)?.label || item.category}
                              </Badge>
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="text-2xl font-bold text-pink-600">${item.price}</div>
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
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <Card className="border-dashed border-2 border-pink-200">
                    <CardContent className="py-12 text-center">
                      <Gift className="h-12 w-12 mx-auto text-pink-300 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Items Yet</h3>
                      <p className="text-muted-foreground">Add your first gift item to your baby registry!</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="gifts" className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Gifts Received</h3>
                {registryGifts && registryGifts.length > 0 ? (
                  <div className="space-y-3">
                    {registryGifts.map((gift) => (
                      <Card key={gift.id} className="border-pink-100 dark:border-pink-900">
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
                  <Card className="border-dashed border-2 border-pink-200">
                    <CardContent className="py-12 text-center">
                      <Users className="h-12 w-12 mx-auto text-pink-300 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Gifts Yet</h3>
                      <p className="text-muted-foreground">Share your registry link to start receiving gifts!</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="thank-you" className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Thank You Notes</h3>
                {registryGifts && registryGifts.filter(g => !g.thankYouSent).length > 0 ? (
                  <div className="space-y-3">
                    {registryGifts.filter(g => !g.thankYouSent).map((gift) => (
                      <Card key={gift.id} className="border-pink-100 dark:border-pink-900">
                        <CardContent className="py-4">
                          <div className="flex items-center justify-between gap-4 flex-wrap">
                            <div>
                              <p className="font-medium">{gift.gifterName}</p>
                              <p className="text-sm text-muted-foreground">{gift.gifterEmail}</p>
                            </div>
                            <Button variant="outline" size="sm" className="border-pink-200">
                              <Mail className="h-4 w-4 mr-2" />
                              Send Thank You
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="border-dashed border-2 border-pink-200">
                    <CardContent className="py-12 text-center">
                      <Check className="h-12 w-12 mx-auto text-green-400 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
                      <p className="text-muted-foreground">You've sent thank you notes to all gift givers.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
