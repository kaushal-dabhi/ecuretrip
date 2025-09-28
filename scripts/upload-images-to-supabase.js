// Script to upload images to Supabase Storage
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function uploadImages() {
  const publicDir = path.join(__dirname, '../public')
  
  // Create buckets if they don't exist
  const buckets = ['medical-specialties', 'journey-images', 'uploads', 'icons']
  
  for (const bucketName of buckets) {
    try {
      await supabase.storage.createBucket(bucketName, { public: true })
      console.log(`✅ Created bucket: ${bucketName}`)
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log(`✅ Bucket exists: ${bucketName}`)
      } else {
        console.error(`❌ Error creating bucket ${bucketName}:`, error.message)
      }
    }
  }

  // Upload Medical Specialties Images
  const specialtiesDir = path.join(publicDir, 'Medical_Specialties_Images')
  if (fs.existsSync(specialtiesDir)) {
    const files = fs.readdirSync(specialtiesDir)
    for (const file of files) {
      if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
        const filePath = path.join(specialtiesDir, file)
        const fileBuffer = fs.readFileSync(filePath)
        
        const { data, error } = await supabase.storage
          .from('medical-specialties')
          .upload(file, fileBuffer, { contentType: `image/${file.split('.').pop()}` })
        
        if (error) {
          console.error(`❌ Error uploading ${file}:`, error.message)
        } else {
          console.log(`✅ Uploaded: ${file}`)
        }
      }
    }
  }

  // Upload Journey Images
  const journeyDir = path.join(publicDir, 'journey images')
  if (fs.existsSync(journeyDir)) {
    const files = fs.readdirSync(journeyDir)
    for (const file of files) {
      if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
        const filePath = path.join(journeyDir, file)
        const fileBuffer = fs.readFileSync(filePath)
        
        const { data, error } = await supabase.storage
          .from('journey-images')
          .upload(file, fileBuffer, { contentType: `image/${file.split('.').pop()}` })
        
        if (error) {
          console.error(`❌ Error uploading ${file}:`, error.message)
        } else {
          console.log(`✅ Uploaded: ${file}`)
        }
      }
    }
  }

  // Upload other images
  const imageFiles = ['oncology.png', 'pediatric.png', 'image__1_-removebg-preview.png', 'ecurelogo-removebg-preview.png']
  for (const file of imageFiles) {
    const filePath = path.join(publicDir, file)
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath)
      
      const { data, error } = await supabase.storage
        .from('icons')
        .upload(file, fileBuffer, { contentType: `image/${file.split('.').pop()}` })
      
      if (error) {
        console.error(`❌ Error uploading ${file}:`, error.message)
      } else {
        console.log(`✅ Uploaded: ${file}`)
      }
    }
  }

  console.log('🎉 Image upload complete!')
}

uploadImages().catch(console.error)
