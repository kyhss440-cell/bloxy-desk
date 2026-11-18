import { useState } from 'react';
import { BloxSword, SwordShape } from '../types/bloxfruits';

interface SwordArtworkProps {
  sword: BloxSword;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

function renderCustomBladeSvg(shape: SwordShape, bladeColor: string, auraColor: string, idSuffix: string) {
  const gradId = `blade-grad-${idSuffix}`;
  const glowId = `aura-glow-${idSuffix}`;

  return (
    <svg
      viewBox="0 0 120 120"
      className="w-full h-full p-1.5"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={auraColor} />
          <stop offset="55%" stopColor={bladeColor} />
          <stop offset="100%" stopColor="#f8fafc" />
        </linearGradient>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={bladeColor} stopOpacity="0.28" />
          <stop offset="100%" stopColor={auraColor} stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="60" cy="60" r="50" fill={`url(#${glowId})`} />

      {shape === 'dual' && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M24 96 L94 22 L98 28 L30 98 Z" fill={`url(#${gradId})`} stroke="#0f172a" strokeWidth="2" />
          <path d="M96 96 L26 22 L22 28 L90 98 Z" fill={bladeColor} stroke="#0f172a" strokeWidth="2" opacity="0.9" />
          <rect x="33" y="76" width="16" height="4" rx="2" transform="rotate(45 41 78)" fill="#fbbf24" />
          <rect x="71" y="76" width="16" height="4" rx="2" transform="rotate(-45 79 78)" fill="#fbbf24" />
        </g>
      )}

      {shape === 'triple' && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M58 14 L62 14 L63 94 L57 94 Z" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.5" />
          <path d="M24 94 L94 22 L98 27 L29 98 Z" fill={`url(#${gradId})`} stroke="#0f172a" strokeWidth="1.8" />
          <path d="M96 94 L26 22 L22 27 L91 98 Z" fill={bladeColor} stroke="#0f172a" strokeWidth="1.8" />
          <rect x="51" y="84" width="18" height="4" rx="2" fill="#f59e0b" />
          <rect x="33" y="76" width="15" height="4" rx="2" transform="rotate(45 40 78)" fill="#f59e0b" />
          <rect x="72" y="76" width="15" height="4" rx="2" transform="rotate(-45 79 78)" fill="#f59e0b" />
        </g>
      )}

