import { useState } from 'react';
import { BLOX_SWORDS_DATABASE } from '../../data/swordsData';
import { sounds } from '../../utils/audio';
import { Swords, Zap, Award, BookOpen, Compass } from 'lucide-react';
import SwordArtwork from '../SwordArtwork';

export default function SwordComparison() {
  const [swordAId, setSwordAId] = useState<string>('cdk');
  const [swordBId, setSwordBId] = useState<string>('shark_anchor');

  const swordA = BLOX_SWORDS_DATABASE.find(s => s.id === swordAId) || BLOX_SWORDS_DATABASE[0];
  const swordB = BLOX_SWORDS_DATABASE.find(s => s.id === swordBId) || BLOX_SWORDS_DATABASE[1];

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/30 to-slate-900 border border-slate-800">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Swords className="w-6 h-6 text-purple-400" />
          Sword Dual Comparison Matrix
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Compare movesets, total mastery requirements, obtain difficulty, and combo synergy between any two Blox Fruits swords.
        </p>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-purple-500/30">
          <label className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-2">
            Select Sword 1:
          </label>
          <select
            value={swordAId}
            onChange={(e) => {
              setSwordAId(e.target.value);
              sounds.playClick();
            }}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            {BLOX_SWORDS_DATABASE.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.rarity})</option>
            ))}
          </select>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30">
          <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-2">
            Select Sword 2:
          </label>
          <select
            value={swordBId}
            onChange={(e) => {
              setSwordBId(e.target.value);
              sounds.playClick();
            }}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {BLOX_SWORDS_DATABASE.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.rarity})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Side by side comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sword A */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-purple-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 block">{swordA.rarity} · Sea {swordA.sea}</span>
              <h3 className="text-2xl font-black text-white">{swordA.name}</h3>
            </div>
            <SwordArtwork sword={swordA} size="sm" />
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">{swordA.description}</p>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">PvP Tier</span>
              <span className="text-lg font-black text-amber-400">{swordA.pvpTier}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Total Mastery</span>
              <span className="text-lg font-black text-cyan-400 tabular-nums">{swordA.masteryReqTotal}</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Moveset:</span>
            {swordA.moves.map(move => (
              <div key={move.key} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-purple-300">[{move.key}] {move.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">Mastery {move.mastery}</span>
                </div>
                <p className="text-xs text-slate-400">{move.description}</p>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs">
            <span className="font-bold text-purple-300 block mb-1">How to Obtain:</span>
            <span className="text-slate-300">{swordA.howToObtain}</span>
          </div>
        </div>

        {/* Sword B */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block">{swordB.rarity} · Sea {swordB.sea}</span>
              <h3 className="text-2xl font-black text-white">{swordB.name}</h3>
            </div>
            <SwordArtwork sword={swordB} size="sm" />
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">{swordB.description}</p>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">PvP Tier</span>
              <span className="text-lg font-black text-amber-400">{swordB.pvpTier}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Total Mastery</span>
              <span className="text-lg font-black text-cyan-400 tabular-nums">{swordB.masteryReqTotal}</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Moveset:</span>
            {swordB.moves.map(move => (
              <div key={move.key} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-cyan-300">[{move.key}] {move.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">Mastery {move.mastery}</span>
                </div>
                <p className="text-xs text-slate-400">{move.description}</p>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs">
            <span className="font-bold text-cyan-300 block mb-1">How to Obtain:</span>
            <span className="text-slate-300">{swordB.howToObtain}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
