"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ─── Hold a shipment ──────────────────────────────────────────────────────────

export async function holdShipment(trackingNumber: string, reason: string) {
  const supabase = await createClient();

  const { data: shipment } = await supabase
    .from("shipments")
    .select("id")
    .eq("tracking_number", trackingNumber)
    .single();

  if (!shipment) return { error: "Shipment not found" };

  const { error } = await supabase
    .from("shipments")
    .update({
      status: "on_hold",
      hold_reason: reason,
      held_at: new Date().toISOString(),
    })
    .eq("tracking_number", trackingNumber);

  if (error) return { error: error.message };

  await supabase.from("shipment_events").insert({
    shipment_id: shipment.id,
    status: "on_hold",
    description: `Shipment placed on hold: ${reason}`,
  });

  revalidatePath(`/track/${trackingNumber}`);
  revalidatePath(`/dashboard/admin/shipments/${trackingNumber}`);
  revalidatePath("/dashboard/admin/shipments");
  return { success: true };
}

// ─── Release a shipment from hold ────────────────────────────────────────────

export async function releaseShipment(trackingNumber: string) {
  const supabase = await createClient();

  const { data: shipment } = await supabase
    .from("shipments")
    .select("id")
    .eq("tracking_number", trackingNumber)
    .single();

  if (!shipment) return { error: "Shipment not found" };

  const { error } = await supabase
    .from("shipments")
    .update({
      status: "in_transit",
      hold_reason: null,
      held_at: null,
    })
    .eq("tracking_number", trackingNumber);

  if (error) return { error: error.message };

  await supabase.from("shipment_events").insert({
    shipment_id: shipment.id,
    status: "in_transit",
    description: "Shipment released from hold and resumed transit.",
  });

  revalidatePath(`/track/${trackingNumber}`);
  revalidatePath(`/dashboard/admin/shipments/${trackingNumber}`);
  revalidatePath("/dashboard/admin/shipments");
  return { success: true };
}

// ─── Update shipment status ───────────────────────────────────────────────────

export async function updateShipmentStatus(
  trackingNumber: string,
  status: string
) {
  const supabase = await createClient();

  const { data: shipment } = await supabase
    .from("shipments")
    .select("id")
    .eq("tracking_number", trackingNumber)
    .single();

  if (!shipment) return { error: "Shipment not found" };

  const updates: Record<string, unknown> = { status };

  // Clear hold fields when moving away from on_hold
  if (status !== "on_hold") {
    updates.hold_reason = null;
    updates.held_at = null;
  }

  // Set actual delivery date
  if (status === "delivered") {
    updates.actual_delivery = new Date().toISOString().split("T")[0];
  }

  const { error } = await supabase
    .from("shipments")
    .update(updates)
    .eq("tracking_number", trackingNumber);

  if (error) return { error: error.message };

  await supabase.from("shipment_events").insert({
    shipment_id: shipment.id,
    status,
    description: `Status updated to: ${status.replace(/_/g, " ")}`,
  });

  revalidatePath(`/track/${trackingNumber}`);
  revalidatePath(`/dashboard/admin/shipments/${trackingNumber}`);
  revalidatePath("/dashboard/admin/shipments");
  revalidatePath("/dashboard");
  return { success: true };
}

// ─── Update payment status ────────────────────────────────────────────────────

export async function updatePaymentStatus(
  trackingNumber: string,
  paymentStatus: string
) {
  const supabase = await createClient();

  // Get current shipment state
  const { data: shipment } = await supabase
    .from("shipments")
    .select("id, status")
    .eq("tracking_number", trackingNumber)
    .single();

  if (!shipment) return { error: "Shipment not found" };

  const { error } = await supabase
    .from("shipments")
    .update({ payment_status: paymentStatus })
    .eq("tracking_number", trackingNumber);

  if (error) return { error: error.message };

  // If payment is now marked paid AND shipment was on hold → auto release to in_transit
  if (paymentStatus === "paid" && shipment.status === "on_hold") {
    const { error: releaseError } = await supabase
      .from("shipments")
      .update({
        status: "in_transit",
        hold_reason: null,
        held_at: null,
      })
      .eq("tracking_number", trackingNumber);

    if (!releaseError) {
      await supabase.from("shipment_events").insert({
        shipment_id: shipment.id,
        status: "in_transit",
        description:
          "Payment received. Shipment released from hold and resumed transit.",
      });
    }
  }

  // If payment marked unpaid and shipment is in transit → put on hold automatically
  if (paymentStatus === "unpaid" && shipment.status !== "on_hold") {
    await supabase
      .from("shipments")
      .update({
        status: "on_hold",
        hold_reason: "Payment outstanding. Please settle your invoice to release this shipment.",
        held_at: new Date().toISOString(),
      })
      .eq("tracking_number", trackingNumber);

    await supabase.from("shipment_events").insert({
      shipment_id: shipment.id,
      status: "on_hold",
      description: "Shipment placed on hold: payment outstanding.",
    });
  }

  revalidatePath(`/track/${trackingNumber}`);
  revalidatePath(`/dashboard/admin/shipments/${trackingNumber}`);
  revalidatePath("/dashboard/admin/shipments");
  revalidatePath("/dashboard");
  return { success: true };
}

// ─── Update profile ───────────────────────────────────────────────────────────

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: formData.get("full_name") as string,
      company_name: formData.get("company_name") as string,
      phone: formData.get("phone") as string,
    })
    .eq("id", claims.claims.sub);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/settings");
  return { success: true };
}
