import { Router, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../config/db'
import { authenticateJWT, AuthRequest } from '../middleware/auth'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_medisync_jwt_key_2026'

// User Registration
router.post('/register', async (req, res) => {
  const { name, email, password, role, phone, age, gender, bloodGroup } = req.body
  
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Missing required registration fields' })
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Check if user already exists
    const checkUser = await client.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()])
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' })
    }

    const userId = `U${Date.now()}`
    const passwordHash = bcrypt.hashSync(password, 10)

    // Insert user
    await client.query(
      'INSERT INTO users (id, name, email, password_hash, role, phone) VALUES ($1, $2, $3, $4, $5, $6)',
      [userId, name, email.toLowerCase(), passwordHash, role, phone || null]
    )

    // If patient role, create corresponding patients row
    if (role === 'patient') {
      const patientId = `P${String(userId).replace('U', '')}`
      // Update the user table entry to have the correct ID prefix if needed, or simply map patient id to same userId.
      // Keeping patient.id identical to user.id is standard and very clean.
      await client.query(
        'INSERT INTO patients (id, age, gender, blood_group, condition, address, allergies, insurance) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [userId, age || 30, gender || 'Male', bloodGroup || 'O+', null, null, 'None', null]
      )
    }

    // If doctor role, create corresponding doctors row
    if (role === 'doctor') {
      await client.query(
        'INSERT INTO doctors (id, specialty, department_id, experience, consultation_fee, qualifications) VALUES ($1, $2, $3, $4, $5, $6)',
        [userId, 'General Practice', 'DEP01', '5 years', 500, 'MBBS']
      )
    }

    await client.query('COMMIT')

    // Generate token
    const token = jwt.sign({ id: userId, email, role, name }, JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({
      token,
      user: { id: userId, name, email, role, phone }
    })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Registration error:', err)
    res.status(500).json({ error: 'Failed to complete registration' })
  } finally {
    client.release()
  }
})

// User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()])
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const user = rows[0]
    const isPasswordValid = bcrypt.compareSync(password, user.password_hash)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' })
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone }
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Server authentication failure' })
  }
})

// Get Current User Profile
router.get('/me', authenticateJWT, async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' })
  
  try {
    const { rows } = await pool.query('SELECT id, name, email, role, phone FROM users WHERE id = $1', [req.user.id])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User profile not found' })
    }
    res.json({ user: rows[0] })
  } catch (err) {
    res.status(500).json({ error: 'Server profile fetch error' })
  }
})

export default router
