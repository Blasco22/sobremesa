// app.jsx · main React app — all screens
const { useState, useEffect, useRef, useMemo, useCallback } = React;
const { SEED_RECIPES, PANTRY_CATEGORIES, makeStore, parseRecipeMarkdown, compressImage, classifyIngredient } = window.SOBREMESA;

// ─── Icon component ──────────────────────────────────────────────────────────
const SIcon = ({ name, size = 16, stroke = 'currentColor' }) => {
  const s = { width: size, height: size, fill: 'none', stroke, strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 };
  const p = {
    home: <><path d="M3 11l9-8 9 8"/><path d="M5 9v11h14V9"/></>,
    pantry: <><rect x="3" y="6" width="18" height="14" rx="1.5"/><path d="M3 11h18M9 6V3h6v3"/></>,
    book: <><path d="M5 4h13a1 1 0 011 1v15H6a2 2 0 01-2-2V5a1 1 0 011-1z"/><path d="M5 4v14"/></>,
    cart: <><circle cx="9" cy="20" r="1"/><circle cx="17" cy="20" r="1"/><path d="M3 4h2l3 12h11l2-8H6"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    search: <><circle cx="11" cy="11" r="7"/><path d="M16 16l4 4"/></>,
    'arrow-l': <path d="M14 6l-6 6 6 6"/>,
    'arrow-r': <path d="M10 6l6 6-6 6"/>,
    x: <path d="M6 6l12 12M18 6L6 18"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    chef: <path d="M6 14a4 4 0 113-7 4 4 0 016 0 4 4 0 113 7v5H6v-5z"/>,
    play: <path d="M7 5v14l11-7z" fill={stroke}/>,
    pause: <><rect x="7" y="5" width="3" height="14" fill={stroke}/><rect x="14" y="5" width="3" height="14" fill={stroke}/></>,
    timer: <><circle cx="12" cy="13" r="7"/><path d="M12 9v4l2 2M9 3h6"/></>,
    upload: <><path d="M12 16V4M7 9l5-5 5 5"/><path d="M5 19h14"/></>,
    download: <><path d="M12 4v12M7 11l5 5 5-5"/><path d="M5 20h14"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 00-.1-1l2-1.5-2-3.5-2.4 1A7 7 0 0014 5.6L13.5 3h-3L10 5.6a7 7 0 00-2.5 1.4l-2.4-1-2 3.5L5.1 11a7 7 0 000 2l-2 1.5 2 3.5 2.4-1a7 7 0 002.5 1.4l.5 2.6h3l.5-2.6a7 7 0 002.5-1.4l2.4 1 2-3.5-2-1.5z"/></>,
    edit: <><path d="M4 20h4l11-11-4-4L4 16v4z"/><path d="M14 6l4 4"/></>,
    trash: <><path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13"/></>,
    check: <path d="M5 12l5 5 9-11"/>,
    camera: <><rect x="3" y="6" width="18" height="14" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M9 6l1.5-2h3L15 6"/></>,
    minus: <path d="M5 12h14"/>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></>,
    'log-out': <><path d="M14 4h5v16h-5"/><path d="M10 8l-4 4 4 4M6 12h12"/></>,
    'arrow-up': <path d="M5 12l7-7 7 7M12 5v14"/>,
    sparkle: <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/>,
  };
  return <svg viewBox="0 0 24 24" style={s}>{p[name]}</svg>;
};

