import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import compression from 'compression'
import { connectWithRetry } from './config/db'
import { seedDatabase } from './db/seeder'

// Import routes
import authRoutes from './routes/auth'
import patientRoutes from './routes/patients'
import doctorRoutes from './routes/doctors'
import appointmentRoutes from './routes/appointments'
import prescriptionRoutes from './routes/prescriptions'
import invoiceRoutes from './routes/invoices'
import notificationRoutes from './routes/notifications'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// 1. Gzip Compression for all static assets and API payloads
app.use(compression())

// 2. Custom Security Headers Middleware
app.use((req, res, next) => {
  // Content Security Policy (CSP)
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' *; frame-ancestors 'none';"
  )
  
  // X-Frame-Options (prevents clickjacking)
  res.setHeader('X-Frame-Options', 'DENY')
  
  // X-Content-Type-Options (prevents MIME sniffing)
  res.setHeader('X-Content-Type-Options', 'nosniff')
  
  // Referrer-Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Permissions-Policy
  res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=(), payment=()')
  
  // HSTS (Strict-Transport-Security) for enforcing HTTPS on production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }
  
  next()
})

app.use(cors())
app.use(express.json({ limit: '10mb' })) // Enable larger payloads for digital signature uploads

// Mounting API Routes
app.use('/api/auth', authRoutes)
app.use('/api/patients', patientRoutes)
app.use('/api/doctors', doctorRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/prescriptions', prescriptionRoutes)
app.use('/api/invoices', invoiceRoutes)
app.use('/api/notifications', notificationRoutes)

// Serves Static Frontend in Production
const staticPath = path.join(__dirname, '../../dist')
app.use(express.static(staticPath))

// Wildcard SPA route
app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'))
})

// Boot server after ensuring PostgreSQL connection
const bootstrap = async () => {
  try {
    await connectWithRetry()
    await seedDatabase()
    
    app.listen(PORT, () => {
      console.log(`MediSync AI Server running on port ${PORT}`)
    })
  } catch (err) {
    console.error('Server failed to bootstrap:', err)
    process.exit(1)
  }
}

bootstrap()
