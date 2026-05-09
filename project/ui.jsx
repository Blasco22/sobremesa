// Sobremesa · UI shared
// Brand mark, cards, photo placeholders, icons, etc.
// All names prefixed S* to avoid global collisions.

const SPalette = ['cream', 'mostaza', 'oliva', 'rosa', 'tinta'];

// ────────────────────────────── Brand
function SBrand({ size = 28, mono = false }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'baseline', gap: 4,
      fontFamily: 'var(--serif)', fontSize: size, lineHeight: 1, color: 'var(--ink)',
      letterSpacing: '-0.015em', fontStyle: 'italic',
    }}>
      <span style={{
        display: 'inline-block', width: size * 0.22, height: size * 0.22,
        borderRadius: '50%', background: mono ? 'var(--ink)' : 'var(--terracotta)',
        marginRight: 2,
      }} />
      sobremesa
    </span>
  );
}

// ────────────────────────────── Photo placeholder
function SPhoto({ tone = 'cream', label = 'foto', height = 200, ratio, style = {}, children }) {
  const s = ratio
    ? { aspectRatio: ratio, ...style }
    : { height, ...style };
  return (
    <div className={`s-photo-ph tone-${tone}`} style={s}>
      <span className="lbl">{label}</span>
      {children}
    </div>
  );
}

// ────────────────────────────── Icons (line, 1.4 stroke)
function SIcon({ name, size = 16, stroke = 'currentColor' }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke, strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'search':   return <svg {...props}><circle cx="11" cy="11" r="6" /><path d="M20 20l-3.5-3.5" /></svg>;
    case 'heart':    return <svg {...props}><path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.4-7 10-7 10z" /></svg>;
    case 'heart-fill': return <svg {...{...props, fill: stroke}}><path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.4-7 10-7 10z" /></svg>;
    case 'clock':    return <svg {...props}><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/></svg>;
    case 'chef':     return <svg {...props}><path d="M7 18h10v3H7zM6 14a3.5 3.5 0 1 1 1.6-6.6A4 4 0 0 1 16 7a3.5 3.5 0 1 1 2 7H6z"/></svg>;
    case 'book':     return <svg {...props}><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4zM5 17a3 3 0 0 1 3-3h11"/></svg>;
    case 'plus':     return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case 'upload':   return <svg {...props}><path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></svg>;
    case 'play':     return <svg {...{...props, fill: stroke}}><path d="M8 5v14l11-7z"/></svg>;
    case 'arrow-r':  return <svg {...props}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case 'arrow-l':  return <svg {...props}><path d="M19 12H5M11 6l-6 6 6 6"/></svg>;
    case 'cart':     return <svg {...props}><path d="M4 5h2l2 11h11l2-8H7"/><circle cx="9" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/></svg>;
    case 'home':     return <svg {...props}><path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"/></svg>;
    case 'pantry':   return <svg {...props}><path d="M5 4h14v6H5zM5 14h14v6H5zM10 4v6M14 14v6"/></svg>;
    case 'check':    return <svg {...props}><path d="M5 12l4 4 10-10"/></svg>;
    case 'x':        return <svg {...props}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case 'menu':     return <svg {...props}><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
    case 'flame':    return <svg {...props}><path d="M12 3c1 4 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3-1-3 0-6 1-8z"/></svg>;
    case 'leaf':     return <svg {...props}><path d="M5 19c0-9 6-14 15-14-1 9-6 14-15 14zM5 19l9-9"/></svg>;
    case 'star':     return <svg {...props}><path d="M12 4l2.4 5 5.6.8-4 4 1 5.5L12 16.5 6.9 19.3l1-5.5-4-4 5.6-.8z"/></svg>;
    case 'timer':    return <svg {...props}><circle cx="12" cy="13" r="7"/><path d="M9 3h6M12 9v4"/></svg>;
    case 'edit':     return <svg {...props}><path d="M4 20h4l11-11-4-4L4 16zM14 6l4 4"/></svg>;
    case 'grid':     return <svg {...props}><rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/></svg>;
    case 'list':     return <svg {...props}><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/></svg>;
    case 'filter':   return <svg {...props}><path d="M4 5h16l-6 8v6l-4-2v-4z"/></svg>;
    case 'pause':    return <svg {...{...props, fill: stroke}}><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>;
    case 'sparkle':  return <svg {...props}><path d="M12 4v6M12 14v6M4 12h6M14 12h6"/></svg>;
    default: return null;
  }
}

