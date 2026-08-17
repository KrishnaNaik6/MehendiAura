export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      business_settings: {
        Row: BusinessSettings
        Insert: Omit<BusinessSettings, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<BusinessSettings, 'id'>>
      }
      services: {
        Row: Service
        Insert: Omit<Service, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Service, 'id'>>
      }
      service_images: {
        Row: ServiceImage
        Insert: Omit<ServiceImage, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<ServiceImage, 'id'>>
      }
      jewellery: {
        Row: Jewellery
        Insert: Omit<Jewellery, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Jewellery, 'id'>>
      }
      jewellery_images: {
        Row: JewelleryImage
        Insert: Omit<JewelleryImage, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<JewelleryImage, 'id'>>
      }
      gallery: {
        Row: GalleryItem
        Insert: Omit<GalleryItem, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<GalleryItem, 'id'>>
      }
      testimonials: {
        Row: Testimonial
        Insert: Omit<Testimonial, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<Testimonial, 'id'>>
      }
      faqs: {
        Row: FAQ
        Insert: Omit<FAQ, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<FAQ, 'id'>>
      }
      visitor_logs: {
        Row: VisitorLog
        Insert: Omit<VisitorLog, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<VisitorLog, 'id'>>
      }
    }
  }
}

export interface BusinessSettings {
  id: string
  business_name: string
  phone: string
  whatsapp: string
  email: string | null
  address: string
  google_maps_url: string | null
  business_hours: string
  instagram_url: string | null
  facebook_url: string | null
  youtube_url?: string | null
  logo_url: string | null
  hero_image_url: string | null
  hero_title: string
  hero_description: string
  about_content: string
  // Multilingual Fields & Admin Default Locale Preference
  default_locale?: "en" | "kn" | null
  hero_title_en?: string | null
  hero_title_kn?: string | null
  hero_description_en?: string | null
  hero_description_kn?: string | null
  about_content_en?: string | null
  about_content_kn?: string | null
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  name: string
  slug: string
  short_description: string
  description: string
  category: string
  price: string | null
  duration: string | null
  featured: boolean
  active: boolean
  display_order: number
  // Multilingual Fields
  name_en?: string | null
  name_kn?: string | null
  short_description_en?: string | null
  short_description_kn?: string | null
  description_en?: string | null
  description_kn?: string | null
  created_at: string
  updated_at: string
  service_images?: ServiceImage[]
}

export interface ServiceImage {
  id: string
  service_id: string
  image_url: string
  storage_path: string
  alt_text: string | null
  alt_text_en?: string | null
  alt_text_kn?: string | null
  display_order: number
  created_at: string
}

export interface Jewellery {
  id: string
  name: string
  slug: string
  short_description: string
  description: string
  category: string
  rental_price: number | null
  security_deposit: number | null
  availability_status: 'available' | 'booked' | 'maintenance'
  included_items: string[]
  featured: boolean
  active: boolean
  display_order: number
  // Multilingual Fields
  name_en?: string | null
  name_kn?: string | null
  short_description_en?: string | null
  short_description_kn?: string | null
  description_en?: string | null
  description_kn?: string | null
  included_items_en?: string[] | null
  included_items_kn?: string[] | null
  created_at: string
  updated_at: string
  jewellery_images?: JewelleryImage[]
}

export interface JewelleryImage {
  id: string
  jewellery_id: string
  image_url: string
  storage_path: string
  alt_text: string | null
  alt_text_en?: string | null
  alt_text_kn?: string | null
  display_order: number
  created_at: string
}

export interface GalleryItem {
  id: string
  title: string
  description: string | null
  category: string
  image_url: string
  storage_path: string
  alt_text: string | null
  // Multilingual Fields
  title_en?: string | null
  title_kn?: string | null
  description_en?: string | null
  description_kn?: string | null
  alt_text_en?: string | null
  alt_text_kn?: string | null
  display_order: number
  active: boolean
  created_at: string
}

export interface Testimonial {
  id: string
  customer_name: string
  testimonial: string
  // Multilingual Fields
  testimonial_en?: string | null
  testimonial_kn?: string | null
  rating: number
  event_type: string | null
  image_url: string | null
  active: boolean
  display_order: number
  created_at: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  // Multilingual Fields
  question_en?: string | null
  question_kn?: string | null
  answer_en?: string | null
  answer_kn?: string | null
  category: string | null
  active: boolean
  display_order: number
  created_at: string
}

export interface VisitorLog {
  id: string
  session_id: string
  page_path: string
  action: 'page_view' | 'whatsapp_click' | 'call_click' | 'service_view' | 'jewellery_view' | 'gallery_view'
  details: string | null
  language: string | null
  device: string | null
  created_at: string
}
