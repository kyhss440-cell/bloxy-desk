import { useState, useMemo } from 'react';
import { BLOX_GUNS_DATABASE } from '../../data/gunsData';
import { BloxGun } from '../../types/bloxfruits';
import { sounds } from '../../utils/audio';
import { Crosshair, RotateCcw, Swords, Compass, ChevronRight } from 'lucide-react';

type TierKey = 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';

interface TierRow {
  key: TierKey;
  label: string;
  bgHeader: string;
  items: BloxGun[];
}

interface GunTierListMakerProps {
  onInspectGun?: (gun: BloxGun) => void;
}

const GRIND_TIER_MAP: Record<string, TierKey> = {
  dragonstorm: 'S+',
  skull_guitar: 'S+',
  kabucha: 'S',
  venom_bow: 'S',
  magma_blaster: 'A',
  bazooka: 'A',
  acidum_rifle: 'B',
  bizarre_revolver: 'B',
  dual_flintlock: 'B',
  refined_slingshot: 'C',
  cannon: 'C',
  flintlock: 'C',
  musket: 'D',
  slingshot: 'D',
};

const TIER_DEFINITIONS: Array<{ key: TierKey; label: string; bgHeader: string }> = [
  { key: 'S+', label: 'S+ (God Tier)', bgHeader: 'bg-red-600 text-white' },
  { key: 'S', label: 'S (Meta Staple)', bgHeader: 'bg-orange-500 text-slate-950' },
  { key: 'A', label: 'A (Very Strong)', bgHeader: 'bg-amber-400 text-slate-950' },
  { key: 'B', label: 'B (Viable)', bgHeader: 'bg-yellow-300 text-slate-950' },
  { key: 'C', label: 'C (Situational)', bgHeader: 'bg-emerald-500 text-slate-950' },
  { key: 'D', label: 'D (Underpowered)', bgHeader: 'bg-slate-700 text-white' },
];

