import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, Mail, FileText } from "lucide-react";

export default function ChildSafety() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Shield className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-4xl font-heading font-bold mb-2">Child Safety Standards</h1>
          <p className="text-muted-foreground">Last updated: November 12, 2025</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Our Commitment to Child Safety</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>
                Opictuary is committed to providing a safe and respectful platform for creating digital memorials. 
                We maintain strict standards to protect children and prevent any form of child sexual abuse and exploitation (CSAE).
              </p>
              <p>
                <strong>Our service is not intended for children under 13 years of age.</strong> We do not knowingly 
                collect or maintain information from persons under 13 years of age.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Age Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Minimum Age</strong>: Users must be at least 13 years old to create an account</li>
                <li><strong>Parental Consent</strong>: Users between 13-17 should have parental permission to use our services</li>
                <li><strong>Account Verification</strong>: All accounts require email verification through secure authentication</li>
                <li><strong>Age Verification</strong>: We reserve the right to request age verification for any account</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Standards and Moderation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>We strictly prohibit the following content:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>CSAE Material</strong>: Any content depicting, promoting, or facilitating child sexual abuse or exploitation</li>
                <li><strong>Inappropriate Content</strong>: Sexually explicit material, nudity, or other content harmful to minors</li>
                <li><strong>Predatory Behavior</strong>: Any attempt to contact, groom, or exploit children</li>
                <li><strong>Harassment</strong>: Bullying, threats, or abusive content targeting minors</li>
              </ul>
              <p className="mt-3">
                <strong>Automated Filtering:</strong> We employ server-side profanity filtering and content moderation 
                to automatically detect and block inappropriate content.
              </p>
              <p>
                <strong>Manual Review:</strong> Reported content is reviewed by our moderation team within 24 hours.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reporting and Response</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>If you encounter any content or behavior that violates our child safety standards:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Report Immediately</strong>: Use our in-platform reporting tools or contact us directly</li>
                <li><strong>24-Hour Response</strong>: We review all child safety reports within 24 hours</li>
                <li><strong>Content Removal</strong>: Violating content is removed immediately upon confirmation</li>
                <li><strong>Account Suspension</strong>: Accounts violating child safety policies are permanently banned</li>
                <li><strong>Law Enforcement</strong>: We report all suspected CSAE material to the National Center for Missing & Exploited Children (NCMEC) and appropriate law enforcement agencies</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy Protections for Minors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>No Data Collection from Children</strong>: We do not knowingly collect personal information from children under 13</li>
                <li><strong>Immediate Deletion</strong>: If we discover a child under 13 has created an account, we delete it immediately</li>
                <li><strong>Memorial Privacy</strong>: Memorials for minors can be set to private with invite-only access</li>
                <li><strong>Parental Controls</strong>: Parents can request deletion of any memorial content featuring their minor children</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Safety Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Secure Authentication</strong>: Password-protected accounts with email verification</li>
                <li><strong>Privacy Settings</strong>: Ability to make memorials private or invite-only</li>
                <li><strong>Content Filtering</strong>: Automated profanity and inappropriate content detection</li>
                <li><strong>Reporting Tools</strong>: Easy-to-use reporting system for safety concerns</li>
                <li><strong>Moderation Team</strong>: Dedicated team reviewing reported content</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cooperation with Authorities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>Opictuary fully cooperates with law enforcement and child protection agencies:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We report all suspected CSAE material to NCMEC as required by law</li>
                <li>We preserve evidence and provide information to law enforcement upon valid legal request</li>
                <li>We maintain records of reports and actions taken for potential investigation</li>
                <li>We participate in industry initiatives to combat online child exploitation</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information for Child Safety Concerns</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="mb-4">
                If you need to report child safety concerns or have questions about our child protection policies:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 mt-1 text-primary" />
                  <div>
                    <p className="font-semibold">Email (Child Safety Issues):</p>
                    <p>safety@opictuary.com</p>
                    <p className="text-sm mt-1">We respond to child safety reports within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 mt-1 text-primary" />
                  <div>
                    <p className="font-semibold">General Contact:</p>
                    <p>opictuary@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 mt-1 text-destructive" />
                  <div>
                    <p className="font-semibold">Emergency CSAE Reports:</p>
                    <p>Report to NCMEC CyberTipline: <a href="https://www.cybertipline.org" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">www.cybertipline.org</a></p>
                    <p className="text-sm mt-1">Or call 1-800-843-5678</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-muted rounded-md">
                <p className="text-sm">
                  <strong>Note:</strong> This page serves as our publicly accessible Child Safety Standards as required by 
                  Google Play Store policies. It is non-editable and permanently available at this URL for compliance purposes.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Policy Updates</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                We may update these child safety standards as needed to reflect new safety measures, legal requirements, 
                or industry best practices. Any significant changes will be posted on this page with an updated "Last updated" date.
              </p>
              <p className="mt-3">
                Continued use of our platform constitutes acceptance of our current child safety standards.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
