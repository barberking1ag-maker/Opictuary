import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HandshakeIcon, TrendingUp, Users, DollarSign, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function PartnerDashboard() {
  const [, params] = useRoute("/partner-dashboard/:partnerId");
  const partnerId = params?.partnerId;
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const { data: partner, isLoading: partnerLoading } = useQuery<any>({
    queryKey: ['/api/funeral-home-partners', partnerId],
    enabled: !!partnerId,
  });

  const { data: referrals = [], isLoading: referralsLoading } = useQuery<any[]>({
    queryKey: ['/api/funeral-home-partners', partnerId, 'referrals'],
    enabled: !!partnerId,
  });

  const { data: commissions = [], isLoading: commissionsLoading } = useQuery<any[]>({
    queryKey: ['/api/funeral-home-partners', partnerId, 'commissions'],
    enabled: !!partnerId,
  });

  const { data: payouts = [], isLoading: payoutsLoading } = useQuery<any[]>({
    queryKey: ['/api/funeral-home-partners', partnerId, 'payouts'],
    enabled: !!partnerId,
  });

  const handleCopyReferralCode = () => {
    if (partner?.referralCode) {
      navigator.clipboard.writeText(partner.referralCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (partnerLoading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>;
  }

  if (!partner) {
    return <div className="container mx-auto px-4 py-12 text-center">Partner not found</div>;
  }

  const totalEarnings = commissions
    .filter((c: any) => c.status !== 'cancelled')
    .reduce((sum: number, c: any) => sum + Number(c.commissionAmount), 0);

  const pendingEarnings = commissions
    .filter((c: any) => c.status === 'pending')
    .reduce((sum: number, c: any) => sum + Number(c.commissionAmount), 0);

  const paidEarnings = commissions
    .filter((c: any) => c.status === 'paid')
    .reduce((sum: number, c: any) => sum + Number(c.commissionAmount), 0);

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <HandshakeIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground" data-testid="text-partner-name">
              {partner.businessName}
            </h1>
            <p className="text-muted-foreground">Partner Dashboard</p>
          </div>
        </div>
        <Badge variant={partner.isActive ? "default" : "secondary"} data-testid="badge-status">
          {partner.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Referral Code</CardTitle>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleCopyReferralCode}
              data-testid="button-copy-code"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono font-bold text-primary" data-testid="text-referral-code">
              {partner.referralCode}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Share with families
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-referrals">{referrals.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Memorials referred
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-pending-earnings">
              ${pendingEarnings.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting payout
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-earnings">
              ${totalEarnings.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All time
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="referrals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="referrals" data-testid="tab-referrals">Referrals</TabsTrigger>
          <TabsTrigger value="commissions" data-testid="tab-commissions">Commissions</TabsTrigger>
          <TabsTrigger value="payouts" data-testid="tab-payouts">Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="referrals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Referred Memorials</CardTitle>
              <CardDescription>
                Families who created memorials using your referral code
              </CardDescription>
            </CardHeader>
            <CardContent>
              {referralsLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : referrals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground" data-testid="text-no-referrals">
                  No referrals yet. Share your referral code with families to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {referrals.map((referral: any, index: number) => (
                    <div
                      key={referral.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover-elevate"
                      data-testid={`referral-${index}`}
                    >
                      <div>
                        <p className="font-medium text-foreground" data-testid={`text-referral-memorial-${index}`}>
                          Memorial ID: {referral.memorialId}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Referred: {new Date(referral.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline" data-testid={`badge-referral-code-${index}`}>
                        {referral.referralCode}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commission History</CardTitle>
              <CardDescription>
                Earnings from donations to referred memorials
              </CardDescription>
            </CardHeader>
            <CardContent>
              {commissionsLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : commissions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground" data-testid="text-no-commissions">
                  No commissions yet. Commissions are earned when donations are made to referred memorials.
                </div>
              ) : (
                <div className="space-y-4">
                  {commissions.map((commission: any, index: number) => (
                    <div
                      key={commission.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                      data-testid={`commission-${index}`}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground" data-testid={`text-commission-type-${index}`}>
                          {commission.transactionType.charAt(0).toUpperCase() + commission.transactionType.slice(1)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Transaction: ${Number(commission.transactionAmount).toFixed(2)} • 
                          Commission: ${Number(commission.commissionAmount).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(commission.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant={
                          commission.status === 'paid' ? 'default' :
                          commission.status === 'pending' ? 'secondary' :
                          'outline'
                        }
                        data-testid={`badge-commission-status-${index}`}
                      >
                        {commission.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
              <CardDescription>
                Commission payments received
              </CardDescription>
            </CardHeader>
            <CardContent>
              {payoutsLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : payouts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground" data-testid="text-no-payouts">
                  No payouts yet. Payouts are processed monthly once you reach the minimum threshold.
                </div>
              ) : (
                <div className="space-y-4">
                  {payouts.map((payout: any, index: number) => (
                    <div
                      key={payout.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                      data-testid={`payout-${index}`}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground" data-testid={`text-payout-amount-${index}`}>
                          ${Number(payout.amount).toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Period: {new Date(payout.periodStart).toLocaleDateString()} - {new Date(payout.periodEnd).toLocaleDateString()}
                        </p>
                        {payout.paidAt && (
                          <p className="text-xs text-muted-foreground">
                            Paid: {new Date(payout.paidAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant={
                          payout.status === 'paid' ? 'default' :
                          payout.status === 'pending' ? 'secondary' :
                          'outline'
                        }
                        data-testid={`badge-payout-status-${index}`}
                      >
                        {payout.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
