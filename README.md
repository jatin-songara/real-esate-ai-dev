Real Estate AI Calling Agent - Complete System Documentation

Version: 1.0 | Last Updated: July 17, 2026 | Document Type: System Documentation & User Guide



Table of Contents





Executive Summary



System Overview



Core Features



Dashboard & Admin Panel



Property Management



AI Agent Configuration



Appointment Booking System



Payment Integration



Website Builder



Widget Integration



Subscription Plans



Technical Setup Guide



User Flows



API Endpoints



Database Schema



Technology Stack



Security Considerations



Executive Summary

Overview

The Real Estate AI Calling Agent is a comprehensive SaaS platform designed to revolutionize property management and client interactions for real estate agencies. The system integrates AI-powered voice agents, automated appointment booking, property listings management, and payment processing into a single, unified platform.

Key Value Propositions





24/7 AI Availability: AI agents handle inquiries, provide property details, and book appointments round the clock



Automated Lead Generation: Capture and qualify leads through intelligent conversations



Seamless Integration: Works with existing websites or as a standalone solution



Subscription Revenue: Multiple pricing tiers for recurring revenue



Comprehensive Analytics: Track conversions, call durations, and agent performance

Target Audience





Real estate agencies



Independent real estate agents



Property management companies



Real estate investors



System Overview

Platform Architecture





Frontend: Next.js 14 with React & TypeScript



Backend: Supabase (PostgreSQL + Authentication)



AI Integration: OpenAI for natural language processing



Payment Processing: Stripe integration



Email Service: Resend for transactional emails

Core Components





Admin Dashboard - Central management interface



AI Voice Agents - Intelligent call handlers



Property Management - Listing creation and management



Appointment System - Calendar and booking management



Client Portal - Self-service for end users



Website Builder - Custom site creation tool



Widget System - Embeddable components



Core Features

Feature Matrix







Category



Features





AI Agents



Multiple agent creation, Custom personalities, Multi-language support (60+), Voice customization, Service-specific routing





Property Management



Unlimited listings, Image uploads (5+), Amenities tracking, Status management, Featured listings





Appointment System



Calendar integration, Slot management, Confirmation workflows, Rescheduling, Cancellation





Payment Processing



Stripe integration, Online payments, Cash payment tracking, Subscription billing





Analytics



Conversion tracking, Call duration metrics, Booking statistics, Revenue reporting





Integration



Website embedding, Widget generation, API access, Webhook support





Communication



Email notifications, Real-time chat, Call transcription, Support tickets



Dashboard & Admin Panel

Navigation Structure

Dashboard
├── Overview (Stats, Activity, Recent Bookings)
├── Analytics (Conversion Rate, Graphs, Metrics)
├── Listings (All Properties, Add New, Filters)
├── Call Logs (All Conversations, Transcripts)
├── Viewings (Scheduled Appointments, Management)
├── Schedule (Calendar View, Time Slots)
├── Clients (Client List, History)
├── AI Agents (Agent List, Creation, Testing)
├── Services (Service Catalog, Pricing)
├── Knowledge Base (Predefined Q&A, Custom)
├── Widget (Generator, Embed Codes)
├── Website Builder (Templates, Customization)
├── Plans (Subscription Management)
├── Notifications (Alerts, Messages)
├── Support (Chat, Tickets)
└── Settings (Business Profile, Hours, Payments)

Dashboard Overview





Statistics Cards: Active listings, Total conversations, Bookings, Conversion rate



Activity Graph: Visual representation of call volume and conversions



Today's Activity: Real-time updates on daily appointments and calls



Recent Bookings: Quick access to latest appointments



Active Agents: List of configured AI agents with status



Property Management

Property Listing Features

Creating a New Listing





Basic Information: Title, Property Type, Listing Type, Address



Pricing: Amount, Price Type (Fixed/Monthly/Negotiable)



Specifications: Bedrooms, Bathrooms, Square Footage, Parking, Year Built



Description & Amenities: Detailed description, Amenities checklist, Custom amenities



Media: Multiple image uploads (5+ recommended), Image gallery management



Agent Assignment: Assign specific AI agent or use global agent



Status Management: Available, Pending, Sold, Rental, Withdrawn, Featured toggle

Property Management Actions





Edit: Modify any property details



Deactivate: Temporarily hide from listings



Delete: Permanent removal



Duplicate: Create copy for similar properties



View Details: Full property information page



AI Agent Configuration

Agent Creation Process

Step 1: Basic Information





Agent Name: Unique identifier (e.g., "Alexis - Residential Specialist")



Voice Selection: Choose from available voice options



