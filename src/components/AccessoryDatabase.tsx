import { useState, useMemo } from 'react';
import { BLOX_ACCESSORIES_DATABASE } from '../data/accessoriesData';
import { BloxAccessory, FruitRarity } from '../types/bloxfruits';
import { sounds } from '../utils/audio';
import { Shield, Search, MapPin, RotateCcw, ArrowUpDown } from 'lucide-react';

interface AccessoryDatabaseProps {
  onSelectAccessory: (acc: BloxAccessory) => void;
}

type RarityFilter = 'All' | FruitRarity;
type AccessorySort = 'rarity_desc' | 'rarity_asc' | 'name_asc' | 'sea_asc';

const RARITY_ORDER: Record<FruitRarity, number> = {
  Mythical: 5,
  Legendary: 4,
  Rare: 3,
  Uncommon: 2,
  Common: 1,
};

const RARITY_TABS: RarityFilter[] = ['All', 'Common', 'Uncommon', 'Rare', 'Legendary', 'Mythical'];

export default function AccessoryDatabase({ onSelectAccessory }: AccessoryDatabaseProps) {
  const [search, setSearch] = useState('');
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>('All');
  const [sortBy, setSortBy] = useState<AccessorySort>('rarity_desc');

  const rarityCounts = useMemo(() => {
    const counts: Record<RarityFilter, number> = {
      All: BLOX_ACCESSORIES_DATABASE.length,
      Common: 0,
      Uncommon: 0,
      Rare: 0,
      Legendary: 0,
      Mythical: 0,
    };
    BLOX_ACCESSORIES_DATABASE.forEach((a) => {
      counts[a.rarity] += 1;
    });
    return counts;
  }, []);

  const filteredAccessories = useMemo(() => {
    const q = search.trim().toLowerCase();
    return BLOX_ACCESSORIES_DATABASE.filter((a) => {
      const matchSearch =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.howToObtain.toLowerCase().includes(q) ||
        a.buffs.some(
          (b) => b.stat.toLowerCase().includes(q) || b.value.toLowerCase().includes(q)
        );
      const matchRarity = rarityFilter === 'All' || a.rarity === rarityFilter;
      return matchSearch && matchRarity;
    }).sort((a, b) => {
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      if (sortBy === 'sea_asc') {
        if (a.sea !== b.sea) return a.sea - b.sea;
        return RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity];
      }
      if (sortBy === 'rarity_asc') {
        const diff = RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity];
        return diff !== 0 ? diff : a.name.localeCompare(b.name);
      }
      const diff = RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity];
      return diff !== 0 ? diff : a.name.localeCompare(b.name);
    });
  }, [search, rarityFilter, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setRarityFilter('All');
    setSortBy('rarity_desc');
    sounds.playClick();
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
        return 'bg-slate-800/70 text-slate-300 border-slate-600/60';
    }
  };

  const getRarityTabActive = (rarity: RarityFilter) => {
    switch (rarity) {
      case 'Mythical':
        return 'bg-purple-600 text-white font-bold';
      case 'Legendary':
        return 'bg-amber-500 text-slate-950 font-bold';
      case 'Rare':
        return 'bg-blue-600 text-white font-bold';
      case 'Uncommon':
        return 'bg-emerald-600 text-white font-bold';
      case 'Common':
        return 'bg-slate-600 text-white font-bold';
      default:
        return 'bg-rose-500 text-white font-bold';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950/20 to-slate-900 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-rose-400 tracking-wide tabular-nums">
              <span>{rarityCounts.All} Total Accessories</span>
              <span aria-hidden="true">·</span>
              <span>{rarityCounts.Common} Common</span>
              <span aria-hidden="true">·</span>
              <span>{rarityCounts.Uncommon} Uncommon</span>
              <span aria-hidden="true">·</span>
              <span>{rarityCounts.Rare} Rare</span>
              <span aria-hidden="true">·</span>
              <span>{rarityCounts.Legendary} Legendary</span>
              <span aria-hidden="true">·</span>
              <span>{rarityCounts.Mythical} Mythical</span>
            </div>
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
              <Shield className="w-8 h-8 text-rose-400 shrink-0" />
              <span>Blox Fruits Accessories & Equipment</span>
            </h2>
            <p className="text-sm text-slate-400">
              Complete directory across all 5 rarity tiers from First Sea Headbands and Dragon Dojo Belts to Leviathan Shield, Kitsune Mask, and Celestial Helmet.
            </p>
          </div>
        </div>

        {/* Rarity Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs w-fit max-w-full">
          {RARITY_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setRarityFilter(tab);
                sounds.playClick();
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors tabular-nums ${
                rarityFilter === tab
                  ? getRarityTabActive(tab)
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab} ({rarityCounts[tab]})
            </button>
          ))}
        </div>

        {/* Search, Sea & Sort Filters */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search accessory name, buff (e.g. +80% Sprint Speed, Dojo Belt, Headband), or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-400"
            />
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as AccessorySort);
                sounds.playClick();
              }}
              aria-label="Sort accessories"
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="rarity_desc" className="bg-slate-950">Rarity (High–Low)</option>
              <option value="rarity_asc" className="bg-slate-950">Rarity (Low–High)</option>
              <option value="sea_asc" className="bg-slate-950">Sea (1–3)</option>
              <option value="name_asc" className="bg-slate-950">Name (A–Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span className="tabular-nums">
          Showing <strong className="text-white">{filteredAccessories.length}</strong> of {rarityCounts.All} accessories
        </span>
        {(search || rarityFilter !== 'All') && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-rose-300 hover:text-white font-semibold cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Accessories Grid or Empty State */}
      {filteredAccessories.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
          <p className="text-base font-bold text-white">No accessories match those filters</p>
          <p className="text-xs text-slate-400">
            Try clearing your search or switching back to All rarities and All Seas.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAccessories.map((acc) => (
            <div
              key={acc.id}
              onClick={() => {
                sounds.playClick();
                onSelectAccessory(acc);
              }}
              className="group p-5 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-rose-400/50 shadow-lg hover:shadow-rose-500/10 transition-all flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                    👑
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md border tracking-wider ${getRarityBadge(
                        acc.rarity
                      )}`}
                    >
                      {acc.rarity}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold">
                      Sea {acc.sea}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-rose-400 transition-colors">
                  {acc.name}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="truncate">{acc.location}</span>
                </div>

                <p className="text-xs text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
                  {acc.description}
                </p>

                {/* Buffs Pills */}
                <div className="mt-4 space-y-1.5">
                  {acc.buffs.map((buff, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 flex justify-between items-center gap-2 text-xs"
                    >
                      <span className="text-slate-400 font-medium truncate">{buff.stat}</span>
                      <span className="font-bold text-rose-300 tabular-nums shrink-0">{buff.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
                <span className="font-semibold text-slate-300 block mb-0.5">Obtain Method:</span>
                <p className="text-[11px] line-clamp-2">{acc.howToObtain}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
