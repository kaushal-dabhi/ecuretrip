# Healthcare EMR System

A production-ready Electronic Medical Record (EMR) system built with Next.js 14, featuring comprehensive healthcare workflows, secure authentication, and integration with healthcare standards.

## 🏥 Features

### Core Functionality
- **Multi-role Authentication**: Patient, Doctor, Coordinator, Hospital Admin, Platform Admin
- **FHIR Integration**: Full FHIR R4 support with typed resources
- **DICOM Viewer**: OHIF integration for medical imaging
- **Document Processing**: OCR/NLP pipeline for medical document extraction
- **Case Management**: Oncology case routing and tumor board review
- **Billing System**: Quote generation, payment processing, and webhook handling

### Security & Compliance
- **PHI Protection**: Automatic redaction of sensitive data in logs
- **Role-based Access Control**: Fine-grained permissions with scopes
- **Audit Logging**: Comprehensive activity tracking
- **HIPAA Compliance**: Security measures for healthcare data

### Technical Stack
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **State Management**: React Query, Zustand
- **Authentication**: NextAuth.js with Keycloak OIDC
- **API**: Typed HTTP clients with retry logic
- **Testing**: Vitest unit tests, Playwright E2E tests

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Keycloak server (for authentication)
- FHIR server (HAPI/Medplum/Aidbox)
- PACS server (Orthanc)
- Sidecar services (ingestion, matching, billing)

### Environment Setup

1. **Copy environment template**:
```bash
cp .env.local.example .env.local
```

2. **Configure environment variables**:
```env
# Keycloak OIDC Configuration
NEXT_PUBLIC_KEYCLOAK_URL=https://keycloak.example.com
NEXT_PUBLIC_KEYCLOAK_REALM=ecure
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=ecure-web
KEYCLOAK_CLIENT_SECRET=your_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# FHIR Server Configuration
NEXT_PUBLIC_BASE_FHIR_URL=https://api.example.com/fhir
NEXT_PUBLIC_BASE_PACS_URL=https://pacs.example.com/dicom-web
NEXT_PUBLIC_BASE_INGEST_URL=https://api.example.com/ingestion
NEXT_PUBLIC_BASE_MATCH_URL=https://api.example.com/matching
NEXT_PUBLIC_BASE_BILLING_URL=https://api.example.com/billing

# OHIF Viewer
NEXT_PUBLIC_OHIF_URL=https://viewer.example.com

# Feature Flags
NEXT_PUBLIC_ENABLE_UPLOAD=true
NEXT_PUBLIC_ENABLE_MATCHING=true
NEXT_PUBLIC_ENABLE_BILLING=true
```

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Run development server**:
```bash
npm run dev
```

3. **Run tests**:
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

## 📁 Project Structure

```
src/
├── config/           # Environment configuration
├── types/            # TypeScript type definitions
│   ├── fhir.ts      # FHIR R4 types
│   └── auth.ts      # Authentication types
├── lib/             # Core utilities
│   ├── auth.ts      # NextAuth configuration
│   ├── http.ts      # HTTP client with interceptors
│   ├── security.ts  # PHI redaction and security utils
│   └── api/         # Typed API clients
│       ├── fhir.client.ts
│       ├── pacs.client.ts
│       ├── ingestion.client.ts
│       ├── matching.client.ts
│       └── billing.client.ts
├── hooks/           # React Query hooks
│   ├── useAuth.ts   # Authentication hooks
│   └── useApi.ts    # API data fetching hooks
└── app/             # Next.js App Router
    ├── (patient)/   # Patient routes
    ├── (doctor)/    # Doctor routes
    ├── (admin)/     # Admin routes
    └── api/         # API routes
```

## 🔐 Authentication Flow

### Keycloak Setup
1. Create a new realm in Keycloak
2. Create a client with OIDC configuration
3. Configure roles: `role_patient`, `role_doctor`, `role_coordinator`, `role_hosp_admin`, `role_platform_admin`
4. Set up user roles and permissions

### Role-based Access
- **Patients**: Upload documents, view imaging, manage consents
- **Doctors**: Review cases, access imaging, participate in tumor boards
- **Coordinators**: Manage case flow, coordinate care
- **Hospital Admins**: Oversee operations, manage billing
- **Platform Admins**: Full system access

## 🏗️ API Integration

### FHIR Client
```typescript
import { createPatient, getPatient } from '@/lib/api/fhir.client';

// Create a patient
const patient = await createPatient({
  resourceType: 'Patient',
  name: [{ given: ['John'], family: 'Doe' }],
  birthDate: '1990-01-01',
  gender: 'male'
});

// Get patient by ID
const patientData = await getPatient('patient-123');
```

### Document Upload
```typescript
import { useDocumentUpload } from '@/hooks/useApi';

const uploadMutation = useDocumentUpload('case-123');
await uploadMutation.mutateAsync(file);
```

### Case Matching
```typescript
import { useMatchCase } from '@/hooks/useApi';

const matchMutation = useMatchCase();
const result = await matchMutation.mutateAsync({
  tumor: { type: 'breast', stage: 'II' },
  biomarkers: [{ name: 'ER', value: 'positive' }]
});
```

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

Tests cover:
- Security utilities (PHI redaction)
- File validation
- API client error handling
- Authentication logic

### E2E Tests
```bash
npm run test:e2e
```

Tests cover:
- Patient login and document upload
- Doctor case review workflow
- Admin billing process
- OHIF viewer integration
- Authentication and authorization

## 🔒 Security Features

### PHI Protection
- Automatic redaction of patient names, emails, phone numbers
- FHIR reference sanitization
- Secure logging without sensitive data

### Access Control
- Role-based route protection
- Scope-based feature access
- JWT token validation
- CSRF protection

### Data Validation
- Zod schemas for all API requests
- File upload validation
- Input sanitization

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
Ensure all production environment variables are set:
- Keycloak configuration
- API endpoints
- Security secrets
- Feature flags

### Health Checks
- `/api/health` - System health endpoint
- `/api/billing/webhook` - Webhook endpoint for payments

## 📚 API Documentation

### FHIR Resources
- `Patient` - Patient demographics
- `Condition` - Medical conditions
- `Observation` - Lab results and measurements
- `DiagnosticReport` - Imaging and lab reports
- `CarePlan` - Treatment plans
- `Consent` - Patient consents
- `Provenance` - Audit trail

### Sidecar Services
- **Ingestion Service**: Document upload and OCR processing
- **Matching Service**: Doctor case routing and tumor board
- **Billing Service**: Quote generation and payment processing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the test examples

## 🔄 Roadmap

- [ ] Advanced imaging features
- [ ] Mobile app integration
- [ ] AI-powered diagnosis assistance
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Integration with more PACS systems
- [ ] Real-time notifications
- [ ] Advanced workflow automation
