import { useState } from 'react';
import { BLOX_RACES_DATABASE } from '../data/racesData';
import { BloxRace } from '../types/bloxfruits';
import { sounds } from '../utils/audio';
import { Zap, Shield, Wind, Sparkles, CheckCircle2, ChevronRight, Trophy } from 'lucide-react';
import dracoThumbImg from '../assets/images/race_draco_clean.png';
import sharkImg from '../assets/images/race_shark_clean.png';
import angelImg from '../assets/images/race_angel_clean.png';
import rabbitImg from '../assets/images/race_rabbit_clean.png';
import humanImg from '../assets/images/race_human_clean.png';
import ghoulImg from '../assets/images/race_ghoul_clean.png';
import cyborgImg from '../assets/images/race_cyborg_clean.png';

export default function RaceDatabase() {
  const [selectedRaceId, setSelectedRaceId] = useState<string>('draco');
  const [activeVersionTab, setActiveVersionTab] = useState<'v1' | 'v2' | 'v3' | 'v4'>('v4');

  const selectedRace = BLOX_RACES_DATABASE.find(r => r.id === selectedRaceId) || BLOX_RACES_DATABASE[0];

  const raceThumbnails: Record<string, { icon: string; accentColor: string; image?: string }> = {
    draco: { icon: '🐉', accentColor: 'border-amber-500', image: dracoThumbImg },
    shark: { icon: '🦈', accentColor: 'border-cyan-500', image: sharkImg },
    angel: { icon: '🪽', accentColor: 'border-yellow-400', image: angelImg },
    rabbit: { icon: '🐇', accentColor: 'border-emerald-400', image: rabbitImg },
    human: { icon: '⚔️', accentColor: 'border-red-500', image: humanImg },
    ghoul: { icon: '🦇', accentColor: 'border-purple-500', image: ghoulImg },
    cyborg: { icon: '🤖', accentColor: 'border-blue-500', image: cyborgImg },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-slate-800 shadow-xl">
        <h2 className="text-3xl font-black text-white flex items-center gap-3">
          <Zap className="w-8 h-8 text-amber-400" />
          Races & Awakenings Database
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Explore all seven Blox Fruits races: Human, Shark, Angel, Rabbit, Ghoul, Cyborg, and the newly awakened Draco race. Inspect full progression from Base V1 up to the supreme Gear 4 Temple of Time awakening.
        </p>

        {/* 7 Race Selector Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-6">
          {BLOX_RACES_DATABASE.map((race) => {
            const isSelected = race.id === selectedRaceId;
            const thumb = raceThumbnails[race.id];
            const raceImg = thumb?.image || race.image;
            return (
              <button
                key={race.id}
                onClick={() => {
                  setSelectedRaceId(race.id);
                  sounds.playClick();
                }}
                className={`p-3.5 rounded-2xl border transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 border-amber-400 ring-2 ring-amber-400/20 shadow-lg'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <span className="text-3xl filter drop-shadow flex items-center justify-center h-9">
                  {raceImg ? (
                    <img
                      src={raceImg}
                      alt={race.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 object-contain filter drop-shadow"
                    />
                  ) : (
                    thumb.icon
                  )}
                </span>
                <span className={`text-xs font-bold ${isSelected ? 'text-amber-400' : 'text-slate-300'}`}>
                  {race.name}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  PvP {race.pvpRating}/10
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Race Showcase Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Portrait & Key Attributes */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
            {selectedRace.image ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-950 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none"></div>
                <img
                  src={selectedRace.image}
                  alt={`${selectedRace.name} Race Awakening`}
                  referrerPolicy="no-referrer"
                  className="w-48 h-48 object-contain filter drop-shadow-[0_0_30px_rgba(234,179,8,0.4)] mb-3 relative z-10 transition-transform duration-300 hover:scale-105"
                />
                <span className="text-lg font-black text-white relative z-10">{selectedRace.name} Race</span>
                <span className="text-xs text-amber-400 font-semibold mt-1 relative z-10">
                  {selectedRace.v4.transformationName} V4 Awakening
                </span>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-900 to-slate-950 text-center">
                <span className="text-8xl mb-3">{raceThumbnails[selectedRace.id]?.icon}</span>
                <span className="text-lg font-black text-white">{selectedRace.name} Race</span>
                <span className="text-xs text-amber-400 font-semibold mt-1">Blox Fruits Official Race</span>
              </div>
            )}
            <div className="absolute top-3 left-3 z-30 px-3 py-1.5 rounded-lg bg-black/90 backdrop-blur-md text-xs font-black text-amber-400 border border-amber-400/50 shadow-2xl flex items-center gap-1.5 select-none pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>PvP Rating: {selectedRace.pvpRating}/10</span>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-black text-white">{selectedRace.name} Race</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">{selectedRace.lore}</p>
          </div>

          {/* Combat Ratings */}
          <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-300 mb-1">
                <span>Competitive PvP Dominance</span>
                <span className="text-amber-400">{selectedRace.pvpRating}/10</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${selectedRace.pvpRating * 10}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-300 mb-1">
                <span>Mobility & Dash Range</span>
                <span className="text-cyan-400">{selectedRace.mobilityRating}/10</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${selectedRace.mobilityRating * 10}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-300 mb-1">
                <span>Damage Absorption & Defense</span>
                <span className="text-emerald-400">{selectedRace.defenseRating}/10</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${selectedRace.defenseRating * 10}%` }}></div>
              </div>
            </div>
          </div>

          {/* Core Advantages List */}
          <div className="pt-3 border-t border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Key Battle Advantages:
            </span>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {selectedRace.advantages.map((adv, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{adv}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right 2 Columns: V1, V2, V3, V4 Interactive Tabs */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-6">
          <div>
            {/* Version Navigation Tabs */}
            <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-6">
              {[
                { id: 'v1', label: 'V1 (Base)' },
                { id: 'v2', label: 'V2 (Alchemist)' },
                { id: 'v3', label: 'V3 (Arowe Skill)' },
                { id: 'v4', label: 'V4 (Temple of Time Awakening)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveVersionTab(tab.id as 'v1' | 'v2' | 'v3' | 'v4');
                    sounds.playClick();
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeVersionTab === tab.id
                      ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* V1 Details */}
            {activeVersionTab === 'v1' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block mb-1">
                    Requirements to Obtain
                  </span>
                  <p className="text-sm text-slate-300">{selectedRace.v1.requirements}</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    Base V1 Passive Buffs:
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {selectedRace.v1.buffs.map((buff, i) => (
                      <li key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                        <span>{buff}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* V2 Details */}
            {activeVersionTab === 'v2' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block mb-1">
                    Alchemist Flower Quest (Second Sea)
                  </span>
                  <p className="text-sm text-slate-300">{selectedRace.v2.requirements}</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Upgraded V2 Enhanced Buffs:
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {selectedRace.v2.buffs.map((buff, i) => (
                      <li key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>{buff}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* V3 Details */}
            {activeVersionTab === 'v3' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block mb-1">
                    Arowe Quest (Mansion, Second Sea)
                  </span>
                  <p className="text-sm text-slate-300">{selectedRace.v3.requirements}</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    V3 Signature Active Ability (T-Key):
                  </h4>
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                    <strong className="block text-sm font-bold text-amber-300 mb-1">{selectedRace.v3.title}</strong>
                    {selectedRace.v3.buffs.map((buff, i) => (
                      <div key={i} className="mt-1">{buff}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* V4 Details (The Pinnacle) */}
            {activeVersionTab === 'v4' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] uppercase tracking-wider text-purple-400 font-bold block mb-1">
                      Temple of Time Location
                    </span>
                    <p className="text-xs text-slate-300 font-medium">{selectedRace.v4.trialLocation}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] uppercase tracking-wider text-cyan-400 font-bold block mb-1">
                      Trial Puzzle & Test
                    </span>
                    <p className="text-xs text-slate-300 font-medium">{selectedRace.v4.trialPuzzle}</p>
                  </div>
                </div>

                {/* V4 Transformation */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 to-slate-950 border border-purple-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                    <Trophy className="w-4 h-4" />
                    <span>Awakened Form: {selectedRace.v4.transformationName}</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300 mt-2">
                    {selectedRace.v4.transformationBuffs.map((buff, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                        <span>{buff}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Gears 1 and 2 */}
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Temple Clock Gears & Passives:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedRace.v4.gears.map((gear, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800">
                        <span className="text-xs font-bold text-amber-400 block">{gear.gearName}</span>
                        <span className="text-[11px] font-semibold text-slate-300 block mb-1">{gear.passiveName}</span>
                        <p className="text-[11px] text-slate-400">{gear.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
