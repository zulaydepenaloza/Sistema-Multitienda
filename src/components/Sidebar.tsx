import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  ShoppingBag,
  Users,
  Truck,
  CreditCard,
  Receipt,
  FileText,
  Settings,
  Lock,
  Building2,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  TrendingUp,
  Store,
  Download,
  Code,
  PackageCheck,
  Globe,
} from 'lucide-react';
import { Usuario, EmpresaConfig, ModuloPermisos } from '../types';
import { formatBs } from '../lib/currency';
import { downloadStandaloneHtmlFile } from '../lib/downloadHtml';
import { AITechLogo } from './AITechLogo';

export type SidebarTab =
  | 'dashboard'
  | 'ventas'
  | 'pedidos_web'
  | 'inventario'
  | 'compras'
  | 'clientes'
  | 'proveedores'
  | 'cxc'
  | 'cxp'
  | 'reportes'
  | 'configuracion';

interface SidebarProps {
  activeTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
  currentUser: Usuario | null;
  empresaConfig: EmpresaConfig;
  onOpenRateModal: () => void;
  onLogout: () => void;
  onOpenHtmlModal?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  pendingWebOrdersCount?: number;
  onOpenClientStore?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  empresaConfig,
  onOpenRateModal,
  onLogout,
  onOpenHtmlModal,
  isCollapsed = false,
  onToggleCollapse,
  pendingWebOrdersCount = 0,
  onOpenClientStore,
}) => {
  const isGeneralManager = currentUser?.rol === 'admin';

  // Check if a user has access to a specific tab
  const hasAccess = (tab: SidebarTab): boolean => {
    if (!currentUser) return tab === 'ventas';
    if (isGeneralManager) return true;
    if (tab === 'pedidos_web') {
      return currentUser.rol === 'admin' || currentUser.rol === 'supervisor' || (currentUser.permisos?.pedidos_web ?? true);
    }
    if (currentUser.permisos && currentUser.permisos[tab] !== undefined) {
      return currentUser.permisos[tab];
    }
    // Default rule: non-manager can ONLY do ventas
    return tab === 'ventas';
  };

  const navItems: {
    id: SidebarTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeColor?: string;
    description: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Cuadro de Mando',
    },
    {
      id: 'ventas',
      label: 'Ventas (POS)',
      icon: ShoppingCart,
      description: 'Facturación Dual $ / Bs.',
    },
    {
      id: 'pedidos_web',
      label: 'Pedidos Web',
      icon: PackageCheck,
      badge: pendingWebOrdersCount > 0 ? String(pendingWebOrdersCount) : undefined,
      badgeColor: 'bg-amber-400 text-slate-950',
      description: 'E-commerce & Envíos',
    },
    {
      id: 'inventario',
      label: 'Inventario',
      icon: Package,
      description: 'Stock y Traspasos',
    },
    {
      id: 'compras',
      label: 'Compras',
      icon: ShoppingBag,
      description: 'Recepción y Stock',
    },
    {
      id: 'clientes',
      label: 'Clientes',
      icon: Users,
      description: 'Directorio y Créditos',
    },
    {
      id: 'proveedores',
      label: 'Proveedores',
      icon: Truck,
      description: 'Cuentas y Contactos',
    },
    {
      id: 'cxc',
      label: 'CxC',
      icon: CreditCard,
      description: 'Cuentas por Cobrar',
    },
    {
      id: 'cxp',
      label: 'CxP',
      icon: Receipt,
      description: 'Cuentas por Pagar',
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: FileText,
      description: 'Cortes X/Z y PDFs',
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: Settings,
      description: 'Usuarios, PINs y Permisos',
    },
  ];

  return (
    <aside
      id="main-sidebar"
      className={`${
        isCollapsed ? 'w-16 sm:w-[68px]' : 'w-64'
      } bg-slate-900 border-r border-slate-800/80 flex flex-col shrink-0 h-screen sticky top-0 text-slate-200 select-none z-30 transition-all duration-300 ease-in-out`}
    >
      {/* Brand & Company Banner */}
      <div className={`p-3.5 border-b border-slate-800/80 bg-slate-950/60 flex flex-col ${isCollapsed ? 'items-center' : ''}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} w-full gap-2`}>
          <div className="flex items-center gap-3 overflow-hidden">
            {empresaConfig.logoUrl ? (
              <img
                src={empresaConfig.logoUrl}
                alt="Logo"
                className="w-9 h-9 rounded-xl object-cover border border-emerald-500/30 shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 text-base shrink-0">
                {empresaConfig.nombreEmpresa.charAt(0)}
              </div>
            )}
            {!isCollapsed && (
              <div className="overflow-hidden">
                <h1 className="text-xs font-extrabold text-white truncate leading-tight">
                  {empresaConfig.nombreEmpresa}
                </h1>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold block truncate">
                  {empresaConfig.rif}
                </span>
              </div>
            )}
          </div>

          {/* Toggle Collapse/Expand Button */}
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              title={isCollapsed ? 'Expandir menú lateral' : 'Colapsar menú lateral hacia la izquierda'}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-emerald-300 border border-slate-700/80 transition-colors cursor-pointer shrink-0"
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-emerald-400" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Daily Exchange Rate Capsule */}
        {!isCollapsed ? (
          <button
            type="button"
            onClick={onOpenRateModal}
            title="Clic para actualizar la tasa oficial del día"
            className="w-full mt-3 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-emerald-300">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-medium">Tasa Hoy:</span>
            </div>
            <span className="font-mono font-bold text-emerald-400 text-xs">
              {formatBs(1, empresaConfig.tasaCambio)}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenRateModal}
            title={`Tasa Hoy: ${formatBs(1, empresaConfig.tasaCambio)} (Clic para cambiar)`}
            className="mt-2.5 p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 rounded-xl text-emerald-400 flex items-center justify-center transition-all cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1 custom-scrollbar">
        {!isCollapsed && (
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Módulos del Sistema</span>
            <span className="text-[9px] text-slate-600 font-normal">Autocolapsable</span>
          </div>
        )}

        {navItems.map((item) => {
          const allowed = hasAccess(item.id);
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              type="button"
              onClick={() => {
                if (allowed) {
                  onSelectTab(item.id);
                }
              }}
              disabled={!allowed}
              title={isCollapsed ? `${item.label} - ${item.description}` : undefined}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3 py-2.5'
              } rounded-xl text-xs font-semibold transition-all text-left group ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : allowed
                  ? 'text-slate-300 hover:bg-slate-800/80 hover:text-white cursor-pointer'
                  : 'text-slate-600 bg-slate-950/30 opacity-60 cursor-not-allowed border border-transparent'
              }`}
            >
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'} min-w-0`}>
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive
                      ? 'text-slate-950'
                      : allowed
                      ? 'text-emerald-400 group-hover:scale-110 transition-transform'
                      : 'text-slate-600'
                  }`}
                />
                {!isCollapsed && (
                  <div className="truncate">
                    <div className="truncate">{item.label}</div>
                    <div
                      className={`text-[10px] font-normal truncate ${
                        isActive ? 'text-slate-900/80' : 'text-slate-500'
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                )}
              </div>

              {!isCollapsed && !allowed && (
                <span title="Solo disponible para Gerente General o usuarios autorizados">
                  <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                </span>
              )}

              {!isCollapsed && allowed && item.badge && (
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                    item.badgeColor || 'bg-emerald-400 text-slate-950'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Dedicated Quick Action for Online Store / Digital Catalog */}
        {onOpenClientStore && (
          <div className="pt-2 mt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onOpenClientStore}
              title={isCollapsed ? 'Abrir Catálogo / Tienda Online' : undefined}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center p-2' : 'justify-between px-3 py-2.5'
              } rounded-xl bg-gradient-to-r from-emerald-950/50 to-teal-950/40 border border-emerald-500/30 hover:border-emerald-400/60 text-emerald-300 hover:text-white transition-all cursor-pointer group shadow-sm`}
            >
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'} min-w-0`}>
                <Globe className="w-4 h-4 text-emerald-400 shrink-0 group-hover:rotate-12 transition-transform" />
                {!isCollapsed && (
                  <div className="truncate text-left">
                    <div className="text-xs font-bold truncate">Catálogo Digital</div>
                    <div className="text-[10px] text-emerald-400/80 truncate">Modo Cliente Web</div>
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-mono font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">
                  VER
                </span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Current User & Security Badge */}
      <div className={`p-2.5 border-t border-slate-800/80 bg-slate-950/80 space-y-2 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
        {/* Quick HTML Standalone Downloader Button - Exclusively for General Manager */}
        {isGeneralManager && (
          <button
            type="button"
            onClick={() => {
              if (onOpenHtmlModal) {
                onOpenHtmlModal();
              } else {
                downloadStandaloneHtmlFile();
              }
            }}
            className={`w-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 hover:text-emerald-200 text-xs font-bold ${
              isCollapsed ? 'p-2 justify-center' : 'p-2 justify-between'
            } rounded-xl flex items-center transition-all cursor-pointer shadow-sm group`}
            title="Descargar archivo HTML autónomo (Exclusivo Gerente General)"
          >
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              {!isCollapsed && <span className="text-[11px]">Descargar .HTML</span>}
            </div>
            {!isCollapsed && (
              <span className="text-[9px] font-mono bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                Autónomo
              </span>
            )}
          </button>
        )}

        <div className={`flex items-center ${isCollapsed ? 'justify-center p-1.5' : 'justify-between p-2'} rounded-xl bg-slate-900 border border-slate-800 w-full`}>
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${
                isGeneralManager
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
              title={`${currentUser?.nombre_completo || 'Sin Sesión'} (${currentUser?.cargo || 'Operador'})`}
            >
              {isGeneralManager ? (
                <ShieldCheck className="w-4 h-4 text-purple-400" />
              ) : (
                <Store className="w-4 h-4 text-emerald-400" />
              )}
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">
                  {currentUser?.nombre_completo || 'Sin Sesión'}
                </div>
                <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                  <span>{currentUser?.cargo || 'Operador'}</span>
                  {isGeneralManager && (
                    <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1 rounded font-mono font-bold">
                      GERENTE
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              type="button"
              onClick={onLogout}
              title="Cerrar sesión / Cambiar usuario"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>

        {!isCollapsed && !isGeneralManager && (
          <div className="mt-1 text-[10px] text-amber-300/80 bg-amber-950/40 border border-amber-500/20 px-2 py-1 rounded-lg flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">Modo Restringido: Acceso a Ventas</span>
          </div>
        )}

        {/* Developer Attribution Footer */}
        {!isCollapsed ? (
          <div className="mt-2.5 pt-2 border-t border-slate-800/70 flex items-center justify-center gap-2 text-center">
            <AITechLogo size={20} variant="icon" theme="bronze" />
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[9px] text-slate-500 font-medium">Developed and designed by</span>
              <span className="text-[11px] font-bold text-amber-200/90 tracking-wide">
                AITech Soluciones, C. A.
              </span>
            </div>
          </div>
        ) : (
          <div
            className="mt-2 pt-2 border-t border-slate-800/70 flex justify-center cursor-help"
            title="Developed and designed by AITech Soluciones, C. A."
          >
            <AITechLogo size={18} variant="icon" theme="bronze" />
          </div>
        )}
      </div>
    </aside>
  );
};
