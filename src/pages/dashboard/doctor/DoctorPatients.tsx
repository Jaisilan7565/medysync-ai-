import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Eye, Droplets } from 'lucide-react'
import { useAuthStore } from '../../../store/authStore'
import { useDataStore } from '../../../store/dataStore'
import toast from 'react-hot-toast'

export default function DoctorPatients() {
  const [search, setSearch] = useState('')
  const { user } = useAuthStore()
  const { patients } = useDataStore()

  const myPatients = patients.filter(p => {
    if (!user?.name) return false
    const cleanDocName = user.name.replace('Dr. ', '').toLowerCase().trim()
    return p.doctor.toLowerCase().includes(cleanDocName)
  })

  const filtered = myPatients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-gray-900">My Patients</h1>
        <p className="text-gray-500 text-sm mt-0.5">{filtered.length} patients under your care</p>
      </div>
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input className="form-input pl-9" placeholder="Search patients..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="dashboard-card">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white font-black text-lg flex items-center justify-center flex-shrink-0">{p.name[0]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">{p.name}</h3>
                  <span className={`badge ${p.status === 'Active' ? 'badge-success' : p.status === 'Critical' ? 'badge-danger' : 'badge-warning'}`}>{p.status}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{p.id} · {p.age}y · {p.gender}</p>
                <p className="text-sm text-blue-600 font-medium mt-1">{p.condition}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1 font-bold text-red-600"><Droplets size={11} />{p.bloodGroup}</span>
                  <span>Last: {p.lastVisit ? new Date(p.lastVisit).toLocaleDateString() : 'N/A'}</span>
                  <span>Allergies: {p.allergies}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => toast.success('Opening medical history...')} className="flex-1 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors">Medical History</button>
              <button onClick={() => toast.success('Opening prescription writer...')} className="flex-1 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-semibold hover:bg-emerald-100 transition-colors">Prescribe</button>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-8 text-gray-400 text-sm">No patients found under your care.</div>
        )}
      </div>
    </div>
  )
}
