import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Memorial } from "@shared/schema";
import { 
  MapPin, 
  Navigation, 
  Map, 
  Compass, 
  ExternalLink, 
  Edit2, 
  Save, 
  Target, 
  Car, 
  Footprints,
  ArrowLeft,
  Building,
  Globe
} from "lucide-react";
import { Link } from "wouter";

interface CemeteryCoordinates {
  lat: number;
  lng: number;
}

export default function CemeteryNavigator() {
  const params = useParams();
  const memorialId = params.memorialId as string;
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [coordinates, setCoordinates] = useState<CemeteryCoordinates | null>(null);
  const [cemeteryName, setCemeteryName] = useState("");
  const [cemeteryLocation, setCemeteryLocation] = useState("");
  const { toast } = useToast();

  const { data: memorial, isLoading } = useQuery<Memorial>({
    queryKey: [`/api/memorials/${memorialId}`],
    enabled: !!memorialId,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { cemeteryCoordinates?: CemeteryCoordinates; cemeteryName?: string; cemeteryLocation?: string }) => {
      return apiRequest("PATCH", `/api/memorials/${memorialId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/memorials/${memorialId}`] });
      setShowEditDialog(false);
      toast({
        title: "Location Updated",
        description: "Cemetery location has been saved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update cemetery location",
        variant: "destructive",
      });
    },
  });

  const handleEditLocation = () => {
    setCoordinates(memorial?.cemeteryCoordinates || null);
    setCemeteryName(memorial?.cemeteryName || "");
    setCemeteryLocation(memorial?.cemeteryLocation || "");
    setShowEditDialog(true);
  };

  const handleSaveLocation = () => {
    updateMutation.mutate({
      cemeteryCoordinates: coordinates || undefined,
      cemeteryName: cemeteryName || undefined,
      cemeteryLocation: cemeteryLocation || undefined,
    });
  };

  const handleGetCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast({
            title: "Location Detected",
            description: "Your current location has been set.",
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to get your current location. Please enter coordinates manually.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Not Supported",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
    }
  };

  const getGoogleMapsUrl = (coords: CemeteryCoordinates) => {
    return `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
  };

  const getGoogleMapsDirectionsUrl = (coords: CemeteryCoordinates) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
  };

  const getAppleMapsUrl = (coords: CemeteryCoordinates) => {
    return `https://maps.apple.com/?q=${coords.lat},${coords.lng}`;
  };

  const getAppleMapsDirectionsUrl = (coords: CemeteryCoordinates) => {
    return `https://maps.apple.com/?daddr=${coords.lat},${coords.lng}`;
  };

  const getWazeUrl = (coords: CemeteryCoordinates) => {
    return `https://waze.com/ul?ll=${coords.lat},${coords.lng}&navigate=yes`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
      </div>
    );
  }

  if (!memorial) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Memorial Not Found</h2>
          <p className="text-muted-foreground">The memorial you're looking for doesn't exist.</p>
        </Card>
      </div>
    );
  }

  const hasCoordinates = memorial.cemeteryCoordinates?.lat && memorial.cemeteryCoordinates?.lng;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Link href={`/memorial/${memorial.inviteCode}`}>
          <Button variant="ghost" className="mb-6" data-testid="button-back-memorial">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Memorial
          </Button>
        </Link>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Compass className="h-10 w-10 text-emerald-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Cemetery GPS Navigator
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find and navigate to {memorial.name}'s resting place with GPS-guided directions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Cemetery Information
              </CardTitle>
              <CardDescription className="text-emerald-100">
                Location details for {memorial.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <Label className="text-sm text-muted-foreground">Cemetery Name</Label>
                    <p className="font-medium" data-testid="text-cemetery-name">
                      {memorial.cemeteryName || "Not specified"}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <Label className="text-sm text-muted-foreground">Address</Label>
                    <p className="font-medium" data-testid="text-cemetery-location">
                      {memorial.cemeteryLocation || "Not specified"}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <Label className="text-sm text-muted-foreground">GPS Coordinates</Label>
                    {hasCoordinates ? (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" data-testid="text-coordinates">
                          {memorial.cemeteryCoordinates!.lat.toFixed(6)}, {memorial.cemeteryCoordinates!.lng.toFixed(6)}
                        </Badge>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No coordinates set</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 p-4">
              <Button 
                onClick={handleEditLocation} 
                variant="outline" 
                className="w-full"
                data-testid="button-edit-location"
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Location
              </Button>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Navigation Options
              </CardTitle>
              <CardDescription className="text-blue-100">
                Get directions to the cemetery
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {hasCoordinates ? (
                <div className="space-y-4">
                  <div className="grid gap-3">
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover-elevate"
                      data-testid="button-google-maps"
                    >
                      <a
                        href={getGoogleMapsDirectionsUrl(memorial.cemeteryCoordinates!)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Car className="mr-2 h-4 w-4" />
                        Navigate with Google Maps
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      className="w-full"
                      data-testid="button-apple-maps"
                    >
                      <a
                        href={getAppleMapsDirectionsUrl(memorial.cemeteryCoordinates!)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Map className="mr-2 h-4 w-4" />
                        Navigate with Apple Maps
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      className="w-full"
                      data-testid="button-waze"
                    >
                      <a
                        href={getWazeUrl(memorial.cemeteryCoordinates!)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Navigation className="mr-2 h-4 w-4" />
                        Navigate with Waze
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>

                  <Separator />

                  <div className="grid gap-3">
                    <Button
                      asChild
                      variant="secondary"
                      className="w-full"
                      data-testid="button-view-map"
                    >
                      <a
                        href={getGoogleMapsUrl(memorial.cemeteryCoordinates!)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        View on Google Maps
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>

                    <Button
                      asChild
                      variant="secondary"
                      className="w-full"
                      data-testid="button-walking-directions"
                    >
                      <a
                        href={`${getGoogleMapsDirectionsUrl(memorial.cemeteryCoordinates!)}&travelmode=walking`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Footprints className="mr-2 h-4 w-4" />
                        Walking Directions
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No GPS coordinates have been set for this memorial.
                  </p>
                  <Button onClick={handleEditLocation} data-testid="button-add-coordinates">
                    <Target className="mr-2 h-4 w-4" />
                    Add Cemetery Location
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-600" />
                Edit Cemetery Location
              </DialogTitle>
              <DialogDescription>
                Update the cemetery details and GPS coordinates
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="cemeteryName">Cemetery Name</Label>
                <Input
                  id="cemeteryName"
                  value={cemeteryName}
                  onChange={(e) => setCemeteryName(e.target.value)}
                  placeholder="Enter cemetery name"
                  data-testid="input-cemetery-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cemeteryLocation">Address</Label>
                <Input
                  id="cemeteryLocation"
                  value={cemeteryLocation}
                  onChange={(e) => setCemeteryLocation(e.target.value)}
                  placeholder="Enter full address"
                  data-testid="input-cemetery-address"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>GPS Coordinates</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleGetCurrentLocation}
                    data-testid="button-get-location"
                  >
                    <Target className="mr-2 h-4 w-4" />
                    Use Current Location
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="lat" className="text-xs text-muted-foreground">Latitude</Label>
                    <Input
                      id="lat"
                      type="number"
                      step="any"
                      value={coordinates?.lat || ""}
                      onChange={(e) => setCoordinates({
                        lat: parseFloat(e.target.value) || 0,
                        lng: coordinates?.lng || 0,
                      })}
                      placeholder="e.g., 40.7128"
                      data-testid="input-latitude"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lng" className="text-xs text-muted-foreground">Longitude</Label>
                    <Input
                      id="lng"
                      type="number"
                      step="any"
                      value={coordinates?.lng || ""}
                      onChange={(e) => setCoordinates({
                        lat: coordinates?.lat || 0,
                        lng: parseFloat(e.target.value) || 0,
                      })}
                      placeholder="e.g., -74.0060"
                      data-testid="input-longitude"
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveLocation} 
                disabled={updateMutation.isPending}
                data-testid="button-save-location"
              >
                {updateMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Location
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
