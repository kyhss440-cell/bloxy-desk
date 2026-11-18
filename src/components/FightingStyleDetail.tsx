import { FightingStyle } from '../types/bloxfruits';
import FightingStyleArtwork, { TrainerNpcPortrait } from './FightingStyleArtwork';
import { sounds } from '../utils/audio';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  MapPin,
  Coins,
  Sparkles,
  Award,
  Swords,
  Flame,
  AlertTriangle,
  Info,
  Clock,
  Crosshair,
  ShieldCheck,
  Navigation,
} from 'lucide-react';

interface FightingStyleDetailProps {
  style: FightingStyle;
  allStyles: FightingStyle[];
  isUnlocked: boolean;
  masteryLevel: number;
  onToggleUnlocked: (id: string) => void;
  onChangeMastery: (id: string, val: number) => void;
  onSelectStyleByName: (name: string) => void;
  onBack: () => void;
  onOpenTrainerMap: (id: string) => void;
}

function getThemeAccents(theme: FightingStyle['theme']) {
  switch (theme) {
    case 'crimson':
      return {
        text: 'text-red-400',
        border: 'border-red-500/35',
        glow: 'shadow-[0_0_32px_-12px_rgba(239,68,68,0.4)]',
        btn: 'bg-red-500/15 border-red-500/40 text-red-300 hover:bg-red-500/25',
      };
    case 'purple':
      return {
        text: 'text-purple-400',
        border: 'border-purple-500/35',
        glow: 'shadow-[0_0_32px_-12px_rgba(168,85,247,0.4)]',
        btn: 'bg-purple-500/15 border-purple-500/40 text-purple-300 hover:bg-purple-500/25',
      };
    case 'electric':
    default:
      return {
        text: 'text-sky-400',
        border: 'border-sky-500/35',
        glow: 'shadow-[0_0_32px_-12px_rgba(56,189,248,0.4)]',
        btn: 'bg-sky-500/15 border-sky-500/40 text-sky-300 hover:bg-sky-500/25',
      };
  }
}

