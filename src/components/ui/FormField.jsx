export default function FormField({ label, className = '', ...inputProps }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
      <input className="input-field" {...inputProps} />
    </div>
  )
}
