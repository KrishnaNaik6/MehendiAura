-- ====================================================================
-- MehendiAura Database Schema SQL Migration
-- Target: PostgreSQL / Supabase
-- Includes: Tables, Relationships, Triggers, RLS, Storage Buckets & Policies
-- ====================================================================

-- 1. EXTENSIONS & UTILITIES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Helper function to automatically update `updated_at` column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. BUSINESS SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.business_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name TEXT NOT NULL DEFAULT 'MehendiAura',
    phone TEXT NOT NULL DEFAULT '+919876543210',
    whatsapp TEXT NOT NULL DEFAULT '919876543210',
    email TEXT,
    address TEXT NOT NULL DEFAULT 'Main Studio & Rental Store, City Center',
    google_maps_url TEXT,
    business_hours TEXT NOT NULL DEFAULT 'Mon - Sun: 9:00 AM - 9:00 PM',
    instagram_url TEXT,
    facebook_url TEXT,
    youtube_url TEXT,
    logo_url TEXT,
    hero_image_url TEXT,
    hero_title TEXT NOT NULL DEFAULT 'Exquisite Mehendi Artistry & Premium Rental Jewellery',
    hero_description TEXT NOT NULL DEFAULT 'Crafting unforgettable bridal mehendi designs & curating regal rental jewellery sets for weddings and grand celebrations.',
    about_content TEXT NOT NULL DEFAULT 'MehendiAura is a premier bridal mehendi artistry and rental jewellery studio dedicated to timeless Indian wedding traditions.',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. MEHENDI SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Bridal',
    price TEXT, -- e.g., "Contact for Price" or "Starting from ₹5,000"
    duration TEXT, -- e.g., "4 - 6 Hours"
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. SERVICE IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.service_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    alt_text TEXT,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. RENTAL JEWELLERY TABLE
CREATE TABLE IF NOT EXISTS public.jewellery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Bridal Sets',
    rental_price NUMERIC(10, 2),
    security_deposit NUMERIC(10, 2),
    availability_status TEXT NOT NULL DEFAULT 'available' CHECK (availability_status IN ('available', 'booked', 'maintenance')),
    included_items TEXT[] DEFAULT '{}',
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. JEWELLERY IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.jewellery_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    jewellery_id UUID NOT NULL REFERENCES public.jewellery(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    alt_text TEXT,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. GALLERY TABLE
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'Bridal Mehendi',
    image_url TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    alt_text TEXT,
    display_order INT NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    testimonial TEXT NOT NULL,
    rating INT NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    event_type TEXT, -- e.g. "Wedding", "Engagement", "Baby Shower"
    image_url TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. FAQS TABLE
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. TRIGGERS FOR UPDATED_AT
CREATE OR REPLACE TRIGGER set_updated_at_business_settings
    BEFORE UPDATE ON public.business_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER set_updated_at_services
    BEFORE UPDATE ON public.services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER set_updated_at_jewellery
    BEFORE UPDATE ON public.jewellery
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jewellery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jewellery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES
CREATE POLICY "Public Read Business Settings" ON public.business_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Active Services" ON public.services FOR SELECT USING (active = true OR auth.role() = 'authenticated');
CREATE POLICY "Public Read Service Images" ON public.service_images FOR SELECT USING (true);
CREATE POLICY "Public Read Active Jewellery" ON public.jewellery FOR SELECT USING (active = true OR auth.role() = 'authenticated');
CREATE POLICY "Public Read Jewellery Images" ON public.jewellery_images FOR SELECT USING (true);
CREATE POLICY "Public Read Active Gallery" ON public.gallery FOR SELECT USING (active = true OR auth.role() = 'authenticated');
CREATE POLICY "Public Read Active Testimonials" ON public.testimonials FOR SELECT USING (active = true OR auth.role() = 'authenticated');
CREATE POLICY "Public Read Active FAQs" ON public.faqs FOR SELECT USING (active = true OR auth.role() = 'authenticated');

-- ADMIN MUTATION POLICIES (AUTHENTICATED USER ONLY)
CREATE POLICY "Admin All Business Settings" ON public.business_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Services" ON public.services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Service Images" ON public.service_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Jewellery" ON public.jewellery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Jewellery Images" ON public.jewellery_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Gallery" ON public.gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Testimonials" ON public.testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All FAQs" ON public.faqs FOR ALL USING (auth.role() = 'authenticated');

-- ====================================================================
-- 12. SUPABASE STORAGE BUCKET & STORAGE POLICIES
-- ====================================================================

-- Create storage bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('mehendiaura-images', 'mehendiaura-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Read Policy (Public access to images)
CREATE POLICY "Public Read Storage Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'mehendiaura-images');

-- Storage Insert/Update/Delete Policy (Admin access only)
CREATE POLICY "Admin Insert Storage Images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'mehendiaura-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admin Update Storage Images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'mehendiaura-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admin Delete Storage Images"
ON storage.objects FOR DELETE
USING (bucket_id = 'mehendiaura-images' AND auth.role() = 'authenticated');
