import { useState, useMemo } from 'react';
import { BLOX_FIGHTING_STYLES } from '../data/fightingStylesData';
import { FightingStyle } from '../types/bloxfruits';
import { TrainerNpcPortrait } from './FightingStyleArtwork';
import { sounds } from '../utils/audio';
import { MapPin, Compass, Coins, AlertTriangle, Navigation, ChevronRight } from 'lucide-react';

interface FightingStyleTrainerMapProps {
  initialStyleId?: string | null;
  onInspectStyle: (style: FightingStyle) => void;
}

type SeaTab = '1' | '2' | '3';

const SEA_MAP_ASSETS: Record<SeaTab, { image: string; title: string }> = {
  '1': {
    image: '/assets/aistudio/image_ed875d74.png',
    title: 'First Sea Map · Combat Trainers',
  },
  '2': {
    image: '/assets/aistudio/image_206fc22b.png',
    title: 'Second Sea Map · Combat Trainers',
  },
  '3': {
    image: '/assets/aistudio/image_4be66a80.png',
    title: 'Third Sea Map · Combat Trainers',
  },
};

const PIN_COORDINATES: Record<string, { x: string; y: string }> = {
  // First Sea (image_ed875d74.png)
  combat: { x: '68%', y: '52%' }, // Pirate Starter
  advanced_combat: { x: '50%', y: '45%' }, // Middle Town
  dark_step: { x: '49%', y: '69%' }, // Pirate Village
  electric: { x: '21%', y: '32%' }, // Lower Skylands
  water_kung_fu: { x: '84%', y: '17%' }, // Underwater City

  // Second Sea (image_206fc22b.png)
  dragon_breath: { x: '82%', y: '77%' }, // Kingdom of Rose
  superhuman: { x: '38%', y: '22%' }, // Snow Mountain
  death_step: { x: '22%', y: '74%' }, // Ice Castle
  sharkman_karate: { x: '50%', y: '51%' }, // Forgotten Island

  // Third Sea (image_4be66a80.png)
  electric_claw: { x: '20%', y: '61%' }, // Floating Turtle (Previous Hero)
  godhuman: { x: '26%', y: '75%' }, // Floating Turtle Root Tunnel (Ancient Monk)
  dragon_talon: { x: '69%', y: '23%' }, // Hydra Island · Dragon Dojo (Uzoth)
  sanguine_art: { x: '78%', y: '76%' }, // Tiki Outpost Basement (Shafi)
};

function getThemeDotColor(theme: FightingStyle['theme']) {
  switch (theme) {
    case 'crimson':
      return 'bg-red-500 border-red-300 shadow-[0_0_16px_rgba(239,68,68,0.85)]';
    case 'purple':
      return 'bg-purple-500 border-purple-300 shadow-[0_0_16px_rgba(168,85,247,0.85)]';
    case 'electric':
    default:
      return 'bg-sky-400 border-sky-200 shadow-[0_0_16px_rgba(56,189,248,0.85)]';
  }
}

