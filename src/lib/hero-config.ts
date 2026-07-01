export const HERO_IMAGES = {
  dark: '/images/hero-dark.png',
  light: '/images/hero-light.png',
} as const

/** Optional subline under the hero headline. Uses NEXT_PUBLIC_HERO_SUBLINE. */
export function getHeroSubline(): string {
  const v =
    typeof process.env.NEXT_PUBLIC_HERO_SUBLINE === 'string'
      ? process.env.NEXT_PUBLIC_HERO_SUBLINE.trim()
      : ''
  return v
}
