import { motion } from 'framer-motion'
import { CreditCard, Download, CheckCircle, Clock, AlertTriangle, FileText } from 'lucide-react'
import { useDataStore } from '../../../store/dataStore'
import { useAuthStore } from '../../../store/authStore'
import toast from 'react-hot-toast'

const statusConfig: Record<string, { badge: string; icon: any }> = {
  Paid: { badge: 'badge-success', icon: CheckCircle },
  Pending: { badge: 'badge-warning', icon: Clock },
  Partial: { badge: 'badge-info', icon: CreditCard },
  Overdue: { badge: 'badge-danger', icon: AlertTriangle },
}

export default function PatientBills() {
  const { user } = useAuthStore()
  const { invoices, patients, payInvoice } = useDataStore()

  // Find this patient profile by matching user name or email
  const patientProfile = patients.find(
    p => p.email.toLowerCase() === user?.email?.toLowerCase() || p.name.toLowerCase() === user?.name?.toLowerCase()
  )

  const patientId = patientProfile?.id || 'P001'
  const myBills = invoices.filter(i => i.patientId === patientId)
  const totalDue = myBills.reduce((s, i) => s + (i.amount - i.paid), 0)
  const totalPaid = myBills.reduce((s, i) => s + i.paid, 0)

  const handlePay = (id: string) => {
    payInvoice(id)
    toast.success('Payment completed successfully!')
  }

  const handleSimulateReceiptUpload = (invoiceId: string) => {
    // Premium template receipt SVG mock
    const mockReceiptSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><rect width="400" height="500" fill="%23EEF2F6" rx="10"/><path d="M20 50 h360 M20 450 h360" stroke="%23CBD5E1" stroke-width="2"/><text x="40" y="100" font-family="sans-serif" font-size="24" font-weight="bold" fill="%230F172A">BANK RECEIPT</text><text x="40" y="150" font-family="sans-serif" font-size="14" fill="%23475569">Reference ID: TXN99887711</text><text x="40" y="180" font-family="sans-serif" font-size="14" fill="%23475569">Amount: Paid in Full</text><text x="40" y="210" font-family="sans-serif" font-size="14" fill="%23475569">Status: SUCCESSFUL</text><text x="40" y="320" font-family="sans-serif" font-size="12" font-style="italic" fill="%2394A3B8">Thank you for banking with us</text></svg>`
    payInvoice(invoiceId, mockReceiptSvg)
    toast.success('Payment receipt uploaded and verified! Bill marked as paid.')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-gray-900">My Bills</h1>
        <p className="text-gray-500 text-sm mt-0.5">Your billing history and payment status</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="text-xs text-gray-500 mb-1">Total Bills</div>
          <div className="text-2xl font-black text-gray-900">{myBills.length}</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-gray-500 mb-1">Amount Due</div>
          <div className="text-2xl font-black text-red-500">₹{totalDue.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-gray-500 mb-1">Total Paid</div>
          <div className="text-2xl font-black text-emerald-600">₹{totalPaid.toLocaleString()}</div>
        </div>
      </div>

      {/* Bills list */}
      <div className="space-y-4">
        {myBills.map((inv, i) => {
          const cfg = statusConfig[inv.status] || statusConfig.Pending
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
                {inv.services.map((s, idx) => (
                  <div key={`${s.name}-${idx}`} className="flex justify-between text-sm">
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

              {/* Scanned Receipt Link */}
              {inv.scannedImageUrl && (
                <div className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <FileText size={14} className="text-amber-500" />
                    <span>Uploaded Payment Receipt:</span>
                    <span className="font-semibold text-emerald-600">Verified</span>
                  </div>
                  <a 
                    href={inv.scannedImageUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs text-blue-600 font-bold hover:underline"
                  >
                    View Receipt
                  </a>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                {inv.status !== 'Paid' && (
                  <>
                    <button onClick={() => handlePay(inv.id)} className="flex-1 btn-primary text-sm py-2.5 justify-center">Pay Now</button>
                    <button 
                      onClick={() => handleSimulateReceiptUpload(inv.id)} 
                      className="flex-1 px-4 py-2.5 rounded-xl border border-dashed border-gray-300 text-sm font-medium text-gray-500 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
                    >
                      📤 Upload Receipt
                    </button>
                  </>
                )}
                <button onClick={() => toast.success('Downloading invoice...')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors ${inv.status === 'Paid' ? 'flex-1 justify-center' : ''}`}>
                  <Download size={14} /> Download
                </button>
              </div>
            </motion.div>
          )
        })}
        {myBills.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-100">No invoices or bills found.</p>
        )}
      </div>
    </div>
  )
}
