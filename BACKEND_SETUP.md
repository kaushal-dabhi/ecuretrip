# 🏗️ Backend Infrastructure Setup Guide

## 📋 **Overview**
This document outlines the complete backend infrastructure for the eCureTrip medical platform, including database setup, API routes, authentication, and deployment.

## 🗄️ **Database Setup**

### **1. Prisma Schema**
- **Location**: `prisma/schema.prisma`
- **Database**: PostgreSQL (recommended: Neon, Supabase, or Railway)
- **Features**:
  - User authentication & profiles
  - Patient & doctor data models
  - Appointments & consultations
  - Medical records & file management
  - Payment & escrow system
  - Reviews & ratings

### **2. Database Setup Steps**
```bash
# Install dependencies
npm install @prisma/client prisma

# Generate Prisma client
npx prisma generate

# Create database (if using local PostgreSQL)
npx prisma db push

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed
```

### **3. Environment Variables**
Create a `.env.local` file:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ecuretrip_db"

# JWT Secret (generate a strong secret)
JWT_SECRET="your-super-secret-jwt-key-here"

# File Upload
MAX_FILE_SIZE="10485760"
UPLOAD_DIR="public/uploads"

# Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Payment Gateway
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_key"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret"
```

## 🔐 **Authentication System**

### **1. JWT Implementation**
- **Token Storage**: HTTP-only cookies
- **Expiration**: 7 days
- **Refresh**: Automatic on protected routes
- **Security**: CSRF protection via SameSite cookies

### **2. Role-Based Access Control**
- **PATIENT**: Access to patient dashboard, appointments, medical records
- **DOCTOR**: Access to doctor dashboard, patient management, consultations
- **ADMIN**: System administration and user management

### **3. Protected Routes**
```typescript
// Middleware protection
const protectedRoutes = [
  '/dashboard',
  '/doctor/dashboard',
  '/onboarding',
  '/appointments',
  '/profile',
  '/medical-records'
]
```

## 🚀 **API Routes**

### **1. Authentication APIs**
- `POST /api/auth/register` - User registration with role selection
- `POST /api/auth/login` - User login with JWT token
- `POST /api/auth/logout` - User logout and token invalidation

### **2. User Management APIs**
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/me` - Get current user info

### **3. Appointment APIs**
- `GET /api/appointments` - List appointments (filtered by role)
- `POST /api/appointments` - Book new appointment
- `PUT /api/appointments/[id]` - Update appointment
- `DELETE /api/appointments/[id]` - Cancel appointment

### **4. File Upload APIs**
- `POST /api/upload` - Upload medical documents
- `GET /api/upload/[id]` - Get file information
- `DELETE /api/upload/[id]` - Delete uploaded file

### **5. Consultation APIs**
- `GET /api/consultations` - List consultations
- `POST /api/consultations` - Schedule consultation
- `PUT /api/consultations/[id]` - Update consultation status

## 📁 **File Management**

### **1. Upload System**
- **Supported Types**: PDF, Images, Word docs, Text files
- **Max Size**: 10MB per file
- **Storage**: Local filesystem (can be extended to S3/Cloudinary)
- **Security**: File type validation, size limits, user isolation

### **2. File Organization**
```
public/uploads/
├── {userId}/
│   ├── medical_record_123.pdf
│   ├── id_document_456.jpg
│   └── insurance_card_789.png
```

## 🔒 **Security Features**

### **1. Input Validation**
- **Zod Schemas**: Type-safe validation for all API inputs
- **Sanitization**: XSS protection, SQL injection prevention
- **Rate Limiting**: API request throttling (to be implemented)

### **2. Authentication Security**
- **Password Hashing**: bcrypt with salt rounds
- **JWT Security**: Secure token storage, expiration handling
- **CSRF Protection**: SameSite cookie attributes

### **3. Data Protection**
- **User Isolation**: Users can only access their own data
- **Role Verification**: Server-side role checking
- **Input Sanitization**: All user inputs validated and sanitized

## 📧 **Email System**

### **1. Notification Types**
- Appointment confirmations
- Reminders and updates
- Password reset links
- Welcome emails
- Consultation notifications

### **2. SMTP Configuration**
```typescript
// Example email service setup
const emailConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
}
```

## 💳 **Payment Integration**

### **1. Stripe Integration**
- **Payment Methods**: Credit cards, UPI, bank transfers
- **Escrow System**: Secure payment holding
- **Refund Handling**: Automated refund processing
- **Webhook Support**: Real-time payment updates

### **2. Payment Flow**
1. Patient books appointment
2. Payment processed via Stripe
3. Funds held in escrow
4. After consultation, payment released to doctor
5. Platform fee deducted automatically

## 🚀 **Deployment**

### **1. Production Environment**
```bash
# Build the application
npm run build

# Start production server
npm start

# Environment variables
NODE_ENV=production
DATABASE_URL="your-production-db-url"
JWT_SECRET="your-production-jwt-secret"
```

### **2. Database Hosting Options**
- **Neon**: Serverless PostgreSQL (recommended)
- **Supabase**: Open-source Firebase alternative
- **Railway**: Simple PostgreSQL hosting
- **AWS RDS**: Enterprise-grade database

### **3. File Storage Options**
- **Local**: For development and small deployments
- **AWS S3**: Scalable cloud storage
- **Cloudinary**: Image optimization and CDN
- **Supabase Storage**: Integrated with database

## 🧪 **Testing**

### **1. API Testing**
```bash
# Run API tests
npm run test:api

# Test specific endpoints
npm run test:auth
npm run test:appointments
```

### **2. Database Testing**
```bash
# Test database connections
npm run test:db

# Run integration tests
npm run test:integration
```

## 📊 **Monitoring & Logging**

### **1. Error Tracking**
- **Console Logging**: Development debugging
- **Error Boundaries**: React error handling
- **API Error Responses**: Structured error messages

### **2. Performance Monitoring**
- **Database Queries**: Query optimization
- **API Response Times**: Performance tracking
- **File Upload Metrics**: Upload success rates

## 🔧 **Development Commands**

```bash
# Database operations
npx prisma generate          # Generate Prisma client
npx prisma db push          # Push schema changes
npx prisma migrate dev      # Create and run migrations
npx prisma studio           # Open database GUI

# Development server
npm run dev                 # Start development server
npm run build              # Build for production
npm run start              # Start production server

# Testing
npm run test               # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Generate coverage report
```

## 🚨 **Important Notes**

1. **JWT Secret**: Always use a strong, unique secret in production
2. **Database Backups**: Regular backups for production databases
3. **File Security**: Implement virus scanning for uploaded files
4. **Rate Limiting**: Add API rate limiting for production
5. **HTTPS**: Always use HTTPS in production
6. **Environment Variables**: Never commit sensitive data to version control

## 📚 **Next Steps**

1. Set up production database
2. Configure email service
3. Integrate payment gateway
4. Set up file storage service
5. Implement monitoring and logging
6. Add comprehensive testing
7. Set up CI/CD pipeline
8. Configure production environment

---

**Need Help?** Check the API documentation or create an issue in the repository.
