import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Video, Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface CelebrityFanContent {
  id: string;
  celebrityMemorialId: string;
  contentType: string;
  videoUrl?: string;
  photoUrl?: string;
  caption: string;
  isPublished: boolean;
  viewCount: number;
  createdAt: string;
}

const contentSchema = z.object({
  contentType: z.string().min(1, "Content type is required"),
  videoUrl: z.string().optional(),
  photoUrl: z.string().optional(),
  caption: z.string().min(1, "Caption is required"),
});

type ContentFormData = z.infer<typeof contentSchema>;

export default function CelebrityEstateContent() {
  const [, params] = useRoute("/celebrity/:id/estate-content");
  const celebrityMemorialId = params?.id || "";
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { toast } = useToast();

  const { data: content = [], isLoading } = useQuery<CelebrityFanContent[]>({
    queryKey: ["/api/celebrity-memorials", celebrityMemorialId, "fan-content", "admin"],
  });

  const form = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      contentType: "",
      videoUrl: "",
      photoUrl: "",
      caption: "",
    },
  });

  const createContentMutation = useMutation({
    mutationFn: async (data: ContentFormData) => {
      const res = await apiRequest("POST", `/api/celebrity-memorials/${celebrityMemorialId}/fan-content`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/celebrity-memorials", celebrityMemorialId, "fan-content", "admin"] });
      setIsCreateOpen(false);
      form.reset();
      toast({
        title: "Content Created",
        description: "Celebrity estate content has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (contentId: string) => {
      const res = await apiRequest("PATCH", `/api/celebrity-fan-content/${contentId}/publish`, {});
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/celebrity-memorials", celebrityMemorialId, "fan-content", "admin"] });
      toast({
        title: "Content Published",
        description: "Content is now visible to the public.",
      });
    },
  });

  const handleSubmit = (data: ContentFormData) => {
    createContentMutation.mutate(data);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Celebrity Estate Content</h1>
          <p className="text-muted-foreground">Manage exclusive content for fans (Admin Only)</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-content">
              <Plus className="w-4 h-4 mr-2" />
              Upload Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Celebrity Content</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="contentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-content-type">
                            <SelectValue placeholder="Select content type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="video_message">Video Message</SelectItem>
                          <SelectItem value="exclusive_photo">Exclusive Photo</SelectItem>
                          <SelectItem value="behind_the_scenes">Behind the Scenes</SelectItem>
                          <SelectItem value="tribute_video">Tribute Video</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {(form.watch("contentType") === "video_message" || form.watch("contentType") === "tribute_video") && (
                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} data-testid="input-video-url" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {(form.watch("contentType") === "exclusive_photo" || form.watch("contentType") === "behind_the_scenes") && (
                  <FormField
                    control={form.control}
                    name="photoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Photo URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} data-testid="input-photo-url" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="caption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Caption</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe this content..."
                          rows={4}
                          {...field}
                          data-testid="input-caption"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateOpen(false)}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createContentMutation.isPending}
                    data-testid="button-submit-content"
                  >
                    {createContentMutation.isPending ? "Uploading..." : "Upload Content"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      ) : content.length === 0 ? (
        <Card className="p-12 text-center">
          <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Content Yet</h3>
          <p className="text-muted-foreground mb-4">
            Upload exclusive content for celebrity memorial fans
          </p>
          <Button onClick={() => setIsCreateOpen(true)} data-testid="button-upload-first">
            <Plus className="w-4 h-4 mr-2" />
            Upload Content
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {content.map((item) => (
            <Card key={item.id} data-testid={`card-content-${item.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base capitalize">
                    {item.contentType.replace(/_/g, " ")}
                  </CardTitle>
                  <Badge variant={item.isPublished ? "default" : "secondary"}>
                    {item.isPublished ? (
                      <>
                        <Eye className="w-3 h-3 mr-1" />
                        Published
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3 mr-1" />
                        Draft
                      </>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {item.videoUrl && (
                  <div className="aspect-video rounded-lg bg-black flex items-center justify-center">
                    <Video className="w-12 h-12 text-white" />
                  </div>
                )}
                {item.photoUrl && (
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <img src={item.photoUrl} alt={item.caption} className="w-full h-full object-cover" />
                  </div>
                )}
                <p className="text-sm text-muted-foreground line-clamp-3">{item.caption}</p>
                {item.isPublished && (
                  <div className="text-xs text-muted-foreground">
                    <Eye className="w-3 h-3 inline mr-1" />
                    {item.viewCount} views
                  </div>
                )}
                {!item.isPublished && (
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => publishMutation.mutate(item.id)}
                    disabled={publishMutation.isPending}
                    data-testid={`button-publish-${item.id}`}
                  >
                    Publish Content
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
