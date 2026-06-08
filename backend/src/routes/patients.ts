import { Router, Response } from 'express'
import bcrypt from 'bcryptjs'
import { pool } from '../config/db'
import { authenticateJWT, AuthRequest, requireRole } from '../middleware/auth'

const router = Router()

// Get All Patients
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.*, u.name, u.email, u.phone 
       FROM patients p 
       JOIN users u ON p.id = u.id 
       ORDER BY u.name ASC`
    )
    
    // Map camelCase fields for React
    const camelCased = rows.map(r => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      age: r.age,
      gender: r.gender,
      bloodGroup: r.blood_group,
      condition: r.condition,
      status: r.status,
      address: r.address,
      allergies: r.allergies,
      insurance: r.insurance,
      lastVisit: r.last_visit,
      doctor: r.doctor,
      department: r.department,
      appointmentCount: r.appointment_count
    }))
    res.json(camelCased)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch patients list' })
  }
})

// Get Single Patient Detail
router.get('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params
  try {
    const patientQuery = await pool.query(
      `SELECT p.*, u.name, u.email, u.phone 
       FROM patients p 
       JOIN users u ON p.id = u.id 
       WHERE p.id = $1`,
      [id]
    )
    if (patientQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' })
    }
    const r = patientQuery.rows[0]
    res.json({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      age: r.age,
      gender: r.gender,
      bloodGroup: r.blood_group,
      condition: r.condition,
      status: r.status,
      address: r.address,
      allergies: r.allergies,
      insurance: r.insurance,
      doctor: r.doctor,
      department: r.department,
      lastVisit: r.last_visit,
      appointmentCount: r.appointment_count
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve patient profile details' })
  }
})

// Create New Patient (and user)
router.post('/', authenticateJWT, requireRole(['admin', 'receptionist']), async (req, res) => {
  const { name, email, phone, age, gender, bloodGroup, condition, address, allergies, insurance, doctor, department } = req.body
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' })
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const checkUser = await client.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()])
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: 'A user account with this email already exists' })
    }

    const userId = `U${Date.now()}`
    const passwordHash = bcrypt.hashSync('patient123', 10) // default password

    await client.query(
      'INSERT INTO users (id, name, email, password_hash, role, phone) VALUES ($1, $2, $3, $4, $5, $6)',
      [userId, name, email.toLowerCase(), passwordHash, 'patient', phone || null]
    )

    await client.query(
      'INSERT INTO patients (id, age, gender, blood_group, condition, address, allergies, insurance, status, doctor, department, last_visit, appointment_count) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_DATE, 1)',
      [userId, age || 30, gender || 'Male', bloodGroup || 'O+', condition || null, address || null, allergies || 'None', insurance || null, 'Active', doctor || 'Dr. Priya Mehta', department || 'Cardiology']
    )

    await client.query('COMMIT')
    res.status(201).json({
      id: userId,
      name,
      email,
      phone,
      age,
      gender,
      bloodGroup,
      condition,
      address,
      allergies,
      insurance,
      status: 'Active'
    })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error(err)
    res.status(500).json({ error: 'Failed to insert patient' })
  } finally {
    client.release()
  }
})

router.put('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params
  const { name, phone, age, gender, bloodGroup, condition, address, allergies, insurance, status, doctor, department } = req.body

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    if (name || phone) {
      await client.query(
        'UPDATE users SET name = COALESCE($1, name), phone = COALESCE($2, phone) WHERE id = $3',
        [name, phone, id]
      )
    }

    await client.query(
      `UPDATE patients SET 
        age = COALESCE($1, age), 
        gender = COALESCE($2, gender), 
        blood_group = COALESCE($3, blood_group), 
        condition = COALESCE($4, condition), 
        address = COALESCE($5, address), 
        allergies = COALESCE($6, allergies), 
        insurance = COALESCE($7, insurance),
        status = COALESCE($8, status),
        doctor = COALESCE($9, doctor),
        department = COALESCE($10, department)
       WHERE id = $11`,
      [age, gender, bloodGroup, condition, address, allergies, insurance, status, doctor, department, id]
    )

    await client.query('COMMIT')
    res.json({ message: 'Patient updated successfully' })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error(err)
    res.status(500).json({ error: 'Failed to update patient profile' })
  } finally {
    client.release()
  }
})

// Delete Patient
router.delete('/:id', authenticateJWT, requireRole(['admin']), async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id])
    res.json({ message: 'Patient deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete patient' })
  }
})

export default router
