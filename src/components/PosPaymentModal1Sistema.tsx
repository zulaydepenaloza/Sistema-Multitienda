import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  CreditCard, 
  Banknote, 
  Coins, 
  Smartphone, 
  Layers, 
  DollarSign, 
  Receipt,
  Delete,
  CornerDownLeft,
  RotateCcw
} from 'lucide-react';
import { EmpresaConfig, DetallePagoVenta } from '../types';
import { formatUSD, formatBs } from '../lib/currency';

interface PosPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalUsd: number;
  empresaConfig: EmpresaConfig;
  clienteNombre: string;
  clienteRif: string;
  onConfirmPayment: (detallePago: DetallePagoVenta) => void;
}

type MetodoPagoKey = 'tarjeta' | 'efectivo_usd' | 'efectivo_bs' | 'pago_movil' | 'tarjeta_credito' | 'zelle' | 'mixto';

interface PagoRow {
  key: MetodoPagoKey;
  label: string;
  tasa: number;
  montoMoneda: number; // Monto ingresado en su moneda nativa ($ o Bs)
  montoBsEquivalente: number;
  referencia?: string;
  banco?: string;
}

export const PosPaymentModal1Sistema: React.FC<PosPaymentModalProps> = ({
  isOpen,
  onClose,
  totalUsd,
  empresaConfig,
  clienteNombre,
  clienteRif,
  onConfirmPayment,
}) => {
  const tasa = empresaConfig.tasaCambio || 36.50;
  const totalBs = +(totalUsd * tasa).toFixed(2);

  // Discount state (displayed in yellow KPI card as shown in Image 2)
  const [descuentoUsd, setDescuentoUsd] = useState<number>(0);
  const totalNetoUsd = Math.max(0, +(totalUsd - descuentoUsd).toFixed(2));
  const totalNetoBs = +(totalNetoUsd * tasa).toFixed(2);

  // Active selected payment method row in table
  const [selectedMethod, setSelectedMethod] = useState<MetodoPagoKey>('tarjeta');

  // Input value in the numpad (in active currency: Bs or USD)
  const [numpadValue, setNumpadValue] = useState<string>('');
  const [referenciaInput, setReferenciaInput] = useState<string>('');
  const [bancoInput, setBancoInput] = useState<string>('0102 - Banco de Venezuela');

  // Multi-tender / Forma de pago breakdown table
  const [pagoRows, setPagoRows] = useState<Record<MetodoPagoKey, number>>({
    tarjeta: 0,
    efectivo_usd: 0,
    efectivo_bs: 0,
    pago_movil: 0,
    tarjeta_credito: 0,
    zelle: 0,
    mixto: 0,
  });

  // Calculate sum of payments converted to USD and Bs
  const totalPagadoUsd = +(
    (pagoRows.tarjeta / tasa) +
    pagoRows.efectivo_usd +
    (pagoRows.efectivo_bs / tasa) +
    (pagoRows.pago_movil / tasa) +
    (pagoRows.tarjeta_credito / tasa) +
    pagoRows.zelle
  ).toFixed(2);

  const totalPagadoBs = +(totalPagadoUsd * tasa).toFixed(2);
  const diferenciaBs = +(totalPagadoBs - totalNetoBs).toFixed(2);
  const diferenciaUsd = +(totalPagadoUsd - totalNetoUsd).toFixed(2);
  const esCubierto = totalPagadoBs >= totalNetoBs - 0.05;

  // Initialize with full amount in active tender when opened
  useEffect(() => {
    if (isOpen) {
      setDescuentoUsd(0);
      setSelectedMethod('tarjeta');
      setNumpadValue(totalNetoBs.toFixed(2));
      setReferenciaInput('');
      setPagoRows({
        tarjeta: totalNetoBs,
        efectivo_usd: 0,
        efectivo_bs: 0,
        pago_movil: 0,
        tarjeta_credito: 0,
        zelle: 0,
        mixto: 0,
      });
    }
  }, [isOpen, totalNetoBs]);

  // Handle selecting a payment row
  const handleSelectRow = (key: MetodoPagoKey) => {
    setSelectedMethod(key);
    // If USD-based
    if (key === 'efectivo_usd' || key === 'zelle') {
      const remainingUsd = Math.max(0, +(totalNetoUsd - (totalPagadoUsd - (pagoRows[key] || 0))).toFixed(2));
      setNumpadValue(remainingUsd > 0 ? remainingUsd.toFixed(2) : (pagoRows[key] || 0).toFixed(2));
    } else {
      const remainingBs = Math.max(0, +(totalNetoBs - (totalPagadoBs - (pagoRows[key] || 0))).toFixed(2));
      setNumpadValue(remainingBs > 0 ? remainingBs.toFixed(2) : (pagoRows[key] || 0).toFixed(2));
    }
  };

  // Numpad key press
  const handleNumpadPress = (char: string) => {
    if (char === 'C') {
      setNumpadValue('0');
      updateActiveRowAmount(0);
      return;
    }
    if (char === 'BACK') {
      const newVal = numpadValue.slice(0, -1) || '0';
      setNumpadValue(newVal);
      updateActiveRowAmount(parseFloat(newVal) || 0);
      return;
    }
    if (char === '.' && numpadValue.includes('.')) return;

    let nextVal: string;
    if (numpadValue === '0' || numpadValue === '') {
      nextVal = char === '.' ? '0.' : char;
    } else {
      nextVal = numpadValue + char;
    }
    setNumpadValue(nextVal);
    updateActiveRowAmount(parseFloat(nextVal) || 0);
  };

  const updateActiveRowAmount = (val: number) => {
    setPagoRows((prev) => ({
      ...prev,
      [selectedMethod]: val,
    }));
  };

  // Quick bills
  const handleSetQuickBill = (amountUsd: number) => {
    if (selectedMethod === 'efectivo_usd' || selectedMethod === 'zelle') {
      setNumpadValue(amountUsd.toFixed(2));
      updateActiveRowAmount(amountUsd);
    } else {
      const valBs = +(amountUsd * tasa).toFixed(2);
      setNumpadValue(valBs.toFixed(2));
      updateActiveRowAmount(valBs);
    }
  };

  const handleSetExact = () => {
    if (selectedMethod === 'efectivo_usd' || selectedMethod === 'zelle') {
      const remainingUsd = Math.max(0, +(totalNetoUsd - (totalPagadoUsd - (pagoRows[selectedMethod] || 0))).toFixed(2));
      setNumpadValue(remainingUsd.toFixed(2));
      updateActiveRowAmount(remainingUsd);
    } else {
      const remainingBs = Math.max(0, +(totalNetoBs - (totalPagadoBs - (pagoRows[selectedMethod] || 0))).toFixed(2));
      setNumpadValue(remainingBs.toFixed(2));
      updateActiveRowAmount(remainingBs);
    }
  };

  // Keyboard shortcut listener (ESC to close, F8/Enter to submit)
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'F8' || (e.key === 'Enter' && e.ctrlKey)) {
        e.preventDefault();
        handleFinalConfirm();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, esCubierto, pagoRows, totalNetoUsd]);

  // Final Confirmation
  const handleFinalConfirm = () => {
    if (!esCubierto) {
      alert(`El monto ingresado es insuficiente. Faltan ${formatBs(Math.abs(diferenciaBs), 1)} (${formatUSD(Math.abs(diferenciaUsd))})`);
      return;
    }

    if ((selectedMethod === 'pago_movil' || pagoRows.pago_movil > 0) && !referenciaInput.trim()) {
      alert('Por favor indica el número de referencia del Pago Móvil o Transferencia.');
      return;
    }

    // Determine primary or mixed
    const activeMethods = (Object.entries(pagoRows) as [MetodoPagoKey, number][]).filter(([_, val]) => val > 0);
    const isMultiple = activeMethods.length > 1;

    let primaryMetodo: DetallePagoVenta['metodo'] = 'tarjeta';
    if (!isMultiple) {
      if (pagoRows.pago_movil > 0) primaryMetodo = 'pago_movil';
      else if (pagoRows.efectivo_usd > 0) primaryMetodo = 'efectivo_usd';
      else if (pagoRows.efectivo_bs > 0) primaryMetodo = 'efectivo_bs';
      else primaryMetodo = 'tarjeta';
    } else {
      primaryMetodo = 'mixto';
    }

    const detalle: DetallePagoVenta = {
      metodo: primaryMetodo,
      monto_usd: totalNetoUsd,
      monto_bs: totalNetoBs,
      referencia_pago_movil: referenciaInput.trim() || undefined,
      pago_movil_monto_bs: pagoRows.pago_movil > 0 ? pagoRows.pago_movil : undefined,
      efectivo_usd_recibido: pagoRows.efectivo_usd > 0 ? pagoRows.efectivo_usd : undefined,
      efectivo_bs_recibido: pagoRows.efectivo_bs > 0 ? pagoRows.efectivo_bs : undefined,
      tarjeta_monto_bs: pagoRows.tarjeta > 0 ? pagoRows.tarjeta : undefined,
      tarjeta_tipo: selectedMethod === 'tarjeta_credito' ? 'credito' : 'debito',
      tarjeta_banco: bancoInput,
      tarjeta_referencia: referenciaInput.trim() || undefined,
      vuelto_bs: diferenciaBs > 0 ? diferenciaBs : 0,
      vuelto_usd: diferenciaUsd > 0 ? diferenciaUsd : 0,
    };

    onConfirmPayment(detalle);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-sm animate-fade-in font-sans select-none">
      <div className="bg-slate-900 border-2 border-slate-700/80 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col text-slate-100">
        
        {/* Modal Window Header */}
        <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
              <span>Pago / Totalizar Factura</span>
              <span className="text-xs text-slate-400 font-sans font-normal">
                [Cliente: <strong className="text-emerald-300">{clienteNombre}</strong> ({clienteRif})]
              </span>
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Cerrar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top 3 KPI Summary Cards (Exactly like 1Sistema in Image 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-950/60 border-b border-slate-800">
          {/* Card 1: Green Total $ & Total Bs */}
          <div className="bg-gradient-to-br from-emerald-900/60 to-emerald-950 border border-emerald-500/50 rounded-xl p-3 text-center shadow-inner">
            <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wide">
              Total $ <span className="font-mono text-white text-xs">{formatUSD(totalNetoUsd)}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight mt-0.5">
              {formatBs(totalNetoBs, 1)}
            </div>
          </div>

          {/* Card 2: Yellow/Amber Descuento */}
          <div className="bg-gradient-to-br from-amber-950/60 to-slate-950 border border-amber-500/50 rounded-xl p-3 text-center shadow-inner flex flex-col justify-center">
            <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wide">
              Descuento ($)
            </div>
            <div className="flex items-center justify-center gap-2 mt-0.5">
              <input
                type="number"
                step="0.5"
                min="0"
                max={totalUsd}
                value={descuentoUsd || ''}
                placeholder="0.00"
                onChange={(e) => setDescuentoUsd(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-24 bg-slate-900 border border-amber-500/40 text-amber-300 text-xl font-black font-mono text-center rounded-lg py-0.5 focus:outline-none focus:border-amber-400"
              />
              <span className="text-xs font-mono text-amber-400/80">USD</span>
            </div>
          </div>

          {/* Card 3: Red/Crimson or Highlight Total Pago */}
          <div className={`rounded-xl p-3 text-center shadow-inner border transition-all ${
            esCubierto 
              ? 'bg-gradient-to-br from-teal-950/80 to-slate-950 border-teal-500/60' 
              : 'bg-gradient-to-br from-rose-950/80 to-slate-950 border-rose-500/60'
          }`}>
            <div className={`text-[11px] font-bold uppercase tracking-wide ${esCubierto ? 'text-teal-300' : 'text-rose-300'}`}>
              Total Pago (Monto a Pagar)
            </div>
            <div className={`text-2xl sm:text-3xl font-black font-mono tracking-tight mt-0.5 ${esCubierto ? 'text-teal-300' : 'text-rose-400'}`}>
              {formatBs(totalNetoBs, 1)}
            </div>
          </div>
        </div>

        {/* Middle Body: Left Side (Formas de Pago Table) & Right Side (Numpad + Quick Bills) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 flex-1">
          
          {/* Left Column (col-span-7): Table of Payment Methods */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-3">
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/90 text-slate-300 uppercase text-[10px] font-bold tracking-wider border-b border-slate-700 font-mono">
                    <th className="py-2 px-3">Forma de pago</th>
                    <th className="py-2 px-3 text-center">Tasa</th>
                    <th className="py-2 px-3 text-right">Su Pago</th>
                    <th className="py-2 px-3 text-right">Monto a Pagar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 font-mono">
                  {/* 1. Tarjeta de Débito (Punto POS) */}
                  <tr
                    onClick={() => handleSelectRow('tarjeta')}
                    className={`cursor-pointer transition-colors ${
                      selectedMethod === 'tarjeta'
                        ? 'bg-blue-600/30 text-white font-bold border-l-4 border-blue-500'
                        : 'hover:bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <td className="py-2 px-3 flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                      <span>Tarjeta de Débito</span>
                    </td>
                    <td className="py-2 px-3 text-center text-slate-400">1.00</td>
                    <td className="py-2 px-3 text-right font-bold text-blue-300">
                      {pagoRows.tarjeta > 0 ? formatBs(pagoRows.tarjeta, 1) : '0.00'}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-400">
                      {pagoRows.tarjeta > 0 ? formatUSD(pagoRows.tarjeta / tasa) : '0.00'}
                    </td>
                  </tr>

                  {/* 2. Efectivo USD */}
                  <tr
                    onClick={() => handleSelectRow('efectivo_usd')}
                    className={`cursor-pointer transition-colors ${
                      selectedMethod === 'efectivo_usd'
                        ? 'bg-emerald-600/30 text-white font-bold border-l-4 border-emerald-500'
                        : 'hover:bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <td className="py-2 px-3 flex items-center gap-2">
                      <Banknote className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Efectivo ($ USD)</span>
                    </td>
                    <td className="py-2 px-3 text-center text-emerald-400">{tasa.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right font-bold text-emerald-300">
                      {pagoRows.efectivo_usd > 0 ? formatUSD(pagoRows.efectivo_usd) : '0.00'}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-400">
                      {pagoRows.efectivo_usd > 0 ? formatBs(pagoRows.efectivo_usd * tasa, 1) : '0.00'}
                    </td>
                  </tr>

                  {/* 3. Efectivo Bs */}
                  <tr
                    onClick={() => handleSelectRow('efectivo_bs')}
                    className={`cursor-pointer transition-colors ${
                      selectedMethod === 'efectivo_bs'
                        ? 'bg-amber-600/30 text-white font-bold border-l-4 border-amber-500'
                        : 'hover:bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <td className="py-2 px-3 flex items-center gap-2">
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      <span>Efectivo (Bs)</span>
                    </td>
                    <td className="py-2 px-3 text-center text-slate-400">1.00</td>
                    <td className="py-2 px-3 text-right font-bold text-amber-300">
                      {pagoRows.efectivo_bs > 0 ? formatBs(pagoRows.efectivo_bs, 1) : '0.00'}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-400">
                      {pagoRows.efectivo_bs > 0 ? formatUSD(pagoRows.efectivo_bs / tasa) : '0.00'}
                    </td>
                  </tr>

                  {/* 4. Pago Móvil / Transferencia */}
                  <tr
                    onClick={() => handleSelectRow('pago_movil')}
                    className={`cursor-pointer transition-colors ${
                      selectedMethod === 'pago_movil'
                        ? 'bg-cyan-600/30 text-white font-bold border-l-4 border-cyan-500'
                        : 'hover:bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <td className="py-2 px-3 flex items-center gap-2">
                      <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Pago Móvil / Transf.</span>
                    </td>
                    <td className="py-2 px-3 text-center text-slate-400">1.00</td>
                    <td className="py-2 px-3 text-right font-bold text-cyan-300">
                      {pagoRows.pago_movil > 0 ? formatBs(pagoRows.pago_movil, 1) : '0.00'}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-400">
                      {pagoRows.pago_movil > 0 ? formatUSD(pagoRows.pago_movil / tasa) : '0.00'}
                    </td>
                  </tr>

                  {/* 5. Zelle */}
                  <tr
                    onClick={() => handleSelectRow('zelle')}
                    className={`cursor-pointer transition-colors ${
                      selectedMethod === 'zelle'
                        ? 'bg-purple-600/30 text-white font-bold border-l-4 border-purple-500'
                        : 'hover:bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <td className="py-2 px-3 flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-purple-400" />
                      <span>Zelle (USD)</span>
                    </td>
                    <td className="py-2 px-3 text-center text-purple-400">{tasa.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right font-bold text-purple-300">
                      {pagoRows.zelle > 0 ? formatUSD(pagoRows.zelle) : '0.00'}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-400">
                      {pagoRows.zelle > 0 ? formatBs(pagoRows.zelle * tasa, 1) : '0.00'}
                    </td>
                  </tr>

                  {/* 6. Tarjeta de Crédito / Internacional */}
                  <tr
                    onClick={() => handleSelectRow('tarjeta_credito')}
                    className={`cursor-pointer transition-colors ${
                      selectedMethod === 'tarjeta_credito'
                        ? 'bg-indigo-600/30 text-white font-bold border-l-4 border-indigo-500'
                        : 'hover:bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <td className="py-2 px-3 flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Tarjeta de Crédito</span>
                    </td>
                    <td className="py-2 px-3 text-center text-slate-400">1.00</td>
                    <td className="py-2 px-3 text-right font-bold text-indigo-300">
                      {pagoRows.tarjeta_credito > 0 ? formatBs(pagoRows.tarjeta_credito, 1) : '0.00'}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-400">
                      {pagoRows.tarjeta_credito > 0 ? formatUSD(pagoRows.tarjeta_credito / tasa) : '0.00'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Reference & Bank Input (if Pago Móvil, Zelle, or POS card) */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Nº Referencia / Aprobación:
                  </label>
                  <input
                    type="text"
                    value={referenciaInput}
                    onChange={(e) => setReferenciaInput(e.target.value)}
                    placeholder="Ej: 489201..."
                    className="w-full bg-slate-900 border border-slate-700 text-white font-mono text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Banco / Terminal:
                  </label>
                  <select
                    value={bancoInput}
                    onChange={(e) => setBancoInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white text-xs px-2 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500"
                  >
                    <option value="0102 - Banco de Venezuela">0102 - Banco de Venezuela</option>
                    <option value="0134 - Banesco">0134 - Banesco</option>
                    <option value="0105 - Mercantil">0105 - Mercantil</option>
                    <option value="0108 - Provincial">0108 - Provincial</option>
                    <option value="0172 - Bancamiga">0172 - Bancamiga</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bottom Difference & Vuelto Indicators */}
            <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block font-sans uppercase">Su Pago Total:</span>
                <span className="text-sm sm:text-base font-bold text-white">
                  Bs. {totalPagadoBs.toFixed(2)}
                </span>
                <span className="text-[11px] text-slate-400 block font-normal">
                  ({formatUSD(totalPagadoUsd)})
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-sans uppercase">
                  {diferenciaBs >= 0 ? 'Cambio / Vuelto (Bs):' : 'Faltante por Pagar:'}
                </span>
                <span className={`text-base sm:text-lg font-black ${
                  diferenciaBs >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {diferenciaBs >= 0 ? `+Bs. ${diferenciaBs.toFixed(2)}` : `-Bs. ${Math.abs(diferenciaBs).toFixed(2)}`}
                </span>
                <span className="text-[11px] text-slate-400 block font-normal">
                  ({formatUSD(Math.abs(diferenciaUsd))})
                </span>
              </div>
            </div>
          </div>

          {/* Right Column (col-span-5): Virtual Numpad & Quick Input */}
          <div className="md:col-span-5 bg-slate-950 rounded-xl border border-slate-800 p-3.5 flex flex-col justify-between space-y-3">
            
            {/* Input Display Box */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold mb-1">
                <span className="uppercase">
                  Monto {selectedMethod === 'efectivo_usd' || selectedMethod === 'zelle' ? '($ USD)' : '(Bs.)'}:
                </span>
                <span className="text-emerald-400 font-mono">
                  {selectedMethod.toUpperCase().replace('_', ' ')}
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={numpadValue || '0'}
                  className="w-full bg-slate-900 border-2 border-emerald-500/60 text-right text-2xl font-black font-mono text-emerald-400 px-3 py-2 rounded-xl focus:outline-none shadow-inner"
                />
              </div>
            </div>

            {/* Quick Preset Buttons (Exacto, $5, $10, $20, $50, $100) */}
            <div className="grid grid-cols-3 gap-1.5 text-xs font-mono font-bold">
              <button
                type="button"
                onClick={handleSetExact}
                className="py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg cursor-pointer transition-colors"
              >
                Exacto
              </button>
              <button
                type="button"
                onClick={() => handleSetQuickBill(10)}
                className="py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer transition-colors"
              >
                $10
              </button>
              <button
                type="button"
                onClick={() => handleSetQuickBill(20)}
                className="py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer transition-colors"
              >
                $20
              </button>
              <button
                type="button"
                onClick={() => handleSetQuickBill(50)}
                className="py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer transition-colors"
              >
                $50
              </button>
              <button
                type="button"
                onClick={() => handleSetQuickBill(100)}
                className="py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer transition-colors"
              >
                $100
              </button>
              <button
                type="button"
                onClick={() => handleNumpadPress('C')}
                className="py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-500/30 rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpiar</span>
              </button>
            </div>

            {/* Touch Numeric Keypad (Like 1Sistema Image 2) */}
            <div className="grid grid-cols-3 gap-2 font-mono font-bold text-lg">
              <button
                type="button"
                onClick={() => handleNumpadPress('1')}
                className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all active:scale-95 shadow-sm"
              >
                1
              </button>
              <button
                type="button"
                onClick={() => handleNumpadPress('2')}
                className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all active:scale-95 shadow-sm"
              >
                2
              </button>
              <button
                type="button"
                onClick={() => handleNumpadPress('3')}
                className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all active:scale-95 shadow-sm"
              >
                3
              </button>

              <button
                type="button"
                onClick={() => handleNumpadPress('4')}
                className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all active:scale-95 shadow-sm"
              >
                4
              </button>
              <button
                type="button"
                onClick={() => handleNumpadPress('5')}
                className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all active:scale-95 shadow-sm"
              >
                5
              </button>
              <button
                type="button"
                onClick={() => handleNumpadPress('6')}
                className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all active:scale-95 shadow-sm"
              >
                6
              </button>

              <button
                type="button"
                onClick={() => handleNumpadPress('7')}
                className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all active:scale-95 shadow-sm"
              >
                7
              </button>
              <button
                type="button"
                onClick={() => handleNumpadPress('8')}
                className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all active:scale-95 shadow-sm"
              >
                8
              </button>
              <button
                type="button"
                onClick={() => handleNumpadPress('9')}
                className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all active:scale-95 shadow-sm"
              >
                9
              </button>

              <button
                type="button"
                onClick={() => handleNumpadPress('0')}
                className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all active:scale-95 shadow-sm"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => handleNumpadPress('00')}
                className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all active:scale-95 shadow-sm"
              >
                00
              </button>
              <button
                type="button"
                onClick={() => handleNumpadPress('.')}
                className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all active:scale-95 shadow-sm"
              >
                .
              </button>
            </div>

            {/* Big Action Button: Process & Print Invoice */}
            <button
              type="button"
              onClick={handleFinalConfirm}
              disabled={!esCubierto}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                esCubierto
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-950/60'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              <Check className="w-5 h-5 stroke-[2.5]" />
              <span>Confirmar e Imprimir [F8]</span>
            </button>
          </div>
        </div>

        {/* Modal Footer Hotkeys Hint */}
        <div className="bg-slate-950/90 px-5 py-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-4">
            <span><strong>[F8 / Enter]</strong> Procesar Cobro</span>
            <span><strong>[Esc]</strong> Cancelar y volver al ticket</span>
          </div>
          <div className="font-mono text-emerald-400">
            Tasa BCV: 1$ = {tasa.toFixed(2)} Bs.
          </div>
        </div>

      </div>
    </div>
  );
};
