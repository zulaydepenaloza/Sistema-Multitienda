import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  Plus,
  Truck,
  Building2,
  Calendar,
  DollarSign,
  PackageCheck,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  FileText,
  Search,
  Barcode,
  Scale,
  Trash2,
  Eye,
  X,
  PlusCircle,
  Tag,
  ArrowRight,
  Hash,
  GripHorizontal,
  Sparkles,
  FileUp,
} from 'lucide-react';
import { Compra, Proveedor, Producto, Sucursal, EmpresaConfig, Usuario, DetalleCompra } from '../types';
import { formatUSD, formatBs, formatDual } from '../lib/currency';
import { CargarFacturaModal } from './CargarFacturaModal';
import { WholesalePackConverter } from './WholesalePackConverter';

interface ComprasManagerProps {
  compras: Compra[];
  proveedores: Proveedor[];
  productos: Producto[];
  sucursales: Sucursal[];
  empresaConfig: EmpresaConfig;
  currentUser: Usuario | null;
  onRegistrarCompra: (compra: Omit<Compra, 'id'>, newProducts?: Producto[]) => void;
  onAddProveedor?: (nuevoProv: Omit<Proveedor, 'id'>) => void;
}

export const ComprasManager: React.FC<ComprasManagerProps> = ({
  compras,
  proveedores,
  productos,
  sucursales,
  empresaConfig,
  currentUser,
  onRegistrarCompra,
  onAddProveedor,
}) => {
  const [showNewModal, setShowNewModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [selectedCompraDetail, setSelectedCompraDetail] = useState<Compra | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Draggable Modal State
  const [modalPos, setModalPos] = useState({ x: 0, y: 0 });
  const [isDraggingModal, setIsDraggingModal] = useState(false);
  const dragStartRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input, select, textarea, a')) return;
    setIsDraggingModal(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: modalPos.x,
      initialY: modalPos.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingModal) return;
      const dx = e.clientX - dragStartRef.current.startX;
      const dy = e.clientY - dragStartRef.current.startY;
      setModalPos({
        x: dragStartRef.current.initialX + dx,
        y: dragStartRef.current.initialY + dy,
      });
    };
    const handleMouseUp = () => {
      if (isDraggingModal) setIsDraggingModal(false);
    };
    if (isDraggingModal) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingModal]);

  const handleOpenNewModal = () => {
    setModalPos({ x: 0, y: 0 });
    setShowNewModal(true);
  };

  const handleApplyParsedToManual = (data: {
    proveedorId: number;
    proveedorNombre: string;
    sucursalId: number;
    numeroFactura: string;
    numeroControl: string;
    fechaFactura: string;
    condicionPago: 'credito' | 'contado';
    items: DetalleCompra[];
    newProducts: Producto[];
  }) => {
    setProveedorId(data.proveedorId);
    setSucursalDestinoId(data.sucursalId);
    setNumeroFactura(data.numeroFactura);
    setNumeroControl(data.numeroControl);
    setFechaFactura(data.fechaFactura);
    setCondicionPago(data.condicionPago);
    setItemsCompra(data.items);
    setNewlyCreatedProducts(data.newProducts);
    setModalPos({ x: 0, y: 0 });
    setShowScanModal(false);
    setShowNewModal(true);
  };

  // New Purchase Invoice Form State
  const [proveedorId, setProveedorId] = useState<number>(proveedores[0]?.id || 1);
  const [sucursalDestinoId, setSucursalDestinoId] = useState<number>(3); // Default to Central Warehouse/Store
  const [numeroFactura, setNumeroFactura] = useState('');
  const [numeroControl, setNumeroControl] = useState('');
  const [fechaFactura, setFechaFactura] = useState(new Date().toISOString().split('T')[0]);
  const [fechaVencimiento, setFechaVencimiento] = useState(
    new Date(Date.now() + 15 * 24 * 3600 * 1000).toISOString().split('T')[0]
  );
  const [condicionPago, setCondicionPago] = useState<'credito' | 'contado'>('credito');

  // Invoiced line items
  const [itemsCompra, setItemsCompra] = useState<DetalleCompra[]>([]);
  const [newlyCreatedProducts, setNewlyCreatedProducts] = useState<Producto[]>([]);

  // Item input row state
  const [selectedProdId, setSelectedProdId] = useState<number | 'new'>(productos[0]?.id || 'new');
  const [barcodeInput, setBarcodeInput] = useState<string>(productos[0]?.codigo_barras || '');
  const [productNameInput, setProductNameInput] = useState<string>(productos[0]?.nombre || '');
  const [unidadMedidaInput, setUnidadMedidaInput] = useState<'UND' | 'KG' | 'L' | 'PQ' | string>(
    productos[0]?.unidad_medida || 'UND'
  );
  const [cantidadInput, setCantidadInput] = useState<string>('1');
  const [costoInput, setCostoInput] = useState<string>(productos[0]?.costo ? String(productos[0].costo) : '1.00');
  const [pvpInput, setPvpInput] = useState<string>(productos[0]?.precio ? String(productos[0].precio) : '1.50');
  const [itemExentoInput, setItemExentoInput] = useState<boolean>(
    productos[0] ? !!productos[0].exento_iva : false
  );

  // When user selects an existing product from dropdown
  const handleProductSelect = (idVal: string) => {
    if (idVal === 'new') {
      setSelectedProdId('new');
      setBarcodeInput('');
      setProductNameInput('');
      setUnidadMedidaInput('UND');
      setCantidadInput('1');
      setCostoInput('1.00');
      setPvpInput('1.50');
      setItemExentoInput(false);
      return;
    }

    const id = Number(idVal);
    setSelectedProdId(id);
    const prod = productos.find((p) => p.id === id);
    if (prod) {
      setBarcodeInput(prod.codigo_barras || '');
      setProductNameInput(prod.nombre);
      setUnidadMedidaInput(prod.unidad_medida || 'UND');
      setItemExentoInput(!!prod.exento_iva);
      setCostoInput(prod.costo ? String(prod.costo) : '1.00');
      setPvpInput(String(prod.precio));
    }
  };

  // When user scans or types barcode
  const handleBarcodeChange = (code: string) => {
    setBarcodeInput(code);
    const trimmed = code.trim();
    if (!trimmed) return;

    const match = productos.find(
      (p) => p.codigo_barras.toLowerCase() === trimmed.toLowerCase()
    );
    if (match) {
      setSelectedProdId(match.id);
      setProductNameInput(match.nombre);
      setUnidadMedidaInput(match.unidad_medida || 'UND');
      setItemExentoInput(!!match.exento_iva);
      if (match.costo) setCostoInput(String(match.costo));
      setPvpInput(String(match.precio));
    }
  };

  const handleAddItemToInvoice = () => {
    const qty = parseFloat(cantidadInput);
    const cost = parseFloat(costoInput);
    const pvp = parseFloat(pvpInput) || +(cost * 1.3).toFixed(2);

    if (isNaN(qty) || qty <= 0) {
      alert('Por favor ingresa una cantidad válida mayor a cero (admite fracciones como 0.500, 1.250).');
      return;
    }

    if (isNaN(cost) || cost <= 0) {
      alert('Por favor ingresa un costo unitario válido mayor a cero.');
      return;
    }

    const trimmedName = productNameInput.trim();
    if (!trimmedName) {
      alert('Debes indicar la descripción o nombre del producto facturado.');
      return;
    }

    let prodId: number;
    const barcodeTrimmed = barcodeInput.trim() || `SKU-${Date.now().toString().slice(-6)}`;

    if (selectedProdId === 'new') {
      // Find if already exists by barcode
      const existing = productos.find((p) => p.codigo_barras === barcodeTrimmed);
      if (existing) {
        prodId = existing.id;
      } else {
        prodId = Date.now();
        const newProductObj: Producto = {
          id: prodId,
          codigo_barras: barcodeTrimmed,
          nombre: trimmedName,
          precio: pvp,
          costo: cost,
          unidad_medida: unidadMedidaInput,
          exento_iva: itemExentoInput,
        };
        setNewlyCreatedProducts((prev) => [...prev, newProductObj]);
      }
    } else {
      prodId = selectedProdId;
    }

    const subtotal = +(qty * cost).toFixed(2);
    const ivaItem = itemExentoInput ? 0 : +(subtotal * 0.16).toFixed(2);

    const existingIndex = itemsCompra.findIndex(
      (i) => i.productoId === prodId || (i.codigo_barras && i.codigo_barras === barcodeTrimmed)
    );

    if (existingIndex >= 0) {
      const updated = [...itemsCompra];
      const newQty = +(updated[existingIndex].cantidad + qty).toFixed(3);
      const newSubtotal = +(newQty * cost).toFixed(2);
      updated[existingIndex] = {
        ...updated[existingIndex],
        cantidad: newQty,
        costoUnitario: cost,
        precioVenta: pvp,
        unidad_medida: unidadMedidaInput,
        exentoIva: itemExentoInput,
        subtotal: newSubtotal,
        montoIva: itemExentoInput ? 0 : +(newSubtotal * 0.16).toFixed(2),
      };
      setItemsCompra(updated);
    } else {
      setItemsCompra([
        ...itemsCompra,
        {
          productoId: prodId,
          productoNombre: trimmedName,
          codigo_barras: barcodeTrimmed,
          unidad_medida: unidadMedidaInput,
          cantidad: qty,
          costoUnitario: cost,
          precioVenta: pvp,
          subtotal,
          exentoIva: itemExentoInput,
          montoIva: ivaItem,
        },
      ]);
    }

    // Reset line fields for next item
    setCantidadInput('1');
    if (selectedProdId === 'new') {
      setBarcodeInput('');
      setProductNameInput('');
    }
  };

  const handleRemoveItem = (index: number) => {
    setItemsCompra(itemsCompra.filter((_, i) => i !== index));
  };

  // Calculations
  const subtotalNeto = itemsCompra.reduce((acc, item) => acc + item.subtotal, 0);
  const baseImponible = itemsCompra
    .filter((i) => !i.exentoIva)
    .reduce((acc, item) => acc + item.subtotal, 0);
  const montoExento = itemsCompra
    .filter((i) => i.exentoIva)
    .reduce((acc, item) => acc + item.subtotal, 0);
  const montoIva = +(baseImponible * 0.16).toFixed(2);
  const totalCompra = +(baseImponible + montoIva + montoExento).toFixed(2);

  const handleSubmitCompra = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemsCompra.length === 0) {
      alert('Debes agregar al menos un artículo a la factura del proveedor.');
      return;
    }

    const nroFacturaFinal = numeroFactura.trim() || `FAC-${Date.now().toString().slice(-6)}`;
    const prov = proveedores.find((p) => p.id === proveedorId);

    onRegistrarCompra(
      {
        proveedorId,
        proveedorNombre: prov ? prov.nombre : 'Proveedor General',
        sucursalId: sucursalDestinoId,
        numeroFactura: nroFacturaFinal,
        numeroControl: numeroControl.trim() || undefined,
        fecha: fechaFactura || new Date().toISOString(),
        fechaVencimiento: fechaVencimiento || undefined,
        condicionPago,
        subtotalNeto: +subtotalNeto.toFixed(2),
        baseImponible: +baseImponible.toFixed(2),
        montoExento: +montoExento.toFixed(2),
        montoIva: +montoIva.toFixed(2),
        total: totalCompra,
        estado: 'completada',
        usuarioNombre: currentUser?.nombre_completo || 'Administrador',
        detalles: itemsCompra,
      },
      newlyCreatedProducts
    );

    setShowNewModal(false);
    setItemsCompra([]);
    setNewlyCreatedProducts([]);
    setNumeroFactura('');
    setNumeroControl('');
    alert(`✅ Factura de Proveedor #${nroFacturaFinal} registrada exitosamente. Se ingresaron los artículos al inventario y se actualizaron los costos y precios de venta.`);
  };

  const filteredCompras = compras.filter(
    (c) =>
      c.proveedorNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.numeroFactura?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.usuarioNombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-400" /> Registro de Compras y Facturas de Proveedores
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Entrada directa a inventario con códigos de barra, presentación por unidades/kg/litros, fracciones, costos y actualización de PVP.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowScanModal(true)}
            className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/25 transition-all"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>📷 Cargar Factura (Imagen / PDF)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              handleOpenNewModal();
              setItemsCompra([]);
              setNumeroFactura(`FAC-${Math.floor(1000 + Math.random() * 9000)}`);
            }}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>+ Compra Manual</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block font-medium">Total Compras Facturadas</span>
          <div className="text-xl font-bold text-white font-mono mt-1">
            {formatUSD(compras.reduce((acc, c) => acc + c.total, 0))}
          </div>
          <span className="text-xs text-emerald-400 font-mono block mt-0.5">
            {formatBs(compras.reduce((acc, c) => acc + c.total, 0), empresaConfig.tasaCambio)}
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block font-medium">Facturas Registradas</span>
          <div className="text-xl font-bold text-white font-mono mt-1">{compras.length} facturas</div>
          <span className="text-xs text-slate-500 block mt-0.5">Entrada automatizada a almacenes</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block font-medium">Proveedores Registrados</span>
          <div className="text-xl font-bold text-white font-mono mt-1">{proveedores.length} empresas</div>
          <span className="text-xs text-emerald-400 block mt-0.5">Cuentas por pagar sincronizadas</span>
        </div>
      </div>

      {/* Search & Purchases Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por proveedor, factura o encargado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white text-xs pl-9 pr-3 py-2 rounded-xl focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/50">
                <th className="py-3 px-3">ID / Factura</th>
                <th className="py-3 px-3">Proveedor</th>
                <th className="py-3 px-3">Sucursal Destino</th>
                <th className="py-3 px-3">Régimen</th>
                <th className="py-3 px-3">Fecha</th>
                <th className="py-3 px-3">Artículos</th>
                <th className="py-3 px-3 text-right">Total $ USD</th>
                <th className="py-3 px-3 text-right">Total Bs</th>
                <th className="py-3 px-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCompras.map((compra) => {
                const sucursal = sucursales.find((s) => s.id === compra.sucursalId);
                const totalUnits = (compra.detalles || []).reduce((acc, d) => acc + d.cantidad, 0);
                const isExento = (compra.detalles || []).every((d) => d.exentoIva) || (compra.montoExento && compra.montoExento > 0 && !compra.baseImponible);

                return (
                  <tr key={compra.id} className="hover:bg-slate-800/40 text-slate-200 transition-colors">
                    <td className="py-3 px-3 font-mono font-semibold">
                      <div className="text-white">#{compra.numeroFactura || `FAC-${compra.id}`}</div>
                      <div className="text-[10px] text-slate-400">ID: {compra.id}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{compra.proveedorNombre}</div>
                      <div className="text-[10px] text-slate-400">Por: {compra.usuarioNombre || 'Admin'}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[11px] bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-slate-300">
                        {sucursal?.nombre || (compra.sucursalId === 1 ? empresaConfig.nombreTienda1 : compra.sucursalId === 2 ? empresaConfig.nombreTienda2 : 'Almacén Central')}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {isExento ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          EXENTO
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          IVA 16%
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono">
                      {new Date(compra.fecha).toLocaleDateString('es-VE')}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono bg-slate-800 text-emerald-400 px-2 py-0.5 rounded text-[11px]">
                        {totalUnits.toFixed(totalUnits % 1 === 0 ? 0 : 2)} cant ({(compra.detalles || []).length} ítems)
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                      {formatUSD(compra.total)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-300">
                      {formatBs(compra.total, empresaConfig.tasaCambio)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedCompraDetail(compra)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 rounded-lg border border-slate-700 cursor-pointer transition-colors text-[11px] flex items-center gap-1 mx-auto"
                        title="Ver detalle completo de la factura"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================================= */}
      {/* MODAL: REGISTRO COMPLETO DE FACTURA DE PROVEEDOR (NUEVA COMPRA)                         */}
      {/* ========================================================================================= */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div
            style={{
              transform: `translate(${modalPos.x}px, ${modalPos.y}px)`,
              transition: isDraggingModal ? 'none' : 'transform 0.05s ease-out',
            }}
            className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl space-y-4 max-h-[94vh] flex flex-col my-auto relative"
          >
            {/* Modal Header with Grab Drag Handle */}
            <div
              onMouseDown={handleHeaderMouseDown}
              onDoubleClick={() => setModalPos({ x: 0, y: 0 })}
              title="Arrastra con el mouse para mover la ventana. Doble clic para centrar."
              className="p-3.5 sm:p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/90 cursor-grab active:cursor-grabbing select-none"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm sm:text-base">
                      Registro de Factura de Proveedor (Ingreso a Inventario)
                    </h3>
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-slate-400 bg-slate-800/70 border border-slate-700/60 px-2 py-0.5 rounded-md font-mono">
                      <GripHorizontal className="w-3 h-3 text-slate-400" /> Mover con mouse
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Cargue artículos facturados, códigos de barras, presentación (UND/KG/L), fracciones, costos y PVP al público.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitCompra} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
              {/* Scan banner shortcut inside manual purchase */}
              <div className="bg-gradient-to-r from-teal-950/40 to-emerald-950/40 border border-emerald-500/30 p-3 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-inner">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">¿Deseas autocompletar con una foto o PDF?</span>
                    <span className="text-slate-400 text-[11px]">
                      Gemini AI puede leer la factura y rellenar automáticamente todos los códigos de barra, artículos, costos y condición de IVA.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewModal(false);
                    setShowScanModal(true);
                  }}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-1.5 rounded-lg font-bold text-xs shrink-0 flex items-center gap-1.5 cursor-pointer shadow transition-all"
                >
                  <FileUp className="w-3.5 h-3.5" />
                  <span>Escanear con IA</span>
                </button>
              </div>

              {/* Factura Cabecera */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-4">
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Proveedor Emisor:
                  </label>
                  <select
                    value={proveedorId}
                    onChange={(e) => setProveedorId(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl focus:border-emerald-500 focus:outline-none"
                  >
                    {proveedores.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre} ({p.rif})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Nº de Factura:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="FAC-00982"
                    value={numeroFactura}
                    onChange={(e) => setNumeroFactura(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl focus:border-emerald-500 focus:outline-none font-mono font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Nº de Control (Opc):
                  </label>
                  <input
                    type="text"
                    placeholder="00-001234"
                    value={numeroControl}
                    onChange={(e) => setNumeroControl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Fecha Emisión:
                  </label>
                  <input
                    type="date"
                    value={fechaFactura}
                    onChange={(e) => setFechaFactura(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white text-xs px-2.5 py-2 rounded-xl focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Destino Inventario:
                  </label>
                  <select
                    value={sucursalDestinoId}
                    onChange={(e) => setSucursalDestinoId(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 text-white text-xs px-2.5 py-2 rounded-xl focus:border-emerald-500 focus:outline-none"
                  >
                    {sucursales.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* BARRA DE ENTRADA DE ARTÍCULO INDIVIDUAL FACTURADO */}
              <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-3 shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <PlusCircle className="w-4 h-4" /> Cargar Artículo Facturado a la Factura
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleProductSelect('new')}
                      className={`text-[11px] px-2.5 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                        selectedProdId === 'new'
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-bold'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      + Nuevo Artículo no Registrado
                    </button>
                  </div>
                </div>

                {/* Conversor de Empaque / Bulto / Caja a Unidades de Compra */}
                <WholesalePackConverter
                  tasaCambio={empresaConfig.tasaCambio}
                  initialMargenPct={15}
                  showStockFields={true}
                  onApply={(res) => {
                    setCostoInput(res.costoUnitario.toString());
                    setPvpInput(res.precioVenta.toString());
                    setCantidadInput(res.totalUnidades.toString());
                    if (res.tipoEmpaque === 'Saco' || res.tipoEmpaque === 'Bulto') {
                      if (unidadMedidaInput === 'UND') setUnidadMedidaInput('KG');
                    }
                    if (!productNameInput.trim()) {
                      setProductNameInput(`Artículo en ${res.tipoEmpaque} (${res.unidadesPorEmpaque} un.)`);
                    }
                  }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                  {/* Selector o Catálogo */}
                  <div className="sm:col-span-4">
                    <label className="text-[10px] text-slate-400 block mb-1 font-semibold">
                      Seleccionar de Catálogo:
                    </label>
                    <select
                      value={selectedProdId}
                      onChange={(e) => handleProductSelect(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-white text-xs px-2.5 py-2 rounded-lg focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="new">-- [Nuevo Producto / No Catalogado] --</option>
                      {productos.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre} ({p.codigo_barras}) [{p.unidad_medida || 'UND'}] - Costo: ${p.costo || 0}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Código de barras */}
                  <div className="sm:col-span-3">
                    <label className="text-[10px] text-slate-400 block mb-1 font-semibold flex items-center gap-1">
                      <Barcode className="w-3 h-3 text-indigo-400" /> Código de Barras / SKU:
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: 75910080"
                      value={barcodeInput}
                      onChange={(e) => handleBarcodeChange(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-white text-xs px-2.5 py-2 rounded-lg font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* Nombre del Producto */}
                  <div className="sm:col-span-5">
                    <label className="text-[10px] text-slate-400 block mb-1 font-semibold">
                      Descripción / Nombre del Artículo:
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Arroz Blanco 1kg"
                      value={productNameInput}
                      onChange={(e) => setProductNameInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-white text-xs px-2.5 py-2 rounded-lg focus:border-emerald-500 focus:outline-none font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end pt-1">
                  {/* Presentación / Unidad de Medida */}
                  <div className="sm:col-span-3">
                    <label className="text-[10px] text-slate-400 block mb-1 font-semibold flex items-center gap-1">
                      <Scale className="w-3 h-3 text-amber-400" /> Presentación (Unidad):
                    </label>
                    <select
                      value={unidadMedidaInput}
                      onChange={(e) => setUnidadMedidaInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-white text-xs px-2 py-2 rounded-lg focus:border-emerald-500 focus:outline-none font-bold"
                    >
                      <option value="UND">Pieza / Unidad (UND)</option>
                      <option value="KG">Kilogramo (KG)</option>
                      <option value="L">Litro (L)</option>
                      <option value="PQ">Paquete / Bulto (PQ)</option>
                    </select>
                  </div>

                  {/* Cantidad (Soporta Fracciones) */}
                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-slate-400 block mb-1 font-semibold">
                      Cantidad Facturada (Fracción):
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      min="0.001"
                      placeholder="1.000"
                      value={cantidadInput}
                      onChange={(e) => setCantidadInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-emerald-400 text-xs px-2.5 py-2 rounded-lg font-mono font-bold focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* Costo Unitario de Factura */}
                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-slate-400 block mb-1 font-semibold">
                      Costo Unitario ($ USD):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      value={costoInput}
                      onChange={(e) => setCostoInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-white text-xs px-2.5 py-2 rounded-lg font-mono focus:border-emerald-500 focus:outline-none font-bold"
                    />
                  </div>

                  {/* Precio de Venta al Público (PVP) */}
                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-slate-400 block mb-1 font-semibold flex items-center gap-1">
                      <Tag className="w-3 h-3 text-emerald-400" /> PVP Venta ($ USD):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      value={pvpInput}
                      onChange={(e) => setPvpInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-emerald-300 text-xs px-2.5 py-2 rounded-lg font-mono focus:border-emerald-500 focus:outline-none font-bold"
                    />
                  </div>

                  {/* Exento de IVA y Botón de Añadir */}
                  <div className="sm:col-span-3 flex items-center gap-2 justify-end">
                    <label className="flex items-center gap-1.5 cursor-pointer select-none text-[11px] bg-slate-900 border border-slate-800 px-2.5 py-2 rounded-lg">
                      <input
                        type="checkbox"
                        checked={itemExentoInput}
                        onChange={(e) => setItemExentoInput(e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-amber-500 bg-slate-950 border-slate-700 cursor-pointer"
                      />
                      <span className={itemExentoInput ? 'text-amber-300 font-bold' : 'text-slate-400'}>
                        Exento IVA
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={handleAddItemToInvoice}
                      className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-3 py-2 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-md shadow-emerald-600/20 shrink-0"
                    >
                      <Plus className="w-4 h-4" /> Agregar
                    </button>
                  </div>
                </div>
              </div>

              {/* TABLA DE TODOS LOS ARTÍCULOS EN LA FACTURA */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-emerald-400" /> Artículos en esta Factura ({itemsCompra.length})
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Total Unidades/Fracción:{' '}
                    <strong className="text-emerald-400 font-mono">
                      {itemsCompra.reduce((sum, item) => sum + item.cantidad, 0).toFixed(3)}
                    </strong>
                  </span>
                </div>

                {itemsCompra.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs bg-slate-950/60 rounded-xl border border-dashed border-slate-800">
                    No has agregado ningún artículo a la factura todavía. Utiliza la barra superior para registrar cada producto.
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/70 max-h-56 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/80">
                          <th className="py-2.5 px-3">Código Barras</th>
                          <th className="py-2.5 px-3">Descripción</th>
                          <th className="py-2.5 px-2 text-center">Unidad</th>
                          <th className="py-2.5 px-2 text-right">Cantidad</th>
                          <th className="py-2.5 px-2 text-right">Costo Unit. ($)</th>
                          <th className="py-2.5 px-2 text-right">PVP ($)</th>
                          <th className="py-2.5 px-2 text-center">IVA</th>
                          <th className="py-2.5 px-3 text-right">Subtotal ($)</th>
                          <th className="py-2.5 px-2 text-center">Quitar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono">
                        {itemsCompra.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-900/60 text-slate-200">
                            <td className="py-2 px-3 text-slate-400 text-[11px]">
                              {item.codigo_barras || 'S/C'}
                            </td>
                            <td className="py-2 px-3 font-sans font-semibold text-white">
                              {item.productoNombre}
                            </td>
                            <td className="py-2 px-2 text-center">
                              <span className="bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                {item.unidad_medida || 'UND'}
                              </span>
                            </td>
                            <td className="py-2 px-2 text-right font-bold text-emerald-400">
                              {item.cantidad.toFixed(item.cantidad % 1 === 0 ? 0 : 3)}
                            </td>
                            <td className="py-2 px-2 text-right text-slate-300">
                              ${item.costoUnitario.toFixed(2)}
                            </td>
                            <td className="py-2 px-2 text-right text-emerald-300">
                              ${(item.precioVenta || item.costoUnitario * 1.3).toFixed(2)}
                            </td>
                            <td className="py-2 px-2 text-center">
                              {item.exentoIva ? (
                                <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold border border-amber-500/30">
                                  EXENTO
                                </span>
                              ) : (
                                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold border border-emerald-500/30">
                                  16%
                                </span>
                              )}
                            </td>
                            <td className="py-2 px-3 text-right font-bold text-white">
                              ${item.subtotal.toFixed(2)}
                            </td>
                            <td className="py-2 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(idx)}
                                className="text-rose-400 hover:text-rose-300 p-1 hover:bg-rose-500/10 rounded cursor-pointer"
                                title="Eliminar ítem"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* RESUMEN FISCAL Y TOTALES DE LA FACTURA */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 text-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Condiciones de Pago y Recepción:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Condición:</label>
                      <select
                        value={condicionPago}
                        onChange={(e) => setCondicionPago(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-700 text-white text-xs px-2.5 py-1.5 rounded-lg"
                      >
                        <option value="credito">Crédito (Genera CxP)</option>
                        <option value="contado">Contado</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Fecha Vencimiento:</label>
                      <input
                        type="date"
                        value={fechaVencimiento}
                        onChange={(e) => setFechaVencimiento(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-white text-xs px-2 py-1.5 rounded-lg font-mono"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Al procesar, los artículos se suman inmediatamente al stock disponible en la sucursal seleccionada.
                  </p>
                </div>

                <div className="space-y-2 text-xs font-mono bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal Neto Facturado:</span>
                    <span className="text-white font-bold">{formatUSD(subtotalNeto)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Base Imponible Gravada (16%):</span>
                    <span className="text-emerald-300 font-bold">{formatUSD(baseImponible)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Total Exento de IVA (0%):</span>
                    <span className="text-amber-300 font-bold">{formatUSD(montoExento)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 pb-2 border-b border-slate-800">
                    <span>IVA Liquidado (16%):</span>
                    <span className="text-emerald-400 font-bold">+{formatUSD(montoIva)}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-xs text-white font-sans font-bold block">TOTAL FACTURA PROVEEDOR</span>
                      <span className="text-[10px] text-slate-500 font-sans">USD y Bolívares oficiales</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold font-mono text-emerald-400">{formatUSD(totalCompra)}</div>
                      <div className="text-xs text-slate-400 font-mono">
                        {formatBs(totalCompra, empresaConfig.tasaCambio)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-800 cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={itemsCompra.length === 0}
                  className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/25 transition-all"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>Procesar Factura e Ingresar a Inventario</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* MODAL: VER DETALLE COMPLETO DE FACTURA DE COMPRA                                          */}
      {/* ========================================================================================= */}
      {selectedCompraDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-white text-sm">
                    Factura de Proveedor #{selectedCompraDetail.numeroFactura || selectedCompraDetail.id}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Proveedor: <strong className="text-white">{selectedCompraDetail.proveedorNombre}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCompraDetail(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1 custom-scrollbar text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 block">Fecha Emisión:</span>
                  <span className="font-mono font-bold text-white">
                    {new Date(selectedCompraDetail.fecha).toLocaleDateString('es-VE')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Sucursal Destino:</span>
                  <span className="font-semibold text-emerald-400">
                    {selectedCompraDetail.sucursalId === 1 ? empresaConfig.nombreTienda1 : selectedCompraDetail.sucursalId === 2 ? empresaConfig.nombreTienda2 : 'Almacén Central'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Registrado por:</span>
                  <span className="text-slate-200">{selectedCompraDetail.usuarioNombre || 'Admin'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Condición:</span>
                  <span className="bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded text-[10px] font-bold">
                    {selectedCompraDetail.condicionPago || 'Crédito'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white">Detalle de Artículos Facturados:</h4>
                <div className="border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 bg-slate-950">
                        <th className="py-2 px-3">Código</th>
                        <th className="py-2 px-3">Artículo</th>
                        <th className="py-2 px-2 text-center">Unidad</th>
                        <th className="py-2 px-2 text-right">Cantidad</th>
                        <th className="py-2 px-2 text-right">Costo Unit.</th>
                        <th className="py-2 px-2 text-center">Régimen</th>
                        <th className="py-2 px-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {(selectedCompraDetail.detalles || []).map((d, i) => (
                        <tr key={i} className="hover:bg-slate-800/30">
                          <td className="py-2 px-3 text-slate-400 text-[11px]">{d.codigo_barras || `SKU-${d.productoId}`}</td>
                          <td className="py-2 px-3 font-sans font-semibold text-white">{d.productoNombre}</td>
                          <td className="py-2 px-2 text-center text-amber-300">{d.unidad_medida || 'UND'}</td>
                          <td className="py-2 px-2 text-right font-bold text-emerald-400">{d.cantidad}</td>
                          <td className="py-2 px-2 text-right">${d.costoUnitario.toFixed(2)}</td>
                          <td className="py-2 px-2 text-center">
                            {d.exentoIva ? (
                              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 py-0.5 rounded font-bold">
                                EXENTO
                              </span>
                            ) : (
                              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 py-0.5 rounded font-bold">
                                16%
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-white">${d.subtotal.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center font-mono">
                <div>
                  <span className="text-slate-400 block text-xs">Total Factura:</span>
                  <span className="text-slate-500 text-[10px]">Tasa aplicada: 1$ = {formatBs(1, empresaConfig.tasaCambio)}</span>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-emerald-400">{formatUSD(selectedCompraDetail.total)}</div>
                  <div className="text-xs text-slate-400">{formatBs(selectedCompraDetail.total, empresaConfig.tasaCambio)}</div>
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-slate-800 flex justify-end bg-slate-950/50">
              <button
                type="button"
                onClick={() => setSelectedCompraDetail(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* MODAL: CARGA Y PROCESAMIENTO INTELIGENTE DE FACTURA CON IA (IMAGEN / PDF)               */}
      {/* ========================================================================================= */}
      <CargarFacturaModal
        isOpen={showScanModal}
        onClose={() => setShowScanModal(false)}
        proveedores={proveedores}
        productos={productos}
        sucursales={sucursales}
        tasaCambio={empresaConfig.tasaCambio}
        currentUser={currentUser}
        onApplyToManualCompra={handleApplyParsedToManual}
        onRegistrarCompraDirecta={onRegistrarCompra}
        onAddProveedor={onAddProveedor}
      />
    </div>
  );
};
