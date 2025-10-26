import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, ArrowLeft, Settings, QrCode as QrCodeIcon, Users } from "lucide-react";
import { QRCodeManager } from "@/components/QRCodeManager";
import { useAuth } from "@/hooks/useAuth";

interface Memorial {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  inviteCode: string;
  creatorEmail: string;
  isPublic: boolean;
}

export default function ManageMemorial() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { user } = useAuth();

  const { data: memorial, isLoading } = useQuery<Memorial>({
    queryKey: ["/api/memorials", id],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-12 h-12 text-gold-400 animate-pulse mx-auto mb-4" />
          <p className="text-purple-200">Loading memorial...</p>
        </div>
      </div>
    );
  }

  if (!memorial) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-purple-900/50 border-purple-700/50">
          <CardHeader>
            <CardTitle className="text-purple-100">Memorial Not Found</CardTitle>
            <CardDescription className="text-purple-300">
              The memorial you're looking for could not be found.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate("/my-memorials")}
              className="w-full"
              data-testid="button-go-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Memorials
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const memorialName = memorial.name || `${memorial.firstName} ${memorial.lastName}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950">
      {/* Header */}
      <header className="border-b border-purple-700/50 bg-purple-950/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/my-memorials")}
              className="text-purple-200 hover:text-purple-100"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              My Memorials
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/memorial/${memorial.inviteCode}`)}
              data-testid="button-view-memorial"
            >
              View Memorial
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-purple-100 mb-2" data-testid="text-memorial-name">
            Manage Memorial: {memorialName}
          </h1>
          <p className="text-purple-300">
            Manage QR codes, settings, and permissions for this memorial
          </p>
        </div>

        <Tabs defaultValue="qr-codes" className="w-full">
          <TabsList className="bg-purple-900/50 border-purple-700/50">
            <TabsTrigger value="qr-codes" data-testid="tab-qr-codes">
              <QrCodeIcon className="w-4 h-4 mr-2" />
              QR Codes
            </TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="admins" data-testid="tab-admins">
              <Users className="w-4 h-4 mr-2" />
              Admins
            </TabsTrigger>
          </TabsList>

          <TabsContent value="qr-codes" className="mt-6">
            <QRCodeManager
              memorialId={memorial.id}
              memorialName={memorialName}
              inviteCode={memorial.inviteCode}
            />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card className="bg-purple-900/50 border-purple-700/50">
              <CardHeader>
                <CardTitle className="text-purple-100">Memorial Settings</CardTitle>
                <CardDescription className="text-purple-300">
                  Configure privacy and display settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-purple-300">Settings panel coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admins" className="mt-6">
            <Card className="bg-purple-900/50 border-purple-700/50">
              <CardHeader>
                <CardTitle className="text-purple-100">Memorial Administrators</CardTitle>
                <CardDescription className="text-purple-300">
                  Manage who can help administer this memorial
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-purple-300">Admin management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
