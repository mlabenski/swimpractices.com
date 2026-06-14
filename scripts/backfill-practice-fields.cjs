/**
 * One-time backfill: align practice documents with the canonical iOS schema.
 *
 * The hardened Firestore rules validate practices on `title` + `createdBy`, but
 * legacy web docs were written with `name` + `userID`. This script copies the
 * legacy fields into the new ones (non-destructively) so existing docs satisfy
 * the new update/delete ownership checks and always have a `title`.
 *
 *   practices, daily_practice:
 *     title     <- title     || name
 *     createdBy <- createdBy || userID
 *
 * Run BEFORE deploying firestore.rules.
 *
 * Usage:
 *   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json \
 *     node scripts/backfill-practice-fields.cjs
 *
 * Add --dry-run to log changes without writing.
 */

const admin = require('firebase-admin')

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  })
}

const db = admin.firestore()
const DRY_RUN = process.argv.includes('--dry-run')
const COLLECTIONS = ['practices', 'daily_practice']

async function backfillCollection (collectionName) {
  const snapshot = await db.collection(collectionName).get()
  let updated = 0
  let skipped = 0

  // Firestore batches are limited to 500 writes.
  let batch = db.batch()
  let pending = 0

  for (const doc of snapshot.docs) {
    const data = doc.data()
    const patch = {}

    if (data.title == null && data.name != null) {
      patch.title = data.name
    }
    if (data.createdBy == null && data.userID != null) {
      patch.createdBy = data.userID
    }

    if (Object.keys(patch).length === 0) {
      skipped++
      continue
    }

    updated++
    console.log(`${DRY_RUN ? '[dry-run] ' : ''}${collectionName}/${doc.id}`, patch)

    if (!DRY_RUN) {
      batch.update(doc.ref, patch)
      pending++
      if (pending === 450) {
        await batch.commit()
        batch = db.batch()
        pending = 0
      }
    }
  }

  if (!DRY_RUN && pending > 0) {
    await batch.commit()
  }

  console.log(`\n${collectionName}: ${updated} updated, ${skipped} already current (of ${snapshot.size} total)\n`)
}

async function main () {
  for (const collectionName of COLLECTIONS) {
    await backfillCollection(collectionName)
  }
  console.log(DRY_RUN ? 'Dry run complete — no writes performed.' : 'Backfill complete.')
}

main().catch((err) => {
  console.error('Backfill failed:', err)
  process.exit(1)
})
