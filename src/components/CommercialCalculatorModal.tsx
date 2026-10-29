import React, { useState, useEffect, useCallback } from 'react';
import { Calculator, X, Copy, Check, ArrowRightLeft, Delete } from 'lucide-react';
import { EmpresaConfig } from '../types';

interface CommercialCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  empresaConfig: EmpresaConfig;
}

export const CommercialCalculatorModal: React.FC<CommercialCalculatorModalProps> = ({
  isOpen,
  onClose,
  empresaConfig,
}) => {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [equation, setEquation] = useState<string>('');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [currentOperator, setCurrentOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
  const [currencyMode, setCurrencyMode] = useState<'USD' | 'BS'>('USD');
  const [copied, setCopied] = useState<boolean>(false);

  const tasa = empresaConfig.tasaCambio > 0 ? empresaConfig.tasaCambio : 1;

  // Format Venezuelan Bs. (thousands dot, decimals comma)
  const formatBs = (val: number) => {
    return val.toLocaleString('es-VE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Format USD (thousands comma, decimals dot)
  const formatUSD = (val: number) => {
    return val.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const currentNumericValue = parseFloat(displayValue.replace(/,/g, '')) || 0;

  // Calculate equivalent in secondary currency
  const equivalentValue =
    currencyMode === 'USD'
      ? currentNumericValue * tasa
      : currentNumericValue / tasa;

  // Clear all
  const handleClearAll = () => {
    setDisplayValue('0');
    setEquation('');
    setPreviousValue(null);
    setCurrentOperator(null);
    setWaitingForOperand(false);
  };

  // Clear current entry (CE)
  const handleClearEntry = () => {
    setDisplayValue('0');
  };

  // Backspace
  const handleBackspace = () => {
    if (waitingForOperand) return;
    if (displayValue.length > 1) {
      setDisplayValue(displayValue.slice(0, -1));
    } else {
      setDisplayValue('0');
    }
  };

  // Digit input
  const handleInputDigit = useCallback((digit: string) => {
    setDisplayValue((prev) => {
      if (waitingForOperand) {
        setWaitingForOperand(false);
        return digit;
      }
      return prev === '0' ? digit : prev + digit;
    });
  }, [waitingForOperand]);

  // Decimal dot
  const handleInputDecimal = useCallback(() => {
    setDisplayValue((prev) => {
      if (waitingForOperand) {
        setWaitingForOperand(false);
        return '0.';
      }
      if (!prev.includes('.')) {
        return prev + '.';
      }
      return prev;
    });
  }, [waitingForOperand]);

  // Toggle +/-
  const handleToggleSign = () => {
    const val = parseFloat(displayValue);
    if (!isNaN(val)) {
      setDisplayValue(String(val * -1));
    }
  };

  // Perform basic calculation
  const calculateResult = (prev: number, current: number, op: string): number => {
    switch (op) {
      case '+':
        return prev + current;
      case '-':
        return prev - current;
      case '×':
      case '*':
        return prev * current;
      case '÷':
      case '/':
        return current === 0 ? 0 : prev / current;
      default:
        return current;
    }
  };

  // Operator selection (+, -, ×, ÷)
  const handleOperator = (nextOp: string) => {
    const inputValue = parseFloat(displayValue);

    if (previousValue === null) {
      setPreviousValue(inputValue);
      setEquation(`${inputValue} ${nextOp}`);
    } else if (currentOperator && !waitingForOperand) {
      const result = calculateResult(previousValue, inputValue, currentOperator);
      setPreviousValue(result);
      setDisplayValue(String(result));
      setEquation(`${result} ${nextOp}`);
    } else {
      setEquation(`${previousValue} ${nextOp}`);
    }

    setWaitingForOperand(true);
    setCurrentOperator(nextOp);
  };

  // Equal
  const handleEquals = () => {
    const inputValue = parseFloat(displayValue);

    if (currentOperator && previousValue !== null) {
      const result = calculateResult(previousValue, inputValue, currentOperator);
      setEquation(`${previousValue} ${currentOperator} ${inputValue} =`);
      setDisplayValue(String(result));
      setPreviousValue(null);
      setCurrentOperator(null);
      setWaitingForOperand(true);
    }
  };

  // Quick Tax Calculations (+16% IVA)
  const handleAddIva = () => {
    const current = parseFloat(displayValue) || 0;
    const withIva = current * 1.16;
    setEquation(`${current} + 16% IVA =`);
    setDisplayValue(withIva.toFixed(2));
    setWaitingForOperand(true);
  };

  // Quick Tax Calculations (-16% IVA extract base)
  const handleRemoveIva = () => {
    const current = parseFloat(displayValue) || 0;
    const baseWithoutIva = current / 1.16;
    setEquation(`${current} - 16% IVA (Base) =`);
    setDisplayValue(baseWithoutIva.toFixed(2));
    setWaitingForOperand(true);
  };

  // Percentage %
  const handlePercentage = () => {
    const current = parseFloat(displayValue) || 0;
    if (previousValue !== null) {
      const percentValue = (previousValue * current) / 100;
      setDisplayValue(String(percentValue));
    } else {
      setDisplayValue(String(current / 100));
    }
    setWaitingForOperand(true);
  };

  // Toggle active currency
  const handleToggleCurrency = () => {
    setCurrencyMode((prev) => (prev === 'USD' ? 'BS' : 'USD'));
  };

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      const formatted =
        currencyMode === 'USD'
          ? `$ ${formatUSD(currentNumericValue)} (≈ ${formatBs(equivalentValue)} Bs.)`
          : `${formatBs(currentNumericValue)} Bs. (≈ $ ${formatUSD(equivalentValue)})`;
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Keyboard navigation & Shortcuts (including F9 to toggle)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleInputDigit(e.key);
      } else if (e.key === '.' || e.key === ',') {
        e.preventDefault();
        handleInputDecimal();
      } else if (e.key === '+') {
        e.preventDefault();
        handleOperator('+');
      } else if (e.key === '-') {
        e.preventDefault();
        handleOperator('-');
      } else if (e.key === '*' || e.key === 'x') {
        e.preventDefault();
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleClearAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleInputDigit, handleInputDecimal, currentOperator, previousValue, displayValue, waitingForOperand]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 animate-fade-in select-none">
      <div className="bg-[#0b1120] border border-purple-500/30 rounded-[32px] w-full max-w-[390px] shadow-2xl overflow-hidden relative flex flex-col">
        {/* Header matching Image 1 */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/25">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-extrabold text-white tracking-wide">
                  Calculadora Comercial
                </h3>
                <span className="bg-purple-900/60 border border-purple-500/40 text-purple-300 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md">
                  F9
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Multimoneda • Tasa: <strong className="text-amber-300 font-mono">{formatBs(tasa)} Bs.</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-slate-700/50 cursor-pointer"
            title="Cerrar (Esc o F9)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Display Area */}
        <div className="px-5 py-4 bg-[#070d18] border-b border-slate-800/60 flex flex-col justify-end min-h-[120px]">
          {/* Active Equation */}
          <div className="text-right text-xs font-mono text-slate-500 h-5 overflow-hidden text-ellipsis">
            {equation}
          </div>

          {/* Main Amount */}
          <div className="flex items-baseline justify-end gap-1.5 mt-1 overflow-x-auto no-scrollbar">
            <span className="text-purple-400 font-extrabold text-xl font-mono">
              {currencyMode === 'USD' ? '$' : 'Bs.'}
            </span>
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight text-right">
              {currencyMode === 'USD'
                ? currentNumericValue.toLocaleString('en-US', { maximumFractionDigits: 4 })
                : currentNumericValue.toLocaleString('es-VE', { maximumFractionDigits: 4 })}
            </span>
          </div>

          {/* Secondary Equivalent & Copy Tool */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/60">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-purple-300 hover:text-purple-200 transition-colors font-medium cursor-pointer py-0.5 px-1.5 rounded hover:bg-purple-900/30"
              title="Copiar valor"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>

            <div className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
              <span className="text-slate-500 text-[10px]">≈</span>
              <span>
                {currencyMode === 'USD'
                  ? `${formatBs(equivalentValue)} Bs.`
                  : `$ ${formatUSD(equivalentValue)}`}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Tax Helpers & Currency Toggle Row */}
        <div className="grid grid-cols-4 gap-2 p-3 pb-1 bg-[#0b1120]">
          <button
            type="button"
            onClick={handleAddIva}
            className="py-2 px-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm text-center"
            title="Agregar 16% de IVA"
          >
            +16% IVA
          </button>

          <button
            type="button"
            onClick={handleRemoveIva}
            className="py-2 px-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm text-center"
            title="Quitar 16% de IVA (Base Imponible)"
          >
            -16% IVA
          </button>

          <button
            type="button"
            onClick={handlePercentage}
            className="py-2 px-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm text-center"
            title="Porcentaje"
          >
            %
          </button>

          <button
            type="button"
            onClick={handleToggleCurrency}
            className="py-2 px-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer shadow-md shadow-amber-500/20 text-center"
            title="Alternar cálculo en Dólares / Bolívares"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 shrink-0" />
            <span>{currencyMode === 'USD' ? 'A Bs.' : 'A $'}</span>
          </button>
        </div>

        {/* Main Keypad Grid (5 rows x 4 columns) matching Image 1 */}
        <div className="p-3 pt-2 grid grid-cols-4 gap-2.5 bg-[#0b1120]">
          {/* Row 1: C, CE, Backspace, Divide */}
          <button
            type="button"
            onClick={handleClearAll}
            className="h-14 rounded-2xl bg-gradient-to-b from-rose-500 to-rose-700 hover:from-rose-400 hover:to-rose-600 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-rose-900/40 active:scale-95 transition-all cursor-pointer"
          >
            C
          </button>

          <button
            type="button"
            onClick={handleClearEntry}
            className="h-14 rounded-2xl bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700/60 font-bold text-sm flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer"
          >
            CE
          </button>

          <button
            type="button"
            onClick={handleBackspace}
            className="h-14 rounded-2xl bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700/60 font-bold flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer"
            title="Borrar último dígito"
          >
            <Delete className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => handleOperator('÷')}
            className="h-14 rounded-2xl bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
          >
            ÷
          </button>

          {/* Row 2: 7, 8, 9, Multiply */}
          <button
            type="button"
            onClick={() => handleInputDigit('7')}
            className="h-14 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-extrabold text-xl flex items-center justify-center border border-slate-750 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            7
          </button>

          <button
            type="button"
            onClick={() => handleInputDigit('8')}
            className="h-14 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-extrabold text-xl flex items-center justify-center border border-slate-750 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            8
          </button>

          <button
            type="button"
            onClick={() => handleInputDigit('9')}
            className="h-14 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-extrabold text-xl flex items-center justify-center border border-slate-750 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            9
          </button>

          <button
            type="button"
            onClick={() => handleOperator('×')}
            className="h-14 rounded-2xl bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
          >
            ×
          </button>

          {/* Row 3: 4, 5, 6, Subtract */}
          <button
            type="button"
            onClick={() => handleInputDigit('4')}
            className="h-14 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-extrabold text-xl flex items-center justify-center border border-slate-750 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            4
          </button>

          <button
            type="button"
            onClick={() => handleInputDigit('5')}
            className="h-14 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-extrabold text-xl flex items-center justify-center border border-slate-750 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            5
          </button>

          <button
            type="button"
            onClick={() => handleInputDigit('6')}
            className="h-14 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-extrabold text-xl flex items-center justify-center border border-slate-750 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            6
          </button>

          <button
            type="button"
            onClick={() => handleOperator('-')}
            className="h-14 rounded-2xl bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
          >
            −
          </button>

          {/* Row 4: 1, 2, 3, Add */}
          <button
            type="button"
            onClick={() => handleInputDigit('1')}
            className="h-14 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-extrabold text-xl flex items-center justify-center border border-slate-750 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            1
          </button>

          <button
            type="button"
            onClick={() => handleInputDigit('2')}
            className="h-14 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-extrabold text-xl flex items-center justify-center border border-slate-750 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            2
          </button>

          <button
            type="button"
            onClick={() => handleInputDigit('3')}
            className="h-14 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-extrabold text-xl flex items-center justify-center border border-slate-750 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            3
          </button>

          <button
            type="button"
            onClick={() => handleOperator('+')}
            className="h-14 rounded-2xl bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
          >
            +
          </button>

          {/* Row 5: ±, 0, ., Equals */}
          <button
            type="button"
            onClick={handleToggleSign}
            className="h-14 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-extrabold text-xl flex items-center justify-center border border-slate-750 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            ±
          </button>

          <button
            type="button"
            onClick={() => handleInputDigit('0')}
            className="h-14 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-extrabold text-xl flex items-center justify-center border border-slate-750 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            0
          </button>

          <button
            type="button"
            onClick={handleInputDecimal}
            className="h-14 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-extrabold text-xl flex items-center justify-center border border-slate-750 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            .
          </button>

          <button
            type="button"
            onClick={handleEquals}
            className="h-14 rounded-2xl bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 active:scale-95 transition-all cursor-pointer"
          >
            =
          </button>
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>
            Usa el teclado numérico o presiona <strong className="text-purple-400 font-mono">F9</strong>
          </span>
          <span className="font-semibold text-slate-400">OmniPOS Tools</span>
        </div>
      </div>
    </div>
  );
};
