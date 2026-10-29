import React, { useState, useMemo } from 'react';
import {
  Search,
  ShoppingCart,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Send,
  Building2,
  Truck,
  Sparkles,
  ExternalLink,
  Share2,
  QrCode,
  Copy,
  Check,
  ArrowLeft,
  AlertCircle,
  HelpCircle,
  Tag,
  PackageCheck,
  Eye,
  User,
  UserCheck,
  UserPlus,
  Edit3,
  UserCircle,
  LogOut,
  Lock,
} from 'lucide-react';
import {
  Producto,
  InventarioItem,
  Sucursal,
  EmpresaConfig,
  PedidoOnline,
  TiendaConfig,
  DetallePedidoOnline,
  Usuario,
} from '../types';
import { formatUSD, formatBs } from '../lib/currency';
import { AITechFooter } from './AITechFooter';

export interface ClientePerfil {
  nombre: string;
  rif: string;
  telefono: string;
  email?: string;
  direccion: string;
  puntoReferencia?: string;
}

const STORAGE_KEY_CLIENTE_PERFIL = 'pos_tienda_cliente_perfil';

interface TiendaOnlineViewProps {
  productos: Producto[];
  inventario: InventarioItem[];
  sucursales: Sucursal[];
  empresaConfig: EmpresaConfig;
  tiendaConfig: TiendaConfig;
  usuarios?: Usuario[];
  currentUser?: Usuario | null;
  isInternalPreview?: boolean;
  onCrearPedido: (pedido: Omit<PedidoOnline, 'id' | 'numeroPedido' | 'fecha' | 'creadoEn' | 'estado'>) => PedidoOnline;
  onVolverAlPos: () => void;
  onActualizarTiendaConfig?: (config: TiendaConfig) => void;
}

interface CartItem {
  producto: Producto;
  cantidad: number;
}

/**
 * Helper para obtener el precio de venta al público en la tienda con IVA incluido.
 * En Venezuela, por normativa de protección al consumidor y SENIAT, los precios
 * exhibidos en comercios deben mostrarse con el 16% de IVA incluido (o 0% para productos exentos).
 */
export const getPrecioConIva = (prod: Producto): number => {
  if (prod.exento_iva) {
    return prod.precio;
  }
  return +(prod.precio * 1.16).toFixed(2);
};

