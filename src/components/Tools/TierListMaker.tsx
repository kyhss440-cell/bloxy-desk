import { useState } from 'react';
import { BLOX_FRUITS_DATABASE } from '../../data/fruitsData';
import { BloxFruit } from '../../types/bloxfruits';
import { sounds } from '../../utils/audio';
import { Layers, RotateCcw, Swords, Compass } from 'lucide-react';

type TierKey = 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';

interface TierRow {
  key: TierKey;
  label: string;
  bgHeader: string;
  items: BloxFruit[];
}

export default function TierListMaker() {
  const [activePreset, setActivePreset] = useState<'pvp' | 'grind' | 'custom'>('pvp');

  const buildInitialTiers = (mode: 'pvp' | 'grind'): TierRow[] => {
    const tiers: Record<TierKey, BloxFruit[]> = {
      'S+': [],
      'S': [],
      'A': [],
      'B': [],
      'C': [],
      'D': [],
    };

    BLOX_FRUITS_DATABASE.forEach(fruit => {
      const tier = mode === 'pvp' ? fruit.pvpTier : fruit.grindTier;
      tiers[tier].push(fruit);
    });

    return [
      { key: 'S+', label: 'S+ (God Tier)', bgHeader: 'bg-red-600 text-white', items: tiers['S+'] },
      { key: 'S', label: 'S (Meta Staple)', bgHeader: 'bg-orange-500 text-slate-950', items: tiers['S'] },
      { key: 'A', label: 'A (Very Strong)', bgHeader: 'bg-amber-400 text-slate-950', items: tiers['A'] },
      { key: 'B', label: 'B (Viable)', bgHeader: 'bg-yellow-300 text-slate-950', items: tiers['B'] },
      { key: 'C', label: 'C (Situational)', bgHeader: 'bg-emerald-500 text-slate-950', items: tiers['C'] },
      { key: 'D', label: 'D (Underpowered)', bgHeader: 'bg-slate-700 text-white', items: tiers['D'] },
    ];
  };

  const [tierRows, setTierRows] = useState<TierRow[]>(() => buildInitialTiers('pvp'));
  const [unassignedPool, setUnassignedPool] = useState<BloxFruit[]>([]);
  const [selectedFruit, setSelectedFruit] = useState<BloxFruit | null>(null);

  const applyPreset = (mode: 'pvp' | 'grind') => {
    sounds.playClick();
    setActivePreset(mode);
    setTierRows(buildInitialTiers(mode));
    setUnassignedPool([]);
    setSelectedFruit(null);
  };

  const setCustomBlank = () => {
    sounds.playClick();
    setActivePreset('custom');
    setTierRows([
      { key: 'S+', label: 'S+ (God Tier)', bgHeader: 'bg-red-600 text-white', items: [] },
      { key: 'S', label: 'S (Meta Staple)', bgHeader: 'bg-orange-500 text-slate-950', items: [] },
      { key: 'A', label: 'A (Very Strong)', bgHeader: 'bg-amber-400 text-slate-950', items: [] },
      { key: 'B', label: 'B (Viable)', bgHeader: 'bg-yellow-300 text-slate-950', items: [] },
      { key: 'C', label: 'C (Situational)', bgHeader: 'bg-emerald-500 text-slate-950', items: [] },
      { key: 'D', label: 'D (Underpowered)', bgHeader: 'bg-slate-700 text-white', items: [] },
    ]);
    setUnassignedPool([...BLOX_FRUITS_DATABASE]);
    setSelectedFruit(null);
  };

  const moveFruitToTier = (fruit: BloxFruit, targetTierKey: TierKey) => {
    sounds.playClick();
    // remove from wherever it was
    setTierRows(prev =>
      prev.map(row => ({
        ...row,
        items: row.key === targetTierKey
          ? [...row.items.filter(f => f.id !== fruit.id), fruit]
          : row.items.filter(f => f.id !== fruit.id),
      }))
    );
    setUnassignedPool(prev => prev.filter(f => f.id !== fruit.id));
    setSelectedFruit(null);
  };

  const moveFruitToPool = (fruit: BloxFruit) => {
    sounds.playClick();
    setTierRows(prev =>
      prev.map(row => ({
        ...row,
        items: row.items.filter(f => f.id !== fruit.id),
      }))
    );
    if (!unassignedPool.some(f => f.id === fruit.id)) {
      setUnassignedPool(prev => [...prev, fruit]);
    }
    setSelectedFruit(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-amber-400" />
            Interactive Fruit Tier List
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Toggle official competitive presets or build your personal custom ranking by clicking fruits.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => applyPreset('pvp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${activePreset === 'pvp' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <Swords className="w-3.5 h-3.5" />
            Official PvP Meta
          </button>
          <button
            onClick={() => applyPreset('grind')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${activePreset === 'grind' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <Compass className="w-3.5 h-3.5" />
            Official Grinding & Raids
          </button>
          <button
            onClick={setCustomBlank}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${activePreset === 'custom' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Custom Blank List
          </button>
        </div>
      </div>

      {/* Selected Action Indicator */}
      {selectedFruit && (
        <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {selectedFruit.image ? (
              <img
                src={selectedFruit.image}
                alt={selectedFruit.name}
                className="w-8 h-8 object-contain shrink-0 filter drop-shadow-[0_0_6px_rgba(34,211,238,0.45)]"
              />
            ) : (
              <span className="text-2xl">{selectedFruit.symbol}</span>
            )}
            <div>
              <div className="text-xs text-cyan-300">Selected for Placement</div>
              <div className="text-sm font-bold text-white">{selectedFruit.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 mr-2">Assign to:</span>
            {(['S+', 'S', 'A', 'B', 'C', 'D'] as TierKey[]).map(key => (
              <button
                key={key}
                onClick={() => moveFruitToTier(selectedFruit, key)}
                className="px-2.5 py-1 text-xs font-bold rounded bg-slate-800 hover:bg-cyan-600 text-white transition-colors cursor-pointer"
              >
                {key}
              </button>
            ))}
            <button
              onClick={() => moveFruitToPool(selectedFruit)}
              className="px-2.5 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600 text-slate-300 cursor-pointer ml-2"
            >
              To Pool
            </button>
          </div>
        </div>
      )}

      {/* Tier Board */}
      <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60 divide-y divide-slate-800/80">
        {tierRows.map(row => (
          <div key={row.key} className="flex flex-col sm:flex-row items-stretch min-h-[72px]">
            {/* Header label box */}
            <div className={`w-full sm:w-36 shrink-0 p-3 flex flex-row sm:flex-col items-center justify-between sm:justify-center font-extrabold text-sm sm:text-base ${row.bgHeader}`}>
              <span>{row.key}</span>
              <span className="text-[10px] font-normal opacity-90 block sm:mt-0.5">{row.label.split('(')[1]?.replace(')', '') || ''}</span>
            </div>

            {/* Items row */}
            <div className="flex-1 p-2.5 flex items-center flex-wrap gap-2 bg-slate-950/40 min-h-[64px]">
              {row.items.length === 0 ? (
                <span className="text-xs text-slate-600 italic pl-2">Click fruits below or assign here</span>
              ) : (
                row.items.map(fruit => (
                  <button
                    key={fruit.id}
                    onClick={() => {
                      setSelectedFruit(fruit);
                      sounds.playClick();
                    }}
                    className="group relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-amber-400/60 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    title={`Click to reassign ${fruit.name}`}
                  >
                    {fruit.image ? (
                      <img
                        src={fruit.image}
                        alt={fruit.name}
                        className="w-6 h-6 object-contain shrink-0 group-hover:scale-110 transition-transform filter drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]"
                      />
                    ) : (
                      <span className="text-xl group-hover:scale-110 transition-transform">{fruit.symbol}</span>
                    )}
                    <span className="text-xs font-bold text-slate-200">{fruit.name}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Unassigned Pool (For Custom Creation) */}
      {unassignedPool.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              Unassigned Fruits Pool ({unassignedPool.length})
            </h4>
            <span className="text-xs text-slate-400">Click a fruit to assign to a tier above</span>
          </div>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
            {unassignedPool.map(fruit => (
              <button
                key={fruit.id}
                onClick={() => {
                  setSelectedFruit(fruit);
                  sounds.playClick();
                }}
                className={`p-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${selectedFruit?.id === fruit.id ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'}`}
              >
                {fruit.image ? (
                  <img
                    src={fruit.image}
                    alt={fruit.name}
                    className="w-6 h-6 object-contain shrink-0"
                  />
                ) : (
                  <span className="text-xl">{fruit.symbol}</span>
                )}
                <span className="text-xs font-semibold">{fruit.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
