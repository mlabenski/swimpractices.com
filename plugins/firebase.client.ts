import { initializeApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCustomToken,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  increment,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore'

function env (key: string): string {
  return (
    process.env[`NUXT_PUBLIC_${key}`] ||
    process.env[`VUE_APP_FIREBASE_${key}`] ||
    ''
  )
}

type DocSnap = {
  exists: boolean
  id: string
  data: () => DocumentData | undefined
}

type QuerySnap = {
  empty: boolean
  docs: DocSnap[]
}

function mapDoc (id: string, data: DocumentData | undefined, exists: boolean): DocSnap {
  return {
    exists,
    id,
    data: () => data,
  }
}

function createFirestoreCompat (db: ReturnType<typeof getFirestore>) {
  function docRef (collectionPath: string, docId: string) {
    const ref = doc(db, collectionPath, docId)
    return {
      get: async (): Promise<DocSnap> => {
        const snap = await getDoc(ref)
        return mapDoc(snap.id, snap.data(), snap.exists())
      },
      set: (data: DocumentData, options?: { merge?: boolean }) =>
        setDoc(ref, data, options),
      update: (data: DocumentData) => updateDoc(ref, data),
      delete: () => deleteDoc(ref),
    }
  }

  function collectionRef (path: string) {
    const col = collection(db, path)
    return {
      doc: (id: string) => docRef(path, id),
      add: (data: DocumentData) => addDoc(col, data),
      get: async (): Promise<QuerySnap> => {
        const snap = await getDocs(col)
        return {
          empty: snap.empty,
          docs: snap.docs.map((d) => mapDoc(d.id, d.data(), true)),
        }
      },
      where: (field: string, op: string, value: unknown) => {
        const q = query(col, where(field, op as Parameters<typeof where>[1], value))
        return {
          get: async (): Promise<QuerySnap> => {
            const snap = await getDocs(q)
            return {
              empty: snap.empty,
              docs: snap.docs.map((d) => mapDoc(d.id, d.data(), true)),
            }
          },
        }
      },
      onSnapshot: (callback: (snap: QuerySnap) => void) =>
        onSnapshot(col, (snap) => {
          callback({
            empty: snap.empty,
            docs: snap.docs.map((d) => mapDoc(d.id, d.data(), true)),
          })
        }),
    }
  }

  return {
    collection: collectionRef,
  }
}

export default defineNuxtPlugin({
  name: 'firebase',
  enforce: 'pre',
  setup () {
    const config = useRuntimeConfig()

    const firebaseConfig = {
      apiKey: config.public.firebaseApiKey || env('apiKey'),
      authDomain: config.public.firebaseAuthDomain || env('authDomain'),
      projectId: config.public.firebaseProjectId || env('projectId'),
      storageBucket: config.public.firebaseStorageBucket || env('storageBucket'),
      messagingSenderId:
        config.public.firebaseMessagingSenderId || env('messagingSenderId'),
      appId: config.public.firebaseAppId || env('appId'),
      measurementId: config.public.firebaseMeasurementId || env('measurementId'),
    }

    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    const db = getFirestore(app)
    const firestore = createFirestoreCompat(db)

    const $fire = { auth, firestore, db, app }
    const $fireModule = {
      firestore: {
        FieldValue: {
          arrayUnion: (...elements: unknown[]) => arrayUnion(...(elements as [unknown, ...unknown[]])),
          arrayRemove: (...elements: unknown[]) => arrayRemove(...(elements as [unknown, ...unknown[]])),
          increment: (n: number) => increment(n),
        },
      },
    }

    return {
      provide: {
        fire: $fire,
        fireModule: $fireModule,
        firebaseAuth: {
          getIdToken: async () => {
            const user = auth.currentUser
            if (!user) return null
            return user.getIdToken(false)
          },
          signInWithCustomToken: (token: string) => signInWithCustomToken(auth, token),
          signOut: () => signOut(auth),
          isSignedIn: () => auth.currentUser !== null,
          getCurrentUser: () => auth.currentUser,
          signInWithGoogle: () => signInWithPopup(auth, new GoogleAuthProvider()),
          signInWithEmail: (email: string, password: string) =>
            signInWithEmailAndPassword(auth, email, password),
          createUserWithEmail: async (
            email: string,
            password: string,
            displayName?: string
          ) => {
            const credential = await createUserWithEmailAndPassword(
              auth,
              email,
              password
            )
            if (displayName && credential.user) {
              await updateProfile(credential.user, { displayName })
            }
            return credential
          },
        },
      },
    }
  },
})
