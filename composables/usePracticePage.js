/**
 * Client-side practice loader (replaces Nuxt 2 asyncData for practice detail pages).
 */
export async function loadPracticeById ($fire, id) {
  const doc = await $fire.firestore.collection('practices').doc(id).get()
  if (!doc.exists) {
    throw new Error('This practice was not found!')
  }
  return { id, ...doc.data() }
}
