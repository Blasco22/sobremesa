// Sobremesa · Mobile prototype
// Frame interno 390x844 (iPhone-ish). Screens: home · pantry · recipe · cook

function SMobile() {
  const [screen, setScreen] = React.useState('home');
  const [recipeId, setRecipeId] = React.useState(RECIPES[1].id);
  const [pantry, setPantry] = React.useState(['cebolla', 'ajo', 'tomate', 'huevo', 'pasta', 'aceite']);
  const [cookStep, setCookStep] = React.useState(0);
  const recipe = RECIPES.find(r => r.id === recipeId) || RECIPES[0];

  const matchFor = (r) => {
    const total = r.ingredients.length;
    const have = r.ingredients.filter(ing => pantry.some(p => ing.name.toLowerCase().includes(p))).length;
    return Math.round((have / total) * 100);
  };
  const togglePantry = (i) => setPantry(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);
  const openRecipe = (r) => { setRecipeId(r.id); setScreen('recipe'); };

  return (
    <div className="sobremesa" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: 'var(--cream)' }}>
      {/* Status bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 44, zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 24px 0', fontSize: 12.5, fontWeight: 600, color: 'var(--ink)',
      }}>
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>9:41</span>
        <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
          <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor"><path d="M0 8h2v2H0zM4 6h2v4H4zM8 4h2v6H8zM12 2h2v8h-2z"/></svg>
          <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor"><path d="M0 4a7 7 0 0 1 14 0L13 5a6 6 0 0 0-12 0L0 4z"/></svg>
          <span style={{
            display: 'inline-block', width: 22, height: 10, border: '1px solid currentColor',
            borderRadius: 2, position: 'relative', padding: 1,
          }}>
            <span style={{ display: 'block', width: '70%', height: '100%', background: 'currentColor', borderRadius: 1 }} />
          </span>
        </span>
      </div>

      <div className="s-scroll" style={{ position: 'absolute', inset: 0, paddingTop: 44, paddingBottom: 80, overflow: 'auto' }}>
        {screen === 'home' && <SMHome openRecipe={openRecipe} setScreen={setScreen} pantryCount={pantry.length}/>}
        {screen === 'pantry' && <SMPantry pantry={pantry} togglePantry={togglePantry} openRecipe={openRecipe} matchFor={matchFor}/>}
        {screen === 'recipe' && <SMRecipe recipe={recipe} setScreen={setScreen} matchFor={matchFor} pantry={pantry} startCook={() => { setCookStep(0); setScreen('cook'); }}/>}
        {screen === 'mine' && <SMMine openRecipe={openRecipe} setScreen={setScreen}/>}
      </div>

      {/* Cook mode overlay */}
      {screen === 'cook' && <SMCook recipe={recipe} step={cookStep} setStep={setCookStep} setScreen={setScreen}/>}

      {/* Tab bar */}
      {screen !== 'cook' && (
        <nav style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
          background: 'rgba(244, 237, 228, 0.92)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--hair)',
          display: 'flex', justifyContent: 'space-around', alignItems: 'center',
          paddingBottom: 24, zIndex: 5,
        }}>
          <SMTab icon="home" label="descubre" active={screen === 'home'} onClick={() => setScreen('home')}/>
          <SMTab icon="pantry" label="despensa" active={screen === 'pantry'} onClick={() => setScreen('pantry')}/>
          <button type="button" onClick={() => setScreen('mine')} style={{
            all: 'unset', cursor: 'pointer',
            width: 48, height: 48, borderRadius: '50%',
            background: 'var(--terracotta)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginTop: -16,
          }}>
            <SIcon name="plus" size={20} stroke="#fff"/>
          </button>
          <SMTab icon="book" label="recetario" active={screen === 'mine'} onClick={() => setScreen('mine')}/>
          <SMTab icon="cart" label="lista" />
        </nav>
      )}
    </div>
  );
}

function SMTab({ icon, label, active, onClick }) {
  return (
    <button type="button" onClick={onClick} style={{
      all: 'unset', cursor: 'pointer',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
      color: active ? 'var(--ink)' : 'var(--mute)',
      fontSize: 10, fontWeight: 500,
    }}>
      <SIcon name={icon} size={22} />
      <span>{label}</span>
    </button>
  );
}

