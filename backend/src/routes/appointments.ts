import { Router } from 'express'
import { pool } from '../config/db'
import { authenticateJWT } from '../middleware/auth'

const router = Router()

// Get All Appointments
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM appointments ORDER BY date DESC, time ASC')
    
    // Map camelCase fields for React
    const camelCased = rows.map(r => ({
      id: r.id,
      patientName: r.patient_name,
      patientId: r.patient_id,
      doctorName: r.doctor_name,
      doctorId: r.doctor_id,
      date: new Date(r.date).toISOString().split('T')[0],
      time: r.time,
      type: r.type,
      status: r.status,
      department: r.department,
      priority: r.priority,
      notes: r.notes,
      fee: r.fee
    }))
    res.json(camelCased)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch appointments list' })
  }
})

// Create New Appointment
router.post('/', authenticateJWT, async (req, res) => {
  const { patientId, patientName, doctorId, doctorName, date, time, type, department, priority, notes, fee } = req.body
  if (!patientId || !doctorId || !date || !time) {
    return res.status(400).json({ error: 'Patient, Doctor, Date, and Time are required' })
  }

  try {
    const appointmentId = `A${String(Date.now()).slice(-3)}` // 3-digit unique appointment ID suffix

    await pool.query(
      `INSERT INTO appointments 
        (id, patient_name, patient_id, doctor_name, doctor_id, date, time, type, status, department, priority, notes, fee) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [appointmentId, patientName, patientId, doctorName, doctorId, date, time, type || 'Consultation', 'Scheduled', department || 'General Practice', priority || 'Normal', notes || '', fee || 500]
    )

    // Log a notification for the system
    const notifMsg = `New appointment booked by ${patientName} with ${doctorName}`
    await pool.query(
      'INSERT INTO notifications (type, message) VALUES ($1, $2)',
      [priority === 'Emergency' ? 'emergency' : 'appointment', notifMsg]
    )

    res.status(201).json({
      id: appointmentId,
      patientName,
      patientId,
      doctorName,
      doctorId,
      date,
      time,
      type,
      status: 'Scheduled',
      department,
      priority,
      notes,
      fee
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to schedule appointment' })
  }
})

// Update Appointment Status
router.put('/:id/status', authenticateJWT, async (req, res) => {
  const { id } = req.params
  const { status } = req.body
  if (!status) return res.status(400).json({ error: 'Status is required' })

  try {
    const { rows } = await pool.query('UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *', [status, id])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' })
    }
    res.json({ message: 'Appointment status updated successfully', appointment: rows[0] })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update appointment status' })
  }
})

// Reschedule Appointment
router.put('/:id/reschedule', authenticateJWT, async (req, res) => {
  const { id } = req.params
  const { date, time } = req.body
  if (!date || !time) return res.status(400).json({ error: 'Date and Time are required' })

  try {
    const { rows } = await pool.query(
      'UPDATE appointments SET date = $1, time = $2, status = \'Scheduled\' WHERE id = $3 RETURNING *',
      [date, time, id]
    )
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' })
    }
    res.json({ message: 'Appointment rescheduled successfully', appointment: rows[0] })
  } catch (err) {
    res.status(500).json({ error: 'Failed to reschedule appointment' })
  }
})

export default router
