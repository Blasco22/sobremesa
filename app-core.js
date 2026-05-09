// app-core.js · helpers, store, icons, parser. No JSX in this file (loaded as plain JS).
(function () {
const SEED_RECIPES = [
  {
    id: 'seed-tortilla', title: 'Tortilla de patata jugosa', tone: 'warm',
    blurb: 'La de toda la vida. Cebolla pochada con paciencia, patata sedosa y huevo justo cuajado por fuera.',
    time: 35, servings: 4, difficulty: 'fácil', tags: ['clásico', 'huevo'],
    ingredients: [
      { qty: '4', name: 'patatas medianas' }, { qty: '1', name: 'cebolla', note: 'grande' },
      { qty: '6', name: 'huevos' }, { qty: '300 ml', name: 'aceite de oliva' }, { qty: 'al gusto', name: 'sal' },
    ],
    steps: [
      { title: 'Pocha la cebolla', body: 'A fuego bajo con un buen chorro de aceite, sin prisa, hasta que esté dorada.', timer: 20 },
      { title: 'Confita la patata', body: 'Pela y corta en láminas finas. Échalas al aceite con la cebolla. Que se hagan, no que se frían.', timer: 18 },
      { title: 'Mezcla con huevo', body: 'Bate los huevos, sala y mezcla con la patata escurrida. Reposa 5 min para que la patata se empape.', timer: 5 },
      { title: 'Cuaja a fuego medio', body: '3 min, vuelta con plato, otros 2 min.', timer: 5 },
    ],
  },
  {
    id: 'seed-crema', title: 'Crema de calabaza asada', tone: 'warm',
    blurb: 'Asar la calabaza concentra su dulzor. Una sopa reconfortante con muy pocos ingredientes.',
    time: 45, servings: 4, difficulty: 'fácil', tags: ['sopa', 'otoño'],
    ingredients: [
      { qty: '1', name: 'calabaza moscada', note: '~1kg' }, { qty: '1', name: 'cebolla' },
      { qty: '2', name: 'dientes de ajo' }, { qty: '500 ml', name: 'caldo de verduras' },
      { qty: '100 ml', name: 'nata para cocinar', note: 'opcional' },
    ],
    steps: [
      { title: 'Asa la calabaza', body: 'Corta por la mitad, retira pepitas, riega con aceite. Horno 200°C boca abajo hasta que la pinches sin esfuerzo.', timer: 35 },
      { title: 'Pocha la base', body: 'Cebolla y ajo a fuego medio en una olla con aceite.', timer: 8 },
      { title: 'Tritura todo', body: 'Saca la pulpa de la calabaza, échala a la olla con el caldo. Tritura.', timer: 3 },
      { title: 'Termina con nata', body: 'Sal, pimienta y un chorrito de aceite al servir.', timer: 1 },
    ],
  },
  {
    id: 'seed-pasta', title: 'Pasta al pesto rojo', tone: 'red',
    blurb: 'Pesto siciliano de tomate seco y almendras. Listo en lo que tarda la pasta.',
    time: 15, servings: 2, difficulty: 'rápido', tags: ['pasta', '15min'],
    ingredients: [
      { qty: '200 g', name: 'pasta seca' }, { qty: '80 g', name: 'tomates secos en aceite' },
      { qty: '40 g', name: 'almendras', note: 'tostadas' }, { qty: '30 g', name: 'queso parmesano', note: 'rallado' },
      { qty: '1', name: 'diente de ajo', note: 'pequeño' }, { qty: 'unas hojas', name: 'albahaca fresca' },
    ],
    steps: [
      { title: 'Pasta al agua', body: 'Pon abundante agua con sal. Cuando rompa, échala.', timer: 9 },
      { title: 'Tritura el pesto', body: 'Tomates secos, almendras, queso, ajo, albahaca y un chorro del aceite del bote. Crema gruesa.', timer: 2 },
      { title: 'Mezcla y emplata', body: 'Reserva un poco de agua de cocción. Mézclala con el pesto.', timer: 2 },
    ],
  },
];

const PANTRY_CATEGORIES = [
  { id: 'verdura', label: 'verdura', items: ['cebolla', 'ajo', 'tomate', 'pimiento', 'calabacín', 'zanahoria', 'patata', 'apio', 'puerro', 'espinacas', 'lechuga'] },
  { id: 'proteina', label: 'proteína', items: ['huevo', 'pollo', 'ternera', 'atún', 'salmón', 'garbanzos', 'lentejas', 'tofu'] },
  { id: 'lacteo', label: 'lácteos', items: ['leche', 'nata', 'mantequilla', 'queso', 'yogur'] },
  { id: 'despensa', label: 'despensa', items: ['arroz', 'pasta', 'aceite', 'sal', 'azúcar', 'harina', 'pan', 'tomate triturado', 'caldo'] },
];

function classifyIngredient(name) {
  const n = name.toLowerCase();
  for (const cat of PANTRY_CATEGORIES) if (cat.items.some(it => n.includes(it))) return cat.label;
  return 'otros';
}

function makeStore(user) {
  const FB = window.FB;
  const lsKey = (k) => `sobremesa.${k}`;
  if (!user) {
    return {
      isGuest: true,
      async getRecipes() {
        const raw = localStorage.getItem(lsKey('recipes'));
        if (!raw) { localStorage.setItem(lsKey('recipes'), JSON.stringify(SEED_RECIPES)); return SEED_RECIPES; }
        return JSON.parse(raw);
      },
      async saveRecipe(r) {
        const list = await this.getRecipes();
        const i = list.findIndex(x => x.id === r.id);
        if (i >= 0) list[i] = r; else list.unshift(r);
        localStorage.setItem(lsKey('recipes'), JSON.stringify(list));
      },
      async deleteRecipe(id) {
        const list = (await this.getRecipes()).filter(x => x.id !== id);
        localStorage.setItem(lsKey('recipes'), JSON.stringify(list));
      },
      async getPantry() { return JSON.parse(localStorage.getItem(lsKey('pantry')) || '["cebolla","ajo","huevo","aceite","sal"]'); },
      async setPantry(arr) { localStorage.setItem(lsKey('pantry'), JSON.stringify(arr)); },
      async getShopping() { return JSON.parse(localStorage.getItem(lsKey('shopping')) || '[]'); },
      async setShopping(arr) { localStorage.setItem(lsKey('shopping'), JSON.stringify(arr)); },
      subscribeRecipes(cb) {
        this.getRecipes().then(cb);
        const h = (e) => { if (e.key === lsKey('recipes')) this.getRecipes().then(cb); };
        window.addEventListener('storage', h);
        return () => window.removeEventListener('storage', h);
      },
    };
  }
  const uid = user.uid;
  return {
    isGuest: false, user,
    async ensureSeed() {
      const meta = await FB.getDoc(FB.doc(FB.db, 'users', uid));
      if (meta.exists() && meta.data().seeded) return;
      for (const r of SEED_RECIPES) {
        await FB.setDoc(FB.doc(FB.db, 'users', uid, 'recipes', r.id), { ...r, createdAt: FB.serverTimestamp() });
      }
      await FB.setDoc(FB.doc(FB.db, 'users', uid), { seeded: true, email: user.email, name: user.displayName }, { merge: true });
    },
    async saveRecipe(r) {
      await FB.setDoc(FB.doc(FB.db, 'users', uid, 'recipes', r.id), { ...r, updatedAt: FB.serverTimestamp() }, { merge: true });
    },
    async deleteRecipe(id) { await FB.deleteDoc(FB.doc(FB.db, 'users', uid, 'recipes', id)); },
    async getPantry() {
      const s = await FB.getDoc(FB.doc(FB.db, 'users', uid, 'meta', 'pantry'));
      return s.data()?.items || ['cebolla','ajo','huevo','aceite','sal'];
    },
    async setPantry(arr) { await FB.setDoc(FB.doc(FB.db, 'users', uid, 'meta', 'pantry'), { items: arr }); },
    async getShopping() {
      const s = await FB.getDoc(FB.doc(FB.db, 'users', uid, 'meta', 'shopping'));
      return s.data()?.items || [];
    },
    async setShopping(arr) { await FB.setDoc(FB.doc(FB.db, 'users', uid, 'meta', 'shopping'), { items: arr }); },
    subscribeRecipes(cb) {
      this.ensureSeed().catch(console.error);
      const q = FB.query(FB.collection(FB.db, 'users', uid, 'recipes'));
      return FB.onSnapshot(q, (snap) => {
        const list = []; snap.forEach(d => list.push(d.data()));
        cb(list);
      }, (e) => console.error(e));
    },
  };
}

function parseRecipeMarkdown(text) {
  const r = { id: 'r-' + Date.now() + '-' + Math.random().toString(36).slice(2,6), title: '', tone: 'warm', servings: 4, time: 30, difficulty: 'fácil', tags: [], ingredients: [], steps: [], blurb: '' };
  const fmMatch = text.match(/^---\s*\n([\s\S]*?)\n---/);
  if (fmMatch) {
    fmMatch[1].split('\n').forEach((line) => {
      const m = line.match(/^(\w+):\s*(.+)$/);
      if (!m) return;
      const k = m[1].trim(), v = m[2].trim().replace(/^["']|["']$/g, '');
      if (k === 'title') r.title = v;
      else if (k === 'servings') r.servings = parseInt(v) || 4;
      else if (k === 'time') r.time = parseInt(v) || 30;
      else if (k === 'difficulty') r.difficulty = v;
      else if (k === 'tags') r.tags = v.split(',').map(s => s.trim()).filter(Boolean);
      else if (k === 'tone') r.tone = v;
    });
    text = text.slice(fmMatch[0].length);
  }
  const sections = {}; let cur = 'intro';
  text.split('\n').forEach((line) => {
    const h = line.match(/^#+\s*(.+)$/);
    if (h) { cur = h[1].trim().toLowerCase(); sections[cur] = sections[cur] || []; }
    else { (sections[cur] = sections[cur] || []).push(line); }
  });
  if (!r.title && sections['intro']) {
    const t = sections['intro'].find(l => l.trim());
    if (t) r.title = t.replace(/^#\s*/, '').trim();
  }
  const ingKey = Object.keys(sections).find(k => /ingredient/.test(k));
  if (ingKey) sections[ingKey].forEach((l) => {
    const m = l.match(/^[-*]\s*(.+)$/);
    if (!m) return;
    const qm = m[1].match(/^([\d/.,]+\s*\w*\.?)\s+(.+)$/);
    if (qm) r.ingredients.push({ qty: qm[1].trim(), name: qm[2].trim() });
    else r.ingredients.push({ qty: '', name: m[1].trim() });
  });
  const stepKey = Object.keys(sections).find(k => /paso|step|preparaci/.test(k));
  if (stepKey) {
    let buf = [];
    const flush = () => {
      if (!buf.length) return;
      const txt = buf.join(' ').trim();
      const tm = txt.match(/⏱\s*(\d+)\s*m?/);
      r.steps.push({
        title: txt.split('.')[0].slice(0, 60),
        body: txt.replace(/⏱\s*\d+\s*m?/, '').trim(),
        timer: tm ? parseInt(tm[1]) : null,
      });
      buf = [];
    };
    sections[stepKey].forEach((l) => {
      if (/^\s*\d+[.\)]\s/.test(l) || /^\s*[-*]\s/.test(l)) { flush(); buf.push(l.replace(/^\s*\d+[.\)]\s|^\s*[-*]\s/, '')); }
      else if (l.trim()) buf.push(l);
    });
    flush();
  }
  const noteKey = Object.keys(sections).find(k => /nota|descrip|sobre/.test(k));
  if (noteKey) r.blurb = sections[noteKey].join(' ').trim().slice(0, 240);
  if (!r.blurb && sections['intro']) {
    const intro = sections['intro'].filter(l => l.trim() && !/^#/.test(l)).join(' ').trim();
    if (intro) r.blurb = intro.slice(0, 240);
  }
  return r;
}

async function compressImage(file, maxDim = 800, quality = 0.78) {
  const dataURL = await new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(file); });
  const img = await new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.src = dataURL; });
  const ratio = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.round(img.width * ratio), h = Math.round(img.height * ratio);
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  c.getContext('2d').drawImage(img, 0, 0, w, h);
  return c.toDataURL('image/jpeg', quality);
}

window.SOBREMESA = { SEED_RECIPES, PANTRY_CATEGORIES, makeStore, parseRecipeMarkdown, compressImage, classifyIngredient };
})();
