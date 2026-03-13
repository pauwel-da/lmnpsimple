function f(v) { return parseFloat(v) || 0 }

export function calcMontantAmortissable(data) {
  return f(data.prix_acquisition) - f(data.valeur_terrain) + f(data.frais_acquisition) + f(data.travaux_avant_location)
}

export function calcDotationImmeuble(data) {
  const montant = data.montant_amortissable_override !== ''
    ? f(data.montant_amortissable_override)
    : calcMontantAmortissable(data)
  const duree = parseInt(data.duree_amortissement_immeuble) || 30
  return montant / duree
}

export function calcDotationMobilier(data) {
  const mobilier = f(data.valeur_mobilier)
  const duree = parseInt(data.duree_amortissement_mobilier) || 7
  return mobilier > 0 ? mobilier / duree : 0
}

export function calcTotalCharges(data) {
  const fields = [
    'interets_emprunt', 'assurance', 'taxe_fonciere', 'charges_copropriete',
    'frais_gestion', 'travaux_exercice', 'frais_comptabilite', 'autres_charges'
  ]
  return fields.reduce((sum, k) => sum + f(data[k]), 0)
}

export function calcTotalAmortissements(data) {
  return calcDotationImmeuble(data) + calcDotationMobilier(data) + f(data.amortissements_anterieurs)
}

export function calcResultatFiscal(data) {
  const recettes = f(data.recettes_brutes)
  const charges = calcTotalCharges(data)
  const avant = recettes - charges
  // Amortissements cannot create deficit (limited to avant if avant > 0)
  const amort = calcTotalAmortissements(data)
  const amortDeductibles = avant > 0 ? Math.min(amort, avant) : 0
  const deficit = f(data.deficit_anterieur)
  return avant - amortDeductibles - deficit
}

export function fmtEur(n) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}
