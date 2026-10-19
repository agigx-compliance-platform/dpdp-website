export function HeroBackground() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
      role="presentation"
    >
      <defs>
        <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path
            d="M 48 0 L 0 0 0 48"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="0.5"
          />
        </pattern>
        <radialGradient id="hero-fade" cx="50%" cy="32%" r="70%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.08" />
          <stop offset="70%" stopColor="hsl(var(--background))" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#hero-grid)" />
      <rect width="100%" height="100%" fill="url(#hero-fade)" />
    </svg>
  )
}
