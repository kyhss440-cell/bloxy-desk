import { useState } from 'react';
import { BLOX_FIGHTING_STYLES } from '../data/fightingStylesData';
import { FightingStyle } from '../types/bloxfruits';
import FightingStyleArtwork from './FightingStyleArtwork';
import { sounds } from '../utils/audio';
import {
  CheckCircle2,
  Circle,
  Trophy,
  Flame,
  Zap,
  Award,
  GitBranch,
  Info,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

const SUPERHUMAN_PREREQS = ['dark_step', 'electric', 'water_kung_fu', 'dragon_breath'];
const GODHUMAN_PREREQS = [
  'superhuman',
  'death_step',
  'sharkman_karate',
  'electric_claw',
  'dragon_talon',
];

const TIER_ORDER = ['S+', 'S', 'A', 'B', 'C'] as const;

export function CompareFightingStyles({
  onInspectStyle,
}: {
  onInspectStyle: (style: FightingStyle) => void;
}) {
  const [styleAId, setStyleAId] = useState<string>('godhuman');
  const [styleBId, setStyleBId] = useState<string>('sanguine_art');

  const styleA = BLOX_FIGHTING_STYLES.find((s) => s.id === styleAId) || BLOX_FIGHTING_STYLES[0];
  const styleB = BLOX_FIGHTING_STYLES.find((s) => s.id === styleBId) || BLOX_FIGHTING_STYLES[1];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">Compare Any Two Fighting Styles</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Contrast Beli & Fragment costs, mastery prerequisites, PvP/Grind/Mobility ratings, cooldowns, and complete movesets side by side.
        </p>
      </div>

      {/* Style Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-[#070b17] border border-purple-500/35">
          <label className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-2">
            Fighting Style 1
          </label>
          <select
            value={styleAId}
            onChange={(e) => {
              setStyleAId(e.target.value);
              sounds.playClick();
            }}
            className="w-full px-3 py-2.5 rounded-xl bg-[#04060d] border border-slate-800 text-sm text-white focus:outline-none focus:border-purple-400 cursor-pointer"
          >
            {BLOX_FIGHTING_STYLES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} (Sea {s.sea} · {s.category})
              </option>
            ))}
          </select>
        </div>

        <div className="p-4 rounded-2xl bg-[#070b17] border border-sky-500/35">
          <label className="text-xs font-bold text-sky-400 uppercase tracking-wider block mb-2">
            Fighting Style 2
          </label>
          <select
            value={styleBId}
            onChange={(e) => {
              setStyleBId(e.target.value);
              sounds.playClick();
            }}
            className="w-full px-3 py-2.5 rounded-xl bg-[#04060d] border border-slate-800 text-sm text-white focus:outline-none focus:border-sky-400 cursor-pointer"
          >
            {BLOX_FIGHTING_STYLES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} (Sea {s.sea} · {s.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-Side Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          { style: styleA, border: 'border-purple-500/35', text: 'text-purple-400' },
          { style: styleB, border: 'border-sky-500/35', text: 'text-sky-400' },
        ].map(({ style, border, text }, idx) => (
          <div
            key={`${style.id}-${idx}`}
            className={`p-6 rounded-3xl bg-[#070b17] border ${border} space-y-5 flex flex-col justify-between`}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-3.5 min-w-0">
                  <FightingStyleArtwork style={style} size="md" />
                  <div className="min-w-0">
                    <span className={`text-[11px] font-bold uppercase tracking-wider block ${text}`}>
                      Sea {style.sea} · {style.category}
                    </span>
                    <h3 className="text-2xl font-black text-white truncate">{style.name}</h3>
                    <span className="text-xs text-slate-400 block truncate">
                      Trainer: {style.npcName}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{style.description}</p>

              {/* Ratings & Costs */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs tabular-nums">
                <div className="p-2.5 rounded-xl bg-[#04060d] border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">PvP Tier</span>
                  <span className="text-base font-black text-red-400">{style.pvpTier}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#04060d] border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Grind Tier</span>
                  <span className="text-base font-black text-sky-400">{style.grindTier}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#04060d] border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Mobility</span>
                  <span className="text-base font-black text-purple-400">{style.mobilityTier}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#04060d] border border-slate-800 text-xs tabular-nums">
                <div>
                  <span className="text-[10px] text-slate-400 block">Cost (Beli / Frags)</span>
                  <span className="font-bold text-amber-400">
                    ${style.costBeli.toLocaleString()} / {style.costFragments.toLocaleString()} Frags
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Max Skill Mastery</span>
                  <span className="font-bold text-white">{style.maxMoveMastery} Mastery</span>
                </div>
              </div>

              {/* Moveset */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 block">
                  Moveset ({style.moves.length} Skills)
                </span>
                {style.moves.map((m) => (
                  <div
                    key={m.key}
                    className="p-3 rounded-xl bg-[#04060d] border border-slate-800/90 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-white">
                        <span className={text}>[{m.key}]</span> {m.name}
                      </span>
                      <span className="text-[10px] font-mono text-amber-400 tabular-nums">
                        Mast. {m.mastery} · {m.cooldown}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{m.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                onInspectStyle(style);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>Inspect Full {style.name} Page</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FightingStyleTierList({
  onInspectStyle,
}: {
  onInspectStyle: (style: FightingStyle) => void;
}) {
  const [focus, setFocus] = useState<'overall' | 'pvp' | 'grind' | 'mobility'>('overall');

  const getRank = (s: FightingStyle) => {
    if (focus === 'pvp') return s.pvpTier;
    if (focus === 'grind') return s.grindTier;
    if (focus === 'mobility') return s.mobilityTier;
    // Overall composite: highlight top PvP + Grind meta
    if (s.id === 'godhuman' || s.id === 'sanguine_art') return 'S+';
    if (s.id === 'electric_claw' || s.id === 'dragon_talon' || s.id === 'sharkman_karate' || s.id === 'superhuman') return 'S';
    if (s.id === 'death_step' || s.id === 'water_kung_fu') return 'A';
    if (s.id === 'dragon_breath' || s.id === 'electric' || s.id === 'dark_step' || s.id === 'advanced_combat') return 'B';
    return 'C';
  };

  const getTierStyle = (tier: string) => {
    switch (tier) {
      case 'S+':
        return 'bg-red-500/20 border-red-500/50 text-red-300';
      case 'S':
        return 'bg-purple-500/20 border-purple-500/50 text-purple-300';
      case 'A':
        return 'bg-sky-500/20 border-sky-500/50 text-sky-300';
      case 'B':
        return 'bg-amber-500/15 border-amber-500/40 text-amber-300';
      default:
        return 'bg-slate-800/70 border-slate-700 text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            Fighting Style Meta Tier List & Specialists
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Switch between Overall Meta, Best PvP Styles, Best Grinding Styles, and Best Mobility Styles. Click any style to view full move stats.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-[#04060d] rounded-xl border border-slate-800 text-xs shrink-0">
          {[
            { key: 'overall', label: 'Overall Meta' },
            { key: 'pvp', label: 'Best PvP Styles' },
            { key: 'grind', label: 'Best Grinding Styles' },
            { key: 'mobility', label: 'Best Mobility Styles' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setFocus(tab.key as typeof focus);
                sounds.playClick();
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                focus === tab.key
                  ? 'bg-gradient-to-r from-red-500 to-purple-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Spotlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#070b17] border border-red-500/30 space-y-1.5">
          <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
            <Flame className="w-4 h-4" />
            Best PvP Kings
          </span>
          <p className="text-sm font-extrabold text-white">Godhuman & Sanguine Art</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Godhuman leads single-target burst & Instinct breaking; Sanguine Art dominates 1vX sustain via Bloodbane Drain life-leech.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#070b17] border border-sky-500/30 space-y-1.5">
          <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            Best Grinding Champions
          </span>
          <p className="text-sm font-extrabold text-white">Sanguine Art & Sharkman Karate</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Sharkman Karate has the fastest stationary M1 spam with Awakened Buddha; Sanguine Art adds wide cleave and HP sustain.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#070b17] border border-purple-500/30 space-y-1.5">
          <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
            <Zap className="w-4 h-4" />
            Best Mobility Dashers
          </span>
          <p className="text-sm font-extrabold text-white">Electric Claw & Godhuman</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Electric Claw X (hold) & C cover huge distance instantly; Dragon Talon X (Dojo Upgraded) adds controllable aerial flight.
          </p>
        </div>
      </div>

      {/* Tier Rows */}
      <div className="space-y-3">
        {TIER_ORDER.map((tier) => {
          const matching = BLOX_FIGHTING_STYLES.filter((s) => getRank(s) === tier);
          if (matching.length === 0) return null;

          return (
            <div
              key={tier}
              className="rounded-2xl bg-[#070b17] border border-slate-800 overflow-hidden flex flex-col sm:flex-row"
            >
              <div
                className={`w-full sm:w-24 py-3 sm:py-0 flex items-center justify-center font-black text-2xl border-b sm:border-b-0 sm:border-r border-slate-800 shrink-0 ${getTierStyle(
                  tier
                )}`}
              >
                {tier}
              </div>
              <div className="flex-1 p-4 flex flex-wrap gap-3">
                {matching.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onInspectStyle(s);
                    }}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-[#04060d] hover:bg-slate-900 border border-slate-800 hover:border-sky-400/50 transition-all cursor-pointer text-left"
                  >
                    <FightingStyleArtwork style={s} size="sm" />
                    <div>
                      <div className="text-sm font-bold text-white">{s.name}</div>
                      <div className="text-[11px] text-slate-400 tabular-nums">
                        Sea {s.sea} · PvP {s.pvpTier} · Grind {s.grindTier}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ProgressionAndTracker({
  unlockedIds,
  masteryMap,
  onToggleUnlocked,
  onChangeMastery,
  onResetTracker,
  onInspectStyle,
}: {
  unlockedIds: string[];
  masteryMap: Record<string, number>;
  onToggleUnlocked: (id: string) => void;
  onChangeMastery: (id: string, val: number) => void;
  onResetTracker: () => void;
  onInspectStyle: (style: FightingStyle) => void;
}) {
  const superhumanReadyCount = SUPERHUMAN_PREREQS.filter(
    (id) => (masteryMap[id] || 0) >= 300
  ).length;
  const godhumanReadyCount = GODHUMAN_PREREQS.filter(
    (id) => (masteryMap[id] || 0) >= 400
  ).length;

  return (
    <div className="space-y-8">
      {/* Fighting Style Progression Roadmap */}
      <section className="p-6 rounded-3xl bg-[#070b17] border border-slate-800 space-y-5">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
            <GitBranch className="w-6 h-6 text-purple-400" />
            Optimal Fighting Style Progression Guide (Sea 1 → Sea 3)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Follow this exact route to avoid wasting Beli or Fragments while progressing smoothly toward Godhuman and Sanguine Art.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#04060d] border border-slate-800 space-y-2">
            <span className="font-bold text-sky-400 block">Step 1 · First Sea</span>
            <p className="font-extrabold text-white text-sm">Combat → Dark Step → Water Kung Fu</p>
            <p className="text-slate-400 leading-relaxed">
              Grab Dark Step ($150k) early if needed, then prioritize Water Kung Fu ($750k) for fast grinding. Eventually level Dark Step, Electric, & Water Kung Fu to 300+ (Superhuman) and 400+ (V2s).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#04060d] border border-slate-800 space-y-2">
            <span className="font-bold text-amber-400 block">Step 2 · Second Sea</span>
            <p className="font-extrabold text-white text-sm">Dragon Breath → Sharkman Karate</p>
            <p className="text-slate-400 leading-relaxed">
              Pick up Dragon Breath (1,500 Frags). Once Water Kung Fu hits 400 Mastery & Tide Keeper drops Water Key, unlock Sharkman Karate ($2.5M + 5k Frags) for unmatched Buddha grinding, plus Death Step & Superhuman.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#04060d] border border-purple-500/35 space-y-2">
            <span className="font-bold text-purple-400 block">Step 3 · Third Sea V2s</span>
            <p className="font-extrabold text-white text-sm">Electric Claw & Dragon Talon → Godhuman</p>
            <p className="text-slate-400 leading-relaxed">
              Evolve Electric → Electric Claw (400 Mastery + 30s Sprint) and Dragon Breath → Dragon Talon (400 Mastery + Fire Essence at Dragon Dojo). Push all 5 V2/Superhuman styles to 400 Mastery to unlock Godhuman.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#04060d] border border-red-500/35 space-y-2">
            <span className="font-bold text-red-400 block">Parallel Path · Leviathan</span>
            <p className="font-extrabold text-white text-sm">Sanguine Art (0 Style Prereqs)</p>
            <p className="text-slate-400 leading-relaxed">
              Sanguine Art requires zero prior fighting style mastery—only 1 Leviathan Heart, 2 Dark Fragments, 20 Demonic Wisps, 20 Vampire Fangs, $5M Beli, and 5,000 Fragments at Shafi.
            </p>
          </div>
        </div>

        {/* Divine Art / Latest Update Clarity */}
        <div className="p-4 rounded-2xl bg-sky-950/20 border border-sky-500/30 flex items-start gap-3 text-xs text-sky-100">
          <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-sky-300 block mb-0.5">Latest Release Status Note (Divine Art vs. Live Styles)</span>
            <p className="leading-relaxed text-slate-300">
              All <strong>13 live styles</strong> in Blox Fruits are indexed here, including <strong>Advanced Combat</strong> (First Sea Secrets Master quest), <strong>Dragon Talon Dojo Upgrades</strong> (Update 24 Uzoth relocation to Hydra Island), and <strong>Sharkman Master Upgrades</strong> (Lv. 2200). <em>Divine Art</em> remains teased/unreleased in live servers and is deliberately excluded from unlockable checklists until officially released.
            </p>
          </div>
        </div>
      </section>

      {/* Milestone Calculators */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-[#070b17] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-extrabold text-white">Superhuman Milestone (4 Styles @ 300+)</span>
            <span className="font-mono font-bold text-sky-400 tabular-nums">
              {superhumanReadyCount} / 4 Ready
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-[#04060d] border border-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-purple-500 transition-all duration-300"
              style={{ width: `${(superhumanReadyCount / 4) * 100}%` }}
            />
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] text-slate-400 tabular-nums">
            {SUPERHUMAN_PREREQS.map((id) => {
              const s = BLOX_FIGHTING_STYLES.find((x) => x.id === id);
              const val = masteryMap[id] || 0;
              return (
                <span key={id} className={val >= 300 ? 'text-emerald-400 font-semibold' : ''}>
                  {s?.name}: {val}/300
                </span>
              );
            })}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#070b17] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-extrabold text-white">Godhuman Milestone (5 Styles @ 400+)</span>
            <span className="font-mono font-bold text-purple-400 tabular-nums">
              {godhumanReadyCount} / 5 Ready
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-[#04060d] border border-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 via-purple-500 to-sky-400 transition-all duration-300"
              style={{ width: `${(godhumanReadyCount / 5) * 100}%` }}
            />
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] text-slate-400 tabular-nums">
            {GODHUMAN_PREREQS.map((id) => {
              const s = BLOX_FIGHTING_STYLES.find((x) => x.id === id);
              const val = masteryMap[id] || 0;
              return (
                <span key={id} className={val >= 400 ? 'text-emerald-400 font-semibold' : ''}>
                  {s?.name}: {val}/400
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Unlock Checklist + Mastery Tracker Table */}
      <section className="p-6 rounded-3xl bg-[#070b17] border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div>
            <h3 className="text-lg font-extrabold text-white">
              Unlock Checklist & Mastery Tracker
            </h3>
            <p className="text-xs text-slate-400">
              Automatically saved locally. Set your current mastery for each fighting style up to 600.
            </p>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onResetTracker();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#04060d] hover:bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Tracker</span>
          </button>
        </div>

        <div className="divide-y divide-slate-800/70">
          {BLOX_FIGHTING_STYLES.map((style) => {
            const isUnlocked = unlockedIds.includes(style.id);
            const currentMastery = masteryMap[style.id] || 0;

            return (
              <div
                key={style.id}
                className="py-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onToggleUnlocked(style.id);
                    }}
                    aria-label={`Toggle unlocked for ${style.name}`}
                    className={`p-2 rounded-xl border cursor-pointer transition-colors shrink-0 ${
                      isUnlocked
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400'
                        : 'bg-[#04060d] border-slate-800 text-slate-500 hover:text-white'
                    }`}
                  >
                    {isUnlocked ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>

                  <FightingStyleArtwork style={style} size="sm" />

                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        onInspectStyle(style);
                      }}
                      className="text-sm font-extrabold text-white hover:text-sky-400 transition-colors cursor-pointer truncate block"
                    >
                      {style.name}
                    </button>
                    <span className="text-[11px] text-slate-400 block truncate">
                      Sea {style.sea} · {style.npcName} · Max Skill Mast. {style.maxMoveMastery}
                    </span>
                  </div>
                </div>

                {/* Mastery Slider + Quick Presets */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[0, 300, 400, 600].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          onChangeMastery(style.id, preset);
                        }}
                        className={`px-2 py-1 rounded-md text-[10px] font-mono font-bold border cursor-pointer transition-colors tabular-nums ${
                          currentMastery === preset
                            ? 'bg-sky-500 text-slate-950 border-sky-400'
                            : 'bg-[#04060d] text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={600}
                    step={5}
                    value={currentMastery}
                    onChange={(e) => onChangeMastery(style.id, Number(e.target.value))}
                    aria-label={`${style.name} mastery slider`}
                    className="w-32 sm:w-40 accent-purple-500 cursor-pointer"
                  />

                  <span className="w-16 text-right font-mono text-xs font-bold text-sky-400 tabular-nums">
                    {currentMastery}/600
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
