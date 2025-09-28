'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import TopUtilityBar from '@/components/TopUtilityBar'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { ArrowLeft, Users, Award, Clock, TrendingUp, CheckCircle, Star, Heart, Brain, Bone, Shield, Baby, Smile, Zap, ChevronRight, ArrowRight } from 'lucide-react'

// Comprehensive specialty data
const specialtyData = {
  cardiology: {
    title: 'Cardiology',
    subtitle: 'Heart & Vascular Care',
    description: 'Cardiology is the medical specialty that deals with disorders of the heart and blood vessels. Our world-class cardiologists provide comprehensive care for all heart-related conditions using the latest diagnostic and treatment technologies.',
    image: '/Medical_Specialties_Images/cardiology.png',
    icon: Heart,
    color: 'red',
    stats: {
      successRate: '98.5%',
      patientsTreated: '15,000+',
      averageRecovery: '2-4 weeks',
      satisfaction: '4.9/5'
    },
    history: 'Cardiology has evolved dramatically over the past century. From the first electrocardiogram in 1903 to modern interventional procedures, we\'ve been at the forefront of cardiac care innovation.',
    types: [
      {
        name: 'Interventional Cardiology',
        description: 'Minimally invasive procedures to treat heart conditions',
        procedures: ['Angioplasty', 'Stent Placement', 'Cardiac Catheterization']
      },
      {
        name: 'Electrophysiology',
        description: 'Treatment of heart rhythm disorders',
        procedures: ['Pacemaker Implantation', 'Ablation Therapy', 'ICD Placement']
      },
      {
        name: 'Preventive Cardiology',
        description: 'Risk assessment and prevention strategies',
        procedures: ['Cardiac Risk Assessment', 'Lifestyle Counseling', 'Medication Management']
      },
      {
        name: 'Heart Failure Management',
        description: 'Comprehensive care for heart failure patients',
        procedures: ['Medical Therapy', 'Device Therapy', 'Transplant Evaluation']
      }
    ],
    conditions: [
      'Coronary Artery Disease', 'Heart Attack', 'Heart Failure', 'Arrhythmias',
      'Valvular Heart Disease', 'Hypertension', 'Cardiomyopathy', 'Peripheral Artery Disease'
    ],
    technologies: [
      '3D Echocardiography', 'Cardiac MRI', 'CT Angiography', 'Nuclear Cardiology',
      'Intravascular Ultrasound', 'Robotic Surgery', 'Transcatheter Procedures'
    ],
    doctors: {
      count: 25,
      specialties: ['Interventional Cardiology', 'Electrophysiology', 'Heart Failure', 'Preventive Cardiology']
    },
    facilities: {
      cathLabs: 4,
      icuBeds: 50,
      operatingRooms: 6
    }
  },
  orthopedics: {
    title: 'Orthopedics',
    subtitle: 'Bone & Joint Care',
    description: 'Orthopedics focuses on the diagnosis, treatment, and prevention of disorders of the musculoskeletal system. Our orthopedic specialists provide comprehensive care for bones, joints, ligaments, tendons, and muscles.',
    image: '/Medical_Specialties_Images/orthopedics.png',
    icon: Bone,
    color: 'blue',
    stats: {
      successRate: '96.8%',
      patientsTreated: '22,000+',
      averageRecovery: '6-12 weeks',
      satisfaction: '4.8/5'
    },
    history: 'Orthopedics has its roots in treating children with deformities. Today, it encompasses everything from sports medicine to complex joint replacements, with continuous innovation in surgical techniques.',
    types: [
      {
        name: 'Joint Replacement',
        description: 'Advanced joint replacement surgeries',
        procedures: ['Hip Replacement', 'Knee Replacement', 'Shoulder Replacement', 'Ankle Replacement']
      },
      {
        name: 'Sports Medicine',
        description: 'Treatment of sports-related injuries',
        procedures: ['ACL Reconstruction', 'Meniscus Repair', 'Rotator Cuff Surgery', 'Arthroscopic Surgery']
      },
      {
        name: 'Spine Surgery',
        description: 'Comprehensive spine care',
        procedures: ['Discectomy', 'Spinal Fusion', 'Laminectomy', 'Scoliosis Correction']
      },
      {
        name: 'Trauma Surgery',
        description: 'Emergency orthopedic care',
        procedures: ['Fracture Repair', 'Internal Fixation', 'External Fixation', 'Soft Tissue Repair']
      }
    ],
    conditions: [
      'Arthritis', 'Fractures', 'Sports Injuries', 'Back Pain', 'Joint Pain',
      'Scoliosis', 'Osteoporosis', 'Tendon Injuries', 'Ligament Tears'
    ],
    technologies: [
      'Robotic Surgery', '3D Printing', 'Minimally Invasive Techniques', 'Biologics',
      'Computer Navigation', 'Arthroscopy', 'Joint Preservation', 'Regenerative Medicine'
    ],
    doctors: {
      count: 18,
      specialties: ['Joint Replacement', 'Sports Medicine', 'Spine Surgery', 'Trauma Surgery']
    },
    facilities: {
      operatingRooms: 8,
      recoveryBeds: 40,
      physicalTherapy: 3
    }
  },
  neurology: {
    title: 'Neurology',
    subtitle: 'Brain & Nerve Care',
    description: 'Neurology is the branch of medicine that deals with disorders of the nervous system. Our neurologists provide expert care for conditions affecting the brain, spinal cord, and peripheral nerves.',
    image: '/Medical_Specialties_Images/neurology.png',
    icon: Brain,
    color: 'purple',
    stats: {
      successRate: '94.2%',
      patientsTreated: '12,000+',
      averageRecovery: '4-8 weeks',
      satisfaction: '4.7/5'
    },
    history: 'Neurology has advanced rapidly with neuroimaging and neurophysiology. From the first EEG in 1924 to modern deep brain stimulation, we continue to push the boundaries of neurological care.',
    types: [
      {
        name: 'Stroke Care',
        description: 'Comprehensive stroke treatment and prevention',
        procedures: ['Thrombolysis', 'Thrombectomy', 'Stroke Rehabilitation', 'Prevention Programs']
      },
      {
        name: 'Epilepsy Management',
        description: 'Advanced epilepsy treatment',
        procedures: ['EEG Monitoring', 'VNS Therapy', 'Epilepsy Surgery', 'Ketogenic Diet']
      },
      {
        name: 'Movement Disorders',
        description: 'Treatment of Parkinson\'s and other movement disorders',
        procedures: ['Deep Brain Stimulation', 'Botulinum Toxin', 'Physical Therapy', 'Medication Management']
      },
      {
        name: 'Neuro-Oncology',
        description: 'Brain and spine tumor treatment',
        procedures: ['Brain Tumor Surgery', 'Radiation Therapy', 'Chemotherapy', 'Immunotherapy']
      }
    ],
    conditions: [
      'Stroke', 'Epilepsy', 'Parkinson\'s Disease', 'Multiple Sclerosis', 'Alzheimer\'s Disease',
      'Migraine', 'Brain Tumors', 'Spinal Cord Injuries', 'Peripheral Neuropathy'
    ],
    technologies: [
      'MRI/MRA', 'CT Angiography', 'EEG/EMG', 'Deep Brain Stimulation',
      'Neuroendoscopy', 'Stereotactic Surgery', 'Neuroimaging', 'Neurophysiology'
    ],
    doctors: {
      count: 15,
      specialties: ['Stroke Care', 'Epilepsy', 'Movement Disorders', 'Neuro-Oncology']
    },
    facilities: {
      neuroIcu: 20,
      eegRooms: 4,
      operatingRooms: 3
    }
  },
  oncology: {
    title: 'Oncology',
    subtitle: 'Cancer Treatment',
    description: 'Oncology is the medical specialty that focuses on the diagnosis, treatment, and prevention of cancer. Our comprehensive cancer center provides multidisciplinary care using the latest treatment modalities.',
    image: 'https://eqjpdytmsohfpohecczz.supabase.co/storage/v1/object/public/medical-specialties/oncology.png',
    icon: Shield,
    color: 'green',
    stats: {
      successRate: '89.3%',
      patientsTreated: '8,500+',
      averageRecovery: '3-6 months',
      satisfaction: '4.9/5'
    },
    history: 'Cancer treatment has evolved from basic surgery to sophisticated targeted therapies and immunotherapy. Our center has been at the forefront of these advances, offering hope to patients worldwide.',
    types: [
      {
        name: 'Medical Oncology',
        description: 'Systemic cancer treatment',
        procedures: ['Chemotherapy', 'Immunotherapy', 'Targeted Therapy', 'Hormone Therapy']
      },
      {
        name: 'Surgical Oncology',
        description: 'Cancer surgery and reconstruction',
        procedures: ['Tumor Resection', 'Lymph Node Dissection', 'Reconstructive Surgery', 'Minimally Invasive Surgery']
      },
      {
        name: 'Radiation Oncology',
        description: 'Precision radiation therapy',
        procedures: ['IMRT', 'SBRT', 'Brachytherapy', 'Proton Therapy']
      },
      {
        name: 'Hematologic Oncology',
        description: 'Blood and bone marrow cancers',
        procedures: ['Bone Marrow Transplant', 'CAR-T Therapy', 'Stem Cell Therapy', 'Blood Transfusion']
      }
    ],
    conditions: [
      'Breast Cancer', 'Lung Cancer', 'Colorectal Cancer', 'Prostate Cancer', 'Leukemia',
      'Lymphoma', 'Brain Tumors', 'Pancreatic Cancer', 'Ovarian Cancer'
    ],
    technologies: [
      'PET-CT', 'MRI', 'Linear Accelerator', 'CyberKnife', 'Proton Therapy',
      'Immunotherapy', 'CAR-T Therapy', 'Precision Medicine', 'Liquid Biopsy'
    ],
    doctors: {
      count: 22,
      specialties: ['Medical Oncology', 'Surgical Oncology', 'Radiation Oncology', 'Hematologic Oncology']
    },
    facilities: {
      radiationUnits: 3,
      chemotherapyChairs: 25,
      operatingRooms: 5
    }
  },
  fertility: {
    title: 'Fertility',
    subtitle: 'IVF & Reproductive Care',
    description: 'Fertility medicine focuses on helping couples and individuals achieve pregnancy. Our fertility specialists provide comprehensive reproductive care using advanced assisted reproductive technologies.',
    image: '/Medical_Specialties_Images/fertility.png',
    icon: Heart,
    color: 'pink',
    stats: {
      successRate: '78.5%',
      patientsTreated: '5,200+',
      averageRecovery: '2-4 weeks',
      satisfaction: '4.8/5'
    },
    history: 'Fertility medicine has revolutionized with the first successful IVF in 1978. Today, we offer advanced techniques including genetic testing, egg freezing, and surrogacy programs.',
    types: [
      {
        name: 'In Vitro Fertilization (IVF)',
        description: 'Advanced assisted reproductive technology',
        procedures: ['Egg Retrieval', 'Embryo Transfer', 'ICSI', 'Blastocyst Culture']
      },
      {
        name: 'Fertility Preservation',
        description: 'Preserving fertility for future use',
        procedures: ['Egg Freezing', 'Sperm Freezing', 'Embryo Freezing', 'Ovarian Tissue Freezing']
      },
      {
        name: 'Male Infertility',
        description: 'Comprehensive male reproductive care',
        procedures: ['Semen Analysis', 'Varicocele Repair', 'Sperm Retrieval', 'Hormone Therapy']
      },
      {
        name: 'Surrogacy Program',
        description: 'Gestational surrogacy services',
        procedures: ['Surrogate Matching', 'Legal Support', 'Medical Monitoring', 'Delivery Care']
      }
    ],
    conditions: [
      'Infertility', 'PCOS', 'Endometriosis', 'Male Factor Infertility', 'Recurrent Miscarriage',
      'Advanced Maternal Age', 'Premature Ovarian Failure', 'Uterine Fibroids'
    ],
    technologies: [
      'Time-Lapse Imaging', 'PGT-A/PGT-M', 'Vitrification', 'ICSI', 'Assisted Hatching',
      'Endometrial Receptivity', 'Sperm Selection', 'EmbryoScope'
    ],
    doctors: {
      count: 8,
      specialties: ['Reproductive Endocrinology', 'Andrology', 'Embryology', 'Gynecologic Surgery']
    },
    facilities: {
      ivfLabs: 2,
      procedureRooms: 4,
      recoveryRooms: 6
    }
  },
  dental: {
    title: 'Dental',
    subtitle: 'Oral Health Care',
    description: 'Dental medicine encompasses the diagnosis, treatment, and prevention of oral and dental diseases. Our dental specialists provide comprehensive oral health care for patients of all ages.',
    image: '/Medical_Specialties_Images/dental.png',
    icon: Smile,
    color: 'cyan',
    stats: {
      successRate: '99.1%',
      patientsTreated: '35,000+',
      averageRecovery: '1-2 weeks',
      satisfaction: '4.9/5'
    },
    history: 'Dentistry has evolved from basic extractions to sophisticated cosmetic and restorative procedures. Modern dentistry focuses on prevention, aesthetics, and comprehensive oral health.',
    types: [
      {
        name: 'Cosmetic Dentistry',
        description: 'Enhancing smile aesthetics',
        procedures: ['Teeth Whitening', 'Veneers', 'Dental Implants', 'Smile Makeover']
      },
      {
        name: 'Orthodontics',
        description: 'Correcting teeth and jaw alignment',
        procedures: ['Braces', 'Invisalign', 'Retainers', 'Jaw Surgery']
      },
      {
        name: 'Oral Surgery',
        description: 'Complex dental and oral procedures',
        procedures: ['Wisdom Tooth Removal', 'Dental Implants', 'Bone Grafting', 'TMJ Surgery']
      },
      {
        name: 'Endodontics',
        description: 'Root canal and pulp therapy',
        procedures: ['Root Canal Treatment', 'Apicoectomy', 'Pulp Therapy', 'Retreatment']
      }
    ],
    conditions: [
      'Tooth Decay', 'Gum Disease', 'Tooth Loss', 'Malocclusion', 'TMJ Disorders',
      'Oral Cancer', 'Dental Trauma', 'Bruxism', 'Halitosis'
    ],
    technologies: [
      'Digital X-rays', '3D Imaging', 'Laser Dentistry', 'CAD/CAM', 'Intraoral Scanners',
      'Dental Implants', 'Clear Aligners', 'Sedation Dentistry'
    ],
    doctors: {
      count: 12,
      specialties: ['General Dentistry', 'Orthodontics', 'Oral Surgery', 'Endodontics']
    },
    facilities: {
      treatmentRooms: 15,
      surgerySuites: 3,
      recoveryRooms: 5
    }
  },
  cosmetic: {
    title: 'Cosmetic Surgery',
    subtitle: 'Aesthetic Procedures',
    description: 'Cosmetic surgery focuses on enhancing appearance through surgical and non-surgical procedures. Our board-certified plastic surgeons provide safe, effective aesthetic treatments.',
    image: '/Medical_Specialties_Images/cosmetic surgery.png',
    icon: Star,
    color: 'rose',
    stats: {
      successRate: '97.8%',
      patientsTreated: '6,800+',
      averageRecovery: '2-6 weeks',
      satisfaction: '4.9/5'
    },
    history: 'Cosmetic surgery has evolved from basic procedures to sophisticated techniques. Today, we offer both surgical and non-surgical options with minimal downtime and natural results.',
    types: [
      {
        name: 'Facial Surgery',
        description: 'Enhancing facial features',
        procedures: ['Rhinoplasty', 'Facelift', 'Eyelid Surgery', 'Chin Augmentation']
      },
      {
        name: 'Body Contouring',
        description: 'Sculpting body shape',
        procedures: ['Liposuction', 'Tummy Tuck', 'Breast Augmentation', 'Body Lift']
      },
      {
        name: 'Non-Surgical Treatments',
        description: 'Minimally invasive procedures',
        procedures: ['Botox', 'Dermal Fillers', 'Laser Treatments', 'Chemical Peels']
      },
      {
        name: 'Reconstructive Surgery',
        description: 'Restoring form and function',
        procedures: ['Scar Revision', 'Burn Reconstruction', 'Breast Reconstruction', 'Hand Surgery']
      }
    ],
    conditions: [
      'Aging Concerns', 'Body Contouring', 'Facial Asymmetry', 'Scarring', 'Breast Concerns',
      'Skin Laxity', 'Volume Loss', 'Hair Loss', 'Stretch Marks'
    ],
    technologies: [
      '3D Imaging', 'Laser Technology', 'Ultrasound', 'Radiofrequency', 'Cryolipolysis',
      'Thread Lifts', 'PRP Therapy', 'Microneedling'
    ],
    doctors: {
      count: 6,
      specialties: ['Plastic Surgery', 'Dermatology', 'Oculoplastic Surgery', 'Hand Surgery']
    },
    facilities: {
      operatingRooms: 4,
      treatmentRooms: 8,
      recoveryRooms: 6
    }
  },
  spine: {
    title: 'Spine Surgery',
    subtitle: 'Back & Neck Care',
    description: 'Spine surgery focuses on treating disorders of the spine and spinal cord. Our spine specialists provide comprehensive care for back and neck conditions using advanced surgical techniques.',
    image: '/Medical_Specialties_Images/spine surgery.png',
    icon: Bone,
    color: 'indigo',
    stats: {
      successRate: '95.2%',
      patientsTreated: '4,500+',
      averageRecovery: '8-16 weeks',
      satisfaction: '4.7/5'
    },
    history: 'Spine surgery has advanced from open procedures to minimally invasive techniques. Today, we offer robotic-assisted surgery, artificial disc replacement, and motion-preserving procedures.',
    types: [
      {
        name: 'Minimally Invasive Spine Surgery',
        description: 'Advanced minimally invasive techniques',
        procedures: ['Microdiscectomy', 'Laminectomy', 'Spinal Fusion', 'Foraminotomy']
      },
      {
        name: 'Spinal Deformity Correction',
        description: 'Correcting spinal deformities',
        procedures: ['Scoliosis Surgery', 'Kyphosis Correction', 'Spinal Osteotomy', 'Growth Rod Surgery']
      },
      {
        name: 'Artificial Disc Replacement',
        description: 'Motion-preserving spine surgery',
        procedures: ['Cervical Disc Replacement', 'Lumbar Disc Replacement', 'Hybrid Procedures']
      },
      {
        name: 'Spinal Trauma Surgery',
        description: 'Emergency spine care',
        procedures: ['Fracture Stabilization', 'Spinal Cord Decompression', 'Vertebroplasty', 'Kyphoplasty']
      }
    ],
    conditions: [
      'Herniated Disc', 'Spinal Stenosis', 'Scoliosis', 'Spinal Fractures', 'Degenerative Disc Disease',
      'Spinal Tumors', 'Spinal Infections', 'Spinal Cord Injuries', 'Facet Joint Disease'
    ],
    technologies: [
      'Robotic Surgery', 'Navigation Systems', '3D Imaging', 'Endoscopic Surgery', 'Artificial Discs',
      'Bone Morphogenetic Protein', 'Stem Cell Therapy', 'Minimally Invasive Techniques'
    ],
    doctors: {
      count: 8,
      specialties: ['Spine Surgery', 'Neurosurgery', 'Orthopedic Spine', 'Pain Management']
    },
    facilities: {
      operatingRooms: 3,
      icuBeds: 15,
      physicalTherapy: 2
    }
  },
  transplant: {
    title: 'Transplant',
    subtitle: 'Organ Transplants',
    description: 'Transplant medicine involves replacing diseased organs with healthy ones from donors. Our transplant team provides comprehensive care for organ transplantation with excellent outcomes.',
    image: '/Medical_Specialties_Images/trasplant.png',
    icon: Heart,
    color: 'emerald',
    stats: {
      successRate: '92.4%',
      patientsTreated: '1,200+',
      averageRecovery: '3-6 months',
      satisfaction: '4.8/5'
    },
    history: 'Organ transplantation has saved countless lives since the first successful kidney transplant in 1954. Today, we perform complex multi-organ transplants with advanced immunosuppression protocols.',
    types: [
      {
        name: 'Kidney Transplant',
        description: 'Renal transplantation services',
        procedures: ['Living Donor Transplant', 'Deceased Donor Transplant', 'Paired Exchange', 'ABO Incompatible']
      },
      {
        name: 'Liver Transplant',
        description: 'Hepatic transplantation',
        procedures: ['Whole Liver Transplant', 'Living Donor Liver', 'Split Liver Transplant', 'Auxiliary Transplant']
      },
      {
        name: 'Heart Transplant',
        description: 'Cardiac transplantation',
        procedures: ['Orthotopic Heart Transplant', 'Heterotopic Heart Transplant', 'Heart-Lung Transplant']
      },
      {
        name: 'Lung Transplant',
        description: 'Pulmonary transplantation',
        procedures: ['Single Lung Transplant', 'Double Lung Transplant', 'Heart-Lung Transplant']
      }
    ],
    conditions: [
      'End-Stage Renal Disease', 'Liver Failure', 'Heart Failure', 'Lung Disease', 'Diabetes',
      'Cirrhosis', 'Cardiomyopathy', 'Pulmonary Fibrosis', 'Cystic Fibrosis'
    ],
    technologies: [
      'Organ Preservation', 'Immunosuppression', 'Cross-Matching', 'Organ Perfusion', 'Minimally Invasive Surgery',
      'Robotic Surgery', '3D Printing', 'Stem Cell Therapy'
    ],
    doctors: {
      count: 12,
      specialties: ['Transplant Surgery', 'Nephrology', 'Hepatology', 'Cardiology']
    },
    facilities: {
      operatingRooms: 4,
      icuBeds: 25,
      isolationRooms: 8
    }
  },
  pediatrics: {
    title: 'Pediatrics',
    subtitle: 'Child Healthcare',
    description: 'Pediatrics is the medical specialty that focuses on the health and medical care of infants, children, and adolescents. Our pediatric specialists provide comprehensive care for children of all ages.',
    image: '/Medical_Specialties_Images/pediatrics.png',
    icon: Baby,
    color: 'yellow',
    stats: {
      successRate: '98.9%',
      patientsTreated: '45,000+',
      averageRecovery: '1-3 weeks',
      satisfaction: '4.9/5'
    },
    history: 'Pediatrics has evolved to recognize that children are not just small adults. Today, we provide specialized care that addresses the unique needs of growing children and their families.',
    types: [
      {
        name: 'General Pediatrics',
        description: 'Comprehensive child healthcare',
        procedures: ['Well-Child Visits', 'Vaccinations', 'Developmental Screening', 'Preventive Care']
      },
      {
        name: 'Pediatric Surgery',
        description: 'Surgical care for children',
        procedures: ['Appendectomy', 'Hernia Repair', 'Circumcision', 'Tonsillectomy']
      },
      {
        name: 'Neonatology',
        description: 'Care for newborns and premature infants',
        procedures: ['NICU Care', 'Respiratory Support', 'Feeding Support', 'Developmental Care']
      },
      {
        name: 'Pediatric Emergency',
        description: 'Emergency care for children',
        procedures: ['Trauma Care', 'Poisoning Treatment', 'Respiratory Emergencies', 'Seizure Management']
      }
    ],
    conditions: [
      'Common Childhood Illnesses', 'Developmental Delays', 'Asthma', 'Diabetes', 'ADHD',
      'Autism Spectrum Disorders', 'Infections', 'Allergies', 'Growth Disorders'
    ],
    technologies: [
      'Pediatric-Sized Equipment', 'Child-Friendly Imaging', 'Telemedicine', 'Electronic Health Records',
      'Developmental Assessment Tools', 'Pain Management', 'Family-Centered Care'
    ],
    doctors: {
      count: 20,
      specialties: ['General Pediatrics', 'Pediatric Surgery', 'Neonatology', 'Pediatric Emergency']
    },
    facilities: {
      pediatricBeds: 60,
      nicuBeds: 25,
      playRooms: 4
    }
  }
}

