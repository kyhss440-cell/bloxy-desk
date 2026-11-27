import { useEffect, useState } from 'react';
import { sounds } from '../utils/audio';
import { Search, Sparkles, Flame, Swords, Shield, Dices, ArrowRight, Zap, Skull, Compass } from 'lucide-react';
import dracoShowcaseImg from '../assets/images/race_draco_showcase_clean.png';
import kitsuneShowcaseImg from '../assets/images/regenerated_image_1794538705883.png';
import kitsuneFruitImg from '../assets/images/kitsune_fruit_showcase_1794311748109.jpg';
import firstSeaIconImg from '../assets/images/first_sea_icon_1794891737755.jpg';

const HERO_BANNERS = [
  {
    src: '/assets/aistudio/image_c4ed2d7c.png',
    alt: 'Going Merry sailing across the ocean',
    positionClass: 'object-center',
  },
  {
    src: '/assets/aistudio/image_74154613.png',
    alt: 'Red Hair Pirates crew standoff',
    positionClass: 'object-[center_25%]',
  },
  {
    src: '/assets/aistudio/image_0fef642e.png',
    alt: 'Rooftop battle showdown',
    positionClass: 'object-center',
  },
  {
    src: '/assets/aistudio/image_d6e9bc56.png',
    alt: 'Whitebeard Pirates fleet commanders',
    positionClass: 'object-[center_15%]',
  },
  {
    src: '/assets/aistudio/image_5af2c2a6.png',
    alt: 'Straw Hat Pirates aboard the Thousand Sunny',
    positionClass: 'object-center',
  },
  {
    src: '/assets/aistudio/image_eecf76b6.png',
    alt: 'Straw Hat Pirates farewell to Going Merry',
    positionClass: 'object-[center_65%]',
  },
] as const;

const HERO_SLIDE_INTERVAL_MS = 25000;

interface HeroProps {
  onNavigate: (tab: string) => void;
  openSearch: () => void;
}

