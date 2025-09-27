export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualifications: string[];
  experience: number;
  languages: string[];
  hospital: string;
  city: string;
  rating: number;
  reviews: number;
  consultationFee: number;
  image: string;
  bio: string;
  accreditations: string[];
  successRate: number;
  availability: string[];
  education: string[];
  awards: string[];
  procedures: string[];
  consultationTypes: string[];
}

export interface Patient {
  id: string;
  name: string;
  country: string;
  treatments: string[];
  status: 'active' | 'completed' | 'consulting';
  lastVisit: string;
  image: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  medicalHistory: string[];
  upcomingAppointments: Appointment[];
  completedTreatments: CompletedTreatment[];
}

export interface Hospital {
  id: string;
  name: string;
  city: string;
  specialties: string[];
  accreditations: string[];
  rating: number;
  image: string;
  description: string;
  facilities: string[];
  address: string;
  phone: string;
  email: string;
  website: string;
  established: number;
  bedCount: number;
  internationalPatientServices: boolean;
  languages: string[];
  nearbyHotels: string[];
  airportDistance: string;
}

export interface Treatment {
  id: string;
  name: string;
  category: string;
  description: string;
  duration: string;
  cost: {
    min: number;
    max: number;
    currency: string;
  };
  hospitals: string[];
  doctors: string[];
  recoveryTime: string;
  successRate: number;
  risks: string[];
  benefits: string[];
  preProcedure: string[];
  postProcedure: string[];
  alternatives: string[];
}

export interface Review {
  id: string;
  patientName: string;
  patientCountry: string;
  rating: number;
  comment: string;
  date: string;
  treatment: string;
  doctorId?: string;
  hospitalId?: string;
  verified: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  hospitalId: string;
  date: string;
  time: string;
  type: 'consultation' | 'surgery' | 'follow-up';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
  cost: number;
}

export interface CompletedTreatment {
  id: string;
  patientId: string;
  treatmentName: string;
  doctorId: string;
  hospitalId: string;
  startDate: string;
  endDate: string;
  cost: number;
  outcome: string;
  followUpRequired: boolean;
  nextFollowUpDate?: string;
}

export interface Payment {
  id: string;
  patientId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: 'card' | 'bank_transfer' | 'upi' | 'paypal';
  date: string;
  description: string;
  transactionId?: string;
}

