const STAGES = [
  { id: 'find', label: 'Find your data', note: 'We help you see what personal details you hold and where they are.' },
  { id: 'ask', label: 'Ask properly', note: 'Your website and forms explain why you need the details and ask for consent.' },
  { id: 'respond', label: 'Respond to people', note: 'When someone changes their mind or makes a request, the right teams and vendors act on it.' },
  { id: 'prove', label: 'Keep the proof', note: 'Records of what happened are saved, so you can show them when asked.' },
] as const

export function LifecycleDiagram() {
  return (
    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {STAGES.map((stage, i) => (
        <li key={stage.id} className="border-t-2 border-primary/40 pt-4">
          <span className="text-sm font-semibold text-primary">Step {i + 1}</span>
          <p className="mt-2 text-base font-semibold text-foreground">{stage.label}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{stage.note}</p>
        </li>
      ))}
    </ol>
  )
}
