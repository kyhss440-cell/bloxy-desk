import { useState } from 'react';
import { sounds } from '../../utils/audio';
import { Target, TrendingUp, Sparkles, MapPin, Compass, Clock } from 'lucide-react';

export default function LevelProgressTracker() {
  const [currentLevel, setCurrentLevel] = useState<number>(1200);
  const [targetLevel, setTargetLevel] = useState<number>(3000);
  const [has2xExp, setHas2xExp] = useState<boolean>(true);

  const maxLevel = 3000;

  // XP calculation estimation formula in Blox Fruits
  // Each level requires approx (level * 1800) EXP in mid/late game
  const levelsRemaining = Math.max(0, targetLevel - currentLevel);
  const estimatedQuests = Math.round(levelsRemaining * 2.2);

  // Time estimate: with Buddha + 2x exp approx 1.5 min per quest; without 2x exp approx 3 min
  const minutesPerQuest = has2xExp ? 1.4 : 2.8;
  const totalMinutes = Math.round(estimatedQuests * minutesPerQuest);
  const hours = Math.floor(totalMinutes / 60);
  const remainingMins = totalMinutes % 60;

  // Best grinding recommendation based on current level
  const getGrindingRecommendation = (lvl: number) => {
    if (lvl < 15) return { sea: 1, island: 'Starter Island', quest: 'Bandits / Trainee Marines', tip: 'Focus on basic melee or elemental fruit.' };
    if (lvl < 30) return { sea: 1, island: 'Jungle', quest: 'Monkeys & Gorillas', tip: 'Spin your first fruit at Blox Fruit Gacha cousin!' };
    if (lvl < 60) return { sea: 1, island: 'Pirate Village', quest: 'Pirates & Dark Step Master', tip: 'Buy Dark Step if playing melee.' };
    if (lvl < 90) return { sea: 1, island: 'Desert', quest: 'Desert Bandits & Desert Officers', tip: 'Watch out for dehydration damage.' };
    if (lvl < 120) return { sea: 1, island: 'Frozen Village', quest: 'Snow Bandits & Yeti Boss', tip: 'Buy Aura (Busoshoku) and Skyjump (Geppo) from Cave Teacher!' };
    if (lvl < 150) return { sea: 1, island: 'Marine Fortress', quest: 'Chief Petty Officers & Vice Admiral', tip: 'Use safe spots to shoot bosses.' };
    if (lvl < 200) return { sea: 1, island: 'Skylands', quest: 'Sky Bandits & Dark Masters', tip: 'Buy Observation Haki (Instinct) on Upper Skylands!' };
    if (lvl < 300) return { sea: 1, island: 'Prison / Colosseum', quest: 'Warden, Chief Warden & Swan', tip: 'Server hop bosses for rapid EXP and Beli.' };
    if (lvl < 450) return { sea: 1, island: 'Magma Village / Underwater City', quest: 'Magma Admirals & Fishman Warriors', tip: 'Buy Water Kung Fu for fast Buddha spam.' };
    if (lvl < 700) return { sea: 1, island: 'Fountain City', quest: 'Galley Pirates & Cyborg Boss', tip: 'Prepare to transition to Second Sea at Level 700 via Prison Detective!' };
    if (lvl < 875) return { sea: 2, island: 'Kingdom of Rose', quest: 'Raiders, Mercenaries & Factory Core', tip: 'Switch to Buddha fruit and reset stats into Melee & Defense.' };
    if (lvl < 1000) return { sea: 2, island: 'Green Zone / Graveyard', quest: 'Marine Lieutenants & Fajita', tip: 'Complete the Alchemist Quest for Race V2.' };
    if (lvl < 1250) return { sea: 2, island: 'Hot and Cold (Punk Hazard)', quest: 'Smoke Admiral & Normal Raids', tip: 'Grind fragments in Fruit Raids to awaken your Buddha or Magma.' };
    if (lvl < 1425) return { sea: 2, island: 'Cursed Ship / Ice Castle', quest: 'Ship Stewards & Awakened Ice Admiral', tip: 'Collect Ectoplasm for Midnight Blade and Ghoul Race.' };
    if (lvl < 1500) return { sea: 2, island: 'Forgotten Island', quest: 'Sea Soldiers & Tide Keeper', tip: 'Get Water Key for Sharkman Karate before entering Third Sea.' };
    if (lvl < 1775) return { sea: 3, island: 'Port Town / Hydra Island', quest: 'Pirate Millionaires & Dragon Crew', tip: 'Start killing Elite Hunters at Sea Castle for Yama progression.' };
    if (lvl < 2075) return { sea: 3, island: 'Floating Turtle / Haunted Castle', quest: 'Fishman Raiders & Posessed Mummies', tip: 'Grind mastery to 400 on 5 styles to prepare for Godhuman!' };
    if (lvl < 2450) return { sea: 3, island: 'Sea of Treats (Cake Land)', quest: 'Peanut Scouts & Cake Guards', tip: 'Defeat 500 mobs for Cake Prince and Dough King for Mirror Fractal.' };
    return { sea: 3, island: 'Tiki Outpost', quest: 'Sun-kissed Warriors & Isle Champions', tip: 'Max Level reached or in final stretch! Hunt Terror Sharks and Leviathan for Sanguine Art.' };
  };

  const rec = getGrindingRecommendation(currentLevel);
  const progressPercent = Math.min(100, Math.round((currentLevel / maxLevel) * 100));

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border border-slate-800">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Target className="w-6 h-6 text-cyan-400" />
          Level Progress & Grinding Tracker
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Track your journey to Max Level 3000. Calculates remaining quests, grinding time, and best quest spots per sea.
        </p>
      </div>

      {/* Level Inputs */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Your Current Level (1 - 3000)
          </label>
          <input
            type="number"
            min="1"
            max="3000"
            value={currentLevel}
            onChange={(e) => {
              const val = Math.max(1, Math.min(3000, parseInt(e.target.value) || 1));
              setCurrentLevel(val);
              sounds.playClick();
            }}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-lg font-bold text-cyan-400 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Target Goal Level
          </label>
          <input
            type="number"
            min={currentLevel}
            max="3000"
            value={targetLevel}
            onChange={(e) => {
              const val = Math.max(currentLevel, Math.min(3000, parseInt(e.target.value) || currentLevel));
              setTargetLevel(val);
              sounds.playClick();
            }}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-lg font-bold text-amber-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            2X EXP Code / Gamepass Active
          </label>
          <button
            onClick={() => {
              setHas2xExp(!has2xExp);
              sounds.playClick();
            }}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              has2xExp
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-emerald-500/10'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {has2xExp ? '2X EXP Active (Double Speed)' : '1X Normal EXP'}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Total World Progress</span>
          <span className="text-white font-bold">{progressPercent}% (Lvl {currentLevel} / {maxLevel})</span>
        </div>
        <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Estimation Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">Levels to Target</span>
          </div>
          <div className="text-2xl font-black text-white tabular-nums">
            {levelsRemaining} Levels
          </div>
          <p className="text-[11px] text-slate-400 mt-1">From Lvl {currentLevel} to Lvl {targetLevel}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <Compass className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">Estimated Quests</span>
          </div>
          <div className="text-2xl font-black text-white tabular-nums">
            ~{estimatedQuests} Quests
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Average 8-mob NPC quests</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">Estimated Grinding Time</span>
          </div>
          <div className="text-2xl font-black text-white tabular-nums">
            {hours > 0 ? `${hours}h ${remainingMins}m` : `${remainingMins} mins`}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{has2xExp ? 'Calculated with 2x EXP rate' : 'Calculated with 1x Normal EXP'}</p>
        </div>
      </div>

      {/* Grinding Spot Recommendation */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30">
        <div className="flex items-center gap-2 text-cyan-400 mb-2">
          <MapPin className="w-5 h-5" />
          <h3 className="font-bold text-lg text-white">Recommended Grinding Spot for Level {currentLevel}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 block">Sea Location</span>
            <span className="text-base font-bold text-amber-400">Sea {rec.sea} · {rec.island}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 block">Target Quest / Mobs</span>
            <span className="text-base font-bold text-slate-200">{rec.quest}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 block">Pro Strategy Tip</span>
            <span className="text-xs text-slate-300 font-medium">{rec.tip}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
