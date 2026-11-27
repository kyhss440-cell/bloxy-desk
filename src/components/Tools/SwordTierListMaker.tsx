import { useState, useMemo } from 'react';
import { BLOX_SWORDS_DATABASE } from '../../data/swordsData';
import { BloxSword } from '../../types/bloxfruits';
import { sounds } from '../../utils/audio';
import { Swords, RotateCcw, Compass, ChevronRight } from 'lucide-react';

type TierKey = 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';

interface TierRow {
  key: TierKey;
  label: string;
  bgHeader: string;
  items: BloxSword[];
}

interface SwordTierListMakerProps {
  onInspectSword?: (sword: BloxSword) => void;
}

const SWORD_GRIND_TIER_MAP: Record<string, TierKey> = {
  cdk: 'S+',
  ttk: 'S+',
  dark_blade: 'S+',
  hallow_scythe: 'S+',
  shark_anchor: 'S+',
  dragonheart: 'S+',
  triple_dark_blade: 'S+',

  fox_lamp: 'S',
  tushita: 'S',
  dragon_trident: 'S',
  bisento: 'S',
  saber: 'S',
  rengoku: 'S',
  midnight_blade: 'S',
  shizu: 'S',
  oroshi: 'S',
  saishi: 'S',

  yama: 'A',
  spikey_trident: 'A',
  buddy_sword: 'A',
  dark_dagger: 'A',
  koko: 'A',
  flail: 'A',
  gravity_blade: 'A',
  canvander: 'A',
  pole_v2: 'A',

  twin_hooks: 'B',
  soul_cane: 'B',
  trident: 'B',
  pole_v1: 'B',
  dual_headed_blade: 'B',
  wardens_sword: 'B',

  longsword: 'C',
  pipe: 'C',
  triple_katana: 'C',
  shark_saw: 'C',
  iron_mace: 'C',

  fishing_trophy: 'D',
  dual_katana: 'D',
  katana: 'D',
  cutlass: 'D',
  dog_blade: 'S',
};

const TIER_DEFINITIONS: Array<{ key: TierKey; label: string; bgHeader: string }> = [
  { key: 'S+', label: 'S+ (God Tier)', bgHeader: 'bg-red-600 text-white' },
  { key: 'S', label: 'S (Meta Staple)', bgHeader: 'bg-orange-500 text-slate-950' },
  { key: 'A', label: 'A (Very Strong)', bgHeader: 'bg-amber-400 text-slate-950' },
  { key: 'B', label: 'B (Viable)', bgHeader: 'bg-yellow-300 text-slate-950' },
  { key: 'C', label: 'C (Situational)', bgHeader: 'bg-emerald-500 text-slate-950' },
  { key: 'D', label: 'D (Underpowered)', bgHeader: 'bg-slate-700 text-white' },
];