export default function SpecialtyPage() {
  const params = useParams()
  const specialty = params.specialty as string
  
  const data = specialtyData[specialty as keyof typeof specialtyData]
  
  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
        <TopUtilityBar />
        <Navigation />
        <div className="pt-32 pb-16">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-12 h-12 text-slate-400" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-4">Specialty Not Found</h1>
              <p className="text-slate-600 mb-8 leading-relaxed">The requested specialty could not be found.</p>
              <Link href="/" className="inline-flex items-center px-6 py-3 bg-[#2A4049] text-white rounded-xl hover:bg-[#1F2F35] transition-all duration-300 shadow-lg hover:shadow-xl">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const IconComponent = data.icon

  return (
    <div className="min-h-screen bg-slate-50">
      <TopUtilityBar />
      <Navigation />
      
      <div className="pt-32 pb-12">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Back Button */}
          <div className="mt-8 mb-16">
            <Link href="/#specialties" className="inline-flex items-center gap-2 px-4 py-2 bg-[#ADC8A6] text-[#2A4049] rounded-lg hover:bg-[#ADC8A6]/90 transition-all duration-300 font-medium shadow-sm hover:shadow-md">
              <ArrowLeft className="w-4 h-4" />
              Back to Specialties
            </Link>
          </div>

          {/* Hero Section */}
          <div className="mb-8">
            {/* Centered Title and Subtitle */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-[#2A4049] mb-2">{data.title}</h1>
              <p className="text-base text-slate-600 mb-3">{data.subtitle}</p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#2A4049] text-white rounded-full text-sm font-medium">
                <IconComponent className="w-3 h-3" />
                <span>Comprehensive Care</span>
              </div>
            </div>

            {/* Cards Grid - Image + Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {/* Specialty Image Card */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md hover:border-[#ADC8A6] transition-all duration-300">
                <div className="text-center">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Image
                      src={data.image}
                      alt={data.title}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <div className="text-xl font-bold text-[#2A4049] mb-1">{data.title}</div>
                  <div className="text-xs text-slate-600">Specialty</div>
                </div>
              </div>

              {/* Success Rate Card */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md hover:border-[#ADC8A6] transition-all duration-300">
                <div className="text-center">
                  <div className="w-10 h-10 bg-[#2A4049] rounded-lg flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-xl font-bold text-[#2A4049] mb-1">{data.stats.successRate}</div>
                  <div className="text-xs text-slate-600">Success Rate</div>
                </div>
              </div>

              {/* Patients Treated Card */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md hover:border-[#ADC8A6] transition-all duration-300">
                <div className="text-center">
                  <div className="w-10 h-10 bg-[#ADC8A6] rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Users className="w-5 h-5 text-[#2A4049]" />
                  </div>
                  <div className="text-xl font-bold text-[#2A4049] mb-1">{data.stats.patientsTreated}</div>
                  <div className="text-xs text-slate-600">Patients Treated</div>
                </div>
              </div>

              {/* Recovery Time Card */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md hover:border-[#ADC8A6] transition-all duration-300">
                <div className="text-center">
                  <div className="w-10 h-10 bg-[#2A4049] rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-xl font-bold text-[#2A4049] mb-1">{data.stats.averageRecovery}</div>
                  <div className="text-xs text-slate-600">Recovery Time</div>
                </div>
              </div>

              {/* Satisfaction Card */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md hover:border-[#ADC8A6] transition-all duration-300">
                <div className="text-center">
                  <div className="w-10 h-10 bg-[#ADC8A6] rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Star className="w-5 h-5 text-[#2A4049]" />
                  </div>
                  <div className="text-xl font-bold text-[#2A4049] mb-1">{data.stats.satisfaction}</div>
                  <div className="text-xs text-slate-600">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Full Width Layout */}
          <div className="w-full">
            {/* About Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#2A4049] to-[#ADC8A6] rounded-xl flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[#2A4049] mb-3">About {data.title}</h2>
                  <p className="text-slate-700 leading-relaxed mb-3 text-base">{data.description}</p>
                  <p className="text-slate-600 leading-relaxed text-sm">{data.history}</p>
                </div>
              </div>
            </div>

            {/* Comprehensive Information - 3 Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Types of Treatment */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-[#2A4049] mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#2A4049] rounded flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  Treatments
                </h3>
                <div className="space-y-3">
                  {data.types.map((type, index) => (
                    <div key={index} className="p-3 bg-gradient-to-r from-[#ADC8A6]/10 to-[#ADC8A6]/5 rounded border-l-2 border-[#2A4049]">
                      <h4 className="text-sm font-semibold text-[#2A4049] mb-1">{type.name}</h4>
                      <p className="text-slate-600 text-xs leading-relaxed mb-2">{type.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {type.procedures.slice(0, 2).map((procedure, procIndex) => (
                          <span key={procIndex} className="px-2 py-1 bg-[#2A4049] text-white rounded text-xs font-medium">
                            {procedure}
                          </span>
                        ))}
                        {type.procedures.length > 2 && (
                          <span className="px-2 py-1 bg-slate-400 text-white rounded text-xs font-medium">
                            +{type.procedures.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team & Facilities Combined */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-[#2A4049] mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#ADC8A6] rounded flex items-center justify-center">
                    <Users className="w-4 h-4 text-[#2A4049]" />
                  </div>
                  Team & Facilities
                </h3>
                
                {/* Medical Team Section */}
                <div className="mb-4">
                  <div className="bg-gradient-to-r from-[#ADC8A6]/20 to-[#ADC8A6]/10 p-3 rounded mb-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#2A4049]">{data.doctors.count}</div>
                      <div className="text-sm text-[#2A4049] font-medium">Specialists</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {data.doctors.specialties.map((specialty, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-[#ADC8A6]/10 rounded">
                        <div className="w-1.5 h-1.5 bg-[#2A4049] rounded-full"></div>
                        <span className="text-[#2A4049] font-medium text-xs">{specialty}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Facilities Section */}
                <div>
                  <h4 className="text-sm font-bold text-[#2A4049] mb-3 flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#2A4049] rounded flex items-center justify-center">
                      <Award className="w-3 h-3 text-white" />
                    </div>
                    Facilities
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(data.facilities).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-2 bg-gradient-to-r from-[#2A4049]/10 to-[#2A4049]/5 rounded">
                        <span className="text-[#2A4049] font-medium text-xs capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="text-base font-bold text-[#2A4049]">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Conditions & Technologies */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-[#2A4049] mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#ADC8A6] rounded flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-[#2A4049]" />
                  </div>
                  Conditions & Tech
                </h3>
                
                {/* Conditions Section */}
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-[#2A4049] mb-3 flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#ADC8A6] rounded flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-[#2A4049]" />
                    </div>
                    Conditions
                  </h4>
                  <div className="space-y-2">
                    {data.conditions.slice(0, 5).map((condition, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gradient-to-r from-[#ADC8A6]/20 to-[#ADC8A6]/10 rounded">
                        <CheckCircle className="w-3 h-3 text-[#2A4049] flex-shrink-0" />
                        <span className="text-[#2A4049] font-medium text-xs">{condition}</span>
                      </div>
                    ))}
                    {data.conditions.length > 5 && (
                      <div className="text-center text-xs text-slate-500 py-1">
                        +{data.conditions.length - 5} more
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Technologies Section */}
                <div>
                  <h4 className="text-sm font-bold text-[#2A4049] mb-3 flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#2A4049] rounded flex items-center justify-center">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                    Technologies
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {data.technologies.slice(0, 6).map((tech, index) => (
                      <div key={index} className="p-2 bg-gradient-to-br from-[#2A4049] to-[#1F2F35] rounded text-center">
                        <Zap className="w-3 h-3 text-white mx-auto mb-1" />
                        <span className="text-white font-medium text-xs">{tech}</span>
                      </div>
                    ))}
                    {data.technologies.length > 6 && (
                      <div className="col-span-2 text-center text-xs text-slate-500 py-1">
                        +{data.technologies.length - 6} more
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section - Full Width */}
          <div className="mt-8 bg-[#2A4049] p-6 rounded-xl shadow-lg">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Get Started</h3>
              <p className="text-slate-300 text-sm">Begin your medical journey today</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <Link 
                href="/start-case" 
                className="flex-1 text-center px-4 py-3 bg-[#ADC8A6] text-[#2A4049] rounded-lg hover:bg-[#ADC8A6]/90 transition-all duration-300 font-semibold text-base"
              >
                Start Your Case
              </Link>
              <Link 
                href="/treatments" 
                className="flex-1 text-center px-4 py-3 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-all duration-300 font-medium text-base"
              >
                View Treatments
              </Link>
              <Link 
                href="/doctors" 
                className="flex-1 text-center px-4 py-3 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-all duration-300 font-medium text-base"
              >
                Find Doctors
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
