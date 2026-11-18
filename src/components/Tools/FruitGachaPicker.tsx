import { useState } from 'react';
import confetti from 'canvas-confetti';
import { BLOX_FRUITS_DATABASE } from '../../data/fruitsData';
import { BloxFruit } from '../../types/bloxfruits';
import { sounds } from '../../utils/audio';
import { Dices, Sparkles, Coins, History, Trophy, RefreshCw } from 'lucide-react';

export default function FruitGachaPicker() {
  const [bountifulBeli, setBountifulBeli] = useState(5000000);
  const [isRolling, setIsRolling] = useState(false);
  const [currentResult, setCurrentResult] = useState<BloxFruit | null>(null);
  const [history, setHistory] = useState<BloxFruit[]>([]);
  const [displayFruit, setDisplayFruit] = useState<BloxFruit>(BLOX_FRUITS_DATABASE[0]);

  const rollCost = 250000;

  const performGachaRoll = () => {
    if (bountifulBeli < rollCost) return;
    if (isRolling) return;

    sounds.playClick();
    setBountifulBeli(prev => prev - rollCost);
    setIsRolling(true);

    // Roll with realistic Blox Fruits odds
    // Common: 40%, Uncommon: 30%, Rare: 19%, Legendary: 8%, Mythical: 3%
    const rand = Math.random() * 100;
    let targetRarity: BloxFruit['rarity'] = 'Common';
    if (rand < 3) {
      targetRarity = 'Mythical';
    } else if (rand < 11) {
      targetRarity = 'Legendary';
    } else if (rand < 30) {
      targetRarity = 'Rare';
    } else if (rand < 60) {
      targetRarity = 'Uncommon';
    } else {
      targetRarity = 'Common';
    }

    const possibleFruits = BLOX_FRUITS_DATABASE.filter(f => f.rarity === targetRarity);
    const finalSelected = possibleFruits[Math.floor(Math.random() * possibleFruits.length)] || BLOX_FRUITS_DATABASE[0];

    // Rapid cycling animation
    let counter = 0;
    const interval = setInterval(() => {
      const randomFruit = BLOX_FRUITS_DATABASE[Math.floor(Math.random() * BLOX_FRUITS_DATABASE.length)];
      setDisplayFruit(randomFruit);
      sounds.playGachaRoll();
      counter++;

      if (counter >= 22) {
        clearInterval(interval);
        setDisplayFruit(finalSelected);
        setCurrentResult(finalSelected);
        setIsRolling(false);
        setHistory(prev => [finalSelected, ...prev].slice(0, 15));

        if (finalSelected.rarity === 'Mythical') {
          sounds.playFanfare();
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#38bdf8', '#f59e0b', '#ec4899', '#8b5cf6'],
          });
        } else if (finalSelected.rarity === 'Legendary') {
          sounds.playLevelUp();
          confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.6 },
          });
        } else {
          sounds.playClick();
        }
      }
    }, 85);
  };

  const getRarityBadge = (rarity: BloxFruit['rarity']) => {
    switch (rarity) {
      case 'Mythical':
        return 'bg-purple-600/20 text-purple-300 border-purple-500/50 text-glow-purple';
      case 'Legendary':
        return 'bg-amber-600/20 text-amber-300 border-amber-500/50 text-glow-gold';
      case 'Rare':
        return 'bg-blue-600/20 text-blue-300 border-blue-500/50';
      case 'Uncommon':
        return 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50';
      default:
        return 'bg-slate-700/30 text-slate-300 border-slate-600/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Balance */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Dices className="w-6 h-6 text-amber-400" />
            Blox Fruit Dealer Cousin (Gacha Simulator)
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Test your luck with genuine Blox Fruits dealer roll rates (3% Mythical, 8% Legendary).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-400">Your Beli:</span>
            <span className="font-extrabold text-amber-400 tabular-nums">${bountifulBeli.toLocaleString()}</span>
          </div>

          <button
            onClick={() => {
              setBountifulBeli(prev => prev + 2000000);
              sounds.playClick();
            }}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700 flex items-center gap-1 cursor-pointer"
            title="Add +$2,000,000 Beli"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            +$2M
          </button>
        </div>
      </div>

      {/* Main Stage Wheel / Pedestal */}
      <div className="p-8 rounded-3xl bg-radial from-slate-900 via-slate-950 to-black border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center text-center">
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-cyan-500/5 blur-3xl pointer-events-none"></div>

        {/* Display Pedestal */}
        <div className="relative mb-6">
          <div className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full border-2 flex items-center justify-center shadow-2xl transition-all duration-300 ${isRolling ? 'scale-105 border-cyan-400 shadow-cyan-500/20 animate-pulse' : 'border-amber-400/50 shadow-amber-500/20'} bg-gradient-to-b from-slate-900 to-slate-950`}>
            {displayFruit.image ? (
              <img
                src={displayFruit.image}
                alt={displayFruit.name}
                className="w-24 h-24 sm:w-28 sm:h-28 object-contain select-none filter drop-shadow-[0_0_16px_rgba(34,211,238,0.5)]"
              />
            ) : (
              <div className="text-6xl sm:text-7xl select-none filter drop-shadow-md">
                {displayFruit.symbol}
              </div>
            )}
          </div>
          {/* Pedestal platform */}
          <div className="w-48 h-6 bg-slate-800/80 rounded-full mx-auto -mt-3 blur-xs"></div>
        </div>

        {/* Name & Rarity */}
        <div className="space-y-1 mb-6">
          <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getRarityBadge(displayFruit.rarity)}`}>
            {displayFruit.rarity} · {displayFruit.category}
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            {displayFruit.name} Fruit
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {displayFruit.bestFor}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={performGachaRoll}
          disabled={isRolling || bountifulBeli < rollCost}
          className={`px-8 py-3.5 rounded-xl font-extrabold text-base flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
            isRolling
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : bountifulBeli < rollCost
              ? 'bg-rose-950/60 text-rose-300 border border-rose-800/50 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/25 hover:scale-105 active:scale-95'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          {isRolling ? 'Rolling...' : `Spin Dealer Fruit ($${rollCost.toLocaleString()} Beli)`}
        </button>

        {bountifulBeli < rollCost && (
          <p className="text-xs text-rose-400 mt-2">
            Not enough Beli! Click "+$2M" above to refill pirate treasure.
          </p>
        )}
      </div>

      {/* History & Odds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Roll History */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            Recent Spins History ({history.length})
          </h4>
          {history.length === 0 ? (
            <div className="text-xs text-slate-500 italic py-6 text-center">
              No fruits spun yet this session. Press Spin Dealer Fruit above!
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {history.map((fruit, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {fruit.image ? (
                      <img
                        src={fruit.image}
                        alt={fruit.name}
                        className="w-7 h-7 object-contain shrink-0 filter drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]"
                      />
                    ) : (
                      <span className="text-xl">{fruit.symbol}</span>
                    )}
                    <div>
                      <span className="text-xs font-bold text-white block">{fruit.name}</span>
                      <span className="text-[10px] text-slate-400">${fruit.priceBeli.toLocaleString()}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getRarityBadge(fruit.rarity)}`}>
                    {fruit.rarity}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Blox Fruits Official Gacha Odds */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            Blox Fruit Dealer Cousin Rates
          </h4>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-purple-950/20 border border-purple-500/20 text-purple-300">
              <span className="font-bold">Mythical Tier (Kitsune, Dragon, Leopard, Dough...)</span>
              <span className="font-extrabold tabular-nums">~3.0%</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-amber-950/20 border border-amber-500/20 text-amber-300">
              <span className="font-bold">Legendary Tier (Buddha, Portal, Rumble, Blizzard...)</span>
              <span className="font-extrabold tabular-nums">~8.0%</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-blue-950/20 border border-blue-500/20 text-blue-300">
              <span className="font-bold">Rare Tier (Magma, Light, Ghost, Rubber...)</span>
              <span className="font-extrabold tabular-nums">~19.0%</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-300">
              <span className="font-bold">Uncommon Tier (Ice, Flame, Dark, Sand...)</span>
              <span className="font-extrabold tabular-nums">~30.0%</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/40 border border-slate-700/40 text-slate-300">
              <span className="font-bold">Common Tier (Rocket, Spin, Blade, Bomb...)</span>
              <span className="font-extrabold tabular-nums">~40.0%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