export default function GunTierListMaker({ onInspectGun }: GunTierListMakerProps) {
  const [activePreset, setActivePreset] = useState<'pvp' | 'grind' | 'custom'>('pvp');

  const buildInitialTiers = (mode: 'pvp' | 'grind'): TierRow[] => {
    const tiers: Record<TierKey, BloxGun[]> = {
      'S+': [],
      'S': [],
      'A': [],
      'B': [],
      'C': [],
      'D': [],
    };

    BLOX_GUNS_DATABASE.forEach((gun) => {
      const tier = mode === 'pvp' ? gun.pvpTier : GRIND_TIER_MAP[gun.id] || 'C';
      tiers[tier].push(gun);
    });

    return TIER_DEFINITIONS.map((def) => ({
      ...def,
      items: tiers[def.key],
    }));
  };

  const [tierRows, setTierRows] = useState<TierRow[]>(() => buildInitialTiers('pvp'));
  const [unassignedPool, setUnassignedPool] = useState<BloxGun[]>([]);
  const [selectedGun, setSelectedGun] = useState<BloxGun | null>(null);

  const totalCount = useMemo(() => BLOX_GUNS_DATABASE.length, []);

  const applyPreset = (mode: 'pvp' | 'grind') => {
    sounds.playClick();
    setActivePreset(mode);
    setTierRows(buildInitialTiers(mode));
    setUnassignedPool([]);
    setSelectedGun(null);
  };

  const setCustomBlank = () => {
    sounds.playClick();
    setActivePreset('custom');
    setTierRows(TIER_DEFINITIONS.map((def) => ({ ...def, items: [] })));
    setUnassignedPool([...BLOX_GUNS_DATABASE]);
    setSelectedGun(null);
  };

  const moveGunToTier = (gun: BloxGun, targetTierKey: TierKey) => {
    sounds.playClick();
    setTierRows((prev) =>
      prev.map((row) => ({
        ...row,
        items:
          row.key === targetTierKey
            ? [...row.items.filter((g) => g.id !== gun.id), gun]
            : row.items.filter((g) => g.id !== gun.id),
      }))
    );
    setUnassignedPool((prev) => prev.filter((g) => g.id !== gun.id));
    setSelectedGun(null);
  };

  const moveGunToPool = (gun: BloxGun) => {
    sounds.playClick();
    setTierRows((prev) =>
      prev.map((row) => ({
        ...row,
        items: row.items.filter((g) => g.id !== gun.id),
      }))
    );
    if (!unassignedPool.some((g) => g.id === gun.id)) {
      setUnassignedPool((prev) => [...prev, gun]);
    }
    setSelectedGun(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-violet-950/40 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Crosshair className="w-6 h-6 text-violet-400" />
            Interactive Gun Tier List
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Compare and rank all {totalCount} firearms across Official PvP Meta, Grinding & Sea Events, or your own Custom Blank List.
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
            Grinding & Sea Events
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
      {selectedGun && (
        <div className="p-4 rounded-xl bg-violet-950/40 border border-violet-500/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {selectedGun.image && (
              <img
                src={selectedGun.image}
                alt={selectedGun.name}
                className="w-9 h-9 object-contain shrink-0 filter drop-shadow-[0_0_6px_rgba(167,139,250,0.45)]"
              />
            )}
            <div className="min-w-0">
              <div className="text-xs text-violet-300">
                {selectedGun.rarity} · Sea {selectedGun.sea} · {selectedGun.priceDisplay}
              </div>
              <div className="text-sm font-bold text-white">{selectedGun.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap shrink-0">
            <span className="text-xs text-slate-400 mr-1">Assign to:</span>
            {(['S+', 'S', 'A', 'B', 'C', 'D'] as TierKey[]).map((key) => (
              <button
                key={key}
                onClick={() => moveGunToTier(selectedGun, key)}
                className="px-2.5 py-1 text-xs font-bold rounded bg-slate-800 hover:bg-violet-600 text-white transition-colors cursor-pointer"
              >
                {key}
              </button>
            ))}
            <button
              onClick={() => moveGunToPool(selectedGun)}
              className="px-2.5 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600 text-slate-300 cursor-pointer ml-1"
            >
              To Pool
            </button>
            {onInspectGun && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onInspectGun(selectedGun);
                }}
                className="px-2.5 py-1 text-xs font-bold rounded bg-violet-600 hover:bg-violet-500 text-white cursor-pointer ml-1 flex items-center gap-1"
              >
                <span>Dossier</span>
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
                  Click guns below or assign here
                </span>
              ) : (
                row.items.map((gun) => {
                  const isSelected = selectedGun?.id === gun.id;
                  return (
                    <button
                      key={gun.id}
                      onClick={() => {
                        setSelectedGun(gun);
                        sounds.playClick();
                      }}
                      className={`group relative p-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                        isSelected
                          ? 'bg-violet-950/60 border-violet-400'
                          : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 hover:border-amber-400/60'
                      }`}
                      title={`Click to reassign ${gun.name}`}
                    >
                      {gun.image && (
                        <img
                          src={gun.image}
                          alt={gun.name}
                          className="w-6 h-6 object-contain shrink-0 group-hover:scale-110 transition-transform filter drop-shadow-[0_0_6px_rgba(167,139,250,0.4)]"
                        />
                      )}
                      <span className="text-xs font-bold text-slate-200">{gun.name}</span>
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
              Unassigned Guns Pool ({unassignedPool.length})
            </h4>
            <span className="text-xs text-slate-400">
              Click a gun to assign to a tier above
            </span>
          </div>
          <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto pr-1">
            {unassignedPool.map((gun) => (
              <button
                key={gun.id}
                onClick={() => {
                  setSelectedGun(gun);
                  sounds.playClick();
                }}
                className={`p-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedGun?.id === gun.id
                    ? 'bg-violet-600 text-white border-violet-400'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                {gun.image && (
                  <img
                    src={gun.image}
                    alt={gun.name}
                    className="w-6 h-6 object-contain shrink-0"
                  />
                )}
                <span className="text-xs font-semibold">{gun.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
