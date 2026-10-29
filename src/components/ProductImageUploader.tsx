import React, { useState, useRef } from 'react';
import { Upload, Link2, Image as ImageIcon, X, Sparkles, Check } from 'lucide-react';
import { SAMPLE_PRODUCT_IMAGES, SampleImagePreset } from '../data/sampleProductImages';

interface ProductImageUploaderProps {
  value?: string;
  onChange: (imageUrl: string) => void;
  label?: string;
}

export const ProductImageUploader: React.FC<ProductImageUploaderProps> = ({
  value = '',
  onChange,
  label = 'Fotografía / Imagen del Producto',
}) => {
  const [mode, setMode] = useState<'upload' | 'url' | 'presets'>('presets');
  const [urlInput, setUrlInput] = useState<string>(value.startsWith('http') ? value : '');
  const [imageError, setImageError] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      alert('La imagen no debe superar los 4 MB para optimizar el rendimiento de la tienda.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setImageError(false);
        onChange(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      onChange('');
      return;
    }
    setImageError(false);
    onChange(trimmed);
  };

  const handleSelectPreset = (preset: SampleImagePreset) => {
    setImageError(false);
    setUrlInput(preset.url);
    onChange(preset.url);
  };

  const handleRemove = () => {
    setImageError(false);
    setUrlInput('');
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-emerald-400" />
          <span>{label}</span>
        </label>
        {value && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Quitar imagen</span>
          </button>
        )}
      </div>

      {/* Preview Box & Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start bg-slate-950/70 p-3 rounded-xl border border-slate-800">
        
        {/* Left: Image Preview Thumbnail */}
        <div className="sm:col-span-4 flex flex-col items-center">
          <div className="w-full aspect-square max-h-36 rounded-xl bg-slate-900 border-2 border-dashed border-slate-700 overflow-hidden relative flex items-center justify-center group shadow-inner">
            {value && !imageError ? (
              <>
                <img
                  src={value}
                  alt="Vista previa de producto"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[10px] text-white font-semibold bg-slate-900/80 px-2 py-1 rounded-md">
                    Imagen cargada
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center p-3 space-y-1">
                <ImageIcon className="w-8 h-8 text-slate-600 mx-auto" />
                <span className="text-[11px] text-slate-500 block">Sin imagen</span>
                {imageError && (
                  <span className="text-[9px] text-rose-400 block font-semibold">
                    Error al cargar URL
                  </span>
                )}
              </div>
            )}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 text-center">
            Se mostrará en la Tienda Online y en la búsqueda POS
          </span>
        </div>

        {/* Right: Method Controls */}
        <div className="sm:col-span-8 space-y-2.5">
          {/* Tabs */}
          <div className="flex rounded-lg bg-slate-900 p-0.5 border border-slate-800 text-[11px]">
            <button
              type="button"
              onClick={() => setMode('presets')}
              className={`flex-1 py-1.5 px-2 rounded-md font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                mode === 'presets'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sugeridas</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`flex-1 py-1.5 px-2 rounded-md font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                mode === 'upload'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Subir Archivo</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('url')}
              className={`flex-1 py-1.5 px-2 rounded-md font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                mode === 'url'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>URL Web</span>
            </button>
          </div>

          {/* Mode 1: Presets Gallery */}
          {mode === 'presets' && (
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 block">
                Selecciona una foto lista de víveres populares con 1 clic:
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 max-h-36 overflow-y-auto custom-scrollbar p-1">
                {SAMPLE_PRODUCT_IMAGES.map((preset) => {
                  const isSelected = value === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`relative aspect-square rounded-lg overflow-hidden border transition-all cursor-pointer group ${
                        isSelected
                          ? 'border-emerald-400 ring-2 ring-emerald-500/50'
                          : 'border-slate-800 hover:border-slate-600'
                      }`}
                      title={preset.name}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        loading="lazy"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-emerald-500/30 flex items-center justify-center">
                          <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />
                        </div>
                      )}
                      <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[8px] text-white truncate px-1 py-0.5 text-center">
                        {preset.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mode 2: Upload from Device */}
          {mode === 'upload' && (
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="product-image-file-input"
              />
              <label
                htmlFor="product-image-file-input"
                className="w-full py-4 px-3 border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-xl bg-slate-900/60 hover:bg-slate-900 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors text-center"
              >
                <Upload className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold text-white">
                  Seleccionar foto desde tu dispositivo
                </span>
                <span className="text-[10px] text-slate-400">
                  Soporta JPG, PNG, WebP desde teléfono o PC (máx 4MB)
                </span>
              </label>
            </div>
          )}

          {/* Mode 3: Web URL input */}
          {mode === 'url' && (
            <div className="space-y-2">
              <div className="flex gap-1.5">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://ejemplo.com/foto-producto.jpg"
                  className="w-full bg-slate-900 border border-slate-700 text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500 font-mono"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer shrink-0 transition-colors"
                >
                  Aplicar
                </button>
              </div>
              <span className="text-[10px] text-slate-500 block">
                Pega el enlace directo a cualquier imagen pública de internet.
              </span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
