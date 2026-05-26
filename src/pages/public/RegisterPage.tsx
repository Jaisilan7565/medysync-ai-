import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Stethoscope, User, Mail, Lock, Phone, ArrowRight } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'patient' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { toast.error('Please fill all required fields'); return }
    setLoading(true)
    const success = await register({
      name: form.name,
      email: form.email,
      phone: form.phone,
      role: form.role as any
    }, form.password)
    
    if (success) {
      toast.success('Account created successfully!')
      const routes: Record<string, string> = { admin: '/dashboard/admin', doctor: '/dashboard/doctor', receptionist: '/dashboard/receptionist', patient: '/dashboard/patient', pharmacy: '/dashboard/pharmacy' }
      navigate(routes[form.role])
    } else {
      toast.error('Failed to create account. Email may already be in use.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'linear-gradient(135deg, #03045E 0%, #023E8A 50%, #0077B6 100%)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
            <Stethoscope size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">MediSync AI</span>
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">Create Account</h2>
        <p className="text-gray-500 text-sm mb-6">Join the healthcare management platform</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Full Name *</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="form-input pl-10" placeholder="Dr. John Smith" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="form-label">Email Address *</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" className="form-input pl-10" placeholder="john@hospital.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="form-label">Phone</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="form-input pl-10" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="form-label">Role</label>
            <select className="form-input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="receptionist">Receptionist</option>
              <option value="admin">Admin</option>
              <option value="pharmacy">Pharmacy</option>
            </select>
          </div>
          <div>
            <label className="form-label">Password *</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="password" className="form-input pl-10" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #0077B6, #00B4D8)', boxShadow: '0 4px 15px rgba(0,180,216,0.3)' }}>
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Create Account</span><ArrowRight size={16} /></>}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700">Sign in</Link></p>
      </motion.div>
    </div>
  )
}
