# 🏥 EMR System - Comprehensive Healthcare Management Platform

## Overview

This is a comprehensive Electronic Medical Record (EMR) system built with Next.js 14, TypeScript, and PostgreSQL. The system is specifically designed for oncology case management with FHIR compliance, PACS integration, and advanced document processing capabilities.

## 🚀 Features Implemented

### Core EMR Functionality
- ✅ **Oncology Case Management** - Complete workflow from intake to completion
- ✅ **Patient Management** - Comprehensive patient records and history
- ✅ **Doctor Management** - Capability profiles and specializations
- ✅ **Coordinator Management** - Case assignment and tracking
- ✅ **FHIR Compliance** - Healthcare data standards integration
- ✅ **Audit Logging** - Complete activity tracking and security
- ✅ **Role-based Access Control** - Patient, Doctor, Coordinator, Admin roles

### Advanced Features
- ✅ **Document Processing** - OCR and NLP for medical documents
- ✅ **Milestone Tracking** - Payment and treatment milestone management
- ✅ **Tumor Board Reviews** - Multi-disciplinary case reviews
- ✅ **Real-time Notifications** - Status updates and alerts
- ✅ **Search & Filtering** - Advanced case and patient search
- ✅ **Dashboard Analytics** - Comprehensive reporting and metrics

### Security & Compliance
- ✅ **Data Encryption** - Secure storage and transmission
- ✅ **Session Management** - Secure user sessions
- ✅ **Audit Trails** - Complete activity logging
- ✅ **Access Controls** - Role-based permissions
- ✅ **HIPAA Compliance** - Healthcare data protection

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT with bcrypt
- **File Processing**: Tesseract.js (OCR), Natural (NLP)
- **AI Integration**: OpenAI GPT-4 for medical entity extraction
- **Real-time**: Socket.io for live updates

### Database Schema
```
Users (Patients, Doctors, Coordinators, Admins)
├── Oncology Cases
│   ├── Case Attachments
│   ├── Case Milestones
│   └── Tumor Board Reviews
├── FHIR Resources
├── DICOM Studies
│   └── DICOM Images
├── Document Processing
├── Audit Logs
└── Security Events
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone and Install Dependencies**
```bash
git clone <repository-url>
cd new_website
npm install --legacy-peer-deps
```

2. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your database and API credentials
```

3. **Database Setup**
```bash
npm run emr:setup
npm run emr:seed
```

4. **Start Development Server**
```bash
npm run dev
```

### Access the System

Visit `http://localhost:3000/emr/dashboard` to access the EMR system.

**Default Users:**
- **Admin**: admin@ecuretrip.com / admin123
- **Coordinator**: coordinator@ecuretrip.com / coordinator123
- **Doctor**: dr.ahmed@ecuretrip.com / doctor123
- **Patient**: patient@example.com / patient123

## 📋 Sample Data

The system comes pre-loaded with:
- ✅ Sample oncology case (ONC-2024-001)
- ✅ Patient with complete medical history
- ✅ Doctor with capability profile
- ✅ FHIR resources and DICOM studies
- ✅ Milestones and tumor board reviews

## 🔧 API Endpoints

### Oncology Cases
- `GET /api/oncology-cases` - List all cases with filtering
- `POST /api/oncology-cases` - Create new case
- `GET /api/oncology-cases/[id]` - Get specific case
- `PUT /api/oncology-cases/[id]` - Update case
- `DELETE /api/oncology-cases/[id]` - Delete case

### FHIR Resources
- `GET /api/fhir/resources` - List FHIR resources
- `POST /api/fhir/resources` - Create FHIR resource
- `GET /api/fhir/patient/[patientId]` - Get patient FHIR bundle

### Document Processing
- `POST /api/ocr/process` - Process documents with OCR/NLP
- `GET /api/ocr/processing/[id]` - Get processing status

## 🎯 Key Workflows

### 1. Case Intake Process
1. Patient submits case through portal
2. Coordinator reviews and assigns priority
3. Doctor assigned based on capability profile
4. Initial consultation scheduled
5. Diagnostic workup initiated

