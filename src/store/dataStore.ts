import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAuthStore } from './authStore'

export interface Patient {
  id: string
  name: string
  age: number
  gender: string
  phone: string
  email: string
  bloodGroup: string
  condition: string
  status: 'Active' | 'Inactive' | 'Critical'
  lastVisit: string
  doctor: string
  department: string
  address: string
  allergies: string
  insurance: string
  appointmentCount: number
  photo: string | null
}

export interface Doctor {
  id: string
  name: string
  specialty: string
  department: string
  experience: string
  phone: string
  email: string
  status: 'Available' | 'Busy' | 'On Leave'
  patients: number
  rating: number
  consultationFee: number
  schedule: string
  qualifications: string
  photo: string | null
  digitalSignatureUrl?: string
}

export interface Appointment {
  id: string
  patientName: string
  patientId: string
  doctorName: string
  doctorId: string
  date: string
  time: string
  type: string
  status: 'Scheduled' | 'Waiting' | 'In Progress' | 'Confirmed' | 'Cancelled'
  department: string
  priority: 'Normal' | 'High' | 'Emergency'
  notes: string
  fee: number
}

export interface ServiceCharge {
  name: string
  amount: number
}

export interface Invoice {
  id: string
  patientName: string
  patientId: string
  date: string
  dueDate: string
  amount: number
  paid: number
  status: 'Paid' | 'Pending' | 'Partial' | 'Overdue'
  services: ServiceCharge[]
  scannedImageUrl?: string
}

export interface Prescription {
  id: string
  patientId: string
  patientName: string
  doctorName: string
  date: string
  medications: Array<{
    name: string
    dosage: string
    frequency: string
    duration: string
  }>
  notes: string
  scannedImageUrl?: string
  signatureBase64?: string
}

export interface Notification {
  id: number
  type: 'appointment' | 'emergency' | 'payment' | 'system' | 'cancel'
  message: string
  time: string
  read: boolean
}

interface DataState {
  patients: Patient[]
  doctors: Doctor[]
  appointments: Appointment[]
  invoices: Invoice[]
  prescriptions: Prescription[]
  notifications: Notification[]
  adminStats: {
    totalPatients: number
    totalDoctors: number
    todayAppointments: number
    monthlyRevenue: number
    pendingBills: number
    emergencyCases: number
    bedOccupancy: number
    avgWaitTime: number
  }

  fetchData: () => Promise<void>
  addPatient: (patient: Omit<Patient, 'id' | 'appointmentCount' | 'lastVisit' | 'photo'>) => Promise<void>
  updatePatient: (id: string, updates: Partial<Patient>) => Promise<void>
  deletePatient: (id: string) => Promise<void>
  addDoctor: (doctor: Omit<Doctor, 'id' | 'patients' | 'rating' | 'photo'>) => Promise<void>
  updateDoctor: (id: string, updates: Partial<Doctor>) => Promise<void>
  addAppointment: (appt: Omit<Appointment, 'id' | 'status'>) => Promise<void>
  updateAppointmentStatus: (id: string, status: Appointment['status']) => Promise<void>
  rescheduleAppointment: (id: string, date: string, time: string) => Promise<void>
  addPrescription: (rx: Omit<Prescription, 'id' | 'date'>) => Promise<void>
  addInvoice: (invoice: Omit<Invoice, 'id' | 'date' | 'status' | 'paid'>) => Promise<void>
  payInvoice: (id: string, scannedImageUrl?: string) => Promise<void>
  addNotification: (type: Notification['type'], message: string) => Promise<void>
  markNotificationsRead: () => Promise<void>
}

