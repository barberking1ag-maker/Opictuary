import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Phone, Heart, Users, MessageCircle, Plus, X, Brain, Sparkles } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { GriefSupport } from "@shared/schema";

const NATIONAL_HOTLINES = [
  {
    title: "988 Suicide & Crisis Lifeline",
    contact: "988",
    description: "24/7 free and confidential support for people in distress, prevention and crisis resources.",
    isEmergency: true,
  },
  {
    title: "Crisis Text Line",
    contact: "Text HOME to 741741",
    description: "Free 24/7 support via text message for people in crisis.",
    isEmergency: true,
  },
  {
    title: "National Alliance for Grieving Children",
    contact: "(866) 432-1542",
    description: "Support for children and families dealing with grief.",
    isEmergency: false,
  },
  {
    title: "GriefShare",
    contact: "www.griefshare.org",
    description: "Find local grief support groups and online resources.",
    isEmergency: false,
  },
];

const SPIRITUAL_MENTAL_HEALTH_RESOURCES = [
  {
    title: "BetterHelp Online Therapy",
    contact: "www.betterhelp.com",
    description: "Professional online counseling specializing in grief and bereavement therapy.",
    category: "mental-health",
  },
  {
    title: "Grief Recovery Method",
    contact: "www.griefrecoverymethod.com",
    description: "Evidence-based approach to dealing with loss through professional guidance.",
    category: "mental-health",
  },
  {
    title: "Stephen Ministry",
    contact: "www.stephenministries.org",
    description: "Christian caregiving ministry providing one-on-one spiritual support during grief.",
    category: "spiritual",
  },
  {
    title: "Jewish Bereavement Counseling",
    contact: "www.jewishbereavement.org",
    description: "Faith-based grief support rooted in Jewish traditions and practices.",
    category: "spiritual",
  },
  {
    title: "Islamic Counseling & Support",
    contact: "www.muslimgriefsupport.com",
    description: "Culturally sensitive grief support for Muslim families.",
    category: "spiritual",
  },
  {
    title: "Headspace Meditation App",
    contact: "www.headspace.com/grief",
    description: "Guided meditation and mindfulness exercises for coping with loss.",
    category: "mental-health",
  },
  {
    title: "What's Your Grief",
    contact: "www.whatsyourgrief.com",
    description: "Online community and resources for understanding and navigating grief.",
    category: "mental-health",
  },
  {
    title: "Hospice Foundation of America",
    contact: "(877) 258-4433",
    description: "Professional bereavement counseling and spiritual care resources.",
    category: "both",
  },
];

