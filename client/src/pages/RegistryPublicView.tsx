import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useParams } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Heart, Gift, DollarSign, Calendar, MapPin, Check, ShoppingCart,
  ExternalLink, CreditCard, Lock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { WeddingRegistry, RegistryItem } from "@shared/schema";

const purchaseSchema = z.object({
  gifterName: z.string().min(1, "Your name is required"),
  gifterEmail: z.string().email("Valid email required"),
  giftMessage: z.string().optional(),
  quantity: z.coerce.number().min(1).default(1),
});

type PurchaseFormData = z.infer<typeof purchaseSchema>;

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

export default function RegistryPublicView() {
  const { shareCode } = useParams<{ shareCode: string }>();
  const [selectedItem, setSelectedItem] = useState<RegistryItem | null>(null);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const { toast } = useToast();

  const { data: registry, isLoading: registryLoading, error } = useQuery<WeddingRegistry>({
    queryKey: ["/api/wedding-registries/share", shareCode],
    enabled: !!shareCode,
  });

  const { data: items } = useQuery<RegistryItem[]>({
    queryKey: ["/api/wedding-registries", registry?.id, "items"],
    enabled: !!registry?.id,
  });

  const purchaseForm = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      gifterName: "",
      gifterEmail: "",
      giftMessage: "",
      quantity: 1,
    },
  });

  const purchaseMutation = useMutation({
    mutationFn: async (data: PurchaseFormData) => {
      return apiRequest("POST", `/api/wedding-registries/${registry?.id}/gifts`, {
        registryItemId: selectedItem?.id,
        ...data,
        amount: selectedItem?.price,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wedding-registries", registry?.id, "items"] });
      setShowPurchaseDialog(false);
      setSelectedItem(null);
      purchaseForm.reset();
      toast({
        title: "Gift Reserved!",
        description: "Thank you for your generous gift. The couple will be notified.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reserve gift",
        variant: "destructive",
      });
    },
  });

  if (registryLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-900 dark:to-rose-950">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Card className="animate-pulse">
              <CardHeader>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !registry) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-900 dark:to-rose-950">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-lg mx-auto text-center">
            <Card>
              <CardHeader>
                <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <CardTitle>Registry Not Found</CardTitle>
                <CardDescription>
                  This registry doesn't exist or is private.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const totalValue = items?.reduce((sum, item) => {
    const price = parseFloat(item.price || "0");
    return sum + (price * (item.quantityPurchased || 0));
  }, 0) || 0;

  const totalNeeded = items?.reduce((sum, item) => {
    const price = parseFloat(item.price || "0");
    return sum + (price * (item.quantityRequested || 1));
  }, 0) || 0;

  const progressPercent = totalNeeded > 0 ? (totalValue / totalNeeded) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-900 dark:to-rose-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <Card className="mb-8 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400" />
            <CardHeader className="-mt-16 relative">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="h-8 w-8 text-rose-500" />
                  <CardTitle className="text-3xl">{registry.eventName}</CardTitle>
                </div>
                <CardDescription className="flex flex-wrap items-center gap-4 text-base">
                  {registry.eventDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(registry.eventDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  )}
                  {registry.eventLocation && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {registry.eventLocation}
                    </span>
                  )}
                </CardDescription>

                {registry.weddingStory && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-muted-foreground">{registry.weddingStory}</p>
                  </div>
                )}

                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Registry Progress</span>
                    <span className="font-medium">${totalValue.toFixed(0)} of ${totalNeeded.toFixed(0)}</span>
                  </div>
                  <Progress value={progressPercent} className="h-3" />
                </div>
              </div>
            </CardHeader>
          </Card>

          {registry.allowCashGifts && (
            <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
              <CardContent className="py-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-green-100 dark:bg-green-800">
                      <DollarSign className="h-6 w-6 text-green-600 dark:text-green-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Honeymoon & Cash Fund</h3>
                      <p className="text-muted-foreground">
                        Contribute to the couple's special experiences
                      </p>
                    </div>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700" data-testid="button-cash-gift">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Give Cash Gift
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <h2 className="text-2xl font-bold mb-6">Gift Registry</h2>

          {items && items.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.filter(item => item.isActive).map((item) => {
                const fulfilled = (item.quantityPurchased || 0) >= (item.quantityRequested || 1);
                const remaining = (item.quantityRequested || 1) - (item.quantityPurchased || 0);
                
                return (
                  <Card key={item.id} className={fulfilled ? "opacity-60" : ""} data-testid={`card-item-${item.id}`}>
                    {item.productImageUrl && (
                      <div className="h-40 overflow-hidden rounded-t-lg">
                        <img 
                          src={item.productImageUrl} 
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-base">{item.productName}</CardTitle>
                        {fulfilled && (
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            <Check className="h-3 w-3 mr-1" />
                            Fulfilled
                          </Badge>
                        )}
                      </div>
                      <CardDescription>
                        <Badge variant="outline">
                          {categories.find(c => c.value === item.category)?.label || item.category}
                        </Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="text-2xl font-bold text-rose-600">${item.price}</div>
                      {item.productDescription && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.productDescription}</p>
                      )}
                      {!fulfilled && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {remaining} still needed
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="pt-2 gap-2">
                      {item.productUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={item.productUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Item
                          </a>
                        </Button>
                      )}
                      {!fulfilled && (
                        <Button 
                          size="sm" 
                          onClick={() => { setSelectedItem(item); setShowPurchaseDialog(true); }}
                          data-testid={`button-gift-${item.id}`}
                        >
                          <Gift className="h-3 w-3 mr-1" />
                          Gift This
                        </Button>
                      )}
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
                <p className="text-muted-foreground">The couple hasn't added any items to their registry yet.</p>
              </CardContent>
            </Card>
          )}

          <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Gift This Item</DialogTitle>
                <DialogDescription>
                  Let the couple know you're gifting this item
                </DialogDescription>
              </DialogHeader>
              
              {selectedItem && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{selectedItem.productName}</p>
                      <p className="text-sm text-muted-foreground">${selectedItem.price}</p>
                    </div>
                    <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              )}

              <Form {...purchaseForm}>
                <form onSubmit={purchaseForm.handleSubmit((data) => purchaseMutation.mutate(data))} className="space-y-4">
                  <FormField
                    control={purchaseForm.control}
                    name="gifterName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} data-testid="input-gifter-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={purchaseForm.control}
                    name="gifterEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your@email.com" {...field} data-testid="input-gifter-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={purchaseForm.control}
                    name="giftMessage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Congratulations on your special day!" {...field} data-testid="input-gift-message" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setShowPurchaseDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={purchaseMutation.isPending} data-testid="button-confirm-gift">
                      {purchaseMutation.isPending ? "Reserving..." : "Confirm Gift"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
