// Mock data for MediSync AI demo

export const mockPatients = [
  { id: 'P001', name: 'Aarav Sharma', age: 34, gender: 'Male', phone: '+91 98765 43210', email: 'aarav.sharma@email.com', bloodGroup: 'O+', condition: 'Hypertension', status: 'Active', lastVisit: '2026-05-10', doctor: 'Dr. Priya Mehta', department: 'Cardiology', address: 'Mumbai, Maharashtra', allergies: 'Penicillin', insurance: 'Star Health', appointmentCount: 12, photo: null },
  { id: 'P002', name: 'Diya Patel', age: 28, gender: 'Female', phone: '+91 87654 32109', email: 'diya.patel@email.com', bloodGroup: 'A+', condition: 'Diabetes Type 2', status: 'Active', lastVisit: '2026-05-12', doctor: 'Dr. Rajan Nair', department: 'Endocrinology', address: 'Ahmedabad, Gujarat', allergies: 'Sulfa drugs', insurance: 'HDFC ERGO', appointmentCount: 8, photo: null },
  { id: 'P003', name: 'Vikram Singh', age: 52, gender: 'Male', phone: '+91 76543 21098', email: 'vikram.singh@email.com', bloodGroup: 'B+', condition: 'Arthritis', status: 'Inactive', lastVisit: '2026-04-20', doctor: 'Dr. Anita Desai', department: 'Orthopedics', address: 'Delhi, NCR', allergies: 'None', insurance: 'Max Bupa', appointmentCount: 5, photo: null },
  { id: 'P004', name: 'Meera Krishnan', age: 45, gender: 'Female', phone: '+91 65432 10987', email: 'meera.k@email.com', bloodGroup: 'AB-', condition: 'Asthma', status: 'Active', lastVisit: '2026-05-14', doctor: 'Dr. Suresh Kumar', department: 'Pulmonology', address: 'Chennai, Tamil Nadu', allergies: 'Aspirin, Latex', insurance: 'Apollo Munich', appointmentCount: 15, photo: null },
  { id: 'P005', name: 'Rajesh Gupta', age: 61, gender: 'Male', phone: '+91 54321 09876', email: 'rajesh.gupta@email.com', bloodGroup: 'O-', condition: 'Coronary Artery Disease', status: 'Critical', lastVisit: '2026-05-15', doctor: 'Dr. Priya Mehta', department: 'Cardiology', address: 'Bangalore, Karnataka', allergies: 'Beta-blockers', insurance: 'Religare', appointmentCount: 23, photo: null },
  { id: 'P006', name: 'Sunita Rao', age: 38, gender: 'Female', phone: '+91 43210 98765', email: 'sunita.rao@email.com', bloodGroup: 'A-', condition: 'Migraine', status: 'Active', lastVisit: '2026-05-08', doctor: 'Dr. Alok Verma', department: 'Neurology', address: 'Hyderabad, Telangana', allergies: 'Codeine', insurance: 'Bajaj Allianz', appointmentCount: 7, photo: null },
  { id: 'P007', name: 'Arjun Nambiar', age: 29, gender: 'Male', phone: '+91 32109 87654', email: 'arjun.nambiar@email.com', bloodGroup: 'B-', condition: 'Kidney Stones', status: 'Active', lastVisit: '2026-05-11', doctor: 'Dr. Kavita Joshi', department: 'Nephrology', address: 'Kochi, Kerala', allergies: 'None', insurance: 'United India', appointmentCount: 4, photo: null },
  { id: 'P008', name: 'Lakshmi Iyer', age: 55, gender: 'Female', phone: '+91 21098 76543', email: 'lakshmi.iyer@email.com', bloodGroup: 'AB+', condition: 'Thyroid Disorder', status: 'Active', lastVisit: '2026-05-13', doctor: 'Dr. Rajan Nair', department: 'Endocrinology', address: 'Coimbatore, Tamil Nadu', allergies: 'Iodine', insurance: 'Star Health', appointmentCount: 11, photo: null },
];

