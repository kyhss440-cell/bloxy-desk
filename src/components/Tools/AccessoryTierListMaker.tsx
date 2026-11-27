import { useState, useMemo } from 'react';
import { BLOX_ACCESSORIES_DATABASE } from '../../data/accessoriesData';
import { BloxAccessory } from '../../types/bloxfruits';
import { sounds } from '../../utils/audio';
import { Crown, RotateCcw, Swords, Compass } from 'lucide-react';

type TierKey = 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';

interface TierRow {
  key: TierKey;
  label: string;
  bgHeader: string;
  items: BloxAccessory[];
}

const PVP_TIER_MAP: Record<string, TierKey> = {
  // S+ (God Tier)
  pale_scarf: 'S+',
  kitsune_ribbon: 'S+',
  kitsune_mask: 'S+',
  leviathan_shield: 'S+',
  swan_glasses: 'S+',
  dino_hood: 'S+',
  dragon_mantle: 'S+',
  dojo_belt_black: 'S+',
  headband_black: 'S+',
  hunter_cape_black: 'S+',
  hunter_cape_green: 'S+',
  hunter_cape_red: 'S+',
  bandanna_black: 'S+',
  bandanna_green: 'S+',
  bandanna_red: 'S+',

  // S (Meta Staple)
  dark_coat: 'S',
  valkyrie_helm: 'S',
  terror_jaw: 'S',
  zebra_cap: 'S',
  santa_hat: 'S',
  cupids_coat: 'S',
  heart_shades: 'S',
  musketeer_hat: 'S',
  warrior_helmet: 'S',
  oni_helmet: 'S',
  easter_bunny_cape: 'S',
  holiday_cloak: 'S',
  leviathan_crown: 'S',
  wyvern_helmet: 'S',
  shark_cape: 'S',
  ghoul_mask: 'S',

  // A (Very Strong)
  celestial_helmet: 'A',
  cracked_egg_helmet: 'A',
  coral_crown: 'A',
  divine_cloak: 'A',
  frosty_helmet: 'A',
  peppermint_helmet: 'A',
  red_ribbon: 'A',
  sanguine_cloak: 'A',
  trex_skull: 'A',
  shark_tooth_necklace: 'A',
  golden_sunhat: 'A',
  holy_crown: 'A',
  choppa: 'A',
  top_hat: 'A',
  elf_hat: 'A',
  dojo_belt_red: 'A',
  dojo_belt_purple: 'A',
  headband_red: 'A',
  headband_purple: 'A',
  feathered_visage: 'A',
  bear_ears: 'A',

  // B (Viable)
  coven_witch_hat: 'B',
  great_pumpkin_top_hat: 'B',
  pumpkin_mask: 'B',
  swordsman_hat: 'B',
  tomoe_ring: 'B',
  coat: 'B',
  usoaps_hat: 'B',
  black_spikey_coat: 'B',
  blue_spikey_coat: 'B',
  cool_shades: 'B',
  dojo_belt_blue: 'B',
  dojo_belt_green: 'B',
  headband_blue: 'B',
  headband_green: 'B',
  mummy_headdress: 'B',
  megalos_coat: 'B',

  // C (Situational)
  ds_coat: 'C',
  black_cape: 'C',
  marine_cap: 'C',
  dojo_belt_orange: 'C',
  dojo_belt_yellow: 'C',
  headband_orange: 'C',
  headband_yellow: 'C',
  '50b_party_hat': 'C',
  party_hat: 'C',
  cupids_top_hat: 'C',
  romantic_bouquet: 'C',
  royal_nimbus: 'C',

  // D (Underpowered)
  headband_white: 'D',
  dojo_belt_white: 'D',
  pink_coat: 'D',
};

