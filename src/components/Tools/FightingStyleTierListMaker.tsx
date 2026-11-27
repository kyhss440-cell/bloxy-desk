import { useState, useMemo } from 'react';
import { BLOX_FIGHTING_STYLES } from '../../data/fightingStylesData';
import { FightingStyle } from '../../types/bloxfruits';
import FightingStyleArtwork from '../FightingStyleArtwork';
import { sounds } from '../../utils/audio';
import { Flame, RotateCcw, Swords, Compass, Zap, ChevronRight } from 'lucide-react';

type TierKey = 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';

interface TierRow {
  key: TierKey;
  label: string;
  bgHeader: string;
  items: FightingStyle[];
}

interface FightingStyleTierListMakerProps {
  onInspectStyle?: (style: FightingStyle) => void;
}

const TIER_DEFINITIONS: Array<{ key: TierKey; label: string; bgHeader: string }> = [
  { key: 'S+', label: 'S+ (God Tier)', bgHeader: 'bg-red-600 text-white' },
  { key: 'S', label: 'S (Meta Staple)', bgHeader: 'bg-orange-500 text-slate-950' },
  { key: 'A', label: 'A (Very Strong)', bgHeader: 'bg-amber-400 text-slate-950' },
  { key: 'B', label: 'B (Viable)', bgHeader: 'bg-yellow-300 text-slate-950' },
  { key: 'C', label: 'C (Situational)', bgHeader: 'bg-emerald-500 text-slate-950' },
  { key: 'D', label: 'D (Starter / Weak)', bgHeader: 'bg-slate-700 text-white' },
];

