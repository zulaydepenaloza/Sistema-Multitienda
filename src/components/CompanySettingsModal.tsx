import React, { useState } from 'react';
import { 
  Building2, 
  Store, 
  FileText, 
  Phone, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  X, 
  Image as ImageIcon, 
  ShieldCheck, 
  Receipt,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { EmpresaConfig, Usuario } from '../types';
import { formatBs, formatUSD, DEFAULT_EMPRESA_CONFIG } from '../lib/currency';

interface CompanySettingsModalProps {
  isOpen: boolean;
  empresaConfig?: EmpresaConfig;
  config?: EmpresaConfig;
  currentUser?: Usuario | null;
  onSaveConfig?: (updated: EmpresaConfig) => void;
  onSave?: (updated: EmpresaConfig) => void;
  onClose: () => void;
}

const PRESET_LOGOS = [
  { id: 'store', name: 'Comercio Retail', icon: '🛍️' },
  { id: 'building', name: 'Corporativo', icon: '🏢' },
  { id: 'cart', name: 'Supermercado', icon: '🛒' },
  { id: 'box', name: 'Distribuidora', icon: '📦' },
  { id: 'star', name: 'Exclusivo', icon: '⭐' },
];

export const CompanySettingsModal: React.FC<CompanySettingsModalProps> = ({
  isOpen,
  empresaConfig,
  config,
  currentUser,
  onSaveConfig,
  onSave,
  onClose,
}) => {
  const activeConfig = empresaConfig || config || DEFAULT_EMPRESA_CONFIG;
  const [formData, setFormData] = useState<EmpresaConfig>({ ...DEFAULT_EMPRESA_CONFIG, ...activeConfig });
  const [activeTab, setActiveTab] = useState<'empresa' | 'tiendas' | 'tasa'>('empresa');
  const [savedSuccess, setSavedSuccess] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      const freshConfig = empresaConfig || config || DEFAULT_EMPRESA_CONFIG;
      setFormData({ ...DEFAULT_EMPRESA_CONFIG, ...freshConfig });
    }
  }, [isOpen, empresaConfig, config]);

  if (!isOpen) return null;

  const isManagerOrAdmin = !currentUser || currentUser.rol === 'admin' || currentUser.rol === 'inventario' || currentUser.sucursal_id === 3 || currentUser.sucursal_id === null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const saveFn = onSaveConfig || onSave;
    if (saveFn) {
      saveFn(formData);
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative my-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-emerald-500/20 border border-purple-500/30 text-purple-300">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Configuración de Empresa & Información Fiscal
                </h2>
                <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Gerencia
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Personaliza la razón social, RIF, membrete de tickets y nombres de sucursales.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('empresa')}
            className={`flex-1 py-2 px-3 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'empresa'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>1. Datos Fiscales</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tiendas')}
            className={`flex-1 py-2 px-3 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'tiendas'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>2. Nombres de Tiendas</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tasa')}
            className={`flex-1 py-2 px-3 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'tasa'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>3. Cotización del Día</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* TAB 1: DATOS FISCALES */}
          {activeTab === 'empresa' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-purple-400" />
                    Nombre de la Empresa / Razón Social:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombreEmpresa}
                    onChange={(e) => setFormData({ ...formData, nombreEmpresa: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 font-medium"
                    placeholder="Ej. Inversiones y Distribuciones C.A."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Registro Fiscal (RIF):
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.rif}
                    onChange={(e) => setFormData({ ...formData, rif: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
                    placeholder="Ej. J-12345678-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  Dirección Fiscal:
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.direccionFiscal}
                  onChange={(e) => setFormData({ ...formData, direccionFiscal: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  placeholder="Ej. Av. Francisco de Miranda, Centro Empresarial Plaza, Nivel PB, Local 04, Caracas"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-400" />
                    Teléfonos de Contacto:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                    placeholder="Ej. +58 (212) 555-0199 / +58 (414) 123-4567"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    Distintivo / Logo de la Empresa:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.logoUrl || ''}
                      onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                      placeholder="URL del logo (opcional) o emoji"
                    />
                    <div className="flex gap-1">
                      {PRESET_LOGOS.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, logoUrl: item.icon })}
                          className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center border transition-all ${
                            formData.logoUrl === item.icon
                              ? 'bg-purple-600 border-purple-400 scale-110'
                              : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                          }`}
                          title={item.name}
                        >
                          {item.icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Ticket Preview */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1 text-center font-mono text-[11px] text-slate-400">
                <span className="text-[10px] uppercase font-sans font-bold text-purple-400 block mb-1">
                  Vista Previa del Encabezado de Ticket Fiscal:
                </span>
                <p className="font-bold text-white text-xs">{formData.nombreEmpresa || 'NOMBRE EMPRESA'}</p>
                <p>RIF: {formData.rif || 'J-00000000-0'}</p>
                <p className="text-[10px] text-slate-500">{formData.direccionFiscal || 'Dirección Fiscal'}</p>
                <p className="text-[10px] text-slate-500">TELF: {formData.telefono || '0000-0000000'}</p>
              </div>
            </div>
          )}

          {/* TAB 2: NOMBRES DE TIENDAS */}
          {activeTab === 'tiendas' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Personaliza la denominación de cada una de las 3 locaciones del sistema:
              </p>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5" />
                    Nombre Sucursal 1 (Caja 1):
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombreTienda1}
                    onChange={(e) => setFormData({ ...formData, nombreTienda1: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium"
                    placeholder="Ej. Tienda 1 - Centro"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5" />
                    Nombre Sucursal 2 (Caja 2):
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombreTienda2}
                    onChange={(e) => setFormData({ ...formData, nombreTienda2: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium"
                    placeholder="Ej. Tienda 2 - Norte"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    Nombre Oficina / Almacén Central (Gerencia):
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombreOficina}
                    onChange={(e) => setFormData({ ...formData, nombreOficina: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-500 font-medium"
                    placeholder="Ej. Oficina Central & Almacén"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COTIZACIÓN */}
          {activeTab === 'tasa' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <label className="block text-xs font-bold text-slate-300">
                  Tasa de Cambio del Día (Bolívares por 1 USD):
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
                    value={formData.tasaCambio}
                    onChange={(e) => setFormData({ ...formData, tasaCambio: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-4 py-2.5 text-lg font-bold text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between font-mono">
                  <span>Equivalencia Actual:</span>
                  <span className="font-bold">1.00 USD = {formatBs(1, formData.tasaCambio)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <div className="text-xs text-slate-500">
              {savedSuccess ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Configuración Guardada con Éxito
                </span>
              ) : (
                <span>Los cambios se reflejan de inmediato en todas las vistas.</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Guardar Configuración</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
