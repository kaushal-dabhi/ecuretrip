// Helper utility for Supabase Storage image URLs
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

export const getImageUrl = (bucket: string, fileName: string): string => {
  if (!SUPABASE_URL) return `/placeholder-image.png`
  
  // Use Supabase CDN URL for faster loading
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${fileName}`
}

// Predefined image mappings
export const images = {
  // Medical Specialties
  specialties: {
    oncology: getImageUrl('medical-specialties', 'oncology.png'),
    cardiology: getImageUrl('medical-specialties', 'cardiology.png'),
    fertility: getImageUrl('medical-specialties', 'fertility.png'),
    neurology: getImageUrl('medical-specialties', 'neurology.png'),
    orthopedics: getImageUrl('medical-specialties', 'orthopedics.png'),
    dental: getImageUrl('medical-specialties', 'dental.png'),
    'cosmetic-surgery': getImageUrl('medical-specialties', 'cosmetic surgery.png'),
    transplant: getImageUrl('medical-specialties', 'transplant.png'),
  },
  
  // Icons
  icons: {
    hero: getImageUrl('icons', 'image__1_-removebg-preview.png'),
    logo: getImageUrl('icons', 'ecurelogo-removebg-preview.png'),
    oncology: getImageUrl('icons', 'oncology.png'),
    pediatric: getImageUrl('icons', 'pediatric.png'),
  },
  
  // Journey Images
  journey: {
    // Add journey image mappings as needed
  }
}

// Fallback to local images during development
export const getLocalImageUrl = (path: string): string => {
  if (process.env.NODE_ENV === 'development') {
    return path
  }
  return path // Will be replaced with Supabase URLs
}
