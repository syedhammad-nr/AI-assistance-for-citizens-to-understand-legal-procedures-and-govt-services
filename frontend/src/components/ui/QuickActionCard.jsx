export default function QuickActionCard({ title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-[28px] border border-white/70 bg-white/80 p-5 text-left shadow-lg shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="mb-4 inline-flex rounded-2xl bg-brand-50 px-3 py-1 text-sm font-bold text-brand-700">
        Action
      </div>
      <h3 className="font-display text-xl font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <span className="mt-5 inline-block text-sm font-semibold text-brand-700 transition group-hover:translate-x-1">
        Open assistant
      </span>
    </button>
  )
}
