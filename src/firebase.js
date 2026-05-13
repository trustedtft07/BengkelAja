import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDXy-2QS52710jzJfFCwI6SUu938vYuF7g',
  authDomain: 'pplbo-uas-2-5f657.firebaseapp.com',
  projectId: 'pplbo-uas-2-5f657',
  storageBucket: 'pplbo-uas-2-5f657.firebasestorage.app',
  messagingSenderId: '854713362736',
  appId: '1:854713362736:web:61182192b49a621e7040f5',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
