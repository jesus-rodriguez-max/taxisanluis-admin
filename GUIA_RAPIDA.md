# GUÍA RÁPIDA - TaxiPro Panel de Control

## ⚡ CONFIGURACIÓN EN 5 PASOS

### 1. Descomprimir y instalar

```bash
tar -xzf taxipro-control-panel.tar.gz
cd taxipro-control-panel
pnpm install
```

### 2. Configurar Firebase

Edita `src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSy...",  // Copia de Firebase Console
  authDomain: "taxipro-backend-v2.firebaseapp.com",
  projectId: "taxipro-backend-v2",
  storageBucket: "taxipro-backend-v2.firebasestorage.app",
  messagingSenderId: "123...",
  appId: "1:123..."
};
```

**¿Dónde encontrar esto?**

1. Firebase Console → Configuración del proyecto (⚙️)
2. "Tus apps" → App web → "Configuración del SDK"

### 3. Marcar tu usuario como admin

**Opción A: Usando script Node.js**

Crea `set-admin-local.js`:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = "TU_UID_AQUI"; // Cámbialo por tu UID real

admin.auth().setCustomUserClaims(uid, { role: 'admin' })
  .then(() => console.log('✓ Admin configurado'))
  .catch(err => console.error('✗ Error:', err));
```

Ejecuta:

```bash
node set-admin-local.js
```

**Opción B: Cloud Function (Recomendado)**

Ya lo tienes implementado en tu backend. Solo ejecuta:

```bash
firebase deploy --only functions:setAdminClaim
```

Y llámala con tu UID.

**¿Cómo obtener tu UID?**

- Firebase Console → Authentication → Busca tu email → Copia el UID

### 4. Configurar Security Rules

En Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAdmin() {
      return request.auth != null && request.auth.token.role == 'admin';
    }
    
    match /drivers/{driverId} {
      allow read: if isAdmin();
    }
    
    match /trips/{tripId} {
      allow read: if isAdmin();
    }
    
    match /passengers/{passengerId} {
      allow read: if isAdmin();
    }
  }
}
```

### 5. Ejecutar

```bash
pnpm dev
```

Abre: <http://localhost:5173>

---

## 🔥 IMPORTANTE - ANTES DE USAR

### ✅ Checklist Pre-Vuelo

- [ ] Firebase config reemplazado en `src/lib/firebase.ts`
- [ ] Usuario marcado como admin (custom claim `role: 'admin'`)
- [ ] Security Rules actualizadas para permitir lectura a admins
- [ ] Google Sign-In habilitado en Firebase Authentication

### 🚨 Si el login falla

1. **"No tienes permisos de administrador"**
   - Verifica que ejecutaste el script para marcar como admin
   - Cierra sesión y vuelve a intentar (el token se actualiza)

2. **"Permission denied"** en consola
   - Revisa Security Rules
   - Verifica que el custom claim esté configurado

3. **Popup bloqueado**
   - Permite popups para localhost:5173

---

## 📊 CÓMO FUNCIONA EL PANEL

### Layout Principal

```
┌─────────────────────────────────────────────────────────┐
│ HEADER: Stats (Conductores online, Viajes, Alertas)    │
├─────────────────────────────────┬───────────────────────┤
│                                 │ SIDEBAR               │
│                                 │ ┌───┬───┬────┐       │
│          MAPA                   │ │ A │ V │ C  │ Tabs  │
│    (Leaflet + conductores       │ └───┴───┴────┘       │
│     + viajes en tiempo real)    │                       │
│                                 │ [Contenido tab]       │
│                                 │                       │
└─────────────────────────────────┴───────────────────────┘
```

**Tabs:**

- **A** = Alertas (🚨 problemas detectados)
- **V** = Viajes (lista de viajes activos)
- **C** = Conductores (lista filtrable)

### Elementos del Mapa

- 🟢 **Verde** = Conductor online
- ⚫ **Gris** = Conductor offline
- 🔵 **Azul** = Punto de origen del viaje
- 🔴 **Rojo** = Destino del viaje
- **Línea azul** = Ruta del viaje

