import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { CheckCircle2, XCircle, Clock, ExternalLink, Mail, Phone, Globe } from "lucide-react";
import { format } from "date-fns";

interface Advertisement {
  id: string;
  companyName: string;
  productName: string;
  category: string;
  description: string;
  imageUrl?: string;
  contactEmail: string;
  contactPhone?: string;
  websiteUrl?: string;
  pricing?: string;
  commissionPercentage?: number;
  referralCode?: string;
  status: 'pending' | 'approved' | 'rejected';
  totalSales: number;
  totalRevenue: string;
  totalPlatformFees: string;
  createdAt: string;
}

export default function AdvertisementAdmin() {
  const { toast } = useToast();

  const { data: pendingAds = [], isLoading: loadingPending } = useQuery<Advertisement[]>({
    queryKey: ['/api/advertisements/by-status', 'pending'],
    queryFn: async () => {
      const res = await fetch('/api/advertisements/by-status/pending');
      if (!res.ok) throw new Error('Failed to fetch pending advertisements');
      return res.json();
    },
  });

  const { data: approvedAds = [], isLoading: loadingApproved } = useQuery<Advertisement[]>({
    queryKey: ['/api/advertisements/by-status', 'approved'],
    queryFn: async () => {
      const res = await fetch('/api/advertisements/by-status/approved');
      if (!res.ok) throw new Error('Failed to fetch approved advertisements');
      return res.json();
    },
  });

  const { data: rejectedAds = [], isLoading: loadingRejected } = useQuery<Advertisement[]>({
    queryKey: ['/api/advertisements/by-status', 'rejected'],
    queryFn: async () => {
      const res = await fetch('/api/advertisements/by-status/rejected');
      if (!res.ok) throw new Error('Failed to fetch rejected advertisements');
      return res.json();
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'approved' | 'rejected' }) => {
      const res = await apiRequest('PATCH', `/api/advertisements/${id}/status`, { status });
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/advertisements/by-status'] });
      toast({
        title: "Status Updated",
        description: `Advertisement ${variables.status === 'approved' ? 'approved' : 'rejected'} successfully.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const renderAdCard = (ad: Advertisement, showActions = false) => (
    <Card key={ad.id} className="mb-4">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg">{ad.productName}</CardTitle>
            <CardDescription>{ad.companyName}</CardDescription>
          </div>
          <Badge variant={
            ad.status === 'approved' ? 'default' : 
            ad.status === 'rejected' ? 'destructive' : 
            'secondary'
          } data-testid={`badge-status-${ad.id}`}>
            {ad.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
            {ad.status === 'approved' && <CheckCircle2 className="w-3 h-3 mr-1" />}
            {ad.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
            {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-1">Category</p>
          <Badge variant="outline">{ad.category}</Badge>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-1">Description</p>
          <p className="text-sm text-muted-foreground">{ad.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium mb-1">Contact</p>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Mail className="w-3 h-3" />
                <span className="truncate">{ad.contactEmail}</span>
              </div>
              {ad.contactPhone && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Phone className="w-3 h-3" />
                  <span>{ad.contactPhone}</span>
                </div>
              )}
              {ad.websiteUrl && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Globe className="w-3 h-3" />
                  <a href={ad.websiteUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                    Visit Website <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Platform Details</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              {ad.commissionPercentage !== null && ad.commissionPercentage !== undefined && (
                <p>Commission: {ad.commissionPercentage}%</p>
              )}
              {ad.referralCode && (
                <p>Referral Code: <code className="bg-muted px-1 rounded">{ad.referralCode}</code></p>
              )}
              {ad.pricing && (
                <p>Pricing: {ad.pricing}</p>
              )}
            </div>
          </div>
        </div>

        {(ad.totalSales > 0 || ad.status === 'approved') && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm font-medium mb-2">Sales Performance</p>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Total Sales</p>
                <p className="font-semibold">{ad.totalSales}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Revenue</p>
                <p className="font-semibold">${ad.totalRevenue}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Platform Fees</p>
                <p className="font-semibold">${ad.totalPlatformFees}</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Submitted: {format(new Date(ad.createdAt), 'PPp')}
        </div>

        {showActions && (
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => updateStatus.mutate({ id: ad.id, status: 'approved' })}
              disabled={updateStatus.isPending}
              className="flex-1"
              data-testid={`button-approve-${ad.id}`}
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Approve
            </Button>
            <Button
              onClick={() => updateStatus.mutate({ id: ad.id, status: 'rejected' })}
              disabled={updateStatus.isPending}
              variant="destructive"
              className="flex-1"
              data-testid={`button-reject-${ad.id}`}
            >
              <XCircle className="w-4 h-4 mr-1.5" />
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">Advertisement Management</h1>
        <p className="text-muted-foreground">
          Review and manage advertisement submissions
        </p>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending" data-testid="tab-pending">
            Pending ({pendingAds.length})
          </TabsTrigger>
          <TabsTrigger value="approved" data-testid="tab-approved">
            Approved ({approvedAds.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" data-testid="tab-rejected">
            Rejected ({rejectedAds.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {loadingPending ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : pendingAds.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No pending advertisements</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div>
              {pendingAds.map(ad => renderAdCard(ad, true))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved">
          {loadingApproved ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : approvedAds.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No approved advertisements</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div>
              {approvedAds.map(ad => renderAdCard(ad))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected">
          {loadingRejected ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : rejectedAds.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <XCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No rejected advertisements</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div>
              {rejectedAds.map(ad => renderAdCard(ad))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
