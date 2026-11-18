import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FruitDatabase from './components/FruitDatabase';
import RaceDatabase from './components/RaceDatabase';
import SwordDatabase from './components/SwordDatabase';
import GunDatabase from './components/GunDatabase';
import AccessoryDatabase from './components/AccessoryDatabase';
import BossDatabase from './components/BossDatabase';
import IslandsGuide from './components/IslandsGuide';
import SecretQuestsGuide from './components/SecretQuestsGuide';
import FightingStylesDatabase from './components/FightingStylesDatabase';
import ToolsHub from './components/Tools/ToolsHub';
import GlobalSearchModal from './components/GlobalSearchModal';
import ItemDetailModal from './components/ItemDetailModal';
import { sounds } from './utils/audio';
import { BloxFruit, BloxSword, BloxGun, BloxAccessory, BloxBoss } from './types/bloxfruits';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [islandsSea, setIslandsSea] = useState<'all' | 1 | 2 | 3>('all');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedModalItem, setSelectedModalItem] = useState<{ type: string; item: unknown } | null>(null);

  const handleNavigate = (tab: string) => {
    if (tab === 'first-sea') {
      setIslandsSea(1);
      setActiveTab('islands');
      return;
    }
    if (tab === 'islands') {
      setIslandsSea('all');
    }
    setActiveTab(tab);
  };

  const handleSelectItem = (type: string, item: unknown) => {
    setSelectedModalItem({ type, item });
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        openSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'home' && (
          <Hero
            onNavigate={handleNavigate}
            openSearch={() => setIsSearchOpen(true)}
          />
        )}

        {activeTab === 'fruits' && (
          <FruitDatabase
            onSelectFruit={(fruit: BloxFruit) => handleSelectItem('fruit', fruit)}
          />
        )}

        {activeTab === 'races' && (
          <RaceDatabase />
        )}

        {activeTab === 'swords' && (
          <SwordDatabase
            onSelectSword={(sword: BloxSword) => handleSelectItem('sword', sword)}
          />
        )}

        {activeTab === 'guns' && (
          <GunDatabase
            onSelectGun={(gun: BloxGun) => handleSelectItem('gun', gun)}
          />
        )}

        {activeTab === 'styles' && (
          <FightingStylesDatabase />
        )}

        {activeTab === 'accessories' && (
          <AccessoryDatabase
            onSelectAccessory={(acc: BloxAccessory) => handleSelectItem('accessory', acc)}
          />
        )}

        {activeTab === 'bosses' && (
          <BossDatabase
            onSelectBoss={(boss: BloxBoss) => handleSelectItem('boss', boss)}
          />
        )}

        {activeTab === 'islands' && (
          <IslandsGuide initialSea={islandsSea} />
        )}

        {activeTab === 'secret-quests' && (
          <SecretQuestsGuide />
        )}

        {activeTab === 'tools' && (
          <ToolsHub />
        )}
      </main>

      {/* Universal Search Modal (Ctrl+K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectItem={handleSelectItem}
      />

      {/* Item Detail Modal */}
      {selectedModalItem && (
        <ItemDetailModal
          type={selectedModalItem.type}
          item={selectedModalItem.item}
          onClose={() => setSelectedModalItem(null)}
        />
      )}

      {/* Quiet, Domain-Compliant Footer */}
      <footer className="border-t border-slate-900 bg-[#03050b] py-10 px-4 sm:px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <div className="flex items-center gap-2">
              <img
                src="/assets/aistudio/image_113f0c05.png"
                alt="Kitsune Logo"
                className="w-5 h-5 object-contain filter drop-shadow-[0_0_6px_rgba(6,182,212,0.5)]"
              />
              <span className="font-bold text-slate-200 text-sm font-cinzel tracking-wider">
                BLOXY DESK
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              The Ultimate Blox Fruits Guide & Interactive Encyclopedia
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <button
              onClick={() => {
                setActiveTab('fruits');
                sounds.playClick();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Fruits
            </button>
            <button
              onClick={() => {
                setActiveTab('races');
                sounds.playClick();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Races V4
            </button>
            <button
              onClick={() => {
                setActiveTab('swords');
                sounds.playClick();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Swords
            </button>
            <button
              onClick={() => {
                setActiveTab('guns');
                sounds.playClick();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Guns
            </button>
            <button
              onClick={() => {
                setActiveTab('tools');
                sounds.playClick();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Tools & Values
            </button>
          </div>

          <div className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} BLOXY DESK · Fan-built Blox Fruits companion
          </div>
        </div>
      </footer>
    </div>
  );
}