### 2. Treatment Planning
1. Tumor board review conducted
2. Treatment plan approved
3. Milestones created with payment schedule
4. Patient consent obtained
5. Treatment initiated

### 3. Document Processing
1. Medical documents uploaded
2. OCR extracts text from images/PDFs
3. NLP identifies medical entities
4. Data mapped to FHIR resources
5. Human validation and approval

## 🔒 Security Features

### Data Protection
- **Encryption**: All sensitive data encrypted at rest and in transit
- **Access Control**: Role-based permissions with fine-grained controls
- **Audit Logging**: Complete activity tracking for compliance
- **Session Management**: Secure session handling with timeout
- **Input Validation**: Comprehensive input sanitization

### Compliance
- **HIPAA**: Healthcare data protection standards
- **FHIR**: Healthcare data exchange standards
- **GDPR**: Data privacy regulations
- **Audit Trails**: Complete activity logging

## 📊 Analytics & Reporting

### Dashboard Metrics
- Total cases and active cases
- Revenue tracking and projections
- Doctor workload and availability
- Patient satisfaction scores
- Treatment outcome analytics

### Custom Reports
- Case completion rates
- Treatment effectiveness
- Financial performance
- Quality metrics
- Compliance reports

## 🔧 Configuration

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/emr_db"

# OpenAI
OPENAI_API_KEY=your_openai_key

# Security
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
```

### Configuration Files
- `config/fhir.json` - FHIR resource configuration
- `config/pacs.json` - PACS system settings
- `config/ocr.json` - OCR processing settings
- `config/nlp.json` - NLP entity extraction settings

## 🚀 Deployment

### Production Setup
1. **Database**: Set up PostgreSQL with proper security
2. **Environment**: Configure all environment variables
3. **SSL**: Enable HTTPS with valid certificates
4. **Backup**: Set up automated database backups
5. **Monitoring**: Configure application monitoring

### Docker Deployment
```bash
docker build -t emr-system .
docker run -p 3000:3000 emr-system
```

## 🔍 Testing

### Test Data
The system includes comprehensive test data:
- Multiple oncology cases with different statuses
- Various tumor types and treatment plans
- Complete patient and doctor profiles
- Sample documents for OCR testing

### API Testing
```bash
# Test oncology cases API
curl http://localhost:3000/api/oncology-cases

# Test FHIR resources
curl http://localhost:3000/api/fhir/resources

# Test document processing
curl -X POST http://localhost:3000/api/ocr/process \
  -H "Content-Type: application/json" \
  -d '{"documentId": "test", "documentType": "medical_record", "fileUrl": "/test.pdf"}'
```

## 📈 Performance

### Optimization Features
- **Database Indexing**: Optimized queries for large datasets
- **Caching**: Redis integration for improved performance
- **CDN**: Static asset delivery optimization
- **Compression**: Gzip compression for API responses
- **Pagination**: Efficient data loading for large datasets

### Scalability
- **Horizontal Scaling**: Stateless application design
- **Database Sharding**: Support for multiple database instances
- **Load Balancing**: Ready for load balancer deployment
- **Microservices**: Modular architecture for service separation

## 🤝 Contributing

### Development Guidelines
1. Follow TypeScript best practices
2. Write comprehensive tests
3. Document all API endpoints
4. Follow security best practices
5. Maintain FHIR compliance

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks

## 📞 Support

### Documentation
- API Documentation: `/api/docs`
- User Guide: `/docs/user-guide`
- Developer Guide: `/docs/developer-guide`
- Deployment Guide: `/docs/deployment`

### Contact
- **Technical Support**: tech@ecuretrip.com
- **Medical Support**: medical@ecuretrip.com
- **Security Issues**: security@ecuretrip.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Acknowledgments

- **FHIR Community** for healthcare data standards
- **OpenAI** for advanced NLP capabilities
- **Tesseract.js** for OCR functionality
- **Prisma** for database management
- **Next.js** for the excellent framework

---

**Built with ❤️ for better healthcare management**
