import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Package, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Download, 
  ExternalLink,
  ArrowLeft,
  QrCode
} from "lucide-react";
import { format } from "date-fns";
import type { ProductOrder } from "@shared/schema";

const statusConfig: Record<string, { label: string; color: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pending", color: "bg-yellow-500", variant: "secondary" },
  processing: { label: "Processing", color: "bg-blue-500", variant: "default" },
  in_production: { label: "In Production", color: "bg-purple-500", variant: "default" },
  shipped: { label: "Shipped", color: "bg-purple-500", variant: "default" },
  delivered: { label: "Delivered", color: "bg-green-500", variant: "default" },
  cancelled: { label: "Cancelled", color: "bg-red-500", variant: "destructive" },
};

const orderTimeline = [
  { key: "pending", label: "Ordered", icon: Clock },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

export default function OrderTracking() {
  const [, params] = useRoute("/orders/:orderId");

  const { data: order, isLoading, error } = useQuery<ProductOrder>({
    queryKey: ["/api/product-orders", params?.orderId],
    enabled: !!params?.orderId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-64 mb-8" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Order Not Found</CardTitle>
            <CardDescription>
              The order you're looking for doesn't exist or you don't have permission to view it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/orders">
              <Button className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                View All Orders
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusInfo = statusConfig[order.status] || statusConfig.pending;
  const currentStatusIndex = orderTimeline.findIndex((s) => s.key === order.status);

  return (
    <div className="min-h-screen bg-background py-12 px-4" data-testid="order-tracking-page">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/orders">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Orders
            </Button>
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">Order Details</h1>
              <p className="text-muted-foreground">
                Order placed on {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
            <Badge variant={statusInfo.variant} className="text-base px-4 py-2" data-testid="order-status">
              {statusInfo.label}
            </Badge>
          </div>
        </div>

        <div className="space-y-6">
          {/* Order Number Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Order #{order.orderNumber}</CardTitle>
                  <CardDescription data-testid="order-number">
                    Reference this number for customer support
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderTimeline.map((step, index) => {
                  const isCompleted = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;
                  const StepIcon = step.icon;

                  return (
                    <div key={step.key} className="flex items-start gap-4">
                      <div className="relative">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                            isCompleted
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-muted text-muted-foreground"
                          }`}
                        >
                          <StepIcon className="w-5 h-5" />
                        </div>
                        {index < orderTimeline.length - 1 && (
                          <div
                            className={`absolute left-5 top-10 w-0.5 h-12 transition-colors ${
                              isCompleted ? "bg-primary" : "bg-muted"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pt-2">
                        <h4 className={`font-semibold ${isCurrent ? "text-foreground" : isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                          {step.label}
                        </h4>
                        {isCompleted && order.createdAt && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {format(new Date(order.createdAt), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Tracking Information */}
          {order.trackingNumber && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tracking Number</p>
                    <p className="font-semibold font-mono" data-testid="tracking-number">
                      {order.trackingNumber}
                    </p>
                  </div>
                  {order.carrier && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Carrier</p>
                      <p className="font-semibold">{order.carrier}</p>
                    </div>
                  )}
                </div>
                {order.estimatedDelivery && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Estimated Delivery</p>
                    <p className="font-semibold">
                      {format(new Date(order.estimatedDelivery), "EEEE, MMMM d, yyyy")}
                    </p>
                  </div>
                )}
                {order.carrier && order.trackingNumber && (
                  <Button variant="outline" className="w-full" asChild>
                    <a
                      href={`https://www.google.com/search?q=${order.carrier}+tracking+${order.trackingNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Track Package
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-muted rounded-lg flex items-center justify-center shrink-0">
                  <Package className="w-10 h-10 text-primary/40" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h4 className="font-semibold text-lg">Product Name</h4>
                      <p className="text-sm text-muted-foreground">Quantity: {order.quantity}</p>
                    </div>
                  </div>
                  
                  {/* Customization Details */}
                  {order.customization && Object.keys(order.customization).length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold mb-2">Customization</p>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {order.customization.engravingText && (
                          <p>• Engraving: "{order.customization.engravingText}"</p>
                        )}
                        {order.customization.font && (
                          <p>• Font: {order.customization.font}</p>
                        )}
                        {order.customization.material && (
                          <p>• Material: {order.customization.material}</p>
                        )}
                        {order.customization.size && (
                          <p>• Size: {order.customization.size}</p>
                        )}
                        {order.customization.qrPlacement && (
                          <p>• QR Placement: {order.customization.qrPlacement}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Pricing */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${parseFloat(order.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">${parseFloat(order.shipping).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">${parseFloat(order.tax).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold">${parseFloat(order.total).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p className="font-semibold">{order.shippingAddress.fullName}</p>
                  <p className="text-muted-foreground">{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p className="text-muted-foreground">{order.shippingAddress.addressLine2}</p>
                  )}
                  <p className="text-muted-foreground">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p className="text-muted-foreground">{order.shippingAddress.country}</p>
                  <p className="text-muted-foreground mt-2">Phone: {order.shippingAddress.phone}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* QR Code Preview */}
          {order.qrCodeId && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  QR Code
                </CardTitle>
                <CardDescription>
                  Your memorial product includes this QR code
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white p-8 rounded-lg inline-block">
                  <div className="w-48 h-48 bg-gradient-to-br from-primary/20 to-muted rounded-lg flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-primary/40" />
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Payment Status */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payment Status</span>
                <Badge variant={order.paymentStatus === "paid" ? "default" : "secondary"}>
                  {order.paymentStatus === "paid" ? "Paid" : 
                   order.paymentStatus === "pending" ? "Pending" :
                   order.paymentStatus === "failed" ? "Failed" : "Refunded"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Link href="/orders" className="flex-1">
              <Button variant="outline" className="w-full">
                View All Orders
              </Button>
            </Link>
            <Link href="/support" className="flex-1">
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
