import { useState } from 'react';
import { sounds } from '../../utils/audio';
import { Skull, Shield, Zap, Anchor, Award } from 'lucide-react';

export default function BountyCalculator() {
  const [bountyMillions, setBountyMillions] = useState<number>(2.5);

  const calculateBuffs = (m: number) => {
    // Blox Fruits Bounty System:
    // 0M to 2.5M: 0% to +3% damage/defense buff
    // 2.5M to 5M: +3% to +6%
    // 5M to 10M: +6% to +10%
    // 10M to 20M: +10% to +13%
    // 20M to 30M: +13% to +15% (Max PvP buff cap)
    const attackBuff = Math.min(15, (m / 30) * 15).toFixed(1);
    const defenseBuff = Math.min(15, (m / 30) * 15).toFixed(1);

    const titles: string[] = [];
    if (m >= 1) titles.push('Pirate / Marine Initiate');
    if (m >= 2.5) titles.push('Bounty Hunter (Safe Zone PvP unlocked)');
    if (m >= 5) titles.push('The Menace');
    if (m >= 10) titles.push('Warlord of the Sea');
    if (m >= 15) titles.push('Calamity');
    if (m >= 20) titles.push('Emperor / Fleet Admiral');
    if (m >= 30) titles.push('Pirate King / Supreme Marine (30M Cap)');

    const perks: string[] = [];
    if (m >= 2.5) perks.push('Summon Sea Beast (with 10M+ Bounty / Marine Honor)');
    if (m >= 5) perks.push('Custom Pirate / Marine Ship upgrade');
    if (m >= 10) perks.push('Special Crew Bounty multiplier');
    if (m >= 20) perks.push('Server-wide announcement upon joining');
    if (m >= 30) perks.push('Max 15% PvP Damage & Defense buff reached');

    return { attackBuff, defenseBuff, titles, perks };
  };

  const currentStats = calculateBuffs(bountyMillions);

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 border border-slate-800">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Skull className="w-6 h-6 text-rose-500" />
          Bounty & Honor Buff Calculator
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Calculate your official PvP damage multipliers, defense bonuses, title rewards, and sea beast summoning privileges.
        </p>
      </div>

      {/* Input Slider */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-300">
            Select Your Current Bounty / Honor:
          </label>
          <div className="text-2xl font-black text-rose-400 tabular-nums">
            {bountyMillions.toFixed(1)}M Beli
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="30"
          step="0.5"
          value={bountyMillions}
          onChange={(e) => {
            setBountyMillions(parseFloat(e.target.value));
            sounds.playClick();
          }}
          className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
        />

        <div className="flex justify-between text-xs text-slate-500 font-mono">
          <span>0M (Starter)</span>
          <span>2.5M (Bounty Cap)</span>
          <span>10M (High Tier)</span>
          <span>20M (Emperor)</span>
          <span>30M (Max Cap)</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-rose-400 mb-1">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">PvP Attack Buff</span>
          </div>
          <div className="text-2xl font-extrabold text-white tabular-nums">
            +{currentStats.attackBuff}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Boosts all physical, sword and fruit attacks against players.</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400 mb-1">
            <Shield className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">Damage Reduction</span>
          </div>
          <div className="text-2xl font-extrabold text-white tabular-nums">
            +{currentStats.defenseBuff}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Reduces incoming PvP damage taken from other players.</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <Anchor className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">Crew Contribution</span>
          </div>
          <div className="text-2xl font-extrabold text-white tabular-nums">
            {(bountyMillions * 1.0).toFixed(1)}M
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Directly added to your pirate crew’s total leaderboard pool.</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-purple-400 mb-1">
            <Award className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">Rank Status</span>
          </div>
          <div className="text-base font-extrabold text-white truncate mt-1">
            {currentStats.titles[currentStats.titles.length - 1] || 'Recruit'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Visible in-game chat tag rank.</p>
        </div>
      </div>

      {/* Perks and Titles lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Unlocked Titles ({currentStats.titles.length})
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {currentStats.titles.map((title, idx) => (
              <li key={idx} className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-800/40 border border-slate-700/40">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>{title}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            Special Perks & Privileges
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {currentStats.perks.map((perk, idx) => (
              <li key={idx} className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-800/40 border border-slate-700/40">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