export default function FightingStyleTrainerMap({
  initialStyleId,
  onInspectStyle,
}: FightingStyleTrainerMapProps) {
  const initialStyle = initialStyleId
    ? BLOX_FIGHTING_STYLES.find((s) => s.id === initialStyleId)
    : undefined;

  const [seaFilter, setSeaFilter] = useState<SeaTab>(
    initialStyle ? (String(initialStyle.sea) as SeaTab) : '1'
  );
  const [selectedId, setSelectedId] = useState<string>(
    initialStyle?.id ||
      BLOX_FIGHTING_STYLES.find((s) => s.sea === 1)?.id ||
      'dark_step'
  );

  const visibleTrainers = useMemo(() => {
    return BLOX_FIGHTING_STYLES.filter((s) => s.sea.toString() === seaFilter);
  }, [seaFilter]);

  const activeTrainer =
    visibleTrainers.find((s) => s.id === selectedId) ||
    visibleTrainers[0] ||
    BLOX_FIGHTING_STYLES[0];

  const currentSeaMap = SEA_MAP_ASSETS[seaFilter];

  return (
    <div className="space-y-6">
      {/* Sea Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-sky-400" />
            Fighting Style Trainer Map
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Select 1 Sea, 2 Sea, or 3 Sea and click any trainer beacon on the map to inspect NPC coordinates, landmarks, and unlock costs.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#04060d] rounded-xl border border-slate-800 text-xs self-start shrink-0">
          {(['1', '2', '3'] as const).map((sea) => (
            <button
              key={sea}
              type="button"
              onClick={() => {
                setSeaFilter(sea);
                const firstInSea = BLOX_FIGHTING_STYLES.find(
                  (s) => s.sea.toString() === sea
                );
                if (firstInSea) setSelectedId(firstInSea.id);
                sounds.playClick();
              }}
              className={`px-3.5 py-1.5 rounded-lg font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                seaFilter === sea
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sea} Sea
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Sea Map + Selected Trainer Spotlight */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Visual Interactive Map */}
        <div className="xl:col-span-7 relative rounded-3xl overflow-hidden border border-slate-800 bg-[#04060d] select-none">
          <img
            src={currentSeaMap.image}
            alt={currentSeaMap.title}
            referrerPolicy="no-referrer"
            className="w-full h-auto block"
          />
          <div className="absolute inset-0 bg-slate-950/15 pointer-events-none" />

          {/* Interactive Trainer Beacons */}
          <div className="absolute inset-0 z-20">
            {visibleTrainers.map((trainer) => {
              const pos = PIN_COORDINATES[trainer.id] || { x: '50%', y: '50%' };
              const isSelected = activeTrainer.id === trainer.id;
              return (
                <button
                  key={trainer.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSelectedId(trainer.id);
                  }}
                  style={{ left: pos.x, top: pos.y }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none flex flex-col items-center ${
                    isSelected ? 'z-30' : 'z-10 hover:z-20'
                  }`}
                  title={`${trainer.trainerGuide.npcName} (${trainer.name})`}
                >
                  <span
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center transition-transform ${
                      isSelected ? 'scale-125 ring-4 ring-white/30' : 'group-hover:scale-115'
                    } ${getThemeDotColor(trainer.theme)}`}
                  />
                  <span
                    className={`mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap block transition-colors border shadow-md ${
                      isSelected
                        ? 'bg-slate-950/95 border-sky-400 text-white'
                        : 'bg-[#04060d]/90 border-slate-800 text-slate-200 group-hover:text-white'
                    }`}
                  >
                    {trainer.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Trainer Location Dossier */}
        <div className="xl:col-span-5 p-6 rounded-3xl bg-[#070b17] border border-slate-800 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3.5 min-w-0">
                <TrainerNpcPortrait style={activeTrainer} size="lg" />
                <div className="min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                    Sea {activeTrainer.sea} · {activeTrainer.island}
                  </div>
                  <h3 className="text-xl font-black text-white truncate">
                    {activeTrainer.trainerGuide.npcName}
                  </h3>
                  <span className="text-xs text-purple-300 font-semibold block truncate">
                    Teaches: {activeTrainer.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-semibold flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  Exact Location
                </span>
                <p className="text-white font-medium">{activeTrainer.trainerGuide.exactLocation}</p>
              </div>

              <div>
                <span className="text-slate-400 font-semibold flex items-center gap-1.5 mb-1">
                  <Navigation className="w-3.5 h-3.5 text-purple-400" />
                  Directions to Reach Trainer
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {activeTrainer.trainerGuide.directions}
                </p>
              </div>

              {activeTrainer.trainerGuide.altThirdSeaLocation && (
                <div>
                  <span className="text-sky-400 font-semibold block mb-0.5">
                    Alternate Relocation NPC
                  </span>
                  <p className="text-slate-300">{activeTrainer.trainerGuide.altThirdSeaLocation}</p>
                </div>
              )}

              {activeTrainer.trainerGuide.outdatedNote && (
                <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/35 text-red-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p>{activeTrainer.trainerGuide.outdatedNote}</p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 flex items-center gap-1 mb-0.5">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    Price
                  </span>
                  <span className="font-bold text-amber-400 tabular-nums">
                    {activeTrainer.costBeli > 0 ? `$${activeTrainer.costBeli.toLocaleString()}` : '$0 Beli'}
                    {activeTrainer.costFragments > 0 && ` + ${activeTrainer.costFragments.toLocaleString()} Frags`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Items / Prereqs</span>
                  <span className="font-semibold text-slate-200 line-clamp-2">
                    {activeTrainer.requiredItems.join(', ')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onInspectStyle(activeTrainer);
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>Open Full {activeTrainer.name} Guide</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Complete Trainer Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleTrainers.map((t) => {
          const isSelected = activeTrainer.id === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                sounds.playClick();
                setSelectedId(t.id);
              }}
              className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-[#0c1226] border-sky-400/70 shadow-lg'
                  : 'bg-[#070b17] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <TrainerNpcPortrait style={t} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 text-[11px] font-bold">
                    <span className="text-sky-400">Sea {t.sea} · {t.island}</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-white truncate">
                    {t.trainerGuide.npcName}
                  </h4>
                  <p className="text-xs text-purple-300 font-semibold truncate">{t.name}</p>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {t.trainerGuide.exactLocation}
              </p>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] tabular-nums">
                <span className="font-bold text-amber-400">
                  {t.costBeli > 0 ? `$${t.costBeli.toLocaleString()}` : '$0'}
                  {t.costFragments > 0 ? ` + ${t.costFragments.toLocaleString()} Frags` : ''}
                </span>
                <span className="text-slate-400 truncate max-w-[140px]">
                  {t.requiredMasteryToUnlock > 0
                    ? `${t.requiredMasteryToUnlock} Mast. Prereq`
                    : 'No Style Prereq'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
