import { useState, useRef, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { BLOX_FRUITS_DATABASE } from '../../data/fruitsData';
import { BloxFruit } from '../../types/bloxfruits';
import { sounds } from '../../utils/audio';
import { Dices, Sparkles, Coins, History, Trophy, RefreshCw, TrendingUp } from 'lucide-react';

const CARD_WIDTH = 164;
const CARD_GAP = 12;
const CARD_STEP = CARD_WIDTH + CARD_GAP;
const REEL_LENGTH = 72;
const WIN_INDEX = 62;
const SPIN_DURATION_MS = 6500;

type LuckMultiplier = 1 | 2 | 3 | 5;

interface OddsBreakdown {
  Mythical: number;
  Legendary: number;
  Rare: number;
  Uncommon: number;
  Common: number;
}

const BASE_ODDS_BY_LUCK: Record<LuckMultiplier, OddsBreakdown> = {
  1: { Mythical: 3, Legendary: 8, Rare: 19, Uncommon: 30, Common: 40 },
  2: { Mythical: 6, Legendary: 16, Rare: 25, Uncommon: 28, Common: 25 },
  3: { Mythical: 10, Legendary: 22, Rare: 28, Uncommon: 24, Common: 16 },
  5: { Mythical: 18, Legendary: 30, Rare: 26, Uncommon: 16, Common: 10 },
};

const LUCK_OPTIONS: Array<{ value: LuckMultiplier; label: string; tag: string }> = [
  { value: 1, label: '1x Normal', tag: 'Default Odds' },
  { value: 2, label: '2x Luck', tag: 'Double Mythical' },
  { value: 3, label: '3x Luck', tag: 'High Roll' },
  { value: 5, label: '5x Surge', tag: 'Max Chance' },
];

function computeEffectiveOdds(luck: LuckMultiplier, dryStreak: number): OddsBreakdown {
  const base = BASE_ODDS_BY_LUCK[luck];
  const pityBonus = Math.min(8, dryStreak * 0.5);
  const mythical = base.Mythical + pityBonus;

  let remainingDrop = pityBonus;
  const commonDrop = Math.min(base.Common, remainingDrop);
  const common = base.Common - commonDrop;
  remainingDrop -= commonDrop;

  const uncommonDrop = Math.min(base.Uncommon, remainingDrop);
  const uncommon = base.Uncommon - uncommonDrop;

  return {
    Mythical: Number(mythical.toFixed(1)),
    Legendary: base.Legendary,
    Rare: base.Rare,
    Uncommon: Number(uncommon.toFixed(1)),
    Common: Number(common.toFixed(1)),
  };
}

function getFruitSpinnerPalette(rarity: BloxFruit['rarity']) {
  switch (rarity) {
    case 'Mythical':
      return {
        gradient: 'bg-gradient-to-b from-red-500 via-red-700 to-red-950',
        labelText: 'text-red-400',
        badge: 'bg-red-600/20 text-red-300 border-red-500/50',
      };
    case 'Legendary':
      return {
        gradient: 'bg-gradient-to-b from-fuchsia-500 via-purple-700 to-purple-950',
        labelText: 'text-fuchsia-400',
        badge: 'bg-fuchsia-600/20 text-fuchsia-300 border-fuchsia-500/50',
      };
    case 'Rare':
      return {
        gradient: 'bg-gradient-to-b from-violet-500 via-indigo-700 to-slate-950',
        labelText: 'text-violet-300',
        badge: 'bg-violet-600/20 text-violet-300 border-violet-500/50',
      };
    case 'Uncommon':
      return {
        gradient: 'bg-gradient-to-b from-sky-500 via-blue-700 to-slate-950',
        labelText: 'text-sky-300',
        badge: 'bg-sky-600/20 text-sky-300 border-sky-500/50',
      };
    default:
      return {
        gradient: 'bg-gradient-to-b from-slate-400 via-slate-600 to-slate-800',
        labelText: 'text-slate-300',
        badge: 'bg-slate-700/30 text-slate-300 border-slate-600/40',
      };
  }
}

function getWeightedRandomFruit(odds: OddsBreakdown): BloxFruit {
  const rand = Math.random() * 100;
  let targetRarity: BloxFruit['rarity'] = 'Common';
  if (rand < odds.Mythical) {
    targetRarity = 'Mythical';
  } else if (rand < odds.Mythical + odds.Legendary) {
    targetRarity = 'Legendary';
  } else if (rand < odds.Mythical + odds.Legendary + odds.Rare) {
    targetRarity = 'Rare';
  } else if (rand < odds.Mythical + odds.Legendary + odds.Rare + odds.Uncommon) {
    targetRarity = 'Uncommon';
  }

  const possibleFruits = BLOX_FRUITS_DATABASE.filter((f) => f.rarity === targetRarity);
  return (
    possibleFruits[Math.floor(Math.random() * possibleFruits.length)] ||
    BLOX_FRUITS_DATABASE[0]
  );
}

function buildInitialReel(): BloxFruit[] {
  const showcaseIds = ['magma', 'rocket', 'kitsune', 'portal', 'buddha', 'dragon', 'light', 'dough', 'ice'];
  const picked = showcaseIds
    .map((id) => BLOX_FRUITS_DATABASE.find((f) => f.id === id))
    .filter((f): f is BloxFruit => Boolean(f));

  if (picked.length >= 7) {
    return picked;
  }
  return BLOX_FRUITS_DATABASE.slice(0, 9);
}

export default function FruitGachaPicker() {
  const [bountifulBeli, setBountifulBeli] = useState(5000000);
  const [isRolling, setIsRolling] = useState(false);
  const [currentResult, setCurrentResult] = useState<BloxFruit | null>(null);
  const [history, setHistory] = useState<BloxFruit[]>([]);
  const [luckMultiplier, setLuckMultiplier] = useState<LuckMultiplier>(1);
  const [dryStreak, setDryStreak] = useState(0);

  const [reelFruits, setReelFruits] = useState<BloxFruit[]>(() => buildInitialReel());
  const [trackOffsetPx, setTrackOffsetPx] = useState<number>(-(2 * CARD_STEP + CARD_WIDTH / 2));
  const [isAnimatingTrack, setIsAnimatingTrack] = useState(false);
  const [landedIndex, setLandedIndex] = useState<number | null>(null);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const spinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickRafRef = useRef<number | null>(null);
  const rafFrame1Ref = useRef<number | null>(null);
  const rafFrame2Ref = useRef<number | null>(null);

  const rollCost = 250000;

  const effectiveOdds = useMemo(
    () => computeEffectiveOdds(luckMultiplier, dryStreak),
    [luckMultiplier, dryStreak]
  );

  const pityBonus = Math.min(8, dryStreak * 0.5);

  const cleanupAnimationTimers = () => {
    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
      spinTimeoutRef.current = null;
    }
    if (tickRafRef.current) {
      cancelAnimationFrame(tickRafRef.current);
      tickRafRef.current = null;
    }
    if (rafFrame1Ref.current) {
      cancelAnimationFrame(rafFrame1Ref.current);
      rafFrame1Ref.current = null;
    }
    if (rafFrame2Ref.current) {
      cancelAnimationFrame(rafFrame2Ref.current);
      rafFrame2Ref.current = null;
    }
  };

  useEffect(() => {
    return () => cleanupAnimationTimers();
  }, []);

  const performGachaRoll = () => {
    if (bountifulBeli < rollCost || isRolling) return;

    cleanupAnimationTimers();
    sounds.playClick();
    setBountifulBeli((prev) => prev - rollCost);
    setIsRolling(true);
    setLandedIndex(null);

    const activeOdds = computeEffectiveOdds(luckMultiplier, dryStreak);
    const finalSelected = getWeightedRandomFruit(activeOdds);

    const nextReel: BloxFruit[] = [];
    for (let i = 0; i < REEL_LENGTH; i++) {
      if (i === WIN_INDEX) {
        nextReel.push(finalSelected);
      } else {
        const filler =
          Math.random() < 0.35
            ? BLOX_FRUITS_DATABASE[Math.floor(Math.random() * BLOX_FRUITS_DATABASE.length)]
            : getWeightedRandomFruit(activeOdds);
        nextReel.push(filler);
      }
    }

    const startIndex = 2;
    const startOffset = -(startIndex * CARD_STEP + CARD_WIDTH / 2);
    const jitter = (Math.random() - 0.5) * (CARD_WIDTH * 0.42);
    const targetOffset = -(WIN_INDEX * CARD_STEP + CARD_WIDTH / 2 + jitter);

    setIsAnimatingTrack(false);
    setReelFruits(nextReel);
    setTrackOffsetPx(startOffset);

    rafFrame1Ref.current = requestAnimationFrame(() => {
      rafFrame2Ref.current = requestAnimationFrame(() => {
        setIsAnimatingTrack(true);
        setTrackOffsetPx(targetOffset);

        let lastCardIndex = startIndex;
        const monitorTicks = () => {
          if (!trackRef.current) return;
          const matrix = new DOMMatrixReadOnly(getComputedStyle(trackRef.current).transform);
          const currentX = matrix.m41;
          const approxIndex = Math.floor((-currentX - CARD_WIDTH / 2) / CARD_STEP + 0.5);
          if (approxIndex !== lastCardIndex) {
            lastCardIndex = approxIndex;
            sounds.playGachaRoll();
          }
          tickRafRef.current = requestAnimationFrame(monitorTicks);
        };
        tickRafRef.current = requestAnimationFrame(monitorTicks);

        spinTimeoutRef.current = setTimeout(() => {
          if (tickRafRef.current) {
            cancelAnimationFrame(tickRafRef.current);
            tickRafRef.current = null;
          }

          setIsRolling(false);
          setLandedIndex(WIN_INDEX);
          setCurrentResult(finalSelected);
          setHistory((prev) => [finalSelected, ...prev].slice(0, 15));

          if (finalSelected.rarity === 'Mythical') {
            setDryStreak(0);
            sounds.playFanfare();
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#ef4444', '#f59e0b', '#ec4899', '#38bdf8'],
            });
          } else if (finalSelected.rarity === 'Legendary') {
            setDryStreak((prev) => prev + 1);
            sounds.playLevelUp();
            confetti({
              particleCount: 65,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#e879f9', '#a855f7', '#fbbf24'],
            });
          } else {
            setDryStreak((prev) => prev + 1);
            sounds.playClick();
          }
        }, SPIN_DURATION_MS + 80);
      });
    });
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
            Spin with realistic Blox Fruits dealer rates, luck chance boosts, and progressive Mythical pity luck.
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
              setBountifulBeli((prev) => prev + 2000000);
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

      {/* Horizontal Fruit Spinner Stage */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900/95 via-[#091224] to-[#050811] border border-slate-800 relative overflow-hidden flex flex-col items-center space-y-6 shadow-2xl">
        {/* Top Title + Chance Boost Bar */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <h3 className="text-lg sm:text-xl font-bold text-cyan-200 tracking-wide drop-shadow">
              Fruit Spinner
            </h3>
            {pityBonus > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/40 text-red-300 text-[11px] font-bold tabular-nums">
                +{pityBonus.toFixed(1)}% Mythical Pity
              </span>
            )}
          </div>

          {/* Chance Increase Controls */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950/90 rounded-xl border border-slate-800">
            <span className="px-2 text-[11px] font-bold text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Chance Boost:
            </span>
            {LUCK_OPTIONS.map((opt) => {
              const active = luckMultiplier === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  disabled={isRolling}
                  onClick={() => {
                    sounds.playClick();
                    setLuckMultiplier(opt.value);
                  }}
                  title={opt.tag}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors disabled:opacity-50 ${
                    active
                      ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Spinner Reel Frame with Top & Bottom Yellow Pointer Arrows */}
        <div className="relative w-full py-3">
          {/* Top Yellow Arrow Pointer */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-30 pointer-events-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
            <svg width="26" height="18" viewBox="0 0 26 18" fill="none">
              <path
                d="M2 2H24L13 15L2 2Z"
                fill="#facc15"
                stroke="#0f172a"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Bottom Yellow Arrow Pointer */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-30 pointer-events-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
            <svg width="26" height="18" viewBox="0 0 26 18" fill="none">
              <path
                d="M2 16H24L13 3L2 16Z"
                fill="#facc15"
                stroke="#0f172a"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Dark Spinner Viewport */}
          <div className="relative w-full h-[214px] rounded-2xl bg-[#070d18]/90 border-y-2 border-slate-700/80 overflow-hidden shadow-inner">
            {/* Subtle side edge fade */}
            <div className="absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[#050811] to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[#050811] to-transparent z-20 pointer-events-none" />

            {/* Subtle vertical alignment needle */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-yellow-400/50 z-20 pointer-events-none" />

            {/* Sliding Fruit Cards Track */}
            <div
              ref={trackRef}
              style={{
                left: '50%',
                transform: `translateX(${trackOffsetPx}px)`,
                transition: isAnimatingTrack
                  ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.08, 0.9, 0.14, 1)`
                  : 'none',
                gap: `${CARD_GAP}px`,
              }}
              className="absolute top-1/2 -translate-y-1/2 flex items-center will-change-transform"
            >
              {reelFruits.map((fruit, idx) => {
                const palette = getFruitSpinnerPalette(fruit.rarity);
                const isWinnerCard = !isRolling && landedIndex === idx;

                return (
                  <div
                    key={`${fruit.id}-${idx}`}
                    style={{ width: `${CARD_WIDTH}px` }}
                    className={`h-[188px] shrink-0 rounded-xl overflow-hidden border flex flex-col select-none transition-shadow duration-300 ${
                      isWinnerCard
                        ? 'border-yellow-400 ring-2 ring-yellow-400/60 shadow-[0_0_24px_rgba(250,204,21,0.45)]'
                        : 'border-slate-700/90 shadow-lg'
                    }`}
                  >
                    {/* Colored Gradient Backdrop + Fruit Artwork + Bold Name */}
                    <div className={`relative flex-1 flex flex-col items-center justify-center p-2.5 ${palette.gradient}`}>
                      {fruit.image ? (
                        <img
                          src={fruit.image}
                          alt={fruit.name}
                          draggable={false}
                          className="w-24 h-24 object-contain drop-shadow-[0_6px_12px_rgba(0,0,0,0.7)]"
                        />
                      ) : (
                        <span className="text-6xl drop-shadow">{fruit.symbol}</span>
                      )}

                      <span className="mt-1 text-lg font-black text-white tracking-tight leading-none text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] truncate max-w-full px-1">
                        {fruit.name}
                      </span>
                    </div>

                    {/* Bottom Rarity Bar */}
                    <div className="bg-[#0e131e] border-t border-slate-800/90 py-1.5 px-2 text-center">
                      <span className={`text-xs font-extrabold tracking-wide ${palette.labelText}`}>
                        {fruit.rarity}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Result Banner (when landed) */}
        {currentResult && !isRolling && (
          <div className="w-full max-w-xl p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {currentResult.image ? (
                <img
                  src={currentResult.image}
                  alt={currentResult.name}
                  className="w-11 h-11 object-contain shrink-0 filter drop-shadow-[0_0_10px_rgba(56,189,248,0.45)]"
                />
              ) : (
                <span className="text-3xl">{currentResult.symbol}</span>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base font-black text-white">
                    {currentResult.name} Fruit
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getFruitSpinnerPalette(currentResult.rarity).badge}`}
                  >
                    {currentResult.rarity}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {currentResult.bestFor}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0 tabular-nums">
              <span className="text-[10px] text-slate-500 uppercase block">Value</span>
              <span className="text-sm font-extrabold text-amber-400">
                ${currentResult.priceBeli.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex flex-col items-center gap-2">
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
            {isRolling
              ? 'Spinning Fruit...'
              : `Spin Dealer Fruit ($${rollCost.toLocaleString()} Beli)${luckMultiplier > 1 ? ` · ${luckMultiplier}x Luck` : ''}`}
          </button>

          {bountifulBeli < rollCost && (
            <p className="text-xs text-rose-400">
              Not enough Beli! Click "+$2M" above to refill pirate treasure.
            </p>
          )}
        </div>
      </div>

      {/* History & Live Odds Grid */}
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
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getFruitSpinnerPalette(fruit.rarity).badge}`}>
                    {fruit.rarity}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Blox Fruits Gacha Odds */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              Active Dealer Cousin Odds
            </h4>
            <span className="text-[11px] font-bold text-emerald-400">
              {luckMultiplier}x Boost{pityBonus > 0 ? ` + ${pityBonus.toFixed(1)}% Pity` : ''}
            </span>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-red-950/25 border border-red-500/25 text-red-300">
              <span className="font-bold">Mythical Tier (Kitsune, Dragon, Leopard, Dough...)</span>
              <span className="font-extrabold tabular-nums">{effectiveOdds.Mythical.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-fuchsia-950/25 border border-fuchsia-500/25 text-fuchsia-300">
              <span className="font-bold">Legendary Tier (Buddha, Portal, Rumble, Blizzard...)</span>
              <span className="font-extrabold tabular-nums">{effectiveOdds.Legendary.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-violet-950/25 border border-violet-500/25 text-violet-300">
              <span className="font-bold">Rare Tier (Magma, Light, Ghost, Rubber...)</span>
              <span className="font-extrabold tabular-nums">{effectiveOdds.Rare.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-sky-950/25 border border-sky-500/25 text-sky-300">
              <span className="font-bold">Uncommon Tier (Ice, Flame, Dark, Sand...)</span>
              <span className="font-extrabold tabular-nums">{effectiveOdds.Uncommon.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/40 border border-slate-700/40 text-slate-300">
              <span className="font-bold">Common Tier (Rocket, Spin, Blade, Bomb...)</span>
              <span className="font-extrabold tabular-nums">{effectiveOdds.Common.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
