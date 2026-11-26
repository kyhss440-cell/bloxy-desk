import { sounds } from '../utils/audio';
import { X, Sparkles, MapPin, Coins, Award, Swords, Shield, Skull, Zap } from 'lucide-react';
import { BloxFruit, BloxRace, BloxSword, BloxGun, BloxAccessory, BloxBoss, FightingStyle } from '../types/bloxfruits';
import SwordArtwork from './SwordArtwork';
import GunArtwork from './GunArtwork';
import FightingStyleArtwork from './FightingStyleArtwork';

interface ItemDetailModalProps {
  type: string;
  item: unknown;
  onClose: () => void;
}

export default function ItemDetailModal({ type, item, onClose }: ItemDetailModalProps) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header Bar */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>{type.toUpperCase()} DOSSIER</span>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {type === 'fruit' && (() => {
            const f = item as BloxFruit;
            return (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${f.iconBg} p-0.5 flex items-center justify-center shadow-lg shrink-0`}>
                      <div className="w-full h-full bg-slate-950/90 rounded-[14px] flex items-center justify-center text-3xl overflow-hidden">
                        {f.image ? (
                          <img
                            src={f.image}
                            alt={f.name}
                            className="w-16 h-16 object-contain filter drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                          />
                        ) : (
                          f.symbol
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white">{f.name} Fruit</h3>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {f.rarity} · {f.category} · Trading Demand: <strong className="text-cyan-400">{f.tradingDemand}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-black text-amber-400">${f.priceBeli.toLocaleString()} Beli</div>
                    <div className="text-xs text-cyan-400 font-semibold">{f.priceRobux.toLocaleString()} Perm R$</div>
                    {f.tradingValueRange && (
                      <div className="text-xs text-emerald-400 font-bold mt-0.5">
                        Trade: {f.tradingValueRange}
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{f.description}</p>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                  <span className="font-bold text-amber-400 block mb-1">Combat Performance:</span>
                  <p className="text-slate-300">{f.bestFor}</p>
                </div>

                {/* Moves */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Moveset & Mastery:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {f.abilities.map(m => (
                      <div key={m.key} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                        <div className="flex justify-between font-bold text-amber-300 mb-0.5">
                          <span>[{m.key}] {m.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">Lvl {m.mastery}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{m.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transformation */}
                {f.hasTransformation && (
                  <div className="p-4 rounded-2xl bg-cyan-950/25 border border-cyan-500/30 space-y-2.5 text-xs">
                    <div className="flex justify-between items-center text-cyan-300 font-bold">
                      <span>{f.transformationName || `${f.name} Transformation`}</span>
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30">
                        Transformable
                      </span>
                    </div>
                    {f.transformationImage && (
                      <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-2 flex justify-center">
                        <img
                          src={f.transformationImage}
                          alt={f.transformationName || `${f.name} Transformation`}
                          referrerPolicy="no-referrer"
                          className="max-h-56 object-contain rounded-lg"
                        />
                      </div>
                    )}
                    {f.transformationDescription && (
                      <p className="text-slate-300 text-[11px] leading-relaxed">{f.transformationDescription}</p>
                    )}
                  </div>
                )}

                {/* Awakening */}
                {f.awakening && (
                  <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2 text-xs">
                    <div className="flex justify-between items-center text-purple-300 font-bold">
                      <span>Awakened Form Available</span>
                      <span>{f.awakening.totalFrags.toLocaleString()} Fragments</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{f.awakening.details}</p>
                  </div>
                )}
              </div>
            );
          })()}

          {type === 'sword' && (() => {
            const s = item as BloxSword;
            return (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-cyan-400 uppercase">
                      {s.rarity} · Sea {s.sea} · PvP {s.pvpTier}
                    </span>
                    <h3 className="text-2xl font-black text-white">{s.name}</h3>
                    {s.legacyName && (
                      <span className="text-xs text-slate-400">{s.legacyName}</span>
                    )}
                    <div className="text-xs text-amber-400 font-bold mt-1 tabular-nums">
                      {s.priceDisplay} · {s.masteryReqTotal} Max Mastery
                    </div>
                  </div>
                  <SwordArtwork sword={s} size="md" />
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{s.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-cyan-300 block mb-1">NPC / Boss & Location</span>
                    <p className="text-white font-semibold">{s.npcOrBoss}</p>
                    <p className="text-slate-400 mt-0.5">{s.location}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-emerald-300 block mb-1">Blacksmith Upgrade</span>
                    <p className="text-emerald-400 font-semibold">{s.upgradeInfo.boost}</p>
                    <p className="text-slate-400 mt-0.5">{s.upgradeInfo.materials}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-xs">
                  <span className="font-bold text-cyan-300 block mb-1">Unlock Requirements:</span>
                  <p className="text-slate-300 leading-relaxed">{s.unlockRequirements}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Techniques (M1, Z, X):</span>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <div className="flex justify-between font-bold text-white mb-0.5">
                      <span>[M1] {s.m1.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Mastery 1</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{s.m1.description}</p>
                  </div>
                  {s.moves.map(m => (
                    <div key={m.key} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                      <div className="flex justify-between font-bold text-white mb-0.5">
                        <span>[{m.key}] {m.name}</span>
                        <span className="text-[10px] text-amber-400 font-mono tabular-nums">Mastery {m.mastery}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{m.description}</p>
                      {m.effects && (
                        <p className="text-[11px] text-cyan-300/80 mt-1">Effects: {m.effects}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <span className="font-bold text-rose-300 block">Best Synergies:</span>
                  <p className="text-slate-300">
                    <strong className="text-cyan-300">Fruits:</strong> {s.synergies.fruits.join(', ')} ·{' '}
                    <strong className="text-amber-300">Fighting Styles:</strong> {s.synergies.fightingStyles.join(', ')}
                  </p>
                  <p className="text-slate-400">{s.synergies.summary}</p>
                </div>
              </div>
            );
          })()}

          {type === 'gun' && (() => {
            const g = item as BloxGun;
            return (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-violet-400 uppercase">
                      {g.rarity} · Sea {g.sea} · PvP {g.pvpTier}
                    </span>
                    <h3 className="text-2xl font-black text-white">{g.name}</h3>
                    {g.legacyName && (
                      <span className="text-xs text-slate-400">Formerly {g.legacyName}</span>
                    )}
                    <div className="text-xs text-amber-400 font-bold mt-1 tabular-nums">
                      {g.priceDisplay} · {g.masteryReqTotal} Max Mastery
                    </div>
                  </div>
                  <GunArtwork gun={g} size="md" />
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{g.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-violet-300 block mb-1">NPC / Boss & Location</span>
                    <p className="text-white font-semibold">{g.npcOrBoss}</p>
                    <p className="text-slate-400 mt-0.5">{g.location}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-emerald-300 block mb-1">Blacksmith Upgrade</span>
                    <p className="text-emerald-400 font-semibold">{g.upgradeInfo.boost}</p>
                    <p className="text-slate-400 mt-0.5">{g.upgradeInfo.materials}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-violet-950/20 border border-violet-500/30 text-xs">
                  <span className="font-bold text-violet-300 block mb-1">Unlock Requirements:</span>
                  <p className="text-slate-300 leading-relaxed">{g.unlockRequirements}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Techniques (M1, Z, X):</span>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <div className="flex justify-between font-bold text-white mb-0.5">
                      <span>[M1] {g.m1.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Mastery 1</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{g.m1.description}</p>
                  </div>
                  {g.moves.map(m => (
                    <div key={m.key} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                      <div className="flex justify-between font-bold text-white mb-0.5">
                        <span>[{m.key}] {m.name}</span>
                        <span className="text-[10px] text-amber-400 font-mono tabular-nums">Mastery {m.mastery}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{m.description}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px]">
                        <span className="text-violet-300/80">Effects: {m.effects}</span>
                        <span className="text-amber-300 font-semibold">Instinct Break: {m.breaksInstinct}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <span className="font-bold text-rose-300 block">Best Synergies:</span>
                  <p className="text-slate-300">
                    <strong className="text-cyan-300">Fruits:</strong> {g.synergies.fruits.join(', ')} ·{' '}
                    <strong className="text-amber-300">Swords:</strong> {g.synergies.swords.join(', ')}
                  </p>
                  <p className="text-slate-400">{g.synergies.summary}</p>
                </div>
              </div>
            );
          })()}

          {type === 'accessory' && (() => {
            const a = item as BloxAccessory;
            return (
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  {a.image && (
                    <div className="w-16 h-16 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-center p-1.5 shrink-0">
                      <img
                        src={a.image}
                        alt={a.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]"
                      />
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-bold text-rose-400 uppercase">{a.rarity} · Sea {a.sea}</span>
                    <h3 className="text-2xl font-black text-white">{a.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{a.location}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{a.description}</p>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Stat Buffs:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {a.buffs.map((b, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                        <span className="text-slate-500 block text-[10px] uppercase">{b.stat}</span>
                        <span className="text-sm font-bold text-rose-400">{b.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                  <span className="font-bold text-slate-300 block mb-1">Obtain Path:</span>
                  <p className="text-slate-400">{a.howToObtain}</p>
                </div>
              </div>
            );
          })()}

          {type === 'boss' && (() => {
            const b = item as BloxBoss;
            return (
              <div className="space-y-5">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    {b.image && (
                      <div className="w-16 h-16 rounded-2xl bg-red-950/40 border border-red-500/30 overflow-hidden shrink-0">
                        <img
                          src={b.image}
                          alt={b.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-red-400 uppercase">Sea {b.sea} · {b.location}</span>
                      <h3 className="text-2xl font-black text-white">{b.name}</h3>
                    </div>
                  </div>
                  <div className="text-lg font-black text-amber-400 shrink-0">Level {b.level}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-red-950/20 border border-red-500/30 text-xs">
                  <span className="font-bold text-red-300 block mb-1">Raid Strategy:</span>
                  <p className="text-slate-300 leading-relaxed">{b.strategy}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Drops:</span>
                  <div className="space-y-1.5">
                    {b.drops.map((d, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between text-xs">
                        <span className="text-white font-medium">{d.name} ({d.type})</span>
                        <span className="font-mono text-amber-400 font-bold">{d.chance}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {type === 'style' && (() => {
            const st = item as FightingStyle;
            return (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-purple-400 uppercase">
                      {st.category} · Sea {st.sea} · PvP {st.pvpTier}
                    </span>
                    <h3 className="text-2xl font-black text-white">{st.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Trainer: {st.npcName} ({st.island})
                    </p>
                    <div className="text-xs text-amber-400 font-bold mt-1 tabular-nums">
                      {st.costBeli > 0 ? `$${st.costBeli.toLocaleString()} Beli` : '$0 Beli'}
                      {st.costFragments > 0 ? ` + ${st.costFragments.toLocaleString()} Frags` : ''} · Max Skill Mast. {st.maxMoveMastery}
                    </div>
                  </div>
                  <FightingStyleArtwork style={st} size="md" />
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{st.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-sky-300 block mb-1">Exact Location & Directions</span>
                    <p className="text-white font-semibold">{st.trainerGuide.exactLocation}</p>
                    <p className="text-slate-400 mt-0.5">{st.trainerGuide.directions}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-amber-300 block mb-1">Unlock Requirements</span>
                    <p className="text-slate-300 leading-relaxed">{st.requirements}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Moveset ({st.moves.length} Techniques):
                  </span>
                  {st.moves.map((m) => (
                    <div key={m.key} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                      <div className="flex justify-between font-bold text-white mb-0.5">
                        <span>[{m.key}] {m.name}</span>
                        <span className="text-[10px] text-amber-400 font-mono tabular-nums">
                          Mast. {m.mastery} · {m.cooldown}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{m.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