export default function FightingStyleDetail({
  style,
  allStyles,
  isUnlocked,
  masteryLevel,
  onToggleUnlocked,
  onChangeMastery,
  onSelectStyleByName,
  onBack,
  onOpenTrainerMap,
}: FightingStyleDetailProps) {
  const accent = getThemeAccents(style.theme);

  return (
    <div className="space-y-8">
      {/* Top Action & Progress Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <button
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#070b17] hover:bg-slate-900 border border-slate-800 text-sm font-semibold text-slate-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-sky-400" />
          <span>Back to All Fighting Styles</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              onOpenTrainerMap(style.id);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#070b17] hover:bg-slate-900 border border-slate-800 text-xs font-bold text-sky-400 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Locate Trainer on Map</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onToggleUnlocked(style.id);
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              isUnlocked
                ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/25'
                : 'bg-[#070b17] border-slate-700 text-slate-300 hover:border-purple-400/50 hover:text-white'
            }`}
          >
            {isUnlocked ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Circle className="w-4 h-4 text-slate-500" />
            )}
            <span>{isUnlocked ? 'Unlocked in Checklist' : 'Mark as Unlocked'}</span>
          </button>
        </div>
      </div>

      {/* Hero Showcase (Items 1-14 summary) */}
      <section
        className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#070b17] via-[#0c1020] to-[#04060d] border ${accent.border} ${accent.glow}`}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 sm:gap-8">
          <FightingStyleArtwork style={style} size="xl" className="mx-auto lg:mx-0" />

          <div className="flex-1 min-w-0 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold tracking-wider uppercase">
              <span className={accent.text}>{style.category}</span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span className="text-sky-400">Sea {style.sea}</span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span className="text-slate-300">{style.island}</span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span className="text-amber-400">PvP {style.pvpTier}</span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span className="text-emerald-400">Grind {style.grindTier}</span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span className="text-purple-400">Mobility {style.mobilityTier}</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white font-heading leading-tight">
                {style.name}
              </h1>
              {style.aliases && style.aliases.length > 0 && (
                <p className="text-xs text-slate-400 mt-1">
                  Also known as: {style.aliases.join(' · ')}
                </p>
              )}
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
              {style.description}
            </p>

            {/* Primary Spec Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-400 block">Required Beli</span>
                <span className="text-sm font-extrabold text-amber-400 tabular-nums">
                  {style.costBeli > 0 ? `$${style.costBeli.toLocaleString()}` : 'Free / 0 Beli'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Required Fragments</span>
                <span className="text-sm font-extrabold text-purple-400 tabular-nums">
                  {style.costFragments > 0 ? `${style.costFragments.toLocaleString()} Frags` : '0 Fragments'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Unlock Mastery Gate</span>
                <span className="text-sm font-extrabold text-sky-400 tabular-nums">
                  {style.requiredMasteryToUnlock > 0
                    ? `${style.requiredMasteryToUnlock} on Prereqs`
                    : '0 Mastery Req'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Max Skill Mastery</span>
                <span className="text-sm font-extrabold text-white tabular-nums">
                  {style.maxMoveMastery > 0 ? `${style.maxMoveMastery} Mastery` : 'M1 Only (0)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Mastery Slider for this style */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-200 block">
              Your Current Mastery Progress: <strong className="text-sky-400 font-mono tabular-nums">{masteryLevel} / 600</strong>
            </span>
            <span className="text-[11px] text-slate-400 block">
              {masteryLevel >= 400
                ? '400+ Mastery reached — Ready for V2 & Godhuman requirements!'
                : masteryLevel >= 300
                  ? '300+ Mastery reached — Qualifies for Superhuman prerequisite!'
                  : masteryLevel >= style.maxMoveMastery && style.maxMoveMastery > 0
                    ? 'All active skills unlocked for this style.'
                    : `Reach ${style.maxMoveMastery} Mastery to unlock all moves.`}
            </span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-80">
            <input
              type="range"
              min={0}
              max={600}
              step={5}
              value={masteryLevel}
              onChange={(e) => onChangeMastery(style.id, Number(e.target.value))}
              className="flex-1 accent-sky-400 cursor-pointer"
              aria-label={`${style.name} mastery tracker`}
            />
            <input
              type="number"
              min={0}
              max={600}
              value={masteryLevel}
              onChange={(e) =>
                onChangeMastery(style.id, Math.max(0, Math.min(600, Number(e.target.value) || 0)))
              }
              className="w-16 px-2 py-1 rounded-lg bg-[#04060d] border border-slate-800 text-xs font-mono text-white text-center tabular-nums"
            />
          </div>
        </div>
      </section>

      {/* Outdated & Verification Callouts */}
      {(style.outdatedInfoNote || style.verificationNote) && (
        <div className="space-y-3">
          {style.outdatedInfoNote && (
            <div className="p-4 rounded-2xl bg-red-950/25 border border-red-500/35 flex items-start gap-3 text-xs text-red-100">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-red-300 block mb-0.5">Outdated Guide Warning</span>
                <p className="leading-relaxed">{style.outdatedInfoNote}</p>
              </div>
            </div>
          )}
          {style.verificationNote && (
            <div className="p-4 rounded-2xl bg-sky-950/25 border border-sky-500/35 flex items-start gap-3 text-xs text-sky-100">
              <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-sky-300 block mb-0.5">Verification & Data Clarity</span>
                <p className="leading-relaxed">{style.verificationNote}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Trainer Info, Location, Prerequisites, Items & Unlocking Process */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#070b17] border border-slate-800 space-y-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-400" />
              Trainer & Location Details
            </h2>
            <span className="text-xs font-bold text-sky-400">
              Sea {style.sea} · {style.island}
            </span>
          </div>

          <div className="flex items-center gap-4 pb-4 border-b border-slate-800/80">
            <TrainerNpcPortrait style={style} size="lg" />
            <div>
              <span className="text-xs text-slate-400 block">Trainer / NPC Name</span>
              <p className="text-lg font-extrabold text-white">{style.trainerGuide.npcName}</p>
              <p className="text-xs text-purple-300 mt-0.5">{style.trainerGuide.exactLocation}</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="font-semibold text-slate-400 block mb-1">Directions to Reach Trainer</span>
              <p className="text-slate-300 leading-relaxed">{style.trainerGuide.directions}</p>
            </div>
            {style.trainerGuide.altThirdSeaLocation && (
              <div className="pt-2 border-t border-slate-800/80">
                <span className="font-semibold text-sky-400 block mb-0.5">Alternate Trainer Location</span>
                <p className="text-slate-300">{style.trainerGuide.altThirdSeaLocation}</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#070b17] border border-slate-800 space-y-5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Unlock Requirements, Items & Process
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pb-4 border-b border-slate-800/80">
            <div>
              <span className="font-semibold text-slate-400 block mb-1">Prerequisite Styles</span>
              {style.prerequisiteStyles.length === 0 ? (
                <p className="text-emerald-400 font-semibold">None required</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {style.prerequisiteStyles.map((pName) => {
                    const exists = allStyles.some(
                      (s) => s.name.toLowerCase() === pName.toLowerCase()
                    );
                    return exists ? (
                      <button
                        key={pName}
                        onClick={() => {
                          sounds.playClick();
                          onSelectStyleByName(pName);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#04060d] border border-purple-500/40 text-purple-300 hover:text-white hover:border-purple-400 font-semibold cursor-pointer transition-colors"
                      >
                        {pName}
                      </button>
                    ) : (
                      <span key={pName} className="text-slate-200 font-semibold">
                        {pName}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <span className="font-semibold text-slate-400 block mb-1">Required Items / Quests</span>
              <ul className="space-y-1 text-slate-200 font-medium">
                {style.requiredItems.map((it) => (
                  <li key={it}>• {it}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 block">
              Complete Step-by-Step Unlocking Process
            </span>
            <ol className="space-y-2 text-xs text-slate-300">
              {style.unlockSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-slate-900 border border-slate-700 text-sky-400 font-mono font-bold flex items-center justify-center shrink-0 tabular-nums">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Complete Moveset & Techniques */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Swords className="w-5 h-5 text-red-400" />
            Complete Moveset & Technique Breakdown ({style.moves.length} Skills)
          </h2>
          <span className="text-xs text-slate-400 tabular-nums">
            Controls: M1 · Z · X · C {style.moves.some((m) => m.key === 'V') ? '· V' : ''}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {style.moves.map((move) => {
            const isMoveUnlocked = masteryLevel >= move.mastery;
            return (
              <article
                key={move.key}
                className="p-5 rounded-2xl bg-[#070b17] border border-slate-800 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-[#03050b] border border-slate-700 text-xs font-mono font-black text-sky-400">
                        [{move.key}]
                      </span>
                      <h3 className="text-lg font-extrabold text-white">{move.name}</h3>
                    </div>
                    <span
                      className={`text-xs font-mono font-bold tabular-nums ${
                        isMoveUnlocked ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      Mastery {move.mastery}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {move.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-amber-400">Damage Profile: </span>
                      <span className="text-slate-300">{move.damageInfo}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Crosshair className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-sky-400">Range & AoE: </span>
                      <span className="text-slate-300">{move.rangeAoe}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-purple-300">Cooldown: </span>
                      <span className="text-slate-300">{move.cooldown}</span>
                      {!move.cooldownVerified && (
                        <span className="text-slate-500"> · Approx / unverified exact decimal</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-red-300">Visual Effects: </span>
                      <span className="text-slate-300">{move.visualEffects}</span>
                    </div>
                  </div>
                  {move.upgradeNote && (
                    <div className="pt-2 border-t border-slate-800/70 text-emerald-300">
                      <span className="font-bold">Skill Upgrade: </span>
                      {move.upgradeNote}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Post-Unlock Dojo / Master Upgrades (if applicable, e.g., Dragon Talon / Sharkman Karate) */}
      {style.upgrades && (
        <section className="p-6 rounded-2xl bg-gradient-to-r from-[#070b17] via-purple-950/20 to-[#070b17] border border-purple-500/35 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              {style.upgrades.title}
            </h2>
            <span className="text-xs text-purple-300 font-semibold">
              {style.upgrades.npcName} · {style.upgrades.location}
            </span>
          </div>
          <p className="text-xs text-amber-300 font-semibold">
            Upgrade Requirements: {style.upgrades.requirements}
          </p>
          <ul className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
            {style.upgrades.details.map((line, i) => (
              <li key={i}>• {line}</li>
            ))}
          </ul>
        </section>
      )}

      {/* PvP, Grinding & Combos / Synergies */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#070b17] border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-red-400 flex items-center gap-2">
            <Flame className="w-4 h-4" />
            PvP Uses (Tier {style.pvpTier})
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{style.pvpUses}</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#070b17] border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-sky-400 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Grinding Uses (Tier {style.grindTier})
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{style.grindingUses}</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#070b17] border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-purple-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Combos & Synergies
          </h3>
          <div className="space-y-2 text-xs">
            <p className="text-slate-300">
              <strong className="text-sky-300">Best Fruits: </strong>
              {style.combosAndSynergies.fruits.join(', ')}
            </p>
            <p className="text-slate-300">
              <strong className="text-amber-300">Best Swords: </strong>
              {style.combosAndSynergies.swords.join(', ')}
            </p>
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-slate-400 font-semibold block mb-1">Sample Combo Chain</span>
              <p className="font-mono text-[11px] text-emerald-300 leading-relaxed">
                {style.combosAndSynergies.comboExample}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
