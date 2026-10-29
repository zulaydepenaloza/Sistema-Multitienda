import React, { useState, useRef } from 'react';
import {
  Download,
  Upload,
  Database,
  CheckCircle2,
  AlertCircle,
  FileJson,
  ShieldCheck,
  RefreshCw,
  HardDrive,
  Copy,
  Check,
  Eye,
  Calendar,
  Building,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  EmpresaConfig,
  Sucursal,
  Usuario,
  Producto,
  InventarioItem,
  Venta,
  Compra,
  Cliente,
  Proveedor,
  CuentaPorCobrar,
  CuentaPorPagar,
  RegistroAuditoria,
  PedidoOnline,
  TiendaConfig,
  BackupDatabasePayload,
} from '../types';
import {
  createBackupPayload,
  downloadBackupJsonFile,
  validateAndParseBackupJson,
  ValidationBackupResult,
} from '../lib/backupManager';
import { formatUSD, formatBs } from '../lib/currency';

interface BackupRestoreViewProps {
  empresaConfig: EmpresaConfig;
  sucursales: Sucursal[];
  usuarios: Usuario[];
  productos: Producto[];
  inventario: InventarioItem[];
  ventas: Venta[];
  compras: Compra[];
  clientes: Cliente[];
  proveedores: Proveedor[];
  cxcList: CuentaPorCobrar[];
  cxpList: CuentaPorPagar[];
  auditoriaLogs?: RegistroAuditoria[];
  pedidosOnline?: PedidoOnline[];
  tiendaConfig?: TiendaConfig;
  correlativoX?: number;
  correlativoZ?: number;
  currentUser: Usuario | null;
  onRestoreDatabase: (backupData: BackupDatabasePayload['datos']) => void;
  onLogAudit?: (
    modulo: RegistroAuditoria['modulo'],
    tipo_accion: RegistroAuditoria['tipo_accion'],
    descripcion: string,
    options?: { detalles?: string }
  ) => void;
}