export default function Hero({ onNavigate, openSearch }: HeroProps) {
  const [bannerIndex, setBannerIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    HERO_BANNERS.forEach((banner) => {
      const img = new Image();
      img.src = banner.src;
    });

    let swapTimeout: ReturnType<typeof setTimeout> | undefined;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      swapTimeout = setTimeout(() => {
        setBannerIndex((prev) => (prev + 1) % HERO_BANNERS.length);
        setIsTransitioning(false);
      }, 350);
    }, HERO_SLIDE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      if (swapTimeout) clearTimeout(swapTimeout);
    };
  }, []);

  const currentBanner = HERO_BANNERS[bannerIndex];

  return (
    <div className="space-y-16 pb-12">
      {/* Cinematic Hero Section */}
      <section className="relative min-h-[580px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-end p-6 sm:p-12 bg-[#050811]">
        {/* Background artwork */}
        <img
          src={currentBanner.src}
          alt={currentBanner.alt}
          referrerPolicy="no-referrer"
          className={`absolute inset-0 w-full h-full object-cover ${currentBanner.positionClass} filter brightness-85 transition-opacity duration-500 ${
            isTransitioning ? 'opacity-20' : 'opacity-100'
          }`}
        />

        {/* Ambient Gradient Scrims for WCAG AA readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/70 to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050811]/90 via-transparent to-[#050811]/60 pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 tracking-widest uppercase">
            <span>Blox Fruits Ultimate Encyclopedia</span>
            <span aria-hidden="true">·</span>
            <span>Update 24 Ready</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight font-cinzel tracking-tight text-glow-gold">
            BLOXY DESK
          </h1>

          <p className="text-xl sm:text-2xl font-black text-amber-300 font-heading tracking-wide">
            EXPLORE. FIGHT. COLLECT. RULE THE SEAS.
          </p>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            The definitive companion for Blox Fruits players. Master all 42 fruits, awaken the ancient Draco & V4 races, forge mythical dual katanas, and dominate every raid across all three seas.
          </p>

          {/* Quick Search Action Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-xl">
            <button
              onClick={() => {
                openSearch();
                sounds.playClick();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-amber-400/30 text-left text-sm text-slate-400 flex items-center justify-between shadow-xl cursor-pointer transition-all hover:border-amber-400"
            >
              <span className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-amber-400" />
                <span>Search fruits, swords, races, bosses...</span>
              </span>
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs bg-slate-950 text-slate-400 rounded border border-slate-700">
                Ctrl+K
              </kbd>
            </button>

            <button
              onClick={() => {
                onNavigate('fruits');
                sounds.playClick();
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Fruits</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Quick Navigation Dashboard */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            Quick Navigation Dashboard
          </h2>
          <span className="text-xs text-slate-400">Direct database shortcuts</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { id: 'fruits', label: 'All Fruits', image: '/assets/aistudio/kitsune_transparent.png', desc: '42 devil fruits', color: 'border-red-500/30 hover:border-red-500' },
            { id: 'races', label: 'Races V1-V4', icon: '⚡', image: '/assets/aistudio/race_draco_icon_clean.png', desc: '7 races & trials', color: 'border-amber-500/30 hover:border-amber-500' },
            { id: 'swords', label: 'Swords', icon: '⚔️', image: '/assets/aistudio/ttk_swords_clean.png', desc: 'CDK, TTK, Shark Anchor', color: 'border-cyan-500/30 hover:border-cyan-500' },
            { id: 'guns', label: 'Guns', icon: '🔫', image: '/assets/aistudio/image_b14263e2.png', desc: 'Skull Guitar, Dragonstorm', color: 'border-violet-500/30 hover:border-violet-500' },
            { id: 'styles', label: 'Fighting Styles', icon: '🥋', image: '/assets/aistudio/fighting_style_clean.png', desc: 'Godhuman & Sanguine', color: 'border-purple-500/30 hover:border-purple-500' },
            { id: 'accessories', label: 'Accessories', icon: '👑', image: '/assets/aistudio/accessories_cape_clean.png', desc: 'Crown, Scarf, Masks', color: 'border-emerald-500/30 hover:border-emerald-500' },
            { id: 'bosses', label: 'Bosses', icon: '💀', image: '/assets/aistudio/bosses_clean.png', desc: 'Dough King, Leviathan', color: 'border-rose-500/30 hover:border-rose-500' },
            { id: 'islands', label: 'Seas & Secret Quests', icon: '🧭', image: firstSeaIconImg, desc: '3 Seas, routes & 39 Stars', color: 'border-sky-500/30 hover:border-sky-500' },
            { id: 'codes', label: 'Redeem Codes', icon: '🎟️', image: '/assets/aistudio/reward_codes_clean.png', desc: '2x EXP, Resets & Fun', color: 'border-emerald-500/30 hover:border-emerald-400' },
            { id: 'tools', label: 'Interactive Tools', icon: '🧮', image: '/assets/aistudio/tools_trade_clean.png', desc: 'Gacha, Values, Tiers', color: 'border-yellow-500/30 hover:border-yellow-500' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                sounds.playClick();
              }}
              className={`p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border ${item.color} flex flex-col items-center text-center transition-all group cursor-pointer shadow-md`}
            >
              <span className="h-9 mb-1.5 flex items-center justify-center group-hover:scale-115 transition-transform">
                {'image' in item && item.image ? (
                  <img
                    src={item.image}
                    alt={item.label}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-lg object-contain filter drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                  />
                ) : (
                  <span className="text-3xl">{item.icon}</span>
                )}
              </span>
              <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors whitespace-nowrap">{item.label}</span>
              <span className="text-[10px] text-slate-400 mt-0.5">{item.desc}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Highlights Bento Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Meta Spotlights: Top Tier Arsenal
          </h2>
          <span className="text-xs text-slate-400">Current game meta highlights</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Spotlight 1: Kitsune Fruit */}
          <div className="group rounded-3xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400/80 p-5 shadow-xl transition-all flex flex-col justify-between overflow-hidden relative">
            <div className="aspect-square rounded-2xl overflow-hidden mb-4 relative bg-slate-950 border border-slate-800 flex items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-cyan-950/30 to-slate-950">
              <img
                src={kitsuneShowcaseImg}
                alt="Kitsune Mythical Blox Fruit"
                referrerPolicy="no-referrer"
                className="w-4/5 h-4/5 object-contain filter drop-shadow-[0_0_25px_rgba(34,211,238,0.45)] group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 z-30 px-2.5 py-1 rounded-md bg-purple-600/90 text-white font-extrabold text-[11px] uppercase tracking-wider backdrop-blur-sm shadow-md">
                Mythical Beast
              </div>
              <div className="absolute top-3 right-3 z-30 px-2.5 py-1 rounded-md bg-slate-950/90 border border-amber-500/40 text-amber-300 font-extrabold text-[11px] uppercase tracking-wider backdrop-blur-sm shadow-md">
                PvP S+
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xl font-bold text-white">Kitsune Fruit</h3>
                <span className="text-cyan-400 font-extrabold text-sm">$8,000,000</span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                Nine-Tailed celestial fox fruit granting passive ocean running, high-speed tails, and supreme transformation.
              </p>
            </div>

            <button
              onClick={() => {
                onNavigate('fruits');
                sounds.playClick();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-cyan-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View Fruit Abilities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Spotlight 2: Cursed Dual Katana */}
          <div className="group rounded-3xl bg-slate-900/90 border border-red-500/30 hover:border-red-400/80 p-5 shadow-xl transition-all flex flex-col justify-between overflow-hidden relative">
            <div className="aspect-square rounded-2xl overflow-hidden mb-4 relative bg-slate-950 border border-slate-800">
              <img
                src="/assets/aistudio/image_a2d06930.png"
                alt="Cursed Dual Katana Sword"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 z-30 px-2.5 py-1 rounded-md bg-red-600/90 text-white font-extrabold text-[11px] uppercase tracking-wider backdrop-blur-sm shadow-md">
                Mythical Sword
              </div>
              <div className="absolute top-3 right-3 z-30 px-2.5 py-1 rounded-md bg-slate-950/90 border border-amber-500/40 text-amber-300 font-extrabold text-[11px] uppercase tracking-wider backdrop-blur-sm shadow-md">
                PvP S+
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xl font-bold text-white">Cursed Dual Katana</h3>
                <span className="text-amber-400 font-extrabold text-sm">Sea 3 Quest</span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                The apex dual blades forged from Yama and Tushita. Revolving Ravager and Slayer of Goliath combo supremacy.
              </p>
            </div>

            <button
              onClick={() => {
                onNavigate('swords');
                sounds.playClick();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-red-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View Sword Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Spotlight 3: Draco Race */}
          <div className="group rounded-3xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-400/80 p-5 shadow-xl transition-all flex flex-col justify-between overflow-hidden relative">
            <div className="aspect-square rounded-2xl overflow-hidden mb-4 relative bg-slate-950 border border-slate-800 flex items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-950">
              <img
                src={dracoShowcaseImg}
                alt="Draco Race Awakened Warrior"
                referrerPolicy="no-referrer"
                className="w-4/5 h-4/5 object-contain filter drop-shadow-[0_0_25px_rgba(234,179,8,0.4)] group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 z-30 px-2.5 py-1 rounded-md bg-amber-600/90 text-white font-extrabold text-[11px] uppercase tracking-wider backdrop-blur-sm shadow-md">
                New Race · V4
              </div>
              <div className="absolute top-3 right-3 z-30 px-2.5 py-1 rounded-md bg-slate-950/90 border border-emerald-500/40 text-emerald-300 font-extrabold text-[11px] uppercase tracking-wider backdrop-blur-sm shadow-md">
                PvP 10/10
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xl font-bold text-white">Draco Race</h3>
                <span className="text-emerald-400 font-extrabold text-sm">10/10 PvP</span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                Primal dragon lineage with Wyrm Fire passive, Dragon Roar instinct strip, and radiant golden flame wings in V4.
              </p>
            </div>

            <button
              onClick={() => {
                onNavigate('races');
                sounds.playClick();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View Race Trials</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Latest Game Information & Patch Notes Section */}
      <section className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">Blox Fruits Intelligence</span>
            <h2 className="text-2xl font-black text-white">Latest Update Meta & Patch Briefing</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Current Season</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-amber-400 font-bold text-sm mb-1">🔥 Dragon Fruit Rework</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Eastern and Western dragon forms introduced with complete moveset re-imagining, fire shower barrages, and enhanced fury armor.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-cyan-400 font-bold text-sm mb-1">🌊 Danger Level 6 Sea Events</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Rough Seas beyond Submerged Island now feature the abyssal Leviathan, Terror Shark spawns, and full moon Kitsune shrines.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-purple-400 font-bold text-sm mb-1">🩸 Sanguine Art Mastery</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Craftable with a Leviathan Heart at Tiki Outpost basement. Siphons up to 25% of health back to the player with every claw strike.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-emerald-400 font-bold text-sm mb-1">⚙️ Race V4 Gear Optimization</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Temple of Time trials now grant specialized Gear 1 & Gear 2 passive upgrades, transforming competitive PvP strategies.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
