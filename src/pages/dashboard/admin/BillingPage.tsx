import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Download, Eye, CreditCard, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { mockInvoices } from '../../../data/mockData'
import toast from 'react-hot-toast'

const statusConfig: Record<string, { badge: string; icon: any; color: string }> = {
  Paid: { badge: 'badge-success', icon: CheckCircle, color: 'text-emerald-600' },
  Pending: { badge: 'badge-warning', icon: Clock, color: 'text-amber-600' },
  Partial: { badge: 'badge-info', icon: CreditCard, color: 'text-blue-600' },
  Overdue: { badge: 'badge-danger', icon: AlertTriangle, color: 'text-red-600' },
}

export default function BillingPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [viewInvoice, setViewInvoice] = useState<typeof mockInvoices[0] | null>(null)

  const filtered = mockInvoices.filter(inv =>
    (statusFilter === 'All' || inv.status === statusFilter) &&
    (inv.patientName.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase()))
  )

  const totalRevenue = mockInvoices.reduce((s, i) => s + i.paid, 0)
  const totalPending = mockInvoices.reduce((s, i) => s + (i.amount - i.paid), 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Billing & Invoices</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage payments and invoice history</p>
        </div>
        <button onClick={() => toast.success('Generating new invoice...')} className="btn-primary text-sm py-2.5">
          <CreditCard size={15} /> New Invoice
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `₹${(totalRevenue / 1000).toFixed(1)}K`, color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50', textColor: 'text-emerald-600' },
          { label: 'Outstanding', value: `₹${(totalPending / 1000).toFixed(1)}K`, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', textColor: 'text-amber-600' },
          { label: 'Paid Invoices', value: mockInvoices.filter(i => i.status === 'Paid').length, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50', textColor: 'text-blue-600' },
          { label: 'Overdue', value: mockInvoices.filter(i => i.status === 'Overdue').length, color: 'from-red-500 to-rose-500', bg: 'bg-red-50', textColor: 'text-red-600' },
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
              const cfg = statusConfig[inv.status]
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
              <span className={`badge ${statusConfig[viewInvoice.status].badge}`}>{viewInvoice.status}</span>
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
              <button onClick={() => toast.success('Downloading PDF...')} className="flex-1 btn-primary text-sm justify-center py-2.5"><Download size={14} /> Download PDF</button>
              <button onClick={() => setViewInvoice(null)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50">Close</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
