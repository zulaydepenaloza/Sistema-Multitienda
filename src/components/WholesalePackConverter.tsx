import React, { useState, useEffect } from 'react';
import { Package, Calculator, Check, Sparkles, ArrowRight, Percent, Layers } from 'lucide-react';
import { formatUSD, formatBs } from '../lib/currency';

export interface WholesaleConversionResult {
  tipoEmpaque: string;
  costoEmpaque: number;
  unidadesPorEmpaque: number;
  margenPct: number;
  costoUnitario: number;
  precioVenta: number;
  cantidadEmpaques: number;
  totalUnidades: number;
}

interface WholesalePackConverterProps {
  tasaCambio: number;
  initialMargenPct?: number;
  onApply: (res: WholesaleConversionResult) => void;
  className?: string;
  showStockFields?: boolean;
}

export const TIPOS_EMPAQUE_MAYORISTA = [
  'Bulto',
  'Caja',
  'Saco',
  'Fardo',
  'Display',
  'Paquete Mayor',
  'Balde',
  'Bidón',
  'Malla',
  'Ristra',
  'Otro',
];

export const WholesalePackConverter: React.FC<WholesalePackConverterProps> = ({
  tasaCambio,
  initialMargenPct = 15,
  onApply,
  className = '',
  showStockFields = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tipoEmpaque, setTipoEmpaque] = useState('Bulto');
  const [costoEmpaque, setCostoEmpaque] = useState<string>('19.50');
  const [unidadesPorEmpaque, setUnidadesPorEmpaque] = useState<string>('20');
  const [margenPct, setMargenPct] = useState<number>(initialMargenPct);
  const [cantidadEmpaques, setCantidadEmpaques] = useState<string>('1');

  const costoNum = parseFloat(costoEmpaque) || 0;
  const unidadesNum = parseFloat(unidadesPorEmpaque) || 0;
  const bultosNum = parseFloat(cantidadEmpaques) || 1;

  // Real-time calculated values
  const costoUnitario = unidadesNum > 0 ? +(costoNum / unidadesNum).toFixed(3) : 0;
  const precioVenta = costoUnitario > 0 ? +(costoUnitario * (1 + margenPct / 100)).toFixed(2) : 0;
  const gananciaUnitaria = +(precioVenta - costoUnitario).toFixed(3);
  const totalUnidades = +(bultosNum * (unidadesNum > 0 ? unidadesNum : 1)).toFixed(2);

  const handleApply = () => {
    if (costoNum <= 0 || unidadesNum <= 0) {
      alert('Por favor indica un costo de empaque y una cantidad de unidades válidas mayores a 0.');
      return;
    }
    onApply({
      tipoEmpaque,
      costoEmpaque: costoNum,
      unidadesPorEmpaque: unidadesNum,
      margenPct,
      costoUnitario,
      precioVenta,
      cantidadEmpaques: bultosNum,
      totalUnidades,
    });
    setIsOpen(false);
  };

  const MARGEN_PRESETS = [10, 15, 20, 25, 30, 35, 40];

  return (
    <div className={`border border-amber-500/30 rounded-2xl overflow-hidden bg-slate-950/70 transition-all ${className}`}>
      {/* Header / Toggle button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 flex items-center justify-between text-left hover:bg-slate-900 transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-300 flex items-center gap-2">
              <span>¿Viene por Bulto, Caja o Saco? (Conversor a Unidades)</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-200 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono">
                Ej: Bulto 20kg a $19.50
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Desglosa automáticamente el costo por kilo/unidad y fija el PVP con el margen deseado.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-amber-400">
            {isOpen ? 'Ocultar conversor ▲' : 'Abrir conversor ▼'}
          </span>
        </div>
      </button>

      {/* Expanded Converter Form */}
      {isOpen && (
        <div className="p-4 border-t border-amber-500/20 space-y-4 bg-slate-950/90 text-xs animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Tipo de Empaque */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Presentación:</span>
              </label>
              <select
                value={tipoEmpaque}
                onChange={(e) => setTipoEmpaque(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 focus:border-amber-400 focus:outline-none cursor-pointer"
              >
                {TIPOS_EMPAQUE_MAYORISTA.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Costo del Bulto / Caja */}
            <div>
              <label className="block text-amber-300 font-semibold mb-1 flex items-center gap-1.5">
                <span>Costo de 1 {tipoEmpaque} ($):</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-amber-400 font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={costoEmpaque}
                  onChange={(e) => setCostoEmpaque(e.target.value)}
                  placeholder="19.50"
                  className="w-full bg-slate-900 border border-amber-500/40 text-amber-300 font-mono font-bold rounded-xl pl-7 pr-3 py-2 focus:border-amber-400 focus:outline-none"
                />
              </div>
              {costoNum > 0 && (
                <span className="text-[10px] text-slate-400 font-mono block mt-1">
                  En Bs: {formatBs(costoNum, tasaCambio)}
                </span>
              )}
            </div>

            {/* 3. Unidades / Kg por empaque */}
            <div>
              <label className="block text-sky-300 font-semibold mb-1 flex items-center gap-1.5">
                <span>Trae (Unidades / Kilos):</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={unidadesPorEmpaque}
                onChange={(e) => setUnidadesPorEmpaque(e.target.value)}
                placeholder="20"
                className="w-full bg-slate-900 border border-sky-500/40 text-sky-300 font-mono font-bold rounded-xl px-3 py-2 focus:border-sky-400 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Ej: 20 kilos, 24 latas, 12 paquetes
              </span>
            </div>

            {/* 4. Cantidad de Bultos Comprados (opcional para stock) */}
            {showStockFields && (
              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                  <span>{tipoEmpaque}s a ingresar:</span>
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={cantidadEmpaques}
                  onChange={(e) => setCantidadEmpaques(e.target.value)}
                  placeholder="1"
                  className="w-full bg-slate-900 border border-slate-700 text-white font-mono rounded-xl px-3 py-2 focus:border-slate-500 focus:outline-none"
                />
                <span className="text-[10px] text-emerald-400 font-mono block mt-1">
                  = {totalUnidades} unidades de stock
                </span>
              </div>
            )}
          </div>

          {/* Margen de Ganancia Slider & Presets */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5 text-xs">
                <Percent className="w-3.5 h-3.5 text-purple-400" />
                <span>Margen de Ganancia Deseado:</span>
              </span>
              <span className="text-sm font-bold font-mono text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-lg border border-purple-500/30">
                {margenPct}%
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400 mr-1">Rápidos:</span>
              {MARGEN_PRESETS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMargenPct(m)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer ${
                    margenPct === m
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {m}%
                </button>
              ))}
              <input
                type="number"
                min="0"
                max="500"
                value={margenPct}
                onChange={(e) => setMargenPct(parseFloat(e.target.value) || 0)}
                className="w-16 bg-slate-950 border border-purple-500/40 text-purple-300 font-mono font-bold text-center rounded-md px-1 py-0.5 text-xs ml-auto"
              />
              <span className="text-slate-400 font-mono text-xs">%</span>
            </div>
          </div>

          {/* Results Comparison Card */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full sm:w-auto">
              {/* Costo Unitario */}
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Costo x Unidad / Kg</span>
                <div className="text-base font-bold font-mono text-amber-400">
                  {formatUSD(costoUnitario)}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {formatBs(costoUnitario, tasaCambio)}
                </div>
                <div className="text-[9px] text-slate-500 font-mono">
                  ({costoNum} ÷ {unidadesNum})
                </div>
              </div>

              {/* PVP Sugerido */}
              <div className="space-y-0.5">
                <span className="text-[10px] text-emerald-400 uppercase font-semibold block">Precio Venta (PVP)</span>
                <div className="text-base font-bold font-mono text-emerald-400">
                  {formatUSD(precioVenta)}
                </div>
                <div className="text-[10px] text-emerald-300/80 font-mono">
                  {formatBs(precioVenta, tasaCambio)}
                </div>
                <div className="text-[9px] text-emerald-400/80 font-mono">
                  (+{margenPct}% margen)
                </div>
              </div>

              {/* Ganancia por Unidad */}
              <div className="space-y-0.5 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-purple-300 uppercase font-semibold block">Ganancia Neta</span>
                <div className="text-base font-bold font-mono text-purple-300">
                  +{formatUSD(gananciaUnitaria)}
                </div>
                <div className="text-[10px] text-purple-400 font-mono">
                  {formatBs(gananciaUnitaria, tasaCambio)}
                </div>
                <div className="text-[9px] text-slate-500 font-mono">
                  x {totalUnidades} un. = +{formatUSD(gananciaUnitaria * totalUnidades)}
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <button
              type="button"
              onClick={handleApply}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer shrink-0 transition-transform active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Aplicar al Artículo</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
