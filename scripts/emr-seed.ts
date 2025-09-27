#!/usr/bin/env tsx

import { PrismaClient, UserRole, OncologyCaseStatus, CasePriority, ExperienceLevel } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedEMR() {
  console.log('🌱 Seeding EMR master data...');

  try {
    // 1. Create admin user
    console.log('👤 Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@ecuretrip.com' },
      update: {},
      create: {
        email: 'admin@ecuretrip.com',
        password: adminPassword,
        firstName: 'System',
        lastName: 'Administrator',
        role: UserRole.ADMIN,
        phone: '+971501234567',
        country: 'UAE',
        city: 'Dubai',
        language: ['en', 'ar']
      }
    });

    await prisma.admin.upsert({
      where: { userId: admin.id },
      update: {},
      create: {
        userId: admin.id,
        permissions: ['manage_users', 'manage_cases', 'view_analytics', 'manage_system'],
        department: 'IT'
      }
    });

    // 2. Create coordinator users
    console.log('👥 Creating coordinators...');
    const coordinatorPassword = await bcrypt.hash('coordinator123', 12);
    const coordinator = await prisma.user.upsert({
      where: { email: 'coordinator@ecuretrip.com' },
      update: {},
      create: {
        email: 'coordinator@ecuretrip.com',
        password: coordinatorPassword,
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: UserRole.COORDINATOR,
        phone: '+971502345678',
        country: 'UAE',
        city: 'Dubai',
        language: ['en', 'ar', 'fr']
      }
    });

    await prisma.coordinator.upsert({
      where: { userId: coordinator.id },
      update: {},
      create: {
        userId: coordinator.id,
        department: 'Oncology'
      }
    });

    // 3. Create doctor users with capability profiles
    console.log('👨‍⚕️ Creating doctors...');
    const doctorPassword = await bcrypt.hash('doctor123', 12);
    
    const oncologyDoctor = await prisma.user.upsert({
      where: { email: 'dr.ahmed@ecuretrip.com' },
      update: {},
      create: {
        email: 'dr.ahmed@ecuretrip.com',
        password: doctorPassword,
        firstName: 'Ahmed',
        lastName: 'Al-Rashid',
        role: UserRole.DOCTOR,
        phone: '+971503456789',
        country: 'UAE',
        city: 'Dubai',
        language: ['en', 'ar']
      }
    });

    const doctor = await prisma.doctor.upsert({
      where: { userId: oncologyDoctor.id },
      update: {},
      create: {
        userId: oncologyDoctor.id,
        specialty: 'Oncology',
        subSpecialty: ['Medical Oncology', 'Surgical Oncology'],
        experience: '15 years',
        education: {
          degree: 'MD',
          university: 'King Saud University',
          year: 2008,
          residency: 'Oncology',
          fellowship: 'Medical Oncology'
        },
        certifications: ['Board Certified in Medical Oncology', 'Fellowship in Surgical Oncology'],
        awards: ['Best Oncologist 2023', 'Excellence in Cancer Care'],
        bio: 'Leading oncologist specializing in breast cancer, lung cancer, and gastrointestinal malignancies.',
        hospital: 'Dubai Medical Center',
        practiceType: 'Hospital-based',
        consultationFees: {
          initial: 500,
          followUp: 300,
          secondOpinion: 800
        },
        availability: {
          monday: { morning: true, afternoon: true },
          tuesday: { morning: true, afternoon: true },
          wednesday: { morning: true, afternoon: false },
          thursday: { morning: true, afternoon: true },
          friday: { morning: true, afternoon: false }
        },
        acceptedInsurance: ['Dubai Health Authority', 'Private Insurance'],
        languages: ['en', 'ar'],
        medicalLicense: '/uploads/licenses/dr_ahmed_license.pdf',
        medicalDegree: '/uploads/degrees/dr_ahmed_degree.pdf'
      }
    });

    // Create capability profile for the doctor
    await prisma.doctorCapabilityProfile.upsert({
      where: { doctorId: doctor.id },
      update: {},
      create: {
        doctorId: doctor.id,
        tumorTypes: ['Breast Cancer', 'Lung Cancer', 'Colorectal Cancer', 'Prostate Cancer', 'Ovarian Cancer'],
        modalities: ['Surgery', 'Chemotherapy', 'Radiation Therapy', 'Targeted Therapy', 'Immunotherapy'],
        experienceLevel: ExperienceLevel.EXPERT,
        certifications: ['Board Certified Medical Oncologist', 'Fellowship in Surgical Oncology'],
        languages: ['en', 'ar'],
        availability: {
          monday: { morning: true, afternoon: true },
          tuesday: { morning: true, afternoon: true },
          wednesday: { morning: true, afternoon: false },
          thursday: { morning: true, afternoon: true },
          friday: { morning: true, afternoon: false }
        },
        specializations: ['Breast Cancer Surgery', 'Lung Cancer Treatment', 'Gastrointestinal Oncology']
      }
    });

    // 4. Create sample patient
    console.log('👤 Creating sample patient...');
    const patientPassword = await bcrypt.hash('patient123', 12);
    const patient = await prisma.user.upsert({
      where: { email: 'patient@example.com' },
      update: {},
      create: {
        email: 'patient@example.com',
        password: patientPassword,
        firstName: 'Fatima',
        lastName: 'Hassan',
        role: UserRole.PATIENT,
        phone: '+971504567890',
        country: 'Nigeria',
        city: 'Lagos',
        language: ['en', 'ar']
      }
    });

    await prisma.patient.upsert({
      where: { userId: patient.id },
      update: {},
      create: {
        userId: patient.id,
        dateOfBirth: new Date('1985-03-15'),
        gender: 'Female',
        bloodGroup: 'O+',
        height: '165cm',
        weight: '60kg',
        address: {
          street: '123 Main Street',
          city: 'Lagos',
          state: 'Lagos State',
          country: 'Nigeria',
          postalCode: '100001'
        },
        allergies: ['Penicillin'],
        medicalHistory: ['Hypertension', 'Diabetes Type 2'],
        currentMedications: ['Metformin', 'Lisinopril'],
        emergencyContact: {
          name: 'Ahmed Hassan',
          relationship: 'Spouse',
          phone: '+2348012345678',
          email: 'ahmed@example.com'
        },
        insurance: {
          provider: 'Nigerian Health Insurance',
          policyNumber: 'NHI123456',
          expiryDate: '2024-12-31'
        },
        passportNumber: 'A12345678',
        visaStatus: 'Tourist Visa',
        preferredLanguage: 'English',
        consultationType: ['Teleconsultation', 'In-person']
      }
    });

    // 5. Create sample oncology case
    console.log('📋 Creating sample oncology case...');
    const oncologyCase = await prisma.oncologyCase.create({
      data: {
        patientId: (await prisma.patient.findFirst({ where: { userId: patient.id } }))!.id,
        doctorId: doctor.id,
        coordinatorId: (await prisma.coordinator.findFirst({ where: { userId: coordinator.id } }))!.id,
        caseNumber: 'ONC-2024-001',
        status: OncologyCaseStatus.INTAKE,
        priority: CasePriority.HIGH,
        tumorType: 'Breast Cancer',
        tumorLocation: 'Right Breast',
        stage: 'Stage IIA',
        diagnosis: 'Invasive ductal carcinoma of the right breast',
        treatmentPlan: 'Neoadjuvant chemotherapy followed by surgery and adjuvant therapy',
        estimatedCost: 25000.00,
        currency: 'USD',
        intakeDate: new Date(),
        targetCompletionDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        notes: 'Patient presents with palpable mass in right breast. Biopsy confirmed invasive ductal carcinoma.'
      }
    });

    // 6. Create case milestones
    console.log('📅 Creating case milestones...');
    const milestones = [
      {
        title: 'Initial Consultation',
        description: 'Comprehensive evaluation and treatment planning',
        status: 'COMPLETED' as const,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        completedDate: new Date(),
        amount: 500.00
      },
      {
        title: 'Diagnostic Workup',
        description: 'Complete staging and diagnostic imaging',
        status: 'IN_PROGRESS' as const,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        amount: 2000.00
      },
      {
        title: 'Tumor Board Review',
        description: 'Multidisciplinary team review',
        status: 'PENDING' as const,
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        amount: 1000.00
      },
      {
        title: 'Treatment Initiation',
        description: 'Begin chemotherapy treatment',
        status: 'PENDING' as const,
        dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        amount: 5000.00
      }
    ];

    for (const milestone of milestones) {
      await prisma.caseMilestone.create({
        data: {
          caseId: oncologyCase.id,
          ...milestone
        }
      });
    }

    // 7. Create tumor board review
    console.log('👥 Creating tumor board review...');
    await prisma.tumorBoardReview.create({
      data: {
        caseId: oncologyCase.id,
        reviewerId: doctor.id,
        reviewerName: 'Dr. Ahmed Al-Rashid',
        reviewDate: new Date(),
        recommendations: 'Proceed with neoadjuvant chemotherapy followed by surgery. Consider genetic testing.',
        approved: true,
        notes: 'Case reviewed and approved for treatment plan.'
      }
    });

    // 8. Create FHIR resources
    console.log('🏥 Creating FHIR resources...');
    const fhirPatient = {
      resourceType: 'Patient',
      id: patient.id,
      identifier: [
        {
          system: 'http://ecuretrip.com/patient',
          value: patient.id
        }
      ],
      name: [
        {
          use: 'official',
          family: 'Hassan',
          given: ['Fatima']
        }
      ],
      gender: 'female',
      birthDate: '1985-03-15',
      address: [
        {
          use: 'home',
          type: 'physical',
          text: '123 Main Street, Lagos, Nigeria',
          city: 'Lagos',
          state: 'Lagos State',
          country: 'Nigeria'
        }
      ],
      telecom: [
        {
          system: 'phone',
          value: '+971504567890',
          use: 'mobile'
        },
        {
          system: 'email',
          value: 'patient@example.com',
          use: 'home'
        }
      ]
    };

    await prisma.fHIRResource.create({
      data: {
        resourceType: 'Patient',
        resourceId: patient.id,
        patientId: (await prisma.patient.findFirst({ where: { userId: patient.id } }))!.id,
        data: fhirPatient,
        version: 1
      }
    });

    // 9. Create DICOM study
    console.log('🖼️ Creating DICOM study...');
    const dicomStudy = await prisma.dICOMStudy.create({
      data: {
        studyInstanceUID: '1.2.826.0.1.3680043.2.1143.1.1.1.1',
        patientId: (await prisma.patient.findFirst({ where: { userId: patient.id } }))!.id,
        studyDate: new Date(),
        studyDescription: 'Breast MRI with contrast',
        modality: 'MR',
        bodyPart: 'Breast'
      }
    });

    await prisma.dICOMImage.create({
      data: {
        studyId: dicomStudy.id,
        sopInstanceUID: '1.2.826.0.1.3680043.2.1143.1.1.1.1.1',
        imageUrl: '/uploads/dicom/breast_mri_001.dcm',
        thumbnailUrl: '/uploads/dicom/breast_mri_001_thumb.jpg',
        metadata: {
          rows: 512,
          columns: 512,
          bitsAllocated: 16,
          photometricInterpretation: 'MONOCHROME2'
        }
      }
    });

    console.log('✅ EMR seeding completed successfully!');
    console.log('\n📋 Sample data created:');
    console.log('- Admin user: admin@ecuretrip.com / admin123');
    console.log('- Coordinator: coordinator@ecuretrip.com / coordinator123');
    console.log('- Doctor: dr.ahmed@ecuretrip.com / doctor123');
    console.log('- Patient: patient@example.com / patient123');
    console.log('- Sample oncology case: ONC-2024-001');

  } catch (error) {
    console.error('❌ EMR seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedEMR();
