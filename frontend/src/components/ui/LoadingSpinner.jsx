export default function LoadingSpinner({ fullScreen = false, label = 'Loading...' }) {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? 'min-h-screen bg-mesh' : 'min-h-[200px]'
      }`}
    >
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />
        <p className="mt-4 text-sm font-semibold text-slate-600">{label}</p>
      </div>
    </div>
  )
}
