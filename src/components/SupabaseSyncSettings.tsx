import React, { useState, useEffect } from 'react';
import { Database, Key, CheckCircle, AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import {
  getStoredSupabaseConfig,
  saveStoredSupabaseConfig,
  createCustomSupabaseClient,
  getSyncQueue,
  processSyncQueue,
} from '../lib/supabaseClient';

interface SupabaseSyncSettingsProps {
  onSyncSuccess?: () => void;
}

export const SupabaseSyncSettings: React.FC<SupabaseSyncSettingsProps> = ({ onSyncSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const initialConfig = getStoredSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(initialConfig.url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(initialConfig.anonKey);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queueCount, setQueueCount] = useState(0);

  useEffect(() => {
    const updateQueue = () => setQueueCount(getSyncQueue().length);
    updateQueue();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    const interval = setInterval(updateQueue, 3000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setStatusMessage({ text: 'Probando conexión con Supabase...', type: 'info' });
    try {
      const client = createCustomSupabaseClient(supabaseUrl, supabaseAnonKey);
      if (!client) {
        setStatusMessage({ text: 'URL o Llave anónima inválida.', type: 'error' });
        setIsTesting(false);
        return;
      }
      const { data, error } = await client.from('sucursales').select('count', { count: 'exact', head: true });
      if (error && error.code !== 'PGRST116') {
        setStatusMessage({ text: `Error de conexión: ${error.message}`, type: 'error' });
      } else {
        setStatusMessage({ text: '¡Conexión exitosa con Supabase PostgreSQL!', type: 'success' });
      }
    } catch (e: any) {
      setStatusMessage({ text: `Fallo al conectar: ${e.message || 'Sin conexión a internet'}`, type: 'error' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    setStatusMessage({ text: 'Sincronizando registros locales con Supabase...', type: 'info' });
    try {
      const client = createCustomSupabaseClient(supabaseUrl, supabaseAnonKey);
      if (!client) {
        setStatusMessage({ text: 'Configura las credenciales de Supabase primero.', type: 'error' });
        setIsSyncing(false);
        return;
      }
      const result = await processSyncQueue(client);
      setQueueCount(getSyncQueue().length);
      if (result.failed > 0) {
        setStatusMessage({
          text: `Sincronizados: ${result.success} | Pendientes por error: ${result.failed}`,
          type: 'info',
        });
      } else {
        setStatusMessage({
          text: `¡Todos los ${result.success} registros han sido sincronizados con la nube!`,
          type: 'success',
        });
      }
      if (onSyncSuccess) onSyncSuccess();
    } catch (e: any) {
      setStatusMessage({ text: `Error durante la sincronización: ${e.message}`, type: 'error' });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSupabaseConfig(supabaseUrl, supabaseAnonKey);
    setStatusMessage({
      text: '¡Configuración guardada! La aplicación ahora sincroniza con Supabase cuando hay internet.',
      type: 'success',
    });
    setTimeout(() => {
      setStatusMessage(null);
      setIsOpen(false);
      if (onSyncSuccess) onSyncSuccess();
    }, 1800);
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
          isOnline
            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            : 'bg-amber-950/80 hover:bg-amber-900/80 text-amber-200 border-amber-500/40'
        }`}
        title={isOnline ? 'Supabase Conectado (En Línea)' : 'Modo Offline Activo'}
      >
        {isOnline ? (
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <WifiOff className="w-3.5 h-3.5 text-amber-400" />
        )}
        <span className="hidden md:inline">{isOnline ? 'Supabase Online' : 'Modo Offline'}</span>
        {queueCount > 0 && (
          <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
            {queueCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" />
                Conectar Supabase (Offline-First)
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer text-lg leading-none"
              >
                &times;
              </button>
            </div>

            {/* Offline-First Architecture Banner */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-amber-400" />}
                  Estado: {isOnline ? 'Conexión a Internet Activa' : 'Sin Internet (Modo Local Offline)'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  queueCount > 0 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {queueCount > 0 ? `${queueCount} pendientes por subir` : '100% Sincronizado'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                La aplicación funciona de forma ininterrumpida si se cae la red. Al restablecerse la conexión, los datos se sincronizan automáticamente.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Project URL:
                </label>
                <input
                  type="text"
                  required
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://jfnpxkxnkriquvapzniy.supabase.co"
                  className="w-full bg-slate-950 border border-slate-700 font-mono text-xs text-emerald-400 p-2.5 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Anon Public Key (API Key):
                </label>
                <input
                  type="password"
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  className="w-full bg-slate-950 border border-slate-700 font-mono text-xs text-white p-2.5 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Supabase ➡️ ⚙️ Project Settings ➡️ API Keys ➡️ anon (public)
                </p>
              </div>

              {statusMessage && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    statusMessage.type === 'success'
                      ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300'
                      : statusMessage.type === 'info'
                      ? 'bg-sky-950/60 border border-sky-500/30 text-sky-300'
                      : 'bg-rose-950/60 border border-rose-500/30 text-rose-300'
                  }`}
                >
                  {statusMessage.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : statusMessage.type === 'info' ? (
                    <RefreshCw className="w-4 h-4 text-sky-400 shrink-0 animate-spin" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span>{statusMessage.text}</span>
                </div>
              )}

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer border border-slate-700 disabled:opacity-50"
                  >
                    {isTesting ? 'Probando...' : 'Probar Conexión'}
                  </button>
                  {queueCount > 0 && (
                    <button
                      type="button"
                      onClick={handleManualSync}
                      disabled={isSyncing || !isOnline}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                      Subir {queueCount} Pendientes
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cerrar
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs cursor-pointer"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

