import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Package, ArrowLeft, ArrowRight, Check, Loader2, CreditCard, MapPin, Sparkles, Image as ImageIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { Product, Memorial } from "@shared/schema";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const shippingSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  addressLine1: z.string().min(1, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "Valid ZIP code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().min(10, "Valid phone number is required"),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

const steps = [
  { number: 1, title: "Product", description: "Review details" },
  { number: 2, title: "Customize", description: "Personalize" },
  { number: 3, title: "Shipping", description: "Delivery address" },
  { number: 4, title: "Payment", description: "Complete order" },
];

function PaymentForm({ 
  orderId, 
  clientSecret, 
  onSuccess 
}: { 
  orderId: string; 
  clientSecret: string; 
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders/${orderId}`,
        },
        redirect: 'if_required',
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        await apiRequest("PATCH", `/api/product-orders/${orderId}`, {
          paymentStatus: 'paid',
          paymentIntentId: paymentIntent.id,
        });

        toast({
          title: "Order Placed Successfully",
          description: "Your memorial product order has been confirmed.",
        });

        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process payment",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1"
          size="lg"
          data-testid="button-place-order"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Place Order
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        Secure payment powered by Stripe
      </p>
    </form>
  );
}

export default function ProductCustomize() {
  const [, params] = useRoute("/products/:productId/customize");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState<any>({});
  const [shippingAddress, setShippingAddress] = useState<ShippingFormData | null>(null);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  
  // AI Design state
  const [aiDesignEnabled, setAiDesignEnabled] = useState(false);
  const [aiDesignPrompt, setAiDesignPrompt] = useState("");
  const [aiDesignStyle, setAiDesignStyle] = useState("realistic");
  const [aiDesignImageUrl, setAiDesignImageUrl] = useState<string | null>(null);
  const [generatingDesign, setGeneratingDesign] = useState(false);

  const form = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      fullName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
      phone: "",
    },
  });

  const { data: product, isLoading: isLoadingProduct } = useQuery<Product>({
    queryKey: ["/api/products", params?.productId],
    enabled: !!params?.productId,
  });

  const { data: memorials = [] } = useQuery<Memorial[]>({
    queryKey: ["/api/user/memorials"],
    enabled: isAuthenticated,
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const res = await apiRequest("POST", "/api/product-orders", orderData);
      return res.json();
    },
    onSuccess: (order) => {
      setPendingOrderId(order.id);
      queryClient.invalidateQueries({ queryKey: ["/api/product-orders"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error Creating Order",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const fetchPaymentIntentMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const res = await apiRequest("POST", `/api/product-orders/${orderId}/payment-intent`, {});
      return res.json();
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
    },
    onError: (error: any) => {
      toast({
        title: "Error Initializing Payment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generateAiDesignMutation = useMutation({
    mutationFn: async (designData: { prompt: string; style: string; deceasedName?: string }) => {
      const res = await apiRequest("POST", "/api/products/generate-ai-design", designData);
      return res.json();
    },
    onSuccess: (data) => {
      setAiDesignImageUrl(data.imageUrl);
      setGeneratingDesign(false);
      toast({
        title: "Design Generated",
        description: "Your AI-generated design is ready!",
      });
    },
    onError: (error: any) => {
      setGeneratingDesign(false);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate AI design",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (currentStep === 4 && !pendingOrderId && product && shippingAddress) {
      // SECURITY FIX: Don't send pricing to server, let server calculate it
      const orderCustomization = {
        ...customization,
        aiDesignEnabled,
        aiDesignPrompt: aiDesignEnabled ? aiDesignPrompt : undefined,
        aiDesignStyle: aiDesignEnabled ? aiDesignStyle : undefined,
        aiDesignImageUrl: aiDesignEnabled ? aiDesignImageUrl : undefined,
      };
      
      createOrderMutation.mutate({
        productId: product.id,
        quantity,
        customization: orderCustomization,
        shippingAddress,
        memorialId: customization.memorialId || null,
      });
    }
  }, [currentStep, product, shippingAddress, pendingOrderId]);

  useEffect(() => {
    // Fetch payment intent after order is created
    if (pendingOrderId && !clientSecret && !fetchPaymentIntentMutation.isPending) {
      fetchPaymentIntentMutation.mutate(pendingOrderId);
    }
  }, [pendingOrderId, clientSecret]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>Please login to customize and order products.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/api/login'} className="w-full">
              Login to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto py-12">
          <Skeleton className="h-12 w-64 mb-8" />
          <Card>
            <CardHeader>
              <Skeleton className="h-48 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Product Not Found</CardTitle>
            <CardDescription>The product you're looking for doesn't exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/products")} className="w-full">
              Back to Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const calculateTotal = () => {
    // Match server-side calculation for display purposes
    const subtotal = parseFloat(product.basePrice) * quantity;
    const aiDesignPremium = aiDesignEnabled ? 15.00 : 0;
    const shipping = 15.00; // Fixed shipping rate (matches server)
    const tax = (subtotal + aiDesignPremium) * 0.08; // 8% tax rate (matches server)
    return subtotal + aiDesignPremium + shipping + tax;
  };

  const handleGenerateDesign = () => {
    if (!aiDesignPrompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a design prompt",
        variant: "destructive",
      });
      return;
    }

    setGeneratingDesign(true);
    const selectedMemorial = memorials.find(m => m.id === customization.memorialId);
    generateAiDesignMutation.mutate({
      prompt: aiDesignPrompt,
      style: aiDesignStyle,
      deceasedName: selectedMemorial?.name,
    });
  };

  const handleNext = () => {
    // Check if AI design is enabled but not generated (step 2 only)
    if (currentStep === 2 && aiDesignEnabled && !aiDesignImageUrl) {
      toast({
        title: "AI Design Required",
        description: "Please generate your AI design before continuing",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === 3) {
      form.handleSubmit((data) => {
        setShippingAddress(data);
        setCurrentStep(4);
      })();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleOrderSuccess = () => {
    if (pendingOrderId) {
      setLocation(`/orders/${pendingOrderId}`);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/products")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
          <h1 className="text-3xl font-serif font-bold mb-2">Customize Your Order</h1>
          <p className="text-muted-foreground">{product.name}</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      currentStep > step.number
                        ? "bg-primary border-primary text-primary-foreground"
                        : currentStep === step.number
                        ? "border-primary text-primary"
                        : "border-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
                  </div>
                  <div className="text-center mt-2">
                    <div className="text-sm font-semibold">{step.title}</div>
                    <div className="text-xs text-muted-foreground hidden sm:block">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 transition-colors ${
                      currentStep > step.number ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card data-testid={`step-${currentStep}`}>
          {/* Step 1: Product Details */}
          {currentStep === 1 && (
            <>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>Review the product and select quantity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-6">
                  <div className="w-48 h-48 bg-gradient-to-br from-primary/20 to-muted rounded-lg flex items-center justify-center shrink-0">
                    {product.images && product.images.length > 0 ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Package className="w-16 h-16 text-primary/40" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold mb-2">{product.name}</h3>
                    <Badge className="mb-4">{product.category}</Badge>
                    <p className="text-muted-foreground mb-4">{product.description}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">${parseFloat(product.basePrice).toFixed(2)}</span>
                      <span className="text-muted-foreground">per item</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                    <span className="text-muted-foreground">× ${parseFloat(product.basePrice).toFixed(2)} = ${(parseFloat(product.basePrice) * quantity).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 2: Customization */}
          {currentStep === 2 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Customization Options
                </CardTitle>
                <CardDescription>Personalize your memorial product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Memorial Selector */}
                <div className="space-y-2">
                  <Label>Link to Memorial (Optional)</Label>
                  <Select
                    value={customization.memorialId || "none"}
                    onValueChange={(value) => setCustomization({ ...customization, memorialId: value === "none" ? null : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a memorial to link" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No memorial</SelectItem>
                      {memorials.map((memorial) => (
                        <SelectItem key={memorial.id} value={memorial.id}>
                          {memorial.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    The QR code on your product will link to this memorial
                  </p>
                </div>

                {/* Engraving */}
                {product.customizationOptions?.engraving && (
                  <div className="space-y-2">
                    <Label>Engraving Text (Optional)</Label>
                    <Textarea
                      placeholder="Enter custom text for engraving..."
                      maxLength={product.customizationOptions.engraving.maxCharacters}
                      value={customization.engravingText || ""}
                      onChange={(e) => setCustomization({ ...customization, engravingText: e.target.value })}
                    />
                    <p className="text-sm text-muted-foreground">
                      {(customization.engravingText || "").length} / {product.customizationOptions.engraving.maxCharacters} characters
                    </p>

                    {product.customizationOptions.engraving.fonts && (
                      <div className="space-y-2 mt-4">
                        <Label>Font Style</Label>
                        <Select
                          value={customization.font || ""}
                          onValueChange={(value) => setCustomization({ ...customization, font: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select font style" />
                          </SelectTrigger>
                          <SelectContent>
                            {product.customizationOptions.engraving.fonts.map((font) => (
                              <SelectItem key={font} value={font}>
                                {font}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                )}

                {/* Material */}
                {product.customizationOptions?.materials && (
                  <div className="space-y-2">
                    <Label>Material</Label>
                    <Select
                      value={customization.material || ""}
                      onValueChange={(value) => setCustomization({ ...customization, material: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select material" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.customizationOptions.materials.map((material) => (
                          <SelectItem key={material} value={material}>
                            {material}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Size */}
                {product.customizationOptions?.sizes && (
                  <div className="space-y-2">
                    <Label>Size</Label>
                    <Select
                      value={customization.size || ""}
                      onValueChange={(value) => setCustomization({ ...customization, size: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.customizationOptions.sizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* QR Placement */}
                {product.customizationOptions?.qrPlacement && (
                  <div className="space-y-2">
                    <Label>QR Code Placement</Label>
                    <Select
                      value={customization.qrPlacement || ""}
                      onValueChange={(value) => setCustomization({ ...customization, qrPlacement: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select QR code placement" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.customizationOptions.qrPlacement.map((placement) => (
                          <SelectItem key={placement} value={placement}>
                            {placement}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* AI Design Feature - Only for Memorial Cards */}
                {product.category === 'memorial-cards' && (
                  <>
                    <Separator />
                    
                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 space-y-4 border border-primary/20">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="ai-design"
                          checked={aiDesignEnabled}
                          onCheckedChange={(checked) => {
                            setAiDesignEnabled(checked as boolean);
                            if (!checked) {
                              setAiDesignImageUrl(null);
                              setAiDesignPrompt("");
                            }
                          }}
                          data-testid="checkbox-ai-design"
                        />
                        <div className="flex-1">
                          <label
                            htmlFor="ai-design"
                            className="text-sm font-semibold cursor-pointer flex items-center gap-2"
                          >
                            <Sparkles className="w-4 h-4 text-primary" />
                            Add Custom AI-Generated Design
                            <Badge variant="secondary" className="ml-2">+$15</Badge>
                          </label>
                          <p className="text-xs text-muted-foreground mt-1">
                            Create a unique, personalized design using AI
                          </p>
                        </div>
                      </div>

                      {aiDesignEnabled && (
                        <div className="space-y-4 pl-7">
                          {/* Design Prompt */}
                          <div className="space-y-2">
                            <Label htmlFor="ai-prompt">Design Description</Label>
                            <Textarea
                              id="ai-prompt"
                              placeholder="Describe the design you envision..."
                              value={aiDesignPrompt}
                              onChange={(e) => setAiDesignPrompt(e.target.value)}
                              rows={3}
                              data-testid="input-ai-prompt"
                            />
                            <p className="text-xs text-muted-foreground">
                              Example: "Peaceful garden scene with butterflies and roses at sunset"
                            </p>
                          </div>

                          {/* Style Selector */}
                          <div className="space-y-2">
                            <Label htmlFor="ai-style">Art Style</Label>
                            <Select
                              value={aiDesignStyle}
                              onValueChange={setAiDesignStyle}
                            >
                              <SelectTrigger id="ai-style" data-testid="select-ai-style">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="realistic">Realistic</SelectItem>
                                <SelectItem value="watercolor">Watercolor</SelectItem>
                                <SelectItem value="oil_painting">Oil Painting</SelectItem>
                                <SelectItem value="digital_art">Digital Art</SelectItem>
                                <SelectItem value="sketch">Sketch</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Generate Button */}
                          {!aiDesignImageUrl && (
                            <Button
                              type="button"
                              onClick={handleGenerateDesign}
                              disabled={generatingDesign || !aiDesignPrompt.trim()}
                              className="w-full"
                              data-testid="button-generate-design"
                            >
                              {generatingDesign ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Generating Design...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-4 h-4 mr-2" />
                                  Generate Design
                                </>
                              )}
                            </Button>
                          )}

                          {/* Image Preview */}
                          {aiDesignImageUrl && (
                            <div className="space-y-3">
                              <div className="relative rounded-lg overflow-hidden border border-primary/20">
                                <img
                                  src={aiDesignImageUrl}
                                  alt="AI Generated Design"
                                  className="w-full h-64 object-cover"
                                  data-testid="img-ai-design-preview"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setAiDesignImageUrl(null);
                                }}
                                className="w-full"
                                data-testid="button-regenerate-design"
                              >
                                <Sparkles className="w-4 h-4 mr-2" />
                                Regenerate Design
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}

                <Separator />

                {/* Price Calculation */}
                <div className="bg-accent/10 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base Price ({quantity}× ${parseFloat(product.basePrice).toFixed(2)})</span>
                      <span className="font-semibold">${(parseFloat(product.basePrice) * quantity).toFixed(2)}</span>
                    </div>
                    {aiDesignEnabled && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          AI Design Premium
                        </span>
                        <span className="font-semibold">$15.00</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Other Customization</span>
                      <span className="font-semibold">$0.00</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold">${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 3: Shipping Address */}
          {currentStep === 3 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </CardTitle>
                <CardDescription>Where should we deliver your order?</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="addressLine1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Line 1 *</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main Street" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="addressLine2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Line 2</FormLabel>
                          <FormControl>
                            <Input placeholder="Apt 4B" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City *</FormLabel>
                            <FormControl>
                              <Input placeholder="San Francisco" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State *</FormLabel>
                            <FormControl>
                              <Input placeholder="CA" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code *</FormLabel>
                            <FormControl>
                              <Input placeholder="94102" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country *</FormLabel>
                            <FormControl>
                              <Input placeholder="USA" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Form>
              </CardContent>
            </>
          )}

          {/* Step 4: Payment & Review */}
          {currentStep === 4 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Review & Payment
                </CardTitle>
                <CardDescription>Review your order and complete payment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Summary */}
                <div className="bg-accent/10 rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold">Order Summary</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Product</span>
                      <span className="font-medium">{product.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantity</span>
                      <span className="font-medium">{quantity}</span>
                    </div>
                    {customization.memorialId && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Linked Memorial</span>
                        <span className="font-medium">{memorials.find((m) => m.id === customization.memorialId)?.name}</span>
                      </div>
                    )}
                    {customization.engravingText && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Engraving</span>
                        <span className="font-medium">{customization.engravingText.substring(0, 30)}...</span>
                      </div>
                    )}
                    {aiDesignEnabled && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          AI Design
                        </span>
                        <span className="font-medium">Included</span>
                      </div>
                    )}
                  </div>

                  {/* AI Design Preview */}
                  {aiDesignEnabled && aiDesignImageUrl && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">AI-Generated Design Preview</h4>
                        <div className="relative rounded-lg overflow-hidden border border-primary/20">
                          <img
                            src={aiDesignImageUrl}
                            alt="AI Generated Design Preview"
                            className="w-full h-48 object-cover"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Style: {aiDesignStyle.replace('_', ' ')} • {aiDesignPrompt.substring(0, 50)}...
                        </p>
                      </div>
                    </>
                  )}

                  <Separator />

                  {shippingAddress && (
                    <div className="space-y-2 text-sm">
                      <h4 className="font-semibold">Shipping To:</h4>
                      <p className="text-muted-foreground">
                        {shippingAddress.fullName}<br />
                        {shippingAddress.addressLine1}<br />
                        {shippingAddress.addressLine2 && <>{shippingAddress.addressLine2}<br /></>}
                        {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}<br />
                        {shippingAddress.country}<br />
                        {shippingAddress.phone}
                      </p>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${(parseFloat(product.basePrice) * quantity).toFixed(2)}</span>
                    </div>
                    {aiDesignEnabled && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          AI Design Premium
                        </span>
                        <span className="font-medium">$15.00</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">$15.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (8%)</span>
                      <span className="font-medium">${((parseFloat(product.basePrice) * quantity + (aiDesignEnabled ? 15 : 0)) * 0.08).toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold">${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Stripe Payment Element */}
                {createOrderMutation.isPending && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <span className="ml-3 text-muted-foreground">Preparing payment...</span>
                  </div>
                )}

                {createOrderMutation.isError && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive text-sm">
                    Failed to create order. Please try again.
                  </div>
                )}

                {clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm
                      orderId={pendingOrderId!}
                      clientSecret={clientSecret}
                      onSuccess={handleOrderSuccess}
                    />
                  </Elements>
                )}
              </CardContent>
            </>
          )}

          {/* Navigation Buttons */}
          {currentStep < 4 && (
            <CardContent className="flex gap-3 pt-0">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                  data-testid="button-back"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                className="flex-1"
                data-testid="button-next"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          )}

          {currentStep === 4 && !clientSecret && !createOrderMutation.isPending && (
            <CardContent className="pt-0">
              <Button
                variant="outline"
                onClick={handleBack}
                className="w-full"
                data-testid="button-back"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Shipping
              </Button>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
