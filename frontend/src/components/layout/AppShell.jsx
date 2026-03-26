import { BotMessageSquare, LayoutDashboard, LogOut, UserCircle2 } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'
import LanguageSwitcher from '../ui/LanguageSwitcher.jsx'

const navItemClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive
      ? 'bg-brand-500 text-white shadow-glow'
      : 'text-slate-600 hover:bg-white hover:text-slate-900'
  }`

export default function AppShell({ title, description, children }) {
  const { t } = useLanguage()
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-mesh">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="glass sticky top-4 z-20 mb-8 flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-white/70 px-5 py-4 shadow-xl shadow-slate-900/5">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-lg font-bold text-white">
              AI
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-slate-950">{t.brand}</p>
              <p className="text-sm text-slate-500">{t.tagline}</p>
            </div>
          </Link>

          <nav className="flex items-center gap-2 rounded-full bg-slate-100/80 p-1.5">
            <NavLink to="/dashboard" className={navItemClass}>
              <span className="inline-flex items-center gap-2">
                <LayoutDashboard size={16} />
                {t.dashboard}
              </span>
            </NavLink>
            <NavLink to="/assistant" className={navItemClass}>
              <span className="inline-flex items-center gap-2">
                <BotMessageSquare size={16} />
                {t.assistant}
              </span>
            </NavLink>
            <NavLink to="/profile" className={navItemClass}>
              <span className="inline-flex items-center gap-2">
                <UserCircle2 size={16} />
                {t.profile}
              </span>
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => {
                logout()
                navigate('/login')
              }}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
            >
              <LogOut size={16} />
              {user?.name ? t.logout : 'Logout'}
            </button>
          </div>
        </header>

        <section className="mb-8 flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-700">{title}</p>
          <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            {description}
          </h1>
        </section>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
