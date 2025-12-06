import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Flower2, MapPin, Star, Phone, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface FlowerShop {
  id: string;
  businessName: string;
  rating: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  specialties: string[];
  websiteUrl?: string;
}

interface FlowerOrderButtonProps {
  memorialId?: string;
  memorialName?: string;
  deliveryLocation?: string;
}

const orderFormSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().min(1, "Phone is required"),
  recipientName: z.string().min(1, "Recipient name is required"),
  deliveryAddress: z.string().min(1, "Delivery address is required"),
  deliveryDate: z.string().optional(),
  deliveryTime: z.string().optional(),
  arrangementType: z.string().optional(),
  specialInstructions: z.string().optional(),
  orderAmount: z.string()
    .min(1, "Order amount is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Must be a valid amount (e.g., 75.00)")
    .refine((val) => parseFloat(val) > 0, "Amount must be greater than 0"),
});

type OrderFormData = z.infer<typeof orderFormSchema>;

export default function FlowerOrderButton({
  memorialId,
  memorialName,
  deliveryLocation
}: FlowerOrderButtonProps) {
  const [open, setOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState<FlowerShop | null>(null);
  const { toast } = useToast();

  const { data: shops, isLoading } = useQuery<FlowerShop[]>({
    queryKey: ['/api/flower-shops'],
    enabled: open,
  });

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      recipientName: memorialName || "",
      deliveryAddress: deliveryLocation || "",
      deliveryDate: "",
      deliveryTime: "",
      arrangementType: "Sympathy Arrangement",
      specialInstructions: "",
      orderAmount: "",
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: OrderFormData) => {
      return apiRequest('POST', '/api/flower-orders', {
        shopId: selectedShop?.id,
        memorialId: memorialId || null,
        ...data,
        orderAmount: data.orderAmount,
      });
    },
    onSuccess: () => {
      toast({
        title: "Order Placed",
        description: `Your flower order has been sent to ${selectedShop?.businessName}. They will contact you shortly to confirm.`,
      });
      setOpen(false);
      setSelectedShop(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleShopSelect = (shop: FlowerShop) => {
    setSelectedShop(shop);
  };

  const handleBack = () => {
    setSelectedShop(null);
  };

  const onSubmit = (data: OrderFormData) => {
    createOrderMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="lg" 
          className="bg-chart-3 hover:bg-chart-3 text-white"
          data-testid="button-send-flowers"
        >
          <Flower2 className="w-5 h-5 mr-2" />
          Send Flowers
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl" data-testid="modal-flower-shops">
        {!selectedShop ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">Send Flowers</DialogTitle>
              <DialogDescription>
                {deliveryLocation 
                  ? `Choose a local florist to deliver flowers to ${deliveryLocation}`
                  : 'Choose a local florist for flower delivery'
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto py-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading flower shops...</p>
                </div>
              ) : !shops || shops.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No flower shops available at this time.</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Please check back later or contact us to add a local florist.
                  </p>
                </div>
              ) : (
                shops.map((shop) => (
                  <Card key={shop.id} className="p-4 hover-elevate" data-testid={`card-flower-shop-${shop.id}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground" data-testid={`text-shop-name-${shop.id}`}>
                            {shop.businessName}
                          </h3>
                          {parseFloat(shop.rating) > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                              <span className="text-sm font-medium">{parseFloat(shop.rating).toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-1 mb-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{shop.address}, {shop.city}, {shop.state}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            <span>{shop.phone}</span>
                          </div>
                        </div>

                        {shop.specialties && shop.specialties.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {shop.specialties.map((specialty, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <Button 
                        onClick={() => handleShopSelect(shop)}
                        data-testid={`button-order-${shop.id}`}
                      >
                        Order Now
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Partner florists offer 20% of order value as platform commission
              </p>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  data-testid="button-back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                  <DialogTitle className="font-serif text-2xl">Order from {selectedShop.businessName}</DialogTitle>
                  <DialogDescription>
                    Complete your order details
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[500px] overflow-y-auto py-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-customer-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Phone</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-customer-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} data-testid="input-customer-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recipientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient Name</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-recipient-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deliveryAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Address</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-delivery-address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="deliveryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Date (Optional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-delivery-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deliveryTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Time (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Morning" data-testid="input-delivery-time" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="arrangementType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Arrangement Type</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-arrangement-type" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="orderAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Amount ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" {...field} data-testid="input-order-amount" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="specialInstructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Instructions (Optional)</FormLabel>
                      <FormControl>
                        <Textarea {...field} data-testid="input-special-instructions" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1"
                    data-testid="button-cancel-order"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={createOrderMutation.isPending}
                    data-testid="button-submit-order"
                  >
                    {createOrderMutation.isPending ? "Placing Order..." : "Place Order"}
                  </Button>
                </div>
              </form>
            </Form>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                The florist will contact you to confirm and arrange payment
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
