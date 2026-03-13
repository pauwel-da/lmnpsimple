const currentYear = new Date().getFullYear()

export const INITIAL_STATE = {
  step: 0,
  data: {
    // Step 1 — Identification
    prenom: '',
    nom: '',
    email: '',
    annee_fiscale: String(currentYear - 1),
    avis_optin: false,

    // Step 2 — Bien immobilier
    adresse_bien: '',
    type_bien: '',
    date_acquisition: '',
    prix_acquisition: '',
    valeur_terrain: '',
    valeur_mobilier: '',
    travaux_avant_location: '',
    frais_acquisition: '',

    // Step 3 — Recettes
    recettes_brutes: '',
    debut_exercice: `${currentYear - 1}-01-01`,
    fin_exercice: `${currentYear - 1}-12-31`,

    // Step 4 — Emprunt
    has_emprunt: '',
    interets_emprunt: '',
    capital_restant_du: '',

    // Step 5 — Charges
    assurance: '',
    taxe_fonciere: '',
    charges_copropriete: '',
    frais_gestion: '',
    travaux_exercice: '',
    frais_comptabilite: '',
    autres_charges: '',

    // Step 6 — Amortissements
    duree_amortissement_immeuble: '30',
    montant_amortissable_override: '',
    duree_amortissement_mobilier: '7',
    amortissements_anterieurs: '',
    deficit_anterieur: '',
  },
}

export function formReducer(state, action) {
  switch (action.type) {
    case 'UPDATE':
      return { ...state, data: { ...state.data, ...action.payload } }
    case 'NEXT':
      return { ...state, step: Math.min(state.step + 1, action.total - 1) }
    case 'PREV':
      return { ...state, step: Math.max(state.step - 1, 0) }
    case 'GOTO':
      return { ...state, step: action.payload }
    case 'RESET':
      return INITIAL_STATE
    default:
      return state
  }
}
