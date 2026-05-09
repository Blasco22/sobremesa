# Plataforma recetas personalizada

_Started 2026-05-09 16:50 UTC_

---

## User

Quiero hacer una web para tener recetas al estilo de CookPad, Kitchen stories y SuperCook. Quiero lo mejor de cada una de ella y quiero poder añadir mis propias recetas ya sea escribiendolas o pasando un archivo de texto e importandolo. Este archivo deberá seguir una estructura simple y se le podrán poner una foto inicial para que se vea luego en la propia receta.
Quiero un rollo moderno pero fino

## Assistant

_[tool: questions_v2]_

## User

Questions answered:
- scope: Importar receta desde archivo de texto, Crear receta a mano, Mis recetas / colección personal, Detalle de receta paso a paso (estilo Kitchen Stories), Buscador por ingredientes (estilo SuperCook), Home / descubrir recetas
- vibe: 4
- brand_assets: Inventa tú nombre y marca
- import_format: Decide tú
- search_style: Ambas cosas combinadas
- step_mode: Las dos: vista clásica con botón "Modo cocina"
- platform: Las dos vistas lado a lado
- tone: Cercano y cálido ("vamos a cocinar")
- imagery: Placeholders elegantes con etiquetas (yo pondré las fotos)
- variations: Decide tú

## Assistant

_[tool: update_todos]_

_[tool: copy_starter_component]_

_[tool: copy_starter_component]_

Perfecto, con eso me lanzo. Antes de tocar tecla declaro el sistema:

**Marca:** "Sobremesa" — cercano, evocador, original. Tagline: *tu cocina, sin prisa*.
**Paleta (warm pop):** crema `#f4ede4`, tinta `#1a1a1a`, terracota `#c8593a`, marrón cálido `#6b5d4a`, oliva apagado `#7a8259`.
**Tipografía:** *Instrument Serif* para títulos/acentos editoriales, *Söhne*-style sans (fallback Helvetica Neue) para UI, *IBM Plex Mono* para etiquetas de placeholder.
**Lienzo:** un `design_canvas` con secciones, cada artboard es un prototipo interactivo navegable. Desktop y móvil lado a lado.
**Variaciones:** la elegida (warm pop) afinada + un par de tweaks (modo oscuro herbal, tipografía display alterna).

Voy a montar el esqueleto.

_[tool: read_file]_

_[tool: read_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: write_file]_

Tengo todo lo que necesito. Voy a montarlo en archivos pequeños.

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: list_files]_

_[tool: snip]_

_[tool: update_todos]_

_[tool: done]_

_[tool: update_todos]_

_[tool: fork_verifier_agent]_

Listo. **Sobremesa** — recetario warm pop con desktop y móvil interactivos lado a lado, sistema visual al lado, y tweaks para tema/acento/serif.

## User

Verifier agent check completed

## Assistant

_[tool: snip]_