const Photo = ({ tone = 'warm', label, image, ratio = '4 / 3', style = {} }) => (
  <div className={`photo t-${tone}`} style={{ aspectRatio: ratio, ...style }}>
    {image && <img src={image} alt=""/>}
    {!image && label && <span className="label">{label}</span>}
  </div>
);
const MatchBadge = ({ match }) => {
  const cls = match >= 80 ? 'high' : match >= 50 ? 'med' : 'low';
  return <span className={`match ${cls}`}><span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }}/> {match}%</span>;
};
const Brand = ({ size = 22 }) => (
  <span style={{ fontFamily: 'var(--serif)', fontSize: size, lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
    Sobremesa<span style={{ color: 'var(--terracotta)' }}>.</span>
  </span>
);

// ─── Auth screen ─────────────────────────────────────────────────────────────
function AuthScreen({ onGuest, onSignIn, busy }) {
  return (
    <div className="auth-screen safe-top">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '40px 0' }}>
        <Brand size={36}/>
        <p className="serif italic" style={{ fontSize: 22, color: 'var(--soft)', marginTop: 14, lineHeight: 1.4, maxWidth: 280, textWrap: 'pretty' }}>
          tu cocina,<br/>sin prisa.
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button type="button" onClick={onSignIn} disabled={busy} className="btn lg full" style={{ background: '#fff', color: '#1a1a1a', border: '1px solid var(--hair)', boxShadow: '0 1px 0 rgba(0,0,0,0.04)' }}>
          {busy ? <span className="spinner"/> : <SIcon name="user" size={16} stroke="#4285F4"/>}
          continuar con Google
        </button>
        <button type="button" onClick={onGuest} disabled={busy} className="btn lg full ghost">
          probar sin cuenta
        </button>
        <p style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--mute)', marginTop: 16, lineHeight: 1.5, textWrap: 'pretty' }}>
          Tus recetas se guardan en tu cuenta. Sin cuenta se guardan solo en este dispositivo.
        </p>
      </div>
    </div>
  );
}

