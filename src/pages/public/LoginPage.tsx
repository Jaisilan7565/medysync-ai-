import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Stethoscope, Eye, EyeOff, ArrowRight, Lock, Mail, Shield } from 'lucide-react'
import { useAuthStore, authenticateUser } from '../../store/authStore'
import toast from 'react-hot-toast'

const demoCredentials = [
  { role: 'Admin', email: 'admin@medisync.ai', password: 'admin123', color: 'from-blue-500 to-cyan-500' },
  { role: 'Doctor', email: 'doctor@medisync.ai', password: 'doctor123', color: 'from-emerald-500 to-teal-500' },
  { role: 'Receptionist', email: 'receptionist@medisync.ai', password: 'recept123', color: 'from-violet-500 to-purple-500' },
  { role: 'Patient', email: 'patient@medisync.ai', password: 'patient123', color: 'from-rose-500 to-pink-500' },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { toast.error('Please fill in all fields'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const result = authenticateUser(email, password)
    if (result) {
      login(result.user, result.token)
      toast.success(`Welcome back, ${result.user.name.split(' ')[0]}!`)
      const routes: Record<string, string> = { admin: '/dashboard/admin', doctor: '/dashboard/doctor', receptionist: '/dashboard/receptionist', patient: '/dashboard/patient' }
      navigate(routes[result.user.role])
    } else {
      toast.error('Invalid email or password')
    }
    setLoading(false)
  }

  const quickLogin = (cred: typeof demoCredentials[0]) => {
    setEmail(cred.email)
    setPassword(cred.password)
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #03045E 0%, #023E8A 50%, #0077B6 100%)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative">
        <div className="absolute inset-0 hero-grid" />
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Stethoscope size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-black text-2xl">MediSync AI</h1>
              <p className="text-blue-300 text-sm">Healthcare Management Platform</p>
            </div>
          </div>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">Intelligent Healthcare<br /><span className="gradient-text-hero">Management</span></h2>
          <p className="text-blue-200 text-lg mb-8 leading-relaxed">From appointment scheduling to AI-powered analytics — everything your clinic needs in one platform.</p>
          <div className="space-y-3">
            {['Role-based access for Admin, Doctor, Receptionist & Patient', 'AI-powered medical summaries and chatbot', 'Real-time analytics and billing management'].map(f => (
              <div key={f} className="flex items-start gap-3">
                <Shield size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-blue-100 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel - Login form */}
      <div className="flex-1 lg:max-w-lg flex items-center justify-center p-8 bg-white lg:rounded-l-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
              <Stethoscope size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">MediSync AI</span>
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-1">Welcome back</h2>
          <p className="text-gray-500 text-sm mb-8">Sign in to your healthcare dashboard</p>

          {/* Demo login cards */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Quick Demo Login</p>
            <div className="grid grid-cols-2 gap-2">
              {demoCredentials.map(c => (
                <button key={c.role} onClick={() => quickLogin(c)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r ${c.color} hover:opacity-90 transition-all hover:-translate-y-0.5 shadow-sm`}>
                  {c.role}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or sign in manually</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="form-label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" placeholder="doctor@medisync.ai" value={email} onChange={e => setEmail(e.target.value)} className="form-input pl-10" />
              </div>
            </div>
            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="form-input pl-10 pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #0077B6, #00B4D8)', boxShadow: '0 4px 15px rgba(0,180,216,0.3)' }}>
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Sign In</span><ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700">Create account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
