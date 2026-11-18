import { useState, useMemo, useEffect } from 'react';
import { BLOX_FIGHTING_STYLES } from '../data/fightingStylesData';
import { FightingStyle } from '../types/bloxfruits';
import FightingStyleArtwork from './FightingStyleArtwork';
import FightingStyleDetail from './FightingStyleDetail';
import FightingStyleTrainerMap from './FightingStyleTrainerMap';
import {
  CompareFightingStyles,
  FightingStyleTierList,
  ProgressionAndTracker,
} from './FightingStyleTools';
import { sounds } from '../utils/audio';
import {
  Search,
  CheckCircle2,
  Circle,
  Compass,
  GitCompare,
  Trophy,
  ListChecks,
  BookOpen,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';

type SubTab = 'encyclopedia' | 'trainer-map' | 'compare' | 'tier-list' | 'progression';
type SeaFilter = 'All' | '1' | '2' | '3';
type MasteryFilter = 'All' | 'low' | 'mid' | 'high';
type LockFilter = 'All' | 'unlocked' | 'locked';

const STORAGE_UNLOCKED_KEY = 'bloxy_fs_unlocked_v1';
const STORAGE_MASTERY_KEY = 'bloxy_fs_mastery_v1';

function getCardGlowClasses(theme: FightingStyle['theme']) {
  switch (theme) {
    case 'crimson':
      return {
        border: 'border-red-500/30 hover:border-red-400/75',
        glow: 'hover:shadow-[0_0_28px_-8px_rgba(239,68,68,0.5)]',
        accentText: 'text-red-400',
        bar: 'from-red-500 to-rose-400',
      };
    case 'purple':
      return {
        border: 'border-purple-500/30 hover:border-purple-400/75',
        glow: 'hover:shadow-[0_0_28px_-8px_rgba(168,85,247,0.5)]',
        accentText: 'text-purple-400',
        bar: 'from-purple-500 to-fuchsia-400',
      };
    case 'electric':
    default:
      return {
        border: 'border-sky-500/30 hover:border-sky-400/75',
        glow: 'hover:shadow-[0_0_28px_-8px_rgba(56,189,248,0.5)]',
        accentText: 'text-sky-400',
        bar: 'from-sky-500 to-cyan-400',
      };
  }
}

export default function FightingStylesDatabase() {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('encyclopedia');
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [trainerMapFocusId, setTrainerMapFocusId] = useState<string | null>('godhuman');

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [seaFilter, setSeaFilter] = useState<SeaFilter>('All');
  const [masteryFilter, setMasteryFilter] = useState<MasteryFilter>('All');
  const [lockFilter, setLockFilter] = useState<LockFilter>('All');

  // Persisted Unlock Checklist & Mastery Tracker
  const [unlockedIds, setUnlockedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_UNLOCKED_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore storage failure
    }
    return ['combat'];
  });

  const [masteryMap, setMasteryMap] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MASTERY_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore storage failure
    }
    return { combat: 0 };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_UNLOCKED_KEY, JSON.stringify(unlockedIds));
    } catch {
      // ignore
    }
  }, [unlockedIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MASTERY_KEY, JSON.stringify(masteryMap));
    } catch {
      // ignore
    }
  }, [masteryMap]);

  const handleToggleUnlocked = (id: string) => {
    setUnlockedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleChangeMastery = (id: string, val: number) => {
    const clamped = Math.max(0, Math.min(600, Math.round(val)));
    setMasteryMap((prev) => ({ ...prev, [id]: clamped }));
    if (clamped > 0 && !unlockedIds.includes(id)) {
      setUnlockedIds((prev) => [...prev, id]);
    }
  };

  const handleResetTracker = () => {
    setUnlockedIds(['combat']);
    setMasteryMap({ combat: 0 });
  };

  const filteredStyles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return BLOX_FIGHTING_STYLES.filter((style) => {
      if (seaFilter !== 'All' && style.sea.toString() !== seaFilter) return false;
      if (masteryFilter === 'low' && style.maxMoveMastery > 150) return false;
      if (
        masteryFilter === 'mid' &&
        (style.maxMoveMastery < 151 || style.maxMoveMastery > 330)
      ) {
        return false;
      }
      if (masteryFilter === 'high' && style.maxMoveMastery < 350) return false;

      const isUnlocked = unlockedIds.includes(style.id);
      if (lockFilter === 'unlocked' && !isUnlocked) return false;
      if (lockFilter === 'locked' && isUnlocked) return false;

      if (!q) return true;
      return (
        style.name.toLowerCase().includes(q) ||
        (style.aliases && style.aliases.some((a) => a.toLowerCase().includes(q))) ||
        style.npcName.toLowerCase().includes(q) ||
        style.island.toLowerCase().includes(q) ||
        style.category.toLowerCase().includes(q) ||
        style.moves.some(
          (m) =>
            m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
        )
      );
    });
  }, [searchQuery, seaFilter, masteryFilter, lockFilter, unlockedIds]);

  const selectedStyle = useMemo(
    () => BLOX_FIGHTING_STYLES.find((s) => s.id === selectedStyleId) || null,
    [selectedStyleId]
  );

  const avgMastery = useMemo(() => {
    const total = BLOX_FIGHTING_STYLES.reduce(
      (sum, s) => sum + (masteryMap[s.id] || 0),
      0
    );
    return Math.round(total / BLOX_FIGHTING_STYLES.length);
  }, [masteryMap]);

  const handleInspectStyle = (style: FightingStyle) => {
    setSelectedStyleId(style.id);
    setActiveSubTab('encyclopedia');
  };

  const handleSelectByName = (name: string) => {
    const match = BLOX_FIGHTING_STYLES.find(
      (s) => s.name.toLowerCase() === name.toLowerCase()
    );
    if (match) {
      setSelectedStyleId(match.id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Fighting Styles Header */}
      <section className="rounded-3xl border border-slate-800 bg-[#070b17] p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-widest">
            <span className="text-red-400">Combat Mastery</span>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <span className="text-purple-400">All 3 Seas</span>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <span className="text-sky-400">Wiki-Verified Movesets</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white font-heading tracking-tight">
            Fighting Styles Encyclopedia
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Every live Blox Fruits fighting style from First Sea Combat and Dark Step up to Update 24 Dragon Talon Dojo upgrades, Godhuman, and Sanguine Art—with exact trainer directions, verified cooldowns, PvP/Grind meta rankings, and interactive mastery tracking.
          </p>
        </div>

        {/* Collection Progress Summary */}
        <div className="flex items-center gap-6 px-5 py-4 rounded-2xl bg-[#04060d] border border-slate-800 shrink-0 tabular-nums">
          <div>
            <span className="text-[11px] text-slate-400 block">Styles Unlocked</span>
            <span className="text-xl font-black text-white">
              {unlockedIds.length} <span className="text-slate-500 text-sm">/ {BLOX_FIGHTING_STYLES.length}</span>
            </span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-[11px] text-slate-400 block">Avg Mastery</span>
            <span className="text-xl font-black text-sky-400">
              {avgMastery} <span className="text-slate-500 text-sm">/ 600</span>
            </span>
          </div>
        </div>
      </section>

      {/* Sub-Navigation Bar */}
      <nav
        aria-label="Fighting Styles Encyclopedia Sections"
        className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800"
      >
        {[
          { id: 'encyclopedia', label: `Encyclopedia (${BLOX_FIGHTING_STYLES.length})`, icon: BookOpen },
          { id: 'trainer-map', label: 'Trainer Map', icon: Compass },
          { id: 'compare', label: 'Compare Styles', icon: GitCompare },
          { id: 'tier-list', label: 'Tier List & Meta', icon: Trophy },
          { id: 'progression', label: 'Progression & Tracker', icon: ListChecks },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveSubTab(tab.id as SubTab);
                if (tab.id !== 'encyclopedia') {
                  setSelectedStyleId(null);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Active View Content */}
      {activeSubTab === 'trainer-map' && (
        <FightingStyleTrainerMap
          key={trainerMapFocusId || 'default'}
          initialStyleId={trainerMapFocusId}
          onInspectStyle={handleInspectStyle}
        />
      )}

      {activeSubTab === 'compare' && (
        <CompareFightingStyles onInspectStyle={handleInspectStyle} />
      )}

      {activeSubTab === 'tier-list' && (
        <FightingStyleTierList onInspectStyle={handleInspectStyle} />
      )}

      {activeSubTab === 'progression' && (
        <ProgressionAndTracker
          unlockedIds={unlockedIds}
          masteryMap={masteryMap}
          onToggleUnlocked={handleToggleUnlocked}
          onChangeMastery={handleChangeMastery}
          onResetTracker={handleResetTracker}
          onInspectStyle={handleInspectStyle}
        />
      )}

      {activeSubTab === 'encyclopedia' && selectedStyle && (
        <FightingStyleDetail
          style={selectedStyle}
          allStyles={BLOX_FIGHTING_STYLES}
          isUnlocked={unlockedIds.includes(selectedStyle.id)}
          masteryLevel={masteryMap[selectedStyle.id] || 0}
          onToggleUnlocked={handleToggleUnlocked}
          onChangeMastery={handleChangeMastery}
          onSelectStyleByName={handleSelectByName}
          onBack={() => setSelectedStyleId(null)}
          onOpenTrainerMap={(id) => {
            setTrainerMapFocusId(id);
            setSelectedStyleId(null);
            setActiveSubTab('trainer-map');
          }}
        />
      )}

      {activeSubTab === 'encyclopedia' && !selectedStyle && (
        <div className="space-y-6">
          {/* Search & Filter Toolbar */}
          <div className="p-4 rounded-2xl bg-[#070b17] border border-slate-800 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search styles, trainers (Uzoth, Shafi, Secrets Master), islands, or moves..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#04060d] border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
                />
              </div>

              {/* Sea Filter */}
              <div className="flex items-center gap-1 p-1 bg-[#04060d] rounded-xl border border-slate-800 text-xs shrink-0">
                {(['All', '1', '2', '3'] as const).map((sea) => (
                  <button
                    key={sea}
                    type="button"
                    onClick={() => {
                      setSeaFilter(sea);
                      sounds.playClick();
                    }}
                    className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap shrink-0 cursor-pointer ${
                      seaFilter === sea
                        ? 'bg-sky-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {sea === 'All' ? 'All Seas' : `Sea ${sea}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Mastery & Lock Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-400 font-semibold flex items-center gap-1.5 mr-1">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
                  Max Skill Mastery:
                </span>
                {[
                  { id: 'All', label: 'Any Mastery' },
                  { id: 'low', label: '0–150' },
                  { id: 'mid', label: '151–330' },
                  { id: 'high', label: '350+' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setMasteryFilter(opt.id as MasteryFilter);
                      sounds.playClick();
                    }}
                    className={`px-2.5 py-1 rounded-lg border font-semibold whitespace-nowrap shrink-0 cursor-pointer ${
                      masteryFilter === opt.id
                        ? 'bg-purple-500/20 border-purple-400 text-purple-200'
                        : 'bg-[#04060d] border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                {[
                  { id: 'All', label: 'All' },
                  { id: 'unlocked', label: 'Unlocked' },
                  { id: 'locked', label: 'Locked' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setLockFilter(opt.id as LockFilter);
                      sounds.playClick();
                    }}
                    className={`px-2.5 py-1 rounded-lg border font-semibold whitespace-nowrap shrink-0 cursor-pointer ${
                      lockFilter === opt.id
                        ? 'bg-red-500/20 border-red-400 text-red-200'
                        : 'bg-[#04060d] border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid of Fighting Styles */}
          {filteredStyles.length === 0 ? (
            <div className="p-10 rounded-3xl bg-[#070b17] border border-slate-800 text-center space-y-2">
              <p className="text-base font-bold text-white">No fighting styles match your filters.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSeaFilter('All');
                  setMasteryFilter('All');
                  setLockFilter('All');
                }}
                className="px-4 py-2 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredStyles.map((style) => {
                const isUnlocked = unlockedIds.includes(style.id);
                const mastery = masteryMap[style.id] || 0;
                const glow = getCardGlowClasses(style.theme);

                return (
                  <article
                    key={style.id}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedStyleId(style.id);
                    }}
                    className={`group rounded-3xl bg-[#070b17] border p-5 flex flex-col justify-between space-y-4 cursor-pointer ${glow.border} ${glow.glow}`}
                  >
                    <div className="space-y-4">
                      {/* Card Top Row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <FightingStyleArtwork style={style} size="md" />
                          <div className="min-w-0">
                            <div className="text-[11px] font-bold uppercase tracking-wider truncate">
                              <span className={glow.accentText}>{style.category}</span>
                              <span className="text-slate-600 mx-1" aria-hidden="true">·</span>
                              <span className="text-sky-400">Sea {style.sea}</span>
                            </div>
                            <h2 className="text-xl font-black text-white group-hover:text-sky-300 truncate">
                              {style.name}
                            </h2>
                            <p className="text-[11px] text-slate-400 truncate">
                              {style.npcName} · {style.island}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            sounds.playClick();
                            handleToggleUnlocked(style.id);
                          }}
                          title={isUnlocked ? 'Unlocked' : 'Mark as Unlocked'}
                          aria-label={`Toggle unlocked for ${style.name}`}
                          className={`p-2 rounded-xl border cursor-pointer shrink-0 ${
                            isUnlocked
                              ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400'
                              : 'bg-[#04060d] border-slate-800 text-slate-500 hover:text-white'
                          }`}
                        >
                          {isUnlocked ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {style.description}
                      </p>

                      {/* Costs & Tier Spec Line */}
                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-xs tabular-nums">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Cost</span>
                          <span className="font-bold text-amber-400 truncate block">
                            {style.costBeli > 0
                              ? `$${style.costBeli >= 1000000 ? `${(style.costBeli / 1000000).toFixed(1)}M` : `${(style.costBeli / 1000).toLocaleString()}k`}`
                              : style.costFragments > 0
                                ? `${style.costFragments.toLocaleString()} Frags`
                                : 'Free'}
                            {style.costBeli > 0 && style.costFragments > 0
                              ? ` + ${style.costFragments >= 1000 ? `${style.costFragments / 1000}k` : style.costFragments}F`
                              : ''}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Skill Req</span>
                          <span className="font-bold text-white">
                            {style.maxMoveMastery > 0 ? `Mast. ${style.maxMoveMastery}` : 'M1 (0)'}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">PvP / Grind</span>
                          <span className="font-bold text-purple-300">
                            {style.pvpTier} / {style.grindTier}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Move Keys Preview & Mastery Progress Bar */}
                    <div className="space-y-3 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center justify-between gap-2 text-[11px]">
                        <span className="font-mono text-slate-400">
                          Skills:{' '}
                          <strong className="text-slate-200">
                            {style.moves.map((m) => m.key).join(' · ')}
                          </strong>
                        </span>
                        <span className="font-mono font-bold text-sky-400 tabular-nums">
                          {mastery}/600
                        </span>
                      </div>

                      <div className="w-full h-1.5 rounded-full bg-[#04060d] border border-slate-800 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${glow.bar}`}
                          style={{ width: `${Math.min(100, (mastery / 600) * 100)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs font-bold text-sky-400 group-hover:text-sky-300">
                        <span>Inspect Full Moveset & Trainer</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