export const mockDoctors = [
  { id: 'D001', name: 'Dr. Priya Mehta', specialty: 'Cardiology', department: 'Cardiology', experience: '15 years', phone: '+91 99887 76655', email: 'priya.mehta@medisync.ai', status: 'Available', patients: 142, rating: 4.9, consultationFee: 800, schedule: 'Mon-Fri 9AM-5PM', qualifications: 'MBBS, MD (Cardiology)', photo: null },
  { id: 'D002', name: 'Dr. Rajan Nair', specialty: 'Endocrinology', department: 'Endocrinology', experience: '12 years', phone: '+91 88776 65544', email: 'rajan.nair@medisync.ai', status: 'Available', patients: 98, rating: 4.7, consultationFee: 700, schedule: 'Mon-Sat 10AM-6PM', qualifications: 'MBBS, DM (Endocrinology)', photo: null },
  { id: 'D003', name: 'Dr. Anita Desai', specialty: 'Orthopedics', department: 'Orthopedics', experience: '10 years', phone: '+91 77665 54433', email: 'anita.desai@medisync.ai', status: 'On Leave', patients: 76, rating: 4.8, consultationFee: 750, schedule: 'Tue-Sat 8AM-4PM', qualifications: 'MBBS, MS (Orthopedics)', photo: null },
  { id: 'D004', name: 'Dr. Suresh Kumar', specialty: 'Pulmonology', department: 'Pulmonology', experience: '18 years', phone: '+91 66554 43322', email: 'suresh.kumar@medisync.ai', status: 'Available', patients: 115, rating: 4.6, consultationFee: 850, schedule: 'Mon-Fri 11AM-7PM', qualifications: 'MBBS, MD (Pulmonology)', photo: null },
  { id: 'D005', name: 'Dr. Alok Verma', specialty: 'Neurology', department: 'Neurology', experience: '20 years', phone: '+91 55443 32211', email: 'alok.verma@medisync.ai', status: 'Available', patients: 187, rating: 4.9, consultationFee: 1000, schedule: 'Mon-Thu 9AM-6PM', qualifications: 'MBBS, DM (Neurology)', photo: null },
  { id: 'D006', name: 'Dr. Kavita Joshi', specialty: 'Nephrology', department: 'Nephrology', experience: '8 years', phone: '+91 44332 21100', email: 'kavita.joshi@medisync.ai', status: 'Busy', patients: 64, rating: 4.5, consultationFee: 650, schedule: 'Wed-Sun 10AM-5PM', qualifications: 'MBBS, MD, DM (Nephrology)', photo: null },
];

