import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Phone, Heart, Users, MessageCircle } from "lucide-react";

interface SupportContact {
  label: string;
  value: string;
  type: 'family' | 'spiritual' | 'crisis';
}

interface GriefSupportPanelProps {
  familyContact?: string;
  pastoralContact?: string;
  customContacts?: SupportContact[];
}

export default function GriefSupportPanel({
  familyContact,
  pastoralContact,
  customContacts = []
}: GriefSupportPanelProps) {
  const handleCallClick = (number: string, label: string) => {
    if (number.startsWith('http')) {
      window.open(number, '_blank');
    } else {
      window.location.href = `tel:${number}`;
    }
    console.log(`Calling ${label}: ${number}`);
  };

  return (
    <Card data-testid="card-grief-support">
      <CardHeader>
        <CardTitle className="font-serif flex items-center gap-2">
          <Heart className="w-5 h-5 text-chart-3" />
          Grief Support Resources
        </CardTitle>
        <CardDescription>
          You don't have to go through this alone. Help is available.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Crisis Hotlines - Always Available */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Crisis Support
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10">
              <div>
                <p className="font-medium text-foreground" data-testid="text-crisis-line-988">
                  988 Suicide & Crisis Lifeline
                </p>
                <p className="text-sm text-muted-foreground">24/7 support - Call, text, or chat</p>
              </div>
              <Button 
                size="sm" 
                onClick={() => handleCallClick('988', '988 Lifeline')}
                data-testid="button-call-988"
              >
                Call 988
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10">
              <div>
                <p className="font-medium text-foreground" data-testid="text-crisis-text">
                  Crisis Text Line
                </p>
                <p className="text-sm text-muted-foreground">Text HOME to 741741</p>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleCallClick('sms:741741&body=HOME', 'Crisis Text Line')}
                data-testid="button-text-741741"
              >
                Text Now
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Family Contact */}
        {familyContact && (
          <>
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Family Contact
              </h3>
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10">
                <div>
                  <p className="font-medium text-foreground" data-testid="text-family-contact">
                    Family Support Line
                  </p>
                  <p className="text-sm text-muted-foreground">{familyContact}</p>
                </div>
                <Button 
                  size="sm"
                  onClick={() => handleCallClick(familyContact, 'Family Contact')}
                  data-testid="button-call-family"
                >
                  Call
                </Button>
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Pastoral/Spiritual Contact */}
        {pastoralContact && (
          <>
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Spiritual Support
              </h3>
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10">
                <div>
                  <p className="font-medium text-foreground" data-testid="text-pastoral-contact">
                    Pastoral Care
                  </p>
                  <p className="text-sm text-muted-foreground">{pastoralContact}</p>
                </div>
                <Button 
                  size="sm"
                  onClick={() => handleCallClick(pastoralContact, 'Pastoral Contact')}
                  data-testid="button-call-pastor"
                >
                  Call
                </Button>
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Custom Contacts */}
        {customContacts.length > 0 && (
          <>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Additional Support</h3>
              <div className="space-y-3">
                {customContacts.map((contact, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/10">
                    <div>
                      <p className="font-medium text-foreground">{contact.label}</p>
                      <p className="text-sm text-muted-foreground">{contact.value}</p>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => handleCallClick(contact.value, contact.label)}
                      data-testid={`button-call-custom-${index}`}
                    >
                      Call
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* General Support Message */}
        <div className="text-center p-4 bg-accent/5 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Grief is a journey that takes time. Please reach out to loved ones, 
            support groups, or professional counselors when you need help.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
