export default function SelectInput({ value, onChange, options, error, placeholder }) {
  return (
    <select
      className={`form-input${error ? ' input-error' : ''}`}
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}
