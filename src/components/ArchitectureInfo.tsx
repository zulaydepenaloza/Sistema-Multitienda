import React from 'react';
import { Server, Cpu, HardDrive, DollarSign, ShieldAlert, Zap, Layers, Code2, ArrowRight } from 'lucide-react';

export const ArchitectureInfo: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30">
          <Server className="w-3.5 h-3.5" /> Plan CTO de Arquitectura Ligera ($0/mes)
        </div>
        <h2 className="text-xl sm:text-2xl font-bold">
          Estrategia de Optimización de Recursos (&lt;50MB RAM en Render)
        </h2>
        <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
          Para garantizar que el backend FastAPI se ejecute dentro del límite gratuito de Render (512MB RAM) sin sobrecostos ni caídas, utilizamos SQL nativo con <code className="text-emerald-400 font-mono bg-slate-950 px-1.5 py-0.5 rounded">psycopg2-binary</code> y evitamos ORMs pesados como SQLAlchemy.
        </p>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Supabase Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                BASE DE DATOS
              </span>
              <span className="text-xs font-bold text-emerald-400">$0.00 / mes</span>
            </div>
            <h3 className="font-bold text-white text-base">Supabase (PostgreSQL 15)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              500 MB de almacenamiento gratuito, backups automáticos y ejecución de SQL directo vía consola web desde el celular.
            </p>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 border-t border-slate-800 pt-3">
            <li className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-emerald-400" /> Transacciones atómicas en SQL
            </li>
            <li className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-emerald-400" /> Restricción Composite UNIQUE
            </li>
          </ul>
        </div>

        {/* Render FastAPI Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                BACKEND
              </span>
              <span className="text-xs font-bold text-emerald-400">$0.00 / mes</span>
            </div>
            <h3 className="font-bold text-white text-base">Render (FastAPI Python)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Servidor Uvicorn + FastAPI ultra ligero. Consume sólo ~28MB a ~40MB de memoria RAM en reposo.
            </p>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 border-t border-slate-800 pt-3">
            <li className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" /> Sin ORMs pesados (SQL puro)
            </li>
            <li className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" /> Asíncrono con Uvicorn
            </li>
          </ul>
        </div>

        {/* Hardware & Hardware Input Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                HARDWARE Y FRONTEND
              </span>
              <span className="text-xs font-bold text-emerald-400">Sin costo licencias</span>
            </div>
            <h3 className="font-bold text-white text-base">Windows + Lectores USB</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lectores genéricos en emulación de teclado USB. Funciona en cualquier navegador de las tiendas sin instalar software pesado.
            </p>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 border-t border-slate-800 pt-3">
            <li className="flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-emerald-400" /> HTML + Tailwind CDN v4
            </li>
            <li className="flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-emerald-400" /> Vanilla JavaScript nativo
            </li>
          </ul>
        </div>
      </div>

      {/* Stages Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4">
        <h3 className="font-bold text-base text-white">Roadmap de Desarrollo Paso a Paso</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-xl space-y-1">
            <span className="font-bold text-emerald-400 block">ETAPA 1 (Actual)</span>
            <span className="text-white font-semibold block">Infraestructura & Script SQL</span>
            <span className="text-slate-400 block">Tablas, FK, UNIQUE, índices e INSERTs de prueba en Supabase.</span>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="font-bold text-slate-400 block">ETAPA 2 (Siguiente)</span>
            <span className="text-white font-semibold block">Servidor FastAPI en Python</span>
            <span className="text-slate-400 block">Endpoints de ventas, inventario y conexión con psycopg2 en Render.</span>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="font-bold text-slate-400 block">ETAPA 3 (Final)</span>
            <span className="text-white font-semibold block">Frontend Móvil & POS Único</span>
            <span className="text-slate-400 block">HTML5 + Tailwind CDN v4 + Vanilla JS para escaneo e interfaz ligera.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