// ────────────────────────────── Mobile Home
function SMHome({ openRecipe, setScreen, pantryCount }) {
  const featured = RECIPES[0];
  return (
    <div style={{ padding: '8px 20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
        <SBrand size={20}/>
        <div style={{ flex: 1 }}/>
        <button type="button" style={{ all: 'unset', width: 36, height: 36, borderRadius: '50%', background: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SIcon name="search" size={16}/>
        </button>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div className="s-eyebrow" style={{ marginBottom: 6 }}>buenas tardes ·</div>
        <h1 className="s-serif" style={{ fontSize: 32, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
          ¿qué te apetece <span className="s-italic">cocinar</span>?
        </h1>
      </div>

      {/* Despensa card */}
      <button type="button" onClick={() => setScreen('pantry')} style={{
        all: 'unset', cursor: 'pointer', display: 'block', width: '100%',
        padding: '14px 16px', background: 'var(--ink)', color: 'var(--cream)',
        borderRadius: 'var(--r-2)', marginBottom: 24,
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

      {/* Featured */}
      <button type="button" onClick={() => openRecipe(featured)} style={{ all: 'unset', cursor: 'pointer', display: 'block', width: '100%', marginBottom: 28 }}>
        <div className="s-eyebrow" style={{ marginBottom: 8, color: 'var(--terracotta)' }}>receta del día</div>
        <SPhoto tone={featured.tone} ratio="4 / 3" label={featured.id} style={{ borderRadius: 'var(--r-2)', marginBottom: 12 }}/>
        <h3 className="s-serif" style={{ fontSize: 22, lineHeight: 1.15, marginBottom: 6 }}>{featured.title}</h3>
        <div style={{ fontSize: 11.5, color: 'var(--soft)', display: 'flex', gap: 12 }}>
          <span><SIcon name="clock" size={11}/> {featured.time}m</span>
          <span><SIcon name="chef" size={11}/> {featured.difficulty}</span>
          <span>· {featured.servings} pers.</span>
        </div>
      </button>

      {/* Categories chip row */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, marginLeft: -20, marginRight: -20, padding: '0 20px', overflow: 'auto' }}>
        {QUICK_FILTERS.map((f, i) => <SChip key={f.id} on={i === 0}>{f.label}</SChip>)}
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {RECIPES.slice(1, 5).map(r => (
          <button key={r.id} type="button" onClick={() => openRecipe(r)} style={{
            all: 'unset', cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'center',
          }}>
            <SPhoto tone={r.tone} label={r.id} style={{ width: 88, height: 88, padding: 0, flexShrink: 0, borderRadius: 'var(--r-1)' }}><span/></SPhoto>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="s-eyebrow" style={{ marginBottom: 2 }}>{r.tags[0]}</div>
              <div className="s-serif" style={{ fontSize: 16, lineHeight: 1.2, marginBottom: 4 }}>{r.title}</div>
              <div style={{ fontSize: 11, color: 'var(--soft)', display: 'flex', gap: 10 }}>
                <span><SIcon name="clock" size={10}/> {r.time}m</span>
                <span>{r.difficulty}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────── Mobile Pantry
function SMPantry({ pantry, togglePantry, openRecipe, matchFor }) {
  const ranked = RECIPES
    .map(r => ({ r, match: matchFor(r) }))
    .sort((a, b) => b.match - a.match);
  return (
    <div style={{ padding: '8px 20px 24px' }}>
      <div style={{ marginBottom: 18 }}>
        <div className="s-eyebrow" style={{ marginBottom: 6 }}>despensa</div>
        <h1 className="s-serif" style={{ fontSize: 28, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
          ¿qué tienes <span className="s-italic">a mano</span>?
        </h1>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div className="s-eyebrow" style={{ marginBottom: 8 }}>en tu despensa · {pantry.length}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {pantry.map(p => <SChip key={p} on dot removable onClick={() => togglePantry(p)}>{p}</SChip>)}
          <SChip><SIcon name="plus" size={11}/> añadir</SChip>
        </div>
      </div>

      {PANTRY_CATEGORIES.slice(0, 2).map(cat => (
        <div key={cat.id} style={{ marginBottom: 16 }}>
          <div className="s-eyebrow" style={{ marginBottom: 8 }}>{cat.label}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {cat.items.slice(0, 6).map(it => (
              <SChip key={it} on={pantry.includes(it)} onClick={() => togglePantry(it)} dot={pantry.includes(it)}>{it}</SChip>
            ))}
          </div>
        </div>
      ))}

      <div style={{ height: 1, background: 'var(--hair)', margin: '24px 0' }}/>

      <div className="s-eyebrow" style={{ marginBottom: 12 }}>{ranked.length} recetas posibles</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {ranked.slice(0, 4).map(({ r, match }) => (
          <button key={r.id} type="button" onClick={() => openRecipe(r)} style={{
            all: 'unset', cursor: 'pointer',
            display: 'flex', gap: 12, padding: 10,
            background: 'var(--paper)', borderRadius: 'var(--r-2)', border: '1px solid var(--hair)',
          }}>
            <SPhoto tone={r.tone} label={r.id} style={{ width: 72, height: 72, padding: 0, flexShrink: 0, borderRadius: 'var(--r-1)' }}><span/></SPhoto>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <SMatchBadge match={match}/>
              </div>
              <div className="s-serif" style={{ fontSize: 15, lineHeight: 1.2, marginBottom: 3 }}>{r.title}</div>
              <div style={{ fontSize: 10.5, color: 'var(--soft)' }}><SIcon name="clock" size={10}/> {r.time}m · {r.difficulty}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────── Mobile Recipe
function SMRecipe({ recipe, setScreen, startCook, matchFor, pantry }) {
  const [tab, setTab] = React.useState('ing');
  const match = matchFor(recipe);
  return (
    <div>
      <div style={{ position: 'relative' }}>
        <SPhoto tone={recipe.tone} ratio="4 / 3" label={recipe.id} style={{ width: '100%' }}/>
        <button type="button" onClick={() => setScreen('home')} style={{
          all: 'unset', cursor: 'pointer',
          position: 'absolute', top: 12, left: 16,
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(251, 246, 238, 0.9)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><SIcon name="arrow-l" size={16}/></button>
        <button type="button" style={{
          all: 'unset', cursor: 'pointer',
          position: 'absolute', top: 12, right: 16,
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(251, 246, 238, 0.9)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--terracotta)',
        }}><SIcon name="heart-fill" size={16} stroke="var(--terracotta)"/></button>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        <div className="s-eyebrow" style={{ marginBottom: 8 }}>{recipe.tags.join(' · ')}</div>
        <h1 className="s-serif" style={{ fontSize: 30, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 12 }}>
          {recipe.title}
        </h1>
        <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--soft)', marginBottom: 18, textWrap: 'pretty' }}>
          {recipe.blurb}
        </p>

        <div style={{ display: 'flex', gap: 16, padding: '14px 0', borderTop: '1px solid var(--hair-2)', borderBottom: '1px solid var(--hair-2)', marginBottom: 18 }}>
          <SMStat icon="clock" label={`${recipe.time} min`} />
          <SMStat icon="chef" label={recipe.difficulty} />
          <SMStat icon="leaf" label={`${recipe.servings} pers.`} />
          <div style={{ flex: 1 }}/>
          <SMatchBadge match={match}/>
        </div>

        <button type="button" className="s-btn lg terracotta" onClick={startCook} style={{ width: '100%', marginBottom: 20 }}>
          <SIcon name="play" size={14} stroke="#fff"/> entrar en modo cocina
        </button>

        <STabs
          tabs={[{ id: 'ing', label: `ingredientes · ${recipe.ingredients.length}` }, { id: 'step', label: `pasos · ${recipe.steps.length}` }]}
          value={tab} onChange={setTab} size="sm"
        />

        {tab === 'ing' ? (
          <ul style={{ marginTop: 16 }}>
            {recipe.ingredients.map((ing, i) => (
              <li key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--hair-2)', fontSize: 13.5 }}>
                <span className="s-mono" style={{ width: 80, color: 'var(--soft)', fontSize: 11, flexShrink: 0 }}>{ing.qty}</span>
                <span style={{ flex: 1 }}>{ing.name}{ing.note && <span style={{ color: 'var(--soft)' }}> · {ing.note}</span>}</span>
                {!pantry.some(p => ing.name.toLowerCase().includes(p)) && <SIcon name="cart" size={12} stroke="var(--terracotta)"/>}
              </li>
            ))}
          </ul>
        ) : (
          <ol style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {recipe.steps.map((st, i) => (
              <li key={i} style={{ display: 'flex', gap: 12 }}>
                <span className="s-step-num" style={{ width: 24, height: 24, fontSize: 13 }}>{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 4 }}>{st.title}</div>
                  <p style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--ink-2)' }}>{st.body}</p>
                  {st.timer && <div style={{ fontSize: 11, color: 'var(--terracotta)', marginTop: 4 }}><SIcon name="timer" size={10}/> {st.timer} min</div>}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

function SMStat({ icon, label }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--ink-2)' }}>
      <SIcon name={icon} size={12} stroke="var(--soft)"/> {label}
    </div>
  );
}

// ────────────────────────────── Mobile Cook
function SMCook({ recipe, step, setStep, setScreen }) {
  const total = recipe.steps.length;
  const cur = recipe.steps[step] || recipe.steps[0];
  const [timer, setTimer] = React.useState(cur.timer ? cur.timer * 60 : null);
  const [running, setRunning] = React.useState(false);
  React.useEffect(() => { setTimer(cur.timer ? cur.timer * 60 : null); setRunning(false); }, [step]);
  React.useEffect(() => {
    if (!running || timer == null) return;
    const t = setInterval(() => setTimer(s => Math.max(0, (s || 0) - 1)), 1000);
    return () => clearInterval(t);
  }, [running, timer]);
  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--ink)', color: 'var(--cream)', display: 'flex', flexDirection: 'column', zIndex: 20 }}>
      <div style={{ height: 44 }}/>
      <header style={{ display: 'flex', alignItems: 'center', padding: '8px 20px', gap: 10 }}>
        <button type="button" onClick={() => setScreen('recipe')} style={{ all: 'unset', cursor: 'pointer', width: 36, height: 36, borderRadius: '50%', background: 'rgba(244, 237, 228, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SIcon name="x" size={16}/>
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div className="s-eyebrow" style={{ color: 'rgba(244, 237, 228, 0.5)' }}>cocinando</div>
          <div className="s-serif s-italic" style={{ fontSize: 13, color: 'var(--cream)' }}>{recipe.title}</div>
        </div>
        <div style={{ fontSize: 11.5, color: 'rgba(244, 237, 228, 0.5)', fontVariantNumeric: 'tabular-nums', minWidth: 36, textAlign: 'right' }}>
          {step + 1} / {total}
        </div>
      </header>

      <div style={{ padding: '0 20px 20px', display: 'flex', gap: 4 }}>
        {recipe.steps.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 3, background: i <= step ? 'var(--terracotta)' : 'rgba(244, 237, 228, 0.18)' }}/>
        ))}
      </div>

      <div style={{ flex: 1, padding: '12px 24px', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <div className="s-eyebrow" style={{ color: 'var(--terracotta)', marginBottom: 14 }}>
          paso {String(step + 1).padStart(2, '0')} · {String(total).padStart(2, '0')}
        </div>
        <h1 className="s-serif" style={{ fontSize: 36, lineHeight: 1.08, letterSpacing: '-0.02em', marginBottom: 18 }}>
          {cur.title}
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.55, color: 'rgba(244, 237, 228, 0.85)', textWrap: 'pretty', marginBottom: 24 }}>
          {cur.body}
        </p>

        {timer != null && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 16px',
            background: 'rgba(244, 237, 228, 0.06)',
            borderRadius: 'var(--r-2)',
          }}>
            {running && <span className="s-live-dot"/>}
            <div style={{ fontFamily: 'var(--mono)', fontSize: 28, fontVariantNumeric: 'tabular-nums', color: 'var(--cream)' }}>
              {fmt(timer)}
            </div>
            <div style={{ flex: 1 }}/>
            <button type="button" onClick={() => setRunning(r => !r)} style={{
              all: 'unset', cursor: 'pointer', width: 36, height: 36, borderRadius: '50%',
              background: 'var(--terracotta)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><SIcon name={running ? 'pause' : 'play'} size={14} stroke="#fff"/></button>
          </div>
        )}
      </div>

      <div style={{ padding: '16px 20px 28px', display: 'flex', gap: 10 }}>
        <button type="button" disabled={step === 0} onClick={() => setStep(s => Math.max(0, s - 1))} style={{
          flex: '0 0 auto', padding: '0 18px', height: 48,
          border: '1px solid rgba(244, 237, 228, 0.18)', background: 'transparent',
          color: 'var(--cream)', fontSize: 13.5, borderRadius: 'var(--r-1)', cursor: 'pointer',
          opacity: step === 0 ? 0.4 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><SIcon name="arrow-l" size={14}/></button>
        <button type="button" onClick={() => step === total - 1 ? setScreen('recipe') : setStep(s => s + 1)} style={{
          flex: 1, height: 48,
          background: 'var(--terracotta)', color: '#fff', border: 'none',
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

// ────────────────────────────── Mobile Mine
function SMMine({ openRecipe, setScreen }) {
  return (
    <div style={{ padding: '8px 20px 24px' }}>
      <div style={{ marginBottom: 16 }}>
        <div className="s-eyebrow" style={{ marginBottom: 6 }}>mi recetario</div>
        <h1 className="s-serif" style={{ fontSize: 30, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
          <span className="s-italic">tus</span> recetas
        </h1>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        <button type="button" className="s-btn sm ghost" style={{ flex: 1 }}><SIcon name="upload" size={11}/> importar</button>
        <button type="button" className="s-btn sm" style={{ flex: 1 }}><SIcon name="plus" size={11}/> nueva</button>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 18, overflow: 'auto', marginLeft: -20, marginRight: -20, padding: '0 20px' }}>
        {['todas', 'guardadas', 'mías', 'borradores'].map((t, i) => <SChip key={t} on={i === 0}>{t}</SChip>)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {RECIPES.slice(0, 4).map(r => <SRecipeCard key={r.id} recipe={r} onOpen={openRecipe} compact/>)}
      </div>
    </div>
  );
}

Object.assign(window, { SMobile });
