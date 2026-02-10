import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Film, Music, BookOpen, Camera, FileText, Lock, Video, Mic,
  Plus, Eye, ShieldCheck, Upload, CheckCircle, Clock, Crown,
  AlertTriangle, ArrowLeft, Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface VaultItem {
  id: string;
  celebrityMemorialId: string;
  title: string;
  description: string;
  contentCategory: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  price: string;
  status: string;
  viewCount: number;
  uploaderName?: string;
  uploaderEmail?: string;
  uploaderRole?: string;
  createdAt: string;
}

interface CelebrityInfo {
  id: string;
  name: string;
  title: string;
  imageUrl?: string;
  charityName?: string;
}

interface EstateVerification {
  id: string;
  status: string;
  verifierName: string;
  verifierRole: string;
}

const CONTENT_CATEGORIES = [
  { value: "all", label: "All" },
  { value: "documentaries", label: "Documentaries" },
  { value: "music", label: "Music" },
  { value: "writings", label: "Writings" },
  { value: "photos", label: "Photos" },
  { value: "books", label: "Books" },
  { value: "unreleased", label: "Unreleased" },
  { value: "films", label: "Films" },
  { value: "interviews", label: "Interviews" },
];

const CATEGORY_ICONS: Record<string, typeof Film> = {
  documentaries: Video,
  music: Music,
  writings: FileText,
  photos: Camera,
  books: BookOpen,
  unreleased: Lock,
  films: Film,
  interviews: Mic,
};

const SUBSCRIPTION_TIERS = [
  { name: "Basic", price: "$29.99/mo", features: ["Up to 50 vault items", "Basic analytics", "Email support"] },
  { name: "Premium", price: "$99.99/mo", features: ["Up to 500 vault items", "Advanced analytics", "Priority support", "Custom branding"] },
  { name: "Enterprise", price: "$249.99/mo", features: ["Unlimited vault items", "Full analytics suite", "Dedicated account manager", "API access", "Custom integrations"] },
];

const vaultItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  contentCategory: z.string().min(1, "Category is required"),
  mediaUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  thumbnailUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  price: z.string().min(1, "Price is required"),
  uploaderName: z.string().min(1, "Name is required"),
  uploaderEmail: z.string().email("Valid email required"),
  uploaderRole: z.string().min(1, "Role is required"),
});

type VaultItemFormData = z.infer<typeof vaultItemSchema>;

