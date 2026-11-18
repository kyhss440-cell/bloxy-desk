import { useState } from 'react';
import { BLOX_RACES_DATABASE } from '../../data/racesData';
import { BloxRace } from '../../types/bloxfruits';
import { sounds } from '../../utils/audio';
import { GitCompare, Shield, Zap, Wind, Swords, Sparkles } from 'lucide-react';

export default function RaceComparison() {
  const [raceAId, setRaceAId] = useState<string>('draco');
  const [raceBId, setRaceBId] = useState<string>('shark');

  const raceA = BLOX_RACES_DATABASE.find(r => r.id === raceAId) || BLOX_RACES_DATABASE[0];
  const raceB = BLOX_RACES_DATABASE.find(r => r.id === raceBId) || BLOX_RACES_DATABASE[1];

  const renderRatingBar = (label: string, valA: number, valB: number, icon: React.ReactNode) => {
    return (
      <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span className="text-cyan-400 font-bold tabular-nums">{valA}/10</span>
          <span className="flex items-center gap-1 text-slate-400">{icon} {label}</span>
          <span className="text-amber-400 font-bold tabular-nums">{valB}/10</span>
        </div>
        <div className="grid grid-cols-2 gap-2 h-2">
          {/* Left race bar */}
          <div className="h-full bg-slate-800 rounded-full overflow-hidden flex justify-end">
            <div
              className="h-full bg-cyan-400 rounded-full transition-all duration-300"
              style={{ width: `${(valA / 10) * 100}%` }}
            ></div>
          </div>
          {/* Right race bar */}
          <div className="h-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-300"
              style={{ width: `${(valB / 10) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <GitCompare className="w-6 h-6 text-cyan-400" />
          Race Comparison Matrix (V1 to V4)
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Direct head-to-head breakdown of any two races across mobility, defense, trial mechanics, and V4 awakenings.
        </p>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30">
          <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-2">
            Select Race 1:
          </label>
          <select
            value={raceAId}
            onChange={(e) => {
              setRaceAId(e.target.value);
              sounds.playClick();
            }}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {BLOX_RACES_DATABASE.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30">
          <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
            Select Race 2:
          </label>
          <select
            value={raceBId}
            onChange={(e) => {
              setRaceBId(e.target.value);
              sounds.playClick();
            }}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            {BLOX_RACES_DATABASE.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-Side Stat Comparison Bars */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex justify-between items-center text-sm font-bold text-white px-2">
          <span className="text-cyan-400">{raceA.name}</span>
          <span className="text-xs text-slate-500 uppercase tracking-wider">Combat Attributes</span>
          <span className="text-amber-400">{raceB.name}</span>
        </div>

        {renderRatingBar('Competitive PvP Rating', raceA.pvpRating, raceB.pvpRating, <Swords className="w-3.5 h-3.5" />)}
        {renderRatingBar('Mobility & Speed', raceA.mobilityRating, raceB.mobilityRating, <Wind className="w-3.5 h-3.5" />)}
        {renderRatingBar('Survivability & Defense', raceA.defenseRating, raceB.defenseRating, <Shield className="w-3.5 h-3.5" />)}
      </div>

      {/* Deep Dive Cards Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Race A */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-cyan-500/40 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-cyan-400">{raceA.name}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{raceA.lore}</p>
            </div>
            {raceA.image && (
              <img
                src={raceA.image}
                alt={raceA.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 object-contain filter drop-shadow ml-3 shrink-0"
              />
            )}
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="font-bold text-white block mb-1">V3 Signature Skill:</span>
              <span className="text-slate-300">{raceA.v3.title} — {raceA.v3.buffs.join(' ')}</span>
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
              <span className="font-bold text-cyan-300 block mb-1">V4 Transformation:</span>
              <span className="text-white font-semibold">{raceA.v4.transformationName}</span>
              <ul className="mt-1 space-y-1 list-disc list-inside text-slate-300">
                {raceA.v4.transformationBuffs.slice(0, 3).map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="font-bold text-white block mb-1">Core Advantages:</span>
              <ul className="space-y-1 text-slate-300">
                {raceA.advantages.map((adv, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-cyan-400">✓</span> {adv}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Race B */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-amber-500/40 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-amber-400">{raceB.name}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{raceB.lore}</p>
            </div>
            {raceB.image && (
              <img
                src={raceB.image}
                alt={raceB.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 object-contain filter drop-shadow ml-3 shrink-0"
              />
            )}
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="font-bold text-white block mb-1">V3 Signature Skill:</span>
              <span className="text-slate-300">{raceB.v3.title} — {raceB.v3.buffs.join(' ')}</span>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20">
              <span className="font-bold text-amber-300 block mb-1">V4 Transformation:</span>
              <span className="text-white font-semibold">{raceB.v4.transformationName}</span>
              <ul className="mt-1 space-y-1 list-disc list-inside text-slate-300">
                {raceB.v4.transformationBuffs.slice(0, 3).map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="font-bold text-white block mb-1">Core Advantages:</span>
              <ul className="space-y-1 text-slate-300">
                {raceB.advantages.map((adv, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-400">✓</span> {adv}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
