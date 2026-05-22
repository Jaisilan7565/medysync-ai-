import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { QrCode, Droplets, AlertTriangle, Phone, Shield, Download, RefreshCw, User } from 'lucide-react'
import { useAuthStore } from '../../../store/authStore'
import toast from 'react-hot-toast'

const patientData = {
  name: 'Aarav Sharma',
  id: 'P001',
  age: 34,
  gender: 'Male',
  bloodGroup: 'O+',
  allergies: ['Penicillin', 'NSAIDs'],
  conditions: ['Hypertension', 'Pre-diabetic'],
  medications: ['Amlodipine 5mg', 'Lisinopril 10mg'],
  emergencyContacts: [
    { name: 'Priya Sharma (Wife)', phone: '+91 98765 12345' },
    { name: 'Dr. Priya Mehta (Doctor)', phone: '+91 99887 76655' },
  ],
  hospitalId: 'MediSync-2026-001',
  lastUpdated: '2026-05-15',
}

// Simple QR code visual (SVG-based placeholder)
function QRCodeDisplay() {
  const cells = Array.from({ length: 21 }, (_, r) =>
    Array.from({ length: 21 }, (_, c) => {
      if (r < 7 && c < 7) return r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)
      if (r < 7 && c > 13) return r === 0 || r === 6 || c === 14 || c === 20 || (r >= 2 && r <= 4 && c >= 16 && c <= 18)
      if (r > 13 && c < 7) return r === 14 || r === 20 || c === 0 || c === 6 || (r >= 16 && r <= 18 && c >= 2 && c <= 4)
      return Math.random() > 0.5
    })
  )

  return (
    <div className="inline-block bg-white p-3 rounded-xl shadow-inner border border-gray-100">
      <svg width="140" height="140" viewBox="0 0 21 21">
        {cells.map((row, r) => row.map((filled, c) => (
          filled ? <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#1e3a5f" /> : null
        )))}
      </svg>
    </div>
  )
}

export default function EmergencyWallet() {
  const { user } = useAuthStore()
  const [generated, setGenerated] = useState(false)
  const [scanning, setScanning] = useState(false)

  const generateQR = () => {
    setScanning(true)
    setTimeout(() => { setScanning(false); setGenerated(true); toast.success('Emergency QR code generated!') }, 1500)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Emergency QR Medical Wallet</h1>
        <p className="text-gray-500 text-sm mt-0.5">Instant access to critical medical information in emergencies</p>
      </div>

      {/* Emergency info banner */}
      <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
        <AlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-red-800">Emergency Access</h3>
          <p className="text-red-700 text-sm mt-0.5">This QR code allows first responders to access critical patient information instantly — even without login access.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* QR Generator */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="dashboard-card text-center">
          <div className="flex items-center gap-3 justify-center mb-6">
            <QrCode size={20} className="text-blue-600" />
            <h3 className="font-bold text-gray-900">My Emergency QR Code</h3>
          </div>

          {!generated ? (
            <div>
              <div className="w-40 h-40 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <QrCode size={48} className="text-gray-300" />
              </div>
              <p className="text-gray-500 text-sm mb-4">Generate your personal emergency QR code containing your medical profile</p>
              <button onClick={generateQR} disabled={scanning}
                className="btn-primary py-3 px-6 justify-center text-sm mx-auto">
                {scanning ? <><RefreshCw size={15} className="animate-spin" /> Generating...</> : <><QrCode size={15} /> Generate QR Code</>}
              </button>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="flex justify-center mb-4">
                <QRCodeDisplay />
              </div>
              <div className="text-xs text-gray-400 mb-4 font-mono">{patientData.hospitalId}</div>
              <div className="flex gap-3 justify-center">
                <button onClick={() => toast.success('Downloading QR code...')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-sm font-semibold hover:bg-blue-100 transition-colors">
                  <Download size={14} /> Download
                </button>
                <button onClick={() => setGenerated(false)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  <RefreshCw size={14} /> Regenerate
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Patient emergency profile */}
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="dashboard-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <User size={18} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{patientData.name}</h3>
                <p className="text-xs text-gray-500">{patientData.age}y · {patientData.gender} · ID: {patientData.id}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-red-50 rounded-xl text-center">
                <Droplets size={18} className="text-red-600 mx-auto mb-1" />
                <div className="font-black text-red-700 text-xl">{patientData.bloodGroup}</div>
                <div className="text-xs text-red-500">Blood Group</div>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl text-center">
                <AlertTriangle size={18} className="text-amber-600 mx-auto mb-1" />
                <div className="font-bold text-amber-700 text-sm">{patientData.allergies.join(', ')}</div>
                <div className="text-xs text-amber-500">Allergies</div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="dashboard-card">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Shield size={16} className="text-blue-600" /> Medical Conditions
            </h3>
            <div className="flex flex-wrap gap-2">
              {patientData.conditions.map(c => (
                <span key={c} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-semibold border border-blue-100">{c}</span>
              ))}
            </div>
            <h3 className="font-bold text-gray-900 mt-4 mb-3">Current Medications</h3>
            <div className="space-y-1.5">
              {patientData.medications.map(m => (
                <div key={m} className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {m}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="dashboard-card">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Phone size={16} className="text-blue-600" /> Emergency Contacts
            </h3>
            <div className="space-y-3">
              {patientData.emergencyContacts.map(c => (
                <div key={c.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{c.name}</div>
                  </div>
                  <a href={`tel:${c.phone}`} className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:text-blue-700">
                    <Phone size={13} /> {c.phone}
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
