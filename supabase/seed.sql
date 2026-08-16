-- ====================================================================
-- MehendiAura Seed Data Script
-- ====================================================================

-- 1. BUSINESS SETTINGS SEED
INSERT INTO public.business_settings (
    id,
    business_name,
    phone,
    whatsapp,
    email,
    address,
    google_maps_url,
    business_hours,
    instagram_url,
    facebook_url,
    hero_title,
    hero_description,
    about_content
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'MehendiAura',
    '+919876543210',
    '919876543210',
    'info@mehendiaura.com',
    'Studio #12, Wedding Boulevard, MG Road, City Center',
    'https://maps.google.com',
    'Mon - Sun: 9:00 AM - 9:00 PM',
    'https://instagram.com/mehendiaura',
    'https://facebook.com/mehendiaura',
    'Exquisite Mehendi Artistry & Premium Rental Jewellery',
    'Crafting unforgettable bridal mehendi designs & curating regal rental jewellery sets for weddings and grand celebrations.',
    'MehendiAura is a premier bridal mehendi artistry and rental jewellery studio dedicated to timeless Indian wedding traditions.'
) ON CONFLICT (id) DO NOTHING;

-- 2. SERVICES SEED
INSERT INTO public.services (id, name, slug, short_description, description, category, price, duration, featured, active, display_order) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'Royal Bridal Mehendi',
    'royal-bridal-mehendi',
    'Intricate full-arm and leg bridal henna art featuring custom portrait motifs and wedding rituals.',
    'Our signature Royal Bridal Mehendi package offers bespoke, highly detailed bridal henna patterns crafted with 100% natural organic henna. Includes custom dulha-dulhan portraits, baraat motifs, and custom story elements.',
    'Bridal',
    'Contact for Custom Quote',
    '4 - 6 Hours',
    true,
    true,
    1
),
(
    '11111111-1111-1111-1111-222222222222',
    'Arabic & Contemporary Mehendi',
    'arabic-contemporary-mehendi',
    'Elegant flowing floral vines, shaded mandalas, and modern geometric patterns.',
    'Designed for engagement ceremonies, sangeet, and bridesmaids wanting bold, flowing floral patterns with rich natural stain contrast.',
    'Arabic',
    'Starting from ₹2,500',
    '2 - 3 Hours',
    true,
    true,
    2
),
(
    '11111111-1111-1111-1111-333333333333',
    'Guest & Party Henna Package',
    'guest-party-henna-package',
    'Fast, exquisite palm and wrist henna patterns for wedding guests and family members.',
    'Dedicated speed artist team for group guest henna application during mehendi ceremonies and sangeet functions.',
    'Party',
    'Starting from ₹500 / person',
    '15 Mins / Person',
    false,
    true,
    3
);

-- 3. RENTAL JEWELLERY SEED
INSERT INTO public.jewellery (id, name, slug, short_description, description, category, rental_price, security_deposit, availability_status, included_items, featured, active, display_order) VALUES
(
    '22222222-2222-2222-2222-111111111111',
    'Kundu & Polki Royal Bridal Set',
    'kundu-polki-royal-bridal-set',
    'Regal Kundan necklace set with matching long haram, matha patti, jhumkas, and waist belt.',
    'Handcrafted premium Kundan bridal rental set plated in 22K gold finish, designed to complement traditional bridal lehengas and Kanjeevaram silk sarees.',
    'Bridal Sets',
    2500.00,
    3000.00,
    'available',
    ARRAY['Royal Choker Necklace', 'Long Layered Haram', 'Matha Patti', 'Matching Jhumka Earrings', 'Vaddanam Waist Belt', 'Nath / Nose Ring'],
    true,
    true,
    1
),
(
    '22222222-2222-2222-2222-222222222222',
    'South Indian Temple Heritage Set',
    'south-indian-temple-heritage-set',
    'Traditional matte gold temple jewellery set with Lakshmi motifs and ruby green stones.',
    'Authentic South Indian temple rental jewellery set featuring divine Lakshmi pendants, mango haram, jhumkas, and armlets (vanki).',
    'Temple Jewellery',
    1800.00,
    2000.00,
    'available',
    ARRAY['Short Temple Choker', 'Long Mango Haram', 'Temple Jhumkas', 'Maang Tikka', 'Vanki Armlet'],
    true,
    true,
    2
);

-- 4. FAQS SEED
INSERT INTO public.faqs (id, question, answer, category, active, display_order) VALUES
(
    '33333333-3333-3333-3333-111111111111',
    'How far in advance should I book Bridal Mehendi?',
    'We recommend booking 2 to 4 months in advance for peak wedding season to guarantee availability.',
    'Mehendi',
    true,
    1
),
(
    '33333333-3333-3333-3333-222222222222',
    'What is the security deposit policy for rental jewellery?',
    'A refundable security deposit is collected upon collection and fully refunded when the set is returned in pristine condition within the rental period.',
    'Rental Jewellery',
    true,
    2
);