const API_URL = import.meta.env.VITE_API_URL || ''

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      patients: [],
      doctors: [],
      appointments: [],
      invoices: [],
      prescriptions: [],
      notifications: [],
      adminStats: {
        totalPatients: 0,
        totalDoctors: 0,
        todayAppointments: 0,
        monthlyRevenue: 0,
        pendingBills: 0,
        emergencyCases: 3,
        bedOccupancy: 72,
        avgWaitTime: 18,
      },

      fetchData: async () => {
        const token = useAuthStore.getState().token
        if (!token) return
        const headers = { 'Authorization': `Bearer ${token}` }
        
        try {
          const [patientsRes, doctorsRes, appointmentsRes, prescriptionsRes, invoicesRes, notificationsRes] = await Promise.all([
            fetch(`${API_URL}/api/patients`, { headers }),
            fetch(`${API_URL}/api/doctors`, { headers }),
            fetch(`${API_URL}/api/appointments`, { headers }),
            fetch(`${API_URL}/api/prescriptions`, { headers }),
            fetch(`${API_URL}/api/invoices`, { headers }),
            fetch(`${API_URL}/api/notifications`, { headers })
          ])

          let patientsData: Patient[] = []
          let doctorsData: Doctor[] = []
          let appointmentsData: Appointment[] = []
          let prescriptionsData: Prescription[] = []
          let invoicesData: Invoice[] = []
          let notificationsData: Notification[] = []

          if (patientsRes.ok) patientsData = await patientsRes.json()
          if (doctorsRes.ok) doctorsData = await doctorsRes.json()
          if (appointmentsRes.ok) appointmentsData = await appointmentsRes.json()
          if (prescriptionsRes.ok) prescriptionsData = await prescriptionsRes.json()
          if (invoicesRes.ok) invoicesData = await invoicesRes.json()
          if (notificationsRes.ok) notificationsData = await notificationsRes.json()

          // Compute live totals
          const totalPaid = invoicesData.reduce((s, i) => s + i.paid, 0)
          const pendingInvoices = invoicesData.filter(i => i.status !== 'Paid')
          const todayDateStr = new Date().toISOString().split('T')[0]
          const todayAppts = appointmentsData.filter(a => a.date === todayDateStr || a.date === '2026-05-16')
          const emergencyCount = appointmentsData.filter(a => a.priority === 'Emergency').length

          set({
            patients: patientsData,
            doctors: doctorsData,
            appointments: appointmentsData,
            prescriptions: prescriptionsData,
            invoices: invoicesData,
            notifications: notificationsData,
            adminStats: {
              totalPatients: patientsData.length,
              totalDoctors: doctorsData.length,
              todayAppointments: todayAppts.length,
              monthlyRevenue: totalPaid,
              pendingBills: pendingInvoices.length,
              emergencyCases: emergencyCount || 3,
              bedOccupancy: 72,
              avgWaitTime: 18,
            }
          })
        } catch (err) {
          console.error('Failed to sync stateful API lists:', err)
        }
      },

      addPatient: async (p) => {
        const token = useAuthStore.getState().token
        try {
          const res = await fetch(`${API_URL}/api/patients`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(p)
          })
          if (res.ok) {
            await get().fetchData()
          }
        } catch (err) {
          console.error('API Error adding patient:', err)
        }
      },

      updatePatient: async (id, updates) => {
        const token = useAuthStore.getState().token
        try {
          const res = await fetch(`${API_URL}/api/patients/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updates)
          })
          if (res.ok) {
            await get().fetchData()
          }
        } catch (err) {
          console.error('API Error updating patient:', err)
        }
      },

      deletePatient: async (id) => {
        const token = useAuthStore.getState().token
        try {
          const res = await fetch(`${API_URL}/api/patients/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          })
          if (res.ok) {
            await get().fetchData()
          }
        } catch (err) {
          console.error('API Error deleting patient:', err)
        }
      },

      addDoctor: async (d) => {
        const token = useAuthStore.getState().token
        try {
          const res = await fetch(`${API_URL}/api/doctors`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(d)
          })
          if (res.ok) {
            await get().fetchData()
          }
        } catch (err) {
          console.error('API Error adding doctor:', err)
        }
      },

      updateDoctor: async (id, updates) => {
        const token = useAuthStore.getState().token
        try {
          const res = await fetch(`${API_URL}/api/doctors/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updates)
          })
          if (res.ok) {
            await get().fetchData()
          }
        } catch (err) {
          console.error('API Error updating doctor:', err)
        }
      },

      addAppointment: async (appt) => {
        const token = useAuthStore.getState().token
        try {
          const res = await fetch(`${API_URL}/api/appointments`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(appt)
          })
          if (res.ok) {
            await get().fetchData()
          }
        } catch (err) {
          console.error('API Error scheduling appointment:', err)
        }
      },

      updateAppointmentStatus: async (id, status) => {
        const token = useAuthStore.getState().token
        try {
          const res = await fetch(`${API_URL}/api/appointments/${id}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
          })
          if (res.ok) {
            await get().fetchData()
          }
        } catch (err) {
          console.error('API Error updating appointment status:', err)
        }
      },

      rescheduleAppointment: async (id, date, time) => {
        const token = useAuthStore.getState().token
        try {
          const res = await fetch(`${API_URL}/api/appointments/${id}/reschedule`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ date, time })
          })
          if (res.ok) {
            await get().fetchData()
          }
        } catch (err) {
          console.error('API Error rescheduling appointment:', err)
        }
      },

      addPrescription: async (rx) => {
        const token = useAuthStore.getState().token
        try {
          const res = await fetch(`${API_URL}/api/prescriptions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(rx)
          })
          if (res.ok) {
            await get().fetchData()
          }
        } catch (err) {
          console.error('API Error saving prescription:', err)
        }
      },

      addInvoice: async (invoice) => {
        const token = useAuthStore.getState().token
        try {
          const res = await fetch(`${API_URL}/api/invoices`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(invoice)
          })
          if (res.ok) {
            await get().fetchData()
          }
        } catch (err) {
          console.error('API Error generating invoice:', err)
        }
      },

      payInvoice: async (id, scannedImageUrl) => {
        const token = useAuthStore.getState().token
        try {
          const res = await fetch(`${API_URL}/api/invoices/${id}/pay`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ scannedImageUrl })
          })
          if (res.ok) {
            await get().fetchData()
          }
        } catch (err) {
          console.error('API Error paying invoice:', err)
        }
      },

      addNotification: async (type, message) => {
        // Handled automatically on DB inserts or system actions,
        // but can fallback locally or sync
      },

      markNotificationsRead: async () => {
        const token = useAuthStore.getState().token
        try {
          const res = await fetch(`${API_URL}/api/notifications/read`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          })
          if (res.ok) {
            await get().fetchData()
          }
        } catch (err) {
          console.error('API Error reading notifications:', err)
        }
      }
    }),
    { name: 'medisync-hospital-data' }
  )
)
