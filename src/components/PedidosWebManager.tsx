import React, { useState, useMemo } from 'react';
import {
  PackageCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  Building2,
  Phone,
  MessageCircle,
  Printer,
  Settings,
  Share2,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  X,
  FileText,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Sparkles,
  QrCode,
  Copy,
  Check,
  Send,
  Eye,
  ArrowRight
} from 'lucide-react';
import {
  PedidoOnline,
  TiendaConfig,
  Sucursal,
  EmpresaConfig,
  Usuario,
  Producto,
  DetallePagoVenta
} from '../types';
import { formatUSD, formatBs, isMockDefaultPhone, cleanMobileDigits } from '../lib/currency';

interface PedidosWebManagerProps {
  pedidosOnline: PedidoOnline[];
  tiendaConfig: TiendaConfig;
  sucursales: Sucursal[];
  empresaConfig: EmpresaConfig;
  currentUser: Usuario | null;
  onActualizarEstadoPedido: (pedidoId: string, nuevoEstado: PedidoOnline['estado']) => void;
  onFacturarPedidoAlPos: (pedido: PedidoOnline) => void;
  onActualizarTiendaConfig: (config: TiendaConfig) => void;
  onAbrirTiendaCliente: () => void;
}

export const PedidosWebManager: React.FC<PedidosWebManagerProps> = ({
  pedidosOnline,
  tiendaConfig,
  sucursales,
  empresaConfig,
  currentUser,
  onActualizarEstadoPedido,
  onFacturarPedidoAlPos,
  onActualizarTiendaConfig,
  onAbrirTiendaCliente,
}) => {
  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | PedidoOnline['estado']>('todos');
  const [selectedPedido, setSelectedPedido] = useState<PedidoOnline | null>(null);

  // Modals
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showComandaModal, setShowComandaModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Tienda Config Temporary Form State
  const [configForm, setConfigForm] = useState<TiendaConfig>(tiendaConfig);

  // Sync config form when prop changes
  React.useEffect(() => {
    setConfigForm(tiendaConfig);
  }, [tiendaConfig]);

  // Filtered Orders
  const filteredPedidos = useMemo(() => {
    return pedidosOnline.filter(p => {
      const matchSearch =
        searchTerm.trim() === '' ||
        p.numeroPedido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.clienteTelefono.includes(searchTerm) ||
        p.clienteRif.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'todos' || p.estado === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [pedidosOnline, searchTerm, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = pedidosOnline.length;
    const pendientes = pedidosOnline.filter(p => p.estado === 'pendiente').length;
    const enProceso = pedidosOnline.filter(p => p.estado === 'confirmado' || p.estado === 'preparando' || p.estado === 'despachado').length;
    const entregados = pedidosOnline.filter(p => p.estado === 'entregado').length;
    const totalVentasUSD = pedidosOnline
      .filter(p => p.estado !== 'cancelado')
      .reduce((acc, p) => acc + p.total, 0);

    return { total, pendientes, enProceso, entregados, totalVentasUSD };
  }, [pedidosOnline]);

  // Status Styling Helper
  const getStatusBadge = (estado: PedidoOnline['estado']) => {
    switch (estado) {
      case 'pendiente':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            Pendiente por Aprobar
          </span>
        );
      case 'confirmado':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <CheckCircle2 className="w-3 h-3" />
            Pago Confirmado
          </span>
        );
      case 'preparando':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <PackageCheck className="w-3 h-3" />
            En Preparación
          </span>
        );
      case 'despachado':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
            <Truck className="w-3 h-3" />
            En Despacho / Delivery
          </span>
        );
      case 'entregado':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            Entregado & Facturado
          </span>
        );
      case 'cancelado':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
            <X className="w-3 h-3" />
            Cancelado
          </span>
        );
    }
  };

  // WhatsApp Action for Store Attendant
  const handleOpenClientWhatsApp = (pedido: PedidoOnline) => {
    const rawNumber = pedido.clienteTelefono.replace(/\D/g, '');
    const cleanNumber = rawNumber.startsWith('58') ? rawNumber : `58${rawNumber.replace(/^0/, '')}`;
    const text = encodeURIComponent(
      `¡Hola ${pedido.clienteNombre}! Le escribimos de *${tiendaConfig.nombreTienda}* con respecto a su pedido en línea *#${pedido.numeroPedido}*. Su orden está en estado: *${pedido.estado.toUpperCase()}*. Quedamos a su orden para cualquier consulta.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  // Public Store Link
  const realStoreWs = !isMockDefaultPhone(tiendaConfig.whatsappContacto)
    ? tiendaConfig.whatsappContacto
    : (!isMockDefaultPhone(empresaConfig?.telefono) ? empresaConfig.telefono : '');
  const cleanWs = cleanMobileDigits(realStoreWs);
  const wsQuery = cleanWs ? `&ws=${encodeURIComponent(cleanWs)}` : '';
  const publicStoreUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?vista=tienda${wsQuery}`
    : `https://miapp.com?vista=tienda${wsQuery}`;

  const copyStoreLink = () => {
    navigator.clipboard.writeText(publicStoreUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header with quick stats & actions */}
      <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
              <ShoppingBag className="w-4 h-4" />
              <span>Módulo E-Commerce & Pedidos Web</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Gestión de Pedidos en Línea
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Recepción de órdenes de clientes desde la tienda pública o teléfono móvil con sincronización a caja.
            </p>
          </div>

          {/* Quick buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onAbrirTiendaCliente}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              title="Abre la tienda web en modo cliente tal como la ven tus usuarios"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ver Catálogo en Vivo</span>
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-2 border border-slate-700 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-teal-400" />
              <span>Compartir / QR</span>
            </button>

            <button
              onClick={() => setShowConfigModal(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-2 border border-slate-700 transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>Configuración Tienda</span>
            </button>
          </div>
        </div>

        {/* 4 Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[11px] text-slate-400 block font-medium">Pedidos Pendientes:</span>
            <span className="text-xl font-black text-amber-400 mt-0.5 block">{stats.pendientes}</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[11px] text-slate-400 block font-medium">En Preparación / Delivery:</span>
            <span className="text-xl font-black text-teal-400 mt-0.5 block">{stats.enProceso}</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[11px] text-slate-400 block font-medium">Entregados & Facturados:</span>
            <span className="text-xl font-black text-emerald-400 mt-0.5 block">{stats.entregados}</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[11px] text-slate-400 block font-medium">Total Pedidos Recibidos:</span>
            <span className="text-xl font-black text-white mt-0.5 block">${stats.totalVentasUSD.toFixed(2)} USD</span>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por # pedido, cliente, RIF o teléfono..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setStatusFilter('todos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
              statusFilter === 'todos'
                ? 'bg-slate-800 text-white font-bold border border-slate-700'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            Todos ({pedidosOnline.length})
          </button>
          <button
            onClick={() => setStatusFilter('pendiente')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
              statusFilter === 'pendiente'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            Pendientes ({stats.pendientes})
          </button>
          <button
            onClick={() => setStatusFilter('confirmado')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
              statusFilter === 'confirmado'
                ? 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/40'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            Confirmados
          </button>
          <button
            onClick={() => setStatusFilter('preparando')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
              statusFilter === 'preparando'
                ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            En Preparación
          </button>
          <button
            onClick={() => setStatusFilter('despachado')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
              statusFilter === 'despachado'
                ? 'bg-teal-500/20 text-teal-300 font-bold border border-teal-500/40'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            En Despacho
          </button>
          <button
            onClick={() => setStatusFilter('entregado')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
              statusFilter === 'entregado'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            Entregados
          </button>
        </div>
      </div>

      {/* Orders Table */}
      {filteredPedidos.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
          <PackageCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No hay pedidos web en este filtro</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Cuando los clientes hagan compras desde el catálogo en línea, aparecerán listados aquí para ser procesados.
          </p>
          <button
            onClick={onAbrirTiendaCliente}
            className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Probar Realizando un Pedido en la Tienda
          </button>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Orden / Fecha</th>
                  <th className="py-3 px-4">Cliente / Contacto</th>
                  <th className="py-3 px-4">Entrega</th>
                  <th className="py-3 px-4">Artículos</th>
                  <th className="py-3 px-4">Pago & Ref</th>
                  <th className="py-3 px-4 text-right">Total ($ / Bs)</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredPedidos.map(pedido => {
                  const itemCount = pedido.detalles.reduce((acc, d) => acc + d.cantidad, 0);

                  return (
                    <tr key={pedido.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-medium text-white">
                        <div className="font-bold text-emerald-400">{pedido.numeroPedido}</div>
                        <div className="text-[11px] text-slate-500">
                          {new Date(pedido.fecha).toLocaleDateString('es-VE')} {new Date(pedido.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{pedido.clienteNombre}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <span>{pedido.clienteRif}</span>
                          <span>·</span>
                          <span className="text-emerald-400">{pedido.clienteTelefono}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {pedido.tipoEntrega === 'delivery' ? (
                          <div>
                            <span className="font-bold text-teal-300 flex items-center gap-1">
                              <Truck className="w-3 h-3" /> Delivery
                            </span>
                            <span className="text-[11px] text-slate-400 block truncate max-w-[180px]" title={pedido.direccionEntrega}>
                              {pedido.direccionEntrega}
                            </span>
                          </div>
                        ) : (
                          <div>
                            <span className="font-bold text-blue-300 flex items-center gap-1">
                              <Building2 className="w-3 h-3" /> Retiro
                            </span>
                            <span className="text-[11px] text-slate-400 block">
                              {pedido.sucursalNombre || 'Tienda Principal'}
                            </span>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-white">{itemCount} items</span>
                        <div className="text-[11px] text-slate-500 truncate max-w-[150px]">
                          {pedido.detalles.map(d => `${d.cantidad}x ${d.productoNombre}`).join(', ')}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="capitalize font-semibold text-slate-200">
                          {pedido.metodoPago.replace('_', ' ')}
                        </div>
                        {pedido.referenciaPago && (
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                            Ref: {pedido.referenciaPago}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right font-mono">
                        <div className="font-black text-emerald-400">${pedido.total.toFixed(2)}</div>
                        <div className="text-[10px] text-slate-500">
                          Bs. {pedido.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 1 })}
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {getStatusBadge(pedido.estado)}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedPedido(pedido)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
                            title="Ver detalles completos del pedido"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleOpenClientWhatsApp(pedido)}
                            className="p-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-colors cursor-pointer"
                            title="Notificar o chatear por WhatsApp con el cliente"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>

                          {pedido.estado !== 'entregado' && (
                            <button
                              onClick={() => onFacturarPedidoAlPos(pedido)}
                              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-[11px] flex items-center gap-1 transition-all cursor-pointer"
                              title="Aprobar el pedido, registrar venta en caja y generar factura"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Facturar</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details & Processing Modal */}
      {selectedPedido && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden my-6">
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Detalle de Orden #{selectedPedido.numeroPedido}</h3>
                  <p className="text-xs text-slate-400">
                    {new Date(selectedPedido.fecha).toLocaleString('es-VE')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPedido(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Status and Action banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Estado actual:</span>
                  {getStatusBadge(selectedPedido.estado)}
                </div>

                <div className="flex items-center gap-1.5">
                  <select
                    value={selectedPedido.estado}
                    onChange={e => {
                      const nuevo = e.target.value as PedidoOnline['estado'];
                      onActualizarEstadoPedido(selectedPedido.id, nuevo);
                      setSelectedPedido({ ...selectedPedido, estado: nuevo });
                    }}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="preparando">Preparando</option>
                    <option value="despachado">Despachado</option>
                    <option value="entregado">Entregado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              {/* Customer & Delivery Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80 space-y-1.5">
                  <h4 className="font-bold text-emerald-400 uppercase text-[10px] tracking-wider">Cliente</h4>
                  <p className="font-bold text-white text-sm">{selectedPedido.clienteNombre}</p>
                  <p className="text-slate-400">RIF/CI: {selectedPedido.clienteRif}</p>
                  <p className="text-slate-400 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-400" />
                    <span>{selectedPedido.clienteTelefono}</span>
                  </p>
                  {selectedPedido.clienteEmail && (
                    <p className="text-slate-400">{selectedPedido.clienteEmail}</p>
                  )}
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80 space-y-1.5">
                  <h4 className="font-bold text-teal-400 uppercase text-[10px] tracking-wider">Despacho / Entrega</h4>
                  <p className="font-bold text-white capitalize">{selectedPedido.tipoEntrega === 'delivery' ? '🛵 A Domicilio' : '🏬 Retiro en Tienda'}</p>
                  {selectedPedido.tipoEntrega === 'delivery' ? (
                    <>
                      <p className="text-slate-300">{selectedPedido.direccionEntrega}</p>
                      {selectedPedido.puntoReferencia && (
                        <p className="text-slate-500 text-[11px]">Ref: {selectedPedido.puntoReferencia}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-slate-300">Sucursal: {selectedPedido.sucursalNombre}</p>
                  )}
                </div>
              </div>

              {/* Order Items Table */}
              <div>
                <h4 className="font-bold text-white text-xs mb-2">Productos Solicitados</h4>
                <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[10px] uppercase">
                      <tr>
                        <th className="py-2 px-3">Producto</th>
                        <th className="py-2 px-3 text-center">Cant.</th>
                        <th className="py-2 px-3 text-right">PVP Unit.</th>
                        <th className="py-2 px-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {selectedPedido.detalles.map((d, i) => (
                        <tr key={i} className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-3">
                            <span className="font-semibold text-white block">{d.productoNombre}</span>
                            {d.exentoIva ? (
                              <span className="text-[10px] text-emerald-400">Exento de IVA</span>
                            ) : (
                              <span className="text-[10px] text-slate-500">+16% IVA</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold text-white">
                            {d.cantidad} {d.unidad_medida || 'UND'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-300">
                            ${d.precioUnitario.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                            ${d.subtotal.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment & Totals Breakdown */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal Neto:</span>
                  <span className="font-mono">${selectedPedido.subtotalNeto.toFixed(2)} USD</span>
                </div>
                {selectedPedido.montoIva > 0 && (
                  <div className="flex justify-between text-slate-400">
                    <span>IVA (16%):</span>
                    <span className="font-mono">${selectedPedido.montoIva.toFixed(2)} USD</span>
                  </div>
                )}
                {selectedPedido.costoDelivery > 0 && (
                  <div className="flex justify-between text-slate-400">
                    <span>Costo Delivery:</span>
                    <span className="font-mono">${selectedPedido.costoDelivery.toFixed(2)} USD</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline text-white">
                  <span className="font-bold text-sm">Total del Pedido:</span>
                  <div className="text-right">
                    <span className="text-lg font-black text-emerald-400 font-mono">
                      ${selectedPedido.total.toFixed(2)} USD
                    </span>
                    <span className="block text-xs text-slate-400 font-mono">
                      Bs. {selectedPedido.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex flex-wrap justify-between gap-2">
                  <span>
                    Método: <strong className="text-white capitalize">{selectedPedido.metodoPago.replace('_', ' ')}</strong>
                  </span>
                  {selectedPedido.referenciaPago && (
                    <span>
                      Ref: <strong className="text-white font-mono">{selectedPedido.referenciaPago}</strong>
                    </span>
                  )}
                  {selectedPedido.bancoOrigen && (
                    <span>
                      Banco: <strong className="text-white">{selectedPedido.bancoOrigen}</strong>
                    </span>
                  )}
                </div>

                {selectedPedido.notas && (
                  <div className="p-2 bg-slate-900 rounded-lg text-slate-300 text-[11px] mt-2">
                    <span className="text-slate-500 font-bold block">Notas del cliente:</span>
                    {selectedPedido.notas}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <button
                  onClick={() => handleOpenClientWhatsApp(selectedPedido)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar WhatsApp</span>
                </button>

                <div className="flex items-center gap-2">
                  {selectedPedido.estado !== 'entregado' && (
                    <button
                      onClick={() => {
                        onFacturarPedidoAlPos(selectedPedido);
                        setSelectedPedido(null);
                      }}
                      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Aprobar & Facturar en POS</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share / QR Code Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-center space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <QrCode className="w-5 h-5 text-emerald-400" />
                <span>Enlace & Código QR de tu Tienda</span>
              </div>
              <button onClick={() => setShowShareModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Comparte este enlace o imprime el código QR en volantes, redes sociales o en el mostrador para que tus clientes compren desde su teléfono.
            </p>

            {/* QR Mock graphic */}
            <div className="bg-white p-4 rounded-2xl w-48 h-48 mx-auto flex flex-col items-center justify-center shadow-lg border border-slate-200">
              <QrCode className="w-36 h-36 text-slate-950" />
              <span className="text-[10px] text-slate-700 font-bold mt-1">Escanea para comprar</span>
            </div>

            {/* URL input with copy button */}
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs">
              <input
                type="text"
                readOnly
                value={publicStoreUrl}
                className="bg-transparent text-slate-300 text-xs w-full focus:outline-none font-mono"
              />
              <button
                onClick={copyStoreLink}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs shrink-0 flex items-center gap-1 transition-all cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={onAbrirTiendaCliente}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 text-emerald-400" />
                <span>Abrir Tienda en esta pestaña</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Store Settings Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden my-6">
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Configuración del Catálogo Digital</h3>
                  <p className="text-xs text-slate-400">Parámetros de entrega, WhatsApp y datos de pago</p>
                </div>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                onActualizarTiendaConfig(configForm);
                setShowConfigModal(false);
              }}
              className="p-5 space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nombre Comercial de la Tienda</label>
                  <input
                    type="text"
                    value={configForm.nombreTienda}
                    onChange={e => setConfigForm({ ...configForm, nombreTienda: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">WhatsApp para Recibir Pedidos</label>
                  <input
                    type="text"
                    value={configForm.whatsappContacto}
                    onChange={e => setConfigForm({ ...configForm, whatsappContacto: e.target.value })}
                    placeholder="+58 412 1234567"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Horario de Atención</label>
                <input
                  type="text"
                  value={configForm.horarioAtencion || ''}
                  onChange={e => setConfigForm({ ...configForm, horarioAtencion: e.target.value })}
                  placeholder="Lunes a Domingo: 8:00 AM – 7:30 PM"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Banner Promocional Superior</label>
                <input
                  type="text"
                  value={configForm.bannerPromo || ''}
                  onChange={e => setConfigForm({ ...configForm, bannerPromo: e.target.value })}
                  placeholder="⚡ Envíos gratis por compras superiores a $30..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Costo Fijo de Delivery (USD)</label>
                  <input
                    type="number"
                    step="0.10"
                    min="0"
                    value={configForm.costoDeliveryFijo}
                    onChange={e => setConfigForm({ ...configForm, costoDeliveryFijo: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Mínimo para Delivery Gratis (USD)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={configForm.deliveryGratisMinimo}
                    onChange={e => setConfigForm({ ...configForm, deliveryGratisMinimo: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-800">
                <h4 className="font-bold text-emerald-400 uppercase text-[10px] tracking-wider">
                  Datos de Pago Móvil Mostrados al Cliente
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-1">Banco</label>
                    <input
                      type="text"
                      value={configForm.pagoMovilBanco}
                      onChange={e => setConfigForm({ ...configForm, pagoMovilBanco: e.target.value })}
                      placeholder="Banesco (0134)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-1">Teléfono</label>
                    <input
                      type="text"
                      value={configForm.pagoMovilTelefono}
                      onChange={e => setConfigForm({ ...configForm, pagoMovilTelefono: e.target.value })}
                      placeholder="0412-1234567"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-1">Cédula / RIF</label>
                    <input
                      type="text"
                      value={configForm.pagoMovilRif}
                      onChange={e => setConfigForm({ ...configForm, pagoMovilRif: e.target.value })}
                      placeholder="J-12345678-0"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-800">
                <h4 className="font-bold text-purple-400 uppercase text-[10px] tracking-wider">
                  Datos de Zelle
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-1">Titular de la cuenta</label>
                    <input
                      type="text"
                      value={configForm.zelleTitular}
                      onChange={e => setConfigForm({ ...configForm, zelleTitular: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-1">Correo Zelle</label>
                    <input
                      type="email"
                      value={configForm.zelleCorreo}
                      onChange={e => setConfigForm({ ...configForm, zelleCorreo: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl cursor-pointer"
                >
                  Guardar Configuración
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