// Enhanced Dummy Data
export const doctors: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Pritesh Shah',
    specialty: 'Cardiothoracic Surgery',
    qualifications: ['MBBS', 'MS (Cardiothoracic)', 'FRCS (UK)', 'FACS', 'MCh (Cardiothoracic)'],
    experience: 18,
    languages: ['English', 'Hindi', 'Gujarati', 'Arabic'],
    hospital: 'Apollo Hospitals, Mumbai',
    city: 'Mumbai',
    rating: 4.9,
    reviews: 127,
    consultationFee: 2500,
    image: '/images/doctors/dr-pritesh-shah.jpg',
    bio: 'Leading cardiothoracic surgeon with expertise in complex heart surgeries, valve replacements, and minimally invasive procedures. Trained at prestigious institutions in the UK and US. Specializes in coronary artery bypass grafting, heart valve surgery, and aortic aneurysm repair.',
    accreditations: ['JCI Accredited', 'ISO 9001:2015', 'NABH', 'FRCS (UK)', 'FACS'],
    successRate: 98.5,
    availability: ['Mon-Fri: 9 AM - 5 PM', 'Sat: 9 AM - 1 PM'],
    education: ['MBBS - Grant Medical College, Mumbai', 'MS - KEM Hospital, Mumbai', 'FRCS - Royal College of Surgeons, UK'],
    awards: ['Best Cardiothoracic Surgeon 2023 - Maharashtra Medical Council', 'Excellence in Cardiac Surgery 2022'],
    procedures: ['CABG', 'Heart Valve Replacement', 'Aortic Aneurysm Repair', 'Minimally Invasive Heart Surgery'],
    consultationTypes: ['In-person', 'Video Consultation', 'Second Opinion']
  },
  {
    id: 'doc-2',
    name: 'Dr. Gaurav Tiwari',
    specialty: 'Orthopedic Surgery',
    qualifications: ['MBBS', 'MS (Orthopedics)', 'Fellowship in Joint Replacement', 'MCh (Orthopedics)', 'Fellowship in Sports Medicine'],
    experience: 15,
    languages: ['English', 'Hindi', 'Punjabi', 'Arabic'],
    hospital: 'Fortis Hospital, Delhi',
    city: 'Delhi',
    rating: 4.8,
    reviews: 89,
    consultationFee: 2000,
    image: '/images/doctors/dr-gaurav-tiwari.jpg',
    bio: 'Specialized in joint replacement surgeries, sports injuries, and arthroscopic procedures. Pioneer in robotic-assisted orthopedic surgeries in India. Expert in knee and hip replacements with over 2000 successful surgeries.',
    accreditations: ['JCI Accredited', 'NABH', 'ISO 14001', 'Fellowship in Joint Replacement'],
    successRate: 97.8,
    availability: ['Mon-Sat: 10 AM - 6 PM'],
    education: ['MBBS - AIIMS Delhi', 'MS - AIIMS Delhi', 'Fellowship - Hospital for Special Surgery, New York'],
    awards: ['Young Orthopedic Surgeon Award 2023', 'Excellence in Joint Replacement 2022'],
    procedures: ['Total Knee Replacement', 'Hip Replacement', 'Arthroscopic Surgery', 'Sports Injury Treatment'],
    consultationTypes: ['In-person', 'Video Consultation', 'Second Opinion']
  },
  {
    id: 'doc-3',
    name: 'Dr. Priya Sharma',
    specialty: 'IVF & Fertility',
    qualifications: ['MBBS', 'MD (Obstetrics & Gynecology)', 'Fellowship in Reproductive Medicine', 'Diploma in Ultrasound'],
    experience: 12,
    languages: ['English', 'Hindi', 'Marathi', 'Arabic'],
    hospital: 'Apollo Hospitals, Mumbai',
    city: 'Mumbai',
    rating: 4.7,
    reviews: 156,
    consultationFee: 1800,
    image: '/images/doctors/dr-priya-sharma.jpg',
    bio: 'Leading fertility specialist with expertise in IVF, IUI, and reproductive medicine. Successfully helped over 1000 couples achieve pregnancy. Specializes in complex fertility cases and recurrent pregnancy loss.',
    accreditations: ['JCI Accredited', 'NABH', 'Fellowship in Reproductive Medicine'],
    successRate: 65.2,
    availability: ['Mon-Fri: 8 AM - 4 PM', 'Sat: 8 AM - 12 PM'],
    education: ['MBBS - KEM Hospital, Mumbai', 'MD - KEM Hospital, Mumbai', 'Fellowship - Cleveland Clinic, USA'],
    awards: ['Best Fertility Specialist 2023 - Mumbai', 'Excellence in Reproductive Medicine 2022'],
    procedures: ['IVF', 'IUI', 'ICSI', 'Egg Freezing', 'Sperm Banking'],
    consultationTypes: ['In-person', 'Video Consultation', 'Second Opinion']
  },
  {
    id: 'doc-4',
    name: 'Dr. Rajesh Kumar',
    specialty: 'Neurology & Spine Surgery',
    qualifications: ['MBBS', 'MS (General Surgery)', 'MCh (Neurosurgery)', 'Fellowship in Spine Surgery'],
    experience: 20,
    languages: ['English', 'Hindi', 'Tamil', 'Arabic'],
    hospital: 'Fortis Hospital, Delhi',
    city: 'Delhi',
    rating: 4.9,
    reviews: 203,
    consultationFee: 3000,
    image: '/images/doctors/dr-rajesh-kumar.jpg',
    bio: 'Renowned neurosurgeon specializing in complex spine surgeries, brain tumors, and minimally invasive procedures. Pioneer in robotic spine surgery in India with over 3000 successful surgeries.',
    accreditations: ['JCI Accredited', 'NABH', 'MCh (Neurosurgery)', 'Fellowship in Spine Surgery'],
    successRate: 96.8,
    availability: ['Mon-Fri: 9 AM - 6 PM', 'Sat: 9 AM - 2 PM'],
    education: ['MBBS - AIIMS Delhi', 'MS - AIIMS Delhi', 'MCh - AIIMS Delhi', 'Fellowship - Mayo Clinic, USA'],
    awards: ['Best Neurosurgeon 2023 - Delhi', 'Excellence in Spine Surgery 2022'],
    procedures: ['Spine Fusion', 'Disc Replacement', 'Brain Tumor Surgery', 'Minimally Invasive Spine Surgery'],
    consultationTypes: ['In-person', 'Video Consultation', 'Second Opinion']
  }
];

