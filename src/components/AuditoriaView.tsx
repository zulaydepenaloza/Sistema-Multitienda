import React, { useState, useMemo } from 'react';
import {
  ClipboardList,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Shield,
  Store,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  RefreshCw,
  Eye,
  Trash2,
  X,
  FileText,
  Tag,
  ArrowUpDown,
  TrendingUp,
  Layers,
  Sparkles,
} from 'lucide-react';
import { RegistroAuditoria, Usuario, Sucursal, EmpresaConfig } from '../types';

interface AuditoriaViewProps {
  logs: RegistroAuditoria[];
  usuarios: Usuario[];
  sucursales: Sucursal[];
  currentUser: Usuario | null;
  empresaConfig: EmpresaConfig;
  onClearLogs?: () => void;
}

export const AuditoriaView: React.FC<AuditoriaViewProps> = ({
  logs,
  usuarios,
  sucursales,
  currentUser,
  empresaConfig,
  onClearLogs,
}) => {
  const isGeneralManager = currentUser?.rol === 'admin';

  // Filters State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedUserFilter, setSelectedUserFilter] = useState<string>('all');
  const [selectedModuloFilter, setSelectedModuloFilter] = useState<string>('all');
  const [selectedAccionFilter, setSelectedAccionFilter] = useState<string>('all');
  const [selectedSucursalFilter, setSelectedSucursalFilter] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<'all' | 'today' | '3days' | '7days'>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Detail Modal State
  const [selectedLogForDetail, setSelectedLogForDetail] = useState<RegistroAuditoria | null>(null);

  // Success / notification message
  const [bannerMsg, setBannerMsg] = useState<string | null>(null);

  // Filtered and Sorted Logs
  const filteredLogs = useMemo(() => {
    return logs
      .filter((log) => {
        // Search Term (matches description, details, user name, username, module)
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matches =
            log.descripcion.toLowerCase().includes(term) ||
            (log.detalles && log.detalles.toLowerCase().includes(term)) ||
            log.usuario_nombre.toLowerCase().includes(term) ||
            (log.usuario_username && log.usuario_username.toLowerCase().includes(term)) ||
            log.modulo.toLowerCase().includes(term) ||
            log.tipo_accion.toLowerCase().includes(term) ||
            (log.sucursal_nombre && log.sucursal_nombre.toLowerCase().includes(term));

          if (!matches) return false;
        }

        // User filter
        if (selectedUserFilter !== 'all') {
          if (log.usuario_id?.toString() !== selectedUserFilter && log.usuario_nombre !== selectedUserFilter) {
            return false;
          }
        }

        // Modulo filter
        if (selectedModuloFilter !== 'all' && log.modulo !== selectedModuloFilter) {
          return false;
        }

        // Action filter
        if (selectedAccionFilter !== 'all' && log.tipo_accion !== selectedAccionFilter) {
          return false;
        }

        // Sucursal filter
        if (selectedSucursalFilter !== 'all') {
          if (selectedSucursalFilter === 'null' && log.sucursal_id !== null) return false;
          if (selectedSucursalFilter !== 'null' && log.sucursal_id?.toString() !== selectedSucursalFilter) {
            return false;
          }
        }

        // Date filter
        if (dateRangeFilter !== 'all') {
          const logDate = new Date(log.timestamp).getTime();
          const now = Date.now();
          if (dateRangeFilter === 'today') {
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            if (logDate < todayStart.getTime()) return false;
          } else if (dateRangeFilter === '3days') {
            if (now - logDate > 3 * 24 * 3600 * 1000) return false;
          } else if (dateRangeFilter === '7days') {
            if (now - logDate > 7 * 24 * 3600 * 1000) return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [
    logs,
    searchTerm,
    selectedUserFilter,
    selectedModuloFilter,
    selectedAccionFilter,
    selectedSucursalFilter,
    dateRangeFilter,
    sortOrder,
  ]);

  // Summary Metrics
  const todayLogsCount = useMemo(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    return logs.filter((l) => new Date(l.timestamp).getTime() >= todayStart.getTime()).length;
  }, [logs]);

  const uniqueUsersCount = useMemo(() => {
    const set = new Set(logs.map((l) => l.usuario_nombre));
    return set.size;
  }, [logs]);

  const modulesCoveredCount = useMemo(() => {
    const set = new Set(logs.map((l) => l.modulo));
    return set.size;
  }, [logs]);

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      alert('No hay registros de auditoría para exportar con los filtros actuales.');
      return;
    }

    const headers = [
      'ID Evento',
      'Fecha',
      'Hora',
      'Timestamp ISO',
      'Usuario',
      'Username',
      'Rol',
      'Cargo',
      'Sucursal',
      'Módulo',
      'Tipo de Acción',
      'Descripción',
      'Detalles Técnicos',
    ];

    const rows = filteredLogs.map((log) => [
      `"${log.id}"`,
      `"${log.fecha}"`,
      `"${log.hora}"`,
      `"${log.timestamp}"`,
      `"${(log.usuario_nombre || '').replace(/"/g, '""')}"`,
      `"${(log.usuario_username || '').replace(/"/g, '""')}"`,
      `"${log.usuario_rol || ''}"`,
      `"${(log.usuario_cargo || '').replace(/"/g, '""')}"`,
      `"${(log.sucursal_nombre || 'Global').replace(/"/g, '""')}"`,
      `"${log.modulo}"`,
      `"${log.tipo_accion}"`,
      `"${(log.descripcion || '').replace(/"/g, '""')}"`,
      `"${(log.detalles || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const fileDate = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `bitacora_auditoria_${empresaConfig.nombreEmpresa.toLowerCase().replace(/\s+/g, '_')}_${fileDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setBannerMsg(`¡Se han exportado exitosamente ${filteredLogs.length} registros de auditoría en formato CSV!`);
    setTimeout(() => setBannerMsg(null), 4000);
  };

  // Helper Badge Color for Action Type
  const getActionBadge = (action: RegistroAuditoria['tipo_accion']) => {
    switch (action) {
      case 'VENTA':
      case 'COBRO':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'COMPRA':
      case 'PAGO':
        return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
      case 'TRASPASO':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'CREAR':
        return 'bg-teal-500/15 text-teal-300 border-teal-500/30';
      case 'MODIFICAR':
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
      case 'ELIMINAR':
      case 'SISTEMA':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'CORTE_FISCAL':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'ACCESO':
        return 'bg-slate-700/60 text-slate-300 border-slate-600';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getModuleIcon = (modulo: RegistroAuditoria['modulo']) => {
    switch (modulo) {
      case 'POS / Ventas':
        return '🛒';
      case 'Inventario':
        return '📦';
      case 'Compras':
        return '🛍️';
      case 'Clientes':
        return '👥';
      case 'Proveedores':
        return '🚚';
      case 'CxC':
        return '💳';
      case 'CxP':
        return '🧾';
      case 'Reportes / Fiscal':
        return '📑';
      case 'Configuración':
        return '⚙️';
      case 'Seguridad':
        return '🛡️';
      case 'Tasa de Cambio':
        return '💵';
      default:
        return '📋';
    }
  };

  const getUserInitials = (name: string) => {
    if (!name) return 'US';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Alert if any */}
      {bannerMsg && (
        <div className="bg-emerald-950/60 border border-emerald-500/40 p-4 rounded-xl text-emerald-200 text-xs flex items-center justify-between gap-2.5 animate-fade-in shadow-lg">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{bannerMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setBannerMsg(null)}
            className="text-emerald-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Eventos</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white font-mono">{logs.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Registros almacenados</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Actividad Hoy</span>
            <div className="w-7 h-7 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-sky-400 font-mono">{todayLogsCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Operaciones realizadas hoy</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Usuarios Auditados</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-300 font-mono">{uniqueUsersCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Colaboradores con actividad</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Módulos Rastreados</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-300 font-mono">{modulesCoveredCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Áreas con registro activo</div>
        </div>
      </div>

      {/* Filter and Search Control Center */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-emerald-400" />
              <span>Bitácora de Auditoría y Trazabilidad de Usuarios</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Registro cronológico inmutable de cada acción, venta, compra, traspaso, cambio de permisos o configuración realizado por cada usuario.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              title="Descargar archivo .CSV con el historial filtrado"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Exportar a Excel / CSV</span>
            </button>

            {isGeneralManager && onClearLogs && (
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      '¿Estás seguro de que deseas purgar la bitácora de auditoría histórica? Esta acción es irreversible.'
                    )
                  ) {
                    onClearLogs();
                    setBannerMsg('Se ha reiniciado la bitácora de auditoría.');
                  }
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                title="Limpiar registros antiguos (Solo Administrador General)"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Limpiar Bitácora</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Text Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por descripción, usuario, detalle o módulo..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter by User */}
          <div>
            <select
              value={selectedUserFilter}
              onChange={(e) => setSelectedUserFilter(e.target.value)}
              aria-label="Filtrar por Usuario"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">👤 Todos los Usuarios</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id.toString()}>
                  {u.nombre_completo} ({u.cargo})
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Modulo */}
          <div>
            <select
              value={selectedModuloFilter}
              onChange={(e) => setSelectedModuloFilter(e.target.value)}
              aria-label="Filtrar por Módulo"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">📁 Todos los Módulos</option>
              <option value="POS / Ventas">🛒 POS / Ventas</option>
              <option value="Inventario">📦 Inventario</option>
              <option value="Compras">🛍️ Compras</option>
              <option value="Clientes">👥 Clientes</option>
              <option value="Proveedores">🚚 Proveedores</option>
              <option value="CxC">💳 Cuentas por Cobrar (CxC)</option>
              <option value="CxP">🧾 Cuentas por Pagar (CxP)</option>
              <option value="Reportes / Fiscal">📑 Reportes / Fiscal</option>
              <option value="Configuración">⚙️ Configuración</option>
              <option value="Seguridad">🛡️ Seguridad</option>
              <option value="Tasa de Cambio">💵 Tasa de Cambio</option>
            </select>
          </div>

          {/* Filter by Date Range */}
          <div>
            <select
              value={dateRangeFilter}
              onChange={(e) => setDateRangeFilter(e.target.value as any)}
              aria-label="Filtrar por Rango Temporal"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">📅 Todo el histórico</option>
              <option value="today">☀️ Hoy</option>
              <option value="3days">📆 Últimos 3 días</option>
              <option value="7days">🗓️ Últimos 7 días</option>
            </select>
          </div>
        </div>

        {/* Secondary quick chips */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 text-xs text-slate-400">
          <div className="flex items-center flex-wrap gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500">Acción:</span>
            {[
              { id: 'all', label: 'Todas' },
              { id: 'VENTA', label: 'Ventas' },
              { id: 'COMPRA', label: 'Compras' },
              { id: 'TRASPASO', label: 'Traspasos' },
              { id: 'COBRO', label: 'Cobros' },
              { id: 'PAGO', label: 'Pagos' },
              { id: 'MODIFICAR', label: 'Modificaciones' },
              { id: 'CORTE_FISCAL', label: 'Cortes X/Z' },
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setSelectedAccionFilter(chip.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                  selectedAccionFilter === chip.id
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Quick Sort Order */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 cursor-pointer"
              title="Cambiar orden cronológico"
            >
              <ArrowUpDown className="w-3 h-3 text-emerald-400" />
              <span>{sortOrder === 'desc' ? 'Más recientes primero' : 'Más antiguos primero'}</span>
            </button>

            <span className="text-[11px] text-slate-500">
              Mostrando <strong>{filteredLogs.length}</strong> de {logs.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-white">No se encontraron eventos en la bitácora</div>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              No hay actividades registradas que coincidan con los filtros de búsqueda seleccionados. Intenta restablecer los filtros para ver todo el historial.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedUserFilter('all');
                setSelectedModuloFilter('all');
                setSelectedAccionFilter('all');
                setSelectedSucursalFilter('all');
                setDateRangeFilter('all');
              }}
              className="mt-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
            >
              Restablecer todos los filtros
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                  <th className="py-3 px-4 w-40">Fecha y Hora</th>
                  <th className="py-3 px-4 w-52">Usuario / Colaborador</th>
                  <th className="py-3 px-4 w-36">Módulo / Área</th>
                  <th className="py-3 px-4 w-28">Acción</th>
                  <th className="py-3 px-4">Descripción de la Actividad</th>
                  <th className="py-3 px-4 w-24 text-right">Detalles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLogs.map((log) => {
                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-850/70 transition-colors group"
                    >
                      {/* Date & Time */}
                      <td className="py-3 px-4 whitespace-nowrap align-top">
                        <div className="font-mono font-bold text-white text-[11px] flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-emerald-400" />
                          <span>{log.fecha}</span>
                        </div>
                        <div className="font-mono text-slate-400 text-[10px] flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{log.hora}</span>
                        </div>
                      </td>

                      {/* User details */}
                      <td className="py-3 px-4 align-top">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] flex items-center justify-center border border-emerald-500/30 shrink-0">
                            {getUserInitials(log.usuario_nombre)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-white text-xs truncate">
                              {log.usuario_nombre}
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                              <span>{log.usuario_cargo || log.usuario_rol}</span>
                              {log.sucursal_nombre && (
                                <>
                                  <span className="text-slate-600">•</span>
                                  <span className="text-slate-400 truncate">{log.sucursal_nombre}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Modulo */}
                      <td className="py-3 px-4 whitespace-nowrap align-top">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-[11px] font-medium">
                          <span>{getModuleIcon(log.modulo)}</span>
                          <span>{log.modulo}</span>
                        </span>
                      </td>

                      {/* Action Type Badge */}
                      <td className="py-3 px-4 whitespace-nowrap align-top">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border uppercase tracking-wider ${getActionBadge(
                            log.tipo_accion
                          )}`}
                        >
                          {log.tipo_accion}
                        </span>
                      </td>

                      {/* Description */}
                      <td className="py-3 px-4 align-top">
                        <div className="text-slate-200 text-xs font-medium leading-relaxed">
                          {log.descripcion}
                        </div>
                        {log.detalles && (
                          <div className="text-[11px] text-slate-400 mt-1 line-clamp-1 group-hover:line-clamp-none transition-all">
                            {log.detalles}
                          </div>
                        )}
                      </td>

                      {/* View details button */}
                      <td className="py-3 px-4 text-right align-top">
                        <button
                          type="button"
                          onClick={() => setSelectedLogForDetail(log)}
                          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-medium flex items-center gap-1 ml-auto cursor-pointer transition-colors shadow-sm"
                          title="Ver desglose completo de este evento"
                        >
                          <Eye className="w-3 h-3 text-emerald-400" />
                          <span>Ver</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedLogForDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <ClipboardList className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Detalle de Registro de Auditoría</h4>
                  <p className="text-[10px] font-mono text-slate-400">ID: {selectedLogForDetail.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLogForDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              {/* Date & Time Grid */}
              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Fecha del Evento</span>
                  <div className="font-mono font-bold text-white text-xs mt-0.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{selectedLogForDetail.fecha}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Hora Exacta</span>
                  <div className="font-mono font-bold text-white text-xs mt-0.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span>{selectedLogForDetail.hora}</span>
                  </div>
                </div>
              </div>

              {/* User and Location */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Usuario y Sucursal</span>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center border border-emerald-500/30">
                    {getUserInitials(selectedLogForDetail.usuario_nombre)}
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">{selectedLogForDetail.usuario_nombre}</div>
                    <div className="text-[11px] text-slate-400">
                      Rol: <strong className="text-slate-300">{selectedLogForDetail.usuario_rol}</strong> | Cargo: {selectedLogForDetail.usuario_cargo}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Sucursal: {selectedLogForDetail.sucursal_nombre || 'Todas las Sucursales'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Module & Action */}
              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Módulo del Sistema</span>
                  <div className="font-bold text-white text-xs mt-0.5 flex items-center gap-1">
                    <span>{getModuleIcon(selectedLogForDetail.modulo)}</span>
                    <span>{selectedLogForDetail.modulo}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Tipo de Acción</span>
                  <div className="mt-0.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border uppercase ${getActionBadge(
                        selectedLogForDetail.tipo_accion
                      )}`}
                    >
                      {selectedLogForDetail.tipo_accion}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Descripción Completa</span>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-200 leading-relaxed font-medium">
                  {selectedLogForDetail.descripcion}
                </div>
              </div>

              {/* Extended Details */}
              {selectedLogForDetail.detalles && (
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Detalles Técnicos / Payload</span>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 font-mono text-[11px] leading-relaxed break-words">
                    {selectedLogForDetail.detalles}
                  </div>
                </div>
              )}

              <div className="text-[10px] font-mono text-slate-500 text-right">
                Timestamp ISO: {selectedLogForDetail.timestamp}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/60 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLogForDetail(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
