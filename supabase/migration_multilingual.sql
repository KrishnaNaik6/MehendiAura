-- ====================================================================
-- MehendiAura Multilingual Database Schema Migration (English + Kannada)
-- Target: PostgreSQL / Supabase
-- Preserves existing data by copying legacy columns into _en columns.
-- ====================================================================

-- 1. BUSINESS SETTINGS MULTILINGUAL COLUMNS
ALTER TABLE public.business_settings
ADD COLUMN IF NOT EXISTS hero_title_en TEXT,
ADD COLUMN IF NOT EXISTS hero_title_kn TEXT,
ADD COLUMN IF NOT EXISTS hero_description_en TEXT,
ADD COLUMN IF NOT EXISTS hero_description_kn TEXT,
ADD COLUMN IF NOT EXISTS about_content_en TEXT,
ADD COLUMN IF NOT EXISTS about_content_kn TEXT;

-- Safely populate default English columns from legacy columns if empty
UPDATE public.business_settings
SET 
  hero_title_en = COALESCE(hero_title_en, hero_title, 'Exquisite Mehendi Artistry & Premium Rental Jewellery'),
  hero_title_kn = COALESCE(hero_title_kn, 'ಅತ್ಯುತ್ತಮ ಬ್ರೈಡಲ್ ಮೆಹೆಂದಿ ಕಲೆ ಮತ್ತು ಪ್ರೀಮಿಯಂ ಬಾಡಿಗೆ ಆಭರಣಗಳು'),
  hero_description_en = COALESCE(hero_description_en, hero_description, 'Crafting unforgettable bridal mehendi designs & curating regal rental jewellery sets for weddings and grand celebrations.'),
  hero_description_kn = COALESCE(hero_description_kn, 'ಮದುವೆ ಮತ್ತು ಶುಭ ಸಮಾರಂಭಗಳಿಗಾಗಿ ಸುಂದರವಾದ ವಧುವಿನ ಮೆಹೆಂದಿ ವಿನ್ಯಾಸಗಳು ಹಾಗೂ ವೈಭವದ ಬಾಡಿಗೆ ಆಭರಣಗಳ ಸಂಗ್ರಹ.'),
  about_content_en = COALESCE(about_content_en, about_content, 'MehendiAura is a premier bridal mehendi artistry and rental jewellery studio dedicated to timeless Indian wedding traditions.'),
  about_content_kn = COALESCE(about_content_kn, 'MehendiAura ಭಾರತೀಯ ಮದುವೆಗಳ ಸೌಂದರ್ಯವನ್ನು ಹೆಚ್ಚಿಸುವ ಪ್ರಮುಖ ಮೆಹೆಂದಿ ಕಲೆ ಮತ್ತು ಬಾಡಿಗೆ ಆಭರಣಗಳ ಸ್ಟುಡಿಯೋ ಆಗಿದೆ.');

-- 2. MEHENDI SERVICES MULTILINGUAL COLUMNS
ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS name_en TEXT,
ADD COLUMN IF NOT EXISTS name_kn TEXT,
ADD COLUMN IF NOT EXISTS short_description_en TEXT,
ADD COLUMN IF NOT EXISTS short_description_kn TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS description_kn TEXT;

UPDATE public.services
SET 
  name_en = COALESCE(name_en, name),
  short_description_en = COALESCE(short_description_en, short_description),
  description_en = COALESCE(description_en, description);

-- 3. RENTAL JEWELLERY MULTILINGUAL COLUMNS
ALTER TABLE public.jewellery
ADD COLUMN IF NOT EXISTS name_en TEXT,
ADD COLUMN IF NOT EXISTS name_kn TEXT,
ADD COLUMN IF NOT EXISTS short_description_en TEXT,
ADD COLUMN IF NOT EXISTS short_description_kn TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS description_kn TEXT,
ADD COLUMN IF NOT EXISTS included_items_en TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS included_items_kn TEXT[] DEFAULT '{}';

UPDATE public.jewellery
SET 
  name_en = COALESCE(name_en, name),
  short_description_en = COALESCE(short_description_en, short_description),
  description_en = COALESCE(description_en, description),
  included_items_en = COALESCE(included_items_en, included_items);

-- 4. SHOWCASE GALLERY MULTILINGUAL COLUMNS
ALTER TABLE public.gallery
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS title_kn TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS description_kn TEXT,
ADD COLUMN IF NOT EXISTS alt_text_en TEXT,
ADD COLUMN IF NOT EXISTS alt_text_kn TEXT;

UPDATE public.gallery
SET 
  title_en = COALESCE(title_en, title),
  description_en = COALESCE(description_en, description),
  alt_text_en = COALESCE(alt_text_en, alt_text);

-- 5. TESTIMONIALS MULTILINGUAL COLUMNS
ALTER TABLE public.testimonials
ADD COLUMN IF NOT EXISTS testimonial_en TEXT,
ADD COLUMN IF NOT EXISTS testimonial_kn TEXT;

UPDATE public.testimonials
SET testimonial_en = COALESCE(testimonial_en, testimonial);

-- 6. FAQS MULTILINGUAL COLUMNS
ALTER TABLE public.faqs
ADD COLUMN IF NOT EXISTS question_en TEXT,
ADD COLUMN IF NOT EXISTS question_kn TEXT,
ADD COLUMN IF NOT EXISTS answer_en TEXT,
ADD COLUMN IF NOT EXISTS answer_kn TEXT;

UPDATE public.faqs
SET 
  question_en = COALESCE(question_en, question),
  answer_en = COALESCE(answer_en, answer);
