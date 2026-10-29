import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  Edit2,
  Trash2,
  Save,
  LayoutGrid,
  List,
} from 'lucide-react';
import { Cliente, EmpresaConfig } from '../types';
import { formatUSD, formatBs } from '../lib/currency';

interface ClientesManagerProps {
  clientes: Cliente[];
  onAddCliente: (cliente: Omit<Cliente, 'id'>) => void;
  onUpdateCliente: (cliente: Cliente) => void;
  onDeleteCliente?: (id: number) => boolean | void;
  empresaConfig: EmpresaConfig;
}

export const ClientesManager: React.FC<ClientesManagerProps> = ({
  clientes,
  onAddCliente,
  onUpdateCliente,
  onDeleteCliente,
  empresaConfig,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [deleteConfirmCliente, setDeleteConfirmCliente] = useState<Cliente | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [nombre, setNombre] = useState('');
  const [rifCedula, setRifCedula] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [limiteCredito, setLimiteCredito] = useState<number>(300);
  const [formError, setFormError] = useState('');

  const handleOpenAdd = () => {
    setNombre('');
    setRifCedula('');
    setTelefono('');
    setEmail('');
    setDireccion('');
    setLimiteCredito(300);
    setEditingCliente(null);
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEdit = (c: Cliente) => {
    setEditingCliente(c);
    setNombre(c.nombre);
    setRifCedula(c.rif_cedula);
    setTelefono(c.telefono);
    setEmail(c.email || '');
    setDireccion(c.direccion || '');
    setLimiteCredito(c.limiteCredito);
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !rifCedula.trim()) {
      setFormError('Razón Social / Nombre y RIF / Cédula son obligatorios.');
      return;
    }

    // Check duplicate RIF/Cedula
    const duplicate = clientes.find(
      (c) =>
        c.rif_cedula.trim().toUpperCase() === rifCedula.trim().toUpperCase() &&
        (!editingCliente || c.id !== editingCliente.id)
    );
    if (duplicate) {
      setFormError(`Ya existe un cliente registrado con el documento ${rifCedula.trim().toUpperCase()} (${duplicate.nombre}).`);
      return;
    }

    if (editingCliente) {
      onUpdateCliente({
        ...editingCliente,
        nombre: nombre.trim(),
        rif_cedula: rifCedula.trim().toUpperCase(),
        telefono: telefono.trim(),
        email: email.trim(),
        direccion: direccion.trim(),
        limiteCredito: Number(limiteCredito) || 0,
      });
      setFeedbackMsg({ type: 'success', text: `Cliente "${nombre.trim()}" actualizado correctamente.` });
    } else {
      onAddCliente({
        nombre: nombre.trim(),
        rif_cedula: rifCedula.trim().toUpperCase(),
        telefono: telefono.trim(),
        email: email.trim(),
        direccion: direccion.trim(),
        limiteCredito: Number(limiteCredito) || 0,
        saldoPendiente: 0,
        fechaRegistro: new Date().toISOString().split('T')[0],
      });
      setFeedbackMsg({ type: 'success', text: `Cliente "${nombre.trim()}" registrado exitosamente.` });
    }

    setShowModal(false);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmCliente) return;

    if (deleteConfirmCliente.saldoPendiente > 0) {
      alert(`No se puede eliminar el cliente "${deleteConfirmCliente.nombre}" porque tiene un saldo deudor pendiente de ${formatUSD(deleteConfirmCliente.saldoPendiente)} en Cuentas por Cobrar.`);
      setDeleteConfirmCliente(null);
      return;
    }

    if (onDeleteCliente) {
      onDeleteCliente(deleteConfirmCliente.id);
      setFeedbackMsg({ type: 'success', text: `Cliente "${deleteConfirmCliente.nombre}" eliminado correctamente.` });
    }
    setDeleteConfirmCliente(null);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const filteredClientes = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.rif_cedula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.telefono.includes(searchTerm)
  );

  const totalDeudaClientes = clientes.reduce((acc, c) => acc + c.saldoPendiente, 0);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {feedbackMsg && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-bold animate-fade-in ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{feedbackMsg.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMsg(null)}
            className="text-slate-400 hover:text-white cursor-pointer ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" /> Directorio y Gestión de Clientes
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Control de información fiscal (RIF/CI), límites de crédito para facturación, edición y eliminación de clientes.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 transition-all shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Registrar Nuevo Cliente</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block font-medium">Clientes Registrados</span>
          <div className="text-xl font-bold text-white font-mono mt-1">{clientes.length} clientes</div>
          <span className="text-xs text-slate-500 block mt-0.5">Cartera comercial activa</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block font-medium">Saldo por Cobrar (Deuda Total)</span>
          <div className="text-xl font-bold text-amber-400 font-mono mt-1">{formatUSD(totalDeudaClientes)}</div>
          <span className="text-xs text-slate-400 font-mono block mt-0.5">
            {formatBs(totalDeudaClientes, empresaConfig.tasaCambio)}
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block font-medium">Límite Global Concedido</span>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
            {formatUSD(clientes.reduce((acc, c) => acc + c.limiteCredito, 0))}
          </div>
          <span className="text-xs text-slate-500 block mt-0.5">Cupo de crédito comercial disponible</span>
        </div>
      </div>

      {/* Search & Action Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar cliente por nombre, RIF, cédula o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white text-xs pl-9 pr-3 py-2 rounded-xl focus:border-emerald-500 focus:outline-none placeholder-slate-500"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-1 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Vista de Tabla"
              >
                <List className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">Tabla</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Vista de Tarjetas"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">Tarjetas</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleOpenAdd}
              className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nuevo Cliente</span>
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredClientes.length === 0 && (
          <div className="text-center py-12 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <Users className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-300">No se encontraron clientes</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchTerm ? 'Intenta con otro término de búsqueda.' : 'Aún no hay clientes registrados. Pulsa "Registrar Nuevo Cliente" para comenzar.'}
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer hover:bg-emerald-400 inline-flex items-center gap-1.5 mt-2"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Registrar Primer Cliente</span>
            </button>
          </div>
        )}

        {/* TABLE VIEW */}
        {filteredClientes.length > 0 && viewMode === 'table' && (
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3.5 font-bold">Cliente / Razón Social</th>
                  <th className="p-3.5 font-bold">RIF / Cédula</th>
                  <th className="p-3.5 font-bold">Contacto / Dirección</th>
                  <th className="p-3.5 font-bold text-right">Límite Crédito</th>
                  <th className="p-3.5 font-bold text-right">Saldo Deudor (CxC)</th>
                  <th className="p-3.5 font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/60">
                {filteredClientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-slate-900/80 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-white text-sm">{cliente.nombre}</div>
                      <div className="text-[11px] text-slate-500">Registrado: {cliente.fechaRegistro || 'Inicial'}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-emerald-400 font-bold">
                        {cliente.rif_cedula}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400 space-y-0.5">
                      {cliente.telefono && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span className="font-mono">{cliente.telefono}</span>
                        </div>
                      )}
                      {cliente.email && (
                        <div className="flex items-center gap-1 text-[11px]">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span className="truncate max-w-[160px]">{cliente.email}</span>
                        </div>
                      )}
                      {cliente.direccion && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate max-w-xs">{cliente.direccion}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-slate-200">
                      ${cliente.limiteCredito.toFixed(2)}
                    </td>
                    <td className="p-3.5 text-right font-mono">
                      <div
                        className={`font-bold ${
                          cliente.saldoPendiente > 0 ? 'text-amber-400' : 'text-emerald-400'
                        }`}
                      >
                        {formatUSD(cliente.saldoPendiente)}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {formatBs(cliente.saldoPendiente, empresaConfig.tasaCambio)}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(cliente)}
                          className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white rounded-lg border border-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                          title="Editar cliente"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-sky-400" />
                          <span>Editar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmCliente(cliente)}
                          className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded-lg border border-rose-500/30 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                          title="Eliminar cliente"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* GRID VIEW */}
        {filteredClientes.length > 0 && viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClientes.map((cliente) => (
              <div
                key={cliente.id}
                className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-4 space-y-3 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-white text-sm">{cliente.nombre}</h3>
                      <span className="text-xs font-mono text-emerald-400 font-bold">{cliente.rif_cedula}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(cliente)}
                        className="p-1.5 text-slate-400 hover:text-white bg-slate-900 rounded-lg border border-slate-800 cursor-pointer"
                        title="Editar cliente"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-sky-400" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmCliente(cliente)}
                        className="p-1.5 text-rose-400 hover:text-rose-300 bg-rose-500/10 rounded-lg border border-rose-500/30 cursor-pointer"
                        title="Eliminar cliente"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 space-y-1">
                    {cliente.telefono && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{cliente.telefono}</span>
                      </div>
                    )}
                    {cliente.email && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{cliente.email}</span>
                      </div>
                    )}
                    {cliente.direccion && (
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{cliente.direccion}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Balances */}
                <div className="pt-2 border-t border-slate-900">
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Límite Crédito:</span>
                      <span className="text-slate-200 font-bold">${cliente.limiteCredito.toFixed(2)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">Saldo Deudor (CxC):</span>
                      <span
                        className={`font-bold ${
                          cliente.saldoPendiente > 0 ? 'text-amber-400' : 'text-emerald-400'
                        }`}
                      >
                        ${cliente.saldoPendiente.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: ADD / EDIT CLIENTE */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                {editingCliente ? 'Editar Datos de Cliente' : 'Registrar Nuevo Cliente'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Razón Social / Nombre Completo <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => {
                      setNombre(e.target.value);
                      if (formError) setFormError('');
                    }}
                    placeholder="Ej. Distribuidora Santa Fe C.A. o Juan Pérez"
                    className="w-full bg-slate-950 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    RIF o Cédula de Identidad <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={rifCedula}
                    onChange={(e) => {
                      setRifCedula(e.target.value.toUpperCase());
                      if (formError) setFormError('');
                    }}
                    placeholder="J-12345678-0 o V-12345678"
                    className="w-full bg-slate-950 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl focus:border-emerald-500 focus:outline-none font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Teléfono de Contacto
                  </label>
                  <input
                    type="text"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="+58 414-1234567"
                    className="w-full bg-slate-950 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="cliente@gmail.com"
                    className="w-full bg-slate-950 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Límite de Crédito ($ USD)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={limiteCredito}
                    onChange={(e) => setLimiteCredito(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Dirección Fiscal / Ubicación
                  </label>
                  <input
                    type="text"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Av. Principal, Edificio Central, Local 2"
                    className="w-full bg-slate-950 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingCliente ? 'Actualizar Cliente' : 'Guardar Cliente'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONFIRM DELETE CLIENTE */}
      {deleteConfirmCliente && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base font-bold text-white">¿Eliminar este Cliente?</h3>
              <p className="text-xs text-slate-400">
                Estás a punto de eliminar a <strong className="text-white">{deleteConfirmCliente.nombre}</strong> (RIF/CI: {deleteConfirmCliente.rif_cedula}).
              </p>
            </div>

            {deleteConfirmCliente.saldoPendiente > 0 ? (
              <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span>
                  <strong>Atención:</strong> Este cliente tiene un saldo pendiente de <strong>{formatUSD(deleteConfirmCliente.saldoPendiente)}</strong> en CxC. Debes liquidar sus facturas antes de poder eliminarlo.
                </span>
              </div>
            ) : (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 text-xs">
                Esta acción eliminará el cliente de la lista de selección en caja. Los tickets históricos mantendrán los datos registrados.
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmCliente(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:text-white bg-slate-800 cursor-pointer font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={deleteConfirmCliente.saldoPendiente > 0}
                onClick={handleConfirmDelete}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  deleteConfirmCliente.saldoPendiente > 0
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Sí, Eliminar Cliente</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
