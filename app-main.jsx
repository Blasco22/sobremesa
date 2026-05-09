// app-main.jsx · root component, routing, store wiring
const { useState: uS, useEffect: uE, useRef: uR } = React;
const { makeStore } = window.SOBREMESA;
const { SIcon, AuthScreen, HomeScreen, PantryScreen } = window.SCREENS_1;
const { RecipeScreen, CookScreen, MineScreen, ShoppingScreen, EditScreen, ImportScreen, SettingsScreen } = window.SCREENS_2;

function App() {
  const [user, setUser] = uS(undefined); // undefined = loading, null = guest, obj = logged
  const [authBusy, setAuthBusy] = uS(false);
  const [authError, setAuthError] = uS('');
  const [route, setRoute] = uS({ tab: 'home' }); // {tab, recipe?, mode?}
  const [recipes, setRecipes] = uS([]);
  const [pantry, setPantry] = uS([]);
  const [shopping, setShopping] = uS([]);
  const [toast, setToast] = uS('');
  const [installEvt, setInstallEvt] = uS(null);
  const [darkMode, setDarkMode] = uS(() => localStorage.getItem('sobremesa.dark') === '1');
  const storeRef = uR(null);

  const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 2400); };

  // Dark mode
  uE(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('sobremesa.dark', darkMode ? '1' : '0');
  }, [darkMode]);
  const toggleDark = () => setDarkMode(d => !d);

  // Auth boot
  uE(() => {
    const ready = () => {
      window.FB.getRedirectResult(window.FB.auth).catch(() => {});
      window.FB.onAuthStateChanged(window.FB.auth, (u) => {
        if (u) {
          setUser(u);
        } else {
          const guest = localStorage.getItem('sobremesa.guest') === '1';
          setUser(guest ? null : false);
        }
      });
    };
    if (window.FB) ready(); else window.addEventListener('fb-ready', ready, { once: true });
  }, []);

  // PWA install prompt
  uE(() => {
    const h = (e) => { e.preventDefault(); setInstallEvt(e); };
    window.addEventListener('beforeinstallprompt', h);
    return () => window.removeEventListener('beforeinstallprompt', h);
  }, []);

  // Build store + subscribe when user resolves
  uE(() => {
    if (user === undefined || user === false) return;
    const store = makeStore(user);
    storeRef.current = store;
    const unsub = store.subscribeRecipes((list) => setRecipes(list || []));
    store.getPantry().then(setPantry);
    store.getShopping().then(setShopping);
    return () => unsub && unsub();
  }, [user]);

  const persistPantry = (next) => { setPantry(next); storeRef.current?.setPantry(next); };
  const persistShopping = (next) => { setShopping(next); storeRef.current?.setShopping(next); };

  const signIn = async () => {
    setAuthBusy(true);
    setAuthError('');
    localStorage.removeItem('sobremesa.guest');
    try {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;
      if (isMobile) {
        await window.FB.signInWithRedirect(window.FB.auth, window.FB.googleProvider);
        return;
      }
      await window.FB.signInWithPopup(window.FB.auth, window.FB.googleProvider);
    } catch (e) {
      console.error('Auth error:', e.code, e.message);
      setAuthError(`${e.code || 'error'}: ${e.message}`);
    } finally { setAuthBusy(false); }
  };
  const guestMode = () => { localStorage.setItem('sobremesa.guest', '1'); setUser(null); };
  const logout = async () => {
    await window.FB.signOut(window.FB.auth).catch(() => {});
    setUser(false); // back to auth screen
    setRoute({ tab: 'home' });
  };

  const openRecipe = (r) => setRoute({ ...route, recipe: r, mode: 'view' });
  const startCook = () => setRoute({ ...route, mode: 'cook' });
  const back = () => setRoute({ tab: route.tab });
  const goTab = (tab) => setRoute({ tab });
  const onSaveRecipe = async (r) => {
    await storeRef.current.saveRecipe(r);
    if (storeRef.current.isGuest) {
      const list = await storeRef.current.getRecipes();
      setRecipes(list);
    }
    setRoute({ tab: 'mine' });
    flash('receta guardada');
  };
  const onDeleteRecipe = async (id) => {
    await storeRef.current.deleteRecipe(id);
    if (storeRef.current.isGuest) setRecipes(await storeRef.current.getRecipes());
    setRoute({ tab: 'mine' });
    flash('receta eliminada');
  };
  const uploadPhoto = async (file) => {
    const dataURL = await window.SOBREMESA.compressImage(file);
    return await window.SOBREMESA.uploadPhoto(dataURL);
  };

  const onAddToShopping = (items) => {
    const cur = shopping.slice();
    items.forEach(it => {
      if (cur.some(x => x.name.toLowerCase() === it.name.toLowerCase())) return;
      cur.unshift({ id: 'i-' + Date.now() + Math.random(), name: it.name, cat: window.SOBREMESA.classifyIngredient(it.name), done: false });
    });
    persistShopping(cur);
    flash(`${items.length} ingredientes en la lista`);
  };

  const greet = (() => {
    const h = new Date().getHours();
    if (h < 6) return 'buenas noches';
    if (h < 13) return 'buenos días';
    if (h < 21) return 'buenas tardes';
    return 'buenas noches';
  })();

  if (user === undefined) {
    return <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="spinner"/></div>;
  }
  if (user === false) {
    return <AuthScreen onGuest={guestMode} onSignIn={signIn} busy={authBusy} error={authError}/>;
  }

  // Modal screens (cook, edit, import, settings) take full layer
  if (route.mode === 'cook' && route.recipe) {
    return <CookScreen recipe={route.recipe} onExit={() => setRoute({ ...route, mode: 'view' })}/>;
  }
  if (route.mode === 'edit') {
    return <EditScreen initial={route.recipe} onSave={onSaveRecipe} onCancel={back} onUploadPhoto={uploadPhoto}/>;
  }
  if (route.mode === 'import') {
    return <ImportScreen onParsed={onSaveRecipe} onCancel={back} onUploadPhoto={uploadPhoto}/>;
  }
  if (route.mode === 'settings') {
    return <SettingsScreen user={user} isGuest={!user} recipes={recipes} onLogout={logout} onBack={back} onSignIn={signIn} darkMode={darkMode} toggleDark={toggleDark}/>;
  }

  // Recipe detail (view)
  if (route.recipe) {
    return (
      <>
        <div className="scroll no-tab safe-top">
          <RecipeScreen
            recipe={route.recipe}
            pantry={pantry}
            onBack={back}
            onCook={startCook}
            onEdit={() => setRoute({ ...route, mode: 'edit' })}
            onAddToShopping={onAddToShopping}
            onDelete={() => onDeleteRecipe(route.recipe.id)}
            onFlash={flash}
          />
        </div>
        {toast && <div className={`toast on`}>{toast}</div>}
      </>
    );
  }

  return (
    <>
      <div className="scroll safe-top">
        {route.tab === 'home' && <HomeScreen recipes={recipes} pantryCount={pantry.length} onOpenRecipe={openRecipe} onTab={goTab} greet={greet}/>}
        {route.tab === 'pantry' && <PantryScreen recipes={recipes} pantry={pantry} setPantry={persistPantry} onOpenRecipe={openRecipe}/>}
        {route.tab === 'mine' && <MineScreen recipes={recipes} onOpenRecipe={openRecipe} onNew={() => setRoute({ tab: 'mine', mode: 'edit' })} onImport={() => setRoute({ tab: 'mine', mode: 'import' })}/>}
        {route.tab === 'shopping' && <ShoppingScreen shopping={shopping} setShopping={persistShopping}/>}
      </div>

      {installEvt && (
        <div className="install-banner" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50 }}>
          <SIcon name="arrow-up" size={14} stroke="var(--cream)"/>
          <span>instala Sobremesa en tu pantalla de inicio</span>
          <button type="button" onClick={async () => { installEvt.prompt(); const r = await installEvt.userChoice; setInstallEvt(null); }}>instalar</button>
          <button type="button" className="x" onClick={() => setInstallEvt(null)}>×</button>
        </div>
      )}

      <nav className="tabbar">
        <button type="button" className={route.tab === 'home' ? 'active' : ''} onClick={() => goTab('home')}>
          <SIcon name="home" size={20}/><span>descubre</span>
        </button>
        <button type="button" className={route.tab === 'pantry' ? 'active' : ''} onClick={() => goTab('pantry')}>
          <SIcon name="pantry" size={20}/><span>despensa</span>
        </button>
        <button type="button" onClick={() => setRoute({ tab: 'mine', mode: 'edit' })}>
          <span className="fab"><SIcon name="plus" size={20} stroke="#fff"/></span>
        </button>
        <button type="button" className={route.tab === 'mine' ? 'active' : ''} onClick={() => goTab('mine')}>
          <SIcon name="book" size={20}/><span>recetario</span>
        </button>
        <button type="button" className={route.tab === 'shopping' ? 'active' : ''} onClick={() => goTab('shopping')}>
          <SIcon name="cart" size={20}/><span>lista</span>
        </button>
      </nav>

      <button type="button" onClick={() => setRoute({ ...route, mode: 'settings' })} style={{
        all: 'unset', cursor: 'pointer', position: 'absolute',
        top: 'max(14px, env(safe-area-inset-top, 14px))', right: 16,
        width: 36, height: 36, borderRadius: '50%', background: 'var(--paper)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 4,
      }}><SIcon name="settings" size={15}/></button>

      {toast && <div className="toast on">{toast}</div>}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App/>);
