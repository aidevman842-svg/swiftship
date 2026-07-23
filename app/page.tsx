import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TrackingSearchForm } from "@/components/tracking-search-form";
import { AuthButton } from "@/components/auth-button";
import { Suspense } from "react";
import {
  Globe,
  Shield,
  Clock,
  Package,
  BarChart3,
  Headphones,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
      <SiteHeader authSlot={<Suspense><AuthButton /></Suspense>} />

      {/* Hero */}
      <section className="relative bg-[#0a1628] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d2240] to-[#1a3a5c] pointer-events-none" />
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #1d4ed8 0%, transparent 50%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Real-time tracking available 24/7
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Shipping that works
              <span className="block text-blue-400">as hard as you do.</span>
            </h1>
            <p className="text-lg text-neutral-300 mb-10 max-w-xl">
              SwiftShip moves freight across 190+ countries. Enter your tracking
              number and know exactly where your shipment is, right now.
            </p>

            {/* Tracking Search */}
            <TrackingSearchForm size="lg" />
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "190+", label: "Countries Served" },
              { value: "2.4M+", label: "Shipments Delivered" },
              { value: "99.7%", label: "On-Time Rate" },
              { value: "24/7", label: "Live Support" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-blue-100 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">
              End-to-end shipping solutions
            </h2>
            <p className="text-neutral-500 mt-3 max-w-xl mx-auto">
              From a single parcel to full container loads, we handle it with the
              same level of care and precision.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: "International Freight",
                desc: "Air, sea, and road freight with full customs clearance support and door-to-door delivery.",
              },
              {
                icon: Package,
                title: "Parcel & Document Shipping",
                desc: "Express delivery for documents and packages with next-business-day options available.",
              },
              {
                icon: BarChart3,
                title: "Cargo & Bulk Shipping",
                desc: "Pallets, containers, and oversized cargo managed by our dedicated logistics team.",
              },
              {
                icon: Shield,
                title: "Insured Shipments",
                desc: "Full cargo insurance with automated claims processing for high-value goods.",
              },
              {
                icon: Clock,
                title: "Time-Critical Delivery",
                desc: "Priority lanes for time-sensitive freight with guaranteed delivery windows.",
              },
              {
                icon: Headphones,
                title: "Dedicated Account Support",
                desc: "A named account manager and 24/7 ops support so you're never left in the dark.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
                  {title}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">
              How tracking works
            </h2>
            <p className="text-neutral-500 mt-3">
              From pickup to delivery, every step is visible.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            {[
              { step: "01", title: "Book a Shipment", desc: "Create your shipment and receive a unique tracking number." },
              { step: "02", title: "We Pick It Up", desc: "Our courier collects from your location at the agreed time." },
              { step: "03", title: "In Transit", desc: "Track every scan, hub, and customs event in real time." },
              { step: "04", title: "Delivered", desc: "Recipient confirms delivery with photo proof of drop-off." },
            ].map(({ step, title, desc }, i) => (
              <div key={step} className="relative text-center">
                {i < 3 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-px border-t-2 border-dashed border-neutral-200 dark:border-neutral-700" />
                )}
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center mx-auto mb-4 relative z-10">
                  {step}
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0a1628] text-white py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to ship with confidence?
          </h2>
          <p className="text-neutral-400 mb-8">
            Create a free account to manage your shipments, view invoices, and
            get real-time notifications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Create free account
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center px-8 py-3 border border-neutral-600 hover:border-neutral-400 text-white font-medium rounded-lg transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
