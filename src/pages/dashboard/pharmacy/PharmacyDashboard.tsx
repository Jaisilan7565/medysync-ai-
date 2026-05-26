import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Pill, Shield, CheckCircle, FileText, Eye, Clock } from 'lucide-react'
import { useDataStore, Prescription } from '../../../store/dataStore'
import toast from 'react-hot-toast'

interface PharmacyDashboardProps {
  activeTab?: string
}

export default function PharmacyDashboard({ activeTab = 'dashboard' }: PharmacyDashboardProps) {
  const { prescriptions, patients } = useDataStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'digital' | 'scanned'>('all')
  const [viewRx, setViewRx] = useState<Prescription | null>(null)
  
  // Local state to simulate prescription dispensing
  const [dispensedRxIds, setDispensedRxIds] = useState<Set<string>>(new Set())

  // Filters and search logic
  const filteredRx = prescriptions.filter(rx => {
    const matchesSearch = 
      rx.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.patientId.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (typeFilter === 'digital') return matchesSearch && !rx.scannedImageUrl
    if (typeFilter === 'scanned') return matchesSearch && !!rx.scannedImageUrl
    return matchesSearch
  })

  // Dispensing handler
  const handleDispense = (id: string) => {
    setDispensedRxIds(prev => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
    toast.success(`Prescription ${id} successfully dispensed!`)
    setViewRx(null)
  }

  // Count statistics
  const totalRx = prescriptions.length
  const digitalCount = prescriptions.filter(r => !r.scannedImageUrl).length
  const scannedCount = prescriptions.filter(r => !!r.scannedImageUrl).length
  const dispensedCount = dispensedRxIds.size
  const pendingCount = totalRx - dispensedCount

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Pharmacy Portal</h1>
        <p className="text-gray-500 text-sm mt-0.5">Dispense medications and verify digital doctor signatures</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Prescriptions', value: totalRx, icon: Pill, bg: 'bg-blue-50', text: 'text-blue-600' },
          { label: 'Digitally Verified', value: digitalCount, icon: Shield, bg: 'bg-emerald-50', text: 'text-emerald-600' },
          { label: 'Scanned Uploads', value: scannedCount, icon: FileText, bg: 'bg-amber-50', text: 'text-amber-600' },
          { label: 'Dispensed Logs', value: dispensedCount, icon: CheckCircle, bg: 'bg-violet-50', text: 'text-violet-600' }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="stat-card"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon size={18} className={stat.text} />
            </div>
            <div className="text-2xl font-black text-gray-900 mb-0.5">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Main List Section */}
      <div className="dashboard-card">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full md:max-w-xs">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search ID, Patient..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
          </div>
          
          <div className="flex gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All Types' },
              { id: 'digital', label: 'Digital Only' },
              { id: 'scanned', label: 'Scanned Only' }
            ].map(tabItem => (
              <button
                key={tabItem.id}
                onClick={() => setTypeFilter(tabItem.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  typeFilter === tabItem.id
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {tabItem.label}
              </button>
            ))}
          </div>
        </div>

        {/* List of Prescriptions */}
        <div className="space-y-4">
          {filteredRx.map((rx, i) => {
            const isDispensed = dispensedRxIds.has(rx.id)
            return (
              <motion.div
                key={rx.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-4 rounded-2xl border transition-all ${
                  isDispensed 
                    ? 'bg-slate-50/50 border-gray-100 opacity-70' 
                    : 'bg-white border-gray-150 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-blue-600">{rx.id}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-xs text-gray-500">{rx.date}</span>
                      <span className={`badge ${rx.scannedImageUrl ? 'badge-warning' : 'badge-success'}`}>
                        {rx.scannedImageUrl ? 'Scanned' : 'Digital'}
                      </span>
                      {isDispensed && (
                        <span className="badge badge-success flex items-center gap-1">
                          <CheckCircle size={10} /> Dispensed
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 mt-1">{rx.patientName}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Doctor: {rx.doctorName} · Patient ID: {rx.patientId}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setViewRx(rx)}
                      className="btn-secondary py-2 px-3.5 text-xs flex items-center gap-1.5"
                    >
                      <Eye size={14} /> Review Sheet
                    </button>
                    {!isDispensed && (
                      <button
                        onClick={() => handleDispense(rx.id)}
                        className="btn-primary py-2 px-3.5 text-xs bg-amber-500 hover:bg-amber-600 text-white"
                      >
                        Dispense
                      </button>
                    )}
                  </div>
                </div>

                {/* Medications snippet */}
                {!rx.scannedImageUrl && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {rx.medications.map((m, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-[11px] font-semibold text-blue-600">
                        <Pill size={10} /> {m.name} ({m.dosage})
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            )
          })}
          {filteredRx.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">
              No prescriptions found matching query.
            </div>
          )}
        </div>
      </div>

      {/* Prescription Review Sheet Modal */}
      <AnimatePresence>
        {viewRx && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <h2 className="text-xl font-black text-gray-900 mb-5">Verify & Dispense</h2>

              {viewRx.scannedImageUrl ? (
                <div className="space-y-4 mb-5">
                  <div className="bg-slate-50 border border-gray-150 rounded-2xl p-4 flex flex-col items-center">
                    <div className="w-full aspect-[4/5] bg-white border border-gray-100 rounded-xl overflow-hidden shadow-inner flex items-center justify-center p-2 mb-2 max-h-[260px]">
                      <img src={viewRx.scannedImageUrl} alt="Scanned document" className="h-full object-contain" />
                    </div>
                    <span className="text-[11px] text-gray-400 font-mono">Reference Prescription Scan ID: {viewRx.id}</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-slate-50 rounded-2xl p-4 mb-4 space-y-1">
                    <div className="font-mono text-sm font-bold text-blue-600">{viewRx.id}</div>
                    <div className="text-sm text-gray-600">Patient: <span className="font-semibold text-gray-900">{viewRx.patientName}</span></div>
                    <div className="text-sm text-gray-600">Doctor: <span className="font-semibold text-gray-900">{viewRx.doctorName}</span></div>
                    <div className="text-sm text-gray-600">Date: {viewRx.date}</div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-1">Medications Scheduled</span>
                    {viewRx.medications.map((m, idx) => (
                      <div key={idx} className="p-3 bg-blue-50 rounded-xl text-sm">
                        <div className="font-bold text-gray-950">{m.name} ({m.dosage})</div>
                        <div className="text-xs text-gray-600 mt-0.5">{m.frequency} for {m.duration}</div>
                      </div>
                    ))}
                  </div>

                  {viewRx.signatureBase64 && (
                    <div className="border border-emerald-100 bg-emerald-50/20 rounded-2xl p-3 mb-4 flex flex-col items-center">
                      <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Shield size={10} /> Verified Doctor Digital Signature
                      </span>
                      <img src={viewRx.signatureBase64} alt="Doctor Digital Signature" className="max-h-12 object-contain" />
                    </div>
                  )}
                </>
              )}

              {viewRx.notes && (
                <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-800 mb-5">
                  <span className="font-semibold">Notes:</span> {viewRx.notes}
                </div>
              )}

              <div className="flex gap-3">
                {!dispensedRxIds.has(viewRx.id) ? (
                  <button 
                    onClick={() => handleDispense(viewRx.id)} 
                    className="flex-1 btn-primary bg-amber-500 hover:bg-amber-600 text-white text-sm justify-center py-2.5"
                  >
                    Dispense Medications
                  </button>
                ) : (
                  <button 
                    disabled 
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 text-gray-400 text-sm font-semibold flex items-center justify-center gap-1.5 cursor-not-allowed"
                  >
                    <CheckCircle size={15} /> Dispensed
                  </button>
                )}
                <button 
                  onClick={() => setViewRx(null)} 
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 w-24"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