const GRIND_TIER_MAP: Record<string, TierKey> = {
  // S+ (God Tier for Grinding, Mastery & Sea Events)
  ghoul_mask: 'S+',
  leviathan_crown: 'S+',
  leviathan_shield: 'S+',
  shark_cape: 'S+',
  shark_tooth_necklace: 'S+',
  '50b_party_hat': 'S+',
  party_hat: 'S+',
  royal_nimbus: 'S+',
  pale_scarf: 'S+',
  swan_glasses: 'S+',
  kitsune_ribbon: 'S+',
  zebra_cap: 'S+',
  valkyrie_helm: 'S+',
  dark_coat: 'S+',

  // S (Meta Staple)
  coral_crown: 'S',
  terror_jaw: 'S',
  holiday_cloak: 'S',
  santa_hat: 'S',
  cupids_coat: 'S',
  heart_shades: 'S',
  musketeer_hat: 'S',
  dragon_mantle: 'S',
  kitsune_mask: 'S',
  dojo_belt_black: 'S',
  hunter_cape_black: 'S',
  hunter_cape_green: 'S',
  hunter_cape_red: 'S',
  romantic_bouquet: 'S',
  warrior_helmet: 'S',
  oni_helmet: 'S',
  dino_hood: 'S',

  // A (Very Strong)
  bandanna_black: 'A',
  bandanna_green: 'A',
  bandanna_red: 'A',
  golden_sunhat: 'A',
  divine_cloak: 'A',
  sanguine_cloak: 'A',
  peppermint_helmet: 'A',
  celestial_helmet: 'A',
  cracked_egg_helmet: 'A',
  elf_hat: 'A',
  swordsman_hat: 'A',
  tomoe_ring: 'A',
  easter_bunny_cape: 'A',
  megalos_coat: 'A',
  wyvern_helmet: 'A',
  headband_black: 'A',
  holy_crown: 'A',
  red_ribbon: 'A',

  // B (Viable)
  frosty_helmet: 'B',
  coven_witch_hat: 'B',
  great_pumpkin_top_hat: 'B',
  pumpkin_mask: 'B',
  mummy_headdress: 'B',
  cupids_top_hat: 'B',
  trex_skull: 'B',
  choppa: 'B',
  top_hat: 'B',
  coat: 'B',
  cool_shades: 'B',
  black_spikey_coat: 'B',
  blue_spikey_coat: 'B',
  dojo_belt_red: 'B',
  dojo_belt_purple: 'B',
  feathered_visage: 'B',
  bear_ears: 'B',

  // C (Situational)
  usoaps_hat: 'C',
  black_cape: 'C',
  ds_coat: 'C',
  marine_cap: 'C',
  dojo_belt_blue: 'C',
  dojo_belt_green: 'C',
  dojo_belt_orange: 'C',
  headband_red: 'C',
  headband_purple: 'C',
  headband_blue: 'C',
  headband_green: 'C',

  // D (Underpowered)
  dojo_belt_yellow: 'D',
  dojo_belt_white: 'D',
  headband_orange: 'D',
  headband_yellow: 'D',
  headband_white: 'D',
  pink_coat: 'D',
};

const TIER_DEFINITIONS: Array<{ key: TierKey; label: string; bgHeader: string }> = [
  { key: 'S+', label: 'S+ (God Tier)', bgHeader: 'bg-red-600 text-white' },
  { key: 'S', label: 'S (Meta Staple)', bgHeader: 'bg-orange-500 text-slate-950' },
  { key: 'A', label: 'A (Very Strong)', bgHeader: 'bg-amber-400 text-slate-950' },
  { key: 'B', label: 'B (Viable)', bgHeader: 'bg-yellow-300 text-slate-950' },
  { key: 'C', label: 'C (Situational)', bgHeader: 'bg-emerald-500 text-slate-950' },
  { key: 'D', label: 'D (Underpowered)', bgHeader: 'bg-slate-700 text-white' },
];

