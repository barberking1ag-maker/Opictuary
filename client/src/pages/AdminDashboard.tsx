import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Users, Heart, DollarSign, TrendingUp, Calendar, MessageSquare, Shield, Eye, Image } from "lucide-react";
import { OpictuaryLogo } from "@/components/OpictuaryLogo";
import { Link } from "wouter";

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
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/admin/stats'],
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
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="space-y-6">
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
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
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
