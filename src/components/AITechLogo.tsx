import React from 'react';

interface AITechLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
  variant?: 'icon' | 'vertical' | 'horizontal';
  theme?: 'bronze' | 'light' | 'emerald' | 'white';
}

/**
 * Logo oficial vectorial de AITECH SOLUCIONES C.A.
 * Replicado fielmente del imagotipo corporativo:
 * - Hexágono exterior con líneas de circuito integrado
 * - Núcleo central de 3 nodos interconectados con simetría rotacional
 * - Pistas electrónicas con terminales circulares (vías de PCB)
 * - Tipografía corporativa "AITECH" / "SOLUCIONES C.A."
 */
export const AITechLogo: React.FC<AITechLogoProps> = ({
  className = '',
  size = 40,
  showText = false,
  variant = 'icon',
  theme = 'bronze',
}) => {
  // Gradients according to theme
  const getColors = () => {
    switch (theme) {
      case 'emerald':
        return {
          start: '#34d399',
          mid: '#10b981',
          end: '#059669',
          textMain: '#ecfdf5',
          textSub: '#6ee7b7',
          shadow: 'rgba(16, 185, 129, 0.25)',
        };
      case 'white':
        return {
          start: '#ffffff',
          mid: '#e2e8f0',
          end: '#cbd5e1',
          textMain: '#ffffff',
          textSub: '#94a3b8',
          shadow: 'rgba(255, 255, 255, 0.15)',
        };
      case 'light':
        return {
          start: '#64748b',
          mid: '#475569',
          end: '#334155',
          textMain: '#0f172a',
          textSub: '#475569',
          shadow: 'rgba(15, 23, 42, 0.1)',
        };
      case 'bronze':
      default:
        // Authentic bronze / warm metallic palette matching corporate image
        return {
          start: '#E2BA8A',
          mid: '#B68252',
          end: '#6D4424',
          textMain: '#E8C59C',
          textSub: '#C29B72',
          shadow: 'rgba(182, 130, 82, 0.25)',
        };
    }
  };

  const colors = getColors();
  const gradId = `aitechGrad_${theme}`;
  const glowId = `aitechGlow_${theme}`;

  const iconSvg = (
    <svg
      viewBox="0 0 100 115"
      width={typeof size === 'number' ? size : undefined}
      height={typeof size === 'number' ? Math.round(Number(size) * 1.15) : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-200"
      style={{
        width: typeof size === 'string' ? size : `${size}px`,
        height: typeof size === 'string' ? 'auto' : `${Math.round(Number(size) * 1.15)}px`,
      }}
    >
      <defs>
        <linearGradient id={gradId} x1="15%" y1="10%" x2="85%" y2="95%">
          <stop offset="0%" stopColor={colors.start} />
          <stop offset="45%" stopColor={colors.mid} />
          <stop offset="100%" stopColor={colors.end} />
        </linearGradient>
        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor={colors.shadow} />
        </filter>
      </defs>

      <g filter={`url(#${glowId})`}>
        {/* Outer Hexagon Border */}
        <polygon
          points="50,4 93.3,29 93.3,79 50,104 6.7,79 6.7,29"
          stroke={`url(#${gradId})`}
          strokeWidth="4.2"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Secondary inner contour guide */}
        <polygon
          points="50,9.5 88.5,31.7 88.5,76.3 50,98.5 11.5,76.3 11.5,31.7"
          stroke={`url(#${gradId})`}
          strokeWidth="1.2"
          strokeLinejoin="round"
          strokeOpacity="0.4"
          fill="none"
        />

        {/* ======================================================== */}
        {/* CENTRAL 3-NODE ROTATIONAL KNOT (CORE TRISKELION CIRCUIT) */}
        {/* ======================================================== */}
        {/* Central interlocking loops */}
        <g stroke={`url(#${gradId})`} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round">
          {/* Arm 1 (Top branch toward center) */}
          <path d="M50,33 L58,33 L67,48 L59,62 L43,62" />
          {/* Arm 2 (Bottom-right branch toward center) */}
          <path d="M63,55 L59,62 L43,62 L35,48 L43,34" />
          {/* Arm 3 (Bottom-left branch toward center) */}
          <path d="M37,55 L43,34 L58,34 L66,48 L58,62" />
        </g>

        {/* 3 Main Central Circular Nodes with inner core */}
        {/* Top Node */}
        <circle cx="50" cy="33" r="4.2" fill={`url(#${gradId})`} />
        <circle cx="50" cy="33" r="1.8" fill="#0f172a" />

        {/* Bottom Right Node */}
        <circle cx="61" cy="56" r="4.2" fill={`url(#${gradId})`} />
        <circle cx="61" cy="56" r="1.8" fill="#0f172a" />

        {/* Bottom Left Node */}
        <circle cx="39" cy="56" r="4.2" fill={`url(#${gradId})`} />
        <circle cx="39" cy="56" r="1.8" fill="#0f172a" />

        {/* ======================================================== */}
        {/* PCB CIRCUIT TRACKS & TERMINAL VIAS / PADS               */}
        {/* ======================================================== */}
        {/* Tracks - Top Left Quadrant */}
        <g stroke={`url(#${gradId})`} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22,34 L32,34 L36,41" />
          <path d="M19,45 L29,45 L33,39" />
          <path d="M26,24 L34,24 L42,38" />
          <path d="M38,18 L38,24 L44,30" />
          <path d="M18,58 L27,58 L32,50" />
        </g>
        {/* Terminals - Top Left */}
        <circle cx="21" cy="34" r="2.2" fill={`url(#${gradId})`} />
        <circle cx="18" cy="45" r="2.2" fill={`url(#${gradId})`} />
        <circle cx="25" cy="24" r="2.2" fill={`url(#${gradId})`} />
        <circle cx="38" cy="17" r="2.2" fill={`url(#${gradId})`} />
        <circle cx="17" cy="58" r="2.2" fill={`url(#${gradId})`} />

        {/* Tracks - Top Right Quadrant */}
        <g stroke={`url(#${gradId})`} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M78,34 L68,34 L64,41" />
          <path d="M81,45 L71,45 L67,39" />
          <path d="M74,24 L66,24 L58,38" />
          <path d="M62,18 L62,24 L56,30" />
          <path d="M82,58 L73,58 L68,50" />
        </g>
        {/* Terminals - Top Right */}
        <circle cx="79" cy="34" r="2.2" fill={`url(#${gradId})`} />
        <circle cx="82" cy="45" r="2.2" fill={`url(#${gradId})`} />
        <circle cx="75" cy="24" r="2.2" fill={`url(#${gradId})`} />
        <circle cx="62" cy="17" r="2.2" fill={`url(#${gradId})`} />
        <circle cx="83" cy="58" r="2.2" fill={`url(#${gradId})`} />

        {/* Tracks - Bottom Quadrant */}
        <g stroke={`url(#${gradId})`} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M46,65 L46,80 L50,86 L50,94" />
          <path d="M54,65 L54,80 L50,86" />
          <path d="M36,68 L36,78 L44,86" />
          <path d="M64,68 L64,78 L56,86" />
          <path d="M26,70 L34,78 L42,78" />
          <path d="M74,70 L66,78 L58,78" />
        </g>
        {/* Terminals - Bottom */}
        <circle cx="50" cy="95" r="2.2" fill={`url(#${gradId})`} />
        <circle cx="25" cy="69" r="2.2" fill={`url(#${gradId})`} />
        <circle cx="75" cy="69" r="2.2" fill={`url(#${gradId})`} />
        <circle cx="35" cy="80" r="2.2" fill={`url(#${gradId})`} />
        <circle cx="65" cy="80" r="2.2" fill={`url(#${gradId})`} />
      </g>
    </svg>
  );

  if (variant === 'icon' && !showText) {
    return <div className={`inline-flex items-center justify-center ${className}`}>{iconSvg}</div>;
  }

  if (variant === 'horizontal') {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        {iconSvg}
        <div className="flex flex-col text-left leading-tight select-none">
          <span
            className="font-extrabold tracking-widest text-sm font-sans"
            style={{ color: colors.textMain }}
          >
            AITECH
          </span>
          <span
            className="text-[9px] font-bold tracking-wider uppercase font-sans -mt-0.5"
            style={{ color: colors.textSub }}
          >
            Soluciones C.A.
          </span>
        </div>
      </div>
    );
  }

  // Vertical variant (as in original image: icon on top, text below)
  return (
    <div className={`inline-flex flex-col items-center text-center ${className}`}>
      {iconSvg}
      <div className="mt-1.5 flex flex-col items-center leading-none select-none">
        <span
          className="font-extrabold tracking-[0.2em] text-sm sm:text-base font-sans"
          style={{ color: colors.textMain }}
        >
          AITECH
        </span>
        <span
          className="text-[9px] sm:text-[10px] font-bold tracking-[0.15em] uppercase font-sans mt-0.5"
          style={{ color: colors.textSub }}
        >
          SOLUCIONES C.A.
        </span>
      </div>
    </div>
  );
};
