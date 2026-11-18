import { FightingStyle } from '../types/bloxfruits';

interface FightingStyleArtworkProps {
  style: FightingStyle;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const IMAGE_MAP: Partial<Record<string, string>> = {
  godhuman: '/assets/aistudio/image_6b805321.png',
  sanguine_art: '/assets/aistudio/image_7277108f.png',
  dragon_talon: '/assets/aistudio/image_63f33e1c.png',
  electric_claw: '/assets/aistudio/image_ca375680.png',
  sharkman_karate: '/assets/aistudio/image_fdd23bb2.png',
  death_step: '/assets/aistudio/image_54739877.png',
  superhuman: '/assets/aistudio/image_906fac8c.png',
  dragon_breath: '/assets/aistudio/image_6550ff29.png',
  water_kung_fu: '/assets/aistudio/image_80565fc0.png',
  electric: '/assets/aistudio/image_08850a00.png',
  dark_step: '/assets/aistudio/image_c6b59a8e.png',
  advanced_combat: '/assets/aistudio/image_5138f6ca.png',
  combat: '/assets/aistudio/image_845bb30c.png',
};

function getThemeColors(theme: FightingStyle['theme']) {
  switch (theme) {
    case 'crimson':
      return { primary: '#ef4444', secondary: '#f97316', glow: 'rgba(239,68,68,0.45)' };
    case 'purple':
      return { primary: '#a855f7', secondary: '#ec4899', glow: 'rgba(168,85,247,0.45)' };
    case 'electric':
    default:
      return { primary: '#38bdf8', secondary: '#3b82f6', glow: 'rgba(56,189,248,0.45)' };
  }
}

export function TrainerNpcPortrait({
  style,
  size = 'md',
}: {
  style: FightingStyle;
  size?: 'sm' | 'md' | 'lg';
}) {
  const colors = getThemeColors(style.theme);
  const dim =
    size === 'sm'
      ? 'w-11 h-11 rounded-xl'
      : size === 'lg'
        ? 'w-16 h-16 rounded-2xl'
        : 'w-14 h-14 rounded-2xl';
  const initials = style.npcName
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');

  return (
    <div
      className={`${dim} bg-[#060913] border border-slate-800 flex items-center justify-center shrink-0 relative overflow-hidden`}
      style={{ boxShadow: `0 0 18px -6px ${colors.glow}` }}
    >
      <svg viewBox="0 0 80 80" className="w-full h-full" aria-hidden="true">
        <defs>
          <radialGradient id={`npc-bg-${style.id}-${size}`} cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor={colors.primary} stopOpacity="0.35" />
            <stop offset="100%" stopColor="#03050b" stopOpacity="0.95" />
          </radialGradient>
        </defs>
        <rect width="80" height="80" fill={`url(#npc-bg-${style.id}-${size})`} />
        <circle cx="40" cy="30" r="14" fill="#0f172a" stroke={colors.primary} strokeWidth="2.5" />
        <path
          d="M16 74 C18 54 62 54 64 74"
          fill="#0f172a"
          stroke={colors.secondary}
          strokeWidth="2.5"
        />
        <text
          x="40"
          y="34"
          textAnchor="middle"
          fill="#f8fafc"
          fontSize="11"
          fontWeight="800"
          fontFamily="Outfit, sans-serif"
        >
          {initials}
        </text>
      </svg>
    </div>
  );
}

export default function FightingStyleArtwork({
  style,
  size = 'md',
  className = '',
}: FightingStyleArtworkProps) {
  const colors = getThemeColors(style.theme);
  const mappedImg = IMAGE_MAP[style.id];

  const sizeClass =
    size === 'sm'
      ? 'w-12 h-12 rounded-xl'
      : size === 'md'
        ? 'w-16 h-16 rounded-2xl'
        : size === 'lg'
          ? 'w-24 h-24 rounded-2xl'
          : 'w-44 h-44 sm:w-52 sm:h-52 rounded-3xl';

  if (mappedImg) {
    return (
      <div
        className={`${sizeClass} bg-white border-2 border-slate-900 flex items-center justify-center shrink-0 overflow-hidden relative ${className}`}
        style={{ boxShadow: `0 0 24px -6px ${colors.glow}` }}
      >
        <img
          src={mappedImg}
          alt={style.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} bg-white border-2 border-slate-900 flex items-center justify-center shrink-0 overflow-hidden relative ${className}`}
      style={{ boxShadow: `0 0 24px -6px ${colors.glow}` }}
    >
      <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
        {/* Clean white tile background matching Blox Fruits Melee icon sprites */}
        <rect width="120" height="120" fill="#ffffff" />

        {/* SANGUINE ART: Crimson blood splash + dark slashing claw hand */}
        {style.id === 'sanguine_art' && (
          <g strokeLinecap="round" strokeLinejoin="round">
            <polygon
              points="60,8 70,28 92,14 82,38 110,36 88,56 112,72 84,78 96,104 68,88 54,110 48,84 22,94 34,68 10,58 36,44 18,22 46,32"
              fill="#dc2626"
            />
            <polygon
              points="58,18 68,36 86,28 76,48 98,52 78,66 86,88 64,76 48,92 46,70 26,72 38,54 24,36 48,42"
              fill="#ef4444"
            />
            <circle cx="24" cy="18" r="3" fill="#dc2626" />
            <circle cx="98" cy="20" r="3.5" fill="#dc2626" />
            <circle cx="104" cy="90" r="3" fill="#dc2626" />
            <path
              d="M118,74 L78,64 L44,44 L18,26 L36,48 L12,48 L36,62 L18,76 L46,72 L70,84 L118,98 Z"
              fill="#09090b"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            <path d="M52,58 L70,66 M44,65 L62,72" stroke="#ffffff" strokeWidth="2.5" />
          </g>
        )}

        {/* DRAGON TALON: Fiery orange-red burst + 3-claw black dragon hand */}
        {style.id === 'dragon_talon' && (
          <g strokeLinecap="round" strokeLinejoin="round">
            <polygon
              points="64,8 74,30 98,16 86,40 112,44 88,62 108,82 80,82 86,106 62,88 46,108 44,82 18,86 34,62 12,44 38,38 28,14 54,28"
              fill="#f97316"
            />
            <polygon
              points="62,20 70,38 90,30 78,50 98,58 76,70 80,90 58,76 44,90 44,68 24,68 38,52 28,34 50,40"
              fill="#ef4444"
            />
            <path
              d="M6,68 L48,58 L62,40 L94,22 L76,48 L104,48 L76,62 L100,76 L68,74 L48,84 L6,88 Z"
              fill="#09090b"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            <path d="M44,66 L64,62 M48,74 L66,70" stroke="#ffffff" strokeWidth="2.2" />
          </g>
        )}

        {/* ELECTRIC CLAW: Jagged cyan/indigo lightning shockwaves + black claw slash */}
        {style.id === 'electric_claw' && (
          <g strokeLinecap="round" strokeLinejoin="round">
            <polygon
              points="58,6 68,30 96,12 82,40 112,38 86,58 110,80 80,78 90,108 62,86 44,108 44,80 16,86 34,60 10,42 38,38 26,12 52,30"
              fill="#0ea5e9"
            />
            <polygon
              points="58,20 66,38 88,26 76,48 98,52 76,66 86,90 60,76 46,92 46,70 24,72 38,54 26,34 50,40"
              fill="#38bdf8"
            />
            <path
              d="M114,32 L78,46 L48,38 L16,32 L40,50 L14,58 L42,64 L22,82 L54,74 L84,78 L114,58 Z"
              fill="#09090b"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            <polyline points="22,22 36,30 28,36" fill="none" stroke="#e0f2fe" strokeWidth="3" />
            <polyline points="94,88 82,96 90,104" fill="none" stroke="#e0f2fe" strokeWidth="3" />
          </g>
        )}

        {/* DEATH STEP: Intense crimson-yellow flame swirl + kicking leg silhouette */}
        {style.id === 'death_step' && (
          <g strokeLinecap="round" strokeLinejoin="round">
            <polygon
              points="60,8 72,28 96,16 86,40 110,46 86,62 106,84 78,82 82,106 58,86 42,106 42,80 16,84 32,60 12,42 38,36 28,14 52,28"
              fill="#dc2626"
            />
            <polygon
              points="60,22 68,38 88,30 78,50 96,58 76,70 82,88 60,76 46,88 46,68 26,68 38,52 28,34 50,40"
              fill="#facc15"
            />
            <path
              d="M14,26 L36,20 L54,54 L88,46 C98,44 104,54 96,62 L52,78 L34,74 L14,26 Z"
              fill="#09090b"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            <path d="M56,64 L82,56" stroke="#ffffff" strokeWidth="2.5" />
          </g>
        )}

        {/* DRAGON BREATH: Red-orange fire burst + bold black punch fist */}
        {style.id === 'dragon_breath' && (
          <g strokeLinecap="round" strokeLinejoin="round">
            <polygon
              points="64,10 74,30 98,20 88,44 112,50 88,66 106,88 78,84 80,108 58,88 42,106 42,80 18,84 34,60 14,42 40,36 32,14 54,28"
              fill="#ef4444"
            />
            <polygon
              points="64,22 72,38 90,32 80,52 98,60 76,72 80,90 58,76 46,88 46,68 28,68 40,52 32,34 52,40"
              fill="#fb923c"
            />
            <path
              d="M8,76 L44,58 L46,40 C46,32 56,28 66,30 L92,36 C98,38 100,48 94,54 L88,68 C84,76 74,78 64,76 L26,98 Z"
              fill="#09090b"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            <path d="M62,38 L60,54 M74,40 L71,56 M84,43 L80,58" stroke="#ffffff" strokeWidth="2.2" />
          </g>
        )}

        {/* ELECTRIC: Electric-sky jagged lightning aura + bold black fist */}
        {style.id === 'electric' && (
          <g strokeLinecap="round" strokeLinejoin="round">
            <polygon
              points="62,8 70,30 98,16 82,42 110,46 84,64 104,88 76,82 78,108 56,86 38,104 42,78 16,80 34,58 14,38 40,36 32,14 54,28"
              fill="#0284c7"
            />
            <polygon
              points="62,22 68,38 88,30 78,50 96,56 76,68 82,88 58,74 46,88 46,68 28,68 40,52 30,34 52,40"
              fill="#38bdf8"
            />
            <path
              d="M12,78 L46,58 L48,40 C48,32 58,28 68,30 L90,36 C96,38 98,48 92,54 L86,68 C82,74 72,76 62,74 L30,98 Z"
              fill="#09090b"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            <path d="M62,38 L60,54 M74,40 L71,56 M84,43 L80,58" stroke="#ffffff" strokeWidth="2.2" />
          </g>
        )}

        {/* DARK STEP: Amber-orange kick flames + crisp black kick leg */}
        {style.id === 'dark_step' && (
          <g strokeLinecap="round" strokeLinejoin="round">
            <polygon
              points="62,12 72,32 96,20 84,44 108,52 84,68 100,90 74,84 74,106 54,86 38,102 40,78 16,80 34,58 14,40 40,36 32,16 54,30"
              fill="#ea580c"
            />
            <polygon
              points="60,24 68,40 86,32 76,52 94,60 74,72 78,88 58,76 46,88 46,68 28,68 40,52 32,36 50,42"
              fill="#fbbf24"
            />
            <path
              d="M16,28 L38,22 L56,54 L88,48 C96,46 102,56 94,64 L52,78 L34,74 L16,28 Z"
              fill="#09090b"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
          </g>
        )}

        {/* ADVANCED COMBAT: Purple-violet shockwave rings + heavy black brawler fist */}
        {style.id === 'advanced_combat' && (
          <g strokeLinecap="round" strokeLinejoin="round">
            <polygon
              points="64,10 74,30 98,18 86,42 110,48 86,64 104,88 76,82 78,106 56,86 40,104 42,78 16,82 34,58 14,40 40,36 32,14 54,28"
              fill="#9333ea"
            />
            <polyline points="84,26 104,44 96,74" fill="none" stroke="#e9d5ff" strokeWidth="4" />
            <path
              d="M10,76 L46,56 L48,38 C48,30 58,26 68,28 L92,34 C98,36 100,46 94,54 L88,68 C84,76 74,78 62,76 L26,98 Z"
              fill="#09090b"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            <path d="M62,36 L60,52 M74,38 L71,54 M84,41 L80,56" stroke="#ffffff" strokeWidth="2.2" />
          </g>
        )}

        {/* COMBAT: Classic steel-blue impact burst + bold black starter fist */}
        {style.id === 'combat' && (
          <g strokeLinecap="round" strokeLinejoin="round">
            <polyline points="72,22 92,38 86,66" fill="none" stroke="#38bdf8" strokeWidth="5" />
            <polyline points="80,14 104,36 98,74" fill="none" stroke="#93c5fd" strokeWidth="4" />
            <path
              d="M10,78 L46,58 L48,40 C48,32 58,28 68,30 L90,36 C96,38 98,48 92,54 L86,68 C82,74 72,76 62,74 L28,98 Z"
              fill="#09090b"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            <path d="M62,38 L60,54 M74,40 L71,56 M84,43 L80,58" stroke="#ffffff" strokeWidth="2.2" />
          </g>
        )}

        {/* Signature Blox Fruits Melee Corner Badge ('M') matching reference sprites */}
        <path d="M0,78 A42,42 0 0,1 42,120 L0,120 Z" fill="#09090b" />
        <text
          x="15"
          y="110"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="20"
          fontWeight="900"
          fontStyle="italic"
          fontFamily="Outfit, sans-serif"
        >
          M
        </text>
      </svg>
    </div>
  );
}
