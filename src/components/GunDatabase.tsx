import { useState, useMemo, useEffect } from 'react';
import { BLOX_GUNS_DATABASE } from '../data/gunsData';
import { BloxGun, FruitRarity } from '../types/bloxfruits';
import { sounds } from '../utils/audio';
import GunArtwork from './GunArtwork';
import {
  Crosshair,
  Search,
  CheckCircle2,
  Circle,
  ArrowUpDown,
  ChevronRight,
  RotateCcw,
  MapPin,
} from 'lucide-react';

interface GunDatabaseProps {
  onSelectGun: (gun: BloxGun) => void;
}

type SortOption =
  | 'rarity_desc'
  | 'price_asc'
  | 'price_desc'
  | 'mastery_desc'
  | 'name_asc';

type CollectionStatusFilter = 'all' | 'collected' | 'missing';

const STORAGE_KEY = 'bloxy_collected_guns_v1';

const RARITY_ORDER: Record<FruitRarity, number> = {
  Mythical: 5,
  Legendary: 4,
  Rare: 3,
  Uncommon: 2,
  Common: 1,
};

const RARITY_TABS: Array<{ key: FruitRarity | 'All'; label: string }> = [
  { key: 'All', label: 'All Rarities' },
  { key: 'Common', label: 'Common' },
  { key: 'Uncommon', label: 'Uncommon' },
  { key: 'Rare', label: 'Rare' },
  { key: 'Legendary', label: 'Legendary' },
  { key: 'Mythical', label: 'Mythical' },
];

function getRarityAccent(rarity: FruitRarity): string {
  switch (rarity) {
    case 'Mythical':
      return 'text-purple-400';
    case 'Legendary':
      return 'text-amber-400';
    case 'Rare':
      return 'text-sky-400';
    case 'Uncommon':
      return 'text-emerald-400';
    default:
      return 'text-slate-300';
  }
}

