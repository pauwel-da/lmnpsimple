import { useState } from 'react'
import Field from '../components/fields/Field'
import TextInput from '../components/fields/TextInput'
import NumberInput from '../components/fields/NumberInput'
import DateInput from '../components/fields/DateInput'
import SelectInput from '../components/fields/SelectInput'
import { validateStep2 } from '../utils/validation'

const TYPES_BIEN = [
  { value: 'appartement', label: 'Appartement' },
  { value: 'maison', label: 'Maison' },
  { value: 'studio', label: 'Studio' },
  { value: 'local_commercial', label: 'Local commercial' },
]

export default function Step2Bien({ data, update, onNext, onPrev }) {
  const [errors, setErrors] = useState({})

  function handleNext() {
    const e = validateStep2(data)
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setErrors({})
    onNext()
  }

  return (
    <div className="step">
      <div className="step-header">
        <span className="step-eyebrow">Étape 2 sur 7</span>
        <h2 className="step-title">Votre bien immobilier</h2>
        <p className="step-desc">Informations relatives au bien loué en meublé.</p>
      </div>

      <div className="form-grid">
        <Field label="Adresse du bien" error={errors.adresse_bien} required span={2}>
          <TextInput
            value={data.adresse_bien}
            onChange={v => update({ adresse_bien: v })}
            placeholder="12 rue des Lilas, 69003 Lyon"
            error={!!errors.adresse_bien}
          />
        </Field>

        <Field label="Type de bien" error={errors.type_bien} required>
          <SelectInput
            value={data.type_bien}
            onChange={v => update({ type_bien: v })}
            options={TYPES_BIEN}
            placeholder="Sélectionner..."
            error={!!errors.type_bien}
          />
        </Field>

        <Field label="Date d'acquisition" error={errors.date_acquisition} required>
          <DateInput
            value={data.date_acquisition}
            onChange={v => update({ date_acquisition: v })}
            error={!!errors.date_acquisition}
          />
        </Field>

        <Field
          label="Prix d'acquisition total"
          hint="Prix d'achat notarié (terrain + construction)"
          error={errors.prix_acquisition}
          required
        >
          <NumberInput
            value={data.prix_acquisition}
            onChange={v => update({ prix_acquisition: v })}
            placeholder="200 000"
            error={!!errors.prix_acquisition}
          />
        </Field>

        <Field
          label="dont valeur du terrain"
          hint="Non amortissable — à estimer si non séparé"
          error={errors.valeur_terrain}
          required
        >
          <NumberInput
            value={data.valeur_terrain}
            onChange={v => update({ valeur_terrain: v })}
            placeholder="30 000"
            error={!!errors.valeur_terrain}
          />
        </Field>

        <Field
          label="Valeur du mobilier"
          hint="Meubles et équipements (optionnel)"
          error={errors.valeur_mobilier}
        >
          <NumberInput
            value={data.valeur_mobilier}
            onChange={v => update({ valeur_mobilier: v })}
            placeholder="0"
            error={!!errors.valeur_mobilier}
          />
        </Field>

        <Field
          label="Travaux avant mise en location"
          hint="Travaux de rénovation antérieurs à la première location"
          error={errors.travaux_avant_location}
        >
          <NumberInput
            value={data.travaux_avant_location}
            onChange={v => update({ travaux_avant_location: v })}
            placeholder="0"
            error={!!errors.travaux_avant_location}
          />
        </Field>

        <Field
          label="Frais d'acquisition"
          hint="Honoraires notaire, frais d'agence à l'achat"
          error={errors.frais_acquisition}
          span={2}
        >
          <NumberInput
            value={data.frais_acquisition}
            onChange={v => update({ frais_acquisition: v })}
            placeholder="0"
            error={!!errors.frais_acquisition}
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
