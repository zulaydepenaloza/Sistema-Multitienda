import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  DollarSign,
  Calendar,
  User,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowDownLeft,
  Receipt,
  FileCheck,
  Printer,
} from 'lucide-react';
import { CuentaPorCobrar, Cliente, EmpresaConfig, Usuario } from '../types';
import { formatUSD, formatBs, formatDual } from '../lib/currency';

interface CxcManagerProps {
  cxcList: CuentaPorCobrar[];
  clientes: Cliente[];
  empresaConfig: EmpresaConfig;
  currentUser: Usuario | null;
  onRegistrarAbono: (cxcId: number, monto: number, metodoPago: string, referencia?: string) => void;
  onNuevaCuentaCobrar?: (cxc: Omit<CuentaPorCobrar, 'id' | 'abonos'>) => void;
}

export const CxcManager: React.FC<CxcManagerProps> = ({
  cxcList,
  clientes,
  empresaConfig,
  currentUser,
  onRegistrarAbono,
  onNuevaCuentaCobrar,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'pendiente' | 'parcial' | 'pagada'>('todos');
  
  // Selected CxC for adding a payment (abono)
  const [selectedCxc, setSelectedCxc] = useState<CuentaPorCobrar | null>(null);
  const [montoAbono, setMontoAbono] = useState<number>(0);
  const [metodoPago, setMetodoPago] = useState<string>('Pago Móvil');
  const [referenciaAbono, setReferenciaAbono] = useState<string>('');

  // Manual new CxC modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [newClienteId, setNewClienteId] = useState<number>(clientes[0]?.id || 1);
  const [newConcepto, setNewConcepto] = useState<string>('');
  const [newMonto, setNewMonto] = useState<number>(50);
  const [newDiasCredito, setNewDiasCredito] = useState<number>(15);

  const handleOpenAbonar = (item: CuentaPorCobrar) => {
    setSelectedCxc(item);
    setMontoAbono(item.saldoRestante);
    setReferenciaAbono('');
    setMetodoPago('Pago Móvil');
  };

  const handleSubmitAbono = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCxc) return;

    if (montoAbono <= 0 || montoAbono > selectedCxc.saldoRestante + 0.01) {
      alert(`El monto debe ser mayor a 0 y no puede exceder el saldo restante ($${selectedCxc.saldoRestante.toFixed(2)}).`);
      return;
    }

    onRegistrarAbono(selectedCxc.id, montoAbono, metodoPago, referenciaAbono);
    setSelectedCxc(null);
  };

  const handleCreateNewCxc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onNuevaCuentaCobrar) return;
    const cliente = clientes.find((c) => c.id === newClienteId);
    if (!cliente) return;

    const fechaEmision = new Date().toISOString();
    const fechaVenc = new Date(Date.now() + newDiasCredito * 24 * 3600 * 1000).toISOString();

    onNuevaCuentaCobrar({
      clienteId: cliente.id,
      clienteNombre: cliente.nombre,
      concepto: newConcepto.trim() || 'Crédito Directo Autorizado',
      fechaEmision,
      fechaVencimiento: fechaVenc,
      montoTotal: newMonto,
      saldoRestante: newMonto,
      estado: 'pendiente',
    });

    setShowNewModal(false);
    setNewConcepto('');
  };

  const filteredList = cxcList.filter((item) => {
    const matchesSearch =
      item.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.concepto.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filtroEstado === 'todos' || item.estado === filtroEstado;
    return matchesSearch && matchesStatus;
  });

  const totalPorCobrar = cxcList.reduce((acc, c) => acc + (c.estado !== 'pagada' ? c.saldoRestante : 0), 0);
  const totalCobrado = cxcList.reduce((acc, c) => {
    const totalAbonado = c.abonos.reduce((aAcc, a) => aAcc + a.monto, 0);
    return acc + totalAbonado;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-400" /> Cuentas por Cobrar (CxC) - Clientes
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Control de cobranzas, créditos otorgados en ventas, abonos parciales en USD y Bolívares.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewModal(true)}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Cuenta por Cobrar</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block font-medium">Saldo Pendiente de Cobro</span>
          <div className="text-xl font-bold text-amber-400 font-mono mt-1">{formatUSD(totalPorCobrar)}</div>
          <span className="text-xs text-slate-400 font-mono block mt-0.5">
            {formatBs(totalPorCobrar, empresaConfig.tasaCambio)}
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block font-medium">Total Cobrado (Recaudación)</span>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1">{formatUSD(totalCobrado)}</div>
          <span className="text-xs text-slate-400 font-mono block mt-0.5">
            {formatBs(totalCobrado, empresaConfig.tasaCambio)}
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block font-medium">Cuentas Activas</span>
          <div className="text-xl font-bold text-white font-mono mt-1">
            {cxcList.filter((c) => c.estado !== 'pagada').length} pendientes
          </div>
          <span className="text-xs text-slate-500 block mt-0.5">
            {cxcList.filter((c) => c.estado === 'pagada').length} saldadas
          </span>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por cliente o concepto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white text-xs pl-9 pr-3 py-2 rounded-xl focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['todos', 'pendiente', 'parcial', 'pagada'] as const).map((est) => (
              <button
                key={est}
                type="button"
                onClick={() => setFiltroEstado(est)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  filtroEstado === est
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {est}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/50">
                <th className="py-3 px-3">ID / Concepto</th>
                <th className="py-3 px-3">Cliente</th>
                <th className="py-3 px-3">Fechas (Emisión / Vence)</th>
                <th className="py-3 px-3 text-right">Monto Total</th>
                <th className="py-3 px-3 text-right">Saldo Restante</th>
                <th className="py-3 px-3 text-center">Estado</th>
                <th className="py-3 px-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredList.map((item) => {
                const isOverdue =
                  new Date(item.fechaVencimiento).getTime() < Date.now() && item.estado !== 'pagada';

                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 text-slate-200 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white font-mono">#{item.id}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[200px]">{item.concepto}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-200">{item.clienteNombre}</td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                      <div>Emisión: {new Date(item.fechaEmision).toLocaleDateString('es-VE')}</div>
                      <div className={isOverdue ? 'text-rose-400 font-bold' : 'text-slate-500'}>
                        Vence: {new Date(item.fechaVencimiento).toLocaleDateString('es-VE')} {isOverdue && '(VENCIDA)'}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-300">
                      ${item.montoTotal.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold">
                      <div className={item.saldoRestante > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                        ${item.saldoRestante.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {formatBs(item.saldoRestante, empresaConfig.tasaCambio)}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          item.estado === 'pagada'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : item.estado === 'parcial'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {item.estado.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {item.estado !== 'pagada' ? (
                        <button
                          type="button"
                          onClick={() => handleOpenAbonar(item)}
                          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 mx-auto cursor-pointer shadow"
                        >
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                          <span>Abonar</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-400 font-bold flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Saldada
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Registrar Abono */}
      {selectedCxc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl space-y-4">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                Registrar Abono a Cuenta #{selectedCxc.id}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedCxc(null)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitAbono} className="p-5 space-y-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                <div className="text-slate-400">
                  Cliente: <span className="font-bold text-white">{selectedCxc.clienteNombre}</span>
                </div>
                <div className="text-slate-400">
                  Saldo Actual: <span className="font-bold text-amber-400 font-mono">${selectedCxc.saldoRestante.toFixed(2)}</span> ({formatBs(selectedCxc.saldoRestante, empresaConfig.tasaCambio)})
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Monto del Abono ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  min={0.01}
                  max={selectedCxc.saldoRestante}
                  value={montoAbono}
                  onChange={(e) => setMontoAbono(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-emerald-500 text-emerald-400 font-mono text-sm font-bold px-3 py-2 rounded-xl focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Equivalente a pagar: <strong className="text-emerald-300 font-mono">{formatBs(montoAbono, empresaConfig.tasaCambio)}</strong>
                </span>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Método de Pago</label>
                <select
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Pago Móvil">Pago Móvil (Bs.)</option>
                  <option value="Efectivo USD">Efectivo ($ USD)</option>
                  <option value="Efectivo Bs">Efectivo (Bolívares)</option>
                  <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                  <option value="Zelle">Zelle / Dólar Digital</option>
                  <option value="Punto de Venta / Débito">Punto de Venta / Débito</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Número de Referencia / Comprobante</label>
                <input
                  type="text"
                  placeholder="Ej: PM-481920 o REF-8812"
                  value={referenciaAbono}
                  onChange={(e) => setReferenciaAbono(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedCxc(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Procesar Abono</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Nueva CxC Manual */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl space-y-4">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                Nueva Cuenta por Cobrar (Crédito Manual)
              </h3>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewCxc} className="p-5 space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Cliente</label>
                <select
                  value={newClienteId}
                  onChange={(e) => setNewClienteId(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl focus:border-emerald-500 focus:outline-none"
                >
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} ({c.rif_cedula})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Concepto / Motivo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Factura #VTA-00120 a 15 días"
                  value={newConcepto}
                  onChange={(e) => setNewConcepto(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Monto Total ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    min={0.5}
                    value={newMonto}
                    onChange={(e) => setNewMonto(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Días de Crédito</label>
                  <input
                    type="number"
                    min={1}
                    value={newDiasCredito}
                    onChange={(e) => setNewDiasCredito(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Crear Cuenta por Cobrar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
