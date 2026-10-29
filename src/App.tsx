import React, { useState, useEffect } from 'react';
import { Sidebar, SidebarTab } from './components/Sidebar';
import { AuthHeader } from './components/AuthHeader';
import { PosSimulator } from './components/PosSimulator';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { PdfReportsCenter } from './components/PdfReportsCenter';
import { DailyRateModal } from './components/DailyRateModal';
import { CompanySettingsModal } from './components/CompanySettingsModal';
import { ComprasManager } from './components/ComprasManager';
import { InventoryManager } from './components/InventoryManager';
import { ClientesManager } from './components/ClientesManager';
import { ProveedoresManager } from './components/ProveedoresManager';
import { CxcManager } from './components/CxcManager';
import { CxpManager } from './components/CxpManager';
import { ConfiguracionView } from './components/ConfiguracionView';
import { TiendaOnlineView } from './components/TiendaOnlineView';
import { PedidosWebManager } from './components/PedidosWebManager';
import { AITechFooter } from './components/AITechFooter';

import {
  INITIAL_SUCURSALES,
  INITIAL_PRODUCTOS,
  INITIAL_INVENTARIO,
  INITIAL_VENTAS,
  INITIAL_USUARIOS,
  INITIAL_CLIENTES,
  INITIAL_PROVEEDORES,
  INITIAL_COMPRAS,
  INITIAL_CXC,
  INITIAL_CXP,
  INITIAL_TIENDA_CONFIG,
  INITIAL_PEDIDOS_ONLINE,
} from './data/mockData';
import {
  Sucursal,
  Producto,
  InventarioItem,
  Venta,
  DetalleVenta,
  Usuario,
  EmpresaConfig,
  Cliente,
  Proveedor,
  Compra,
  CuentaPorCobrar,
  CuentaPorPagar,
  DetallePagoVenta,
  RegistroAuditoria,
  PedidoOnline,
  TiendaConfig,
} from './types';
import { FirebaseSyncSettings } from './components/FirebaseSyncSettings';
import { CommercialCalculatorModal } from './components/CommercialCalculatorModal';
import {
  testFirestoreConnection,
  subscribeToPedidosOnline,
  savePedidoOnlineToFirestore,
  updatePedidoOnlineInFirestore,
  subscribeToEmpresaConfig,
  saveEmpresaConfigToFirestore,
  getEmpresaConfigFromFirestore,
  subscribeToTiendaConfig,
  saveTiendaConfigToFirestore,
  subscribeToProductos,
  saveProductToFirestore,
  deleteProductFromFirestore,
  saveInventarioToFirestore,
} from './lib/firebaseClient';
import {
  getStoredSupabaseConfig,
  createCustomSupabaseClient,
  addToSyncQueue,
  processSyncQueue,
} from './lib/supabaseClient';
import { getStoredEmpresaConfig, saveEmpresaConfig, hasSetTasaToday, markTasaSetToday, formatUSD, formatBs, DEFAULT_EMPRESA_CONFIG, CLEAN_EMPRESA_CONFIG, isMockDefaultPhone, cleanMobileDigits } from './lib/currency';
import { ShieldAlert, Lock, ShoppingCart, RefreshCw, Download, X, PanelLeftClose, PanelLeftOpen, Globe, Share2, QrCode, Copy, Check, ExternalLink, ShoppingBag, PackageCheck, ArrowRight, Flame } from 'lucide-react';
import { StandaloneHtmlDownloader } from './components/StandaloneHtmlDownloader';
import { downloadStandaloneHtmlFile } from './lib/downloadHtml';
import { createAuditEntry, INITIAL_AUDITORIA_LOGS } from './lib/auditLogger';
import {
  getMachineFingerprint,
  validateActivationKey,
  generateActivationKey,
  saveLicenseKey,
  getStoredLicenseKey,
  LicenseValidationResult,
} from './lib/licensing';
import { LicenseLockModal } from './components/LicenseLockModal';

function playOrderChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.4);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.15); // A5
    gain2.gain.setValueAtTime(0.25, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.6);
  } catch (e) {}
}