Language: Primary language (60+ supported)



Personality: Professional, Friendly, Technical, etc.



Sensitivity Level: Low, Medium, High

Step 2: Greeting & Messaging





Greeting Message: Custom welcome message



System Prompt: Context and instructions for the AI



Fallback Responses: Default answers for unknown queries

Step 3: Service Assignment





Available Services: Buyer Consultation, Property Viewing, Investment Property Analysis, Commercial Rental, Residential Sales, Property Management, Onboarding, Outbound Calls



Custom Services: Create agency-specific services



Pricing Configuration: Set service fees (can be $0)

Step 4: Knowledge Base





Predefined Questions: 40+ real estate-specific questions



Custom Knowledge: Add agency-specific FAQs



Category Organization: Group questions by topic



Response Customization: Edit AI responses

Agent Management





Activation/Deactivation: Toggle agent availability



Testing: Live call or form submission tests



Editing: Modify any agent parameters



Deletion: Remove unwanted agents



Cloning: Duplicate existing agents

Subscription Limits







Plan



Max Agents



Max Appointments





Free



1



5





Pro



10



50





Business



Unlimited



Unlimited



Appointment Booking System

Booking Methods





AI Call Booking: Direct voice call with AI agent, Natural language conversation, Automated information collection, Real-time slot checking



Form Booking: Web-based booking form, Service selection, Date/time picker, Contact information collection



Manual Booking: Admin-created appointments, Direct calendar entry, Client information input

Booking Workflow





Information Collection: Client Name, Phone, Email, Budget Range, Financing Status, Preferred Date/Time, Service Type, Special Notes



Slot Verification: Real-time availability check, Business hours validation, Agent availability confirmation, Conflict prevention



Confirmation: Email notification to client, Email notification to agent, Calendar integration, Dashboard updates, Unique confirmation link

Appointment Management





Status Types: Pending, Confirmed, Completed, Cancelled, Rescheduled



Payment Status: Paid (Online), Paid (Cash), Unpaid, Refunded



Actions: Confirm, Cancel, Reschedule, Mark Complete, Payment Processing

Client Portal Features





Appointment List: View all bookings



Status Tracking: Real-time updates



Rescheduling: Self-service changes



Cancellation: Remove appointments



Payment: Online payment processing



Support: Direct chat with agent



Payment Integration

Payment Methods





Online Payment (Stripe): Credit/Debit Cards, Secure processing, Instant confirmation, Transaction history



Cash Payment: Mark as cash payment, Payment at viewing, Manual tracking

Stripe Integration





Setup Requirements: Publishable Key, Secret Key, Webhook Configuration, Test Mode



Supported Currencies: USD, EUR, GBP, INR, and 135+ more



Payment Flows: Subscription Payments, Service Payments, Website Builder Subscription

Payment Status Tracking





Pending: Payment initiated but not completed



Completed: Successfully processed



Failed: Payment declined



Refunded: Money returned to client



Website Builder

Features





Template Selection: 3+ professional templates



Theme Customization: Light/Dark modes, color schemes



Branding: Logo upload, agency name, tagline



Content Management: Edit all text and images



Agent Integration: Assign AI agents to website



Domain Support: Custom domain configuration



SEO Optimization: Meta tags, descriptions

Website Sections





Hero Section: Main headline, Subheadline, Call-to-action buttons, Background image



About Section: Agency description, Team members, Mission statement



Services Section: Service listings, Pricing display, Feature highlights



Properties Section: Featured listings, Property grid, Search functionality



Testimonials: Client reviews, Star ratings, Success stories



FAQ Section: Common questions, Expandable answers, Contact options



Contact Section: Contact form, Phone/Email, Address, Map integration



Footer: Links, Social media, Legal information

Publishing Options





Subdomain: your-agency.platform.com



Custom Domain: yourdomain.com



SSL Certificate: Automatic HTTPS



Hosting: Included in subscription ($29/month)



Widget Integration

Widget Types





AI Call Widget: Embeddable voice agent, Customizable appearance, Multiple placement options



Booking Form Widget: Standalone appointment form, Service selection, Calendar integration



Property Listing Widget: Display featured properties, Search functionality, Detailed property cards

Implementation Methods

JavaScript Embed

<script src="https://your-domain.com/widget.js" 
        data-agent-id="YOUR_AGENT_ID" 
        data-theme="light" 
        data-position="bottom-right">
</script>

React Component

import { RealEstateWidget } from '@realestate-ai/widget';

<RealEstateWidget 
  agentId="YOUR_AGENT_ID" 
  theme="dark" 
  position="bottom-left" 
  services={['viewing', 'consultation']} 
