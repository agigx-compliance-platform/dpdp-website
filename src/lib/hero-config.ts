/** Optional line under the hero (e.g. if on-screen video text has a typo or draft title). Uses NEXT_PUBLIC_HERO_VIDEO_DISCLAIMER. */
export function getHeroVideoDisclaimer(): string {
  const v =
    typeof process.env.NEXT_PUBLIC_HERO_VIDEO_DISCLAIMER === 'string'
      ? process.env.NEXT_PUBLIC_HERO_VIDEO_DISCLAIMER.trim()
      : ''
  return v
}
