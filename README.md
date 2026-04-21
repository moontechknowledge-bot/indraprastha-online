# Indraprastha Online - Bharat Ka Local Bazaar

A production-ready business listing platform connecting local buyers with trusted local businesses across India.

## Tech Stack
- **Frontend**: React, Vite, TypeScript, TailwindCSS, Framer Motion
- **Backend**: Netlify Serverless Functions
- **Database**: Neon PostgreSQL

## Features
- Mobile-first responsive design
- Horizontal scrollable category bar with 22+ categories
- Tiranga gradient scrolling marquee for announcements
- 6-slide auto-playing hero carousel
- Direct Call and WhatsApp order integration
- Prime Showroom and Verified Badge system
- Seller onboarding and pricing plans

## Setup Instructions

### 1. Database Setup
1. Create a project on [Neon.tech](https://neon.tech).
2. Run the SQL commands in `schema.sql` using the Neon SQL Editor to create tables and seed categories.

### 2. Environment Variables
Create a `.env` file or set environment variables in your deployment platform:
```env
DATABASE_URL=your_neon_connection_string
```

### 3. Local Development
```bash
npm install
npm run dev
```

### 4. Deployment (Netlify)
1. Connect your repository to Netlify.
2. Set the `DATABASE_URL` environment variable in Netlify Site Settings.
3. The `netlify.toml` file handles the build and function routing.

## Mobile First Best Practices
- Touch-friendly buttons (min 44px)
- Horizontal swipe for categories
- Optimized image loading
- Sticky header for quick navigation
- Direct action buttons for conversion