export const mockAppointments = [
  { id: 'A001', patientName: 'Aarav Sharma', patientId: 'P001', doctorName: 'Dr. Priya Mehta', doctorId: 'D001', date: '2026-05-16', time: '09:30', type: 'Follow-up', status: 'Confirmed', department: 'Cardiology', priority: 'Normal', notes: 'Blood pressure monitoring', fee: 800 },
  { id: 'A002', patientName: 'Diya Patel', patientId: 'P002', doctorName: 'Dr. Rajan Nair', doctorId: 'D002', date: '2026-05-16', time: '10:00', type: 'Consultation', status: 'Waiting', department: 'Endocrinology', priority: 'Normal', notes: 'HbA1c results review', fee: 700 },
  { id: 'A003', patientName: 'Rajesh Gupta', patientId: 'P005', doctorName: 'Dr. Priya Mehta', doctorId: 'D001', date: '2026-05-16', time: '10:30', type: 'Emergency', status: 'In Progress', department: 'Cardiology', priority: 'Emergency', notes: 'Chest pain episode', fee: 1200 },
  { id: 'A004', patientName: 'Meera Krishnan', patientId: 'P004', doctorName: 'Dr. Suresh Kumar', doctorId: 'D004', date: '2026-05-16', time: '11:00', type: 'Consultation', status: 'Confirmed', department: 'Pulmonology', priority: 'Normal', notes: 'Asthma management plan', fee: 850 },
  { id: 'A005', patientName: 'Sunita Rao', patientId: 'P006', doctorName: 'Dr. Alok Verma', doctorId: 'D005', date: '2026-05-16', time: '11:30', type: 'Follow-up', status: 'Scheduled', department: 'Neurology', priority: 'Normal', notes: 'Migraine medication review', fee: 1000 },
  { id: 'A006', patientName: 'Arjun Nambiar', patientId: 'P007', doctorName: 'Dr. Kavita Joshi', doctorId: 'D006', date: '2026-05-16', time: '14:00', type: 'Procedure', status: 'Scheduled', department: 'Nephrology', priority: 'High', notes: 'Ultrasound-guided procedure', fee: 1500 },
  { id: 'A007', patientName: 'Lakshmi Iyer', patientId: 'P008', doctorName: 'Dr. Rajan Nair', doctorId: 'D002', date: '2026-05-17', time: '09:00', type: 'Consultation', status: 'Scheduled', department: 'Endocrinology', priority: 'Normal', notes: 'Thyroid function review', fee: 700 },
  { id: 'A008', patientName: 'Vikram Singh', patientId: 'P003', doctorName: 'Dr. Anita Desai', doctorId: 'D003', date: '2026-05-17', time: '10:00', type: 'Follow-up', status: 'Cancelled', department: 'Orthopedics', priority: 'Normal', notes: 'Post-surgery review', fee: 750 },
];

export const mockInvoices = [
  { id: 'INV-2026-0142', patientName: 'Aarav Sharma', patientId: 'P001', date: '2026-05-10', dueDate: '2026-05-20', amount: 2400, paid: 2400, status: 'Paid', services: [{ name: 'Consultation', amount: 800 }, { name: 'ECG Test', amount: 600 }, { name: 'Blood Test', amount: 1000 }] },
  { id: 'INV-2026-0143', patientName: 'Diya Patel', patientId: 'P002', date: '2026-05-12', dueDate: '2026-05-22', amount: 1850, paid: 0, status: 'Pending', services: [{ name: 'Consultation', amount: 700 }, { name: 'HbA1c Test', amount: 650 }, { name: 'Dietary Plan', amount: 500 }] },
  { id: 'INV-2026-0144', patientName: 'Rajesh Gupta', patientId: 'P005', date: '2026-05-15', dueDate: '2026-05-25', amount: 8500, paid: 5000, status: 'Partial', services: [{ name: 'Emergency Consultation', amount: 1200 }, { name: 'Angiography', amount: 4500 }, { name: 'ICU Charges', amount: 2800 }] },
  { id: 'INV-2026-0145', patientName: 'Meera Krishnan', patientId: 'P004', date: '2026-05-14', dueDate: '2026-05-24', amount: 3200, paid: 3200, status: 'Paid', services: [{ name: 'Consultation', amount: 850 }, { name: 'Spirometry', amount: 950 }, { name: 'Medication', amount: 1400 }] },
  { id: 'INV-2026-0146', patientName: 'Sunita Rao', patientId: 'P006', date: '2026-05-08', dueDate: '2026-05-18', amount: 1500, paid: 0, status: 'Overdue', services: [{ name: 'Consultation', amount: 1000 }, { name: 'MRI Report Review', amount: 500 }] },
];

