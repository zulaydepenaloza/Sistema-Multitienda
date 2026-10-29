import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, Package, Plus, Check } from 'lucide-react';
import { Producto, InventarioItem, EmpresaConfig } from '../types';
import { formatUSD, formatBs } from '../lib/currency';

interface PosProductSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  productos: Producto[];
  inventario: InventarioItem[];
  selectedSucursalId: number;
  empresaConfig: EmpresaConfig;
  onSelectProduct: (producto: Producto) => void;
}

export const PosProductSearchModal: React.FC<PosProductSearchModalProps> = ({
  isOpen,
  onClose,
  productos,
  inventario,
  selectedSucursalId,
  empresaConfig,
  onSelectProduct,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedCat('all');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(productos.map((p) => p.categoria || 'General'))).filter(Boolean);
    return ['all', ...cats];
  }, [productos]);

  const filtered = useMemo(() => {
    return productos.filter((p) => {
      const matchSearch =
        !search.trim() ||
        p.nombre.toLowerCase().includes(search.toLowerCase()) ||
        p.codigo_barras.toLowerCase().includes(search.toLowerCase()) ||
        (p.categoria && p.categoria.toLowerCase().includes(search.toLowerCase()));
      const matchCat = selectedCat === 'all' || p.categoria === selectedCat;
      return matchSearch && matchCat;
    });
  }, [productos, search, selectedCat]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] text-slate-100">
        
        {/* Header */}
        <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                [F2] Búsqueda de Productos y Catálogo
              </h2>
              <p className="text-xs text-slate-400">
                Escribe nombre o código de barras para filtrar al instante
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 space-y-3">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por descripción, marca o código..."
              className="w-full bg-slate-900 border border-slate-700 text-sm text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 placeholder:text-slate-500 font-mono"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCat === cat
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
              >
                {cat === 'all' ? 'Todos los Departamentos' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 divide-y divide-slate-800/80 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs space-y-1">
              <Package className="w-8 h-8 mx-auto text-slate-600" />
              <p>No se encontraron productos que coincidan con la búsqueda.</p>
            </div>
          ) : (
            filtered.map((prod) => {
              const inv = inventario.find(
                (i) => i.sucursal_id === selectedSucursalId && i.producto_id === prod.id
              );
              const stock = inv ? inv.stock : 0;

              return (
                <div
                  key={prod.id}
                  onClick={() => {
                    onSelectProduct(prod);
                    onClose();
                  }}
                  className="py-2.5 px-3 flex items-center justify-between hover:bg-slate-800/60 rounded-xl cursor-pointer transition-colors group"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-blue-400 font-bold">
                        {prod.codigo_barras}
                      </span>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-medium">
                        {prod.categoria || 'General'}
                      </span>
                      {prod.exento_iva ? (
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1 rounded">
                          EXENTO
                        </span>
                      ) : (
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1 rounded">
                          IVA 16%
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-300 transition-colors uppercase truncate mt-0.5">
                      {prod.nombre}
                    </h4>
                  </div>

                  <div className="flex items-center gap-4 text-right shrink-0">
                    <div>
                      <div className="text-sm font-black text-emerald-400 font-mono">
                        {formatUSD(prod.precio)}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {formatBs(prod.precio, empresaConfig.tasaCambio)}
                      </div>
                    </div>

                    <div className="text-right w-16">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          stock <= 0
                            ? 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                            : 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {stock <= 0 ? 'Agotado' : `${stock} ${prod.unidad_medida || 'UND'}`}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="p-1.5 rounded-lg bg-blue-500/20 group-hover:bg-blue-500 text-blue-400 group-hover:text-white transition-colors"
                      title="Agregar al ticket"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-5 py-2.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>{filtered.length} productos disponibles</span>
          <span>Presiona <strong>[Esc]</strong> para cerrar</span>
        </div>

      </div>
    </div>
  );
};