const verificationSchema = z.object({
  verifierName: z.string().min(1, "Name is required"),
  verifierEmail: z.string().email("Valid email required"),
  verifierRole: z.string().min(1, "Role is required"),
  phone: z.string().min(1, "Phone is required"),
  documentUrls: z.string().optional(),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

function getCategoryIcon(category: string) {
  const Icon = CATEGORY_ICONS[category] || FileText;
  return Icon;
}

export default function CelebrityLegacyVault() {
  const [, params] = useRoute("/celebrity/:id/legacy-vault");
  const celebrityMemorialId = params?.id || "";
  const [activeTab, setActiveTab] = useState("all");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const { toast } = useToast();

  const { data: celebrity, isLoading: celebrityLoading } = useQuery<CelebrityInfo>({
    queryKey: ["/api/celebrity-memorials", celebrityMemorialId],
    enabled: !!celebrityMemorialId,
  });

  const { data: storefrontItems = [], isLoading: storefrontLoading } = useQuery<VaultItem[]>({
    queryKey: ["/api/celebrity-memorials", celebrityMemorialId, "vault", "storefront"],
    enabled: !!celebrityMemorialId,
  });

  const { data: allItems = [] } = useQuery<VaultItem[]>({
    queryKey: ["/api/celebrity-memorials", celebrityMemorialId, "vault"],
    enabled: !!celebrityMemorialId,
  });

  const { data: estateVerification } = useQuery<EstateVerification>({
    queryKey: ["/api/celebrity-memorials", celebrityMemorialId, "estate-verification"],
    enabled: !!celebrityMemorialId,
  });

  const isEstateVerified = estateVerification?.status === "verified";
  const isEstateManager = !!estateVerification;
  const pendingItems = allItems.filter((item) => item.status === "pending");

  const uploadForm = useForm<VaultItemFormData>({
    resolver: zodResolver(vaultItemSchema),
    defaultValues: {
      title: "",
      description: "",
      contentCategory: "",
      mediaUrl: "",
      thumbnailUrl: "",
      price: "0",
      uploaderName: "",
      uploaderEmail: "",
      uploaderRole: "",
    },
  });

  const verificationForm = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      verifierName: "",
      verifierEmail: "",
      verifierRole: "",
      phone: "",
      documentUrls: "",
    },
  });

  const createItemMutation = useMutation({
    mutationFn: async (data: VaultItemFormData) => {
      const res = await apiRequest("POST", `/api/celebrity-memorials/${celebrityMemorialId}/vault`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/celebrity-memorials", celebrityMemorialId, "vault"] });
      queryClient.invalidateQueries({ queryKey: ["/api/celebrity-memorials", celebrityMemorialId, "vault", "storefront"] });
      setIsUploadOpen(false);
      uploadForm.reset();
      toast({ title: "Item Uploaded", description: "Your vault item has been submitted for review." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to upload item. Please try again.", variant: "destructive" });
    },
  });

  const approveItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const res = await apiRequest("PUT", `/api/celebrity-vault/${itemId}/approve`, {});
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/celebrity-memorials", celebrityMemorialId, "vault"] });
      queryClient.invalidateQueries({ queryKey: ["/api/celebrity-memorials", celebrityMemorialId, "vault", "storefront"] });
      toast({ title: "Item Approved", description: "The vault item has been approved." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to approve item.", variant: "destructive" });
    },
  });

  const releaseItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const res = await apiRequest("PUT", `/api/celebrity-vault/${itemId}/status`, { status: "released" });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/celebrity-memorials", celebrityMemorialId, "vault"] });
      queryClient.invalidateQueries({ queryKey: ["/api/celebrity-memorials", celebrityMemorialId, "vault", "storefront"] });
      toast({ title: "Item Released", description: "The vault item is now publicly available." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to release item.", variant: "destructive" });
    },
  });

  const verificationMutation = useMutation({
    mutationFn: async (data: VerificationFormData) => {
      const payload = {
        ...data,
        documentUrls: data.documentUrls ? data.documentUrls.split(",").map((u) => u.trim()) : [],
      };
      const res = await apiRequest("POST", `/api/celebrity-memorials/${celebrityMemorialId}/estate-verification`, payload);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/celebrity-memorials", celebrityMemorialId, "estate-verification"] });
      setIsVerificationOpen(false);
      verificationForm.reset();
      toast({ title: "Verification Submitted", description: "Your estate verification request has been submitted for review." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to submit verification. Please try again.", variant: "destructive" });
    },
  });

  const filteredItems = activeTab === "all"
    ? storefrontItems
    : storefrontItems.filter((item) => item.contentCategory === activeTab);

  const isLoading = celebrityLoading || storefrontLoading;

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[340px] overflow-hidden">
        {celebrity?.imageUrl ? (
          <img
            src={celebrity.imageUrl}
            alt={celebrity.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(220,30%,15%)] to-[hsl(220,30%,8%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
        <div className="relative z-10 flex flex-col justify-end h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <Button
            variant="ghost"
            size="sm"
            className="self-start mb-4 text-white/80"
            onClick={() => window.history.back()}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <Badge className="mb-3 bg-[hsl(45,80%,60%)] text-[hsl(45,80%,10%)] border-none">
                <Crown className="w-3 h-3 mr-1" />
                Legacy Vault
              </Badge>
              {isLoading ? (
                <Skeleton className="h-10 w-64 bg-white/20" />
              ) : (
                <h1 className="text-4xl md:text-5xl font-serif font-semibold text-white" data-testid="text-celebrity-name">
                  {celebrity?.name || "Celebrity"}
                </h1>
              )}
              <p className="text-white/70 mt-1 text-lg">{celebrity?.title}</p>
            </div>
            {isEstateVerified && (
              <Badge variant="outline" className="border-green-500/50 text-green-400">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Estate Verified
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isEstateVerified && (
          <Card className="mb-8 border-[hsl(45,80%,60%)]/30 bg-[hsl(45,80%,60%)]/5">
            <CardContent className="flex items-center justify-between gap-4 flex-wrap py-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-[hsl(45,80%,60%)]" />
                <div>
                  <p className="font-medium text-foreground">Estate Not Yet Verified</p>
                  <p className="text-sm text-muted-foreground">
                    Are you an authorized estate representative? Verify your status to manage this vault.
                  </p>
                </div>
              </div>
              <Dialog open={isVerificationOpen} onOpenChange={setIsVerificationOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" data-testid="button-open-verification">
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Verify Estate
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="font-serif">Estate Verification</DialogTitle>
                  </DialogHeader>
                  <Form {...verificationForm}>
                    <form onSubmit={verificationForm.handleSubmit((data) => verificationMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={verificationForm.control}
                        name="verifierName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} data-testid="input-verifier-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={verificationForm.control}
                        name="verifierEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your@email.com" {...field} data-testid="input-verifier-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={verificationForm.control}
                        name="verifierRole"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-verifier-role">
                                  <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="family_member">Family Member</SelectItem>
                                <SelectItem value="estate_lawyer">Estate Lawyer</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="executor">Executor</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={verificationForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 123-4567" {...field} data-testid="input-verifier-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={verificationForm.control}
                        name="documentUrls"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Supporting Document URLs</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Paste URLs to supporting documents (comma-separated)"
                                rows={3}
                                {...field}
                                data-testid="input-document-urls"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => setIsVerificationOpen(false)} data-testid="button-cancel-verification">
                          Cancel
                        </Button>
                        <Button type="submit" disabled={verificationMutation.isPending} data-testid="button-submit-verification">
                          {verificationMutation.isPending ? "Submitting..." : "Submit Verification"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="flex-wrap h-auto gap-1" data-testid="tabs-content-categories">
            {CONTENT_CATEGORIES.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value} data-testid={`tab-${cat.value}`}>
                {cat.value !== "all" && (() => {
                  const Icon = getCategoryIcon(cat.value);
                  return <Icon className="w-3.5 h-3.5 mr-1.5" />;
                })()}
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {CONTENT_CATEGORIES.map((cat) => (
            <TabsContent key={cat.value} value={cat.value}>
              {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                      <Skeleton className="h-44 w-full rounded-b-none" />
                      <CardContent className="p-4 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-16">
                  <Lock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2 text-foreground">No Items Available</h3>
                  <p className="text-muted-foreground">
                    {activeTab === "all"
                      ? "The vault is currently empty. Check back soon for exclusive content."
                      : `No ${cat.label.toLowerCase()} content available yet.`}
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredItems.map((item) => {
                    const Icon = getCategoryIcon(item.contentCategory);
                    const isFree = !item.price || parseFloat(item.price) === 0;
                    return (
                      <Card key={item.id} className="overflow-visible hover-elevate group" data-testid={`card-vault-item-${item.id}`}>
                        <div className="relative h-44 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center rounded-t-md overflow-hidden">
                          {item.thumbnailUrl ? (
                            <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <Icon className="w-12 h-12 text-muted-foreground/50" />
                          )}
                          <Badge
                            className={`absolute top-3 right-3 ${isFree ? "bg-green-600 text-white border-none" : "bg-[hsl(45,80%,60%)] text-[hsl(45,80%,10%)] border-none"}`}
                            data-testid={`badge-price-${item.id}`}
                          >
                            {isFree ? "Free" : `$${parseFloat(item.price).toFixed(2)}`}
                          </Badge>
                        </div>
                        <CardContent className="p-4 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-foreground line-clamp-1" data-testid={`text-title-${item.id}`}>
                              {item.title}
                            </h3>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <Badge variant="secondary" className="text-xs capitalize">
                              <Icon className="w-3 h-3 mr-1" />
                              {item.contentCategory}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {item.viewCount?.toLocaleString() || 0}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {isEstateManager && (
          <div className="space-y-8 mt-12">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-2xl font-serif font-semibold text-foreground">Estate Management</h2>
                <p className="text-muted-foreground mt-1">Manage vault content and subscriptions</p>
              </div>
              <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-upload-vault-item">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Vault Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="font-serif">Upload New Vault Item</DialogTitle>
                  </DialogHeader>
                  <Form {...uploadForm}>
                    <form onSubmit={uploadForm.handleSubmit((data) => createItemMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={uploadForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Item title" {...field} data-testid="input-vault-title" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={uploadForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Describe this vault item..." rows={3} {...field} data-testid="input-vault-description" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={uploadForm.control}
                        name="contentCategory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content Category</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-vault-category">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {CONTENT_CATEGORIES.filter((c) => c.value !== "all").map((c) => (
                                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                          control={uploadForm.control}
                          name="mediaUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Media URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://..." {...field} data-testid="input-vault-media-url" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={uploadForm.control}
                          name="thumbnailUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Thumbnail URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://..." {...field} data-testid="input-vault-thumbnail-url" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={uploadForm.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price (0 for free)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} data-testid="input-vault-price" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid gap-4 sm:grid-cols-3">
                        <FormField
                          control={uploadForm.control}
                          name="uploaderName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Uploader Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" {...field} data-testid="input-vault-uploader-name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={uploadForm.control}
                          name="uploaderEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="your@email.com" {...field} data-testid="input-vault-uploader-email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={uploadForm.control}
                          name="uploaderRole"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Role</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-vault-uploader-role">
                                    <SelectValue placeholder="Select role" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="family_member">Family Member</SelectItem>
                                  <SelectItem value="estate_lawyer">Estate Lawyer</SelectItem>
                                  <SelectItem value="manager">Manager</SelectItem>
                                  <SelectItem value="executor">Executor</SelectItem>
                                  <SelectItem value="archivist">Archivist</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => setIsUploadOpen(false)} data-testid="button-cancel-upload">
                          Cancel
                        </Button>
                        <Button type="submit" disabled={createItemMutation.isPending} data-testid="button-submit-vault-item">
                          {createItemMutation.isPending ? "Uploading..." : "Upload Item"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {pendingItems.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                  <Clock className="w-5 h-5 text-[hsl(45,80%,60%)]" />
                  Pending Items ({pendingItems.length})
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {pendingItems.map((item) => {
                    const Icon = getCategoryIcon(item.contentCategory);
                    return (
                      <Card key={item.id} data-testid={`card-pending-item-${item.id}`}>
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-base">{item.title}</CardTitle>
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                          <Badge variant="outline" className="text-xs capitalize">
                            <Icon className="w-3 h-3 mr-1" />
                            {item.contentCategory}
                          </Badge>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => approveItemMutation.mutate(item.id)}
                              disabled={approveItemMutation.isPending}
                              data-testid={`button-approve-${item.id}`}
                            >
                              <CheckCircle className="w-3.5 h-3.5 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => releaseItemMutation.mutate(item.id)}
                              disabled={releaseItemMutation.isPending}
                              data-testid={`button-release-${item.id}`}
                            >
                              <Star className="w-3.5 h-3.5 mr-1" />
                              Release
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                <Crown className="w-5 h-5 text-[hsl(45,80%,60%)]" />
                Estate Subscription Tiers
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                {SUBSCRIPTION_TIERS.map((tier) => (
                  <Card key={tier.name} data-testid={`card-tier-${tier.name.toLowerCase()}`}>
                    <CardHeader>
                      <CardTitle className="text-lg font-serif">{tier.name}</CardTitle>
                      <p className="text-2xl font-bold text-[hsl(45,80%,60%)]">{tier.price}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button variant="outline" className="w-full mt-4" data-testid={`button-select-tier-${tier.name.toLowerCase()}`}>
                        Select {tier.name}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