// ─── Home screen ─────────────────────────────────────────────────────────────
function HomeScreen({ recipes, pantryCount, onOpenRecipe, onTab, greet }) {
  const featured = recipes[0];
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    if (!q.trim()) return recipes;
    const s = q.toLowerCase();
    return recipes.filter(r => r.title.toLowerCase().includes(s) || r.tags?.some(t => t.toLowerCase().includes(s)) || r.ingredients?.some(i => i.name.toLowerCase().includes(s)));
  }, [q, recipes]);
  return (
    <div style={{ padding: '8px 20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, paddingTop: 8 }}>
        <Brand size={20}/>
        <div style={{ flex: 1 }}/>
      </div>
      <div style={{ marginBottom: 20 }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>{greet} ·</div>
        <h1 className="serif" style={{ fontSize: 32, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
          ¿qué te apetece <span className="italic">cocinar</span>?
        </h1>
      </div>

      <div style={{ position: 'relative', marginBottom: 20 }}>
        <input className="input" placeholder="buscar receta o ingrediente…" value={q} onChange={(e) => setQ(e.target.value)} style={{ paddingLeft: 38 }}/>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><SIcon name="search" size={15} stroke="var(--mute)"/></span>
      </div>

      <button type="button" onClick={() => onTab('pantry')} style={{
        all: 'unset', cursor: 'pointer', display: 'block', width: '100%',
        padding: '14px 16px', background: 'var(--ink)', color: 'var(--cream)',
        borderRadius: 'var(--r-2)', marginBottom: 24, boxSizing: 'border-box',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <SIcon name="pantry" size={20} stroke="var(--terracotta)"/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, marginBottom: 1 }}>cocina con lo que tienes</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>{pantryCount} ingredientes en tu despensa</div>
          </div>
          <SIcon name="arrow-r" size={14} stroke="rgba(244, 237, 228, 0.6)"/>
        </div>
      </button>

      {!q && featured && (
        <button type="button" onClick={() => onOpenRecipe(featured)} style={{ all: 'unset', cursor: 'pointer', display: 'block', width: '100%', marginBottom: 28, boxSizing: 'border-box' }}>
          <div className="eyebrow" style={{ marginBottom: 8, color: 'var(--terracotta)' }}>destacada</div>
          <Photo tone={featured.tone} ratio="4 / 3" image={featured.photo} label={featured.title} style={{ borderRadius: 'var(--r-2)', marginBottom: 12 }}/>
          <h3 className="serif" style={{ fontSize: 22, lineHeight: 1.15, marginBottom: 6 }}>{featured.title}</h3>
          <div style={{ fontSize: 11.5, color: 'var(--soft)', display: 'flex', gap: 12 }}>
            <span><SIcon name="clock" size={11}/> {featured.time}m</span>
            <span><SIcon name="chef" size={11}/> {featured.difficulty}</span>
            <span>· {featured.servings} pers.</span>
          </div>
        </button>
      )}

      <div className="eyebrow" style={{ marginBottom: 12 }}>{q ? `${filtered.length} resultados` : 'todas las recetas'}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {(q ? filtered : recipes.slice(featured && !q ? 1 : 0)).map(r => (
          <button key={r.id} type="button" onClick={() => onOpenRecipe(r)} style={{
            all: 'unset', cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'center',
          }}>
            <div style={{ width: 88, height: 88, flexShrink: 0, borderRadius: 'var(--r-1)', overflow: 'hidden' }}>
              <Photo tone={r.tone} image={r.photo} label={r.title} style={{ width: '100%', height: '100%', aspectRatio: 'auto', padding: 0 }}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="eyebrow" style={{ marginBottom: 2 }}>{(r.tags||[])[0] || ''}</div>
              <div className="serif" style={{ fontSize: 16, lineHeight: 1.2, marginBottom: 4 }}>{r.title}</div>
              <div style={{ fontSize: 11, color: 'var(--soft)', display: 'flex', gap: 10 }}>
                <span><SIcon name="clock" size={10}/> {r.time}m</span>
                <span>{r.difficulty}</span>
              </div>
            </div>
          </button>
        ))}
        {filtered.length === 0 && q && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--mute)', fontSize: 13 }}>
            sin resultados para "{q}"
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Pantry screen ───────────────────────────────────────────────────────────
function PantryScreen({ recipes, pantry, setPantry, onOpenRecipe }) {
  const [adding, setAdding] = useState('');
  const matchFor = (r) => {
    const total = r.ingredients?.length || 1;
    const have = (r.ingredients || []).filter(ing => pantry.some(p => ing.name.toLowerCase().includes(p.toLowerCase()))).length;
    return Math.round((have / total) * 100);
  };
  const ranked = useMemo(() => recipes.map(r => ({ r, match: matchFor(r) })).sort((a,b) => b.match - a.match), [recipes, pantry]);
  const toggle = (i) => setPantry(pantry.includes(i) ? pantry.filter(x => x !== i) : [...pantry, i]);

  return (
    <div style={{ padding: '20px 20px 24px' }}>
      <div style={{ marginBottom: 18 }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>despensa</div>
        <h1 className="serif" style={{ fontSize: 28, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
          ¿qué tienes <span className="italic">a mano</span>?
        </h1>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>en tu despensa · {pantry.length}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {pantry.map(p => (
            <span key={p} className="chip on" onClick={() => toggle(p)}>
              {p} <span className="x">×</span>
            </span>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if (adding.trim()) { toggle(adding.trim().toLowerCase()); setAdding(''); } }} style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          <input className="input" placeholder="añadir ingrediente…" value={adding} onChange={(e) => setAdding(e.target.value)} style={{ height: 36, padding: '0 12px', fontSize: 13 }}/>
          <button type="submit" className="btn sm" style={{ flexShrink: 0 }}><SIcon name="plus" size={12} stroke="#fff"/></button>
        </form>
      </div>

      {PANTRY_CATEGORIES.map(cat => (
        <div key={cat.id} style={{ marginBottom: 16 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>{cat.label}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {cat.items.map(it => (
              <span key={it} className={`chip ${pantry.includes(it) ? 'on' : ''}`} onClick={() => toggle(it)}>
                {pantry.includes(it) && <span className="dot"/>} {it}
              </span>
            ))}
          </div>
        </div>
      ))}

      <div style={{ height: 1, background: 'var(--hair)', margin: '24px 0' }}/>
      <div className="eyebrow" style={{ marginBottom: 12 }}>{ranked.length} recetas posibles</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {ranked.slice(0, 12).map(({ r, match }) => (
          <button key={r.id} type="button" onClick={() => onOpenRecipe(r)} style={{
            all: 'unset', cursor: 'pointer', display: 'flex', gap: 12, padding: 10,
            background: 'var(--paper)', borderRadius: 'var(--r-2)', border: '1px solid var(--hair)',
          }}>
            <div style={{ width: 72, height: 72, flexShrink: 0, borderRadius: 'var(--r-1)', overflow: 'hidden' }}>
              <Photo tone={r.tone} image={r.photo} label={r.title} style={{ width: '100%', height: '100%', aspectRatio: 'auto', padding: 0 }}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ marginBottom: 4 }}><MatchBadge match={match}/></div>
              <div className="serif" style={{ fontSize: 15, lineHeight: 1.2, marginBottom: 3 }}>{r.title}</div>
              <div style={{ fontSize: 10.5, color: 'var(--soft)' }}><SIcon name="clock" size={10}/> {r.time}m · {r.difficulty}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

window.SCREENS_1 = { SIcon, Photo, MatchBadge, Brand, AuthScreen, HomeScreen, PantryScreen };
