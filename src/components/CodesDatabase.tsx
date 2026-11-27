import { useState, useMemo, useEffect } from 'react';
import { sounds } from '../utils/audio';
import {
  Ticket,
  Copy,
  Check,
  Search,
  Zap,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Circle,
  Gift,
} from 'lucide-react';

type CodeCategory = 'exp' | 'reset' | 'fun';
type FilterTab = 'all' | CodeCategory;

interface RedeemCode {
  code: string;
  category: CodeCategory;
  reward: string;
}

const BLOX_CODES: RedeemCode[] = [
  // 2x EXP Codes (17)
  { code: 'SUB2GAMERROBOT_EXP1', category: 'exp', reward: '20 mins of 2x EXP' },
  { code: 'EASTEREXP', category: 'exp', reward: '2x EXP Boost' },
  { code: 'Axiore', category: 'exp', reward: '20 mins of 2x EXP' },
  { code: 'Bluxxy', category: 'exp', reward: '20 mins of 2x EXP' },
  { code: 'Enyu_is_Pro', category: 'exp', reward: '20 mins of 2x EXP' },
  { code: 'JCWK', category: 'exp', reward: '20 mins of 2x EXP' },
  { code: 'Kittgaming', category: 'exp', reward: '20 mins of 2x EXP' },
  { code: 'Magicbus', category: 'exp', reward: '20 mins of 2x EXP' },
  { code: 'Starcodeheo', category: 'exp', reward: '20 mins of 2x EXP' },
  { code: 'StrawHatMaine', category: 'exp', reward: '20 mins of 2x EXP' },
  { code: 'Sub2CaptainMaui', category: 'exp', reward: '20 mins of 2x EXP' },
  { code: 'Sub2Daigrock', category: 'exp', reward: '20 mins of 2x EXP' },
  { code: 'Sub2Fer999', category: 'exp', reward: '20 mins of 2x EXP' },
  { code: 'Sub2NoobMaster123', category: 'exp', reward: '20 mins of 2x EXP' },
  { code: 'Sub2OfficialNoobie', category: 'exp', reward: '20 mins of 2x EXP' },
  { code: 'TantaiGaming', category: 'exp', reward: '20 mins of 2x EXP' },
  { code: 'TheGreatAce', category: 'exp', reward: '20 mins of 2x EXP' },

  // Stat Reset Codes (3)
  { code: 'KITT_RESET', category: 'reset', reward: 'Free Stat Points Reset' },
  { code: 'SUB2GAMERROBOT_RESET1', category: 'reset', reward: 'Free Stat Points Reset' },
  { code: 'Sub2UncleKizaru', category: 'reset', reward: 'Free Stat Points Reset' },

  // Fun Codes (4)
  { code: 'BIGNEWS', category: 'fun', reward: 'In-game Title ("BIGNEWS")' },
  { code: 'Fudd10', category: 'fun', reward: '$1 Beli' },
  { code: 'Fudd10_v2', category: 'fun', reward: '$2 Beli' },
  { code: 'Chandler', category: 'fun', reward: '$0 Beli' },
];

const STORAGE_KEY = 'bloxy_redeemed_codes_v1';

const CATEGORY_META: Record<
  CodeCategory,
  {
    title: string;
    subtitle: string;
    badge: string;
    accentText: string;
    accentBorder: string;
    accentBg: string;
  }
> = {
  exp: {
    title: '2x EXP Codes',
    subtitle: 'Stackable double experience boosts for fast leveling and mastery grinding.',
    badge: '2x EXP',
    accentText: 'text-amber-400',
    accentBorder: 'border-amber-500/30',
    accentBg: 'bg-amber-500/10',
  },
  reset: {
    title: 'Stat Reset Codes',
    subtitle: 'Refund all allocated Stat Points to freely rebuild Melee, Defense, Sword, Gun, or Blox Fruit.',
    badge: 'Stat Reset',
    accentText: 'text-cyan-400',
    accentBorder: 'border-cyan-500/30',
    accentBg: 'bg-cyan-500/10',
  },
  fun: {
    title: 'Fun Codes',
    subtitle: 'Secret joke rewards and special in-game titles.',
    badge: 'Fun',
    accentText: 'text-purple-400',
    accentBorder: 'border-purple-500/30',
    accentBg: 'bg-purple-500/10',
  },
};

