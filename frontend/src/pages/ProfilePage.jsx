import { useEffect, useState } from 'react'
import AppShell from '../components/layout/AppShell.jsx'
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import api from '../lib/api.js'
import {
  documentOptions,
  educationOptions,
  financialOptions,
  languageOptions,
} from '../lib/constants.js'

const emptyProfile = {
  name: '',
  dob: '',
  gender: '',
  phone: '',
  address: {
    state: '',
    district: '',
  },
  financialStatus: '',
  education: '',
  occupation: '',
  documentsOwned: [],
  preferredLanguage: 'en',
}

const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-400 focus:bg-white'

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const { t, setLanguage } = useLanguage()
  const [form, setForm] = useState(emptyProfile)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/profile')
      .then((response) => {
        setForm({
          ...emptyProfile,
          ...response.data.profile,
          address: {
            ...emptyProfile.address,
            ...response.data.profile.address,
          },
        })
      })
      .catch(() => {
        setError('Unable to load your profile right now.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const setField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const setAddressField = (field) => (event) => {
    setForm((current) => ({
      ...current,
      address: { ...current.address, [field]: event.target.value },
    }))
  }

  const toggleDocument = (documentName) => {
    setForm((current) => ({
      ...current,
      documentsOwned: current.documentsOwned.includes(documentName)
        ? current.documentsOwned.filter((item) => item !== documentName)
        : [...current.documentsOwned, documentName],
    }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    try {
      await api.put('/profile', form)
      await refreshUser()
      setLanguage(form.preferredLanguage)
      setMessage('Profile updated successfully.')
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Could not save profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading your profile..." />
  }

  return (
    <AppShell
      title={t.profile}
      description="Complete your citizen profile so the assistant can tailor document, scheme, and legal guidance."
    >
      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-lg shadow-slate-900/5">
          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Full name">
              <input required value={form.name} onChange={setField('name')} className={inputClass} />
            </FormField>
            <FormField label="Date of birth">
              <input type="date" value={form.dob} onChange={setField('dob')} className={inputClass} />
            </FormField>
            <FormField label="Gender">
              <input value={form.gender} onChange={setField('gender')} className={inputClass} placeholder="Female / Male / Other" />
            </FormField>
            <FormField label="Phone number">
              <input value={form.phone} onChange={setField('phone')} className={inputClass} placeholder="10-digit mobile number" />
            </FormField>
            <FormField label="State">
              <input value={form.address.state} onChange={setAddressField('state')} className={inputClass} />
            </FormField>
            <FormField label="District">
              <input value={form.address.district} onChange={setAddressField('district')} className={inputClass} />
            </FormField>
            <FormField label="Financial condition">
              <select value={form.financialStatus} onChange={setField('financialStatus')} className={inputClass}>
                <option value="">Select</option>
                {financialOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Education">
              <select value={form.education} onChange={setField('education')} className={inputClass}>
                <option value="">Select</option>
                {educationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Occupation">
              <input value={form.occupation} onChange={setField('occupation')} className={inputClass} />
            </FormField>
            <FormField label={t.preferredLanguage}>
              <select value={form.preferredLanguage} onChange={setField('preferredLanguage')} className={inputClass}>
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="mt-8">
            <p className="text-sm font-semibold text-slate-700">Government documents owned</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {documentOptions.map((documentName) => (
                <label
                  key={documentName}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                    form.documentsOwned.includes(documentName)
                      ? 'border-brand-200 bg-brand-50 text-brand-800'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.documentsOwned.includes(documentName)}
                    onChange={() => toggleDocument(documentName)}
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  {documentName}
                </label>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[32px] border border-brand-100 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/10">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-200">Citizen summary</p>
            <div className="mt-6 space-y-4 text-sm text-slate-300">
              <p>Name: {user?.name || form.name || 'Citizen'}</p>
              <p>Language: {form.preferredLanguage.toUpperCase()}</p>
              <p>Income: {form.financialStatus || 'Not set'}</p>
              <p>Documents selected: {form.documentsOwned.length}</p>
            </div>
          </div>
          <div className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-lg shadow-slate-900/5">
            <p className="text-sm leading-7 text-slate-600">
              A complete profile helps the assistant recommend better schemes, likely required documents, and state-specific steps.
            </p>
            {message ? <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{message}</p> : null}
            {error ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p> : null}
            <button
              type="submit"
              disabled={saving}
              className="mt-6 w-full rounded-full bg-brand-600 px-6 py-3.5 font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
            >
              {saving ? 'Saving profile...' : t.saveProfile}
            </button>
          </div>
        </aside>
      </form>
    </AppShell>
  )
}

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  )
}
