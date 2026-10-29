import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, AlertCircle, RefreshCw, Cloud, CloudCheck, Flame, ShieldCheck, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';
import { testFirestoreConnection, syncAllToFirestore, fetchAllFromFirestore, firebaseConfig } from '../lib/firebaseClient';
import { Producto, EmpresaConfig, TiendaConfig, Sucursal, InventarioItem } from '../types';

interface FirebaseSyncSettingsProps {
  productos: Producto[];
  empresaConfig: EmpresaConfig;
  tiendaConfig: TiendaConfig;
  sucursales: Sucursal[];
  inventario: InventarioItem[];
  onRefreshData?: () => void;
  onDataLoadedFromCloud?: (data: { productos?: Producto[]; empresaConfig?: EmpresaConfig; tiendaConfig?: TiendaConfig }) => void;
}

export const FirebaseSyncSettings: React.FC<FirebaseSyncSettingsProps> = ({
  productos,
  empresaConfig,
  tiendaConfig,
  sucursales,
  inventario,
  onRefreshData,
  onDataLoadedFromCloud,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    // Initial silent ping to verify connectivity
    testFirestoreConnection().then((res) => {
      setIsConnected(res.success);
    }).catch(() => {
      setIsConnected(false);
    });
  }, []);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setStatusMessage({ text: 'Verificando clúster de Firebase Firestore en Google Cloud...', type: 'info' });
    try {
      const result = await testFirestoreConnection();
      setIsConnected(result.success);
      if (result.success) {
        setStatusMessage({ text: result.message, type: 'success' });
      } else {
        setStatusMessage({ text: result.message, type: 'error' });
      }
    } catch (e: any) {
      setIsConnected(false);
      setStatusMessage({ text: `Error de conexión: ${e?.message || e}`, type: 'error' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleUploadAllToCloud = async () => {
    setIsSyncing(true);
    setStatusMessage({ text: 'Subiendo catálogo, tasas y configuración a Firestore...', type: 'info' });
    try {
      const res = await syncAllToFirestore({
        productos,
        empresaConfig,
        tiendaConfig,
        sucursales,
        inventario,
      });

      if (res.success) {
        setIsConnected(true);
        const delMsg = res.deletedCount > 0 ? ` (se removieron ${res.deletedCount} artículos demo obsoletos de Firestore)` : '';
        setStatusMessage({
          text: `¡Éxito! Se sincronizaron ${res.count} productos activos y configuraciones en la nube de Firebase${delMsg}.`,
          type: 'success',
        });
        if (onRefreshData) onRefreshData();
      } else {
        setStatusMessage({ text: `Error al sincronizar: ${res.error}`, type: 'error' });
      }
    } catch (e: any) {
      setStatusMessage({ text: `Excepción durante la subida: ${e?.message || e}`, type: 'error' });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownloadFromCloud = async () => {
    setIsDownloading(true);
    setStatusMessage({ text: 'Descargando datos actuales desde Firebase Firestore...', type: 'info' });
    try {
      const data = await fetchAllFromFirestore();
      if (data && (data.productos || data.empresaConfig || data.tiendaConfig)) {
        setIsConnected(true);
        if (onDataLoadedFromCloud) {
          onDataLoadedFromCloud(data);
        }
        setStatusMessage({
          text: `¡Datos descargados con éxito! (${data.productos?.length || 0} productos obtenidos).`,
          type: 'success',
        });
      } else {
        setStatusMessage({
          text: 'La base de datos en la nube está activa pero aún no contiene datos. Usa "Subir Datos a la Nube" primero.',
          type: 'info',
        });
      }
    } catch (e: any) {
      setStatusMessage({ text: `Error al descargar datos: ${e?.message || e}`, type: 'error' });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      {/* Botón en el Header */}
      <button
        onClick={() => setIsOpen(true)}
        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer shadow-sm ${
          isConnected === true
            ? 'bg-amber-950/40 text-amber-300 border-amber-500/40 hover:bg-amber-900/60 hover:border-amber-400'
            : isConnected === false
            ? 'bg-rose-950/40 text-rose-300 border-rose-500/40 hover:bg-rose-900/60'
            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
        }`}
        title="Base de Datos en la Nube: Firebase Firestore (Google Cloud)"
      >
        <Flame className={`w-4 h-4 ${isConnected ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
        <span className="hidden sm:inline">
          {isConnected === true ? 'Firestore Nube Conectada' : 'Nube Firestore'}
        </span>
        <span
          className={`w-2 h-2 rounded-full ${
            isConnected === true ? 'bg-amber-400' : isConnected === false ? 'bg-rose-500' : 'bg-slate-400'
          }`}
        />
      </button>

      {/* Modal de Control de Base de Datos en la Nube */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative space-y-5 cursor-default max-h-[90vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                    Firebase Firestore
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      Sin Suspensión
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Base de datos NoSQL en tiempo real alojada en Google Cloud Platform
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Mensajes de estado */}
            {statusMessage && (
              <div
                className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 border ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                    : statusMessage.type === 'error'
                    ? 'bg-rose-950/50 border-rose-500/50 text-rose-300'
                    : 'bg-sky-950/50 border-sky-500/50 text-sky-300'
                }`}
              >
                {statusMessage.type === 'success' && <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />}
                {statusMessage.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />}
                {statusMessage.type === 'info' && <RefreshCw className="w-4 h-4 shrink-0 text-sky-400 animate-spin" />}
                <span>{statusMessage.text}</span>
              </div>
            )}

            {/* Botón Destacado Principal: Ir a la Consola de Firebase */}
            <a
              href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-amber-500/30 cursor-pointer no-underline uppercase tracking-wide"
            >
              <Flame className="w-5 h-5 fill-slate-950 stroke-slate-950" />
              <span>Abrir Consola de Firebase en Google</span>
              <span className="bg-slate-950/25 px-2 py-0.5 rounded text-[10px] font-mono font-bold">↗ ABRIR</span>
            </a>

            {/* Ficha técnica de la conexión */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Proyecto Google Cloud:</span>
                <span className="font-mono text-amber-300 font-semibold">{firebaseConfig.projectId}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Base de Datos Firestore:</span>
                <span className="font-mono text-slate-300 text-[11px] truncate max-w-[280px]" title={firebaseConfig.firestoreDatabaseId}>
                  {firebaseConfig.firestoreDatabaseId}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Estado de Servicio:</span>
                <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  24/7 Activo (Permanente)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Sincronización en Vivo:</span>
                <span className="text-teal-300 font-semibold">WebSockets / gRPC Tiempo Real</span>
              </div>
            </div>

            {/* Ventajas y Garantías */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Cero Suspensiones</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  A diferencia de servicios que se pausan tras 7 días de inactividad, Firestore permanece activo siempre.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Cloud className="w-4 h-4" />
                  <span>Sincronización POS & Celular</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Los pedidos realizados por clientes en la tienda virtual llegan instantáneamente a la pantalla del cajero.
                </p>
              </div>
            </div>

            {/* Acciones principales */}
            <div className="space-y-2 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleUploadAllToCloud}
                  disabled={isSyncing}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all cursor-pointer"
                >
                  {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowUpRight className="w-4 h-4" />}
                  <span>Subir Catálogo a Firestore</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadFromCloud}
                  disabled={isDownloading}
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
                >
                  {isDownloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span>Descargar de Firestore</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="w-full py-2 px-4 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {isTesting ? <RefreshCw className="w-4 h-4 animate-spin text-amber-400" /> : <CheckCircle className="w-4 h-4 text-amber-400" />}
                <span>Verificar y Probar Conexión con Google Cloud</span>
              </button>

              {/* Enlace directo a la consola de Firebase en la laptop */}
              <a
                href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer text-center no-underline shadow-sm"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Abrir Consola Web de Firebase en Google</span>
                <span className="text-[10px] bg-amber-400/20 px-1.5 py-0.5 rounded text-amber-200">↗ Nueva Pestaña</span>
              </a>
            </div>

            {/* Guía rápida para ingresar desde la laptop */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5 space-y-1.5 text-[11px] text-slate-400">
              <span className="font-bold text-slate-200 block">📌 Datos de acceso en tu Laptop:</span>
              <p>
                1. Entra en tu navegador a: <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-amber-400 underline font-mono">console.firebase.google.com</a>
              </p>
              <p>
                2. Inicia sesión con tu cuenta de Google actual.
              </p>
              <p>
                3. Selecciona tu proyecto: <strong className="text-white font-mono">{firebaseConfig.projectId}</strong>
              </p>
              <p>
                4. En el menú izquierdo ve a <strong className="text-amber-300">Compilación ➔ Firestore Database</strong> para ver tus tablas y registros en tiempo real.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
