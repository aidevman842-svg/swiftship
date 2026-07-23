-- ============================================================
-- SwiftShip Logistics — Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Profiles (extends Supabase auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  company_name TEXT,
  phone TEXT,
  address TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shipments
CREATE TABLE IF NOT EXISTS shipments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- Parties
  sender_name TEXT NOT NULL,
  sender_address TEXT NOT NULL,
  sender_phone TEXT,
  receiver_name TEXT NOT NULL,
  receiver_address TEXT NOT NULL,
  receiver_phone TEXT,

  -- Package
  package_type TEXT CHECK (package_type IN ('document', 'parcel', 'pallet', 'container')),
  weight DECIMAL(10,2),
  dimensions TEXT,
  description TEXT,

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'picked_up', 'in_transit', 'customs_clearance',
    'out_for_delivery', 'delivered', 'on_hold', 'delayed', 'returned'
  )),

  -- Payment
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'on_hold')),
  amount DECIMAL(10,2),

  -- Route
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  estimated_delivery DATE,
  actual_delivery DATE,

  -- Hold info
  hold_reason TEXT,
  held_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shipment events (tracking timeline)
CREATE TABLE IF NOT EXISTS shipment_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL,
  location TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    'customer'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- Auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_shipments_updated_at ON shipments;
CREATE TRIGGER set_shipments_updated_at
  BEFORE UPDATE ON shipments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS set_profiles_updated_at ON profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (id = auth.uid());

-- Admin helper function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- Shipments
CREATE POLICY "Customers view own shipments"
  ON shipments FOR SELECT
  USING (customer_id = auth.uid() OR is_admin());

CREATE POLICY "Admins can insert shipments"
  ON shipments FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update shipments"
  ON shipments FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete shipments"
  ON shipments FOR DELETE
  USING (is_admin());

-- Public tracking: anyone can look up by tracking number (no auth needed)
CREATE POLICY "Public can view shipments by tracking number"
  ON shipments FOR SELECT
  USING (true);

-- Shipment events
CREATE POLICY "Public can view shipment events"
  ON shipment_events FOR SELECT USING (true);

CREATE POLICY "Admins can manage shipment events"
  ON shipment_events FOR ALL USING (is_admin());

-- Payments
CREATE POLICY "Customers view own payments"
  ON payments FOR SELECT
  USING (
    shipment_id IN (SELECT id FROM shipments WHERE customer_id = auth.uid())
    OR is_admin()
  );

CREATE POLICY "Admins can manage payments"
  ON payments FOR ALL USING (is_admin());

-- ============================================================
-- Seed data — 4 demo shipments
-- ============================================================
INSERT INTO shipments (
  tracking_number, sender_name, sender_address, sender_phone,
  receiver_name, receiver_address, receiver_phone,
  package_type, weight, dimensions, description,
  status, payment_status, amount,
  origin, destination, estimated_delivery
) VALUES
(
  'SWF100001',
  'Apex Technologies Ltd', '12 Innovation Drive, San Francisco, CA 94105', '+1 (415) 555-0100',
  'Global Retail Corp', '88 Commerce Blvd, Chicago, IL 60601', '+1 (312) 555-0182',
  'parcel', 14.5, '40 × 30 × 25 cm', 'Electronic components',
  'in_transit', 'paid', 89.99,
  'San Francisco, CA', 'Chicago, IL', '2026-07-28'
),
(
  'SWF100002',
  'Meridian Exports Inc', 'Port Warehouse 4, Houston, TX 77001', '+1 (713) 555-0247',
  'Atlantic Trade Partners', 'Unit 7, Port of Miami, Miami, FL 33132', '+1 (305) 555-0399',
  'container', 4200, '20ft ISO Container', 'Industrial machinery — heavy freight',
  'on_hold', 'unpaid', 1850.00,
  'Houston, TX', 'Miami, FL', '2026-07-30'
),
(
  'SWF100003',
  'Claire Fontaine', '34 Rue de la Paix, Paris, France 75002', '+33 1 55 00 1234',
  'Hudson Boutique NYC', '210 West 14th Street, New York, NY 10011', '+1 (212) 555-0771',
  'document', 0.8, 'A4 envelope', 'Legal documents — time sensitive',
  'out_for_delivery', 'paid', 42.50,
  'Paris, France', 'New York, NY', '2026-07-23'
),
(
  'SWF100004',
  'Delta Pharma Group', '100 BioTech Way, Boston, MA 02115', '+1 (617) 555-0940',
  'Western Health Systems', '500 Wellness Ave, Los Angeles, CA 90001', '+1 (310) 555-0633',
  'pallet', 340, '120 × 100 × 120 cm', 'Medical supplies — temperature controlled',
  'delivered', 'paid', 620.00,
  'Boston, MA', 'Los Angeles, CA', '2026-07-20'
)
ON CONFLICT (tracking_number) DO NOTHING;

-- Seed events for SWF100001
INSERT INTO shipment_events (shipment_id, status, location, description, created_at)
SELECT id, 'pending', 'San Francisco, CA', 'Shipment created and awaiting pickup.', '2026-07-22 09:00:00+00'::timestamptz FROM shipments WHERE tracking_number = 'SWF100001';
INSERT INTO shipment_events (shipment_id, status, location, description, created_at)
SELECT id, 'picked_up', 'San Francisco, CA', 'Package picked up from sender.', '2026-07-22 14:00:00+00'::timestamptz FROM shipments WHERE tracking_number = 'SWF100001';
INSERT INTO shipment_events (shipment_id, status, location, description, created_at)
SELECT id, 'in_transit', 'Denver, CO', 'Package is in transit to destination hub.', '2026-07-23 08:30:00+00'::timestamptz FROM shipments WHERE tracking_number = 'SWF100001';