export default function FightingStyleTierListMaker({
  onInspectStyle,
}: FightingStyleTierListMakerProps) {
  const [activePreset, setActivePreset] = useState<'pvp' | 'grind' | 'mobility' | 'custom'>('pvp');

  const buildInitialTiers = (mode: 'pvp' | 'grind' | 'mobility'): TierRow[] => {
    const tiers: Record<TierKey, FightingStyle[]> = {
      'S+': [],
      'S': [],
      'A': [],
      'B': [],
      'C': [],
      'D': [],
    };

    BLOX_FIGHTING_STYLES.forEach((style) => {
      if (style.id === 'combat' && mode === 'pvp') {
        tiers['D'].push(style);
        return;
      }
      const raw =
        mode === 'pvp'
          ? style.pvpTier
          : mode === 'grind'
            ? style.grindTier
            : style.mobilityTier;
      tiers[raw].push(style);
    });

    return TIER_DEFINITIONS.map((def) => ({
      ...def,
      items: tiers[def.key],
    }));
  };

  const [tierRows, setTierRows] = useState<TierRow[]>(() => buildInitialTiers('pvp'));
  const [unassignedPool, setUnassignedPool] = useState<FightingStyle[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<FightingStyle | null>(null);

  const totalCount = useMemo(() => BLOX_FIGHTING_STYLES.length, []);

  const applyPreset = (mode: 'pvp' | 'grind' | 'mobility') => {
    sounds.playClick();
    setActivePreset(mode);
    setTierRows(buildInitialTiers(mode));
    setUnassignedPool([]);
    setSelectedStyle(null);
  };

  const setCustomBlank = () => {
    sounds.playClick();
    setActivePreset('custom');
    setTierRows(TIER_DEFINITIONS.map((def) => ({ ...def, items: [] })));
    setUnassignedPool([...BLOX_FIGHTING_STYLES]);
    setSelectedStyle(null);
  };

  const moveStyleToTier = (style: FightingStyle, targetTierKey: TierKey) => {
    sounds.playClick();
    setTierRows((prev) =>
      prev.map((row) => ({
        ...row,
        items:
          row.key === targetTierKey
            ? [...row.items.filter((s) => s.id !== style.id), style]
            : row.items.filter((s) => s.id !== style.id),
      }))
    );
    setUnassignedPool((prev) => prev.filter((s) => s.id !== style.id));
    setSelectedStyle(null);
  };

  const moveStyleToPool = (style: FightingStyle) => {
    sounds.playClick();
    setTierRows((prev) =>
      prev.map((row) => ({
        ...row,
        items: row.items.filter((s) => s.id !== style.id),
      }))
    );
    if (!unassignedPool.some((s) => s.id === style.id)) {
      setUnassignedPool((prev) => [...prev, style]);
    }
    setSelectedStyle(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-purple-950/40 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Flame className="w-6 h-6 text-purple-400" />
            Interactive Fighting Style Tier List
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Rank all {totalCount} martial arts across Official PvP Meta, Grinding & Raids, Mobility, or create a Custom Blank List.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => applyPreset('pvp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
              activePreset === 'pvp'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            Official PvP Meta
          </button>
          <button
            onClick={() => applyPreset('grind')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
              activePreset === 'grind'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Grinding & Raids
          </button>
          <button
            onClick={() => applyPreset('mobility')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
              activePreset === 'mobility'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Mobility & Dash
          </button>
          <button
            onClick={setCustomBlank}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
              activePreset === 'custom'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Custom Blank List
          </button>
        </div>
      </div>

      {/* Selected Action Indicator */}
      {selectedStyle && (
        <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <FightingStyleArtwork style={selectedStyle} size="sm" />
            <div className="min-w-0">
              <div className="text-xs text-purple-300">
                Sea {selectedStyle.sea} · {selectedStyle.island} · {selectedStyle.npcName}
              </div>
              <div className="text-sm font-bold text-white">{selectedStyle.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap shrink-0">
            <span className="text-xs text-slate-400 mr-1">Assign to:</span>
            {(['S+', 'S', 'A', 'B', 'C', 'D'] as TierKey[]).map((key) => (
              <button
                key={key}
                onClick={() => moveStyleToTier(selectedStyle, key)}
                className="px-2.5 py-1 text-xs font-bold rounded bg-slate-800 hover:bg-purple-600 text-white transition-colors cursor-pointer"
              >
                {key}
              </button>
            ))}
            <button
              onClick={() => moveStyleToPool(selectedStyle)}
              className="px-2.5 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600 text-slate-300 cursor-pointer ml-1"
            >
              To Pool
            </button>
            {onInspectStyle && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onInspectStyle(selectedStyle);
                }}
                className="px-2.5 py-1 text-xs font-bold rounded bg-purple-600 hover:bg-purple-500 text-white cursor-pointer ml-1 flex items-center gap-1"
              >
                <span>Style Guide</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tier Board */}
      <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60 divide-y divide-slate-800/80">
        {tierRows.map((row) => (
          <div key={row.key} className="flex flex-col sm:flex-row items-stretch min-h-[72px]">
            <div
              className={`w-full sm:w-36 shrink-0 p-3 flex flex-row sm:flex-col items-center justify-between sm:justify-center font-extrabold text-sm sm:text-base ${row.bgHeader}`}
            >
              <span>{row.key}</span>
              <span className="text-[10px] font-normal opacity-90 block sm:mt-0.5">
                {row.label.split('(')[1]?.replace(')', '') || ''}
              </span>
            </div>

            <div className="flex-1 p-2.5 flex items-center flex-wrap gap-2 bg-slate-950/40 min-h-[64px]">
              {row.items.length === 0 ? (
                <span className="text-xs text-slate-600 italic pl-2">
                  Click fighting styles below or assign here
                </span>
              ) : (
                row.items.map((style) => {
                  const isSelected = selectedStyle?.id === style.id;
                  return (
                    <button
                      key={style.id}
                      onClick={() => {
                        setSelectedStyle(style);
                        sounds.playClick();
                      }}
                      className={`group relative p-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                        isSelected
                          ? 'bg-purple-950/60 border-purple-400'
                          : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 hover:border-amber-400/60'
                      }`}
                      title={`Click to reassign ${style.name}`}
                    >
                      <FightingStyleArtwork style={style} size="sm" />
                      <span className="text-xs font-bold text-slate-200">{style.name}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Unassigned Pool (For Custom Creation) */}
      {unassignedPool.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-white">
              Unassigned Styles Pool ({unassignedPool.length})
            </h4>
            <span className="text-xs text-slate-400">
              Click a fighting style to assign to a tier above
            </span>
          </div>
          <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto pr-1">
            {unassignedPool.map((style) => (
              <button
                key={style.id}
                onClick={() => {
                  setSelectedStyle(style);
                  sounds.playClick();
                }}
                className={`p-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                  selectedStyle?.id === style.id
                    ? 'bg-purple-600 text-white border-purple-400'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                <FightingStyleArtwork style={style} size="sm" />
                <span className="text-xs font-semibold">{style.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