export default function GriefSupport() {
  const { memorialId } = useParams();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [contactLabel, setContactLabel] = useState("");
  const [contactValue, setContactValue] = useState("");
  const [contactType, setContactType] = useState("phone");

  const { data: memorial } = useQuery<any>({
    queryKey: [`/api/memorials/${memorialId}`],
  });

  const { data: griefSupport, isLoading } = useQuery<GriefSupport>({
    queryKey: [`/api/memorials/${memorialId}/grief-support`],
    enabled: !!memorialId,
  });

  const { data: admins } = useQuery<any[]>({
    queryKey: [`/api/memorials/${memorialId}/admins`],
    enabled: !!memorialId && isAuthenticated,
  });

  const isCreator = memorial?.creatorEmail === (user as any)?.email;
  const canEdit = isCreator || admins?.some(admin => admin.email === (user as any)?.email && admin.canEditMemorial);

  const updateGriefSupportMutation = useMutation({
    mutationFn: async (data: Partial<GriefSupport>) => {
      const response = await fetch(`/api/memorials/${memorialId}/grief-support`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update grief support");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/memorials/${memorialId}/grief-support`] });
      toast({
        title: "Success",
        description: "Grief support information updated successfully",
      });
      setIsAddingContact(false);
      setContactLabel("");
      setContactValue("");
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update grief support information",
      });
    },
  });

  const handleAddContact = () => {
    if (!contactLabel || !contactValue) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in both label and contact information",
      });
      return;
    }

    const existingContacts = griefSupport?.customContacts || [];
    const newContact = {
      label: contactLabel,
      value: contactValue,
      type: contactType,
    };

    updateGriefSupportMutation.mutate({
      customContacts: [...existingContacts, newContact],
    });
  };

  const handleRemoveContact = (index: number) => {
    const existingContacts = griefSupport?.customContacts || [];
    const updatedContacts = existingContacts.filter((_, i) => i !== index);

    updateGriefSupportMutation.mutate({
      customContacts: updatedContacts,
    });
  };

  const handleUpdatePastoralContact = (value: string) => {
    updateGriefSupportMutation.mutate({
      pastoralContact: value,
    });
  };

  const handleUpdateFamilyContact = (value: string) => {
    updateGriefSupportMutation.mutate({
      familyContact: value,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 w-48 bg-muted animate-pulse rounded mb-6" />
          <div className="space-y-4">
            <div className="h-32 bg-muted animate-pulse rounded" />
            <div className="h-32 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Grief Support Resources</h1>
          <p className="text-muted-foreground">
            You're not alone. Find support and resources to help you through this difficult time.
          </p>
        </div>

        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Emergency Hotlines
            </CardTitle>
            <CardDescription>Available 24/7 for immediate support</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {NATIONAL_HOTLINES.filter(h => h.isEmergency).map((hotline, i) => (
              <div key={i} className="border-l-4 border-destructive pl-4" data-testid={`hotline-emergency-${i}`}>
                <h3 className="font-semibold" data-testid={`hotline-title-${i}`}>{hotline.title}</h3>
                <p className="text-lg font-mono text-primary" data-testid={`hotline-contact-${i}`}>{hotline.contact}</p>
                <p className="text-sm text-muted-foreground" data-testid={`hotline-description-${i}`}>
                  {hotline.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Support Groups & Resources
            </CardTitle>
            <CardDescription>Organizations that can help you through grief</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {NATIONAL_HOTLINES.filter(h => !h.isEmergency).map((hotline, i) => (
              <div key={i} className="border-l-4 border-primary pl-4" data-testid={`resource-${i}`}>
                <h3 className="font-semibold" data-testid={`resource-title-${i}`}>{hotline.title}</h3>
                <p className="text-lg font-mono text-primary" data-testid={`resource-contact-${i}`}>{hotline.contact}</p>
                <p className="text-sm text-muted-foreground" data-testid={`resource-description-${i}`}>
                  {hotline.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Spiritual & Mental Health Support
            </CardTitle>
            <CardDescription>Professional counseling, faith-based support, and mindfulness resources</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Mental Health & Counseling
              </h3>
              <div className="space-y-4">
                {SPIRITUAL_MENTAL_HEALTH_RESOURCES.filter(r => r.category === "mental-health" || r.category === "both").map((resource, i) => (
                  <div key={i} className="border-l-4 border-primary pl-4" data-testid={`mental-health-resource-${i}`}>
                    <h4 className="font-semibold" data-testid={`mental-health-title-${i}`}>{resource.title}</h4>
                    <p className="text-lg font-mono text-primary" data-testid={`mental-health-contact-${i}`}>{resource.contact}</p>
                    <p className="text-sm text-muted-foreground" data-testid={`mental-health-description-${i}`}>
                      {resource.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Spiritual & Faith-Based Support
              </h3>
              <div className="space-y-4">
                {SPIRITUAL_MENTAL_HEALTH_RESOURCES.filter(r => r.category === "spiritual").map((resource, i) => (
                  <div key={i} className="border-l-4 border-accent pl-4" data-testid={`spiritual-resource-${i}`}>
                    <h4 className="font-semibold" data-testid={`spiritual-title-${i}`}>{resource.title}</h4>
                    <p className="text-lg font-mono text-primary" data-testid={`spiritual-contact-${i}`}>{resource.contact}</p>
                    <p className="text-sm text-muted-foreground" data-testid={`spiritual-description-${i}`}>
                      {resource.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {griefSupport?.pastoralContact && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Pastoral Care
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg" data-testid="pastoral-contact">{griefSupport.pastoralContact}</p>
            </CardContent>
          </Card>
        )}

        {griefSupport?.familyContact && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Family Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg" data-testid="family-contact">{griefSupport.familyContact}</p>
            </CardContent>
          </Card>
        )}

        {griefSupport?.customContacts && griefSupport.customContacts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Additional Support Contacts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {griefSupport.customContacts.map((contact, i) => (
                <div key={i} className="flex items-center justify-between border-l-4 border-accent pl-4" data-testid={`custom-contact-${i}`}>
                  <div>
                    <h3 className="font-semibold" data-testid={`custom-contact-label-${i}`}>{contact.label}</h3>
                    <p className="text-lg font-mono text-primary" data-testid={`custom-contact-value-${i}`}>{contact.value}</p>
                    <p className="text-sm text-muted-foreground capitalize">{contact.type}</p>
                  </div>
                  {canEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveContact(i)}
                      data-testid={`button-remove-contact-${i}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {canEdit && (
          <Card>
            <CardHeader>
              <CardTitle>Manage Support Contacts</CardTitle>
              <CardDescription>
                Add personalized support resources for visitors to this memorial
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pastoral-contact">Pastoral Care Contact</Label>
                <div className="flex gap-2">
                  <Input
                    id="pastoral-contact"
                    placeholder="Pastor, Rabbi, Imam contact information"
                    defaultValue={griefSupport?.pastoralContact || ""}
                    onBlur={(e) => {
                      if (e.target.value !== griefSupport?.pastoralContact) {
                        handleUpdatePastoralContact(e.target.value);
                      }
                    }}
                    data-testid="input-pastoral-contact"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="family-contact">Primary Family Contact</Label>
                <div className="flex gap-2">
                  <Input
                    id="family-contact"
                    placeholder="Family member contact for support"
                    defaultValue={griefSupport?.familyContact || ""}
                    onBlur={(e) => {
                      if (e.target.value !== griefSupport?.familyContact) {
                        handleUpdateFamilyContact(e.target.value);
                      }
                    }}
                    data-testid="input-family-contact"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                {!isAddingContact ? (
                  <Button onClick={() => setIsAddingContact(true)} variant="outline" data-testid="button-add-contact">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Custom Contact
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="contact-label">Contact Label</Label>
                      <Input
                        id="contact-label"
                        placeholder="e.g., Therapist, Support Group, etc."
                        value={contactLabel}
                        onChange={(e) => setContactLabel(e.target.value)}
                        data-testid="input-contact-label"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-value">Contact Information</Label>
                      <Input
                        id="contact-value"
                        placeholder="Phone number, email, or website"
                        value={contactValue}
                        onChange={(e) => setContactValue(e.target.value)}
                        data-testid="input-contact-value"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-type">Contact Type</Label>
                      <select
                        id="contact-type"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        value={contactType}
                        onChange={(e) => setContactType(e.target.value)}
                        data-testid="select-contact-type"
                      >
                        <option value="phone">Phone</option>
                        <option value="email">Email</option>
                        <option value="website">Website</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleAddContact} data-testid="button-save-contact">
                        Save Contact
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsAddingContact(false);
                          setContactLabel("");
                          setContactValue("");
                        }}
                        data-testid="button-cancel-contact"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