-- Seed events for SWF100002
INSERT INTO shipment_events (shipment_id, status, location, description, created_at)
SELECT id, 'pending', 'Houston, TX', 'Shipment booked and awaiting pickup.', '2026-07-20 10:00:00+00'::timestamptz FROM shipments WHERE tracking_number = 'SWF100002';
INSERT INTO shipment_events (shipment_id, status, location, description, created_at)
SELECT id, 'picked_up', 'Houston, TX', 'Container collected from sender facility.', '2026-07-21 13:00:00+00'::timestamptz FROM shipments WHERE tracking_number = 'SWF100002';
INSERT INTO shipment_events (shipment_id, status, location, description, created_at)
SELECT id, 'in_transit', 'Houston, TX', 'Container loaded and in transit to departure port.', '2026-07-22 08:00:00+00'::timestamptz FROM shipments WHERE tracking_number = 'SWF100002';
INSERT INTO shipment_events (shipment_id, status, location, description, created_at)
SELECT id, 'customs_clearance', 'Houston, TX — US Customs', 'Customs documentation reviewed and cleared.', '2026-07-22 16:45:00+00'::timestamptz FROM shipments WHERE tracking_number = 'SWF100002';
INSERT INTO shipment_events (shipment_id, status, location, description, created_at)
SELECT id, 'on_hold', 'Houston, TX — Freight Terminal', 'Shipment placed on hold. Reason: outstanding payment (Invoice #INV-20260722-002).', '2026-07-23 10:00:00+00'::timestamptz FROM shipments WHERE tracking_number = 'SWF100002';

-- Update hold reason for SWF100002
UPDATE shipments SET
  hold_reason = 'Payment outstanding. Shipment has been placed on hold pending receipt of full payment. Please contact your account manager or settle invoice #INV-20260722-002 to release.',
  held_at = '2026-07-23 10:00:00+00'::timestamptz
WHERE tracking_number = 'SWF100002';

-- Seed events for SWF100003
INSERT INTO shipment_events (shipment_id, status, location, description, created_at)
SELECT id, 'pending', 'Paris, France', 'Shipment registered.', '2026-07-21 14:00:00+00'::timestamptz FROM shipments WHERE tracking_number = 'SWF100003';
INSERT INTO shipment_events (shipment_id, status, location, description, created_at)
SELECT id, 'picked_up', 'Paris, France', 'Envelope collected from sender.', '2026-07-21 18:00:00+00'::timestamptz FROM shipments WHERE tracking_number = 'SWF100003';
INSERT INTO shipment_events (shipment_id, status, location, description, created_at)
SELECT id, 'in_transit', 'Charles de Gaulle Airport, Paris', 'Departed on flight SS8843 to New York.', '2026-07-22 05:00:00+00'::timestamptz FROM shipments WHERE tracking_number = 'SWF100003';
INSERT INTO shipment_events (shipment_id, status, location, description, created_at)
SELECT id, 'in_transit', 'New York, JFK Airport', 'Arrived at JFK arrival facility.', '2026-07-22 18:00:00+00'::timestamptz FROM shipments WHERE tracking_number = 'SWF100003';
INSERT INTO shipment_events (shipment_id, status, location, description, created_at)
SELECT id, 'customs_clearance', 'JFK International — US Customs', 'Cleared US customs without issue.', '2026-07-22 22:30:00+00'::timestamptz FROM shipments WHERE tracking_number = 'SWF100003';
INSERT INTO shipment_events (shipment_id, status, location, description, created_at)
SELECT id, 'out_for_delivery', 'New York, NY — Manhattan Depot', 'Package is with our delivery driver. Expected delivery today.', '2026-07-23 07:15:00+00'::timestamptz FROM shipments WHERE tracking_number = 'SWF100003';

-- Seed events for SWF100004
INSERT INTO shipment_events (shipment_id, status, location, description, created_at)
SELECT id, 'pending', 'Boston, MA', 'Shipment created.', '2026-07-16 15:00:00+00'::timestamptz FROM shipments WHERE tracking_number = 'SWF100004';
INSERT INTO shipment_events (shipment_id, status, location, description, created_at)
SELECT id, 'picked_up', 'Boston, MA', 'Pallet collected from Delta Pharma cold-storage.', '2026-07-17 09:00:00+00'::timestamptz FROM shipments WHERE tracking_number = 'SWF100004';
INSERT INTO shipment_events (shipment_id, status, location, description, created_at)
SELECT id, 'in_transit', 'Dallas, TX', 'Package transited through Dallas sorting facility.', '2026-07-18 14:00:00+00'::timestamptz FROM shipments WHERE tracking_number = 'SWF100004';
INSERT INTO shipment_events (shipment_id, status, location, description, created_at)
SELECT id, 'in_transit', 'Phoenix, AZ', 'Departed Phoenix hub, en route to Los Angeles.', '2026-07-19 20:00:00+00'::timestamptz FROM shipments WHERE tracking_number = 'SWF100004';
INSERT INTO shipment_events (shipment_id, status, location, description, created_at)
SELECT id, 'out_for_delivery', 'Los Angeles, CA', 'Out for delivery with our driver.', '2026-07-20 07:45:00+00'::timestamptz FROM shipments WHERE tracking_number = 'SWF100004';
INSERT INTO shipment_events (shipment_id, status, location, description, created_at)
SELECT id, 'delivered', 'Los Angeles, CA', 'Package delivered and signed for by J. Martinez at reception.', '2026-07-20 11:30:00+00'::timestamptz FROM shipments WHERE tracking_number = 'SWF100004';

UPDATE shipments SET actual_delivery = '2026-07-20' WHERE tracking_number = 'SWF100004';
