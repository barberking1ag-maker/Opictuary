import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { Package, Eye, ShoppingBag } from "lucide-react";
import { format } from "date-fns";
import type { ProductOrder } from "@shared/schema";

const statusFilters = [
  { value: "all", label: "All Orders" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pending", variant: "secondary" },
  processing: { label: "Processing", variant: "default" },
  in_production: { label: "In Production", variant: "default" },
  shipped: { label: "Shipped", variant: "default" },
  delivered: { label: "Delivered", variant: "default" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

export default function MyOrders() {
  const { isAuthenticated } = useAuth();
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: orders = [], isLoading, error } = useQuery<ProductOrder[]>({
    queryKey: ["/api/product-orders/user"],
    enabled: isAuthenticated,
  });

  const filteredOrders = statusFilter === "all"
    ? orders
    : orders.filter((order) => order.status === statusFilter);

  const sortedOrders = [...filteredOrders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>Please login to view your orders.</CardDescription>
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

  return (
    <div className="min-h-screen bg-background py-12 px-4" data-testid="my-orders-page">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <ShoppingBag className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-serif font-bold">My Orders</h1>
              <p className="text-muted-foreground">View and track your memorial product orders</p>
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-4 mt-6">
            <span className="text-sm text-muted-foreground">Filter by status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusFilters.map((filter) => (
                  <SelectItem key={filter.value} value={filter.value}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <Skeleton className="h-16 w-16 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Unable to Load Orders</h3>
              <p className="text-muted-foreground">Please try again later.</p>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !error && sortedOrders.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {statusFilter === "all" ? "No orders yet" : `No ${statusFilter} orders`}
              </h3>
              <p className="text-muted-foreground mb-6">
                {statusFilter === "all" 
                  ? "Browse our memorial products to place your first order."
                  : "Try changing the filter to see other orders."}
              </p>
              {statusFilter === "all" ? (
                <Link href="/products">
                  <Button>
                    <Package className="w-4 h-4 mr-2" />
                    Browse Products
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" onClick={() => setStatusFilter("all")}>
                  View All Orders
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Orders List */}
        {!isLoading && !error && sortedOrders.length > 0 && (
          <div className="space-y-4">
            {sortedOrders.map((order) => {
              const statusInfo = statusConfig[order.status] || statusConfig.pending;
              
              return (
                <Card 
                  key={order.id} 
                  className="hover-elevate" 
                  data-testid={`order-row-${order.id}`}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      {/* Product Thumbnail */}
                      <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-muted rounded-lg flex items-center justify-center shrink-0">
                        <Package className="w-10 h-10 text-primary/40" />
                      </div>

                      {/* Order Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-lg">Order #{order.orderNumber}</h3>
                            <p className="text-sm text-muted-foreground">
                              Placed on {format(new Date(order.createdAt), "MMM d, yyyy")}
                            </p>
                          </div>
                          <Badge variant={statusInfo.variant}>
                            {statusInfo.label}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-6 text-sm">
                          <div>
                            <span className="text-muted-foreground">Quantity: </span>
                            <span className="font-medium">{order.quantity}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Total: </span>
                            <span className="font-semibold">${parseFloat(order.total).toFixed(2)}</span>
                          </div>
                          {order.trackingNumber && (
                            <div>
                              <span className="text-muted-foreground">Tracking: </span>
                              <span className="font-mono font-medium">{order.trackingNumber}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex items-center gap-3">
                        <Link href={`/orders/${order.id}`}>
                          <Button 
                            variant="outline" 
                            data-testid={`button-view-order-${order.id}`}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Additional Order Info */}
                    {order.estimatedDelivery && order.status !== "delivered" && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                          Estimated delivery: {format(new Date(order.estimatedDelivery), "EEEE, MMMM d, yyyy")}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Summary */}
        {!isLoading && sortedOrders.length > 0 && (
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Showing {sortedOrders.length} {sortedOrders.length === 1 ? "order" : "orders"}
            {statusFilter !== "all" && ` with status: ${statusFilter}`}
          </div>
        )}
      </div>
    </div>
  );
}