// ────────────────────────────── Chip
function SChip({ on, onClick, dot, removable, children }) {
  return (
    <button type="button" className={'s-chip' + (on ? ' is-on' : '')} onClick={onClick}>
      {dot && <span className="dot" />}
      <span>{children}</span>
      {removable && <span className="x">×</span>}
    </button>
  );
}

// ────────────────────────────── Recipe card (grid)
function SRecipeCard({ recipe, onOpen, compact = false }) {
  return (
    <button type="button" onClick={() => onOpen && onOpen(recipe)} style={{
      all: 'unset', cursor: 'pointer', display: 'block', width: '100%',
    }}>
      <div className="s-card" style={{ background: 'var(--paper)' }}>
        <SPhoto tone={recipe.tone} label={`foto · ${recipe.id}`} ratio="4 / 3" />
        <div style={{ padding: compact ? '12px 14px 14px' : '14px 16px 18px' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
            <span className="s-eyebrow">{recipe.tags[0]}</span>
            <span style={{ flex: 1 }} />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'var(--soft)' }}>
              <SIcon name="clock" size={12} /> {recipe.time}m
            </span>
          </div>
          <h3 className="s-serif" style={{
            fontSize: compact ? 19 : 22, lineHeight: 1.15, color: 'var(--ink)',
            marginBottom: compact ? 0 : 6,
          }}>{recipe.title}</h3>
          {!compact && (
            <p style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--soft)', textWrap: 'pretty' }}>
              {recipe.blurb}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

// ────────────────────────────── Match badge (despensa: % de ingredientes que tienes)
function SMatchBadge({ match }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 8px 3px 5px',
      background: match >= 90 ? 'var(--oliva)' : match >= 60 ? 'var(--mostaza)' : 'var(--paper)',
      color: match >= 60 ? '#fff' : 'var(--ink)',
      border: match < 60 ? '1px solid var(--hair)' : 'none',
      borderRadius: 'var(--r-pill)',
      fontSize: 11.5, fontWeight: 500, fontVariantNumeric: 'tabular-nums',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: match >= 60 ? '#fff' : 'var(--terracotta)',
      }} />
      {match}% match
    </span>
  );
}

// ────────────────────────────── Section header (eyebrow + title + link)
function SSectionHead({ eyebrow, title, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 18 }}>
      <div>
        {eyebrow && <div className="s-eyebrow" style={{ marginBottom: 6 }}>{eyebrow}</div>}
        <h2 className="s-serif" style={{ fontSize: 32, lineHeight: 1.05, letterSpacing: '-0.02em' }}>{title}</h2>
      </div>
      <div style={{ flex: 1 }} />
      {action}
    </div>
  );
}

// ────────────────────────────── Tab pill row
function STabs({ tabs, value, onChange, size = 'md' }) {
  return (
    <div style={{
      display: 'inline-flex', gap: 4,
      padding: 4, background: 'var(--paper)', border: '1px solid var(--hair)',
      borderRadius: 'var(--r-pill)',
    }}>
      {tabs.map(t => (
        <button key={t.id} type="button"
          onClick={() => onChange(t.id)}
          style={{
            border: 'none', background: value === t.id ? 'var(--ink)' : 'transparent',
            color: value === t.id ? 'var(--paper)' : 'var(--ink-2)',
            padding: size === 'sm' ? '4px 12px' : '6px 16px',
            borderRadius: 'var(--r-pill)',
            fontSize: size === 'sm' ? 11.5 : 12.5,
            fontWeight: 500,
            transition: 'all .15s ease',
          }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

Object.assign(window, { SBrand, SPhoto, SIcon, SChip, SRecipeCard, SMatchBadge, SSectionHead, STabs, SPalette });
