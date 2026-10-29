import React from 'react';
import { X, Play, Trash2, Clock, ShoppingCart, User } from 'lucide-react';
import { Producto, EmpresaConfig } from '../types';
import { formatUSD, formatBs } from '../lib/currency';

export interface ParkedTicket {
  id: string;
  hora: string;
  cliente: { id: number | null; nombre: string; rif: string };
  items: { producto: Producto; cantidad: number; stockDisponible: number }[];
  totalUsd: number;
}

interface PosTicketHoldModalProps {
  isOpen: boolean;
  onClose: () => void;
  parkedTickets: ParkedTicket[];
  empresaConfig: EmpresaConfig;
  onRestoreTicket: (ticket: ParkedTicket) => void;
  onDeleteTicket: (ticketId: string) => void;
}

export const PosTicketHoldModal: React.FC<PosTicketHoldModalProps> = ({
  isOpen,
  onClose,
  parkedTickets,
  empresaConfig,
  onRestoreTicket,
  onDeleteTicket,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col text-slate-100">
        
        {/* Header */}
        <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                [F7] Tickets en Espera / Cuentas Pospuestas
              </h2>
              <p className="text-xs text-slate-400">
                Recupera tickets pausados para continuar su cobro
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Held Tickets */}
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {parkedTickets.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs space-y-2">
              <ShoppingCart className="w-8 h-8 mx-auto text-slate-600" />
              <p>No hay ningún ticket en espera actualmente.</p>
              <p className="text-[11px] text-slate-600">
                Usa el botón <strong>[F7 Espera]</strong> en la pantalla principal para pausar una venta.
              </p>
            </div>
          ) : (
            parkedTickets.map((t, idx) => (
              <div
                key={t.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono border border-amber-500/30">
                      Ticket #{idx + 1} • {t.hora}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 truncate">
                      <User className="w-3 h-3 text-slate-500" />
                      <strong className="text-slate-200">{t.cliente.nombre}</strong> ({t.cliente.rif})
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">
                    {t.items.length} artículos: {t.items.map((it) => `${it.cantidad}x ${it.producto.nombre}`).join(', ')}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-black text-white font-mono">
                    {formatUSD(t.totalUsd)}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-mono">
                    {formatBs(t.totalUsd, empresaConfig.tasaCambio)}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onRestoreTicket(t);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer shadow"
                    title="Retomar este ticket en la caja"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Retomar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteTicket(t.id)}
                    className="p-1.5 text-rose-400 hover:text-white hover:bg-rose-950/60 rounded-lg cursor-pointer"
                    title="Descartar ticket"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-5 py-2.5 border-t border-slate-800 text-xs text-slate-400 flex justify-between">
          <span>{parkedTickets.length} ticket(s) en espera</span>
          <span>Presiona [Esc] para salir</span>
        </div>

      </div>
    </div>
  );
};