export default function CodesDatabase() {
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [redeemedCodes, setRedeemedCodes] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(redeemedCodes));
    } catch {
      // ignore storage errors
    }
  }, [redeemedCodes]);

  const redeemedCount = useMemo(
    () => BLOX_CODES.filter((entry) => Boolean(redeemedCodes[entry.code])).length,
    [redeemedCodes]
  );

  const counts = useMemo(
    () => ({
      all: BLOX_CODES.length,
      exp: BLOX_CODES.filter((c) => c.category === 'exp').length,
      reset: BLOX_CODES.filter((c) => c.category === 'reset').length,
      fun: BLOX_CODES.filter((c) => c.category === 'fun').length,
    }),
    []
  );

  const filteredSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const categories: CodeCategory[] =
      filterTab === 'all' ? ['exp', 'reset', 'fun'] : [filterTab];

    return categories
      .map((cat) => ({
        category: cat,
        items: BLOX_CODES.filter(
          (entry) =>
            entry.category === cat &&
            (q === '' ||
              entry.code.toLowerCase().includes(q) ||
              entry.reward.toLowerCase().includes(q))
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [filterTab, searchQuery]);

  const handleCopy = async (code: string) => {
    sounds.playClick();
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // ignore clipboard errors in restricted environments
    }
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode((curr) => (curr === code ? null : curr));
    }, 1800);
  };

  const toggleRedeemed = (code: string) => {
    sounds.playClick();
    setRedeemedCodes((prev) => ({
      ...prev,
      [code]: !prev[code],
    }));
  };

  const renderCategoryIcon = (cat: CodeCategory) => {
    if (cat === 'exp') return <Zap className="w-5 h-5 text-amber-400" />;
    if (cat === 'reset') return <RotateCcw className="w-5 h-5 text-cyan-400" />;
    return <Sparkles className="w-5 h-5 text-purple-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900 border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Gift className="w-4 h-4" />
            <span>Blox Fruits Redeem Codes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white flex items-center gap-3">
            <Ticket className="w-8 h-8 text-emerald-400 shrink-0" />
            <span>2x EXP, Stat Reset & Fun Codes</span>
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Click any code to copy it straight to your clipboard, then paste it into the in-game Gift / Bird code menu. Mark redeemed codes to keep track of what you have already claimed.
          </p>
        </div>

        <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-slate-950/90 border border-slate-800 shrink-0 tabular-nums">
          <div>
            <span className="text-[11px] text-slate-400 block">Codes Redeemed</span>
            <span className="text-2xl font-black text-emerald-400">
              {redeemedCount}{' '}
              <span className="text-slate-500 text-sm">/ {BLOX_CODES.length}</span>
            </span>
          </div>
          {redeemedCount > 0 && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setRedeemedCodes({});
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </section>

      {/* Filter Tabs + Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900 rounded-2xl border border-slate-800">
          {(
            [
              { key: 'all', label: `All Codes (${counts.all})` },
              { key: 'exp', label: `2x EXP (${counts.exp})` },
              { key: 'reset', label: `Stat Resets (${counts.reset})` },
              { key: 'fun', label: `Fun Codes (${counts.fun})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                sounds.playClick();
                setFilterTab(tab.key);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer ${
                filterTab === tab.key
                  ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter codes or rewards..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Code Sections */}
      {filteredSections.length === 0 ? (
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center text-sm text-slate-400">
          No codes matched your filter.
        </div>
      ) : (
        <div className="space-y-6">
          {filteredSections.map(({ category, items }) => {
            const meta = CATEGORY_META[category];
            return (
              <section
                key={category}
                className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      {renderCategoryIcon(category)}
                      <span>{meta.title}</span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${meta.accentBg} ${meta.accentText} border ${meta.accentBorder}`}
                      >
                        {items.length}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{meta.subtitle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map((entry) => {
                    const isCopied = copiedCode === entry.code;
                    const isRedeemed = Boolean(redeemedCodes[entry.code]);

                    return (
                      <div
                        key={entry.code}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-colors ${
                          isRedeemed
                            ? 'bg-slate-950/50 border-slate-800/70 opacity-70'
                            : 'bg-slate-950/90 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleRedeemed(entry.code)}
                          className="flex items-center gap-3 min-w-0 flex-1 text-left cursor-pointer group"
                          title={isRedeemed ? 'Mark as unredeemed' : 'Mark as redeemed'}
                        >
                          {isRedeemed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600 group-hover:text-slate-400 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <div
                              className={`font-mono text-sm font-bold truncate ${
                                isRedeemed
                                  ? 'line-through text-slate-400'
                                  : 'text-white'
                              }`}
                            >
                              {entry.code}
                            </div>
                            <div className={`text-[11px] font-semibold ${meta.accentText}`}>
                              {entry.reward}
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopy(entry.code)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors ${
                            isCopied
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
