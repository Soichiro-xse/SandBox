import { useState, useMemo } from 'react'
import { habitats, AREAS, POKEMON_NAME_TO_ID, TYPE_COLORS, POKEMON_TYPES } from './data/habitats'
import './App.css'

function getPokemonImageUrl(name) {
  const id = POKEMON_NAME_TO_ID[name];
  if (!id) return null;
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

function getPokemonTypes(name) {
  const id = POKEMON_NAME_TO_ID[name];
  if (!id || !POKEMON_TYPES[id]) return [];
  return POKEMON_TYPES[id];
}

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
    '珍しい': { bg: '#ff6b6b', icon: '⭐' },
    '夜': { bg: '#5c6bc0', icon: '🌙' },
    '昼': { bg: '#ffb74d', icon: '☀️' },
    '雨': { bg: '#42a5f5', icon: '🌧️' },
  };
  const s = styles[condition] || { bg: '#888', icon: '' };
  return (
    <span className="condition-badge" style={{ backgroundColor: s.bg }}>
      {s.icon} {condition}
    </span>
  );
}

function PokemonCard({ pokemon }) {
  const imgUrl = getPokemonImageUrl(pokemon.name);
  const types = getPokemonTypes(pokemon.name);

  return (
    <div className={`pokemon-card ${pokemon.condition === '珍しい' ? 'rare' : ''}`}>
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

function HabitatCard({ habitat, area, forceExpanded }) {
  const [expanded, setExpanded] = useState(false);
  const isOpen = forceExpanded || expanded;

  return (
    <div className="habitat-card" style={{ borderLeftColor: area.color }}>
      <div className="habitat-header" onClick={() => setExpanded(!expanded)}>
        <div className="habitat-title-row">
          <span className="habitat-number">No.{habitat.number}</span>
          <h3 className="habitat-name">{habitat.name}</h3>
          <span className="habitat-area-tag" style={{ backgroundColor: area.color }}>
            {area.icon} {area.name}
          </span>
        </div>
        <div className="habitat-meta">
          <div className="habitat-items">
            {habitat.items.map((item, i) => (
              <span key={i} className="item-tag">{item}</span>
            ))}
          </div>
          <div className="habitat-pokemon-count">
            {habitat.pokemon.length}匹
            <span className={`expand-icon ${isOpen ? 'expanded' : ''}`}>&#9660;</span>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="habitat-pokemon-grid">
          {habitat.pokemon.map((p, i) => (
            <PokemonCard key={i} pokemon={p} />
          ))}
        </div>
      )}
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
      <div className="stat-item">
        <span className="stat-number">{filteredHabitats.length}</span>
        <span className="stat-label">生息地</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">{totalPokemon}</span>
        <span className="stat-label">ポケモン種類</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">{rarePokemon}</span>
        <span className="stat-label">珍しいポケモン</span>
      </div>
    </div>
  );
}

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [showRareOnly, setShowRareOnly] = useState(false);
  const [expandAll, setExpandAll] = useState(false);

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

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>ぽこポケ 生息地図鑑</h1>
          <p className="header-subtitle">ぽこあポケモン 全{habitats.length}種の生息地・出現ポケモン・必要アイテム一覧</p>
        </div>
      </header>

      <main className="app-main">
        <div className="controls">
          <div className="search-box">
            <span className="search-icon">&#128269;</span>
            <input
              type="text"
              placeholder="ポケモン名・生息地名・アイテムで検索..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-btn" onClick={() => setSearchQuery('')}>&#10005;</button>
            )}
          </div>

          <div className="filter-row">
            <div className="area-filters">
              <button
                className={`area-btn ${selectedArea === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedArea('all')}
              >
                すべて
              </button>
              {AREAS.map(area => (
                <button
                  key={area.id}
                  className={`area-btn ${selectedArea === area.id ? 'active' : ''}`}
                  style={selectedArea === area.id ? { backgroundColor: area.color, color: '#fff', borderColor: area.color } : {}}
                  onClick={() => setSelectedArea(area.id)}
                >
                  {area.icon} {area.name}
                </button>
              ))}
            </div>

            <div className="toggle-row">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={showRareOnly}
                  onChange={e => setShowRareOnly(e.target.checked)}
                />
                <span className="toggle-text">珍しいポケモンのみ</span>
              </label>
              <button
                className="expand-all-btn"
                onClick={() => setExpandAll(!expandAll)}
              >
                {expandAll ? '全て閉じる' : '全て開く'}
              </button>
            </div>
          </div>
        </div>

        <StatsPanel filteredHabitats={filteredHabitats} />

        <div className="habitat-list">
          {filteredHabitats.length === 0 ? (
            <div className="no-results">
              <p>該当する生息地が見つかりません</p>
            </div>
          ) : (
            filteredHabitats.map(h => {
              const area = AREAS.find(a => a.id === h.area);
              return (
                <HabitatCard key={h.id} habitat={h} area={area} forceExpanded={expandAll} />
              );
            })
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>ぽこあポケモン（ぽこポケ）生息地図鑑 非公式ガイド</p>
        <p className="footer-source">
          データ出典: <a href="https://gamewith.jp/pocoapokemon/545406" target="_blank" rel="noopener noreferrer">GameWith</a>
        </p>
      </footer>
    </div>
  );
}

export default App
