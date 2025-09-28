export interface Treatment {
  id: string
  name: string
  base_price: number
  category?: string
  description?: string
  duration_days?: number
  hospital_name?: string
}

export const TREATMENTS: Treatment[] = [
  {
    id: '1',
    name: 'MRI Brain Scan',
    base_price: 15000,
    category: 'Radiology',
    description: 'High-resolution MRI scan of the brain for diagnostic purposes',
    duration_days: 1,
    hospital_name: 'Apollo Hospitals'
  },
  {
    id: '2',
    name: 'CT Scan Chest',
    base_price: 8000,
    category: 'Radiology',
    description: 'Comprehensive CT scan of the chest for lung and heart evaluation',
    duration_days: 1,
    hospital_name: 'Apollo Hospitals'
  },
  {
    id: '3',
    name: 'Pediatric Health Checkup',
    base_price: 2500,
    category: 'Pediatrics',
    description: 'Complete pediatric health examination and consultation',
    duration_days: 1,
    hospital_name: 'Fortis Healthcare'
  },
  {
    id: '4',
    name: 'Pediatric Vaccination Package',
    base_price: 5000,
    category: 'Pediatrics',
    description: 'Comprehensive vaccination schedule for children',
    duration_days: 1,
    hospital_name: 'Fortis Healthcare'
  },
  {
    id: '5',
    name: 'Ultrasound Abdomen',
    base_price: 3000,
    category: 'Radiology',
    description: 'Detailed ultrasound examination of abdominal organs',
    duration_days: 1,
    hospital_name: 'Apollo Hospitals'
  },
  {
    id: '6',
    name: 'Child Development Assessment',
    base_price: 3500,
    category: 'Pediatrics',
    description: 'Comprehensive assessment of child growth and development',
    duration_days: 1,
    hospital_name: 'Fortis Healthcare'
  }
]
