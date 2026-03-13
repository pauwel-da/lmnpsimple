export default function TextInput({ value, onChange, placeholder, type = 'text', error, autoComplete }) {
  return (
    <input
      type={type}
      className={`form-input${error ? ' input-error' : ''}`}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      autoComplete={autoComplete}
    />
  )
}