export const patients: Patient[] = [
  {
    id: 'pat-1',
    name: 'Kaushal Dabhi',
    country: 'United Arab Emirates',
    treatments: ['Cardiac Consultation', 'Heart Surgery Planning'],
    status: 'active',
    lastVisit: '2024-01-15',
    image: '/images/patients/kaushal-dabhi.jpg',
    email: 'kaushal.dabhi@email.com',
    phone: '+971-50-123-4567',
    dateOfBirth: '1985-03-15',
    medicalHistory: ['Hypertension', 'Diabetes Type 2'],
    upcomingAppointments: [
      {
        id: 'apt-1',
        patientId: 'pat-1',
        doctorId: 'doc-1',
        hospitalId: 'hosp-1',
        date: '2024-02-20',
        time: '10:00 AM',
        type: 'consultation',
        status: 'scheduled',
        notes: 'Follow-up consultation for heart surgery planning',
        cost: 2500
      }
    ],
    completedTreatments: []
  },
  {
    id: 'pat-2',
    name: 'Suraj Chouhan',
    country: 'Saudi Arabia',
    treatments: ['Knee Replacement', 'Post-Surgery Rehabilitation'],
    status: 'completed',
    lastVisit: '2023-12-20',
    image: '/images/patients/suraj-chouhan.jpg',
    email: 'suraj.chouhan@email.com',
    phone: '+966-50-987-6543',
    dateOfBirth: '1978-07-22',
    medicalHistory: ['Osteoarthritis', 'Previous knee injury'],
    upcomingAppointments: [],
    completedTreatments: [
      {
        id: 'ct-1',
        patientId: 'pat-2',
        treatmentName: 'Total Knee Replacement',
        doctorId: 'doc-2',
        hospitalId: 'hosp-2',
        startDate: '2023-11-15',
        endDate: '2023-12-20',
        cost: 320000,
        outcome: 'Successful surgery with excellent recovery',
        followUpRequired: true,
        nextFollowUpDate: '2024-06-15'
      }
    ]
  },
  {
    id: 'pat-3',
    name: 'Rahul Bhardwaj',
    country: 'Nigeria',
    treatments: ['IVF Treatment', 'Fertility Consultation'],
    status: 'consulting',
    lastVisit: '2024-01-10',
    image: '/images/patients/rahul-bhardwaj.jpg',
    email: 'rahul.bhardwaj@email.com',
    phone: '+234-80-123-4567',
    dateOfBirth: '1982-11-08',
    medicalHistory: ['Infertility', 'Low sperm count'],
    upcomingAppointments: [
      {
        id: 'apt-2',
        patientId: 'pat-3',
        doctorId: 'doc-3',
        hospitalId: 'hosp-1',
        date: '2024-02-25',
        time: '2:00 PM',
        type: 'consultation',
        status: 'scheduled',
        notes: 'IVF treatment planning consultation',
        cost: 1800
      }
    ],
    completedTreatments: []
  },
  {
    id: 'pat-4',
    name: 'Sushil Sanu',
    country: 'Kenya',
    treatments: ['Spine Surgery', 'Neurological Consultation'],
    status: 'active',
    lastVisit: '2024-01-18',
    image: '/images/patients/sushil-sanu.jpg',
    email: 'sushil.sanu@email.com',
    phone: '+254-70-987-6543',
    dateOfBirth: '1975-05-12',
    medicalHistory: ['Chronic back pain', 'Herniated disc'],
    upcomingAppointments: [
      {
        id: 'apt-3',
        patientId: 'pat-4',
        doctorId: 'doc-4',
        hospitalId: 'hosp-2',
        date: '2024-03-05',
        time: '11:00 AM',
        type: 'surgery',
        status: 'confirmed',
        notes: 'Spine fusion surgery scheduled',
        cost: 450000
      }
    ],
    completedTreatments: []
  }
];

