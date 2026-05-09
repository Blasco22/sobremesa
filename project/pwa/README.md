# Sobremesa · cómo desplegar tu recetario

App PWA gratis, instalable en iPhone, iPad, Android y escritorio. Login con Google y recetas guardadas en tu cuenta de Firebase.

## ⚡ Despliegue en Vercel (5 minutos)

1. Ve a [vercel.com](https://vercel.com) y entra con GitHub (o crea cuenta).
2. Click en **Add New → Project**.
3. Arrastra **toda la carpeta `pwa/`** a la pantalla de Vercel (o súbela como repo de GitHub y conéctalo).
4. En la pantalla de configuración:
   - **Framework Preset:** Other
   - **Root Directory:** `pwa` (si subes el proyecto entero) o déjalo vacío si solo subes el contenido.
   - Todo lo demás por defecto.
5. Click **Deploy**. En ~30s tienes una URL tipo `sobremesa-xxx.vercel.app`.

## 🔑 Importante: autorizar el dominio en Firebase

Para que el login con Google funcione desde tu URL de Vercel:

1. Entra en la [consola de Firebase](https://console.firebase.google.com/) → tu proyecto **sobremesa-af74f**.
2. Authentication → Settings → **Authorized domains**.
3. Click **Add domain** y añade `tu-app.vercel.app` (lo que te haya dado Vercel).
4. Si tienes dominio propio, añádelo también.

## 📋 Reglas de Firestore (recomendado)

Por defecto Firestore puede estar abierto en modo "test". Para que cada usuario solo vea sus propias recetas, ve a **Firestore Database → Rules** y pega:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Click **Publish**.

## 📱 Instalar en tu móvil/tablet

### iPhone / iPad
1. Abre tu URL de Vercel en **Safari** (no funciona desde Chrome en iOS).
2. Botón **Compartir** (cuadrado con flecha hacia arriba).
3. **Añadir a pantalla de inicio**.
4. El icono aparece en tu home como cualquier app.

### Android
1. Abre la URL en **Chrome**.
2. Aparece un banner abajo: "**Instalar app**" — tócalo.
3. O desde el menú ⋮ → **Instalar aplicación**.
4. La app queda en tu cajón de aplicaciones.

### Mac / PC
- Chrome muestra un icono de instalación en la barra de direcciones (al lado de la estrella).

## ✅ Funciones

- 🔐 **Login con Google** o modo invitado (recetas guardadas localmente)
- 📖 **Recetario** con 3 recetas de ejemplo precargadas
- 🥕 **Despensa** con porcentaje de match por receta
- 🍳 **Modo cocina** paso a paso con timers
- 🛒 **Lista de la compra** agrupada por categoría
- ✍️ **Crear recetas** desde la app con foto inicial
- 📥 **Importar desde Markdown** (.md). Ver formato abajo
- ☁️ **Sincronización** entre dispositivos (con Google login)
- 📴 **Funciona offline** una vez instalada

## 📝 Formato de archivo .md para importar

```
---
title: Mi receta
servings: 4
time: 30
difficulty: fácil
tags: pasta, 30min
---

Una breve descripción opcional aquí (también puedes ponerla bajo # Notas).

# Ingredientes
- 200 g pasta
- 2 dientes de ajo
- aceite de oliva

# Pasos
1. Pon el agua a hervir. ⏱ 10
2. Pocha el ajo en aceite.
3. Mezcla todo y sirve.

# Notas
texto libre, opcional.
```

El símbolo **⏱ N** dentro de un paso lo convierte en timer de N minutos.

## 💰 Coste real

- **Vercel hosting:** gratis para siempre (Hobby plan).
- **Firebase Auth:** gratis ilimitado.
- **Firestore:** 1 GB de DB + 50.000 lecturas/día gratis. Para uso personal nunca lo verás.
- **Total:** **0 €/mes**, para siempre.

## 🔒 Privacidad

- Tus recetas viven en tu propio proyecto de Firebase, vinculado a tu cuenta de Google.
- Las reglas de arriba garantizan que solo tú puedes leer tus datos.
- Modo invitado: todo se guarda en `localStorage` del navegador. No sale del dispositivo.

## 🛠 Estructura del proyecto

```
pwa/
├── index.html              # entrada principal
├── styles.css              # estilos
├── manifest.webmanifest    # config PWA
├── sw.js                   # service worker (offline)
├── firebase-init.js        # carga del SDK de Firebase
├── app-core.js             # store, parser, semilla de recetas
├── app-screens-1.jsx       # auth, home, despensa
├── app-screens-2.jsx       # detalle, cocina, recetario, lista, crear, importar, ajustes
├── app-main.jsx            # raíz React, routing
└── icons/                  # iconos de la PWA
```

Todos los assets son estáticos. No hay backend propio: solo Firebase + Vercel.

---

Si algo falla, lo más común es:
- **El login no abre el popup** → revisa que añadiste tu dominio en Firebase Authorized domains.
- **No carga las recetas** → revisa las reglas de Firestore.
- **No aparece el banner de instalación en iOS** → tienes que abrir en Safari, no en Chrome.

Buen provecho 🍳