### Sistema de Alertas (Automático)

El panel detecta y muestra automáticamente:

1. **Viajes estancados** (>5 min aceptados sin avanzar)
2. **Conductor offline con viaje activo**
3. **Stripe no habilitado pero conductor activo**
4. **Suscripciones vencidas**

---

## 🎯 CASOS DE USO

### Caso 1: Monitorear viaje solicitado

1. Usuario pide viaje
2. Aparece en stats "Viajes Solicitados" (pulsante en rojo)
3. Aparece en tab "Viajes" con estado "Solicitado"
4. Si pasan >5 min sin asignarse, genera alerta

### Caso 2: Identificar problemas de pago

1. Conductor online sin Stripe habilitado → Alerta roja
2. Ve a tab "Conductores"
3. Filtra por "Problemas"
4. Contacta al conductor para resolver

### Caso 3: Seguimiento en tiempo real

1. Viaje en progreso se muestra en el mapa
2. Haz clic en la tarjeta del viaje (tab "Viajes")
3. Se resalta en el mapa (línea naranja)
4. Si el conductor se detiene >10 min → Genera alerta

---

## 🛠️ DESPLEGAR A PRODUCCIÓN

### Firebase Hosting (Recomendado)

```bash
# 1. Compilar
pnpm build

# 2. Inicializar Hosting (solo primera vez)
firebase init hosting
# - Public directory: dist
# - Single-page app: Yes

# 3. Desplegar
firebase deploy --only hosting
```

Tu panel estará en: `https://taxipro-backend-v2.web.app`

### Netlify/Vercel

1. Conecta tu repositorio Git
2. Build command: `pnpm build`
3. Publish directory: `dist`

---

## 🐛 TROUBLESHOOTING

### Los datos no cargan

```bash
# Abre la consola del navegador (F12) y busca:
# - Errores de Firebase
# - Permission denied
# - Network errors
```

**Soluciones:**

- Verifica Security Rules
- Confirma que hay datos en Firestore
- Revisa que el custom claim esté configurado

### El mapa no aparece

1. Verifica que `leaflet/dist/leaflet.css` se cargue
2. Revisa la consola para errores de JavaScript
3. Confirma que conductores tengan `location.lat` y `location.lng`

### Alertas no se generan

Las alertas se calculan en el cliente cada vez que cambian `drivers` o `trips`.

Verifica que:

- Tus conductores tengan `isOnline`, `stripeChargesEnabled`, etc.
- Los viajes tengan `status`, `acceptedAt`, `driverId`

---

## 📝 ESTRUCTURA DE ARCHIVOS CRÍTICOS

```
src/
├── lib/firebase.ts          ← CONFIGURAR AQUÍ
├── hooks/
│   ├── useAuth.ts           ← Verifica custom claim
│   ├── useDrivers.ts        ← Listeners Firestore
│   ├── useTrips.ts          ← Listeners Firestore
│   └── useAlerts.ts         ← Lógica de alertas
├── components/
│   ├── Dashboard.tsx        ← Layout principal
│   ├── Login.tsx            ← Autenticación
│   └── LiveMap.tsx          ← Mapa Leaflet
└── types/index.ts           ← Tipos basados en tu Firestore
```

---

## ⚙️ COMANDOS ÚTILES

```bash
# Desarrollo
pnpm dev

# Compilar
pnpm build

# Preview de producción
pnpm preview

# Linter
pnpm lint

# Limpiar node_modules
rm -rf node_modules && pnpm install
```

---

## 🔒 SEGURIDAD

**NUNCA commits:**

- `serviceAccountKey.json`
- `.env` con API keys (si los usas)

**El panel:**

- Solo lee de Firestore (no escribe)
- Requiere autenticación
- Verifica custom claim `role: 'admin'`
- No puede ser burlado por usuarios sin permisos

---

**¿Dudas?** Revisa la consola del navegador (F12) → Console

**Panel creado:** 25 de diciembre 2024
**Stack:** React + TypeScript + Firebase + Leaflet + Tailwind CSS
