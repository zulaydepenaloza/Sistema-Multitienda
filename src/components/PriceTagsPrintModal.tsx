import React, { useState, useMemo } from 'react';
import {
  Tag,
  Printer,
  X,
  Check,
  CheckSquare,
  Square,
  Search,
  Settings2,
  Barcode,
  Layers,
  Sparkles,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { Producto, EmpresaConfig } from '../types';
import { formatUSD, formatBs } from '../lib/currency';
import { BarcodeSvg } from './BarcodeSvg';

export type TicketLabelFormat = 'standar' | 'compacto' | 'estanteria_grande' | 'termica_continua';

interface PriceTagsPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  productos: Producto[];
  empresaConfig: EmpresaConfig;
  preselectedProduct?: Producto | null;
}

export const PriceTagsPrintModal: React.FC<PriceTagsPrintModalProps> = ({
  isOpen,
  onClose,
  productos,
  empresaConfig,
  preselectedProduct,
}) => {
  // Selection state
  const [selectedIds, setSelectedIds] = useState<number[]>(() =>
    preselectedProduct ? [preselectedProduct.id] : []
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Custom quantities per product (how many stickers for this product)
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  // Label appearance & configuration
  const [labelFormat, setLabelFormat] = useState<TicketLabelFormat>('standar');
  const [showBarcode, setShowBarcode] = useState<boolean>(true);
  const [showBsPrice, setShowBsPrice] = useState<boolean>(true);
  const [showUsdPrice, setShowUsdPrice] = useState<boolean>(true);
  const [showCompanyName, setShowCompanyName] = useState<boolean>(true);
  const [showCategory, setShowCategory] = useState<boolean>(true);
  const [showDate, setShowDate] = useState<boolean>(true);
  const [customFooterNote, setCustomFooterNote] = useState<string>('Precio sujeto a cambio');

  // Update selection if preselectedProduct changes when modal opens
  React.useEffect(() => {
    if (isOpen && preselectedProduct) {
      setSelectedIds([preselectedProduct.id]);
      setQuantities(prev => ({ ...prev, [preselectedProduct.id]: prev[preselectedProduct.id] || 1 }));
    }
  }, [isOpen, preselectedProduct]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    productos.forEach(p => {
      if (p.categoria) set.add(p.categoria);
    });
    return Array.from(set);
  }, [productos]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return productos.filter(p => {
      const matchSearch =
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.codigo_barras.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory =
        selectedCategory === 'all' || p.categoria === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [productos, searchTerm, selectedCategory]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p.id));
    }
  };

  const toggleProduct = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
      if (!quantities[id]) {
        setQuantities(prev => ({ ...prev, [id]: 1 }));
      }
    }
  };

  const setProductQty = (id: number, qty: number) => {
    const val = Math.max(1, Math.min(99, qty || 1));
    setQuantities(prev => ({ ...prev, [id]: val }));
  };

  // Products to print, flattened by quantity
  const printItems = useMemo(() => {
    const items: Producto[] = [];
    selectedIds.forEach(id => {
      const prod = productos.find(p => p.id === id);
      if (prod) {
        const count = quantities[id] || 1;
        for (let i = 0; i < count; i++) {
          items.push(prod);
        }
      }
    });
    return items;
  }, [selectedIds, quantities, productos]);

  const currentDateStr = new Date().toLocaleDateString('es-VE', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm overflow-hidden animate-fadeIn">
      {/* Container with print isolation */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden no-print">
        
        {/* Header Modal */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Generador de Etiquetas de Precios para Anaqueles
                <span className="text-[11px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded-full border border-amber-500/30">
                  Habladores de Góndola
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Diseña e imprime etiquetas de precios listas para estantes, estanterías y exhibidores
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              disabled={printItems.length === 0}
              className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir {printItems.length} Etiquetas</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Left panel (Product selection & Config), Right panel (Real-time Preview) */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* LEFT PANEL: Filters, Selection & Options (Cols 1 to 5) */}
          <div className="lg:col-span-5 border-r border-slate-800 flex flex-col h-full overflow-hidden bg-slate-900/60">
            
            {/* Top configuration accordion / controls */}
            <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-950/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Settings2 className="w-3.5 h-3.5 text-sky-400" /> Formato y Medidas
                </span>
                <span className="text-[11px] text-emerald-400 font-mono font-bold">
                  1$ = {formatBs(1, empresaConfig.tasaCambio)}
                </span>
              </div>

              {/* Format selection */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLabelFormat('standar')}
                  className={`p-2 rounded-xl text-left border transition-all text-xs ${
                    labelFormat === 'standar'
                      ? 'bg-amber-500/10 border-amber-500 text-white font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-[11px] font-bold text-amber-400">Estándar Góndola</div>
                  <div className="text-[10px] text-slate-400">6.5 cm × 3.5 cm (Ideal)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setLabelFormat('estanteria_grande')}
                  className={`p-2 rounded-xl text-left border transition-all text-xs ${
                    labelFormat === 'estanteria_grande'
                      ? 'bg-amber-500/10 border-amber-500 text-white font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-[11px] font-bold text-amber-400">Grande / Ofertas</div>
                  <div className="text-[10px] text-slate-400">9.0 cm × 5.0 cm (Puntal)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setLabelFormat('compacto')}
                  className={`p-2 rounded-xl text-left border transition-all text-xs ${
                    labelFormat === 'compacto'
                      ? 'bg-amber-500/10 border-amber-500 text-white font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-[11px] font-bold text-amber-400">Mini / Joyería / Ropa</div>
                  <div className="text-[10px] text-slate-400">5.0 cm × 2.5 cm (Pequeño)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setLabelFormat('termica_continua')}
                  className={`p-2 rounded-xl text-left border transition-all text-xs ${
                    labelFormat === 'termica_continua'
                      ? 'bg-amber-500/10 border-amber-500 text-white font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-[11px] font-bold text-amber-400">Rollo Térmico 58/80mm</div>
                  <div className="text-[10px] text-slate-400">Impresora de tickets</div>
                </button>
              </div>

              {/* Toggles */}
              <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px]">
                <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showBsPrice}
                    onChange={e => setShowBsPrice(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0"
                  />
                  <span>Precio en Bolívares (Bs)</span>
                </label>

                <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showUsdPrice}
                    onChange={e => setShowUsdPrice(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0"
                  />
                  <span>Precio en Dólares ($)</span>
                </label>

                <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showBarcode}
                    onChange={e => setShowBarcode(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0"
                  />
                  <span>Código de Barras</span>
                </label>

                <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCompanyName}
                    onChange={e => setShowCompanyName(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0"
                  />
                  <span>Nombre del Negocio</span>
                </label>

                <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCategory}
                    onChange={e => setShowCategory(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0"
                  />
                  <span>Categoría</span>
                </label>

                <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showDate}
                    onChange={e => setShowDate(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0"
                  />
                  <span>Fecha de Emisión</span>
                </label>
              </div>
            </div>

            {/* Product selection search & filter */}
            <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">
                  Selecciona los productos ({selectedIds.length} elegidos)
                </span>
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="text-amber-400 hover:text-amber-300 text-[11px] font-bold cursor-pointer"
                >
                  {selectedIds.length === filteredProducts.length ? 'Deseleccionar todos' : 'Seleccionar visibles'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Buscar producto..."
                    className="w-full bg-slate-900 border border-slate-800 text-xs text-white pl-8 pr-2 py-1.5 rounded-lg focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-xs text-slate-300 py-1.5 px-2 rounded-lg focus:border-amber-500 focus:outline-none"
                >
                  <option value="all">Todas las Categorías</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products List with Checkboxes & Quantities */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  No se encontraron productos coincidentes.
                </div>
              ) : (
                filteredProducts.map(prod => {
                  const isSelected = selectedIds.includes(prod.id);
                  const qty = quantities[prod.id] || 1;

                  return (
                    <div
                      key={prod.id}
                      className={`p-2.5 rounded-xl flex items-center justify-between gap-3 transition-colors ${
                        isSelected
                          ? 'bg-amber-500/10 border border-amber-500/30'
                          : 'hover:bg-slate-800/40 border border-transparent'
                      }`}
                    >
                      <div
                        onClick={() => toggleProduct(prod.id)}
                        className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-amber-400 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-200 truncate">
                            {prod.nombre}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                            <span>{prod.codigo_barras}</span>
                            <span>•</span>
                            <span className="text-emerald-400 font-bold">
                              ${prod.precio.toFixed(2)}
                            </span>
                            <span>•</span>
                            <span className="text-slate-400">
                              {formatBs(prod.precio, empresaConfig.tasaCambio)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity input per product */}
                      {isSelected && (
                        <div className="flex items-center gap-1.5 shrink-0 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800">
                          <span className="text-[10px] text-slate-400">Cant:</span>
                          <input
                            type="number"
                            min="1"
                            max="99"
                            value={qty}
                            onChange={e => setProductQty(prod.id, parseInt(e.target.value) || 1)}
                            className="w-10 bg-slate-900 border border-slate-700 text-center text-xs text-white font-mono rounded py-0.5 focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Live Printable Preview (Cols 6 to 12) */}
          <div className="lg:col-span-7 flex flex-col h-full overflow-hidden bg-slate-950">
            <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-2">
                <Printer className="w-4 h-4 text-emerald-400" />
                Vista Previa de Impresión ({printItems.length} etiquetas a generar)
              </span>
              <span className="text-[11px] text-slate-400">
                Formato: <strong className="text-amber-400 uppercase font-mono">{labelFormat}</strong>
              </span>
            </div>

            {/* Visual sheet preview area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900/30 flex justify-center">
              {printItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-slate-500 space-y-2 py-20">
                  <Tag className="w-12 h-12 stroke-[1.2] text-slate-600" />
                  <p className="text-sm">Selecciona al menos un artículo a la izquierda</p>
                  <p className="text-xs text-slate-600">
                    Aparecerá aquí la vista en tiempo real tal como saldrá en la impresora o papel adhesivo.
                  </p>
                </div>
              ) : (
                <div className="w-full max-w-2xl bg-white p-4 sm:p-6 rounded-xl shadow-2xl text-slate-900 min-h-[500px]">
                  
                  {/* Grid layout depending on format */}
                  <div
                    className={
                      labelFormat === 'standar'
                        ? 'grid grid-cols-2 gap-3'
                        : labelFormat === 'estanteria_grande'
                        ? 'grid grid-cols-1 gap-4'
                        : labelFormat === 'compacto'
                        ? 'grid grid-cols-3 gap-2'
                        : 'flex flex-col gap-4 max-w-xs mx-auto' // termica continua
                    }
                  >
                    {printItems.map((prod, idx) => (
                      <div
                        key={`${prod.id}-${idx}`}
                        className={`border-2 border-dashed border-slate-800 rounded-lg p-2.5 flex flex-col justify-between bg-white relative overflow-hidden ${
                          labelFormat === 'standar'
                            ? 'h-[160px]'
                            : labelFormat === 'estanteria_grande'
                            ? 'h-[200px] p-4'
                            : labelFormat === 'compacto'
                            ? 'h-[115px] p-1.5'
                            : 'p-3 border-solid'
                        }`}
                      >
                        {/* Top Header of label: Company Name occupying full top row */}
                        {(showCompanyName || (showCategory && prod.categoria)) && (
                          <div className="border-b border-slate-200 pb-1 mb-1.5 w-full flex items-center justify-between gap-1">
                            {showCompanyName && (
                              <span className="text-[11px] font-black uppercase tracking-tight text-slate-800 leading-snug flex-1 break-words">
                                {empresaConfig.nombreEmpresa}
                              </span>
                            )}
                            {showCategory && prod.categoria && (
                              <span className="text-[9px] bg-slate-100 text-slate-600 font-semibold px-1.5 py-0.5 rounded uppercase shrink-0">
                                {prod.categoria}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Product Title (Empaque removed) */}
                        <div className="my-0.5">
                          <h4
                            className={`font-black text-slate-950 uppercase leading-snug line-clamp-2 ${
                              labelFormat === 'estanteria_grande'
                                ? 'text-base mb-1'
                                : labelFormat === 'compacto'
                                ? 'text-[11px]'
                                : 'text-xs sm:text-[13px]'
                            }`}
                          >
                            {prod.nombre}
                          </h4>
                        </div>

                        {/* Prices Block (Increased Height & Bigger Typography) */}
                        <div
                          className={`bg-amber-50/90 rounded-lg border border-amber-300 my-1 flex items-center justify-between shadow-xs ${
                            labelFormat === 'estanteria_grande'
                              ? 'py-3.5 px-4 min-h-[72px]'
                              : labelFormat === 'compacto'
                              ? 'py-1.5 px-2 min-h-[44px]'
                              : 'py-2.5 px-3 min-h-[56px]'
                          }`}
                        >
                          {showBsPrice && (
                            <div className="flex flex-col justify-center">
                              <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider leading-none mb-1">
                                Precio Bs:
                              </span>
                              <span
                                className={`font-black text-slate-950 font-mono tracking-tight leading-none ${
                                  labelFormat === 'estanteria_grande'
                                    ? 'text-3xl'
                                    : labelFormat === 'compacto'
                                    ? 'text-sm'
                                    : !showUsdPrice
                                    ? 'text-2xl sm:text-3xl'
                                    : 'text-lg sm:text-xl'
                                }`}
                              >
                                {formatBs(prod.precio, empresaConfig.tasaCambio)}
                              </span>
                            </div>
                          )}

                          {showUsdPrice && (
                            <div
                              className={`flex flex-col justify-center ${
                                showBsPrice ? 'text-right items-end' : 'text-left items-start'
                              }`}
                            >
                              <span className="text-[8px] font-black text-emerald-800 uppercase tracking-wider leading-none mb-1">
                                Ref $:
                              </span>
                              <span
                                className={`font-black text-emerald-700 font-mono tracking-tight leading-none ${
                                  labelFormat === 'estanteria_grande'
                                    ? 'text-3xl'
                                    : labelFormat === 'compacto'
                                    ? 'text-sm'
                                    : !showBsPrice
                                    ? 'text-2xl sm:text-3xl'
                                    : 'text-lg sm:text-xl'
                                }`}
                              >
                                ${prod.precio.toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Footer: Barcode representation & dates */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[9px] text-slate-500 font-mono mt-auto">
                          {showBarcode ? (
                            <div className="flex items-center gap-2 max-w-[70%]">
                              <BarcodeSvg
                                value={prod.codigo_barras}
                                height={labelFormat === 'compacto' ? 20 : 28}
                                showText={false}
                                color="#0f172a"
                                className="w-24 sm:w-28 shrink-0"
                              />
                              <span className="font-bold text-slate-900 text-[10px] tracking-wider truncate">
                                {prod.codigo_barras}
                              </span>
                            </div>
                          ) : (
                            <span className="font-bold text-slate-700">{prod.codigo_barras}</span>
                          )}

                          {showDate && (
                            <span className="text-[8px] text-slate-400">
                              {currentDateStr}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* ============================================================== */}
      {/* NATIVE PRINT STYLES - ISOLATES ONLY THE LABELS WHEN PRINTING */}
      {/* ============================================================== */}
      <style>{`
        @media print {
          /* Hide all UI outside this printable container */
          body * {
            visibility: hidden !important;
          }
          .no-print {
            display: none !important;
          }
          #print-price-tags-root, #print-price-tags-root * {
            visibility: visible !important;
          }
          #print-price-tags-root {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: #fff !important;
            color: #000 !important;
            margin: 0 !important;
            padding: 5mm !important;
          }
          @page {
            size: auto;
            margin: 5mm;
          }
        }
      `}</style>

      {/* Hidden container that only displays during actual browser print */}
      <div id="print-price-tags-root" className="hidden print:block">
        <div
          className={
            labelFormat === 'standar'
              ? 'grid grid-cols-2 gap-4'
              : labelFormat === 'estanteria_grande'
              ? 'grid grid-cols-1 gap-5'
              : labelFormat === 'compacto'
              ? 'grid grid-cols-3 gap-2'
              : 'flex flex-col gap-4 max-w-xs'
          }
          style={{ pageBreakInside: 'avoid' }}
        >
          {printItems.map((prod, idx) => (
            <div
              key={`print-tag-${prod.id}-${idx}`}
              style={{
                border: '1.5px dashed #1e293b',
                borderRadius: '6px',
                padding: labelFormat === 'compacto' ? '6px' : '10px',
                height:
                  labelFormat === 'standar'
                    ? '155px'
                    : labelFormat === 'estanteria_grande'
                    ? '200px'
                    : labelFormat === 'compacto'
                    ? '115px'
                    : 'auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                pageBreakInside: 'avoid',
                boxSizing: 'border-box'
              }}
            >
              {/* Header: Company Name occupying full top row */}
              {(showCompanyName || (showCategory && prod.categoria)) && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '3px', width: '100%' }}>
                  {showCompanyName && (
                    <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', color: '#1e293b', flex: 1, letterSpacing: '0.02em', lineHeight: 1.2 }}>
                      {empresaConfig.nombreEmpresa}
                    </span>
                  )}
                  {showCategory && prod.categoria && (
                    <span style={{ fontSize: '9px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', backgroundColor: '#f1f5f9', padding: '2px 5px', borderRadius: '3px' }}>
                      {prod.categoria}
                    </span>
                  )}
                </div>
              )}

              {/* Title (Empaque removed) */}
              <div style={{ margin: '3px 0' }}>
                <div style={{ fontSize: labelFormat === 'estanteria_grande' ? '16px' : '13px', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.25, color: '#0f172a' }}>
                  {prod.nombre}
                </div>
              </div>

              {/* Price Banner (Expanded Height & Prominence) */}
              <div style={{
                backgroundColor: '#fffbeb',
                border: '1.5px solid #fcd34d',
                borderRadius: '6px',
                padding: labelFormat === 'estanteria_grande' ? '10px 14px' : labelFormat === 'compacto' ? '5px 8px' : '8px 12px',
                minHeight: labelFormat === 'estanteria_grande' ? '68px' : labelFormat === 'compacto' ? '42px' : '54px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: '4px 0'
              }}>
                {showBsPrice && (
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span style={{ fontSize: '8px', fontWeight: 900, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '2px', lineHeight: 1 }}>
                      Precio Bs:
                    </span>
                    <span style={{
                      fontSize: labelFormat === 'estanteria_grande' ? '28px' : labelFormat === 'compacto' ? '15px' : !showUsdPrice ? '26px' : '20px',
                      fontWeight: 900,
                      fontFamily: 'monospace',
                      lineHeight: 1,
                      color: '#0f172a'
                    }}>
                      {formatBs(prod.precio, empresaConfig.tasaCambio)}
                    </span>
                  </div>
                )}

                {showUsdPrice && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    textAlign: showBsPrice ? 'right' : 'left',
                    alignItems: showBsPrice ? 'flex-end' : 'flex-start'
                  }}>
                    <span style={{ fontSize: '8px', fontWeight: 900, color: '#047857', textTransform: 'uppercase', display: 'block', marginBottom: '2px', lineHeight: 1 }}>
                      Ref $:
                    </span>
                    <span style={{
                      fontSize: labelFormat === 'estanteria_grande' ? '28px' : labelFormat === 'compacto' ? '15px' : !showBsPrice ? '26px' : '20px',
                      fontWeight: 900,
                      fontFamily: 'monospace',
                      color: '#047857',
                      lineHeight: 1
                    }}>
                      ${prod.precio.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '4px', fontSize: '9px', fontFamily: 'monospace' }}>
                {showBarcode ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '75%' }}>
                    <BarcodeSvg
                      value={prod.codigo_barras}
                      height={labelFormat === 'compacto' ? 18 : 26}
                      showText={false}
                      color="#000000"
                      className="w-24 shrink-0"
                    />
                    <span style={{ fontWeight: 800, fontSize: '10px', letterSpacing: '0.05em' }}>
                      {prod.codigo_barras}
                    </span>
                  </div>
                ) : (
                  <span style={{ fontWeight: 800 }}>{prod.codigo_barras}</span>
                )}

                {showDate && (
                  <span style={{ fontSize: '8px', color: '#64748b' }}>
                    {currentDateStr}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
