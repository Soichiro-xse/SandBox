import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { habitats, AREAS, POKEMON_NAME_TO_ID, TYPE_COLORS, POKEMON_TYPES, getTerrainIcon, getItemIcon, getHabitatImageUrl } from './data/habitats'
import './App.css'

function getPokemonImageUrl(name, hd = false) {
  const id = POKEMON_NAME_TO_ID[name];
  if (!id) return null;
  if (hd) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  }
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

function getPokemonTypes(name) {
  const id = POKEMON_NAME_TO_ID[name];
  if (!id || !POKEMON_TYPES[id]) return [];
  return POKEMON_TYPES[id];
}

function getAllPokemon() {
  const map = new Map();
  habitats.forEach(h => {
    h.pokemon.forEach(p => {
      if (!map.has(p.name)) {
        map.set(p.name, { name: p.name, habitats: [], conditions: new Set() });
      }
      const entry = map.get(p.name);
      entry.habitats.push({ id: h.id, name: h.name, number: h.number, area: h.area });
      if (p.condition) entry.conditions.add(p.condition);
    });
  });
  return Array.from(map.values()).sort((a, b) => {
    const idA = POKEMON_NAME_TO_ID[a.name] || 9999;
    const idB = POKEMON_NAME_TO_ID[b.name] || 9999;
    return idA - idB;
  });
}

// === Components ===

function TypeBadge({ type }) {
  return (
    <span className="type-badge" style={{ backgroundColor: TYPE_COLORS[type] || '#888' }}>
      {type}
    </span>
  );
}

function ConditionBadge({ condition }) {
  if (!condition) return null;
  const styles = {
    '珍しい': { bg: 'linear-gradient(135deg, #f093fb, #f5576c)', icon: '⭐' },
    '夜': { bg: 'linear-gradient(135deg, #4a00e0, #8e2de2)', icon: '🌙' },
    '昼': { bg: 'linear-gradient(135deg, #f7971e, #ffd200)', icon: '☀️' },
    '雨': { bg: 'linear-gradient(135deg, #4facfe, #00f2fe)', icon: '🌧️' },
  };
  const s = styles[condition] || { bg: '#888', icon: '' };
  return (
    <span className="condition-badge" style={{ background: s.bg }}>
      {s.icon} {condition}
    </span>
  );
}

function ItemTag({ item }) {
  const icon = getItemIcon(item);
  return (
    <span className="item-tag">
      <span className="item-icon">{icon}</span>
      {item}
    </span>
  );
}

function PokemonCard({ pokemon, onClick }) {
  const imgUrl = getPokemonImageUrl(pokemon.name);
  const types = getPokemonTypes(pokemon.name);
  const isRare = pokemon.condition === '珍しい';

  return (
    <div
      className={`pokemon-card ${isRare ? 'rare' : ''}`}
      onClick={() => onClick && onClick(pokemon.name)}
    >
      {isRare && <div className="rare-sparkle" />}
      <div className="pokemon-img-wrapper">
        {imgUrl ? (
          <img src={imgUrl} alt={pokemon.name} loading="lazy" />
        ) : (
          <div className="pokemon-placeholder">?</div>
        )}
      </div>
      <div className="pokemon-info">
        <span className="pokemon-name">{pokemon.name}</span>
        <div className="pokemon-types">
          {types.map(t => <TypeBadge key={t} type={t} />)}
        </div>
        <ConditionBadge condition={pokemon.condition} />
      </div>
    </div>
  );
}

