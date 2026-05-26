import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Download, Eye, CreditCard, CheckCircle, Clock, AlertTriangle, Plus, Trash2 } from 'lucide-react'
import { useDataStore, Invoice, ServiceCharge } from '../../../store/dataStore'
import toast from 'react-hot-toast'

const statusConfig: Record<string, { badge: string; icon: any; color: string }> = {
  Paid: { badge: 'badge-success', icon: CheckCircle, color: 'text-emerald-600' },
  Pending: { badge: 'badge-warning', icon: Clock, color: 'text-amber-600' },
  Partial: { badge: 'badge-info', icon: CreditCard, color: 'text-blue-600' },
  Overdue: { badge: 'badge-danger', icon: AlertTriangle, color: 'text-red-600' },
}

export default function BillingPage() {
  const { invoices, patients, addInvoice, payInvoice } = useDataStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null)
  const [showModal, setShowModal] = useState(false)

  const [form, setForm] = useState({
    patientId: '',
    dueDate: '',
    services: [{ name: 'Consultation Fee', amount: 800 }] as ServiceCharge[]
  })

  const filtered = invoices.filter(inv =>
    (statusFilter === 'All' || inv.status === statusFilter) &&
    (inv.patientName.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase()))
  )

  const totalRevenue = invoices.reduce((s, i) => s + i.paid, 0)
  const totalPending = invoices.reduce((s, i) => s + (i.amount - i.paid), 0)

  const openNewInvoiceModal = () => {
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    const nextWeekStr = nextWeek.toISOString().split('T')[0]

    setForm({
      patientId: patients[0]?.id || '',
      dueDate: nextWeekStr,
      services: [{ name: 'Consultation Fee', amount: 800 }]
    })
    setShowModal(true)
  }

  const addServiceLine = () => {
    setForm(prev => ({
      ...prev,
      services: [...prev.services, { name: '', amount: 0 }]
    }))
  }

  const removeServiceLine = (index: number) => {
    if (form.services.length === 1) return
    setForm(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }))
  }

  const handleServiceChange = (index: number, key: keyof ServiceCharge, val: string | number) => {
    setForm(prev => ({
      ...prev,
      services: prev.services.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            [key]: key === 'amount' ? (parseInt(val as string) || 0) : val
          }
        }
        return item
      })
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.patientId || !form.dueDate) {
      toast.error('Please fill in patient and due date')
      return
    }

    const patient = patients.find(p => p.id === form.patientId)
    if (!patient) {
      toast.error('Selected patient not found')
      return
    }

    const validServices = form.services.filter(s => s.name.trim() !== '' && s.amount > 0)
    if (validServices.length === 0) {
      toast.error('Please add at least one valid service charge')
      return
    }

    const totalAmount = validServices.reduce((sum, item) => sum + item.amount, 0)

    addInvoice({
      patientId: patient.id,
      patientName: patient.name,
      dueDate: form.dueDate,
      services: validServices,
      amount: totalAmount,
    })

    toast.success('New invoice generated successfully!')
    setShowModal(false)
  }

  const handleMarkAsPaid = (id: string) => {
    payInvoice(id)
    toast.success(`Invoice ${id} marked as Paid`)
    if (viewInvoice && viewInvoice.id === id) {
      setViewInvoice(prev => prev ? { ...prev, paid: prev.amount, status: 'Paid' } : null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Billing & Invoices</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage payments and invoice history</p>
        </div>
        <button onClick={openNewInvoiceModal} className="btn-primary text-sm py-2.5">
          <CreditCard size={15} /> New Invoice
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `₹${(totalRevenue / 1000).toFixed(1)}K`, color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50', textColor: 'text-emerald-600' },
          { label: 'Outstanding', value: `₹${(totalPending / 1000).toFixed(1)}K`, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', textColor: 'text-amber-600' },
          { label: 'Paid Invoices', value: invoices.filter(i => i.status === 'Paid').length, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50', textColor: 'text-blue-600' },
          { label: 'Overdue', value: invoices.filter(i => i.status === 'Overdue').length, color: 'from-red-500 to-rose-500', bg: 'bg-red-50', textColor: 'text-red-600' },
        ].map(c => (
          <div key={c.label} className="stat-card">
            <div className="text-xs text-gray-500 mb-1">{c.label}</div>
            <div className={`text-2xl font-black ${c.textColor}`}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="form-input pl-9" placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {['All', 'Paid', 'Pending', 'Partial', 'Overdue'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${statusFilter === s ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices table */}
      <div className="dashboard-card p-0 overflow-hidden">
        <table className="data-table">
          <thead><tr><th>Invoice ID</th><th>Patient</th><th>Date</th><th>Due Date</th><th>Amount</th><th>Paid</th><th>Balance</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map((inv, i) => {
              const cfg = statusConfig[inv.status] || { badge: 'badge-warning', color: 'text-amber-600' }
              return (
                <motion.tr key={inv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}>
                  <td><span className="font-mono text-sm font-semibold text-blue-600">{inv.id}</span></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 text-white text-xs font-bold flex items-center justify-center">{inv.patientName[0]}</div>
                      <span className="text-sm font-medium text-gray-800">{inv.patientName}</span>
                    </div>
                  </td>
                  <td><span className="text-sm text-gray-600">{inv.date}</span></td>
                  <td><span className="text-sm text-gray-600">{inv.dueDate}</span></td>
                  <td><span className="text-sm font-bold text-gray-900">₹{inv.amount.toLocaleString()}</span></td>
                  <td><span className="text-sm font-semibold text-emerald-600">₹{inv.paid.toLocaleString()}</span></td>
                  <td><span className={`text-sm font-semibold ${inv.amount - inv.paid > 0 ? 'text-red-500' : 'text-gray-400'}`}>₹{(inv.amount - inv.paid).toLocaleString()}</span></td>
                  <td><span className={`badge ${cfg.badge}`}>{inv.status}</span></td>
                  <td>
                    <div className="flex gap-1.5">
                      <button onClick={() => setViewInvoice(inv)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"><Eye size={14} /></button>
                      <button onClick={() => toast.success('Downloading invoice PDF...')} className="p-1.5 rounded-lg hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition-colors"><Download size={14} /></button>
                      {inv.status !== 'Paid' && (
                        <button onClick={() => handleMarkAsPaid(inv.id)} className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors" title="Mark as Paid"><CheckCircle size={14} /></button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Invoice detail modal */}
      {viewInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-gray-900">Invoice Details</h2>
              <span className={`badge ${statusConfig[viewInvoice.status]?.badge || 'badge-warning'}`}>{viewInvoice.status}</span>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 mb-4">
              <div className="font-mono text-lg font-black text-blue-600 mb-1">{viewInvoice.id}</div>
              <div className="text-gray-600 text-sm">Patient: <span className="font-semibold text-gray-900">{viewInvoice.patientName}</span></div>
              <div className="text-gray-600 text-sm">Date: {viewInvoice.date} · Due: {viewInvoice.dueDate}</div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Services</div>
              {viewInvoice.services.map(s => (
                <div key={s.name} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-700">{s.name}</span>
                  <span className="text-sm font-semibold text-gray-900">₹{s.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between py-3 border-t-2 border-gray-200">
              <span className="font-bold text-gray-900">Total Amount</span>
              <span className="font-black text-xl text-gray-900">₹{viewInvoice.amount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-emerald-600 font-medium">Amount Paid</span>
              <span className="font-bold text-emerald-600">₹{viewInvoice.paid.toLocaleString()}</span>
            </div>
            <div className="flex gap-3 mt-6">
              {viewInvoice.status !== 'Paid' && (
                <button onClick={() => handleMarkAsPaid(viewInvoice.id)} className="flex-1 btn-primary text-sm justify-center py-2.5">Mark Paid</button>
              )}
              <button onClick={() => toast.success('Downloading PDF...')} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50"><Download size={14} /></button>
              <button onClick={() => setViewInvoice(null)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50">Close</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* New Invoice Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl my-8">
            <h2 className="text-xl font-black text-gray-900 mb-6">Create New Invoice</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Select Patient *</label>
                <select className="form-input" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} required>
                  <option value="">Choose patient...</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Due Date *</label>
                <input type="date" className="form-input" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} required />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="form-label">Services / Items</label>
                  <button type="button" onClick={addServiceLine} className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"><Plus size={12} /> Add Item</button>
                </div>
                
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scroll pr-1">
                  {form.services.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input className="form-input flex-1" placeholder="Service Name" value={item.name} onChange={e => handleServiceChange(idx, 'name', e.target.value)} required />
                      <input type="number" className="form-input w-28" placeholder="Fee (₹)" value={item.amount || ''} onChange={e => handleServiceChange(idx, 'amount', e.target.value)} required />
                      <button type="button" onClick={() => removeServiceLine(idx)} className="p-2.5 rounded-xl border border-gray-150 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors" disabled={form.services.length === 1}><Trash2 size={15} /></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-sm font-bold text-gray-900 border-t border-gray-100">
                <span>Total Amount:</span>
                <span className="text-lg">₹{form.services.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</span>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 btn-primary text-sm justify-center py-3">Generate Invoice</button>
                <button type="button" className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
