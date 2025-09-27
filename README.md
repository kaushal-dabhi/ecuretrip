# eCureTrip Medical Tourism Platform

A comprehensive medical tourism platform connecting patients with doctors and hospitals in India.

## Features

- **Patient Portal**: Personalized medical records, history, and teleconsultation
- **Doctor Portal**: Case management, appointments, and patient communication
- **Hospital Directory**: Real hospital data with specialties and contact information
- **Treatment Packages**: Dynamic treatment information with pricing
- **Authentication**: Secure login/registration with role-based access
- **File Upload**: Medical document upload and management
- **Real-time Chat**: Patient-doctor communication system

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Forms**: React Hook Form with validation

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:e2e` - Run end-to-end tests

## Project Structure

- `app/` - Next.js app router pages
- `components/` - Reusable React components
- `lib/` - Utility functions and configurations
- `public/` - Static assets
- `styles/` - Global CSS styles
- `types/` - TypeScript type definitions

## Key Pages

- `/` - Homepage with hero, specialties, and featured content
- `/hospitals` - Hospital directory with real data
- `/doctors` - Doctor listings and profiles
- `/treatments` - Treatment packages and details
- `/patient/dashboard` - Patient portal
- `/doctor/dashboard` - Doctor portal
- `/intake` - Medical intake form
- `/signin` - Authentication page

## Database

The project uses Supabase with the following main tables:
- `profiles` - User profiles (patients, doctors, admins)
- `treatments` - Treatment packages and information
- `hospitals` - Hospital data and specialties
- `cases` - Medical cases and consultations
- `quotes` - Treatment quotes and pricing

## Design System

- **Colors**: Primary (#2A4049), Secondary (#ADC8A6), Accent (#FECA58)
- **Typography**: Custom font classes with consistent sizing
- **Components**: Reusable UI components with consistent styling
- **Layout**: Responsive design with mobile-first approach

## Development

This is a localhost-only development project. All features are fully functional for local development and testing.

## License

MIT License
