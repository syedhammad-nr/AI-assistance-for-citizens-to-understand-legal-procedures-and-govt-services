import { ArrowRight, BotMessageSquare, Languages, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import LanguageSwitcher from '../components/ui/LanguageSwitcher.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

const featureCards = [
  {
    icon: ShieldCheck,
    title: 'Guidance that stays on-topic',
    description: 'Focused on Indian legal procedures, government schemes, grievance systems, and official documents.',
  },
  {
    icon: Languages,
    title: 'Built for multilingual access',
    description: 'Switch between English, Hindi, and Kannada across the UI and assistant responses.',
  },
  {
    icon: BotMessageSquare,
    title: 'Personalized assistance',
    description: 'Answers adapt to the user profile, owned documents, and financial context for more relevant steps.',
  },
]

export default function LandingPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-mesh text-slate-900">
      <div className="grid-fade absolute inset-x-0 top-0 h-[380px]" />
      <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="glass flex items-center justify-between rounded-[28px] border border-white/70 px-5 py-4 shadow-xl shadow-slate-900/5">
          <div>
            <p className="font-display text-2xl font-semibold text-slate-950">{t.brand}</p>
            <p className="text-sm text-slate-600">{t.tagline}</p>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              to="/login"
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
            >
              {t.signIn}
            </Link>
          </div>
        </header>

        <section className="grid items-center gap-10 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-800">
              <Sparkles size={16} />
              {t.secureChat}
            </div>
            <h1 className="mt-7 max-w-4xl font-display text-5xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-6xl">
              {t.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{t.heroText}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 font-semibold text-white shadow-glow transition hover:bg-brand-700"
              >
                {t.getStarted}
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="rounded-full border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
              >
                {t.signIn}
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[36px] border border-white/70 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/15">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.35),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.28),transparent_28%)]" />
            <div className="relative space-y-5">
              <div className="rounded-[28px] border border-white/10 bg-white/10 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-200">Example</p>
                <p className="mt-3 text-base leading-7 text-slate-100">
                  I lost my Aadhaar and need a replacement. What should I do?
                </p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-brand-500/15 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-100">Assistant reply</p>
                <p className="mt-3 text-base leading-7 text-slate-50">
                  1. Visit the UIDAI official website. 2. Use your registered mobile number or visit an Aadhaar Seva Kendra.
                  3. Keep any available ID proof ready. 4. Download the updated e-Aadhaar after verification.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 pb-16 md:grid-cols-3">
          {featureCards.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-[32px] border border-white/70 bg-white/75 p-6 shadow-lg shadow-slate-900/5"
            >
              <div className="mb-5 inline-flex rounded-2xl bg-brand-50 p-3 text-brand-700">
                <Icon size={20} />
              </div>
              <h2 className="font-display text-2xl font-semibold text-slate-950">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  )
}