export const hospitals: Hospital[] = [
  {
    id: 'hosp-1',
    name: 'Apollo Hospitals, Mumbai',
    city: 'Mumbai',
    specialties: ['Cardiology', 'Cardiothoracic Surgery', 'Neurology', 'Oncology', 'IVF & Fertility', 'Orthopedics'],
    accreditations: ['JCI Accredited', 'NABH', 'ISO 9001:2015', 'ISO 14001:2015'],
    rating: 4.8,
    image: '/images/hospitals/apollo-mumbai.jpg',
    description: 'State-of-the-art multi-specialty hospital with world-class infrastructure and international patient services. Part of Apollo Hospitals Enterprise, India\'s largest healthcare provider.',
    facilities: ['ICU', 'Halal Kitchen', 'Prayer Rooms', 'International Patient Lounge', 'Translation Services', '24/7 Emergency', 'Advanced Imaging', 'Robotic Surgery'],
    address: 'Plot No. 13, Off Eastern Express Highway, Sanpada, Navi Mumbai, Maharashtra 400705',
    phone: '+91-22-7179-1000',
    email: 'info.mumbai@apollohospitals.com',
    website: 'https://www.apollohospitals.com/mumbai',
    established: 2002,
    bedCount: 500,
    internationalPatientServices: true,
    languages: ['English', 'Hindi', 'Arabic', 'French', 'German'],
    nearbyHotels: ['Taj Lands End', 'The Oberoi Mumbai', 'JW Marriott Mumbai'],
    airportDistance: '15 km from Mumbai International Airport'
  },
  {
    id: 'hosp-2',
    name: 'Fortis Hospital, Delhi',
    city: 'Delhi',
    specialties: ['Orthopedics', 'Joint Replacement', 'Sports Medicine', 'Rehabilitation', 'Neurology', 'Spine Surgery'],
    accreditations: ['JCI Accredited', 'NABH', 'ISO 14001', 'ISO 9001:2015'],
    rating: 4.7,
    image: '/images/hospitals/fortis-delhi.jpg',
    description: 'Premier orthopedic and sports medicine center with advanced robotic surgery capabilities. Known for excellence in joint replacement and sports injury treatment.',
    facilities: ['Robotic Surgery Center', 'Sports Medicine Clinic', 'Rehabilitation Center', 'International Patient Services', 'Advanced Imaging', '24/7 Emergency'],
    address: 'B-22, Sector 62, Noida, Uttar Pradesh 201301',
    phone: '+91-120-717-9100',
    email: 'info.delhi@fortishealthcare.com',
    website: 'https://www.fortishealthcare.com/delhi',
    established: 2001,
    bedCount: 350,
    internationalPatientServices: true,
    languages: ['English', 'Hindi', 'Punjabi', 'Arabic', 'French'],
    nearbyHotels: ['The Leela Ambience', 'Radisson Blu Noida', 'Holiday Inn Noida'],
    airportDistance: '25 km from Indira Gandhi International Airport'
  },
  {
    id: 'hosp-3',
    name: 'Manipal Hospital, Bangalore',
    city: 'Bangalore',
    specialties: ['Cardiology', 'Neurology', 'Oncology', 'Transplant', 'Pediatrics', 'Dermatology'],
    accreditations: ['JCI Accredited', 'NABH', 'ISO 9001:2015', 'ISO 14001:2015'],
    rating: 4.6,
    image: '/images/hospitals/manipal-bangalore.jpg',
    description: 'Leading multi-specialty hospital in Bangalore with expertise in complex medical procedures and organ transplants. Known for innovative treatment approaches.',
    facilities: ['Organ Transplant Center', 'Cancer Center', 'Pediatric ICU', 'International Patient Services', 'Advanced Research Lab', '24/7 Emergency'],
    address: '98, HAL Airport Road, Bangalore, Karnataka 560017',
    phone: '+91-80-2502-4444',
    email: 'info.bangalore@manipalhospitals.com',
    website: 'https://www.manipalhospitals.com/bangalore',
    established: 1991,
    bedCount: 600,
    internationalPatientServices: true,
    languages: ['English', 'Hindi', 'Kannada', 'Arabic', 'French'],
    nearbyHotels: ['The Oberoi Bangalore', 'Taj West End', 'The Leela Palace Bangalore'],
    airportDistance: '8 km from Kempegowda International Airport'
  }
];

