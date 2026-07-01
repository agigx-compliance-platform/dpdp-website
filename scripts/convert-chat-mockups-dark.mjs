/**
 * Sync Privacy Assistant mockup PNGs into public assets.
 *
 * Dark theme only (native dark mockups → consent-cockpit-chat-dark/):
 *   1. image-215a5fc4 → cockpit-chat-vs-dashboard.png
 *   2. image-998321a6 → cockpit-chat-consent.png
 *   3. image-30261636 → cockpit-chat-dsar-flow.png
 *   4. image-3a273949 → cockpit-chat-success.png
 *   5. image-d0650654 → cockpit-chat-grievance.png
 *   6. image-beaae07c → cockpit-chat-welcome.png
 *
 * Light theme only (original light mockups → consent-cockpit-chat/):
 *   1. image-97d48669 → cockpit-chat-vs-dashboard.png
 *   2. image-e17b2a7f → cockpit-chat-consent.png
 *   3. image-c29fd5ed → cockpit-chat-dsar-flow.png
 *   4. image-15e668c2 → cockpit-chat-success.png
 *   5. image-beac466c → cockpit-chat-grievance.png
 *   6. cropped from (1) → cockpit-chat-welcome.png
 *
 * Usage: npm run convert:chat-dark
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const ASSETS = '/Users/dineshvenkatesan/.cursor/projects/Users-dineshvenkatesan-code-agigx/assets'
const OUT_DARK = path.join(ROOT, 'public/images/products/consent-cockpit-chat-dark')
const OUT_LIGHT = path.join(ROOT, 'public/images/products/consent-cockpit-chat')

const WELCOME_CROP = { left: 0.04, top: 0.12, width: 0.44, height: 0.82 }

const DARK_MAPPINGS = [
  { src: 'image-215a5fc4-83b9-477f-9c4a-6a9d9ba8bd5a.png', out: 'cockpit-chat-vs-dashboard.png' },
  { src: 'image-998321a6-8a80-4f7b-b7b6-00c61b51c21e.png', out: 'cockpit-chat-consent.png' },
  { src: 'image-30261636-61dc-4412-9426-eed907413e35.png', out: 'cockpit-chat-dsar-flow.png' },
  { src: 'image-3a273949-3ec9-4b70-9ef0-dd0f42a9bac5.png', out: 'cockpit-chat-success.png' },
  { src: 'image-d0650654-d4ae-43d3-a1d8-a79a1ce34206.png', out: 'cockpit-chat-grievance.png' },
  { src: 'image-beaae07c-8048-40c3-b149-dd3893904606.png', out: 'cockpit-chat-welcome.png' },
]

const LIGHT_MAPPINGS = [
  { src: 'image-97d48669-869c-4aa9-97a5-57685345d8e2.png', out: 'cockpit-chat-vs-dashboard.png' },
  { src: 'image-e17b2a7f-a48f-40aa-b86b-dde85ea78679.png', out: 'cockpit-chat-consent.png' },
  { src: 'image-c29fd5ed-b805-45c2-8e48-c07916aa5598.png', out: 'cockpit-chat-dsar-flow.png' },
  { src: 'image-15e668c2-cde4-4b28-b2d0-c55391c59ae0.png', out: 'cockpit-chat-success.png' },
  { src: 'image-beac466c-67dc-4916-94e7-3d93ec37a731.png', out: 'cockpit-chat-grievance.png' },
]

async function copyAsset(src, dest) {
  const input = path.join(ASSETS, src)
  if (!fs.existsSync(input)) {
    throw new Error(`Missing source: ${input}`)
  }
  await fs.promises.copyFile(input, dest)
}

async function cropWelcomeFromVsDashboard(vsPath, outPath) {
  const meta = await sharp(vsPath).metadata()
  const w = meta.width ?? 1024
  const h = meta.height ?? 682
  await sharp(vsPath)
    .extract({
      left: Math.round(w * WELCOME_CROP.left),
      top: Math.round(h * WELCOME_CROP.top),
      width: Math.round(w * WELCOME_CROP.width),
      height: Math.round(h * WELCOME_CROP.height),
    })
    .png({ compressionLevel: 6 })
    .toFile(outPath)
}

async function main() {
  fs.mkdirSync(OUT_DARK, { recursive: true })
  fs.mkdirSync(OUT_LIGHT, { recursive: true })

  console.log('Dark theme mockups → consent-cockpit-chat-dark/')
  for (const item of DARK_MAPPINGS) {
    await copyAsset(item.src, path.join(OUT_DARK, item.out))
    console.log('  ✓', item.out)
  }

  console.log('Light theme mockups → consent-cockpit-chat/')
  for (const item of LIGHT_MAPPINGS) {
    await copyAsset(item.src, path.join(OUT_LIGHT, item.out))
    console.log('  ✓', item.out)
  }

  const lightVs = path.join(OUT_LIGHT, 'cockpit-chat-vs-dashboard.png')
  const lightWelcome = path.join(OUT_LIGHT, 'cockpit-chat-welcome.png')
  await cropWelcomeFromVsDashboard(lightVs, lightWelcome)
  console.log('  ✓ cockpit-chat-welcome.png (cropped from light vs-dashboard)')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
