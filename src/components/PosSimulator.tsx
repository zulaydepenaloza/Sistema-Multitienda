import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Barcode, 
  Trash2, 
  Plus, 
  Minus, 
  Store, 
  Lock, 
  Printer, 
  Receipt, 
  X,
  User,
  Users,
  Search,
  UserPlus,
  Scale,
  RotateCcw,
  Clock,
  Calculator,
  Tag,
  Monitor,
  CheckCircle,
  AlertCircle,
  Keyboard,
  ArrowRight,
  ShieldCheck,
  Package,
  Maximize
} from 'lucide-react';
import { 
  Sucursal, 
  Producto, 
  InventarioItem, 
  Venta, 
  Usuario, 
  EmpresaConfig, 
  Cliente,
  DetallePagoVenta 
} from '../types';
import { formatUSD, formatBs, formatDual } from '../lib/currency';
import { FiscalCortesView } from './FiscalCortesView';
import { PosPaymentModal1Sistema } from './PosPaymentModal1Sistema';
import { PosProductSearchModal } from './PosProductSearchModal';
import { PosTicketHoldModal, ParkedTicket } from './PosTicketHoldModal';
import { PriceTagsPrintModal } from './PriceTagsPrintModal';
import { BarcodeSvg } from './BarcodeSvg';
import { AITechFooter } from './AITechFooter';
import { printTicketViaIframe } from '../lib/ticketPrinter';

interface PosSimulatorProps {
  sucursales: Sucursal[];
  productos: Producto[];
  inventario: InventarioItem[];
  currentUser: Usuario | null;
  empresaConfig: EmpresaConfig;
  clientes: Cliente[];
  onRegistrarVenta: (
    sucursalId: number, 
    items: { producto: Producto; cantidad: number }[],
    cliente: { id: number | null; nombre: string; rif: string },
    pagoDetalle: DetallePagoVenta
  ) => void;
  onAddCliente?: (cliente: Omit<Cliente, 'id' | 'saldoPendiente' | 'fechaRegistro'>) => void;
  ventas: Venta[];
}