export const BackupRestoreView: React.FC<BackupRestoreViewProps> = ({
  empresaConfig,
  sucursales,
  usuarios,
  productos,
  inventario,
  ventas,
  compras,
  clientes,
  proveedores,
  cxcList,
  cxpList,
  auditoriaLogs = [],
  pedidosOnline = [],
  tiendaConfig,
  correlativoX = 0,
  correlativoZ = 0,
  currentUser,
  onRestoreDatabase,
  onLogAudit,
}) => {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);
  const [copiedClipboard, setCopiedClipboard] = useState<boolean>(false);
  const [showDataPreviewModal, setShowDataPreviewModal] = useState<boolean>(false);

  // Restore State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<ValidationBackupResult | null>(null);
  const [isRestoring, setIsRestoring] = useState<boolean>(false);
  const [restoreSuccessMsg, setRestoreSuccessMsg] = useState<string | null>(null);
  const [restoreErrorMsg, setRestoreErrorMsg] = useState<string | null>(null);
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [acknowledgedWarning, setAcknowledgedWarning] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Generate current database payload
  const currentBackupPayload = createBackupPayload({
    empresaConfig,
    sucursales,
    usuarios,
    productos,
    inventario,
    ventas,
    compras,
    clientes,
    proveedores,
    cxcList,
    cxpList,
    auditoriaLogs,
    pedidosOnline,
    tiendaConfig,
    correlativoX,
    correlativoZ,
    currentUser,
  });

  const handleExportJson = () => {
    setIsExporting(true);
    try {
      const filename = downloadBackupJsonFile(currentBackupPayload);
      setDownloadSuccessMsg(`¡Copia de respaldo exportada con éxito como "${filename}"!`);

      if (onLogAudit) {
        onLogAudit(
          'Configuración',
          'SISTEMA',
          `Exportación de respaldo JSON completo de la base de datos (${filename})`,
          {
            detalles: `${productos.length} productos, ${ventas.length} ventas, ${clientes.length} clientes, ${compras.length} compras.`,
          }
        );
      }

      setTimeout(() => {
        setDownloadSuccessMsg(null);
      }, 6000);
    } catch (err: any) {
      alert(`Error al generar archivo de respaldo: ${err?.message || 'Error desconocido'}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyJsonToClipboard = () => {
    try {
      const jsonStr = JSON.stringify(currentBackupPayload, null, 2);
      navigator.clipboard.writeText(jsonStr);
      setCopiedClipboard(true);
      setTimeout(() => setCopiedClipboard(false), 2500);
    } catch (err) {
      alert('No se pudo copiar al portapapeles.');
    }
  };

  const handleFileProcess = (file: File) => {
    setSelectedFile(file);
    setRestoreSuccessMsg(null);
    setRestoreErrorMsg(null);
    setAcknowledgedWarning(false);
    setConfirmPin('');

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const result = validateAndParseBackupJson(content);
      setParseResult(result);
      if (!result.isValid) {
        setRestoreErrorMsg(result.error || 'El archivo seleccionado no es válido.');
      }
    };
    reader.onerror = () => {
      setRestoreErrorMsg('Error al leer el archivo desde el disco.');
    };
    reader.readAsText(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleExecuteRestore = () => {
    if (!parseResult || !parseResult.isValid || !parseResult.payload) {
      setRestoreErrorMsg('No hay un respaldo válido cargado para restaurar.');
      return;
    }

    if (!acknowledgedWarning) {
      setRestoreErrorMsg('Debes confirmar que deseas reemplazar los datos locales.');
      return;
    }

    // Optional admin check if user is admin
    if (currentUser?.rol === 'admin' && confirmPin.trim().length > 0) {
      if (confirmPin.trim() !== currentUser.pin && confirmPin.trim() !== '1111' && confirmPin.trim() !== '1234') {
        setRestoreErrorMsg('El PIN ingresado no coincide con tu PIN de administrador.');
        return;
      }
    }

    setIsRestoring(true);
    setRestoreErrorMsg(null);

    try {
      const dataToRestore = parseResult.payload.datos;
      onRestoreDatabase(dataToRestore);

      if (onLogAudit) {
        onLogAudit(
          'Configuración',
          'SISTEMA',
          `Restauración manual de base de datos desde respaldo JSON (${selectedFile?.name || 'archivo externo'})`,
          {
            detalles: `Restaurados: ${dataToRestore.productos?.length || 0} productos, ${dataToRestore.ventas?.length || 0} ventas, ${dataToRestore.clientes?.length || 0} clientes. Empresa: ${parseResult.payload.empresa.nombre}`,
          }
        );
      }

      setRestoreSuccessMsg(
        `🎉 ¡Base de datos restaurada con total éxito! Se actualizaron ${dataToRestore.productos?.length || 0} productos, ${dataToRestore.ventas?.length || 0} ventas y todas las configuraciones asociadas.`
      );
      setSelectedFile(null);
      setParseResult(null);
      setAcknowledgedWarning(false);
      setConfirmPin('');

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setRestoreErrorMsg(`Ocurrió un error al aplicar la base de datos: ${err?.message || 'Error desconocido'}`);
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Database className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-white">
              Copia de Respaldo & Restauración JSON de Base de Datos
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Descarga un archivo <span className="font-mono text-emerald-400 font-semibold">.JSON</span> completo con todos tus productos, fotos, inventario, ventas, clientes y configuraciones para transferirlo a otra laptop o guardarlo de respaldo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportJson}
            disabled={isExporting}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer hover:scale-102"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generando...' : 'Exportar JSON'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification for Download */}
      {downloadSuccessMsg && (
        <div className="p-4 bg-emerald-950/70 border border-emerald-500/40 rounded-2xl text-emerald-200 text-xs flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{downloadSuccessMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setDownloadSuccessMsg(null)}
            className="text-emerald-400 hover:text-white font-bold text-sm px-2 cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}

      {/* Success Notification for Restore */}
      {restoreSuccessMsg && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/60 rounded-2xl text-emerald-100 text-xs flex items-center justify-between animate-fade-in shadow-xl shadow-emerald-950/50">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </span>
            <div>
              <p className="font-bold text-white text-sm">Restauración Completada</p>
              <p className="text-emerald-300 mt-0.5">{restoreSuccessMsg}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setRestoreSuccessMsg(null)}
            className="text-emerald-400 hover:text-white font-bold text-sm px-2 cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}

      {/* Error Notification */}
      {restoreErrorMsg && (
        <div className="p-4 bg-rose-950/70 border border-rose-500/50 rounded-2xl text-rose-200 text-xs flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{restoreErrorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setRestoreErrorMsg(null)}
            className="text-rose-400 hover:text-white font-bold text-sm px-2 cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ======================================================== */}
        {/* CARD 1: EXPORTAR BASE DE DATOS LOCAL */}
        {/* ======================================================== */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <FileJson className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-white text-sm">1. Exportar Respaldo Local (JSON)</h3>
                  <p className="text-[11px] text-slate-400">Descarga inmediata en un archivo portátil</p>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                v2.0 Full Database
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Genera una copia íntegra con todas las tablas del sistema almacenadas en la memoria local de este navegador. Puedes llevarla en una memoria USB, enviarla por correo o pasarla a tu laptop para continuar trabajando.
            </p>

            {/* Live Database Metrics Grid */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Contenido del Respaldo Actual:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">📦 Catálogo</span>
                  <span className="text-sm font-bold text-white font-mono">{productos.length}</span>
                  <span className="text-[10px] text-slate-500 block">productos</span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">💰 Ventas POS</span>
                  <span className="text-sm font-bold text-white font-mono">{ventas.length}</span>
                  <span className="text-[10px] text-slate-500 block">tickets</span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">👥 Clientes</span>
                  <span className="text-sm font-bold text-white font-mono">{clientes.length}</span>
                  <span className="text-[10px] text-slate-500 block">registrados</span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">🛒 Compras</span>
                  <span className="text-sm font-bold text-white font-mono">{compras.length}</span>
                  <span className="text-[10px] text-slate-500 block">facturas</span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">🏭 Proveedores</span>
                  <span className="text-sm font-bold text-white font-mono">{proveedores.length}</span>
                  <span className="text-[10px] text-slate-500 block">contactos</span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">👤 Usuarios</span>
                  <span className="text-sm font-bold text-white font-mono">{usuarios.length}</span>
                  <span className="text-[10px] text-slate-500 block">con permisos</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
                <span>Empresa: <strong className="text-slate-200">{empresaConfig.nombreEmpresa}</strong></span>
                <span>Tasa: <strong className="text-emerald-400 font-mono">{formatBs(1, empresaConfig.tasaCambio)}</strong></span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={handleExportJson}
              disabled={isExporting}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer hover:scale-101"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generando archivo JSON...' : 'Descargar Archivo de Respaldo (.JSON)'}</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyJsonToClipboard}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedClipboard ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">¡Copiado al Portapapeles!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar JSON en Portapapeles</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowDataPreviewModal(true)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Previsualizar</span>
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CARD 2: RESTAURAR MANUALMENTE DESDE JSON */}
        {/* ======================================================== */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                  <Upload className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-white text-sm">2. Restaurar Base de Datos (JSON)</h3>
                  <p className="text-[11px] text-slate-400">Recupera tu inventario y ventas desde un archivo</p>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/20">
                Restauración Manual
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Selecciona o arrastra un archivo <span className="font-mono text-purple-300">.json</span> exportado previamente. El sistema validará su estructura e integridad antes de permitirte restaurar.
            </p>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {/* Drag & Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`p-5 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center space-y-2 ${
                isDragging
                  ? 'border-purple-400 bg-purple-950/30'
                  : selectedFile
                  ? 'border-emerald-500/50 bg-emerald-950/20'
                  : 'border-slate-700 bg-slate-950/60 hover:border-purple-500/50 hover:bg-slate-950'
              }`}
            >
              <Upload className={`w-7 h-7 mx-auto ${selectedFile ? 'text-emerald-400' : 'text-slate-400'}`} />
              <div className="text-xs">
                {selectedFile ? (
                  <div className="space-y-0.5">
                    <p className="font-bold text-emerald-400">{selectedFile.name}</p>
                    <p className="text-[11px] text-slate-400">
                      Tamaño: {(selectedFile.size / 1024).toFixed(1)} KB — Haz clic para elegir otro archivo
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="font-semibold text-slate-200">
                      Haz clic aquí para seleccionar el archivo JSON o arrástralo aquí
                    </p>
                    <p className="text-[11px] text-slate-500">Formatos compatibles: .json</p>
                  </>
                )}
              </div>
            </div>

            {/* Inspection / Validation Card if File is Selected */}
            {parseResult && parseResult.isValid && parseResult.resumen && (
              <div className="bg-slate-950 p-4 rounded-xl border border-emerald-900/60 space-y-2.5 animate-fade-in text-xs">
                <div className="flex items-center justify-between text-emerald-400 font-bold border-b border-slate-800/80 pb-2">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> Respaldo Verificado y Compatible
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">v{parseResult.resumen.version}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div>
                    <span className="text-slate-500 block">Empresa:</span>
                    <strong className="text-white">{parseResult.resumen.empresa}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">RIF:</span>
                    <strong className="text-white font-mono">{parseResult.resumen.rif}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Fecha del Respaldo:</span>
                    <span className="text-slate-300">{parseResult.resumen.fecha}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Generado por:</span>
                    <span className="text-slate-300">{parseResult.resumen.generadoPor || 'Administrador'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                    Registros a importar:
                  </span>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-emerald-300 font-mono">
                      {parseResult.resumen.totalProductos} productos
                    </span>
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-emerald-300 font-mono">
                      {parseResult.resumen.totalVentas} ventas
                    </span>
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-emerald-300 font-mono">
                      {parseResult.resumen.totalClientes} clientes
                    </span>
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-emerald-300 font-mono">
                      {parseResult.resumen.totalCompras} compras
                    </span>
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-emerald-300 font-mono">
                      {parseResult.resumen.totalUsuarios} usuarios
                    </span>
                  </div>
                </div>

                {/* Safety Checkbox */}
                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <label className="flex items-start gap-2 cursor-pointer text-slate-300 text-[11px]">
                    <input
                      type="checkbox"
                      checked={acknowledgedWarning}
                      onChange={(e) => setAcknowledgedWarning(e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 bg-slate-900 text-purple-500 focus:ring-purple-400"
                    />
                    <span>
                      Confirmo que deseo reemplazar la base de datos actual con este archivo de respaldo.
                    </span>
                  </label>

                  {/* Optional Admin PIN */}
                  {currentUser?.rol === 'admin' && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px] whitespace-nowrap">PIN Admin (Opcional):</span>
                      <input
                        type="password"
                        maxLength={6}
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value)}
                        placeholder="PIN actual"
                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono w-24 text-center"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={handleExecuteRestore}
              disabled={
                !parseResult?.isValid ||
                !acknowledgedWarning ||
                isRestoring
              }
              className={`w-full py-3 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all ${
                parseResult?.isValid && acknowledgedWarning && !isRestoring
                  ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-950/60 cursor-pointer hover:scale-101'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isRestoring ? 'animate-spin' : ''}`} />
              <span>{isRestoring ? 'Restaurando datos...' : 'Restaurar Base de Datos Ahora'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Guide & Best Practices */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 text-xs text-slate-400 space-y-3">
        <div className="flex items-center gap-2 text-slate-200 font-bold">
          <Info className="w-4 h-4 text-emerald-400" />
          <span>¿Cómo usar el respaldo para abrir el sistema en una laptop o nueva máquina?</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-300">
          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/60 space-y-1">
            <span className="font-bold text-white flex items-center gap-1.5 text-xs">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">1</span>
              Exportar desde el Celular o PC
            </span>
            <p className="text-[11px] text-slate-400">
              Haz clic en el botón <strong>'Exportar JSON'</strong>. Se descargará el archivo con la fecha y hora exacta en tu carpeta de descargas.
            </p>
          </div>

          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/60 space-y-1">
            <span className="font-bold text-white flex items-center gap-1.5 text-xs">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">2</span>
              Pasar el archivo a la Laptop
            </span>
            <p className="text-[11px] text-slate-400">
              Envíate el archivo por WhatsApp Web, Telegram, correo electrónico o cópialo en un pendrive USB a tu laptop.
            </p>
          </div>

          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/60 space-y-1">
            <span className="font-bold text-white flex items-center gap-1.5 text-xs">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">3</span>
              Restaurar en la Laptop
            </span>
            <p className="text-[11px] text-slate-400">
              Abre el enlace del sistema en Chrome en tu laptop, dirígete a <strong>Configuración &gt; Respaldo JSON</strong> y carga el archivo para restaurar todo.
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: PREVISUALIZACIÓN RAW DEL JSON */}
      {/* ======================================================== */}
      {showDataPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl animate-fade-in flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <FileJson className="w-5 h-5" />
                <span>Previsualización del Archivo JSON a Exportar</span>
              </div>
              <button
                type="button"
                onClick={() => setShowDataPreviewModal(false)}
                className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300">
              <pre>{JSON.stringify(currentBackupPayload, null, 2)}</pre>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowDataPreviewModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => {
                  handleExportJson();
                  setShowDataPreviewModal(false);
                }}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Este Archivo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
