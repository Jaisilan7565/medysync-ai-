import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Bell, Shield, Palette, Database, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../../store/authStore'

export default function SettingsPage() {
  const { user } = useAuthStore()
  const [notifications, setNotifications] = useState({ email: true, sms: false, whatsapp: true, emergency: true })
  const [theme, setTheme] = useState('light')

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage your platform preferences</p>
      </div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="dashboard-card">
        <div className="flex items-center gap-3 mb-4"><Settings size={18} className="text-blue-600" /><h3 className="font-bold text-gray-900">Profile Settings</h3></div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-black text-2xl flex items-center justify-center">{user?.name?.[0] || 'A'}</div>
          <div>
            <div className="font-bold text-gray-900">{user?.name}</div>
            <div className="text-sm text-gray-500">{user?.email}</div>
            <button onClick={() => toast.success('Opening image upload...')} className="mt-1 text-xs text-blue-600 font-medium hover:underline">Change Avatar</button>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[['Full Name', user?.name || ''], ['Email', user?.email || ''], ['Phone', '+91 99887 76655'], ['Department', user?.department || 'Administration']].map(([label, val]) => (
            <div key={label}>
              <label className="form-label">{label}</label>
              <input defaultValue={val} className="form-input" />
            </div>
          ))}
        </div>
        <button onClick={() => toast.success('Profile saved!')} className="mt-4 btn-primary text-sm py-2.5"><Save size={15} /> Save Changes</button>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="dashboard-card">
        <div className="flex items-center gap-3 mb-4"><Bell size={18} className="text-blue-600" /><h3 className="font-bold text-gray-900">Notification Preferences</h3></div>
        <div className="space-y-4">
          {[
            { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
            { key: 'sms', label: 'SMS Alerts', desc: 'Get appointment reminders via SMS' },
            { key: 'whatsapp', label: 'WhatsApp Reminders', desc: 'Automated WhatsApp notifications' },
            { key: 'emergency', label: 'Emergency Alerts', desc: 'Critical patient status notifications' },
          ].map(n => (
            <div key={n.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <div className="font-medium text-gray-900 text-sm">{n.label}</div>
                <div className="text-xs text-gray-500">{n.desc}</div>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, [n.key]: !prev[n.key as keyof typeof prev] }))}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${notifications[n.key as keyof typeof notifications] ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${notifications[n.key as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Security */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="dashboard-card">
        <div className="flex items-center gap-3 mb-4"><Shield size={18} className="text-blue-600" /><h3 className="font-bold text-gray-900">Security</h3></div>
        <div className="space-y-4">
          {[['Current Password', 'password', ''], ['New Password', 'password', ''], ['Confirm Password', 'password', '']].map(([label, type]) => (
            <div key={label}>
              <label className="form-label">{label}</label>
              <input type={type} className="form-input" placeholder="••••••••" />
            </div>
          ))}
          <button onClick={() => toast.success('Password updated!')} className="btn-primary text-sm py-2.5"><Shield size={15} /> Update Password</button>
        </div>
      </motion.div>

      {/* System */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="dashboard-card">
        <div className="flex items-center gap-3 mb-4"><Database size={18} className="text-blue-600" /><h3 className="font-bold text-gray-900">System Information</h3></div>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          {[['Platform Version', 'MediSync AI v1.0.0'], ['Database', 'PostgreSQL (Neon Free)'], ['Storage', 'Simulated (2.3 GB / 5 GB)'], ['Last Backup', '2026-05-15 03:00 AM'], ['Active Sessions', '1'], ['Environment', 'Production']].map(([k, v]) => (
            <div key={k} className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">{k}</span><span className="font-semibold text-gray-900">{v}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
