import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { UserAvatar } from "@/components/UserAvatar";
import { useToast } from "@/hooks/use-toast";
import { User, Settings, Bell, Shield, Heart, AlertTriangle } from "lucide-react";
import { useLocation } from "wouter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function UserProfile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [location] = useLocation();
  const params = new URLSearchParams(location.split('?')[1]);
  const defaultTab = params.get('tab') || 'profile';
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    phone: "",
  });

  // Fetch user settings from database
  const { data: userSettings } = useQuery({
    queryKey: ["/api/user/settings"],
    enabled: isAuthenticated,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    memorialUpdates: true,
    donationReceipts: true,
    scheduledMessageReminders: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    shareActivityWithCreators: true,
    publicProfile: true,
  });

  // Initialize form data from user object when it loads
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        bio: user.bio || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  // Initialize settings from database when they load
  useEffect(() => {
    if (userSettings && typeof userSettings === 'object') {
      const settings = userSettings as any;
      setNotificationSettings({
        emailNotifications: settings.emailNotifications ?? true,
        pushNotifications: settings.pushNotifications ?? true,
        memorialUpdates: settings.memorialUpdates ?? true,
        donationReceipts: settings.donationReceipts ?? true,
        scheduledMessageReminders: settings.scheduledMessageReminders ?? true,
      });
      setPrivacySettings({
        shareActivityWithCreators: settings.shareActivityWithCreators ?? true,
        publicProfile: settings.publicProfile ?? true,
      });
    }
  }, [userSettings]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { firstName?: string; lastName?: string; bio?: string; phone?: string }) => {
      const res = await apiRequest("PATCH", "/api/user/profile", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("PATCH", "/api/user/settings", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/settings"] });
      toast({
        title: "Settings Updated",
        description: "Your settings have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update your settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      bio: profileData.bio,
      phone: profileData.phone,
    });
  };

  const handleNotificationSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate(notificationSettings);
  };

  const handlePrivacySettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate(privacySettings);
  };

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("DELETE", "/api/user/account", {});
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted. You will be logged out.",
      });
      // Wait a moment to show the toast, then redirect to logout
      setTimeout(() => {
        window.location.href = '/api/logout';
      }, 2000);
    },
    onError: (error: any) => {
      toast({
        title: "Deletion Failed",
        description: error.message || "Failed to delete your account. Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteAccount = () => {
    if (confirmText !== "DELETE") {
      toast({
        title: "Incorrect Confirmation",
        description: 'Please type "DELETE" to confirm account deletion.',
        variant: "destructive",
      });
      return;
    }
    deleteAccountMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-muted animate-pulse" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>
              Please login to view and manage your profile.
            </CardDescription>
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

  const fullName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.firstName || user?.lastName || "User";

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <UserAvatar 
              src={user?.profileImageUrl} 
              name={fullName}
              email={user?.email || undefined}
              size="lg"
              className="h-24 w-24 text-2xl"
            />
          </div>
          <h1 className="text-3xl font-serif font-bold mb-2" data-testid="text-profile-heading">
            {fullName}
          </h1>
          <p className="text-muted-foreground" data-testid="text-profile-email">
            {user?.email}
          </p>
        </div>

        {/* Profile Tabs */}
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="profile" className="gap-2" data-testid="tab-profile">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2" data-testid="tab-settings">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2" data-testid="tab-notifications">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="gap-2" data-testid="tab-privacy">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        placeholder="Enter your first name"
                        data-testid="input-first-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                        placeholder="Enter your last name"
                        data-testid="input-last-name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                      className="bg-muted"
                      data-testid="input-email"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed. Contact support if you need to update it.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="Enter your phone number"
                      data-testid="input-phone"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      placeholder="Tell us a bit about yourself..."
                      rows={4}
                      data-testid="input-bio"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setProfileData({
                        firstName: user?.firstName || "",
                        lastName: user?.lastName || "",
                        email: user?.email || "",
                        bio: "",
                        phone: "",
                      })}
                      data-testid="button-cancel"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={updateProfileMutation.isPending}
                      data-testid="button-save-profile"
                    >
                      {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Password & Security</h3>
                  <p className="text-sm text-muted-foreground">
                    Your account is secured through Replit authentication. Password management is handled automatically.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Account Data</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Download Your Data</p>
                      <p className="text-sm text-muted-foreground">
                        Request a copy of all your data
                      </p>
                    </div>
                    <Button variant="outline" data-testid="button-download-data">
                      Request Download
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
                  <Card className="border-destructive/50 bg-destructive/5">
                    <CardContent className="pt-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" aria-hidden="true" />
                          <div className="flex-1">
                            <p className="font-semibold text-destructive">Delete Account</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Permanently delete your account and all associated data. This action cannot be undone.
                            </p>
                            <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                              <li>All your saved memorials will be removed</li>
                              <li>Your profile and settings will be deleted</li>
                              <li>Any condolences or memories you created will be anonymized</li>
                              <li>Memorials you created will remain but your account will be disconnected</li>
                            </ul>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button 
                            variant="destructive" 
                            onClick={() => setDeleteDialogOpen(true)}
                            data-testid="button-delete-account"
                            aria-label="Open account deletion dialog"
                          >
                            <AlertTriangle className="w-4 h-4 mr-2" aria-hidden="true" />
                            Delete My Account
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Control how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNotificationSettingsSubmit} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates via email
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                      }
                      data-testid="switch-email-notifications"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications on your device
                      </p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
                      }
                      data-testid="switch-push-notifications"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="memorial-updates">Memorial Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications for memorials you're following
                      </p>
                    </div>
                    <Switch
                      id="memorial-updates"
                      checked={notificationSettings.memorialUpdates}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({ ...notificationSettings, memorialUpdates: checked })
                      }
                      data-testid="switch-memorial-updates"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="donation-receipts">Donation Receipts</Label>
                      <p className="text-sm text-muted-foreground">
                        Email receipts for donations made
                      </p>
                    </div>
                    <Switch
                      id="donation-receipts"
                      checked={notificationSettings.donationReceipts}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({ ...notificationSettings, donationReceipts: checked })
                      }
                      data-testid="switch-donation-receipts"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="scheduled-messages">Scheduled Message Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Reminders before milestone messages are sent
                      </p>
                    </div>
                    <Switch
                      id="scheduled-messages"
                      checked={notificationSettings.scheduledMessageReminders}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({ ...notificationSettings, scheduledMessageReminders: checked })
                      }
                      data-testid="switch-scheduled-messages"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={updateSettingsMutation.isPending}
                    data-testid="button-save-notifications"
                  >
                    {updateSettingsMutation.isPending ? "Saving..." : "Save Notification Settings"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy & Data</CardTitle>
                <CardDescription>
                  Control your privacy settings and data sharing preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Memorials You Created</h3>
                  <p className="text-sm text-muted-foreground">
                    View and manage memorials you've created
                  </p>
                  <Button variant="outline" asChild data-testid="button-view-memorials">
                    <a href="/my-memorials">
                      <Heart className="w-4 h-4 mr-2" />
                      View My Memorials
                    </a>
                  </Button>
                </div>

                <form onSubmit={handlePrivacySettingsSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Data Sharing</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Share activity with memorial creators</p>
                        <p className="text-sm text-muted-foreground">
                          Allow memorial creators to see your visits and contributions
                        </p>
                      </div>
                      <Switch 
                        checked={privacySettings.shareActivityWithCreators}
                        onCheckedChange={(checked) => 
                          setPrivacySettings({ ...privacySettings, shareActivityWithCreators: checked })
                        }
                        data-testid="switch-share-activity" 
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Public Profile</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Make profile visible to others</p>
                        <p className="text-sm text-muted-foreground">
                          Show your name and profile picture on public memorials
                        </p>
                      </div>
                      <Switch 
                        checked={privacySettings.publicProfile}
                        onCheckedChange={(checked) => 
                          setPrivacySettings({ ...privacySettings, publicProfile: checked })
                        }
                        data-testid="switch-public-profile" 
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={updateSettingsMutation.isPending}
                    data-testid="button-save-privacy"
                  >
                    {updateSettingsMutation.isPending ? "Saving..." : "Save Privacy Settings"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Account Deletion Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={(open) => {
        setDeleteDialogOpen(open);
        if (!open) {
          setConfirmText(""); // Reset confirmation text when dialog closes
        }
      }}>
        <AlertDialogContent data-testid="dialog-delete-account">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" aria-hidden="true" />
              Permanently Delete Account?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p className="text-base">
                This action is <strong>irreversible</strong>. Your account and all associated data will be permanently deleted.
              </p>
              <div className="bg-muted p-4 rounded-md space-y-2">
                <p className="font-medium text-foreground">What will be deleted:</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Your user account and profile information</li>
                  <li>All your saved memorials and bookmarks</li>
                  <li>Your notification and privacy settings</li>
                  <li>Your donation history and receipts</li>
                </ul>
              </div>
              <div className="bg-muted p-4 rounded-md space-y-2">
                <p className="font-medium text-foreground">What will also be removed:</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Condolences and memories you've posted</li>
                  <li>Comments you've made on memorials</li>
                  <li>Your likes and reactions on memorials</li>
                </ul>
              </div>
              <div className="bg-accent p-4 rounded-md space-y-2">
                <p className="font-medium text-foreground">Memorials you created:</p>
                <p className="text-sm">
                  Memorials will remain active but will no longer be connected to your account. 
                  You won't be able to manage them after deletion.
                </p>
              </div>
              <div className="pt-4 space-y-2">
                <Label htmlFor="confirm-delete" className="text-base font-medium">
                  Type <span className="font-bold text-destructive">DELETE</span> to confirm:
                </Label>
                <Input
                  id="confirm-delete"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type DELETE here"
                  className="font-mono"
                  data-testid="input-confirm-delete"
                  aria-label="Type DELETE to confirm account deletion"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => {
                setConfirmText("");
                setDeleteDialogOpen(false);
              }}
              data-testid="button-cancel-delete"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={confirmText !== "DELETE" || deleteAccountMutation.isPending}
              className="bg-destructive hover:bg-destructive/90"
              data-testid="button-confirm-delete"
              aria-label="Confirm account deletion"
            >
              {deleteAccountMutation.isPending ? "Deleting..." : "Delete Account Permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
