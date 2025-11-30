import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Mail, Clock, MessageSquare, Filter, ChevronRight } from "lucide-react";
import { format, isBefore, addDays, startOfDay, parseISO } from "date-fns";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

interface ScheduledMessage {
  id: string;
  memorialId: string;
  memorialName?: string;
  recipientName: string;
  recipientEmail: string | null;
  eventType: string;
  customEventName?: string | null;
  eventDate: string | null;
  sendTime?: string | null;
  message: string;
  mediaUrl: string | null;
  isRecurring?: boolean | null;
  recurrenceInterval?: string | null;
  status?: string | null;
  isSent: boolean;
  sentAt: string | null;
  createdAt: string;
}

const eventTypeLabels: Record<string, string> = {
  birthday: "Birthday",
  graduation: "Graduation",
  wedding: "Wedding",
  anniversary: "Anniversary",
  baby_birth: "Baby Birth",
  mother_day: "Mother's Day",
  father_day: "Father's Day",
  christmas: "Christmas",
  new_year: "New Year",
  holiday: "Holiday",
  custom: "Custom Event",
};

const statusConfig = {
  draft: { label: "Draft", color: "bg-gray-500/20 text-gray-100 border-gray-500/30" },
  pending: { label: "Pending", color: "bg-purple-500/20 text-purple-100 border-purple-500/30" },
  sent: { label: "Sent", color: "bg-green-500/20 text-green-100 border-green-500/30" },
  failed: { label: "Failed", color: "bg-red-500/20 text-red-100 border-red-500/30" },
};

export default function UpcomingMessages() {
  const { data: messages, isLoading } = useQuery<ScheduledMessage[]>({
    queryKey: ["/api/scheduled-messages/upcoming"],
  });

  const now = new Date();
  const today = startOfDay(now);
  const next7Days = addDays(today, 7);
  const next30Days = addDays(today, 30);

  // Helper to parse event date as local date (not UTC)
  const parseEventDate = (eventDate: string) => {
    // If date is in YYYY-MM-DD format, parse as local date
    if (/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) {
      const [year, month, day] = eventDate.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    // Otherwise use parseISO which handles timestamps correctly
    return parseISO(eventDate);
  };

  // Include messages scheduled for today or later that haven't been sent yet
  const upcomingMessages = messages?.filter(m => !m.isSent && m.eventDate && !isBefore(parseEventDate(m.eventDate), today)) || [];
  const next7DaysMessages = upcomingMessages.filter(m => m.eventDate && isBefore(parseEventDate(m.eventDate), next7Days));
  const next30DaysMessages = upcomingMessages.filter(m => m.eventDate && isBefore(parseEventDate(m.eventDate), next30Days));
  const draftMessages = messages?.filter(m => m.status === 'draft') || [];
  const sentMessages = messages?.filter(m => m.isSent) || [];

  const MessageCard = ({ message }: { message: ScheduledMessage }) => {
    const eventLabel = message.eventType === 'custom' && message.customEventName
      ? message.customEventName
      : eventTypeLabels[message.eventType] || message.eventType;

    const statusInfo = statusConfig[message.status as keyof typeof statusConfig] || statusConfig.pending;
    
    // Parse event date using the same helper for consistency
    const eventDate = message.eventDate ? parseEventDate(message.eventDate) : null;

    return (
      <Card className="hover-elevate active-elevate-2 transition-all" data-testid={`card-message-${message.id}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg mb-1 flex items-center gap-2 flex-wrap">
                <span className="truncate">{message.recipientName}</span>
                {message.isRecurring && (
                  <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30 text-purple-200">
                    <Calendar className="w-3 h-3 mr-1" />
                    Recurring
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 text-sm">
                <Badge className={`${statusInfo.color} border`}>
                  {statusInfo.label}
                </Badge>
                <span className="text-purple-300">•</span>
                <span className="truncate">{eventLabel}</span>
              </CardDescription>
            </div>
            {eventDate && (
              <div className="text-right shrink-0">
                <div className="text-sm font-medium text-purple-200">
                  {format(eventDate, "MMM d, yyyy")}
                </div>
                {message.sendTime && (
                  <div className="text-xs text-purple-400 flex items-center justify-end gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {message.sendTime}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-purple-200 line-clamp-2">
            {message.message}
          </div>

          {message.recipientEmail && (
            <div className="flex items-center gap-2 text-xs text-purple-300">
              <Mail className="w-3 h-3" />
              {message.recipientEmail}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-purple-700/30">
            <div className="text-xs text-purple-400">
              {message.memorialName && (
                <span>For {message.memorialName}</span>
              )}
            </div>
            <Link href={`/memorial/${message.memorialId}/future-messages`}>
              <Button variant="ghost" size="sm" data-testid={`button-view-memorial-${message.id}`}>
                View Memorial
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-200 to-gold-200 bg-clip-text text-transparent">
          Upcoming Messages
        </h1>
        <p className="text-purple-300">
          Manage all your scheduled messages across all memorials
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-300">Next 7 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-100">{next7DaysMessages.length}</div>
            <p className="text-xs text-purple-400 mt-1">Messages scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-300">Next 30 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-100">{next30DaysMessages.length}</div>
            <p className="text-xs text-purple-400 mt-1">Messages scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-300">Total Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-100">{upcomingMessages.length}</div>
            <p className="text-xs text-purple-400 mt-1">All future messages</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="bg-purple-900/30">
          <TabsTrigger value="upcoming" data-testid="tab-upcoming">
            <MessageSquare className="w-4 h-4 mr-2" />
            Upcoming ({upcomingMessages.length})
          </TabsTrigger>
          <TabsTrigger value="next7" data-testid="tab-next7">
            <Calendar className="w-4 h-4 mr-2" />
            Next 7 Days ({next7DaysMessages.length})
          </TabsTrigger>
          <TabsTrigger value="drafts" data-testid="tab-drafts">
            <Filter className="w-4 h-4 mr-2" />
            Drafts ({draftMessages.length})
          </TabsTrigger>
          <TabsTrigger value="sent" data-testid="tab-sent">
            <Mail className="w-4 h-4 mr-2" />
            Sent ({sentMessages.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          {upcomingMessages.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="w-16 h-16 text-purple-500/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Upcoming Messages</h3>
                <p className="text-purple-400 text-center max-w-md">
                  You don't have any scheduled messages. Create future messages from individual memorial pages.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingMessages.map(message => (
                <MessageCard key={message.id} message={message} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="next7" className="space-y-6">
          {next7DaysMessages.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="w-16 h-16 text-purple-500/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Messages in Next 7 Days</h3>
                <p className="text-purple-400 text-center max-w-md">
                  No messages are scheduled to be sent in the next week.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {next7DaysMessages.map(message => (
                <MessageCard key={message.id} message={message} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="drafts" className="space-y-6">
          {draftMessages.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Filter className="w-16 h-16 text-purple-500/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Draft Messages</h3>
                <p className="text-purple-400 text-center max-w-md">
                  All your messages are scheduled or sent.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {draftMessages.map(message => (
                <MessageCard key={message.id} message={message} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-6">
          {sentMessages.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Mail className="w-16 h-16 text-purple-500/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Sent Messages</h3>
                <p className="text-purple-400 text-center max-w-md">
                  Messages that have been delivered will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sentMessages.map(message => (
                <MessageCard key={message.id} message={message} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
