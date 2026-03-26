import { useEffect, useRef, useState } from 'react'
import { SendHorizontal } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import AppShell from '../components/layout/AppShell.jsx'
import MessageBubble from '../components/chat/MessageBubble.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import api from '../lib/api.js'

export default function ChatPage() {
  const location = useLocation()
  const { t } = useLanguage()
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState(location.state?.prompt || '')
  const [typing, setTyping] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    api
      .get('/chat')
      .then((response) => {
        setMessages(response.data.messages || [])
      })
      .catch(() => {
        setError('Could not load conversation history.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = async () => {
    const trimmed = message.trim()
    if (!trimmed || typing) {
      return
    }

    setError('')
    setMessages((current) => [...current, { role: 'user', content: trimmed }])
    setMessage('')
    setTyping(true)

    try {
      const response = await api.post('/chat', { message: trimmed })
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: response.data.links?.length
            ? `${response.data.reply}\n\nOfficial links:\n${response.data.links
                .map((link) => `- ${link.label}: ${link.url}`)
                .join('\n')}`
            : response.data.reply,
        },
      ])
    } catch (apiError) {
      setMessages((current) => current.slice(0, -1))
      setError(apiError.response?.data?.message || 'Unable to reach the assistant right now.')
    } finally {
      setTyping(false)
    }
  }

  return (
    <AppShell
      title={t.assistant}
      description="Ask about Indian legal procedures, government schemes, document workflows, and complaint systems."
    >
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <aside className="rounded-[32px] border border-white/70 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/10">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-200">How to ask</p>
          <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
            <li>Explain your goal clearly, like applying for a document or filing a complaint.</li>
            <li>Mention your state or district if the process depends on local offices.</li>
            <li>Ask one topic at a time for the clearest step-by-step answer.</li>
          </ul>
        </aside>

        <section className="flex min-h-[70vh] flex-col rounded-[32px] border border-white/70 bg-white/80 shadow-lg shadow-slate-900/5">
          <div className="border-b border-slate-200 px-6 py-5">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-700">{t.secureChat}</p>
            <p className="mt-2 text-sm text-slate-600">The assistant only answers India government and legal process questions.</p>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
            {loading ? (
              <p className="text-sm text-slate-500">Loading conversation...</p>
            ) : messages.length ? (
              messages.map((entry, index) => <MessageBubble key={`${entry.role}-${index}`} role={entry.role} content={entry.content} />)
            ) : (
              <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-sm leading-7 text-slate-600">
                Start with a question like: &quot;How do I apply for a caste certificate in Karnataka?&quot; or
                &quot;Which pension schemes may apply to my family?&quot;
              </div>
            )}
            {typing ? (
              <div className="rounded-[24px] border border-white/70 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-500">
                {t.typing}
              </div>
            ) : null}
            <div ref={endRef} />
          </div>

          <div className="border-t border-slate-200 px-5 py-5">
            {error ? <p className="mb-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p> : null}
            <div className="flex gap-3">
              <textarea
                rows={3}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    sendMessage()
                  }
                }}
                placeholder="Ask about legal procedures, schemes, certificates, documents, or complaint filing..."
                className="min-h-[84px] flex-1 resize-none rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-400 focus:bg-white"
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={typing}
                className="inline-flex items-center justify-center rounded-[24px] bg-brand-600 px-5 text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
              >
                <SendHorizontal size={20} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
