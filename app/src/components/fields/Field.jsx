export default function Field({ label, hint, error, required, children, span }) {
  return (
    <div className={`form-field${span === 2 ? ' span-2' : ''}`}>
      <label className="field-label">
        {label}
        {required && <span className="required"> *</span>}
      </label>
      {hint && <p className="field-hint">{hint}</p>}
      {children}
      {error && <span className="field-error">{error}</span>}
    </div>
  )
}
