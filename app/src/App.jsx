import { useReducer, useEffect } from 'react'
import { INITIAL_STATE, formReducer } from './store/formReducer'
import Nav from './components/Nav'
import Footer from './components/Footer'
import ProgressBar from './components/ProgressBar'
import Step1Identification from './steps/Step1Identification'
import Step2Bien from './steps/Step2Bien'
import Step3Recettes from './steps/Step3Recettes'
import Step4Emprunt from './steps/Step4Emprunt'
import Step5Charges from './steps/Step5Charges'
import Step6Amortissements from './steps/Step6Amortissements'
import Step7Recap from './steps/Step7Recap'

const STEPS = [
  { label: 'Identification', component: Step1Identification },
  { label: 'Bien', component: Step2Bien },
  { label: 'Recettes', component: Step3Recettes },
  { label: 'Emprunt', component: Step4Emprunt },
  { label: 'Charges', component: Step5Charges },
  { label: 'Amortissements', component: Step6Amortissements },
  { label: 'Récapitulatif', component: Step7Recap },
]

const STORAGE_KEY = 'lmnp_form_v1'

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return null
}

export default function App() {
  const [state, dispatch] = useReducer(
    formReducer,
    INITIAL_STATE,
    (initial) => loadFromStorage() ?? initial
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const { step, data } = state
  const StepComponent = STEPS[step].component

  function update(fields) {
    dispatch({ type: 'UPDATE', payload: fields })
  }

  function next() {
    dispatch({ type: 'NEXT', total: STEPS.length })
  }

  function prev() {
    dispatch({ type: 'PREV' })
  }

  function goTo(s) {
    if (s <= step) dispatch({ type: 'GOTO', payload: s })
  }

  function reset() {
    if (window.confirm('Effacer toutes les données saisies ? Cette action est irréversible.')) {
      localStorage.removeItem(STORAGE_KEY)
      dispatch({ type: 'RESET' })
    }
  }

  return (
    <div className="app">
      <Nav onReset={reset} />
      <main className="main">
        <div className="container">
          <ProgressBar
            current={step}
            total={STEPS.length}
            steps={STEPS}
            onGoTo={goTo}
          />
          <StepComponent
            data={data}
            update={update}
            onNext={next}
            onPrev={prev}
            step={step}
            totalSteps={STEPS.length}
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