export const treatments: Treatment[] = [
  {
    id: 'treat-1',
    name: 'Heart Bypass Surgery (CABG)',
    category: 'Cardiovascular',
    description: 'Coronary artery bypass grafting (CABG) to restore blood flow to the heart by creating new pathways around blocked arteries.',
    duration: '5-7 days hospital stay',
    cost: {
      min: 250000,
      max: 450000,
      currency: 'INR'
    },
    hospitals: ['hosp-1', 'hosp-3'],
    doctors: ['doc-1'],
    recoveryTime: '6-12 weeks',
    successRate: 98.5,
    risks: ['Bleeding', 'Infection', 'Stroke', 'Heart rhythm problems'],
    benefits: ['Improved blood flow to heart', 'Reduced chest pain', 'Better quality of life', 'Long-term survival'],
    preProcedure: ['Blood tests', 'ECG', 'Echocardiogram', 'Coronary angiogram'],
    postProcedure: ['ICU monitoring', 'Pain management', 'Physical therapy', 'Lifestyle modifications'],
    alternatives: ['Angioplasty', 'Medication therapy', 'Lifestyle changes']
  },
  {
    id: 'treat-2',
    name: 'Total Knee Replacement',
    category: 'Orthopedics',
    description: 'Surgical procedure to replace a damaged knee joint with an artificial implant to relieve pain and restore function.',
    duration: '3-5 days hospital stay',
    cost: {
      min: 180000,
      max: 320000,
      currency: 'INR'
    },
    hospitals: ['hosp-2'],
    doctors: ['doc-2'],
    recoveryTime: '3-6 months',
    successRate: 97.8,
    risks: ['Blood clots', 'Infection', 'Implant loosening', 'Nerve damage'],
    benefits: ['Pain relief', 'Improved mobility', 'Better quality of life', 'Long-lasting results'],
    preProcedure: ['Physical examination', 'X-rays', 'Blood tests', 'Medical history review'],
    postProcedure: ['Physical therapy', 'Pain management', 'Gradual weight bearing', 'Exercise program'],
    alternatives: ['Partial knee replacement', 'Arthroscopic surgery', 'Physical therapy', 'Medication']
  },
  {
    id: 'treat-3',
    name: 'IVF Treatment',
    category: 'Fertility',
    description: 'In-vitro fertilization with advanced reproductive technologies to help couples conceive when natural conception is not possible.',
    duration: '2-3 weeks cycle',
    cost: {
      min: 120000,
      max: 250000,
      currency: 'INR'
    },
    hospitals: ['hosp-1'],
    doctors: ['doc-3'],
    recoveryTime: '1-2 weeks',
    successRate: 65.2,
    risks: ['Multiple pregnancy', 'Ovarian hyperstimulation', 'Ectopic pregnancy', 'Emotional stress'],
    benefits: ['High success rate', 'Genetic screening options', 'Frozen embryo transfer', 'Personalized protocols'],
    preProcedure: ['Hormone testing', 'Ultrasound', 'Semen analysis', 'Medical evaluation'],
    postProcedure: ['Pregnancy test', 'Ultrasound monitoring', 'Hormone support', 'Follow-up care'],
    alternatives: ['IUI', 'ICSI', 'Donor eggs/sperm', 'Surrogacy']
  },
  {
    id: 'treat-4',
    name: 'Spine Fusion Surgery',
    category: 'Neurology',
    description: 'Surgical procedure to join two or more vertebrae to eliminate painful motion and provide stability to the spine.',
    duration: '4-6 days hospital stay',
    cost: {
      min: 350000,
      max: 600000,
      currency: 'INR'
    },
    hospitals: ['hosp-2'],
    doctors: ['doc-4'],
    recoveryTime: '6-12 months',
    successRate: 96.8,
    risks: ['Infection', 'Bleeding', 'Nerve damage', 'Implant failure'],
    benefits: ['Pain relief', 'Improved stability', 'Better posture', 'Long-term results'],
    preProcedure: ['MRI scan', 'CT scan', 'X-rays', 'Neurological evaluation'],
    postProcedure: ['Physical therapy', 'Pain management', 'Gradual activity increase', 'Brace wearing'],
    alternatives: ['Physical therapy', 'Pain management', 'Minimally invasive surgery', 'Alternative medicine']
  }
];

