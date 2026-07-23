import { getCurrentProfile, getCurrentUser } from "@/lib/supabase/queries";
import { updateProfile } from "@/lib/supabase/actions";

export const metadata = { title: "Settings — SwiftShip" };

export default async function SettingsPage() {
  const [profile, user] = await Promise.all([
    getCurrentProfile(),
    getCurrentUser(),
  ]);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Account Settings</h2>
        <p className="text-sm text-neutral-500 mt-0.5">Manage your account information and preferences.</p>
      </div>

      {/* Profile */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6">
        <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Profile</h3>
        <form action={updateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              value={user?.email ?? ""}
              disabled
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-400 cursor-not-allowed"
            />
            <p className="text-xs text-neutral-400 mt-1">Email cannot be changed here.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Full name
            </label>
            <input
              type="text"
              name="full_name"
              defaultValue={profile?.full_name ?? ""}
              placeholder="Your full name"
              className="w-full px-3 py-2 text-sm bg-transparent border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-neutral-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Company name
            </label>
            <input
              type="text"
              name="company_name"
              defaultValue={profile?.company_name ?? ""}
              placeholder="Your company (optional)"
              className="w-full px-3 py-2 text-sm bg-transparent border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-neutral-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Phone number
            </label>
            <input
              type="tel"
              name="phone"
              defaultValue={profile?.phone ?? ""}
              placeholder="+1 (555) 000-0000"
              className="w-full px-3 py-2 text-sm bg-transparent border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-neutral-900 dark:text-white"
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>

      {/* Role badge */}
      {profile && (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6">
          <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">Account type</h3>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              profile.role === "admin"
                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                : "bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300"
            }`}>
              {profile.role === "admin" ? "🛡 Admin" : "👤 Customer"}
            </span>
            <p className="text-sm text-neutral-500">
              {profile.role === "admin"
                ? "You have full access to admin controls."
                : "Standard customer account."}
            </p>
          </div>
        </div>
      )}

      {/* Password */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6">
        <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">Password</h3>
        <p className="text-sm text-neutral-500 mb-4">
          We&apos;ll send a reset link to your registered email address.
        </p>
        <a
          href="/auth/forgot-password"
          className="inline-flex px-5 py-2 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-medium rounded-lg transition-colors"
        >
          Send reset email
        </a>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6">
        <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Notifications</h3>
        <div className="space-y-1">
          {[
            { label: "Shipment status updates", desc: "Get notified when your shipment status changes." },
            { label: "Hold alerts", desc: "Immediate notification when a shipment is placed on hold." },
            { label: "Delivery confirmation", desc: "Email confirmation when your shipment is delivered." },
          ].map(({ label, desc }) => (
            <label
              key={label}
              className="flex items-start justify-between gap-4 py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0 cursor-pointer"
            >
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{label}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{desc}</p>
              </div>
              <input type="checkbox" defaultChecked className="mt-0.5 accent-blue-600 w-4 h-4 flex-shrink-0" />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
