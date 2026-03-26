export default function MessageBubble({ role, content }) {
  const isUser = role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-3xl rounded-[28px] px-5 py-4 text-sm leading-7 shadow-sm ${
          isUser
            ? 'rounded-br-md bg-brand-600 text-white'
            : 'rounded-bl-md border border-white/70 bg-white text-slate-700'
        }`}
      >
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] opacity-70">
          {isUser ? 'Citizen' : 'AI Assistant'}
        </p>
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  )
}
