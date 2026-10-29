import React, { useState } from 'react';
import { Copy, Check, Terminal, Smartphone, Database, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { SQL_ETAPA1_SCRIPT } from '../data/mockData';

interface SqlViewerProps {
  onNextStage?: () => void;
}

export const SqlViewer: React.FC<SqlViewerProps> = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SQL_ETAPA1_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-emerald-900/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30">
              <Database className="w-3.5 h-3.5" /> ETAPA 1: Infraestructura y Base de Datos
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Script SQL PostgreSQL para Supabase
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Diseñado según los requerimientos del CTO: optimizado para PostgreSQL puro, con restricciones <code className="text-emerald-400 font-mono bg-slate-950/80 px-1.5 py-0.5 rounded">UNIQUE (sucursal_id, producto_id)</code>, claves foráneas, e índices de alto rendimiento.
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3 rounded-xl transition-all shadow-lg shadow-emerald-950/50 cursor-pointer self-start md:self-center whitespace-nowrap"
          >
            {copied ? <Check className="w-5 h-5 text-slate-950" /> : <Copy className="w-5 h-5" />}
            {copied ? '¡Copiado al portapapeles!' : 'Copiar Script SQL'}
          </button>
        </div>
      </div>

      {/* Grid: Instructions & Mobile Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SQL Code Block (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl">
          <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>supabase_schema_etapa1.sql</span>
            </div>
            <span className="text-[11px] text-slate-500">PostgreSQL 15+ Compatible</span>
          </div>

          <div className="p-4 overflow-x-auto max-h-[500px] text-xs font-mono text-emerald-300/90 leading-relaxed bg-slate-950 select-all">
            <pre className="whitespace-pre">{SQL_ETAPA1_SCRIPT}</pre>
          </div>
        </div>

        {/* Mobile Execution Instructions */}
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 text-slate-200">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
              <Smartphone className="w-5 h-5 text-emerald-400" />
              Cómo ejecutar en Supabase desde tu Celular
            </h3>

            <ol className="space-y-3 text-xs text-slate-300 list-decimal list-inside">
              <li className="leading-relaxed">
                Abre el navegador de tu teléfono (Chrome o Safari) e ingresa a <strong className="text-white">supabase.com</strong>.
              </li>
              <li className="leading-relaxed">
                Inicia sesión y selecciona tu proyecto o crea uno nuevo gratuito (Región más cercana).
              </li>
              <li className="leading-relaxed">
                En el menú lateral izquierdo (o tocando el menú <span className="bg-slate-800 px-1.5 py-0.5 rounded text-white font-mono">☰</span>), presiona en <strong className="text-emerald-400">SQL Editor</strong>.
              </li>
              <li className="leading-relaxed">
                Toca en <strong className="text-white">New query</strong> (Nueva consulta).
              </li>
              <li className="leading-relaxed">
                Pega el código SQL copiado arriba dentro del cuadro de texto.
              </li>
              <li className="leading-relaxed">
                Presiona el botón verde <strong className="text-emerald-400">Run</strong> (o <strong className="text-emerald-400">Ctrl+Enter</strong>) en la parte inferior.
              </li>
            </ol>

            <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-start gap-2.5 text-xs text-emerald-300 bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p>
                <strong>Resultado esperado:</strong> Verás el mensaje <code className="bg-slate-950 px-1 py-0.5 rounded font-mono">Success. No rows returned</code> o las filas insertadas con éxito.
              </p>
            </div>
          </div>

          {/* Table Details */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 text-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Estructura de las 5 Tablas Creadas
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex justify-between items-center bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                <span className="font-mono text-emerald-400 font-semibold">sucursales</span>
                <span className="text-slate-400">2 Tiendas + 1 Oficina</span>
              </li>
              <li className="flex justify-between items-center bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                <span className="font-mono text-emerald-400 font-semibold">productos</span>
                <span className="text-slate-400">Código barras UNIQUE</span>
              </li>
              <li className="flex justify-between items-center bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                <span className="font-mono text-emerald-400 font-semibold">inventario</span>
                <span className="text-slate-400">UNIQUE (sucursal, producto)</span>
              </li>
              <li className="flex justify-between items-center bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                <span className="font-mono text-emerald-400 font-semibold">ventas</span>
                <span className="text-slate-400">Encabezado + Sucursal</span>
              </li>
              <li className="flex justify-between items-center bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                <span className="font-mono text-emerald-400 font-semibold">detalle_ventas</span>
                <span className="text-slate-400">Ítems vendidos por venta</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
