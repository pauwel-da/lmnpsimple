export default function NumberInput({ value, onChange, placeholder, suffix = '€', error, readOnly }) {
  return (
    <div className="input-wrapper">
      <input
        type="number"
        className={`form-input${error ? ' input-error' : ''}`}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder ?? '0'}
        min="0"
        step="0.01"
        readOnly={readOnly}
      />
      {suffix && <span className="input-suffix">{suffix}</span>}
    </div>
  )
}
