import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Users, Heart, DollarSign, TrendingUp, Calendar, MessageSquare, Shield, Eye, Image, Share2, Bookmark, HeadphonesIcon, BookOpen, LifeBuoy, Building, Bell, UserPlus, X } from "lucide-react";
import { OpictuaryLogo } from "@/components/OpictuaryLogo";
import { Link } from "wouter";
import type { User } from "@shared/schema";

interface DashboardStats {
  users: {
    total: number;
    newToday: number;
    newThisWeek: number;
    newThisMonth: number;
  };
  memorials: {
    total: number;
    public: number;
    private: number;
    createdThisWeek: number;
  };
  memories: {
    total: number;
    approved: number;
    pending: number;
    createdThisWeek: number;
  };
  fundraisers: {
    total: number;
    active: number;
    totalRaised: number;
    averageGoal: number;
  };
  donations: {
    total: number;
    totalAmount: number;
    averageDonation: number;
    thisWeek: number;
  };
  platformRevenue: {
    total: number;
  };
  pageViews: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  topPages: Array<{
    path: string;
    views: number;
  }>;
  analytics: {
    totalViews: number;
    totalShares: number;
    totalSaves: number;
    viewsThisWeek: number;
    sharesThisWeek: number;
    savesThisWeek: number;
  };
  topMemorials: Array<{
    memorialId: string;
    views: number;
    shares: number;
    saves: number;
  }>;
  support: {
    totalArticles: number;
    totalResources: number;
    totalRequests: number;
    pendingRequests: number;
    resolvedRequests: number;
    requestsThisWeek: number;
    totalArticleViews: number;
    partnerRequests: number;
    partnerPendingRequests: number;
  };
  partners: {
    funeralHomes: {
      total: number;
      active: number;
      newThisWeek: number;
      newThisMonth: number;
      totalReferrals: number;
      totalCommissions: number;
      pendingPayouts: number;
    };
    flowerShops: {
      total: number;
      active: number;
      newThisWeek: number;
      newThisMonth: number;
      totalOrders: number;
      totalCommissions: number;
      pendingPayouts: number;
    };
  };
}

