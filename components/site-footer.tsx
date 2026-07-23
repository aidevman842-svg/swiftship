import Link from "next/link";
import { Package2, Mail, Phone, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-[#0a1628] text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg">SwiftShip</span>
            </div>
            <p className="text-sm leading-relaxed">
              Global logistics solutions built for businesses that move fast.
              Reliable, transparent, and always on time.
            </p>
            <div className="mt-5 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>+1 (800) 794-8374</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>support@swiftship.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>New York, NY 10001</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Services</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                "International Freight",
                "Parcel Delivery",
                "Cargo Shipping",
                "Time-Critical Delivery",
                "Customs Clearance",
                "Insurance",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="/services"
                    className="hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "About Us", href: "/" },
                { label: "Careers", href: "/" },
                { label: "News", href: "/" },
                { label: "Partners", href: "/" },
                { label: "Contact", href: "/contact" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Track */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Quick Track</h4>
            <p className="text-sm mb-3">
              Enter your tracking number to get an instant status update.
            </p>
            <Link
              href="/track"
              className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Track a Shipment
            </Link>
            <div className="mt-4 pt-4 border-t border-neutral-800">
              <h4 className="text-white font-semibold text-sm mb-3">Account</h4>
              <div className="flex flex-col gap-2 text-sm">
                <Link href="/auth/login" className="hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/sign-up" className="hover:text-white transition-colors">
                  Create Account
                </Link>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2026 SwiftShip Logistics Inc. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
