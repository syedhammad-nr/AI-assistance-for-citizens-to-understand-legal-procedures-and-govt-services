import { Languages } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { languageOptions } from '../../lib/constants.js'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <label className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
      <Languages size={16} />
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
        className="bg-transparent text-sm outline-none"
      >
        {languageOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
