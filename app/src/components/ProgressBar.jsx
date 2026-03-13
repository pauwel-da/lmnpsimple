export default function ProgressBar({ current, total, steps, onGoTo }) {
  const pct = total > 1 ? (current / (total - 1)) * 100 : 0

  return (
    <div className="progress-wrap">
      <div className="progress-steps">
        {steps.map((s, i) => (
          <button
            key={i}
            className={`progress-step${i === current ? ' active' : ''}${i < current ? ' done' : ''}`}
            onClick={() => onGoTo(i)}
            disabled={i > current}
          >
            <span className="step-num">{i < current ? '✓' : i + 1}</span>
            <span className="step-name">{s.label}</span>
          </button>
        ))}
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
