#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function setupEMR() {
  console.log('🏥 Setting up EMR System...');

  try {
    // 1. Generate Prisma client
    console.log('📦 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });

    // 2. Run database migrations
    console.log('🗄️ Running database migrations...');
    execSync('npx prisma db push', { stdio: 'inherit' });

    // 3. Create necessary directories
    console.log('📁 Creating directories...');
    const dirs = [
      'public/uploads/medical-records',
      'public/uploads/dicom',
      'public/uploads/ocr',
      'public/uploads/consent-forms',
      'logs',
      'temp'
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
      }
    });

    // 4. Create environment file template
    console.log('⚙️ Creating environment template...');
    const envTemplate = `# Database
DATABASE_URL="postgresql://username:password@localhost:5432/emr_db"

# AWS Configuration
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=emr-storage

# Azure Configuration
AZURE_STORAGE_CONNECTION_STRING=your_connection_string
AZURE_STORAGE_CONTAINER=emr-files

# OpenAI Configuration
OPENAI_API_KEY=your_openai_key

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password

# Security
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key

# PACS Configuration
PACS_URL=http://localhost:8042
PACS_USERNAME=orthanc
PACS_PASSWORD=orthanc

# FHIR Configuration
FHIR_BASE_URL=http://localhost:8080/fhir
FHIR_CLIENT_ID=your_client_id
FHIR_CLIENT_SECRET=your_client_secret

# Logging
LOG_LEVEL=info
LOG_FILE=logs/emr.log

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100
`;

    if (!fs.existsSync('.env.example')) {
      fs.writeFileSync('.env.example', envTemplate);
      console.log('✅ Created .env.example template');
    }

    // 5. Create configuration files
    console.log('📋 Creating configuration files...');
    
    // FHIR Configuration
    const fhirConfig = {
      baseUrl: process.env.FHIR_BASE_URL || 'http://localhost:8080/fhir',
      resources: {
        Patient: 'Patient',
        Observation: 'Observation',
        Condition: 'Condition',
        ImagingStudy: 'ImagingStudy',
        Procedure: 'Procedure',
        MedicationRequest: 'MedicationRequest'
      },
      extensions: {
        oncologyCase: 'http://ecuretrip.com/fhir/extensions/oncology-case',
        tumorBoard: 'http://ecuretrip.com/fhir/extensions/tumor-board'
      }
    };

    fs.writeFileSync('config/fhir.json', JSON.stringify(fhirConfig, null, 2));

    // PACS Configuration
    const pacsConfig = {
      url: process.env.PACS_URL || 'http://localhost:8042',
      username: process.env.PACS_USERNAME || 'orthanc',
      password: process.env.PACS_PASSWORD || 'orthanc',
      wadoUrl: '/wado',
      qidoUrl: '/qido',
      stowUrl: '/stow'
    };

    fs.writeFileSync('config/pacs.json', JSON.stringify(pacsConfig, null, 2));

    // OCR Configuration
    const ocrConfig = {
      providers: {
        tesseract: {
          enabled: true,
          language: 'eng',
          config: '--oem 3 --psm 6'
        },
        azure: {
          enabled: false,
          endpoint: process.env.AZURE_FORM_RECOGNIZER_ENDPOINT,
          key: process.env.AZURE_FORM_RECOGNIZER_KEY
        }
      },
      supportedFormats: ['pdf', 'jpg', 'jpeg', 'png', 'tiff'],
      outputFormats: ['json', 'text']
    };

    fs.writeFileSync('config/ocr.json', JSON.stringify(ocrConfig, null, 2));

    // NLP Configuration
    const nlpConfig = {
      providers: {
        openai: {
          enabled: true,
          model: 'gpt-4',
          maxTokens: 2000
        },
        natural: {
          enabled: true,
          language: 'en'
        }
      },
      entities: {
        conditions: ['cancer', 'tumor', 'malignancy', 'metastasis'],
        procedures: ['surgery', 'chemotherapy', 'radiation', 'biopsy'],
        medications: ['drug', 'medication', 'prescription'],
        measurements: ['size', 'volume', 'stage', 'grade']
      }
    };

    fs.writeFileSync('config/nlp.json', JSON.stringify(nlpConfig, null, 2));

    console.log('✅ EMR setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Copy .env.example to .env and fill in your credentials');
    console.log('2. Run: npm run emr:seed to populate master data');
    console.log('3. Run: npm run pacs:setup to configure PACS');
    console.log('4. Start the development server: npm run dev');

  } catch (error) {
    console.error('❌ EMR setup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupEMR();
