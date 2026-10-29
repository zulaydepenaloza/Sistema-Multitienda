import React from 'react';
import { 
  Building2, 
  ShoppingCart, 
  Database, 
  Package, 
  Activity, 
  Smartphone, 
  FileCode, 
  Briefcase, 
  FileText, 
  DollarSign, 
  Settings, 
  Edit3 
} from 'lucide-react';
import { EmpresaConfig } from '../types';
import { formatUSD, formatBs } from '../lib/currency';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unitsToday: number;
  totalSalesToday: number;
  empresaConfig: EmpresaConfig;
  onOpenCompanySettings: () => void;
  onOpenDailyRateModal: () => void;
  onRefreshData?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  unitsToday,
  totalSalesToday,
  empresaConfig,
  onOpenCompanySettings,
  onOpenDailyRateModal,
  onRefreshData,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between py-3 gap-3">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-purple-500/20 to-emerald-500/20 text-emerald-400 p-2.5 rounded-2xl border border-emerald-500/30 flex items-center justify-center text-xl shadow-inner">
              {empresaConfig.logoUrl ? (
                <span>{empresaConfig.logoUrl}</span>
              ) : (
                <Building2 className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg text-slate-100 leading-tight">
                  {empresaConfig.nombreEmpresa}
                </h1>
                <span className="bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-purple-500/30">
                  {empresaConfig.rif}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="text-slate-500 font-mono text-[11px]">{empresaConfig.telefono}</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-medium">Multi-Tienda POS & Inventario</span>
              </p>
            </div>
          </div>

          {/* Quick Metrics, Daily Rate Pill & Settings Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Daily Exchange Rate Pill */}
            <button
              onClick={onOpenDailyRateModal}
              className="flex items-center gap-2 bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-xs transition-all shadow-sm cursor-pointer group"
              title="Haz clic para actualizar la cotización del día"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-emerald-400/80 font-bold uppercase tracking-wider leading-none flex items-center gap-1">
                  Tasa del Día <Edit3 className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
                </span>
                <span className="font-bold font-mono text-xs text-white">
                  1 USD = {formatBs(1, empresaConfig.tasaCambio)}
                </span>
              </div>
            </button>

            {/* Sales Metrics in Dual Currency */}
            <div className="flex items-center space-x-3 bg-slate-950/90 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs shadow-inner">
              <div>
                <span className="text-slate-400 text-[10px] block leading-none">Unidades:</span>
                <span className="font-bold text-emerald-400 text-xs">{unitsToday} un.</span>
              </div>
              <div className="h-5 w-px bg-slate-800"></div>
              <div>
                <span className="text-slate-400 text-[10px] block leading-none">Ventas Hoy:</span>
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="font-bold text-white text-xs">{formatUSD(totalSalesToday)}</span>
                  <span className="text-[10px] text-emerald-400">({formatBs(totalSalesToday, empresaConfig.tasaCambio)})</span>
                </div>
              </div>
            </div>

            {/* Company Settings Button */}
            <button
              onClick={onOpenCompanySettings}
              className="bg-purple-950/60 hover:bg-purple-900 text-purple-300 border border-purple-500/40 p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Configuración de Empresa, Datos Fiscales y Nombres de Tiendas"
            >
              <Settings className="w-4 h-4 text-purple-400" />
              <span className="hidden sm:inline">Empresa</span>
            </button>

          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('gerencia')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'gerencia'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-purple-300 hover:text-white hover:bg-purple-950/50 border border-purple-800/40'
            }`}
          >
            <Briefcase className="w-4 h-4 text-purple-400" />
            Dashboard Gerencia General
          </button>

          <button
            onClick={() => setActiveTab('documentos_pdf')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'documentos_pdf'
                ? 'bg-gradient-to-r from-purple-600 to-emerald-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-950 text-emerald-400 hover:text-white hover:bg-slate-800 border border-emerald-500/40'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            Informes & PDFs (Técnico y Gerente)
          </button>

          <button
            onClick={() => setActiveTab('frontend_html')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'frontend_html'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileCode className="w-4 h-4" />
            Frontend Único (HTML Standalone)
          </button>

          <button
            onClick={() => setActiveTab('pos')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'pos'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Punto de Venta (Lector USB)
          </button>

          <button
            onClick={() => setActiveTab('inventario')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'inventario'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Package className="w-4 h-4" />
            Inventario Multi-Sucursal
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'sql'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Database className="w-4 h-4" />
            Script SQL Supabase
          </button>

          <button
            onClick={() => setActiveTab('arquitectura')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'arquitectura'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-4 h-4" />
            Topología Multi-Equipo
          </button>
        </nav>
      </div>
    </header>
  );
};
