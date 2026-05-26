import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/medisync'

export const pool = new Pool({
  connectionString,
})

// Retry connection logic for Docker startup sync
export const connectWithRetry = async (retries = 10, delay = 3000): Promise<void> => {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect()
      console.log('Successfully connected to PostgreSQL database')
      client.release()
      return
    } catch (err) {
      console.error(`PostgreSQL connection attempt ${i + 1} failed. Retrying in ${delay / 1000}s...`)
      if (err instanceof Error) {
        console.error(err.message)
      }
      await new Promise(res => setTimeout(res, delay))
    }
  }
  throw new Error('Could not connect to database after maximum retries')
}
