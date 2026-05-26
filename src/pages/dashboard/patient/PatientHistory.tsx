import { useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Pill, Calendar, Eye, FileText, CheckCircle } from 'lucide-react'
import { useDataStore, Prescription } from '../../../store/dataStore'
import { useAuthStore } from '../../../store/authStore'
import toast from 'react-hot-toast'

export default function PatientHistory() {
  const { user } = useAuthStore()
  const { appointments, prescriptions, patients } = useDataStore()
  const [viewRx, setViewRx] = useState<Prescription | null>(null)

  // Find this patient profile by matching user name or email
  const patientProfile = patients.find(
    p => p.email.toLowerCase() === user?.email?.toLowerCase() || p.name.toLowerCase() === user?.name?.toLowerCase()
  )

  const patientId = patientProfile?.id || 'P001'

  const myPrescriptions = prescriptions.filter(p => p.patientId === patientId)
  const sortedPrescriptions = [...myPrescriptions].sort((a, b) => b.date.localeCompare(a.date))

  const defaultConditions: Record<string, Array<{ condition: string; diagnosed: string; severity: string; doctor: string }>> = {
    P001: [
      { condition: 'Hypertension', diagnosed: '2024-03-15', severity: 'Moderate', doctor: 'Dr. Priya Mehta' },
      { condition: 'Seasonal Allergies', diagnosed: '2022-08-10', severity: 'Mild', doctor: 'Dr. Suresh Kumar' },
    ],
    P002: [
      { condition: 'Diabetes Type 2', diagnosed: '2023-11-05', severity: 'Moderate', doctor: 'Dr. Rajan Nair' }
    ],
    P004: [
      { condition: 'Asthma', diagnosed: '2021-11-20', severity: 'Moderate', doctor: 'Dr. Suresh Kumar' }
    ],
    P005: [
      { condition: 'Coronary Artery Disease', diagnosed: '2020-04-15', severity: 'Critical', doctor: 'Dr. Priya Mehta' }
    ]
  }

  const activeConditions = patientProfile 
    ? (defaultConditions[patientProfile.id] || [
        { 
          condition: patientProfile.condition || 'General Checkup', 
          diagnosed: patientProfile.lastVisit !== 'Never' ? patientProfile.lastVisit : '2026-05-16', 
          severity: patientProfile.status === 'Critical' ? 'Critical' : 'Moderate', 
          doctor: patientProfile.doctor || 'Dr. Priya Mehta' 
        }
      ])
    : defaultConditions.P001;

  // Merge store appointments with some static history for Aarav
  const storeVisits = appointments
    .filter(a => a.patientId === patientId)
    .map(a => ({
      date: a.date,
      type: a.type,
      doctor: a.doctorName,
      dept: a.department,
    }))

  const defaultHistory: Record<string, Array<{ date: string; type: string; doctor: string; dept: string }>> = {
    P001: [
      { date: '2026-05-10', type: 'Follow-up', doctor: 'Dr. Priya Mehta', dept: 'Cardiology' },
      { date: '2026-04-22', type: 'Consultation', doctor: 'Dr. Suresh Kumar', dept: 'Pulmonology' },
      { date: '2026-03-14', type: 'Emergency', doctor: 'Dr. Priya Mehta', dept: 'Cardiology' },
    ],
    P002: [
      { date: '2026-05-12', type: 'Consultation', doctor: 'Dr. Rajan Nair', dept: 'Endocrinology' },
      { date: '2026-03-10', type: 'Follow-up', doctor: 'Dr. Rajan Nair', dept: 'Endocrinology' },
    ],
    P004: [
      { date: '2026-05-14', type: 'Consultation', doctor: 'Dr. Suresh Kumar', dept: 'Pulmonology' },
    ],
    P005: [
      { date: '2026-05-15', type: 'Emergency', doctor: 'Dr. Priya Mehta', dept: 'Cardiology' },
    ]
  }

  const historyList = patientProfile 
    ? (defaultHistory[patientProfile.id] || [])
    : defaultHistory.P001;

  const combinedTimeline = [
    ...storeVisits,
    ...historyList.filter(h => !storeVisits.some(s => s.date === h.date))
  ].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Medical History</h1>
        <p className="text-gray-500 text-sm mt-0.5">Your complete medical records</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {[
          { label: 'Total Visits', val: combinedTimeline.length, icon: Calendar },
          { label: 'Prescriptions', val: sortedPrescriptions.length, icon: Pill },
          { label: 'Conditions', val: activeConditions.length, icon: Activity }
        ].map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="stat-card">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
              <item.icon size={18} className="text-blue-600" />
            </div>
            <div className="text-2xl font-black text-gray-900 mb-0.5">{item.val}</div>
            <div className="text-xs text-gray-500">{item.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Conditions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="dashboard-card">
        <h3 className="font-bold text-gray-900 mb-4">Active Conditions</h3>
        <div className="space-y-3">
          {activeConditions.map((c, i) => (
            <div key={`${c.condition}-${i}`} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Activity size={16} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-900">{c.condition}</div>
                <div className="text-xs text-gray-500">Diagnosed: {c.diagnosed} · {c.doctor}</div>
              </div>
              <span className={`badge ${c.severity === 'Critical' ? 'badge-danger' : c.severity === 'Moderate' ? 'badge-warning' : 'badge-success'}`}>{c.severity}</span>
            </div>
          ))}
          {activeConditions.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No active conditions recorded.</p>
          )}
        </div>
      </motion.div>

      {/* Prescriptions history */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="dashboard-card">
        <h3 className="font-bold text-gray-900 mb-4">Prescription History</h3>
        <div className="space-y-4">
          {sortedPrescriptions.map((rx, idx) => (
            <div key={`${rx.id}-${idx}`} className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-blue-600">{rx.id}</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-xs text-gray-500">{rx.date}</span>
                  <span className={`badge ${rx.scannedImageUrl ? 'badge-warning' : 'badge-success'}`}>
                    {rx.scannedImageUrl ? 'Scanned' : 'Digital'}
                  </span>
                </div>
                <button onClick={() => setViewRx(rx)} className="p-1.5 rounded-lg hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition-colors">
                  <Eye size={14} />
                </button>
              </div>
              
              {rx.scannedImageUrl ? (
                <div className="flex items-center gap-3 p-3 bg-white border border-gray-150 rounded-xl">
                  <FileText size={16} className="text-amber-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-900">Handwritten Prescr. Scan</span>
                  <span className="text-xs text-emerald-600 font-bold ml-auto flex items-center gap-1">
                    <CheckCircle size={10} /> Verified
                  </span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {rx.medications.map((m, idx2) => (
                    <div key={`${m.name}-${idx2}`} className="flex items-center gap-2 text-sm">
                      <Pill size={12} className="text-blue-500 flex-shrink-0" />
                      <span className="font-medium text-gray-900">{m.name} {m.dosage}</span>
                      <span className="text-gray-400">—</span>
                      <span className="text-gray-600">{m.frequency} for {m.duration}</span>
                    </div>
                  ))}
                </div>
              )}

              {rx.notes && (
                <div className="mt-3 text-xs text-gray-500 border-t border-gray-100 pt-2">
                  <span className="font-semibold">Notes:</span> {rx.notes}
                </div>
              )}
            </div>
          ))}
          {sortedPrescriptions.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No prescription history found.</p>
          )}
        </div>
      </motion.div>

      {/* Visit timeline */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="dashboard-card">
        <h3 className="font-bold text-gray-900 mb-4">Visit Timeline</h3>
        <div className="relative pl-6">
          <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-100" />
          {combinedTimeline.map((v, i) => (
            <div key={`${v.date}-${i}`} className="relative flex gap-4 mb-5">
              <div className="absolute -left-[18px]. w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow" style={{ left: '-5px' }} />
              <div className="flex-1 p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900 text-sm">{v.type}</span>
                  <span className="text-xs text-gray-400">{v.date}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{v.doctor} · {v.dept}</p>
              </div>
            </div>
          ))}
          {combinedTimeline.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No visits recorded.</p>
          )}
        </div>
      </motion.div>

      {/* View Modal */}
      {viewRx && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-black text-gray-900 mb-6">Prescription Sheet</h2>
            
            {viewRx.scannedImageUrl ? (
              <div className="space-y-4">
                <div className="bg-slate-50 border border-gray-150 rounded-2xl p-4 flex flex-col items-center">
                  <div className="w-full aspect-[4/5] bg-white border border-gray-100 rounded-xl overflow-hidden shadow-inner flex items-center justify-center p-2 mb-2 max-h-[300px]">
                    <img src={viewRx.scannedImageUrl} alt="Scanned prescription" className="h-full object-contain" />
                  </div>
                  <span className="text-xs text-gray-500 font-mono">Reference ID: {viewRx.id}</span>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                  <div className="font-mono text-sm font-bold text-blue-600 mb-1">{viewRx.id}</div>
                  <div className="text-sm text-gray-600">Doctor: <span className="font-semibold text-gray-900">{viewRx.doctorName}</span></div>
                  <div className="text-sm text-gray-600">Date: {viewRx.date}</div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Medications</div>
                  {viewRx.medications.map((m, idx) => (
                    <div key={`${m.name}-${idx}`} className="p-3 bg-blue-50 rounded-xl text-sm">
                      <div className="font-bold text-gray-950">{m.name} ({m.dosage})</div>
                      <div className="text-xs text-gray-600 mt-0.5">{m.frequency} for {m.duration}</div>
                    </div>
                  ))}
                </div>
                {viewRx.signatureBase64 && (
                  <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-3 mb-4 flex flex-col items-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Authorized Doctor Signature</span>
                    <img src={viewRx.signatureBase64} alt="Doctor Digital Signature" className="max-h-12 object-contain" />
                  </div>
                )}
              </>
            )}

            {viewRx.notes && (
              <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-800 mb-4">
                <span className="font-semibold">Notes:</span> {viewRx.notes}
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => toast.success('Downloading...')} className="flex-1 btn-primary text-sm justify-center py-2.5">Download PDF</button>
              <button onClick={() => setViewRx(null)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 w-24">Close</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
