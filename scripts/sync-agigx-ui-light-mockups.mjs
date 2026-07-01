/**
 * Sync light-theme admin CMP mockups into agigx-ui-light/ only (dark theme unchanged).
 *
 *   1. image-061fad55 → cmp-consent-logs.png           (Consent audit trail)
 *   2. image-9aadcb93 → cmp-dsar-workflows.png          (Workflow builder)
 *   3. image-db961058 → cmp-dsar-requests.png           (DSAR audit trail)
 *   4. image-d6c1feec → cmp-manage-cookies.png          (Cookie inventory)
 *   5. image-733b48cc → cmp-processor-monitoring.png    (Downstream tasks)
 *   6. image-5db0576d → cmp-purpose-consent-logs.png    (Adaptive compliance audit trail)
 *
 * Usage: npm run sync:agigx-ui-light-mockups
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const ASSETS = '/Users/dineshvenkatesan/.cursor/projects/Users-dineshvenkatesan-code-agigx/assets'
const OUT_LIGHT = path.join(ROOT, 'public/images/products/agigx-ui-light')

const MAPPINGS = [
  { src: 'image-061fad55-09e5-417a-be0f-20095345a7f1.png', out: 'cmp-consent-logs.png' },
  { src: 'image-9aadcb93-f780-4247-b718-a1ebf513abeb.png', out: 'cmp-dsar-workflows.png' },
  { src: 'image-db961058-dd42-47c4-9e04-3376ffa14544.png', out: 'cmp-dsar-requests.png' },
  { src: 'image-d6c1feec-ac8b-445c-ae8d-827112ee5ff8.png', out: 'cmp-manage-cookies.png' },
  { src: 'image-733b48cc-b07b-406a-92f9-697c4b97870a.png', out: 'cmp-processor-monitoring.png' },
  { src: 'image-5db0576d-4bbb-420e-9c1a-f14d2daf49b6.png', out: 'cmp-purpose-consent-logs.png' },
]

async function main() {
  fs.mkdirSync(OUT_LIGHT, { recursive: true })

  for (const item of MAPPINGS) {
    const input = path.join(ASSETS, item.src)
    if (!fs.existsSync(input)) {
      console.error('Missing:', input)
      process.exit(1)
    }
    await fs.promises.copyFile(input, path.join(OUT_LIGHT, item.out))
    console.log('✓', item.out)
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
