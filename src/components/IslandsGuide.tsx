import { useState, useEffect, useMemo } from 'react';
import { BLOX_ISLANDS_DATABASE } from '../data/islandsData';
import { IslandLocation } from '../types/bloxfruits';
import { sounds } from '../utils/audio';
import {
  MapPin,
  Compass,
  Users,
  Sparkles,
  Route,
  Star,
  ChevronLeft,
  ChevronRight,
  Map,
  ArrowRight,
  ScrollText,
} from 'lucide-react';
import SecretQuestsGuide from './SecretQuestsGuide';

type SeaSelection = 'all' | 1 | 2 | 3;
type IslandsGuideSection = 'map' | 'secrets';

interface IslandsGuideProps {
  initialSea?: SeaSelection;
  initialSection?: IslandsGuideSection;
}

type RouteOverlayMode = 'leveling' | 'hub' | 'pins';

interface SeaMapConfig {
  image: string | null;
  title: string;
  subtitle: string;
  levelButtonLabel: string;
  hubButtonLabel: string;
  maxWidthClass: string;
}

const SEA_MAP_CONFIGS: Record<1 | 2 | 3, SeaMapConfig> = {
  1: {
    image: '/assets/aistudio/image_ed875d74.png',
    title: 'First Sea Interactive Route Map',
    subtitle: 'Lvl 1 – 700 Progression Path & 39-Star Middle Town Hub',
    levelButtonLabel: 'Leveling Route (Lvl 1–700)',
    hubButtonLabel: '39-Star Hub (Middle Town)',
    maxWidthClass: 'w-full',
  },
  2: {
    image: '/assets/aistudio/image_206fc22b.png',
    title: 'Second Sea Interactive Route Map',
    subtitle: 'Lvl 700 – 1500 Progression Path, Kingdom of Rose Hub & Dark Arena',
    levelButtonLabel: 'Leveling Route (Lvl 700–1500)',
    hubButtonLabel: 'Cafe Hub (Kingdom of Rose)',
    maxWidthClass: 'w-full',
  },
  3: {
    image: '/assets/aistudio/image_4be66a80.png',
    title: 'Third Sea Interactive Route Map',
    subtitle:
      'Lvl 1500 – 3000 Progression Path, Castle on the Sea Portal Hub & Endgame Sea Events',
    levelButtonLabel: 'Leveling Route (Lvl 1500–3000)',
    hubButtonLabel: 'Portal Hub (Castle on the Sea)',
    maxWidthClass: 'w-full',
  },
};

