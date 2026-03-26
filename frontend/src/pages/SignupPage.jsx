import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { languageOptions } from '../lib/constants.js'

export default function SignupPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { t, setLanguage } = useLanguage()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    preferredLanguage: 'en',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const user = await register(form)
      setLanguage(user.preferredLanguage || form.preferredLanguage)
      navigate('/profile')
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to create the account.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-mesh px-4 py-8">
      <div className="w-full max-w-3xl rounded-[36px] border border-white/70 bg-white p-8 shadow-2xl shadow-slate-900/10 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-700">{t.createAccount}</p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-slate-950">Build your citizen profile</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          Start with the basics now. You can complete your government profile and document details on the next screen.
        </p>
        <form className="mt-8 grid gap-5 sm:grid-cols-2" onSubmit={onSubmit}>
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Full name</label>
            <input
              required
              value={form.name}
              onChange={onChange('name')}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-400 focus:bg-white"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={onChange('email')}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-400 focus:bg-white"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
            <input
              required
              type="password"
              value={form.password}
              onChange={onChange('password')}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-400 focus:bg-white"
              placeholder="Minimum 8 characters"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">{t.preferredLanguage}</label>
            <select
              value={form.preferredLanguage}
              onChange={onChange('preferredLanguage')}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-400 focus:bg-white"
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {error ? <p className="sm:col-span-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p> : null}
          <div className="sm:col-span-2 flex items-center justify-between gap-4">
            <Link to="/login" className="text-sm font-semibold text-slate-600">
              Already have an account?
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-brand-600 px-6 py-3.5 font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
            >
              {submitting ? 'Creating account...' : t.createAccount}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
