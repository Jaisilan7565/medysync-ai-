import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pill, Download, Eye } from 'lucide-react'
import { mockPrescriptions } from '../../../data/mockData'
import toast from 'react-hot-toast'

export default function DoctorPrescriptions() {
  const [showNew, setShowNew] = useState(false)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Prescriptions</h1>
          <p className="text-gray-500 text-sm mt-0.5">{mockPrescriptions.length} prescriptions issued</p>
        </div>
        <button onClick={() => setShowNew(true)} className="btn-primary text-sm py-2.5"><Plus size={15} /> New Prescription</button>
      </div>

      <div className="space-y-4">
        {mockPrescriptions.map((rx, i) => (
          <motion.div key={rx.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="dashboard-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-blue-600">{rx.id}</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-sm text-gray-500">{rx.date}</span>
                </div>
                <h3 className="font-bold text-gray-900 mt-0.5">{rx.patientName}</h3>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toast.success('Opening prescription...')} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"><Eye size={15} /></button>
                <button onClick={() => toast.success('Downloading prescription...')} className="p-1.5 rounded-lg hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition-colors"><Download size={15} /></button>
              </div>
            </div>
            <div className="space-y-2">
              {rx.medications.map(m => (
                <div key={m.name} className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                  <Pill size={14} className="text-blue-500 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="font-semibold text-gray-900 text-sm">{m.name}</span>
                    <span className="text-xs text-gray-500 ml-2">{m.dosage}</span>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <div>{m.frequency}</div>
                    <div className="font-medium text-gray-700">{m.duration}</div>
                  </div>
                </div>
              ))}
            </div>
            {rx.notes && (
              <div className="mt-3 p-3 bg-amber-50 rounded-xl">
                <p className="text-xs text-amber-700"><span className="font-semibold">Notes: </span>{rx.notes}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {showNew && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
            <h2 className="text-xl font-black text-gray-900 mb-6">New Prescription</h2>
            <div className="space-y-4">
              <div><label className="form-label">Patient Name</label><select className="form-input"><option>Aarav Sharma</option><option>Rajesh Gupta</option></select></div>
              <div><label className="form-label">Medication Name</label><input className="form-input" placeholder="e.g. Amlodipine 5mg" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="form-label">Dosage</label><input className="form-input" placeholder="e.g. 5mg" /></div>
                <div><label className="form-label">Frequency</label><select className="form-input"><option>Once daily</option><option>Twice daily</option><option>Three times daily</option></select></div>
              </div>
              <div><label className="form-label">Duration</label><input className="form-input" placeholder="e.g. 30 days" /></div>
              <div><label className="form-label">Doctor Notes</label><textarea className="form-input h-20 resize-none" placeholder="Additional instructions..." /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="flex-1 btn-primary text-sm justify-center py-3" onClick={() => { setShowNew(false); toast.success('Prescription created!') }}>Issue Prescription</button>
              <button className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50" onClick={() => setShowNew(false)}>Cancel</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
