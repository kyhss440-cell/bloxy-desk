import { useState, useMemo, useEffect } from 'react';
import { BLOX_SECRET_QUESTS, FIRST_SEA_ISLAND_SECRETS } from '../data/secretQuestsData';
import { SecretQuest } from '../types/bloxfruits';
import { sounds } from '../utils/audio';
import {
  Search,
  CheckCircle2,
  Circle,
  ScrollText,
  MapPin,
  AlertTriangle,
  Award,
  KeyRound,
  RotateCcw,
  Star,
  Compass,
  Sparkles,
} from 'lucide-react';

type ViewMode = 'first_sea_stars' | 'classic_quests';
type SeaFilter = 'All' | '1' | '2' | '3';
type CategoryFilter = 'All' | SecretQuest['category'];

const STORAGE_COMPLETED_KEY = 'bloxy_secret_quests_done_v1';
const STORAGE_STEPS_KEY = 'bloxy_secret_quests_steps_v1';
const STORAGE_STARS_KEY = 'bloxy_first_sea_stars_v1';

const CATEGORIES: Array<CategoryFilter> = [
  'All',
  'Weapons & Swords',
  'Haki & Combat',
  'Races & Trials',
  'World & Raid Access',
];

interface SecretQuestsGuideProps {
  embedded?: boolean;
}

