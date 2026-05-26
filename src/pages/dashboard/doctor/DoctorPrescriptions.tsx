import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pill, Download, Eye, Upload, FileText, CheckCircle } from 'lucide-react'
import { useAuthStore } from '../../../store/authStore'
import { useDataStore, Prescription } from '../../../store/dataStore'
import toast from 'react-hot-toast'

// Canvas Signature Pad Component
function SignaturePad({ onSave, onClose }: { onSave: (base64: string) => void; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.strokeStyle = '#023E8A' // Navy blue signature ink
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const getCoordinates = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect()
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      }
    }

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      setIsDrawing(true)
      const coords = getCoordinates(e)
      ctx.beginPath()
      ctx.moveTo(coords.x, coords.y)
      e.preventDefault()
    }

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return
      const coords = getCoordinates(e)
      ctx.lineTo(coords.x, coords.y)
      ctx.stroke()
      e.preventDefault()
    }

    const stopDrawing = () => {
      setIsDrawing(false)
    }

    // Mouse events
    canvas.addEventListener('mousedown', startDrawing)
    canvas.addEventListener('mousemove', draw)
    canvas.addEventListener('mouseup', stopDrawing)
    canvas.addEventListener('mouseleave', stopDrawing)

    // Touch events for mobile/tablet
    canvas.addEventListener('touchstart', startDrawing, { passive: false })
    canvas.addEventListener('touchmove', draw, { passive: false })
    canvas.addEventListener('touchend', stopDrawing)

    return () => {
      canvas.removeEventListener('mousedown', startDrawing)
      canvas.removeEventListener('mousemove', draw)
      canvas.removeEventListener('mouseup', stopDrawing)
      canvas.removeEventListener('mouseleave', stopDrawing)
      canvas.removeEventListener('touchstart', startDrawing)
      canvas.removeEventListener('touchmove', draw)
      canvas.removeEventListener('touchend', stopDrawing)
    }
  }, [isDrawing])

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const saveCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const base64 = canvas.toDataURL()
    onSave(base64)
  }

  return (
    <div className="space-y-4">
      <div className="border border-dashed border-gray-300 rounded-2xl bg-slate-50 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={400}
          height={160}
          className="w-full h-40 bg-slate-50 cursor-crosshair touch-none"
        />
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={clearCanvas} className="px-4 py-2 border border-gray-200 hover:bg-gray-100 rounded-xl text-xs font-semibold text-gray-600 transition-colors">Clear</button>
        <button type="button" onClick={saveCanvas} className="flex-1 btn-primary text-xs justify-center py-2">Use Signature</button>
        <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-200 hover:bg-gray-100 rounded-xl text-xs font-semibold text-gray-600 transition-colors">Cancel</button>
      </div>
    </div>
  )
}