/>

Customization Options





Color Scheme: Primary/Secondary colors



Size: Compact, Medium, Large



Position: Any screen position



Greeting Message: Custom welcome text



Agent Selection: Choose which agent to display



Service Filtering: Limit available services



Subscription Plans & Pricing

Plan Comparison







Feature



Free



Pro



Business





Price



$0



$49/month



$199/month





Max Agents



1



10



Unlimited





Max Appointments



5



50



Unlimited





Property Listings



Unlimited



Unlimited



Unlimited





Website Builder



No



No



Yes





Custom Domain



No



No



Yes





Priority Support



No



Yes



Yes





Analytics



Basic



Advanced



Advanced





API Access



No



Yes



Yes





White-label



No



No



Yes





Team Members



1



5



Unlimited

Website Builder Subscription





Price: $29/month



Includes: Custom website with template, Hosting included, AI agent integration, Lead capture forms, Mobile-responsive design



Technical Setup Guide

Prerequisites





Node.js v20+ (recommended: v20.12.2)



npm v10+ (recommended: v10.5.0)



Git



Code Editor (VS Code recommended)

Step 1: Environment Setup

1.1 Clone Repository

git clone https://github.com/your-repo/real-estate-ai-calling-agent.git
cd real-estate-ai-calling-agent

1.2 Install Dependencies

npm install

1.3 Configure Environment Variables

Create .env.local file:

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-key

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Email Configuration (Resend)
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=your-email@domain.com

# Application Settings
NEXT_PUBLIC_APP_NAME=Real Estate AI Calling Agent
NEXT_PUBLIC_APP_URL=http://localhost:3000

Step 2: Supabase Database Setup

2.1 Create Supabase Project





Go to https://app.supabase.com



Create new project



Select region



Copy project URL and API keys

2.2 Run Database Schema





Navigate to Supabase SQL Editor



Paste the schema (see Database Schema section)



Run the schema

Step 3: Stripe Setup

3.1 Create Stripe Account





Go to https://dashboard.stripe.com



Sign up for an account



Get API keys from Developers > API Keys

3.2 Configure Webhooks





Go to Developers > Webhooks



Add endpoint: https://your-domain.com/api/stripe/webhook



Select events: payment_intent.succeeded, invoice.payment_succeeded, customer.subscription.*

3.3 Create Products & Prices





Free Plan ($0)



Pro Plan ($49/month)



Business Plan ($199/month)



Website Builder ($29/month)

Step 4: Resend Email Setup





Go to https://resend.com



Sign up for an account



Verify your domain



Get your API key

Step 5: Run the Application

Development Mode

npm run dev

Access at: http://localhost:3000

Production Build

npm run build
npm start

Step 6: Deploy to Production

Option A: Vercel (Recommended)

npm install -g vercel
vercel

Option B: Other Hosting





Netlify



AWS Amplify



DigitalOcean App Platform



Docker



User Flows

Flow 1: New User Registration

graph TD
    A[Landing Page] --> B[Click Get Started]
    B --> C[Registration Form]
    C --> D[Fill Details]
    D --> E[Submit]
    E --> F[Email Verification Sent]
    F --> G[User Checks Email]
    G --> H[Click Verification Link]
    H --> I[Email Verified]
    I --> J[Login]
    J --> K[Business Setup]
    K --> L[Dashboard]

Flow 2: Property Listing Creation

graph TD
    A[Dashboard] --> B[Click Add Listing]
    B --> C[Basic Info Form]
    C --> D[Upload Images]
    D --> E[Property Specifications]
    E --> F[Description & Amenities]
    F --> G[Pricing & Status]
    G --> H[Agent Assignment]
    H --> I[Submit]
    I --> J[Property Created]

Flow 3: AI Agent Creation

graph TD
    A[Dashboard] --> B[AI Agents Section]
    B --> C[Click Create Agent]
    C --> D[Basic Configuration]
    D --> E[Voice & Language]
    E --> F[Personality Settings]
    F --> G[Greeting & Prompts]
    G --> H[Service Assignment]
    H --> I[Knowledge Base]
    I --> J[Save Agent]

Flow 4: Client Booking via AI Call

graph TD
    A[Website Widget] --> B[Click Call Agent]
    B --> C[Connect to AI]
    C --> D[AI: Greeting]
    D --> E[Client: Inquiry]
    E --> F[AI: Property Details]
    F --> G[Client: Request Viewing]
    G --> H[AI: Collect Info]
    H --> I[Client: Provide Details]
    I --> J[AI: Check Availability]
    J --> K[AI: Confirm Slot]
    K --> L[Client: Confirm]
    L --> M[Appointment Booked]

