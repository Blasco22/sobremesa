// Sobremesa · Desktop prototype
// Single component with screen state. Screens:
//   home · pantry · recipe · cook · mine · create · import

function SDesktop() {
  const [screen, setScreen] = React.useState('home');
  const [recipeId, setRecipeId] = React.useState(RECIPES[0].id);
  const [pantry, setPantry] = React.useState(['cebolla', 'ajo', 'tomate', 'huevo', 'pasta', 'aceite']);
  const [cookStep, setCookStep] = React.useState(0);
  const [savedIds, setSavedIds] = React.useState(new Set(RECIPES.filter(r => r.saved).map(r => r.id)));

  const recipe = RECIPES.find(r => r.id === recipeId) || RECIPES[0];

  const openRecipe = (r) => { setRecipeId(r.id); setScreen('recipe'); };
  const startCook = () => { setCookStep(0); setScreen('cook'); };

  const matchFor = (r) => {
    const total = r.ingredients.length;
    const have = r.ingredients.filter(ing => pantry.some(p => ing.name.toLowerCase().includes(p))).length;
    return Math.round((have / total) * 100);
  };

  const togglePantry = (i) => setPantry(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);
  const toggleSave = (id) => setSavedIds(s => {
    const n = new Set(s);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  return (
    <div className="sobremesa" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <SDesktopNav screen={screen} setScreen={setScreen} />
      <div className="s-scroll" style={{ flex: 1, overflowX: 'hidden', overflowY: 'auto' }}>
        {screen === 'home' && <SHome openRecipe={openRecipe} setScreen={setScreen} matchFor={matchFor} pantryCount={pantry.length} />}
        {screen === 'pantry' && <SPantry pantry={pantry} togglePantry={togglePantry} openRecipe={openRecipe} matchFor={matchFor} />}
        {screen === 'recipe' && <SRecipeDetail recipe={recipe} startCook={startCook} matchFor={matchFor} pantry={pantry} saved={savedIds.has(recipe.id)} onSave={() => toggleSave(recipe.id)} setScreen={setScreen} />}
        {screen === 'cook' && <SCookMode recipe={recipe} step={cookStep} setStep={setCookStep} setScreen={setScreen} />}
        {screen === 'mine' && <SMine openRecipe={openRecipe} setScreen={setScreen} savedIds={savedIds} />}
        {screen === 'create' && <SCreate setScreen={setScreen} />}
        {screen === 'import' && <SImport setScreen={setScreen} />}
      </div>
    </div>
  );
}

// ────────────────────────────── Top nav
function SDesktopNav({ screen, setScreen }) {
  const items = [
    { id: 'home', label: 'descubre' },
    { id: 'pantry', label: 'despensa' },
    { id: 'mine', label: 'mi recetario' },
  ];
  return (
    <header style={{
      display: 'flex', alignItems: 'center', gap: 32,
      padding: '18px 36px',
      borderBottom: '1px solid var(--hair)',
      background: 'var(--cream)',
      flexShrink: 0,
    }}>
      <button type="button" onClick={() => setScreen('home')} style={{ all: 'unset', cursor: 'pointer' }}>
        <SBrand size={24} />
      </button>
      <nav style={{ display: 'flex', gap: 4 }}>
        {items.map(it => {
          const active = screen === it.id || (it.id === 'home' && ['home', 'recipe', 'cook'].includes(screen)) || (it.id === 'mine' && ['mine', 'create', 'import'].includes(screen));
          return (
            <button key={it.id} type="button" onClick={() => setScreen(it.id)} style={{
              all: 'unset', cursor: 'pointer',
              padding: '6px 12px',
              fontSize: 13.5,
              color: active ? 'var(--ink)' : 'var(--soft)',
              fontWeight: active ? 500 : 400,
              position: 'relative',
            }}>
              {it.label}
              {active && <span style={{ position: 'absolute', left: 12, right: 12, bottom: -19, height: 1, background: 'var(--ink)' }} />}
            </button>
          );
        })}
      </nav>
      <div style={{ flex: 1 }} />
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        height: 36, padding: '0 14px',
        background: 'var(--paper)', border: '1px solid var(--hair)',
        borderRadius: 'var(--r-pill)',
        minWidth: 280, color: 'var(--soft)',
      }}>
        <SIcon name="search" size={14} />
        <span style={{ fontSize: 12.5 }}>buscar recetas, ingredientes...</span>
      </div>
      <button type="button" className="s-btn sm ghost" onClick={() => setScreen('import')}>
        <SIcon name="upload" size={13} /> importar
      </button>
      <button type="button" className="s-btn sm" onClick={() => setScreen('create')}>
        <SIcon name="plus" size={13} /> nueva
      </button>
    </header>
  );
}

