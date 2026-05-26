import { Router } from 'express'
import { pool } from '../config/db'
import { authenticateJWT } from '../middleware/auth'

const router = Router()

// Get All Notifications
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM notifications ORDER BY id DESC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications list' })
  }
})

// Mark All Notifications as Read
router.post('/read', authenticateJWT, async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET read = TRUE')
    res.json({ message: 'Notifications marked as read' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notifications read status' })
  }
})

export default router
