import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Edit2, Trash2, Eye, Download, UserRound, Phone, Mail, Droplets } from 'lucide-react'
import { useDataStore, Patient } from '../../../store/dataStore'
import toast from 'react-hot-toast'

const statusColor: Record<string, string> = { Active: 'badge-success', Inactive: 'badge-warning', Critical: 'badge-danger' }

export default function PatientsPage() {
  const { patients, addPatient, updatePatient, deletePatient, doctors } = useDataStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [editId, setEditId] = useState<string | null>(null)
  const [viewPatient, setViewPatient] = useState<Patient | null>(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'O+',
    department: 'Cardiology',
    doctor: 'Dr. Priya Mehta',
    allergies: 'None',
    insurance: 'None',
    condition: 'General Health Checkup',
    status: 'Active' as Patient['status'],
  })

  const filtered = patients.filter(p =>
    (statusFilter === 'All' || p.status === statusFilter) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()) || p.doctor.toLowerCase().includes(search.toLowerCase()))
  )

  const handleDelete = (id: string) => {
    deletePatient(id)
    toast.success('Patient record removed')
  }

  const openAddModal = () => {
    setModalMode('add')
    setForm({
      name: '',
      email: '',
      phone: '',
      age: '',
      gender: 'Male',
      bloodGroup: 'O+',
      department: 'Cardiology',
      doctor: 'Dr. Priya Mehta',
      allergies: 'None',
      insurance: 'None',
      condition: 'General Health Checkup',
      status: 'Active',
    })
    setShowModal(true)
  }

  const openEditModal = (p: Patient) => {
    setModalMode('edit')
    setEditId(p.id)
    setForm({
      name: p.name,
      email: p.email,
      phone: p.phone,
      age: String(p.age),
      gender: p.gender,
      bloodGroup: p.bloodGroup,
      department: p.department,
      doctor: p.doctor,
      allergies: p.allergies,
      insurance: p.insurance,
      condition: p.condition,
      status: p.status,
    })
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone || !form.age) {
      toast.error('Please fill in all required fields')
      return
    }

    const patientData = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      age: parseInt(form.age) || 30,
      gender: form.gender,
      bloodGroup: form.bloodGroup,
      department: form.department,
      doctor: form.doctor,
      allergies: form.allergies,
      insurance: form.insurance,
      condition: form.condition,
      status: form.status,
    }

    if (modalMode === 'add') {
      addPatient(patientData)
      toast.success('Patient added successfully!')
    } else if (editId) {
      updatePatient(editId, patientData)
      toast.success('Patient updated successfully!')
    }
    setShowModal(false)
  }

  const handleDoctorChange = (docName: string) => {
    const doc = doctors.find(d => d.name === docName)
    setForm({
      ...form,
      doctor: docName,
      department: doc ? doc.department : form.department
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Patient Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">{filtered.length} patients found</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => toast.success('Exporting patient data...')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Download size={15} /> Export
          </button>
          <button onClick={openAddModal} className="btn-primary text-sm py-2.5">
            <Plus size={15} /> Add Patient
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="form-input pl-9" placeholder="Search patients..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {['All', 'Active', 'Inactive', 'Critical'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${statusFilter === s ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="dashboard-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr><th>Patient</th><th>Contact</th><th>Blood</th><th>Department</th><th>Doctor</th><th>Last Visit</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">{p.name[0]}</div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{p.name}</div>
                        <div className="text-xs text-gray-400">{p.id} · {p.age}y {p.gender[0]}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-xs text-gray-600 flex items-center gap-1"><Phone size={11} /> {p.phone}</div>
                    <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Mail size={11} /> {p.email}</div>
                  </td>
                  <td><span className="flex items-center gap-1 text-sm font-bold text-red-600"><Droplets size={13} />{p.bloodGroup}</span></td>
                  <td><span className="text-sm text-gray-700">{p.department}</span></td>
                  <td><span className="text-sm text-gray-600">{p.doctor.replace('Dr. ', 'Dr.')}</span></td>
                  <td><span className="text-sm text-gray-600">{p.lastVisit}</span></td>
                  <td><span className={`badge ${statusColor[p.status]}`}>{p.status}</span></td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setViewPatient(p)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"><Eye size={15} /></button>
                      <button onClick={() => openEditModal(p)} className="p-1.5 rounded-lg hover:bg-amber-50 text-gray-400 hover:text-amber-600 transition-colors"><Edit2 size={15} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <UserRound size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No patients found</p>
              <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Patient Detail Modal */}
      {viewPatient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white font-black text-2xl flex items-center justify-center">{viewPatient.name[0]}</div>
              <div>
                <h2 className="text-xl font-black text-gray-900">{viewPatient.name}</h2>
                <p className="text-gray-500 text-sm">{viewPatient.id} · {viewPatient.age} years · {viewPatient.gender}</p>
                <span className={`badge mt-1 ${statusColor[viewPatient.status]}`}>{viewPatient.status}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Phone', viewPatient.phone], ['Email', viewPatient.email],
                ['Blood Group', viewPatient.bloodGroup], ['Condition', viewPatient.condition],
                ['Department', viewPatient.department], ['Doctor', viewPatient.doctor],
                ['Last Visit', viewPatient.lastVisit], ['Allergies', viewPatient.allergies],
                ['Insurance', viewPatient.insurance], ['Appointments', viewPatient.appointmentCount],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-xs text-gray-400 font-medium">{k}</div>
                  <div className="font-semibold text-gray-900 mt-0.5">{v}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors w-full" onClick={() => setViewPatient(null)}>Close</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add / Edit Patient Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl my-8">
            <h2 className="text-xl font-black text-gray-900 mb-6">{modalMode === 'add' ? 'Add New Patient' : 'Edit Patient Profile'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" placeholder="Aarav Sharma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label className="form-label">Email *</label>
                  <input type="email" className="form-input" placeholder="aarav@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Phone *</label>
                  <input className="form-input" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
                </div>
                <div>
                  <label className="form-label">Age *</label>
                  <input type="number" className="form-input" placeholder="34" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} required />
                </div>
                <div>
                  <label className="form-label">Gender</label>
                  <select className="form-input" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Blood Group</label>
                  <select className="form-input" value={form.bloodGroup} onChange={e => setForm({ ...form, bloodGroup: e.target.value })}>
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => <option key={bg}>{bg}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="form-label">Doctor *</label>
                  <select className="form-input" value={form.doctor} onChange={e => handleDoctorChange(e.target.value)}>
                    {doctors.map(d => <option key={d.id} value={d.name}>{d.name} ({d.specialty})</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Allergies</label>
                  <input className="form-input" placeholder="Penicillin" value={form.allergies} onChange={e => setForm({ ...form, allergies: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Insurance</label>
                  <input className="form-input" placeholder="Star Health" value={form.insurance} onChange={e => setForm({ ...form, insurance: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="form-label">Condition / Diagnose</label>
                <input className="form-input" placeholder="Hypertension" value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })} />
              </div>
              {modalMode === 'edit' && (
                <div>
                  <label className="form-label">Status</label>
                  <select className="form-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              )}
              <div className="flex gap-3 mt-6">
                <button type="submit" className="flex-1 btn-primary text-sm justify-center py-3">Save Patient</button>
                <button type="button" className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