export const TiendaOnlineView: React.FC<TiendaOnlineViewProps> = ({
  productos,
  inventario,
  sucursales,
  empresaConfig,
  tiendaConfig,
  usuarios,
  currentUser,
  isInternalPreview,
  onCrearPedido,
  onVolverAlPos,
  onActualizarTiendaConfig,
}) => {
  // Determine if this is an external public customer view vs an internal POS merchant preview.
  // Customers NEVER see 'Volver al POS' or 'Modo Vista Previa' banners.
  const isPublicCustomer = useMemo(() => {
    if (typeof window === 'undefined') return true;
    const urlParams = new URLSearchParams(window.location.search);
    const hasClientParam =
      urlParams.get('vista') === 'tienda' ||
      urlParams.get('tienda') === 'true' ||
      urlParams.get('cliente') === 'true' ||
      window.location.hash.toLowerCase().includes('tienda');
    return !isInternalPreview || hasClientParam;
  }, [isInternalPreview]);

  // Only show the return to POS bar & buttons if explicitly in internal preview mode AND not public link
  const showInternalPreviewControls = Boolean(isInternalPreview && !isPublicCustomer);

  // Active Branch for stock checking (defaults to Tienda 1)
  const [selectedSucursalId, setSelectedSucursalId] = useState<number>(() => {
    const firstStore = sucursales.find(s => s.tipo === 'tienda');
    return firstStore ? firstStore.id : 1;
  });

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(false);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Saved Customer Profile (stored on the customer's phone or computer browser)
  const [clientePerfil, setClientePerfil] = useState<ClientePerfil | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CLIENTE_PERFIL);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return null;
  });

  const [showPerfilModal, setShowPerfilModal] = useState<boolean>(false);
  const [showConfigWhatsAppModal, setShowConfigWhatsAppModal] = useState<boolean>(false);
  const [customWhatsAppInput, setCustomWhatsAppInput] = useState<string>('');
  const [guardarDatosEnDispositivo, setGuardarDatosEnDispositivo] = useState<boolean>(true);
  const [dismissWelcomeAlert, setDismissWelcomeAlert] = useState<boolean>(false);

  // Checkout Form State (default to 'pickup' so delivery fee is NOT pre-added while shopping; only added if customer selects delivery)
  const [tipoEntrega, setTipoEntrega] = useState<'delivery' | 'pickup'>('pickup');
  const [clienteNombre, setClienteNombre] = useState<string>(() => clientePerfil?.nombre || '');
  const [clienteRif, setClienteRif] = useState<string>(() => clientePerfil?.rif || '');
  const [clienteTelefono, setClienteTelefono] = useState<string>(() => clientePerfil?.telefono || '');
  const [clienteEmail, setClienteEmail] = useState<string>(() => clientePerfil?.email || '');
  const [direccionEntrega, setDireccionEntrega] = useState<string>(() => clientePerfil?.direccion || '');
  const [puntoReferencia, setPuntoReferencia] = useState<string>(() => clientePerfil?.puntoReferencia || '');
  const [pickupSucursalId, setPickupSucursalId] = useState<number>(selectedSucursalId);
  const [metodoPago, setMetodoPago] = useState<'pago_movil' | 'zelle' | 'efectivo_usd' | 'efectivo_bs' | 'punto'>('pago_movil');
  const [bancoOrigen, setBancoOrigen] = useState('');
  const [referenciaPago, setReferenciaPago] = useState('');
  const [notas, setNotas] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // POS Admin Access Protection State (Restricted by PIN)
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [inputAdminPin, setInputAdminPin] = useState<string>('');
  const [showPinPassword, setShowPinPassword] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string | null>(null);

  const handleVerifyPinAndExit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);
    const pin = inputAdminPin.trim();
    if (!pin) {
      setPinError('Por favor ingrese el PIN de seguridad.');
      return;
    }

    const isValid = (usuarios && usuarios.length > 0)
      ? usuarios.some((u) => u.pin === pin)
      : (pin === '9999' || pin === '1001' || pin === '1002' || pin === '1003' || pin === '1004' || pin === '3001');

    if (isValid) {
      setShowPinModal(false);
      setInputAdminPin('');
      setPinError(null);
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('vista');
        url.searchParams.delete('tienda');
        url.searchParams.delete('cliente');
        window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
      }
      onVolverAlPos();
    } else {
      setPinError('PIN no autorizado. Si es cliente, continúe navegando por la tienda.');
    }
  };

  // Customer Profile Form State for Modal Editing
  const [perfilForm, setPerfilForm] = useState<ClientePerfil>(() => ({
    nombre: clientePerfil?.nombre || '',
    rif: clientePerfil?.rif || '',
    telefono: clientePerfil?.telefono || '',
    email: clientePerfil?.email || '',
    direccion: clientePerfil?.direccion || '',
    puntoReferencia: clientePerfil?.puntoReferencia || '',
  }));

  const handleGuardarPerfil = (e: React.FormEvent) => {
    e.preventDefault();
    if (!perfilForm.nombre.trim() || !perfilForm.telefono.trim()) {
      alert('Por favor indica tu nombre completo y teléfono WhatsApp.');
      return;
    }
    const nuevoPerfil: ClientePerfil = {
      nombre: perfilForm.nombre.trim(),
      rif: perfilForm.rif.trim() || 'V-00000000',
      telefono: perfilForm.telefono.trim(),
      email: perfilForm.email?.trim() || undefined,
      direccion: perfilForm.direccion.trim(),
      puntoReferencia: perfilForm.puntoReferencia?.trim() || undefined,
    };
    try {
      localStorage.setItem(STORAGE_KEY_CLIENTE_PERFIL, JSON.stringify(nuevoPerfil));
    } catch (err) {}
    setClientePerfil(nuevoPerfil);
    setClienteNombre(nuevoPerfil.nombre);
    setClienteRif(nuevoPerfil.rif);
    setClienteTelefono(nuevoPerfil.telefono);
    setClienteEmail(nuevoPerfil.email || '');
    if (nuevoPerfil.direccion) setDireccionEntrega(nuevoPerfil.direccion);
    if (nuevoPerfil.puntoReferencia) setPuntoReferencia(nuevoPerfil.puntoReferencia);
    setShowPerfilModal(false);
  };

  const handleEliminarPerfil = () => {
    if (window.confirm('¿Seguro que deseas borrar tus datos guardados en este dispositivo?')) {
      try {
        localStorage.removeItem(STORAGE_KEY_CLIENTE_PERFIL);
      } catch (err) {}
      setClientePerfil(null);
      setPerfilForm({
        nombre: '',
        rif: '',
        telefono: '',
        email: '',
        direccion: '',
        puntoReferencia: '',
      });
      setShowPerfilModal(false);
    }
  };

  // Submitted Order Success State
  const [completedOrder, setCompletedOrder] = useState<PedidoOnline | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1); // 1: Datos & Entrega, 2: Pago, 3: Confirmación

  // Selected Product for Lightbox / Details Modal
  const [viewProductModal, setViewProductModal] = useState<Producto | null>(null);

  // Extract distinct categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    productos.forEach(p => {
      if (p.categoria) cats.add(p.categoria);
    });
    return Array.from(cats);
  }, [productos]);

  // Stock lookup helper for current branch
  const getStock = (productoId: number, sucursalId: number = selectedSucursalId): number => {
    const item = inventario.find(i => i.sucursal_id === sucursalId && i.producto_id === productoId);
    return item ? item.stock : 0;
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return productos.filter(p => {
      const matchSearch = searchTerm.trim() === '' ||
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.codigo_barras.includes(searchTerm) ||
        (p.categoria && p.categoria.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory = selectedCategory === 'todos' || p.categoria === selectedCategory;
      const matchFeatured = !onlyFeatured || p.destacadoTienda;

      return matchSearch && matchCategory && matchFeatured;
    });
  }, [productos, searchTerm, selectedCategory, onlyFeatured]);

  // Cart operations
  const addToCart = (producto: Producto, delta: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.producto.id === producto.id);
      const currentQty = existing ? existing.cantidad : 0;
      const newQty = Math.max(0, currentQty + delta);
      const stock = getStock(producto.id);

      if (delta > 0 && stock > 0 && newQty > stock) {
        return prev; // cannot exceed branch stock
      }

      if (newQty === 0) {
        return prev.filter(item => item.producto.id !== producto.id);
      }

      if (existing) {
        return prev.map(item =>
          item.producto.id === producto.id ? { ...item, cantidad: newQty } : item
        );
      } else {
        return [...prev, { producto, cantidad: newQty }];
      }
    });
  };

  const removeFromCart = (productoId: number) => {
    setCart(prev => prev.filter(item => item.producto.id !== productoId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Cart Calculations with IVA incluido
  const cartSummary = useMemo(() => {
    let subtotalNeto = 0;
    let baseImponible = 0;
    let montoExento = 0;
    let montoIva = 0;
    let totalItems = 0;
    let subtotalConIva = 0;

    cart.forEach(item => {
      const precioUnitConIva = getPrecioConIva(item.producto);
      const lineFinal = +(precioUnitConIva * item.cantidad).toFixed(2);
      subtotalConIva += lineFinal;

      const lineNeto = +(item.producto.precio * item.cantidad).toFixed(2);
      subtotalNeto += lineNeto;
      totalItems += item.cantidad;

      if (item.producto.exento_iva) {
        montoExento += lineNeto;
      } else {
        baseImponible += lineNeto;
      }
    });

    montoIva = +(baseImponible * 0.16).toFixed(2);
    subtotalConIva = +(subtotalConIva).toFixed(2);

    // Free delivery minimum threshold (defaults safely to 30.00 USD if not set or invalid)
    const rawMin = tiendaConfig?.deliveryGratisMinimo;
    const minFree =
      rawMin !== undefined && rawMin !== null && !isNaN(Number(rawMin)) && Number(rawMin) > 0
        ? Number(rawMin)
        : 30.0;

    // Delivery is free if order subtotal with tax meets/exceeds the minimum
    const isFreeDelivery =
      minFree > 0 &&
      (subtotalConIva >= minFree - 0.01 || subtotalNeto >= minFree - 0.01);

    const rawCost = tiendaConfig?.costoDeliveryFijo;
    const standardCost =
      rawCost !== undefined && rawCost !== null && !isNaN(Number(rawCost))
        ? Number(rawCost)
        : 2.5;

    const deliveryCost = tipoEntrega === 'delivery' ? (isFreeDelivery ? 0 : standardCost) : 0;

    const totalUSD = +(subtotalConIva + deliveryCost).toFixed(2);
    const totalBs = +(totalUSD * empresaConfig.tasaCambio).toFixed(2);

    return {
      totalItems,
      subtotalConIva,
      subtotalNeto,
      baseImponible,
      montoExento,
      montoIva,
      deliveryCost,
      isFreeDelivery,
      minFreeDelivery: minFree,
      faltaParaEnvioGratis: Math.max(0, +(minFree - subtotalConIva).toFixed(2)),
      totalUSD,
      totalBs,
    };
  }, [cart, tipoEntrega, tiendaConfig, empresaConfig.tasaCambio]);

  // Copy helper
  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Handle Order Submit
  const handleFinalizarPedido = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!clienteNombre.trim() || !clienteTelefono.trim()) {
      alert('Por favor completa tu nombre y número de teléfono WhatsApp para poder procesar tu pedido.');
      return;
    }
    if (tipoEntrega === 'delivery' && !direccionEntrega.trim()) {
      alert('Por favor ingresa la dirección de entrega de tu pedido.');
      return;
    }

    // Auto-save or update customer profile if checked
    if (guardarDatosEnDispositivo && clienteNombre.trim() && clienteTelefono.trim()) {
      const perfilAGuardar: ClientePerfil = {
        nombre: clienteNombre.trim(),
        rif: clienteRif.trim() || 'V-00000000',
        telefono: clienteTelefono.trim(),
        email: clienteEmail.trim() || undefined,
        direccion: direccionEntrega.trim(),
        puntoReferencia: puntoReferencia.trim() || undefined,
      };
      try {
        localStorage.setItem(STORAGE_KEY_CLIENTE_PERFIL, JSON.stringify(perfilAGuardar));
      } catch (err) {}
      setClientePerfil(perfilAGuardar);
    }

    const sucursalTargetId = tipoEntrega === 'pickup' ? pickupSucursalId : selectedSucursalId;
    const sucursalTarget = sucursales.find(s => s.id === sucursalTargetId);

    const detalles: DetallePedidoOnline[] = cart.map(item => ({
      productoId: item.producto.id,
      productoNombre: item.producto.nombre,
      codigo_barras: item.producto.codigo_barras,
      unidad_medida: item.producto.unidad_medida,
      cantidad: item.cantidad,
      precioUnitario: item.producto.precio,
      subtotal: +(item.producto.precio * item.cantidad).toFixed(2),
      exentoIva: item.producto.exento_iva,
    }));

    const nuevoPedido = onCrearPedido({
      clienteNombre: clienteNombre.trim(),
      clienteRif: clienteRif.trim() || 'V-00000000',
      clienteTelefono: clienteTelefono.trim(),
      clienteEmail: clienteEmail.trim() || undefined,
      tipoEntrega,
      sucursalId: sucursalTargetId,
      sucursalNombre: sucursalTarget?.nombre || 'Sucursal Principal',
      direccionEntrega: tipoEntrega === 'delivery' ? direccionEntrega.trim() : undefined,
      puntoReferencia: tipoEntrega === 'delivery' && puntoReferencia.trim() ? puntoReferencia.trim() : undefined,
      costoDelivery: cartSummary.deliveryCost,
      detalles,
      subtotalNeto: cartSummary.subtotalNeto,
      baseImponible: cartSummary.baseImponible,
      montoExento: cartSummary.montoExento,
      montoIva: cartSummary.montoIva,
      total: cartSummary.totalUSD,
      totalBs: cartSummary.totalBs,
      tasaCambio: empresaConfig.tasaCambio,
      metodoPago,
      referenciaPago: referenciaPago.trim() || undefined,
      bancoOrigen: bancoOrigen.trim() || undefined,
      notas: notas.trim() || undefined,
    });

    setCompletedOrder(nuevoPedido);
    clearCart();
    setIsCheckoutOpen(false);
  };

  // Generate WhatsApp Order Message
  const getWhatsAppMessage = (order: PedidoOnline): string => {
    let msg = `🛒 *NUEVO PEDIDO EN LÍNEA*\n`;
    msg += `📄 *Orden:* #${order.numeroPedido}\n`;
    msg += `👤 *Cliente:* ${order.clienteNombre} (${order.clienteRif})\n`;
    msg += `📱 *Teléfono:* ${order.clienteTelefono}\n`;
    msg += `📍 *Modalidad:* ${order.tipoEntrega === 'delivery' ? '🛵 Entrega a Domicilio' : '🏬 Retiro en Tienda'}\n`;

    if (order.tipoEntrega === 'delivery') {
      msg += `📍 *Dirección:* ${order.direccionEntrega}\n`;
      if (order.puntoReferencia) msg += `📍 *Ref:* ${order.puntoReferencia}\n`;
    } else {
      msg += `🏬 *Sucursal de Retiro:* ${order.sucursalNombre}\n`;
    }

    msg += `\n📦 *PRODUCTOS:* \n`;
    order.detalles.forEach(d => {
      const precioConIva = d.exentoIva ? d.precioUnitario : +(d.precioUnitario * 1.16).toFixed(2);
      const subtotalConIva = +(precioConIva * d.cantidad).toFixed(2);
      msg += `• ${d.cantidad}x ${d.productoNombre} - $${subtotalConIva.toFixed(2)} (${d.exentoIva ? 'Exento' : 'IVA inc.'})\n`;
    });

    const totalProductosConIva = +(order.total - order.costoDelivery).toFixed(2);
    msg += `\n💵 *Total Productos (IVA incluido):* $${totalProductosConIva.toFixed(2)}\n`;
    if (order.montoIva > 0) {
      msg += `🏛️ *(Desglose SENIAT: Base $${order.baseImponible.toFixed(2)} + IVA 16% $${order.montoIva.toFixed(2)})*\n`;
    }
    if (order.costoDelivery > 0) msg += `🛵 *Delivery:* $${order.costoDelivery.toFixed(2)}\n`;
    msg += `⭐ *TOTAL A PAGAR: $${order.total.toFixed(2)} USD* (Bs. ${order.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })})\n`;
    msg += `💱 *Tasa oficial:* 1 USD = ${order.tasaCambio.toFixed(2)} Bs.\n`;

    msg += `\n💳 *Método de Pago:* ${order.metodoPago.toUpperCase().replace('_', ' ')}\n`;
    if (order.referenciaPago) msg += `🔢 *Referencia:* ${order.referenciaPago}\n`;
    if (order.bancoOrigen) msg += `🏦 *Banco Origen:* ${order.bancoOrigen}\n`;
    if (order.notas) msg += `📝 *Notas:* ${order.notas}\n`;

    return encodeURIComponent(msg);
  };

  const isMockDefaultPhone = (phone?: string): boolean => {
    if (!phone) return true;
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 8) return true;
    return (
      digits.includes('8765432') ||
      digits.includes('1234567') ||
      digits.includes('3328890') ||
      digits.includes('5550199') ||
      digits === '584128765432' ||
      digits === '04128765432' ||
      digits === '4128765432' ||
      digits === '584121234567' ||
      digits === '04121234567' ||
      digits === '4121234567' ||
      digits === '584143328890' ||
      digits === '04143328890' ||
      digits === '4143328890' ||
      digits.includes('582125550199') ||
      digits.includes('584143328890')
    );
  };

  const cleanMobileDigits = (phoneStr: string): string => {
    if (!phoneStr) return '';
    const digitsOnly = phoneStr.replace(/\D/g, '');
    // Search for Venezuelan mobile prefixes: 0412, 0414, 0424, 0416, 0426
    const mobileMatch = digitsOnly.match(/(?:58)?(4(?:12|14|24|16|26)\d{7})/);
    if (mobileMatch && mobileMatch[1]) {
      return `58${mobileMatch[1]}`;
    }
    if (digitsOnly.startsWith('58')) return digitsOnly;
    if (digitsOnly.startsWith('0')) return `58${digitsOnly.slice(1)}`;
    if (digitsOnly.length === 10) return `58${digitsOnly}`;
    return digitsOnly;
  };

  // Determine the best WhatsApp recipient number for incoming store orders
  const resolvedStorePhone = useMemo(() => {
    if (tiendaConfig.whatsappContacto && !isMockDefaultPhone(tiendaConfig.whatsappContacto)) {
      return tiendaConfig.whatsappContacto;
    }
    if (empresaConfig.telefono && !isMockDefaultPhone(empresaConfig.telefono)) {
      return empresaConfig.telefono;
    }
    if (tiendaConfig.pagoMovilTelefono && !isMockDefaultPhone(tiendaConfig.pagoMovilTelefono)) {
      return tiendaConfig.pagoMovilTelefono;
    }
    return '';
  }, [tiendaConfig, empresaConfig]);

  const cleanStoreWhatsApp = useMemo(() => {
    return cleanMobileDigits(resolvedStorePhone);
  }, [resolvedStorePhone]);

  // Handler: Send Order to the Customer's own registered phone (from their app registration data)
  const handleOpenWhatsAppToClient = (order: PedidoOnline) => {
    const rawNumber = order.clienteTelefono || clientePerfil?.telefono || clienteTelefono || '';
    const cleanNumber = cleanMobileDigits(rawNumber);
    if (!cleanNumber) {
      handleShareWhatsAppGeneral(order);
      return;
    }
    const url = `https://wa.me/${cleanNumber}?text=${getWhatsAppMessage(order)}`;
    window.open(url, '_blank');
  };

  // Handler: Send Order to the Store's WhatsApp
  const handleOpenWhatsAppToStore = (order: PedidoOnline) => {
    if (!cleanStoreWhatsApp) {
      setCustomWhatsAppInput('');
      setShowConfigWhatsAppModal(true);
      return;
    }
    const url = `https://wa.me/${cleanStoreWhatsApp}?text=${getWhatsAppMessage(order)}`;
    window.open(url, '_blank');
  };

  const handleShareWhatsAppGeneral = (order: PedidoOnline) => {
    // Open WhatsApp with order summary ready to be sent to any contact or self
    const url = `https://wa.me/?text=${getWhatsAppMessage(order)}`;
    window.open(url, '_blank');
  };

  const handleGuardarWhatsAppTienda = (nuevoNumero: string) => {
    const trimmed = nuevoNumero.trim();
    if (!trimmed) return;
    const updated: TiendaConfig = {
      ...tiendaConfig,
      whatsappContacto: trimmed,
    };
    if (onActualizarTiendaConfig) {
      onActualizarTiendaConfig(updated);
    }
    try {
      localStorage.setItem('pos_app_tienda_config_v2', JSON.stringify(updated));
      localStorage.setItem('pos_multisucursal_tienda_config_v1', JSON.stringify(updated));
    } catch (e) {}
    setShowConfigWhatsAppModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Barra Superior Exclusiva de Supervisión / Retorno al POS (SOLO en vista previa interna del comercio, NUNCA para clientes públicos) */}
      {showInternalPreviewControls && (
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border-b border-emerald-500/50 px-4 py-2 flex flex-wrap items-center justify-between gap-2 shadow-lg sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs text-slate-200">
              <strong className="text-emerald-400 font-bold">Modo Vista Previa:</strong> Estás viendo la tienda como cliente
              {currentUser && (
                <span className="text-slate-400 hidden md:inline"> · Operador: <strong className="text-white font-medium">{currentUser.nombre_completo}</strong> ({currentUser.cargo || currentUser.rol})</span>
              )}
            </span>
          </div>
          <button
            type="button"
            onClick={onVolverAlPos}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-emerald-950/80 cursor-pointer transition-all hover:scale-102"
            title="Haga clic para regresar a la facturación y administración"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Sistema Principal (POS)</span>
          </button>
        </div>
      )}

      {/* Top Banner Tasa / Promo */}
      <header className={`sticky ${showInternalPreviewControls ? 'top-[41px]' : 'top-0'} z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 shadow-lg`}>
        {/* Secondary announcement bar */}
        <div className="bg-emerald-950/80 border-b border-emerald-800/50 px-4 py-1.5 text-xs text-emerald-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium">{tiendaConfig.bannerPromo || 'Pedidos en línea con entrega inmediata o retiro en tienda'}</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-semibold">
            <span className="text-slate-300">
              Cotización Oficial: <strong className="text-emerald-300">1 USD = {formatBs(1, empresaConfig.tasaCambio)}</strong>
            </span>
            {showInternalPreviewControls && (
              <button
                type="button"
                onClick={onVolverAlPos}
                className="text-emerald-300 hover:text-white flex items-center gap-1 font-bold transition-colors cursor-pointer bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-500/50 px-2.5 py-0.5 rounded-lg text-xs"
                title="Haga clic para regresar al sistema principal"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver al POS</span>
              </button>
            )}
          </div>
        </div>

        {/* Welcome & First-time Registration Alert */}
        {!clientePerfil && !dismissWelcomeAlert && (
          <div className="bg-gradient-to-r from-teal-950/90 via-slate-900 to-slate-900 border-b border-teal-500/30 px-4 py-2 text-xs flex items-center justify-between gap-2 shadow-inner">
            <div className="flex items-center gap-2 text-slate-200">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                👋 <strong>¿Primera vez comprando?</strong> Regístrate para guardar tu dirección y teléfono. ¡En tus próximas compras no tendrás que volver a escribirlos!
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setPerfilForm({
                    nombre: clienteNombre || '',
                    rif: clienteRif || '',
                    telefono: clienteTelefono || '',
                    email: clienteEmail || '',
                    direccion: direccionEntrega || '',
                    puntoReferencia: puntoReferencia || '',
                  });
                  setShowPerfilModal(true);
                }}
                className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer"
              >
                Registrarme Ahora
              </button>
              <button
                type="button"
                onClick={() => setDismissWelcomeAlert(true)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
                title="Ocultar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-900/40">
              <Building2 className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                {tiendaConfig.nombreTienda || empresaConfig.nombreEmpresa}
              </h1>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-emerald-400" />
                <span>{tiendaConfig.horarioAtencion || 'Abierto para pedidos hoy'}</span>
              </p>
            </div>
          </div>

          {/* Branch Picker */}
          <div className="hidden md:flex items-center gap-2 bg-slate-800/70 border border-slate-700/70 rounded-xl px-3 py-1.5 text-xs">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-slate-400">Existencias en:</span>
            <select
              value={selectedSucursalId}
              onChange={e => setSelectedSucursalId(Number(e.target.value))}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              {sucursales.filter(s => s.tipo === 'tienda').map(s => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Actions: Profile & Cart Trigger */}
          <div className="flex items-center gap-2">
            {/* Customer Profile / Register Button */}
            <button
              type="button"
              onClick={() => {
                setPerfilForm({
                  nombre: clientePerfil?.nombre || clienteNombre || '',
                  rif: clientePerfil?.rif || clienteRif || '',
                  telefono: clientePerfil?.telefono || clienteTelefono || '',
                  email: clientePerfil?.email || clienteEmail || '',
                  direccion: clientePerfil?.direccion || direccionEntrega || '',
                  puntoReferencia: clientePerfil?.puntoReferencia || puntoReferencia || '',
                });
                setShowPerfilModal(true);
              }}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                clientePerfil
                  ? 'bg-slate-800/80 hover:bg-slate-700 text-emerald-300 border-emerald-500/30'
                  : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/30'
              }`}
              title={
                clientePerfil
                  ? 'Ver o editar tus datos personales de entrega'
                  : 'Regístrate para guardar tus datos y comprar más rápido'
              }
            >
              {clientePerfil ? (
                <UserCheck className="w-4 h-4 text-emerald-400" />
              ) : (
                <UserPlus className="w-4 h-4 text-emerald-400" />
              )}
              <span className="hidden sm:inline">
                {clientePerfil
                  ? `Hola, ${clientePerfil.nombre.split(' ')[0]} (Mis Datos)`
                  : 'Registrarme / Mis Datos'}
              </span>
              <span className="sm:hidden font-medium text-[11px]">
                {clientePerfil ? 'Mis Datos' : 'Registro'}
              </span>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Ver Carrito</span>
              <span className="bg-slate-950 text-emerald-300 text-xs px-2 py-0.5 rounded-full font-black">
                {cartSummary.totalItems}
              </span>
              {cartSummary.subtotalConIva > 0 && (
                <span className="hidden md:inline font-mono border-l border-emerald-600 pl-2 text-xs">
                  ${cartSummary.subtotalConIva.toFixed(2)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Welcome Message */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800/60 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Catálogo Digital Interactivo</span>
              <span className="text-slate-600">·</span>
              <span>Precios Duales en Tiempo Real</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Compra rápido, paga en Bs o Divisas y recibe donde estés
            </h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              {tiendaConfig.mensajeBienvenida}
            </p>
          </div>

          {/* Quick Perks Pill Cards */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full md:w-auto text-xs">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-center gap-3 flex-1 sm:flex-initial">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white">Delivery Rápido</p>
                <p className="text-slate-400 text-[11px]">
                  {cartSummary.minFreeDelivery > 0
                    ? `Gratis desde $${cartSummary.minFreeDelivery.toFixed(2)} USD`
                    : `$${cartSummary.deliveryCost.toFixed(2)} tarifa plana`}
                </p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-center gap-3 flex-1 sm:flex-initial">
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white">Pago Seguro</p>
                <p className="text-slate-400 text-[11px]">Pago Móvil, Zelle o Efectivo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {/* Search & Category Tabs */}
        <div className="space-y-4 mb-8">
          {/* Search Box */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar productos por nombre, código de barras o categoría..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Branch selector on mobile */}
            <div className="md:hidden flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <select
                value={selectedSucursalId}
                onChange={e => setSelectedSucursalId(Number(e.target.value))}
                className="bg-transparent text-white font-medium focus:outline-none w-full"
              >
                {sucursales.filter(s => s.tipo === 'tienda').map(s => (
                  <option key={s.id} value={s.id} className="bg-slate-900">
                    {s.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <button
              onClick={() => { setSelectedCategory('todos'); setOnlyFeatured(false); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'todos' && !onlyFeatured
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              Todos ({productos.length})
            </button>

            <button
              onClick={() => { setOnlyFeatured(true); setSelectedCategory('todos'); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                onlyFeatured
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-slate-900 text-amber-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Destacados</span>
            </button>

            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setOnlyFeatured(false); }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat && !onlyFeatured
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center max-w-md mx-auto my-12">
            <Tag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No se encontraron productos</h3>
            <p className="text-xs text-slate-400 mt-1">
              Prueba con otro término de búsqueda o selecciona otra categoría.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('todos'); setOnlyFeatured(false); }}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4">
            {filteredProducts.map(prod => {
              const stock = getStock(prod.id);
              const inCart = cart.find(i => i.producto.id === prod.id);
              const precioConIva = getPrecioConIva(prod);
              const priceBs = precioConIva * empresaConfig.tasaCambio;

              return (
                <article
                  key={prod.id}
                  className="bg-slate-900/80 border border-slate-800/90 hover:border-slate-700/80 rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:shadow-xl hover:shadow-black/40 group"
                >
                  {/* Image container with quick zoom */}
                  <div
                    onClick={() => setViewProductModal(prod)}
                    className="relative aspect-square sm:aspect-4/3 bg-slate-950 overflow-hidden cursor-pointer group/img"
                    title="Click para ver foto detallada e información"
                  >
                    {prod.imagen ? (
                      <img
                        src={prod.imagen}
                        alt={prod.nombre}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover/img:scale-108 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-700">
                        <Tag className="w-10 h-10 sm:w-12 sm:h-12" />
                      </div>
                    )}

                    {/* Quick view button overlay */}
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 text-white text-[11px] font-semibold backdrop-blur-md shadow-lg border border-slate-700/80">
                        <Eye className="w-3 h-3 text-emerald-400" />
                        <span className="hidden sm:inline">Ver detalle</span>
                      </span>
                    </div>

                    {/* Badge IVA / Exento */}
                    <div className="absolute top-2 left-2 flex items-center gap-1 pointer-events-none">
                      {prod.exento_iva ? (
                        <span className="bg-slate-950/85 backdrop-blur-md text-emerald-400 border border-emerald-500/40 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md shadow-sm">
                          Exento
                        </span>
                      ) : (
                        <span className="bg-slate-950/85 backdrop-blur-md text-teal-300 border border-teal-500/40 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                          IVA Incluido
                        </span>
                      )}
                    </div>

                    {/* Stock badge */}
                    <div className="absolute top-2 right-2 pointer-events-none">
                      {stock > 0 ? (
                        <span className="bg-slate-950/80 backdrop-blur-md text-slate-300 text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 rounded-md border border-slate-800">
                          {stock} {prod.unidad_medida || 'UND'}
                        </span>
                      ) : (
                        <span className="bg-rose-950/90 backdrop-blur-md text-rose-300 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md border border-rose-800/50">
                          Agotado
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-2.5 sm:p-3.5 flex flex-col flex-1 justify-between gap-2 sm:gap-3">
                    <div>
                      {/* Quiet Category Metadata */}
                      <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium tracking-wide truncate">
                        {prod.categoria || 'Víveres Generales'}
                      </p>

                      <h3 className="text-xs sm:text-sm font-bold text-white mt-0.5 leading-snug line-clamp-2 min-h-[2rem]">
                        {prod.nombre}
                      </h3>

                      {prod.descripcion && (
                        <p className="hidden sm:block text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {prod.descripcion}
                        </p>
                      )}
                    </div>

                    {/* Price and Cart Controls */}
                    <div className="pt-2 sm:pt-3 border-t border-slate-800/80 flex items-end justify-between gap-1.5 sm:gap-2">
                      <div className="min-w-0">
                        <div className="text-sm sm:text-lg font-black text-emerald-400 leading-tight">
                          ${precioConIva.toFixed(2)}
                        </div>
                        <div className="text-[10px] sm:text-xs text-slate-400 font-medium truncate">
                          Bs. {priceBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-[9px] text-teal-400/90 font-medium mt-0.5">
                          {prod.exento_iva ? 'Exento de IVA' : 'IVA incluido (16%)'}
                        </div>
                      </div>

                      {/* Add to Cart or Counter */}
                      {stock === 0 ? (
                        <button
                          disabled
                          className="px-2 sm:px-3 py-1 bg-slate-800/50 text-slate-500 rounded-xl text-[11px] font-semibold cursor-not-allowed shrink-0"
                        >
                          Agotado
                        </button>
                      ) : inCart ? (
                        <div className="flex items-center gap-1 bg-slate-800 border border-slate-700/80 rounded-xl p-0.5 sm:p-1 shrink-0">
                          <button
                            onClick={() => addToCart(prod, -1)}
                            className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </button>
                          <span className="text-xs font-bold text-white px-1 min-w-[16px] text-center">
                            {inCart.cantidad}
                          </span>
                          <button
                            onClick={() => addToCart(prod, 1)}
                            className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center transition-colors font-bold cursor-pointer"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(prod, 1)}
                          className="px-2.5 sm:px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-all shadow-sm shadow-emerald-500/20 cursor-pointer shrink-0"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span className="text-[11px] sm:text-xs">Agregar</span>
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer Oficial AITech Soluciones, C. A. en Tienda Online */}
      <AITechFooter variant="store" />

      {/* Floating Mobile Cart Bar */}
      {cartSummary.totalItems > 0 && !isCartOpen && !isCheckoutOpen && (
        <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950 font-bold p-3.5 rounded-2xl shadow-xl shadow-black/60 flex items-center justify-between gap-3 text-sm transition-transform cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="bg-slate-950 text-emerald-300 text-xs px-2 py-0.5 rounded-full font-black">
                {cartSummary.totalItems}
              </div>
              <span>Ver Carrito de Compra</span>
            </div>
            <div className="text-right leading-tight">
              <div className="font-black">${cartSummary.subtotalConIva.toFixed(2)}</div>
              <div className="text-[10px] text-slate-900 font-semibold">
                Bs. {(cartSummary.subtotalConIva * empresaConfig.tasaCambio).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Slide-over Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <aside className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-base font-bold text-white">Tu Carrito ({cartSummary.totalItems})</h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                    <ShoppingCart className="w-12 h-12 text-slate-600 mb-3" />
                    <p className="font-bold text-white text-sm">Tu carrito está vacío</p>
                    <p className="text-xs text-slate-500 mt-1">Explora nuestro catálogo y agrega productos para comenzar.</p>
                  </div>
                ) : (
                  cart.map(item => {
                    const unitConIva = getPrecioConIva(item.producto);
                    const lineSubtotalConIva = +(unitConIva * item.cantidad).toFixed(2);
                    const lineBs = lineSubtotalConIva * empresaConfig.tasaCambio;

                    return (
                      <div
                        key={item.producto.id}
                        className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex gap-3 items-center"
                      >
                        {item.producto.imagen ? (
                          <img
                            src={item.producto.imagen}
                            alt={item.producto.nombre}
                            className="w-14 h-14 rounded-lg object-cover bg-slate-900 shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-slate-900 flex items-center justify-center text-slate-600 shrink-0">
                            <Tag className="w-6 h-6" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{item.producto.nombre}</h4>
                          <p className="text-[11px] text-slate-400">
                            ${unitConIva.toFixed(2)} c/u <span className="text-[10px] text-teal-400">({item.producto.exento_iva ? 'Exento' : 'IVA inc.'})</span>
                          </p>

                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 rounded-lg p-0.5">
                              <button
                                onClick={() => addToCart(item.producto, -1)}
                                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center text-xs"
                              >
                                -
                              </button>
                              <span className="text-xs font-bold text-white px-2">
                                {item.cantidad}
                              </span>
                              <button
                                onClick={() => addToCart(item.producto, 1)}
                                className="w-6 h-6 rounded bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-xs"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.producto.id)}
                              className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                              title="Eliminar producto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-xs font-black text-emerald-400">${lineSubtotalConIva.toFixed(2)}</p>
                          <p className="text-[10px] text-slate-500">
                            Bs. {lineBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer with Delivery Selector & Calculations */}
              {cart.length > 0 && (
                <div className="p-4 border-t border-slate-800 bg-slate-950/90 space-y-3.5">
                  {/* Selector de Modalidad: Delivery o Retiro en Tienda */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-200">Modalidad de entrega:</span>
                      <span className="text-[10px] text-slate-400">Elige antes de pagar</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {/* Opción Delivery */}
                      <button
                        type="button"
                        onClick={() => setTipoEntrega('delivery')}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          tipoEntrega === 'delivery'
                            ? 'bg-emerald-950/40 border-emerald-500 shadow-sm ring-1 ring-emerald-500/40'
                            : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-1.5">
                            <Truck className={`w-4 h-4 ${tipoEntrega === 'delivery' ? 'text-emerald-400' : 'text-slate-500'}`} />
                            <span className={`text-xs font-bold ${tipoEntrega === 'delivery' ? 'text-white' : 'text-slate-300'}`}>Delivery</span>
                          </div>
                          {tipoEntrega === 'delivery' && (
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          )}
                        </div>
                        <div className="mt-1">
                          {cartSummary.isFreeDelivery ? (
                            <span className="text-[11px] font-bold text-emerald-400">¡Envío GRATIS!</span>
                          ) : (
                            <span className="text-[11px] font-semibold text-slate-300">
                              +${(tiendaConfig?.costoDeliveryFijo ?? 2.5).toFixed(2)} USD
                            </span>
                          )}
                        </div>
                      </button>

                      {/* Opción Retiro en Tienda */}
                      <button
                        type="button"
                        onClick={() => setTipoEntrega('pickup')}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          tipoEntrega === 'pickup'
                            ? 'bg-emerald-950/40 border-emerald-500 shadow-sm ring-1 ring-emerald-500/40'
                            : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-1.5">
                            <Building2 className={`w-4 h-4 ${tipoEntrega === 'pickup' ? 'text-emerald-400' : 'text-slate-500'}`} />
                            <span className={`text-xs font-bold ${tipoEntrega === 'pickup' ? 'text-white' : 'text-slate-300'}`}>Retiro Tienda</span>
                          </div>
                          {tipoEntrega === 'pickup' && (
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          )}
                        </div>
                        <div className="mt-1">
                          <span className="text-[11px] font-bold text-emerald-400">Sin costo ($0.00)</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Delivery banner if delivery chosen */}
                  {tipoEntrega === 'delivery' && (
                    cartSummary.isFreeDelivery ? (
                      <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-xl p-2.5 text-center shadow-sm">
                        <span className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>¡Genial! Tu compra califica para <strong>Delivery GRATIS ($0.00)</strong></span>
                        </span>
                      </div>
                    ) : (
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-center">
                        <p className="text-[11px] text-slate-300">
                          Agrega <strong className="text-emerald-400 font-mono">${cartSummary.faltaParaEnvioGratis.toFixed(2)} USD</strong> más para obtener <strong>Delivery Gratis</strong>.
                        </p>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min(100, Math.max(0, (cartSummary.subtotalConIva / (cartSummary.minFreeDelivery || 30)) * 100))}%`,
                            }}
                          />
                        </div>
                      </div>
                    )
                  )}

                  {/* Pickup banner if pickup chosen */}
                  {tipoEntrega === 'pickup' && (
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div>
                            <p className="font-semibold text-white">Retiro directo en sucursal</p>
                            <p className="text-[10px] text-slate-400">Pagas solo los productos ($0.00 costo de delivery)</p>
                          </div>
                        </div>
                        <span className="text-emerald-400 font-bold font-mono text-xs">$0.00</span>
                      </div>
                      {sucursales.filter(s => s.tipo === 'tienda').length > 1 && (
                        <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Sucursal de retiro:</span>
                          <select
                            value={pickupSucursalId}
                            onChange={e => setPickupSucursalId(Number(e.target.value))}
                            className="bg-slate-950 text-white font-medium px-2 py-1 rounded-lg border border-slate-700/80 focus:outline-none focus:border-emerald-500 cursor-pointer"
                          >
                            {sucursales.filter(s => s.tipo === 'tienda').map(s => (
                              <option key={s.id} value={s.id}>
                                {s.nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Summary Lines */}
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span>Subtotal productos (IVA incluido):</span>
                      <span className="font-mono font-bold text-white">${cartSummary.subtotalConIva.toFixed(2)}</span>
                    </div>
                    {cartSummary.montoIva > 0 && (
                      <div className="flex justify-between text-[11px] text-slate-400 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800/60">
                        <span>Desglose SENIAT: Base ${cartSummary.baseImponible.toFixed(2)}</span>
                        <span>IVA (16%): ${cartSummary.montoIva.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Envío / Despacho:</span>
                      <span className="font-medium">
                        {tipoEntrega === 'delivery' ? (
                          cartSummary.isFreeDelivery ? (
                            <span className="text-emerald-400 font-bold">Delivery GRATIS ($0.00)</span>
                          ) : (
                            <span className="text-white font-mono font-semibold">+${cartSummary.deliveryCost.toFixed(2)} USD</span>
                          )
                        ) : (
                          <span className="text-emerald-400 font-bold">Retiro en tienda ($0.00)</span>
                        )}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline text-white">
                      <span className="font-bold text-sm">Total a Pagar:</span>
                      <div className="text-right">
                        <div className="text-lg font-black text-emerald-400">
                          ${cartSummary.totalUSD.toFixed(2)} USD
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          Bs. {cartSummary.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                      setCheckoutStep(1);
                    }}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer"
                  >
                    <span>Continuar al Pago</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </aside>
          </div>
        </div>
      )}

      {/* Checkout Modal Flow (3 Steps) */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-6">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <PackageCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Finalizar Compra</h3>
                  <p className="text-xs text-slate-400">Paso {checkoutStep} de 2 · {checkoutStep === 1 ? 'Datos de Entrega' : 'Método de Pago'}</p>
                </div>
              </div>

              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFinalizarPedido} className="p-4 sm:p-6 space-y-6">
              {/* Step 1: Customer Info & Delivery Preference */}
              {checkoutStep === 1 && (
                <div className="space-y-5">
                  {/* Customer Profile Status Banner */}
                  {clientePerfil ? (
                    <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">
                            Comprando con tu perfil guardado:{' '}
                            <span className="text-emerald-300">{clientePerfil.nombre}</span>
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Tus datos personales y dirección se cargaron automáticamente.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setPerfilForm({
                            nombre: clienteNombre,
                            rif: clienteRif,
                            telefono: clienteTelefono,
                            email: clienteEmail,
                            direccion: direccionEntrega,
                            puntoReferencia: puntoReferencia,
                          });
                          setShowPerfilModal(true);
                        }}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-bold underline shrink-0 cursor-pointer"
                      >
                        Editar Datos
                      </button>
                    </div>
                  ) : (
                    <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                          <UserPlus className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">¿Primera vez comprando?</p>
                          <p className="text-[10px] text-slate-400">
                            Completa tus datos aquí abajo y quedarán guardados en tu dispositivo para futuras compras.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
                      1. Datos del Cliente
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Nombre Completo *</label>
                        <input
                          type="text"
                          required
                          value={clienteNombre}
                          onChange={e => setClienteNombre(e.target.value)}
                          placeholder="Ej. Valentina Mendoza"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Cédula / RIF *</label>
                        <input
                          type="text"
                          required
                          value={clienteRif}
                          onChange={e => setClienteRif(e.target.value)}
                          placeholder="Ej. V-18293847"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Teléfono WhatsApp *</label>
                        <input
                          type="tel"
                          required
                          value={clienteTelefono}
                          onChange={e => setClienteTelefono(e.target.value)}
                          placeholder="Ej. +58 412 1234567"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Correo Electrónico (Opcional)</label>
                        <input
                          type="email"
                          value={clienteEmail}
                          onChange={e => setClienteEmail(e.target.value)}
                          placeholder="cliente@correo.com"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Selection */}
                  <div className="pt-4 border-t border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
                      2. Modalidad de Entrega
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <button
                        type="button"
                        onClick={() => setTipoEntrega('delivery')}
                        className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                          tipoEntrega === 'delivery'
                            ? 'bg-emerald-950/30 border-emerald-500 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <Truck className={`w-5 h-5 shrink-0 ${tipoEntrega === 'delivery' ? 'text-emerald-400' : 'text-slate-500'}`} />
                        <div>
                          <p className="text-xs font-bold text-white">Delivery a Domicilio</p>
                          <p className="text-[11px] mt-0.5">
                            {cartSummary.isFreeDelivery ? (
                              <span className="text-emerald-400 font-bold">
                                ¡Envío GRATIS ($0.00)! (Por compras ≥ ${cartSummary.minFreeDelivery.toFixed(2)})
                              </span>
                            ) : (
                              <span className="text-slate-400">
                                Costo: +${(tiendaConfig?.costoDeliveryFijo ?? 2.5).toFixed(2)} USD (Gratis desde ${cartSummary.minFreeDelivery.toFixed(2)})
                              </span>
                            )}
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTipoEntrega('pickup')}
                        className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                          tipoEntrega === 'pickup'
                            ? 'bg-emerald-950/30 border-emerald-500 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <Building2 className={`w-5 h-5 shrink-0 ${tipoEntrega === 'pickup' ? 'text-emerald-400' : 'text-slate-500'}`} />
                        <div>
                          <p className="text-xs font-bold text-white">Retiro en Sucursal</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Sin costo de envío ($0.00) · Inmediato</p>
                        </div>
                      </button>
                    </div>

                    {tipoEntrega === 'delivery' ? (
                      <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                        <div>
                          <label className="block text-xs text-slate-300 mb-1">Dirección de Entrega Exacta *</label>
                          <textarea
                            rows={2}
                            required
                            value={direccionEntrega}
                            onChange={e => setDireccionEntrega(e.target.value)}
                            placeholder="Urbanización, Calle/Av, Edificio/Casa, Número de Apto o Piso..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-300 mb-1">Punto de Referencia</label>
                          <input
                            type="text"
                            value={puntoReferencia}
                            onChange={e => setPuntoReferencia(e.target.value)}
                            placeholder="Ej. Al frente de la panadería, portón negro..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                        <label className="block text-xs text-slate-300 mb-1.5">Selecciona la sucursal para retirar:</label>
                        <select
                          value={pickupSucursalId}
                          onChange={e => setPickupSucursalId(Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                        >
                          {sucursales.filter(s => s.tipo === 'tienda').map(s => (
                            <option key={s.id} value={s.id}>
                              {s.nombre} - Horario: 8:00 AM a 7:30 PM
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Save profile checkbox */}
                  <div className="pt-2">
                    <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-colors">
                      <input
                        type="checkbox"
                        checked={guardarDatosEnDispositivo}
                        onChange={e => setGuardarDatosEnDispositivo(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 accent-emerald-500 cursor-pointer"
                      />
                      <span>Recordar y guardar mis datos en este dispositivo para futuras compras</span>
                    </label>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!clienteNombre.trim() || !clienteTelefono.trim()) {
                          alert('Por favor ingresa tu nombre y número de teléfono.');
                          return;
                        }
                        if (tipoEntrega === 'delivery' && !direccionEntrega.trim()) {
                          alert('Por favor ingresa la dirección de entrega.');
                          return;
                        }
                        if (guardarDatosEnDispositivo) {
                          const nuevoPerfil: ClientePerfil = {
                            nombre: clienteNombre.trim(),
                            rif: clienteRif.trim() || 'V-00000000',
                            telefono: clienteTelefono.trim(),
                            email: clienteEmail.trim() || undefined,
                            direccion: direccionEntrega.trim(),
                            puntoReferencia: puntoReferencia.trim() || undefined,
                          };
                          try {
                            localStorage.setItem(STORAGE_KEY_CLIENTE_PERFIL, JSON.stringify(nuevoPerfil));
                          } catch (err) {}
                          setClientePerfil(nuevoPerfil);
                        }
                        setCheckoutStep(2);
                      }}
                      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer"
                    >
                      <span>Siguiente: Método de Pago</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Method & Details */}
              {checkoutStep === 2 && (
                <div className="space-y-5">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
                      3. Método de Pago
                    </h4>

                    {/* Payment methods selector */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                      <button
                        type="button"
                        onClick={() => setMetodoPago('pago_movil')}
                        className={`p-3 rounded-xl border text-center transition-colors cursor-pointer ${
                          metodoPago === 'pago_movil'
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <p className="text-xs">Pago Móvil</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">En Bolívares</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMetodoPago('zelle')}
                        className={`p-3 rounded-xl border text-center transition-colors cursor-pointer ${
                          metodoPago === 'zelle'
                            ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <p className="text-xs">Zelle</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">USD Directo</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMetodoPago('efectivo_usd')}
                        className={`p-3 rounded-xl border text-center transition-colors cursor-pointer ${
                          metodoPago === 'efectivo_usd'
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <p className="text-xs">Efectivo $</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Al Recibir</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMetodoPago('efectivo_bs')}
                        className={`p-3 rounded-xl border text-center transition-colors cursor-pointer ${
                          metodoPago === 'efectivo_bs'
                            ? 'bg-teal-500/20 border-teal-500 text-teal-300 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <p className="text-xs">Efectivo Bs</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Al Recibir</p>
                      </button>
                    </div>

                    {/* Payment specific details box */}
                    {metodoPago === 'pago_movil' && (
                      <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-emerald-300">Datos para realizar Pago Móvil:</p>
                          <span className="text-[11px] font-mono text-emerald-400 font-black">
                            Monto Exacto: Bs. {cartSummary.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                          <div>
                            <span className="text-slate-500 block text-[10px]">Banco Destino:</span>
                            <span className="font-bold text-white">{tiendaConfig.pagoMovilBanco}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Teléfono:</span>
                            <span className="font-bold text-white">{tiendaConfig.pagoMovilTelefono}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Cédula / RIF:</span>
                            <span className="font-bold text-white">{tiendaConfig.pagoMovilRif}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <div>
                            <label className="block text-xs text-slate-300 mb-1">Banco Emisor</label>
                            <input
                              type="text"
                              value={bancoOrigen}
                              onChange={e => setBancoOrigen(e.target.value)}
                              placeholder="Ej. Banesco, Mercantil, Venezuela..."
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-300 mb-1">Número de Referencia (Últimos dígitos)</label>
                            <input
                              type="text"
                              value={referenciaPago}
                              onChange={e => setReferenciaPago(e.target.value)}
                              placeholder="Ej. 982143"
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {metodoPago === 'zelle' && (
                      <div className="bg-purple-950/20 border border-purple-800/40 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-purple-300">Datos para transferencia Zelle:</p>
                          <span className="text-[11px] font-mono text-purple-400 font-black">
                            Monto Exacto: ${cartSummary.totalUSD.toFixed(2)} USD
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                          <div>
                            <span className="text-slate-500 block text-[10px]">Titular Zelle:</span>
                            <span className="font-bold text-white">{tiendaConfig.zelleTitular}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Correo Electrónico:</span>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white truncate">{tiendaConfig.zelleCorreo}</span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(tiendaConfig.zelleCorreo, 'zelle')}
                                className="text-purple-400 hover:text-purple-300 text-[10px] flex items-center gap-1 ml-2"
                              >
                                {copiedField === 'zelle' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-slate-300 mb-1">Nombre del Titular de la cuenta Zelle emisora</label>
                          <input
                            type="text"
                            value={referenciaPago}
                            onChange={e => setReferenciaPago(e.target.value)}
                            placeholder="Ej. Enviado por Carlos Rivas"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                          />
                        </div>
                      </div>
                    )}

                    {(metodoPago === 'efectivo_usd' || metodoPago === 'efectivo_bs') && (
                      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
                        <p className="text-slate-300">
                          Pagarás en efectivo al momento de la entrega o retiro en sucursal.
                        </p>
                        <p className="text-slate-400 text-[11px]">
                          Monto a preparar: <strong className="text-emerald-400">${cartSummary.totalUSD.toFixed(2)} USD</strong> o su equivalente en bolívares <strong className="text-emerald-400">Bs. {cartSummary.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</strong>.
                        </p>
                      </div>
                    )}

                    {/* Order Notes */}
                    <div className="mt-4">
                      <label className="block text-xs text-slate-300 mb-1">Instrucciones o Notas Especiales</label>
                      <input
                        type="text"
                        value={notas}
                        onChange={e => setNotas(e.target.value)}
                        placeholder="Ej. Traer cambio de $20, llamar al llegar..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block">Total a Pagar ({cartSummary.totalItems} artículos):</span>
                      <span className="text-emerald-400 font-bold">
                        {tipoEntrega === 'delivery'
                          ? cartSummary.isFreeDelivery
                            ? '🎉 ¡Envío a Domicilio GRATIS ($0.00) por compra ≥ $30!'
                            : `Incluye delivery ($${cartSummary.deliveryCost.toFixed(2)} USD)`
                          : 'Retiro en tienda sin costo adicional ($0.00)'}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-white">${cartSummary.totalUSD.toFixed(2)} USD</div>
                      <div className="text-xs text-emerald-400 font-mono">
                        Bs. {cartSummary.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep(1)}
                      className="px-4 py-2 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Volver a Datos</span>
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirmar y Enviar Pedido</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Completed Order Modal with Direct WhatsApp Button */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-lg w-full p-6 text-center shadow-2xl space-y-5 my-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">
                ¡Pedido Registrado con Éxito!
              </span>
              <h3 className="text-xl font-black text-white mt-1">
                Orden #{completedOrder.numeroPedido}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Tu pedido ha sido guardado en el sistema de la tienda. Para una atención rápida y despacho inmediato, envíanos el comprobante a nuestro WhatsApp.
              </p>
            </div>

            {/* Order Mini Receipt */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 text-left text-xs space-y-2.5">
              <div className="flex justify-between pb-2 border-b border-slate-800 text-slate-400 text-[11px]">
                <span>Cliente: <strong className="text-white">{completedOrder.clienteNombre}</strong></span>
                <span>{new Date(completedOrder.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              <div className="space-y-1.5 py-1">
                {completedOrder.detalles.map((d, i) => {
                  const itemPrecioConIva = d.exentoIva ? d.precioUnitario : +(d.precioUnitario * 1.16).toFixed(2);
                  const itemSubtotalConIva = +(itemPrecioConIva * d.cantidad).toFixed(2);
                  return (
                    <div key={i} className="flex justify-between text-slate-300">
                      <span>
                        {d.cantidad}x {d.productoNombre}{' '}
                        <span className="text-[10px] text-teal-400">({d.exentoIva ? 'Exento' : 'IVA inc.'})</span>
                      </span>
                      <span className="font-mono text-white">${itemSubtotalConIva.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Modalidad:</span>
                  <span className="capitalize">{completedOrder.tipoEntrega === 'delivery' ? 'Delivery a domicilio' : 'Retiro en sucursal'}</span>
                </div>
                <div className="flex justify-between text-white font-bold pt-1">
                  <span>Total a pagar:</span>
                  <div className="text-right">
                    <span className="text-emerald-400 font-mono text-sm">${completedOrder.total.toFixed(2)} USD</span>
                    <span className="block text-[11px] text-slate-400 font-normal">
                      Bs. {completedOrder.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Sending Options */}
            <div className="space-y-3 pt-2 text-left">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-emerald-400" />
                  Elige a dónde deseas enviar el pedido por WhatsApp:
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Puedes enviarlo a tu propio número de cliente registrado o al WhatsApp del comercio:
                </p>
              </div>

              {/* Opción 1: Enviar al WhatsApp de Cliente Registrado */}
              {completedOrder.clienteTelefono && (
                <div className="bg-emerald-950/50 border border-emerald-500/40 rounded-2xl p-3 space-y-2 relative overflow-hidden shadow-lg shadow-emerald-950/40">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-bold text-emerald-300">
                        Tu WhatsApp de Cliente:
                      </span>
                    </div>
                    <span className="font-mono text-xs font-black text-white bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 rounded-lg">
                      {completedOrder.clienteTelefono}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-200/80 leading-relaxed">
                    Abre WhatsApp para enviar y guardar el comprobante detallado con número de orden <strong className="text-white">#{completedOrder.numeroPedido}</strong> en tu propio chat.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleOpenWhatsAppToClient(completedOrder)}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/25 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar a Mi WhatsApp Registrado ({completedOrder.clienteTelefono})</span>
                  </button>
                </div>
              )}

              {/* Opción 2: Enviar al WhatsApp de la Tienda / Encargado */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3 space-y-2.5">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-200">
                    <Building2 className="w-3.5 h-3.5 text-teal-400" />
                    <span>WhatsApp de la Tienda:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-white text-xs">
                      {resolvedStorePhone || 'Sin configurar'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomWhatsAppInput(resolvedStorePhone || '');
                        setShowConfigWhatsAppModal(true);
                      }}
                      className="text-teal-400 hover:text-teal-300 font-bold underline text-[11px] cursor-pointer"
                    >
                      {resolvedStorePhone ? 'Cambiar' : 'Configurar'}
                    </button>
                  </div>
                </div>

                {resolvedStorePhone ? (
                  <button
                    type="button"
                    onClick={() => handleOpenWhatsAppToStore(completedOrder)}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-98 text-teal-300 hover:text-white border border-teal-500/40 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-teal-400" />
                    <span>Enviar al WhatsApp de la Tienda ({resolvedStorePhone})</span>
                  </button>
                ) : (
                  <div className="space-y-1.5">
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2 text-[11px] text-amber-300 flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                      <span>
                        El comercio aún no tiene configurado un número de WhatsApp oficial para recibir pedidos de clientes.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomWhatsAppInput('');
                        setShowConfigWhatsAppModal(true);
                      }}
                      className="w-full py-2 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Configurar WhatsApp Oficial de la Tienda</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Opción 3: Compartir libremente en WhatsApp */}
              <button
                type="button"
                onClick={() => handleShareWhatsAppGeneral(completedOrder)}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-800 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Compartir Comprobante (Elegir cualquier chat de WhatsApp)</span>
              </button>

              <button
                type="button"
                onClick={() => setCompletedOrder(null)}
                className="w-full py-1.5 bg-transparent hover:bg-slate-800/40 text-slate-400 hover:text-slate-300 font-medium rounded-xl text-xs transition-colors cursor-pointer"
              >
                Continuar Comprando
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: DETALLE Y FOTO DEL PRODUCTO ================= */}
      {viewProductModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setViewProductModal(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl relative cursor-default max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  {viewProductModal.categoria || 'Víveres'}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  SKU: {viewProductModal.codigo_barras}
                </span>
              </div>
              <button
                onClick={() => setViewProductModal(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto p-5 space-y-4">
              {/* Large Image Box */}
              <div className="relative aspect-4/3 sm:aspect-16/10 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center group/zoom">
                {viewProductModal.imagen ? (
                  <img
                    src={viewProductModal.imagen}
                    alt={viewProductModal.nombre}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain p-2 group-hover/zoom:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-600 gap-2">
                    <Tag className="w-16 h-16" />
                    <span className="text-xs text-slate-500">Fotografía no disponible</span>
                  </div>
                )}

                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  {viewProductModal.exento_iva ? (
                    <span className="bg-slate-950/85 backdrop-blur-md text-emerald-400 border border-emerald-500/40 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                      Exento de IVA
                    </span>
                  ) : (
                    <span className="bg-slate-950/85 backdrop-blur-md text-teal-300 border border-teal-500/40 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                      IVA Incluido (16%)
                    </span>
                  )}
                  <span className="bg-slate-950/85 backdrop-blur-md text-slate-300 border border-slate-700 text-[11px] font-mono px-2.5 py-1 rounded-lg">
                    Presentación: {viewProductModal.unidad_medida || 'UND'}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-xl font-bold text-white leading-snug">
                  {viewProductModal.nombre}
                </h3>
                {viewProductModal.descripcion ? (
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    {viewProductModal.descripcion}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1 italic">
                    Producto garantizado de alta calidad. Disponible para delivery inmediato o retiro en tienda.
                  </p>
                )}
              </div>

              {/* Stock info per selected branch */}
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>
                    Disponibilidad en{' '}
                    {sucursales.find((s) => s.id === selectedSucursalId)?.nombre || 'Sucursal'}:
                  </span>
                </span>
                <span className="font-mono font-bold text-white">
                  {getStock(viewProductModal.id)} {viewProductModal.unidad_medida || 'unidades'}
                </span>
              </div>
            </div>

            {/* Footer with Price and Add to Cart */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
              {(() => {
                const modalPrecioConIva = getPrecioConIva(viewProductModal);
                const modalBs = modalPrecioConIva * empresaConfig.tasaCambio;
                return (
                  <div>
                    <div className="text-2xl font-black text-emerald-400 leading-none">
                      ${modalPrecioConIva.toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-400 mt-1 font-medium">
                      Bs. {modalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] text-teal-400/90 mt-0.5">
                      {viewProductModal.exento_iva
                        ? 'Producto exento de IVA según normativa'
                        : `Precio final con IVA incluido (Base: $${viewProductModal.precio.toFixed(2)} + 16% IVA)`}
                    </div>
                  </div>
                );
              })()}

              <div className="flex items-center gap-2">
                {getStock(viewProductModal.id) > 0 ? (
                  <button
                    onClick={() => {
                      addToCart(viewProductModal, 1);
                      setViewProductModal(null);
                      setIsCartOpen(true);
                    }}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Agregar al Carrito</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-4 py-2 bg-slate-800 text-slate-500 rounded-xl text-xs font-semibold cursor-not-allowed"
                  >
                    Agotado temporalmente
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: REGISTRO Y PERFIL DEL CLIENTE ================= */}
      {showPerfilModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowPerfilModal(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden my-6 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  {clientePerfil ? <UserCheck className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    {clientePerfil ? 'Mi Perfil de Cliente' : 'Registro de Cliente'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {clientePerfil
                      ? 'Tus datos guardados para entrega rápida y facturación'
                      : 'Guarda tus datos una sola vez para agilizar tus compras'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPerfilModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleGuardarPerfil} className="p-4 sm:p-6 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                💡 Al guardar tus datos en este equipo, cada vez que entres a la tienda en línea tu dirección, teléfono y cédula se cargarán automáticamente al momento de ordenar.
              </p>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      value={perfilForm.nombre}
                      onChange={(e) => setPerfilForm({ ...perfilForm, nombre: e.target.value })}
                      placeholder="Ej. Valentina Mendoza"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Cédula / RIF *</label>
                    <input
                      type="text"
                      required
                      value={perfilForm.rif}
                      onChange={(e) => setPerfilForm({ ...perfilForm, rif: e.target.value })}
                      placeholder="Ej. V-18293847"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Teléfono WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={perfilForm.telefono}
                      onChange={(e) => setPerfilForm({ ...perfilForm, telefono: e.target.value })}
                      placeholder="Ej. 0412-1234567"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Correo Electrónico (Opcional)</label>
                    <input
                      type="email"
                      value={perfilForm.email || ''}
                      onChange={(e) => setPerfilForm({ ...perfilForm, email: e.target.value })}
                      placeholder="cliente@correo.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Dirección de Entrega Predeterminada *</label>
                  <textarea
                    rows={2}
                    required
                    value={perfilForm.direccion}
                    onChange={(e) => setPerfilForm({ ...perfilForm, direccion: e.target.value })}
                    placeholder="Urbanización, Calle/Avenida, Edificio o Casa, Número de Apto o Piso..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Punto de Referencia (Opcional)</label>
                  <input
                    type="text"
                    value={perfilForm.puntoReferencia || ''}
                    onChange={(e) => setPerfilForm({ ...perfilForm, puntoReferencia: e.target.value })}
                    placeholder="Ej. Frente a la plaza, portón verde..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                {clientePerfil ? (
                  <button
                    type="button"
                    onClick={handleEliminarPerfil}
                    className="px-3 py-2 bg-rose-950/40 hover:bg-rose-950/70 text-rose-300 border border-rose-800/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Eliminar perfil de este dispositivo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Borrar Datos</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPerfilModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{clientePerfil ? 'Actualizar Mis Datos' : 'Guardar Mis Datos'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Configurar WhatsApp Oficial de la Tienda */}
      {showConfigWhatsAppModal && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setShowConfigWhatsAppModal(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">WhatsApp para Recibir Pedidos</h3>
                  <p className="text-[11px] text-slate-400">Número oficial receptor del comercio</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigWhatsAppModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGuardarWhatsAppTienda(customWhatsAppInput);
              }}
              className="p-5 space-y-4 text-xs"
            >
              <p className="text-slate-300 leading-relaxed">
                Indica el número de WhatsApp oficial donde el comercio recibirá los pedidos en línea enviados por los clientes:
              </p>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Número de WhatsApp Receptor (Ej. 0414-1234567 o +58 412 1234567)
                </label>
                <input
                  type="text"
                  required
                  value={customWhatsAppInput}
                  onChange={(e) => setCustomWhatsAppInput(e.target.value)}
                  placeholder="0414-1234567"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-teal-500"
                  autoFocus
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Prefijos soportados: 0412, 0414, 0424, 0416, 0426 o con código de país +58
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowConfigWhatsAppModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-teal-500/20 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-8 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {tiendaConfig.nombreTienda || empresaConfig.nombreEmpresa} · RIF: {empresaConfig.rif}</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            {resolvedStorePhone && (
              <span className="text-slate-400 flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-teal-400" />
                <span>Atención: <strong className="text-slate-300 font-mono">{resolvedStorePhone}</strong></span>
              </span>
            )}
            <span>·</span>
            <span>Tasa Oficial: 1 USD = {formatBs(1, empresaConfig.tasaCambio)}</span>
            <span>·</span>
            <button
              type="button"
              onClick={() => {
                setInputAdminPin('');
                setPinError(null);
                setShowPinModal(true);
              }}
              className="text-slate-600 hover:text-slate-400 flex items-center gap-1 transition-colors cursor-pointer"
              title="Acceso restringido para el personal del comercio"
            >
              <Lock className="w-3 h-3 text-slate-600" />
              <span>Acceso al POS (Personal)</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modal: Acceso al Sistema POS Protegido por PIN */}
      {showPinModal && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setShowPinModal(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative space-y-4 cursor-default animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowPinModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Acceso al Sistema POS</h3>
                <p className="text-[11px] text-slate-400">Área restringida para el personal</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Esta sección es exclusiva para cajeros y administradores. Ingrese su <strong>PIN de empleado</strong> para ingresar al POS de facturación:
            </p>

            <form onSubmit={handleVerifyPinAndExit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  PIN de Cajero / Administrador:
                </label>
                <div className="relative">
                  <input
                    type={showPinPassword ? 'text' : 'password'}
                    value={inputAdminPin}
                    onChange={(e) => {
                      setInputAdminPin(e.target.value);
                      setPinError(null);
                    }}
                    placeholder="••••"
                    maxLength={10}
                    autoFocus
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-center text-xl font-mono tracking-widest text-emerald-300 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPinPassword(!showPinPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                    title={showPinPassword ? 'Ocultar' : 'Mostrar'}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                {pinError && (
                  <p className="text-xs text-rose-400 font-medium mt-2 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{pinError}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors"
                >
                  Verificar y Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Botón Flotante Permanente para Regresar al POS (SOLO en vista previa interna del comercio) */}
      {showInternalPreviewControls && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            type="button"
            onClick={onVolverAlPos}
            className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-2xl shadow-emerald-950/90 border border-emerald-400/50 flex items-center gap-2.5 text-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Haga clic para regresar a la facturación y administración"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Regresar al Sistema POS</span>
          </button>
        </div>
      )}
    </div>
  );
};
