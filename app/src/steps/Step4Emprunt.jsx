import { useState } from 'react'
import Field from '../components/fields/Field'
import NumberInput from '../components/fields/NumberInput'
import { validateStep4 } from '../utils/validation'

export default function Step4Emprunt({ data, update, onNext, onPrev }) {
  const [errors, setErrors] = useState({})

  function handleNext() {
    const e = validateStep4(data)
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setErrors({})
    onNext()
  }

  function select(val) {
    update({ has_emprunt: val, interets_emprunt: '', capital_restant_du: '' })
    setErrors({})
  }

  return (
    <div className="step">
      <div className="step-header">
        <span className="step-eyebrow">Étape 4 sur 7</span>
        <h2 className="step-title">Intérêts d'emprunt</h2>
        <p className="step-desc">Les intérêts d'emprunt immobilier sont déductibles en charges.</p>
      </div>

      <div className="form-grid">
        <Field
          label="Avez-vous un emprunt immobilier pour ce bien ?"
          error={errors.has_emprunt}
          required
          span={2}
        >
          <div className="radio-group">
            <button
              type="button"
              className={`radio-card${data.has_emprunt === 'oui' ? ' selected' : ''}${errors.has_emprunt ? ' error' : ''}`}
              onClick={() => select('oui')}
            >
              Oui, j'ai un emprunt
            </button>
            <button
              type="button"
              className={`radio-card${data.has_emprunt === 'non' ? ' selected' : ''}${errors.has_emprunt ? ' error' : ''}`}
              onClick={() => select('non')}
            >
              Non, pas d'emprunt
            </button>
          </div>
        </Field>

        {data.has_emprunt === 'oui' && (
          <>
            <Field
              label="Intérêts d'emprunt de l'exercice"
              hint="Montant des intérêts payés durant l'exercice (hors assurance emprunteur)"
              error={errors.interets_emprunt}
              required
            >
              <NumberInput
                value={data.interets_emprunt}
                onChange={v => update({ interets_emprunt: v })}
                placeholder="3 200"
                error={!!errors.interets_emprunt}
              />
            </Field>

            <Field
              label="Capital restant dû au 31/12"
              hint="Utilisé pour le bilan (formulaire 2033-B) — optionnel"
              error={errors.capital_restant_du}
            >
              <NumberInput
                value={data.capital_restant_du}
                onChange={v => update({ capital_restant_du: v })}
                placeholder="0"
                error={!!errors.capital_restant_du}
              />
            </Field>
          </>
        )}

        {data.has_emprunt === 'non' && (
          <div className="calc-box span-2">
            Aucun intérêt d'emprunt ne sera déduit. Vous pouvez continuer.
          </div>
        )}
      </div>

      <div className="step-actions">
        <button className="btn btn-ghost" onClick={onPrev}>← Précédent</button>
        <button className="btn btn-primary btn-lg" onClick={handleNext}>Continuer →</button>
      </div>
    </div>
  )
}
