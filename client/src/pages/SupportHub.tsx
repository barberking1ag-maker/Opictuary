import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  BookOpen,
  Heart,
  HeadphonesIcon,
  Phone,
  Mail,
  MessageSquare,
  Search,
  CheckCircle,
  Clock,
  Users,
  Building,
  Flower2,
  AlertCircle,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import type { SupportArticle, GriefResource, InsertSupportRequest } from "@shared/schema";

export default function SupportHub() {
  const [selectedTab, setSelectedTab] = useState("help-center");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: articles = [] } = useQuery<SupportArticle[]>({
    queryKey: ["/api/support/articles"],
  });

  const { data: griefResources = [] } = useQuery<GriefResource[]>({
    queryKey: ["/api/support/grief-resources"],
  });

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMarkHelpful = async (articleId: string) => {
    try {
      const response = await fetch(`/api/support/articles/${articleId}/helpful`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to mark as helpful");
      
      toast({
        title: "Thank you",
        description: "Your feedback helps us improve our support resources.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0f29] to-[#2d1b4e]">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-[#d4af37] mb-2" data-testid="text-page-title">
            Support Hub
          </h1>
          <p className="text-lg text-purple-200">
            We're here to help you through every step of your journey
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-purple-900/30" data-testid="tabs-support-sections">
            <TabsTrigger value="help-center" className="gap-2" data-testid="tab-help-center">
              <BookOpen className="w-4 h-4" />
              Help Center
            </TabsTrigger>
            <TabsTrigger value="grief-support" className="gap-2" data-testid="tab-grief-support">
              <Heart className="w-4 h-4" />
              Grief Support
            </TabsTrigger>
            <TabsTrigger value="partner-support" className="gap-2" data-testid="tab-partner-support">
              <Building className="w-4 h-4" />
              Partner Support
            </TabsTrigger>
          </TabsList>

          <TabsContent value="help-center" className="space-y-6">
            <HelpCenter
              articles={filteredArticles}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onMarkHelpful={handleMarkHelpful}
            />
          </TabsContent>

          <TabsContent value="grief-support" className="space-y-6">
            <GriefSupportSection resources={griefResources} />
          </TabsContent>

          <TabsContent value="partner-support" className="space-y-6">
            <PartnerSupportSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function HelpCenter({
  articles,
  searchQuery,
  setSearchQuery,
  onMarkHelpful,
}: {
  articles: SupportArticle[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onMarkHelpful: (id: string) => void;
}) {
  const categories = Array.from(new Set(articles.map((a) => a.category)));

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-purple-900/20 border-purple-700/30">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-[#d4af37]" />
          <Label htmlFor="search-articles" className="text-lg font-medium text-purple-100">
            Search Help Articles
          </Label>
        </div>
        <Input
          id="search-articles"
          data-testid="input-search-articles"
          placeholder="What do you need help with?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-purple-950/50 border-purple-700/50 text-purple-100 placeholder:text-purple-400"
        />
      </Card>

      <div className="space-y-4">
        {categories.map((category) => {
          const categoryArticles = articles.filter((a) => a.category === category);
          if (categoryArticles.length === 0) return null;

          return (
            <Card key={category} className="p-6 bg-purple-900/20 border-purple-700/30">
              <h2 className="text-xl font-serif text-[#d4af37] mb-4" data-testid={`text-category-${category}`}>
                {category}
              </h2>
              <Accordion type="single" collapsible className="space-y-2">
                {categoryArticles.map((article) => (
                  <AccordionItem
                    key={article.id}
                    value={article.id}
                    className="border-purple-700/30"
                    data-testid={`accordion-article-${article.id}`}
                  >
                    <AccordionTrigger className="text-purple-100 hover:text-[#d4af37]">
                      {article.title}
                    </AccordionTrigger>
                    <AccordionContent className="text-purple-200 space-y-4">
                      <div className="prose prose-invert max-w-none">
                        <p>{article.content}</p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-purple-700/30">
                        <div className="flex items-center gap-4 text-sm text-purple-400">
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            {article.helpfulCount} found helpful
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onMarkHelpful(article.id)}
                          data-testid={`button-helpful-${article.id}`}
                          className="border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Helpful
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          );
        })}

        {articles.length === 0 && (
          <Card className="p-12 bg-purple-900/20 border-purple-700/30 text-center">
            <BookOpen className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <p className="text-purple-200">
              No help articles found. Please try a different search term.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

function GriefSupportSection({ resources }: { resources: GriefResource[] }) {
  const crisisResources = resources.filter((r) => r.category === "Crisis Hotlines");
  const counselingResources = resources.filter((r) => r.category === "Professional Counseling");
  const supportGroups = resources.filter((r) => r.category === "Support Groups");
  const generalResources = resources.filter(
    (r) => !["Crisis Hotlines", "Professional Counseling", "Support Groups"].includes(r.category)
  );

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-red-950/20 border-red-700/30">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-red-100 mb-2">
              Crisis Support Available 24/7
            </h3>
            <p className="text-red-200 mb-4">
              If you're experiencing a mental health crisis, please reach out immediately. You are not alone.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-100">
                <Phone className="w-4 h-4" />
                <span className="font-semibold">National Suicide Prevention Lifeline:</span>
                <a
                  href="tel:988"
                  className="text-[#d4af37] hover:underline font-semibold"
                  data-testid="link-crisis-hotline"
                >
                  988
                </a>
              </div>
              <div className="flex items-center gap-2 text-red-100">
                <MessageSquare className="w-4 h-4" />
                <span className="font-semibold">Crisis Text Line:</span>
                <span className="text-[#d4af37] font-semibold">Text "HELLO" to 741741</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {crisisResources.length > 0 && (
        <div>
          <h2 className="text-2xl font-serif text-[#d4af37] mb-4">Crisis Hotlines</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {crisisResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
      )}

      {counselingResources.length > 0 && (
        <div>
          <h2 className="text-2xl font-serif text-[#d4af37] mb-4">Professional Counseling</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {counselingResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
      )}

      {supportGroups.length > 0 && (
        <div>
          <h2 className="text-2xl font-serif text-[#d4af37] mb-4">Support Groups</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {supportGroups.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
      )}

      {generalResources.length > 0 && (
        <div>
          <h2 className="text-2xl font-serif text-[#d4af37] mb-4">Additional Resources</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {generalResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ResourceCard({ resource }: { resource: GriefResource }) {
  return (
    <Card className="p-6 bg-purple-900/20 border-purple-700/30" data-testid={`card-resource-${resource.id}`}>
      <h3 className="text-lg font-semibold text-purple-100 mb-2">{resource.title}</h3>
      <p className="text-purple-200 mb-4 text-sm">{resource.description}</p>
      <div className="space-y-2">
        {resource.phoneNumber && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-[#d4af37]" />
            <a
              href={`tel:${resource.phoneNumber}`}
              className="text-purple-100 hover:text-[#d4af37]"
              data-testid={`link-phone-${resource.id}`}
            >
              {resource.phoneNumber}
            </a>
          </div>
        )}
        {resource.url && (
          <div className="flex items-center gap-2 text-sm">
            <ExternalLink className="w-4 h-4 text-[#d4af37]" />
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-100 hover:text-[#d4af37]"
              data-testid={`link-website-${resource.id}`}
            >
              Visit Website
            </a>
          </div>
        )}
        {resource.availability && (
          <div className="flex items-center gap-2 text-sm text-purple-400">
            <Clock className="w-4 h-4" />
            {resource.availability}
          </div>
        )}
      </div>
    </Card>
  );
}

function PartnerSupportSection() {
  const [formData, setFormData] = useState({
    category: "",
    subject: "",
    name: "",
    email: "",
    phone: "",
    description: "",
    partnerType: "",
    partnerAccountId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const isPartnerCategory = formData.category === "Partner Support" || 
                            formData.category === "Flower Shop" || 
                            formData.category === "Prison Access";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        isPartnerRequest: isPartnerCategory,
        partnerType: isPartnerCategory ? formData.partnerType : undefined,
        partnerAccountId: isPartnerCategory ? formData.partnerAccountId : undefined,
      };

      const response = await fetch("/api/support/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit support request");
      }

      toast({
        title: "Support Request Submitted",
        description: isPartnerCategory 
          ? "We'll get back to you within 12-24 hours."
          : "We'll get back to you within 24-48 hours.",
      });

      setFormData({
        category: "",
        subject: "",
        name: "",
        email: "",
        phone: "",
        description: "",
        partnerType: "",
        partnerAccountId: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 bg-purple-900/20 border-purple-700/30">
          <div className="flex items-center gap-3 mb-4">
            <Building className="w-8 h-8 text-[#d4af37]" />
            <h2 className="text-2xl font-serif text-[#d4af37]">Partner Support</h2>
          </div>
          <p className="text-purple-200 mb-6">
            Dedicated support for our business partners including funeral homes, flower shops, 
            and correctional facilities. We're committed to helping you serve families with excellence.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Building className="w-5 h-5 text-[#d4af37] mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-purple-100 mb-1">Funeral Home Partners</h3>
                <p className="text-sm text-purple-200">
                  Integration support, referral tracking, commission management, and training resources
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Flower2 className="w-5 h-5 text-[#d4af37] mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-purple-100 mb-1">Flower Shop Partners</h3>
                <p className="text-sm text-purple-200">
                  Order management, commission tracking, listing optimization, and delivery coordination
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-[#d4af37] mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-purple-100 mb-1">Correctional Facilities</h3>
                <p className="text-sm text-purple-200">
                  Access system setup, verification processes, payment management, and audit support
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-purple-900/20 border-purple-700/30">
          <div className="flex items-center gap-3 mb-4">
            <HeadphonesIcon className="w-8 h-8 text-[#d4af37]" />
            <h2 className="text-2xl font-serif text-[#d4af37]">Technical Support</h2>
          </div>
          <p className="text-purple-200 mb-6">
            Get help with platform issues, technical questions, and account management.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-[#d4af37] mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-purple-100 mb-1">General Support</h3>
                <p className="text-sm text-purple-200">
                  Memorial creation, content management, privacy settings, and platform features
                </p>
                <Badge variant="secondary" className="bg-purple-800/50 mt-2">
                  Response: 24-48 hours
                </Badge>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#d4af37] mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-purple-100 mb-1">Technical Issues</h3>
                <p className="text-sm text-purple-200">
                  Platform bugs, errors, payment problems, or account access issues
                </p>
                <Badge variant="secondary" className="bg-purple-800/50 mt-2">
                  Priority Response
                </Badge>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building className="w-5 h-5 text-[#d4af37] mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-purple-100 mb-1">Partnership Inquiries</h3>
                <p className="text-sm text-purple-200">
                  Questions about becoming a partner, commission rates, or service integration
                </p>
                <Badge variant="secondary" className="bg-purple-800/50 mt-2">
                  Response: 12-24 hours
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4 bg-purple-900/20 border-purple-700/30 hover-elevate" data-testid="card-funeral-partner-resources">
          <Building className="w-6 h-6 text-[#d4af37] mb-3" />
          <h3 className="font-semibold text-purple-100 mb-2">Funeral Home Resources</h3>
          <p className="text-sm text-purple-200 mb-3">
            Access partner portal, training materials, and integration guides
          </p>
          <Link href="/partner-signup">
            <Button variant="outline" size="sm" className="w-full" data-testid="button-partner-portal">
              Partner Portal
              <ExternalLink className="w-3 h-3 ml-2" />
            </Button>
          </Link>
        </Card>

        <Card className="p-4 bg-purple-900/20 border-purple-700/30 hover-elevate" data-testid="card-flower-partner-resources">
          <Flower2 className="w-6 h-6 text-[#d4af37] mb-3" />
          <h3 className="font-semibold text-purple-100 mb-2">Flower Shop Resources</h3>
          <p className="text-sm text-purple-200 mb-3">
            Manage orders, track commissions, and optimize your listing
          </p>
          <Link href="/flower-partners">
            <Button variant="outline" size="sm" className="w-full" data-testid="button-flower-portal">
              Shop Dashboard
              <ExternalLink className="w-3 h-3 ml-2" />
            </Button>
          </Link>
        </Card>

        <Card className="p-4 bg-purple-900/20 border-purple-700/30 hover-elevate" data-testid="card-prison-partner-resources">
          <Users className="w-6 h-6 text-[#d4af37] mb-3" />
          <h3 className="font-semibold text-purple-100 mb-2">Facility Access</h3>
          <p className="text-sm text-purple-200 mb-3">
            Manage facility access, verification, and session monitoring
          </p>
          <Link href="/prison-access">
            <Button variant="outline" size="sm" className="w-full" data-testid="button-facility-portal">
              Facility Portal
              <ExternalLink className="w-3 h-3 ml-2" />
            </Button>
          </Link>
        </Card>
      </div>

      <Card className="md:col-span-3 p-8 bg-purple-900/20 border-purple-700/30">
        <h2 className="text-2xl font-serif text-[#d4af37] mb-6">Submit a Support Request</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-purple-100">
                Category *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger
                  id="category"
                  data-testid="select-category"
                  className="bg-purple-950/50 border-purple-700/50 text-purple-100"
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General Support">General Support</SelectItem>
                  <SelectItem value="Memorial Management">Memorial Management</SelectItem>
                  <SelectItem value="Payment Issues">Payment Issues</SelectItem>
                  <SelectItem value="Technical Issue">Technical Issue</SelectItem>
                  <SelectItem value="Partner Support">Partner Support</SelectItem>
                  <SelectItem value="Flower Shop">Flower Shop</SelectItem>
                  <SelectItem value="Prison Access">Prison Access</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="text-purple-100">
                Subject *
              </Label>
              <Input
                id="subject"
                data-testid="input-subject"
                placeholder="Brief description of your issue"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                className="bg-purple-950/50 border-purple-700/50 text-purple-100 placeholder:text-purple-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-purple-100">
                Your Name *
              </Label>
              <Input
                id="name"
                data-testid="input-name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-purple-950/50 border-purple-700/50 text-purple-100 placeholder:text-purple-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-purple-100">
                Email *
              </Label>
              <Input
                id="email"
                data-testid="input-email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-purple-950/50 border-purple-700/50 text-purple-100 placeholder:text-purple-400"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="phone" className="text-purple-100">
                Phone (Optional)
              </Label>
              <Input
                id="phone"
                data-testid="input-phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-purple-950/50 border-purple-700/50 text-purple-100 placeholder:text-purple-400"
              />
            </div>

            {isPartnerCategory && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="partnerType" className="text-purple-100">
                    Partner Type *
                  </Label>
                  <Select
                    value={formData.partnerType}
                    onValueChange={(value) => setFormData({ ...formData, partnerType: value })}
                    required={isPartnerCategory}
                  >
                    <SelectTrigger
                      id="partnerType"
                      data-testid="select-partner-type"
                      className="bg-purple-950/50 border-purple-700/50 text-purple-100"
                    >
                      <SelectValue placeholder="Select partner type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="funeral_home">Funeral Home</SelectItem>
                      <SelectItem value="flower_shop">Flower Shop</SelectItem>
                      <SelectItem value="correctional_facility">Correctional Facility</SelectItem>
                      <SelectItem value="other">Other Partner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partnerAccountId" className="text-purple-100">
                    Partner Account ID (Optional)
                  </Label>
                  <Input
                    id="partnerAccountId"
                    data-testid="input-partner-account-id"
                    placeholder="Your partner account number"
                    value={formData.partnerAccountId}
                    onChange={(e) => setFormData({ ...formData, partnerAccountId: e.target.value })}
                    className="bg-purple-950/50 border-purple-700/50 text-purple-100 placeholder:text-purple-400"
                  />
                  <p className="text-xs text-purple-400">
                    If you have a partner account ID, please provide it for faster service
                  </p>
                </div>
              </>
            )}

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description" className="text-purple-100">
                Description *
              </Label>
              <Textarea
                id="description"
                data-testid="input-description"
                placeholder="Please provide as much detail as possible..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={6}
                className="bg-purple-950/50 border-purple-700/50 text-purple-100 placeholder:text-purple-400"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              data-testid="button-submit-request"
              className="bg-[#d4af37] text-purple-950 hover:bg-[#d4af37]/90 min-w-[200px]"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
