export function safeHostname(input: string | undefined | null): string | null {
  if (!input?.trim()) return null
  try {
    const withScheme = /^https?:\/\//i.test(input) ? input : `https://${input}`
    const host = new URL(withScheme).hostname
    return host || null
  } catch {
    return null
  }
}