export default function DoctorPrescriptions() {
  const { user } = useAuthStore()
  const { prescriptions, patients, addPrescription } = useDataStore()
  const [showNew, setShowNew] = useState(false)
  const [viewRx, setViewRx] = useState<Prescription | null>(null)
  
  // Issuance tabs: 'digital' | 'scanned'
  const [tab, setTab] = useState<'digital' | 'scanned'>('digital')
  const [showSignaturePad, setShowSignaturePad] = useState(false)

  // Filter prescriptions issued by this doctor
  const docName = user?.name || ''
  const myPrescriptions = prescriptions.filter(rx => 
    rx.doctorName.toLowerCase().includes(docName.replace('Dr. ', '').toLowerCase().trim()) || rx.doctorName.toLowerCase().includes(docName.toLowerCase().trim())
  )

  const [form, setForm] = useState({
    patientId: '',
    medicationName: '',
    dosage: '',
    frequency: 'Once daily',
    duration: '30 days',
    notes: '',
    signatureBase64: '',
    scannedImageUrl: '',
  })

  const openNewRxModal = () => {
    setForm({
      patientId: patients[0]?.id || '',
      medicationName: '',
      dosage: '',
      frequency: 'Once daily',
      duration: '30 days',
      notes: '',
      signatureBase64: '',
      scannedImageUrl: '',
    })
    setTab('digital')
    setShowSignaturePad(false)
    setShowNew(true)
  }

  // Simulated scan upload handler
  const handleSimulateScan = () => {
    // Premium template Rx SVG mock
    const mockRxSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><rect width="400" height="500" fill="%23FFF" rx="10"/><path d="M20 50 h360 M20 450 h360" stroke="%23E2E8F0" stroke-width="2"/><text x="40" y="100" font-family="monospace" font-size="28" font-weight="bold" fill="%23023E8A">Rx</text><line x1="50" y1="150" x2="350" y2="150" stroke="%2364748B" stroke-width="1.5" stroke-dasharray="5 5"/><line x1="50" y1="200" x2="300" y2="200" stroke="%2364748B" stroke-width="1.5" stroke-dasharray="5 5"/><line x1="50" y1="250" x2="320" y2="250" stroke="%2364748B" stroke-width="1.5" stroke-dasharray="5 5"/><text x="50" y="320" font-family="sans-serif" font-size="14" fill="%23475569">Amoxicillin 500mg - 3 times daily</text><text x="50" y="360" font-family="sans-serif" font-size="12" font-style="italic" fill="%2394A3B8">Physically signed by Doctor</text></svg>`
    setForm(prev => ({
      ...prev,
      scannedImageUrl: mockRxSvg,
      medicationName: 'Amoxicillin',
      dosage: '500mg',
      notes: 'Issued via physical scan upload.',
    }))
    toast.success('Handwritten prescription scan uploaded and parsed!')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.patientId) {
      toast.error('Please select a patient')
      return
    }

    if (tab === 'digital' && (!form.medicationName || !form.dosage)) {
      toast.error('Please fill in medication details')
      return
    }

    if (tab === 'digital' && !form.signatureBase64) {
      toast.error('Please sign the prescription to authorize')
      return
    }

    if (tab === 'scanned' && !form.scannedImageUrl) {
      toast.error('Please upload or scan the handwritten prescription file')
      return
    }

    const patient = patients.find(p => p.id === form.patientId)
    if (!patient) {
      toast.error('Selected patient not found')
      return
    }

    addPrescription({
      patientId: patient.id,
      patientName: patient.name,
      doctorName: user?.name || 'Dr. Priya Mehta',
      medications: [{
        name: form.medicationName || 'Amoxicillin',
        dosage: form.dosage || '500mg',
        frequency: form.frequency,
        duration: form.duration,
      }],
      notes: form.notes,
      signatureBase64: tab === 'digital' ? form.signatureBase64 : undefined,
      scannedImageUrl: tab === 'scanned' ? form.scannedImageUrl : undefined,
    })

    toast.success('Prescription created successfully!')
    setShowNew(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Prescriptions</h1>
          <p className="text-gray-500 text-sm mt-0.5">{myPrescriptions.length} prescriptions issued</p>
        </div>
        <button onClick={openNewRxModal} className="btn-primary text-sm py-2.5"><Plus size={15} /> New Prescription</button>
      </div>

      <div className="space-y-4">
        {myPrescriptions.map((rx, i) => (
          <motion.div key={rx.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="dashboard-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-blue-600">{rx.id}</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-sm text-gray-500">{rx.date}</span>
                  <span className={`badge ${rx.scannedImageUrl ? 'badge-warning' : 'badge-success'}`}>
                    {rx.scannedImageUrl ? 'Scanned' : 'Digital'}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mt-0.5">{rx.patientName}</h3>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setViewRx(rx)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"><Eye size={15} /></button>
                <button onClick={() => toast.success('Downloading prescription...')} className="p-1.5 rounded-lg hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition-colors"><Download size={15} /></button>
              </div>
            </div>
            {rx.scannedImageUrl ? (
              <div className="flex items-center gap-3 p-3 bg-slate-50 border border-gray-150 rounded-xl">
                <FileText size={18} className="text-amber-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-gray-900 text-sm">Handwritten Prescr. Scan</span>
                  <span className="text-xs text-gray-500 ml-2">({rx.medications[0]?.name})</span>
                </div>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle size={12} /> Verified
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                {rx.medications.map((m, idx) => (
                  <div key={`${m.name}-${idx}`} className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                    <Pill size={14} className="text-blue-500 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="font-semibold text-gray-900 text-sm">{m.name}</span>
                      <span className="text-xs text-gray-500 ml-2">{m.dosage}</span>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <div>{m.frequency}</div>
                      <div className="font-medium text-gray-700">{m.duration}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {rx.notes && (
              <div className="mt-3 p-3 bg-amber-50 rounded-xl">
                <p className="text-xs text-amber-700"><span className="font-semibold">Notes: </span>{rx.notes}</p>
              </div>
            )}
          </motion.div>
        ))}
        {myPrescriptions.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">No prescriptions issued yet.</div>
        )}
      </div>

      {showNew && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl my-8">
            <h2 className="text-xl font-black text-gray-900 mb-4">Issue Prescription</h2>
            
            {/* Modal Tabs */}
            <div className="flex border-b border-gray-100 mb-4">
              <button type="button" onClick={() => setTab('digital')} className={`flex-1 pb-2.5 text-sm font-bold border-b-2 transition-all ${tab === 'digital' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'}`}>Digitally Issued</button>
              <button type="button" onClick={() => setTab('scanned')} className={`flex-1 pb-2.5 text-sm font-bold border-b-2 transition-all ${tab === 'scanned' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'}`}>Scanned Handwritten</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Patient Name *</label>
                <select className="form-input" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} required>
                  <option value="">Select patient...</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
                </select>
              </div>

              {tab === 'digital' ? (
                <>
                  <div>
                    <label className="form-label">Medication Name *</label>
                    <input className="form-input" placeholder="e.g. Amlodipine" value={form.medicationName} onChange={e => setForm({ ...form, medicationName: e.target.value })} required={tab==='digital'} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Dosage *</label>
                      <input className="form-input" placeholder="e.g. 5mg" value={form.dosage} onChange={e => setForm({ ...form, dosage: e.target.value })} required={tab==='digital'} />
                    </div>
                    <div>
                      <label className="form-label">Frequency</label>
                      <select className="form-input" value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value })}>
                        <option>Once daily</option><option>Twice daily</option><option>Three times daily</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Duration</label>
                      <input className="form-input" placeholder="e.g. 30 days" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
                    </div>
                    <div>
                      <label className="form-label">Signature *</label>
                      {form.signatureBase64 ? (
                        <div className="relative border border-gray-250 bg-slate-50 rounded-xl p-2 h-[42px] flex items-center justify-between">
                          <img src={form.signatureBase64} alt="Doctor Signature" className="max-h-8 object-contain" />
                          <button type="button" onClick={() => setForm(f => ({ ...f, signatureBase64: '' }))} className="text-xs text-red-500 font-bold hover:underline">Clear</button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => setShowSignaturePad(true)} className="w-full py-2.5 px-4 rounded-xl border border-dashed border-gray-300 text-xs font-semibold text-gray-500 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1">
                          🖋️ Draw Signature
                        </button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Prescription Document Scan *</label>
                    {form.scannedImageUrl ? (
                      <div className="border border-gray-200 rounded-2xl p-4 bg-slate-50 relative">
                        <div className="aspect-[4/3] max-h-36 overflow-hidden rounded-xl border border-gray-100 flex items-center justify-center bg-white mb-2">
                          <img src={form.scannedImageUrl} alt="Scanned Document" className="h-full object-contain" />
                        </div>
                        <button type="button" onClick={() => setForm(f => ({ ...f, scannedImageUrl: '', medicationName: '', dosage: '' }))} className="text-xs text-red-500 font-bold hover:underline">Delete Scan</button>
                      </div>
                    ) : (
                      <button type="button" onClick={handleSimulateScan} className="w-full py-8 border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50/20 rounded-2xl transition-all flex flex-col items-center justify-center gap-2">
                        <Upload size={24} className="text-gray-400" />
                        <span className="text-xs font-semibold text-gray-500">Scan / Upload Handwritten Rx</span>
                        <span className="text-[10px] text-gray-400">(Simulate Upload)</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="form-label">Doctor Notes</label>
                <textarea className="form-input h-16 resize-none" placeholder="Additional instructions..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </div>

              {showSignaturePad && tab === 'digital' ? (
                <div className="border-t border-gray-100 pt-4 mt-2">
                  <span className="text-xs font-semibold text-gray-500 mb-2 block">Drawn Sign Authorization</span>
                  <SignaturePad
                    onSave={(b64) => {
                      setForm(f => ({ ...f, signatureBase64: b64 }))
                      setShowSignaturePad(false)
                    }}
                    onClose={() => setShowSignaturePad(false)}
                  />
                </div>
              ) : (
                <div className="flex gap-3 mt-6">
                  <button type="submit" className="flex-1 btn-primary text-sm justify-center py-3">
                    {tab === 'digital' ? 'Authorize & Issue' : 'Submit Scan'}
                  </button>
                  <button type="button" className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50" onClick={() => setShowNew(false)}>Cancel</button>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      )}

      {/* View Modal */}
      {viewRx && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-black text-gray-900 mb-6">Prescription Sheet</h2>
            
            {viewRx.scannedImageUrl ? (
              <div className="space-y-4">
                <div className="bg-slate-50 border border-gray-150 rounded-2xl p-4 flex flex-col items-center">
                  <div className="w-full aspect-[4/5] bg-white border border-gray-100 rounded-xl overflow-hidden shadow-inner flex items-center justify-center p-2 mb-2 max-h-[300px]">
                    <img src={viewRx.scannedImageUrl} alt="Scanned prescription" className="h-full object-contain" />
                  </div>
                  <span className="text-xs text-gray-500 font-mono">Prescription Reference ID: {viewRx.id}</span>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                  <div className="font-mono text-sm font-bold text-blue-600 mb-1">{viewRx.id}</div>
                  <div className="text-sm text-gray-600">Patient: <span className="font-semibold text-gray-900">{viewRx.patientName}</span></div>
                  <div className="text-sm text-gray-600">Doctor: <span className="font-semibold text-gray-900">{viewRx.doctorName}</span></div>
                  <div className="text-sm text-gray-600">Date: {viewRx.date}</div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Medications</div>
                  {viewRx.medications.map((m, idx) => (
                    <div key={`${m.name}-${idx}`} className="p-3 bg-blue-50 rounded-xl text-sm">
                      <div className="font-bold text-gray-950">{m.name} ({m.dosage})</div>
                      <div className="text-xs text-gray-600 mt-0.5">{m.frequency} for {m.duration}</div>
                    </div>
                  ))}
                </div>
                {viewRx.signatureBase64 && (
                  <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-3 mb-4 flex flex-col items-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Authorized Doctor Signature</span>
                    <img src={viewRx.signatureBase64} alt="Doctor Digital Signature" className="max-h-12 object-contain" />
                  </div>
                )}
              </>
            )}

            {viewRx.notes && (
              <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-800 mb-4">
                <span className="font-semibold">Doctor Notes:</span> {viewRx.notes}
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => toast.success('Downloading...')} className="flex-1 btn-primary text-sm justify-center py-2.5">Download PDF</button>
              <button onClick={() => setViewRx(null)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 w-24">Close</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
