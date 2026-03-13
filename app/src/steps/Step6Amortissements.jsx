import { useState } from 'react'
import Field from '../components/fields/Field'
import NumberInput from '../components/fields/NumberInput'
import SelectInput from '../components/fields/SelectInput'
import { validateStep6 } from '../utils/validation'
import { calcMontantAmortissable, calcDotationImmeuble, calcDotationMobilier, fmtEur } from '../utils/calculations'

const DUREES_IMMEUBLE = [
  { value: '25', label: '25 ans (4,0 % / an)' },
  { value: '30', label: '30 ans (3,3 % / an)' },
  { value: '33', label: '33 ans (3,0 % / an)' },
  { value: '40', label: '40 ans (2,5 % / an)' },
]
const DUREES_MOBILIER = [
  { value: '5', label: '5 ans (20 % / an)' },
  { value: '7', label: '7 ans (14,3 % / an)' },
  { value: '10', label: '10 ans (10 % / an)' },
]

export default function Step6Amortissements({ data, update, onNext, onPrev }) {
  const [errors, setErrors] = useState({})

  const montantCalc = calcMontantAmortissable(data)
  const dotImmeuble = calcDotationImmeuble(data)
  const dotMobilier = calcDotationMobilier(data)

  function handleNext() {
    const e = validateStep6(data)
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setErrors({})
    onNext()
  }

  return (
    <div className="step">
      <div className="step-header">
        <span className="step-eyebrow">Étape 6 sur 7</span>
        <h2 className="step-title">Amortissements</h2>
        <p className="step-desc">
          Les amortissements permettent de déduire la dépréciation du bien dans le temps.
          Les montants sont calculés automatiquement — vous pouvez les ajuster si nécessaire.
        </p>
      </div>

      <div className="notice">
        Les amortissements ne peuvent pas créer de déficit fiscal. Ils sont reportables sur les exercices suivants sans limitation de durée.
      </div>

      <div className="form-grid">
        {/* Immeuble */}
        <Field
          label="Durée d'amortissement de l'immeuble"
          error={errors.duree_amortissement_immeuble}
          required
          span={2}
        >
          <SelectInput
            value={data.duree_amortissement_immeuble}
            onChange={v => update({ duree_amortissement_immeuble: v })}
            options={DUREES_IMMEUBLE}
            error={!!errors.duree_amortissement_immeuble}
          />
        </Field>

        <Field
          label="Montant amortissable de l'immeuble"
          hint="= Prix − terrain + frais d'acq. + travaux avant location. Modifiable si nécessaire."
          error={errors.montant_amortissable_override}
        >
          <NumberInput
            value={data.montant_amortissable_override !== '' ? data.montant_amortissable_override : String(Math.round(montantCalc))}
            onChange={v => update({ montant_amortissable_override: v })}
            placeholder={String(Math.round(montantCalc))}
            error={!!errors.montant_amortissable_override}
          />
        </Field>

        <Field label="Dotation annuelle immeuble" hint="Calculé automatiquement">
          <div className="calc-box">
            <strong>{fmtEur(dotImmeuble)}</strong> / an
          </div>
        </Field>

        {/* Mobilier */}
        {parseFloat(data.valeur_mobilier) > 0 && (
          <>
            <Field
              label="Durée d'amortissement du mobilier"
              error={errors.duree_amortissement_mobilier}
              required
            >
              <SelectInput
                value={data.duree_amortissement_mobilier}
                onChange={v => update({ duree_amortissement_mobilier: v })}
                options={DUREES_MOBILIER}
                error={!!errors.duree_amortissement_mobilier}
              />
            </Field>

            <Field label="Dotation annuelle mobilier" hint="Calculé automatiquement">
              <div className="calc-box">
                <strong>{fmtEur(dotMobilier)}</strong> / an
              </div>
            </Field>
          </>
        )}

        {/* Reports */}
        <Field
          label="Amortissements non déduits (exercices précédents)"
          hint="Si c'est votre première déclaration, laissez à 0"
          error={errors.amortissements_anterieurs}
        >
          <NumberInput
            value={data.amortissements_anterieurs}
            onChange={v => update({ amortissements_anterieurs: v })}
            placeholder="0"
            error={!!errors.amortissements_anterieurs}
          />
        </Field>

        <Field
          label="Déficit antérieur reportable"
          hint="Déficit des années précédentes à imputer sur cet exercice"
          error={errors.deficit_anterieur}
        >
          <NumberInput
            value={data.deficit_anterieur}
            onChange={v => update({ deficit_anterieur: v })}
            placeholder="0"
            error={!!errors.deficit_anterieur}
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
