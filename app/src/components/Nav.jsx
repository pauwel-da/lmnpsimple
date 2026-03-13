export default function Nav({ onReset }) {
  return (
    <nav>
      <div className="nav-inner">
        <a className="logo" href="/index.html">
          <img src={`${import.meta.env.BASE_URL}lmnpsimple.png`} alt="LMNP Simple" />
        </a>
        <button className="btn btn-danger" onClick={onReset}>
          Réinitialiser
        </button>
      </div>
    </nav>
  )
}