export default function SecretQuestsGuide({ embedded = false }: SecretQuestsGuideProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('first_sea_stars');
  const [seaFilter, setSeaFilter] = useState<SeaFilter>('All');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // First Sea 3-Star Island Secrets state
  const [completedStars, setCompletedStars] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STARS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [selectedIslandId, setSelectedIslandId] = useState<string>(FIRST_SEA_ISLAND_SECRETS[0].id);

  // Classic unlock quests state
  const [completedQuestIds, setCompletedQuestIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_COMPLETED_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STEPS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_STARS_KEY, JSON.stringify(completedStars));
    } catch {
      // ignore storage failure
    }
  }, [completedStars]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_COMPLETED_KEY, JSON.stringify(completedQuestIds));
    } catch {
      // ignore storage failure
    }
  }, [completedQuestIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_STEPS_KEY, JSON.stringify(checkedSteps));
    } catch {
      // ignore storage failure
    }
  }, [checkedSteps]);

  const totalAvailableStars = useMemo(
    () => FIRST_SEA_ISLAND_SECRETS.reduce((acc, isl) => acc + isl.stars.length, 0),
    []
  );

  const earnedStarsCount = useMemo(
    () =>
      FIRST_SEA_ISLAND_SECRETS.reduce(
        (acc, isl) =>
          acc + isl.stars.filter((st) => Boolean(completedStars[`${isl.id}:${st.starNumber}`])).length,
        0
      ),
    [completedStars]
  );

  const teleportersUnlockedCount = useMemo(
    () =>
      FIRST_SEA_ISLAND_SECRETS.filter(
        (isl) =>
          isl.stars.length === 3 &&
          isl.stars.every((st) => Boolean(completedStars[`${isl.id}:${st.starNumber}`]))
      ).length,
    [completedStars]
  );

  const filteredIslands = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return FIRST_SEA_ISLAND_SECRETS;
    return FIRST_SEA_ISLAND_SECRETS.filter(
      (isl) =>
        isl.islandName.toLowerCase().includes(q) ||
        isl.overview.toLowerCase().includes(q) ||
        isl.stars.some(
          (st) =>
            st.name.toLowerCase().includes(q) ||
            st.howToComplete.toLowerCase().includes(q) ||
            st.triggerType.toLowerCase().includes(q)
        )
    );
  }, [searchQuery]);

  const activeIsland = useMemo(() => {
    const match = filteredIslands.find((isl) => isl.id === selectedIslandId);
    return match || filteredIslands[0] || null;
  }, [filteredIslands, selectedIslandId]);

  const filteredQuests = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return BLOX_SECRET_QUESTS.filter((quest) => {
      if (seaFilter !== 'All' && quest.sea.toString() !== seaFilter) return false;
      if (categoryFilter !== 'All' && quest.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        quest.title.toLowerCase().includes(q) ||
        quest.startingLocation.toLowerCase().includes(q) ||
        quest.keyNpcOrBoss.toLowerCase().includes(q) ||
        quest.reward.toLowerCase().includes(q) ||
        quest.summary.toLowerCase().includes(q) ||
        quest.steps.some((step) => step.toLowerCase().includes(q))
      );
    });
  }, [seaFilter, categoryFilter, searchQuery]);

  const [selectedQuestId, setSelectedQuestId] = useState<string>(BLOX_SECRET_QUESTS[0].id);

  const activeQuest = useMemo(() => {
    const matchInFiltered = filteredQuests.find((q) => q.id === selectedQuestId);
    return matchInFiltered || filteredQuests[0] || null;
  }, [filteredQuests, selectedQuestId]);

  const toggleStar = (islandId: string, starNumber: number) => {
    sounds.playClick();
    const key = `${islandId}:${starNumber}`;
    setCompletedStars((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleAllIslandStars = (islandId: string) => {
    sounds.playClick();
    const isl = FIRST_SEA_ISLAND_SECRETS.find((i) => i.id === islandId);
    if (!isl || isl.stars.length === 0) return;
    const allDone = isl.stars.every((st) => Boolean(completedStars[`${isl.id}:${st.starNumber}`]));
    setCompletedStars((prev) => {
      const next = { ...prev };
      isl.stars.forEach((st) => {
        next[`${isl.id}:${st.starNumber}`] = !allDone;
      });
      return next;
    });
  };

  const toggleQuestCompleted = (id: string) => {
    sounds.playClick();
    setCompletedQuestIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleStep = (questId: string, stepIdx: number) => {
    sounds.playClick();
    const key = `${questId}:${stepIdx}`;
    setCheckedSteps((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const resetProgress = () => {
    sounds.playClick();
    if (viewMode === 'first_sea_stars') {
      setCompletedStars({});
    } else {
      setCompletedQuestIds([]);
      setCheckedSteps({});
    }
  };

  const getIslandEarnedCount = (islandId: string) => {
    const isl = FIRST_SEA_ISLAND_SECRETS.find((i) => i.id === islandId);
    if (!isl) return 0;
    return isl.stars.filter((st) => Boolean(completedStars[`${isl.id}:${st.starNumber}`])).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#070b17] border border-slate-800 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <span>Update 30 First Sea Rework</span>
            <span aria-hidden="true">·</span>
            <span>3 Stars Per Island</span>
            <span aria-hidden="true">·</span>
            <span>Level 3000 Progression</span>
          </div>
          {embedded ? (
            <h3 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight flex items-center gap-3">
              <ScrollText className="w-7 h-7 text-amber-400 shrink-0" />
              <span>First Sea Secret Quests (39 Stars)</span>
            </h3>
          ) : (
            <h1 className="text-3xl sm:text-4xl font-black text-white font-heading tracking-tight flex items-center gap-3">
              <ScrollText className="w-8 h-8 text-amber-400 shrink-0" />
              <span>First Sea Secret Quests (39 Stars)</span>
            </h1>
          )}
          <p className="text-sm text-slate-300 leading-relaxed">
            All 13 First Sea zones hide 3 secret quests worth 1 Star each (39 Stars total, +5 bonus levels each toward Level 3000). Completing 3/3 Stars on an island unlocks its Middle Town Teleporter fast-travel node and Advances Secrets Master progression.
          </p>
        </div>

        <div className="flex items-center gap-5 px-5 py-4 rounded-2xl bg-[#04060d] border border-slate-800 shrink-0 tabular-nums">
          <div>
            <span className="text-[11px] text-slate-400 block">First Sea Stars</span>
            <span className="text-xl font-black text-amber-400">
              {earnedStarsCount}{' '}
              <span className="text-slate-500 text-sm">/ {totalAvailableStars} ★</span>
            </span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-[11px] text-slate-400 block">Islands 3-Starred</span>
            <span className="text-xl font-black text-white">
              {teleportersUnlockedCount}{' '}
              <span className="text-slate-500 text-sm">/ {FIRST_SEA_ISLAND_SECRETS.length}</span>
            </span>
          </div>
        </div>
      </section>

      {/* Mode Switcher */}
      <nav
        aria-label="Secret Quests Sections"
        className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800"
      >
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setViewMode('first_sea_stars');
            setSearchQuery('');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap shrink-0 ${
            viewMode === 'first_sea_stars'
              ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Star className="w-3.5 h-3.5 shrink-0" />
          <span>First Sea 3-Star Secrets ({totalAvailableStars} ★)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setViewMode('classic_quests');
            setSearchQuery('');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap shrink-0 ${
            viewMode === 'classic_quests'
              ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Compass className="w-3.5 h-3.5 shrink-0" />
          <span>Classic Unlock Quests (Sea 1–3)</span>
        </button>
      </nav>

      {/* VIEW 1: FIRST SEA 3-STAR ISLAND SECRETS */}
      {viewMode === 'first_sea_stars' && (
        <div className="space-y-6">
          {/* Search + Secrets Master Tip */}
          <div className="p-4 rounded-2xl bg-[#070b17] border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search First Sea island, puzzle, or Awakened Boss (e.g. Jungle, Yeti, Zipline, Statues)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#04060d] border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Talk to <strong>Secrets Master</strong> in Middle Town during the final 30 mins of each hour to check the next Awakened Boss.</span>
              </div>

              {earnedStarsCount > 0 && (
                <button
                  type="button"
                  onClick={resetProgress}
                  className="px-3 py-2 rounded-xl bg-[#04060d] border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Stars</span>
                </button>
              )}
            </div>
          </div>

          {filteredIslands.length === 0 || !activeIsland ? (
            <div className="p-10 rounded-3xl bg-[#070b17] border border-slate-800 text-center space-y-3">
              <p className="text-base font-bold text-white">No First Sea islands match "{searchQuery}".</p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Show All Islands
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: All First Sea Islands + Star Counts */}
              <div className="lg:col-span-5 p-3 rounded-3xl bg-[#070b17] border border-slate-800 space-y-2 max-h-[700px] overflow-y-auto">
                <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between tabular-nums">
                  <span>First Sea Islands</span>
                  <span>{filteredIslands.length} zones</span>
                </div>

                {filteredIslands.map((island) => {
                  const isSelected = island.id === activeIsland.id;
                  const earned = getIslandEarnedCount(island.id);
                  const max = island.stars.length;
                  const isComplete = max > 0 && earned === max;

                  return (
                    <button
                      key={island.id}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setSelectedIslandId(island.id);
                      }}
                      className={`w-full p-3.5 rounded-2xl text-left border flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 border-amber-500/70'
                          : 'bg-[#04060d] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="min-w-0 space-y-0.5">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <span className="text-amber-400">{island.recommendedLevel}</span>
                          {island.teleporterUnlock && (
                            <>
                              <span aria-hidden="true" className="text-slate-600">·</span>
                              <span className={isComplete ? 'text-emerald-400' : 'text-slate-500'}>
                                {isComplete ? 'Teleporter Unlocked' : 'Unlocks Teleporter'}
                              </span>
                            </>
                          )}
                        </div>
                        <h2 className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                          {island.islandName}
                        </h2>
                      </div>

                      {/* 3-Star Visual Indicator */}
                      <div className="flex items-center gap-1 shrink-0 tabular-nums">
                        {max === 0 ? (
                          <span className="text-[11px] text-slate-500 font-semibold">0 Stars</span>
                        ) : (
                          island.stars.map((st) => {
                            const filled = Boolean(completedStars[`${island.id}:${st.starNumber}`]);
                            return (
                              <Star
                                key={st.starNumber}
                                className={`w-4 h-4 ${
                                  filled
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-700'
                                }`}
                              />
                            );
                          })
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: 3-Star Walkthroughs for Active Island */}
              <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-[#070b17] border border-slate-800 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-800">
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      <span className="text-amber-400">First Sea</span>
                      <span className="mx-2 text-slate-600" aria-hidden="true">·</span>
                      <span>{activeIsland.recommendedLevel}</span>
                      <span className="mx-2 text-slate-600" aria-hidden="true">·</span>
                      <span className="tabular-nums">
                        {getIslandEarnedCount(activeIsland.id)} / {activeIsland.stars.length} Stars
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                      {activeIsland.islandName}
                    </h2>
                    <p className="text-sm text-slate-300 leading-relaxed pt-1">
                      {activeIsland.overview}
                    </p>
                  </div>

                  {activeIsland.stars.length > 0 && (
                    <button
                      type="button"
                      onClick={() => toggleAllIslandStars(activeIsland.id)}
                      className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                        getIslandEarnedCount(activeIsland.id) === activeIsland.stars.length
                          ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                          : 'bg-[#04060d] border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          getIslandEarnedCount(activeIsland.id) === activeIsland.stars.length
                            ? 'text-emerald-400 fill-emerald-400'
                            : 'text-amber-400'
                        }`}
                      />
                      <span>
                        {getIslandEarnedCount(activeIsland.id) === activeIsland.stars.length
                          ? '3/3 Stars Complete'
                          : 'Complete All 3 Stars'}
                      </span>
                    </button>
                  )}
                </div>

                {activeIsland.stars.length === 0 ? (
                  <div className="p-5 rounded-2xl bg-[#04060d] border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    Pirate Starter and Marine Starter islands do not have 3-Star Island Secret quests. Sail to Jungle Island (Level 15+) or Middle Town to begin earning Stars.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeIsland.stars.map((star) => {
                      const isDone = Boolean(completedStars[`${activeIsland.id}:${star.starNumber}`]);
                      return (
                        <div
                          key={star.starNumber}
                          onClick={() => toggleStar(activeIsland.id, star.starNumber)}
                          className={`p-5 rounded-2xl border cursor-pointer space-y-3 ${
                            isDone
                              ? 'bg-emerald-950/20 border-emerald-500/40'
                              : 'bg-[#04060d] border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                <span className="text-amber-400">Star {star.starNumber} of 3</span>
                                <span aria-hidden="true" className="text-slate-600">·</span>
                                <span>{star.triggerType}</span>
                              </div>
                              <h3 className="text-lg font-black text-white flex items-center gap-2">
                                <Star
                                  className={`w-4 h-4 shrink-0 ${
                                    isDone
                                      ? 'text-amber-400 fill-amber-400'
                                      : 'text-slate-500'
                                  }`}
                                />
                                <span>{star.name}</span>
                              </h3>
                            </div>

                            <span
                              className={`p-1.5 rounded-lg border shrink-0 ${
                                isDone
                                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                                  : 'bg-slate-900 border-slate-800 text-slate-500'
                              }`}
                            >
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <Circle className="w-4 h-4" />
                              )}
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            {star.howToComplete}
                          </p>

                          <div className="pt-2 border-t border-slate-800/80 text-xs text-amber-300 font-semibold">
                            Reward: {star.rewardNote}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: CLASSIC UNLOCK QUESTS (SEA 1-3) */}
      {viewMode === 'classic_quests' && (
        <div className="space-y-6">
          {/* Search & Filter Toolbar */}
          <div className="p-4 rounded-2xl bg-[#070b17] border border-slate-800 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search unlock quests, NPCs (Rich Man, Secrets Master, Bartilo), or rewards..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#04060d] border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Sea Tabs */}
              <div className="flex items-center gap-1 p-1 bg-[#04060d] rounded-xl border border-slate-800 text-xs shrink-0 overflow-x-auto">
                {(
                  [
                    { id: 'All', label: `All Seas (${BLOX_SECRET_QUESTS.length})` },
                    { id: '1', label: 'First Sea' },
                    { id: '2', label: 'Second Sea' },
                    { id: '3', label: 'Third Sea' },
                  ] as const
                ).map((sea) => (
                  <button
                    key={sea.id}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setSeaFilter(sea.id);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
                      seaFilter === sea.id
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {sea.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter & Reset */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setCategoryFilter(cat);
                    }}
                    className={`px-3 py-1.5 rounded-lg border font-semibold whitespace-nowrap shrink-0 cursor-pointer ${
                      categoryFilter === cat
                        ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                        : 'bg-[#04060d] border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {completedQuestIds.length > 0 && (
                <button
                  type="button"
                  onClick={resetProgress}
                  className="px-3 py-1.5 rounded-lg bg-[#04060d] border border-slate-800 text-slate-400 hover:text-white font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Progress</span>
                </button>
              )}
            </div>
          </div>

          {filteredQuests.length === 0 || !activeQuest ? (
            <div className="p-10 rounded-3xl bg-[#070b17] border border-slate-800 text-center space-y-3">
              <p className="text-base font-bold text-white">No quests match your filters.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSeaFilter('All');
                  setCategoryFilter('All');
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Quest Selector Column */}
              <div className="lg:col-span-5 p-3 rounded-3xl bg-[#070b17] border border-slate-800 space-y-2 max-h-[680px] overflow-y-auto">
                <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between tabular-nums">
                  <span>Quest List</span>
                  <span>{filteredQuests.length} shown</span>
                </div>

                {filteredQuests.map((quest) => {
                  const isSelected = quest.id === activeQuest.id;
                  const isDone = completedQuestIds.includes(quest.id);

                  return (
                    <button
                      key={quest.id}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setSelectedQuestId(quest.id);
                      }}
                      className={`w-full p-3.5 rounded-2xl text-left border flex items-start justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 border-amber-500/70'
                          : 'bg-[#04060d] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          <span className="text-amber-400">Sea {quest.sea}</span>
                          <span className="mx-1.5 text-slate-600" aria-hidden="true">·</span>
                          <span>{quest.category}</span>
                        </div>
                        <h2 className={`text-sm font-bold leading-snug ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                          {quest.title}
                        </h2>
                        <div className="text-[11px] text-slate-400 truncate">
                          {quest.levelRequirement} · {quest.reward}
                        </div>
                      </div>

                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600 shrink-0 mt-1" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Quest Dossier & Interactive Step Checklist */}
              <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-[#070b17] border border-slate-800 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-800">
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      <span className="text-amber-400">
                        {activeQuest.sea === 1 ? 'First Sea' : activeQuest.sea === 2 ? 'Second Sea' : 'Third Sea'}
                      </span>
                      <span className="mx-2 text-slate-600" aria-hidden="true">·</span>
                      <span>{activeQuest.category}</span>
                      <span className="mx-2 text-slate-600" aria-hidden="true">·</span>
                      <span>{activeQuest.levelRequirement}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                      {activeQuest.title}
                    </h2>
                    <p className="text-sm text-slate-300 leading-relaxed pt-1">
                      {activeQuest.summary}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleQuestCompleted(activeQuest.id)}
                    className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                      completedQuestIds.includes(activeQuest.id)
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                        : 'bg-[#04060d] border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    {completedQuestIds.includes(activeQuest.id) ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Quest Completed</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4" />
                        <span>Mark Completed</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Key Facts */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-[#04060d] border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      Location Route
                    </span>
                    <p className="text-slate-200 font-medium leading-relaxed">
                      {activeQuest.startingLocation}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#04060d] border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                      Prerequisites & Cost
                    </span>
                    <p className="text-slate-200 font-medium leading-relaxed">
                      {activeQuest.costOrPrerequisites}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#04060d] border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      Unlock Reward
                    </span>
                    <p className="text-amber-300 font-bold leading-relaxed">
                      {activeQuest.reward}
                    </p>
                  </div>
                </div>

                {/* Warning Notice if applicable */}
                {activeQuest.warningNote && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{activeQuest.warningNote}</p>
                  </div>
                )}

                {/* Interactive Step-by-Step Walkthrough */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <h3 className="font-bold uppercase tracking-wider text-slate-400">
                      Step-by-Step Walkthrough
                    </h3>
                    <span className="text-slate-400 font-mono tabular-nums">
                      {activeQuest.steps.filter((_, idx) => checkedSteps[`${activeQuest.id}:${idx}`]).length} / {activeQuest.steps.length} done
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {activeQuest.steps.map((step, idx) => {
                      const isStepDone = Boolean(checkedSteps[`${activeQuest.id}:${idx}`]);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleStep(activeQuest.id, idx)}
                          className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 cursor-pointer ${
                            isStepDone
                              ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400'
                              : 'bg-[#04060d] border-slate-800 text-slate-200 hover:border-slate-700'
                          }`}
                        >
                          <span className="mt-0.5 shrink-0">
                            {isStepDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <span className="w-5 h-5 rounded-md bg-slate-900 border border-slate-700 text-[11px] font-bold text-amber-400 flex items-center justify-center tabular-nums">
                                {idx + 1}
                              </span>
                            )}
                          </span>
                          <span className={`text-xs sm:text-sm leading-relaxed ${isStepDone ? 'line-through' : ''}`}>
                            {step}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
