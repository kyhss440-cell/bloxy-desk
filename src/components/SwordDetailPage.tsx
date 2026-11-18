import { BloxSword, FruitRarity } from '../types/bloxfruits';
import SwordArtwork from './SwordArtwork';
import { sounds } from '../utils/audio';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  MapPin,
  Coins,
  Award,
  Hammer,
  Sparkles,
  Flame,
  Swords,
  AlertCircle,
  KeyRound,
} from 'lucide-react';

interface SwordDetailPageProps {
  sword: BloxSword;
  isCollected: boolean;
  onToggleCollected: (id: string) => void;
  onBack: () => void;
  onSelectSword: (sword: BloxSword) => void;
  prevSword: BloxSword | null;
  nextSword: BloxSword | null;
}

function getRarityTextClass(rarity: FruitRarity): string {
  switch (rarity) {
    case 'Mythical':
      return 'text-purple-400';
    case 'Legendary':
      return 'text-amber-400';
    case 'Rare':
      return 'text-sky-400';
    case 'Uncommon':
      return 'text-emerald-400';
    default:
      return 'text-slate-300';
  }
}

export default function SwordDetailPage({
  sword,
  isCollected,
  onToggleCollected,
  onBack,
  onSelectSword,
  prevSword,
  nextSword,
}: SwordDetailPageProps) {
  return (
    <div className="space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <button
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sm font-semibold text-slate-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Back to Sword Encyclopedia</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              onToggleCollected(sword.id);
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              isCollected
                ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/25'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-cyan-400/50 hover:text-white'
            }`}
          >
            {isCollected ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Circle className="w-4 h-4 text-slate-500" />
            )}
            <span>{isCollected ? 'Collected in Arsenal' : 'Mark as Collected'}</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              disabled={!prevSword}
              onClick={() => {
                if (prevSword) {
                  sounds.playSwordClash();
                  onSelectSword(prevSword);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              aria-label="Previous sword"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={!nextSword}
              onClick={() => {
                if (nextSword) {
                  sounds.playSwordClash();
                  onSelectSword(nextSword);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              aria-label="Next sword"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Showcase */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-[#0a1124] to-slate-950 border border-slate-800 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8">
          <SwordArtwork sword={sword} size="xl" className="mx-auto md:mx-0 shadow-xl" />

          <div className="flex-1 min-w-0 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold tracking-wider uppercase">
              <span className={getRarityTextClass(sword.rarity)}>{sword.rarity} Sword</span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span className="text-cyan-400">Sea {sword.sea}</span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span className="text-amber-400">PvP Tier {sword.pvpTier}</span>
              {sword.legacyName && (
                <>
                  <span className="text-slate-600" aria-hidden="true">·</span>
                  <span className="text-slate-400">{sword.legacyName}</span>
                </>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white font-heading leading-tight">
              {sword.name}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
              {sword.description}
            </p>

            {/* Primary Fact Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">Price in Beli</span>
                <span className="text-sm sm:text-base font-extrabold text-amber-400 tabular-nums">
                  {sword.priceDisplay}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">Max Skill Mastery</span>
                <span className="text-sm sm:text-base font-extrabold text-cyan-400 tabular-nums">
                  {sword.masteryReqTotal} Mastery
                </span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">NPC / Boss Source</span>
                <span className="text-sm font-bold text-white line-clamp-1">{sword.npcOrBoss}</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">Blacksmith Grade 1</span>
                <span className="text-sm font-bold text-emerald-400 line-clamp-1">
                  {sword.upgradeInfo.canUpgrade ? sword.upgradeInfo.boost : 'Not Upgradeable'}
                </span>
              </div>
            </div>

            {sword.masteryNote && (
              <p className="text-xs text-slate-400">
                Mastery Note: {sword.masteryNote}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Transparency Notice when Wiki has unconfirmed / limited details */}
      {sword.isUnverifiedNote && (
        <div className="p-4 rounded-2xl bg-amber-950/25 border border-amber-500/35 flex items-start gap-3 text-xs text-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300 block mb-0.5">Verification & Version Note</span>
            <p className="text-amber-100/90 leading-relaxed">{sword.isUnverifiedNote}</p>
          </div>
        </div>
      )}

      {/* Location, NPC, Unlock Requirements & Beli Pricing */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/75 border border-slate-800 space-y-5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-400" />
            Obtainment, NPC & Location
          </h2>

          <div className="space-y-4 text-sm">
            <div className="pb-3 border-b border-slate-800/80">
              <span className="text-xs font-semibold text-slate-400 block mb-1">Associated NPC / Boss / Shop</span>
              <p className="text-white font-semibold">{sword.npcOrBoss}</p>
            </div>

            <div className="pb-3 border-b border-slate-800/80">
              <span className="text-xs font-semibold text-slate-400 block mb-1">In-Game Location</span>
              <p className="text-cyan-300 font-medium">{sword.location}</p>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                Price in Beli
              </span>
              <p className="text-amber-400 font-bold tabular-nums">{sword.priceDisplay}</p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/75 border border-slate-800 space-y-5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-400" />
            In-Game Unlock Requirements
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            {sword.unlockRequirements}
          </p>

          <div className="pt-4 border-t border-slate-800/80">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Quick Obtain Summary</span>
            <p className="text-xs text-slate-300 leading-relaxed">{sword.howToObtain}</p>
          </div>
        </div>
      </section>

      {/* Techniques & Skills (Displayed Separately: M1, [Z], [X]) */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Swords className="w-5 h-5 text-cyan-400" />
            Techniques, Mastery & Skill Breakdown
          </h2>
          <span className="text-xs text-slate-400 tabular-nums">
            Total Mastery Required: {sword.masteryReqTotal}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* M1 Basic Attack Card */}
          <article className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                <span className="text-xs font-extrabold text-slate-200 tracking-wide">
                  [M1] Basic Attack
                </span>
                <span className="text-xs font-mono text-slate-400 tabular-nums">
                  Mastery 1
                </span>
              </div>

              <h3 className="text-lg font-bold text-white">{sword.m1.name}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {sword.m1.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs">
              <div>
                <span className="font-semibold text-amber-400">Damage Profile: </span>
                <span className="text-slate-300">{sword.m1.damageNotes}</span>
              </div>
              <div>
                <span className="font-semibold text-cyan-400">Animations & Effects: </span>
                <span className="text-slate-300">{sword.m1.effects}</span>
              </div>
            </div>
          </article>

          {/* [Z] and [X] Skill Cards */}
          {sword.moves.map((move) => (
            <article
              key={move.key}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                  <span className="text-xs font-extrabold text-cyan-400 tracking-wide">
                    [{move.key}] Technique
                  </span>
                  <span className="text-xs font-mono text-amber-400 font-bold tabular-nums">
                    Mastery {move.mastery}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">{move.name}</h3>
                {move.masteryNote && (
                  <p className="text-[11px] text-amber-300/90">{move.masteryNote}</p>
                )}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {move.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                {move.damageNotes && (
                  <div>
                    <span className="font-semibold text-amber-400">Damage Scaling: </span>
                    <span className="text-slate-300">{move.damageNotes}</span>
                  </div>
                )}
                {move.effects && (
                  <div>
                    <span className="font-semibold text-cyan-400">Effects & Visuals: </span>
                    <span className="text-slate-300">{move.effects}</span>
                  </div>
                )}
                {move.breaksInstinct && (
                  <div>
                    <span className="font-semibold text-purple-300">Instinct Break: </span>
                    <span className="text-slate-300">{move.breaksInstinct}</span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Damage Overview & Special Effects / Animations */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/75 border border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Damage Profile & Stat Scaling
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">{sword.damageProfile}</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/75 border border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Special Effects & Animations
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">{sword.effectsAndAnimations}</p>
        </div>
      </section>

      {/* Blacksmith Upgrade Information & Combat Synergies */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/75 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Hammer className="w-5 h-5 text-emerald-400" />
            Sword Upgrade Information (Blacksmith)
          </h2>

          <div className="space-y-3 text-sm">
            <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between gap-4">
              <span className="text-slate-400 text-xs font-semibold">Upgrade Bonus</span>
              <span className="font-bold text-emerald-400 text-right">{sword.upgradeInfo.boost}</span>
            </div>

            <div className="pb-3 border-b border-slate-800/80">
              <span className="text-xs font-semibold text-slate-400 block mb-1">Required Materials</span>
              <p className="text-slate-200 font-medium">{sword.upgradeInfo.materials}</p>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-1">Blacksmith & Scroll Notes</span>
              <p className="text-xs text-slate-300 leading-relaxed">{sword.upgradeInfo.notes}</p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/75 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-400" />
            Best Fruit & Fighting-Style Synergies
          </h2>

          <div className="space-y-3 text-sm">
            <div className="pb-3 border-b border-slate-800/80">
              <span className="text-xs font-semibold text-slate-400 block mb-1">Recommended Blox Fruits</span>
              <p className="text-cyan-300 font-semibold">
                {sword.synergies.fruits.join(' · ')}
              </p>
            </div>

            <div className="pb-3 border-b border-slate-800/80">
              <span className="text-xs font-semibold text-slate-400 block mb-1">Recommended Fighting Styles</span>
              <p className="text-amber-300 font-semibold">
                {sword.synergies.fightingStyles.join(' · ')}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-1">Combo & Build Synergy</span>
              <p className="text-xs text-slate-300 leading-relaxed">{sword.synergies.summary}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
