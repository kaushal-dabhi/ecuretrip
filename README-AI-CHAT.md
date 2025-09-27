# AI Chat-Assisted Patient Journey System

A production-ready AI chat system integrated with healthcare workflows, featuring stage-aware patient journeys, tool-driven interactions, and comprehensive medical case management.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (or compatible database)
- Environment variables configured

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the system:**
   - Main website: http://localhost:3000
   - Patient Dashboard: http://localhost:3000/emr/patient-dashboard
   - Doctor Dashboard: http://localhost:3000/emr/doctor-dashboard
   - AI Chat (Patient): http://localhost:3000/patient/cases/ONC-2024-001
   - AI Chat (Doctor): http://localhost:3000/doctor/cases/ONC-2024-001

## 🏗️ Architecture

### Core Components

#### 1. **Type System** (`src/types/`)
- `journey.ts` - Journey stages, chat messages, widgets
- `fhir.ts` - FHIR R4 resource types with Zod validation

#### 2. **API Clients** (`src/lib/api/`)
- `fhir.client.ts` - FHIR server interactions
- `pacs.client.ts` - PACS/DICOM integration
- `ingestion.client.ts` - Document upload processing
- `matching.client.ts` - Doctor/hospital matching
- `billing.client.ts` - Quote and payment management
- `scheduler.client.ts` - Appointment scheduling

#### 3. **UI Components** (`src/components/`)
- `JourneyBar.tsx` - Patient journey progress visualization
- `chat/ChatPanel.tsx` - Main chat interface
- `chat/ChatWidgets.tsx` - Rich message widgets
- `ui/*` - Reusable UI components

#### 4. **Hooks** (`src/hooks/`)
- `useChatOrchestrator.ts` - Chat state management
- `useDocumentUpload.ts` - File upload handling

#### 5. **Pages** (`src/app/`)
- `patient/case/[caseId]/page.tsx` - Patient case management
- `doctor/cases/[caseId]/page.tsx` - Doctor tumor board review
- `api/chat/route.ts` - Chat API endpoint

## 🔧 Key Features

### 🤖 AI Chat System
- **Stage-Aware Conversations**: Context-aware based on patient journey stage
- **Tool-Driven Workflows**: Upload → Extract → Match → Quote → Schedule
- **Rich Widgets**: Buttons, cards, tables, invoices, doctor matches
- **Red Flag Detection**: Automatic escalation for urgent medical situations

### 📊 Patient Journey Stages
1. **Inquiry** - Initial contact and information gathering
2. **Assessment** - Medical evaluation and case review
3. **Planning** - Treatment plan development
4. **Scheduled** - Appointments and logistics arranged
5. **In Treatment** - Active treatment phase
6. **Post Treatment** - Recovery and follow-up
7. **Completed** - Treatment journey completed

### 🔒 Security & Compliance
- **PHI Redaction**: Automatic redaction in error messages
- **Type Safety**: Strict TypeScript with Zod validation
- **Role-Based Access**: Patient, Doctor, Admin permissions
- **Audit Logging**: Provenance tracking for all clinical writes

### 🏥 Clinical Integration
- **FHIR R4**: Standard healthcare data exchange
- **PACS/DICOM**: Medical imaging integration
- **Document Processing**: AI-powered medical report analysis
- **Tumor Board**: Multi-disciplinary case review system

### 💰 Financial Management
- **Quote Generation**: Automated treatment cost estimates
- **Payment Processing**: Multiple payment methods
- **Invoice Tracking**: Complete billing lifecycle
- **Escrow Protection**: Secure milestone-based payments

## 🛠️ Development

### Environment Variables
```bash
# FHIR and Clinical Systems
NEXT_PUBLIC_BASE_FHIR_URL=https://fhir.example.com
NEXT_PUBLIC_BASE_PACS_URL=https://pacs.example.com
NEXT_PUBLIC_BASE_INGEST_URL=https://ingest.example.com
NEXT_PUBLIC_BASE_MATCH_URL=https://match.example.com
NEXT_PUBLIC_BASE_BILLING_URL=https://billing.example.com
NEXT_PUBLIC_BASE_SCHED_URL=https://scheduler.example.com
NEXT_PUBLIC_OHIF_URL=https://viewer.example.com

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
NEXT_PUBLIC_OIDC_ISSUER=https://keycloak.example.com
NEXT_PUBLIC_OIDC_CLIENT_ID=your-client-id

# AI and Processing
NEXT_PUBLIC_OPENAI_API_KEY=your-openai-key
NEXT_PUBLIC_AI_MODEL=gpt-4-turbo-preview

# Security
NEXT_PUBLIC_ENCRYPTION_KEY=your-encryption-key
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret

# Storage
NEXT_PUBLIC_S3_BUCKET=your-s3-bucket
NEXT_PUBLIC_S3_REGION=us-east-1

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

### Available Scripts
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests
npm run test:watch   # Run tests in watch mode

# Linting
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues

# Type checking
npm run type-check   # Run TypeScript compiler
```

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:coverage
```

## 📦 Deployment

### Vercel Deployment
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker Deployment
```bash
# Build image
docker build -t ai-chat-system .

# Run container
docker run -p 3000:3000 ai-chat-system
```

## 🔄 API Endpoints

### Chat API
- `POST /api/chat` - Process chat messages and actions

### FHIR API
- `GET /api/fhir/patients` - Get patient list
- `POST /api/fhir/patients` - Create patient
- `GET /api/fhir/patients/:id` - Get patient details
- `PUT /api/fhir/patients/:id` - Update patient

### PACS API
- `GET /api/pacs/studies` - Get imaging studies
- `GET /api/pacs/studies/:id` - Get study details
- `GET /api/pacs/studies/:id/viewer` - Get OHIF viewer URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Roadmap

- [ ] Real-time notifications
- [ ] Advanced AI models integration
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Integration with more EHR systems