export const mockDepartments = [
  { id: 'DEP01', name: 'Cardiology', head: 'Dr. Priya Mehta', doctors: 4, patients: 142, icon: '❤️', color: 'red' },
  { id: 'DEP02', name: 'Endocrinology', head: 'Dr. Rajan Nair', doctors: 3, patients: 98, icon: '🔬', color: 'blue' },
  { id: 'DEP03', name: 'Orthopedics', head: 'Dr. Anita Desai', doctors: 5, patients: 76, icon: '🦴', color: 'orange' },
  { id: 'DEP04', name: 'Pulmonology', head: 'Dr. Suresh Kumar', doctors: 3, patients: 115, icon: '🫁', color: 'sky' },
  { id: 'DEP05', name: 'Neurology', head: 'Dr. Alok Verma', doctors: 6, patients: 187, icon: '🧠', color: 'purple' },
  { id: 'DEP06', name: 'Nephrology', head: 'Dr. Kavita Joshi', doctors: 2, patients: 64, icon: '🫘', color: 'teal' },
];

export const mockRevenueData = [
  { month: 'Nov', revenue: 185000, expenses: 120000, patients: 312 },
  { month: 'Dec', revenue: 210000, expenses: 130000, patients: 345 },
  { month: 'Jan', revenue: 195000, expenses: 115000, patients: 298 },
  { month: 'Feb', revenue: 225000, expenses: 140000, patients: 380 },
  { month: 'Mar', revenue: 248000, expenses: 148000, patients: 412 },
  { month: 'Apr', revenue: 262000, expenses: 155000, patients: 428 },
  { month: 'May', revenue: 278000, expenses: 162000, patients: 445 },
];

export const mockAppointmentStats = [
  { day: 'Mon', appointments: 32, completed: 28 },
  { day: 'Tue', appointments: 28, completed: 25 },
  { day: 'Wed', appointments: 35, completed: 30 },
  { day: 'Thu', appointments: 30, completed: 26 },
  { day: 'Fri', appointments: 38, completed: 34 },
  { day: 'Sat', appointments: 22, completed: 20 },
  { day: 'Sun', appointments: 12, completed: 11 },
];

export const mockDepartmentRevenue = [
  { name: 'Cardiology', value: 35, color: '#EF4444' },
  { name: 'Neurology', value: 25, color: '#8B5CF6' },
  { name: 'Orthopedics', value: 18, color: '#F59E0B' },
  { name: 'Pulmonology', value: 12, color: '#0EA5E9' },
  { name: 'Others', value: 10, color: '#6B7280' },
];

export const mockNotifications = [
  { id: 1, type: 'appointment', message: 'New appointment booked by Aarav Sharma', time: '5 min ago', read: false, icon: 'calendar' },
  { id: 2, type: 'emergency', message: 'Emergency case: Rajesh Gupta - Chest pain', time: '12 min ago', read: false, icon: 'alert' },
  { id: 3, type: 'payment', message: 'Invoice INV-2026-0142 has been paid', time: '1 hour ago', read: true, icon: 'payment' },
  { id: 4, type: 'system', message: 'Dr. Anita Desai marked as On Leave', time: '2 hours ago', read: true, icon: 'doctor' },
  { id: 5, type: 'appointment', message: 'Appointment A008 cancelled by patient', time: '3 hours ago', read: true, icon: 'cancel' },
];

export const mockPrescriptions = [
  { id: 'RX001', patientId: 'P001', patientName: 'Aarav Sharma', doctorName: 'Dr. Priya Mehta', date: '2026-05-10', medications: [{ name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days' }, { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days' }], notes: 'Monitor BP weekly. Low-sodium diet recommended.' },
  { id: 'RX002', patientId: 'P002', patientName: 'Diya Patel', doctorName: 'Dr. Rajan Nair', date: '2026-05-12', medications: [{ name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '90 days' }, { name: 'Glimepiride', dosage: '2mg', frequency: 'Once daily', duration: '90 days' }], notes: 'Check fasting glucose monthly. Continue diabetic diet.' },
];

export const adminStats = {
  totalPatients: 1284,
  totalDoctors: 48,
  todayAppointments: 87,
  monthlyRevenue: 278000,
  pendingBills: 34,
  emergencyCases: 3,
  bedOccupancy: 72,
  avgWaitTime: 18,
};
