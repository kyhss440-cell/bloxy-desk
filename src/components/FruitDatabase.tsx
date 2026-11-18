import { useState, useMemo } from 'react';
import { BLOX_FRUITS_DATABASE } from '../data/fruitsData';
import { BloxFruit, FruitRarity, FruitCategory } from '../types/bloxfruits';
import { sounds } from '../utils/audio';
import { Search, Sparkles, ChevronDown, ChevronUp, LayoutGrid, Table2, ArrowUpDown } from 'lucide-react';

interface FruitDatabaseProps {
  onSelectFruit: (fruit: BloxFruit) => void;
}

export default function FruitDatabase({ onSelectFruit }: FruitDatabaseProps) {
  const [search, setSearch] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<FruitRarity | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<FruitCategory | 'All'>('All');
  const [sortBy, setSortBy] = useState<'rarity' | 'price' | 'robux' | 'value' | 'name'>('rarity');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [expandedFruitId, setExpandedFruitId] = useState<string | null>(null);

  const rarityWeights: Record<FruitRarity, number> = {
    'Mythical': 5,
    'Legendary': 4,
    'Rare': 3,
    'Uncommon': 2,
    'Common': 1,
  };

  const filteredFruits = useMemo(() => {
    const dir = sortDir === 'asc' ? 1 : -1;
    return BLOX_FRUITS_DATABASE.filter(f => {
      const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.description.toLowerCase().includes(search.toLowerCase()) ||
        (f.tradingValueRange?.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchRarity = selectedRarity === 'All' || f.rarity === selectedRarity;
      const matchCategory = selectedCategory === 'All' || f.category === selectedCategory;
      return matchSearch && matchRarity && matchCategory;
    }).sort((a, b) => {
      if (sortBy === 'rarity') {
        const diff = (rarityWeights[a.rarity] - rarityWeights[b.rarity]) * dir;
        return diff !== 0 ? diff : (a.priceBeli - b.priceBeli) * dir;
      }
      if (sortBy === 'price') return (a.priceBeli - b.priceBeli) * dir;
      if (sortBy === 'robux') return (a.priceRobux - b.priceRobux) * dir;
      if (sortBy === 'value') return (a.tradingValue - b.tradingValue) * dir;
      return a.name.localeCompare(b.name) * (sortBy === 'name' && sortDir === 'desc' ? -1 : 1);
    });
  }, [search, selectedRarity, selectedCategory, sortBy, sortDir]);

  const handleHeaderSort = (col: 'rarity' | 'price' | 'robux' | 'value' | 'name') => {
    sounds.playClick();
    if (sortBy === col) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(col);
      setSortDir(col === 'name' ? 'asc' : 'desc');
    }
  };

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    setExpandedFruitId(expandedFruitId === id ? null : id);
  };

  const getRarityBadge = (rarity: FruitRarity) => {
    switch (rarity) {
      case 'Mythical':
        return 'bg-purple-950/40 text-purple-300 border-purple-500/40 text-glow-purple';
      case 'Legendary':
        return 'bg-amber-950/40 text-amber-300 border-amber-500/40 text-glow-gold';
      case 'Rare':
        return 'bg-blue-950/40 text-blue-300 border-blue-500/40';
      case 'Uncommon':
        return 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-slate-800/60 text-slate-300 border-slate-700/60';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 shadow-xl">
        <h2 className="text-3xl font-black text-white flex items-center gap-3">
          <span className="inline-flex items-center justify-center shrink-0">
            <img
              src="/assets/aistudio/kitsune_transparent.png"
              alt="Kitsune Fruit"
              className="w-10 h-10 object-contain filter drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
            />
          </span>
          Blox Fruits Encyclopedia
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Comprehensive database of all {BLOX_FRUITS_DATABASE.length} Blox Fruits. Filter by rarity, check in-game Beli & Robux prices, explore awakening fragments, and inspect full ability mastery requirements.
        </p>

        {/* Filter & Search Bar */}
        <div className="mt-6 flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search fruit name, skill, or effect..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Rarity Filter */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto text-xs">
            {(['All', 'Mythical', 'Legendary', 'Rare', 'Uncommon', 'Common'] as const).map((r) => (
              <button
                key={r}
                onClick={() => {
                  setSelectedRarity(r);
                  sounds.playClick();
                }}
                className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  selectedRarity === r
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            {(['All', 'Natural', 'Elemental', 'Beast'] as const).map((c) => (
              <button
                key={c}
                onClick={() => {
                  setSelectedCategory(c);
                  sounds.playClick();
                }}
                className={`px-2.5 py-1.5 rounded-lg font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  selectedCategory === c
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Sort selector */}
          <select
            value={sortBy}
            onChange={(e) => {
              const val = e.target.value as 'rarity' | 'price' | 'robux' | 'value' | 'name';
              setSortBy(val);
              setSortDir(val === 'name' ? 'asc' : 'desc');
              sounds.playClick();
            }}
            className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="rarity">Sort: Rarity</option>
            <option value="price">Sort: Beli Price</option>
            <option value="robux">Sort: Perm Robux</option>
            <option value="value">Sort: Physical Value</option>
            <option value="name">Sort: A-Z</option>
          </select>

          {/* Cards / Interactive Table Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs shrink-0">
            <button
              onClick={() => {
                setViewMode('cards');
                sounds.playClick();
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => {
                setViewMode('table');
                sounds.playClick();
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Table2 className="w-3.5 h-3.5" />
              <span>Value Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Price & Trading Value Table View */}
      {viewMode === 'table' ? (
        <div className="rounded-3xl bg-slate-900/85 border border-slate-800 shadow-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-slate-950/50">
            <span className="text-xs font-bold text-slate-300">
              Showing {filteredFruits.length} of {BLOX_FRUITS_DATABASE.length} Blox Fruits · Click any column to sort or row for full moveset
            </span>
            <span className="text-[11px] text-amber-400 font-semibold">
              Beli · Permanent Robux · Physical Trading Values
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/70 text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4">
                    <button
                      onClick={() => handleHeaderSort('name')}
                      className="flex items-center gap-1.5 font-bold hover:text-white cursor-pointer"
                    >
                      <span>Fruit Name</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3.5 px-4">
                    <button
                      onClick={() => handleHeaderSort('rarity')}
                      className="flex items-center gap-1.5 font-bold hover:text-white cursor-pointer"
                    >
                      <span>Rarity</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleHeaderSort('price')}
                      className="inline-flex items-center gap-1.5 font-bold hover:text-white cursor-pointer"
                    >
                      <span>Beli Price</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleHeaderSort('robux')}
                      className="inline-flex items-center gap-1.5 font-bold hover:text-white cursor-pointer"
                    >
                      <span>Permanent Robux Price</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleHeaderSort('value')}
                      className="inline-flex items-center gap-1.5 font-bold hover:text-white cursor-pointer"
                    >
                      <span>Trading Value (Physical)</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-sm">
                {filteredFruits.map((fruit) => (
                  <tr
                    key={fruit.id}
                    onClick={() => {
                      sounds.playClick();
                      onSelectFruit(fruit);
                    }}
                    className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {fruit.image ? (
                          <img
                            src={fruit.image}
                            alt={fruit.name}
                            className="w-7 h-7 object-contain shrink-0 filter drop-shadow-[0_0_6px_rgba(34,211,238,0.45)]"
                          />
                        ) : (
                          <span className="text-xl shrink-0">{fruit.symbol}</span>
                        )}
                        <div>
                          <div className="font-bold text-white group-hover:text-amber-400 transition-colors">
                            {fruit.name}
                          </div>
                          <div className="text-[11px] text-slate-500">{fruit.category} · Demand: {fruit.tradingDemand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md border tracking-wider ${getRarityBadge(fruit.rarity)}`}>
                        {fruit.rarity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-amber-400 tabular-nums">
                      ${fruit.priceBeli.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-cyan-400 tabular-nums">
                      {fruit.priceRobux.toLocaleString()} R$
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-emerald-400 tabular-nums">
                      {fruit.tradingValueRange || `${(fruit.tradingValue / 1000000).toFixed(1)}M`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
      /* Fruits Grid */
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFruits.map((fruit) => {
          const isExpanded = expandedFruitId === fruit.id;
          return (
            <div
              key={fruit.id}
              onClick={() => onSelectFruit(fruit)}
              className="group p-5 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-400/50 shadow-lg hover:shadow-amber-500/10 transition-all flex flex-col justify-between cursor-pointer relative overflow-hidden"
            >
              {/* Top Row: Symbol & Badges */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${fruit.iconBg} p-0.5 shadow-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                    <div className="w-full h-full bg-slate-950/80 rounded-[14px] flex items-center justify-center text-3xl overflow-hidden">
                      {fruit.image ? (
                        <img
                          src={fruit.image}
                          alt={fruit.name}
                          className="w-11 h-11 object-contain filter drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                        />
                      ) : (
                        fruit.symbol
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md border tracking-wider ${getRarityBadge(fruit.rarity)}`}>
                      {fruit.rarity}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {fruit.category}
                    </span>
                  </div>
                </div>

                {/* Name & Pricing */}
                <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                  {fruit.name} Fruit
                </h3>

                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs mt-1.5 text-slate-400">
                  <span className="text-amber-400 font-bold tabular-nums">
                    ${fruit.priceBeli.toLocaleString()} Beli
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-cyan-400 font-semibold tabular-nums">
                    {fruit.priceRobux.toLocaleString()} R$
                  </span>
                  {fruit.tradingValueRange && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-400 font-bold tabular-nums">
                        Trade: {fruit.tradingValueRange}
                      </span>
                    </>
                  )}
                </div>

                <p className="text-xs text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
                  {fruit.description}
                </p>

                {/* Awakening Badge */}
                {fruit.awakening && (
                  <div className="mt-3 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      Awakening Available
                    </span>
                    <span className="text-[11px] font-mono">{fruit.awakening.totalFrags.toLocaleString()} Frags</span>
                  </div>
                )}
              </div>

              {/* Bottom Quick Moves Toggle */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {fruit.abilities.length} Moves · PvP {fruit.pvpTier}
                </span>

                <button
                  onClick={(e) => toggleExpand(fruit.id, e)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                >
                  <span>Moveset</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Expanded Moves Drawer */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-slate-800 space-y-2 text-xs">
                  {fruit.abilities.map((move) => (
                    <div key={move.key} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-amber-300">[{move.key}] {move.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">Mastery {move.mastery}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{move.description}</p>
                    </div>
                  ))}

                  {fruit.awakening && (
                    <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-500/20 text-[11px] text-purple-300">
                      <strong className="block mb-1 text-purple-200">Awakened Moves:</strong>
                      {fruit.awakening.moves.map(m => (
                        <div key={m.key} className="flex justify-between py-0.5">
                          <span>[{m.key}] {m.awakenedName}</span>
                          <span className="font-mono">{m.fragCost} Frags</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