export default function App() {
  // Navigation State (starts in 'ventas' or 'dashboard' if admin)
  const [activeTab, setActiveTab] = useState<SidebarTab>('ventas');
  // Sidebar Collapse State (starts collapsed on small laptop/tablet screens)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });

  // Persistent LocalStorage State Keys
  const STORAGE_KEYS = {
    ventas: 'pos_app_ventas_v2',
    compras: 'pos_app_compras_v2',
    clientes: 'pos_app_clientes_v2',
    proveedores: 'pos_app_proveedores_v2',
    cxc: 'pos_app_cxc_v2',
    cxp: 'pos_app_cxp_v2',
    productos: 'pos_app_productos_v2',
    inventario: 'pos_app_inventario_v2',
    usuarios: 'pos_app_usuarios_v2',
    sucursales: 'pos_app_sucursales_v2',
    auditoria: 'pos_app_auditoria_v2',
    pedidos_online: 'pos_app_pedidos_online_v2',
    tienda_config: 'pos_app_tienda_config_v2',
  };

  // App State: Users
  const [usuarios, setUsuarios] = useState<Usuario[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.usuarios);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return INITIAL_USUARIOS;
  });
  const [currentUser, setCurrentUser] = useState<Usuario | null>(() => usuarios[0] || INITIAL_USUARIOS[0]);

  // E-Commerce & Online Store State
  const [pedidosOnline, setPedidosOnline] = useState<PedidoOnline[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.pedidos_online);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return INITIAL_PEDIDOS_ONLINE;
  });

  const [tiendaConfig, setTiendaConfig] = useState<TiendaConfig>(() => {
    let base = { ...INITIAL_TIENDA_CONFIG };
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.tienda_config);
      if (stored) {
        const parsed = JSON.parse(stored);
        base = {
          ...INITIAL_TIENDA_CONFIG,
          ...parsed,
          deliveryGratisMinimo:
            parsed.deliveryGratisMinimo !== undefined && parsed.deliveryGratisMinimo !== null
              ? Number(parsed.deliveryGratisMinimo)
              : 30.00,
          costoDeliveryFijo:
            parsed.costoDeliveryFijo !== undefined && parsed.costoDeliveryFijo !== null
              ? Number(parsed.costoDeliveryFijo)
              : 2.50,
        };
      }
    } catch (e) {}

    // Check if URL query contains a real WhatsApp number parameter (e.g. ?vista=tienda&ws=04141234567)
    if (typeof window !== 'undefined') {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const wsParam = urlParams.get('ws');
        if (wsParam && !isMockDefaultPhone(wsParam)) {
          base.whatsappContacto = wsParam.trim();
        }
      } catch (e) {}
    }
    return base;
  });

  // Client Public Store View Mode (switch between internal POS and public web catalog)
  const [isClientStoreMode, setIsClientStoreMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return (
        urlParams.get('vista') === 'tienda' ||
        urlParams.get('tienda') === 'true' ||
        urlParams.get('cliente') === 'true' ||
        window.location.hash.toLowerCase().includes('tienda')
      );
    }
    return false;
  });

  // Flag to know if store was opened internally by merchant (from POS UI) or by public client
  const [isInternalPreview, setIsInternalPreview] = useState<boolean>(false);

  // Company and Fiscal Settings + Daily Rate
  const [empresaConfig, setEmpresaConfig] = useState<EmpresaConfig>(getStoredEmpresaConfig);
  const [showDailyRateModal, setShowDailyRateModal] = useState<boolean>(false);
  const [showCompanySettingsModal, setShowCompanySettingsModal] = useState<boolean>(false);
  const [showHtmlModal, setShowHtmlModal] = useState<boolean>(false);
  const [showStoreShareModal, setShowStoreShareModal] = useState<boolean>(false);
  const [showCalculatorModal, setShowCalculatorModal] = useState<boolean>(false);
  const [copiedStoreUrl, setCopiedStoreUrl] = useState<boolean>(false);
  const [nuevoPedidoNotificacion, setNuevoPedidoNotificacion] = useState<PedidoOnline | null>(null);

  // Business Entities State
  const [sucursales, setSucursales] = useState<Sucursal[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.sucursales);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      { id: 1, nombre: empresaConfig.nombreTienda1, tipo: 'tienda' },
      { id: 2, nombre: empresaConfig.nombreTienda2, tipo: 'tienda' },
      { id: 3, nombre: empresaConfig.nombreOficina, tipo: 'oficina' },
    ];
  });

  const [productos, setProductos] = useState<Producto[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.productos);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return INITIAL_PRODUCTOS;
  });

  const [inventario, setInventario] = useState<InventarioItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.inventario);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return INITIAL_INVENTARIO;
  });

  const [ventas, setVentas] = useState<Venta[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ventas);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return INITIAL_VENTAS;
  });

  const [compras, setCompras] = useState<Compra[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.compras);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return INITIAL_COMPRAS;
  });

  const [clientes, setClientes] = useState<Cliente[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.clientes);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return INITIAL_CLIENTES;
  });

  const [proveedores, setProveedores] = useState<Proveedor[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.proveedores);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return INITIAL_PROVEEDORES;
  });

  const [cxcList, setCxcList] = useState<CuentaPorCobrar[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.cxc);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return INITIAL_CXC;
  });

  const [cxpList, setCxpList] = useState<CuentaPorPagar[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.cxp);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return INITIAL_CXP;
  });

  // Audit Logs State (Audit trail tracking user actions)
  const [auditoriaLogs, setAuditoriaLogs] = useState<RegistroAuditoria[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.auditoria);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return INITIAL_AUDITORIA_LOGS;
  });

  // Correlativos for Fiscal Cuts (X and Z)
  const [correlativoX, setCorrelativoX] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('pos_correlativo_x');
      if (stored !== null) return parseInt(stored, 10);
    } catch (e) {}
    return 0;
  });

  const [correlativoZ, setCorrelativoZ] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('pos_correlativo_z');
      if (stored !== null) return parseInt(stored, 10);
    } catch (e) {}
    return 0;
  });

  // Cryptographic Hardware License State
  const [licenseValidation, setLicenseValidation] = useState<LicenseValidationResult>(() => {
    let key = getStoredLicenseKey();
    if (!key) {
      // Auto-provision initial Lifetime Developer License for this machine
      const initialKey = generateActivationKey({
        machineId: getMachineFingerprint(),
        empresa: 'Corporación Los Andes C.A.',
        rif: 'J-12345678-0',
        tipo: 'vitalicia',
        fechaEmision: new Date().toISOString().split('T')[0],
        fechaVencimiento: 'VITALICIA',
        cajasMax: 3,
        sucursalesMax: 2,
      });
      saveLicenseKey(initialKey);
      key = initialKey;
    }
    return validateActivationKey(key);
  });

  const [showLicenseLockModal, setShowLicenseLockModal] = useState<boolean>(!licenseValidation.isValid);

  const recheckLicense = () => {
    const key = getStoredLicenseKey();
    const result = validateActivationKey(key);
    setLicenseValidation(result);
    setShowLicenseLockModal(!result.isValid);

    // If license has company name or RIF, synchronize with empresaConfig & Firestore
    if (result.isValid && (result.license?.empresa || result.license?.rif)) {
      setEmpresaConfig((prev) => {
        const newName = prev.nombreEmpresa && prev.nombreEmpresa.trim() !== '' ? prev.nombreEmpresa : (result.license?.empresa || '');
        const newRif = prev.rif && prev.rif.trim() !== '' ? prev.rif : (result.license?.rif || '');
        if (newName !== prev.nombreEmpresa || newRif !== prev.rif) {
          const updated: EmpresaConfig = {
            ...prev,
            nombreEmpresa: newName,
            rif: newRif,
          };
          saveEmpresaConfig(updated);
          saveEmpresaConfigToFirestore(updated).catch(() => {});
          return updated;
        }
        return prev;
      });
    }
  };

  // Global F9 keyboard shortcut for Commercial Calculator Modal
  useEffect(() => {
    const handleGlobalF9 = (e: KeyboardEvent) => {
      if (e.key === 'F9') {
        e.preventDefault();
        setShowCalculatorModal((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalF9);
    return () => window.removeEventListener('keydown', handleGlobalF9);
  }, []);

  useEffect(() => {
    try { localStorage.setItem('pos_correlativo_x', String(correlativoX)); } catch (e) {}
  }, [correlativoX]);

  useEffect(() => {
    try { localStorage.setItem('pos_correlativo_z', String(correlativoZ)); } catch (e) {}
  }, [correlativoZ]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.auditoria, JSON.stringify(auditoriaLogs)); } catch(e) {}
  }, [auditoriaLogs]);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.ventas, JSON.stringify(ventas)); } catch(e) {}
  }, [ventas]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.compras, JSON.stringify(compras)); } catch(e) {}
  }, [compras]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.clientes, JSON.stringify(clientes)); } catch(e) {}
  }, [clientes]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.proveedores, JSON.stringify(proveedores)); } catch(e) {}
  }, [proveedores]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.cxc, JSON.stringify(cxcList)); } catch(e) {}
  }, [cxcList]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.cxp, JSON.stringify(cxpList)); } catch(e) {}
  }, [cxpList]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.productos, JSON.stringify(productos)); } catch(e) {}
  }, [productos]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.inventario, JSON.stringify(inventario)); } catch(e) {}
  }, [inventario]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(usuarios)); } catch(e) {}
  }, [usuarios]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.sucursales, JSON.stringify(sucursales)); } catch(e) {}
  }, [sucursales]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.pedidos_online, JSON.stringify(pedidosOnline)); } catch(e) {}
  }, [pedidosOnline]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.tienda_config, JSON.stringify(tiendaConfig)); } catch(e) {}
  }, [tiendaConfig]);

  // Sincronización en tiempo real entre Celular (Tienda) y Laptop (POS)
  useEffect(() => {
    let isMounted = true;

    const fetchServerOrders = async () => {
      try {
        const res = await fetch('/api/pedidos');
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && Array.isArray(data.pedidos) && isMounted) {
          setPedidosOnline((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const incoming = data.pedidos as PedidoOnline[];
            const brandNewOrders = incoming.filter((p) => !existingIds.has(p.id));

            if (brandNewOrders.length > 0) {
              const hasPending = brandNewOrders.some((p) => p.estado === 'pendiente');
              if (hasPending) {
                playOrderChime();
                setNuevoPedidoNotificacion(brandNewOrders[0]);
              }
              const merged = [...brandNewOrders, ...prev];
              try {
                localStorage.setItem(STORAGE_KEYS.pedidos_online, JSON.stringify(merged));
              } catch (e) {}
              return merged;
            }

            // Sync status updates from server
            let changed = false;
            const updated = prev.map((localP) => {
              const remote = incoming.find((p) => p.id === localP.id);
              if (remote && (remote.estado !== localP.estado || remote.ventaIdGenerada !== localP.ventaIdGenerada)) {
                changed = true;
                return { ...localP, estado: remote.estado, ventaIdGenerada: remote.ventaIdGenerada };
              }
              return localP;
            });

            return changed ? updated : prev;
          });
        }
      } catch (e) {
        // Silently ignore if offline
      }
    };

    fetchServerOrders();

    // Broadcast current settings to server
    try {
      fetch('/api/sync/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empresaConfig,
          tiendaConfig,
          pedidos: pedidosOnline,
        }),
      }).catch(() => {});
    } catch (e) {}

    const interval = setInterval(fetchServerOrders, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Sync URL parameter with client store view mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        if (isClientStoreMode) {
          url.searchParams.set('vista', 'tienda');
        } else {
          url.searchParams.delete('vista');
          url.searchParams.delete('tienda');
        }
        window.history.replaceState({}, '', url.toString());
      } catch (e) {}
    }
  }, [isClientStoreMode]);

  // Daily exchange rate check: prompt if not confirmed today
  useEffect(() => {
    if (!hasSetTasaToday()) {
      const timer = setTimeout(() => {
        setShowDailyRateModal(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentUser]);

  // RBAC Enforcement: If user changes and current tab is not allowed, switch to 'ventas'
  useEffect(() => {
    if (!currentUser) return;
    const isGeneralManager = currentUser.rol === 'admin';
    if (isGeneralManager) return;

    const allowed = currentUser.permisos ? currentUser.permisos[activeTab] : activeTab === 'ventas';
    if (!allowed) {
      setActiveTab('ventas');
    }
  }, [currentUser]);

  // Centralized Audit Logger Helper
  const logAuditoria = (
    modulo: RegistroAuditoria['modulo'],
    tipo_accion: RegistroAuditoria['tipo_accion'],
    descripcion: string,
    options?: {
      detalles?: string;
      sucursal_nombre?: string;
      sucursal_id?: number | null;
      customUser?: Usuario | null;
    }
  ) => {
    const userToLog = options?.customUser !== undefined ? options.customUser : currentUser;
    const entry = createAuditEntry(userToLog, modulo, tipo_accion, descripcion, options);
    setAuditoriaLogs((prev) => [entry, ...prev]);
  };

  // Helper: Unconditionally apply company configuration & keep sucursales synchronized
  const applyEmpresaConfigUpdate = (cloudEmpresa: Partial<EmpresaConfig>) => {
    if (!cloudEmpresa) return;

    setEmpresaConfig((prev) => {
      const updated: EmpresaConfig = {
        ...prev,
        ...cloudEmpresa,
        nombreEmpresa: cloudEmpresa.nombreEmpresa || prev.nombreEmpresa,
        rif: cloudEmpresa.rif || prev.rif,
        nombreTienda1: cloudEmpresa.nombreTienda1 || prev.nombreTienda1,
        nombreTienda2: cloudEmpresa.nombreTienda2 || prev.nombreTienda2,
        nombreOficina: cloudEmpresa.nombreOficina || prev.nombreOficina,
        direccionFiscal: cloudEmpresa.direccionFiscal || prev.direccionFiscal,
        telefono: cloudEmpresa.telefono || prev.telefono,
        logoUrl: cloudEmpresa.logoUrl !== undefined ? cloudEmpresa.logoUrl : prev.logoUrl,
        tasaCambio:
          typeof cloudEmpresa.tasaCambio === 'number' && cloudEmpresa.tasaCambio > 0
            ? cloudEmpresa.tasaCambio
            : prev.tasaCambio,
        fechaTasa: cloudEmpresa.fechaTasa || prev.fechaTasa,
        ultimaActualizacionTasa:
          cloudEmpresa.ultimaActualizacionTasa || prev.ultimaActualizacionTasa,
      };

      saveEmpresaConfig(updated);

      // If local state has company details but cloud was blank, upload to Firestore immediately
      if (
        (!cloudEmpresa.nombreEmpresa || !cloudEmpresa.rif) &&
        (updated.nombreEmpresa || updated.rif)
      ) {
        saveEmpresaConfigToFirestore(updated).catch(() => {});
      }

      return updated;
    });

    // Synchronize sucursales array and localStorage to match the updated store names!
    setSucursales(() => {
      const s1 = cloudEmpresa.nombreTienda1 || 'Tienda 1';
      const s2 = cloudEmpresa.nombreTienda2 || 'Tienda 2';
      const s3 = cloudEmpresa.nombreOficina || 'Oficina Central & Almacén';

      const updatedSucs: Sucursal[] = [
        { id: 1, nombre: s1, tipo: 'tienda' },
        { id: 2, nombre: s2, tipo: 'tienda' },
        { id: 3, nombre: s3, tipo: 'oficina' },
      ];

      try {
        localStorage.setItem(STORAGE_KEYS.sucursales, JSON.stringify(updatedSucs));
      } catch (e) {}

      return updatedSucs;
    });
  };

  // Handler: Update company & store configurations
  const handleSaveEmpresaConfig = (updated: EmpresaConfig) => {
    applyEmpresaConfigUpdate(updated);

    // If company phone was updated and store WhatsApp is default/mock/empty, sync it automatically
    if (
      updated.telefono &&
      (!tiendaConfig.whatsappContacto ||
        isMockDefaultPhone(tiendaConfig.whatsappContacto))
    ) {
      const updatedTienda = { ...tiendaConfig, whatsappContacto: updated.telefono };
      setTiendaConfig(updatedTienda);
      try {
        localStorage.setItem(STORAGE_KEYS.tienda_config, JSON.stringify(updatedTienda));
      } catch (e) {}
    }

    saveEmpresaConfigToFirestore(updated).catch((err) =>
      console.warn('Notice syncing empresaConfig to Firestore:', err)
    );

    logAuditoria(
      'Configuración',
      'MODIFICAR',
      `Actualización de datos de la empresa: "${updated.nombreEmpresa}" (RIF: ${updated.rif})`,
      {
        detalles: `Dirección: ${updated.direccionFiscal}, Tel: ${updated.telefono}. Sucursales: ${updated.nombreTienda1}, ${updated.nombreTienda2}, ${updated.nombreOficina}`,
      }
    );
  };

  // Handler: Update daily exchange rate
  const handleSaveTasa = (nuevaTasa: number) => {
    const tasaAnterior = empresaConfig.tasaCambio;
    const updated: EmpresaConfig = {
      ...empresaConfig,
      tasaCambio: nuevaTasa,
      fechaTasa: new Date().toLocaleDateString('es-VE'),
      ultimaActualizacionTasa: new Date().toISOString(),
    };
    saveEmpresaConfig(updated);
    markTasaSetToday();
    setEmpresaConfig(updated);

    // Sync exchange rate immediately to Firebase Firestore
    saveEmpresaConfigToFirestore(updated).catch((err) =>
      console.warn('Notice syncing tasaCambio to Firestore:', err)
    );

    logAuditoria(
      'Tasa de Cambio',
      'MODIFICAR',
      `Fijación de tasa oficial: 1 USD = ${nuevaTasa.toFixed(2)} Bs (Antes: ${tasaAnterior.toFixed(2)} Bs)`,
      {
        detalles: `Tasa aplicada al sistema en fecha ${new Date().toLocaleDateString('es-VE')}`,
      }
    );
  };

  // Firebase Firestore Real-Time Subscriptions (Zero suspension, 24/7 Google Cloud)
  useEffect(() => {
    // 1. Silent ping check
    testFirestoreConnection().catch(() => {});

    // 2. Fetch latest company config immediately on startup
    getEmpresaConfigFromFirestore()
      .then((cfg) => {
        if (cfg) {
          applyEmpresaConfigUpdate(cfg);
        }
      })
      .catch((err) => console.warn('Notice fetching initial empresa config:', err));

    // 3. Real-time web orders listener
    const unsubOrders = subscribeToPedidosOnline((cloudOrders) => {
      if (cloudOrders && cloudOrders.length > 0) {
        setPedidosOnline((prev) => {
          const prevMap = new Map(prev.map((p) => [p.id, p]));
          const newPending = cloudOrders.find(
            (o) => !prevMap.has(o.id) && o.estado === 'pendiente'
          );
          if (newPending) {
            setNuevoPedidoNotificacion(newPending);
          }
          return cloudOrders;
        });
      }
    });

    // 4. Real-time exchange rate & company configuration from Firestore (Live sync)
    const unsubEmpresa = subscribeToEmpresaConfig((cloudEmpresa) => {
      if (cloudEmpresa) {
        applyEmpresaConfigUpdate(cloudEmpresa);
      }
    });

    // 5. Real-time digital store configuration
    const unsubTienda = subscribeToTiendaConfig((cloudTienda) => {
      if (cloudTienda) {
        setTiendaConfig((prev) => ({ ...prev, ...cloudTienda }));
      }
    });

    return () => {
      unsubOrders();
      unsubEmpresa();
      unsubTienda();
    };
  }, []);

  // Sync with real Supabase if credentials are provided
  const loadCloudData = async () => {
    const { url, anonKey } = getStoredSupabaseConfig();
    const client = createCustomSupabaseClient(url, anonKey);
    if (!client) return;

    try {
      const { data: sucs } = await client.from('sucursales').select('*');
      if (sucs && sucs.length > 0) {
        setSucursales(
          sucs.map((s: any) => ({
            id: s.id,
            nombre: s.nombre,
            tipo: s.id === 3 ? 'oficina' : 'tienda',
          }))
        );
      }

      const { data: prods } = await client.from('productos').select('*');
      if (prods && prods.length > 0) {
        setProductos(
          prods.map((p: any) => ({
            id: p.id,
            codigo_barras: p.codigo_barras,
            nombre: p.nombre,
            precio: parseFloat(p.precio),
          }))
        );
      }

      const { data: inv } = await client.from('inventario').select('*');
      if (inv && inv.length > 0) {
        setInventario(inv);
      }
    } catch (e) {
      console.warn('Could not fetch Supabase data directly (check RLS or keys):', e);
    }
  };

  // Auto-sync queue with Supabase when online
  useEffect(() => {
    loadCloudData();

    const runSync = async () => {
      if (typeof navigator !== 'undefined' && !navigator.onLine) return;
      const { url, anonKey } = getStoredSupabaseConfig();
      const client = createCustomSupabaseClient(url, anonKey);
      if (client) {
        await processSyncQueue(client);
      }
    };

    const handleOnline = () => {
      runSync();
    };

    window.addEventListener('online', handleOnline);
    const timer = setInterval(runSync, 15000);

    return () => {
      window.removeEventListener('online', handleOnline);
      clearInterval(timer);
    };
  }, []);

  // Calculate totals
  const totalSalesToday = ventas.reduce((acc, v) => acc + v.total, 0);
  const unitsToday = ventas.reduce((acc, v) => {
    return acc + v.detalles.reduce((dAcc, d) => dAcc + d.cantidad, 0);
  }, 0);

  // Handler: Register a new sale from POS with Cashier Audit, Customer and Payment breakdown
  const handleRegistrarVenta = async (
    sucursalId: number,
    items: { producto: Producto; cantidad: number }[],
    cliente: { id: number | null; nombre: string; rif: string },
    pagoDetalle: DetallePagoVenta
  ) => {
    const subtotalNeto = items.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);
    const baseImponible = items
      .filter((i) => !i.producto.exento_iva)
      .reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);
    const montoExento = items
      .filter((i) => !!i.producto.exento_iva)
      .reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);
    const montoIva = +(baseImponible * 0.16).toFixed(2);
    const totalVenta = +(baseImponible + montoIva + montoExento).toFixed(2);
    const newVentaId = ventas.length + 1;

    const detalles = items.map((item, index) => {
      const isExento = !!item.producto.exento_iva;
      const subtotalItem = +(item.producto.precio * item.cantidad).toFixed(2);
      const ivaItem = isExento ? 0 : +(subtotalItem * 0.16).toFixed(2);

      return {
        id: newVentaId * 100 + index,
        venta_id: newVentaId,
        producto_id: item.producto.id,
        producto_nombre: item.producto.nombre,
        cantidad: item.cantidad,
        precio_unitario: item.producto.precio,
        subtotal: subtotalItem,
        exento_iva: isExento,
        monto_iva: ivaItem,
      };
    });

    const nuevaVenta: Venta = {
      id: newVentaId,
      sucursal_id: sucursalId,
      usuario_id: currentUser ? currentUser.id : undefined,
      usuario_nombre: currentUser ? currentUser.nombre_completo : 'Cajero Anónimo',
      cliente_id: cliente.id,
      cliente_nombre: cliente.nombre,
      cliente_rif: cliente.rif,
      fecha: new Date().toISOString(),
      subtotal_neto: subtotalNeto,
      base_imponible: baseImponible,
      monto_exento: montoExento,
      monto_iva: montoIva,
      total: totalVenta,
      metodo_pago: pagoDetalle.metodo,
      referencia_pago: pagoDetalle.referencia_pago_movil,
      pago_detalle: pagoDetalle,
      detalles,
    };

    // Update sales history locally (Immediate offline-first persistence)
    setVentas([nuevaVenta, ...ventas]);

    // Audit Logging
    const sucursalName = sucursales.find((s) => s.id === sucursalId)?.nombre || `Sucursal #${sucursalId}`;
    logAuditoria(
      'POS / Ventas',
      'VENTA',
      `Venta POS #${nuevaVenta.id} registrada en ${sucursalName} por ${formatUSD(totalVenta)} (${formatBs(totalVenta, empresaConfig.tasaCambio)}) [Método: ${pagoDetalle.metodo}]`,
      {
        sucursal_id: sucursalId,
        sucursal_nombre: sucursalName,
        detalles: `Cliente: "${cliente.nombre}" (${cliente.rif || 'S/N'}). Items: ${items.map((i) => `${i.cantidad}x ${i.producto.nombre}`).join(', ')}. Base: $${baseImponible}, IVA: $${montoIva}, Exento: $${montoExento}`,
      }
    );

    // Queue for Supabase cloud sync
    addToSyncQueue('ventas', 'insert', {
      sucursal_id: sucursalId,
      usuario_nombre: currentUser ? currentUser.nombre_completo : 'Cajero Anónimo',
      cliente_nombre: cliente.nombre,
      cliente_rif: cliente.rif,
      fecha: nuevaVenta.fecha,
      subtotal_neto: subtotalNeto,
      base_imponible: baseImponible,
      monto_exento: montoExento,
      monto_iva: montoIva,
      total: totalVenta,
      metodo_pago: pagoDetalle.metodo,
      detalles: JSON.stringify(detalles),
    });

    // Deduct stock in inventario
    setInventario((prevInv) => {
      const updated = prevInv.map((invItem) => {
        if (invItem.sucursal_id === sucursalId) {
          const soldItem = items.find((i) => i.producto.id === invItem.producto_id);
          if (soldItem) {
            const nextStock = Math.max(0, invItem.stock - soldItem.cantidad);
            addToSyncQueue('inventario', 'upsert', {
              id: invItem.id,
              sucursal_id: sucursalId,
              producto_id: invItem.producto_id,
              stock: nextStock,
            });
            return {
              ...invItem,
              stock: nextStock,
            };
          }
        }
        return invItem;
      });
      return updated;
    });

    // Trigger instant sync attempt if online
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      const { url, anonKey } = getStoredSupabaseConfig();
      const client = createCustomSupabaseClient(url, anonKey);
      if (client) {
        processSyncQueue(client).catch(() => {});
      }
    }
  };

  // Handler: Register new purchase from supplier with itemized invoice lines & catalog sync
  const handleRegistrarCompra = (compraData: Omit<Compra, 'id'>, newCatalogProducts?: Producto[]) => {
    const newId = compras.length + 1;
    const newCompra: Compra = {
      ...compraData,
      id: newId,
    };

    setCompras([newCompra, ...compras]);

    const sucursalDest = sucursales.find((s) => s.id === compraData.sucursalId)?.nombre || `Sucursal #${compraData.sucursalId}`;
    logAuditoria(
      'Compras',
      'COMPRA',
      `Factura de compra #${compraData.numeroFactura || newId} registrada a proveedor "${compraData.proveedorNombre}" por ${formatUSD(compraData.total)} (${compraData.detalles.length} renglones)`,
      {
        sucursal_id: compraData.sucursalId,
        sucursal_nombre: sucursalDest,
        detalles: `Destino: ${sucursalDest}. Items: ${compraData.detalles.map((d) => `${d.cantidad}x ${d.productoNombre} (Costo: $${d.costoUnitario})`).join(', ')}`,
      }
    );

    // Update or add products in catalog with new cost, selling price (PVP), unit of measure
    setProductos((prevProds) => {
      let nextProds = [...prevProds];

      // Add any newly registered products from invoice lines
      if (newCatalogProducts && newCatalogProducts.length > 0) {
        newCatalogProducts.forEach((np) => {
          if (!nextProds.some((p) => p.id === np.id || (p.codigo_barras && p.codigo_barras === np.codigo_barras))) {
            nextProds.push(np);
          }
        });
      }

      // Update costs and PVPs for items in this purchase
      nextProds = nextProds.map((prod) => {
        const boughtItem = compraData.detalles.find((d) => d.productoId === prod.id || (d.codigo_barras && d.codigo_barras === prod.codigo_barras));
        if (boughtItem) {
          return {
            ...prod,
            costo: boughtItem.costoUnitario,
            precio: (boughtItem.precioVenta && boughtItem.precioVenta > 0) ? boughtItem.precioVenta : prod.precio,
            unidad_medida: boughtItem.unidad_medida || prod.unidad_medida || 'UND',
            exento_iva: boughtItem.exentoIva !== undefined ? boughtItem.exentoIva : prod.exento_iva,
          };
        }
        return prod;
      });

      return nextProds;
    });

    // Increment inventory in destination branch (or create inventory row if missing)
    setInventario((prevInv) => {
      let nextInv = [...prevInv];

      compraData.detalles.forEach((boughtItem) => {
        const existingIdx = nextInv.findIndex(
          (i) => i.sucursal_id === compraData.sucursalId && i.producto_id === boughtItem.productoId
        );

        if (existingIdx >= 0) {
          const curStock = nextInv[existingIdx].stock || 0;
          nextInv[existingIdx] = {
            ...nextInv[existingIdx],
            stock: +(curStock + boughtItem.cantidad).toFixed(3),
          };
        } else {
          const newInvId = Math.max(...nextInv.map((i) => i.id), 0) + 1;
          nextInv.push({
            id: newInvId,
            sucursal_id: compraData.sucursalId,
            producto_id: boughtItem.productoId,
            stock: +boughtItem.cantidad.toFixed(3),
          });
        }
      });

      return nextInv;
    });

    // Create automatic CxP if desired
    const prov = proveedores.find((p) => p.id === compraData.proveedorId);
    if (prov) {
      const newCxp: CuentaPorPagar = {
        id: cxpList.length + 1,
        proveedorId: prov.id,
        proveedorNombre: prov.nombre,
        compraId: newId,
        numeroFactura: compraData.numeroFactura || `FAC-${newId}`,
        fechaEmision: compraData.fecha,
        fechaVencimiento: compraData.fechaVencimiento || new Date(Date.now() + 15 * 24 * 3600 * 1000).toISOString(),
        montoTotal: compraData.total,
        saldoRestante: compraData.total,
        estado: 'pendiente',
        pagos: [],
      };
      setCxpList([newCxp, ...cxpList]);

      // Update provider balance
      setProveedores((prev) =>
        prev.map((p) => (p.id === prov.id ? { ...p, saldoPendiente: +(p.saldoPendiente + compraData.total).toFixed(2) } : p))
      );
    }
  };

  // Handler: Transfer Stock between branches
  const handleTransferStock = (
    origenId: number,
    destinoId: number,
    productoId: number,
    cantidad: number
  ): boolean => {
    const origenItem = inventario.find(
      (i) => i.sucursal_id === origenId && i.producto_id === productoId
    );
    if (!origenItem || origenItem.stock < cantidad) {
      return false;
    }

    const prodObj = productos.find((p) => p.id === productoId);
    const origBranch = sucursales.find((s) => s.id === origenId)?.nombre || `Sucursal #${origenId}`;
    const destBranch = sucursales.find((s) => s.id === destinoId)?.nombre || `Sucursal #${destinoId}`;

    setInventario((prev) => {
      // Deduct from origen
      let next = prev.map((item) => {
        if (item.sucursal_id === origenId && item.producto_id === productoId) {
          return { ...item, stock: item.stock - cantidad };
        }
        return item;
      });

      // Add to destino (or create if not existing)
      const destExists = next.some(
        (item) => item.sucursal_id === destinoId && item.producto_id === productoId
      );

      if (destExists) {
        next = next.map((item) => {
          if (item.sucursal_id === destinoId && item.producto_id === productoId) {
            return { ...item, stock: item.stock + cantidad };
          }
          return item;
        });
      } else {
        const newInvId = Math.max(...next.map((i) => i.id), 0) + 1;
        next.push({
          id: newInvId,
          sucursal_id: destinoId,
          producto_id: productoId,
          stock: cantidad,
        });
      }

      return next;
    });

    logAuditoria(
      'Inventario',
      'TRASPASO',
      `Traspaso de stock: ${cantidad} und de "${prodObj?.nombre || 'Producto #' + productoId}" desde ${origBranch} hacia ${destBranch}`,
      {
        detalles: `Stock origen anterior: ${origenItem.stock}, nuevo stock origen: ${origenItem.stock - cantidad}`,
      }
    );

    return true;
  };

  // Handler: Add new product to global catalog
  const handleAddProduct = (
    codigoBarras: string,
    nombre: string,
    precio: number,
    costo: number,
    stockOficina: number,
    exentoIva?: boolean,
    categoria?: string,
    unidadMedida?: string,
    imagen?: string,
    descripcion?: string,
    destacadoTienda?: boolean
  ) => {
    const newProdId = Math.max(...productos.map((p) => p.id), 0) + 1;
    const newProd: Producto = {
      id: newProdId,
      codigo_barras: codigoBarras,
      nombre,
      precio,
      costo: +(costo || +(precio * 0.7).toFixed(2)),
      unidad_medida: unidadMedida || 'UND',
      exento_iva: !!exentoIva,
      categoria: categoria || 'Víveres & Granos',
      descripcion: descripcion || '',
      imagen: imagen || '',
      destacadoTienda: destacadoTienda !== undefined ? destacadoTienda : true,
    };
    setProductos((prev) => [...prev, newProd]);

    // Initialize stock for the new product across 3 branches
    const newInvItems = [
      { id: Math.max(...inventario.map((i) => i.id), 0) + 1, sucursal_id: 1, producto_id: newProdId, stock: 0 },
      { id: Math.max(...inventario.map((i) => i.id), 0) + 2, sucursal_id: 2, producto_id: newProdId, stock: 0 },
      { id: Math.max(...inventario.map((i) => i.id), 0) + 3, sucursal_id: 3, producto_id: newProdId, stock: stockOficina },
    ];
    setInventario((prev) => [...prev, ...newInvItems]);

    // Sync to Firestore
    saveProductToFirestore(newProd).catch(() => {});
    saveInventarioToFirestore([...inventario, ...newInvItems]).catch(() => {});

    logAuditoria(
      'Inventario',
      'CREAR',
      `Creación de nuevo producto en catálogo: "${nombre}" (PVP: ${formatUSD(precio)}, Costo: ${formatUSD(costo)})`,
      {
        detalles: `Código de barras: ${codigoBarras || 'N/A'}. Stock inicial en almacén central: ${stockOficina} und`,
      }
    );
  };

  // Handler: Update product
  const handleUpdateProduct = (updated: Producto) => {
    setProductos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    saveProductToFirestore(updated).catch(() => {});

    logAuditoria(
      'Inventario',
      'MODIFICAR',
      `Modificación de producto: "${updated.nombre}" (PVP: ${formatUSD(updated.precio)})`,
      {
        detalles: `Costo: ${formatUSD(updated.costo || 0)}, Código: ${updated.codigo_barras || 'N/A'}, Exento IVA: ${updated.exento_iva ? 'Sí' : 'No'}`,
      }
    );
  };

  // Handler: Delete product
  const handleDeleteProduct = (productId: number) => {
    const targetProd = productos.find((p) => p.id === productId);
    setProductos((prev) => prev.filter((p) => p.id !== productId));
    const nextInv = inventario.filter((i) => i.producto_id !== productId);
    setInventario(nextInv);

    // Sync deletion to Firestore
    deleteProductFromFirestore(productId).catch(() => {});
    saveInventarioToFirestore(nextInv).catch(() => {});

    logAuditoria(
      'Inventario',
      'ELIMINAR',
      `Eliminación de producto del catálogo: "${targetProd?.nombre || 'ID #' + productId}"`,
      {
        detalles: `Código: ${targetProd?.codigo_barras || 'N/A'}, PVP: ${formatUSD(targetProd?.precio || 0)}`,
      }
    );
  };

  // Handler: Add Client
  const handleAddCliente = (newCliente: Omit<Cliente, 'id'>) => {
    const id = Date.now();
    setClientes([...clientes, { ...newCliente, id }]);
    logAuditoria(
      'Clientes',
      'CREAR',
      `Registro de nuevo cliente: "${newCliente.nombre}" (${newCliente.rif_cedula})`,
      {
        detalles: `Teléfono: ${newCliente.telefono || 'N/A'}, Límite crédito: ${formatUSD(newCliente.limiteCredito || 0)}`,
      }
    );
  };

  // Handler: Update Client
  const handleUpdateCliente = (updated: Cliente) => {
    setClientes(clientes.map((c) => (c.id === updated.id ? updated : c)));
    logAuditoria(
      'Clientes',
      'MODIFICAR',
      `Actualización de datos del cliente: "${updated.nombre}" (${updated.rif_cedula})`,
      {
        detalles: `Tel: ${updated.telefono}, Email: ${updated.email || 'N/A'}, Límite: ${formatUSD(updated.limiteCredito || 0)}`,
      }
    );
  };

  // Handler: Delete Client
  const handleDeleteCliente = (id: number) => {
    const client = clientes.find((c) => c.id === id);
    if (client && client.saldoPendiente > 0) {
      alert(`No se puede eliminar el cliente "${client.nombre}" porque tiene un saldo deudor pendiente de $${client.saldoPendiente.toFixed(2)}.`);
      return false;
    }
    setClientes((prev) => prev.filter((c) => c.id !== id));
    logAuditoria(
      'Clientes',
      'ELIMINAR',
      `Eliminación de cliente: "${client?.nombre || 'ID #' + id}" (${client?.rif_cedula})`
    );
    return true;
  };

  // Handler: Add Supplier
  const handleAddProveedor = (newProv: Omit<Proveedor, 'id'>) => {
    const id = Date.now();
    setProveedores([...proveedores, { ...newProv, id }]);
    logAuditoria(
      'Proveedores',
      'CREAR',
      `Registro de nuevo proveedor: "${newProv.nombre}" (${newProv.rif})`,
      {
        detalles: `Contacto: ${newProv.contacto || 'N/A'}, Tel: ${newProv.telefono || 'N/A'}`,
      }
    );
  };

  // Handler: Update Supplier
  const handleUpdateProveedor = (updated: Proveedor) => {
    setProveedores(proveedores.map((p) => (p.id === updated.id ? updated : p)));
    logAuditoria(
      'Proveedores',
      'MODIFICAR',
      `Actualización de datos del proveedor: "${updated.nombre}" (${updated.rif})`,
      {
        detalles: `Contacto: ${updated.contacto || 'N/A'}, Tel: ${updated.telefono || 'N/A'}`,
      }
    );
  };

  // Handler: Delete Supplier
  const handleDeleteProveedor = (id: number) => {
    const prov = proveedores.find((p) => p.id === id);
    if (prov && prov.saldoPendiente > 0) {
      alert(`No se puede eliminar el proveedor "${prov.nombre}" porque tiene un saldo deudor pendiente de $${prov.saldoPendiente.toFixed(2)}.`);
      return false;
    }
    setProveedores((prev) => prev.filter((p) => p.id !== id));
    logAuditoria(
      'Proveedores',
      'ELIMINAR',
      `Eliminación de proveedor: "${prov?.nombre || 'ID #' + id}" (${prov?.rif})`
    );
    return true;
  };

  // Handler: Register CxC Abono (payment from client)
  const handleRegistrarAbonoCxc = (cxcId: number, monto: number, metodo: string, referencia?: string) => {
    const targetCxc = cxcList.find((c) => c.id === cxcId);

    setCxcList((prev) =>
      prev.map((item) => {
        if (item.id === cxcId) {
          const nuevoSaldo = Math.max(0, item.saldoRestante - monto);
          const nuevoEstado = nuevoSaldo === 0 ? 'pagada' : 'parcial';
          const newAbono = {
            id: item.abonos.length + 1,
            fecha: new Date().toISOString(),
            monto,
            metodoPago: metodo,
            referencia,
            usuarioNombre: currentUser?.nombre_completo || 'Cajero',
          };
          return {
            ...item,
            saldoRestante: nuevoSaldo,
            estado: nuevoEstado,
            abonos: [...item.abonos, newAbono],
          };
        }
        return item;
      })
    );

    // Update client balance
    if (targetCxc) {
      setClientes((prev) =>
        prev.map((cl) =>
          cl.id === targetCxc.clienteId
            ? { ...cl, saldoPendiente: Math.max(0, cl.saldoPendiente - monto) }
            : cl
        )
      );
      logAuditoria(
        'CxC',
        'ABONO',
        `Abono de ${formatUSD(monto)} recibido de "${targetCxc.clienteNombre}" para cuenta #${targetCxc.id} (${targetCxc.concepto}) [${metodo}]`,
        {
          detalles: `Saldo restante: ${formatUSD(Math.max(0, targetCxc.saldoRestante - monto))}. Ref: ${referencia || 'N/A'}`,
        }
      );
    }
  };

  // Handler: New CxC
  const handleNuevaCxc = (cxcData: Omit<CuentaPorCobrar, 'id' | 'abonos'>) => {
    const newId = cxcList.length + 1;
    const newCxc: CuentaPorCobrar = {
      ...cxcData,
      id: newId,
      abonos: [],
    };
    setCxcList([newCxc, ...cxcList]);
    setClientes((prev) =>
      prev.map((c) =>
        c.id === cxcData.clienteId ? { ...c, saldoPendiente: c.saldoPendiente + cxcData.montoTotal } : c
      )
    );
    logAuditoria(
      'CxC',
      'CREAR',
      `Nueva cuenta por cobrar emitida a "${cxcData.clienteNombre}" por ${formatUSD(cxcData.montoTotal)} (Concepto: ${cxcData.concepto})`,
      {
        detalles: `Vence: ${new Date(cxcData.fechaVencimiento).toLocaleDateString('es-VE')}`,
      }
    );
  };

  // Handler: Register CxP Pago (payment to supplier)
  const handleRegistrarPagoCxp = (cxpId: number, monto: number, metodo: string, referencia?: string) => {
    const targetCxp = cxpList.find((c) => c.id === cxpId);

    setCxpList((prev) =>
      prev.map((item) => {
        if (item.id === cxpId) {
          const nuevoSaldo = Math.max(0, item.saldoRestante - monto);
          const nuevoEstado = nuevoSaldo === 0 ? 'pagada' : 'parcial';
          const newPago = {
            id: item.pagos.length + 1,
            fecha: new Date().toISOString(),
            monto,
            metodoPago: metodo,
            referencia,
            usuarioNombre: currentUser?.nombre_completo || 'Administrador',
          };
          return {
            ...item,
            saldoRestante: nuevoSaldo,
            estado: nuevoEstado,
            pagos: [...item.pagos, newPago],
          };
        }
        return item;
      })
    );

    // Update supplier balance
    if (targetCxp) {
      setProveedores((prev) =>
        prev.map((pr) =>
          pr.id === targetCxp.proveedorId
            ? { ...pr, saldoPendiente: Math.max(0, pr.saldoPendiente - monto) }
            : pr
        )
      );
      logAuditoria(
        'CxP',
        'PAGO',
        `Pago de ${formatUSD(monto)} registrado al proveedor "${targetCxp.proveedorNombre}" para factura #${targetCxp.numeroFactura} [${metodo}]`,
        {
          detalles: `Saldo restante: ${formatUSD(Math.max(0, targetCxp.saldoRestante - monto))}. Ref: ${referencia || 'N/A'}`,
        }
      );
    }
  };

  // Handler: New CxP
  const handleNuevaCxp = (cxpData: Omit<CuentaPorPagar, 'id' | 'pagos'>) => {
    const newId = cxpList.length + 1;
    const newCxp: CuentaPorPagar = {
      ...cxpData,
      id: newId,
      pagos: [],
    };
    setCxpList([newCxp, ...cxpList]);
    setProveedores((prev) =>
      prev.map((p) =>
        p.id === cxpData.proveedorId ? { ...p, saldoPendiente: p.saldoPendiente + cxpData.montoTotal } : p
      )
    );
    logAuditoria(
      'CxP',
      'CREAR',
      `Nueva cuenta por pagar registrada de proveedor "${cxpData.proveedorNombre}" por ${formatUSD(cxpData.montoTotal)} (Doc: ${cxpData.numeroFactura})`,
      {
        detalles: `Vence: ${new Date(cxpData.fechaVencimiento).toLocaleDateString('es-VE')}`,
      }
    );
  };

  // Handler: Full Database & Application Reset (Factory Reset)
  const handleResetAllData = () => {
    try {
      localStorage.clear();
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
      localStorage.removeItem('pos_correlativo_x');
      localStorage.removeItem('pos_correlativo_z');
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }

    // 1. Reset Fiscal & Company Data
    const cleanEmpresa = CLEAN_EMPRESA_CONFIG;
    saveEmpresaConfig(cleanEmpresa);
    setEmpresaConfig(cleanEmpresa);

    // 2. Reset Users (Single Clean Administrator)
    const cleanUsuarios: Usuario[] = [
      {
        id: 1,
        nombre_completo: 'Administrador Principal',
        username: 'admin',
        pin: '1111',
        rol: 'admin',
        sucursal_id: 1,
        cargo: 'Gerente General',
        permisos: {
          dashboard: true,
          ventas: true,
          inventario: true,
          compras: true,
          clientes: true,
          proveedores: true,
          cxc: true,
          cxp: true,
          reportes: true,
          configuracion: true,
        },
      },
    ];
    setUsuarios(cleanUsuarios);
    setCurrentUser(cleanUsuarios[0]);

    // 3. Reset Branches
    const cleanSucursales: Sucursal[] = [
      { id: 1, nombre: cleanEmpresa.nombreTienda1 || 'Tienda 1', tipo: 'tienda' },
      { id: 2, nombre: cleanEmpresa.nombreTienda2 || 'Tienda 2', tipo: 'tienda' },
      { id: 3, nombre: cleanEmpresa.nombreOficina || 'Oficina Central / Almacén', tipo: 'oficina' },
    ];
    setSucursales(cleanSucursales);

    // 4. Reset Inventory & Products (Clean empty catalog)
    const cleanProductos: Producto[] = [];
    const cleanInventario: InventarioItem[] = [];
    setProductos(cleanProductos);
    setInventario(cleanInventario);

    // 5. Reset Fiscal Cuts & Audit Correlatives
    setCorrelativoX(0);
    setCorrelativoZ(0);

    // 6. Empty all transactional data
    const cleanVentas: Venta[] = [];
    const cleanCompras: Compra[] = [];
    const cleanClientes: Cliente[] = [
      {
        id: 1,
        nombre: 'Cliente de Contado',
        rif_cedula: 'V-00000000',
        telefono: '-',
        email: '',
        direccion: 'Mostrador',
        limiteCredito: 0,
        saldoPendiente: 0,
        fechaRegistro: new Date().toISOString().split('T')[0],
      },
    ];
    const cleanProveedores: Proveedor[] = [];
    const cleanCxc: CuentaPorCobrar[] = [];
    const cleanCxp: CuentaPorPagar[] = [];

    setVentas(cleanVentas);
    setCompras(cleanCompras);
    setClientes(cleanClientes);
    setProveedores(cleanProveedores);
    setCxcList(cleanCxc);
    setCxpList(cleanCxp);

    const resetAuditEntry = createAuditEntry(
      cleanUsuarios[0],
      'Configuración',
      'RESET',
      'Restablecimiento total del sistema a valores de fábrica',
      {
        detalles: 'Se limpiaron todas las ventas, compras, productos, inventario, clientes y proveedores.',
      }
    );
    setAuditoriaLogs([resetAuditEntry]);

    // Save cleaned database to local storage immediately
    try {
      localStorage.setItem(STORAGE_KEYS.ventas, JSON.stringify(cleanVentas));
      localStorage.setItem(STORAGE_KEYS.compras, JSON.stringify(cleanCompras));
      localStorage.setItem(STORAGE_KEYS.clientes, JSON.stringify(cleanClientes));
      localStorage.setItem(STORAGE_KEYS.proveedores, JSON.stringify(cleanProveedores));
      localStorage.setItem(STORAGE_KEYS.cxc, JSON.stringify(cleanCxc));
      localStorage.setItem(STORAGE_KEYS.cxp, JSON.stringify(cleanCxp));
      localStorage.setItem(STORAGE_KEYS.productos, JSON.stringify(cleanProductos));
      localStorage.setItem(STORAGE_KEYS.inventario, JSON.stringify(cleanInventario));
      localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(cleanUsuarios));
      localStorage.setItem(STORAGE_KEYS.sucursales, JSON.stringify(cleanSucursales));
      localStorage.setItem(STORAGE_KEYS.auditoria, JSON.stringify([resetAuditEntry]));
      localStorage.setItem('pos_correlativo_x', '0');
      localStorage.setItem('pos_correlativo_z', '0');
      localStorage.setItem(STORAGE_KEYS.pedidos_online, JSON.stringify([]));
    } catch (e) {}

    setPedidosOnline([]);
    setActiveTab('dashboard');
  };

  // Handler: Restore full database from JSON backup file
  const handleRestoreDatabase = (backupData: any) => {
    if (!backupData) return;

    if (backupData.empresaConfig) {
      setEmpresaConfig(backupData.empresaConfig);
      saveEmpresaConfig(backupData.empresaConfig);
    }
    if (Array.isArray(backupData.sucursales) && backupData.sucursales.length > 0) {
      setSucursales(backupData.sucursales);
      try { localStorage.setItem(STORAGE_KEYS.sucursales, JSON.stringify(backupData.sucursales)); } catch (e) {}
    }
    if (Array.isArray(backupData.usuarios) && backupData.usuarios.length > 0) {
      setUsuarios(backupData.usuarios);
      try { localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(backupData.usuarios)); } catch (e) {}
    }
    if (Array.isArray(backupData.productos)) {
      setProductos(backupData.productos);
      try { localStorage.setItem(STORAGE_KEYS.productos, JSON.stringify(backupData.productos)); } catch (e) {}
    }
    if (Array.isArray(backupData.inventario)) {
      setInventario(backupData.inventario);
      try { localStorage.setItem(STORAGE_KEYS.inventario, JSON.stringify(backupData.inventario)); } catch (e) {}
    }
    if (Array.isArray(backupData.ventas)) {
      setVentas(backupData.ventas);
      try { localStorage.setItem(STORAGE_KEYS.ventas, JSON.stringify(backupData.ventas)); } catch (e) {}
    }
    if (Array.isArray(backupData.compras)) {
      setCompras(backupData.compras);
      try { localStorage.setItem(STORAGE_KEYS.compras, JSON.stringify(backupData.compras)); } catch (e) {}
    }
    if (Array.isArray(backupData.clientes)) {
      setClientes(backupData.clientes);
      try { localStorage.setItem(STORAGE_KEYS.clientes, JSON.stringify(backupData.clientes)); } catch (e) {}
    }
    if (Array.isArray(backupData.proveedores)) {
      setProveedores(backupData.proveedores);
      try { localStorage.setItem(STORAGE_KEYS.proveedores, JSON.stringify(backupData.proveedores)); } catch (e) {}
    }
    if (Array.isArray(backupData.cxc)) {
      setCxcList(backupData.cxc);
      try { localStorage.setItem(STORAGE_KEYS.cxc, JSON.stringify(backupData.cxc)); } catch (e) {}
    }
    if (Array.isArray(backupData.cxp)) {
      setCxpList(backupData.cxp);
      try { localStorage.setItem(STORAGE_KEYS.cxp, JSON.stringify(backupData.cxp)); } catch (e) {}
    }
    if (Array.isArray(backupData.pedidosOnline)) {
      setPedidosOnline(backupData.pedidosOnline);
      try { localStorage.setItem(STORAGE_KEYS.pedidos_online, JSON.stringify(backupData.pedidosOnline)); } catch (e) {}
    }
    if (backupData.tiendaConfig) {
      setTiendaConfig(backupData.tiendaConfig);
      try { localStorage.setItem(STORAGE_KEYS.tienda_config, JSON.stringify(backupData.tiendaConfig)); } catch (e) {}
    }
    if (backupData.correlativoX !== undefined) {
      setCorrelativoX(backupData.correlativoX);
      try { localStorage.setItem('pos_correlativo_x', String(backupData.correlativoX)); } catch (e) {}
    }
    if (backupData.correlativoZ !== undefined) {
      setCorrelativoZ(backupData.correlativoZ);
      try { localStorage.setItem('pos_correlativo_z', String(backupData.correlativoZ)); } catch (e) {}
    }

    const restoreEntry = createAuditEntry(
      currentUser,
      'Configuración',
      'RESET',
      `Restauración total de base de datos exitosa desde archivo JSON`,
      {
        detalles: `Restaurados: ${backupData.productos?.length || 0} productos, ${backupData.ventas?.length || 0} ventas, ${backupData.clientes?.length || 0} clientes.`,
      }
    );

    const mergedLogs = Array.isArray(backupData.auditoria) && backupData.auditoria.length > 0
      ? [restoreEntry, ...backupData.auditoria]
      : [restoreEntry, ...auditoriaLogs];

    setAuditoriaLogs(mergedLogs);
    try { localStorage.setItem(STORAGE_KEYS.auditoria, JSON.stringify(mergedLogs)); } catch (e) {}
  };

  // ==========================================
  // E-COMMERCE & TIENDA ONLINE HANDLERS
  // ==========================================

  // Handler: Update Store configuration (WhatsApp, fees, payment info)
  const handleActualizarTiendaConfig = (newConfig: TiendaConfig) => {
    setTiendaConfig(newConfig);
    try {
      localStorage.setItem(STORAGE_KEYS.tienda_config, JSON.stringify(newConfig));
    } catch (e) {}

    // Sync to Firebase Firestore in Google Cloud
    saveTiendaConfigToFirestore(newConfig).catch((err) =>
      console.warn('Notice saving tiendaConfig to Firestore:', err)
    );

    logAuditoria(
      'Configuración',
      'MODIFICAR',
      `Configuración de tienda online actualizada: "${newConfig.nombreTienda}" (WhatsApp: ${newConfig.whatsappContacto})`,
      {
        detalles: `Delivery fijo: $${newConfig.costoDeliveryFijo}, Pago Móvil Banco: ${newConfig.pagoMovilBanco}`,
      }
    );
  };

  // Handler: Crear nuevo pedido online (generado desde el catálogo público web o móvil)
  const handleCrearPedidoOnline = (
    pedidoData: Omit<PedidoOnline, 'id' | 'numeroPedido' | 'fecha' | 'creadoEn' | 'estado'>
  ): PedidoOnline => {
    const year = new Date().getFullYear();
    const nextNum = pedidosOnline.length + 1;
    const numeroPedido = `WEB-${year}-${String(nextNum).padStart(3, '0')}`;
    const nowIso = new Date().toISOString();

    const nuevoPedido: PedidoOnline = {
      ...pedidoData,
      id: `pedido_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      numeroPedido,
      fecha: nowIso,
      creadoEn: nowIso,
      estado: 'pendiente',
    };

    setPedidosOnline((prev) => [nuevoPedido, ...prev]);

    // Enviar inmediatamente a Firebase Firestore (tiempo real en la nube sin suspensión)
    savePedidoOnlineToFirestore(nuevoPedido).catch((err) =>
      console.error('Error enviando pedido a Firebase Firestore:', err)
    );

    // Enviar inmediatamente al backend server para que la laptop y otros dispositivos lo reciban al instante
    fetch('/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoPedido),
    }).catch((err) => console.error('Error enviando pedido al servidor:', err));

    // Ensure customer is registered in client directory if not already present
    setClientes((prevClientes) => {
      const exists = prevClientes.some(
        (c) =>
          (c.rif && c.rif.trim().toLowerCase() === pedidoData.clienteRif.trim().toLowerCase()) ||
          (c.rif_cedula && c.rif_cedula.trim().toLowerCase() === pedidoData.clienteRif.trim().toLowerCase()) ||
          c.telefono.replace(/\D/g, '') === pedidoData.clienteTelefono.replace(/\D/g, '')
      );
      if (!exists) {
        const nuevoCliente: Cliente = {
          id: prevClientes.length + 1,
          nombre: pedidoData.clienteNombre,
          rif_cedula: pedidoData.clienteRif,
          telefono: pedidoData.clienteTelefono,
          direccion: pedidoData.direccionEntrega || 'Cliente Tienda Web',
          limiteCredito: 0,
          saldoPendiente: 0,
          fechaRegistro: new Date().toISOString().split('T')[0],
        };
        return [...prevClientes, nuevoCliente];
      }
      return prevClientes;
    });

    logAuditoria(
      'POS / Ventas',
      'CREAR',
      `Nuevo pedido online recibido #${numeroPedido} por ${pedidoData.clienteNombre} (${formatUSD(pedidoData.total)})`,
      {
        sucursal_id: pedidoData.sucursalId,
        sucursal_nombre: pedidoData.sucursalNombre,
        detalles: `Modalidad: ${pedidoData.tipoEntrega}. Pago: ${pedidoData.metodoPago}. Artículos: ${pedidoData.detalles.length}. Total: $${pedidoData.total} (Bs. ${pedidoData.totalBs})`,
      }
    );

    return nuevoPedido;
  };

  // Handler: Actualizar estado de pedido online
  const handleActualizarEstadoPedidoOnline = (pedidoId: string, nuevoEstado: PedidoOnline['estado']) => {
    setPedidosOnline((prev) =>
      prev.map((p) => {
        if (p.id === pedidoId) {
          logAuditoria(
            'POS / Ventas',
            'MODIFICAR',
            `Estado de orden web #${p.numeroPedido} actualizado a "${nuevoEstado.toUpperCase()}"`,
            {
              detalles: `Cliente: ${p.clienteNombre} (${p.clienteTelefono})`,
            }
          );
          return { ...p, estado: nuevoEstado };
        }
        return p;
      })
    );

    // Sync status update with Firebase Firestore
    updatePedidoOnlineInFirestore(pedidoId, { estado: nuevoEstado }).catch((err) =>
      console.error('Error actualizando pedido en Firestore:', err)
    );

    // Sync status update with backend server
    fetch(`/api/pedidos/${pedidoId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: nuevoEstado }),
    }).catch((err) => console.error('Error actualizando pedido en servidor:', err));
  };

  // Handler: Facturar pedido web al POS (convierte pedido en venta oficial y descuenta inventario)
  const handleFacturarPedidoAlPos = (pedido: PedidoOnline) => {
    const sucursalTargetId = pedido.sucursalId || 1;
    const sucursalTarget = sucursales.find((s) => s.id === sucursalTargetId);
    const newVentaId = ventas.length + 1;

    // Map online payment method to POS payment method
    let posMetodo: DetallePagoVenta['metodo'] = 'tarjeta';
    if (pedido.metodoPago === 'pago_movil') posMetodo = 'pago_movil';
    else if (pedido.metodoPago === 'efectivo_usd' || pedido.metodoPago === 'zelle') posMetodo = 'efectivo_usd';
    else if (pedido.metodoPago === 'efectivo_bs') posMetodo = 'efectivo_bs';

    const pagoDetalle: DetallePagoVenta = {
      metodo: posMetodo,
      referencia_pago_movil: pedido.referenciaPago,
      monto_usd: pedido.total,
      monto_bs: pedido.totalBs,
      pago_movil_monto_bs: pedido.metodoPago === 'pago_movil' ? pedido.totalBs : undefined,
      efectivo_usd_recibido: pedido.metodoPago === 'efectivo_usd' || pedido.metodoPago === 'zelle' ? pedido.total : undefined,
      efectivo_bs_recibido: pedido.metodoPago === 'efectivo_bs' ? pedido.totalBs : undefined,
    };

    const detallesVenta: DetalleVenta[] = pedido.detalles.map((d, index) => ({
      id: index + 1,
      venta_id: newVentaId,
      producto_id: d.productoId,
      producto_nombre: d.productoNombre,
      codigo_barras: d.codigo_barras || '',
      cantidad: d.cantidad,
      precio_unitario: d.precioUnitario,
      subtotal: d.subtotal,
      exento_iva: d.exentoIva,
    }));

    const nuevaVenta: Venta = {
      id: newVentaId,
      sucursal_id: sucursalTargetId,
      usuario_nombre: currentUser ? currentUser.nombre_completo : 'Caja Web / Despacho',
      cliente_nombre: pedido.clienteNombre,
      cliente_rif: pedido.clienteRif,
      fecha: new Date().toISOString(),
      subtotal_neto: pedido.subtotalNeto,
      base_imponible: pedido.baseImponible,
      monto_exento: pedido.montoExento,
      monto_iva: pedido.montoIva,
      total: pedido.total,
      metodo_pago: posMetodo,
      referencia_pago: pedido.referenciaPago,
      pago_detalle: pagoDetalle,
      detalles: detallesVenta,
    };

    // Update sales state
    setVentas((prev) => [nuevaVenta, ...prev]);

    // Deduct stock in inventario
    setInventario((prevInv) =>
      prevInv.map((invItem) => {
        if (invItem.sucursal_id === sucursalTargetId) {
          const soldItem = pedido.detalles.find((d) => d.productoId === invItem.producto_id);
          if (soldItem) {
            return {
              ...invItem,
              stock: Math.max(0, invItem.stock - soldItem.cantidad),
            };
          }
        }
        return invItem;
      })
    );

    // Update online order state: mark as delivered and link sale ID
    setPedidosOnline((prev) =>
      prev.map((p) =>
        p.id === pedido.id
          ? { ...p, estado: 'entregado', ventaIdGenerada: newVentaId }
          : p
      )
    );

    // Sync billed status with backend server
    fetch(`/api/pedidos/${pedido.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: 'entregado', correlativoFactura: newVentaId }),
    }).catch((err) => console.error('Error facturando pedido en servidor:', err));

    logAuditoria(
      'POS / Ventas',
      'VENTA',
      `Facturación exitosa en POS para orden web #${pedido.numeroPedido} -> Factura #${nuevaVenta.id} (${formatUSD(pedido.total)})`,
      {
        sucursal_id: sucursalTargetId,
        sucursal_nombre: sucursalTarget?.nombre,
        detalles: `Cliente: ${pedido.clienteNombre} (${pedido.clienteRif}). Facturado en caja por ${currentUser?.nombre_completo || 'Sistema'}`,
      }
    );
  };

  // Access check for activeTab
  const isGeneralManager = currentUser?.rol === 'admin';
  const hasAccessToActiveTab =
    isGeneralManager ||
    (currentUser?.permisos ? currentUser.permisos[activeTab] : activeTab === 'ventas');

  // If client is in digital store mode, render the public online catalog and ordering interface
  if (isClientStoreMode) {
    return (
      <TiendaOnlineView
        productos={productos}
        inventario={inventario}
        sucursales={sucursales}
        empresaConfig={empresaConfig}
        tiendaConfig={tiendaConfig}
        usuarios={usuarios}
        currentUser={currentUser}
        isInternalPreview={isInternalPreview}
        onCrearPedido={handleCrearPedidoOnline}
        onVolverAlPos={() => {
          setIsClientStoreMode(false);
          setIsInternalPreview(false);
          if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.delete('vista');
            url.searchParams.delete('tienda');
            url.searchParams.delete('cliente');
            window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
          }
        }}
        onActualizarTiendaConfig={handleActualizarTiendaConfig}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Top Auth / User Selector Bar */}
      <AuthHeader
        currentUser={currentUser}
        usuarios={usuarios}
        sucursales={sucursales}
        onSelectUser={(u) => {
          if (u && (!currentUser || currentUser.id !== u.id)) {
            logAuditoria(
              'Usuarios',
              'LOGIN',
              `Inicio de sesión / Cambio de usuario a: "${u.nombre_completo}" (${u.rol.toUpperCase()})`,
              {
                customUser: u,
                detalles: `Cargo: ${u.cargo || 'Operador'}. Sucursal asignada: ${sucursales.find((s) => s.id === u.sucursal_id)?.nombre || 'Todas'}`,
              }
            );
          }
          setCurrentUser(u);
        }}
        onLogout={() => {
          if (currentUser) {
            logAuditoria(
              'Usuarios',
              'LOGOUT',
              `Cierre de sesión de usuario "${currentUser.nombre_completo}"`,
              {
                customUser: currentUser,
              }
            );
          }
          setCurrentUser(null);
        }}
        onOpenHtmlModal={() => setShowHtmlModal(true)}
        onOpenCalculator={() => setShowCalculatorModal(true)}
        onOpenClientStore={() => {
          setIsInternalPreview(true);
          setIsClientStoreMode(true);
        }}
      />

      {/* Main Layout with Left Sidebar */}
      <div className="flex-1 flex flex-row overflow-hidden min-h-0">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setIsSidebarCollapsed(true); // Automatically collapse sidebar to the left upon choosing a module
          }}
          currentUser={currentUser}
          empresaConfig={empresaConfig}
          onOpenRateModal={() => setShowDailyRateModal(true)}
          onLogout={() => setCurrentUser(null)}
          onOpenHtmlModal={() => setShowHtmlModal(true)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          pendingWebOrdersCount={pedidosOnline.filter((p) => p.estado === 'pendiente').length}
          onOpenClientStore={() => {
            setIsInternalPreview(true);
            setIsClientStoreMode(true);
          }}
        />

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
          {/* Top Quick Metrics & Status Banner */}
          <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Toggle Sidebar Button in Top Bar */}
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed((prev) => !prev)}
                className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors cursor-pointer flex items-center gap-1.5 text-xs shadow-sm"
                title={isSidebarCollapsed ? 'Expandir menú lateral' : 'Colapsar menú lateral hacia la izquierda'}
              >
                {isSidebarCollapsed ? (
                  <PanelLeftOpen className="w-4 h-4 text-emerald-400" />
                ) : (
                  <PanelLeftClose className="w-4 h-4 text-slate-400" />
                )}
                <span className="hidden md:inline font-medium text-[11px]">
                  {isSidebarCollapsed ? 'Expandir Menú' : 'Colapsar Menú'}
                </span>
              </button>

              <span className="text-xs font-semibold text-slate-300 truncate">
                {empresaConfig.nombreEmpresa}
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-xs text-emerald-400 font-mono font-medium hidden sm:inline">
                1 USD = {formatBs(1, empresaConfig.tasaCambio)}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-slate-400">Ventas Hoy:</span>
                <span className="font-bold text-white">{formatUSD(totalSalesToday)}</span>
                <span className="text-[11px] text-emerald-400 hidden sm:inline">
                  ({formatBs(totalSalesToday, empresaConfig.tasaCambio)})
                </span>
              </div>

              {/* Client Store Link / Share Button in top banner */}
              <button
                type="button"
                onClick={() => setShowStoreShareModal(true)}
                className="px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 font-bold flex items-center gap-1.5 transition-all cursor-pointer text-xs"
                title="Obtener y compartir el link de la tienda online para clientes"
              >
                <Globe className="w-3.5 h-3.5 text-teal-400 stroke-[2.5]" />
                <span className="hidden sm:inline">Link Tienda Clientes</span>
              </button>

              {/* Standalone HTML / Laptop Options button directly in top banner (General Manager only) */}
              {isGeneralManager && (
                <button
                  type="button"
                  onClick={() => setShowHtmlModal(true)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1.5 transition-all cursor-pointer text-xs"
                  title="Abrir en Laptop / Descargar HTML (Acceso exclusivo Gerente General)"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
                  <span className="hidden sm:inline">Laptop / .HTML</span>
                </button>
              )}

              {/* Firebase Cloud Database Status & Sync button */}
              <FirebaseSyncSettings
                productos={productos}
                empresaConfig={empresaConfig}
                tiendaConfig={tiendaConfig}
                sucursales={sucursales}
                inventario={inventario}
                onDataLoadedFromCloud={(data) => {
                  if (data.productos && data.productos.length > 0) setProductos(data.productos);
                  if (data.empresaConfig) applyEmpresaConfigUpdate(data.empresaConfig);
                  if (data.tiendaConfig) setTiendaConfig(data.tiendaConfig);
                }}
              />
            </div>
          </div>

          {/* Module Content */}
          <main className="flex-1 p-4 sm:p-6 max-w-[1680px] mx-auto w-full">
            {!hasAccessToActiveTab ? (
              <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-8 text-center space-y-4 max-w-xl mx-auto my-12">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Módulo Restringido</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Tu usuario (<strong>{currentUser?.nombre_completo}</strong>) solo cuenta con acceso autorizado para el módulo de <strong>Ventas</strong>.
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Solicita al Gerente General en el módulo de Configuración que te otorgue permisos adicionales si los requieres.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('ventas')}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 mx-auto cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Ir al Punto de Venta (Ventas)</span>
                </button>
              </div>
            ) : (
              <>
                {/* 1. DASHBOARD */}
                {activeTab === 'dashboard' && (
                  <ExecutiveDashboard
                    sucursales={sucursales}
                    productos={productos}
                    inventario={inventario}
                    ventas={ventas}
                    usuarios={usuarios}
                    currentUser={currentUser}
                    empresaConfig={empresaConfig}
                    onOpenCompanySettings={() => setShowCompanySettingsModal(true)}
                  />
                )}

                {/* 2. VENTAS (POS) */}
                {activeTab === 'ventas' && (
                  <PosSimulator
                    sucursales={sucursales}
                    productos={productos}
                    inventario={inventario}
                    currentUser={currentUser}
                    empresaConfig={empresaConfig}
                    clientes={clientes}
                    onRegistrarVenta={handleRegistrarVenta}
                    onAddCliente={handleAddCliente}
                    ventas={ventas}
                  />
                )}

                {/* 2.1 PEDIDOS WEB (E-COMMERCE) */}
                {activeTab === 'pedidos_web' && (
                  <PedidosWebManager
                    pedidosOnline={pedidosOnline}
                    tiendaConfig={tiendaConfig}
                    sucursales={sucursales}
                    empresaConfig={empresaConfig}
                    currentUser={currentUser}
                    onActualizarEstadoPedido={handleActualizarEstadoPedidoOnline}
                    onFacturarPedidoAlPos={handleFacturarPedidoAlPos}
                    onActualizarTiendaConfig={handleActualizarTiendaConfig}
                    onAbrirTiendaCliente={() => {
                      setIsInternalPreview(true);
                      setIsClientStoreMode(true);
                    }}
                  />
                )}

                {/* 3. INVENTARIO */}
                {activeTab === 'inventario' && (
                  <InventoryManager
                    sucursales={sucursales}
                    productos={productos}
                    inventario={inventario}
                    currentUser={currentUser}
                    empresaConfig={empresaConfig}
                    onTransferStock={handleTransferStock}
                    onAddProduct={handleAddProduct}
                    onUpdateProduct={handleUpdateProduct}
                    onDeleteProduct={handleDeleteProduct}
                    proveedores={proveedores}
                    onRegistrarCompra={handleRegistrarCompra}
                    onAddProveedor={handleAddProveedor}
                  />
                )}

                {/* 4. COMPRAS */}
                {activeTab === 'compras' && (
                  <ComprasManager
                    compras={compras}
                    proveedores={proveedores}
                    productos={productos}
                    sucursales={sucursales}
                    empresaConfig={empresaConfig}
                    currentUser={currentUser}
                    onRegistrarCompra={handleRegistrarCompra}
                    onAddProveedor={handleAddProveedor}
                  />
                )}

                {/* 4. CLIENTES */}
                {activeTab === 'clientes' && (
                  <ClientesManager
                    clientes={clientes}
                    onAddCliente={handleAddCliente}
                    onUpdateCliente={handleUpdateCliente}
                    onDeleteCliente={handleDeleteCliente}
                    empresaConfig={empresaConfig}
                  />
                )}

                {/* 5. PROVEEDORES */}
                {activeTab === 'proveedores' && (
                  <ProveedoresManager
                    proveedores={proveedores}
                    onAddProveedor={handleAddProveedor}
                    onUpdateProveedor={handleUpdateProveedor}
                    onDeleteProveedor={handleDeleteProveedor}
                    empresaConfig={empresaConfig}
                  />
                )}

                {/* 6. CXC */}
                {activeTab === 'cxc' && (
                  <CxcManager
                    cxcList={cxcList}
                    clientes={clientes}
                    empresaConfig={empresaConfig}
                    currentUser={currentUser}
                    onRegistrarAbono={handleRegistrarAbonoCxc}
                    onNuevaCuentaCobrar={handleNuevaCxc}
                  />
                )}

                {/* 7. CXP */}
                {activeTab === 'cxp' && (
                  <CxpManager
                    cxpList={cxpList}
                    proveedores={proveedores}
                    empresaConfig={empresaConfig}
                    currentUser={currentUser}
                    onRegistrarPago={handleRegistrarPagoCxp}
                    onNuevaCuentaPagar={handleNuevaCxp}
                  />
                )}

                {/* 8. REPORTES */}
                {activeTab === 'reportes' && (
                  <PdfReportsCenter
                    currentUser={currentUser}
                    ventas={ventas}
                    sucursales={sucursales}
                    empresaConfig={empresaConfig}
                    usuarios={usuarios}
                    correlativoX={correlativoX}
                    correlativoZ={correlativoZ}
                    onIncrementCorrelativoX={() => {
                      const next = correlativoX + 1;
                      setCorrelativoX(next);
                      logAuditoria(
                        'Reportes / Fiscal',
                        'CORTE_X',
                        `Generación de Corte Fiscal Parcial X #${next}`,
                        { detalles: `Emitido por ${currentUser?.nombre_completo || 'Usuario'}` }
                      );
                    }}
                    onIncrementCorrelativoZ={() => {
                      const next = correlativoZ + 1;
                      setCorrelativoZ(next);
                      logAuditoria(
                        'Reportes / Fiscal',
                        'CORTE_Z',
                        `Cierre Diario Definitivo - Corte Fiscal Z #${next}`,
                        { detalles: `Emitido y correlativo bloqueado por ${currentUser?.nombre_completo || 'Usuario'}` }
                      );
                    }}
                  />
                )}

                {/* 9. CONFIGURACIÓN (PERMISOS, NOMBRES, PIN, EMPRESA, AUDITORÍA) */}
                {activeTab === 'configuracion' && (
                  <ConfiguracionView
                    usuarios={usuarios}
                    onUpdateUsuarios={(updated) => {
                      setUsuarios(updated);
                      logAuditoria(
                        'Usuarios',
                        'MODIFICAR',
                        `Actualización de la nómina de usuarios y permisos (${updated.length} usuarios)`,
                        {
                          detalles: updated.map((u) => `${u.nombre_completo} (${u.username}, ${u.rol})`).join('; '),
                        }
                      );
                    }}
                    empresaConfig={empresaConfig}
                    onSaveEmpresaConfig={handleSaveEmpresaConfig}
                    sucursales={sucursales}
                    currentUser={currentUser}
                    onOpenRateModal={() => setShowDailyRateModal(true)}
                    onResetAllData={handleResetAllData}
                    auditoriaLogs={auditoriaLogs}
                    onClearAuditoriaLogs={() => {
                      const entry = createAuditEntry(
                        currentUser,
                        'Auditoría',
                        'LIMPIAR',
                        'Vaciado y limpieza del historial de auditoría'
                      );
                      setAuditoriaLogs([entry]);
                    }}
                    productos={productos}
                    inventario={inventario}
                    ventas={ventas}
                    compras={compras}
                    clientes={clientes}
                    proveedores={proveedores}
                    cxcList={cxcList}
                    cxpList={cxpList}
                    pedidosOnline={pedidosOnline}
                    tiendaConfig={tiendaConfig}
                    correlativoX={correlativoX}
                    correlativoZ={correlativoZ}
                    onRestoreDatabase={handleRestoreDatabase}
                    onLogAudit={logAuditoria}
                    licenseValidationResult={licenseValidation}
                    onLicenseChanged={recheckLicense}
                    onOpenCalculator={() => setShowCalculatorModal(true)}
                    onOpenStoreShare={() => setShowStoreShareModal(true)}
                    onOpenHtmlModal={() => setShowHtmlModal(true)}
                  />
                )}
              </>
            )}
          </main>

          {/* Footer Corporativo Oficial AITech Soluciones, C. A. */}
          {activeTab !== 'ventas' && <AITechFooter variant="standard" />}
        </div>
      </div>

      {/* Toast Notificación Nuevo Pedido Web en Tiempo Real */}
      {nuevoPedidoNotificacion && (
        <div className="fixed top-14 right-4 z-50 max-w-sm w-full bg-slate-900/95 backdrop-blur-md border-2 border-amber-500/80 rounded-2xl p-4 shadow-2xl shadow-amber-500/20 animate-fade-in">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                <PackageCheck className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 block">
                  ¡Nuevo Pedido Web Recibido!
                </span>
                <p className="text-sm font-bold text-white">
                  {nuevoPedidoNotificacion.numeroPedido}
                </p>
                <p className="text-xs text-slate-300">
                  Cliente: <strong>{nuevoPedidoNotificacion.clienteNombre}</strong>
                </p>
                <p className="text-xs font-mono font-bold text-emerald-400">
                  Total: {formatUSD(nuevoPedidoNotificacion.total)} ({formatBs(nuevoPedidoNotificacion.total, empresaConfig.tasaCambio)})
                </p>
              </div>
            </div>
            <button
              onClick={() => setNuevoPedidoNotificacion(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('pedidos_web');
                setNuevoPedidoNotificacion(null);
              }}
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all"
            >
              <span>Atender en Pedidos Web</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Cryptographic License Lock Screen Modal (If invalid or unactivated) */}
      {(!licenseValidation.isValid || showLicenseLockModal) && (
        <LicenseLockModal
          validationResult={licenseValidation}
          onLicenseActivated={(key) => {
            recheckLicense();
            logAuditoria(
              'Seguridad',
              'ACCESO',
              'Activación de licencia de software exitosa con firma criptográfica',
              { detalles: `Clave registrada y validada para este ID de hardware.` }
            );
          }}
          canDismiss={false}
        />
      )}

      {/* Daily Exchange Rate Prompt Modal */}
      <DailyRateModal
        isOpen={showDailyRateModal}
        empresaConfig={empresaConfig}
        currentRate={empresaConfig.tasaCambio}
        onSaveRate={handleSaveTasa}
        onClose={() => setShowDailyRateModal(false)}
      />

      {/* Manager Company & Fiscal Settings Modal */}
      <CompanySettingsModal
        isOpen={showCompanySettingsModal}
        empresaConfig={empresaConfig}
        currentUser={currentUser}
        onSaveConfig={handleSaveEmpresaConfig}
        onClose={() => setShowCompanySettingsModal(false)}
      />

      {/* Standalone HTML File Downloader Modal */}
      {showHtmlModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl p-6 relative animate-fade-in">
            <button
              type="button"
              onClick={() => setShowHtmlModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
            <StandaloneHtmlDownloader
              liveData={{
                empresaConfig,
                usuarios,
                productos,
                inventario,
                ventas,
                compras,
                clientes,
                proveedores,
                cxc: cxcList,
                cxp: cxpList,
                sucursales,
                currentUser,
                auditoria: auditoriaLogs,
              }}
            />
          </div>
        </div>
      )}

      {/* Client Public Store Share Modal */}
      {showStoreShareModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-teal-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-fade-in space-y-4">
            <button
              type="button"
              onClick={() => setShowStoreShareModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">
                  Link de la Tienda Online para Clientes
                </h3>
                <p className="text-xs text-slate-400">
                  Enlace público directo al catálogo de compras
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Este es el enlace que debes compartir con tus clientes por <strong>WhatsApp, Instagram, Facebook o estado</strong>. Al abrirlo, el cliente ve tu catálogo de productos actualizado con precios en USD y Bolívares (a tasa oficial del día), puede agregar productos al carrito y hacer pedidos con entrega o retiro.
            </p>

            {/* URL Display & Copy Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 space-y-2">
              <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider block">
                Enlace para el cliente:
              </span>
              <div className="flex items-center gap-2">
                {(() => {
                  const realWs = !isMockDefaultPhone(tiendaConfig.whatsappContacto)
                    ? tiendaConfig.whatsappContacto
                    : (!isMockDefaultPhone(empresaConfig.telefono) ? empresaConfig.telefono : '');
                  const cleanWs = cleanMobileDigits(realWs);
                  const wsQuery = cleanWs ? `&ws=${encodeURIComponent(cleanWs)}` : '';
                  const shareUrl = typeof window !== 'undefined'
                    ? `${window.location.origin}${window.location.pathname}?vista=tienda${wsQuery}`
                    : `https://miapp.com?vista=tienda${wsQuery}`;

                  return (
                    <>
                      <input
                        type="text"
                        readOnly
                        value={shareUrl}
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-teal-200 font-mono select-all focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(shareUrl);
                          setCopiedStoreUrl(true);
                          setTimeout(() => setCopiedStoreUrl(false), 2500);
                        }}
                        className="px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-sm"
                      >
                        {copiedStoreUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedStoreUrl ? '¡Copiado!' : 'Copiar'}</span>
                      </button>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  const realWs = !isMockDefaultPhone(tiendaConfig.whatsappContacto)
                    ? tiendaConfig.whatsappContacto
                    : (!isMockDefaultPhone(empresaConfig.telefono) ? empresaConfig.telefono : '');
                  const cleanWs = cleanMobileDigits(realWs);
                  const wsQuery = cleanWs ? `&ws=${encodeURIComponent(cleanWs)}` : '';
                  const shareUrl = `${window.location.origin}${window.location.pathname}?vista=tienda${wsQuery}`;
                  const msg = encodeURIComponent(
                    `¡Hola! 👋 Te invitamos a visitar nuestro catálogo en línea de *${empresaConfig.nombreEmpresa}*. Puedes ver nuestros productos, precios y ordenar directamente desde este enlace:\n\n👉 ${shareUrl}`
                  );
                  window.open(`https://wa.me/?text=${msg}`, '_blank');
                }}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Enviar por WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowStoreShareModal(false);
                  setIsInternalPreview(true);
                  setIsClientStoreMode(true);
                }}
                className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 text-teal-400" />
                <span>Ver Tienda como Cliente</span>
              </button>
            </div>

            {/* Highlights explanation */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                <ShieldAlert className="w-3.5 h-3.5 text-teal-400" />
                <span>Seguro y exclusivo para clientes:</span>
              </div>
              <p>
                • El cliente <strong>no necesita contraseña</strong> ni ve los datos internos del negocio (costos, reportes, inventario privado).
              </p>
              <p>
                • Todos los pedidos que tus clientes hagan aparecen automáticamente en el módulo de <strong>Pedidos Web</strong> de tu POS para que los apruebes y factures.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Calculadora Comercial Multimoneda (Hotkey F9) */}
      <CommercialCalculatorModal
        isOpen={showCalculatorModal}
        onClose={() => setShowCalculatorModal(false)}
        empresaConfig={empresaConfig}
      />
    </div>
  );
}
