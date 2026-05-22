import { motion } from 'framer-motion'
import { CreditCard, Download, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { mockInvoices } from '../../../data/mockData'
import toast from 'react-hot-toast'

const statusConfig: Record<string, { badge: string; icon: any }> = {
  Paid: { badge: 'badge-success', icon: CheckCircle },
  Pending: { badge: 'badge-warning', icon: Clock },
  Partial: { badge: 'badge-info', icon: CreditCard },
  Overdue: { badge: 'badge-danger', icon: AlertTriangle },
}

export default function PatientBills() {
  const myBills = mockInvoices.slice(0, 3)
  const totalDue = myBills.reduce((s, i) => s + (i.amount - i.paid), 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-gray-900">My Bills</h1>
        <p className="text-gray-500 text-sm mt-0.5">Your billing history and payment status</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card"><div className="text-xs text-gray-500 mb-1">Total Bills</div><div className="text-2xl font-black text-gray-900">{myBills.length}</div></div>
        <div className="stat-card"><div className="text-xs text-gray-500 mb-1">Amount Due</div><div className="text-2xl font-black text-red-500">₹{totalDue.toLocaleString()}</div></div>
        <div className="stat-card"><div className="text-xs text-gray-500 mb-1">Total Paid</div><div className="text-2xl font-black text-emerald-600">₹{myBills.reduce((s, i) => s + i.paid, 0).toLocaleString()}</div></div>
      </div>

      {/* Bills list */}
      <div className="space-y-4">
        {myBills.map((inv, i) => {
          const cfg = statusConfig[inv.status]
          return (
            <motion.div key={inv.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="dashboard-card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="font-mono font-bold text-blue-600 text-sm">{inv.id}</span>
                  <div className="text-xs text-gray-500 mt-0.5">Date: {inv.date} · Due: {inv.dueDate}</div>
                </div>
                <span className={`badge ${cfg.badge}`}>{inv.status}</span>
              </div>

              {/* Services */}
              <div className="space-y-2 mb-4">
                {inv.services.map(s => (
                  <div key={s.name} className="flex justify-between text-sm">
                    <span className="text-gray-600">{s.name}</span>
                    <span className="font-medium text-gray-900">₹{s.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-100 pt-3 space-y-1">
                <div className="flex justify-between font-black text-gray-900">
                  <span>Total</span><span>₹{inv.amount.toLocaleString()}</span>
                </div>
                {inv.paid > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600 font-medium">
                    <span>Paid</span><span>₹{inv.paid.toLocaleString()}</span>
                  </div>
                )}
                {inv.amount - inv.paid > 0 && (
                  <div className="flex justify-between text-sm text-red-500 font-semibold">
                    <span>Balance Due</span><span>₹{(inv.amount - inv.paid).toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-4">
                {inv.status !== 'Paid' && (
                  <button onClick={() => toast.success('Redirecting to payment...')} className="flex-1 btn-primary text-sm py-2.5 justify-center">Pay Now</button>
                )}
                <button onClick={() => toast.success('Downloading invoice...')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors ${inv.status === 'Paid' ? 'flex-1 justify-center' : ''}`}>
                  <Download size={14} /> Download
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
