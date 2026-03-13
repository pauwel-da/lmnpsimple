import { useState } from 'react'
import Field from '../components/fields/Field'
import NumberInput from '../components/fields/NumberInput'
import DateInput from '../components/fields/DateInput'
import { validateStep3 } from '../utils/validation'

export default function Step3Recettes({ data, update, onNext, onPrev }) {
  const [errors, setErrors] = useState({})

  function handleNext() {
    const e = validateStep3(data)
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setErrors({})
    onNext()
  }

  return (
    <div className="step">
      <div className="step-header">
        <span className="step-eyebrow">Étape 3 sur 7</span>
        <h2 className="step-title">Recettes locatives</h2>
        <p className="step-desc">Loyers encaissés sur l'exercice fiscal, charges locataires comprises.</p>
      </div>

      <div className="form-grid">
        <Field
          label="Recettes locatives brutes"
          hint="Total des loyers encaissés (hors dépôts de garantie)"
          error={errors.recettes_brutes}
          required
          span={2}
        >
          <NumberInput
            value={data.recettes_brutes}
            onChange={v => update({ recettes_brutes: v })}
            placeholder="12 000"
            error={!!errors.recettes_brutes}
          />
        </Field>

        <Field label="Début d'exercice" error={errors.debut_exercice} required>
          <DateInput
            value={data.debut_exercice}
            onChange={v => update({ debut_exercice: v })}
            error={!!errors.debut_exercice}
          />
        </Field>

        <Field label="Fin d'exercice" error={errors.fin_exercice} required>
          <DateInput
            value={data.fin_exercice}
            onChange={v => update({ fin_exercice: v })}
            min={data.debut_exercice || undefined}
            error={!!errors.fin_exercice}
          />
        </Field>
      </div>

      <div className="step-actions">
        <button className="btn btn-ghost" onClick={onPrev}>← Précédent</button>
        <button className="btn btn-primary btn-lg" onClick={handleNext}>Continuer →</button>
      </div>
    </div>
  )
}
