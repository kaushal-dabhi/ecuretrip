// Script to prepare project for deployment
const fs = require('fs')
const path = require('path')

console.log('🚀 Preparing project for deployment...')

// Remove large image folders from public
const publicDir = path.join(__dirname, '../public')
const foldersToRemove = [
  'Medical_Specialties_Images',
  'journey images',
  'uploads'
]

const filesToRemove = [
  'oncology.png',
  'pediatric.png',
  'image__1_-removebg-preview.png',
  'ecurelogo-removebg-preview.png'
]

// Remove large folders
foldersToRemove.forEach(folder => {
  const folderPath = path.join(publicDir, folder)
  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true, force: true })
    console.log(`✅ Removed folder: ${folder}`)
  }
})

// Remove large files
filesToRemove.forEach(file => {
  const filePath = path.join(publicDir, file)
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
    console.log(`✅ Removed file: ${file}`)
  }
})

// Keep only essential files
const keepFiles = [
  'favicon.png',
  'manifest.json'
]

console.log('📁 Public folder cleaned up!')
console.log('📊 Remaining files:')
fs.readdirSync(publicDir).forEach(file => {
  const filePath = path.join(publicDir, file)
  const stats = fs.statSync(filePath)
  if (stats.isFile()) {
    console.log(`  - ${file} (${(stats.size / 1024).toFixed(1)}KB)`)
  }
})

console.log('🎉 Project ready for deployment!')
console.log('📤 Run: npm run upload-images (to upload to Supabase)')
console.log('🚀 Run: vercel deploy (to deploy to Vercel)')
