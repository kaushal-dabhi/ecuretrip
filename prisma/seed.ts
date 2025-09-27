import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create hospitals
  const apolloHospital = await prisma.hospital.upsert({
    where: { id: 'hospital-1' },
    update: {},
    create: {
      id: 'hospital-1',
      name: 'Apollo Hospitals Enterprise Ltd.',
      description: 'Leading healthcare provider in India with world-class medical facilities and international patient services.',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      address: 'Greams Road, Chennai - 600006',
      phone: '+91-44-2829 0200',
      email: 'info@apollohospitals.com',
      website: 'https://www.apollohospitals.com',
      established: 1983,
      bedCount: 10000,
      accreditation: ['JCI', 'NABH', 'ISO 9001:2015'],
      specialties: ['Cardiology', 'Orthopedics', 'Neurology', 'Oncology', 'IVF', 'Transplant'],
      internationalPatientServices: true,
      languages: ['en', 'hi', 'ar', 'fr', 'de'],
      prayerRooms: true,
      halalMeals: true,
      femaleStaff: true,
      airportDistance: '12 km from Chennai International Airport',
      nearbyHotels: ['Taj Coromandel', 'The Leela Palace', 'ITC Grand Chola'],
      images: [
        'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800',
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800'
      ],
      rating: 4.8
    }
  })

  const fortisHospital = await prisma.hospital.upsert({
    where: { id: 'hospital-2' },
    update: {},
    create: {
      id: 'hospital-2',
      name: 'Fortis Memorial Research Institute',
      description: 'Multi-super specialty hospital providing advanced medical care with cutting-edge technology.',
      city: 'Gurgaon',
      state: 'Haryana',
      country: 'India',
      address: 'Sector 44, Gurgaon - 122002',
      phone: '+91-124-496 2222',
      email: 'info@fortishealthcare.com',
      website: 'https://www.fortishealthcare.com',
      established: 2001,
      bedCount: 1000,
      accreditation: ['JCI', 'NABH', 'ISO 14001'],
      specialties: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Pediatrics'],
      internationalPatientServices: true,
      languages: ['en', 'hi', 'ar'],
      prayerRooms: true,
      halalMeals: true,
      femaleStaff: true,
      airportDistance: '8 km from Indira Gandhi International Airport',
      nearbyHotels: ['The Oberoi', 'The Leela Ambience', 'Crowne Plaza'],
      images: [
        'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800',
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800'
      ],
      rating: 4.7
    }
  })

  const manipalHospital = await prisma.hospital.upsert({
    where: { id: 'hospital-3' },
    update: {},
    create: {
      id: 'hospital-3',
      name: 'Manipal Hospital',
      description: 'Comprehensive healthcare facility offering world-class medical services with a focus on patient care.',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      address: 'Airport Road, Bangalore - 560017',
      phone: '+91-80-2502 4444',
      email: 'info@manipalhospitals.com',
      website: 'https://www.manipalhospitals.com',
      established: 1991,
      bedCount: 600,
      accreditation: ['JCI', 'NABH', 'ISO 9001:2015'],
      specialties: ['Cardiology', 'Orthopedics', 'Neurology', 'Oncology', 'IVF'],
      internationalPatientServices: true,
      languages: ['en', 'hi', 'ar', 'kn'],
      prayerRooms: true,
      halalMeals: true,
      femaleStaff: true,
      airportDistance: '15 km from Kempegowda International Airport',
      nearbyHotels: ['The Oberoi', 'The Leela Palace', 'Taj West End'],
      images: [
        'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800',
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800'
      ],
      rating: 4.6
    }
  })

  console.log('🏥 Hospitals created:', { apolloHospital, fortisHospital, manipalHospital })

  // Create users and doctors
  const doctor1User = await prisma.user.upsert({
    where: { id: 'user-1' },
    update: {},
    create: {
      id: 'user-1',
      email: 'pritesh.shah@apollo.com',
      password: await hash('password123', 12),
      role: 'DOCTOR',
      firstName: 'Pritesh',
      lastName: 'Shah',
      phone: '+91-98765-43210',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
      city: 'Chennai',
      country: 'India',
      language: ['en', 'hi', 'gu']
    }
  })

  const doctor1 = await prisma.doctor.upsert({
    where: { id: 'doctor-1' },
    update: {},
    create: {
      id: 'doctor-1',
      userId: doctor1User.id,
      specialty: 'Cardiology',
      subSpecialty: ['Interventional Cardiology'],
      experience: '15',
      education: ['MBBS - AIIMS Delhi', 'MD - Cardiology - AIIMS Delhi', 'Fellowship - Interventional Cardiology - Cleveland Clinic'],
      certifications: ['FSCAI', 'FACC', 'FESC'],
      awards: ['Best Cardiologist Award 2022', 'Excellence in Interventional Cardiology 2021'],
      bio: 'Dr. Pritesh Shah is a renowned interventional cardiologist with over 15 years of experience in complex cardiac procedures. He has performed over 10,000 successful angioplasties and has expertise in structural heart interventions.',
      consultationFees: { initial: 2500, followUp: 1500 },
      hospital: 'Apollo Hospital Delhi',
      availability: { 
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        time: '09:00-17:00'
      },
      languages: ['en', 'hi', 'gu']
    }
  })

  const doctor2User = await prisma.user.upsert({
    where: { id: 'user-2' },
    update: {},
    create: {
      id: 'user-2',
      email: 'gaurav.tiwari@fortis.com',
      password: await hash('password123', 12),
      role: 'DOCTOR',
      firstName: 'Gaurav',
      lastName: 'Tiwari',
      phone: '+91-98765-43211',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
      city: 'Gurgaon',
      country: 'India',
      language: ['en', 'hi']
    }
  })

  const doctor2 = await prisma.doctor.upsert({
    where: { id: 'doctor-2' },
    update: {},
    create: {
      id: 'doctor-2',
      userId: doctor2User.id,
      specialty: 'Orthopedics',
      subSpecialty: ['Joint Replacement Surgery'],
      experience: '12',
      education: ['MBBS - Maulana Azad Medical College', 'MS - Orthopedics - AIIMS Delhi', 'Fellowship - Joint Replacement - Mayo Clinic'],
      certifications: ['FACS', 'FAAOS'],
      awards: ['Best Orthopedic Surgeon 2023', 'Excellence in Joint Replacement 2022'],
      bio: 'Dr. Gaurav Tiwari is a leading orthopedic surgeon specializing in joint replacement surgeries. He has successfully performed over 5,000 joint replacement procedures with excellent outcomes.',
      consultationFees: { initial: 2000, followUp: 1200 },
      hospital: 'Fortis Hospital Gurgaon',
      availability: {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        time: '10:00-18:00'
      },
      languages: ['en', 'hi']
    }
  })

  const doctor3User = await prisma.user.upsert({
    where: { id: 'user-3' },
    update: {},
    create: {
      id: 'user-3',
      email: 'priya.sharma@manipal.com',
      password: await hash('password123', 12),
      role: 'DOCTOR',
      firstName: 'Priya',
      lastName: 'Sharma',
      phone: '+91-98765-43212',
      avatar: 'https://images.unsplash.com/photo-1594824475544-3a0c1b0c0c0c?w=400',
      city: 'Bangalore',
      country: 'India',
      language: ['en', 'hi', 'kn']
    }
  })

  const doctor3 = await prisma.doctor.upsert({
    where: { id: 'doctor-3' },
    update: {},
    create: {
      id: 'doctor-3',
      userId: doctor3User.id,
      specialty: 'IVF & Reproductive Medicine',
      subSpecialty: ['Infertility Treatment'],
      experience: '10',
      education: ['MBBS - KMC Manipal', 'MD - Obstetrics & Gynecology - KMC Manipal', 'Fellowship - Reproductive Medicine - Cleveland Clinic'],
      certifications: ['FRCOG', 'FACOG'],
      awards: ['Best IVF Specialist 2023', 'Excellence in Reproductive Medicine 2022'],
      bio: 'Dr. Priya Sharma is a highly skilled reproductive medicine specialist with expertise in IVF, IUI, and fertility treatments. She has helped thousands of couples achieve their dream of parenthood.',
      consultationFees: { initial: 1800, followUp: 1000 },
      hospital: 'Manipal Hospital Bangalore',
      availability: {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        time: '09:00-16:00'
      },
      languages: ['en', 'hi', 'kn']
    }
  })

  console.log('👨‍⚕️ Doctors created:', { doctor1, doctor2, doctor3 })

  // Create treatments
  const treatment1 = await prisma.treatment.upsert({
    where: { id: 'treatment-1' },
    update: {},
    create: {
      id: 'treatment-1',
      name: 'Coronary Angioplasty',
      description: 'Minimally invasive procedure to open blocked coronary arteries using a balloon and stent.',
      specialty: 'Cardiology',
      subSpecialty: 'Interventional Cardiology',
      duration: '1-2 hours',
      recoveryTime: '1-2 weeks',
      successRate: 95.5,
      risks: ['Bleeding', 'Infection', 'Artery damage', 'Allergic reaction to contrast'],
      benefits: ['Improved blood flow', 'Reduced chest pain', 'Lower risk of heart attack', 'Quick recovery'],
      preProcedure: ['Blood tests', 'ECG', 'Echocardiogram', 'Fasting for 6-8 hours'],
      postProcedure: ['Bed rest for 24 hours', 'Regular medication', 'Follow-up appointments', 'Lifestyle modifications'],
      alternatives: ['Coronary bypass surgery', 'Medication therapy', 'Lifestyle changes'],
      basePrice: 150000,
      currency: 'INR',
      hospitalId: apolloHospital.id,
      doctorId: doctor1.id
    }
  })

  const treatment2 = await prisma.treatment.upsert({
    where: { id: 'treatment-2' },
    update: {},
    create: {
      id: 'treatment-2',
      name: 'Total Knee Replacement',
      description: 'Surgical procedure to replace a damaged knee joint with an artificial implant.',
      specialty: 'Orthopedics',
      subSpecialty: 'Joint Replacement Surgery',
      duration: '2-3 hours',
      recoveryTime: '6-12 weeks',
      successRate: 98.0,
      risks: ['Infection', 'Blood clots', 'Nerve damage', 'Implant loosening'],
      benefits: ['Pain relief', 'Improved mobility', 'Better quality of life', 'Long-term solution'],
      preProcedure: ['Physical examination', 'Blood tests', 'X-rays', 'Pre-operative assessment'],
      postProcedure: ['Physical therapy', 'Pain management', 'Gradual weight bearing', 'Follow-up care'],
      alternatives: ['Partial knee replacement', 'Arthroscopic surgery', 'Physical therapy'],
      basePrice: 350000,
      currency: 'INR',
      hospitalId: fortisHospital.id,
      doctorId: doctor2.id
    }
  })

  const treatment3 = await prisma.treatment.upsert({
    where: { id: 'treatment-3' },
    update: {},
    create: {
      id: 'treatment-3',
      name: 'IVF Treatment',
      description: 'In vitro fertilization procedure to help couples conceive through assisted reproductive technology.',
      specialty: 'IVF & Reproductive Medicine',
      subSpecialty: 'Infertility Treatment',
      duration: '2-3 weeks per cycle',
      recoveryTime: '1-2 weeks',
      successRate: 65.0,
      risks: ['Ovarian hyperstimulation', 'Multiple pregnancies', 'Ectopic pregnancy', 'Emotional stress'],
      benefits: ['High success rate', 'Personalized treatment', 'Advanced technology', 'Comprehensive care'],
      preProcedure: ['Fertility assessment', 'Hormone tests', 'Ultrasound', 'Lifestyle counseling'],
      postProcedure: ['Rest and relaxation', 'Hormone support', 'Pregnancy test', 'Follow-up care'],
      alternatives: ['IUI', 'Ovulation induction', 'Surgery for fertility issues'],
      basePrice: 120000,
      currency: 'INR',
      hospitalId: manipalHospital.id,
      doctorId: doctor3.id
    }
  })

  console.log('💊 Treatments created:', { treatment1, treatment2, treatment3 })

  // Create patient users
  const patient1User = await prisma.user.upsert({
    where: { id: 'user-4' },
    update: {},
    create: {
      id: 'user-4',
      email: 'kaushal.dabhi@example.com',
      password: await hash('password123', 12),
      role: 'PATIENT',
      firstName: 'Kaushal',
      lastName: 'Dabhi',
      phone: '+971-50-123-4567',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      city: 'Dubai',
      country: 'UAE',
      language: ['en', 'ar']
    }
  })

  const patient1 = await prisma.patient.upsert({
    where: { id: 'patient-1' },
    update: {},
    create: {
      id: 'patient-1',
      userId: patient1User.id,
      dateOfBirth: new Date('1985-03-15'),
      bloodGroup: 'O+',
      allergies: ['Penicillin'],
      medicalHistory: ['Hypertension', 'Diabetes Type 2'],
      emergencyContact: '+971-50-987-6543',
      passportNumber: 'A12345678',
      visaStatus: 'Tourist Visa',
      insurance: 'Dubai Health Insurance'
    }
  })

  const patient2User = await prisma.user.upsert({
    where: { id: 'user-5' },
    update: {},
    create: {
      id: 'user-5',
      email: 'suraj.chouhan@example.com',
      password: await hash('password123', 12),
      role: 'PATIENT',
      firstName: 'Suraj',
      lastName: 'Chouhan',
      phone: '+91-98765-43213',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      city: 'Mumbai',
      country: 'India',
      language: ['en', 'hi', 'mr']
    }
  })

  const patient2 = await prisma.patient.upsert({
    where: { id: 'patient-2' },
    update: {},
    create: {
      id: 'patient-2',
      userId: patient2User.id,
      dateOfBirth: new Date('1990-07-22'),
      bloodGroup: 'B+',
      allergies: [],
      medicalHistory: ['Asthma'],
      emergencyContact: '+91-98765-43214',
      passportNumber: 'Z87654321',
      visaStatus: 'Indian Citizen',
      insurance: 'Star Health Insurance'
    }
  })

  console.log('👥 Patients created:', { patient1, patient2 })

  // Create reviews
  const review1 = await prisma.review.upsert({
    where: { id: 'review-1' },
    update: {},
    create: {
      id: 'review-1',
      rating: 5,
      comment: 'Excellent doctor! Dr. Shah performed my angioplasty with great skill. The hospital staff was very caring and professional.',
      treatment: 'Coronary Angioplasty',
      patientId: patient1.id,
      doctorId: doctor1.id,
      verified: true
    }
  })

  const review2 = await prisma.review.upsert({
    where: { id: 'review-2' },
    update: {},
    create: {
      id: 'review-2',
      rating: 5,
      comment: 'Dr. Tiwari is an amazing orthopedic surgeon. My knee replacement surgery went perfectly and recovery was smooth.',
      treatment: 'Total Knee Replacement',
      patientId: patient2.id,
      doctorId: doctor2.id,
      verified: true
    }
  })

  console.log('⭐ Reviews created:', { review1, review2 })

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { id: 'user-6' },
    update: {},
    create: {
      id: 'user-6',
      email: 'admin@ecuretrip.com',
      password: await hash('admin123', 12),
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'User',
      phone: '+91-98765-43215',
      city: 'New Delhi',
      country: 'India',
      language: ['en', 'hi']
    }
  })

  const admin = await prisma.admin.upsert({
    where: { id: 'admin-1' },
    update: {},
    create: {
      id: 'admin-1',
      userId: adminUser.id,
      permissions: ['manage_doctors', 'manage_hospitals', 'manage_patients', 'view_reports'],
      department: 'Platform Management'
    }
  })

  console.log('👨‍💼 Admin created:', { admin })

  console.log('✅ Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
