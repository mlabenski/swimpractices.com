import type { Store } from 'vuex'

declare module '#app' {
  interface NuxtApp {
    $fire: {
      auth: import('firebase/auth').Auth
      firestore: {
        collection: (path: string) => unknown
      }
      db: import('firebase/firestore').Firestore
    }
    $fireModule: {
      firestore: {
        FieldValue: {
          arrayUnion: (...elements: unknown[]) => unknown
          arrayRemove: (...elements: unknown[]) => unknown
          increment: (n: number) => unknown
        }
      }
    }
    $firebaseAuth: Record<string, unknown>
    $netlifyIdentity: unknown
    $axios: import('axios').AxiosInstance
    $store: Store<unknown>
    $buefy: { notification: { open: (opts: { message: string; type?: string }) => void } }
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $fire: NuxtApp['$fire']
    $fireModule: NuxtApp['$fireModule']
    $firebaseAuth: NuxtApp['$firebaseAuth']
    $netlifyIdentity: NuxtApp['$netlifyIdentity']
    $axios: NuxtApp['$axios']
    $buefy: NuxtApp['$buefy']
  }
}

export {}
