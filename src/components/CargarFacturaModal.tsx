import React, { useState, useRef } from 'react';
import {
  FileUp,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  X,
  Trash2,
  Plus,
  RefreshCw,
  Barcode,
  Calendar,
  DollarSign,
  FileText,
  Tag,
  Scale,
  Check,
  Building2,
  ArrowRight,
  GripHorizontal,
  Package,
} from 'lucide-react';
import { Compra, Proveedor, Producto, Sucursal, Usuario, DetalleCompra } from '../types';
import { formatUSD, formatBs } from '../lib/currency';
import { WholesalePackConverter } from './WholesalePackConverter';

interface ParsedItem {
  codigo_barras?: string;
  descripcion: string;
  unidad_medida?: 'UND' | 'KG' | 'L' | 'PQ' | string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  exento: boolean;
  pvp_sugerido?: number;
}

interface ParsedInvoiceData {
  proveedorNombre: string;
  proveedorRif?: string;
  numeroFactura: string;
  numeroControl?: string;
  fechaFactura?: string;
  condicionPago?: 'contado' | 'credito';
  items: ParsedItem[];
  subtotalNeto?: number;
  baseImponible?: number;
  montoExento?: number;
  totalIva?: number;
  totalFactura?: number;
}

interface CargarFacturaModalProps {
  isOpen: boolean;
  onClose: () => void;
  proveedores: Proveedor[];
  productos: Producto[];
  sucursales: Sucursal[];
  tasaCambio: number;
  currentUser: Usuario | null;
  onApplyToManualCompra: (data: {
    proveedorId: number;
    proveedorNombre: string;
    sucursalId: number;
    numeroFactura: string;
    numeroControl: string;
    fechaFactura: string;
    condicionPago: 'credito' | 'contado';
    items: DetalleCompra[];
    newProducts: Producto[];
  }) => void;
  onRegistrarCompraDirecta: (compraData: Omit<Compra, 'id'>, newCatalogProducts?: Producto[]) => void;
  onAddProveedor?: (nuevoProv: Omit<Proveedor, 'id'>) => void;
}

// Realistic sample invoice for testing without requiring a physical camera / file
const SAMPLE_INVOICE_DATA: ParsedInvoiceData = {
  proveedorNombre: 'Distribuidora Polar & Alimentos C.A.',
  proveedorRif: 'J-00041372-8',
  numeroFactura: `FAC-${Math.floor(10000 + Math.random() * 90000)}`,
  numeroControl: `00-${Math.floor(1000 + Math.random() * 9000)}`,
  fechaFactura: new Date().toISOString().split('T')[0],
  condicionPago: 'credito',
  items: [
    {
      codigo_barras: '759100100101',
      descripcion: 'Harina PAN Maíz Blanco 1kg',
      unidad_medida: 'KG',
      cantidad: 24,
      precio_unitario: 1.15,
      subtotal: 27.60,
      exento: true,
      pvp_sugerido: 1.50,
    },
    {
      codigo_barras: '759100200202',
      descripcion: 'Arroz Primor Tradicional 1kg',
      unidad_medida: 'KG',
      cantidad: 30,
      precio_unitario: 1.20,
      subtotal: 36.00,
      exento: true,
      pvp_sugerido: 1.65,
    },
    {
      codigo_barras: '759100300303',
      descripcion: 'Aceite Mazeite Puro de Maíz 1L',
      unidad_medida: 'L',
      cantidad: 15,
      precio_unitario: 2.80,
      subtotal: 42.00,
      exento: true,
      pvp_sugerido: 3.50,
    },
    {
      codigo_barras: '759100400404',
      descripcion: 'Refresco Pepsi Cola 2 Litros',
      unidad_medida: 'UND',
      cantidad: 18,
      precio_unitario: 1.50,
      subtotal: 27.00,
      exento: false, // Gravado IVA 16%
      pvp_sugerido: 2.20,
    },
    {
      codigo_barras: '759100500505',
      descripcion: 'Detergente Las Llaves Multiuso 1kg',
      unidad_medida: 'UND',
      cantidad: 12,
      precio_unitario: 1.85,
      subtotal: 22.20,
      exento: false, // Gravado IVA 16%
      pvp_sugerido: 2.60,
    },
  ],
  subtotalNeto: 154.80,
  baseImponible: 49.20,
  montoExento: 105.60,
  totalIva: 7.87,
  totalFactura: 162.67,
};

