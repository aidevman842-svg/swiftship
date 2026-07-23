/**
 * Centralised data-access layer.
 * All Supabase queries live here — pages just call these functions.
 */

import { createClient } from "@/lib/supabase/server";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ShipmentEvent {
  id: string;
  shipment_id: string;
  status: string;
  location: string | null;
  description: string | null;
  created_at: string;
}

export interface Shipment {
  id: string;
  tracking_number: string;
  customer_id: string | null;
  sender_name: string;
  sender_address: string;
  sender_phone: string | null;
  receiver_name: string;
  receiver_address: string;
  receiver_phone: string | null;
  package_type: string | null;
  weight: number | null;
  dimensions: string | null;
  description: string | null;
  status: string;
  payment_status: string;
  amount: number | null;
  origin: string;
  destination: string;
  estimated_delivery: string | null;
  actual_delivery: string | null;
  hold_reason: string | null;
  held_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  address: string | null;
  role: "admin" | "customer";
  created_at: string;
  updated_at: string;
}

// ─── Shipment queries ─────────────────────────────────────────────────────────

export async function getShipmentByTrackingNumber(trackingNumber: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("shipments")
    .select("*")
    .eq("tracking_number", trackingNumber.toUpperCase())
    .single();

  if (error) return null;
  return data as Shipment;
}

export async function getShipmentEvents(shipmentId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("shipment_events")
    .select("*")
    .eq("shipment_id", shipmentId)
    .order("created_at", { ascending: false });

  return (data ?? []) as ShipmentEvent[];
}

export async function getAllShipments() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("shipments")
    .select("*")
    .order("created_at", { ascending: false });

  return (data ?? []) as Shipment[];
}

export async function getCustomerShipments(customerId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("shipments")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  return (data ?? []) as Shipment[];
}

export async function getShipmentById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("shipments")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Shipment;
}

// ─── Profile queries ──────────────────────────────────────────────────────────

export async function getCurrentProfile() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", claims.claims.sub)
    .single();

  return data as Profile | null;
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return data?.claims ?? null;
}