export default function SwordTierListMaker({ onInspectSword }: SwordTierListMakerProps) {
  const [activePreset, setActivePreset] = useState<'pvp' | 'grind' | 'custom'>('pvp');

  const buildInitialTiers = (mode: 'pvp' | 'grind'): TierRow[] => {
    const tiers: Record<TierKey, BloxSword[]> = {
      'S+': [],
      'S': [],
      'A': [],
      'B': [],
      'C': [],
      'D': [],
    };

    BLOX_SWORDS_DATABASE.forEach((sword) => {
      const pvpFallback: TierKey =
        sword.rarity === 'Common' || sword.id === 'fishing_trophy'
          ? 'D'
          : sword.pvpTier;
      const tier =
        mode === 'pvp' ? pvpFallback : SWORD_GRIND_TIER_MAP[sword.id] || 'C';
      tiers[tier].push(sword);
    });

    return TIER_DEFINITIONS.map((def) => ({
      ...def,
      items: tiers[def.key],
    }));
  };

  const [tierRows, setTierRows] = useState<TierRow[]>(() => buildInitialTiers('pvp'));
  const [unassignedPool, setUnassignedPool] = useState<BloxSword[]>([]);
  const [selectedSword, setSelectedSword] = useState<BloxSword | null>(null);

  const totalCount = useMemo(() => BLOX_SWORDS_DATABASE.length, []);

  const applyPreset = (mode: 'pvp' | 'grind') => {
    sounds.playClick();
    setActivePreset(mode);
    setTierRows(buildInitialTiers(mode));
    setUnassignedPool([]);
    setSelectedSword(null);
  };

  const setCustomBlank = () => {
    sounds.playClick();
    setActivePreset('custom');
    setTierRows(TIER_DEFINITIONS.map((def) => ({ ...def, items: [] })));
    setUnassignedPool([...BLOX_SWORDS_DATABASE]);
    setSelectedSword(null);
  };

  const moveSwordToTier = (sword: BloxSword, targetTierKey: TierKey) => {
    sounds.playClick();
    setTierRows((prev) =>
      prev.map((row) => ({
        ...row,
        items:
          row.key === targetTierKey
            ? [...row.items.filter((s) => s.id !== sword.id), sword]
            : row.items.filter((s) => s.id !== sword.id),
      }))
    );
    setUnassignedPool((prev) => prev.filter((s) => s.id !== sword.id));
    setSelectedSword(null);
  };

  const moveSwordToPool = (sword: BloxSword) => {
    sounds.playClick();
    setTierRows((prev) =>
      prev.map((row) => ({
        ...row,
        items: row.items.filter((s) => s.id !== sword.id),
      }))
    );
    if (!unassignedPool.some((s) => s.id === sword.id)) {
      setUnassignedPool((prev) => [...prev, sword]);
    }
    setSelectedSword(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-cyan-950/40 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Swords className="w-6 h-6 text-cyan-400" />
            Interactive Sword Tier List
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Rank all {totalCount} swords using Official PvP Meta, Grinding & Raids, or build your own Custom Blank List.
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
      {selectedSword && (
        <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {selectedSword.image && (
              <img
                src={selectedSword.image}
                alt={selectedSword.name}
                className="w-9 h-9 object-contain shrink-0 filter drop-shadow-[0_0_6px_rgba(34,211,238,0.45)]"
              />
            )}
            <div className="min-w-0">
              <div className="text-xs text-cyan-300">
                {selectedSword.rarity} · Sea {selectedSword.sea} · {selectedSword.location}
              </div>
              <div className="text-sm font-bold text-white">{selectedSword.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap shrink-0">
            <span className="text-xs text-slate-400 mr-1">Assign to:</span>
            {(['S+', 'S', 'A', 'B', 'C', 'D'] as TierKey[]).map((key) => (
              <button
                key={key}
                onClick={() => moveSwordToTier(selectedSword, key)}
                className="px-2.5 py-1 text-xs font-bold rounded bg-slate-800 hover:bg-cyan-600 text-white transition-colors cursor-pointer"
              >
                {key}
              </button>
            ))}
            <button
              onClick={() => moveSwordToPool(selectedSword)}
              className="px-2.5 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600 text-slate-300 cursor-pointer ml-1"
            >
              To Pool
            </button>
            {onInspectSword && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onInspectSword(selectedSword);
                }}
                className="px-2.5 py-1 text-xs font-bold rounded bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer ml-1 flex items-center gap-1"
              >
                <span>Full Guide</span>
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
                  Click swords below or assign here
                </span>
              ) : (
                row.items.map((sword) => {
                  const isSelected = selectedSword?.id === sword.id;
                  return (
                    <button
                      key={sword.id}
                      onClick={() => {
                        setSelectedSword(sword);
                        sounds.playClick();
                      }}
                      className={`group relative p-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-400'
                          : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 hover:border-amber-400/60'
                      }`}
                      title={`Click to reassign ${sword.name}`}
                    >
                      {sword.image && (
                        <img
                          src={sword.image}
                          alt={sword.name}
                          className="w-6 h-6 object-contain shrink-0 group-hover:scale-110 transition-transform filter drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]"
                        />
                      )}
                      <span className="text-xs font-bold text-slate-200">{sword.name}</span>
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
              Unassigned Swords Pool ({unassignedPool.length})
            </h4>
            <span className="text-xs text-slate-400">
              Click a sword to assign to a tier above
            </span>
          </div>
          <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1">
            {unassignedPool.map((sword) => (
              <button
                key={sword.id}
                onClick={() => {
                  setSelectedSword(sword);
                  sounds.playClick();
                }}
                className={`p-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedSword?.id === sword.id
                    ? 'bg-cyan-600 text-white border-cyan-400'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                {sword.image && (
                  <img
                    src={sword.image}
                    alt={sword.name}
                    className="w-6 h-6 object-contain shrink-0"
                  />
                )}
                <span className="text-xs font-semibold">{sword.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
