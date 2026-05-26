import { Router } from 'express'
import { pool } from '../config/db'
import { authenticateJWT } from '../middleware/auth'

const router = Router()

// Get All Invoices (with their service charges)
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const invoicesQuery = await pool.query('SELECT * FROM invoices ORDER BY date DESC')
    const chargesQuery = await pool.query('SELECT * FROM service_charges')
    
    // Group service charges by invoice_id
    const chargesByInvoice: Record<string, Array<{ name: string; amount: number }>> = {}
    chargesQuery.rows.forEach(c => {
      if (!chargesByInvoice[c.invoice_id]) {
        chargesByInvoice[c.invoice_id] = []
      }
      chargesByInvoice[c.invoice_id].push({
        name: c.name,
        amount: c.amount
      })
    })

    // Map camelCase fields for React
    const camelCased = invoicesQuery.rows.map(inv => ({
      id: inv.id,
      patientName: inv.patient_name,
      patientId: inv.patient_id,
      date: new Date(inv.date).toISOString().split('T')[0],
      dueDate: new Date(inv.due_date).toISOString().split('T')[0],
      amount: inv.amount,
      paid: inv.paid,
      status: inv.status,
      services: chargesByInvoice[inv.id] || [],
      scannedImageUrl: inv.scanned_image_url
    }))

    res.json(camelCased)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch invoices list' })
  }
})

// Create New Invoice (and its service charges)
router.post('/', authenticateJWT, async (req, res) => {
  const { patientId, patientName, dueDate, amount, services } = req.body
  if (!patientId || !patientName || !dueDate || !amount) {
    return res.status(400).json({ error: 'Patient, Due Date, and Amount are required' })
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const invoiceId = `INV-2026-${String(Date.now()).slice(-4)}` // unique invoice ID suffix

    // Insert Invoice
    await client.query(
      `INSERT INTO invoices (id, patient_name, patient_id, date, due_date, amount, paid, status) 
       VALUES ($1, $2, $3, CURRENT_DATE, $4, $5, 0, 'Pending')`,
      [invoiceId, patientName, patientId, dueDate, amount]
    )

    // Insert Service Charges
    if (services && Array.isArray(services)) {
      for (const s of services) {
        await client.query(
          'INSERT INTO service_charges (invoice_id, name, amount) VALUES ($1, $2, $3)',
          [invoiceId, s.name, s.amount]
        )
      }
    }

    await client.query('COMMIT')
    res.status(201).json({
      id: invoiceId,
      patientName,
      patientId,
      date: new Date().toISOString().split('T')[0],
      dueDate,
      amount,
      paid: 0,
      status: 'Pending',
      services: services || []
    })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error(err)
    res.status(500).json({ error: 'Failed to generate invoice' })
  } finally {
    client.release()
  }
})

// Pay Invoice
router.post('/:id/pay', authenticateJWT, async (req, res) => {
  const { id } = req.params
  const { scannedImageUrl } = req.body

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const checkInvoice = await client.query('SELECT * FROM invoices WHERE id = $1', [id])
    if (checkInvoice.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' })
    }

    const inv = checkInvoice.rows[0]

    // Update Invoice
    await client.query(
      'UPDATE invoices SET paid = amount, status = \'Paid\', scanned_image_url = COALESCE($1, scanned_image_url) WHERE id = $2',
      [scannedImageUrl || null, id]
    )

    // Log payment notification
    const notifMsg = `Invoice ${id} of ₹${Number(inv.amount).toLocaleString()} paid by ${inv.patient_name}`
    await client.query(
      'INSERT INTO notifications (type, message) VALUES ($1, $2)',
      ['payment', notifMsg]
    )

    await client.query('COMMIT')
    res.json({ message: 'Invoice paid successfully', invoiceId: id })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error(err)
    res.status(500).json({ error: 'Failed to process payment' })
  } finally {
    client.release()
  }
})

export default router
