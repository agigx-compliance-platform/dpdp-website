/** Two-minute product walkthrough of Consent Cockpit (consent, DSAR, grievance, purposes, notices). */
export function ConsentDemoVideo() {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-background-secondary shadow-[var(--shadow-md)]">
      <video
        className="aspect-video h-auto w-full"
        src="/videos/consent-cockpit-demo.mp4"
        poster="/videos/consent-cockpit-demo-poster.jpg"
        controls
        playsInline
        preload="metadata"
        aria-label="Consent Cockpit product demo, about 2 minutes, with on-screen captions"
      >
        Your browser cannot play this video. <a href="/videos/consent-cockpit-demo.mp4">Download the demo</a>.
      </video>
    </div>
  )
}
