import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  mockPatients as initialPatients,
  mockDoctors as initialDoctors,
  mockAppointments as initialAppointments,
  mockInvoices as initialInvoices,
  mockPrescriptions as initialPrescriptions,
  mockNotifications as initialNotifications,
  adminStats as initialAdminStats,
} from '../data/mockData'

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
  adminStats: typeof initialAdminStats

  // Patient actions
  addPatient: (patient: Omit<Patient, 'id' | 'appointmentCount' | 'lastVisit' | 'photo'>) => void
  updatePatient: (id: string, updates: Partial<Patient>) => void
  deletePatient: (id: string) => void

  // Doctor actions
  addDoctor: (doctor: Omit<Doctor, 'id' | 'patients' | 'rating' | 'photo'>) => void
  updateDoctor: (id: string, updates: Partial<Doctor>) => void

  // Appointment actions
  addAppointment: (appt: Omit<Appointment, 'id' | 'status'>) => void
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void
  rescheduleAppointment: (id: string, date: string, time: string) => void

  // Prescription actions
  addPrescription: (rx: Omit<Prescription, 'id' | 'date'>) => void

  // Invoice actions
  addInvoice: (invoice: Omit<Invoice, 'id' | 'date' | 'status' | 'paid'>) => void
  payInvoice: (id: string, scannedImageUrl?: string) => void

  // Notification actions
  addNotification: (type: Notification['type'], message: string) => void
  markNotificationsRead: () => void
}

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      patients: initialPatients as Patient[],
      doctors: initialDoctors as Doctor[],
      appointments: initialAppointments as Appointment[],
      invoices: initialInvoices as Invoice[],
      prescriptions: initialPrescriptions as Prescription[],
      notifications: initialNotifications as Notification[],
      adminStats: initialAdminStats,

      addPatient: (p) => set((state) => {
        const nextId = `P${String(state.patients.length + 1).padStart(3, '0')}`
        const newPatient: Patient = {
          ...p,
          id: nextId,
          appointmentCount: 0,
          lastVisit: 'Never',
          photo: null,
        }
        
        // Update admin stats
        const updatedStats = {
          ...state.adminStats,
          totalPatients: state.adminStats.totalPatients + 1
        }

        return { 
          patients: [...state.patients, newPatient],
          adminStats: updatedStats
        }
      }),

      updatePatient: (id, updates) => set((state) => ({
        patients: state.patients.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      })),

      deletePatient: (id) => set((state) => {
        const updatedStats = {
          ...state.adminStats,
          totalPatients: Math.max(0, state.adminStats.totalPatients - 1)
        }
        return {
          patients: state.patients.filter((p) => p.id !== id),
          adminStats: updatedStats
        }
      }),

      addDoctor: (d) => set((state) => {
        const nextId = `D${String(state.doctors.length + 1).padStart(3, '0')}`
        const newDoctor: Doctor = {
          ...d,
          id: nextId,
          patients: 0,
          rating: 5.0,
          photo: null,
        }

        const updatedStats = {
          ...state.adminStats,
          totalDoctors: state.adminStats.totalDoctors + 1
        }

        return { 
          doctors: [...state.doctors, newDoctor],
          adminStats: updatedStats
        }
      }),

      updateDoctor: (id, updates) => set((state) => ({
        doctors: state.doctors.map((d) => (d.id === id ? { ...d, ...updates } : d)),
      })),

      addAppointment: (appt) => set((state) => {
        const nextId = `A${String(state.appointments.length + 1).padStart(3, '0')}`
        const newAppt: Appointment = {
          ...appt,
          id: nextId,
          status: 'Scheduled',
        }

        // Send a notification if priority is emergency
        const isEmergency = appt.priority === 'Emergency'
        const updatedStats = {
          ...state.adminStats,
          todayAppointments: state.adminStats.todayAppointments + 1,
          emergencyCases: isEmergency ? state.adminStats.emergencyCases + 1 : state.adminStats.emergencyCases
        }

        // Add to notification list
        const notifMsg = `${isEmergency ? 'EMERGENCY: ' : ''}New appointment booked by ${appt.patientName} with ${appt.doctorName}`
        const nextNotifId = state.notifications.length + 1
        const newNotif: Notification = {
          id: nextNotifId,
          type: isEmergency ? 'emergency' : 'appointment',
          message: notifMsg,
          time: 'Just now',
          read: false,
        }

        return {
          appointments: [...state.appointments, newAppt],
          adminStats: updatedStats,
          notifications: [newNotif, ...state.notifications],
        }
      }),

      updateAppointmentStatus: (id, status) => set((state) => {
        const appts = state.appointments.map((a) => {
          if (a.id === id) {
            // If it transitions to Confirmed or In Progress, update patient/doctor counts
            const oldStatus = a.status
            if ((status === 'Confirmed' || status === 'In Progress') && oldStatus !== 'Confirmed' && oldStatus !== 'In Progress') {
              // Update last visit for patient
              setTimeout(() => {
                get().updatePatient(a.patientId, { 
                  lastVisit: new Date().toISOString().split('T')[0],
                  appointmentCount: get().patients.find(p => p.id === a.patientId)!.appointmentCount + 1
                })
                get().updateDoctor(a.doctorId, {
                  patients: get().doctors.find(d => d.id === a.doctorId)!.patients + 1
                })
              }, 0)
            }
            return { ...a, status }
          }
          return a
        })

        return { appointments: appts }
      }),

      rescheduleAppointment: (id, date, time) => set((state) => ({
        appointments: state.appointments.map((a) => (a.id === id ? { ...a, date, time, status: 'Scheduled' } : a)),
      })),

      addPrescription: (rx) => set((state) => {
        const nextId = `RX${String(state.prescriptions.length + 1).padStart(3, '0')}`
        const newRx: Prescription = {
          ...rx,
          id: nextId,
          date: new Date().toISOString().split('T')[0],
        }
        return { prescriptions: [...state.prescriptions, newRx] }
      }),

      addInvoice: (invoice) => set((state) => {
        const nextId = `INV-2026-${String(state.invoices.length + 143).padStart(4, '0')}`
        const newInvoice: Invoice = {
          ...invoice,
          id: nextId,
          date: new Date().toISOString().split('T')[0],
          status: 'Pending',
          paid: 0,
        }
        return { invoices: [...state.invoices, newInvoice] }
      }),

      payInvoice: (id, scannedImageUrl) => set((state) => {
        const invs = state.invoices.map((inv) => {
          if (inv.id === id) {
            // Update adminStats revenue
            setTimeout(() => {
              set((prev) => ({
                adminStats: {
                  ...prev.adminStats,
                  monthlyRevenue: prev.adminStats.monthlyRevenue + inv.amount,
                  pendingBills: Math.max(0, prev.adminStats.pendingBills - 1),
                }
              }))
            }, 0)
            return { 
              ...inv, 
              paid: inv.amount, 
              status: 'Paid' as const, 
              scannedImageUrl: scannedImageUrl || inv.scannedImageUrl 
            }
          }
          return inv
        })

        // Also add system notification for payment
        const paidInvoice = state.invoices.find(inv => inv.id === id)
        const nextNotifId = state.notifications.length + 1
        const newNotif: Notification = {
          id: nextNotifId,
          type: 'payment',
          message: `Invoice ${id} of ₹${paidInvoice?.amount.toLocaleString()} paid by ${paidInvoice?.patientName}`,
          time: 'Just now',
          read: false,
        }

        return { 
          invoices: invs,
          notifications: [newNotif, ...state.notifications]
        }
      }),

      addNotification: (type, message) => set((state) => {
        const nextId = state.notifications.length + 1
        const newNotif: Notification = {
          id: nextId,
          type,
          message,
          time: 'Just now',
          read: false,
        }
        return { notifications: [newNotif, ...state.notifications] }
      }),

      markNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      })),
    }),
    { name: 'medisync-hospital-data' }
  )
)
