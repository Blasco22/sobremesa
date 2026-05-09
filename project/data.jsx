// Sobremesa · sample data
// Recetas + ingredientes de despensa + ejemplo de archivo de import

const RECIPES = [
  {
    id: 'crema-calabaza',
    title: 'Crema de calabaza asada',
    blurb: 'Asar la calabaza antes de triturar concentra el dulzor y le da un toque ahumado.',
    servings: 4,
    time: 45,
    difficulty: 'Fácil',
    tags: ['sopa', 'otoño', 'vegetariano'],
    tone: 'mostaza',
    author: 'tú',
    saved: true,
    ingredients: [
      { qty: '1', name: 'calabaza moscada', note: '≈ 1,2 kg' },
      { qty: '1', name: 'cebolla' },
      { qty: '2', name: 'dientes de ajo' },
      { qty: '200 ml', name: 'nata para cocinar' },
      { qty: '1 cdta', name: 'comino molido' },
      { qty: 'al gusto', name: 'aceite, sal, pimienta' },
    ],
    steps: [
      { title: 'Calienta el horno', body: 'Precalienta el horno a 200 °C, calor arriba y abajo. Forra una bandeja con papel.' },
      { title: 'Asa la calabaza', body: 'Corta la calabaza por la mitad, retira las pepitas. Pinta con aceite, sal y comino. Asa 35 min hasta que esté tierna y dorada en los bordes.', timer: 35 },
      { title: 'Pocha la base', body: 'Mientras tanto, pocha cebolla picada y ajo a fuego medio con un poco de aceite, 8–10 min.', timer: 10 },
      { title: 'Tritura', body: 'Saca la pulpa de la calabaza con una cuchara. Tritúralo todo con la base, la nata y un poco de agua caliente hasta tener una crema sedosa.' },
      { title: 'Rectifica y sirve', body: 'Prueba de sal y pimienta. Sirve con un hilo de aceite, pipas tostadas y, si quieres, un toque de yogur.' },
    ],
    notes: 'Si quieres más cremosidad, añade un puñado de anacardos al triturar.',
  },
  {
    id: 'pasta-limon',
    title: 'Pasta al limón con ricotta',
    blurb: '15 minutos. La emulsión de pasta-agua-limón es la magia: no se corta y queda brillante.',
    servings: 2,
    time: 15,
    difficulty: 'Fácil',
    tags: ['pasta', 'rápido', 'vegetariano'],
    tone: 'cream',
    saved: true,
    ingredients: [
      { qty: '180 g', name: 'spaghetti' },
      { qty: '1', name: 'limón', note: 'piel + zumo' },
      { qty: '120 g', name: 'ricotta' },
      { qty: '30 g', name: 'parmesano rallado' },
      { qty: 'un puñado', name: 'albahaca fresca' },
      { qty: 'al gusto', name: 'aceite, pimienta negra' },
    ],
    steps: [
      { title: 'Hierve la pasta', body: 'Cocina la pasta en agua con sal según el paquete. Reserva 1 taza del agua antes de escurrir.', timer: 9 },
      { title: 'Monta la salsa', body: 'En el bol, mezcla ricotta, ralladura y zumo de limón, parmesano, aceite y pimienta. Afloja con un par de cucharones de agua de cocción.' },
      { title: 'Une', body: 'Añade la pasta caliente al bol, remueve enérgicamente. Si necesita más cremosidad, añade más agua de cocción.' },
      { title: 'Sirve', body: 'Termina con albahaca rota a mano y más parmesano. Mejor inmediatamente.' },
    ],
  },
  {
    id: 'pollo-limon',
    title: 'Pollo al horno con limón y patatas',
    blurb: 'Una bandeja, una hora. Las patatas absorben todo el jugo del pollo y del limón asado.',
    servings: 4,
    time: 65,
    difficulty: 'Fácil',
    tags: ['horno', 'familia', 'pollo'],
    tone: 'tinta',
    saved: false,
    ingredients: [
      { qty: '4', name: 'muslos de pollo con piel' },
      { qty: '800 g', name: 'patatas pequeñas' },
      { qty: '2', name: 'limones' },
      { qty: '4', name: 'dientes de ajo' },
      { qty: '1 ramita', name: 'romero' },
      { qty: '60 ml', name: 'aceite de oliva' },
    ],
    steps: [
      { title: 'Marina el pollo', body: 'Mezcla pollo con sal, pimienta, zumo de medio limón, ajo machacado y aceite. Deja 15 min mientras enciendes el horno a 200 °C.', timer: 15 },
      { title: 'Prepara la bandeja', body: 'Corta patatas en cuartos. Mezcla con sal, aceite, romero y rodajas del otro limón. Coloca en bandeja.' },
      { title: 'Hornea', body: 'Coloca pollo encima de las patatas, piel hacia arriba. Hornea 45 min hasta que el pollo esté dorado y las patatas tiernas.', timer: 45 },
      { title: 'Reposa y sirve', body: 'Saca, deja reposar 5 min. Riega todo con los jugos de la bandeja antes de servir.' },
    ],
  },
  {
    id: 'ensalada-tomate',
    title: 'Ensalada de tomate con sandía',
    blurb: 'Tomate maduro y sandía bien fría. La sal hace todo el trabajo.',
    servings: 4,
    time: 10,
    difficulty: 'Fácil',
    tags: ['verano', 'sin cocción', 'vegetariano'],
    tone: 'rosa',
    saved: false,
    ingredients: [
      { qty: '4', name: 'tomates maduros' },
      { qty: '400 g', name: 'sandía sin pepitas' },
      { qty: '100 g', name: 'feta' },
      { qty: 'unas hojas', name: 'menta fresca' },
      { qty: '1 cda', name: 'vinagre de Jerez' },
      { qty: 'al gusto', name: 'aceite, sal en escamas' },
    ],
    steps: [
      { title: 'Corta', body: 'Corta tomates y sandía en trozos irregulares similares. Reparte en una fuente.' },
      { title: 'Sazona', body: 'Sal en escamas generosa, vinagre, aceite. Espera 2 minutos: el tomate suelta sus jugos.' },
      { title: 'Termina', body: 'Desmiga el feta encima, rompe la menta a mano. Sirve enseguida.' },
    ],
  },
  {
    id: 'tortilla',
    title: 'Tortilla de patatas jugosa',
    blurb: 'Cebolla pochada despacio + patatas confitadas + huevo justo cuajado.',
    servings: 4,
    time: 50,
    difficulty: 'Media',
    tags: ['clásico', 'español', 'vegetariano'],
    tone: 'mostaza',
    saved: true,
    ingredients: [
      { qty: '6', name: 'huevos' },
      { qty: '500 g', name: 'patatas' },
      { qty: '1', name: 'cebolla grande' },
      { qty: '300 ml', name: 'aceite de oliva suave' },
      { qty: 'al gusto', name: 'sal' },
    ],
    steps: [
      { title: 'Confita', body: 'Pela y corta patatas finas. Cebolla en juliana. Confita en aceite a fuego bajo 25 min, sin dorar.', timer: 25 },
      { title: 'Bate y mezcla', body: 'Bate los huevos con sal. Escurre patatas y cebolla, mezcla todo. Reposa 5 min.', timer: 5 },
      { title: 'Cuaja', body: 'En sartén antiadherente con poco aceite, vierte la mezcla a fuego medio-alto. 3 min, voltea con plato. 2 min más por el otro lado.', timer: 5 },
      { title: 'Reposa', body: 'Saca a un plato. Espera 2 minutos antes de cortar — el centro acaba de cuajarse con el calor residual.' },
    ],
  },
  {
    id: 'cookies',
    title: 'Cookies de chocolate y sal',
    blurb: 'Reposo de la masa en frío, mantequilla noisette, sal en escamas al final.',
    servings: 12,
    time: 30,
    difficulty: 'Media',
    tags: ['dulce', 'horno'],
    tone: 'tinta',
    saved: false,
    ingredients: [
      { qty: '120 g', name: 'mantequilla' },
      { qty: '100 g', name: 'azúcar moreno' },
      { qty: '60 g', name: 'azúcar blanco' },
      { qty: '1', name: 'huevo' },
      { qty: '180 g', name: 'harina' },
      { qty: '1/2 cdta', name: 'bicarbonato' },
      { qty: '180 g', name: 'chocolate negro picado' },
      { qty: 'al final', name: 'sal en escamas' },
    ],
    steps: [
      { title: 'Mantequilla noisette', body: 'Funde la mantequilla a fuego medio hasta que huela a avellana y los sólidos estén dorados. Enfría 10 min.', timer: 10 },
      { title: 'Mezcla', body: 'Bate mantequilla con azúcares, añade huevo. Incorpora harina + bicarbonato. Funde el chocolate.' },
      { title: 'Reposa', body: 'Forma 12 bolas, refrigera mínimo 30 min (mejor 24 h).', timer: 30 },
      { title: 'Hornea', body: '180 °C, 11 min. Los bordes dorados, el centro aún tierno.', timer: 11 },
      { title: 'Termina', body: 'Sal en escamas al sacar. Deja enfriar en bandeja 5 min antes de mover.' },
    ],
  },
];