function PokemonModal({ name, onClose }) {
  const id = POKEMON_NAME_TO_ID[name];
  const types = getPokemonTypes(name);
  const hdImg = getPokemonImageUrl(name, true);
  const allPokemon = useMemo(() => getAllPokemon(), []);
  const pokemonData = allPokemon.find(p => p.name === name);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <div className="modal-pokemon-header">
          <div className="modal-pokemon-img">
            {hdImg && <img src={hdImg} alt={name} />}
          </div>
          <div className="modal-pokemon-info">
            <span className="modal-pokemon-id">#{id || '???'}</span>
            <h2 className="modal-pokemon-name">{name}</h2>
            <div className="modal-pokemon-types">
              {types.map(t => <TypeBadge key={t} type={t} />)}
            </div>
            {pokemonData && (
              <div className="modal-conditions">
                {Array.from(pokemonData.conditions).map(c => (
                  <ConditionBadge key={c} condition={c} />
                ))}
              </div>
            )}
          </div>
        </div>
        {pokemonData && (
          <div className="modal-habitats">
            <h3>出現する生息地 ({pokemonData.habitats.length})</h3>
            <div className="modal-habitat-list">
              {pokemonData.habitats.map((h, i) => {
                const area = AREAS.find(a => a.id === h.area);
                return (
                  <div key={i} className="modal-habitat-item" style={{ borderLeftColor: area?.color }}>
                    <img src={getHabitatImageUrl(h.number)} alt="" className="modal-habitat-thumb" loading="lazy" />
                    <div className="modal-habitat-text">
                      <span className="modal-habitat-num">No.{h.number}</span>
                      <span className="modal-habitat-name">{h.name}</span>
                    </div>
                    <span className="modal-habitat-area" style={{ backgroundColor: area?.color }}>
                      {area?.icon}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function HabitatCard({ habitat, area, forceExpanded, onPokemonClick, style }) {
  const [expanded, setExpanded] = useState(false);
  const isOpen = forceExpanded || expanded;
  const habitatImg = getHabitatImageUrl(habitat.number);

  return (
    <div className="habitat-card" style={{ ...style }}>
      <div className="habitat-header" onClick={() => setExpanded(!expanded)}>
        <div className="habitat-visual-row">
          <div className="habitat-img-wrapper">
            <img src={habitatImg} alt={habitat.name} className="habitat-terrain-img" loading="lazy" />
          </div>
          <div className="habitat-info-side">
            <div className="habitat-name-row">
              <span className="habitat-number">No.{habitat.number}</span>
              <span className="habitat-area-tag" style={{ backgroundColor: area.color }}>
                {area.icon} {area.name}
              </span>
            </div>
            <h3 className="habitat-name">{habitat.name}</h3>
            <div className="habitat-pokemon-preview">
              {habitat.pokemon.slice(0, 5).map((p, i) => {
                const img = getPokemonImageUrl(p.name);
                return img ? (
                  <img key={i} src={img} alt="" className="preview-avatar" style={{ zIndex: 5 - i }} loading="lazy" />
                ) : null;
              })}
              {habitat.pokemon.length > 5 && <span className="preview-more">+{habitat.pokemon.length - 5}</span>}
            </div>
          </div>
          <span className={`expand-icon ${isOpen ? 'expanded' : ''}`}>&#9660;</span>
        </div>
        <div className="habitat-meta">
          <div className="habitat-items">
            {habitat.items.map((item, i) => (
              <ItemTag key={i} item={item} />
            ))}
          </div>
        </div>
      </div>
      <div className={`habitat-pokemon-grid-wrapper ${isOpen ? 'open' : ''}`}>
        <div className="habitat-pokemon-grid">
          {habitat.pokemon.map((p, i) => (
            <PokemonCard key={i} pokemon={p} onClick={onPokemonClick} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatsPanel({ filteredHabitats }) {
  const totalPokemon = useMemo(() => {
    const names = new Set();
    filteredHabitats.forEach(h => h.pokemon.forEach(p => names.add(p.name)));
    return names.size;
  }, [filteredHabitats]);

  const rarePokemon = useMemo(() => {
    const names = new Set();
    filteredHabitats.forEach(h =>
      h.pokemon.filter(p => p.condition === '珍しい').forEach(p => names.add(p.name))
    );
    return names.size;
  }, [filteredHabitats]);

  return (
    <div className="stats-panel">
      <div className="stat-item stat-habitat">
        <div className="stat-icon">🏕️</div>
        <span className="stat-number">{filteredHabitats.length}</span>
        <span className="stat-label">生息地</span>
      </div>
      <div className="stat-item stat-pokemon">
        <div className="stat-icon">🐾</div>
        <span className="stat-number">{totalPokemon}</span>
        <span className="stat-label">ポケモン</span>
      </div>
      <div className="stat-item stat-rare">
        <div className="stat-icon">⭐</div>
        <span className="stat-number">{rarePokemon}</span>
        <span className="stat-label">珍しい</span>
      </div>
    </div>
  );
}

function PokemonListView({ searchQuery, onPokemonClick }) {
  const allPokemon = useMemo(() => getAllPokemon(), []);

  const filtered = useMemo(() => {
    if (!searchQuery) return allPokemon;
    const q = searchQuery.toLowerCase();
    return allPokemon.filter(p => p.name.toLowerCase().includes(q));
  }, [allPokemon, searchQuery]);

  return (
    <div className="pokemon-list-view">
      <div className="pokemon-list-count">{filtered.length}匹のポケモン</div>
      <div className="pokemon-list-grid">
        {filtered.map((p) => {
          const id = POKEMON_NAME_TO_ID[p.name];
          const types = getPokemonTypes(p.name);
          const img = getPokemonImageUrl(p.name);
          const isRare = p.conditions.has('珍しい');
          return (
            <div
              key={p.name}
              className={`pokemon-list-card ${isRare ? 'rare' : ''}`}
              onClick={() => onPokemonClick(p.name)}
            >
              {isRare && <div className="rare-sparkle" />}
              <div className="pokemon-list-img">
                {img ? <img src={img} alt={p.name} loading="lazy" /> : <div className="pokemon-placeholder">?</div>}
              </div>
              <div className="pokemon-list-info">
                <span className="pokemon-list-id">#{id || '?'}</span>
                <span className="pokemon-list-name">{p.name}</span>
                <div className="pokemon-types">
                  {types.map(t => <TypeBadge key={t} type={t} />)}
                </div>
                <div className="pokemon-list-habitats-count">
                  📍 {p.habitats.length}ヶ所
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <p>ポケモンが見つかりません</p>
        </div>
      )}
    </div>
  );
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;
  return (
    <button className="scroll-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      ↑
    </button>
  );
}

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [showRareOnly, setShowRareOnly] = useState(false);
  const [expandAll, setExpandAll] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [viewMode, setViewMode] = useState('habitat');
  const [modalPokemon, setModalPokemon] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const filteredHabitats = useMemo(() => {
    return habitats.filter(h => {
      if (selectedArea !== 'all' && h.area !== selectedArea) return false;
      if (showRareOnly && !h.pokemon.some(p => p.condition === '珍しい')) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = h.name.toLowerCase().includes(q);
        const matchPokemon = h.pokemon.some(p => p.name.toLowerCase().includes(q));
        const matchItems = h.items.some(item => item.toLowerCase().includes(q));
        if (!matchName && !matchPokemon && !matchItems) return false;
      }
      return true;
    });
  }, [searchQuery, selectedArea, showRareOnly]);

  const handlePokemonClick = useCallback((name) => {
    setModalPokemon(name);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-bg-orbs">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        <div className="header-content">
          <div className="header-logo">
            <div className="pokeball-icon">
              <div className="pokeball-top" />
              <div className="pokeball-line" />
              <div className="pokeball-center" />
            </div>
          </div>
          <h1>ぽこポケ 生息地図鑑</h1>
          <p className="header-subtitle">全{habitats.length}種の生息地 / ポケモン / アイテム完全攻略</p>
          <div className="header-actions">
            <button
              className="dark-mode-toggle"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="view-tabs">
          <button
            className={`view-tab ${viewMode === 'habitat' ? 'active' : ''}`}
            onClick={() => setViewMode('habitat')}
          >
            🏕️ 生息地
          </button>
          <button
            className={`view-tab ${viewMode === 'pokemon' ? 'active' : ''}`}
            onClick={() => setViewMode('pokemon')}
          >
            📋 ポケモン
          </button>
        </div>

        <div className="controls">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder={viewMode === 'habitat' ? 'ポケモン・生息地・アイテムで検索...' : 'ポケモン名で検索...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-btn" onClick={() => setSearchQuery('')}>&times;</button>
            )}
          </div>

          {viewMode === 'habitat' && (
            <div className="filter-row">
              <div className="area-filters">
                <button
                  className={`area-btn ${selectedArea === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedArea('all')}
                >
                  全て
                </button>
                {AREAS.map(area => (
                  <button
                    key={area.id}
                    className={`area-btn ${selectedArea === area.id ? 'active' : ''}`}
                    style={selectedArea === area.id ? { backgroundColor: area.color, color: '#fff', borderColor: area.color } : {}}
                    onClick={() => setSelectedArea(area.id)}
                  >
                    {area.icon}
                    <span className="area-btn-text">{area.name}</span>
                  </button>
                ))}
              </div>

              <div className="toggle-row">
                <label className="toggle-label">
                  <div className={`custom-toggle ${showRareOnly ? 'on' : ''}`}>
                    <div className="custom-toggle-knob" />
                  </div>
                  <input
                    type="checkbox"
                    checked={showRareOnly}
                    onChange={e => setShowRareOnly(e.target.checked)}
                    hidden
                  />
                  <span className="toggle-text">⭐ 珍しいのみ</span>
                </label>
                <button
                  className="expand-all-btn"
                  onClick={() => setExpandAll(!expandAll)}
                >
                  {expandAll ? '🔽 閉じる' : '🔼 全て開く'}
                </button>
              </div>
            </div>
          )}
        </div>

        {viewMode === 'habitat' && <StatsPanel filteredHabitats={filteredHabitats} />}

        {viewMode === 'habitat' ? (
          <div className="habitat-list">
            {filteredHabitats.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <p>該当する生息地が見つかりません</p>
              </div>
            ) : (
              filteredHabitats.map((h, idx) => {
                const area = AREAS.find(a => a.id === h.area);
                return (
                  <HabitatCard
                    key={h.id}
                    habitat={h}
                    area={area}
                    forceExpanded={expandAll}
                    onPokemonClick={handlePokemonClick}
                    style={{ animationDelay: `${Math.min(idx * 0.03, 0.5)}s` }}
                  />
                );
              })
            )}
          </div>
        ) : (
          <PokemonListView searchQuery={searchQuery} onPokemonClick={handlePokemonClick} />
        )}
      </main>

      <footer className="app-footer">
        <p>ぽこあポケモン（ぽこポケ）生息地図鑑 非公式ガイド</p>
        <p className="footer-source">
          データ出典: <a href="https://gamewith.jp/pocoapokemon/545406" target="_blank" rel="noopener noreferrer">GameWith</a>
        </p>
      </footer>

      <ScrollToTop />

      {modalPokemon && (
        <PokemonModal name={modalPokemon} onClose={() => setModalPokemon(null)} />
      )}
    </div>
  );
}

export default App
