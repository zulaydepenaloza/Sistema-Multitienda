import React from 'react';
import { AITechLogo } from './AITechLogo';
import { ShieldCheck, Sparkles, Cpu } from 'lucide-react';

interface AITechFooterProps {
  className?: string;
  variant?: 'standard' | 'compact' | 'pos' | 'store' | 'sidebar';
  showBadge?: boolean;
}

/**
 * Footer oficial corporativo de la empresa desarrolladora:
 * "Developed and designed by AITech Soluciones, C. A."
 * Incluye el isotipo/logotipo oficial y estética acorde a la plataforma.
 */
export const AITechFooter: React.FC<AITechFooterProps> = ({
  className = '',
  variant = 'standard',
  showBadge = true,
}) => {
  const currentYear = new Date().getFullYear();

  // POS Variant: Discreet, integrated into POS terminal status bar
  if (variant === 'pos') {
    return (
      <footer
        className={`bg-slate-950/90 border-t border-slate-800/80 px-4 py-2 flex items-center justify-between gap-3 text-[11px] text-slate-400 select-none ${className}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <AITechLogo size={20} variant="icon" theme="bronze" />
          <span className="truncate">
            <span className="text-slate-400">Developed and designed by </span>
            <strong className="text-amber-200/90 font-semibold tracking-wide">
              AITech Soluciones, C. A.
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-[10px] text-slate-500 font-mono">
          <span className="hidden md:inline flex items-center gap-1 text-emerald-400/90">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sistema Seguro v4.2</span>
          </span>
          <span className="hidden sm:inline">© {currentYear}</span>
        </div>
      </footer>
    );
  }

  // Sidebar Variant: Placed at the bottom of the navigation drawer
  if (variant === 'sidebar') {
    return (
      <div
        className={`px-3 py-3 border-t border-slate-800/70 bg-slate-950/60 rounded-xl transition-all ${className}`}
      >
        <div className="flex items-center gap-2.5">
          <AITechLogo size={24} variant="icon" theme="bronze" />
          <div className="flex flex-col min-w-0 leading-tight">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
              Desarrollado y Diseñado por
            </span>
            <span className="text-xs font-bold text-amber-200 tracking-wide truncate">
              AITech Soluciones, C. A.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Store Variant: For the public online store (TiendaOnlineView)
  if (variant === 'store') {
    return (
      <footer
        className={`border-t border-slate-800/80 bg-slate-950/95 text-slate-400 py-8 px-4 sm:px-6 transition-all mt-12 ${className}`}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          {/* Brand & Attribution */}
          <div className="flex items-center gap-3.5">
            <AITechLogo size={36} variant="icon" theme="bronze" />
            <div className="flex flex-col leading-snug">
              <span className="text-xs text-slate-400">
                Developed and designed by
              </span>
              <span className="text-sm font-extrabold text-amber-200 tracking-wide">
                AITech Soluciones, C. A.
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5">
                Plataforma de Comercio Electrónico & Punto de Venta
              </span>
            </div>
          </div>

          {/* Right badge & copyright */}
          <div className="flex flex-col items-center sm:items-end gap-1.5 text-xs text-slate-500">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>Tecnología Cloud & Offline Híbrida</span>
            </div>
            <p className="text-[11px] text-slate-500">
              © {currentYear} Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    );
  }

  // Compact Variant: Single line for popups/dialogs or compact views
  if (variant === 'compact') {
    return (
      <div
        className={`flex items-center justify-center gap-2 py-2 px-3 text-xs text-slate-400 ${className}`}
      >
        <AITechLogo size={18} variant="icon" theme="bronze" />
        <span className="text-[11px]">
          Developed and designed by{' '}
          <strong className="text-amber-200 font-semibold">
            AITech Soluciones, C. A.
          </strong>
        </span>
      </div>
    );
  }

  // Standard Variant: Full ERP & Admin views footer
  return (
    <footer
      className={`mt-10 border-t border-slate-800/80 bg-slate-950/70 backdrop-blur-sm px-4 sm:px-8 py-5 text-slate-400 transition-all ${className}`}
    >
      <div className="max-w-[1680px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Logo + Attribution Line */}
        <div className="flex items-center gap-3">
          <AITechLogo size={32} variant="icon" theme="bronze" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 leading-tight">
            <span className="text-xs text-slate-400">
              Developed and designed by
            </span>
            <span className="text-xs sm:text-sm font-bold text-amber-200 tracking-wide">
              AITech Soluciones, C. A.
            </span>
          </div>
        </div>

        {/* Center / Right: Meta info & security status */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-[11px] text-slate-500 font-mono">
          {showBadge && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Multi-Sucursal Enterprise POS</span>
            </div>
          )}
          <span className="hidden sm:inline text-slate-700">•</span>
          <span>© {currentYear} AITech Soluciones, C. A.</span>
          <span className="hidden sm:inline text-slate-700">•</span>
          <span className="text-slate-400 font-sans">Todos los derechos reservados</span>
        </div>
      </div>
    </footer>
  );
};
