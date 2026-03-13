import { useState } from 'react'
import Field from '../components/fields/Field'
import TextInput from '../components/fields/TextInput'
import SelectInput from '../components/fields/SelectInput'
import { validateStep1 } from '../utils/validation'

const currentYear = new Date().getFullYear()
const YEARS = [currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4].map(y => ({
  value: String(y),
  label: `Exercice ${y}`,
}))

export default function Step1Identification({ data, update, onNext }) {
  const [errors, setErrors] = useState({})

  function handleNext() {
    const e = validateStep1(data)
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setErrors({})
    onNext()
  }

  return (
    <div className="step">
      <div className="step-header">
        <span className="step-eyebrow">Étape 1 sur 7</span>
        <h2 className="step-title">Votre identification</h2>
        <p className="step-desc">Ces informations apparaîtront sur vos documents fiscaux.</p>
      </div>

      <div className="form-grid">
        <Field label="Prénom" error={errors.prenom} required>
          <TextInput
            value={data.prenom}
            onChange={v => update({ prenom: v })}
            placeholder="Jean"
            autoComplete="given-name"
            error={!!errors.prenom}
          />
        </Field>

        <Field label="Nom" error={errors.nom} required>
          <TextInput
            value={data.nom}
            onChange={v => update({ nom: v })}
            placeholder="Dupont"
            autoComplete="family-name"
            error={!!errors.nom}
          />
        </Field>

        <Field label="Email" error={errors.email} required span={2}>
          <TextInput
            type="email"
            value={data.email}
            onChange={v => update({ email: v })}
            placeholder="jean.dupont@email.fr"
            autoComplete="email"
            error={!!errors.email}
          />
        </Field>

        <Field label="Année fiscale à déclarer" error={errors.annee_fiscale} required span={2}>
          <SelectInput
            value={data.annee_fiscale}
            onChange={v => update({ annee_fiscale: v })}
            options={YEARS}
            placeholder="Sélectionner..."
            error={!!errors.annee_fiscale}
          />
        </Field>
      </div>

      <div className="step-actions">
        <div />
        <button className="btn btn-primary btn-lg" onClick={handleNext}>
          Continuer →
        </button>
      </div>
    </div>
  )
}
