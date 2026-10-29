import React, { useState } from 'react';
import { DollarSign, ArrowRight, CheckCircle2, TrendingUp, Calendar, ShieldCheck, Sparkles } from 'lucide-react';
import { EmpresaConfig } from '../types';
import { formatUSD, formatBs } from '../lib/currency';

interface DailyRateModalProps {
  isOpen: boolean;
  empresaConfig?: EmpresaConfig;
  currentRate?: number;
  onSaveRate: (newRate: number) => void;
  onClose?: () => void;
  isMandatory?: boolean;
}

export const DailyRateModal: React.FC<DailyRateModalProps> = ({
  isOpen,
  empresaConfig,
  currentRate,
  onSaveRate,
  onClose,
  isMandatory = false,
}) => {
  const initialRate = empresaConfig?.tasaCambio ?? currentRate ?? 36.50;
  const [rateInput, setRateInput] = useState<string>(initialRate.toString());
  const [error, setError] = useState<string | null>(null);

  // Sync rateInput if initialRate changes
  React.useEffect(() => {
    if (isOpen) {
      const activeRate = empresaConfig?.tasaCambio ?? currentRate ?? 36.50;
      setRateInput(activeRate.toString());
    }
  }, [isOpen, empresaConfig?.tasaCambio, currentRate]);

  if (!isOpen) return null;

  const numericRate = parseFloat(rateInput) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericRate <= 0 || isNaN(numericRate)) {
      setError('Por favor ingrese una tasa de cambio válida mayor a 0 (ejemplo: 36.50).');
      return;
    }
    setError(null);
    onSaveRate(numericRate);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 text-emerald-400 shadow-inner">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Inicio Diario • Multi-Moneda
              </span>
              <span className="text-slate-400 text-xs flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {new Date().toLocaleDateString('es-VE')}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Cotización del Día (Bs. / USD)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Todos los montos, inventarios y tickets se reflejarán simultáneamente en <strong>Dólares ($)</strong> y en <strong>Bolívares (Bs.)</strong>.
            </p>
          </div>
        </div>

        {/* Rate Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <label className="block text-xs font-bold text-slate-300">
              Tasa de Cambio Oficial / BCV (Bolívares por 1 USD):
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400 font-bold text-sm">
                Bs.
              </div>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                autoFocus
                value={rateInput}
                onChange={(e) => {
                  setRateInput(e.target.value);
                  setError(null);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-lg font-bold text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono"
                placeholder="Ejemplo: 36.50"
              />
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Esta tasa se aplicará en las 3 computadoras (Tienda 1, Tienda 2 y Gerencia).
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Quick Conversion Preview */}
          <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Vista Previa de Conversión:</span>
              <span className="text-emerald-400 font-mono">1 USD = {formatBs(1, numericRate)}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block">$5.00 USD</span>
                <span className="text-xs font-bold text-emerald-300 font-mono">{formatBs(5, numericRate)}</span>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block">$20.00 USD</span>
                <span className="text-xs font-bold text-emerald-300 font-mono">{formatBs(20, numericRate)}</span>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block">$100.00 USD</span>
                <span className="text-xs font-bold text-emerald-300 font-mono">{formatBs(100, numericRate)}</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {!isMandatory && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            )}

            <button
              type="submit"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirmar Tasa del Día</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
