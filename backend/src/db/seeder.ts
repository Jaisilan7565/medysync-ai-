import { pool } from '../config/db'
import bcrypt from 'bcryptjs'

export const seedDatabase = async () => {
  const client = await pool.connect()
  try {
    // Check if users already exist
    const { rows } = await client.query('SELECT COUNT(*) FROM users')
    const count = parseInt(rows[0].count)
    if (count > 0) {
      console.log('Database already has data. Skipping seeder.')
      return
    }

    console.log('Database is empty. Running seeder...')

    await client.query('BEGIN')

    // 1. Seed Departments
    const depts = [
      { id: 'DEP01', name: 'Cardiology', head: null, icon: '❤️', color: 'red' },
      { id: 'DEP02', name: 'Endocrinology', head: null, icon: '🔬', color: 'blue' },
      { id: 'DEP03', name: 'Orthopedics', head: null, icon: '🦴', color: 'orange' },
      { id: 'DEP04', name: 'Pulmonology', head: null, icon: '🫁', color: 'sky' },
      { id: 'DEP05', name: 'Neurology', head: null, icon: '🧠', color: 'purple' },
      { id: 'DEP06', name: 'Nephrology', head: null, icon: '🫘', color: 'teal' }
    ]

    for (const d of depts) {
      await client.query(
        'INSERT INTO departments (id, name, head_doctor_id, icon, color) VALUES ($1, $2, $3, $4, $5)',
        [d.id, d.name, d.head, d.icon, d.color]
      )
    }

    // 2. Seed Default Auth Users and Doctor/Patient details
    const passwordHashes = {
      admin: bcrypt.hashSync('admin123', 10),
      doctor: bcrypt.hashSync('doctor123', 10),
      recept: bcrypt.hashSync('recept123', 10),
      patient: bcrypt.hashSync('patient123', 10),
      pharmacy: bcrypt.hashSync('pharmacy123', 10),
      general: bcrypt.hashSync('password123', 10)
    }

    // 2a. Users
    const users = [
      // Admins
      { id: 'U001', name: 'Dr. Admin Singh', email: 'admin@medisync.ai', password_hash: passwordHashes.admin, role: 'admin', phone: '+91 99999 88888' },
      
      // Doctors
      { id: 'D001', name: 'Dr. Priya Mehta', email: 'doctor@medisync.ai', password_hash: passwordHashes.doctor, role: 'doctor', phone: '+91 99887 76655' },
      { id: 'D002', name: 'Dr. Rajan Nair', email: 'rajan.nair@medisync.ai', password_hash: passwordHashes.general, role: 'doctor', phone: '+91 88776 65544' },
      { id: 'D003', name: 'Dr. Anita Desai', email: 'anita.desai@medisync.ai', password_hash: passwordHashes.general, role: 'doctor', phone: '+91 77665 54433' },
      { id: 'D004', name: 'Dr. Suresh Kumar', email: 'suresh.kumar@medisync.ai', password_hash: passwordHashes.general, role: 'doctor', phone: '+91 66554 43322' },
      { id: 'D005', name: 'Dr. Alok Verma', email: 'alok.verma@medisync.ai', password_hash: passwordHashes.general, role: 'doctor', phone: '+91 55443 32211' },
      { id: 'D006', name: 'Dr. Kavita Joshi', email: 'kavita.joshi@medisync.ai', password_hash: passwordHashes.general, role: 'doctor', phone: '+91 44332 21100' },
      
      // Receptionist
      { id: 'U003', name: 'Anjali Sharma', email: 'receptionist@medisync.ai', password_hash: passwordHashes.recept, role: 'receptionist', phone: '+91 99112 23344' },
      
      // Patients
      { id: 'P001', name: 'Aarav Sharma', email: 'patient@medisync.ai', password_hash: passwordHashes.patient, role: 'patient', phone: '+91 98765 43210' },
      { id: 'P002', name: 'Diya Patel', email: 'diya.patel@email.com', password_hash: passwordHashes.general, role: 'patient', phone: '+91 87654 32109' },
      { id: 'P003', name: 'Vikram Singh', email: 'vikram.singh@email.com', password_hash: passwordHashes.general, role: 'patient', phone: '+91 76543 21098' },
      { id: 'P004', name: 'Meera Krishnan', email: 'meera.k@email.com', password_hash: passwordHashes.general, role: 'patient', phone: '+91 65432 10987' },
      { id: 'P005', name: 'Rajesh Gupta', email: 'rajesh.gupta@email.com', password_hash: passwordHashes.general, role: 'patient', phone: '+91 54321 09876' },
      { id: 'P006', name: 'Sunita Rao', email: 'sunita.rao@email.com', password_hash: passwordHashes.general, role: 'patient', phone: '+91 43210 98765' },
      { id: 'P007', name: 'Arjun Nambiar', email: 'arjun.nambiar@email.com', password_hash: passwordHashes.general, role: 'patient', phone: '+91 32109 87654' },
      { id: 'P008', name: 'Lakshmi Iyer', email: 'lakshmi.iyer@email.com', password_hash: passwordHashes.general, role: 'patient', phone: '+91 21098 76543' },
      
      // Pharmacy
      { id: 'U005', name: 'MediSync Pharmacy', email: 'pharmacy@medisync.ai', password_hash: passwordHashes.pharmacy, role: 'pharmacy', phone: '+91 99009 90099' }
    ]

    for (const u of users) {
      await client.query(
        'INSERT INTO users (id, name, email, password_hash, role, phone) VALUES ($1, $2, $3, $4, $5, $6)',
        [u.id, u.name, u.email, u.password_hash, u.role, u.phone]
      )
    }

    // 2b. Doctors details
    const docs = [
      { id: 'D001', specialty: 'Cardiology', department_id: 'DEP01', experience: '15 years', consultation_fee: 800, qualifications: 'MBBS, MD (Cardiology)' },
      { id: 'D002', specialty: 'Endocrinology', department_id: 'DEP02', experience: '12 years', consultation_fee: 700, qualifications: 'MBBS, DM (Endocrinology)' },
      { id: 'D003', specialty: 'Orthopedics', department_id: 'DEP03', experience: '10 years', consultation_fee: 750, qualifications: 'MBBS, MS (Orthopedics)' },
      { id: 'D004', specialty: 'Pulmonology', department_id: 'DEP04', experience: '18 years', consultation_fee: 850, qualifications: 'MBBS, MD (Pulmonology)' },
      { id: 'D005', specialty: 'Neurology', department_id: 'DEP05', experience: '20 years', consultation_fee: 1000, qualifications: 'MBBS, DM (Neurology)' },
      { id: 'D006', specialty: 'Nephrology', department_id: 'DEP06', experience: '8 years', consultation_fee: 650, qualifications: 'MBBS, MD, DM (Nephrology)' }
    ]

    for (const doc of docs) {
      await client.query(
        'INSERT INTO doctors (id, specialty, department_id, experience, consultation_fee, qualifications) VALUES ($1, $2, $3, $4, $5, $6)',
        [doc.id, doc.specialty, doc.department_id, doc.experience, doc.consultation_fee, doc.qualifications]
      )
    }

    // Update departments head doctor IDs
    await client.query("UPDATE departments SET head_doctor_id = 'D001' WHERE id = 'DEP01'")
    await client.query("UPDATE departments SET head_doctor_id = 'D002' WHERE id = 'DEP02'")
    await client.query("UPDATE departments SET head_doctor_id = 'D003' WHERE id = 'DEP03'")
    await client.query("UPDATE departments SET head_doctor_id = 'D004' WHERE id = 'DEP04'")
    await client.query("UPDATE departments SET head_doctor_id = 'D005' WHERE id = 'DEP05'")
    await client.query("UPDATE departments SET head_doctor_id = 'D006' WHERE id = 'DEP06'")

    // 2c. Patients details
    const patientsList = [
      { id: 'P001', age: 34, gender: 'Male', blood_group: 'O+', condition: 'Hypertension', address: 'Mumbai, Maharashtra', allergies: 'Penicillin', insurance: 'Star Health', status: 'Active' },
      { id: 'P002', age: 28, gender: 'Female', blood_group: 'A+', condition: 'Diabetes Type 2', address: 'Ahmedabad, Gujarat', allergies: 'Sulfa drugs', insurance: 'HDFC ERGO', status: 'Active' },
      { id: 'P003', age: 52, gender: 'Male', blood_group: 'B+', condition: 'Arthritis', address: 'Delhi, NCR', allergies: 'None', insurance: 'Max Bupa', status: 'Inactive' },
      { id: 'P004', age: 45, gender: 'Female', blood_group: 'AB-', condition: 'Asthma', address: 'Chennai, Tamil Nadu', allergies: 'Aspirin, Latex', insurance: 'Apollo Munich', status: 'Active' },
      { id: 'P005', age: 61, gender: 'Male', blood_group: 'O-', condition: 'Coronary Artery Disease', address: 'Bangalore, Karnataka', allergies: 'Beta-blockers', insurance: 'Religare', status: 'Critical' },
      { id: 'P006', age: 38, gender: 'Female', blood_group: 'A-', condition: 'Migraine', address: 'Hyderabad, Telangana', allergies: 'Codeine', insurance: 'Bajaj Allianz', status: 'Active' },
      { id: 'P007', age: 29, gender: 'Male', blood_group: 'B-', condition: 'Kidney Stones', address: 'Kochi, Kerala', allergies: 'None', insurance: 'United India', status: 'Active' },
      { id: 'P008', age: 55, gender: 'Female', blood_group: 'AB+', condition: 'Thyroid Disorder', address: 'Coimbatore, Tamil Nadu', allergies: 'Iodine', insurance: 'Star Health', status: 'Active' }
    ]

    for (const pat of patientsList) {
      await client.query(
        'INSERT INTO patients (id, age, gender, blood_group, condition, address, allergies, insurance, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [pat.id, pat.age, pat.gender, pat.blood_group, pat.condition, pat.address, pat.allergies, pat.insurance, pat.status]
      )
    }

    // 3. Seed Appointments
    const appts = [
      { id: 'A001', patientName: 'Aarav Sharma', patientId: 'P001', doctorName: 'Dr. Priya Mehta', doctorId: 'D001', date: '2026-05-16', time: '09:30', type: 'Follow-up', status: 'Confirmed', department: 'Cardiology', priority: 'Normal', notes: 'Blood pressure monitoring', fee: 800 },
      { id: 'A002', patientName: 'Diya Patel', patientId: 'P002', doctorName: 'Dr. Rajan Nair', doctorId: 'D002', date: '2026-05-16', time: '10:00', type: 'Consultation', status: 'Waiting', department: 'Endocrinology', priority: 'Normal', notes: 'HbA1c results review', fee: 700 },
      { id: 'A003', patientName: 'Rajesh Gupta', patientId: 'P005', doctorName: 'Dr. Priya Mehta', doctorId: 'D001', date: '2026-05-16', time: '10:30', type: 'Emergency', status: 'In Progress', department: 'Cardiology', priority: 'Emergency', notes: 'Chest pain episode', fee: 1200 },
      { id: 'A004', patientName: 'Meera Krishnan', patientId: 'P004', doctorName: 'Dr. Suresh Kumar', doctorId: 'D004', date: '2026-05-16', time: '11:00', type: 'Consultation', status: 'Confirmed', department: 'Pulmonology', priority: 'Normal', notes: 'Asthma management plan', fee: 850 },
      { id: 'A005', patientName: 'Sunita Rao', patientId: 'P006', doctorName: 'Dr. Alok Verma', doctorId: 'D005', date: '2026-05-16', time: '11:30', type: 'Follow-up', status: 'Scheduled', department: 'Neurology', priority: 'Normal', notes: 'Migraine medication review', fee: 1000 },
      { id: 'A006', patientName: 'Arjun Nambiar', patientId: 'P007', doctorName: 'Dr. Kavita Joshi', doctorId: 'D006', date: '2026-05-16', time: '14:00', type: 'Procedure', status: 'Scheduled', department: 'Nephrology', priority: 'High', notes: 'Ultrasound-guided procedure', fee: 1500 },
      { id: 'A007', patientName: 'Lakshmi Iyer', patientId: 'P008', doctorName: 'Dr. Rajan Nair', doctorId: 'D002', date: '2026-05-17', time: '09:00', type: 'Consultation', status: 'Scheduled', department: 'Endocrinology', priority: 'Normal', notes: 'Thyroid function review', fee: 700 },
      { id: 'A008', patientName: 'Vikram Singh', patientId: 'P003', doctorName: 'Dr. Anita Desai', doctorId: 'D003', date: '2026-05-17', time: '10:00', type: 'Follow-up', status: 'Cancelled', department: 'Orthopedics', priority: 'Normal', notes: 'Post-surgery review', fee: 750 }
    ]

    for (const a of appts) {
      await client.query(
        'INSERT INTO appointments (id, patient_name, patient_id, doctor_name, doctor_id, date, time, type, status, department, priority, notes, fee) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
        [a.id, a.patientName, a.patientId, a.doctorName, a.doctorId, a.date, a.time, a.type, a.status, a.department, a.priority, a.notes, a.fee]
      )
    }

    // 4. Seed Prescriptions
    const rxList = [
      {
        id: 'RX001',
        patientId: 'P001',
        patientName: 'Aarav Sharma',
        doctorName: 'Dr. Priya Mehta',
        date: '2026-05-10',
        medications: JSON.stringify([
          { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days' },
          { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days' }
        ]),
        notes: 'Monitor BP weekly. Low-sodium diet recommended.'
      },
      {
        id: 'RX002',
        patientId: 'P002',
        patientName: 'Diya Patel',
        doctorName: 'Dr. Rajan Nair',
        date: '2026-05-12',
        medications: JSON.stringify([
          { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '90 days' },
          { name: 'Glimepiride', dosage: '2mg', frequency: 'Once daily', duration: '90 days' }
        ]),
        notes: 'Check fasting glucose monthly. Continue diabetic diet.'
      }
    ]

    for (const rx of rxList) {
      await client.query(
        'INSERT INTO prescriptions (id, patient_id, patient_name, doctor_name, date, medications, notes) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [rx.id, rx.patientId, rx.patientName, rx.doctorName, rx.date, rx.medications, rx.notes]
      )
    }

    // 5. Seed Invoices & Service Charges
    const invoiceList = [
      { id: 'INV-2026-0142', patientName: 'Aarav Sharma', patientId: 'P001', date: '2026-05-10', dueDate: '2026-05-20', amount: 2400, paid: 2400, status: 'Paid', services: [{ name: 'Consultation', amount: 800 }, { name: 'ECG Test', amount: 600 }, { name: 'Blood Test', amount: 1000 }] },
      { id: 'INV-2026-0143', patientName: 'Diya Patel', patientId: 'P002', date: '2026-05-12', dueDate: '2026-05-22', amount: 1850, paid: 0, status: 'Pending', services: [{ name: 'Consultation', amount: 700 }, { name: 'HbA1c Test', amount: 650 }, { name: 'Dietary Plan', amount: 500 }] },
      { id: 'INV-2026-0144', patientName: 'Rajesh Gupta', patientId: 'P005', date: '2026-05-15', dueDate: '2026-05-25', amount: 8500, paid: 5000, status: 'Partial', services: [{ name: 'Emergency Consultation', amount: 1200 }, { name: 'Angiography', amount: 4500 }, { name: 'ICU Charges', amount: 2800 }] },
      { id: 'INV-2026-0145', patientName: 'Meera Krishnan', patientId: 'P004', date: '2026-05-14', dueDate: '2026-05-24', amount: 3200, paid: 3200, status: 'Paid', services: [{ name: 'Consultation', amount: 850 }, { name: 'Spirometry', amount: 950 }, { name: 'Medication', amount: 1400 }] },
      { id: 'INV-2026-0146', patientName: 'Sunita Rao', patientId: 'P006', date: '2026-05-08', dueDate: '2026-05-18', amount: 1500, paid: 0, status: 'Overdue', services: [{ name: 'Consultation', amount: 1000 }, { name: 'MRI Report Review', amount: 500 }] }
    ]

    for (const inv of invoiceList) {
      await client.query(
        'INSERT INTO invoices (id, patient_name, patient_id, date, due_date, amount, paid, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [inv.id, inv.patientName, inv.patientId, inv.date, inv.dueDate, inv.amount, inv.paid, inv.status]
      )
      
      for (const s of inv.services) {
        await client.query(
          'INSERT INTO service_charges (invoice_id, name, amount) VALUES ($1, $2, $3)',
          [inv.id, s.name, s.amount]
        )
      }
    }

    // 6. Seed Notifications
    const notifs = [
      { type: 'appointment', message: 'New appointment booked by Aarav Sharma', time: '5 min ago', read: false },
      { type: 'emergency', message: 'Emergency case: Rajesh Gupta - Chest pain', time: '12 min ago', read: false },
      { type: 'payment', message: 'Invoice INV-2026-0142 has been paid', time: '1 hour ago', read: true },
      { type: 'system', message: 'Dr. Anita Desai marked as On Leave', time: '2 hours ago', read: true },
      { type: 'appointment', message: 'Appointment A008 cancelled by patient', time: '3 hours ago', read: true }
    ]

    for (const n of notifs) {
      await client.query(
        'INSERT INTO notifications (type, message, time, read) VALUES ($1, $2, $3, $4)',
        [n.type, n.message, n.time, n.read]
      )
    }

    await client.query('COMMIT')
    console.log('Seeder ran successfully. Database initialized.')
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Failed to seed database:', err)
  } finally {
    client.release()
  }
}