export const CargarFacturaModal: React.FC<CargarFacturaModalProps> = ({
  isOpen,
  onClose,
  proveedores,
  productos,
  sucursales,
  tasaCambio,
  currentUser,
  onApplyToManualCompra,
  onRegistrarCompraDirecta,
  onAddProveedor,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedInvoiceData | null>(null);

  // Form fields for verification once parsed
  const [selectedProveedorId, setSelectedProveedorId] = useState<number | 'new'>(proveedores[0]?.id || 1);
  const [newProveedorNombre, setNewProveedorNombre] = useState('');
  const [newProveedorRif, setNewProveedorRif] = useState('');
  const [selectedSucursalId, setSelectedSucursalId] = useState<number>(3); // Default Almacén Central
  const [editNumeroFactura, setEditNumeroFactura] = useState('');
  const [editNumeroControl, setEditNumeroControl] = useState('');
  const [editFechaFactura, setEditFechaFactura] = useState('');
  const [editCondicionPago, setEditCondicionPago] = useState<'contado' | 'credito'>('credito');
  const [editItems, setEditItems] = useState<ParsedItem[]>([]);
  const [convertItemIndex, setConvertItemIndex] = useState<number | null>(null);

  // Drag & drop state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (file: File) => {
    setErrorMessage(null);
    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const setupParsedData = (data: ParsedInvoiceData) => {
    setParsedData(data);
    setEditNumeroFactura(data.numeroFactura || `FAC-${Math.floor(1000 + Math.random() * 9000)}`);
    setEditNumeroControl(data.numeroControl || '');
    setEditFechaFactura(data.fechaFactura || new Date().toISOString().split('T')[0]);
    setEditCondicionPago(data.condicionPago || 'credito');

    // Check if supplier exists
    const matchingProv = proveedores.find(
      (p) =>
        p.nombre.toLowerCase().includes(data.proveedorNombre.toLowerCase()) ||
        (data.proveedorRif && p.rif.toLowerCase() === data.proveedorRif.toLowerCase())
    );

    if (matchingProv) {
      setSelectedProveedorId(matchingProv.id);
      setNewProveedorNombre('');
      setNewProveedorRif('');
    } else {
      setSelectedProveedorId('new');
      setNewProveedorNombre(data.proveedorNombre);
      setNewProveedorRif(data.proveedorRif || 'J-00000000-0');
    }

    // Map items with PVP and matching check
    const mappedItems: ParsedItem[] = (data.items || []).map((item) => {
      const existing = productos.find(
        (p) =>
          (item.codigo_barras && p.codigo_barras === item.codigo_barras) ||
          p.nombre.toLowerCase() === item.descripcion.toLowerCase()
      );

      const pvp = item.pvp_sugerido || (existing ? existing.precio : +(item.precio_unitario * 1.3).toFixed(2));
      return {
        ...item,
        codigo_barras: item.codigo_barras || (existing ? existing.codigo_barras : `SKU-${Date.now().toString().slice(-6)}`),
        pvp_sugerido: pvp,
      };
    });

    setEditItems(mappedItems);
  };

  // Process uploaded image or PDF using backend API
  const handleProcessInvoice = async () => {
    if (!selectedFile) {
      setErrorMessage('Por favor selecciona una imagen o documento PDF de la factura.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setProcessingStatus('Leyendo archivo y codificando...');

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
      });
      reader.readAsDataURL(selectedFile);
      const dataUrl = await base64Promise;

      setProcessingStatus('Enviando a Gemini 3.8 Flash para análisis óptico y extracción fiscal...');

      const response = await fetch('/api/compras/parse-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileBase64: dataUrl,
          mimeType: selectedFile.type || (selectedFile.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            'No se pudo extraer la información de la factura. Comprueba que el documento sea legible.'
        );
      }

      setProcessingStatus('¡Extracción completada con éxito!');
      setupParsedData(result.data);
    } catch (err: any) {
      console.error('Invoice parsing error:', err);
      setErrorMessage(
        err.message ||
          'Ocurrió un error al procesar la factura. Puedes probar con la Factura de Demostración o cargar los datos manualmente.'
      );
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  // Load sample invoice data for instant demo
  const handleLoadSample = () => {
    setErrorMessage(null);
    setupParsedData(SAMPLE_INVOICE_DATA);
  };

  // Item modifications
  const handleUpdateItemField = (index: number, field: keyof ParsedItem, val: any) => {
    const updated = [...editItems];
    const current = { ...updated[index], [field]: val };

    if (field === 'cantidad' || field === 'precio_unitario') {
      const qty = field === 'cantidad' ? parseFloat(val) || 0 : current.cantidad;
      const price = field === 'precio_unitario' ? parseFloat(val) || 0 : current.precio_unitario;
      current.subtotal = +(qty * price).toFixed(2);
      if (field === 'precio_unitario' && !current.pvp_sugerido) {
        current.pvp_sugerido = +(price * 1.3).toFixed(2);
      }
    }

    updated[index] = current;
    setEditItems(updated);
  };

  const handleToggleExento = (index: number) => {
    const updated = [...editItems];
    updated[index].exento = !updated[index].exento;
    setEditItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    setEditItems(editItems.filter((_, i) => i !== index));
  };

  const handleAddNewItemRow = () => {
    const newItem: ParsedItem = {
      codigo_barras: `SKU-${Date.now().toString().slice(-6)}`,
      descripcion: 'Nuevo Producto Facturado',
      unidad_medida: 'UND',
      cantidad: 1,
      precio_unitario: 1.0,
      subtotal: 1.0,
      exento: false,
      pvp_sugerido: 1.3,
    };
    setEditItems([...editItems, newItem]);
  };

  // Calculations
  const calculatedSubtotalNeto = editItems.reduce((acc, i) => acc + i.subtotal, 0);
  const calculatedBaseImponible = editItems
    .filter((i) => !i.exento)
    .reduce((acc, i) => acc + i.subtotal, 0);
  const calculatedMontoExento = editItems
    .filter((i) => i.exento)
    .reduce((acc, i) => acc + i.subtotal, 0);
  const calculatedTotalIva = +(calculatedBaseImponible * 0.16).toFixed(2);
  const calculatedTotalFactura = +(calculatedBaseImponible + calculatedTotalIva + calculatedMontoExento).toFixed(2);

  // Prepare purchase data structure
  const prepareFinalPurchase = () => {
    let finalProvId: number;
    let finalProvNombre: string;

    if (selectedProveedorId === 'new') {
      finalProvId = Date.now();
      finalProvNombre = newProveedorNombre.trim() || 'Proveedor Nuevo';
      if (onAddProveedor) {
        onAddProveedor({
          nombre: finalProvNombre,
          rif: newProveedorRif.trim() || 'J-00000000-0',
          contacto: 'Contacto Factura',
          telefono: 'N/A',
          saldoPendiente: calculatedTotalFactura,
        });
      }
    } else {
      finalProvId = selectedProveedorId;
      const found = proveedores.find((p) => p.id === selectedProveedorId);
      finalProvNombre = found ? found.nombre : 'Proveedor General';
    }

    const newCatalogProducts: Producto[] = [];
    const detalles: DetalleCompra[] = editItems.map((item) => {
      const barcode = item.codigo_barras?.trim() || `SKU-${Date.now().toString().slice(-6)}`;
      const existing = productos.find(
        (p) => p.codigo_barras === barcode || p.nombre.toLowerCase() === item.descripcion.toLowerCase()
      );

      let prodId: number;
      if (existing) {
        prodId = existing.id;
      } else {
        prodId = Math.max(...productos.map((p) => p.id), 0) + 1 + newCatalogProducts.length;
        const newProd: Producto = {
          id: prodId,
          codigo_barras: barcode,
          nombre: item.descripcion.trim(),
          precio: item.pvp_sugerido || +(item.precio_unitario * 1.3).toFixed(2),
          costo: item.precio_unitario,
          unidad_medida: item.unidad_medida || 'UND',
          exento_iva: item.exento,
        };
        newCatalogProducts.push(newProd);
      }

      const itemIva = item.exento ? 0 : +(item.subtotal * 0.16).toFixed(2);

      return {
        productoId: prodId,
        productoNombre: item.descripcion.trim(),
        codigo_barras: barcode,
        unidad_medida: item.unidad_medida || 'UND',
        cantidad: item.cantidad,
        costoUnitario: item.precio_unitario,
        precioVenta: item.pvp_sugerido || +(item.precio_unitario * 1.3).toFixed(2),
        subtotal: item.subtotal,
        exentoIva: item.exento,
        montoIva: itemIva,
      };
    });

    const compraData: Omit<Compra, 'id'> = {
      proveedorId: finalProvId,
      proveedorNombre: finalProvNombre,
      sucursalId: selectedSucursalId,
      numeroFactura: editNumeroFactura.trim() || `FAC-${Date.now().toString().slice(-6)}`,
      numeroControl: editNumeroControl.trim() || undefined,
      fecha: editFechaFactura || new Date().toISOString(),
      condicionPago: editCondicionPago,
      subtotalNeto: +calculatedSubtotalNeto.toFixed(2),
      baseImponible: +calculatedBaseImponible.toFixed(2),
      montoExento: +calculatedMontoExento.toFixed(2),
      montoIva: calculatedTotalIva,
      total: calculatedTotalFactura,
      estado: 'completada',
      usuarioNombre: currentUser?.nombre_completo || 'Administrador',
      detalles,
    };

    return { compraData, newCatalogProducts, detalles, finalProvId, finalProvNombre };
  };

  // Transfer to manual purchase modal
  const handleTransferToManual = () => {
    if (editItems.length === 0) {
      alert('Debes tener al menos un renglón en la factura.');
      return;
    }

    const { finalProvId, finalProvNombre, detalles, newCatalogProducts } = prepareFinalPurchase();

    onApplyToManualCompra({
      proveedorId: finalProvId,
      proveedorNombre: finalProvNombre,
      sucursalId: selectedSucursalId,
      numeroFactura: editNumeroFactura.trim() || `FAC-${Date.now().toString().slice(-6)}`,
      numeroControl: editNumeroControl.trim(),
      fechaFactura: editFechaFactura,
      condicionPago: editCondicionPago,
      items: detalles,
      newProducts: newCatalogProducts,
    });

    onClose();
  };

  // Direct registration into inventory
  const handleDirectRegister = () => {
    if (editItems.length === 0) {
      alert('Debes tener al menos un renglón en la factura.');
      return;
    }

    const { compraData, newCatalogProducts } = prepareFinalPurchase();
    onRegistrarCompraDirecta(compraData, newCatalogProducts);
    alert(
      `✅ Factura #${compraData.numeroFactura} registrada con éxito. Se ingresaron ${compraData.detalles.length} productos directamente al inventario de la sucursal seleccionada y se actualizaron los costos y PVPs.`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] text-slate-100">
        {/* Header */}
        <div className="bg-slate-950 p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Cargar Factura de Proveedor (Imagen / PDF con IA)
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Gemini AI Vision
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Extracción automática de proveedor, factura, códigos de barra, renglones, condición IVA (exento/gravado), costos y entrada directa a inventario.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: Upload Dropzone & Demo Button */}
          {!parsedData && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-emerald-400 bg-emerald-950/20 scale-[0.99]'
                    : 'border-slate-700 bg-slate-950/50 hover:border-slate-500 hover:bg-slate-950'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp, application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />

                <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-emerald-400 mb-3 shadow-inner">
                  <UploadCloud className="w-7 h-7" />
                </div>

                <h4 className="text-sm sm:text-base font-bold text-white mb-1">
                  Arrastra aquí la foto o archivo PDF de la factura
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto mb-3">
                  Soporta fotos nítidas con el celular, escaneos o facturas electrónicas en formato{' '}
                  <span className="text-emerald-400 font-mono font-semibold">PNG, JPG, WEBP o PDF</span>.
                </p>

                {selectedFile ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 text-emerald-400 text-xs border border-emerald-500/30">
                    <FileText className="w-4 h-4" />
                    <span className="font-semibold">{selectedFile.name}</span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-emerald-400 font-medium hover:underline inline-block">
                    O haz clic aquí para seleccionar el archivo desde tu computadora o teléfono
                  </span>
                )}
              </div>

              {/* Image Thumbnail Preview if image was picked */}
              {filePreview && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center gap-4">
                  <img
                    src={filePreview}
                    alt="Vista previa factura"
                    className="w-20 h-20 object-cover rounded-lg border border-slate-700 shadow"
                  />
                  <div className="text-xs">
                    <div className="text-white font-bold">{selectedFile?.name}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">Listo para ser escaneado con visión artificial.</div>
                  </div>
                </div>
              )}

              {/* Action Buttons: Process AI vs Demo */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Probar con Factura de Demostración</span>
                </button>

                <button
                  type="button"
                  disabled={!selectedFile || isProcessing}
                  onClick={handleProcessInvoice}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
                    !selectedFile || isProcessing
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 cursor-pointer'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{processingStatus || 'Procesando con IA...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>⚡ Procesar Factura y Extraer Datos</span>
                    </>
                  )}
                </button>
              </div>

              {/* Error Notification */}
              {errorMessage && (
                <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-4 text-xs text-rose-300 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-bold text-rose-200">No se pudo procesar la factura:</div>
                    <div>{errorMessage}</div>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleLoadSample}
                        className="underline text-rose-200 hover:text-white font-semibold cursor-pointer"
                      >
                        Hacer clic aquí para cargar datos de prueba y continuar con la prueba de inventario.
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Extraction Results & Verification View */}
          {parsedData && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-bold text-white">
                    Factura Extraída con Éxito — Verifica y Confirma los Datos
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setParsedData(null);
                    setSelectedFile(null);
                    setFilePreview(null);
                  }}
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Cargar otra factura
                </button>
              </div>

              {/* Invoice Metadata Grid */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                {/* Supplier Selection or Creation */}
                <div className="sm:col-span-4">
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Proveedor Factura:
                  </label>
                  <select
                    value={selectedProveedorId}
                    onChange={(e) => {
                      const val = e.target.value === 'new' ? 'new' : Number(e.target.value);
                      setSelectedProveedorId(val);
                    }}
                    className="w-full bg-slate-900 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="new">✨ + Crear Nuevo: "{newProveedorNombre || parsedData.proveedorNombre}"</option>
                    {proveedores.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre} ({p.rif})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedProveedorId === 'new' ? (
                  <>
                    <div className="sm:col-span-3">
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                        Razón Social Proveedor:
                      </label>
                      <input
                        type="text"
                        value={newProveedorNombre}
                        onChange={(e) => setNewProveedorNombre(e.target.value)}
                        placeholder="Nombre empresa"
                        className="w-full bg-slate-900 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl font-bold"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                        RIF / Doc Fiscal:
                      </label>
                      <input
                        type="text"
                        value={newProveedorRif}
                        onChange={(e) => setNewProveedorRif(e.target.value)}
                        placeholder="J-12345678-0"
                        className="w-full bg-slate-900 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl font-mono"
                      />
                    </div>
                  </>
                ) : (
                  <div className="sm:col-span-5 flex items-center text-slate-400 text-xs px-2 pt-5">
                    Proveedor existente mapeado en el catálogo del sistema.
                  </div>
                )}

                {/* Sucursal Destino */}
                <div className="sm:col-span-3">
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Sucursal Destino (Inventario):
                  </label>
                  <select
                    value={selectedSucursalId}
                    onChange={(e) => setSelectedSucursalId(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-emerald-500/50 text-emerald-400 font-bold text-xs px-3 py-2 rounded-xl focus:outline-none"
                  >
                    {sucursales.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nombre} ({s.tipo === 'oficina' ? 'Almacén' : 'Tienda'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Invoice Numbers & Dates */}
                <div className="sm:col-span-3">
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Nº de Factura:
                  </label>
                  <input
                    type="text"
                    value={editNumeroFactura}
                    onChange={(e) => setEditNumeroFactura(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl font-mono font-bold"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Nº de Control (Fiscal):
                  </label>
                  <input
                    type="text"
                    value={editNumeroControl}
                    placeholder="00-001234"
                    onChange={(e) => setEditNumeroControl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl font-mono"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Fecha de Emisión:
                  </label>
                  <input
                    type="date"
                    value={editFechaFactura}
                    onChange={(e) => setEditFechaFactura(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white text-xs px-2.5 py-2 rounded-xl font-mono"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Condición de Pago:
                  </label>
                  <select
                    value={editCondicionPago}
                    onChange={(e) => setEditCondicionPago(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl"
                  >
                    <option value="credito">Crédito (CxP 15 Días)</option>
                    <option value="contado">Contado</option>
                  </select>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Barcode className="w-4 h-4 text-emerald-400" />
                    <span>Renglones Facturados ({editItems.length} artículos detectados)</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddNewItemRow}
                    className="text-[11px] bg-slate-800 hover:bg-slate-700 text-emerald-400 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Añadir Renglón</span>
                  </button>
                </div>

                {/* Active Row Wholesale Pack Converter */}
                {convertItemIndex !== null && editItems[convertItemIndex] && (
                  <div className="bg-slate-900 border border-amber-500/40 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-amber-400" />
                        <span>Desglosar Bulto/Caja a Unidades: "{editItems[convertItemIndex].descripcion}"</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setConvertItemIndex(null)}
                        className="text-slate-400 hover:text-white text-xs cursor-pointer"
                      >
                        ✕ Cancelar
                      </button>
                    </div>
                    <WholesalePackConverter
                      tasaCambio={tasaCambio}
                      initialMargenPct={15}
                      showStockFields={true}
                      onApply={(res) => {
                        const item = editItems[convertItemIndex];
                        const updated = [...editItems];
                        updated[convertItemIndex] = {
                          ...item,
                          precio_unitario: res.costoUnitario,
                          pvp_sugerido: res.precioVenta,
                          cantidad: res.totalUnidades,
                          subtotal: +(res.costoUnitario * res.totalUnidades).toFixed(2),
                          unidad_medida: res.tipoEmpaque === 'Saco' || res.tipoEmpaque === 'Bulto' ? 'KG' : item.unidad_medida,
                          descripcion: item.descripcion.includes('(')
                            ? item.descripcion
                            : `${item.descripcion} (${res.tipoEmpaque} x ${res.unidadesPorEmpaque})`,
                        };
                        setEditItems(updated);
                        setConvertItemIndex(null);
                      }}
                    />
                  </div>
                )}

                <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/60">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 bg-slate-950 font-medium">
                        <th className="py-2.5 px-3">Cód. Barras / SKU</th>
                        <th className="py-2.5 px-3">Descripción / Producto</th>
                        <th className="py-2.5 px-2 text-center">Unidad</th>
                        <th className="py-2.5 px-2 text-center">Cant.</th>
                        <th className="py-2.5 px-3 text-right">Costo Unit $</th>
                        <th className="py-2.5 px-3 text-right">PVP Sugerido $</th>
                        <th className="py-2.5 px-3 text-center">Condición IVA</th>
                        <th className="py-2.5 px-3 text-right">Subtotal $</th>
                        <th className="py-2.5 px-2 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {editItems.map((item, idx) => {
                        const existingProd = productos.find(
                          (p) =>
                            (item.codigo_barras && p.codigo_barras === item.codigo_barras) ||
                            p.nombre.toLowerCase() === item.descripcion.toLowerCase()
                        );

                        return (
                          <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                            {/* Barcode */}
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={item.codigo_barras || ''}
                                onChange={(e) => handleUpdateItemField(idx, 'codigo_barras', e.target.value)}
                                placeholder="Cód. Barras"
                                className="w-28 bg-slate-900 border border-slate-700 text-emerald-400 font-mono text-xs px-2 py-1 rounded focus:border-emerald-500 focus:outline-none"
                              />
                            </td>

                            {/* Description */}
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={item.descripcion}
                                onChange={(e) => handleUpdateItemField(idx, 'descripcion', e.target.value)}
                                className="w-full min-w-[180px] bg-slate-900 border border-slate-700 text-white text-xs px-2 py-1 rounded focus:border-emerald-500 focus:outline-none"
                              />
                              <div className="mt-1 flex items-center gap-1.5">
                                {existingProd ? (
                                  <span className="text-[10px] text-sky-400 flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Catálogo existente (Actualizará stock)
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" /> Se creará nuevo producto en catálogo
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Unit */}
                            <td className="py-2 px-2 text-center">
                              <select
                                value={item.unidad_medida || 'UND'}
                                onChange={(e) => handleUpdateItemField(idx, 'unidad_medida', e.target.value)}
                                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs px-1.5 py-1 rounded"
                              >
                                <option value="UND">UND</option>
                                <option value="KG">KG</option>
                                <option value="L">L</option>
                                <option value="PQ">PQ</option>
                              </select>
                            </td>

                            {/* Quantity */}
                            <td className="py-2 px-2 text-center">
                              <input
                                type="number"
                                step="0.001"
                                min="0.001"
                                value={item.cantidad}
                                onChange={(e) => handleUpdateItemField(idx, 'cantidad', e.target.value)}
                                className="w-16 bg-slate-900 border border-slate-700 text-white font-mono text-xs px-2 py-1 rounded text-center focus:border-emerald-500 focus:outline-none"
                              />
                            </td>

                            {/* Unit Cost */}
                            <td className="py-2 px-3 text-right">
                              <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={item.precio_unitario}
                                onChange={(e) => handleUpdateItemField(idx, 'precio_unitario', e.target.value)}
                                className="w-20 bg-slate-900 border border-slate-700 text-white font-mono text-xs px-2 py-1 rounded text-right focus:border-emerald-500 focus:outline-none"
                              />
                            </td>

                            {/* PVP Sugerido */}
                            <td className="py-2 px-3 text-right">
                              <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={item.pvp_sugerido || ''}
                                onChange={(e) => handleUpdateItemField(idx, 'pvp_sugerido', parseFloat(e.target.value) || 0)}
                                className="w-20 bg-slate-900 border border-emerald-500/40 text-emerald-400 font-mono text-xs px-2 py-1 rounded text-right focus:border-emerald-500 focus:outline-none"
                              />
                            </td>

                            {/* Exento / Gravado Badge Toggle */}
                            <td className="py-2 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleExento(idx)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                                  item.exento
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                                }`}
                                title="Haz clic para alternar entre Exento e IVA 16%"
                              >
                                {item.exento ? 'EXENTO (0%)' : 'GRAVADO (16%)'}
                              </button>
                            </td>

                            {/* Subtotal */}
                            <td className="py-2 px-3 text-right font-mono font-bold text-white">
                              ${item.subtotal.toFixed(2)}
                            </td>

                            {/* Actions */}
                            <td className="py-2 px-2 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => setConvertItemIndex(convertItemIndex === idx ? null : idx)}
                                  className={`p-1 rounded transition-colors cursor-pointer ${
                                    convertItemIndex === idx
                                      ? 'bg-amber-500 text-slate-950 font-bold'
                                      : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800'
                                  }`}
                                  title="Desglosar bulto o empaque a unidades individuales con margen de ganancia"
                                >
                                  <Package className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(idx)}
                                  className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors cursor-pointer"
                                  title="Eliminar renglón"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Totals Breakdown Card */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs w-full sm:w-auto">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Subtotal Neto</span>
                    <span className="font-mono font-bold text-white text-sm">
                      ${calculatedSubtotalNeto.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Monto Exento</span>
                    <span className="font-mono font-bold text-amber-300 text-sm">
                      ${calculatedMontoExento.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Base Imponible (16%)</span>
                    <span className="font-mono font-bold text-slate-200 text-sm">
                      ${calculatedBaseImponible.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Total IVA (16%)</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      ${calculatedTotalIva.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-700 px-5 py-3 rounded-xl text-right w-full sm:w-auto">
                  <span className="text-[11px] text-slate-400 block">TOTAL FACTURA A PAGAR</span>
                  <div className="text-xl font-bold font-mono text-emerald-400">
                    {formatUSD(calculatedTotalFactura)}
                  </div>
                  <div className="text-xs font-mono text-slate-300">
                    {formatBs(calculatedTotalFactura, tasaCambio)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleTransferToManual}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <FileText className="w-4 h-4 text-sky-400" />
                  <span>Transferir a Carga Manual (Revisar en Formulario)</span>
                </button>

                <button
                  type="button"
                  onClick={handleDirectRegister}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>✓ Procesar Factura e Ingresar a Inventario</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