El acento oliva (#7a8259) lo cambiaste tú vía Tweaks y se guardó en disco — lo dejo como está. Si quieres volver a la terracota original, abre el panel de Tweaks y elige el primer swatch.

## User

Me encanta, para que sirbe lo de la Lista?
Se podría hacer aplicación para poder descargarlo tanto en android como en apple ya sea tablet o móvil?

## Assistant

**Lista** = lista de la compra. La idea es que desde una receta (o varias) puedas mandar los ingredientes que te faltan (los que no están en tu despensa) a una lista única, agruparla por secciones (verdulería, lácteos, despensa…) y tacharlos en el súper. Ahora mismo es un placeholder en la barra inferior — si quieres lo monto como pantalla real con un par de variaciones.

**Sobre llevarlo a app nativa:** sí, hay tres caminos según cuánto esfuerzo quieras meter:

1. **PWA (lo más rápido)** — añades un manifest + service worker y la web se "instala" en iOS y Android desde el navegador. Funciona offline, icono en el home, pantalla completa. Sin tiendas, sin cuentas de developer. Ideal para validar.
2. **Capacitor / Tauri** — envuelves esta misma web en un contenedor nativo y la publicas en App Store y Google Play. Mismo código, acceso a cámara (para fotos de recetas), notificaciones, etc.
3. **React Native / Flutter (rehacer)** — máxima fluidez nativa pero hay que reescribir la UI. Solo si el producto crece mucho.

Mi recomendación: empezar por PWA con este mismo prototipo, y si funciona, pasar a Capacitor para tener presencia en tiendas sin reescribir nada.

¿Quieres que monte la pantalla de Lista de la compra como siguiente paso, o que prepare el manifest PWA para que ya se pueda "instalar" desde el móvil?

## User

Claro lo que quiero es poder tenerlo en mi movil o tablet ya sea android o apple. Con un login con Google mismamente para que sea seguro pero más sencillo y se podría tener de manera privada en la appstore y googleplay?

## Assistant

_[tool: snip]_

Sí, las dos cosas son posibles y bastante razonables:

**Login con Google** 
Es de los flujos más sencillos de añadir. Lo habitual es usar **Firebase Authentication** o **Supabase Auth** — los dos te dan login con Google de una línea, gestión de sesiones, y la base de datos donde guardas tus recetas asociadas a tu cuenta. Gratis para uso personal. En iOS, eso sí, Apple obliga a ofrecer también "Sign in with Apple" si publicas en su tienda, así que normalmente se ponen los dos botones.

**Distribución privada en las tiendas — depende de qué entiendas por "privada":**

| Opción | Coste | A quién ve la app |
|---|---|---|
| **TestFlight (iOS)** | $99/año Apple Developer | Hasta 100 personas que tú invites por email — sin pasar revisión de App Store |
| **Internal Testing (Android)** | $25 una vez Google Play | Hasta 100 testers invitados |
| **Unlisted en App Store / Play** | Las cuotas anteriores | Cualquiera con el link, pero no aparece en búsquedas |
| **Solo para ti, sin tienda** | Solo cuota Apple | Te la instalas firmada en tu propio dispositivo |

Si la idea es **solo tú o tú + familia**, lo más limpio es:
- **TestFlight + Internal Testing** — gratis distribuir, sin revisión exhaustiva, las personas invitadas se la instalan como cualquier app.
- Empaquetas la web actual con **Capacitor** (mismo código que ya tienes) y subes los binarios a cada tienda.

Si la idea es **que esté disponible pero sin promocionarla**, "Unlisted" en Google Play es perfecto; en Apple no existe equivalente exacto pero TestFlight cumple.

¿Quieres que añada al prototipo la pantalla de **login con Google** (con su variante de "continuar como invitado") y la pantalla de **Lista de la compra**? Son las dos piezas que faltan para que el flujo esté completo y se pueda empaquetar tal cual.

## User

Si lo quiero de manera gratuita, tambien se almacenan las recetas para siempre y no se borran nunca a no ser que la quiera eliminar yo?

## Assistant

_[tool: snip]_

Sí, perfectamente — para uso personal se queda **gratis y permanente**. Te explico cómo queda el coste real:

**Lo que es gratuito de verdad (capa "free tier" siempre):**

| Servicio | Te da gratis | Suficiente para |
|---|---|---|
| **Firebase / Firestore** | 1 GB de base de datos + 10 GB de descarga al mes | ~50.000 recetas de texto. No vas a llegar nunca. |
| **Firebase Storage** (fotos) | 5 GB de almacenamiento + 1 GB descarga/día | ~5.000 fotos a tamaño razonable |
| **Supabase** (alternativa) | 500 MB DB + 1 GB de fotos | Igual de holgado para uso personal |
| **Login con Google** | Ilimitado | — |

Las recetas no se borran nunca por su cuenta. Solo desaparecerían si:
- Las borras tú
- No usas la cuenta del proveedor (Firebase/Supabase) en ~12 meses → te avisan por email antes
- Cierras tu cuenta de Google

**Lo único que SÍ cuesta dinero (de una vez o anual):**
- Apple Developer: **99 €/año** — obligatorio si quieres la app en iPhone/iPad, aunque sea solo para ti
- Google Play: **25 € una sola vez** — y ya está para siempre

Si saltas la App Store y vas solo a Android + PWA en iPhone, te sale **gratis del todo** salvo los 25 € únicos de Google Play. La PWA en iPhone funciona muy bien para esta app — se instala desde Safari con "Añadir a pantalla de inicio" y queda como una app normal.

**Backup extra:** como las recetas son archivos de texto simples (el `.md` que ya diseñé), siempre puedes exportar todo tu recetario a una carpeta y guardarla donde quieras — Drive, un disco, donde sea. Esa es tu garantía real de "para siempre".

¿Quieres que añada al prototipo la pantalla de **login** y la de **lista de la compra** para tener el flujo completo?

## User

No puede ser del todo gratuita?

## Assistant

_[tool: snip]_

Sí, totalmente gratis es posible — solo tienes que renunciar a estar en la **App Store de Apple** (que es donde están los 99 €/año obligatorios de Apple).

**Opción 100% gratis:**

| Plataforma | Cómo se instala | Coste |
|---|---|---|
| **iPhone / iPad** | PWA desde Safari → "Añadir a pantalla de inicio" | 0 € |
| **Android / tablet Android** | PWA desde Chrome → "Instalar app" o APK directo | 0 € |
| **Almacenamiento de recetas** | Firebase o Supabase free tier | 0 € |
| **Login con Google** | Firebase Auth | 0 € |
| **Hosting de la web** | Vercel / Netlify / GitHub Pages | 0 € |

**Cómo queda en la práctica:**

En **iPhone/iPad**, la PWA queda con su icono en la pantalla de inicio, pantalla completa, sin barra del navegador, funciona offline. La diferencia con una app de la App Store es prácticamente invisible para el uso diario. Lo único que pierdes es notificaciones push completas (iOS las tiene limitadas en PWA) y no aparece en búsquedas de la App Store — pero como es para ti, eso da igual.

En **Android**, la PWA queda aún mejor que en iOS porque Chrome la trata casi como app nativa. Y si en algún momento quieres pasarla a Google Play, son 25 € **una sola vez** (no anuales).

**Resumen:**
- **0 €/mes para siempre** → PWA + Firebase free tier. Funciona en todos tus dispositivos.
- **25 € una vez** → si además quieres tenerla en Google Play como app "de verdad".
- **99 €/año** → solo si quieres TestFlight o App Store en iOS. Saltable.

Mi recomendación honesta para uso personal/familiar: PWA + Firebase. Es lo más limpio y no pagas nada nunca. ¿Quiero seguir con la pantalla de login y lista de la compra para cerrar el prototipo?

## User

Con PWA no se paga nada ni en apple ni android?

## Assistant

_[tool: snip]_

Exacto, con PWA **no pagas absolutamente nada** ni en Apple ni en Android. Ni cuotas anuales, ni únicas, ni a nadie.

**Por qué es gratis:**

Una PWA (Progressive Web App) es simplemente una página web bien hecha que el navegador puede "instalar" como si fuera una app. No pasa por la App Store ni por Google Play, así que te saltas las cuotas de developer (99 €/año Apple, 25 € Google).

**Cómo se instala en cada sitio:**

| Dispositivo | Pasos |
|---|---|
| **iPhone / iPad** | Abrir la web en Safari → botón "Compartir" → "Añadir a pantalla de inicio" |
| **Android / tablet Android** | Abrir en Chrome → aparece banner "Instalar app", o menú ⋮ → "Instalar aplicación" |
| **Mac / PC** | Chrome muestra un icono de instalar en la barra de direcciones |

Después de instalarla, el icono queda en tu pantalla de inicio como cualquier otra app. Al abrirla, no se ve la barra del navegador, está a pantalla completa. Funciona offline (las recetas se guardan localmente y se sincronizan cuando hay red). Es indistinguible de una app nativa para el uso del día a día.

**El único "coste" oculto que podrías encontrar:**

- **Hosting de la web:** gratis con Vercel, Netlify, Cloudflare Pages o GitHub Pages — te sobra cualquiera de ellos para esto.
- **Dominio propio** (tipo `sobremesa.app`): opcional, ~10 €/año si quieres uno bonito. Si te conformas con `sobremesa.vercel.app`, es 0 €.

Total para tener tu app en todos los dispositivos de tu casa, con login Google, recetas guardadas para siempre, y sincronización: **0 €/año**. Para siempre.

La única limitación real respecto a una app nativa es que en iPhone las notificaciones push son algo más limitadas — pero para un recetario tampoco es crítico.

## User

Si hazlo con vercel y crealo ya todo

## Assistant

_[tool: snip]_

Tengo que ser honesto contigo sobre qué puedo hacer aquí y qué tienes que hacer tú, porque no quiero venderte humo.

**Lo que puedo hacer yo en este entorno** (ahora mismo, en este chat):

- ✅ Diseñar y maquetar todas las pantallas del prototipo (ya hecho — desktop + móvil)
- ✅ Añadir las pantallas que faltan: **login con Google**, **lista de la compra**, y **ajustes/cuenta**
- ✅ Convertir el prototipo en una **PWA instalable** real: añadir `manifest.json`, service worker, iconos, modo offline
- ✅ Dejarte el código preparado para conectar a Firebase (los huecos donde van las llamadas de auth y guardado)
- ✅ Empaquetar todo en un ZIP listo para subir

**Lo que necesitas hacer tú** (no puedo hacerlo por ti desde aquí):

1. **Crear cuenta gratis en Vercel** (vercel.com, login con GitHub) — 2 min
2. **Crear cuenta gratis en Firebase** (firebase.google.com) — 2 min
   - Activar Authentication → Google
   - Activar Firestore (base de datos)
   - Copiarme las claves de configuración (las pegas aquí y yo las meto en el código)
3. **Subir la carpeta** a Vercel arrastrándola en su web, o conectando un repo de GitHub — 3 min
4. **Abrir la URL** que te da Vercel desde tu iPhone/Android e instalar la PWA

Es realmente sencillo, pero los pasos 1-3 son cuentas tuyas con tu email — no puedo crearlas yo.

**Mi propuesta de plan:**

Yo construyo ahora mismo:
- Pantalla de **login** (Google + invitado) en desktop y móvil
- Pantalla de **lista de la compra** funcional (añadir desde recetas, agrupar por categoría, tachar)
- **Ajustes/cuenta** con exportar todo el recetario
- **PWA**: manifest, iconos, service worker, modo offline
- **Hueco de Firebase** preparado (con datos locales mock que luego cambias por Firebase real)
- **README** con los pasos exactos para Vercel + Firebase, en español

Cuando termine, te lo dejo todo en un ZIP descargable. Tú haces los pasos 1-3 (10-15 min) y ya tienes la app en tu móvil.

¿Tiro adelante con esto? ¿O prefieres que primero añada solo las pantallas que faltan (login y lista) y luego ya nos preocupamos del despliegue?

## User

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdWC4htyyJC3b_V2LDnk_UbxzSHpWDvRk",
  authDomain: "sobremesa-af74f.firebaseapp.com",
  projectId: "sobremesa-af74f",
  storageBucket: "sobremesa-af74f.firebasestorage.app",
  messagingSenderId: "1063107187004",
  appId: "1:1063107187004:web:ce96771d634d52ac9a0e39",
  measurementId: "G-2HR754R5M2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

## Assistant

_[tool: snip]_

_[tool: update_todos]_

_[tool: run_script]_

_[tool: write_file]_

_[tool: write_file]_

Empiezo por el shell de la PWA y los iconos.

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: snip]_

