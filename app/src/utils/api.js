import { calcMontantAmortissable, calcDotationImmeuble, calcDotationMobilier } from './calculations'

const API_URL = 'https://api.lmnpsimple.fr/generate' // TODO: remplacer par l'URL réelle

function buildPayload(data) {
  return {
    annee_fiscale: parseInt(data.annee_fiscale),
    identite: {
      prenom: data.prenom,
      nom: data.nom,
      email: data.email,
    },
    bien: {
      adresse: data.adresse_bien,
      type: data.type_bien,
      date_acquisition: data.date_acquisition,
      prix_acquisition: parseFloat(data.prix_acquisition),
      valeur_terrain: parseFloat(data.valeur_terrain),
      valeur_mobilier: parseFloat(data.valeur_mobilier) || 0,
      travaux_avant_location: parseFloat(data.travaux_avant_location) || 0,
      frais_acquisition: parseFloat(data.frais_acquisition) || 0,
    },
    recettes: {
      brutes: parseFloat(data.recettes_brutes),
      debut_exercice: data.debut_exercice,
      fin_exercice: data.fin_exercice,
    },
    emprunt: {
      has_emprunt: data.has_emprunt === 'oui',
      interets: data.has_emprunt === 'oui' ? parseFloat(data.interets_emprunt) || 0 : 0,
      capital_restant_du: data.has_emprunt === 'oui' ? parseFloat(data.capital_restant_du) || 0 : 0,
    },
    charges: {
      assurance: parseFloat(data.assurance) || 0,
      taxe_fonciere: parseFloat(data.taxe_fonciere) || 0,
      charges_copropriete: parseFloat(data.charges_copropriete) || 0,
      frais_gestion: parseFloat(data.frais_gestion) || 0,
      travaux_exercice: parseFloat(data.travaux_exercice) || 0,
      frais_comptabilite: parseFloat(data.frais_comptabilite) || 0,
      autres_charges: parseFloat(data.autres_charges) || 0,
    },
    amortissements: {
      montant_amortissable: data.montant_amortissable_override !== ''
        ? parseFloat(data.montant_amortissable_override)
        : calcMontantAmortissable(data),
      duree_immeuble: parseInt(data.duree_amortissement_immeuble),
      dotation_immeuble: calcDotationImmeuble(data),
      duree_mobilier: parseInt(data.duree_amortissement_mobilier),
      dotation_mobilier: calcDotationMobilier(data),
      amortissements_anterieurs: parseFloat(data.amortissements_anterieurs) || 0,
      deficit_anterieur: parseFloat(data.deficit_anterieur) || 0,
    },
  }
}

export async function generateDocuments(data) {
  const payload = buildPayload(data)
  console.log('[API] Payload:', payload) // debug
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const msg = await response.text().catch(() => 'Erreur serveur')
    throw new Error(msg)
  }
  return response.json() // { success: true, download_url: "https://..." }
}
