// Sobremesa · Desktop screens (parte 2)
// Pantry · RecipeDetail · CookMode · Mine · Create · Import

// ────────────────────────────── Pantry (búsqueda por ingredientes)
function SPantry({ pantry, togglePantry, openRecipe, matchFor }) {
  const [tab, setTab] = React.useState('match');
  const [missing, setMissing] = React.useState(2);

  const ranked = RECIPES
    .map(r => ({ r, match: matchFor(r), missingCount: r.ingredients.filter(ing => !pantry.some(p => ing.name.toLowerCase().includes(p))).length }))
    .filter(x => x.missingCount <= missing)
    .sort((a, b) => b.match - a.match);

  return (
    <div style={{ padding: '40px 36px 80px', display: 'grid', gridTemplateColumns: '320px 1fr', gap: 36 }}>
      {/* Sidebar despensa */}
      <aside style={{ position: 'sticky', top: 0, alignSelf: 'flex-start' }}>
        <div className="s-eyebrow" style={{ marginBottom: 8 }}>tu despensa</div>
        <h1 className="s-serif" style={{ fontSize: 38, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 18 }}>
          ¿Qué tienes <span className="s-italic">a mano</span>?
        </h1>
        <p style={{ fontSize: 13, color: 'var(--soft)', lineHeight: 1.55, marginBottom: 24 }}>
          Marca lo que tienes en casa. Te enseñamos lo que puedes cocinar ya, sin tener que comprar nada.
        </p>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11.5, color: 'var(--soft)', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span>permitir hasta</span>
            <span style={{ color: 'var(--ink)' }}>{missing} ingrediente{missing === 1 ? '' : 's'} {missing === 0 ? 'fuera' : 'fuera de despensa'}</span>
          </div>
          <input type="range" min="0" max="5" value={missing} onChange={e => setMissing(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--terracotta)' }} />
        </div>

        {PANTRY_CATEGORIES.map(cat => (
          <div key={cat.id} style={{ marginBottom: 20 }}>
            <div className="s-eyebrow" style={{ marginBottom: 8 }}>{cat.label}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {cat.items.map(it => (
                <SChip key={it} on={pantry.includes(it)} onClick={() => togglePantry(it)} dot={pantry.includes(it)}>
                  {it}
                </SChip>
              ))}
            </div>
          </div>
        ))}

        <button type="button" className="s-btn sm ghost" style={{ marginTop: 8 }}>
          <SIcon name="plus" size={12} /> añadir ingrediente
        </button>
      </aside>

      {/* Resultados */}
      <main>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div className="s-eyebrow">{ranked.length} recetas posibles</div>
          <div style={{ flex: 1 }} />
          <STabs
            tabs={[{ id: 'match', label: 'mejor match' }, { id: 'time', label: 'más rápido' }, { id: 'new', label: 'nuevas' }]}
            value={tab} onChange={setTab} size="sm"
          />
          <button type="button" className="s-btn sm ghost"><SIcon name="filter" size={12}/> filtros</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          {ranked.map(({ r, match, missingCount }) => (
            <button key={r.id} type="button" onClick={() => openRecipe(r)} style={{ all: 'unset', cursor: 'pointer', display: 'block' }}>
              <div className="s-card">
                <div style={{ display: 'flex' }}>
                  <div style={{ width: 180, flexShrink: 0 }}>
                    <SPhoto tone={r.tone} ratio="1 / 1" label={r.id} />
                  </div>
                  <div style={{ flex: 1, padding: '16px 18px 16px 20px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <SMatchBadge match={match} />
                      <span style={{ flex: 1 }} />
                      <span style={{ fontSize: 11.5, color: 'var(--soft)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <SIcon name="clock" size={11} /> {r.time}m
                      </span>
                    </div>
                    <h3 className="s-serif" style={{ fontSize: 20, lineHeight: 1.15, marginBottom: 6 }}>{r.title}</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 'auto' }}>
                      {r.ingredients.slice(0, 4).map(ing => {
                        const has = pantry.some(p => ing.name.toLowerCase().includes(p));
                        return (
                          <span key={ing.name} style={{
                            fontSize: 11, padding: '2px 7px', borderRadius: 'var(--r-pill)',
                            background: has ? 'rgba(122, 130, 89, 0.14)' : 'transparent',
                            color: has ? 'var(--ink)' : 'var(--mute)',
                            textDecoration: has ? 'none' : 'line-through',
                            border: has ? 'none' : '1px dashed var(--hair)',
                          }}>{ing.name}</span>
                        );
                      })}
                      {r.ingredients.length > 4 && <span style={{ fontSize: 11, color: 'var(--soft)' }}>+{r.ingredients.length - 4}</span>}
                    </div>
                    {missingCount > 0 && (
                      <div style={{ fontSize: 11.5, color: 'var(--terracotta)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                        te falta{missingCount === 1 ? '' : 'n'} {missingCount} ·
                        <SIcon name="cart" size={12} /> añadir a la lista
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

// ────────────────────────────── Recipe detail (vista clásica)
function SRecipeDetail({ recipe, startCook, matchFor, pantry, saved, onSave, setScreen }) {
  const [servings, setServings] = React.useState(recipe.servings);
  const ratio = servings / recipe.servings;
  const match = matchFor(recipe);
  const [checked, setChecked] = React.useState(new Set());

  return (
    <div style={{ padding: '32px 36px 80px', maxWidth: 1240, margin: '0 auto' }}>
      <button type="button" onClick={() => setScreen('home')} style={{
        all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
        fontSize: 12, color: 'var(--soft)', marginBottom: 24,
      }}>
        <SIcon name="arrow-l" size={12} /> volver a descubre
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 40, marginBottom: 48 }}>
        <div>
          <div className="s-eyebrow" style={{ marginBottom: 12 }}>{recipe.tags.join(' · ')}</div>
          <h1 className="s-serif" style={{ fontSize: 56, lineHeight: 1.0, letterSpacing: '-0.025em', marginBottom: 20 }}>
            {recipe.title}
          </h1>
          <p style={{ fontSize: 15.5, lineHeight: 1.55, color: 'var(--soft)', marginBottom: 28, textWrap: 'pretty' }}>
            {recipe.blurb}
          </p>

          <div style={{ display: 'flex', gap: 28, marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid var(--hair)' }}>
            <SStat icon="clock" label="tiempo" value={`${recipe.time} min`} />
            <SStat icon="chef" label="dificultad" value={recipe.difficulty} />
            <SStat icon="leaf" label="raciones">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                <button type="button" onClick={() => setServings(Math.max(1, servings - 1))} style={stepperBtn}>−</button>
                <span style={{ fontVariantNumeric: 'tabular-nums', minWidth: 16, textAlign: 'center' }}>{servings}</span>
                <button type="button" onClick={() => setServings(servings + 1)} style={stepperBtn}>+</button>
              </div>
            </SStat>
            <SStat icon="pantry" label="match despensa">
              <SMatchBadge match={match} />
            </SStat>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="s-btn lg terracotta" onClick={startCook}>
              <SIcon name="play" size={14} stroke="#fff" /> entrar en modo cocina
            </button>
            <button type="button" className="s-btn lg ghost" onClick={onSave}>
              <SIcon name={saved ? 'heart-fill' : 'heart'} size={14} stroke={saved ? 'var(--terracotta)' : 'currentColor'} />
              {saved ? 'guardada' : 'guardar'}
            </button>
            <button type="button" className="s-btn lg ghost"><SIcon name="cart" size={14} /> a la lista</button>
          </div>
        </div>

        <div>
          <SPhoto tone={recipe.tone} ratio="4 / 3" label={`foto · ${recipe.id}`} style={{ marginBottom: 12 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[recipe.tone === 'rosa' ? 'oliva' : 'rosa', recipe.tone === 'mostaza' ? 'tinta' : 'mostaza', 'cream'].map((t, i) => (
              <SPhoto key={i} tone={t} ratio="1 / 1" label={`paso ${i + 1}`} />
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 64 }}>
        {/* Ingredientes */}
        <div>
          <h2 className="s-serif" style={{ fontSize: 28, marginBottom: 4 }}>Ingredientes</h2>
          <div className="s-eyebrow" style={{ marginBottom: 20 }}>para {servings} {servings === 1 ? 'ración' : 'raciones'}</div>
          <ul style={{ display: 'flex', flexDirection: 'column' }}>
            {recipe.ingredients.map((ing, i) => {
              const has = pantry.some(p => ing.name.toLowerCase().includes(p));
              const isChecked = checked.has(i);
              return (
                <li key={i} style={{
                  display: 'flex', alignItems: 'baseline', gap: 14,
                  padding: '12px 0',
                  borderBottom: i < recipe.ingredients.length - 1 ? '1px solid var(--hair-2)' : 'none',
                }}>
                  <button type="button" onClick={() => setChecked(c => { const n = new Set(c); n.has(i) ? n.delete(i) : n.add(i); return n; })} style={{
                    all: 'unset', cursor: 'pointer',
                    width: 18, height: 18, borderRadius: 4,
                    border: '1px solid ' + (isChecked ? 'var(--ink)' : 'var(--hair)'),
                    background: isChecked ? 'var(--ink)' : 'transparent',
                    color: 'var(--paper)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, alignSelf: 'center',
                  }}>{isChecked && <SIcon name="check" size={11} />}</button>
                  <span className="s-mono" style={{ width: 88, color: 'var(--soft)', fontSize: 11, flexShrink: 0 }}>
                    {scaleQty(ing.qty, ratio)}
                  </span>
                  <span style={{ flex: 1, fontSize: 14, lineHeight: 1.4, color: isChecked ? 'var(--mute)' : 'var(--ink)', textDecoration: isChecked ? 'line-through' : 'none' }}>
                    {ing.name}
                    {ing.note && <span style={{ color: 'var(--soft)', fontSize: 12.5 }}> · {ing.note}</span>}
                  </span>
                  {!has && <SIcon name="cart" size={13} stroke="var(--terracotta)" />}
                </li>
              );
            })}
          </ul>
          <button type="button" className="s-btn sm ghost" style={{ marginTop: 16 }}>
            <SIcon name="cart" size={12} /> añadir lo que falta a la lista
          </button>
        </div>

        {/* Pasos */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 className="s-serif" style={{ fontSize: 28 }}>Pasos</h2>
            <button type="button" className="s-btn sm" onClick={startCook}>
              <SIcon name="play" size={11} stroke="var(--paper)" /> modo cocina
            </button>
          </div>
          <ol style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {recipe.steps.map((st, i) => (
              <li key={i} style={{
                display: 'flex', gap: 16, padding: '20px 0',
                borderBottom: i < recipe.steps.length - 1 ? '1px solid var(--hair-2)' : 'none',
              }}>
                <span className="s-step-num">{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <h4 style={{ fontSize: 14.5, fontWeight: 500 }}>{st.title}</h4>
                    {st.timer && (
                      <span style={{ fontSize: 11.5, color: 'var(--terracotta)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <SIcon name="timer" size={11} /> {st.timer} min
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--ink-2)', textWrap: 'pretty' }}>{st.body}</p>
                </div>
              </li>
            ))}
          </ol>

          {recipe.notes && (
            <div style={{
              marginTop: 28, padding: '18px 20px',
              background: 'var(--paper-2)', borderLeft: '2px solid var(--terracotta)',
            }}>
              <div className="s-eyebrow" style={{ marginBottom: 4, color: 'var(--terracotta)' }}>nota</div>
              <p style={{ fontSize: 13.5, lineHeight: 1.55 }}>{recipe.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SStat({ icon, label, value, children }) {
  return (
    <div>
      <div className="s-eyebrow" style={{ marginBottom: 6, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <SIcon name={icon} size={11} /> {label}
      </div>
      {value ? <div style={{ fontSize: 14.5, fontWeight: 500 }}>{value}</div> : children}
    </div>
  );
}

const stepperBtn = {
  width: 22, height: 22, borderRadius: '50%',
  border: '1px solid var(--hair)', background: 'var(--paper)',
  fontSize: 13, lineHeight: 1, color: 'var(--ink)', cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
};

// Escala cantidades simples ("200 ml", "1/2 cdta", "2", "al gusto")
function scaleQty(qty, ratio) {
  if (ratio === 1) return qty;
  if (typeof qty !== 'string') return qty;
  if (/^al gusto|un puñado|unas|al final/i.test(qty)) return qty;
  const m = qty.match(/^(\d+(?:[\.,]\d+)?|\d+\/\d+)\s*(.*)$/);
  if (!m) return qty;
  let n = m[1].includes('/')
    ? m[1].split('/').reduce((a, b, i) => i === 0 ? Number(a) : Number(a) / Number(b))
    : Number(m[1].replace(',', '.'));
  n = n * ratio;
  let str = Number.isInteger(n) ? String(n) : n.toFixed(n < 10 ? 1 : 0);
  return `${str} ${m[2]}`.trim();
}

Object.assign(window, { SPantry, SRecipeDetail });
