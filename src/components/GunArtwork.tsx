import { BloxGun } from '../types/bloxfruits';

interface GunArtworkProps {
  gun: BloxGun;
  size?: 'sm' | 'md' | 'lg';
}

export default function GunArtwork({ gun, size = 'sm' }: GunArtworkProps) {
  const dims =
    size === 'lg'
      ? 'w-24 h-24 rounded-3xl p-4'
      : size === 'md'
        ? 'w-16 h-16 rounded-2xl p-3'
        : 'w-12 h-12 rounded-2xl p-2.5';

  const color = gun.accentColor || '#a855f7';

  const renderShape = () => {
    switch (gun.gunShape) {
      case 'guitar':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible">
            <line x1="16" y1="48" x2="52" y2="12" stroke={color} strokeWidth="4.5" strokeLinecap="round" />
            <polygon points="48,8 58,6 56,16 51,15" fill={color} opacity="0.9" />
            <path
              d="M10 38 C16 32, 26 32, 30 38 L26 42 L30 48 C24 56, 12 56, 8 48 Z"
              fill={color}
              fillOpacity="0.28"
              stroke={color}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <circle cx="19" cy="44" r="3" fill="#fff" opacity="0.9" />
          </svg>
        );

      case 'dragonstorm':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible">
            <path
              d="M10 28 H44 L54 22 L50 32 L54 40 L44 36 H22 L16 48 H8 L13 36 H10 Z"
              fill={color}
              fillOpacity="0.25"
              stroke={color}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <line x1="22" y1="24" x2="48" y2="24" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="22" y1="32" x2="46" y2="32" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'bow':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible">
            <path
              d="M20 10 C44 16, 44 48, 20 54"
              fill="none"
              stroke={color}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <line x1="20" y1="10" x2="20" y2="54" stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1="12" y1="32" x2="54" y2="32" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            <polygon points="56,32 47,27 49,32 47,37" fill={color} />
          </svg>
        );

      case 'slingshot':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible">
            <path
              d="M32 54 V34 M32 34 L16 14 M32 34 L48 14"
              fill="none"
              stroke="#d97706"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M16 14 Q32 24 48 14" fill="none" stroke={color} strokeWidth="2.5" />
            <circle cx="32" cy="19" r="5" fill={color} />
          </svg>
        );

      case 'bazooka':
      case 'cannon':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible">
            <rect
              x="8"
              y="22"
              width="42"
              height="16"
              rx="4"
              fill={color}
              fillOpacity="0.25"
              stroke={color}
              strokeWidth="2.5"
            />
            <polygon points="50,20 58,18 58,42 50,40" fill={color} opacity="0.8" />
            <line x1="20" y1="38" x2="16" y2="50" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
            <line x1="34" y1="38" x2="34" y2="48" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        );

      case 'rifle':
      case 'musket':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible">
            <path
              d="M6 34 L18 30 H56 V25 H22 L14 44 H6 Z"
              fill={color}
              fillOpacity="0.24"
              stroke={color}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <line x1="28" y1="21" x2="40" y2="21" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );

      case 'revolver':
      case 'pistol':
      default:
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible">
            <path
              d="M12 24 H50 V32 H30 L26 48 H15 L19 32 H12 Z"
              fill={color}
              fillOpacity="0.25"
              stroke={color}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <circle cx="28" cy="28" r="3" fill={color} />
          </svg>
        );
    }
  };

  return (
    <div
      className={`${dims} bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 relative overflow-hidden`}
      style={{
        boxShadow: `0 0 18px ${color}25`,
      }}
    >
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${color}, transparent 72%)`,
        }}
      />
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {gun.image ? (
          <img
            src={gun.image}
            alt={gun.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]"
          />
        ) : (
          renderShape()
        )}
      </div>
    </div>
  );
}
