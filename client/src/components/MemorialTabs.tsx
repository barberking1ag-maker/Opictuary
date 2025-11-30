import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, MessageSquare, Calendar, DollarSign, MapPin, Music } from "lucide-react";

interface MemorialTabsProps {
  memoriesContent: React.ReactNode;
  condolencesContent: React.ReactNode;
  eventsContent: React.ReactNode;
  fundraiserContent: React.ReactNode;
  mapContent: React.ReactNode;
  musicContent: React.ReactNode;
}

export default function MemorialTabs({
  memoriesContent,
  condolencesContent,
  eventsContent,
  fundraiserContent,
  mapContent,
  musicContent
}: MemorialTabsProps) {
  return (
    <Tabs defaultValue="memories" className="w-full">
      <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto gap-1 bg-muted/50 p-1.5 rounded-lg">
        <TabsTrigger value="memories" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm" data-testid="tab-memories">
          <Image className="w-4 h-4" />
          <span className="hidden sm:inline">Memories</span>
        </TabsTrigger>
        <TabsTrigger value="condolences" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm" data-testid="tab-condolences">
          <MessageSquare className="w-4 h-4" />
          <span className="hidden sm:inline">Condolences</span>
        </TabsTrigger>
        <TabsTrigger value="events" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm" data-testid="tab-events">
          <Calendar className="w-4 h-4" />
          <span className="hidden sm:inline">Events</span>
        </TabsTrigger>
        <TabsTrigger value="fundraiser" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm" data-testid="tab-fundraiser">
          <DollarSign className="w-4 h-4" />
          <span className="hidden sm:inline">Fundraiser</span>
        </TabsTrigger>
        <TabsTrigger value="map" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm" data-testid="tab-map">
          <MapPin className="w-4 h-4" />
          <span className="hidden sm:inline">Location</span>
        </TabsTrigger>
        <TabsTrigger value="music" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm" data-testid="tab-music">
          <Music className="w-4 h-4" />
          <span className="hidden sm:inline">Music</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="memories" className="mt-8">
        {memoriesContent}
      </TabsContent>

      <TabsContent value="condolences" className="mt-8">
        {condolencesContent}
      </TabsContent>

      <TabsContent value="events" className="mt-8">
        {eventsContent}
      </TabsContent>

      <TabsContent value="fundraiser" className="mt-8">
        {fundraiserContent}
      </TabsContent>

      <TabsContent value="map" className="mt-8">
        {mapContent}
      </TabsContent>

      <TabsContent value="music" className="mt-8">
        {musicContent}
      </TabsContent>
    </Tabs>
  );
}
