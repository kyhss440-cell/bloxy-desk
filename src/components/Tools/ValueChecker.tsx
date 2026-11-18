import { useState, useMemo } from 'react';
import { BLOX_FRUITS_DATABASE } from '../../data/fruitsData';
import { BloxFruit } from '../../types/bloxfruits';
import { sounds } from '../../utils/audio';
import { ArrowRightLeft, Plus, X, Sparkles, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ValueChecker() {
  const [youOffer, setYouOffer] = useState<BloxFruit[]>([]);
  const [themOffer, setThemOffer] = useState<BloxFruit[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<'you' | 'them'>('you');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFruits = useMemo(() => {
    return BLOX_FRUITS_DATABASE.filter(f =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const addFruit = (fruit: BloxFruit) => {
    sounds.playClick();
    if (selectedSlot === 'you') {
      if (youOffer.length >= 4) return;
      setYouOffer([...youOffer, fruit]);
    } else {
      if (themOffer.length >= 4) return;
      setThemOffer([...themOffer, fruit]);
    }
  };

  const removeFruit = (slot: 'you' | 'them', index: number) => {
    sounds.playClick();
    if (slot === 'you') {
      setYouOffer(youOffer.filter((_, i) => i !== index));
    } else {
      setThemOffer(themOffer.filter((_, i) => i !== index));
    }
  };

  const youTotalValue = youOffer.reduce((acc, f) => acc + f.tradingValue, 0);
  const themTotalValue = themOffer.reduce((acc, f) => acc + f.tradingValue, 0);

  const youMinValue = youOffer.reduce((acc, f) => acc + (f.tradingValueMin ?? f.tradingValue), 0);
  const youMaxValue = youOffer.reduce((acc, f) => acc + (f.tradingValueMax ?? f.tradingValue), 0);
  const themMinValue = themOffer.reduce((acc, f) => acc + (f.tradingValueMin ?? f.tradingValue), 0);
  const themMaxValue = themOffer.reduce((acc, f) => acc + (f.tradingValueMax ?? f.tradingValue), 0);

  const youTotalBeli = youOffer.reduce((acc, f) => acc + f.priceBeli, 0);
  const themTotalBeli = themOffer.reduce((acc, f) => acc + f.priceBeli, 0);

  // In Blox Fruits trading table, price difference cannot exceed 40%
  const beliDiffRatio = youTotalBeli > 0 && themTotalBeli > 0
    ? Math.abs(youTotalBeli - themTotalBeli) / Math.max(youTotalBeli, themTotalBeli)
    : 0;
  const is40PercentRuleViolated = youTotalBeli > 0 && themTotalBeli > 0 && beliDiffRatio > 0.4;

  // Valuation Assessment using full physical ranges + fair trade overlap
  const diff = themTotalValue - youTotalValue;
  const rangesOverlap =
    youOffer.length > 0 &&
    themOffer.length > 0 &&
    youMaxValue >= themMinValue &&
    themMaxValue >= youMinValue;

  let verdict = 'Add fruits to evaluate trade';
  let verdictColor = 'text-slate-400';

  if (youOffer.length > 0 || themOffer.length > 0) {
    if (youTotalValue === 0 && themTotalValue === 0) {
      verdict = 'Even Trade (Both Empty or Zero Value)';
    } else if (rangesOverlap || Math.abs(diff) <= Math.max(youTotalValue, themTotalValue) * 0.08) {
      verdict = 'FAIR TRADE (Ranges Match)';
      verdictColor = 'text-amber-400';
    } else if (diff > 0) {
      if (diff > youTotalValue * 0.4) {
        verdict = 'MASSIVE WIN! (Huge Profit)';
        verdictColor = 'text-emerald-400';
      } else {
        verdict = 'WIN (Favorable Value)';
        verdictColor = 'text-emerald-400';
      }
    } else {
      if (Math.abs(diff) > themTotalValue * 0.4) {
        verdict = 'BIG LOSS! (You are Overpaying)';
        verdictColor = 'text-rose-400';
      } else {
        verdict = 'LOSS (You are losing value)';
        verdictColor = 'text-rose-400';
      }
    }
  }

  const formatPoints = (val: number) => {
    const sign = val < 0 ? '-' : '';
    const abs = Math.abs(val);
    const trimZero = (s: string) => (s.endsWith('.0') ? s.slice(0, -2) : s);
    if (abs >= 1_000_000_000) return `${sign}${trimZero((abs / 1_000_000_000).toFixed(2).replace(/0$/, '').replace(/\.$/, ''))}B`;
    if (abs >= 1_000_000) return `${sign}${trimZero((abs / 1_000_000).toFixed(1))}M`;
    if (abs >= 1_000) return `${sign}${Math.round(abs / 1_000)}K`;
    return val.toLocaleString();
  };

  const formatRange = (min: number, max: number) => {
    if (min === 0 && max === 0) return '0';
    if (min === max) return formatPoints(min);
    return `${formatPoints(min)} - ${formatPoints(max)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900/90 to-indigo-950/40 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <ArrowRightLeft className="w-6 h-6 text-amber-400" />
              Blox Fruits Trade Value Calculator
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Accurately checks market trading demand, physical value points, and the 40% in-game Beli threshold.
            </p>
          </div>
          <button
            onClick={() => {
              setYouOffer([]);
              setThemOffer([]);
              sounds.playClick();
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 cursor-pointer"
          >
            Clear All Slots
          </button>
        </div>
      </div>

      {/* Trade Verdict Result Banner */}
      <div className="p-5 rounded-2xl bg-slate-900/95 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sparkles className={`w-7 h-7 ${verdictColor}`} />
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Trade Verdict</div>
            <div className={`text-xl font-extrabold ${verdictColor}`}>{verdict}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="text-center">
            <span className="text-xs text-slate-400 block">Your Physical Range</span>
            <span className="text-lg font-bold text-cyan-400 tabular-nums">{formatRange(youMinValue, youMaxValue)}</span>
          </div>
          <div className="text-slate-600 font-mono">VS</div>
          <div className="text-center">
            <span className="text-xs text-slate-400 block">Their Physical Range</span>
            <span className="text-lg font-bold text-amber-400 tabular-nums">{formatRange(themMinValue, themMaxValue)}</span>
          </div>
          <div className="text-center pl-4 border-l border-slate-800">
            <span className="text-xs text-slate-400 block">Midpoint Diff</span>
            <span className={`text-lg font-bold tabular-nums ${diff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {diff > 0 ? `+${formatPoints(diff)}` : formatPoints(diff)}
            </span>
          </div>
        </div>
      </div>

      {/* 40% Beli In-game Notice */}
      {is40PercentRuleViolated && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>
            <strong>Warning:</strong> In Blox Fruits trade tables, the difference in total Beli price cannot exceed <strong>40%</strong>. This trade would be blocked in-game unless lower value fruits are added!
          </span>
        </div>
      )}

      {/* Two Sides: You vs Them */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Your Offer */}
        <div className={`p-5 rounded-2xl border transition-all ${selectedSlot === 'you' ? 'bg-slate-900/90 border-cyan-500/60 ring-2 ring-cyan-500/20' : 'bg-slate-900/50 border-slate-800'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
              <h3 className="font-bold text-white text-lg">Your Offer</h3>
              <span className="text-xs text-slate-400">({youOffer.length}/4)</span>
            </div>
            <button
              onClick={() => setSelectedSlot('you')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${selectedSlot === 'you' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              Active Adding
            </button>
          </div>

          {/* 4 Slots */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[0, 1, 2, 3].map((idx) => {
              const fruit = youOffer[idx];
              return (
                <div
                  key={idx}
                  className={`h-28 rounded-xl border flex flex-col items-center justify-center p-2 relative group transition-all ${fruit ? 'bg-slate-800/80 border-cyan-500/30' : 'bg-slate-950/40 border-dashed border-slate-800 text-slate-600'}`}
                >
                  {fruit ? (
                    <>
                      <button
                        onClick={() => removeFruit('you', idx)}
                        className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-rose-600 hover:bg-rose-500 rounded-full flex items-center justify-center text-white text-xs cursor-pointer shadow-md"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      {fruit.image ? (
                        <img
                          src={fruit.image}
                          alt={fruit.name}
                          className="w-10 h-10 object-contain mb-1 filter drop-shadow-[0_0_6px_rgba(34,211,238,0.45)]"
                        />
                      ) : (
                        <div className="text-2xl mb-1">{fruit.symbol}</div>
                      )}
                      <div className="text-xs font-bold text-white text-center truncate w-full">{fruit.name}</div>
                      <div className="text-[11px] font-semibold text-cyan-400 tabular-nums text-center">
                        {fruit.tradingValueRange || formatPoints(fruit.tradingValue)}
                      </div>
                      <div className="text-[10px] text-slate-400 tabular-nums">${fruit.priceBeli.toLocaleString()}</div>
                    </>
                  ) : (
                    <span className="text-xs text-slate-600 font-medium">Slot {idx + 1}</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Total In-Game Beli: <strong className="text-slate-200 tabular-nums">${youTotalBeli.toLocaleString()}</strong></span>
            <span>Physical Value: <strong className="text-cyan-400 font-bold tabular-nums">{formatRange(youMinValue, youMaxValue)}</strong></span>
          </div>
        </div>

        {/* Their Offer */}
        <div className={`p-5 rounded-2xl border transition-all ${selectedSlot === 'them' ? 'bg-slate-900/90 border-amber-500/60 ring-2 ring-amber-500/20' : 'bg-slate-900/50 border-slate-800'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400"></span>
              <h3 className="font-bold text-white text-lg">Their Offer</h3>
              <span className="text-xs text-slate-400">({themOffer.length}/4)</span>
            </div>
            <button
              onClick={() => setSelectedSlot('them')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${selectedSlot === 'them' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              Active Adding
            </button>
          </div>

          {/* 4 Slots */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[0, 1, 2, 3].map((idx) => {
              const fruit = themOffer[idx];
              return (
                <div
                  key={idx}
                  className={`h-28 rounded-xl border flex flex-col items-center justify-center p-2 relative group transition-all ${fruit ? 'bg-slate-800/80 border-amber-500/30' : 'bg-slate-950/40 border-dashed border-slate-800 text-slate-600'}`}
                >
                  {fruit ? (
                    <>
                      <button
                        onClick={() => removeFruit('them', idx)}
                        className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-rose-600 hover:bg-rose-500 rounded-full flex items-center justify-center text-white text-xs cursor-pointer shadow-md"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      {fruit.image ? (
                        <img
                          src={fruit.image}
                          alt={fruit.name}
                          className="w-10 h-10 object-contain mb-1 filter drop-shadow-[0_0_6px_rgba(245,158,11,0.45)]"
                        />
                      ) : (
                        <div className="text-2xl mb-1">{fruit.symbol}</div>
                      )}
                      <div className="text-xs font-bold text-white text-center truncate w-full">{fruit.name}</div>
                      <div className="text-[11px] font-semibold text-amber-400 tabular-nums text-center">
                        {fruit.tradingValueRange || formatPoints(fruit.tradingValue)}
                      </div>
                      <div className="text-[10px] text-slate-400 tabular-nums">${fruit.priceBeli.toLocaleString()}</div>
                    </>
                  ) : (
                    <span className="text-xs text-slate-600 font-medium">Slot {idx + 1}</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Total In-Game Beli: <strong className="text-slate-200 tabular-nums">${themTotalBeli.toLocaleString()}</strong></span>
            <span>Physical Value: <strong className="text-amber-400 font-bold tabular-nums">{formatRange(themMinValue, themMaxValue)}</strong></span>
          </div>
        </div>
      </div>

      {/* Fruit Selection Picker */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              Click any fruit below to add to <span className={selectedSlot === 'you' ? 'text-cyan-400 font-bold' : 'text-amber-400 font-bold'}>{selectedSlot === 'you' ? 'Your Offer' : 'Their Offer'}</span>
            </h4>
            <span className="text-xs text-slate-400">Sorted by trading popularity & value</span>
          </div>
          <input
            type="text"
            placeholder="Search fruit name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 max-h-72 overflow-y-auto pr-1">
          {filteredFruits.map((fruit) => (
            <button
              key={fruit.id}
              onClick={() => addFruit(fruit)}
              className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/60 hover:border-cyan-500/50 flex items-center gap-2.5 text-left transition-all group cursor-pointer"
            >
              {fruit.image ? (
                <img
                  src={fruit.image}
                  alt={fruit.name}
                  className="w-8 h-8 object-contain shrink-0 group-hover:scale-110 transition-transform filter drop-shadow-[0_0_6px_rgba(34,211,238,0.45)]"
                />
              ) : (
                <div className="text-xl shrink-0 group-hover:scale-110 transition-transform">{fruit.symbol}</div>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-white truncate">{fruit.name}</div>
                <div className="text-[11px] text-cyan-400 font-medium tabular-nums">
                  {fruit.tradingValueRange || formatPoints(fruit.tradingValue)}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