function getStartingLevel(recommendedLevel: string): number {
  const match = recommendedLevel.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

function getPinBadge(island: IslandLocation): string {
  if (!island.mapPosition) return `S${island.sea}`;
  if (island.id === 'marine_starter') return '1M';
  if (island.id === 'dark_arena') return 'R';
  if (island.id === 'castle_on_the_sea') return 'H';
  return String(island.mapPosition.routeOrder);
}

export default function IslandsGuide({
  initialSea = 'all',
  initialSection = 'map',
}: IslandsGuideProps) {
  const [activeSection, setActiveSection] = useState<IslandsGuideSection>(initialSection);
  const [selectedSea, setSelectedSea] = useState<SeaSelection>(initialSea);
  const [activeMapSea, setActiveMapSea] = useState<1 | 2 | 3>(
    initialSea === 'all' ? 1 : initialSea
  );
  const [routeMode, setRouteMode] = useState<RouteOverlayMode>('leveling');
  const [hoveredIslandId, setHoveredIslandId] = useState<string | null>(null);

  const orderedAllIslands = useMemo(() => {
    return [...BLOX_ISLANDS_DATABASE].sort((a, b) => {
      if (a.sea !== b.sea) return a.sea - b.sea;
      if (a.mapPosition && b.mapPosition) {
        if (a.mapPosition.routeOrder !== b.mapPosition.routeOrder) {
          return a.mapPosition.routeOrder - b.mapPosition.routeOrder;
        }
        return 0;
      }
      if (a.mapPosition) return -1;
      if (b.mapPosition) return 1;
      return getStartingLevel(a.recommendedLevel) - getStartingLevel(b.recommendedLevel);
    });
  }, []);

  const [selectedIsland, setSelectedIsland] = useState<IslandLocation>(() => {
    if (initialSea === 'all') {
      return (
        orderedAllIslands.find(isl => isl.id === 'pirate_starter') ||
        orderedAllIslands[0]
      );
    }
    return (
      orderedAllIslands.find(isl => isl.sea === initialSea) || orderedAllIslands[0]
    );
  });

  useEffect(() => {
    setActiveSection(initialSection);
  }, [initialSection]);

  useEffect(() => {
    setSelectedSea(initialSea);
    if (initialSea !== 'all') {
      setActiveMapSea(initialSea);
      const firstInSea = orderedAllIslands.find(isl => isl.sea === initialSea);
      if (firstInSea) setSelectedIsland(firstInSea);
    } else {
      setActiveMapSea(1);
      const firstInSea = orderedAllIslands.find(isl => isl.sea === 1);
      if (firstInSea) setSelectedIsland(firstInSea);
    }
  }, [initialSea, orderedAllIslands]);

  const seaIslands = useMemo(() => {
    if (selectedSea === 'all') return orderedAllIslands;
    return orderedAllIslands.filter(isl => isl.sea === selectedSea);
  }, [orderedAllIslands, selectedSea]);

  const islandsBySea = useMemo(
    () => ({
      1: seaIslands.filter(isl => isl.sea === 1),
      2: seaIslands.filter(isl => isl.sea === 2),
      3: seaIslands.filter(isl => isl.sea === 3),
    }),
    [seaIslands]
  );

  const mappedIslands = useMemo(
    () =>
      orderedAllIslands.filter(
        isl => isl.sea === activeMapSea && Boolean(isl.mapPosition)
      ),
    [orderedAllIslands, activeMapSea]
  );

  const mainRouteIslands = useMemo(
    () =>
      mappedIslands
        .filter(
          isl =>
            isl.id !== 'marine_starter' &&
            isl.id !== 'dark_arena' &&
            isl.id !== 'castle_on_the_sea'
        )
        .sort(
          (a, b) =>
            (a.mapPosition?.routeOrder ?? 0) - (b.mapPosition?.routeOrder ?? 0)
        ),
    [mappedIslands]
  );

  const marineStarter = useMemo(
    () => mappedIslands.find(isl => isl.id === 'marine_starter'),
    [mappedIslands]
  );

  const jungleIsland = useMemo(
    () => mappedIslands.find(isl => isl.id === 'jungle'),
    [mappedIslands]
  );

  const darkArena = useMemo(
    () => mappedIslands.find(isl => isl.id === 'dark_arena'),
    [mappedIslands]
  );

  const hubIsland = useMemo(() => {
    if (activeMapSea === 1) {
      return mappedIslands.find(isl => isl.id === 'middle_town');
    }
    if (activeMapSea === 2) {
      return mappedIslands.find(isl => isl.id === 'kingdom_of_rose');
    }
    return mappedIslands.find(isl => isl.id === 'castle_on_the_sea');
  }, [mappedIslands, activeMapSea]);

  const currentStopIndex = useMemo(
    () => mappedIslands.findIndex(isl => isl.id === selectedIsland.id),
    [mappedIslands, selectedIsland.id]
  );

  const handleSeaChange = (sea: SeaSelection) => {
    sounds.playClick();
    setSelectedSea(sea);
    setHoveredIslandId(null);
    if (sea !== 'all') {
      setActiveMapSea(sea);
      const firstIslandInSea = orderedAllIslands.find(isl => isl.sea === sea);
      if (firstIslandInSea) setSelectedIsland(firstIslandInSea);
    } else {
      setActiveMapSea(1);
    }
  };

  const handleSelectIsland = (island: IslandLocation) => {
    sounds.playClick();
    setSelectedIsland(island);
    setActiveMapSea(island.sea);
  };

  const handleStepStop = (direction: -1 | 1) => {
    if (mappedIslands.length === 0) return;
    const baseIndex = currentStopIndex >= 0 ? currentStopIndex : 0;
    const nextIndex = Math.max(
      0,
      Math.min(mappedIslands.length - 1, baseIndex + direction)
    );
    if (nextIndex !== baseIndex || currentStopIndex < 0) {
      handleSelectIsland(mappedIslands[nextIndex]);
    }
  };

  const getSeaSummary = (sea: SeaSelection) => {
    switch (sea) {
      case 'all':
        return {
          title: 'All Three Seas · Complete Voyage (Lvl 1 – 3000)',
          levelRange: 'Level 1 – 3000 (Max)',
          overview:
            'Unified progression from First Sea (Lvl 1–700, 39 Island Stars) through Second Sea (Lvl 700–1500, Cafe & Awakening Raids) to Third Sea (Lvl 1500–3000, Race V4 & Danger 6 Sea Events).',
        };
      case 1:
        return {
          title: 'First Sea (Old World)',
          levelRange: 'Level 1 – 700',
          overview:
            'The starting proving grounds. Master basic haki (Aura & Instinct), solve the Jungle puzzle for Saber, earn 3 Stars across all 13 islands (39 Stars total), and unlock the Second Sea at Level 700 via the Prison Detective.',
        };
      case 2:
        return {
          title: 'Second Sea (New World)',
          levelRange: 'Level 700 – 1500',
          overview:
            'Home to Kingdom of Rose Cafe, Factory raids, and Hot and Cold Awakening Raids. Master Race V2 & V3, hunt Darkbeard at Dark Arena, forge True Triple Katana, and learn Sharkman Karate & Death Step.',
        };
      case 3:
        return {
          title: 'Third Sea (The Overworld)',
          levelRange: 'Level 1500 – 3000 (Max)',
          overview:
            'The supreme endgame arena. Temple of Time Race V4 awakenings, Cursed Dual Katana, Godhuman martial mastery, Leviathan hunts in Rough Sea Danger 6, and Sanguine Art.',
        };
    }
  };

  const seaInfo = getSeaSummary(selectedSea);
  const seaMap = SEA_MAP_CONFIGS[activeMapSea];
  const totalMainStops = mainRouteIslands.length;

  const renderPinLabelPosition = (x: number, y: number) => {
    const vertical = y < 22 ? 'top-full mt-2' : 'bottom-full mb-2';
    let horizontal = 'left-1/2 -translate-x-1/2';
    if (x < 16) horizontal = 'left-0 translate-x-0';
    else if (x > 82) horizontal = 'right-0 translate-x-0';
    return `${vertical} ${horizontal}`;
  };

  const renderDirectoryItem = (island: IslandLocation) => {
    const isSelected = island.id === selectedIsland.id;
    const orderBadge = getPinBadge(island);

    return (
      <button
        key={island.id}
        onClick={() => handleSelectIsland(island)}
        className={`w-full p-3.5 rounded-2xl text-left border flex items-center justify-between gap-3 cursor-pointer ${
          isSelected
            ? 'bg-slate-800 border-amber-400 shadow-md ring-1 ring-amber-400/20'
            : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`w-7 h-7 rounded-lg text-xs font-black tabular-nums flex items-center justify-center shrink-0 ${
              isSelected
                ? 'bg-amber-500 text-slate-950'
                : island.sea === 1
                ? 'bg-slate-900 text-amber-300 border border-slate-700'
                : island.sea === 2
                ? 'bg-slate-900 text-cyan-300 border border-slate-700'
                : 'bg-slate-900 text-purple-300 border border-slate-700'
            }`}
          >
            {orderBadge}
          </span>
          <div className="min-w-0">
            <h4
              className={`text-sm font-bold truncate ${
                isSelected ? 'text-amber-400' : 'text-white'
              }`}
            >
              {island.name}
            </h4>
            <span className="text-[11px] text-slate-400 tabular-nums">
              Lvl {island.recommendedLevel}
            </span>
          </div>
        </div>
        <MapPin
          className={`w-4 h-4 shrink-0 ${
            isSelected ? 'text-amber-400' : 'text-slate-600'
          }`}
        />
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950/20 to-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
              <Compass className="w-8 h-8 text-cyan-400 shrink-0" />
              Three Seas World Map & Secret Quests
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Explore all {orderedAllIslands.length} islands from Level 1 to 3000, follow interactive sea progression routes, or track all 39 First Sea Secret Quests.
            </p>
          </div>

          {/* Unified Section Switcher: World Map vs Secret Quests */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 self-start shrink-0">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveSection('map');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'map'
                  ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              World Map & Islands
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveSection('secrets');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'secrets'
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ScrollText className="w-3.5 h-3.5" />
              Secret Quests (39 ★)
            </button>
          </div>
        </div>

        {/* Sea Tabs (when World Map is active) */}
        {activeSection === 'map' && (
          <div className="mt-6 flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 max-w-3xl">
            {(
              [
                { key: 'all', label: 'All Three Seas (1–3000)' },
                { key: 1, label: 'Sea 1 (Lvl 1–700)' },
                { key: 2, label: 'Sea 2 (Lvl 700–1500)' },
                { key: 3, label: 'Sea 3 (Lvl 1500–3000)' },
              ] as const
            ).map(tab => (
              <button
                key={String(tab.key)}
                onClick={() => handleSeaChange(tab.key)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedSea === tab.key
                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {activeSection === 'secrets' ? (
        <SecretQuestsGuide embedded />
      ) : (
        <>

      {/* Unified Three Seas Progression Strip (shown when All Seas is active) */}
      {selectedSea === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              sea: 1 as const,
              name: 'First Sea (Old World)',
              levels: 'Lvl 1 – 700',
              transition: 'Unlock Sea 2: Prison Detective + Ice Admiral (Lvl 700)',
              highlights: '15 Map Stops · 39 Island Stars · Saber & Instinct',
              accent: 'text-sky-400',
            },
            {
              sea: 2 as const,
              name: 'Second Sea (New World)',
              levels: 'Lvl 700 – 1500',
              transition: 'Unlock Sea 3: Defeat Don Swan & rip_indra (Lvl 1500)',
              highlights: '9 Map Stops · Cafe Hub · Fruit Raids · Race V2/V3',
              accent: 'text-cyan-400',
            },
            {
              sea: 3 as const,
              name: 'Third Sea (The Overworld)',
              levels: 'Lvl 1500 – 3000',
              transition: 'Endgame: Leviathan · Kitsune Shrine · Draco V4',
              highlights: '8 Map Stops · Castle Hub · Temple of Time V4 · Danger 6',
              accent: 'text-purple-400',
            },
          ].map(stage => {
            const isActiveMap = activeMapSea === stage.sea;
            return (
              <button
                key={stage.sea}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setActiveMapSea(stage.sea);
                  const firstInSea = orderedAllIslands.find(
                    isl => isl.sea === stage.sea
                  );
                  if (firstInSea) setSelectedIsland(firstInSea);
                }}
                className={`p-4 rounded-2xl text-left border cursor-pointer transition-colors space-y-2 ${
                  isActiveMap
                    ? 'bg-slate-900 border-amber-400/70 ring-1 ring-amber-400/20'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-extrabold uppercase tracking-wider ${stage.accent}`}>
                    Sea {stage.sea}
                  </span>
                  <span className="text-xs font-black text-amber-400 tabular-nums">
                    {stage.levels}
                  </span>
                </div>
                <div className="text-base font-black text-white flex items-center justify-between gap-2">
                  <span>{stage.name}</span>
                  <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {stage.highlights}
                </p>
                <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                  {stage.transition}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Sea Overview Box */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-0.5">
            {seaInfo.title}
          </span>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            {seaInfo.overview}
          </p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center shrink-0">
          <span className="text-[10px] uppercase text-slate-500 block">
            Level Bracket
          </span>
          <span className="text-sm font-black text-amber-400 tabular-nums">
            {seaInfo.levelRange}
          </span>
        </div>
      </div>

      {/* Interactive Sea Route Map Panel */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Map className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-black text-white">{seaMap.title}</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{seaMap.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedSea === 'all' && (
              <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
                {([1, 2, 3] as const).map(seaNum => (
                  <button
                    key={seaNum}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setActiveMapSea(seaNum);
                      const firstInSea = orderedAllIslands.find(
                        isl => isl.sea === seaNum
                      );
                      if (firstInSea) setSelectedIsland(firstInSea);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer ${
                      activeMapSea === seaNum
                        ? 'bg-cyan-500 text-slate-950 font-extrabold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Sea {seaNum} Map
                  </button>
                ))}
              </div>
            )}

            {seaMap.image && (
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setRouteMode('leveling');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                    routeMode === 'leveling'
                      ? 'bg-amber-500 text-slate-950 font-extrabold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Route className="w-3.5 h-3.5" />
                  {seaMap.levelButtonLabel}
                </button>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setRouteMode('hub');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                    routeMode === 'hub'
                      ? 'bg-amber-500 text-slate-950 font-extrabold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Star className="w-3.5 h-3.5" />
                  {seaMap.hubButtonLabel}
                </button>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setRouteMode('pins');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                    routeMode === 'pins'
                      ? 'bg-amber-500 text-slate-950 font-extrabold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Pins Only
                </button>
              </div>
            )}
          </div>
        </div>

        {seaMap.image ? (
          <>
            {/* Interactive Map Canvas (renders at natural aspect ratio without cropping) */}
            <div
              className={`relative ${seaMap.maxWidthClass} rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 select-none`}
            >
              <img
                src={seaMap.image}
                alt={seaMap.title}
                referrerPolicy="no-referrer"
                className="w-full h-auto block"
              />

              {/* Subtle edge vignette for marker contrast */}
              <div className="absolute inset-0 bg-slate-950/10 pointer-events-none" />

              {/* SVG Route Overlay */}
              {routeMode !== 'pins' && (
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                >
                  <defs>
                    <marker
                      id="route-arrow-default"
                      viewBox="0 0 10 10"
                      refX="8"
                      refY="5"
                      markerWidth="3.2"
                      markerHeight="3.2"
                      orient="auto-start-reverse"
                    >
                      <path
                        d="M 0 1.5 L 9 5 L 0 8.5 z"
                        fill="rgba(251, 191, 36, 0.85)"
                      />
                    </marker>
                    <marker
                      id="route-arrow-active"
                      viewBox="0 0 10 10"
                      refX="8"
                      refY="5"
                      markerWidth="3.6"
                      markerHeight="3.6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#ffffff" />
                    </marker>
                    <marker
                      id="hub-arrow"
                      viewBox="0 0 10 10"
                      refX="8"
                      refY="5"
                      markerWidth="3"
                      markerHeight="3"
                      orient="auto-start-reverse"
                    >
                      <path
                        d="M 0 1.5 L 9 5 L 0 8.5 z"
                        fill="rgba(56, 189, 248, 0.9)"
                      />
                    </marker>
                  </defs>

                  {routeMode === 'leveling' && (
                    <g>
                      {/* Sea 1 Optional Marine Starter branch -> Jungle */}
                      {marineStarter?.mapPosition && jungleIsland?.mapPosition && (
                        <line
                          x1={marineStarter.mapPosition.x}
                          y1={marineStarter.mapPosition.y}
                          x2={jungleIsland.mapPosition.x}
                          y2={jungleIsland.mapPosition.y}
                          stroke={
                            selectedIsland.id === 'marine_starter'
                              ? '#ffffff'
                              : 'rgba(148, 163, 184, 0.85)'
                          }
                          strokeWidth={
                            selectedIsland.id === 'marine_starter' ? '0.65' : '0.4'
                          }
                          strokeDasharray="1.4 1.1"
                          markerEnd="url(#route-arrow-default)"
                        />
                      )}

                      {/* Sea 2 Raid branch: Kingdom of Rose -> Dark Arena */}
                      {hubIsland?.mapPosition &&
                        darkArena?.mapPosition &&
                        activeMapSea === 2 && (
                          <line
                            x1={hubIsland.mapPosition.x}
                            y1={hubIsland.mapPosition.y}
                            x2={darkArena.mapPosition.x}
                            y2={darkArena.mapPosition.y}
                            stroke={
                              selectedIsland.id === 'dark_arena'
                                ? '#ffffff'
                                : 'rgba(192, 132, 252, 0.85)'
                            }
                            strokeWidth={
                              selectedIsland.id === 'dark_arena' ? '0.7' : '0.42'
                            }
                            strokeDasharray="1.4 1.1"
                            markerEnd="url(#route-arrow-default)"
                          />
                        )}

                      {/* Main Sequential Route Segments */}
                      {mainRouteIslands.slice(0, -1).map((fromIsl, idx) => {
                        const toIsl = mainRouteIslands[idx + 1];
                        if (!fromIsl.mapPosition || !toIsl.mapPosition)
                          return null;
                        const isAdjacentToSelected =
                          fromIsl.id === selectedIsland.id ||
                          toIsl.id === selectedIsland.id;
                        return (
                          <g key={`${fromIsl.id}-${toIsl.id}`}>
                            <line
                              x1={fromIsl.mapPosition.x}
                              y1={fromIsl.mapPosition.y}
                              x2={toIsl.mapPosition.x}
                              y2={toIsl.mapPosition.y}
                              stroke="rgba(2, 6, 23, 0.72)"
                              strokeWidth={isAdjacentToSelected ? '1.1' : '0.75'}
                              strokeLinecap="round"
                            />
                            <line
                              x1={fromIsl.mapPosition.x}
                              y1={fromIsl.mapPosition.y}
                              x2={toIsl.mapPosition.x}
                              y2={toIsl.mapPosition.y}
                              stroke={
                                isAdjacentToSelected
                                  ? '#fbbf24'
                                  : 'rgba(251, 191, 36, 0.7)'
                              }
                              strokeWidth={isAdjacentToSelected ? '0.65' : '0.4'}
                              strokeDasharray={
                                isAdjacentToSelected ? undefined : '1.4 0.9'
                              }
                              strokeLinecap="round"
                              markerEnd={
                                isAdjacentToSelected
                                  ? 'url(#route-arrow-active)'
                                  : 'url(#route-arrow-default)'
                              }
                            />
                          </g>
                        );
                      })}
                    </g>
                  )}

                  {routeMode === 'hub' && hubIsland?.mapPosition && (
                    <g>
                      {mappedIslands
                        .filter(
                          isl =>
                            isl.id !== hubIsland.id &&
                            isl.id !== 'pirate_starter' &&
                            isl.id !== 'marine_starter'
                        )
                        .map(target => {
                          if (!target.mapPosition || !hubIsland.mapPosition)
                            return null;
                          const isSelectedTarget =
                            target.id === selectedIsland.id;
                          return (
                            <g key={`hub-${target.id}`}>
                              <line
                                x1={hubIsland.mapPosition.x}
                                y1={hubIsland.mapPosition.y}
                                x2={target.mapPosition.x}
                                y2={target.mapPosition.y}
                                stroke="rgba(2, 6, 23, 0.7)"
                                strokeWidth={isSelectedTarget ? '1.0' : '0.6'}
                              />
                              <line
                                x1={hubIsland.mapPosition.x}
                                y1={hubIsland.mapPosition.y}
                                x2={target.mapPosition.x}
                                y2={target.mapPosition.y}
                                stroke={
                                  isSelectedTarget
                                    ? '#38bdf8'
                                    : 'rgba(56, 189, 248, 0.55)'
                                }
                                strokeWidth={isSelectedTarget ? '0.6' : '0.34'}
                                strokeDasharray={
                                  isSelectedTarget ? undefined : '1.2 1.0'
                                }
                                markerEnd="url(#hub-arrow)"
                              />
                            </g>
                          );
                        })}
                    </g>
                  )}
                </svg>
              )}

              {/* Clickable Numbered Island Pins */}
              {mappedIslands.map(island => {
                if (!island.mapPosition) return null;
                const { x, y } = island.mapPosition;
                const isSelected = island.id === selectedIsland.id;
                const isHovered = island.id === hoveredIslandId;
                const showLabel = isSelected || isHovered;
                const pinBadge = getPinBadge(island);
                const isHubPin =
                  routeMode === 'hub' && hubIsland && island.id === hubIsland.id;

                return (
                  <div
                    key={island.id}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 ${
                      isSelected ? 'z-30' : isHovered ? 'z-20' : 'z-10'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectIsland(island)}
                      onMouseEnter={() => setHoveredIslandId(island.id)}
                      onMouseLeave={() => setHoveredIslandId(null)}
                      aria-label={`Select ${island.name} (Route Stop ${pinBadge})`}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full font-black text-[11px] sm:text-xs tabular-nums flex items-center justify-center border-2 shadow-lg cursor-pointer transition-transform ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 border-white ring-4 ring-amber-400/40 scale-115'
                          : isHubPin
                          ? 'bg-cyan-400 text-slate-950 border-white ring-4 ring-cyan-400/30 scale-110'
                          : island.id === 'dark_arena' ||
                            island.id === 'castle_on_the_sea'
                          ? 'bg-purple-950/95 text-purple-200 border-purple-400 hover:bg-purple-500 hover:text-white hover:scale-110'
                          : 'bg-slate-950/90 text-amber-300 border-amber-400/80 hover:bg-amber-500 hover:text-slate-950 hover:border-white hover:scale-110'
                      }`}
                    >
                      {pinBadge}
                    </button>

                    {showLabel && (
                      <div
                        className={`absolute ${renderPinLabelPosition(
                          x,
                          y
                        )} px-2.5 py-1 rounded-lg bg-slate-950/95 border border-slate-700 shadow-xl pointer-events-none whitespace-nowrap`}
                      >
                        <div className="text-[11px] font-bold text-white leading-tight">
                          {island.name}
                        </div>
                        <div className="text-[10px] font-semibold text-amber-400 tabular-nums leading-tight">
                          Lvl {island.recommendedLevel}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Route Stepper Controls & Legend */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800">
              <div className="flex items-center gap-3 min-w-0">
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black tabular-nums whitespace-nowrap shrink-0">
                  {selectedIsland.sea === activeMapSea && selectedIsland.mapPosition
                    ? selectedIsland.id === 'dark_arena'
                      ? 'Raid Hub · Dark Arena'
                      : selectedIsland.id === 'castle_on_the_sea'
                      ? 'Portal Hub · Castle on the Sea'
                      : `Stop ${getPinBadge(selectedIsland)} of ${totalMainStops}`
                    : `Sea ${selectedIsland.sea} Selected`}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">
                    {selectedIsland.name}
                  </div>
                  <div className="text-[11px] text-slate-400 tabular-nums">
                    Recommended: {selectedIsland.recommendedLevel}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleStepStop(-1)}
                  disabled={currentStopIndex === 0}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 hover:border-amber-400 hover:text-white disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev Stop
                </button>
                <button
                  type="button"
                  onClick={() => handleStepStop(1)}
                  disabled={
                    currentStopIndex >= 0 &&
                    currentStopIndex >= mappedIslands.length - 1
                  }
                  className="px-3 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-extrabold hover:bg-amber-400 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Next Stop
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-8 rounded-2xl bg-slate-950/80 border border-dashed border-slate-700 text-center space-y-2">
            <MapPin className="w-8 h-8 text-cyan-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">{seaMap.title}</h4>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">
              {seaMap.subtitle}
            </p>
          </div>
        )}
      </div>

      {/* Main Grid: Island List on Left, Deep Dive on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Island Directory List */}
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 max-h-[640px] overflow-y-auto pr-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 block">
            {selectedSea === 'all'
              ? `All Islands (${seaIslands.length})`
              : `Islands in Sea ${selectedSea} (${seaIslands.length})`}
          </span>

          {selectedSea === 'all' ? (
            <div className="space-y-5">
              {([1, 2, 3] as const).map(seaNum => (
                <div key={seaNum} className="space-y-2">
                  <div className="px-2 flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-cyan-400">
                    <span>
                      {seaNum === 1
                        ? 'First Sea · Lvl 1–700'
                        : seaNum === 2
                        ? 'Second Sea · Lvl 700–1500'
                        : 'Third Sea · Lvl 1500–3000'}
                    </span>
                    <span className="text-slate-500 tabular-nums">
                      {islandsBySea[seaNum].length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {islandsBySea[seaNum].map(renderDirectoryItem)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {seaIslands.map(renderDirectoryItem)}
            </div>
          )}
        </div>

        {/* Detailed Island Dossier on Right */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Sea {selectedIsland.sea} Territory
                {selectedIsland.mapPosition
                  ? selectedIsland.id === 'dark_arena'
                    ? ' · Raid Hub'
                    : selectedIsland.id === 'castle_on_the_sea'
                    ? ' · Portal Hub'
                    : ` · Route Stop #${getPinBadge(selectedIsland)}`
                  : ''}
              </span>
              <h3 className="text-3xl font-black text-white mt-1">
                {selectedIsland.name}
              </h3>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-amber-400 tabular-nums shrink-0">
              Recommended: {selectedIsland.recommendedLevel}
            </div>
          </div>

          {/* Secret Pro Tip */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-xs text-amber-200">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-amber-300 font-bold mb-0.5">
                Secret Island Intelligence:
              </strong>
              <p className="leading-relaxed">{selectedIsland.secretTip}</p>
            </div>
          </div>

          {/* NPCs on this Island */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              Key NPCs & Masters ({selectedIsland.npcs.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedIsland.npcs.map((npc, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800"
                >
                  <div className="flex justify-between items-baseline mb-1 gap-2">
                    <span className="text-xs font-bold text-white">
                      {npc.name}
                    </span>
                    <span className="text-[10px] font-semibold text-cyan-400 shrink-0">
                      {npc.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {npc.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Notable Landmarks & Features */}
          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            <span className="font-bold text-slate-400 uppercase tracking-wider block">
              Notable Locations & Features:
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedIsland.notableFeatures.map((feat, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-medium"
                >
                  📍 {feat}
                </span>
              ))}
            </div>
          </div>

          {/* Enemies and Bosses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800 text-xs">
            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Local Enemies:
              </span>
              <ul className="space-y-1 text-slate-300">
                {selectedIsland.enemies.map((e, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0"></span>
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Island Bosses:
              </span>
              <ul className="space-y-1 text-red-400 font-semibold">
                {selectedIsland.bosses.map((b, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
