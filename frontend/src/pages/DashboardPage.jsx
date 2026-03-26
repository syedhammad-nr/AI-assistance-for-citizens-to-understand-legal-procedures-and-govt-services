import { useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell.jsx'
import QuickActionCard from '../components/ui/QuickActionCard.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { quickActionPrompts } from '../lib/constants.js'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useLanguage()

  const actions = [
    {
      key: 'documents',
      title: t.applyDocuments,
      description: 'Get document-specific guidance for Aadhaar, PAN, passport, voter services, and more.',
    },
    {
      key: 'schemes',
      title: t.findSchemes,
      description: 'Discover schemes based on income, education, and state-level eligibility factors.',
    },
    {
      key: 'legal',
      title: t.legalHelp,
      description: 'Understand basic legal procedures like complaints, notices, consumer disputes, and court steps.',
    },
    {
      key: 'complaint',
      title: t.complaintGuidance,
      description: 'Learn where and how to file online grievances or public complaints through official channels.',
    },
  ]

  return (
    <AppShell
      title={t.welcome}
      description={`Hello ${user?.name || 'Citizen'}, let’s make legal and government processes easier to understand.`}
    >
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-lg shadow-slate-900/5">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-700">{t.quickActions}</p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {actions.map((action) => (
              <QuickActionCard
                key={action.key}
                title={action.title}
                description={action.description}
                onClick={() =>
                  navigate('/assistant', {
                    state: {
                      prompt: quickActionPrompts[action.key],
                    },
                  })
                }
              />
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[32px] border border-brand-100 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/10">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-200">Profile snapshot</p>
            <div className="mt-6 space-y-4 text-sm text-slate-300">
              <div>
                <p className="text-slate-500">State</p>
                <p className="mt-1 text-base font-semibold text-white">{user?.address?.state || 'Not added yet'}</p>
              </div>
              <div>
                <p className="text-slate-500">District</p>
                <p className="mt-1 text-base font-semibold text-white">{user?.address?.district || 'Not added yet'}</p>
              </div>
              <div>
                <p className="text-slate-500">Documents</p>
                <p className="mt-1 text-base font-semibold text-white">
                  {user?.documentsOwned?.length ? user.documentsOwned.join(', ') : 'No documents selected'}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-lg shadow-slate-900/5">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-700">Next best step</p>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Keep your profile complete so the assistant can tailor scheme eligibility, document checklists, and local process
              guidance more accurately.
            </p>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="mt-6 rounded-full bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              Update profile
            </button>
          </div>
        </aside>
      </section>
    </AppShell>
  )
}
