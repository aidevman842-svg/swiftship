/**
 * Mock shipment data for development / demo purposes.
 * Replace the lookup in app/track/[trackingNumber]/page.tsx with a Supabase
 * query once the database is set up.
 */

export interface ShipmentEvent {
  id: string;
  status: string;
  location?: string;
  description?: string;
  created_at: string;
}

export interface MockShipment {
  id: string;
  tracking_number: string;
  sender_name: string;
  sender_address: string;
  sender_phone?: string;
  receiver_name: string;
  receiver_address: string;
  receiver_phone?: string;
  package_type: "document" | "parcel" | "pallet" | "container";
  weight: number;
  dimensions?: string;
  description?: string;
  status: string;
  payment_status: string;
  amount?: number;
  origin: string;
  destination: string;
  estimated_delivery: string;
  actual_delivery?: string;
  hold_reason?: string;
  events: ShipmentEvent[];
}

export const MOCK_SHIPMENTS: Record<string, MockShipment> = {
  SWF100001: {
    id: "1",
    tracking_number: "SWF100001",
    sender_name: "Apex Technologies Ltd",
    sender_address: "12 Innovation Drive, San Francisco, CA 94105",
    sender_phone: "+1 (415) 555-0100",
    receiver_name: "Global Retail Corp",
    receiver_address: "88 Commerce Blvd, Chicago, IL 60601",
    receiver_phone: "+1 (312) 555-0182",
    package_type: "parcel",
    weight: 14.5,
    dimensions: "40 × 30 × 25 cm",
    description: "Electronic components",
    status: "in_transit",
    payment_status: "paid",
    amount: 89.99,
    origin: "San Francisco, CA",
    destination: "Chicago, IL",
    estimated_delivery: "2026-07-28",
    events: [
      {
        id: "e4",
        status: "in_transit",
        location: "Denver, CO",
        description: "Package is in transit to destination hub.",
        created_at: "2026-07-23T08:30:00Z",
      },
      {
        id: "e3",
        status: "picked_up",
        location: "San Francisco, CA",
        description: "Package picked up from sender.",
        created_at: "2026-07-22T14:00:00Z",
      },
      {
        id: "e2",
        status: "pending",
        location: "San Francisco, CA",
        description: "Shipment created and awaiting courier pickup.",
        created_at: "2026-07-22T09:00:00Z",
      },
    ],
  },

  SWF100002: {
    id: "2",
    tracking_number: "SWF100002",
    sender_name: "Meridian Exports Inc",
    sender_address: "Port Warehouse 4, Houston, TX 77001",
    sender_phone: "+1 (713) 555-0247",
    receiver_name: "Atlantic Trade Partners",
    receiver_address: "Unit 7, Port of Miami, Miami, FL 33132",
    receiver_phone: "+1 (305) 555-0399",
    package_type: "container",
    weight: 4200,
    dimensions: "20ft ISO Container",
    description: "Industrial machinery — heavy freight",
    status: "on_hold",
    payment_status: "unpaid",
    amount: 1850.0,
    origin: "Houston, TX",
    destination: "Miami, FL",
    estimated_delivery: "2026-07-30",
    hold_reason:
      "Payment outstanding. Shipment has been placed on hold pending receipt of full payment. Please contact your account manager or settle invoice #INV-20260722-002 to release.",
    events: [
      {
        id: "e5",
        status: "on_hold",
        location: "Houston, TX — Freight Terminal",
        description:
          "Shipment placed on hold. Reason: outstanding payment (Invoice #INV-20260722-002).",
        created_at: "2026-07-23T10:00:00Z",
      },
      {
        id: "e4",
        status: "customs_clearance",
        location: "Houston, TX — US Customs",
        description: "Customs documentation reviewed and cleared.",
        created_at: "2026-07-22T16:45:00Z",
      },
      {
        id: "e3",
        status: "in_transit",
        location: "Houston, TX",
        description: "Container loaded and in transit to departure port.",
        created_at: "2026-07-22T08:00:00Z",
      },
      {
        id: "e2",
        status: "picked_up",
        location: "Houston, TX",
        description: "Container collected from sender facility.",
        created_at: "2026-07-21T13:00:00Z",
      },
      {
        id: "e1",
        status: "pending",
        location: "Houston, TX",
        description: "Shipment booked and awaiting pickup.",
        created_at: "2026-07-20T10:00:00Z",
      },
    ],
  },

  SWF100003: {
    id: "3",
    tracking_number: "SWF100003",
    sender_name: "Claire Fontaine",
    sender_address: "34 Rue de la Paix, Paris, France 75002",
    sender_phone: "+33 1 55 00 1234",
    receiver_name: "Hudson Boutique NYC",
    receiver_address: "210 West 14th Street, New York, NY 10011",
    receiver_phone: "+1 (212) 555-0771",
    package_type: "document",
    weight: 0.8,
    dimensions: "A4 envelope",
    description: "Legal documents — time sensitive",
    status: "out_for_delivery",
    payment_status: "paid",
    amount: 42.5,
    origin: "Paris, France",
    destination: "New York, NY",
    estimated_delivery: "2026-07-23",
    events: [
      {
        id: "e6",
        status: "out_for_delivery",
        location: "New York, NY — Manhattan Depot",
        description:
          "Package is with our delivery driver. Expected delivery today.",
        created_at: "2026-07-23T07:15:00Z",
      },
      {
        id: "e5",
        status: "customs_clearance",
        location: "JFK International — US Customs",
        description: "Cleared US customs without issue.",
        created_at: "2026-07-22T22:30:00Z",
      },
      {
        id: "e4",
        status: "in_transit",
        location: "New York, JFK Airport",
        description: "Arrived at JFK arrival facility.",
        created_at: "2026-07-22T18:00:00Z",
      },
      {
        id: "e3",
        status: "in_transit",
        location: "Charles de Gaulle Airport, Paris",
        description: "Departed on flight SS8843 to New York.",
        created_at: "2026-07-22T05:00:00Z",
      },
      {
        id: "e2",
        status: "picked_up",
        location: "Paris, France",
        description: "Envelope collected from sender.",
        created_at: "2026-07-21T18:00:00Z",
      },
      {
        id: "e1",
        status: "pending",
        location: "Paris, France",
        description: "Shipment registered.",
        created_at: "2026-07-21T14:00:00Z",
      },
    ],
  },

  SWF100004: {
    id: "4",
    tracking_number: "SWF100004",
    sender_name: "Delta Pharma Group",
    sender_address: "100 BioTech Way, Boston, MA 02115",
    sender_phone: "+1 (617) 555-0940",
    receiver_name: "Western Health Systems",
    receiver_address: "500 Wellness Ave, Los Angeles, CA 90001",
    receiver_phone: "+1 (310) 555-0633",
    package_type: "pallet",
    weight: 340,
    dimensions: "120 × 100 × 120 cm",
    description: "Medical supplies — temperature controlled",
    status: "delivered",
    payment_status: "paid",
    amount: 620.0,
    origin: "Boston, MA",
    destination: "Los Angeles, CA",
    estimated_delivery: "2026-07-20",
    actual_delivery: "2026-07-20",
    events: [
      {
        id: "e6",
        status: "delivered",
        location: "Los Angeles, CA",
        description:
          "Package delivered and signed for by J. Martinez at reception.",
        created_at: "2026-07-20T11:30:00Z",
      },
      {
        id: "e5",
        status: "out_for_delivery",
        location: "Los Angeles, CA",
        description: "Out for delivery with our driver.",
        created_at: "2026-07-20T07:45:00Z",
      },
      {
        id: "e4",
        status: "in_transit",
        location: "Phoenix, AZ",
        description: "Departed Phoenix hub, en route to Los Angeles.",
        created_at: "2026-07-19T20:00:00Z",
      },
      {
        id: "e3",
        status: "in_transit",
        location: "Dallas, TX",
        description: "Package transited through Dallas sorting facility.",
        created_at: "2026-07-18T14:00:00Z",
      },
      {
        id: "e2",
        status: "picked_up",
        location: "Boston, MA",
        description: "Pallet collected from Delta Pharma cold-storage.",
        created_at: "2026-07-17T09:00:00Z",
      },
      {
        id: "e1",
        status: "pending",
        location: "Boston, MA",
        description: "Shipment created.",
        created_at: "2026-07-16T15:00:00Z",
      },
    ],
  },
};