export default function AccessoryTierListMaker() {
  const [activePreset, setActivePreset] = useState<'pvp' | 'grind' | 'custom'>('pvp');

  const buildInitialTiers = (mode: 'pvp' | 'grind'): TierRow[] => {
    const tiers: Record<TierKey, BloxAccessory[]> = {
      'S+': [],
      'S': [],
      'A': [],
      'B': [],
      'C': [],
      'D': [],
    };

    const map = mode === 'pvp' ? PVP_TIER_MAP : GRIND_TIER_MAP;
    BLOX_ACCESSORIES_DATABASE.forEach((acc) => {
      const tier = map[acc.id] || 'C';
      tiers[tier].push(acc);
    });

    return TIER_DEFINITIONS.map((def) => ({
      ...def,
      items: tiers[def.key],
    }));
  };

  const [tierRows, setTierRows] = useState<TierRow[]>(() => buildInitialTiers('pvp'));
  const [unassignedPool, setUnassignedPool] = useState<BloxAccessory[]>([]);
  const [selectedAccessory, setSelectedAccessory] = useState<BloxAccessory | null>(null);

  const totalCount = useMemo(() => BLOX_ACCESSORIES_DATABASE.length, []);

  const applyPreset = (mode: 'pvp' | 'grind') => {
    sounds.playClick();
    setActivePreset(mode);
    setTierRows(buildInitialTiers(mode));
    setUnassignedPool([]);
    setSelectedAccessory(null);
  };

  const setCustomBlank = () => {
    sounds.playClick();
    setActivePreset('custom');
    setTierRows(TIER_DEFINITIONS.map((def) => ({ ...def, items: [] })));
    setUnassignedPool([...BLOX_ACCESSORIES_DATABASE]);
    setSelectedAccessory(null);
  };

  const moveAccessoryToTier = (accessory: BloxAccessory, targetTierKey: TierKey) => {
    sounds.playClick();
    setTierRows((prev) =>
      prev.map((row) => ({
        ...row,
        items:
          row.key === targetTierKey
            ? [...row.items.filter((a) => a.id !== accessory.id), accessory]
            : row.items.filter((a) => a.id !== accessory.id),
      }))
    );
    setUnassignedPool((prev) => prev.filter((a) => a.id !== accessory.id));
    setSelectedAccessory(null);
  };

  const moveAccessoryToPool = (accessory: BloxAccessory) => {
    sounds.playClick();
    setTierRows((prev) =>
      prev.map((row) => ({
        ...row,
        items: row.items.filter((a) => a.id !== accessory.id),
      }))
    );
    if (!unassignedPool.some((a) => a.id === accessory.id)) {
      setUnassignedPool((prev) => [...prev, accessory]);
    }
    setSelectedAccessory(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-400" />
            Interactive Accessory Tier List
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Rank all {totalCount} accessories with official PvP or Grinding & Sea Event presets, or build your own custom tier list.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => applyPreset('pvp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
              activePreset === 'pvp'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            Official PvP Meta
          </button>
          <button
            onClick={() => applyPreset('grind')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
              activePreset === 'grind'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Grinding & Sea Events
          </button>
          <button
            onClick={setCustomBlank}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
              activePreset === 'custom'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Custom Blank List
          </button>
        </div>
      </div>

      {/* Selected Action Indicator */}
      {selectedAccessory && (
        <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {selectedAccessory.image && (
              <img
                src={selectedAccessory.image}
                alt={selectedAccessory.name}
                className="w-9 h-9 object-contain shrink-0 filter drop-shadow-[0_0_6px_rgba(34,211,238,0.45)]"
              />
            )}
            <div className="min-w-0">
              <div className="text-xs text-cyan-300">
                {selectedAccessory.rarity} · Sea {selectedAccessory.sea}
              </div>
              <div className="text-sm font-bold text-white">{selectedAccessory.name}</div>
              <div className="text-[11px] text-slate-300 truncate">
                {selectedAccessory.buffs.map((b) => `${b.stat}: ${b.value}`).join(' · ')}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap shrink-0">
            <span className="text-xs text-slate-400 mr-2">Assign to:</span>
            {(['S+', 'S', 'A', 'B', 'C', 'D'] as TierKey[]).map((key) => (
              <button
                key={key}
                onClick={() => moveAccessoryToTier(selectedAccessory, key)}
                className="px-2.5 py-1 text-xs font-bold rounded bg-slate-800 hover:bg-cyan-600 text-white transition-colors cursor-pointer"
              >
                {key}
              </button>
            ))}
            <button
              onClick={() => moveAccessoryToPool(selectedAccessory)}
              className="px-2.5 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600 text-slate-300 cursor-pointer ml-2"
            >
              To Pool
            </button>
          </div>
        </div>
      )}

      {/* Tier Board */}
      <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60 divide-y divide-slate-800/80">
        {tierRows.map((row) => (
          <div key={row.key} className="flex flex-col sm:flex-row items-stretch min-h-[72px]">
            {/* Header label box */}
            <div
              className={`w-full sm:w-36 shrink-0 p-3 flex flex-row sm:flex-col items-center justify-between sm:justify-center font-extrabold text-sm sm:text-base ${row.bgHeader}`}
            >
              <span>{row.key}</span>
              <span className="text-[10px] font-normal opacity-90 block sm:mt-0.5">
                {row.label.split('(')[1]?.replace(')', '') || ''}
              </span>
            </div>

            {/* Items row */}
            <div className="flex-1 p-2.5 flex items-center flex-wrap gap-2 bg-slate-950/40 min-h-[64px]">
              {row.items.length === 0 ? (
                <span className="text-xs text-slate-600 italic pl-2">
                  Click accessories below or assign here
                </span>
              ) : (
                row.items.map((acc) => {
                  const isSelected = selectedAccessory?.id === acc.id;
                  return (
                    <button
                      key={acc.id}
                      onClick={() => {
                        setSelectedAccessory(acc);
                        sounds.playClick();
                      }}
                      className={`group relative p-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-400'
                          : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 hover:border-amber-400/60'
                      }`}
                      title={`${acc.name} — ${acc.buffs.map((b) => b.value).join(', ')}`}
                    >
                      {acc.image ? (
                        <img
                          src={acc.image}
                          alt={acc.name}
                          className="w-6 h-6 object-contain shrink-0 group-hover:scale-110 transition-transform filter drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]"
                        />
                      ) : (
                        <span className="text-xs font-bold text-amber-400">★</span>
                      )}
                      <span className="text-xs font-bold text-slate-200">{acc.name}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Unassigned Pool (For Custom Creation) */}
      {unassignedPool.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              Unassigned Accessories Pool ({unassignedPool.length})
            </h4>
            <span className="text-xs text-slate-400">
              Click an accessory to assign to a tier above
            </span>
          </div>
          <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1">
            {unassignedPool.map((acc) => (
              <button
                key={acc.id}
                onClick={() => {
                  setSelectedAccessory(acc);
                  sounds.playClick();
                }}
                className={`p-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedAccessory?.id === acc.id
                    ? 'bg-cyan-600 text-white border-cyan-400'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                {acc.image && (
                  <img
                    src={acc.image}
                    alt={acc.name}
                    className="w-6 h-6 object-contain shrink-0"
                  />
                )}
                <span className="text-xs font-semibold">{acc.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
