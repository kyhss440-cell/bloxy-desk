import { useState } from 'react';
import { sounds } from '../../utils/audio';
import {
  Sliders,
  RotateCcw,
  Heart,
  Zap,
  Swords,
  Crosshair,
  Flame,
  Shield,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

type StatKey = 'melee' | 'defense' | 'sword' | 'gun' | 'fruit';

type StatsState = Record<StatKey, number>;

const MAX_LEVEL = 3000;
const MIN_STAT = 1;
const MAX_STAT = 3000;

interface StatConfig {
  key: StatKey;
  label: string;
  subtitle: string;
  accentText: string;
  barGradient: string;
  borderGlow: string;
  badgeBg: string;
  icon: typeof Swords;
}

const STAT_CONFIGS: StatConfig[] = [
  {
    key: 'melee',
    label: 'Melee',
    subtitle: 'Increases Fighting Style damage & Max Energy (+5 Energy/pt)',
    accentText: 'text-emerald-400',
    barGradient: 'from-emerald-500 to-teal-400',
    borderGlow: 'border-emerald-500/30',
    badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    icon: Zap,
  },
  {
    key: 'defense',
    label: 'Defense',
    subtitle: 'Increases Max Health (+5 HP/pt)',
    accentText: 'text-cyan-400',
    barGradient: 'from-cyan-500 to-blue-400',
    borderGlow: 'border-cyan-500/30',
    badgeBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    icon: Shield,
  },
  {
    key: 'sword',
    label: 'Sword',
    subtitle: 'Increases Sword & Katana damage',
    accentText: 'text-amber-400',
    barGradient: 'from-amber-500 to-orange-400',
    borderGlow: 'border-amber-500/30',
    badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    icon: Swords,
  },
  {
    key: 'gun',
    label: 'Gun',
    subtitle: 'Increases Gun & Rifle damage',
    accentText: 'text-violet-400',
    barGradient: 'from-violet-500 to-fuchsia-400',
    borderGlow: 'border-violet-500/30',
    badgeBg: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
    icon: Crosshair,
  },
  {
    key: 'fruit',
    label: 'Blox Fruit',
    subtitle: 'Increases Blox Fruit skill & M1 damage',
    accentText: 'text-rose-400',
    barGradient: 'from-rose-500 to-pink-400',
    borderGlow: 'border-rose-500/30',
    badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    icon: Flame,
  },
];

const BASE_STATS: StatsState = {
  melee: 1,
  defense: 1,
  sword: 1,
  gun: 1,
  fruit: 1,
};

function distributeByWeights(level: number, weights: Record<StatKey, number>): StatsState {
  const totalBudget = (level - 1) * 3;
  const result: StatsState = { ...BASE_STATS };
  const keys: StatKey[] = ['melee', 'defense', 'sword', 'gun', 'fruit'];

  let remaining = totalBudget;
  const weightSum = keys.reduce((sum, k) => sum + weights[k], 0);

  if (weightSum <= 0 || remaining <= 0) return result;

  // Initial proportional allocation capped at MAX_STAT
  for (const k of keys) {
    if (weights[k] <= 0) continue;
    const rawAdd = Math.floor((totalBudget * weights[k]) / weightSum);
    const add = Math.min(rawAdd, MAX_STAT - result[k], remaining);
    result[k] += add;
    remaining -= add;
  }

  // Distribute leftover rounding/overflow points across weighted stats that aren't maxed
  const orderedKeys = [...keys].sort((a, b) => weights[b] - weights[a]);
  while (remaining > 0) {
    let progressed = false;
    for (const k of orderedKeys) {
      if (weights[k] <= 0) continue;
      if (result[k] < MAX_STAT && remaining > 0) {
        const room = MAX_STAT - result[k];
        const add = Math.min(remaining, room);
        if (weights[k] === orderedKeys.reduce((m, key) => Math.max(m, weights[key]), 0) || remaining < 5) {
          result[k] += 1;
          remaining -= 1;
          progressed = true;
        } else {
          const slice = Math.min(add, Math.max(1, Math.floor(remaining / 2)));
          result[k] += slice;
          remaining -= slice;
          progressed = true;
        }
      }
    }
    if (!progressed) break;
  }

  return result;
}

export default function StatPointsPlanner() {
  const [level, setLevel] = useState<number>(MAX_LEVEL);
  const [stats, setStats] = useState<StatsState>(() =>
    distributeByWeights(MAX_LEVEL, { melee: 1, defense: 1, sword: 0, gun: 0, fruit: 1 })
  );
  const [activePreset, setActivePreset] = useState<string>('Fruit Main');

  const totalPoints = (level - 1) * 3;
  const spentPoints =
    (stats.melee - 1) +
    (stats.defense - 1) +
    (stats.sword - 1) +
    (stats.gun - 1) +
    (stats.fruit - 1);
  const availablePoints = Math.max(0, totalPoints - spentPoints);

  const maxHealth = 100 + (stats.defense - 1) * 5;
  const maxEnergy = 100 + (stats.melee - 1) * 5;

  const handleLevelChange = (nextLevelRaw: number) => {
    const nextLevel = Math.max(1, Math.min(MAX_LEVEL, nextLevelRaw || 1));
    const nextTotalBudget = (nextLevel - 1) * 3;

    setLevel(nextLevel);
    setStats((prev) => {
      const currentSpent =
        (prev.melee - 1) +
        (prev.defense - 1) +
        (prev.sword - 1) +
        (prev.gun - 1) +
        (prev.fruit - 1);

      if (currentSpent <= nextTotalBudget) {
        return prev;
      }

      // Scale down proportionally if new level has fewer points
      const ratio = nextTotalBudget / currentSpent;
      const keys: StatKey[] = ['melee', 'defense', 'sword', 'gun', 'fruit'];
      const scaled: StatsState = { ...BASE_STATS };
      let allocated = 0;

      for (const k of keys) {
        const add = Math.floor((prev[k] - 1) * ratio);
        scaled[k] = 1 + Math.min(MAX_STAT - 1, add);
        allocated += scaled[k] - 1;
      }

      let diff = nextTotalBudget - allocated;
      for (const k of keys) {
        if (diff <= 0) break;
        if (prev[k] > 1 && scaled[k] < MAX_STAT) {
          const extra = Math.min(diff, MAX_STAT - scaled[k]);
          scaled[k] += extra;
          diff -= extra;
        }
      }
      return scaled;
    });
  };

  const updateStat = (key: StatKey, targetValue: number) => {
    sounds.playClick();
    setActivePreset('Custom');
    setStats((prev) => {
      const currentSpent =
        (prev.melee - 1) +
        (prev.defense - 1) +
        (prev.sword - 1) +
        (prev.gun - 1) +
        (prev.fruit - 1);
      const otherSpent = currentSpent - (prev[key] - 1);
      const maxAllowedForKey = Math.min(MAX_STAT, 1 + Math.max(0, totalPoints - otherSpent));
      const clamped = Math.max(MIN_STAT, Math.min(maxAllowedForKey, targetValue));
      return { ...prev, [key]: clamped };
    });
  };

  const adjustStat = (key: StatKey, delta: number) => {
    updateStat(key, stats[key] + delta);
  };

  const applyPreset = (name: string, weights: Record<StatKey, number>) => {
    sounds.playClick();
    setActivePreset(name);
    setStats(distributeByWeights(level, weights));
  };

  const resetAllStats = () => {
    sounds.playClick();
    setActivePreset('Reset');
    setStats({ ...BASE_STATS });
  };

  // Detect archetype
  const getBuildDiagnosis = () => {
    if (spentPoints === 0) {
      return {
        title: 'Unallocated Stats',
        tone: 'text-amber-300',
        note: `You have ${availablePoints.toLocaleString()} points ready to assign. Pick a preset or allocate points below.`,
        isWarning: true,
      };
    }

    const offenseStats = [
      { name: 'Blox Fruit', val: stats.fruit },
      { name: 'Sword', val: stats.sword },
      { name: 'Gun', val: stats.gun },
      { name: 'Melee', val: stats.melee },
    ].sort((a, b) => b.val - a.val);

    const lowDefense = stats.defense < Math.min(MAX_STAT, level * 0.4) && level >= 100;
    const lowEnergy = stats.melee < Math.min(MAX_STAT, level * 0.35) && level >= 100;

    if (stats.fruit >= 1500 && stats.sword >= 1500) {
      return {
        title: 'Hybrid Fruit + Sword Build',
        tone: 'text-purple-300',
        note: 'Balanced dual-scaling setup. Pair with Strong Grip enchanted swords or hybrid PvP combos.',
        isWarning: lowDefense || lowEnergy,
      };
    }
    if (stats.fruit > stats.sword && stats.fruit > stats.gun && stats.fruit >= Math.max(100, level * 0.5)) {
      return {
        title: 'Blox Fruit Main',
        tone: 'text-rose-300',
        note: lowDefense
          ? 'Tip: Defense is low — invest more into Defense so you survive PvP bursts and raid bosses.'
          : 'Optimal Fruit Main spread with strong Energy, Survivability, and Fruit damage.',
        isWarning: lowDefense || lowEnergy,
      };
    }
    if (stats.sword > stats.fruit && stats.sword > stats.gun && stats.sword >= Math.max(100, level * 0.5)) {
      return {
        title: 'Sword Main',
        tone: 'text-amber-300',
        note: lowDefense
          ? 'Tip: Increase Defense for close-range sword trades and Buddha grinding.'
          : 'Ideal Sword Main setup for Cursed Dual Katana, TTK, or Portal/Buddha sword play.',
        isWarning: lowDefense || lowEnergy,
      };
    }
    if (stats.gun > stats.fruit && stats.gun > stats.sword && stats.gun >= Math.max(100, level * 0.5)) {
      return {
        title: 'Gun Main',
        tone: 'text-violet-300',
        note: lowDefense
          ? 'Tip: Add more Defense to stay safe while aiming Skull Guitar or Dragonstorm.'
          : 'Sharpshooter Gun Main build built for high-burst ranged combos.',
        isWarning: lowDefense || lowEnergy,
      };
    }

    return {
      title: `Custom Spread (${offenseStats[0].name} Focused)`,
      tone: 'text-cyan-300',
      note:
        lowDefense || lowEnergy
          ? 'Keep Defense & Melee high enough for HP and Energy sustainability.'
          : 'Custom stat distribution active.',
      isWarning: lowDefense || lowEnergy,
    };
  };

  const diagnosis = getBuildDiagnosis();

  const presets: { label: string; desc: string; weights: Record<StatKey, number> }[] = [
    {
      label: 'Fruit Main',
      desc: 'Melee · Defense · Fruit',
      weights: { melee: 1, defense: 1, sword: 0, gun: 0, fruit: 1 },
    },
    {
      label: 'Sword Main',
      desc: 'Melee · Defense · Sword',
      weights: { melee: 1, defense: 1, sword: 1, gun: 0, fruit: 0 },
    },
    {
      label: 'Gun Main',
      desc: 'Melee · Defense · Gun',
      weights: { melee: 1, defense: 1, sword: 0, gun: 1, fruit: 0 },
    },
    {
      label: 'Buddha Grind',
      desc: 'Melee + Defense + Sword',
      weights: { melee: 1.2, defense: 1, sword: 0.8, gun: 0, fruit: 0 },
    },
    {
      label: 'Hybrid PvP',
      desc: 'Melee · Def · Fruit/Sword',
      weights: { melee: 1, defense: 1, sword: 0.5, gun: 0, fruit: 0.5 },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sliders className="w-6 h-6 text-emerald-400" />
              Stat Points Planner & Build Simulator
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Allocate up to 8,997 stat points (3 points per level up to Level 3000), preview exact HP & Energy scaling, and test PvP or grinding builds before spending a Stat Reset.
            </p>
          </div>

          <button
            onClick={resetAllStats}
            className="px-4 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shrink-0 self-start sm:self-center"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Stats (Plokster)</span>
          </button>
        </div>
      </div>

      {/* Level Control & Point Pool */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Character Level (1 – {MAX_LEVEL})
              </label>
              <span className="text-[11px] text-slate-500">
                Every level above 1 grants +3 Stat Points
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={MAX_LEVEL}
                value={level}
                onChange={(e) => {
                  sounds.playClick();
                  handleLevelChange(parseInt(e.target.value, 10) || 1);
                }}
                className="w-24 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-right text-lg font-black text-amber-400 tabular-nums focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <input
            type="range"
            min={1}
            max={MAX_LEVEL}
            value={level}
            onChange={(e) => handleLevelChange(parseInt(e.target.value, 10))}
            className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500 mr-1">Quick Levels:</span>
            {[
              { lbl: 'Lvl 700 (Sea 2)', val: 700 },
              { lbl: 'Lvl 1500 (Sea 3)', val: 1500 },
              { lbl: 'Lvl 2550', val: 2550 },
              { lbl: 'Lvl 3000 (Max)', val: 3000 },
            ].map((q) => (
              <button
                key={q.val}
                onClick={() => {
                  sounds.playClick();
                  handleLevelChange(q.val);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                  level === q.val
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-600'
                }`}
              >
                {q.lbl}
              </button>
            ))}
          </div>
        </div>

        {/* Points Pool Card */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Available Stat Points
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {spentPoints.toLocaleString()} / {totalPoints.toLocaleString()} used
            </span>
          </div>

          <div
            className={`text-4xl font-black tabular-nums ${
              availablePoints > 0 ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            {availablePoints.toLocaleString()}
          </div>

          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-300"
              style={{ width: `${totalPoints > 0 ? Math.min(100, (spentPoints / totalPoints) * 100) : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Build Presets */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Quick Build Presets (Auto-scales to Level {level})
          </span>
          <span className="text-[11px] text-slate-500">Active: {activePreset}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {presets.map((p) => {
            const isSelected = activePreset === p.label;
            return (
              <button
                key={p.label}
                onClick={() => applyPreset(p.label, p.weights)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400 text-white shadow-md'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="text-xs font-extrabold">{p.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{p.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split: 5 Stat Sliders + Live Character Vitals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 5 Stat Allocators */}
        <div className="lg:col-span-2 space-y-3">
          {STAT_CONFIGS.map((cfg) => {
            const Icon = cfg.icon;
            const val = stats[cfg.key];
            const maxReachable = Math.min(MAX_STAT, val + availablePoints);
            const pct = Math.round((val / MAX_STAT) * 100);

            return (
              <div
                key={cfg.key}
                className={`p-4 rounded-2xl bg-slate-900/85 border ${cfg.borderGlow} space-y-3`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${cfg.badgeBg}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white">{cfg.label}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${cfg.badgeBg}`}>
                          {pct}% Cap
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{cfg.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-semibold">Lv.</span>
                    <input
                      type="number"
                      min={MIN_STAT}
                      max={maxReachable}
                      value={val}
                      onChange={(e) => updateStat(cfg.key, parseInt(e.target.value, 10) || MIN_STAT)}
                      className={`w-20 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-right font-black text-sm tabular-nums focus:outline-none focus:border-amber-400 ${cfg.accentText}`}
                    />
                  </div>
                </div>

                {/* Progress + Range */}
                <div className="space-y-1.5">
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full bg-gradient-to-r ${cfg.barGradient} transition-all duration-200`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min={MIN_STAT}
                    max={MAX_STAT}
                    value={val}
                    onChange={(e) => updateStat(cfg.key, parseInt(e.target.value, 10))}
                    className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                </div>

                {/* Quick +/- Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-1">
                    {[-100, -10, -1].map((delta) => (
                      <button
                        key={delta}
                        disabled={val <= MIN_STAT}
                        onClick={() => adjustStat(cfg.key, delta)}
                        className="px-2 py-1 rounded-md bg-slate-950 hover:bg-slate-800 disabled:opacity-35 border border-slate-800 text-[11px] font-bold text-slate-300 tabular-nums cursor-pointer disabled:cursor-not-allowed transition-colors"
                      >
                        {delta}
                      </button>
                    ))}
                    <button
                      disabled={val <= MIN_STAT}
                      onClick={() => updateStat(cfg.key, MIN_STAT)}
                      className="px-2 py-1 rounded-md bg-slate-950 hover:bg-slate-800 disabled:opacity-35 border border-slate-800 text-[11px] font-bold text-slate-400 cursor-pointer disabled:cursor-not-allowed transition-colors"
                    >
                      Min
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    {[1, 10, 100].map((delta) => (
                      <button
                        key={delta}
                        disabled={availablePoints <= 0 || val >= MAX_STAT}
                        onClick={() => adjustStat(cfg.key, delta)}
                        className="px-2 py-1 rounded-md bg-slate-950 hover:bg-slate-800 disabled:opacity-35 border border-slate-800 text-[11px] font-bold text-emerald-300 tabular-nums cursor-pointer disabled:cursor-not-allowed transition-colors"
                      >
                        +{delta}
                      </button>
                    ))}
                    <button
                      disabled={availablePoints <= 0 || val >= MAX_STAT}
                      onClick={() => updateStat(cfg.key, maxReachable)}
                      className="px-2.5 py-1 rounded-md bg-amber-500/15 hover:bg-amber-500/25 disabled:opacity-35 border border-amber-500/40 text-[11px] font-extrabold text-amber-300 cursor-pointer disabled:cursor-not-allowed transition-colors"
                    >
                      Max
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Vitals & Diagnosis Sidebar */}
        <div className="space-y-4">
          {/* Health & Energy */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Live Character Vitals
            </h3>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/20">
              <div className="flex items-center justify-between text-xs text-cyan-400 font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-400" />
                  Max Health (Base)
                </span>
                <span className="text-[10px] font-mono text-slate-500">Def {stats.defense}</span>
              </div>
              <div className="text-2xl font-black text-white tabular-nums">
                {maxHealth.toLocaleString()} HP
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Formula: 100 + (Defense - 1) × 5
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/20">
              <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  Max Energy (Stamina)
                </span>
                <span className="text-[10px] font-mono text-slate-500">Melee {stats.melee}</span>
              </div>
              <div className="text-2xl font-black text-white tabular-nums">
                {maxEnergy.toLocaleString()} Energy
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Formula: 100 + (Melee - 1) × 5
              </p>
            </div>
          </div>

          {/* Offense Scaling Breakdown */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Offense Power Scaling
            </h3>
            <div className="space-y-2.5">
              {STAT_CONFIGS.filter((s) => s.key !== 'defense').map((s) => {
                const val = stats[s.key];
                const pct = Math.round((val / MAX_STAT) * 100);
                return (
                  <div key={s.key} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-semibold">{s.label}</span>
                      <span className={`font-bold tabular-nums ${s.accentText}`}>
                        {val.toLocaleString()} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${s.barGradient}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Build Analysis */}
          <div
            className={`p-5 rounded-2xl border space-y-2 ${
              diagnosis.isWarning
                ? 'bg-amber-950/20 border-amber-500/30'
                : 'bg-emerald-950/20 border-emerald-500/30'
            }`}
          >
            <div className="flex items-center gap-2">
              {diagnosis.isWarning ? (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span className={`text-sm font-extrabold ${diagnosis.tone}`}>{diagnosis.title}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{diagnosis.note}</p>
            <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-800/70">
              In-game Stat Reset costs 2,500 Fragments from Plokster (Second Sea Bridge / Third Sea Castle on the Sea) or active reset codes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
