import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, User, Sparkles, RotateCcw, Upload, Brain } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: Date
}

const mockResponses: Record<string, string> = {
  default: "I'm MediSync AI, your intelligent healthcare assistant. I can help you understand symptoms, medications, and general health advice. Please note that this is for informational purposes only and doesn't replace professional medical consultation.",
  headache: "Headaches can have many causes including tension, dehydration, stress, or vision problems. Common remedies include rest, hydration, and OTC pain relief. If headaches are severe, persistent, or accompanied by fever/vision changes, please consult Dr. Alok Verma (Neurology) immediately.",
  fever: "A fever (above 38°C/100.4°F) is your body's immune response to infection. Stay hydrated, rest, and consider paracetamol. Seek immediate medical attention if fever exceeds 40°C, lasts more than 3 days, or is accompanied by stiff neck or rash.",
  chest: "Chest pain should be evaluated immediately. It can range from musculoskeletal issues to cardiac concerns. If you experience crushing chest pain, shortness of breath, or pain radiating to your arm, please call emergency services or visit Dr. Priya Mehta (Cardiology) urgently.",
  diabetes: "Managing diabetes involves blood sugar monitoring, balanced diet, regular exercise, and medication adherence. Your HbA1c target should be discussed with Dr. Rajan Nair. Regular checkups every 3 months are recommended.",
  blood: "Blood pressure management involves lifestyle changes (low-sodium diet, exercise, stress reduction) and medication if prescribed. Monitor at home twice daily and maintain a log to share with Dr. Priya Mehta.",
  appointment: "To book an appointment, go to the Appointments section in your dashboard. You can select your preferred doctor, date, and time. The system will send you an automated WhatsApp reminder.",
}

const getAIResponse = (message: string): string => {
  const lower = message.toLowerCase()
  if (lower.includes('headache') || lower.includes('head pain') || lower.includes('migraine')) return mockResponses.headache
  if (lower.includes('fever') || lower.includes('temperature') || lower.includes('hot')) return mockResponses.fever
  if (lower.includes('chest') || lower.includes('heart') || lower.includes('cardiac')) return mockResponses.chest
  if (lower.includes('diabetes') || lower.includes('sugar') || lower.includes('glucose')) return mockResponses.diabetes
  if (lower.includes('blood pressure') || lower.includes('hypertension') || lower.includes('bp')) return mockResponses.blood
  if (lower.includes('appointment') || lower.includes('book') || lower.includes('schedule')) return mockResponses.appointment
  return mockResponses.default
}

const suggestedQuestions = [
  'What should I do for a headache?',
  'How to manage diabetes?',
  'What are signs of high blood pressure?',
  'How do I book an appointment?',
]

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'ai', content: "Hello! I'm MediSync AI Assistant 🏥. I can help with medical queries, symptom guidance, and healthcare information. How can I assist you today?", timestamp: new Date() }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [uploadDone, setUploadDone] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim()
    if (!msg) return
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: msg, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', content: getAIResponse(msg), timestamp: new Date() }
    setMessages(prev => [...prev, aiMsg])
    setLoading(false)
  }

  const handleUpload = async () => {
    setUploadDone(false)
    await new Promise(r => setTimeout(r, 2000))
    setUploadDone(true)
    const aiMsg: Message = {
      id: Date.now().toString(), role: 'ai', timestamp: new Date(),
      content: "📋 **AI Medical Summary Generated:**\n\nPatient: Aarav Sharma\n• Diagnosis: Hypertension Stage 1\n• Medications: Amlodipine 5mg (once daily), Lisinopril 10mg (once daily)\n• BP Target: <130/80 mmHg\n• Follow-up: 4 weeks\n• Lifestyle: Low sodium diet, 30 min daily exercise\n\n⚠️ Monitor for side effects: dizziness, dry cough"
    }
    setMessages(prev => [...prev, aiMsg])
    setShowUpload(false)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center shadow-lg">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900">AI Health Assistant</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-500">Powered by Gemini AI · Online</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowUpload(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Upload size={15} /> AI Summary
          </button>
          <button onClick={() => setMessages([{ id: '0', role: 'ai', content: "Session cleared. How can I help you today?", timestamp: new Date() }])}
            className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors"><RotateCcw size={16} /></button>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-card overflow-y-auto p-4 space-y-4 custom-scroll">
        <AnimatePresence>
          {messages.map(msg => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-gradient-to-br from-violet-600 to-purple-500' : 'bg-gradient-to-br from-blue-500 to-cyan-400'}`}>
                {msg.role === 'ai' ? <Brain size={14} className="text-white" /> : <User size={14} className="text-white" />}
              </div>
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${msg.role === 'ai' ? 'bg-gray-50 text-gray-800 rounded-tl-none' : 'text-white rounded-tr-none'}`}
                  style={msg.role === 'user' ? { background: 'linear-gradient(135deg, #0077B6, #00B4D8)' } : {}}>
                  {msg.content}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center flex-shrink-0">
                <Brain size={14} className="text-white" />
              </div>
              <div className="bg-gray-50 rounded-2xl rounded-tl-none px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Suggested questions */}
      <div className="flex gap-2 py-3 flex-wrap">
        {suggestedQuestions.map(q => (
          <button key={q} onClick={() => sendMessage(q)} className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition-colors border border-blue-100">
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <input
          className="flex-1 form-input"
          placeholder="Ask about symptoms, medications, appointments..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
        />
        <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
          className="px-5 py-3 rounded-xl font-semibold text-white disabled:opacity-40 transition-all flex items-center gap-2"
          style={{ background: 'linear-gradient(135deg, #0077B6, #00B4D8)' }}>
          <Send size={16} />
        </button>
      </div>

      {/* Upload modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-4">
              <Sparkles size={28} className="text-violet-600" />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">AI Medical Summary</h2>
            <p className="text-gray-500 text-sm mb-6">Upload a prescription or medical report. Our AI will generate an intelligent summary.</p>
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 mb-6 hover:border-violet-400 transition-colors cursor-pointer">
              <Upload size={24} className="text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Drop your file here or click to upload</p>
              <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 10MB</p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleUpload} className="flex-1 btn-primary py-3 justify-center text-sm"><Brain size={15} /> Generate Summary</button>
              <button onClick={() => setShowUpload(false)} className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50">Cancel</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