// ────────────────────────────── Home
function SHome({ openRecipe, setScreen, matchFor, pantryCount }) {
  const featured = RECIPES[0];
  const popular = RECIPES.slice(1, 4);
  const quick = RECIPES.filter(r => r.time <= 20);

  return (
    <div style={{ padding: '40px 36px 80px' }}>
      {/* Hero */}
      <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 32, marginBottom: 56 }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 8 }}>
          <div className="s-eyebrow" style={{ marginBottom: 14 }}>esta semana · sopas y otoño</div>
          <h1 className="s-serif" style={{ fontSize: 64, lineHeight: 1.0, letterSpacing: '-0.025em', marginBottom: 18 }}>
            Vamos a cocinar<br/>
            <span className="s-italic" style={{ color: 'var(--terracotta)' }}>algo bueno</span>, sin prisa.
          </h1>
          <p style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--soft)', maxWidth: 380, marginBottom: 24, textWrap: 'pretty' }}>
            Tu recetario, ordenado a tu manera. Importa, escribe y cocina —
            con la calma que merece la sobremesa.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="s-btn terracotta" onClick={() => setScreen('pantry')}>
              <SIcon name="pantry" size={14} /> qué cocino con lo que tengo
            </button>
            <button type="button" className="s-btn ghost" onClick={() => openRecipe(featured)}>
              receta del día <SIcon name="arrow-r" size={13} />
            </button>
          </div>
        </div>
        <button type="button" onClick={() => openRecipe(featured)} style={{ all: 'unset', cursor: 'pointer', display: 'block' }}>
          <div style={{ position: 'relative' }}>
            <SPhoto tone={featured.tone} ratio="4 / 3" label={`foto · ${featured.id}`} />
            <div style={{
              position: 'absolute', left: 24, bottom: 24, right: 24,
              display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16,
            }}>
              <div style={{ background: 'var(--paper)', padding: '14px 18px', borderRadius: 'var(--r-2)', maxWidth: 360 }}>
                <div className="s-eyebrow" style={{ marginBottom: 4, color: 'var(--terracotta)' }}>receta del día</div>
                <h3 className="s-serif" style={{ fontSize: 22, lineHeight: 1.15 }}>{featured.title}</h3>
                <div style={{ fontSize: 11.5, color: 'var(--soft)', marginTop: 6, display: 'flex', gap: 14 }}>
                  <span><SIcon name="clock" size={11} /> {featured.time}m</span>
                  <span><SIcon name="chef" size={11} /> {featured.difficulty}</span>
                  <span>· {featured.servings} pers.</span>
                </div>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Despensa CTA strip */}
      <button type="button" onClick={() => setScreen('pantry')} style={{
        all: 'unset', display: 'block', width: '100%', cursor: 'pointer',
        padding: '20px 28px', marginBottom: 56,
        background: 'var(--paper-2)',
        border: '1px solid var(--hair)',
        borderRadius: 'var(--r-2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <SIcon name="pantry" size={22} stroke="var(--terracotta)" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, color: 'var(--ink)', marginBottom: 2 }}>
              <strong style={{ fontWeight: 500 }}>{pantryCount} ingredientes</strong> en tu despensa virtual
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--soft)' }}>
              Te decimos qué puedes cocinar ahora mismo, sin pasar por el súper.
            </div>
          </div>
          <span style={{ fontSize: 12.5, color: 'var(--soft)', display: 'flex', alignItems: 'center', gap: 4 }}>
            abrir despensa <SIcon name="arrow-r" size={12} />
          </span>
        </div>
      </button>

      {/* Populares */}
      <SSectionHead
        eyebrow="esta semana"
        title="Populares en sobremesa"
        action={<button type="button" className="s-btn sm ghost">ver todas</button>}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 64 }}>
        {popular.map(r => <SRecipeCard key={r.id} recipe={r} onOpen={openRecipe} />)}
      </div>

      {/* Colecciones */}
      <SSectionHead eyebrow="tus colecciones" title="Tu recetario, por momentos" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 64 }}>
        {COLLECTIONS.map(c => (
          <button key={c.id} type="button" style={{
            all: 'unset', cursor: 'pointer', display: 'block',
          }}>
            <div className="s-card" style={{ padding: 0 }}>
              <SPhoto tone={c.tone} ratio="3 / 2" label={c.id} />
              <div style={{ padding: '14px 16px 16px' }}>
                <div className="s-serif" style={{ fontSize: 18, lineHeight: 1.15, marginBottom: 4 }}>{c.name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--soft)' }}>{c.count} recetas</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Rápidas */}
      <SSectionHead eyebrow="< 20 minutos" title="Para días de prisa" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {quick.map(r => <SRecipeCard key={r.id} recipe={r} onOpen={openRecipe} compact />)}
      </div>
    </div>
  );
}

Object.assign(window, { SDesktop });
