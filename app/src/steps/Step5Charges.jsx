import { useState } from 'react'
import Field from '../components/fields/Field'
import NumberInput from '../components/fields/NumberInput'
import { validateStep5 } from '../utils/validation'

const CHARGE_FIELDS = [
  { key: 'assurance', label: 'Assurance (PNO / GLI)', hint: 'Assurance propriétaire non-occupant et garantie loyers impayés' },
  { key: 'taxe_fonciere', label: 'Taxe foncière', hint: 'Montant annuel (hors taxe sur les ordures ménagères si récupérable)' },
  { key: 'charges_copropriete', label: 'Charges de copropriété', hint: 'Charges non récupérables sur le locataire' },
  { key: 'frais_gestion', label: 'Frais de gestion locative', hint: 'Honoraires agence, plateforme de réservation, syndic...' },
  { key: 'travaux_exercice', label: "Travaux de l'exercice", hint: "Travaux de réparation et entretien réalisés pendant l'exercice" },
  { key: 'frais_comptabilite', label: 'Frais de comptabilité', hint: 'Expert-comptable, logiciel, adhésion OGA' },
  { key: 'autres_charges', label: 'Autres charges déductibles', hint: 'Frais divers liés à la location' },
]

export default function Step5Charges({ data, update, onNext, onPrev }) {
  const [errors, setErrors] = useState({})

  function handleNext() {
    const e = validateStep5(data)
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setErrors({})
    onNext()
  }

  return (
    <div className="step">
      <div className="step-header">
        <span className="step-eyebrow">Étape 5 sur 7</span>
        <h2 className="step-title">Charges déductibles</h2>
        <p className="step-desc">Laissez à 0 les charges qui ne s'appliquent pas à votre situation.</p>
      </div>

      <div className="form-grid">
        {CHARGE_FIELDS.map(({ key, label, hint }) => (
          <Field key={key} label={label} hint={hint} error={errors[key]}>
            <NumberInput
              value={data[key]}
              onChange={v => update({ [key]: v })}
              placeholder="0"
              error={!!errors[key]}
            />
          </Field>
        ))}
      </div>

      <div className="step-actions">
        <button className="btn btn-ghost" onClick={onPrev}>← Précédent</button>
        <button className="btn btn-primary btn-lg" onClick={handleNext}>Continuer →</button>
      </div>
    </div>
  )
}
