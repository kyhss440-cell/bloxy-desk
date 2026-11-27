import { useState, useMemo, useEffect } from 'react';
import { BLOX_SWORDS_DATABASE } from '../data/swordsData';
import { BloxSword, FruitRarity, SpecialCollectionKey } from '../types/bloxfruits';
import { sounds } from '../utils/audio';
import SwordArtwork from './SwordArtwork';
import SwordDetailPage from './SwordDetailPage';
import SwordTierListMaker from './Tools/SwordTierListMaker';
import {
  Swords,
  Search,
  CheckCircle2,
  Circle,
  ArrowUpDown,
  ChevronRight,
  RotateCcw,
  Trophy,
  BookOpen,
} from 'lucide-react';

interface SwordDatabaseProps {
  onSelectSword?: (sword: BloxSword) => void;
}

type SortOption =
  | 'rarity_desc'
  | 'price_asc'
  | 'price_desc'
  | 'mastery_asc'
  | 'mastery_desc'
  | 'name_asc';

type CollectionStatusFilter = 'all' | 'collected' | 'missing';

const STORAGE_KEY = 'bloxy_collected_swords_v1';

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

const SPECIAL_COLLECTION_TABS: Array<{ key: SpecialCollectionKey | 'all'; label: string }> = [
  { key: 'all', label: 'All Collections' },
  { key: 'cdk', label: 'Cursed Dual Katana' },
  { key: 'ttk', label: 'True Triple Katana' },
  { key: 'dark_blade', label: 'Dark Blade' },
  { key: 'tushita', label: 'Tushita' },
  { key: 'yama', label: 'Yama' },
  { key: 'shisui', label: 'Shisui / Shizu' },
  { key: 'saddi', label: 'Saddi / Saishi' },
  { key: 'wando', label: 'Wando / Oroshi' },
  { key: 'hallow_scythe', label: 'Hallow Scythe' },
  { key: 'spikey_trident', label: 'Spikey Trident' },
  { key: 'shark_anchor', label: 'Shark Anchor' },
  { key: 'dragonheart', label: 'Dragonheart' },
  { key: 'other', label: 'Other Swords' },
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

export default function SwordDatabase({ onSelectSword: _onSelectSword }: SwordDatabaseProps) {
  const [activeView, setActiveView] = useState<'encyclopedia' | 'tier-list'>('encyclopedia');
  const [search, setSearch] = useState('');
  const [rarityFilter, setRarityFilter] = useState<FruitRarity | 'All'>('All');
  const [collectionFilter, setCollectionFilter] = useState<SpecialCollectionKey | 'all'>('all');
  const [ownedFilter, setOwnedFilter] = useState<CollectionStatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('rarity_desc');
  const [activeSwordId, setActiveSwordId] = useState<string | null>(null);

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
      // Ignore storage quota errors cleanly
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
    setCollectionFilter('all');
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
    BLOX_SWORDS_DATABASE.forEach((s) => {
      counts[s.rarity].total += 1;
      if (collectedIds.includes(s.id)) {
        counts[s.rarity].owned += 1;
      }
    });
    return counts;
  }, [collectedIds]);

  const filteredSwords = useMemo(() => {
    const q = search.trim().toLowerCase();

    const list = BLOX_SWORDS_DATABASE.filter((s) => {
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        (s.legacyName && s.legacyName.toLowerCase().includes(q)) ||
        s.npcOrBoss.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        s.howToObtain.toLowerCase().includes(q) ||
        s.m1.name.toLowerCase().includes(q) ||
        s.moves.some((m) => m.name.toLowerCase().includes(q));

      const matchRarity = rarityFilter === 'All' || s.rarity === rarityFilter;
      const matchCollection =
        collectionFilter === 'all' || s.specialCollections.includes(collectionFilter);
      const isOwned = collectedIds.includes(s.id);
      const matchOwned =
        ownedFilter === 'all' ||
        (ownedFilter === 'collected' && isOwned) ||
        (ownedFilter === 'missing' && !isOwned);

      return matchSearch && matchRarity && matchCollection && matchOwned;
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
        case 'mastery_asc':
          if (a.masteryReqTotal !== b.masteryReqTotal) {
            return a.masteryReqTotal - b.masteryReqTotal;
          }
          return a.name.localeCompare(b.name);
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
  }, [search, rarityFilter, collectionFilter, ownedFilter, sortBy, collectedIds]);

  const activeSword = useMemo(
    () => BLOX_SWORDS_DATABASE.find((s) => s.id === activeSwordId) || null,
    [activeSwordId]
  );

  if (activeSword) {
    const activeIndex = filteredSwords.findIndex((s) => s.id === activeSword.id);
    const navPool = activeIndex >= 0 ? filteredSwords : BLOX_SWORDS_DATABASE;
    const poolIndex = navPool.findIndex((s) => s.id === activeSword.id);
    const prevSword = poolIndex > 0 ? navPool[poolIndex - 1] : null;
    const nextSword = poolIndex >= 0 && poolIndex < navPool.length - 1 ? navPool[poolIndex + 1] : null;

    return (
      <SwordDetailPage
        sword={activeSword}
        isCollected={collectedIds.includes(activeSword.id)}
        onToggleCollected={toggleCollected}
        onBack={() => {
          setActiveSwordId(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectSword={(s) => setActiveSwordId(s.id)}
        prevSword={prevSword}
        nextSword={nextSword}
      />
    );
  }

  const totalCount = BLOX_SWORDS_DATABASE.length;
  const collectedCount = collectedIds.filter((id) =>
    BLOX_SWORDS_DATABASE.some((s) => s.id === id)
  ).length;
  const progressPercent = Math.round((collectedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      {/* Encyclopedia Header & Collection Progress */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-[#0a1124] to-slate-950 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wide">
              <span>Blox Fruits Weapons Compendium</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{totalCount} Verified Swords</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white flex items-center gap-3 font-heading">
              <Swords className="w-8 h-8 text-cyan-400 shrink-0" />
              <span>Complete Blox Fruits Sword Encyclopedia</span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every sword across all three seas from Starter Katana to Cursed Dual Katana, Dragonheart, and Admin exclusives—covering unlock quests, Beli pricing, separate M1/Z/X skills, Blacksmith upgrades, and synergies.
            </p>
          </div>

          {/* Sword Collection Progress Tracker */}
          <div className="w-full lg:w-96 p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3 shrink-0">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200">Sword Collection Progress</span>
              <span className="font-mono font-bold text-cyan-400 tabular-nums">
                {collectedCount} / {totalCount} ({progressPercent}%)
              </span>
            </div>

            <div className="w-full h-2.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 tabular-nums">
              <span>Mythical {rarityCounts.Mythical.owned}/{rarityCounts.Mythical.total}</span>
              <span aria-hidden="true">·</span>
              <span>Legendary {rarityCounts.Legendary.owned}/{rarityCounts.Legendary.total}</span>
              <span aria-hidden="true">·</span>
              <span>Rare {rarityCounts.Rare.owned}/{rarityCounts.Rare.total}</span>
            </div>
          </div>
        </div>

        {/* View Switcher: Encyclopedia vs Tier List */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 w-fit">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveView('encyclopedia');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              activeView === 'encyclopedia'
                ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Encyclopedia ({totalCount})</span>
          </button>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveView('tier-list');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              activeView === 'tier-list'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Tier List & Meta</span>
          </button>
        </div>

        {/* Search, Sort & Sea Controls */}
        {activeView === 'encyclopedia' && (
        <div className="pt-4 border-t border-slate-800/80 space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search sword, legacy name (Wando, Saddi, Shisui, Jitte), NPC, boss, or skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Sort By Price / Mastery */}
            <div className="flex items-center gap-2 shrink-0">
              <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                aria-label="Sort swords"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as SortOption);
                  sounds.playClick();
                }}
                className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="rarity_desc">Sort: Rarity (Highest First)</option>
                <option value="price_asc">Price (Beli): Low to High</option>
                <option value="price_desc">Price (Beli): High to Low</option>
                <option value="mastery_asc">Mastery: Low to High</option>
                <option value="mastery_desc">Mastery: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Rarity Filter Tabs + Collection Status Filter */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs overflow-x-auto">
              {RARITY_TABS.map((tab) => {
                const count =
                  tab.key === 'All' ? totalCount : rarityCounts[tab.key].total;
                return (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setRarityFilter(tab.key);
                      sounds.playClick();
                    }}
                    className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors tabular-nums ${
                      rarityFilter === tab.key
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label} ({count})
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs self-start xl:self-auto shrink-0">
              {([
                { key: 'all', label: 'All Status' },
                { key: 'collected', label: `Collected (${collectedCount})` },
                { key: 'missing', label: `Missing (${totalCount - collectedCount})` },
              ] as const).map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setOwnedFilter(item.key);
                    sounds.playClick();
                  }}
                  className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors tabular-nums ${
                    ownedFilter === item.key
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Special Collections Filter Strip */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 block">
              Special Collections
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {SPECIAL_COLLECTION_TABS.map((col) => (
                <button
                  key={col.key}
                  onClick={() => {
                    setCollectionFilter(col.key);
                    sounds.playClick();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 border transition-colors cursor-pointer ${
                    collectionFilter === col.key
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {col.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        )}
      </section>

      {activeView === 'tier-list' ? (
        <SwordTierListMaker onInspectSword={(s) => setActiveSwordId(s.id)} />
      ) : (
        <>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span className="tabular-nums">
          Showing <strong className="text-white">{filteredSwords.length}</strong> of{' '}
          <strong className="text-white">{totalCount}</strong> swords
        </span>

        {(search ||
          rarityFilter !== 'All' ||
          collectionFilter !== 'all' ||
          ownedFilter !== 'all' ||
          sortBy !== 'rarity_desc') && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {filteredSwords.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
          <p className="text-base font-bold text-white">
            No swords match your current search or filters.
          </p>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try clearing your search query or switching back to All Rarities and All Collections.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
          >
            Show All {totalCount} Swords
          </button>
        </div>
      ) : (
        /* Swords Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSwords.map((sword) => {
            const isOwned = collectedIds.includes(sword.id);
            return (
              <article
                key={sword.id}
                onClick={() => {
                  sounds.playSwordClash();
                  setActiveSwordId(sword.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`group p-5 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border transition-all flex flex-col justify-between cursor-pointer ${
                  isOwned
                    ? 'border-emerald-500/40 hover:border-emerald-400/70'
                    : 'border-slate-800 hover:border-cyan-400/50'
                }`}
              >
                <div>
                  {/* Top Metadata & Collection Toggle */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <SwordArtwork
                        sword={sword}
                        size="md"
                        className="group-hover:scale-105 transition-transform"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider">
                          <span className={getRarityAccent(sword.rarity)}>{sword.rarity}</span>
                          <span className="text-slate-600" aria-hidden="true">·</span>
                          <span className="text-cyan-400">Sea {sword.sea}</span>
                          <span className="text-slate-600" aria-hidden="true">·</span>
                          <span className="text-amber-400">PvP {sword.pvpTier}</span>
                        </div>
                        <h2 className="text-lg font-extrabold text-white group-hover:text-cyan-400 transition-colors truncate mt-0.5">
                          {sword.name}
                        </h2>
                        {sword.legacyName && (
                          <span className="text-[11px] text-slate-400 block truncate">
                            {sword.legacyName}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        sounds.playClick();
                        toggleCollected(sword.id);
                      }}
                      aria-label={isOwned ? `Remove ${sword.name} from collected` : `Mark ${sword.name} as collected`}
                      title={isOwned ? 'Collected' : 'Mark as Collected'}
                      className={`p-2 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                        isOwned
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25'
                          : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {isOwned ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Price & Mastery Strip */}
                  <div className="grid grid-cols-2 gap-3 py-2.5 px-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs mb-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Price / Cost</span>
                      <span className="font-bold text-amber-400 truncate block tabular-nums">
                        {sword.priceDisplay}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Max Mastery Gate</span>
                      <span className="font-bold text-cyan-400 tabular-nums">
                        {sword.masteryReqTotal} Mastery
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                    {sword.description}
                  </p>

                  {/* Separate Skills List (M1, Z, X) */}
                  <div className="space-y-1.5 text-xs">
                    <div className="px-2.5 py-1.5 rounded-lg bg-slate-950/50 border border-slate-800/60 flex items-center justify-between gap-2">
                      <span className="text-slate-300 truncate">
                        <strong className="text-slate-400">[M1]</strong> {sword.m1.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0 tabular-nums">
                        M1
                      </span>
                    </div>
                    {sword.moves.map((m) => (
                      <div
                        key={m.key}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-2"
                      >
                        <span className="font-semibold text-slate-200 truncate">
                          <strong className="text-cyan-400">[{m.key}]</strong> {m.name}
                        </span>
                        <span className="text-[10px] text-amber-400 font-mono shrink-0 tabular-nums">
                          Mast. {m.mastery}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer: NPC / Location + Open Dossier */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3 text-[11px]">
                  <div className="min-w-0 text-slate-400">
                    <span className="text-slate-300 font-semibold block truncate">
                      {sword.npcOrBoss}
                    </span>
                    <span className="truncate block">{sword.location}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-cyan-400 font-bold whitespace-nowrap shrink-0 group-hover:translate-x-0.5 transition-transform">
                    <span>Full Guide</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
        </>
      )}
    </div>
  );
}
