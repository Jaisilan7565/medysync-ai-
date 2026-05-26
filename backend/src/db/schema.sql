-- Database Schema for MediSync AI

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL, -- admin | doctor | receptionist | patient | pharmacy
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    head_doctor_id VARCHAR(50),
    icon VARCHAR(5),
    color VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS doctors (
    id VARCHAR(50) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    specialty VARCHAR(100) NOT NULL,
    department_id VARCHAR(10) REFERENCES departments(id),
    experience VARCHAR(30) NOT NULL,
    consultation_fee INTEGER NOT NULL,
    schedule VARCHAR(100) DEFAULT 'Mon-Fri 9AM-5PM',
    qualifications VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'Available', -- Available | Busy | On Leave
    rating DECIMAL(3,2) DEFAULT 5.00,
    digital_signature_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS patients (
    id VARCHAR(50) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    age INTEGER NOT NULL,
    gender VARCHAR(10) NOT NULL,
    blood_group VARCHAR(5) NOT NULL,
    condition VARCHAR(150),
    address TEXT,
    allergies TEXT DEFAULT 'None',
    insurance VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Active' -- Active | Inactive | Critical
);

CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(50) PRIMARY KEY,
    patient_name VARCHAR(100) NOT NULL,
    patient_id VARCHAR(50) REFERENCES patients(id) ON DELETE CASCADE,
    doctor_name VARCHAR(100) NOT NULL,
    doctor_id VARCHAR(50) REFERENCES doctors(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time VARCHAR(10) NOT NULL,
    type VARCHAR(50) DEFAULT 'Consultation', -- Consultation | Follow-up | Emergency | Procedure | Lab Results
    status VARCHAR(20) DEFAULT 'Scheduled', -- Scheduled | Waiting | In Progress | Confirmed | Cancelled
    department VARCHAR(50) NOT NULL,
    priority VARCHAR(20) DEFAULT 'Normal', -- Normal | High | Emergency
    notes TEXT,
    fee INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS prescriptions (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) REFERENCES patients(id) ON DELETE CASCADE,
    patient_name VARCHAR(100) NOT NULL,
    doctor_name VARCHAR(100) NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    medications JSONB,
    notes TEXT,
    scanned_image_url VARCHAR(255),
    signature_base64 TEXT
);

CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(50) PRIMARY KEY,
    patient_name VARCHAR(100) NOT NULL,
    patient_id VARCHAR(50) REFERENCES patients(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    amount INTEGER NOT NULL,
    paid INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Pending', -- Paid | Pending | Partial | Overdue
    scanned_image_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS service_charges (
    id SERIAL PRIMARY KEY,
    invoice_id VARCHAR(50) REFERENCES invoices(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    amount INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    type VARCHAR(30) NOT NULL, -- appointment | emergency | payment | system | cancel
    message TEXT NOT NULL,
    time VARCHAR(30) DEFAULT 'Just now',
    read BOOLEAN DEFAULT FALSE
);
