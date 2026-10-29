import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  User,
  Edit2,
  Trash2,
  Save,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  FileText,
  LayoutGrid,
  List,
} from 'lucide-react';
import { Proveedor, EmpresaConfig } from '../types';
import { formatUSD, formatBs } from '../lib/currency';

interface ProveedoresManagerProps {
  proveedores: Proveedor[];
  onAddProveedor: (prov: Omit<Proveedor, 'id'>) => void;
  onUpdateProveedor: (prov: Proveedor) => void;
  onDeleteProveedor?: (id: number) => boolean | void;
  empresaConfig: EmpresaConfig;
}

export const ProveedoresManager: React.FC<ProveedoresManagerProps> = ({
  proveedores,
  onAddProveedor,
  onUpdateProveedor,
  onDeleteProveedor,
  empresaConfig,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProv, setEditingProv] = useState<Proveedor | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [deleteConfirmProv, setDeleteConfirmProv] = useState<Proveedor | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [nombre, setNombre] = useState('');
  const [rif, setRif] = useState('');
  const [contacto, setContacto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [formError, setFormError] = useState('');

  const handleOpenAdd = () => {
    setNombre('');
    setRif('');
    setContacto('');
    setTelefono('');
    setEmail('');
    setDireccion('');
    setEditingProv(null);
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEdit = (p: Proveedor) => {
    setEditingProv(p);
    setNombre(p.nombre);
    setRif(p.rif);
    setContacto(p.contacto);
    setTelefono(p.telefono);
    setEmail(p.email || '');
    setDireccion(p.direccion || '');
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !rif.trim()) {
      setFormError('Razón Social y RIF son campos obligatorios.');
      return;
    }

    // Check duplicate RIF
    const duplicate = proveedores.find(
      (p) =>
        p.rif.trim().toUpperCase() === rif.trim().toUpperCase() &&
        (!editingProv || p.id !== editingProv.id)
    );
    if (duplicate) {
      setFormError(`Ya existe un proveedor registrado con el RIF ${rif.trim().toUpperCase()} (${duplicate.nombre}).`);
      return;
    }

    if (editingProv) {
      onUpdateProveedor({
        ...editingProv,
        nombre: nombre.trim(),
        rif: rif.trim().toUpperCase(),
        contacto: contacto.trim(),
        telefono: telefono.trim(),
        email: email.trim(),
        direccion: direccion.trim(),
      });
      setFeedbackMsg({ type: 'success', text: `Proveedor "${nombre.trim()}" actualizado exitosamente.` });
    } else {
      onAddProveedor({
        nombre: nombre.trim(),
        rif: rif.trim().toUpperCase(),
        contacto: contacto.trim(),
        telefono: telefono.trim(),
        email: email.trim(),
        direccion: direccion.trim(),
        saldoPendiente: 0,
      });
      setFeedbackMsg({ type: 'success', text: `Proveedor "${nombre.trim()}" registrado exitosamente.` });
    }

    setShowModal(false);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmProv) return;

    if (deleteConfirmProv.saldoPendiente > 0) {
      alert(`No se puede eliminar el proveedor "${deleteConfirmProv.nombre}" porque tiene un saldo pendiente de ${formatUSD(deleteConfirmProv.saldoPendiente)} en Cuentas por Pagar.`);
      setDeleteConfirmProv(null);
      return;
    }

    if (onDeleteProveedor) {
      onDeleteProveedor(deleteConfirmProv.id);
      setFeedbackMsg({ type: 'success', text: `Proveedor "${deleteConfirmProv.nombre}" eliminado correctamente.` });
    }
    setDeleteConfirmProv(null);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const filteredProveedores = proveedores.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.rif.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.contacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.telefono.includes(searchTerm)
  );

  const totalDeudaProveedores = proveedores.reduce((acc, p) => acc + p.saldoPendiente, 0);

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
            <Truck className="w-5 h-5 text-emerald-400" /> Directorio de Proveedores y Fabricantes
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gestión de contactos comerciales, datos de facturación (RIF), edición y eliminación de proveedores.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 transition-all shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Registrar Nuevo Proveedor</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block font-medium">Proveedores Registrados</span>
          <div className="text-xl font-bold text-white font-mono mt-1">{proveedores.length} empresas</div>
          <span className="text-xs text-slate-500 block mt-0.5">Líneas de suministro activas</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block font-medium">Deuda Total a Proveedores (CxP)</span>
          <div className="text-xl font-bold text-rose-400 font-mono mt-1">{formatUSD(totalDeudaProveedores)}</div>
          <span className="text-xs text-slate-400 font-mono block mt-0.5">
            {formatBs(totalDeudaProveedores, empresaConfig.tasaCambio)}
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block font-medium">Calificación de Abastecimiento</span>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1">100% Operativo</div>
          <span className="text-xs text-slate-500 block mt-0.5">Gestión de compras directa a stock</span>
        </div>
      </div>

      {/* Search & Action Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por razón social, RIF, persona de contacto o teléfono..."
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
              <span>Nuevo Proveedor</span>
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredProveedores.length === 0 && (
          <div className="text-center py-12 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <Truck className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-300">No se encontraron proveedores</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchTerm ? 'Intenta con otro término de búsqueda.' : 'Aún no hay proveedores registrados. Pulsa "Registrar Nuevo Proveedor" para comenzar.'}
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer hover:bg-emerald-400 inline-flex items-center gap-1.5 mt-2"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Registrar Primer Proveedor</span>
            </button>
          </div>
        )}

        {/* TABLE VIEW */}
        {filteredProveedores.length > 0 && viewMode === 'table' && (
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3.5 font-bold">Razón Social / Proveedor</th>
                  <th className="p-3.5 font-bold">RIF</th>
                  <th className="p-3.5 font-bold">Persona de Contacto</th>
                  <th className="p-3.5 font-bold">Teléfono / Email</th>
                  <th className="p-3.5 font-bold text-right">Saldo Deudor (CxP)</th>
                  <th className="p-3.5 font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/60">
                {filteredProveedores.map((prov) => (
                  <tr key={prov.id} className="hover:bg-slate-900/80 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-white text-sm">{prov.nombre}</div>
                      {prov.direccion && (
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate max-w-xs">{prov.direccion}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-emerald-400 font-bold">
                        {prov.rif}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{prov.contacto || 'No especificado'}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-400 space-y-0.5">
                      {prov.telefono && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span className="font-mono">{prov.telefono}</span>
                        </div>
                      )}
                      {prov.email && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span className="truncate max-w-[160px]">{prov.email}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3.5 text-right font-mono">
                      <div
                        className={`font-bold ${
                          prov.saldoPendiente > 0 ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {formatUSD(prov.saldoPendiente)}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {formatBs(prov.saldoPendiente, empresaConfig.tasaCambio)}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(prov)}
                          className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white rounded-lg border border-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                          title="Editar proveedor"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-sky-400" />
                          <span>Editar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmProv(prov)}
                          className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded-lg border border-rose-500/30 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                          title="Eliminar proveedor"
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

        {/* GRID / CARD VIEW */}
        {filteredProveedores.length > 0 && viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProveedores.map((prov) => (
              <div
                key={prov.id}
                className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-4 space-y-3 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-white text-sm">{prov.nombre}</h3>
                      <span className="text-xs font-mono text-emerald-400 font-bold">{prov.rif}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(prov)}
                        className="p-1.5 text-slate-400 hover:text-white bg-slate-900 rounded-lg border border-slate-800 cursor-pointer"
                        title="Editar proveedor"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-sky-400" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmProv(prov)}
                        className="p-1.5 text-rose-400 hover:text-rose-300 bg-rose-500/10 rounded-lg border border-rose-500/30 cursor-pointer"
                        title="Eliminar proveedor"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="text-slate-300 font-medium">Contacto: {prov.contacto || 'N/A'}</span>
                    </div>
                    {prov.telefono && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{prov.telefono}</span>
                      </div>
                    )}
                    {prov.email && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{prov.email}</span>
                      </div>
                    )}
                    {prov.direccion && (
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{prov.direccion}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Balance & Actions footer */}
                <div className="pt-2 border-t border-slate-900">
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Deuda Pendiente (CxP):</span>
                      <span
                        className={`font-bold ${
                          prov.saldoPendiente > 0 ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        ${prov.saldoPendiente.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">Equivalente Bs:</span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        {formatBs(prov.saldoPendiente, empresaConfig.tasaCambio)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: ADD / EDIT PROVEEDOR */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400" />
                {editingProv ? 'Editar Datos de Proveedor' : 'Registrar Nuevo Proveedor'}
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
                    Razón Social / Nombre Comercial <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => {
                      setNombre(e.target.value);
                      if (formError) setFormError('');
                    }}
                    placeholder="Ej. Alimentos Polar Comercial C.A."
                    className="w-full bg-slate-950 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    RIF Fiscal <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={rif}
                    onChange={(e) => {
                      setRif(e.target.value.toUpperCase());
                      if (formError) setFormError('');
                    }}
                    placeholder="J-00000000-0"
                    className="w-full bg-slate-950 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl focus:border-emerald-500 focus:outline-none font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Persona de Contacto
                  </label>
                  <input
                    type="text"
                    value={contacto}
                    onChange={(e) => setContacto(e.target.value)}
                    placeholder="Lic. Marcos Delgado"
                    className="w-full bg-slate-950 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Teléfono de Ventas / Despacho
                  </label>
                  <input
                    type="text"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="+58 212-0000000"
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
                    placeholder="pedidos@proveedor.com"
                    className="w-full bg-slate-950 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Dirección / Ubicación del Almacén
                  </label>
                  <input
                    type="text"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Zona Industrial, Galpón 4"
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
                  <span>{editingProv ? 'Actualizar Proveedor' : 'Guardar Proveedor'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONFIRM DELETE PROVEEDOR */}
      {deleteConfirmProv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base font-bold text-white">¿Eliminar este Proveedor?</h3>
              <p className="text-xs text-slate-400">
                Estás a punto de eliminar del sistema a <strong className="text-white">{deleteConfirmProv.nombre}</strong> (RIF: {deleteConfirmProv.rif}).
              </p>
            </div>

            {deleteConfirmProv.saldoPendiente > 0 ? (
              <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span>
                  <strong>Atención:</strong> Este proveedor tiene un saldo pendiente de <strong>{formatUSD(deleteConfirmProv.saldoPendiente)}</strong> en CxP. Debes finiquitar los pagos antes de eliminarlo.
                </span>
              </div>
            ) : (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 text-xs">
                Esta acción no se puede deshacer. Los registros históricos de compras anteriores se mantendrán para los balances contables.
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmProv(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:text-white bg-slate-800 cursor-pointer font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={deleteConfirmProv.saldoPendiente > 0}
                onClick={handleConfirmDelete}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  deleteConfirmProv.saldoPendiente > 0
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Sí, Eliminar Proveedor</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
