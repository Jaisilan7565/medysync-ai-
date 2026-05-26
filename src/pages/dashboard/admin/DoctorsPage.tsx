import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Star, Phone, Mail, Edit2, Stethoscope } from 'lucide-react'
import { useDataStore, Doctor } from '../../../store/dataStore'
import toast from 'react-hot-toast'

const statusColor: Record<string, string> = { Available: 'badge-success', Busy: 'badge-warning', 'On Leave': 'badge-danger' }
const statusDot: Record<string, string> = { Available: 'bg-emerald-500', Busy: 'bg-amber-500', 'On Leave': 'bg-red-500' }

export default function DoctorsPage() {
  const { doctors, addDoctor, updateDoctor } = useDataStore()
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [editId, setEditId] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    specialty: '',
    department: 'Cardiology',
    experience: '',
    phone: '',
    email: '',
    consultationFee: '',
    schedule: 'Mon-Fri 9AM-5PM',
    qualifications: '',
    status: 'Available' as Doctor['status']
  })

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase())
  )

  const openAddModal = () => {
    setModalMode('add')
    setForm({
      name: '',
      specialty: '',
      department: 'Cardiology',
      experience: '10 years',
      phone: '',
      email: '',
      consultationFee: '800',
      schedule: 'Mon-Fri 9AM-5PM',
      qualifications: 'MBBS, MD',
      status: 'Available',
    })
    setShowModal(true)
  }

  const openEditModal = (d: Doctor) => {
    setModalMode('edit')
    setEditId(d.id)
    setForm({
      name: d.name,
      specialty: d.specialty,
      department: d.department,
      experience: d.experience,
      phone: d.phone,
      email: d.email,
      consultationFee: String(d.consultationFee),
      schedule: d.schedule,
      qualifications: d.qualifications,
      status: d.status,
    })
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.specialty || !form.email || !form.phone || !form.consultationFee) {
      toast.error('Please fill in all required fields')
      return
    }

    const doctorData = {
      name: form.name,
      specialty: form.specialty,
      department: form.department,
      experience: form.experience,
      phone: form.phone,
      email: form.email,
      consultationFee: parseInt(form.consultationFee) || 500,
      schedule: form.schedule,
      qualifications: form.qualifications,
      status: form.status,
    }

    if (modalMode === 'add') {
      addDoctor(doctorData)
      toast.success('Doctor added successfully!')
    } else if (editId) {
      updateDoctor(editId, doctorData)
      toast.success('Doctor details updated!')
    }
    setShowModal(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Doctor Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">{filtered.length} doctors registered</p>
        </div>
        <button onClick={openAddModal} className="btn-primary text-sm py-2.5">
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
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white font-black text-xl flex items-center justify-center">{d.name[3] || 'D'}</div>
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
                <button onClick={() => openEditModal(d)} className="flex-1 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors">Edit Details</button>
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
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 text-white font-bold text-sm flex items-center justify-center">{d.name[3] || 'D'}</div>
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
                      <button onClick={() => openEditModal(d)} className="p-1.5 rounded-lg hover:bg-amber-50 text-gray-400 hover:text-amber-600 transition-colors"><Edit2 size={14} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl my-8">
            <h2 className="text-xl font-black text-gray-900 mb-6">{modalMode === 'add' ? 'Add New Doctor' : 'Edit Doctor Details'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Full Name *</label>
                <input className="form-input" placeholder="Dr. Anita Desai" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Specialty *</label>
                  <input className="form-input" placeholder="Orthopedics" value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })} required />
                </div>
                <div>
                  <label className="form-label">Department</label>
                  <select className="form-input" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
                    <option>Cardiology</option><option>Endocrinology</option><option>Orthopedics</option><option>Pulmonology</option><option>Neurology</option><option>Nephrology</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Qualifications</label>
                  <input className="form-input" placeholder="MBBS, MS" value={form.qualifications} onChange={e => setForm({ ...form, qualifications: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Experience</label>
                  <input className="form-input" placeholder="10 years" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Phone *</label>
                  <input className="form-input" placeholder="+91 99887 76655" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
                </div>
                <div>
                  <label className="form-label">Email *</label>
                  <input type="email" className="form-input" placeholder="doctor@medisync.ai" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Consultation Fee (₹) *</label>
                  <input type="number" className="form-input" placeholder="800" value={form.consultationFee} onChange={e => setForm({ ...form, consultationFee: e.target.value })} required />
                </div>
                <div>
                  <label className="form-label">Schedule</label>
                  <input className="form-input" placeholder="Mon-Fri 9AM-5PM" value={form.schedule} onChange={e => setForm({ ...form, schedule: e.target.value })} />
                </div>
              </div>
              {modalMode === 'edit' && (
                <div>
                  <label className="form-label">Availability Status</label>
                  <select className="form-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })}>
                    <option value="Available">Available</option>
                    <option value="Busy">Busy</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              )}
              <div className="flex gap-3 mt-6">
                <button type="submit" className="flex-1 btn-primary text-sm justify-center py-3">Save Doctor</button>
                <button type="button" className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
