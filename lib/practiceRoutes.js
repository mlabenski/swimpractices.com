/**
 * Canonical client-side path for a practice detail page.
 * Matches production URLs: https://swimpractices.com/{practiceId}
 */
export function practicePath (practiceId) {
  if (!practiceId) {
    return '/'
  }
  return `/${practiceId}`
}

export function practicePagePath (practiceId) {
  if (!practiceId) {
    return '/'
  }
  return `/practice/${practiceId}`
}
