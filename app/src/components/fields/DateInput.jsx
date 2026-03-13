export default function DateInput({ value, onChange, error, min, max }) {
  return (
    <input
      type="date"
      className={`form-input${error ? ' input-error' : ''}`}
      value={value}
      onChange={e => onChange(e.target.value)}
      min={min}
      max={max}
    />
  )
}
