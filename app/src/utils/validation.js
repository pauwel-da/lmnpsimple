const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function num(v) { return parseFloat(v) }
function isPos(v) { const n = num(v); return !isNaN(n) && n > 0 }
function isGte0(v) { if (v === '' || v === null || v === undefined) return true; const n = num(v); return !isNaN(n) && n >= 0 }

export function validateStep1(data) {
  const e = {}
  if (!data.prenom?.trim()) e.prenom = 'Prénom requis'
  if (!data.nom?.trim()) e.nom = 'Nom requis'
  if (!data.email?.trim()) e.email = 'Email requis'
  else if (!emailRegex.test(data.email)) e.email = 'Format email invalide'
  if (!data.annee_fiscale) e.annee_fiscale = 'Année fiscale requise'
  return e
}

export function validateStep2(data) {
  const e = {}
  if (!data.adresse_bien?.trim()) e.adresse_bien = 'Adresse du bien requise'
  if (!data.type_bien) e.type_bien = 'Type de bien requis'
  if (!data.date_acquisition) e.date_acquisition = "Date d'acquisition requise"
  if (!isPos(data.prix_acquisition)) e.prix_acquisition = 'Montant requis (> 0)'
  if (!isPos(data.valeur_terrain)) e.valeur_terrain = 'Montant requis (> 0)'
  else if (num(data.valeur_terrain) >= num(data.prix_acquisition))
    e.valeur_terrain = "La valeur du terrain doit être inférieure au prix total d'acquisition"
  if (!isGte0(data.valeur_mobilier)) e.valeur_mobilier = 'Montant invalide'
  if (!isGte0(data.travaux_avant_location)) e.travaux_avant_location = 'Montant invalide'
  if (!isGte0(data.frais_acquisition)) e.frais_acquisition = 'Montant invalide'
  return e
}

export function validateStep3(data) {
  const e = {}
  if (data.recettes_brutes === '' || data.recettes_brutes === null || data.recettes_brutes === undefined || isNaN(parseFloat(data.recettes_brutes)) || parseFloat(data.recettes_brutes) < 0) e.recettes_brutes = 'Montant requis (≥ 0)'
  if (!data.debut_exercice) e.debut_exercice = 'Date de début requise'
  if (!data.fin_exercice) e.fin_exercice = 'Date de fin requise'
  else if (data.debut_exercice && data.fin_exercice <= data.debut_exercice)
    e.fin_exercice = 'La date de fin doit être après la date de début'
  return e
}

export function validateStep4(data) {
  const e = {}
  if (!data.has_emprunt) e.has_emprunt = 'Veuillez sélectionner une option'
  if (data.has_emprunt === 'oui') {
    if (!isPos(data.interets_emprunt)) e.interets_emprunt = 'Montant requis (> 0)'
    if (!isGte0(data.capital_restant_du)) e.capital_restant_du = 'Montant invalide'
  }
  return e
}

export function validateStep5(data) {
  const e = {}
  const fields = ['assurance', 'taxe_fonciere', 'charges_copropriete', 'frais_gestion', 'travaux_exercice', 'frais_comptabilite', 'autres_charges']
  fields.forEach(f => {
    if (!isGte0(data[f])) e[f] = 'Montant invalide'
  })
  return e
}

export function validateStep6(data) {
  const e = {}
  if (!data.duree_amortissement_immeuble) e.duree_amortissement_immeuble = 'Requis'
  if (!data.duree_amortissement_mobilier) e.duree_amortissement_mobilier = 'Requis'
  if (!isGte0(data.montant_amortissable_override)) e.montant_amortissable_override = 'Montant invalide'
  if (!isGte0(data.amortissements_anterieurs)) e.amortissements_anterieurs = 'Montant invalide'
  if (!isGte0(data.deficit_anterieur)) e.deficit_anterieur = 'Montant invalide'
  return e
}

export const STEP_VALIDATORS = [
  validateStep1,
  validateStep2,
  validateStep3,
  validateStep4,
  validateStep5,
  validateStep6,
  () => ({}), // Step 7 — recap, no validation needed
]
