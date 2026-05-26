import { useState } from 'react'
import { motion } from 'framer-motion'
import { UserPlus, User, Mail, Phone, Heart, Shield, MapPin, AlertCircle, Sparkles } from 'lucide-react'
import { useDataStore } from '../../../store/dataStore'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function RegisterPatient() {
  const navigate = useNavigate()
  const { addPatient, doctors } = useDataStore()
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    bloodGroup: 'O+',
    condition: '',
    allergies: '',
    insurance: '',
    address: '',
    doctorId: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.age || !form.phone || !form.email || !form.doctorId) {
      toast.error('Please fill in all required fields')
      return
    }

    const selectedDoctor = doctors.find(d => d.id === form.doctorId)
    
    addPatient({
      name: form.name,
      age: parseInt(form.age) || 30,
      gender: form.gender,
      phone: form.phone,
      email: form.email,
      bloodGroup: form.bloodGroup,
      condition: form.condition || 'General Health Checkup',
      status: 'Active',
      doctor: selectedDoctor ? selectedDoctor.name : 'Dr. Priya Mehta',
      department: selectedDoctor ? selectedDoctor.department : 'General Medicine',
      address: form.address || 'Not Provided',
      allergies: form.allergies || 'None',
      insurance: form.insurance || 'None',
    })

    toast.success('Patient registered successfully!')
    navigate('/dashboard/receptionist')
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center shadow-lg">
          <UserPlus size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Register New Patient</h1>
          <p className="text-gray-500 text-sm mt-0.5">Add patient records to the MediSync system</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="dashboard-card space-y-6">
        {/* Personal Details Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <User size={15} /> Personal Details
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Full Name *</label>
              <input
                className="form-input"
                placeholder="e.g. Aarav Sharma"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Age *</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 34"
                  value={form.age}
                  onChange={e => setForm({ ...form, age: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="form-label">Gender</label>
                <select
                  className="form-input"
                  value={form.gender}
                  onChange={e => setForm({ ...form, gender: e.target.value })}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Contact Info Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Phone size={15} /> Contact & Location
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                className="form-input"
                placeholder="e.g. +91 98765 43210"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-input"
                placeholder="e.g. aarav@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="form-label">Address</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="form-input pl-10"
                placeholder="e.g. Mumbai, Maharashtra"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Medical & Insurance Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Heart size={15} /> Medical & Insurance Details
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Blood Group</label>
              <select
                className="form-input"
                value={form.bloodGroup}
                onChange={e => setForm({ ...form, bloodGroup: e.target.value })}
              >
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Primary Diagnose / Medical Condition</label>
              <input
                className="form-input"
                placeholder="e.g. Hypertension, Diabetes Type 2"
                value={form.condition}
                onChange={e => setForm({ ...form, condition: e.target.value })}
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="form-label">Allergies (If any)</label>
              <div className="relative">
                <AlertCircle size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="form-input pl-10"
                  placeholder="e.g. Penicillin, Latex (leave blank if none)"
                  value={form.allergies}
                  onChange={e => setForm({ ...form, allergies: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="form-label">Insurance Provider</label>
              <div className="relative">
                <Shield size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="form-input pl-10"
                  placeholder="e.g. Star Health, HDFC ERGO"
                  value={form.insurance}
                  onChange={e => setForm({ ...form, insurance: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Doctor Assignment Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Sparkles size={15} /> Department & Primary Doctor
          </h3>
          <div>
            <label className="form-label">Assign Primary Doctor *</label>
            <select
              className="form-input"
              value={form.doctorId}
              onChange={e => setForm({ ...form, doctorId: e.target.value })}
              required
            >
              <option value="">Select doctor...</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>{d.name} — {d.specialty} ({d.department})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" className="flex-1 btn-primary py-3.5 justify-center text-sm">
            <UserPlus size={16} /> Register Patient
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/receptionist')}
            className="px-6 py-3.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