export const reviews: Review[] = [
  {
    id: 'rev-1',
    patientName: 'Ahmed Al-Rashid',
    patientCountry: 'Saudi Arabia',
    rating: 5,
    comment: 'Excellent care and treatment. Dr. Shah and his team were professional and caring throughout my heart surgery journey. The hospital facilities were world-class and the staff was very supportive.',
    date: '2024-01-10',
    treatment: 'Heart Bypass Surgery',
    doctorId: 'doc-1',
    hospitalId: 'hosp-1',
    verified: true
  },
  {
    id: 'rev-2',
    patientName: 'Fatima Hassan',
    patientCountry: 'UAE',
    rating: 5,
    comment: 'Dr. Tiwari performed my knee replacement with precision. The hospital facilities and staff were outstanding. My recovery has been excellent and I\'m back to my normal activities.',
    date: '2023-12-15',
    treatment: 'Knee Replacement Surgery',
    doctorId: 'doc-2',
    hospitalId: 'hosp-2',
    verified: true
  },
  {
    id: 'rev-3',
    patientName: 'John Smith',
    patientCountry: 'United Kingdom',
    rating: 4,
    comment: 'Very professional IVF treatment at Apollo Mumbai. Dr. Sharma was knowledgeable and caring. The success rate speaks for itself - we now have a beautiful baby girl.',
    date: '2023-11-20',
    treatment: 'IVF Treatment',
    doctorId: 'doc-3',
    hospitalId: 'hosp-1',
    verified: true
  }
];

export const appointments: Appointment[] = [
  {
    id: 'apt-1',
    patientId: 'pat-1',
    doctorId: 'doc-1',
    hospitalId: 'hosp-1',
    date: '2024-02-20',
    time: '10:00 AM',
    type: 'consultation',
    status: 'scheduled',
    notes: 'Follow-up consultation for heart surgery planning',
    cost: 2500
  },
  {
    id: 'apt-2',
    patientId: 'pat-3',
    doctorId: 'doc-3',
    hospitalId: 'hosp-1',
    date: '2024-02-25',
    time: '2:00 PM',
    type: 'consultation',
    status: 'scheduled',
    notes: 'IVF treatment planning consultation',
    cost: 1800
  },
  {
    id: 'apt-3',
    patientId: 'pat-4',
    doctorId: 'doc-4',
    hospitalId: 'hosp-2',
    date: '2024-03-05',
    time: '11:00 AM',
    type: 'surgery',
    status: 'confirmed',
    notes: 'Spine fusion surgery scheduled',
    cost: 450000
  }
];

export const payments: Payment[] = [
  {
    id: 'pay-1',
    patientId: 'pat-1',
    amount: 2500,
    currency: 'INR',
    status: 'completed',
    method: 'card',
    date: '2024-01-15',
    description: 'Consultation fee - Dr. Pritesh Shah',
    transactionId: 'TXN123456789'
  },
  {
    id: 'pay-2',
    patientId: 'pat-2',
    amount: 320000,
    currency: 'INR',
    status: 'completed',
    method: 'bank_transfer',
    date: '2023-11-15',
    description: 'Knee replacement surgery - Dr. Gaurav Tiwari',
    transactionId: 'TXN987654321'
  }
];

export const specialties = [
  'Cardiology',
  'Orthopedics',
  'Neurology',
  'Oncology',
  'Fertility',
  'Dental',
  'Cosmetic Surgery',
  'Spine Surgery',
  'Transplant',
  'Pediatrics',
  'Dermatology',
  'Ophthalmology',
  'ENT',
  'Urology',
  'Gastroenterology'
];

export const cities = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Chennai',
  'Hyderabad',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow'
];
