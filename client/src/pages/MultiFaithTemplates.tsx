import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Search, BookOpen, Heart, Copy, Star, Globe, 
  Church, Moon, Sun, Leaf, Flame, Wind, Mountain,
  Cross
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { MultiFaithTemplate } from "@shared/schema";

const faithOptions = [
  { value: "all", label: "All Faiths", icon: Globe },
  { value: "christian", label: "Christian", icon: Cross },
  { value: "catholic", label: "Catholic", icon: Church },
  { value: "jewish", label: "Jewish", icon: Star },
  { value: "islamic", label: "Islamic", icon: Moon },
  { value: "hindu", label: "Hindu", icon: Sun },
  { value: "buddhist", label: "Buddhist", icon: Leaf },
  { value: "sikh", label: "Sikh", icon: Flame },
  { value: "native_american", label: "Native American", icon: Mountain },
  { value: "spiritual", label: "Spiritual", icon: Heart },
  { value: "secular", label: "Secular", icon: BookOpen },
  { value: "universal", label: "Universal", icon: Globe },
];

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "prayer", label: "Prayers" },
  { value: "reading", label: "Readings" },
  { value: "blessing", label: "Blessings" },
  { value: "ceremony", label: "Ceremonies" },
  { value: "song", label: "Songs/Hymns" },
  { value: "ritual", label: "Rituals" },
];

const toneColors: Record<string, string> = {
  comforting: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  celebratory: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  reflective: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  hopeful: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

export default function MultiFaithTemplates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFaith, setSelectedFaith] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<MultiFaithTemplate | null>(null);
  const { toast } = useToast();

  const { data: templates, isLoading } = useQuery<MultiFaithTemplate[]>({
    queryKey: ["/api/multi-faith-templates", selectedFaith, selectedCategory],
  });

  const filteredTemplates = templates?.filter((template) => {
    const matchesSearch = 
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFaith = selectedFaith === "all" || template.faith === selectedFaith;
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesFaith && matchesCategory;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "The text has been copied and is ready to use.",
    });
  };

  const getFaithIcon = (faith: string) => {
    const option = faithOptions.find(f => f.value === faith);
    return option?.icon || Globe;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-10 w-10 text-amber-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
              Multi-Faith Memorial Templates
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find meaningful prayers, readings, and blessings from traditions around the world
            to honor your loved ones with dignity and respect.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search prayers, readings, blessings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-templates"
            />
          </div>
          
          <Select value={selectedFaith} onValueChange={setSelectedFaith}>
            <SelectTrigger className="w-48" data-testid="select-faith-filter">
              <SelectValue placeholder="Select Faith" />
            </SelectTrigger>
            <SelectContent>
              {faithOptions.map((faith) => {
                const Icon = faith.icon;
                return (
                  <SelectItem key={faith.value} value={faith.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {faith.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40" data-testid="select-category-filter">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="grid" className="mb-6">
          <TabsList>
            <TabsTrigger value="grid" data-testid="tab-grid-view">Grid View</TabsTrigger>
            <TabsTrigger value="list" data-testid="tab-list-view">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="mt-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-5 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2 mt-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-20 bg-gray-200 rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredTemplates && filteredTemplates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => {
                  const FaithIcon = getFaithIcon(template.faith);
                  return (
                    <Card 
                      key={template.id} 
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setSelectedTemplate(template)}
                      data-testid={`card-template-${template.id}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <FaithIcon className="h-5 w-5 text-amber-600" />
                            <CardTitle className="text-lg">{template.title}</CardTitle>
                          </div>
                          {template.rating && (
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              {Number(template.rating).toFixed(1)}
                            </div>
                          )}
                        </div>
                        <CardDescription className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {template.faith.replace(/_/g, " ")}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {template.category}
                          </Badge>
                          {template.tone && (
                            <Badge className={`text-xs ${toneColors[template.tone] || "bg-gray-100"}`}>
                              {template.tone}
                            </Badge>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-4 italic">
                          "{template.content.substring(0, 150)}..."
                        </p>
                      </CardContent>
                      <CardFooter className="pt-0 flex justify-between">
                        {template.source && (
                          <span className="text-xs text-muted-foreground">{template.source}</span>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(template.content);
                          }}
                          data-testid={`button-copy-${template.id}`}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Templates Found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            <Card>
              <ScrollArea className="h-[600px]">
                {filteredTemplates?.map((template, index) => {
                  const FaithIcon = getFaithIcon(template.faith);
                  return (
                    <div key={template.id}>
                      <div 
                        className="p-4 hover:bg-muted/50 cursor-pointer"
                        onClick={() => setSelectedTemplate(template)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <FaithIcon className="h-5 w-5 text-amber-600" />
                            <div>
                              <h3 className="font-semibold">{template.title}</h3>
                              <div className="flex flex-wrap gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {template.faith.replace(/_/g, " ")}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {template.category}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(template.content);
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 italic">
                          "{template.content.substring(0, 200)}..."
                        </p>
                      </div>
                      {index < (filteredTemplates.length - 1) && <Separator />}
                    </div>
                  );
                })}
              </ScrollArea>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            {selectedTemplate && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl">
                    {(() => {
                      const Icon = getFaithIcon(selectedTemplate.faith);
                      return <Icon className="h-6 w-6 text-amber-600" />;
                    })()}
                    {selectedTemplate.title}
                  </DialogTitle>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">
                      {selectedTemplate.faith.replace(/_/g, " ")}
                    </Badge>
                    <Badge variant="secondary">
                      {selectedTemplate.category}
                    </Badge>
                    {selectedTemplate.tone && (
                      <Badge className={toneColors[selectedTemplate.tone] || "bg-gray-100"}>
                        {selectedTemplate.tone}
                      </Badge>
                    )}
                    {selectedTemplate.suitableFor && (
                      selectedTemplate.suitableFor.map((occasion) => (
                        <Badge key={occasion} variant="outline" className="text-xs">
                          {occasion}
                        </Badge>
                      ))
                    )}
                  </div>
                </DialogHeader>
                
                <ScrollArea className="max-h-[400px] mt-4">
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg">
                    <p className="text-lg leading-relaxed whitespace-pre-wrap" data-testid="text-template-content">
                      {selectedTemplate.content}
                    </p>
                  </div>
                  
                  {selectedTemplate.source && (
                    <p className="mt-4 text-sm text-muted-foreground text-right">
                      — {selectedTemplate.source}
                    </p>
                  )}
                </ScrollArea>

                <DialogFooter className="mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedTemplate(null)}
                  >
                    Close
                  </Button>
                  <Button 
                    onClick={() => copyToClipboard(selectedTemplate.content)}
                    data-testid="button-copy-full-template"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy to Clipboard
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        <Card className="mt-12 bg-gradient-to-r from-amber-100/50 to-orange-100/50 dark:from-amber-900/20 dark:to-orange-900/20 border-0">
          <CardContent className="pt-8 pb-8 text-center">
            <Globe className="h-12 w-12 mx-auto text-amber-600 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Embracing All Traditions</h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our collection includes prayers, readings, and blessings from many faith traditions.
              Each template is curated with respect and can be personalized for your loved one's memorial.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