      {shape === 'trident' && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <line x1="25" y1="95" x2="78" y2="42" stroke="#cbd5e1" strokeWidth="5" />
          <path d="M74 46 L98 22 L84 48 Z" fill={`url(#${gradId})`} stroke="#0f172a" strokeWidth="1.5" />
          <path d="M68 40 C60 28 70 18 82 18 L73 36 Z" fill={bladeColor} stroke="#0f172a" strokeWidth="1.5" />
          <path d="M80 52 C92 60 102 50 102 38 L84 47 Z" fill={bladeColor} stroke="#0f172a" strokeWidth="1.5" />
          <circle cx="75" cy="45" r="5" fill="#fbbf24" stroke="#0f172a" strokeWidth="1.5" />
        </g>
      )}

      {shape === 'mace' && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <line x1="24" y1="96" x2="72" y2="48" stroke="#78350f" strokeWidth="6" />
          <circle cx="80" cy="40" r="19" fill={`url(#${gradId})`} stroke="#0f172a" strokeWidth="2.2" />
          <polygon points="80,14 84,23 76,23" fill="#e2e8f0" />
          <polygon points="106,40 97,44 97,36" fill="#e2e8f0" />
          <polygon points="99,21 94,29 89,24" fill="#e2e8f0" />
          <polygon points="61,21 69,24 64,29" fill="#e2e8f0" />
          <polygon points="99,59 89,56 94,51" fill="#e2e8f0" />
        </g>
      )}

      {shape === 'saw' && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 98 L40 80" stroke="#475569" strokeWidth="7" />
          <path d="M36 84 L96 18 L100 32 L92 38 L94 46 L84 52 L85 60 L74 64 L74 72 L62 76 L58 84 L42 90 Z" fill={`url(#${gradId})`} stroke="#0f172a" strokeWidth="2" />
          <rect x="34" y="75" width="18" height="5" rx="2" transform="rotate(45 43 77)" fill="#94a3b8" />
        </g>
      )}

      {shape === 'hooks' && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M26 92 L58 60 C68 50 86 48 92 32 C95 24 84 18 76 26" fill="none" stroke={`url(#${gradId})`} strokeWidth="8" />
          <path d="M40 98 L72 66 C82 56 98 54 102 40" fill="none" stroke={bladeColor} strokeWidth="6" />
          <circle cx="52" cy="66" r="5" fill="#fbbf24" />
        </g>
      )}

      {shape === 'pipe' && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M24 96 L84 36 L94 24" fill="none" stroke="#94a3b8" strokeWidth="10" />
          <path d="M24 96 L84 36" fill="none" stroke={`url(#${gradId})`} strokeWidth="5" />
          <ellipse cx="94" cy="24" rx="7" ry="4" transform="rotate(45 94 24)" fill="#f97316" stroke="#fde047" strokeWidth="1.5" />
          <rect x="44" y="64" width="16" height="8" rx="3" transform="rotate(-45 52 68)" fill="#f59e0b" />
        </g>
      )}

      {shape === 'cane' && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <line x1="25" y1="95" x2="88" y2="32" stroke={`url(#${gradId})`} strokeWidth="5.5" />
          <path d="M88 32 C98 22 106 32 98 42" fill="none" stroke="#f8fafc" strokeWidth="5" />
          <circle cx="62" cy="58" r="5" fill={auraColor} opacity="0.8" />
          <line x1="34" y1="86" x2="96" y2="24" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 4" />
        </g>
      )}

      {shape === 'flail' && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="98" x2="62" y2="58" stroke="#64748b" strokeWidth="6" />
          <path d="M56 54 Q66 44 74 52" fill="none" stroke="#e2e8f0" strokeWidth="3" strokeDasharray="4 4" />
          <circle cx="88" cy="34" r="16" fill={`url(#${gradId})`} stroke="#0f172a" strokeWidth="2" />
          <circle cx="88" cy="34" r="6" fill={auraColor} opacity="0.65" />
        </g>
      )}

      {shape === 'gravity' && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <line x1="24" y1="96" x2="94" y2="26" stroke={`url(#${gradId})`} strokeWidth="7" />
          <circle cx="72" cy="48" r="18" fill="none" stroke="#a855f7" strokeWidth="2.5" strokeDasharray="6 4" />
          <circle cx="72" cy="48" r="9" fill="#c084fc" opacity="0.45" />
          <rect x="33" y="76" width="20" height="5" rx="2" transform="rotate(45 43 78)" fill="#e879f9" />
        </g>
      )}

      {shape === 'bisento' && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <line x1="20" y1="100" x2="70" y2="50" stroke="#92400e" strokeWidth="5.5" />
          <path d="M68 52 C80 36 86 20 102 16 C98 34 88 50 74 58 Z" fill={`url(#${gradId})`} stroke="#0f172a" strokeWidth="2" />
          <circle cx="69" cy="51" r="5" fill="#fbbf24" />
        </g>
      )}

      {shape === 'pole' && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <line x1="20" y1="100" x2="98" y2="22" stroke="#eab308" strokeWidth="6" />
          <circle cx="96" cy="24" r="9" fill="#38bdf8" stroke="#fde047" strokeWidth="2.5" />
          <path d="M44 76 L54 58 L62 66 L74 44" fill="none" stroke="#7dd3fc" strokeWidth="2.5" />
        </g>
      )}

      {shape === 'dagger' && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <line x1="30" y1="90" x2="48" y2="72" stroke="#1e293b" strokeWidth="6" />
          <path d="M46 74 L94 24 L54 66 Z" fill={`url(#${gradId})`} stroke="#0f172a" strokeWidth="2" />
          <rect x="40" y="65" width="22" height="5" rx="2" transform="rotate(45 51 67)" fill="#f8fafc" />
        </g>
      )}

      {shape === 'dragonheart' && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M24 96 L42 78" stroke="#450a0a" strokeWidth="7" />
          <path d="M40 80 L98 18 L92 36 L82 40 L76 54 L64 58 L50 82 Z" fill={`url(#${gradId})`} stroke="#0f172a" strokeWidth="2" />
          <path d="M35 66 Q48 80 62 78" fill="none" stroke="#f59e0b" strokeWidth="4" />
          <circle cx="48" cy="72" r="5" fill="#fbbf24" />
        </g>
      )}

      {shape === 'trophy' && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M40 24 H80 L74 58 C72 70 66 76 60 76 C54 76 48 70 46 58 Z" fill={`url(#${gradId})`} stroke="#0f172a" strokeWidth="2" />
          <path d="M40 30 H28 C26 44 32 52 44 52" fill="none" stroke="#fbbf24" strokeWidth="4" />
          <path d="M80 30 H92 C94 44 88 52 76 52" fill="none" stroke="#fbbf24" strokeWidth="4" />
          <rect x="55" y="76" width="10" height="14" fill="#d97706" />
          <rect x="40" y="90" width="40" height="10" rx="2" fill="#92400e" />
        </g>
      )}

      {shape === 'dogblade' && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M24 96 L42 78" stroke="#7c2d12" strokeWidth="7" />
          <path d="M40 80 L96 20 L100 32 L50 84 Z" fill={`url(#${gradId})`} stroke="#0f172a" strokeWidth="2" />
          <circle cx="44" cy="74" r="6" fill="#fef08a" stroke="#0f172a" strokeWidth="1.5" />
          <circle cx="52" cy="82" r="5" fill="#fef08a" stroke="#0f172a" strokeWidth="1.5" />
        </g>
      )}

      {(shape === 'katana' ||
        shape === 'cutlass' ||
        shape === 'longsword' ||
        shape === 'buddy' ||
        shape === 'canvander' ||
        shape === 'koko' ||
        shape === 'midnight' ||
        shape === 'rengoku' ||
        shape === 'saber' ||
        shape === 'tushita' ||
        shape === 'yama' ||
        shape === 'scythe' ||
        shape === 'anchor' ||
        shape === 'lantern' ||
        shape === 'darkblade') && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="98" x2="42" y2="78" stroke="#1e293b" strokeWidth="6" />
          <path
            d={
              shape === 'cutlass' || shape === 'saber'
                ? 'M40 80 Q76 56 98 20 Q84 48 48 84 Z'
                : 'M40 80 L98 20 L101 26 L46 84 Z'
            }
            fill={`url(#${gradId})`}
            stroke="#0f172a"
            strokeWidth="2"
          />
          <rect
            x="33"
            y="74"
            width="22"
            height="5"
            rx="2.5"
            transform="rotate(45 44 76)"
            fill={shape === 'yama' || shape === 'rengoku' ? '#f59e0b' : shape === 'tushita' ? '#fef08a' : '#cbd5e1'}
          />
          {shape === 'rengoku' && (
            <path d="M58 62 Q72 44 86 34" fill="none" stroke="#fb923c" strokeWidth="3" strokeDasharray="5 3" />
          )}
          {shape === 'tushita' && (
            <path d="M54 64 L88 30" fill="none" stroke="#6ee7b7" strokeWidth="2" />
          )}
          {shape === 'yama' && (
            <path d="M54 64 L88 30" fill="none" stroke="#f87171" strokeWidth="2.5" />
          )}
        </g>
      )}
    </svg>
  );
}

export default function SwordArtwork({ sword, size = 'md', className = '' }: SwordArtworkProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const sizeClass =
    size === 'sm'
      ? 'w-12 h-12 rounded-xl'
      : size === 'md'
        ? 'w-16 h-16 rounded-2xl'
        : size === 'lg'
          ? 'w-24 h-24 rounded-2xl'
          : 'w-44 h-44 sm:w-52 sm:h-52 rounded-3xl';

  return (
    <div
      className={`${sizeClass} bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 overflow-hidden relative ${className}`}
    >
      {sword.image && !imgFailed ? (
        <img
          src={sword.image}
          alt={sword.name}
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-contain p-1.5 filter drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]"
        />
      ) : (
        renderCustomBladeSvg(
          sword.weaponShape,
          sword.iconStyle.bladeColor,
          sword.iconStyle.auraColor,
          `${sword.id}-${size}`
        )
      )}
    </div>
  );
}