export default function AdminDashboard() {
  const [dismissedNotification, setDismissedNotification] = useState(false);
  
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/admin/stats'],
  });

  // Fetch recent users (last 7 days)
  const { data: recentUsers = [] } = useQuery<User[]>({
    queryKey: ['/api/admin/recent-users'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to view this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-serif font-bold text-foreground" data-testid="text-admin-title">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-muted-foreground" data-testid="text-admin-subtitle">
              Platform analytics and insights
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/screenshots">
              <Button variant="outline" data-testid="button-screenshots">
                <Image className="w-4 h-4 mr-2" />
                Play Store Screenshots
              </Button>
            </Link>
            <OpictuaryLogo variant="classic" showTagline={false} />
          </div>
        </div>

        {/* New User Notification */}
        {recentUsers.length > 0 && !dismissedNotification && (
          <Alert className="border-2 border-primary/50 bg-gradient-to-br from-primary/10 via-primary/5 to-background" data-testid="alert-new-users">
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 p-2 rounded-full flex-shrink-0">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <AlertTitle className="text-lg font-semibold flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-primary" />
                  New User{recentUsers.length > 1 ? 's' : ''} Registered!
                </AlertTitle>
                <AlertDescription className="mt-2">
                  <p className="text-muted-foreground mb-3">
                    {recentUsers.length} new user{recentUsers.length > 1 ? 's have' : ' has'} joined Opictuary in the last 7 days:
                  </p>
                  <div className="space-y-2">
                    {recentUsers.map((user) => (
                      <Card key={user.id} className="bg-card/50" data-testid={`card-new-user-${user.id}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-foreground" data-testid={`text-user-name-${user.id}`}>
                                {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
                              </p>
                              <p className="text-sm text-muted-foreground" data-testid={`text-user-email-${user.id}`}>
                                {user.email}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-primary" data-testid={`text-user-date-${user.id}`}>
                                {new Date(user.createdAt || '').toLocaleDateString()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(user.createdAt || '').toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AlertDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDismissedNotification(true)}
                className="flex-shrink-0"
                data-testid="button-dismiss-notification"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </Alert>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3" data-testid="tabs-admin">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="engagement" data-testid="tab-engagement">Engagement</TabsTrigger>
            <TabsTrigger value="revenue" data-testid="tab-revenue">Revenue</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Total Users */}
              <Card data-testid="card-total-users">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tabular-nums" data-testid="text-total-users">
                    {stats.users.total.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground" data-testid="text-new-users-week">
                    +{stats.users.newThisWeek.toLocaleString()} this week
                  </p>
                </CardContent>
              </Card>

              {/* Total Memorials */}
              <Card data-testid="card-total-memorials">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Memorials</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tabular-nums" data-testid="text-total-memorials">
                    {stats.memorials.total.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground" data-testid="text-public-memorials">
                    {stats.memorials.public.toLocaleString()} public, {stats.memorials.private.toLocaleString()} private
                  </p>
                </CardContent>
              </Card>

              {/* Total Raised */}
              <Card data-testid="card-total-raised">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tabular-nums" data-testid="text-total-raised">
                    ${parseFloat(stats.fundraisers.totalRaised.toString()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-muted-foreground" data-testid="text-active-fundraisers">
                    {stats.fundraisers.active.toLocaleString()} active fundraisers
                  </p>
                </CardContent>
              </Card>

              {/* Page Views */}
              <Card data-testid="card-page-views">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tabular-nums" data-testid="text-total-views">
                    {stats.pageViews.total.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground" data-testid="text-views-today">
                    {stats.pageViews.today.toLocaleString()} today
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* User Growth */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card data-testid="card-user-growth">
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>New user registrations over time</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Today</span>
                    <span className="text-lg font-semibold tabular-nums" data-testid="text-users-today">
                      {stats.users.newToday.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">This Week</span>
                    <span className="text-lg font-semibold tabular-nums" data-testid="text-users-week">
                      {stats.users.newThisWeek.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">This Month</span>
                    <span className="text-lg font-semibold tabular-nums" data-testid="text-users-month">
                      {stats.users.newThisMonth.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-top-pages">
                <CardHeader>
                  <CardTitle>Top Pages</CardTitle>
                  <CardDescription>Most visited pages this week</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats.topPages.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No page view data yet</p>
                  ) : (
                    stats.topPages.map((page, index) => (
                      <div key={index} className="flex items-center justify-between gap-2" data-testid={`item-page-${index}`}>
                        <span className="text-sm text-muted-foreground truncate flex-1">{page.path}</span>
                        <span className="text-lg font-semibold tabular-nums flex-shrink-0">
                          {page.views.toLocaleString()}
                        </span>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Support System Metrics */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <HeadphonesIcon className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Support System</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card data-testid="card-support-articles">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Help Articles</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold tabular-nums" data-testid="text-total-articles">
                      {stats.support.totalArticles.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground" data-testid="text-article-views">
                      {stats.support.totalArticleViews.toLocaleString()} total views
                    </p>
                  </CardContent>
                </Card>

                <Card data-testid="card-grief-resources">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Grief Resources</CardTitle>
                    <LifeBuoy className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold tabular-nums" data-testid="text-total-resources">
                      {stats.support.totalResources.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">Available resources</p>
                  </CardContent>
                </Card>

                <Card data-testid="card-support-requests">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold tabular-nums" data-testid="text-total-requests">
                      {stats.support.totalRequests.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground" data-testid="text-pending-requests">
                      {stats.support.pendingRequests.toLocaleString()} pending
                    </p>
                  </CardContent>
                </Card>

                <Card data-testid="card-requests-week">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Recent Tickets</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold tabular-nums" data-testid="text-requests-week">
                      {stats.support.requestsThisWeek.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">Submitted this week</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card data-testid="card-ticket-status">
                  <CardHeader>
                    <CardTitle>Ticket Status</CardTitle>
                    <CardDescription>Support request breakdown</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Pending</span>
                      <span className="text-lg font-semibold tabular-nums text-orange-500" data-testid="text-pending-count">
                        {stats.support.pendingRequests.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Resolved</span>
                      <span className="text-lg font-semibold tabular-nums text-green-500" data-testid="text-resolved-count">
                        {stats.support.resolvedRequests.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Resolution Rate</span>
                      <span className="text-lg font-semibold tabular-nums" data-testid="text-resolution-rate">
                        {stats.support.totalRequests > 0 
                          ? ((stats.support.resolvedRequests / stats.support.totalRequests) * 100).toFixed(1)
                          : 0}%
                      </span>
                    </div>
                    <div className="border-t border-border pt-4 mt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Building className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">Partner Requests</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Partner Tickets</span>
                        <span className="text-lg font-semibold tabular-nums" data-testid="text-partner-requests">
                          {stats.support.partnerRequests.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-muted-foreground">Partner Pending</span>
                        <span className="text-lg font-semibold tabular-nums text-orange-500" data-testid="text-partner-pending">
                          {stats.support.partnerPendingRequests.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card data-testid="card-support-actions">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Manage support resources</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link href="/support">
                      <Button variant="outline" className="w-full justify-start" data-testid="button-view-support-hub">
                        <BookOpen className="w-4 h-4 mr-2" />
                        View Support Hub
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Business Partners Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Business Partners</h2>
              </div>
              
              {/* Funeral Home Partners */}
              <div>
                <h3 className="text-md font-medium mb-3 text-foreground">Funeral Home Partners</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card data-testid="card-funeral-homes-total">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Partners</CardTitle>
                      <Building className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold tabular-nums" data-testid="text-funeral-homes-total">
                        {stats.partners.funeralHomes.total.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground" data-testid="text-funeral-homes-active">
                        {stats.partners.funeralHomes.active.toLocaleString()} active
                      </p>
                    </CardContent>
                  </Card>

                  <Card data-testid="card-funeral-homes-new">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">New Partners</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold tabular-nums" data-testid="text-funeral-homes-week">
                        {stats.partners.funeralHomes.newThisWeek.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground" data-testid="text-funeral-homes-month">
                        {stats.partners.funeralHomes.newThisMonth.toLocaleString()} this month
                      </p>
                    </CardContent>
                  </Card>

                  <Card data-testid="card-funeral-referrals">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold tabular-nums" data-testid="text-total-referrals">
                        {stats.partners.funeralHomes.totalReferrals.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">Memorials created</p>
                    </CardContent>
                  </Card>

                  <Card data-testid="card-funeral-commissions">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Commissions</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold tabular-nums" data-testid="text-funeral-commissions">
                        ${parseFloat(stats.partners.funeralHomes.totalCommissions.toString()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <p className="text-xs text-muted-foreground" data-testid="text-funeral-pending-payouts">
                        ${parseFloat(stats.partners.funeralHomes.pendingPayouts.toString()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} pending
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Flower Shop Partners */}
              <div>
                <h3 className="text-md font-medium mb-3 text-foreground">Flower Shop Partners</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card data-testid="card-flower-shops-total">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Partners</CardTitle>
                      <Building className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold tabular-nums" data-testid="text-flower-shops-total">
                        {stats.partners.flowerShops.total.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground" data-testid="text-flower-shops-active">
                        {stats.partners.flowerShops.active.toLocaleString()} active
                      </p>
                    </CardContent>
                  </Card>

                  <Card data-testid="card-flower-shops-new">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">New Partners</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold tabular-nums" data-testid="text-flower-shops-week">
                        {stats.partners.flowerShops.newThisWeek.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground" data-testid="text-flower-shops-month">
                        {stats.partners.flowerShops.newThisMonth.toLocaleString()} this month
                      </p>
                    </CardContent>
                  </Card>

                  <Card data-testid="card-flower-orders">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                      <Heart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold tabular-nums" data-testid="text-total-flower-orders">
                        {stats.partners.flowerShops.totalOrders.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">Flower deliveries</p>
                    </CardContent>
                  </Card>

                  <Card data-testid="card-flower-commissions">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Commissions (20%)</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold tabular-nums" data-testid="text-flower-commissions">
                        ${parseFloat(stats.partners.flowerShops.totalCommissions.toString()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <p className="text-xs text-muted-foreground" data-testid="text-flower-pending-payouts">
                        ${parseFloat(stats.partners.flowerShops.pendingPayouts.toString()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} pending
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="space-y-6">
            {/* Memorial Analytics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Memorial Views */}
              <Card data-testid="card-memorial-views">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Memorial Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tabular-nums" data-testid="text-total-views">
                    {stats.analytics.totalViews.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground" data-testid="text-views-week">
                    {stats.analytics.viewsThisWeek.toLocaleString()} this week
                  </p>
                </CardContent>
              </Card>

              {/* Memorial Shares */}
              <Card data-testid="card-memorial-shares">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Memorial Shares</CardTitle>
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tabular-nums" data-testid="text-total-shares">
                    {stats.analytics.totalShares.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground" data-testid="text-shares-week">
                    {stats.analytics.sharesThisWeek.toLocaleString()} this week
                  </p>
                </CardContent>
              </Card>

              {/* Memorial Saves */}
              <Card data-testid="card-memorial-saves">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Memorial Saves</CardTitle>
                  <Bookmark className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tabular-nums" data-testid="text-total-saves">
                    {stats.analytics.totalSaves.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground" data-testid="text-saves-week">
                    {stats.analytics.savesThisWeek.toLocaleString()} this week
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Memories & Activity */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Memories */}
              <Card data-testid="card-memories">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Memories Shared</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tabular-nums" data-testid="text-total-memories">
                    {stats.memories.total.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground" data-testid="text-memories-status">
                    {stats.memories.approved.toLocaleString()} approved, {stats.memories.pending.toLocaleString()} pending
                  </p>
                </CardContent>
              </Card>

              {/* Memorial Activity */}
              <Card data-testid="card-memorial-activity">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Memorial Activity</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tabular-nums" data-testid="text-memorials-week">
                    {stats.memorials.createdThisWeek.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">New memorials this week</p>
                </CardContent>
              </Card>

              {/* Recent Engagement */}
              <Card data-testid="card-recent-engagement">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recent Engagement</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tabular-nums" data-testid="text-engagement-week">
                    {stats.memories.createdThisWeek.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">Memories added this week</p>
                </CardContent>
              </Card>
            </div>

            {/* Top Memorials by Engagement */}
            <Card data-testid="card-top-memorials">
              <CardHeader>
                <CardTitle>Top Memorials</CardTitle>
                <CardDescription>Most engaged memorials this week</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.topMemorials.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No memorial engagement data yet</p>
                ) : (
                  <div className="space-y-4">
                    {stats.topMemorials.map((memorial, index) => (
                      <div key={memorial.memorialId} className="flex items-center justify-between gap-4" data-testid={`item-memorial-${index}`}>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" data-testid={`text-memorial-id-${index}`}>
                            Memorial {memorial.memorialId.slice(0, 8)}...
                          </p>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <div className="flex items-center gap-1" title="Views">
                            <Eye className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm tabular-nums" data-testid={`text-memorial-views-${index}`}>
                              {memorial.views.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1" title="Shares">
                            <Share2 className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm tabular-nums" data-testid={`text-memorial-shares-${index}`}>
                              {memorial.shares.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1" title="Saves">
                            <Bookmark className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm tabular-nums" data-testid={`text-memorial-saves-${index}`}>
                              {memorial.saves.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            {/* Platform Revenue Highlight */}
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5" data-testid="card-platform-revenue-highlight">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-medium">Platform Revenue</CardTitle>
                  <CardDescription>Total fees from fundraiser donations (3% default)</CardDescription>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold tabular-nums text-primary" data-testid="text-platform-revenue">
                  ${parseFloat(stats.platformRevenue.total.toString()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  From {stats.donations.total.toLocaleString()} donations totaling ${parseFloat(stats.donations.totalAmount.toString()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Total Donations */}
              <Card data-testid="card-total-donations">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tabular-nums" data-testid="text-donations-count">
                    {stats.donations.total.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground" data-testid="text-donations-week">
                    {stats.donations.thisWeek.toLocaleString()} this week
                  </p>
                </CardContent>
              </Card>

              {/* Total Amount */}
              <Card data-testid="card-total-amount">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tabular-nums" data-testid="text-donations-amount">
                    ${parseFloat(stats.donations.totalAmount.toString()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-muted-foreground">All-time donations</p>
                </CardContent>
              </Card>

              {/* Average Donation */}
              <Card data-testid="card-average-donation">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Donation</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tabular-nums" data-testid="text-average-donation">
                    ${parseFloat(stats.donations.averageDonation.toString()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-muted-foreground">Per donation</p>
                </CardContent>
              </Card>

              {/* Average Goal */}
              <Card data-testid="card-average-goal">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Goal</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tabular-nums" data-testid="text-average-goal">
                    ${parseFloat(stats.fundraisers.averageGoal.toString()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-muted-foreground">Per fundraiser</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
