import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { 
  RefreshCw, 
  Package, 
  Clock, 
  Factory, 
  Truck, 
  Search,
  Eye,
  Edit,
  MapPin
} from "lucide-react";
import { format } from "date-fns";
import type { ProductOrder } from "@shared/schema";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pending", variant: "secondary" },
  processing: { label: "Processing", variant: "default" },
  in_production: { label: "In Production", variant: "default" },
  shipped: { label: "Shipped", variant: "default" },
  delivered: { label: "Delivered", variant: "outline" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

const carrierOptions = ["UPS", "FedEx", "USPS", "DHL", "Other"];

export default function AdminProductOrders() {
  const { user, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("all");
  
  // Modals
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ProductOrder | null>(null);
  
  // Status update form
  const [newStatus, setNewStatus] = useState("");
  const [statusNotes, setStatusNotes] = useState("");
  
  // Tracking form
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");

  // Fetch all orders (admin only)
  const { data: orders = [], isLoading, refetch } = useQuery<ProductOrder[]>({
    queryKey: ["/api/admin/product-orders"],
    enabled: !authLoading && user?.isAdmin === true,
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      return await apiRequest("PATCH", `/api/product-orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "Order status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/product-orders"] });
      setStatusModalOpen(false);
      setSelectedOrder(null);
      setNewStatus("");
      setStatusNotes("");
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update order status.",
        variant: "destructive",
      });
    },
  });

  // Update tracking mutation
  const updateTrackingMutation = useMutation({
    mutationFn: async (data: { orderId: string; trackingNumber: string; carrier: string; estimatedDelivery?: string }) => {
      return await apiRequest("PATCH", `/api/product-orders/${data.orderId}/tracking`, {
        trackingNumber: data.trackingNumber,
        carrier: data.carrier,
        estimatedDelivery: data.estimatedDelivery,
      });
    },
    onSuccess: () => {
      toast({
        title: "Tracking Added",
        description: "Tracking information has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/product-orders"] });
      setTrackingModalOpen(false);
      setSelectedOrder(null);
      setTrackingNumber("");
      setCarrier("");
      setEstimatedDelivery("");
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to add tracking information.",
        variant: "destructive",
      });
    },
  });

  // Access control
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page. Only administrators can manage product orders.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    // Status filter
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false;
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesOrderNumber = order.orderNumber.toLowerCase().includes(query);
      const matchesName = order.shippingAddress?.fullName?.toLowerCase().includes(query);
      if (!matchesOrderNumber && !matchesName) {
        return false;
      }
    }
    
    // Date filter
    if (dateFilter !== "all" && order.createdAt) {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dateFilter === "7days" && daysDiff > 7) return false;
      if (dateFilter === "30days" && daysDiff > 30) return false;
    }
    
    return true;
  });

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    in_production: orders.filter((o) => o.status === "in_production").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
  };

  // Handle status update
  const handleStatusUpdate = () => {
    if (!selectedOrder || !newStatus) return;
    updateStatusMutation.mutate({ orderId: selectedOrder.id, status: newStatus });
  };

  // Handle tracking update
  const handleTrackingUpdate = () => {
    if (!selectedOrder || !trackingNumber || !carrier) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    updateTrackingMutation.mutate({
      orderId: selectedOrder.id,
      trackingNumber,
      carrier,
      estimatedDelivery: estimatedDelivery || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4" data-testid="admin-orders-page">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">Product Orders Management</h1>
            <p className="text-muted-foreground">
              Manage and track all physical memorial product orders
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            data-testid="button-refresh-orders"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-total-orders">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-pending-orders">{stats.pending}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Production</CardTitle>
              <Factory className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-in-production-orders">{stats.in_production}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shipped</CardTitle>
              <Truck className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-shipped-orders">{stats.shipped}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Order number or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                    data-testid="input-search-orders"
                  />
                </div>
              </div>
              
              {/* Status Filter */}
              <div className="space-y-2">
                <Label htmlFor="status-filter">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status-filter" data-testid="select-status-filter">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="in_production">In Production</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Date Range Filter */}
              <div className="space-y-2">
                <Label htmlFor="date-filter">Date Range</Label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger id="date-filter" data-testid="select-date-filter">
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
            <CardDescription>
              {filteredOrders.length === 0 ? "No orders match your filters" : `Showing ${filteredOrders.length} order${filteredOrders.length !== 1 ? 's' : ''}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No orders match your filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id} data-testid={`order-row-${order.id}`}>
                        <TableCell>
                          <Button
                            variant="ghost"
                            className="p-0 h-auto font-mono text-sm"
                            onClick={() => navigate(`/orders/${order.id}`)}
                            data-testid={`link-order-${order.id}`}
                          >
                            {order.orderNumber}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.shippingAddress?.fullName || "N/A"}</p>
                          </div>
                        </TableCell>
                        <TableCell>{order.productId}</TableCell>
                        <TableCell>
                          <Badge variant={statusConfig[order.status ?? 'pending']?.variant || "default"}>
                            {statusConfig[order.status ?? 'pending']?.label || order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>${Number(order.total ?? 0).toFixed(2)}</TableCell>
                        <TableCell>
                          {order.createdAt ? format(new Date(order.createdAt), "MMM d, yyyy") : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order);
                                setNewStatus(order.status ?? "");
                                setStatusModalOpen(true);
                              }}
                              data-testid={`button-update-status-${order.id}`}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order);
                                setTrackingNumber(order.trackingNumber || "");
                                setCarrier(order.carrier || "");
                                setEstimatedDelivery(
                                  order.estimatedDelivery
                                    ? format(new Date(order.estimatedDelivery), "yyyy-MM-dd")
                                    : ""
                                );
                                setTrackingModalOpen(true);
                              }}
                              data-testid={`button-add-tracking-${order.id}`}
                            >
                              <MapPin className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/orders/${order.id}`)}
                              data-testid={`button-view-details-${order.id}`}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Update Modal */}
      <Dialog open={statusModalOpen} onOpenChange={setStatusModalOpen}>
        <DialogContent data-testid="modal-update-status">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Update the status for order #{selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-status">New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger id="new-status" data-testid="select-new-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="in_production">In Production</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status-notes">Internal Notes (Optional)</Label>
              <Textarea
                id="status-notes"
                placeholder="Add any notes about this status change..."
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                rows={3}
                data-testid="textarea-status-notes"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setStatusModalOpen(false);
                setSelectedOrder(null);
                setNewStatus("");
                setStatusNotes("");
              }}
              data-testid="button-cancel-status"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={!newStatus || updateStatusMutation.isPending}
              data-testid="button-confirm-status"
            >
              {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tracking Info Modal */}
      <Dialog open={trackingModalOpen} onOpenChange={setTrackingModalOpen}>
        <DialogContent data-testid="modal-add-tracking">
          <DialogHeader>
            <DialogTitle>Add Tracking Information</DialogTitle>
            <DialogDescription>
              Add or update tracking details for order #{selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tracking-number">Tracking Number *</Label>
              <Input
                id="tracking-number"
                placeholder="Enter tracking number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                data-testid="input-tracking-number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="carrier">Carrier *</Label>
              <Select value={carrier} onValueChange={setCarrier}>
                <SelectTrigger id="carrier" data-testid="select-carrier">
                  <SelectValue placeholder="Select carrier" />
                </SelectTrigger>
                <SelectContent>
                  {carrierOptions.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estimated-delivery">Estimated Delivery (Optional)</Label>
              <Input
                id="estimated-delivery"
                type="date"
                value={estimatedDelivery}
                onChange={(e) => setEstimatedDelivery(e.target.value)}
                data-testid="input-estimated-delivery"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setTrackingModalOpen(false);
                setSelectedOrder(null);
                setTrackingNumber("");
                setCarrier("");
                setEstimatedDelivery("");
              }}
              data-testid="button-cancel-tracking"
            >
              Cancel
            </Button>
            <Button
              onClick={handleTrackingUpdate}
              disabled={!trackingNumber || !carrier || updateTrackingMutation.isPending}
              data-testid="button-confirm-tracking"
            >
              {updateTrackingMutation.isPending ? "Saving..." : "Save Tracking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
