import { Link } from "wouter";
import { OpictuaryBadge } from "@/components/OpictuaryBadge";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

interface FooterProps {
  badgeVariant?: "classic" | "halo-tech";
}

export function Footer({ badgeVariant = "classic" }: FooterProps) {
  return (
    <footer className="border-t border-border/50 bg-card/80 backdrop-blur-md mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Badge Column */}
          <div className="flex flex-col items-center md:items-start">
            <OpictuaryBadge variant={badgeVariant} size="small" className="mb-4" />
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Honoring life, preserving legacy
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/celebrity-memorials">
                  <span className="hover:text-foreground transition-colors cursor-pointer" data-testid="footer-link-celebrity">
                    Celebrity Memorials
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/essential-workers">
                  <span className="hover:text-foreground transition-colors cursor-pointer" data-testid="footer-link-essential">
                    Essential Workers
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/self-obituary">
                  <span className="hover:text-foreground transition-colors cursor-pointer" data-testid="footer-link-create">
                    Create Memorial
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/partner-signup">
                  <span className="hover:text-foreground transition-colors cursor-pointer" data-testid="footer-link-partners">
                    Partner Program
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/advertising">
                  <span className="hover:text-foreground transition-colors cursor-pointer" data-testid="footer-link-advertising">
                    Advertising Opportunities
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/badge-preview">
                  <span className="hover:text-foreground transition-colors cursor-pointer" data-testid="footer-link-badges">
                    App Badges
                  </span>
                </Link>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">QR Memorial Codes</span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">Grief Support</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@opictuary.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>1-800-OPICTUARY</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Opictuary. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>for families in need</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
