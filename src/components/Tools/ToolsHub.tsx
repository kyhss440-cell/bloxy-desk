import { useState } from 'react';
import ValueChecker from './ValueChecker';
import TierListMaker from './TierListMaker';
import FruitGachaPicker from './FruitGachaPicker';
import BountyCalculator from './BountyCalculator';
import LevelProgressTracker from './LevelProgressTracker';
import RaceComparison from './RaceComparison';
import SwordComparison from './SwordComparison';
import { sounds } from '../../utils/audio';
import { ArrowRightLeft, Layers, Dices, Skull, Target, GitCompare, Swords, Wrench } from 'lucide-react';

export default function ToolsHub() {
  const [activeTool, setActiveTool] = useState<
    'value' | 'tier' | 'gacha' | 'bounty' | 'level' | 'race' | 'sword'
  >('value');

  const tools = [
    { id: 'value', label: 'Trade Value Checker', icon: <ArrowRightLeft className="w-4 h-4" /> },
    { id: 'tier', label: 'Fruit Tier List', icon: <Layers className="w-4 h-4" /> },
    { id: 'gacha', label: 'Dealer Gacha Roll', icon: <Dices className="w-4 h-4" /> },
    { id: 'bounty', label: 'Bounty Calculator', icon: <Skull className="w-4 h-4" /> },
    { id: 'level', label: 'Level Progress Tracker', icon: <Target className="w-4 h-4" /> },
    { id: 'race', label: 'Race Comparison', icon: <GitCompare className="w-4 h-4" /> },
    { id: 'sword', label: 'Sword Comparison', icon: <Swords className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-slate-800 shadow-xl">
        <h2 className="text-3xl font-black text-white flex items-center gap-3">
          <Wrench className="w-8 h-8 text-amber-400" />
          Interactive Blox Fruits Utilities
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Seven powerful interactive tools built for pirates and marines: Trade Value Calculator with in-game 40% rule verification, customizable Tier Lists, animated Dealer Gacha Roll simulator, Bounty buff scaling, and comparative matrixes.
        </p>

        {/* Tool Segmented Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 p-1 bg-slate-950 rounded-2xl border border-slate-800">
          {tools.map(tool => {
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => {
                  setActiveTool(tool.id as typeof activeTool);
                  sounds.playClick();
                }}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {tool.icon}
                <span>{tool.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tool View */}
      <div>
        {activeTool === 'value' && <ValueChecker />}
        {activeTool === 'tier' && <TierListMaker />}
        {activeTool === 'gacha' && <FruitGachaPicker />}
        {activeTool === 'bounty' && <BountyCalculator />}
        {activeTool === 'level' && <LevelProgressTracker />}
        {activeTool === 'race' && <RaceComparison />}
        {activeTool === 'sword' && <SwordComparison />}
      </div>
    </div>
  );
}
