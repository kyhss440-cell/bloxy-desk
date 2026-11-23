import { useState, useMemo } from 'react';
import { BLOX_BOSSES_DATABASE } from '../data/bossesData';
import { BloxBoss } from '../types/bloxfruits';
import { sounds } from '../utils/audio';
import { Skull, Search, Clock, MapPin, RotateCcw, ArrowUpDown } from 'lucide-react';

interface BossDatabaseProps {
  onSelectBoss: (boss: BloxBoss) => void;
}

type BossTypeFilter = 'all' | 'regular' | 'raid';
type BossSort = 'level_desc' | 'level_asc' | 'name_asc';

export default function BossDatabase({ onSelectBoss }: BossDatabaseProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<BossTypeFilter>('all');
  const [sortBy, setSortBy] = useState<BossSort>('level_desc');

  const counts = useMemo(() => {
    const total = BLOX_BOSSES_DATABASE.length;
    const raid = BLOX_BOSSES_DATABASE.filter(b => b.isRaidBoss).length;
    const regular = total - raid;
    return { total, regular, raid };
  }, []);

  const filteredBosses = useMemo(() => {
    const q = search.trim().toLowerCase();
    return BLOX_BOSSES_DATABASE.filter(b => {
      const matchSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q) ||
        b.drops.some(d => d.name.toLowerCase().includes(q));
      const matchType =
        typeFilter === 'all' ||
        (typeFilter === 'raid' && Boolean(b.isRaidBoss)) ||
        (typeFilter === 'regular' && !b.isRaidBoss);
      return matchSearch && matchType;
    }).sort((a, b) => {
      if (sortBy === 'level_asc') return a.level - b.level;
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      return b.level - a.level;
    });
  }, [search, typeFilter, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setTypeFilter('all');
    setSortBy('level_desc');
    sounds.playClick();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-red-950/20 to-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-red-400 tracking-wide tabular-nums">
              <span>{counts.total} Total Bosses</span>
              <span aria-hidden="true">·</span>
              <span>{counts.regular} Regular Bosses</span>
              <span aria-hidden="true">·</span>
              <span>{counts.raid} Raid Bosses</span>
            </div>
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
              <Skull className="w-8 h-8 text-red-500 shrink-0" />
              <span>Blox Fruits Bosses & Raid Targets</span>
            </h2>
            <p className="text-sm text-slate-400">
              Complete directory covering all {counts.regular} regular island bosses and {counts.raid} raid bosses across First, Second, and Third Seas. Check spawn triggers, respawn timers, and drop rates.
            </p>
          </div>

          <div className="flex items-center gap-4 px-5 py-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 shrink-0 tabular-nums">
            <div>
              <span className="text-[11px] text-slate-400 block">Regular</span>
              <span className="text-xl font-black text-white">{counts.regular}</span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="text-[11px] text-slate-400 block">Raid Bosses</span>
              <span className="text-xl font-black text-red-400">{counts.raid}</span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="text-[11px] text-slate-400 block">Total</span>
              <span className="text-xl font-black text-amber-400">{counts.total}</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search boss name, location, or drop (e.g. Dark Coat, Saber, Tyrant)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-red-400"
            />
          </div>

          {/* Boss Category Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs shrink-0 overflow-x-auto">
            {(
              [
                { id: 'all', label: `All (${counts.total})` },
                { id: 'regular', label: `Regular (${counts.regular})` },
                { id: 'raid', label: `Raid Bosses (${counts.raid})` },
              ] as const
            ).map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setTypeFilter(tab.id);
                  sounds.playClick();
                }}
                className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors tabular-nums ${
                  typeFilter === tab.id
                    ? 'bg-red-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as BossSort);
                sounds.playClick();
              }}
              aria-label="Sort bosses"
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="level_desc" className="bg-slate-950">Level (High–Low)</option>
              <option value="level_asc" className="bg-slate-950">Level (Low–High)</option>
              <option value="name_asc" className="bg-slate-950">Name (A–Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span className="tabular-nums">
          Showing <strong className="text-white">{filteredBosses.length}</strong> of {counts.total} bosses
        </span>
        {(search || typeFilter !== 'all') && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-red-300 hover:text-white font-semibold cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Empty State or Bosses Grid */}
      {filteredBosses.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
          <p className="text-base font-bold text-white">No bosses match those filters</p>
          <p className="text-xs text-slate-400">
            Clear your search or switch back to All Bosses / All Seas.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBosses.map(boss => (
            <div
              key={boss.id}
              onClick={() => {
                sounds.playClick();
                onSelectBoss(boss);
              }}
              className="group p-5 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-red-500/50 shadow-lg hover:shadow-red-500/10 transition-all flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center justify-center text-2xl shrink-0 overflow-hidden group-hover:scale-110 transition-transform">
                    {boss.image ? (
                      <img
                        src={boss.image}
                        alt={boss.name}
                        referrerPolicy="no-referrer"
                        className={`w-full h-full ${
                          boss.imageFit === 'contain'
                            ? 'object-contain bg-slate-950/90'
                            : 'object-cover object-top'
                        }`}
                      />
                    ) : (
                      '💀'
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md border tracking-wider ${
                      boss.isRaidBoss
                        ? 'bg-red-600/30 text-red-300 border-red-500/50 text-glow-red'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {boss.isRaidBoss ? 'Raid Boss' : 'Regular Boss'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold">
                      Sea {boss.sea}
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">
                    {boss.name}
                  </h3>
                  <span className="text-xs font-mono text-amber-400 font-bold tabular-nums shrink-0">
                    Lvl {boss.level}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span className="truncate">{boss.location}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{boss.respawnTime}</span>
                </div>

                {/* Drops Preview */}
                <div className="mt-4 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Notable Drops:</span>
                  {boss.drops.map((drop, i) => (
                    <div key={i} className="p-1.5 px-2 rounded-lg bg-slate-950/70 border border-slate-800 flex justify-between items-center text-xs gap-2">
                      <span className="text-slate-200 font-semibold truncate">{drop.name}</span>
                      <span className="text-amber-400 font-mono text-[11px] shrink-0">{drop.chance}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rewards footer */}
              <div className="mt-4 pt-3 border-t border-slate-800 text-xs flex items-center justify-between text-slate-400">
                <span className="text-emerald-400 font-bold tabular-nums">{boss.rewards.beli}</span>
                <span className="text-cyan-400 font-bold tabular-nums">{boss.rewards.exp}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
