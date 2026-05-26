import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { pool } from '../config/db'
import { authenticateJWT, requireRole } from '../middleware/auth'

const router = Router()

// Get All Doctors
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT d.*, u.name, u.email, u.phone, dep.name AS department_name 
       FROM doctors d 
       JOIN users u ON d.id = u.id 
       LEFT JOIN departments dep ON d.department_id = dep.id
       ORDER BY u.name ASC`
    )
    
    // Map camelCase fields for React
    const camelCased = rows.map(r => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      specialty: r.specialty,
      departmentId: r.department_id,
      department: r.department_name || 'General Practice',
      experience: r.experience,
      consultationFee: r.consultation_fee,
      schedule: r.schedule,
      qualifications: r.qualifications,
      status: r.status,
      rating: Number(r.rating) || 5.0,
      patients: 10, // Mock patient count
      digitalSignatureUrl: r.digital_signature_url
    }))
    res.json(camelCased)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch doctors list' })
  }
})

// Create New Doctor
router.post('/', authenticateJWT, requireRole(['admin']), async (req, res) => {
  const { name, email, phone, specialty, departmentId, experience, consultationFee, schedule, qualifications, status } = req.body
  if (!name || !email || !specialty) {
    return res.status(400).json({ error: 'Name, email, and specialty are required' })
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const checkUser = await client.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()])
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: 'A user account with this email already exists' })
    }

    const userId = `U${Date.now()}`
    const passwordHash = bcrypt.hashSync('doctor123', 10) // default password

    await client.query(
      'INSERT INTO users (id, name, email, password_hash, role, phone) VALUES ($1, $2, $3, $4, $5, $6)',
      [userId, name, email.toLowerCase(), passwordHash, 'doctor', phone || null]
    )

    await client.query(
      'INSERT INTO doctors (id, specialty, department_id, experience, consultation_fee, schedule, qualifications, status, rating) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [userId, specialty, departmentId || 'DEP01', experience || '5 years', consultationFee || 500, schedule || 'Mon-Fri 9AM-5PM', qualifications || 'MBBS', status || 'Available', 5.0]
    )

    await client.query('COMMIT')
    res.status(201).json({
      id: userId,
      name,
      email,
      phone,
      specialty,
      departmentId,
      experience,
      consultationFee,
      schedule,
      qualifications,
      status: status || 'Available',
      rating: 5.0
    })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error(err)
    res.status(500).json({ error: 'Failed to insert doctor record' })
  } finally {
    client.release()
  }
})

// Update Doctor
router.put('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params
  const { name, phone, specialty, departmentId, experience, consultationFee, schedule, qualifications, status, digitalSignatureUrl } = req.body

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
      `UPDATE doctors SET 
        specialty = COALESCE($1, specialty), 
        department_id = COALESCE($2, department_id), 
        experience = COALESCE($3, experience), 
        consultation_fee = COALESCE($4, consultation_fee), 
        schedule = COALESCE($5, schedule), 
        qualifications = COALESCE($6, qualifications), 
        status = COALESCE($7, status),
        digital_signature_url = COALESCE($8, digital_signature_url)
       WHERE id = $9`,
      [specialty, departmentId, experience, consultationFee, schedule, qualifications, status, digitalSignatureUrl, id]
    )

    await client.query('COMMIT')
    res.json({ message: 'Doctor updated successfully' })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error(err)
    res.status(500).json({ error: 'Failed to update doctor details' })
  } finally {
    client.release()
  }
})

// Delete Doctor
router.delete('/:id', authenticateJWT, requireRole(['admin']), async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id])
    res.json({ message: 'Doctor deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete doctor' })
  }
})

export default router
