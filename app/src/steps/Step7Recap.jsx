import { useState, useEffect } from 'react'
import { generateDocuments } from '../utils/api'
import {
  calcTotalCharges, calcTotalAmortissements, calcResultatFiscal,
  calcDotationImmeuble, calcDotationMobilier, fmtEur
} from '../utils/calculations'

// TODO: Configurer la success_url dans le dashboard Stripe Payment Links :
// https://www.lmnpsimple.fr/formulaire/?paid=true
const STRIPE_URL = 'https://buy.stripe.com/aFa9AT8io60Yftofsn7kc01'

function Row({ label, value }) {
  return (
    <div className="recap-row">
      <span className="recap-label">{label}</span>
      <span className="recap-value">{value}</span>
    </div>
  )
}

export default function Step7Recap({ data, onPrev }) {
  const paid = new URLSearchParams(window.location.search).get('paid') === 'true'
  const [status, setStatus] = useState(paid ? 'generating' : 'unpaid') // unpaid | generating | loading | success | error
  const [downloadUrl, setDownloadUrl] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  const totalCharges = calcTotalCharges(data)
  const totalAmort = calcTotalAmortissements(data)
  const resultat = calcResultatFiscal(data)

  // Si retour depuis Stripe avec ?paid=true, lancer la génération automatiquement
  useEffect(() => {
    if (paid && status === 'generating') {
      handleGenerate()
      // Nettoyer l'URL sans rechargement
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  async function handleGenerate() {
    setStatus('loading')
    try {
      const res = await generateDocuments(data)
      setDownloadUrl(res.download_url)
      setStatus('success')
    } catch (err) {
      setErrorMsg(err.message || 'Une erreur est survenue.')
      setStatus('error')
    }
  }

  return (
    <div className="step">
      <div className="step-header">
        <span className="step-eyebrow">Étape 7 sur 7</span>
        <h2 className="step-title">Récapitulatif</h2>
        <p className="step-desc">Vérifiez vos données avant de payer et générer vos documents fiscaux.</p>
      </div>

      {/* Identification */}
      <div className="recap-section">
        <div className="recap-section-title">Identification</div>
        <Row label="Nom" value={`${data.prenom} ${data.nom}`} />
        <Row label="Email" value={data.email} />
        <Row label="Année fiscale" value={data.annee_fiscale} />
      </div>

      {/* Bien */}
      <div className="recap-section">
        <div className="recap-section-title">Bien immobilier</div>
        <Row label="Adresse" value={data.adresse_bien} />
        <Row label="Type" value={data.type_bien} />
        <Row label="Acquisition" value={data.date_acquisition} />
        <Row label="Prix d'acquisition" value={fmtEur(parseFloat(data.prix_acquisition) || 0)} />
        <Row label="dont terrain" value={fmtEur(parseFloat(data.valeur_terrain) || 0)} />
        {data.valeur_mobilier && <Row label="Mobilier" value={fmtEur(parseFloat(data.valeur_mobilier) || 0)} />}
        {data.frais_acquisition && <Row label="Frais d'acquisition" value={fmtEur(parseFloat(data.frais_acquisition) || 0)} />}
      </div>

      {/* Recettes */}
      <div className="recap-section">
        <div className="recap-section-title">Recettes</div>
        <Row label="Recettes brutes" value={fmtEur(parseFloat(data.recettes_brutes) || 0)} />
        <Row label="Exercice" value={`${data.debut_exercice} → ${data.fin_exercice}`} />
      </div>

      {/* Emprunt */}
      <div className="recap-section">
        <div className="recap-section-title">Emprunt</div>
        {data.has_emprunt === 'oui' ? (
          <>
            <Row label="Intérêts d'emprunt" value={fmtEur(parseFloat(data.interets_emprunt) || 0)} />
            {data.capital_restant_du && (
              <Row label="Capital restant dû" value={fmtEur(parseFloat(data.capital_restant_du) || 0)} />
            )}
          </>
        ) : (
          <Row label="Emprunt" value="Aucun" />
        )}
      </div>

      {/* Charges */}
      <div className="recap-section">
        <div className="recap-section-title">Charges déductibles</div>
        {data.assurance && <Row label="Assurance" value={fmtEur(parseFloat(data.assurance))} />}
        {data.taxe_fonciere && <Row label="Taxe foncière" value={fmtEur(parseFloat(data.taxe_fonciere))} />}
        {data.charges_copropriete && <Row label="Charges copropriété" value={fmtEur(parseFloat(data.charges_copropriete))} />}
        {data.frais_gestion && <Row label="Frais de gestion" value={fmtEur(parseFloat(data.frais_gestion))} />}
        {data.travaux_exercice && <Row label="Travaux exercice" value={fmtEur(parseFloat(data.travaux_exercice))} />}
        {data.frais_comptabilite && <Row label="Frais comptabilité" value={fmtEur(parseFloat(data.frais_comptabilite))} />}
        {data.autres_charges && <Row label="Autres charges" value={fmtEur(parseFloat(data.autres_charges))} />}
        <Row label="Total charges" value={fmtEur(totalCharges)} />
      </div>

      {/* Amortissements */}
      <div className="recap-section">
        <div className="recap-section-title">Amortissements</div>
        <Row label="Dotation immeuble" value={fmtEur(calcDotationImmeuble(data))} />
        {parseFloat(data.valeur_mobilier) > 0 && (
          <Row label="Dotation mobilier" value={fmtEur(calcDotationMobilier(data))} />
        )}
        {data.amortissements_anterieurs && (
          <Row label="Amortissements antérieurs" value={fmtEur(parseFloat(data.amortissements_anterieurs))} />
        )}
        {data.deficit_anterieur && (
          <Row label="Déficit antérieur" value={fmtEur(parseFloat(data.deficit_anterieur))} />
        )}
      </div>

      {/* Résultat estimé */}
      <div className="result-box">
        <div className="result-row">
          <span className="result-label">Recettes</span>
          <span className="result-value">{fmtEur(parseFloat(data.recettes_brutes) || 0)}</span>
        </div>
        <div className="result-row">
          <span className="result-label">− Charges</span>
          <span className="result-value">− {fmtEur(totalCharges)}</span>
        </div>
        <div className="result-row">
          <span className="result-label">− Amortissements déduits</span>
          <span className="result-value">− {fmtEur(totalAmort)}</span>
        </div>
        <div className="result-row total">
          <span className="result-label">Résultat fiscal estimé</span>
          <span className="result-value">{fmtEur(resultat)}</span>
        </div>
      </div>

      <p style={{ fontSize: '12.5px', color: 'var(--grey)', marginBottom: '28px', lineHeight: 1.6 }}>
        Ce résultat est une estimation indicative. Les documents générés font foi.
      </p>

      {/* ── ZONE PAIEMENT / GÉNÉRATION ── */}
      <div className="generate-area">

        {/* Étape : payer */}
        {status === 'unpaid' && (
          <div className="payment-box">
            <div className="payment-box-header">
              <div className="payment-price">59 <span>€ TTC</span></div>
              <div className="payment-label">Paiement unique · Accès immédiat à vos documents</div>
            </div>
            <ul className="payment-features">
              <li>✓ Formulaires 2031 + annexes 2033</li>
              <li>✓ Report sur 2042-C Pro</li>
              <li>✓ Téléchargement PDF immédiat</li>
            </ul>
            <a
              href={STRIPE_URL}
              className="btn btn-primary btn-lg btn-full"
              onClick={() => typeof sa_event !== 'undefined' && sa_event('stripe_click')}
            >
              Payer et générer mes documents →
            </a>
            <p className="payment-note">
              Paiement sécurisé par Stripe. Vous serez redirigé vers cette page après paiement.
            </p>
          </div>
        )}

        {/* Génération auto après retour Stripe */}
        {status === 'generating' && (
          <div className="generate-loading">
            <div className="spinner" />
            Paiement confirmé — génération en cours…
          </div>
        )}

        {status === 'loading' && (
          <div className="generate-loading">
            <div className="spinner" />
            Génération en cours…
          </div>
        )}

        {status === 'success' && (
          <div className="generate-success">
            <h3>Documents générés ✓</h3>
            <p>Vos formulaires 2031, 2033 et 2042-C Pro sont prêts. Le lien est valable 24h.</p>
            <a href={downloadUrl} className="btn-download" target="_blank" rel="noopener noreferrer">
              ↓ Télécharger mes documents
            </a>
          </div>
        )}

        {status === 'error' && (
          <div className="generate-error">
            <p>{errorMsg}</p>
            <button className="btn btn-primary" onClick={handleGenerate}>Réessayer</button>
          </div>
        )}
      </div>

      {status === 'unpaid' && (
        <div className="step-actions" style={{ marginTop: '16px' }}>
          <button className="btn btn-ghost" onClick={onPrev}>← Modifier</button>
          <div />
        </div>
      )}
    </div>
  )
}
