import { Router } from 'express'
import { pool } from '../config/db'
import { authenticateJWT } from '../middleware/auth'

const router = Router()

// Get All Prescriptions
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM prescriptions ORDER BY date DESC')
    
    // Map camelCase fields for React
    const camelCased = rows.map(r => ({
      id: r.id,
      patientId: r.patient_id,
      patientName: r.patient_name,
      doctorName: r.doctor_name,
      date: new Date(r.date).toISOString().split('T')[0],
      medications: typeof r.medications === 'string' ? JSON.parse(r.medications) : r.medications,
      notes: r.notes,
      scannedImageUrl: r.scanned_image_url,
      signatureBase64: r.signature_base64
    }))
    res.json(camelCased)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch prescriptions list' })
  }
})

// Create New Prescription
router.post('/', authenticateJWT, async (req, res) => {
  const { patientId, patientName, doctorName, medications, notes, signatureBase64, scannedImageUrl } = req.body
  if (!patientId || !patientName) {
    return res.status(400).json({ error: 'Patient ID and Name are required' })
  }

  try {
    const rxId = `RX${String(Date.now()).slice(-3)}` // unique prescription ID suffix
    const medsJson = medications ? JSON.stringify(medications) : null

    await pool.query(
      `INSERT INTO prescriptions (id, patient_id, patient_name, doctor_name, date, medications, notes, scanned_image_url, signature_base64) 
       VALUES ($1, $2, $3, $4, CURRENT_DATE, $5, $6, $7, $8)`,
      [rxId, patientId, patientName, doctorName, medsJson, notes || '', scannedImageUrl || null, signatureBase64 || null]
    )

    res.status(201).json({
      id: rxId,
      patientId,
      patientName,
      doctorName,
      date: new Date().toISOString().split('T')[0],
      medications,
      notes,
      scannedImageUrl,
      signatureBase64
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to save prescription' })
  }
})

export default router
