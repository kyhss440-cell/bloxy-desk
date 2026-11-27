import { useState, useEffect } from 'react';
import { sounds } from '../utils/audio';
import { Search, Volume2, VolumeX, Menu, X } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openSearch: () => void;
}

export default function Navbar({ activeTab, setActiveTab, openSearch }: NavbarProps) {
  const [isMuted, setIsMuted] = useState(!sounds.enabled);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openSearch]);

  const toggleSound = () => {
    sounds.enabled = !sounds.enabled;
    setIsMuted(!sounds.enabled);
    if (sounds.enabled) sounds.playClick();
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'fruits', label: 'Fruits' },
    { id: 'races', label: 'Races' },
    { id: 'swords', label: 'Swords' },
    { id: 'guns', label: 'Guns' },
    { id: 'styles', label: 'Fighting Styles' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'bosses', label: 'Bosses' },
    { id: 'islands', label: 'Seas & Islands' },
    { id: 'codes', label: 'Codes' },
    { id: 'tools', label: 'Tools' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#050811]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-8 h-16">
        {/* Zone 1: Single text element wordmark (Display face) */}
        <button
          onClick={() => {
            setActiveTab('home');
            sounds.playClick();
          }}
          className="text-xl font-black tracking-tight text-white flex items-center gap-2 hover:opacity-95 transition-opacity whitespace-nowrap shrink-0 cursor-pointer group"
        >
          <span className="flex items-center gap-3 text-amber-400 font-cinzel">
            <img
              src="/assets/aistudio/kitsune_transparent.png"
              alt="Kitsune Logo"
              className="w-10 h-10 object-contain relative z-20 shrink-0 filter drop-shadow-[0_4px_14px_rgba(6,182,212,0.85)] drop-shadow-[0_0_24px_rgba(59,130,246,0.65)] group-hover:scale-115 group-hover:-translate-y-0.5 transition-all duration-300 ease-out"
            />
            <span className="tracking-wide text-glow-gold">BLOXY DESK</span>
          </span>
        </button>

        {/* Zone 2: Navigation Links (single line, whitespace-nowrap shrink-0) */}
        <nav className="hidden xl:flex items-center gap-4 text-sm font-semibold text-slate-300">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  sounds.playClick();
                }}
                className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 ${
                  isActive
                    ? 'text-amber-400 border-b-2 border-amber-400 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action (Search Ctrl+K) + Sound Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              openSearch();
              sounds.playClick();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Search entire encyclopedia (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Search Guide</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-slate-950 rounded text-slate-400 border border-slate-800">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 xl:hidden cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-800 bg-[#050811] px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
                sounds.playClick();
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer ${
                activeTab === link.id
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
