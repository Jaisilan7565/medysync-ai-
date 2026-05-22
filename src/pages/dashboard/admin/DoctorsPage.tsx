import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Star, Phone, Mail, Edit2, Stethoscope } from 'lucide-react'
import { mockDoctors } from '../../../data/mockData'
import toast from 'react-hot-toast'

const statusColor: Record<string, string> = { Available: 'badge-success', Busy: 'badge-warning', 'On Leave': 'badge-danger' }
const statusDot: Record<string, string> = { Available: 'bg-emerald-500', Busy: 'bg-amber-500', 'On Leave': 'bg-red-500' }

export default function DoctorsPage() {
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [showModal, setShowModal] = useState(false)

  const filtered = mockDoctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Doctor Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">{filtered.length} doctors registered</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary text-sm py-2.5">
          <Plus size={15} /> Add Doctor
        </button>
      </div>

      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="form-input pl-9" placeholder="Search doctors..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex rounded-xl border border-gray-200 overflow-hidden">
          {(['grid', 'list'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} className={`px-4 py-2 text-sm font-medium transition-colors capitalize ${view === v ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>{v}</button>
          ))}
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((d, i) => (
            <motion.div key={d.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="dashboard-card hover:-translate-y-1 cursor-pointer">
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white font-black text-xl flex items-center justify-center">{d.name[3]}</div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${statusDot[d.status]}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm">{d.name}</h3>
                  <p className="text-xs text-medical-cyan font-medium">{d.specialty}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-semibold text-gray-700">{d.rating}</span>
                    <span className="text-xs text-gray-400">({d.patients} patients)</span>
                  </div>
                </div>
                <span className={`badge ${statusColor[d.status]} flex-shrink-0`}>{d.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-400">Experience</div>
                  <div className="font-semibold text-gray-900 text-sm mt-0.5">{d.experience}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-400">Consultation</div>
                  <div className="font-semibold text-gray-900 text-sm mt-0.5">₹{d.consultationFee}</div>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-2"><Phone size={12} /> {d.phone}</div>
                <div className="flex items-center gap-2"><Mail size={12} /> {d.email}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toast.success(`Viewing ${d.name}'s profile`)} className="flex-1 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors">View Profile</button>
                <button onClick={() => toast.success('Edit mode')} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"><Edit2 size={13} className="text-gray-400" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="dashboard-card p-0 overflow-hidden">
          <table className="data-table">
            <thead><tr><th>Doctor</th><th>Specialty</th><th>Experience</th><th>Patients</th><th>Rating</th><th>Fee</th><th>Schedule</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map((d, i) => (
                <motion.tr key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 text-white font-bold text-sm flex items-center justify-center">{d.name[3]}</div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{d.name}</div>
                        <div className="text-xs text-gray-400">{d.qualifications}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="text-sm text-medical-cyan font-medium">{d.specialty}</span></td>
                  <td><span className="text-sm text-gray-700">{d.experience}</span></td>
                  <td><span className="text-sm font-semibold text-gray-800">{d.patients}</span></td>
                  <td><div className="flex items-center gap-1"><Star size={12} className="text-amber-400 fill-amber-400" /><span className="text-sm font-medium">{d.rating}</span></div></td>
                  <td><span className="text-sm font-medium">₹{d.consultationFee}</span></td>
                  <td><span className="text-xs text-gray-600">{d.schedule}</span></td>
                  <td><span className={`badge ${statusColor[d.status]}`}>{d.status}</span></td>
                  <td>
                    <div className="flex gap-1.5">
                      <button onClick={() => toast.success('View profile')} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"><Stethoscope size={14} /></button>
                      <button onClick={() => toast.success('Edit doctor')} className="p-1.5 rounded-lg hover:bg-amber-50 text-gray-400 hover:text-amber-600 transition-colors"><Edit2 size={14} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-black text-gray-900 mb-6">Add New Doctor</h2>
            <div className="space-y-4">
              {[['Full Name', 'text', 'Dr. Full Name'], ['Specialty', 'text', 'Cardiology'], ['Email', 'email', 'doctor@medisync.ai'], ['Phone', 'tel', '+91 99887 76655'], ['Consultation Fee (₹)', 'number', '800']].map(([label, type, placeholder]) => (
                <div key={label}>
                  <label className="form-label">{label}</label>
                  <input type={type} placeholder={placeholder} className="form-input" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button className="flex-1 btn-primary text-sm justify-center py-3" onClick={() => { setShowModal(false); toast.success('Doctor added!') }}>Save Doctor</button>
              <button className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
