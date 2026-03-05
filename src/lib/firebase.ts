import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// CONFIGURACIÓN DE FIREBASE
// José: Reemplaza estos valores con tu configuración real de Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDg9U76x9N4HOxXlRqASwA0qRf05m_Pk78",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "taxipro-backend-v2.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "taxipro-backend-v2",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "taxipro-backend-v2.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "885882199358",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

// Inicializar Firebase
// Inicializar Firebase
import { getApps } from 'firebase/app';

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

// Exportar servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