export default function GunDatabase({ onSelectGun }: GunDatabaseProps) {
  const [search, setSearch] = useState('');
  const [rarityFilter, setRarityFilter] = useState<FruitRarity | 'All'>('All');
  const [ownedFilter, setOwnedFilter] = useState<CollectionStatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('rarity_desc');

  const [collectedIds, setCollectedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collectedIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [collectedIds]);

  const toggleCollected = (id: string) => {
    setCollectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const resetFilters = () => {
    setSearch('');
    setRarityFilter('All');
    setOwnedFilter('all');
    setSortBy('rarity_desc');
    sounds.playClick();
  };

  const rarityCounts = useMemo(() => {
    const counts: Record<FruitRarity, { total: number; owned: number }> = {
      Common: { total: 0, owned: 0 },
      Uncommon: { total: 0, owned: 0 },
      Rare: { total: 0, owned: 0 },
      Legendary: { total: 0, owned: 0 },
      Mythical: { total: 0, owned: 0 },
    };
    BLOX_GUNS_DATABASE.forEach((g) => {
      counts[g.rarity].total += 1;
      if (collectedIds.includes(g.id)) {
        counts[g.rarity].owned += 1;
      }
    });
    return counts;
  }, [collectedIds]);

  const filteredGuns = useMemo(() => {
    const q = search.trim().toLowerCase();

    const list = BLOX_GUNS_DATABASE.filter((g) => {
      const matchSearch =
        !q ||
        g.name.toLowerCase().includes(q) ||
        (g.legacyName && g.legacyName.toLowerCase().includes(q)) ||
        g.npcOrBoss.toLowerCase().includes(q) ||
        g.location.toLowerCase().includes(q) ||
        g.howToObtain.toLowerCase().includes(q) ||
        g.moves.some((m) => m.name.toLowerCase().includes(q));

      const matchRarity = rarityFilter === 'All' || g.rarity === rarityFilter;
      const isOwned = collectedIds.includes(g.id);
      const matchOwned =
        ownedFilter === 'all' ||
        (ownedFilter === 'collected' && isOwned) ||
        (ownedFilter === 'missing' && !isOwned);

      return matchSearch && matchRarity && matchOwned;
    });

    return [...list].sort((a, b) => {
      switch (sortBy) {
        case 'price_asc': {
          const pa = a.priceBeli ?? Number.MAX_SAFE_INTEGER;
          const pb = b.priceBeli ?? Number.MAX_SAFE_INTEGER;
          if (pa !== pb) return pa - pb;
          return a.name.localeCompare(b.name);
        }
        case 'price_desc': {
          const pa = a.priceBeli ?? -1;
          const pb = b.priceBeli ?? -1;
          if (pa !== pb) return pb - pa;
          return RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity];
        }
        case 'mastery_desc':
          if (a.masteryReqTotal !== b.masteryReqTotal) {
            return b.masteryReqTotal - a.masteryReqTotal;
          }
          return RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity];
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'rarity_desc':
        default: {
          const rDiff = RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity];
          if (rDiff !== 0) return rDiff;
          return b.masteryReqTotal - a.masteryReqTotal;
        }
      }
    });
  }, [search, rarityFilter, ownedFilter, sortBy, collectedIds]);

  const totalCount = BLOX_GUNS_DATABASE.length;
  const collectedCount = collectedIds.filter((id) =>
    BLOX_GUNS_DATABASE.some((g) => g.id === id)
  ).length;
  const progressPercent = Math.round((collectedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      {/* Header & Collection Tracker */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-[#120c26] to-slate-950 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-violet-400 tracking-wide">
              <span>Blox Fruits Ranged Arsenal</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{totalCount} Firearms & Launchers</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white flex items-center gap-3">
              <Crosshair className="w-8 h-8 text-violet-400 shrink-0" />
              <span>Guns & Ranged Weapons</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every gun from Starter Slingshot to Dragonstorm and Skull Guitar. Compare M1 fire modes, Instinct-breaking Z/X skills, NPC unlock paths, and Blacksmith Grade upgrades.
            </p>
          </div>

          {/* Collection Progress Summary */}
          <div className="w-full lg:w-72 p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2.5 shrink-0">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Arsenal Owned</span>
              <span className="font-mono font-bold text-violet-300 tabular-nums">
                {collectedCount} / {totalCount} ({progressPercent}%)
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-amber-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 tabular-nums">
              <span>Mythical: {rarityCounts.Mythical.owned}/{rarityCounts.Mythical.total}</span>
              <span aria-hidden="true">·</span>
              <span>Legendary: {rarityCounts.Legendary.owned}/{rarityCounts.Legendary.total}</span>
            </div>
          </div>
        </div>

        {/* Search, Sea Filter & Sort Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search gun name, legacy name (e.g. Soul Guitar), boss, or move..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
            />
          </div>

          {/* Sort Select */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as SortOption);
                sounds.playClick();
              }}
              aria-label="Sort guns"
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="rarity_desc" className="bg-slate-950">Sort: Rarity (Highest)</option>
              <option value="mastery_desc" className="bg-slate-950">Sort: Mastery Required</option>
              <option value="price_asc" className="bg-slate-950">Sort: Beli Price (Lowest)</option>
              <option value="price_desc" className="bg-slate-950">Sort: Beli Price (Highest)</option>
              <option value="name_asc" className="bg-slate-950">Sort: Name (A–Z)</option>
            </select>
          </div>
        </div>

        {/* Rarity & Ownership Filter Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            {RARITY_TABS.map((tab) => {
              const active = rarityFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setRarityFilter(tab.key);
                    sounds.playClick();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors border ${
                    active
                      ? 'bg-slate-800 text-white border-violet-400/60'
                      : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs self-start sm:self-auto">
            {([
              { key: 'all', label: 'All' },
              { key: 'collected', label: 'Owned' },
              { key: 'missing', label: 'Missing' },
            ] as const).map((opt) => (
              <button
                key={opt.key}
                onClick={() => {
                  setOwnedFilter(opt.key);
                  sounds.playClick();
                }}
                className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  ownedFilter === opt.key
                    ? 'bg-slate-800 text-amber-300'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span className="tabular-nums">
          Showing <strong className="text-white">{filteredGuns.length}</strong> of {totalCount} guns
        </span>
        {(search || rarityFilter !== 'All' || ownedFilter !== 'all') && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-violet-300 hover:text-white font-semibold cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Empty State or Gun Grid */}
      {filteredGuns.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
          <p className="text-base font-bold text-white">No guns match those filters</p>
          <p className="text-xs text-slate-400">
            Try clearing your search or switching back to All Seas / All Rarities.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold cursor-pointer transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGuns.map((gun) => {
            const isOwned = collectedIds.includes(gun.id);
            return (
              <article
                key={gun.id}
                onClick={() => {
                  sounds.playClick();
                  onSelectGun(gun);
                }}
                className="group p-5 rounded-3xl bg-slate-900/85 hover:bg-slate-900 border border-slate-800 hover:border-violet-400/60 shadow-lg transition-all flex flex-col justify-between cursor-pointer"
              >
                <div className="space-y-3">
                  {/* Top Row: Artwork & Owned Toggle */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <GunArtwork gun={gun} size="sm" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-xs font-semibold">
                          <span className={getRarityAccent(gun.rarity)}>{gun.rarity}</span>
                          <span className="text-slate-600" aria-hidden="true">·</span>
                          <span className="text-slate-400 tabular-nums">Sea {gun.sea}</span>
                          <span className="text-slate-600" aria-hidden="true">·</span>
                          <span className="text-amber-400 font-bold">PvP {gun.pvpTier}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors truncate">
                          {gun.name}
                        </h3>
                        {gun.legacyName && (
                          <div className="text-[11px] text-slate-400 truncate">
                            Formerly {gun.legacyName}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCollected(gun.id);
                        sounds.playClick();
                      }}
                      title={isOwned ? 'Mark as missing' : 'Mark as owned'}
                      aria-label={isOwned ? `Mark ${gun.name} as missing` : `Mark ${gun.name} as owned`}
                      className={`p-1.5 rounded-xl border transition-colors shrink-0 cursor-pointer ${
                        isOwned
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                          : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {isOwned ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Location & Obtain */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                    <span className="truncate">{gun.location}</span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {gun.description}
                  </p>

                  {/* Skills Summary */}
                  <div className="pt-1 space-y-1.5 text-xs">
                    {gun.moves.map((m) => (
                      <div
                        key={m.key}
                        className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950/90 border border-slate-800/80"
                      >
                        <span className="font-semibold text-slate-200 truncate">
                          <span className="text-violet-400 font-mono mr-1.5">[{m.key}]</span>
                          {m.name}
                        </span>
                        <span className="text-[11px] font-mono text-amber-400 tabular-nums shrink-0 ml-2">
                          Mast. {m.mastery}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Row */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-amber-300 truncate tabular-nums">
                    {gun.priceDisplay}
                  </span>
                  <span className="flex items-center gap-1 text-violet-300 font-bold group-hover:translate-x-0.5 transition-transform whitespace-nowrap shrink-0">
                    <span>Full Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
