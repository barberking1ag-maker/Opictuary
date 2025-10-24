import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: October 24, 2025</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>We collect the following types of information to provide our memorial services:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account Information</strong>: Email address, name, and profile photo through Replit authentication</li>
                <li><strong>Memorial Content</strong>: Photos, videos, text, and other content you upload to create memorials</li>
                <li><strong>Payment Information</strong>: Processed securely through Stripe for donations and fundraisers</li>
                <li><strong>Analytics Data</strong>: Page views, usage patterns, and interaction data to improve our platform</li>
                <li><strong>Device Information</strong>: Browser type, IP address, and device identifiers for security and functionality</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and maintain our memorial platform services</li>
                <li>To process donations and payments through Stripe</li>
                <li>To send notifications about memorials you're connected to</li>
                <li>To improve and personalize your experience</li>
                <li>To detect and prevent fraud and abuse</li>
                <li>To comply with legal obligations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Sharing and Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p><strong>We do not sell your personal information.</strong></p>
              <p>We may share data with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Stripe</strong>: For secure payment processing (subject to their privacy policy)</li>
                <li><strong>Analytics Services</strong>: Google Analytics and Plausible for usage analytics</li>
                <li><strong>Memorial Visibility</strong>: Content visibility is controlled by memorial creators through public/private settings</li>
                <li><strong>Legal Requirements</strong>: When required by law or to protect our rights</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access</strong>: Request a copy of your personal data</li>
                <li><strong>Delete</strong>: Request deletion of your account and associated data</li>
                <li><strong>Control</strong>: Manage memorial privacy settings (public/invite-only)</li>
                <li><strong>Update</strong>: Modify your profile information at any time</li>
                <li><strong>Opt-out</strong>: Unsubscribe from non-essential notifications</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>
                We implement appropriate technical and organizational measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Secure HTTPS encryption for all data transmission</li>
                <li>Password-protected accounts with secure authentication</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and monitoring</li>
              </ul>
              <p className="mt-3">
                However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13. 
                If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>International Users</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                Our services are hosted in the United States. If you access our platform from outside the U.S., your information 
                may be transferred to, stored, and processed in the U.S. where our servers are located.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                We may update this privacy policy from time to time. We will notify you of any significant changes by posting 
                the new policy on this page and updating the "Last updated" date. Your continued use of the platform after 
                changes constitutes acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                If you have questions about this privacy policy or our data practices, please contact us:
              </p>
              <ul className="mt-3 space-y-2">
                <li><strong>Email</strong>: privacy@opictuary.com</li>
                <li><strong>Support</strong>: Through the contact form on our website</li>
                <li><strong>Location</strong>: United States</li>
              </ul>
              <p className="mt-3 text-sm">
                We will respond to privacy-related inquiries within 30 days.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
