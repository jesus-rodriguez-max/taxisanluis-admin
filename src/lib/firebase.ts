import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// CONFIGURACIÓN DE FIREBASE
// José: Reemplaza estos valores con tu configuración real de Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDg9U76x9N4HOxXlRqASwA0qRf05m_Pk78",
  authDomain: "taxipro-backend-v2.firebaseapp.com",
  projectId: "taxipro-backend-v2",
  storageBucket: "taxipro-backend-v2.firebasestorage.app",
  messagingSenderId: "885882199358",
  appId: "1:885882199358:web:placeholder"
};

// Inicializar Firebase
// Inicializar Firebase
import { getApps } from 'firebase/app';

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

// Exportar servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
