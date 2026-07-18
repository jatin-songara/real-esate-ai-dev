export interface Profile {
  id: string;
  email: string;
  created_at: string;
}

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  stripe_secret_key?: string;
  stripe_publishable_key?: string;
  subscription_tier: 'Free' | 'Pro' | 'Business';
  stripe_subscription_id?: string;
  contact_phone?: string;
  support_email?: string;
  website_url?: string;
  timezone: string;
  maps_latitude?: number;
  maps_longitude?: number;
  operating_hours: string;
  website_addon_subscribed: boolean;
  created_at: string;
}

export interface Property {
  id: string;
  business_id: string;
  title: string;
  description: string;
  address: string;
  city?: string;
  state?: string;
  zip?: string;
  price: number;
  type: 'sale' | 'rent';
  category: 'House' | 'Apartment' | 'Commercial';
  status: 'Available' | 'Pending' | 'Sold';
  bedrooms: number;
  bathrooms: number;
  parking_spaces: number;
  sqft: number;
  year_built?: number;
  amenities: string[];
  images: string[];
  created_at: string;
}

export interface CustomQA {
  question: string;
  answer: string;
}

export interface Agent {
  id: string;
  business_id: string;
  property_id?: string;
  name: string;
  voice: string;
  personality: string;
  greeting: string;
  language: string;
  custom_qa: CustomQA[];
  widget_color: string;
  widget_theme: 'light' | 'dark';
  interpretation_level: string;
  service_type: 'Buyer Consultation' | 'Viewing Property';
  created_at: string;
}

export interface Appointment {
  id: string;
  business_id: string;
  property_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  slot_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'unpaid' | 'paid_cash' | 'paid_stripe';
  payment_amount: number;
  created_at: string;
}

export interface CallTranscriptMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface CallLog {
  id: string;
  business_id: string;
  agent_id?: string;
  client_phone: string;
  duration: number;
  transcript: CallTranscriptMessage[];
  created_at: string;
}

export interface SupportTicket {
  id: string;
  business_id: string;
  client_name: string;
  client_email: string;
  status: 'open' | 'closed';
  created_at: string;
}

export interface ChatMessage {
  id: string;
  ticket_id: string;
  sender: 'client' | 'agent';
  message: string;
  image_url?: string;
  created_at: string;
}

export interface Service {
  id: string;
  business_id: string;
  title: string;
  type: string;
  price: number;
  active: boolean;
  desc_text?: string;
  created_at: string;
}