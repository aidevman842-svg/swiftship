import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { AuthButton } from "@/components/auth-button";

/**
 * Server wrapper that composes the client SiteHeader with the server-only
 * AuthButton. Import this in server pages instead of SiteHeader directly.
 */
export function SiteHeaderServer() {
  return (
    <SiteHeader
      authSlot={
        <Suspense>
          <AuthButton />
        </Suspense>
      }
    />
  );
}
