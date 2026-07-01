/**
 * Sync dark-theme admin CMP mockups into agigx-ui/ only (light theme unchanged).
 *
 *   1. image-2c6d7af8 → cmp-consent-logs.png           (Consent audit trail)
 *   2. image-ee9665e9 → cmp-dsar-workflows.png          (Workflow builder)
 *   3. image-f3ac4d4d → cmp-dsar-requests.png           (DSAR audit trail)
 *   4. image-83a49765 → cmp-manage-cookies.png          (Cookie inventory)
 *   5. image-dd2b8837 → cmp-processor-monitoring.png    (Downstream tasks)
 *   6. image-894926bb → cmp-purpose-consent-logs.png    (Adaptive compliance audit trail)
 *
 * Usage: npm run sync:agigx-ui-dark-mockups
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const ASSETS = '/Users/dineshvenkatesan/.cursor/projects/Users-dineshvenkatesan-code-agigx/assets'
const OUT_DARK = path.join(ROOT, 'public/images/products/agigx-ui')

const MAPPINGS = [
  { src: 'image-2c6d7af8-2c8f-4732-bd60-748586444022.png', out: 'cmp-consent-logs.png' },
  { src: 'image-ee9665e9-5fa9-4f52-8763-ba149070cd38.png', out: 'cmp-dsar-workflows.png' },
  { src: 'image-f3ac4d4d-f723-4480-949a-547dc4a280b1.png', out: 'cmp-dsar-requests.png' },
  { src: 'image-83a49765-6a19-47a8-a1a9-4b23e30aed87.png', out: 'cmp-manage-cookies.png' },
  { src: 'image-dd2b8837-57d3-40d0-a561-2d2b68b7d865.png', out: 'cmp-processor-monitoring.png' },
  { src: 'image-894926bb-322e-4120-9f47-284e454ef4e6.png', out: 'cmp-purpose-consent-logs.png' },
]

async function main() {
  fs.mkdirSync(OUT_DARK, { recursive: true })

  for (const item of MAPPINGS) {
    const input = path.join(ASSETS, item.src)
    if (!fs.existsSync(input)) {
      console.error('Missing:', input)
      process.exit(1)
    }
    await fs.promises.copyFile(input, path.join(OUT_DARK, item.out))
    console.log('✓', item.out)
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
