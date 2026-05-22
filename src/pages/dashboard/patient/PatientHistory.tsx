import { motion } from 'framer-motion'
import { Activity, Pill, Calendar } from 'lucide-react'
import { mockPrescriptions } from '../../../data/mockData'

export default function PatientHistory() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Medical History</h1>
        <p className="text-gray-500 text-sm mt-0.5">Your complete medical records</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {[['Total Visits', '12', Activity], ['Prescriptions', '8', Pill], ['Conditions', '2', Activity]].map(([label, val, Icon]: any, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="stat-card">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3"><Icon size={18} className="text-blue-600" /></div>
            <div className="text-2xl font-black text-gray-900 mb-0.5">{val}</div>
            <div className="text-xs text-gray-500">{label}</div>
          </motion.div>
        ))}
      </div>

      {/* Conditions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="dashboard-card">
        <h3 className="font-bold text-gray-900 mb-4">Active Conditions</h3>
        <div className="space-y-3">
          {[
            { condition: 'Hypertension', diagnosed: '2024-03-15', severity: 'Moderate', doctor: 'Dr. Priya Mehta' },
            { condition: 'Seasonal Allergies', diagnosed: '2022-08-10', severity: 'Mild', doctor: 'Dr. Suresh Kumar' },
          ].map(c => (
            <div key={c.condition} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Activity size={16} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-900">{c.condition}</div>
                <div className="text-xs text-gray-500">Diagnosed: {c.diagnosed} · {c.doctor}</div>
              </div>
              <span className={`badge ${c.severity === 'Moderate' ? 'badge-warning' : 'badge-success'}`}>{c.severity}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Prescriptions history */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="dashboard-card">
        <h3 className="font-bold text-gray-900 mb-4">Prescription History</h3>
        <div className="space-y-4">
          {mockPrescriptions.map(rx => (
            <div key={rx.id} className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-sm font-bold text-blue-600">{rx.id}</span>
                <span className="text-xs text-gray-500">{rx.date}</span>
              </div>
              <div className="space-y-1.5">
                {rx.medications.map(m => (
                  <div key={m.name} className="flex items-center gap-2 text-sm">
                    <Pill size={12} className="text-blue-500 flex-shrink-0" />
                    <span className="font-medium text-gray-900">{m.name} {m.dosage}</span>
                    <span className="text-gray-400">—</span>
                    <span className="text-gray-600">{m.frequency} for {m.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Visit timeline */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="dashboard-card">
        <h3 className="font-bold text-gray-900 mb-4">Visit Timeline</h3>
        <div className="relative pl-6">
          <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-100" />
          {[
            { date: '2026-05-10', type: 'Follow-up', doctor: 'Dr. Priya Mehta', dept: 'Cardiology' },
            { date: '2026-04-22', type: 'Consultation', doctor: 'Dr. Suresh Kumar', dept: 'Pulmonology' },
            { date: '2026-03-14', type: 'Emergency', doctor: 'Dr. Priya Mehta', dept: 'Cardiology' },
          ].map((v, i) => (
            <div key={i} className="relative flex gap-4 mb-5">
              <div className="absolute -left-[18px] w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow" />
              <div className="flex-1 p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900 text-sm">{v.type}</span>
                  <span className="text-xs text-gray-400">{v.date}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{v.doctor} · {v.dept}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
