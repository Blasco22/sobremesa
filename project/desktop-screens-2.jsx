// Sobremesa · Cook mode + Mine + Create + Import (desktop)

// ────────────────────────────── Cook mode (pantalla completa)
function SCookMode({ recipe, step, setStep, setScreen }) {
  const total = recipe.steps.length;
  const cur = recipe.steps[step] || recipe.steps[0];
  const [timer, setTimer] = React.useState(null); // seconds
  const [running, setRunning] = React.useState(false);

  React.useEffect(() => {
    setTimer(cur.timer ? cur.timer * 60 : null);
    setRunning(false);
  }, [step, recipe.id]);

  React.useEffect(() => {
    if (!running || timer == null) return;
    const t = setInterval(() => setTimer(s => Math.max(0, (s || 0) - 1)), 1000);
    return () => clearInterval(t);
  }, [running, timer]);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'var(--ink)', color: 'var(--cream)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top bar */}
      <header style={{ display: 'flex', alignItems: 'center', padding: '20px 36px', gap: 16 }}>
        <button type="button" onClick={() => setScreen('recipe')} style={{
          all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 12.5, color: 'rgba(244, 237, 228, 0.6)',
        }}>
          <SIcon name="x" size={14} /> salir del modo cocina
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div className="s-eyebrow" style={{ color: 'rgba(244, 237, 228, 0.5)' }}>cocinando</div>
          <div className="s-serif s-italic" style={{ fontSize: 18, color: 'var(--cream)' }}>{recipe.title}</div>
        </div>
        <div style={{ fontSize: 12.5, color: 'rgba(244, 237, 228, 0.6)', fontVariantNumeric: 'tabular-nums' }}>
          paso {step + 1} <span style={{ opacity: 0.5 }}>/ {total}</span>
        </div>
      </header>

      {/* Step strip (top progress) */}
      <div style={{ padding: '0 36px 20px', display: 'flex', gap: 6 }}>
        {recipe.steps.map((_, i) => (
          <button key={i} type="button" onClick={() => setStep(i)} style={{
            all: 'unset', cursor: 'pointer',
            flex: 1, height: 3,
            background: i <= step ? 'var(--terracotta)' : 'rgba(244, 237, 228, 0.18)',
          }} />
        ))}
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '6fr 5fr', gap: 0, overflow: 'hidden' }}>
        <div style={{ padding: '40px 56px', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div className="s-eyebrow" style={{ color: 'var(--terracotta)', marginBottom: 18 }}>
            paso {String(step + 1).padStart(2, '0')} de {String(total).padStart(2, '0')}
          </div>
          <h1 className="s-serif" style={{ fontSize: 56, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 28 }}>
            {cur.title}
          </h1>
          <p style={{ fontSize: 22, lineHeight: 1.5, color: 'rgba(244, 237, 228, 0.85)', textWrap: 'pretty', marginBottom: 32, maxWidth: 540 }}>
            {cur.body}
          </p>

          {timer != null && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 16,
              padding: '14px 18px',
              background: 'rgba(244, 237, 228, 0.08)',
              borderRadius: 'var(--r-2)',
              alignSelf: 'flex-start',
            }}>
              {running && <span className="s-live-dot" />}
              <div style={{ fontFamily: 'var(--mono)', fontSize: 32, fontWeight: 400, fontVariantNumeric: 'tabular-nums', color: 'var(--cream)' }}>
                {fmt(timer)}
              </div>
              <button type="button" onClick={() => setRunning(r => !r)} style={{
                all: 'unset', cursor: 'pointer',
                width: 36, height: 36, borderRadius: '50%',
                background: 'var(--terracotta)', color: '#fff',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <SIcon name={running ? 'pause' : 'play'} size={14} stroke="#fff" />
              </button>
            </div>
          )}

          <div style={{ flex: 1 }} />

          {/* Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 32 }}>
            <button type="button" disabled={step === 0} onClick={() => setStep(s => Math.max(0, s - 1))} style={{
              ...cookNavBtn, opacity: step === 0 ? 0.4 : 1,
            }}>
              <SIcon name="arrow-l" size={14} /> anterior
            </button>
            <button type="button"
              onClick={() => step === total - 1 ? setScreen('recipe') : setStep(s => s + 1)}
              style={{ ...cookNavBtn, background: 'var(--terracotta)', color: '#fff', borderColor: 'var(--terracotta)' }}>
              {step === total - 1 ? '¡listo, terminar!' : 'siguiente paso'}
              {step < total - 1 && <SIcon name="arrow-r" size={14} stroke="#fff" />}
            </button>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 11.5, color: 'rgba(244, 237, 228, 0.5)' }}>
              ↑ ↓ teclado · barra espaciadora = timer
            </span>
          </div>
        </div>

        {/* Right: photo + ingredient checklist */}
        <div style={{ background: 'rgba(244, 237, 228, 0.04)', display: 'flex', flexDirection: 'column' }}>
          <SPhoto tone={recipe.tone} ratio="3 / 2" label={`paso ${step + 1}`} style={{ borderRadius: 0 }} />
          <div style={{ padding: '24px 32px', overflow: 'auto', flex: 1 }}>
            <div className="s-eyebrow" style={{ color: 'rgba(244, 237, 228, 0.5)', marginBottom: 12 }}>
              ingredientes a mano
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recipe.ingredients.map((ing, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, fontSize: 13.5, color: 'rgba(244, 237, 228, 0.85)' }}>
                  <span className="s-mono" style={{ width: 80, color: 'rgba(244, 237, 228, 0.5)', fontSize: 11, flexShrink: 0 }}>
                    {ing.qty}
                  </span>
                  <span style={{ flex: 1 }}>{ing.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

const cookNavBtn = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  height: 44, padding: '0 20px',
  border: '1px solid rgba(244, 237, 228, 0.18)',
  background: 'transparent',
  color: 'var(--cream)',
  fontSize: 13.5, fontWeight: 500,
  borderRadius: 'var(--r-1)',
  cursor: 'pointer',
};

// ────────────────────────────── Mi recetario
function SMine({ openRecipe, setScreen, savedIds }) {
  const [view, setView] = React.useState('grid');
  const [filter, setFilter] = React.useState('all');
  const [tab, setTab] = React.useState('todas');

  const tabs = [
    { id: 'todas', label: 'todas', count: RECIPES.length },
    { id: 'guardadas', label: 'guardadas', count: savedIds.size },
    { id: 'mias', label: 'creadas por mí', count: 2 },
    { id: 'borradores', label: 'borradores', count: 1 },
  ];

  return (
    <div style={{ padding: '40px 36px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, marginBottom: 28 }}>
        <div>
          <div className="s-eyebrow" style={{ marginBottom: 8 }}>mi recetario</div>
          <h1 className="s-serif" style={{ fontSize: 48, lineHeight: 1.0, letterSpacing: '-0.025em' }}>
            <span className="s-italic">Tus</span> recetas
          </h1>
        </div>
        <div style={{ flex: 1 }} />
        <button type="button" className="s-btn ghost" onClick={() => setScreen('import')}><SIcon name="upload" size={13}/> importar</button>
        <button type="button" className="s-btn" onClick={() => setScreen('create')}><SIcon name="plus" size={13}/> nueva receta</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid var(--hair)', marginBottom: 24 }}>
        {tabs.map(t => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} style={{
            all: 'unset', cursor: 'pointer',
            padding: '10px 0', position: 'relative',
            fontSize: 13.5,
            color: tab === t.id ? 'var(--ink)' : 'var(--soft)',
          }}>
            {t.label} <span style={{ color: 'var(--mute)', fontSize: 11, marginLeft: 4 }}>({t.count})</span>
            {tab === t.id && <span style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 1, background: 'var(--ink)' }} />}
          </button>
        ))}
      </div>

      {/* Filter row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        {QUICK_FILTERS.map(f => (
          <SChip key={f.id} on={filter === f.id} onClick={() => setFilter(f.id)}>{f.label}</SChip>
        ))}
        <div style={{ flex: 1 }} />
        <STabs
          tabs={[{ id: 'grid', label: 'cuadrícula' }, { id: 'list', label: 'lista' }]}
          value={view} onChange={setView} size="sm"
        />
      </div>

      {/* Recipes */}
      {view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {RECIPES.map(r => <SRecipeCard key={r.id} recipe={r} onOpen={openRecipe} compact />)}
        </div>
      ) : (
        <div className="s-card" style={{ padding: 0 }}>
          {RECIPES.map((r, i) => (
            <button key={r.id} type="button" onClick={() => openRecipe(r)} style={{
              all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16,
              padding: '14px 18px',
              borderBottom: i < RECIPES.length - 1 ? '1px solid var(--hair-2)' : 'none',
            }}>
              <SPhoto tone={r.tone} label={r.id} style={{ width: 56, height: 56, padding: 0 }}>
                <span/>
              </SPhoto>
              <div style={{ flex: 1 }}>
                <div className="s-serif" style={{ fontSize: 17 }}>{r.title}</div>
                <div style={{ fontSize: 11.5, color: 'var(--soft)', marginTop: 2 }}>{r.tags.join(' · ')}</div>
              </div>
              <span style={{ fontSize: 11.5, color: 'var(--soft)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <SIcon name="clock" size={11}/> {r.time}m
              </span>
              <span style={{ fontSize: 11.5, color: 'var(--soft)', width: 80 }}>{r.difficulty}</span>
              <SIcon name={savedIds.has(r.id) ? 'heart-fill' : 'heart'} size={14} stroke={savedIds.has(r.id) ? 'var(--terracotta)' : 'var(--mute)'} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ────────────────────────────── Crear receta
function SCreate({ setScreen }) {
  const [tone, setTone] = React.useState('mostaza');
  const [ingredients, setIngredients] = React.useState([
    { qty: '1', name: 'calabaza moscada' },
    { qty: '1', name: 'cebolla' },
    { qty: '', name: '' },
  ]);
  const [steps, setSteps] = React.useState([
    'Precalienta el horno a 200 °C.',
    'Asa la calabaza 35 minutos.',
    '',
  ]);

  return (
    <div style={{ padding: '32px 36px 80px', maxWidth: 1100, margin: '0 auto' }}>
      <button type="button" onClick={() => setScreen('mine')} style={{
        all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
        fontSize: 12, color: 'var(--soft)', marginBottom: 16,
      }}>
        <SIcon name="arrow-l" size={12} /> volver a mi recetario
      </button>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 32 }}>
        <div>
          <div className="s-eyebrow" style={{ marginBottom: 8 }}>nueva receta</div>
          <h1 className="s-serif" style={{ fontSize: 44, lineHeight: 1.0, letterSpacing: '-0.025em' }}>
            <span className="s-italic">Escribe</span> tu receta
          </h1>
        </div>
        <div style={{ flex: 1 }} />
        <button type="button" className="s-btn ghost">guardar borrador</button>
        <button type="button" className="s-btn terracotta">publicar en mi recetario</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 32 }}>
        {/* Foto + meta */}
        <aside>
          <div className="s-eyebrow" style={{ marginBottom: 8 }}>foto principal</div>
          <SPhoto tone={tone} ratio="4 / 3" label="arrastra una foto" style={{ marginBottom: 8 }} />
          <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
            {SPalette.map(t => (
              <button key={t} type="button" onClick={() => setTone(t)} style={{
                all: 'unset', cursor: 'pointer',
                width: 28, height: 28, borderRadius: 'var(--r-1)',
                outline: tone === t ? '2px solid var(--ink)' : 'none', outlineOffset: 2,
              }}>
                <SPhoto tone={t} label="" style={{ width: '100%', height: '100%', padding: 0 }}>
                  <span/>
                </SPhoto>
              </button>
            ))}
            <button type="button" className="s-btn sm ghost" style={{ marginLeft: 'auto' }}>
              <SIcon name="upload" size={11}/> subir
            </button>
          </div>

          <SField label="raciones"><input className="s-input" defaultValue="4" /></SField>
          <SField label="tiempo"><input className="s-input" defaultValue="45 min" /></SField>
          <SField label="dificultad">
            <STabs tabs={[{id:'f', label:'fácil'},{id:'m', label:'media'},{id:'a', label:'avanzado'}]} value="f" onChange={()=>{}} size="sm"/>
          </SField>
          <SField label="etiquetas">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {['sopa', 'otoño', 'vegetariano'].map(t => <SChip key={t} on removable>{t}</SChip>)}
              <SChip>+ añadir</SChip>
            </div>
          </SField>
        </aside>

        {/* Form principal */}
        <main>
          <SField label="título de la receta">
            <input className="s-input" style={{ height: 56, fontSize: 24, fontFamily: 'var(--serif)', fontStyle: 'italic', padding: '0 16px' }}
              defaultValue="Crema de calabaza asada" />
          </SField>
          <SField label="descripción · una o dos líneas">
            <textarea className="s-textarea" rows={2}
              defaultValue="Asar la calabaza antes de triturar concentra el dulzor y le da un toque ahumado." />
          </SField>

          <div style={{ marginTop: 28 }}>
            <h3 className="s-serif" style={{ fontSize: 22, marginBottom: 14 }}>Ingredientes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {ingredients.map((ing, i) => (
                <div key={i} style={{ display: 'flex', gap: 6 }}>
                  <input className="s-input" style={{ width: 130, fontFamily: 'var(--mono)', fontSize: 12 }}
                    placeholder="cantidad" defaultValue={ing.qty} />
                  <input className="s-input" style={{ flex: 1 }}
                    placeholder="ingrediente" defaultValue={ing.name} />
                  <button type="button" style={{
                    all: 'unset', cursor: 'pointer', width: 40, height: 40,
                    color: 'var(--mute)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}><SIcon name="x" size={14}/></button>
                </div>
              ))}
            </div>
            <button type="button" className="s-btn sm ghost" style={{ marginTop: 8 }}
              onClick={() => setIngredients(s => [...s, { qty: '', name: '' }])}>
              <SIcon name="plus" size={11}/> añadir ingrediente
            </button>
          </div>

          <div style={{ marginTop: 28 }}>
            <h3 className="s-serif" style={{ fontSize: 22, marginBottom: 14 }}>Pasos</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {steps.map((st, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span className="s-step-num" style={{ marginTop: 6 }}>{i + 1}</span>
                  <textarea className="s-textarea" rows={2} placeholder="describe el paso..." defaultValue={st} style={{ flex: 1 }} />
                  <button type="button" style={{
                    all: 'unset', cursor: 'pointer', width: 32, height: 32, marginTop: 8,
                    color: 'var(--mute)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}><SIcon name="timer" size={14}/></button>
                </div>
              ))}
            </div>
            <button type="button" className="s-btn sm ghost" style={{ marginTop: 8 }}
              onClick={() => setSteps(s => [...s, ''])}>
              <SIcon name="plus" size={11}/> añadir paso
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

function SField({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div className="s-eyebrow" style={{ marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

// ────────────────────────────── Importar receta
function SImport({ setScreen }) {
  const [text, setText] = React.useState(IMPORT_EXAMPLE);
  const [tone, setTone] = React.useState('mostaza');
  const [hasFile, setHasFile] = React.useState(false);

  // Parser ligero del formato
  const parsed = React.useMemo(() => parseRecipe(text), [text]);

  return (
    <div style={{ padding: '32px 36px 80px', maxWidth: 1240, margin: '0 auto' }}>
      <button type="button" onClick={() => setScreen('mine')} style={{
        all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
        fontSize: 12, color: 'var(--soft)', marginBottom: 16,
      }}>
        <SIcon name="arrow-l" size={12} /> volver a mi recetario
      </button>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 32 }}>
        <div>
          <div className="s-eyebrow" style={{ marginBottom: 8 }}>importar receta</div>
          <h1 className="s-serif" style={{ fontSize: 44, lineHeight: 1.0, letterSpacing: '-0.025em' }}>
            Pega o arrastra <span className="s-italic">tu archivo</span>.
          </h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Editor */}
        <div>
          {/* Drop area */}
          <button type="button" onClick={() => setHasFile(!hasFile)} style={{
            all: 'unset', cursor: 'pointer', display: 'block', width: '100%',
            border: '1.5px dashed ' + (hasFile ? 'var(--terracotta)' : 'var(--hair)'),
            borderRadius: 'var(--r-2)', background: hasFile ? 'rgba(200, 89, 58, 0.04)' : 'var(--paper-2)',
            padding: '20px 24px', marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 18,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 'var(--r-1)',
              background: 'var(--paper)', border: '1px solid var(--hair)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: hasFile ? 'var(--terracotta)' : 'var(--soft)',
            }}>
              <SIcon name={hasFile ? 'check' : 'upload'} size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, color: 'var(--ink)', marginBottom: 2 }}>
                {hasFile ? 'crema-calabaza.md · 1.4 KB' : 'arrastra un .md o .txt aquí'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--soft)' }}>
                {hasFile ? 'lista para importar' : 'o pega el texto debajo · admitimos markdown, frontmatter y texto plano'}
              </div>
            </div>
            <span className="s-btn sm ghost" style={{ pointerEvents: 'none' }}>
              {hasFile ? 'reemplazar' : 'elegir archivo'}
            </span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span className="s-eyebrow">o pega el texto</span>
            <div style={{ flex: 1 }} />
            <button type="button" className="s-btn sm ghost" onClick={() => setText(IMPORT_EXAMPLE)}>
              <SIcon name="sparkle" size={11}/> ejemplo
            </button>
          </div>
          <textarea className="s-textarea mono" rows={20} value={text} onChange={e => setText(e.target.value)}
            style={{ background: 'var(--paper)' }} />

          <div style={{ marginTop: 14, padding: '14px 16px', background: 'var(--paper-2)', borderRadius: 'var(--r-2)', borderLeft: '2px solid var(--oliva)' }}>
            <div className="s-eyebrow" style={{ color: 'var(--oliva)', marginBottom: 6 }}>estructura del archivo</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11.5, lineHeight: 1.7, color: 'var(--ink-2)' }}>
              <div><span style={{ color: 'var(--soft)' }}>---</span> <span style={{ color: 'var(--soft)' }}>(opcional)</span> meta: title · servings · time · difficulty · tags · photo</div>
              <div><span style={{ color: 'var(--terracotta)' }}># Ingredientes</span> · lista con guiones</div>
              <div><span style={{ color: 'var(--terracotta)' }}># Pasos</span> · lista numerada · usa <code>⏱ 35m</code> para timers</div>
              <div><span style={{ color: 'var(--terracotta)' }}># Notas</span> · texto libre, opcional</div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div>
          <div className="s-eyebrow" style={{ marginBottom: 12 }}>vista previa · así se verá</div>
          <div className="s-card" style={{ background: 'var(--paper)' }}>
            <SPhoto tone={tone} ratio="16 / 10" label={parsed.photo || 'foto'} />
            <div style={{ padding: '20px 24px 28px' }}>
              {parsed.tags?.length > 0 && (
                <div className="s-eyebrow" style={{ marginBottom: 8 }}>{parsed.tags.join(' · ')}</div>
              )}
              <h2 className="s-serif" style={{ fontSize: 28, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 16 }}>
                {parsed.title || 'sin título'}
              </h2>
              <div style={{ display: 'flex', gap: 18, fontSize: 11.5, color: 'var(--soft)', marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid var(--hair-2)' }}>
                {parsed.servings && <span><SIcon name="leaf" size={11}/> {parsed.servings} raciones</span>}
                {parsed.time && <span><SIcon name="clock" size={11}/> {parsed.time}</span>}
                {parsed.difficulty && <span><SIcon name="chef" size={11}/> {parsed.difficulty}</span>}
              </div>

              {parsed.ingredients?.length > 0 && (
                <>
                  <div className="s-eyebrow" style={{ marginBottom: 10 }}>ingredientes</div>
                  <ul style={{ marginBottom: 18 }}>
                    {parsed.ingredients.map((ing, i) => (
                      <li key={i} style={{ display: 'flex', gap: 12, padding: '5px 0', fontSize: 13 }}>
                        <span className="s-mono" style={{ width: 84, color: 'var(--soft)', fontSize: 10.5 }}>{ing.qty}</span>
                        <span>{ing.name}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {parsed.steps?.length > 0 && (
                <>
                  <div className="s-eyebrow" style={{ marginBottom: 10 }}>pasos</div>
                  <ol style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {parsed.steps.map((st, i) => (
                      <li key={i} style={{ display: 'flex', gap: 12, fontSize: 13, lineHeight: 1.5 }}>
                        <span className="s-step-num" style={{ width: 24, height: 24, fontSize: 13 }}>{i + 1}</span>
                        <div style={{ flex: 1, paddingTop: 2 }}>
                          {st.body}
                          {st.timer && <span style={{ color: 'var(--terracotta)', marginLeft: 6, fontSize: 11.5 }}><SIcon name="timer" size={10}/> {st.timer}m</span>}
                        </div>
                      </li>
                    ))}
                  </ol>
                </>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button type="button" className="s-btn ghost">editar antes de guardar</button>
            <div style={{ flex: 1 }} />
            <button type="button" className="s-btn terracotta">
              <SIcon name="check" size={13} stroke="#fff"/> importar a mi recetario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Parser muy ligero del formato Sobremesa
function parseRecipe(text) {
  const out = { ingredients: [], steps: [], tags: [] };
  // Frontmatter
  const fm = text.match(/^---\s*\n([\s\S]*?)\n---/);
  if (fm) {
    fm[1].split('\n').forEach(line => {
      const m = line.match(/^(\w+):\s*(.+)$/);
      if (!m) return;
      const k = m[1], v = m[2].trim();
      if (k === 'tags') out.tags = v.split(/,\s*/);
      else out[k] = v;
    });
    text = text.slice(fm[0].length);
  }
  // Sections
  const sections = text.split(/\n#\s+/);
  sections.forEach(sec => {
    const [head, ...rest] = sec.split('\n');
    const body = rest.join('\n').trim();
    if (/ingredient/i.test(head)) {
      out.ingredients = body.split('\n').filter(l => l.trim().startsWith('-')).map(l => {
        const t = l.replace(/^-\s*/, '');
        const m = t.match(/^([\d\/\.,]+\s*\w*\.?|un puñado|al gusto|unas hojas|al final)\s+(?:de\s+)?(.+)$/i);
        if (m) return { qty: m[1], name: m[2] };
        return { qty: '', name: t };
      });
    } else if (/paso/i.test(head)) {
      out.steps = body.split(/\n(?=\d+\.\s)/).map(l => {
        const t = l.replace(/^\d+\.\s*/, '').trim();
        const tm = t.match(/⏱\s*(\d+)\s*m/);
        return { body: t.replace(/⏱\s*\d+\s*m/, '').trim(), timer: tm ? Number(tm[1]) : null };
      }).filter(s => s.body);
    } else if (/nota/i.test(head)) {
      out.notes = body;
    }
  });
  return out;
}

Object.assign(window, { SCookMode, SMine, SCreate, SImport });
