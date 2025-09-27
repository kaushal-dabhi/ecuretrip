export const config = {
  // Database
  database: {
    url: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/ecuretrip_db'
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
    expiresIn: '7d'
  },

  // File Upload
  upload: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
    allowedTypes: [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ],
    uploadDir: process.env.UPLOAD_DIR || 'public/uploads'
  },

  // Email
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  },

  // Payment
  stripe: {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    secretKey: process.env.STRIPE_SECRET_KEY || ''
  },

  // External Services
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
  },

  zoom: {
    apiKey: process.env.ZOOM_API_KEY || '',
    apiSecret: process.env.ZOOM_API_SECRET || ''
  },

  // AI Services
  openai: {
    apiKey: process.env.OPENAI_API_KEY || ''
  },

  // App
  app: {
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    environment: process.env.NODE_ENV || 'development'
  }
}

export default config