Flow 5: Client Booking via Form

graph TD
    A[Website] --> B[Booking Form]
    B --> C[Select Service]
    C --> D[Choose Date/Time]
    D --> E[Enter Contact Info]
    E --> F[Add Notes]
    F --> G[Submit Form]
    G --> H[Validate Input]
    H --> I[Check Availability]
    I --> J[Create Appointment]
    J --> K[Send Confirmation]

Flow 6: Payment Processing

graph TD
    A[Client Portal] --> B[Select Appointment]
    B --> C[Click Pay Now]
    C --> D[Stripe Checkout]
    D --> E[Enter Card Details]
    E --> F[Process Payment]
    F --> G{Payment Success?}
    G -->|Yes| H[Update Status]
    G -->|No| I[Show Error]
    H --> J[Send Confirmation]

Flow 7: Appointment Management

graph TD
    A[Dashboard] --> B[View Appointments]
    B --> C[Select Appointment]
    C --> D{Action?}
    D -->|Confirm| E[Mark Confirmed]
    D -->|Cancel| F[Cancel Appointment]
    D -->|Reschedule| G[Change Date/Time]
    D -->|Complete| H[Mark Completed]
    E --> I[Send Confirmation Email]
    F --> J[Send Cancellation Email]

Flow 8: Website Creation

graph TD
    A[Dashboard] --> B[Website Builder]
    B --> C[Select Template]
    C --> D[Customize Theme]
    D --> E[Add Content]
    E --> F[Upload Logo]
    F --> G[Configure Pages]
    G --> H[Assign AI Agent]
    H --> I[Preview]
    I --> J{Ready?}
    J -->|Yes| K[Subscribe $29/month]
    J -->|No| L[Continue Editing]
    K --> M[Publish Website]



API Endpoints

Authentication







Method



Endpoint



Description





POST



/api/auth/signup



User registration





POST



/api/auth/login



User login





POST



/api/auth/logout



User logout





POST



/api/auth/verify-email



Email verification





POST



/api/auth/forgot-password



Password reset request





POST



/api/auth/reset-password



Password reset

Users







Method



Endpoint



Description





GET



/api/users/me



Get current user





PUT



/api/users/me



Update user profile





GET



/api/users/business-profile



Get business profile





PUT



/api/users/business-profile



Update business profile





GET



/api/users/business-hours



Get business hours





PUT



/api/users/business-hours



Update business hours

Properties







Method



Endpoint



Description





GET



/api/properties



List all properties





POST



/api/properties



Create new property





GET



/api/properties/:id



Get property details





PUT



/api/properties/:id



Update property





DELETE



/api/properties/:id



Delete property





POST



/api/properties/:id/images



Upload images





DELETE



/api/properties/:id/images/:imageId



Delete image

AI Agents







Method



Endpoint



Description





GET



/api/agents



List all agents





POST



/api/agents



Create new agent





GET



/api/agents/:id



Get agent details





PUT



/api/agents/:id
Update agent configuration

DELETE
/api/agents/:id
Delete agent profile

### Appointments

Method | Endpoint | Description
---|---|---
GET | /api/dashboard/appointments | List all scheduled bookings
POST | /api/voice/book | Book a new viewing appointment
PUT | /api/sites/portal | Update status / reschedule appointment

### Support Tickets

Method | Endpoint | Description
---|---|---
GET | /api/sites/support | List ticket messages
POST | /api/sites/support | Send support chat message

---

## Database Schema (D1 SQLite)

```sql
-- Profiles
CREATE TABLE profiles (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

-- Businesses
CREATE TABLE businesses (
    id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    timezone TEXT DEFAULT 'UTC',
    operating_hours TEXT DEFAULT '{}'
);

-- Properties
CREATE TABLE properties (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL,
    title TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT CHECK (category IN ('House', 'Apartment', 'Commercial'))
);

-- Agents
CREATE TABLE agents (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL,
    name TEXT NOT NULL,
    voice TEXT NOT NULL,
    interpretation_level TEXT DEFAULT 'medium'
);
```

---

## Conclusion & Deployment Checklist

1. **Wrangler Bindings**: Bind the SQLite `DB` D1 resource to your wrangler worker context.
2. **Environment Secrets**: Populate secret keys (`OPENAI_API_KEY`, `STRIPE_SECRET_KEY`) using wrangler secrets.
3. **Trigger Build**: Commit and push changes to trigger Cloudflare Pages automatic builds.
