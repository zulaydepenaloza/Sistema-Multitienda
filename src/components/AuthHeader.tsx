import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, Lock, LogOut, Store, Building2, HelpCircle, Download, Calculator } from 'lucide-react';
import { Usuario, Sucursal } from '../types';
import { downloadStandaloneHtmlFile } from '../lib/downloadHtml';

interface AuthHeaderProps {
  currentUser: Usuario | null;
  usuarios: Usuario[];
  sucursales: Sucursal[];
  onSelectUser: (user: Usuario) => void;
  onLogout: () => void;
  onOpenHtmlModal?: () => void;
  onOpenClientStore?: () => void;
  onOpenCalculator?: () => void;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  currentUser,
  usuarios,
  sucursales,
  onSelectUser,
  onLogout,
  onOpenHtmlModal,
  onOpenClientStore,
  onOpenCalculator,
}) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPinHelpModal, setShowPinHelpModal] = useState(false);

  // 3 campos requeridos en el modal de inicio de sesión:
  // 1. Campo para tienda / Gerencia General
  // 2. Campo para usuario (solo nombre)
  // 3. Campo para introducir el PIN
  const [selectedArea, setSelectedArea] = useState<string>('tienda1'); // 'tienda1' | 'tienda2' | 'gerencia'
  const [selectedUserId, setSelectedUserId] = useState<number>(1);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [errorPin, setErrorPin] = useState<string | null>(null);

  // Filtrar usuarios según la tienda o gerencia seleccionada
  const filteredUsers = usuarios.filter((u) => {
    if (selectedArea === 'tienda1') return u.sucursal_id === 1;
    if (selectedArea === 'tienda2') return u.sucursal_id === 2;
    if (selectedArea === 'gerencia') return u.sucursal_id === 3 || u.sucursal_id === null;
    return true;
  });

  // Actualizar usuario por defecto al cambiar de tienda / gerencia
  useEffect(() => {
    if (filteredUsers.length > 0) {
      // Si el usuario actual ya pertenece a esta área, mantenerlo; si no, elegir el primero
      const exists = filteredUsers.some((u) => u.id === selectedUserId);
      if (!exists) {
        setSelectedUserId(filteredUsers[0].id);
      }
    }
  }, [selectedArea, filteredUsers, selectedUserId]);

  const handleVerifyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorPin(null);
    const targetUser = usuarios.find((u) => u.id === selectedUserId);
    if (!targetUser) {
      setErrorPin('Por favor selecciona un usuario válido.');
      return;
    }

    if (targetUser.pin === enteredPin.trim()) {
      onSelectUser(targetUser);
      setShowLoginModal(false);
      setEnteredPin('');
      setErrorPin(null);
    } else {
      setErrorPin('PIN incorrecto. Verifica e intenta nuevamente.');
    }
  };

  const getSucursalName = (sucursalId: number | null) => {
    if (sucursalId === null) return 'Gerencia General / Admin Global';
    const s = sucursales.find((item) => item.id === sucursalId);
    return s ? s.nombre : 'Sin sucursal asignada';
  };

  const getBadgeColor = (rol: string) => {
    switch (rol) {
      case 'admin':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'supervisor':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'inventario':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'cajero':
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <>
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Seguridad & Control de Accesos:</span>
          </div>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full border text-[11px] font-bold ${getBadgeColor(currentUser.rol)}`}>
                {currentUser.rol.toUpperCase()}
              </span>
              <span className="text-white font-semibold">{currentUser.nombre_completo}</span>
              <span className="text-slate-400">({currentUser.cargo})</span>
              <span className="text-slate-500 hidden sm:inline">• {getSucursalName(currentUser.sucursal_id)}</span>
            </div>
          ) : (
            <span className="text-amber-400 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> Sesión cerrada (Solo lectura)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onOpenCalculator && (
            <button
              type="button"
              onClick={onOpenCalculator}
              className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 flex items-center gap-1.5 transition-colors cursor-pointer font-bold shadow-sm"
              title="Abrir Calculadora Comercial Multimoneda (Tecla F9)"
            >
              <Calculator className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Calculadora</span>
              <span className="text-[9px] bg-purple-950/80 border border-purple-400/40 px-1 py-0.2 rounded text-purple-300 font-mono font-bold">F9</span>
            </button>
          )}

          {onOpenClientStore && (
            <button
              onClick={onOpenClientStore}
              className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 transition-colors cursor-pointer font-bold"
              title="Abrir Catálogo / Tienda en Línea en modo cliente"
            >
              <Store className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Tienda Online</span>
            </button>
          )}

          {currentUser ? (
            <button
              onClick={onLogout}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cambiar Usuario / Cerrar</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setShowLoginModal(true);
                setErrorPin(null);
                setEnteredPin('');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <UserCheck className="w-4 h-4 stroke-[2.5]" />
              <span>Iniciar Sesión con PIN</span>
            </button>
          )}

          {currentUser?.rol === 'admin' && (
            <button
              type="button"
              onClick={() => {
                if (onOpenHtmlModal) {
                  onOpenHtmlModal();
                } else {
                  downloadStandaloneHtmlFile();
                }
              }}
              className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-102"
              title="Descargar archivo pos_multisucursal.html (Acceso exclusivo Gerente General)"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
              <span>Descargar .HTML</span>
            </button>
          )}

          <button
            onClick={() => setShowPinHelpModal(true)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 text-[11px] flex items-center gap-1 cursor-pointer"
            title="Ayuda / Consultar listado de PINs de prueba"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Guía de PINs</span>
          </button>
        </div>
      </div>

      {/* CUADRO DE INICIO DE SESIÓN */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Iniciar Sesión</h3>
                  <p className="text-xs text-slate-400">Acceso al sistema POS & Inventario</p>
                </div>
              </div>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleVerifyLogin} className="space-y-4">
              {/* CAMPO 1: Desplegable para Tienda o Gerencia General */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  1. Tienda o Gerencia General:
                </label>
                <select
                  value={selectedArea}
                  onChange={(e) => {
                    setSelectedArea(e.target.value);
                    setErrorPin(null);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white p-3 rounded-xl focus:border-emerald-500 focus:outline-none cursor-pointer"
                >
                  <option value="tienda1">
                    {sucursales.find((s) => s.id === 1)?.nombre || 'Tienda 1'}
                  </option>
                  <option value="tienda2">
                    {sucursales.find((s) => s.id === 2)?.nombre || 'Tienda 2'}
                  </option>
                  <option value="gerencia">
                    {sucursales.find((s) => s.id === 3)?.nombre || 'Inventario / Gerencia General'}
                  </option>
                </select>
              </div>

              {/* CAMPO 2: Desplegable para el Usuario (solo nombre, sin cargo ni PIN) */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  2. Usuario:
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => {
                    setSelectedUserId(Number(e.target.value));
                    setErrorPin(null);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white p-3 rounded-xl focus:border-emerald-500 focus:outline-none cursor-pointer"
                >
                  {filteredUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nombre_completo}
                    </option>
                  ))}
                </select>
              </div>

              {/* CAMPO 3: Introducir el PIN */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  3. PIN de Acceso:
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="Introduce tu PIN..."
                  value={enteredPin}
                  onChange={(e) => {
                    setEnteredPin(e.target.value);
                    setErrorPin(null);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 font-mono text-base text-emerald-400 p-3 rounded-xl focus:border-emerald-500 focus:outline-none tracking-widest placeholder:tracking-normal placeholder:text-slate-600 placeholder:text-xs"
                />
                {errorPin && (
                  <p className="text-xs text-rose-400 mt-2 font-medium bg-rose-950/40 p-2.5 rounded-lg border border-rose-500/30">
                    {errorPin}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Ingresar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SECUNDARIO INDEPENDIENTE: GUÍA DE PINS DE DEMOSTRACIÓN */}
      {showPinHelpModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Guía de Credenciales (Pruebas)</h3>
                  <p className="text-xs text-slate-400">PINs asignados para cada usuario en el sistema</p>
                </div>
              </div>
              <button
                onClick={() => setShowPinHelpModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-emerald-400 font-bold block font-sans border-b border-slate-800 pb-1">Tienda 1:</span>
                <div className="text-[11px] text-slate-300">Ana Morales: <span className="text-emerald-400 font-bold">1001</span></div>
                <div className="text-[11px] text-slate-300">Carlos Pérez: <span className="text-emerald-400 font-bold">1002</span></div>
                <div className="text-[11px] text-slate-300">Diana Castro: <span className="text-emerald-400 font-bold">1003</span></div>
                <div className="text-[11px] text-slate-300">Elena Rivas: <span className="text-amber-400 font-bold">1004</span></div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-emerald-400 font-bold block font-sans border-b border-slate-800 pb-1">Tienda 2:</span>
                <div className="text-[11px] text-slate-300">Fernando Soto: <span className="text-emerald-400 font-bold">2001</span></div>
                <div className="text-[11px] text-slate-300">Gabriela Ruiz: <span className="text-emerald-400 font-bold">2002</span></div>
                <div className="text-[11px] text-slate-300">Hugo Mendoza: <span className="text-emerald-400 font-bold">2003</span></div>
                <div className="text-[11px] text-slate-300">Isabel Vargas: <span className="text-amber-400 font-bold">2004</span></div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-blue-400 font-bold block font-sans border-b border-slate-800 pb-1">Gerencia/Inv:</span>
                <div className="text-[11px] text-slate-300">Jorge Martínez: <span className="text-blue-400 font-bold">3001</span></div>
                <div className="text-[11px] text-slate-300">Karla Benítez: <span className="text-blue-400 font-bold">3002</span></div>
                <div className="text-[11px] text-slate-300">Luis Navarro: <span className="text-blue-400 font-bold">3003</span></div>
                <div className="text-[11px] text-slate-300">Admin General: <span className="text-purple-400 font-bold">9999</span></div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowPinHelpModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
              >
                Cerrar Guía
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
