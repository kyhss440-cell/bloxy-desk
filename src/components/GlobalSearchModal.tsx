import { useState, useMemo, useEffect } from 'react';
import { BLOX_FRUITS_DATABASE } from '../data/fruitsData';
import { BLOX_RACES_DATABASE } from '../data/racesData';
import { BLOX_SWORDS_DATABASE } from '../data/swordsData';
import { BLOX_GUNS_DATABASE } from '../data/gunsData';
import { BLOX_FIGHTING_STYLES } from '../data/fightingStylesData';
import { BLOX_ACCESSORIES_DATABASE } from '../data/accessoriesData';
import { BLOX_BOSSES_DATABASE } from '../data/bossesData';
import { BLOX_ISLANDS_DATABASE } from '../data/islandsData';
import { sounds } from '../utils/audio';
import { Search, X, ChevronRight, Apple, Zap, Swords, Crosshair, Shield, Skull, MapPin, Sparkles } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (type: string, item: unknown) => void;
}

interface SearchResultItem {
  id: string;
  name: string;
  type: 'fruit' | 'race' | 'sword' | 'gun' | 'style' | 'accessory' | 'boss' | 'island';
  subtext: string;
  badge: string;
  raw: unknown;
}

export default function GlobalSearchModal({ isOpen, onClose, onSelectItem }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const allItems = useMemo<SearchResultItem[]>(() => {
    const list: SearchResultItem[] = [];

    // Fruits
    BLOX_FRUITS_DATABASE.forEach(f => {
      list.push({
        id: `fruit-${f.id}`,
        name: `${f.name} Fruit`,
        type: 'fruit',
        subtext: `${f.rarity} · ${f.category} · $${f.priceBeli.toLocaleString()}`,
        badge: f.rarity,
        raw: f,
      });
    });

    // Races
    BLOX_RACES_DATABASE.forEach(r => {
      list.push({
        id: `race-${r.id}`,
        name: `${r.name} Race`,
        type: 'race',
        subtext: `V1 to V4 · PvP Rating ${r.pvpRating}/10`,
        badge: 'Race',
        raw: r,
      });
    });

    // Swords
    BLOX_SWORDS_DATABASE.forEach(s => {
      list.push({
        id: `sword-${s.id}`,
        name: s.name,
        type: 'sword',
        subtext: `${s.rarity} · Sea ${s.sea} · Mastery ${s.masteryReqTotal}`,
        badge: s.rarity,
        raw: s,
      });
    });

    // Guns
    BLOX_GUNS_DATABASE.forEach(g => {
      list.push({
        id: `gun-${g.id}`,
        name: g.legacyName ? `${g.name} (${g.legacyName})` : g.name,
        type: 'gun',
        subtext: `${g.rarity} · Sea ${g.sea} · Mastery ${g.masteryReqTotal}`,
        badge: g.rarity,
        raw: g,
      });
    });

    // Fighting Styles
    BLOX_FIGHTING_STYLES.forEach(st => {
      list.push({
        id: `style-${st.id}`,
        name: st.name,
        type: 'style',
        subtext: `Sea ${st.sea} · ${st.location}`,
        badge: 'Martial Art',
        raw: st,
      });
    });

    // Accessories
    BLOX_ACCESSORIES_DATABASE.forEach(a => {
      list.push({
        id: `acc-${a.id}`,
        name: a.name,
        type: 'accessory',
        subtext: `${a.rarity} · Sea ${a.sea} · ${a.location}`,
        badge: a.rarity,
        raw: a,
      });
    });

    // Bosses
    BLOX_BOSSES_DATABASE.forEach(b => {
      list.push({
        id: `boss-${b.id}`,
        name: b.name,
        type: 'boss',
        subtext: `Level ${b.level} · Sea ${b.sea} · ${b.location}`,
        badge: b.isRaidBoss ? 'Raid Boss' : `Level ${b.level}`,
        raw: b,
      });
    });

    // Islands
    BLOX_ISLANDS_DATABASE.forEach(isl => {
      list.push({
        id: `island-${isl.id}`,
        name: isl.name,
        type: 'island',
        subtext: `Sea ${isl.sea} · Recommended: ${isl.recommendedLevel}`,
        badge: `Sea ${isl.sea}`,
        raw: isl,
      });
    });

    return list;
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 10);
    const q = query.toLowerCase();
    return allItems.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.subtext.toLowerCase().includes(q)
    ).slice(0, 20);
  }, [allItems, query]);

  if (!isOpen) return null;

  const getTypeIcon = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'fruit': return <Apple className="w-4 h-4 text-cyan-400" />;
      case 'race': return <Zap className="w-4 h-4 text-amber-400" />;
      case 'sword': return <Swords className="w-4 h-4 text-purple-400" />;
      case 'gun': return <Crosshair className="w-4 h-4 text-violet-400" />;
      case 'style': return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case 'accessory': return <Shield className="w-4 h-4 text-rose-400" />;
      case 'boss': return <Skull className="w-4 h-4 text-red-500" />;
      case 'island': return <MapPin className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            type="text"
            placeholder="Search fruits, races, swords, bosses, accessories, islands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-base"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No results found for "{query}". Try searching "Kitsune", "Dough", "CDK", "Angel", or "Leviathan".
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  sounds.playClick();
                  onSelectItem(item.type, item.raw);
                  onClose();
                }}
                className="w-full p-3 rounded-xl hover:bg-slate-800/80 flex items-center justify-between text-left transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center shrink-0 border border-slate-800">
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                      {item.name}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      {item.subtext}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {item.badge}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer tip */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>{allItems.length} total game items indexed</span>
          <span>Esc to exit</span>
        </div>
      </div>
    </div>
  );
}
