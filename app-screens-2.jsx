// app-screens-2.jsx · recipe detail, cook mode, mine, shopping, create, import, settings
const { useState: u2State, useEffect: u2Effect, useRef: u2Ref, useMemo: u2Memo } = React;
const { SIcon, Photo, MatchBadge, Brand } = window.SCREENS_1;
const { PANTRY_CATEGORIES, parseRecipeMarkdown, compressImage, uploadPhoto, scaleQty, classifyIngredient } = window.SOBREMESA;

// ─── Recipe detail ───────────────────────────────────────────────────────────
function RecipeScreen({ recipe, pantry, onBack, onCook, onEdit, onAddToShopping, onDelete, onFlash }) {
  const [tab, setTab] = u2State('ing');
  const [scale, setScale] = u2State(1);
  const matchFor = () => {
    const t = recipe.ingredients?.length || 1;
    const h = (recipe.ingredients || []).filter(ing => pantry.some(p => ing.name.toLowerCase().includes(p.toLowerCase()))).length;
    return Math.round((h / t) * 100);
  };
  const missing = (recipe.ingredients || []).filter(ing => !pantry.some(p => ing.name.toLowerCase().includes(p.toLowerCase())));
  const shareRecipe = async () => {
    const lines = (recipe.ingredients || []).map(i => `• ${i.qty ? i.qty + ' ' : ''}${i.name}`).join('\n');
    const text = `${recipe.title}\n\n${recipe.blurb ? recipe.blurb + '\n\n' : ''}⏱ ${recipe.time}min · ${recipe.servings} pers.\n\nIngredientes:\n${lines}`;
    if (navigator.share) {
      try { await navigator.share({ title: recipe.title, text }); } catch {}
    } else {
      try { await navigator.clipboard.writeText(text); onFlash?.('¡receta copiada!'); } catch {}
    }
  };

  return (
    <div>
      <div style={{ position: 'sticky', top: 0, zIndex: 10, height: 0, pointerEvents: 'none' }}>
        <button type="button" onClick={onBack} style={{
          all: 'unset', cursor: 'pointer', pointerEvents: 'auto',
          position: 'absolute', top: 'max(12px, env(safe-area-inset-top, 12px))', left: 16,
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(251, 246, 238, 0.9)', backdropFilter: 'blur(10px)',
          boxShadow: '0 1px 6px rgba(0,0,0,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><SIcon name="arrow-l" size={16}/></button>
        {!recipe.isSeed && (
          <button type="button" onClick={onEdit} style={{
            all: 'unset', cursor: 'pointer', pointerEvents: 'auto',
            position: 'absolute', top: 'max(12px, env(safe-area-inset-top, 12px))', right: 16,
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(251, 246, 238, 0.9)', backdropFilter: 'blur(10px)',
            boxShadow: '0 1px 6px rgba(0,0,0,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><SIcon name="edit" size={14}/></button>
        )}
      </div>
      <Photo tone={recipe.tone} ratio="4 / 3" image={recipe.photo} label={recipe.title} style={{ width: '100%' }}/>

      <div style={{ padding: '20px 20px 32px' }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>{(recipe.tags || []).join(' · ') || ' '}</div>
        <h1 className="serif" style={{ fontSize: 30, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 12 }}>{recipe.title}</h1>
        {recipe.blurb && <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--soft)', marginBottom: 18, textWrap: 'pretty' }}>{recipe.blurb}</p>}

        <div style={{ display: 'flex', gap: 16, padding: '14px 0', borderTop: '1px solid var(--hair-2)', borderBottom: '1px solid var(--hair-2)', marginBottom: 18, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: 'var(--ink-2)' }}><SIcon name="clock" size={12} stroke="var(--soft)"/> {recipe.time} min</span>
          <span style={{ fontSize: 12, color: 'var(--ink-2)' }}><SIcon name="chef" size={12} stroke="var(--soft)"/> {recipe.difficulty}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <SIcon name="user" size={12} stroke="var(--soft)"/>
            <button type="button" onClick={() => setScale(s => Math.max(1, s - 1))} style={{ all: 'unset', cursor: 'pointer', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '1px solid var(--hair)', fontSize: 14, color: 'var(--soft)' }}>−</button>
            <span style={{ fontSize: 12, color: 'var(--ink-2)', minWidth: 48, textAlign: 'center' }}>{recipe.servings * scale} pers.</span>
            <button type="button" onClick={() => setScale(s => Math.min(10, s + 1))} style={{ all: 'unset', cursor: 'pointer', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '1px solid var(--hair)', fontSize: 14, color: 'var(--soft)' }}>+</button>
          </div>
          <div style={{ flex: 1 }}/>
          <MatchBadge match={matchFor()}/>
          <button type="button" onClick={shareRecipe} style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: '50%', border: '1px solid var(--hair)' }}>
            <SIcon name="upload" size={13} stroke="var(--soft)"/>
          </button>
        </div>

        <button type="button" className="btn lg terracotta full" onClick={onCook} style={{ marginBottom: 14 }}>
          <SIcon name="play" size={14} stroke="#fff"/> entrar en modo cocina
        </button>

        {missing.length > 0 && (
          <button type="button" onClick={() => onAddToShopping(missing)} className="btn sm ghost full" style={{ marginBottom: 20 }}>
            <SIcon name="cart" size={12}/> añadir {missing.length} ingredientes a la lista
          </button>
        )}

        <div style={{ display: 'flex', borderBottom: '1px solid var(--hair)', marginBottom: 16 }}>
          {[{ id: 'ing', label: `ingredientes · ${recipe.ingredients?.length || 0}` }, { id: 'step', label: `pasos · ${recipe.steps?.length || 0}` }].map(t => (
            <button key={t.id} type="button" onClick={() => setTab(t.id)} style={{
              all: 'unset', cursor: 'pointer', flex: 1, textAlign: 'center', padding: '10px 0',
              fontSize: 12.5, color: tab === t.id ? 'var(--ink)' : 'var(--mute)',
              borderBottom: tab === t.id ? '2px solid var(--ink)' : '2px solid transparent',
              marginBottom: -1,
            }}>{t.label}</button>
          ))}
        </div>

        {tab === 'ing' ? (
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {(recipe.ingredients || []).map((ing, i) => {
              const have = pantry.some(p => ing.name.toLowerCase().includes(p.toLowerCase()));
              return (
                <li key={i} style={{ display: 'flex', gap: 12, padding: '11px 0', borderBottom: '1px solid var(--hair-2)', fontSize: 14, alignItems: 'center' }}>
                  <span className="mono" style={{ width: 86, color: 'var(--soft)', fontSize: 11, flexShrink: 0 }}>{scaleQty(ing.qty, scale) || '—'}</span>
                  <span style={{ flex: 1 }}>{ing.name}{ing.note && <span style={{ color: 'var(--soft)' }}> · {ing.note}</span>}</span>
                  {have ? <SIcon name="check" size={13} stroke="var(--oliva)"/> : <SIcon name="cart" size={12} stroke="var(--terracotta)"/>}
                </li>
              );
            })}
          </ul>
        ) : (
          <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {(recipe.steps || []).map((st, i) => (
              <li key={i} style={{ display: 'flex', gap: 12 }}>
                <span className="step-num" style={{ width: 26, height: 26, fontSize: 12 }}>{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{st.title}</div>
                  <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--ink-2)', margin: 0 }}>{st.body}</p>
                  {st.timer && <div style={{ fontSize: 11, color: 'var(--terracotta)', marginTop: 6 }}><SIcon name="timer" size={10} stroke="var(--terracotta)"/> {st.timer} min</div>}
                </div>
              </li>
            ))}
          </ol>
        )}

        {!recipe.isSeed && onDelete && (
          <button type="button" onClick={onDelete} style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--terracotta)', fontSize: 12, marginTop: 32 }}>
            <SIcon name="trash" size={12} stroke="var(--terracotta)"/> eliminar receta
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Cook mode helpers ────────────────────────────────────────────────────────
function playAlarm() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const beep = (freq, start, dur) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine'; osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.6, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur + 0.05);
    };
    beep(880, 0, 0.25); beep(880, 0.3, 0.25); beep(1100, 0.6, 0.5);
  } catch {}
}
function vibrateAlarm() {
  try { navigator.vibrate?.([300, 100, 300, 100, 600]); } catch {}
}
function fireNotif(stepTitle) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
  try { new Notification('⏱ ¡Tiempo!', { body: stepTitle, icon: '/icons/icon-192.png', silent: false }); } catch {}
}

// ─── Cook mode ───────────────────────────────────────────────────────────────
function CookScreen({ recipe, onExit }) {
  const [step, setStep] = u2State(0);
  const total = recipe.steps?.length || 1;
  const cur = recipe.steps?.[step] || {};
  const [timer, setTimer] = u2State(cur.timer ? cur.timer * 60 : null);
  const [running, setRunning] = u2State(false);
  const hiddenAt = u2Ref(null);
  const wakeLock = u2Ref(null);

  // Mantener pantalla encendida mientras se cocina
  u2Effect(() => {
    const acquire = async () => {
      try {
        if ('wakeLock' in navigator) wakeLock.current = await navigator.wakeLock.request('screen');
      } catch {}
    };
    acquire();
    const onVis2 = () => { if (!document.hidden) acquire(); };
    document.addEventListener('visibilitychange', onVis2);
    return () => {
      wakeLock.current?.release().catch(() => {});
      document.removeEventListener('visibilitychange', onVis2);
    };
  }, []);

  // Pedir permiso de notificación al entrar en modo cocina
  u2Effect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  u2Effect(() => { setTimer(cur.timer ? cur.timer * 60 : null); setRunning(false); }, [step]);
  u2Effect(() => {
    if (!running || timer == null || timer === 0) return;
    const t = setInterval(() => setTimer(s => Math.max(0, (s || 0) - 1)), 1000);
    return () => clearInterval(t);
  }, [running, timer]);

  // Alarma cuando timer llega a 0
  u2Effect(() => {
    if (timer === 0 && running) {
      setRunning(false);
      playAlarm();
      vibrateAlarm();
      fireNotif(cur.title);
    }
  }, [timer]);

  u2Effect(() => {
    const onVis = () => {
      if (document.hidden) {
        hiddenAt.current = Date.now();
      } else if (hiddenAt.current && running) {
        const elapsed = Math.round((Date.now() - hiddenAt.current) / 1000);
        setTimer(s => s != null ? Math.max(0, s - elapsed) : s);
        hiddenAt.current = null;
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [running]);
  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  return (
    <div className="cook-screen safe-top">
      <header style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', gap: 10 }}>
        <button type="button" onClick={onExit} style={{ all: 'unset', cursor: 'pointer', width: 36, height: 36, borderRadius: '50%', background: 'rgba(244, 237, 228, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SIcon name="x" size={16} stroke="var(--cream)"/>
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div className="eyebrow" style={{ color: 'rgba(244, 237, 228, 0.5)' }}>cocinando</div>
          <div className="serif italic" style={{ fontSize: 13 }}>{recipe.title}</div>
        </div>
        <div style={{ fontSize: 11.5, color: 'rgba(244, 237, 228, 0.5)', fontVariantNumeric: 'tabular-nums', minWidth: 36, textAlign: 'right' }}>
          {step + 1} / {total}
        </div>
      </header>
      <div style={{ padding: '0 20px 20px', display: 'flex', gap: 4 }}>
        {(recipe.steps || []).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 3, background: i <= step ? 'var(--terracotta)' : 'rgba(244, 237, 228, 0.18)' }}/>
        ))}
      </div>
      <div style={{ flex: 1, padding: '12px 24px', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <div className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: 14 }}>
          paso {String(step + 1).padStart(2, '0')} · {String(total).padStart(2, '0')}
        </div>
        <h1 className="serif" style={{ fontSize: 36, lineHeight: 1.08, letterSpacing: '-0.02em', marginBottom: 18 }}>{cur.title}</h1>
        <p style={{ fontSize: 16.5, lineHeight: 1.55, color: 'rgba(244, 237, 228, 0.85)', textWrap: 'pretty', marginBottom: 24 }}>{cur.body}</p>
        {timer != null && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 'var(--r-2)',
            background: timer === 0 ? 'rgba(184,74,55,0.25)' : 'rgba(244, 237, 228, 0.06)',
            transition: 'background 0.4s',
          }}>
            {running && <span className="live-dot"/>}
            {timer === 0 && <span style={{ fontSize: 18 }}>🔔</span>}
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 28, fontVariantNumeric: 'tabular-nums',
              color: timer === 0 ? 'var(--terracotta)' : 'inherit',
            }}>{fmt(timer)}</div>
            <div style={{ flex: 1 }}/>
            <button type="button" onClick={() => {
              if (timer === 0) { setTimer(cur.timer ? cur.timer * 60 : null); }
              else { setRunning(r => !r); }
            }} style={{
              all: 'unset', cursor: 'pointer', width: 38, height: 38, borderRadius: '50%',
              background: 'var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <SIcon name={timer === 0 ? 'timer' : running ? 'pause' : 'play'} size={14} stroke="#fff"/>
            </button>
          </div>
        )}
      </div>
      <div style={{ padding: '16px 20px calc(20px + env(safe-area-inset-bottom, 0px))', display: 'flex', gap: 10 }}>
        <button type="button" disabled={step === 0} onClick={() => setStep(s => Math.max(0, s - 1))} style={{
          flex: '0 0 auto', padding: '0 18px', height: 50,
          border: '1px solid rgba(244, 237, 228, 0.18)', background: 'transparent',
          color: 'var(--cream)', fontSize: 13.5, borderRadius: 'var(--r-1)', cursor: 'pointer',
          opacity: step === 0 ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><SIcon name="arrow-l" size={14} stroke="var(--cream)"/></button>
        <button type="button" onClick={() => step === total - 1 ? onExit() : setStep(s => s + 1)} style={{
          flex: 1, height: 50, background: 'var(--terracotta)', color: '#fff', border: 'none',
          fontSize: 14, fontWeight: 500, borderRadius: 'var(--r-1)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          {step === total - 1 ? '¡listo!' : 'siguiente paso'}
          {step < total - 1 && <SIcon name="arrow-r" size={14} stroke="#fff"/>}
        </button>
      </div>
    </div>
  );
}

// ─── Mine (mi recetario) ─────────────────────────────────────────────────────
function MineScreen({ recipes, onOpenRecipe, onNew, onImport }) {
  const [filter, setFilter] = u2State('todas');
  const list = u2Memo(() => {
    if (filter === 'mías') return recipes.filter(r => !r.isSeed);
    if (filter === 'guardadas') return recipes.filter(r => r.isSeed);
    return recipes;
  }, [filter, recipes]);

  return (
    <div style={{ padding: '20px 20px 24px' }}>
      <div style={{ marginBottom: 16 }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>mi recetario</div>
        <h1 className="serif" style={{ fontSize: 30, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
          <span className="italic">tus</span> recetas
        </h1>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        <button type="button" className="btn sm ghost" style={{ flex: 1 }} onClick={onImport}><SIcon name="upload" size={11}/> importar</button>
        <button type="button" className="btn sm" style={{ flex: 1 }} onClick={onNew}><SIcon name="plus" size={11} stroke="#fff"/> nueva</button>
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 18, overflow: 'auto', marginLeft: -20, marginRight: -20, padding: '0 20px' }}>
        {['todas', 'guardadas', 'mías'].map(t => (
          <span key={t} className={`chip ${filter === t ? 'on' : ''}`} onClick={() => setFilter(t)}>{t}</span>
        ))}
      </div>
      {list.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--mute)' }}>
          <p style={{ fontSize: 13.5, lineHeight: 1.6, textWrap: 'pretty' }}>
            Aún no tienes recetas en este filtro. Crea una nueva o importa un archivo .md.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {list.map(r => (
            <button key={r.id} type="button" onClick={() => onOpenRecipe(r)} style={{ all: 'unset', cursor: 'pointer' }}>
              <div style={{ borderRadius: 'var(--r-1)', overflow: 'hidden', marginBottom: 8 }}>
                <Photo tone={r.tone} image={r.photo} label={r.title} ratio="1 / 1"/>
              </div>
              <div className="serif" style={{ fontSize: 14, lineHeight: 1.2, marginBottom: 3 }}>{r.title}</div>
              <div style={{ fontSize: 10.5, color: 'var(--soft)' }}><SIcon name="clock" size={10}/> {r.time}m · {r.difficulty}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Shopping list ───────────────────────────────────────────────────────────
function ShoppingScreen({ shopping, setShopping }) {
  const [adding, setAdding] = u2State('');
  const grouped = u2Memo(() => {
    const g = {};
    shopping.forEach(it => { (g[it.cat] = g[it.cat] || []).push(it); });
    return g;
  }, [shopping]);

  const toggle = (id) => setShopping(shopping.map(it => it.id === id ? { ...it, done: !it.done } : it));
  const del = (id) => setShopping(shopping.filter(it => it.id !== id));
  const add = (name) => {
    if (!name.trim()) return;
    setShopping([{ id: 'i-' + Date.now(), name: name.trim(), cat: classifyIngredient(name), done: false }, ...shopping]);
    setAdding('');
  };
  const clearDone = () => setShopping(shopping.filter(it => !it.done));
  const doneCount = shopping.filter(it => it.done).length;

  return (
    <div style={{ padding: '20px 20px 24px' }}>
      <div style={{ marginBottom: 16 }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>lista de la compra</div>
        <h1 className="serif" style={{ fontSize: 28, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
          al <span className="italic">súper</span>
        </h1>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); add(adding); }} style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input className="input" placeholder="añadir a la lista…" value={adding} onChange={e => setAdding(e.target.value)}/>
        <button type="submit" className="btn"><SIcon name="plus" size={14} stroke="#fff"/></button>
      </form>

      {shopping.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--mute)' }}>
          <SIcon name="cart" size={28} stroke="var(--mute)"/>
          <p style={{ fontSize: 13.5, marginTop: 12, lineHeight: 1.6, textWrap: 'pretty' }}>
            Tu lista está vacía. Añade ingredientes a mano o desde una receta.
          </p>
        </div>
      )}

      {Object.keys(grouped).map(cat => (
        <div key={cat} style={{ marginBottom: 20 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>{cat}</div>
          {grouped[cat].map(it => (
            <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid var(--hair-2)' }}>
              <button type="button" onClick={() => toggle(it.id)} style={{
                all: 'unset', cursor: 'pointer', width: 22, height: 22, borderRadius: '50%',
                border: '1.5px solid ' + (it.done ? 'var(--oliva)' : 'var(--hair)'),
                background: it.done ? 'var(--oliva)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{it.done && <SIcon name="check" size={12} stroke="#fff"/>}</button>
              <span style={{ flex: 1, fontSize: 14, color: it.done ? 'var(--mute)' : 'var(--ink)', textDecoration: it.done ? 'line-through' : 'none' }}>
                {it.name}
              </span>
              <button type="button" onClick={() => del(it.id)} style={{ all: 'unset', cursor: 'pointer', color: 'var(--mute)', padding: 4 }}>
                <SIcon name="x" size={13}/>
              </button>
            </div>
          ))}
        </div>
      ))}

      {doneCount > 0 && (
        <button type="button" onClick={clearDone} className="btn sm ghost full" style={{ marginTop: 12 }}>
          quitar {doneCount} marcadas
        </button>
      )}
    </div>
  );
}

// ─── Create / edit recipe ────────────────────────────────────────────────────
function EditScreen({ initial, onSave, onCancel, onUploadPhoto }) {
  const [r, setR] = u2State(initial || {
    id: 'r-' + Date.now() + '-' + Math.random().toString(36).slice(2,6),
    title: '', tone: 'warm', servings: 4, time: 30, difficulty: 'fácil', tags: [], ingredients: [{qty:'', name:''}], steps: [{title:'', body:'', timer: null}], blurb: '', photo: null,
  });
  const [uploading, setUploading] = u2State(false);
  const setF = (k, v) => setR(x => ({ ...x, [k]: v }));
  const onPhoto = async (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    setUploading(true);
    try {
      const url = onUploadPhoto ? await onUploadPhoto(f) : await compressImage(f);
      setF('photo', url);
    } finally { setUploading(false); }
  };
  const updIng = (i, k, v) => setF('ingredients', r.ingredients.map((x, j) => j === i ? { ...x, [k]: v } : x));
  const addIng = () => setF('ingredients', [...r.ingredients, { qty: '', name: '' }]);
  const delIng = (i) => setF('ingredients', r.ingredients.filter((_, j) => j !== i));
  const updStep = (i, k, v) => setF('steps', r.steps.map((x, j) => j === i ? { ...x, [k]: v } : x));
  const addStep = () => setF('steps', [...r.steps, { title: '', body: '', timer: null }]);
  const delStep = (i) => setF('steps', r.steps.filter((_, j) => j !== i));

  return (
    <div style={{ padding: '0 0 32px' }}>
      <header style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', gap: 10, position: 'sticky', top: 0, background: 'var(--cream)', zIndex: 2, borderBottom: '1px solid var(--hair)' }}>
        <button type="button" onClick={onCancel} style={{ all: 'unset', cursor: 'pointer' }}><SIcon name="x" size={18}/></button>
        <div style={{ flex: 1, textAlign: 'center' }} className="serif italic">{initial ? 'editar receta' : 'nueva receta'}</div>
        <button type="button" onClick={() => onSave({ ...r, ingredients: r.ingredients.filter(i => i.name.trim()), steps: r.steps.filter(s => s.title.trim() || s.body.trim()) })} disabled={!r.title.trim()} className="btn sm">guardar</button>
      </header>
      <div style={{ padding: 20 }}>
        <label className="label">foto</label>
        <label style={{ display: 'block', marginBottom: 16, cursor: 'pointer' }}>
          {uploading ? (
            <div className={`photo t-${r.tone}`} style={{ borderRadius: 'var(--r-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="spinner"/>
            </div>
          ) : r.photo ? (
            <div style={{ position: 'relative', borderRadius: 'var(--r-2)', overflow: 'hidden', aspectRatio: '4 / 3' }}>
              <img src={r.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              <span style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
                <SIcon name="camera" size={16} stroke="#fff"/> cambiar
              </span>
            </div>
          ) : (
            <div className={`photo t-${r.tone}`} style={{ borderRadius: 'var(--r-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6, color: 'var(--soft)' }}>
              <SIcon name="camera" size={20} stroke="var(--soft)"/>
              <span style={{ fontSize: 12 }}>añadir foto inicial</span>
            </div>
          )}
          <input type="file" accept="image/*" capture="environment" onChange={onPhoto} style={{ display: 'none' }}/>
        </label>

        <label className="label">título</label>
        <input className="input" value={r.title} onChange={e => setF('title', e.target.value)} placeholder="ej. Tortilla de patata jugosa" style={{ marginBottom: 14 }}/>

        <label className="label">descripción breve</label>
        <textarea className="textarea" value={r.blurb} onChange={e => setF('blurb', e.target.value)} placeholder="qué tiene de especial…" style={{ marginBottom: 14, minHeight: 70 }}/>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
          <div><label className="label">tiempo (min)</label><input className="input" type="number" value={r.time} onChange={e => setF('time', parseInt(e.target.value) || 0)}/></div>
          <div><label className="label">raciones</label><input className="input" type="number" value={r.servings} onChange={e => setF('servings', parseInt(e.target.value) || 1)}/></div>
          <div><label className="label">dificultad</label>
            <select className="input" value={r.difficulty} onChange={e => setF('difficulty', e.target.value)}>
              <option>fácil</option><option>media</option><option>avanzada</option><option>rápido</option>
            </select>
          </div>
        </div>

        <label className="label">etiquetas (separadas por coma)</label>
        <input className="input" value={(r.tags || []).join(', ')} onChange={e => setF('tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder="pasta, 15min, vegano" style={{ marginBottom: 24 }}/>

        <div className="eyebrow" style={{ marginBottom: 10 }}>ingredientes</div>
        {r.ingredients.map((ing, i) => (
          <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            <input className="input" placeholder="cant." value={ing.qty} onChange={e => updIng(i, 'qty', e.target.value)} style={{ flex: '0 0 80px', fontFamily: 'var(--mono)', fontSize: 12 }}/>
            <input className="input" placeholder="ingrediente" value={ing.name} onChange={e => updIng(i, 'name', e.target.value)} style={{ flex: 1 }}/>
            <button type="button" onClick={() => delIng(i)} className="btn sm ghost" style={{ flexShrink: 0 }}><SIcon name="minus" size={12}/></button>
          </div>
        ))}
        <button type="button" onClick={addIng} className="btn sm ghost full" style={{ marginBottom: 24 }}><SIcon name="plus" size={12}/> añadir ingrediente</button>

        <div className="eyebrow" style={{ marginBottom: 10 }}>pasos</div>
        {r.steps.map((st, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <span className="step-num" style={{ marginTop: 6 }}>{i + 1}</span>
            <div style={{ flex: 1 }}>
              <input className="input" placeholder="título del paso" value={st.title} onChange={e => updStep(i, 'title', e.target.value)} style={{ marginBottom: 6 }}/>
              <textarea className="textarea" placeholder="descripción…" value={st.body} onChange={e => updStep(i, 'body', e.target.value)} style={{ marginBottom: 6, minHeight: 60 }}/>
              <input className="input" placeholder="timer en min (opcional)" type="number" value={st.timer || ''} onChange={e => updStep(i, 'timer', parseInt(e.target.value) || null)} style={{ fontSize: 12 }}/>
            </div>
            <button type="button" onClick={() => delStep(i)} className="btn sm ghost" style={{ flexShrink: 0, alignSelf: 'flex-start', marginTop: 6 }}><SIcon name="minus" size={12}/></button>
          </div>
        ))}
        <button type="button" onClick={addStep} className="btn sm ghost full"><SIcon name="plus" size={12}/> añadir paso</button>
      </div>
    </div>
  );
}

// ─── Import recipe ───────────────────────────────────────────────────────────
function ImportScreen({ onParsed, onCancel, onUploadPhoto }) {
  const [text, setText] = u2State('');
  const [photo, setPhoto] = u2State(null);
  const sample = `---
title: Mi receta
servings: 4
time: 30
difficulty: fácil
tags: ejemplo
---

# Ingredientes
- 2 cebollas
- 3 huevos
- aceite de oliva

# Pasos
1. Pocha la cebolla. ⏱ 15
2. Bate los huevos.
3. Mezcla y cuaja.

# Notas
una descripción breve aquí.`;
  const onFile = async (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    if (f.type.startsWith('image/')) {
      const url = onUploadPhoto ? await onUploadPhoto(f) : await compressImage(f);
      setPhoto(url);
      return;
    }
    const txt = await f.text();
    setText(txt);
  };
  const parsed = text.trim() ? parseRecipeMarkdown(text) : null;

  return (
    <div>
      <header style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', gap: 10, position: 'sticky', top: 0, background: 'var(--cream)', zIndex: 2, borderBottom: '1px solid var(--hair)' }}>
        <button type="button" onClick={onCancel} style={{ all: 'unset', cursor: 'pointer' }}><SIcon name="x" size={18}/></button>
        <div style={{ flex: 1, textAlign: 'center' }} className="serif italic">importar receta</div>
        <button type="button" onClick={() => parsed && onParsed({ ...parsed, photo })} disabled={!parsed?.title} className="btn sm">guardar</button>
      </header>
      <div style={{ padding: 20 }}>
        <p style={{ fontSize: 13, color: 'var(--soft)', lineHeight: 1.55, marginBottom: 16, textWrap: 'pretty' }}>
          Pega tu receta como markdown o sube un archivo .md. Acepta frontmatter al inicio y secciones <span className="mono" style={{ fontSize: 11 }}># Ingredientes</span> · <span className="mono" style={{ fontSize: 11 }}># Pasos</span> · <span className="mono" style={{ fontSize: 11 }}># Notas</span>.
        </p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <label className="btn sm ghost" style={{ flex: 1, cursor: 'pointer' }}>
            <SIcon name="upload" size={12}/> archivo .md
            <input type="file" accept=".md,.txt,text/*" onChange={onFile} style={{ display: 'none' }}/>
          </label>
          <label className="btn sm ghost" style={{ flex: 1, cursor: 'pointer' }}>
            <SIcon name="camera" size={12}/> {photo ? 'cambiar foto' : 'añadir foto'}
            <input type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }}/>
          </label>
        </div>
        {photo && (
          <div style={{ marginBottom: 14, borderRadius: 'var(--r-2)', overflow: 'hidden', aspectRatio: '16/9' }}>
            <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
          </div>
        )}
        <button type="button" onClick={() => setText(sample)} className="btn sm ghost full" style={{ marginBottom: 12, fontSize: 11.5 }}>
          <SIcon name="sparkle" size={11}/> insertar plantilla de ejemplo
        </button>
        <textarea className="textarea" value={text} onChange={e => setText(e.target.value)} placeholder={`---\ntitle: ...\n---\n\n# Ingredientes\n- ...`} style={{ minHeight: 280, fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.5 }}/>

        {parsed && parsed.title && (
          <div className="card" style={{ marginTop: 16, padding: 14 }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>vista previa</div>
            <div className="serif" style={{ fontSize: 18, marginBottom: 6 }}>{parsed.title}</div>
            <div style={{ fontSize: 11.5, color: 'var(--soft)' }}>
              {parsed.ingredients.length} ingredientes · {parsed.steps.length} pasos · {parsed.time}m · {parsed.difficulty}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Settings ────────────────────────────────────────────────────────────────
function SettingsScreen({ user, onLogout, onBack, recipes, isGuest, onSignIn, darkMode, toggleDark }) {
  const exportAll = () => {
    const data = JSON.stringify(recipes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `sobremesa-recetas-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div>
      <header style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', gap: 10, borderBottom: '1px solid var(--hair)' }}>
        <button type="button" onClick={onBack} style={{ all: 'unset', cursor: 'pointer' }}><SIcon name="arrow-l" size={18}/></button>
        <div style={{ flex: 1, textAlign: 'center' }} className="serif italic">ajustes</div>
        <div style={{ width: 18 }}/>
      </header>
      <div style={{ padding: 24 }}>
        <div className="card" style={{ padding: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--ink)', color: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {user?.photoURL ? <img src={user.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}/> : <SIcon name="user" size={20} stroke="var(--cream)"/>}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {isGuest ? (
              <>
                <div className="serif" style={{ fontSize: 16, marginBottom: 2 }}>modo invitado</div>
                <div style={{ fontSize: 11.5, color: 'var(--soft)' }}>tus recetas viven en este dispositivo</div>
              </>
            ) : (
              <>
                <div className="serif" style={{ fontSize: 16, marginBottom: 2 }}>{user?.displayName || 'usuario'}</div>
                <div style={{ fontSize: 11.5, color: 'var(--soft)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
              </>
            )}
          </div>
        </div>

        {isGuest && (
          <button type="button" onClick={onSignIn} className="btn lg full" style={{ marginBottom: 12, background: '#fff', color: '#1a1a1a', border: '1px solid var(--hair)' }}>
            entrar con Google
          </button>
        )}

        <div className="eyebrow" style={{ marginTop: 24, marginBottom: 8 }}>apariencia</div>
        <div style={{ display: 'flex', alignItems: 'center', height: 48, gap: 12, padding: '0 2px', marginBottom: 8 }}>
          <SIcon name="sparkle" size={14} stroke="var(--soft)"/>
          <span style={{ flex: 1, fontSize: 14 }}>modo oscuro</span>
          <button type="button" onClick={toggleDark} style={{
            all: 'unset', cursor: 'pointer', width: 44, height: 26, borderRadius: 999,
            background: darkMode ? 'var(--terracotta)' : 'var(--hair)',
            position: 'relative', transition: 'background 200ms',
          }}>
            <span style={{
              position: 'absolute', top: 3, left: darkMode ? 21 : 3,
              width: 20, height: 20, borderRadius: '50%', background: '#fff',
              transition: 'left 200ms', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }}/>
          </button>
        </div>

        <div className="eyebrow" style={{ marginTop: 24, marginBottom: 8 }}>tus datos</div>
        <button type="button" onClick={exportAll} className="btn full ghost" style={{ marginBottom: 8, justifyContent: 'flex-start', height: 48 }}>
          <SIcon name="download" size={14}/> exportar todas las recetas (.json)
        </button>

        {!isGuest && (
          <>
            <div className="eyebrow" style={{ marginTop: 24, marginBottom: 8 }}>cuenta</div>
            <button type="button" onClick={onLogout} className="btn full ghost" style={{ justifyContent: 'flex-start', height: 48, color: 'var(--terracotta)' }}>
              <SIcon name="log-out" size={14} stroke="var(--terracotta)"/> cerrar sesión
            </button>
          </>
        )}
        <p style={{ fontSize: 11, color: 'var(--mute)', textAlign: 'center', marginTop: 36, lineHeight: 1.6, textWrap: 'pretty' }}>
          Sobremesa · v1.0<br/>
          tus recetas se guardan {isGuest ? 'localmente en tu navegador' : 'cifradas en tu cuenta'}.
        </p>
      </div>
    </div>
  );
}

window.SCREENS_2 = { RecipeScreen, CookScreen, MineScreen, ShoppingScreen, EditScreen, ImportScreen, SettingsScreen };
