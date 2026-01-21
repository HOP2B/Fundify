import Link from "next/link"
import { Heart, Facebook, Twitter, Instagram, Youtube } from "lucide-react"

const footerLinks = {
  fundraise: [
    { label: "Start a FundRise", href: "#" },
    { label: "How it works", href: "#" },
    { label: "What is crowdfunding?", href: "#" },
    { label: "Fundraising tips", href: "#" },
    { label: "Success stories", href: "#" },
  ],
  learn: [
    { label: "Help center", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Press", href: "#" },
    { label: "Careers", href: "#" },
    { label: "About us", href: "#" },
  ],
  resources: [
    { label: "Charity fundraising", href: "#" },
    { label: "Team fundraising", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "Supported countries", href: "#" },
    { label: "Charity sign up", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">FundRise</span>
            </Link>
            <p className="text-background/70 text-sm mb-4">
              The trusted leader in online fundraising. Helping people help others since 2010.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-background/70 hover:text-background transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-background/70 hover:text-background transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-background/70 hover:text-background transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-background/70 hover:text-background transition-colors">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Fundraise for</h3>
            <ul className="space-y-2">
              {footerLinks.fundraise.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm text-background/70 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Learn more</h3>
            <ul className="space-y-2">
              {footerLinks.learn.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm text-background/70 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm text-background/70 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-background/70">
              © 2026 FundRise. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-background/70 hover:text-background transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-sm text-background/70 hover:text-background transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-background/70 hover:text-background transition-colors">
                Legal
              </Link>
              <Link href="#" className="text-sm text-background/70 hover:text-background transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