export const PosSimulator: React.FC<PosSimulatorProps> = ({
  sucursales,
  productos,
  inventario,
  currentUser,
  empresaConfig,
  clientes,
  onRegistrarVenta,
  onAddCliente,
  ventas,
}) => {
  const tasa = empresaConfig.tasaCambio || 36.50;

  // Sucursal State
  const [selectedSucursalId, setSelectedSucursalId] = useState<number>(
    currentUser?.sucursal_id && currentUser.sucursal_id <= 2 ? currentUser.sucursal_id : 1
  );

  // Cart / Items on current invoice ticket
  const [cart, setCart] = useState<{ 
    producto: Producto; 
    cantidad: number; 
    stockDisponible: number;
    precioUnitarioBs: number;
    subtotalBs: number;
  }[]>([]);

  // Selected item row index in table
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(-1);

  // Active Barcode & Name Input Line (LN cursor input)
  const [barcodeInput, setBarcodeInput] = useState<string>('');
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Live autocomplete matching while typing in POS input
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(0);
  const suggestionsContainerRef = useRef<HTMLDivElement>(null);

  // Filter matching products in real-time as user types
  const matchingProducts = useMemo(() => {
    const query = barcodeInput.trim().toLowerCase();
    if (!query) return [];

    return productos
      .filter((p) => {
        const nameMatch = p.nombre.toLowerCase().includes(query);
        const codeMatch = p.codigo_barras.toLowerCase().includes(query);
        const catMatch = p.categoria && p.categoria.toLowerCase().includes(query);
        const idMatch = String(p.id) === query;
        return nameMatch || codeMatch || catMatch || idMatch;
      })
      .sort((a, b) => {
        // Exact barcode match first
        if (a.codigo_barras.toLowerCase() === query) return -1;
        if (b.codigo_barras.toLowerCase() === query) return 1;
        // Starts with name match prioritized
        const aStarts = a.nombre.toLowerCase().startsWith(query);
        const bStarts = b.nombre.toLowerCase().startsWith(query);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.nombre.localeCompare(b.nombre);
      })
      .slice(0, 8); // Top 8 matching items for swift navigation
  }, [productos, barcodeInput]);

  // Reset active suggestion index when matching list changes
  useEffect(() => {
    setActiveSuggestionIndex(0);
  }, [matchingProducts]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsContainerRef.current &&
        !suggestionsContainerRef.current.contains(e.target as Node) &&
        barcodeInputRef.current &&
        !barcodeInputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Status & Feedback alerts
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Multiplier / Quantity prompt modal
  const [showQuantityModal, setShowQuantityModal] = useState<boolean>(false);
  const [quantityInput, setQuantityInput] = useState<string>('1');

  // Weighable Scale modal (KG / L)
  const [showScaleModal, setShowScaleModal] = useState<boolean>(false);
  const [scaleWeightInput, setScaleWeightInput] = useState<string>('1.000');

  // Sub-Modals
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [showProductSearchModal, setShowProductSearchModal] = useState<boolean>(false);
  const [showHoldModal, setShowHoldModal] = useState<boolean>(false);
  const [showFiscalModal, setShowFiscalModal] = useState<boolean>(false);
  const [fiscalModalTipo, setFiscalModalTipo] = useState<'X' | 'Z'>('X');
  const [showClientModal, setShowClientModal] = useState<boolean>(false);
  const [showQuickNewClient, setShowQuickNewClient] = useState<boolean>(false);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  const [showPriceTagsModal, setShowPriceTagsModal] = useState<boolean>(false);

  // Parked tickets on hold
  const [parkedTickets, setParkedTickets] = useState<ParkedTicket[]>([]);

  // Default & Selected Customer
  const DEFAULT_CLIENTE = {
    id: null as number | null,
    nombre: 'CLIENTE CONTADO',
    rif: 'V-00000000',
    direccion: 'MOSTRADOR / TIENDA LOCAL',
    telefono: 'N/A',
  };
  const [selectedCliente, setSelectedCliente] = useState<{
    id: number | null;
    nombre: string;
    rif: string;
    direccion?: string;
    telefono?: string;
  }>(DEFAULT_CLIENTE);

  // Fast Cédula input
  const [fastCedulaInput, setFastCedulaInput] = useState<string>('');
  const [clientSearch, setClientSearch] = useState<string>('');
  const [newClientData, setNewClientData] = useState({
    nombre: '',
    rif_cedula: '',
    telefono: '',
    email: '',
    direccion: '',
    limiteCredito: 0,
  });

  // Last Completed Ticket for printing
  const [lastCompletedTicket, setLastCompletedTicket] = useState<{
    numeroFactura: string;
    sucursalNombre: string;
    cajeroNombre: string;
    clienteNombre: string;
    clienteRif: string;
    items: { producto: Producto; cantidad: number }[];
    subtotalNeto: number;
    baseImponible: number;
    montoExento: number;
    montoIva: number;
    totalUsd: number;
    tasa: number;
    fecha: string;
    pagoDetalle: DetallePagoVenta;
  } | null>(null);

  // Live Clock
  const [liveTime, setLiveTime] = useState<string>(() => new Date().toLocaleTimeString('es-VE'));
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString('es-VE'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Invoice Number (Next sequential number)
  const nextInvoiceNumber = useMemo(() => {
    const count = ventas.length + 1;
    return String(9200000 + count).padStart(8, '0');
  }, [ventas.length]);

  const tiendaActual = sucursales.find((s) => s.id === selectedSucursalId) || sucursales[0];

  // Authorization check
  const isBranchAuthorized = () => {
    if (!currentUser) return false;
    if (currentUser.rol === 'admin') return true;
    if (currentUser.sucursal_id === selectedSucursalId) return true;
    return false;
  };

  // Financial calculations
  const subtotalNetoUsd = cart.reduce((sum, it) => sum + (it.producto.precio * it.cantidad), 0);
  const baseImponibleUsd = cart
    .filter((it) => !it.producto.exento_iva)
    .reduce((sum, it) => sum + (it.producto.precio * it.cantidad), 0);
  const montoExentoUsd = cart
    .filter((it) => !!it.producto.exento_iva)
    .reduce((sum, it) => sum + (it.producto.precio * it.cantidad), 0);
  const montoIvaUsd = +(baseImponibleUsd * 0.16).toFixed(2);
  const totalUsd = +(baseImponibleUsd + montoIvaUsd + montoExentoUsd).toFixed(2);

  const subtotalNetoBs = +(subtotalNetoUsd * tasa).toFixed(2);
  const baseImponibleBs = +(baseImponibleUsd * tasa).toFixed(2);
  const montoExentoBs = +(montoExentoUsd * tasa).toFixed(2);
  const montoIvaBs = +(montoIvaUsd * tasa).toFixed(2);
  const totalBs = +(totalUsd * tasa).toFixed(2);

  // Auto-focus barcode input
  useEffect(() => {
    if (
      !showPaymentModal &&
      !showProductSearchModal &&
      !showHoldModal &&
      !showFiscalModal &&
      !showClientModal &&
      !showReceiptModal &&
      !showQuantityModal &&
      !showScaleModal
    ) {
      barcodeInputRef.current?.focus();
    }
  }, [
    cart,
    showPaymentModal,
    showProductSearchModal,
    showHoldModal,
    showFiscalModal,
    showClientModal,
    showReceiptModal,
    showQuantityModal,
    showScaleModal,
  ]);

  // Barcode / Scanner item scan handler
  const handleScanBarcode = (codeToScan?: string, customQty: number = 1) => {
    const code = (codeToScan || barcodeInput).trim();
    if (!code) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    if (!isBranchAuthorized()) {
      setErrorMsg(`Acceso denegado: ${currentUser?.nombre_completo || 'Usuario'} no está asignado a ${tiendaActual.nombre}.`);
      setBarcodeInput('');
      return;
    }

    // Find product by barcode, SKU or typed product name
    const query = code.toLowerCase();
    let prod = productos.find(
      (p) => p.codigo_barras.toLowerCase() === query || String(p.id) === query
    );

    // If not exact barcode, find by name matching
    if (!prod) {
      prod = productos.find((p) => p.nombre.toLowerCase() === query) ||
             productos.find((p) => p.nombre.toLowerCase().startsWith(query)) ||
             productos.find((p) => p.nombre.toLowerCase().includes(query));
    }

    if (!prod) {
      setErrorMsg(`Artículo o código '${code}' no encontrado.`);
      setBarcodeInput('');
      setShowSuggestions(false);
      return;
    }

    // Check branch inventory stock
    const inv = inventario.find((i) => i.sucursal_id === selectedSucursalId && i.producto_id === prod.id);
    const currentStock = inv ? inv.stock : 0;

    const existingInCart = cart.find((item) => item.producto.id === prod.id);
    const existingQty = existingInCart ? existingInCart.cantidad : 0;
    const requestedQty = existingQty + customQty;

    if (requestedQty > currentStock) {
      setErrorMsg(`Stock insuficiente de '${prod.nombre}'. Disponible: ${currentStock}`);
      setBarcodeInput('');
      return;
    }

    const unitPriceBs = +(prod.precio * tasa).toFixed(2);

    if (existingInCart) {
      setCart(
        cart.map((item) => {
          if (item.producto.id === prod.id) {
            const nextQty = +(item.cantidad + customQty).toFixed(3);
            return {
              ...item,
              cantidad: nextQty,
              subtotalBs: +(nextQty * unitPriceBs).toFixed(2),
            };
          }
          return item;
        })
      );
    } else {
      setCart([
        ...cart,
        {
          producto: prod,
          cantidad: customQty,
          stockDisponible: currentStock,
          precioUnitarioBs: unitPriceBs,
          subtotalBs: +(customQty * unitPriceBs).toFixed(2),
        },
      ]);
    }

    setBarcodeInput('');
    setShowSuggestions(false);
    setSelectedRowIndex(cart.length);
  };

  // Keyboard Navigation & Shortcut Keys (F1 - F12)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an open input modal
      if (showPaymentModal || showProductSearchModal || showClientModal || showFiscalModal) {
        return;
      }

      if (e.key === 'F2') {
        e.preventDefault();
        setShowProductSearchModal(true);
      } else if (e.key === 'F4') {
        e.preventDefault();
        setShowQuantityModal(true);
      } else if (e.key === 'F6') {
        e.preventDefault();
        handleDevolucionUltimoItem();
      } else if (e.key === 'F7') {
        e.preventDefault();
        handleHoldOrOpenHoldModal();
      } else if (e.key === 'F8') {
        e.preventDefault();
        if (cart.length > 0) setShowPaymentModal(true);
      } else if (e.key === 'F10') {
        e.preventDefault();
        setFiscalModalTipo('X');
        setShowFiscalModal(true);
      } else if (e.key === 'F12') {
        e.preventDefault();
        setShowClientModal(true);
      }
      // Note: F11 is not intercepted so the browser can natively toggle full screen
      // Note: F9 is handled globally for the Commercial Calculator
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [
    cart,
    showPaymentModal,
    showProductSearchModal,
    showClientModal,
    showFiscalModal,
    selectedCliente,
  ]);

  // Action: F6 Void / Devolución item
  const handleDevolucionUltimoItem = () => {
    if (cart.length === 0) return;
    const targetIndex = selectedRowIndex >= 0 ? selectedRowIndex : cart.length - 1;
    const item = cart[targetIndex];
    if (!item) return;

    if (item.cantidad > 1) {
      setCart(
        cart.map((it, idx) =>
          idx === targetIndex
            ? {
                ...it,
                cantidad: it.cantidad - 1,
                subtotalBs: +((it.cantidad - 1) * it.precioUnitarioBs).toFixed(2),
              }
            : it
        )
      );
    } else {
      setCart(cart.filter((_, idx) => idx !== targetIndex));
      setSelectedRowIndex(-1);
    }
  };

  // Action: F7 Hold / Park current ticket
  const handleHoldOrOpenHoldModal = () => {
    if (cart.length > 0) {
      const newParked: ParkedTicket = {
        id: `hold_${Date.now()}`,
        hora: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' }),
        cliente: {
          id: selectedCliente.id,
          nombre: selectedCliente.nombre,
          rif: selectedCliente.rif,
        },
        items: [...cart],
        totalUsd,
      };
      setParkedTickets([newParked, ...parkedTickets]);
      setCart([]);
      setSelectedCliente(DEFAULT_CLIENTE);
      setSuccessMsg(`Ticket pausado y colocado en espera (${cart.length} artículos).`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } else {
      setShowHoldModal(true);
    }
  };

  // Action: Restore held ticket
  const handleRestoreTicket = (t: ParkedTicket) => {
    setCart(t.items);
    setSelectedCliente({
      id: t.cliente.id,
      nombre: t.cliente.nombre,
      rif: t.cliente.rif,
      direccion: 'CLIENTE EN ESPERA',
    });
    setParkedTickets(parkedTickets.filter((item) => item.id !== t.id));
    setSuccessMsg(`Ticket recuperado: ${t.cliente.nombre} (${t.items.length} ítems).`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Action: F9 Suspender / Cancel entire ticket
  const handleSuspenderVenta = () => {
    if (cart.length === 0) return;
    if (confirm('¿Deseas anular y limpiar completamente el ticket actual en caja?')) {
      setCart([]);
      setSelectedCliente(DEFAULT_CLIENTE);
      setSelectedRowIndex(-1);
    }
  };

  // Complete Payment Submission from PosPaymentModal1Sistema
  const handleConfirmSaleExecution = (detallePago: DetallePagoVenta) => {
    if (cart.length === 0) return;

    const saleItems = cart.map((c) => ({
      producto: c.producto,
      cantidad: c.cantidad,
    }));

    onRegistrarVenta(
      selectedSucursalId,
      saleItems,
      {
        id: selectedCliente.id,
        nombre: selectedCliente.nombre,
        rif: selectedCliente.rif,
      },
      detallePago
    );

    const completed = {
      numeroFactura: nextInvoiceNumber,
      sucursalNombre: tiendaActual.nombre,
      cajeroNombre: currentUser?.nombre_completo || 'Cajero de Turno',
      clienteNombre: selectedCliente.nombre,
      clienteRif: selectedCliente.rif,
      items: saleItems,
      subtotalNeto: subtotalNetoUsd,
      baseImponible: baseImponibleUsd,
      montoExento: montoExentoUsd,
      montoIva: montoIvaUsd,
      totalUsd,
      tasa,
      fecha: new Date().toLocaleString('es-VE'),
      pagoDetalle: detallePago,
    };

    setLastCompletedTicket(completed);
    setCart([]);
    setSelectedCliente(DEFAULT_CLIENTE);
    setSelectedRowIndex(-1);
    setShowPaymentModal(false);
    setShowReceiptModal(true);
    setSuccessMsg(`¡Factura #${nextInvoiceNumber} emitida con éxito por ${formatBs(totalBs, 1)} ($${totalUsd.toFixed(2)})!`);
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  // Open & Reprint the last ticket
  const handleOpenLastTicket = () => {
    if (lastCompletedTicket) {
      setShowReceiptModal(true);
      return;
    }
    // If not in state, look up the last sale in this branch
    const branchSales = ventas.filter((v) => v.sucursal_id === selectedSucursalId);
    const lastSale = branchSales.length > 0 ? branchSales[branchSales.length - 1] : ventas[ventas.length - 1];
    if (lastSale) {
      const derivedTicket = {
        numeroFactura: lastSale.id ? String(lastSale.id).padStart(8, '0') : '00000001',
        sucursalNombre: tiendaActual.nombre,
        cajeroNombre: lastSale.usuario_nombre || currentUser?.nombre_completo || 'Cajero de Turno',
        clienteNombre: lastSale.cliente_nombre || 'Cliente de Mostrador',
        clienteRif: lastSale.cliente_rif || 'V-00000000',
        items: (lastSale.detalles || []).map((d) => ({
          producto: {
            id: d.producto_id,
            nombre: d.producto_nombre,
            precio: d.precio_unitario,
            codigo_barras: d.codigo_barras || '',
            categoria: '',
            activo: true,
            unidad_medida: (d.unidad_medida as any) || 'UND',
            costo: 0,
            margen_ganancia: 0,
            aplica_iva: !(d.exento_iva),
            stock_por_sucursal: {}
          } as Producto,
          cantidad: d.cantidad,
        })),
        subtotalNeto: lastSale.subtotal_neto || lastSale.total,
        baseImponible: lastSale.base_imponible || 0,
        montoExento: lastSale.monto_exento || 0,
        montoIva: lastSale.monto_iva || 0,
        totalUsd: lastSale.total,
        tasa,
        fecha: lastSale.fecha,
        pagoDetalle: (lastSale.pago_detalle as any) || {
          metodo: (lastSale.metodo_pago as any) || 'efectivo_usd',
          monto_usd: lastSale.total,
          monto_bs: lastSale.total * tasa,
        },
      };
      setLastCompletedTicket(derivedTicket);
      setShowReceiptModal(true);
    } else {
      setSuccessMsg('Aún no se han emitido ventas en esta sesión.');
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  // Dedicated thermal iframe print handler
  const handlePrintTicket = async () => {
    if (!lastCompletedTicket) return;
    const ticketData = {
      numeroFactura: lastCompletedTicket.numeroFactura,
      sucursalNombre: lastCompletedTicket.sucursalNombre,
      cajeroNombre: lastCompletedTicket.cajeroNombre,
      clienteNombre: lastCompletedTicket.clienteNombre,
      clienteRif: lastCompletedTicket.clienteRif,
      items: lastCompletedTicket.items.map((it) => ({
        nombre: it.producto.nombre,
        cantidad: it.cantidad,
        precio: it.producto.precio,
        codigo_barras: it.producto.codigo_barras,
        unidad_medida: it.producto.unidad_medida,
      })),
      subtotalNeto: lastCompletedTicket.subtotalNeto,
      baseImponible: lastCompletedTicket.baseImponible,
      montoExento: lastCompletedTicket.montoExento,
      montoIva: lastCompletedTicket.montoIva,
      totalUsd: lastCompletedTicket.totalUsd,
      tasa: lastCompletedTicket.tasa,
      fecha: lastCompletedTicket.fecha,
      pagoDetalle: lastCompletedTicket.pagoDetalle,
    };

    await printTicketViaIframe(ticketData, empresaConfig);
  };

  // Client Selection / Fast Cédula
  const handleFastCedulaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanVal = fastCedulaInput.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (!cleanVal) return;

    const match = clientes.find((c) => {
      const cleanRif = c.rif_cedula.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      return cleanRif === cleanVal || cleanRif.endsWith(cleanVal);
    });

    if (match) {
      setSelectedCliente({
        id: match.id,
        nombre: match.nombre,
        rif: match.rif_cedula,
        direccion: match.direccion || 'CLIENTE REGISTRADO',
        telefono: match.telefono,
      });
      setFastCedulaInput('');
      setSuccessMsg(`Cliente seleccionado: ${match.nombre}`);
      setTimeout(() => setSuccessMsg(null), 2500);
    } else {
      setNewClientData((prev) => ({ ...prev, rif_cedula: fastCedulaInput }));
      setShowQuickNewClient(true);
      setShowClientModal(true);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4.5rem)] min-h-[640px] bg-slate-950 text-slate-100 font-sans select-none overflow-hidden rounded-2xl border border-slate-800 shadow-2xl">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER BRAND & SYSTEM BAR (Like Stellar Image 1)                     */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black font-mono">
            POS
          </div>
          <div>
            <span className="font-extrabold text-white tracking-wider text-sm uppercase">
              {empresaConfig.nombreEmpresa || 'GRAN ABASTO GIRASOL, C.A.'}
            </span>
            <span className="text-slate-500 text-[11px] ml-2 font-mono">
              RIF: {empresaConfig.rif}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Sucursal Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-xs">
            <Store className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={selectedSucursalId}
              onChange={(e) => {
                setSelectedSucursalId(Number(e.target.value));
                setCart([]);
              }}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              {sucursales.filter((s) => s.tipo === 'tienda').map((suc) => (
                <option key={suc.id} value={suc.id} className="bg-slate-900 text-white">
                  {suc.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Cortes X / Z */}
          <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => {
                setFiscalModalTipo('X');
                setShowFiscalModal(true);
              }}
              className="px-2 py-0.5 rounded text-[11px] font-bold text-sky-400 hover:bg-sky-500/10 cursor-pointer"
              title="Corte X (Parcial de Turno)"
            >
              Corte X
            </button>
            <button
              type="button"
              onClick={() => {
                setFiscalModalTipo('Z');
                setShowFiscalModal(true);
              }}
              className="px-2 py-0.5 rounded text-[11px] font-bold text-rose-400 hover:bg-rose-500/10 cursor-pointer"
              title="Corte Z (Cierre Fiscal Diario)"
            >
              Corte Z
            </button>
          </div>

          {/* Quick Shelf Price Tags Button in POS */}
          <button
            type="button"
            onClick={() => setShowPriceTagsModal(true)}
            className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer"
            title="Diseñar e imprimir etiquetas de precios para anaqueles y estantes"
          >
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Habladores / Anaquel</span>
          </button>

          {/* Quick Last Ticket / Reprint Button */}
          <button
            type="button"
            onClick={handleOpenLastTicket}
            className="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer"
            title="Ver y reimprimir el último ticket de venta emitido"
          >
            <Receipt className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Último Ticket</span>
          </button>

          {/* URL / Web store indication */}
          <span className="hidden md:inline font-mono text-slate-500 text-[11px]">
            www.tienda-pos.ve
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP DUAL CARD SECTION: CLIENTE & FACTURA (LEFT) | GRAND TOTALS (RIGHT) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 bg-slate-950 border-b border-slate-800/90">
        
        {/* LEFT BOX (lg:col-span-7 xl:col-span-8): Client info card */}
        <div className="lg:col-span-7 xl:col-span-8 bg-slate-900/90 rounded-xl border border-slate-800 p-3 flex flex-col justify-between space-y-2 relative overflow-hidden">
          <div className="flex items-start justify-between gap-3">
            
            {/* Owl / Store Avatar Badge (Like Stellar POS Image 1) */}
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-700/80 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <circle cx="8" cy="10" r="3" />
                  <circle cx="16" cy="10" r="3" />
                  <circle cx="8" cy="10" r="1" fill="currentColor" />
                  <circle cx="16" cy="10" r="1" fill="currentColor" />
                  <path d="M12 14c-.5 1-1.5 1.5-2 1.5s-1.5-.5-2-1.5" />
                  <path d="M12 4a8 8 0 0 0-8 8c0 5 4 8 8 8s8-3 8-8a8 8 0 0 0-8-8z" />
                </svg>
              </div>

              {/* Customer Metadata Lines */}
              <div className="space-y-0.5 flex-1 min-w-0 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[11px]">Código de Cliente:</span>
                  <strong className="text-emerald-300 font-bold tracking-wider">
                    {selectedCliente.rif || '999999999999'}
                  </strong>
                  <button
                    type="button"
                    onClick={() => setShowClientModal(true)}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                    title="Cambiar cliente [F12]"
                  >
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[11px]">Nombre del Cliente:</span>
                  <span className="font-bold text-white uppercase truncate text-sm">
                    {selectedCliente.nombre}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-400 text-[11px] truncate">
                  <span>Dirección del Cliente:</span>
                  <span className="text-slate-300 truncate">
                    {selectedCliente.direccion || 'MOSTRADOR / TIENDA LOCAL'}
                  </span>
                </div>
              </div>
            </div>

            {/* Factura Nº Badge & Virtual Keyboard Trigger */}
            <div className="text-right shrink-0 space-y-1">
              <span className="text-[10px] text-slate-400 block font-mono">Factura Nº</span>
              <span className="text-lg font-black text-white font-mono tracking-wider block bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800">
                {nextInvoiceNumber}
              </span>
              
              <button
                type="button"
                onClick={() => setShowClientModal(true)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80 cursor-pointer inline-flex items-center gap-1 text-[10px] transition-colors"
                title="Teclado Virtual de Cédula"
              >
                <Keyboard className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Cédula [F12]</span>
              </button>
            </div>
          </div>

          {/* Quick Fast Cédula input bar inline */}
          <form onSubmit={handleFastCedulaSubmit} className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Cédula / RIF Rápido:
            </span>
            <input
              type="text"
              value={fastCedulaInput}
              onChange={(e) => setFastCedulaInput(e.target.value)}
              placeholder="Ej: V-12345678 + [Enter]"
              className="bg-slate-950 border border-slate-700 focus:border-emerald-500 text-xs text-white font-mono px-2.5 py-1 rounded-lg focus:outline-none flex-1 max-w-xs"
            />
            <button
              type="submit"
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg cursor-pointer"
            >
              Buscar
            </button>
            {selectedCliente.id && (
              <button
                type="button"
                onClick={() => setSelectedCliente(DEFAULT_CLIENTE)}
                className="text-[10px] text-amber-400 hover:underline cursor-pointer"
              >
                Restablecer Contado
              </button>
            )}
          </form>
        </div>

        {/* RIGHT BOX (lg:col-span-5 xl:col-span-4): Big Financial Totals Display (Like Stellar Image 1) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-slate-900/95 rounded-xl border-2 border-slate-700/90 p-3.5 flex flex-col justify-between shadow-inner">
          <div className="space-y-1 font-mono text-xs text-slate-300">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-sans text-xs">Subtotal:</span>
              <span className="font-bold text-slate-200 text-sm">{formatBs(subtotalNetoBs, 1)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-sans text-xs">Impuesto (IVA 16%):</span>
              <span className="font-bold text-slate-200 text-sm">{formatBs(montoIvaBs, 1)}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-right mt-1">
            <span className="text-[11px] font-bold text-slate-400 block font-sans uppercase tracking-wider">
              Total (Bs.S):
            </span>
            {/* Huge Prominent Bold Grand Total in Bolívares */}
            <div className="text-3xl sm:text-4xl font-black text-rose-500 font-mono tracking-tight leading-none my-1 drop-shadow-sm">
              {formatBs(totalBs, 1)}
            </div>
            {/* Dual USD Subline in prominent green */}
            <div className="text-base sm:text-lg font-black text-emerald-400 font-mono flex items-center justify-end gap-1">
              <span>$ {totalUsd.toFixed(2)}</span>
              <span className="text-[10px] text-slate-400 font-normal font-sans">
                (Tasa: {tasa.toFixed(2)})
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Feedback Alerts */}
      {errorMsg && (
        <div className="bg-rose-950/80 border-b border-rose-500/50 px-4 py-1.5 text-xs text-rose-200 flex items-center justify-between animate-fade-in">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <strong>{errorMsg}</strong>
          </span>
          <button onClick={() => setErrorMsg(null)} className="text-rose-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      {successMsg && (
        <div className="bg-emerald-950/80 border-b border-emerald-500/50 px-4 py-1.5 text-xs text-emerald-200 flex items-center justify-between animate-fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <strong>{successMsg}</strong>
          </span>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MAIN FISCAL ITEMS DATA TABLE (LA GRILLA DE FACTURACIÓN FISCAL)          */}
      {/* ========================================================================= */}
      <div className="flex-1 overflow-y-auto bg-slate-950 p-2 custom-scrollbar">
        <table className="w-full text-left border-collapse font-mono text-xs">
          {/* Header Row with distinctive red/accent bar (Image 1 style) */}
          <thead>
            <tr className="bg-rose-950/70 text-rose-200 border-b-2 border-rose-700/60 uppercase text-[11px] font-bold tracking-wider sticky top-0 z-10">
              <th className="py-2 px-2.5 text-center w-12">LN</th>
              <th className="py-2 px-3 w-36">CÓDIGO</th>
              <th className="py-2 px-3">DESCRIPCIÓN</th>
              <th className="py-2 px-3 text-center w-20">CANT.</th>
              <th className="py-2 px-3 text-right w-28">PRECIO</th>
              <th className="py-2 px-3 text-right w-32">TOTAL</th>
              <th className="py-2 px-2.5 text-center w-16">PROMO</th>
              <th className="py-2 px-2 text-center w-20">ACCIONES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {cart.map((item, index) => {
              const lnNumber = index + 1;
              const isSelected = selectedRowIndex === index;
              const isExento = !!item.producto.exento_iva;
              const unit = item.producto.unidad_medida || 'UND';

              return (
                <tr
                  key={`${item.producto.id}-${index}`}
                  onClick={() => setSelectedRowIndex(index)}
                  className={`transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600/25 text-white font-semibold'
                      : index % 2 === 0
                      ? 'bg-slate-900/40 text-slate-200 hover:bg-slate-800/40'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800/40'
                  }`}
                >
                  {/* LN Line Number */}
                  <td className="py-2 px-2.5 text-center font-bold text-slate-400 text-xs">
                    {String(lnNumber).padStart(2, '0')}
                  </td>

                  {/* CÓDIGO (Barcode) */}
                  <td className="py-2 px-3 text-emerald-400 font-mono font-bold truncate">
                    {item.producto.codigo_barras}
                  </td>

                  {/* DESCRIPCIÓN (Uppercase like Stellar POS) */}
                  <td className="py-2 px-3 font-bold uppercase text-white truncate max-w-[280px]">
                    {item.producto.nombre}
                    <span className="text-[10px] text-slate-500 font-normal ml-1.5 font-sans">
                      ({unit})
                    </span>
                  </td>

                  {/* CANT. */}
                  <td className="py-2 px-3 text-center font-bold text-white">
                    {item.cantidad % 1 === 0 ? item.cantidad : item.cantidad.toFixed(3)}
                  </td>

                  {/* PRECIO Unitario en Bs */}
                  <td className="py-2 px-3 text-right text-slate-300">
                    {formatBs(item.precioUnitarioBs, 1)}
                  </td>

                  {/* TOTAL */}
                  <td className="py-2 px-3 text-right font-black text-emerald-300">
                    {formatBs(item.subtotalBs, 1)}
                  </td>

                  {/* PROMO / IVA Indicator */}
                  <td className="py-2 px-2.5 text-center">
                    {isExento ? (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-1 py-0.5 rounded">
                        (E)
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-1 py-0.5 rounded">
                        16%
                      </span>
                    )}
                  </td>

                  {/* Quick Action +/- */}
                  <td className="py-2 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (item.cantidad > 1) {
                            setCart(
                              cart.map((it, idx) =>
                                idx === index
                                  ? {
                                      ...it,
                                      cantidad: it.cantidad - 1,
                                      subtotalBs: +((it.cantidad - 1) * it.precioUnitarioBs).toFixed(2),
                                    }
                                  : it
                              )
                            );
                          } else {
                            setCart(cart.filter((_, idx) => idx !== index));
                          }
                        }}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                        title="Disminuir 1 unidad"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (item.cantidad + 1 <= item.stockDisponible) {
                            setCart(
                              cart.map((it, idx) =>
                                idx === index
                                  ? {
                                      ...it,
                                      cantidad: it.cantidad + 1,
                                      subtotalBs: +((it.cantidad + 1) * it.precioUnitarioBs).toFixed(2),
                                    }
                                  : it
                              )
                            );
                          } else {
                            setErrorMsg(`Stock máximo disponible alcanzado (${item.stockDisponible})`);
                          }
                        }}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                        title="Aumentar 1 unidad"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setCart(cart.filter((_, idx) => idx !== index))}
                        className="p-1 rounded bg-rose-950/50 hover:bg-rose-900 text-rose-400 cursor-pointer"
                        title="Eliminar línea"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {/* Active Cursor Row: LN [N] Input Line (Live name typing & scanner) */}
            <tr className="bg-slate-900/80 border-t-2 border-emerald-500/40 relative">
              <td className="py-2 px-2.5 text-center font-bold text-emerald-400">
                {String(cart.length + 1).padStart(2, '0')}
              </td>
              <td colSpan={7} className="py-1 px-3">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    {/* Live search input with keyboard & scanner support */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        ref={barcodeInputRef}
                        type="text"
                        value={barcodeInput}
                        onChange={(e) => {
                          setBarcodeInput(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => {
                          if (barcodeInput.trim().length > 0) {
                            setShowSuggestions(true);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (showSuggestions && matchingProducts.length > 0) {
                            if (e.key === 'ArrowDown') {
                              e.preventDefault();
                              setActiveSuggestionIndex((prev) => (prev + 1) % matchingProducts.length);
                              return;
                            }
                            if (e.key === 'ArrowUp') {
                              e.preventDefault();
                              setActiveSuggestionIndex((prev) => (prev - 1 + matchingProducts.length) % matchingProducts.length);
                              return;
                            }
                            if (e.key === 'Escape') {
                              e.preventDefault();
                              setShowSuggestions(false);
                              return;
                            }
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const selectedProd = matchingProducts[activeSuggestionIndex] || matchingProducts[0];
                              if (selectedProd) {
                                handleScanBarcode(selectedProd.codigo_barras);
                                setShowSuggestions(false);
                                return;
                              }
                            }
                          }

                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleScanBarcode();
                            setShowSuggestions(false);
                          }
                        }}
                        placeholder="Escribe el nombre del artículo o escanea código de barras..."
                        className="w-full bg-slate-950 border border-slate-700 text-emerald-300 font-mono text-xs pl-8 pr-8 py-2 rounded-lg focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40 focus:outline-none placeholder:text-slate-500 tracking-wider shadow-inner"
                      />
                      {barcodeInput && (
                        <button
                          type="button"
                          onClick={() => {
                            setBarcodeInput('');
                            setShowSuggestions(false);
                            barcodeInputRef.current?.focus();
                          }}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                          title="Limpiar búsqueda"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* LIVE MATCHING SUGGESTIONS DROPDOWN (Pestaña / Tarjetas de coincidencias en vivo) */}
                    {showSuggestions && barcodeInput.trim().length > 0 && (
                      <div
                        ref={suggestionsContainerRef}
                        className={`absolute left-0 right-0 z-50 bg-slate-900 border-2 border-emerald-500/80 shadow-2xl rounded-2xl overflow-hidden font-sans backdrop-blur-md animate-fade-in ${
                          cart.length === 0 ? 'top-full mt-2' : 'bottom-full mb-2'
                        }`}
                        style={{ minWidth: '320px', maxHeight: '360px' }}
                      >
                        {/* Header bar */}
                        <div className="bg-slate-950 px-3.5 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span className="font-bold text-white text-[11px] uppercase tracking-wide">
                              Coincidencias en tiempo real
                            </span>
                            <span className="bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px] px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                              {matchingProducts.length} artículo(s)
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                            Usa [↑] [↓] y [Enter] o clic
                          </span>
                        </div>

                        {/* Results list */}
                        {matchingProducts.length === 0 ? (
                          <div className="p-4 text-center text-slate-400 text-xs space-y-1">
                            <p className="font-semibold text-slate-300">
                              No hay artículos que coincidan con &ldquo;{barcodeInput}&rdquo;
                            </p>
                            <p className="text-[11px] text-slate-500">
                              Verifica la ortografía o pulsa <strong>[F2 Buscar]</strong> para revisar todo el catálogo.
                            </p>
                          </div>
                        ) : (
                          <div className="overflow-y-auto max-h-[280px] divide-y divide-slate-800/80 custom-scrollbar">
                            {matchingProducts.map((p, idx) => {
                              const isHighlighted = idx === activeSuggestionIndex;
                              const invItem = inventario.find(
                                (i) => i.sucursal_id === selectedSucursalId && i.producto_id === p.id
                              );
                              const stockDisp = invItem ? invItem.stock : 0;
                              const hasStock = stockDisp > 0;
                              const precioBs = +(p.precio * tasa).toFixed(2);

                              return (
                                <div
                                  key={p.id}
                                  onMouseEnter={() => setActiveSuggestionIndex(idx)}
                                  onClick={() => {
                                    handleScanBarcode(p.codigo_barras);
                                    setShowSuggestions(false);
                                    barcodeInputRef.current?.focus();
                                  }}
                                  className={`p-2.5 flex items-center justify-between gap-3 cursor-pointer transition-all ${
                                    isHighlighted
                                      ? 'bg-emerald-950/80 border-l-4 border-emerald-400 pl-2 shadow-inner'
                                      : 'bg-slate-900/95 hover:bg-slate-800/80'
                                  }`}
                                >
                                  {/* Left: Product Icon & Info */}
                                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                    <div
                                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                                        isHighlighted
                                          ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/60 shadow-md'
                                          : 'bg-slate-800 text-slate-400 border-slate-700/80'
                                      }`}
                                    >
                                      <Package className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="font-black text-xs text-white uppercase truncate flex items-center gap-2">
                                        <span>{p.nombre}</span>
                                        {p.exento_iva ? (
                                          <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 py-0.5 rounded font-mono font-bold">
                                            (E) EXENTO
                                          </span>
                                        ) : (
                                          <span className="text-[9px] bg-slate-800 text-slate-400 px-1 py-0.5 rounded font-mono">
                                            IVA 16%
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                                        <span className="text-emerald-400 font-bold tracking-wider">
                                          {p.codigo_barras}
                                        </span>
                                        <span>•</span>
                                        <span className="text-slate-300 truncate">
                                          {p.categoria || 'General'}
                                        </span>
                                        <span>•</span>
                                        <span
                                          className={`font-bold px-1.5 py-0.2 rounded ${
                                            hasStock
                                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                              : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                                          }`}
                                        >
                                          {hasStock
                                            ? `Stock: ${stockDisp} ${p.unidad_medida || 'UND'}`
                                            : 'Sin stock (0)'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Right: Prices & Action */}
                                  <div className="text-right shrink-0 flex flex-col items-end">
                                    <div className="text-sm font-black text-emerald-400 font-mono">
                                      $ {p.precio.toFixed(2)}
                                    </div>
                                    <div className="text-[11px] font-bold text-slate-200 font-mono">
                                      {formatBs(precioBs, 1)}
                                    </div>
                                    <span
                                      className={`text-[9px] font-bold mt-1 px-2 py-0.5 rounded-md inline-flex items-center gap-1 transition-colors ${
                                        isHighlighted
                                          ? 'bg-emerald-500 text-slate-950 shadow'
                                          : 'bg-slate-800 text-emerald-400'
                                      }`}
                                    >
                                      <Plus className="w-3 h-3 stroke-[3]" />
                                      Agregar
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Footer tip */}
                        <div className="bg-slate-950 px-3 py-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span>💡 Selecciona con clic o presiona Enter para agregar</span>
                          <button
                            type="button"
                            onClick={() => {
                              setShowSuggestions(false);
                              setShowProductSearchModal(true);
                            }}
                            className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                          >
                            Abrir catálogo completo [F2] →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (matchingProducts.length > 0) {
                        const targetProd = matchingProducts[activeSuggestionIndex] || matchingProducts[0];
                        handleScanBarcode(targetProd.codigo_barras);
                      } else {
                        handleScanBarcode();
                      }
                      setShowSuggestions(false);
                    }}
                    className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1.5 shadow transition-colors shrink-0"
                    title="Agregar artículo al ticket [Enter]"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Enter</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Empty state hint */}
        {cart.length === 0 && (
          <div className="py-14 text-center text-slate-600 text-xs space-y-1 font-mono">
            <Barcode className="w-10 h-10 mx-auto text-slate-700 stroke-[1.5]" />
            <p className="text-slate-400 font-bold">PUNTO DE VENTA LISTO</p>
            <p className="text-[11px] text-slate-600">
              Escanea productos con el lector láser o pulsa <strong>[F2 Buscar]</strong> para abrir el catálogo.
            </p>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. BOTTOM FUNCTION KEYS TOOLBAR (TECLAS DE FUNCIÓN F1 - F12)             */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 border-t border-slate-800 p-2">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 text-center font-mono">
          
          {/* F2 Buscar */}
          <button
            type="button"
            onClick={() => setShowProductSearchModal(true)}
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-blue-600/30 hover:border-blue-500 border border-slate-700/80 text-slate-200 transition-all flex flex-col items-center gap-1 cursor-pointer active:scale-95 shadow-sm"
          >
            <Search className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-bold text-white">F2 Buscar</span>
            <span className="text-[8px] text-slate-400 hidden sm:inline font-sans">Catálogo</span>
          </button>

          {/* F3 Límite */}
          <button
            type="button"
            onClick={() => {
              if (selectedCliente.id) {
                const cl = clientes.find((c) => c.id === selectedCliente.id);
                alert(`Cliente: ${selectedCliente.nombre}\nLímite Crédito: ${formatUSD(cl?.limiteCredito || 0)}\nSaldo Pendiente: ${formatUSD(cl?.saldoPendiente || 0)}`);
              } else {
                alert('Selecciona primero un cliente registrado para consultar su límite de crédito.');
              }
            }}
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 text-slate-200 transition-all flex flex-col items-center gap-1 cursor-pointer active:scale-95 shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] font-bold text-white">F3 Límite</span>
            <span className="text-[8px] text-slate-400 hidden sm:inline font-sans">Crédito</span>
          </button>

          {/* F4 Cantidad */}
          <button
            type="button"
            onClick={() => setShowQuantityModal(true)}
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 text-slate-200 transition-all flex flex-col items-center gap-1 cursor-pointer active:scale-95 shadow-sm"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-bold text-white">F4 Cantidad</span>
            <span className="text-[8px] text-slate-400 hidden sm:inline font-sans">Multiplicar</span>
          </button>

          {/* F6 Reintegro */}
          <button
            type="button"
            onClick={handleDevolucionUltimoItem}
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 text-slate-200 transition-all flex flex-col items-center gap-1 cursor-pointer active:scale-95 shadow-sm"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-bold text-white">F6 Reintegro</span>
            <span className="text-[8px] text-slate-400 hidden sm:inline font-sans">-1 Item</span>
          </button>

          {/* F7 En Espera */}
          <button
            type="button"
            onClick={handleHoldOrOpenHoldModal}
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-amber-600/30 hover:border-amber-500 border border-slate-700/80 text-slate-200 transition-all flex flex-col items-center gap-1 cursor-pointer active:scale-95 shadow-sm relative"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-bold text-white">F7 Espera</span>
            <span className="text-[8px] text-slate-400 hidden sm:inline font-sans">Hold</span>
            {parkedTickets.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] flex items-center justify-center">
                {parkedTickets.length}
              </span>
            )}
          </button>

          {/* F8 Totalizar / Cobrar (Primary Action) */}
          <button
            type="button"
            onClick={() => {
              if (cart.length > 0) setShowPaymentModal(true);
            }}
            disabled={cart.length === 0}
            className={`p-2 rounded-xl border text-slate-200 transition-all flex flex-col items-center gap-1 active:scale-95 shadow-md ${
              cart.length > 0
                ? 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black border-emerald-400 cursor-pointer shadow-emerald-950/60'
                : 'bg-slate-800/50 border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Calculator className={`w-4 h-4 ${cart.length > 0 ? 'text-slate-950 stroke-[2.5]' : 'text-slate-600'}`} />
            <span className={`text-[10px] font-black ${cart.length > 0 ? 'text-slate-950' : 'text-slate-500'}`}>
              F8 Totalizar
            </span>
            <span className={`text-[8px] hidden sm:inline font-sans ${cart.length > 0 ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>
              Cobrar
            </span>
          </button>

          {/* F9 Suspender */}
          <button
            type="button"
            onClick={handleSuspenderVenta}
            disabled={cart.length === 0}
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-rose-950/50 hover:border-rose-500 border border-slate-700/80 text-slate-200 transition-all flex flex-col items-center gap-1 cursor-pointer active:scale-95 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Monitor className="w-4 h-4 text-rose-400" />
            <span className="text-[10px] font-bold text-white">F9 Suspender</span>
            <span className="text-[8px] text-slate-400 hidden sm:inline font-sans">Anular</span>
          </button>

          {/* F12 Clientes */}
          <button
            type="button"
            onClick={() => setShowClientModal(true)}
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-indigo-600/30 hover:border-indigo-500 border border-slate-700/80 text-slate-200 transition-all flex flex-col items-center gap-1 cursor-pointer active:scale-95 shadow-sm"
          >
            <Users className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] font-bold text-white">F12 Clientes</span>
            <span className="text-[8px] text-slate-400 hidden sm:inline font-sans">Directorio</span>
          </button>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. STATUS BAR FOOTER (Like Stellar Image 1)                                */}
      {/* ========================================================================= */}
      <div className="bg-slate-950 px-4 py-1.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-3 truncate">
          <span>
            Usuario: <strong className="text-emerald-400">{currentUser?.nombre_completo || 'CAJERO PRINCIPAL'}</strong>
          </span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="hidden sm:inline">Versión 4.0.5 Enterprise</span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span># FAC -&gt; {nextInvoiceNumber}</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-slate-300 font-bold">{new Date().toLocaleDateString('es-VE')}</span>
          <span className="text-white font-black">{liveTime}</span>
          <span className="hidden md:inline bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-emerald-400">
            Tasa BCV: {tasa.toFixed(2)} Bs/$
          </span>
        </div>
      </div>

      {/* Footer Corporativo Oficial AITech Soluciones, C. A. en POS */}
      <AITechFooter variant="pos" />

      {/* ========================================================================= */}
      {/* 6. MODALS                                                                 */}
      {/* ========================================================================= */}

      {/* Payment Modal (Image 2 style with split payments, numpad & dual calculations) */}
      <PosPaymentModal1Sistema
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        totalUsd={totalUsd}
        empresaConfig={empresaConfig}
        clienteNombre={selectedCliente.nombre}
        clienteRif={selectedCliente.rif}
        onConfirmPayment={handleConfirmSaleExecution}
      />

      {/* [F2] Product Search Modal */}
      <PosProductSearchModal
        isOpen={showProductSearchModal}
        onClose={() => setShowProductSearchModal(false)}
        productos={productos}
        inventario={inventario}
        selectedSucursalId={selectedSucursalId}
        empresaConfig={empresaConfig}
        onSelectProduct={(p) => handleScanBarcode(p.codigo_barras)}
      />

      {/* [F7] Held Tickets Modal */}
      <PosTicketHoldModal
        isOpen={showHoldModal}
        onClose={() => setShowHoldModal(false)}
        parkedTickets={parkedTickets}
        empresaConfig={empresaConfig}
        onRestoreTicket={handleRestoreTicket}
        onDeleteTicket={(id) => setParkedTickets(parkedTickets.filter((p) => p.id !== id))}
      />

      {/* [F4] Quantity Multiplier Prompt Modal */}
      {showQuantityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white font-mono uppercase">
                [F4] Multiplicar Cantidad
              </h3>
              <button onClick={() => setShowQuantityModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Ingresa la cantidad a facturar para el próximo artículo a escanear:
            </p>
            <input
              type="number"
              min="1"
              max="999"
              step="1"
              value={quantityInput}
              onChange={(e) => setQuantityInput(e.target.value)}
              className="w-full bg-slate-950 border-2 border-emerald-500 text-center font-mono font-black text-2xl text-emerald-400 py-2 rounded-xl focus:outline-none"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const q = parseInt(quantityInput, 10) || 1;
                  setShowQuantityModal(false);
                  barcodeInputRef.current?.focus();
                  setSuccessMsg(`Multiplicador fijado: ${q}x para el próximo producto.`);
                  setTimeout(() => setSuccessMsg(null), 3000);
                }}
                className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
              >
                Aceptar
              </button>
              <button
                type="button"
                onClick={() => setShowQuantityModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* [F5] Balanza / Scale Weight Prompt Modal */}
      {showScaleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
                <Scale className="w-4 h-4 text-cyan-400" />
                <span>[F5] Balanza Electrónica / Peso</span>
              </h3>
              <button onClick={() => setShowScaleModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Lectura de peso o fracción a granel (Kilogramos / Litros):
            </p>
            <div className="relative">
              <input
                type="number"
                min="0.001"
                step="0.001"
                value={scaleWeightInput}
                onChange={(e) => setScaleWeightInput(e.target.value)}
                className="w-full bg-slate-950 border-2 border-cyan-500 text-center font-mono font-black text-2xl text-cyan-400 py-2 rounded-xl focus:outline-none"
                autoFocus
              />
              <span className="absolute right-3 top-3 text-slate-500 font-mono text-sm font-bold">KG</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const w = parseFloat(scaleWeightInput) || 1.0;
                  setShowScaleModal(false);
                  // Apply to currently selected row if any
                  if (selectedRowIndex >= 0 && cart[selectedRowIndex]) {
                    setCart(
                      cart.map((it, idx) =>
                        idx === selectedRowIndex
                          ? {
                              ...it,
                              cantidad: +w.toFixed(3),
                              subtotalBs: +(w * it.precioUnitarioBs).toFixed(2),
                            }
                          : it
                      )
                    );
                  }
                  setSuccessMsg(`Peso fijado: ${w.toFixed(3)} KG`);
                  setTimeout(() => setSuccessMsg(null), 3000);
                }}
                className="flex-1 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
              >
                Aplicar Peso
              </button>
              <button
                type="button"
                onClick={() => setShowScaleModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* [F12] Client Directory & Selection Modal */}
      {showClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base font-mono">
                  [F12] Directorio de Clientes
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowClientModal(false);
                  setShowQuickNewClient(false);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!showQuickNewClient ? (
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    placeholder="Buscar por Nombre, Cédula o RIF..."
                    className="w-full bg-slate-950 border border-slate-700 pl-9 pr-4 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    autoFocus
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                </div>

                <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/80 border border-slate-800 rounded-xl bg-slate-950/60 custom-scrollbar">
                  {/* Option: Cliente Contado */}
                  <div
                    onClick={() => {
                      setSelectedCliente(DEFAULT_CLIENTE);
                      setShowClientModal(false);
                    }}
                    className="p-2.5 hover:bg-slate-800/60 cursor-pointer flex justify-between items-center transition-colors"
                  >
                    <div>
                      <span className="font-bold text-white text-xs block">CLIENTE CONTADO</span>
                      <span className="text-[11px] text-slate-400 font-mono">V-00000000 • Mostrador</span>
                    </div>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                      Por Defecto
                    </span>
                  </div>

                  {clientes
                    .filter(
                      (c) =>
                        c.nombre.toLowerCase().includes(clientSearch.toLowerCase()) ||
                        c.rif_cedula.toLowerCase().includes(clientSearch.toLowerCase())
                    )
                    .map((cl) => (
                      <div
                        key={cl.id}
                        onClick={() => {
                          setSelectedCliente({
                            id: cl.id,
                            nombre: cl.nombre,
                            rif: cl.rif_cedula,
                            direccion: cl.direccion,
                            telefono: cl.telefono,
                          });
                          setShowClientModal(false);
                        }}
                        className="p-2.5 hover:bg-slate-800/60 cursor-pointer flex justify-between items-center transition-colors"
                      >
                        <div>
                          <span className="font-bold text-white text-xs block">{cl.nombre}</span>
                          <span className="text-[11px] text-indigo-400 font-mono">
                            {cl.rif_cedula} {cl.telefono && `• ${cl.telefono}`}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">Seleccionar</span>
                      </div>
                    ))}
                </div>

                <button
                  type="button"
                  onClick={() => setShowQuickNewClient(true)}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Registrar Nuevo Cliente</span>
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newClientData.nombre.trim() || !newClientData.rif_cedula.trim()) return;
                  if (onAddCliente) {
                    onAddCliente({
                      nombre: newClientData.nombre.trim(),
                      rif_cedula: newClientData.rif_cedula.trim(),
                      telefono: newClientData.telefono.trim() || '+58 000-0000000',
                      direccion: newClientData.direccion.trim() || 'Mostrador',
                      limiteCredito: 0,
                    });
                  }
                  setSelectedCliente({
                    id: null,
                    nombre: newClientData.nombre.trim(),
                    rif: newClientData.rif_cedula.trim(),
                    direccion: newClientData.direccion.trim(),
                    telefono: newClientData.telefono.trim(),
                  });
                  setShowQuickNewClient(false);
                  setShowClientModal(false);
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Nombre o Razón Social *</label>
                  <input
                    type="text"
                    required
                    value={newClientData.nombre}
                    onChange={(e) => setNewClientData({ ...newClientData, nombre: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white px-3 py-2 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Cédula / RIF *</label>
                    <input
                      type="text"
                      required
                      value={newClientData.rif_cedula}
                      onChange={(e) => setNewClientData({ ...newClientData, rif_cedula: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 text-white font-mono px-3 py-2 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Teléfono</label>
                    <input
                      type="text"
                      value={newClientData.telefono}
                      onChange={(e) => setNewClientData({ ...newClientData, telefono: e.target.value })}
                      placeholder="+58 412 1234567"
                      className="w-full bg-slate-950 border border-slate-700 text-white font-mono px-3 py-2 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Dirección</label>
                  <input
                    type="text"
                    value={newClientData.direccion}
                    onChange={(e) => setNewClientData({ ...newClientData, direccion: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white px-3 py-2 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Guardar y Asignar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQuickNewClient(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    Volver
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Fiscal Cortes Modal (X / Z) */}
      {showFiscalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl max-w-4xl w-full p-5 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-white text-base font-mono uppercase">
                Módulo de Cortes Fiscales y Cierre de Caja
              </h3>
              <button onClick={() => setShowFiscalModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <FiscalCortesView
              tipoInicial={fiscalModalTipo}
              ventas={ventas}
              empresaConfig={empresaConfig}
              currentUser={currentUser}
              sucursalNombre={tiendaActual.nombre}
            />
          </div>
        </div>
      )}

      {/* Ticket / Invoice Receipt Modal Preview */}
      {showReceiptModal && lastCompletedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-sm animate-fade-in font-sans no-print">
          <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 text-slate-100">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
              <h3 className="font-bold text-white text-sm font-mono flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-400" />
                <span>Ticket Fiscal Emitido #{lastCompletedTicket.numeroFactura}</span>
              </h3>
              <button onClick={() => setShowReceiptModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thermal Receipt Paper representation */}
            <div className="bg-white text-black p-4 rounded-xl font-mono text-xs space-y-2 shadow-inner max-h-[62vh] overflow-y-auto custom-scrollbar">
              <div className="text-center font-bold">
                <div className="text-sm uppercase tracking-wide">{empresaConfig.nombreEmpresa}</div>
                <div>RIF: {empresaConfig.rif}</div>
                {(empresaConfig.direccionFiscal || (empresaConfig as any).direccion) && (
                  <div className="text-[9.5px] text-gray-600 font-normal">{empresaConfig.direccionFiscal || (empresaConfig as any).direccion}</div>
                )}
                <div className="text-[10px] text-gray-800">SUCURSAL: {lastCompletedTicket.sucursalNombre}</div>
                <div className="text-[10.5px] bg-black text-white px-2 py-0.5 inline-block rounded mt-1 font-mono">
                  Factura Fiscal: #{lastCompletedTicket.numeroFactura}
                </div>
              </div>
              <div className="border-t border-dashed border-gray-400 my-2" />
              <div className="text-[10.5px] space-y-0.5">
                <div><strong>FECHA:</strong> {lastCompletedTicket.fecha}</div>
                <div><strong>CLIENTE:</strong> {lastCompletedTicket.clienteNombre}</div>
                <div><strong>RIF/CÉDULA:</strong> {lastCompletedTicket.clienteRif}</div>
                {lastCompletedTicket.cajeroNombre && <div><strong>CAJERO:</strong> {lastCompletedTicket.cajeroNombre}</div>}
              </div>
              <div className="border-t border-dashed border-gray-400 my-2" />
              <div className="space-y-1">
                {lastCompletedTicket.items.map((it, idx) => (
                  <div key={idx} className="border-b border-gray-100 pb-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="truncate max-w-[200px] font-semibold">
                        {it.cantidad}x {it.producto.nombre}
                      </span>
                      <span className="font-bold">
                        {formatUSD(it.producto.precio * it.cantidad)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-gray-500 font-mono">
                      <span>CÓD: {it.producto.codigo_barras || 'N/A'}</span>
                      <span>({formatUSD(it.producto.precio)} c/u | {formatBs(it.producto.precio * lastCompletedTicket.tasa)})</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-gray-400 my-2" />
              <div className="space-y-0.5 text-right font-bold text-[11px]">
                <div className="flex justify-between">
                  <span>SUBTOTAL:</span>
                  <span>{formatUSD(lastCompletedTicket.subtotalNeto)}</span>
                </div>
                {lastCompletedTicket.montoExento > 0 && (
                  <div className="flex justify-between">
                    <span>EXENTO (E 0%):</span>
                    <span>{formatUSD(lastCompletedTicket.montoExento)}</span>
                  </div>
                )}
                {lastCompletedTicket.baseImponible > 0 && (
                  <div className="flex justify-between">
                    <span>BASE IMP. (G 16%):</span>
                    <span>{formatUSD(lastCompletedTicket.baseImponible)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>IVA (16%):</span>
                  <span>+{formatUSD(lastCompletedTicket.montoIva)}</span>
                </div>
                <div className="flex justify-between text-sm font-black pt-1 border-t border-black">
                  <span>TOTAL USD:</span>
                  <span>${lastCompletedTicket.totalUsd.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-blue-900">
                  <span>TOTAL BS:</span>
                  <span>Bs. {(lastCompletedTicket.totalUsd * lastCompletedTicket.tasa).toFixed(2)}</span>
                </div>
                <div className="text-right text-[8.5px] font-normal text-gray-500">
                  Tasa Oficial BCV: Bs. {lastCompletedTicket.tasa.toFixed(2)} / USD
                </div>
              </div>

              {/* Barcode of Invoice for scanner reading at dispatch / security */}
              <div className="border-t border-dashed border-gray-400 pt-3 pb-1 text-center">
                <div className="text-[9px] uppercase tracking-wider font-bold text-gray-500 mb-1">
                  Código de Validación de Factura
                </div>
                <div className="bg-white p-1 rounded flex justify-center">
                  <BarcodeSvg
                    value={`FAC-${lastCompletedTicket.numeroFactura}-${lastCompletedTicket.clienteRif.replace(/[^A-Za-z0-9]/g, '')}`}
                    height={38}
                    showText={true}
                    color="#000000"
                    className="w-full max-w-[260px] mx-auto"
                  />
                </div>
                <div className="text-[8px] text-gray-500 mt-1">
                  *** GRACIAS POR SU COMPRA ***
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handlePrintTicket}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all"
                title="Imprime directamente en impresora térmica de 80mm o 58mm sin hojas en blanco"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Ticket (Térmica Directa)</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                title="Impresión alternativa con el diálogo estándar del navegador"
              >
                <span>Navegador</span>
              </button>
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Native Browser Print Area for Sales Ticket (Only rendered during window.print) */}
      {lastCompletedTicket && (
        <div id="printable-ticket-area" className="hidden print:block">
          <div className="text-center font-bold">
            <div className="text-sm uppercase tracking-wide">{empresaConfig.nombreEmpresa}</div>
            <div className="text-xs">RIF: {empresaConfig.rif}</div>
            {(empresaConfig.direccionFiscal || (empresaConfig as any).direccion) && (
              <div className="text-[9px] text-gray-700">{empresaConfig.direccionFiscal || (empresaConfig as any).direccion}</div>
            )}
            <div className="text-[10px] mt-0.5">SUCURSAL: {lastCompletedTicket.sucursalNombre}</div>
            <div className="text-[10.5px] mt-1 font-mono font-bold">
              FACTURA FISCAL: #{lastCompletedTicket.numeroFactura}
            </div>
          </div>

          <div className="border-t border-dashed border-black my-2" />

          <div className="text-[10px] space-y-0.5">
            <div><strong>FECHA:</strong> {lastCompletedTicket.fecha}</div>
            <div><strong>CLIENTE:</strong> {lastCompletedTicket.clienteNombre}</div>
            <div><strong>RIF/CÉDULA:</strong> {lastCompletedTicket.clienteRif}</div>
            {lastCompletedTicket.cajeroNombre && <div><strong>CAJERO:</strong> {lastCompletedTicket.cajeroNombre}</div>}
          </div>

          <div className="border-t border-dashed border-black my-2" />

          <div className="text-[9.5px] font-bold flex justify-between uppercase mb-1">
            <span>CANT / DESCRIPCIÓN</span>
            <span>TOTAL</span>
          </div>

          <div className="space-y-1 mb-2">
            {lastCompletedTicket.items.map((it, idx) => (
              <div key={idx} className="border-b border-dotted border-gray-400 pb-1">
                <div className="flex justify-between font-bold text-[11px]">
                  <span className="truncate max-w-[200px]">{it.cantidad}x {it.producto.nombre}</span>
                  <span>${(it.producto.precio * it.cantidad).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[9px] text-gray-700">
                  <span>CÓD: {it.producto.codigo_barras || 'N/A'}</span>
                  <span>(${it.producto.precio.toFixed(2)} c/u | Bs. {(it.producto.precio * lastCompletedTicket.tasa).toFixed(2)})</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-black my-2" />

          <div className="space-y-0.5 text-right font-bold text-[11px]">
            <div className="flex justify-between">
              <span>SUBTOTAL:</span>
              <span>${lastCompletedTicket.subtotalNeto.toFixed(2)}</span>
            </div>
            {lastCompletedTicket.montoExento > 0 && (
              <div className="flex justify-between">
                <span>EXENTO (E 0%):</span>
                <span>${lastCompletedTicket.montoExento.toFixed(2)}</span>
              </div>
            )}
            {lastCompletedTicket.baseImponible > 0 && (
              <div className="flex justify-between">
                <span>BASE IMP. (G 16%):</span>
                <span>${lastCompletedTicket.baseImponible.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>IVA (16%):</span>
              <span>+${lastCompletedTicket.montoIva.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-black pt-1 border-t-2 border-black">
              <span>TOTAL USD:</span>
              <span>${lastCompletedTicket.totalUsd.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-black">
              <span>TOTAL BS:</span>
              <span>Bs. {(lastCompletedTicket.totalUsd * lastCompletedTicket.tasa).toFixed(2)}</span>
            </div>
            <div className="text-right text-[8.5px] font-normal text-gray-600">
              Tasa Oficial BCV: Bs. {lastCompletedTicket.tasa.toFixed(2)} / USD
            </div>
          </div>

          <div className="border-t border-dashed border-black my-2" />

          <div className="text-center pt-1">
            <div className="text-[9px] uppercase tracking-wider font-bold mb-1">
              Código de Validación de Factura
            </div>
            <BarcodeSvg
              value={`FAC-${lastCompletedTicket.numeroFactura}-${lastCompletedTicket.clienteRif.replace(/[^A-Za-z0-9]/g, '')}`}
              height={38}
              showText={true}
              color="#000000"
              className="w-full max-w-[240px] mx-auto"
            />
            <div className="text-[9px] font-bold mt-2">
              *** GRACIAS POR SU COMPRA ***
            </div>
            <div className="text-[8px] text-gray-600">
              Conserve este ticket para devoluciones o reclamos
            </div>
          </div>
        </div>
      )}


      {/* Price Tags & Shelf Labels Modal */}
      <PriceTagsPrintModal
        isOpen={showPriceTagsModal}
        onClose={() => setShowPriceTagsModal(false)}
        productos={productos}
        empresaConfig={empresaConfig}
      />

    </div>
  );
};
