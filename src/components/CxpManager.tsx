import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  DollarSign,
  Calendar,
  Truck,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  FileCheck,
  CreditCard,
} from 'lucide-react';
import { CuentaPorPagar, Proveedor, EmpresaConfig, Usuario } from '../types';
import { formatUSD, formatBs } from '../lib/currency';

interface CxpManagerProps {
  cxpList: CuentaPorPagar[];
  proveedores: Proveedor[];
  empresaConfig: EmpresaConfig;
  currentUser: Usuario | null;
  onRegistrarPago: (cxpId: number, monto: number, metodoPago: string, referencia?: string) => void;
  onNuevaCuentaPagar?: (cxp: Omit<CuentaPorPagar, 'id' | 'pagos'>) => void;
}

export const CxpManager: React.FC<CxpManagerProps> = ({
  cxpList,
  proveedores,
  empresaConfig,
  currentUser,
  onRegistrarPago,
  onNuevaCuentaPagar,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'pendiente' | 'parcial' | 'pagada'>('todos');

  // Selected CxP for adding a payment
  const [selectedCxp, setSelectedCxp] = useState<CuentaPorPagar | null>(null);
  const [montoPago, setMontoPago] = useState<number>(0);
  const [metodoPago, setMetodoPago] = useState<string>('Transferencia Bancaria');
  const [referenciaPago, setReferenciaPago] = useState<string>('');

  // Manual new CxP modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [newProvId, setNewProvId] = useState<number>(proveedores[0]?.id || 1);
  const [newFactura, setNewFactura] = useState<string>('');
  const [newMonto, setNewMonto] = useState<number>(100);
  const [newDiasCredito, setNewDiasCredito] = useState<number>(30);

  const handleOpenPagar = (item: CuentaPorPagar) => {
    setSelectedCxp(item);
    setMontoPago(item.saldoRestante);
    setReferenciaPago('');
    setMetodoPago('Transferencia Bancaria');
  };

  const handleSubmitPago = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCxp) return;

    if (montoPago <= 0 || montoPago > selectedCxp.saldoRestante + 0.01) {
      alert(`El monto debe ser mayor a 0 y no puede exceder el saldo restante ($${selectedCxp.saldoRestante.toFixed(2)}).`);
      return;
    }

    onRegistrarPago(selectedCxp.id, montoPago, metodoPago, referenciaPago);
    setSelectedCxp(null);
  };

  const handleCreateNewCxp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onNuevaCuentaPagar) return;
    const prov = proveedores.find((p) => p.id === newProvId);
    if (!prov) return;

    const fechaEmision = new Date().toISOString();
    const fechaVenc = new Date(Date.now() + newDiasCredito * 24 * 3600 * 1000).toISOString();

    onNuevaCuentaPagar({
      proveedorId: prov.id,
      proveedorNombre: prov.nombre,
      numeroFactura: newFactura.trim() || `FAC-PROV-${Date.now().toString().slice(-5)}`,
      fechaEmision,
      fechaVencimiento: fechaVenc,
      montoTotal: newMonto,
      saldoRestante: newMonto,
      estado: 'pendiente',
    });

    setShowNewModal(false);
    setNewFactura('');
  };

  const filteredList = cxpList.filter((item) => {
    const matchesSearch =
      item.proveedorNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.numeroFactura.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filtroEstado === 'todos' || item.estado === filtroEstado;
    return matchesSearch && matchesStatus;
  });

  const totalPorPagar = cxpList.reduce((acc, c) => acc + (c.estado !== 'pagada' ? c.saldoRestante : 0), 0);
  const totalPagado = cxpList.reduce((acc, c) => {
    const totalAbonado = c.pagos.reduce((pAcc, p) => pAcc + p.monto, 0);
    return acc + totalAbonado;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-400" /> Cuentas por Pagar (CxP) - Proveedores
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gestión de facturas por pagar, programación de pagos a proveedores y control de morosidad comercial.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewModal(true)}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Cuenta por Pagar</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block font-medium">Deuda Total por Pagar</span>
          <div className="text-xl font-bold text-rose-400 font-mono mt-1">{formatUSD(totalPorPagar)}</div>
          <span className="text-xs text-slate-400 font-mono block mt-0.5">
            {formatBs(totalPorPagar, empresaConfig.tasaCambio)}
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block font-medium">Total Pagado / Amortizado</span>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1">{formatUSD(totalPagado)}</div>
          <span className="text-xs text-slate-400 font-mono block mt-0.5">
            {formatBs(totalPagado, empresaConfig.tasaCambio)}
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block font-medium">Obligaciones Pendientes</span>
          <div className="text-xl font-bold text-white font-mono mt-1">
            {cxpList.filter((c) => c.estado !== 'pagada').length} facturas
          </div>
          <span className="text-xs text-slate-500 block mt-0.5">
            {cxpList.filter((c) => c.estado === 'pagada').length} liquidadas
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
              placeholder="Buscar por proveedor o número de factura..."
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
                <th className="py-3 px-3">Factura</th>
                <th className="py-3 px-3">Proveedor</th>
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
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      <div>#{item.numeroFactura}</div>
                      <div className="text-[10px] text-slate-500">ID #{item.id}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-200">{item.proveedorNombre}</td>
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
                      <div className={item.saldoRestante > 0 ? 'text-rose-400' : 'text-emerald-400'}>
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
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {item.estado.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {item.estado !== 'pagada' ? (
                        <button
                          type="button"
                          onClick={() => handleOpenPagar(item)}
                          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 mx-auto cursor-pointer shadow"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          <span>Pagar</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-400 font-bold flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Liquidada
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

      {/* Modal: Registrar Pago a Proveedor */}
      {selectedCxp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl space-y-4">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                Registrar Pago a Factura #{selectedCxp.numeroFactura}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedCxp(null)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitPago} className="p-5 space-y-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                <div className="text-slate-400">
                  Proveedor: <span className="font-bold text-white">{selectedCxp.proveedorNombre}</span>
                </div>
                <div className="text-slate-400">
                  Saldo Pendiente: <span className="font-bold text-rose-400 font-mono">${selectedCxp.saldoRestante.toFixed(2)}</span> ({formatBs(selectedCxp.saldoRestante, empresaConfig.tasaCambio)})
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Monto a Pagar ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  min={0.01}
                  max={selectedCxp.saldoRestante}
                  value={montoPago}
                  onChange={(e) => setMontoPago(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-emerald-500 text-emerald-400 font-mono text-sm font-bold px-3 py-2 rounded-xl focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Equivalente en Bolívares: <strong className="text-emerald-300 font-mono">{formatBs(montoPago, empresaConfig.tasaCambio)}</strong>
                </span>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Forma de Pago</label>
                <select
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                  <option value="Pago Móvil">Pago Móvil (Bs.)</option>
                  <option value="Efectivo USD">Efectivo ($ USD)</option>
                  <option value="Zelle">Zelle / Transferencia Internacional</option>
                  <option value="Cheque">Cheque de Gerencia</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Referencia Bancaria / Comprobante</label>
                <input
                  type="text"
                  placeholder="Ej: TRF-7749102"
                  value={referenciaPago}
                  onChange={(e) => setReferenciaPago(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedCxp(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Registrar Pago</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Nueva CxP Manual */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl space-y-4">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-400" />
                Nueva Cuenta por Pagar (Factura Proveedor)
              </h3>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewCxp} className="p-5 space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Proveedor</label>
                <select
                  value={newProvId}
                  onChange={(e) => setNewProvId(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl focus:border-emerald-500 focus:outline-none"
                >
                  {proveedores.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} ({p.rif})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Nº de Factura Proveedor</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: FAC-POL-99201"
                  value={newFactura}
                  onChange={(e) => setNewFactura(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl focus:border-emerald-500 focus:outline-none font-mono"
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
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Plazo (Días de Crédito)</label>
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
                  <span>Registrar Cuenta por Pagar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