// Despensa: ingredientes que el usuario dice tener.
// Estructurados por categoría para chips ordenables.
const PANTRY_CATEGORIES = [
  { id: 'verduras', label: 'verduras', items: ['cebolla', 'ajo', 'tomate', 'calabaza', 'patata', 'limón', 'sandía', 'romero', 'albahaca', 'menta'] },
  { id: 'proteina', label: 'proteína', items: ['huevo', 'pollo', 'feta', 'ricotta', 'parmesano'] },
  { id: 'despensa', label: 'despensa', items: ['pasta', 'harina', 'aceite', 'azúcar', 'sal', 'comino', 'bicarbonato'] },
  { id: 'extras', label: 'extras', items: ['nata', 'mantequilla', 'chocolate', 'vinagre'] },
];

// Filtros rápidos
const QUICK_FILTERS = [
  { id: 'all', label: 'todas' },
  { id: 'rapido', label: '< 20 min' },
  { id: 'veg', label: 'vegetariano' },
  { id: 'horno', label: 'horno' },
  { id: 'sin', label: 'sin cocción' },
];

const COLLECTIONS = [
  { id: 'semana', name: 'Cena entre semana', count: 14, tone: 'cream' },
  { id: 'finde', name: 'Finde con amigos', count: 8, tone: 'rosa' },
  { id: 'reservados', name: 'Para reservar fuerzas', count: 23, tone: 'oliva' },
  { id: 'dulce', name: 'Caprichos dulces', count: 6, tone: 'mostaza' },
];

// Ejemplo del archivo de importación que el usuario puede pegar/subir
const IMPORT_EXAMPLE = `---
title: Crema de calabaza asada
servings: 4
time: 45m
difficulty: fácil
tags: sopa, otoño, vegetariano
photo: calabaza.jpg
---

# Ingredientes
- 1 calabaza moscada (≈ 1,2 kg)
- 1 cebolla
- 2 dientes de ajo
- 200 ml de nata para cocinar
- 1 cdta de comino
- aceite, sal, pimienta

# Pasos
1. Precalienta el horno a 200 °C.
2. Asa la calabaza 35 min hasta que esté tierna. ⏱ 35m
3. Pocha cebolla y ajo a fuego medio. ⏱ 10m
4. Tritura todo con la nata. Rectifica de sal.
5. Sirve con pipas tostadas y un hilo de aceite.

# Notas
Si quieres más cremosidad, añade un puñado de anacardos al triturar.
`;

Object.assign(window, { RECIPES, PANTRY_CATEGORIES, QUICK_FILTERS, COLLECTIONS, IMPORT_EXAMPLE });
