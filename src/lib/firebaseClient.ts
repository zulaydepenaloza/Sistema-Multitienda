import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  writeBatch,
  getDocs,
  deleteDoc,
  limit,
} from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';
import { Producto, PedidoOnline, EmpresaConfig, TiendaConfig, Sucursal, InventarioItem, Venta } from '../types';

export const firebaseConfig = {
  projectId: firebaseConfigData.projectId,
  appId: firebaseConfigData.appId,
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  firestoreDatabaseId: firebaseConfigData.firestoreDatabaseId || '(default)',
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
};

// Initialize Firebase App singleton
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore targeting the provisioned database ID
export const db = getFirestore(
  firebaseApp,
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? firebaseConfig.firestoreDatabaseId
    : undefined
);

/**
 * Validates connection to Firestore server directly
 */
export async function testFirestoreConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const testDocRef = doc(db, 'test', 'connection');
    await setDoc(testDocRef, { ping: Date.now(), timestamp: new Date().toISOString() }, { merge: true });
    const snap = await getDocFromServer(testDocRef);
    if (snap.exists()) {
      return {
        success: true,
        message: '¡Conectado exitosamente con Firebase Firestore (Google Cloud)!',
      };
    }
    return {
      success: true,
      message: 'Conexión verificada con el clúster de Firestore.',
    };
  } catch (error: any) {
    console.error('Firebase test connection error:', error);
    if (error instanceof Error && error.message.includes('the client is offline')) {
      return {
        success: false,
        message: 'El dispositivo no tiene acceso a internet o la base de datos está desconectada.',
      };
    }
    return {
      success: false,
      message: `Error al conectar con Firestore: ${error?.message || error}`,
    };
  }
}

/**
 * Real-time listener for incoming Web Orders (pedidos_online)
 */
export function subscribeToPedidosOnline(
  onOrdersUpdated: (orders: PedidoOnline[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const q = query(collection(db, 'pedidos_online'), orderBy('fecha', 'desc'), limit(150));
    return onSnapshot(
      q,
      (snapshot) => {
        const orders: PedidoOnline[] = [];
        snapshot.forEach((d) => {
          orders.push(d.data() as PedidoOnline);
        });
        onOrdersUpdated(orders);
      },
      (err) => {
        console.warn('Firestore pedidos_online subscription notice:', err);
        if (onError) onError(err);
      }
    );
  } catch (e: any) {
    console.warn('Error starting pedidos_online listener:', e);
    return () => {};
  }
}

/**
 * Saves a new online web order into Firestore
 */
export async function savePedidoOnlineToFirestore(pedido: PedidoOnline): Promise<boolean> {
  try {
    const docRef = doc(db, 'pedidos_online', pedido.id);
    await setDoc(docRef, pedido, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving pedido_online to Firestore:', error);
    return false;
  }
}

/**
 * Updates status or details of a web order in Firestore
 */
export async function updatePedidoOnlineInFirestore(
  pedidoId: string,
  updates: Partial<PedidoOnline>
): Promise<boolean> {
  try {
    const docRef = doc(db, 'pedidos_online', pedidoId);
    await setDoc(docRef, updates, { merge: true });
    return true;
  } catch (error) {
    console.error('Error updating pedido_online in Firestore:', error);
    return false;
  }
}

/**
 * Real-time listener for company configuration and daily exchange rate
 */
export function subscribeToEmpresaConfig(
  onConfigUpdated: (config: EmpresaConfig) => void,
  onError?: (err: Error) => void
) {
  try {
    const docRef = doc(db, 'empresa_config', 'main');
    return onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          onConfigUpdated(snap.data() as EmpresaConfig);
        }
      },
      (err) => {
        console.warn('Firestore empresa_config notice:', err);
        if (onError) onError(err);
      }
    );
  } catch (e: any) {
    console.warn('Error subscribing to empresa_config:', e);
    return () => {};
  }
}

/**
 * Saves company configuration and exchange rate to Firestore
 */
export async function saveEmpresaConfigToFirestore(config: EmpresaConfig): Promise<boolean> {
  try {
    const cleanConfig: Record<string, any> = {
      nombreEmpresa: config.nombreEmpresa || '',
      rif: config.rif || '',
      direccionFiscal: config.direccionFiscal || '',
      telefono: config.telefono || '',
      logoUrl: config.logoUrl || '',
      tasaCambio: Number(config.tasaCambio) || 0,
      fechaTasa: config.fechaTasa || new Date().toLocaleDateString('es-VE'),
      ultimaActualizacionTasa: config.ultimaActualizacionTasa || new Date().toISOString(),
      nombreTienda1: config.nombreTienda1 || 'Tienda 1',
      nombreTienda2: config.nombreTienda2 || 'Tienda 2',
      nombreOficina: config.nombreOficina || 'Oficina Central / Almacén',
    };
    if ((config as any).piePaginaTicket !== undefined) {
      cleanConfig.piePaginaTicket = (config as any).piePaginaTicket;
    }
    await setDoc(doc(db, 'empresa_config', 'main'), cleanConfig, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving empresa_config to Firestore:', error);
    return false;
  }
}

/**
 * Fetch company configuration directly once from Firestore
 */
export async function getEmpresaConfigFromFirestore(): Promise<EmpresaConfig | null> {
  try {
    const empSnap = await getDoc(doc(db, 'empresa_config', 'main'));
    if (empSnap.exists()) {
      return empSnap.data() as EmpresaConfig;
    }
  } catch (e) {
    console.warn('Could not fetch empresa_config directly:', e);
  }
  return null;
}

/**
 * Real-time listener for digital store settings
 */
export function subscribeToTiendaConfig(
  onConfigUpdated: (config: TiendaConfig) => void,
  onError?: (err: Error) => void
) {
  try {
    const docRef = doc(db, 'tienda_config', 'main');
    return onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          onConfigUpdated(snap.data() as TiendaConfig);
        }
      },
      (err) => {
        console.warn('Firestore tienda_config notice:', err);
        if (onError) onError(err);
      }
    );
  } catch (e: any) {
    console.warn('Error subscribing to tienda_config:', e);
    return () => {};
  }
}

/**
 * Saves digital store configuration to Firestore
 */
export async function saveTiendaConfigToFirestore(config: TiendaConfig): Promise<boolean> {
  try {
    await setDoc(doc(db, 'tienda_config', 'main'), config, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving tienda_config to Firestore:', error);
    return false;
  }
}

/**
 * Real-time listener for products catalog
 */
export function subscribeToProductos(
  onProductosUpdated: (products: Producto[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const colRef = collection(db, 'productos');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const prods: Producto[] = [];
          snapshot.forEach((d) => {
            prods.push(d.data() as Producto);
          });
          onProductosUpdated(prods);
        }
      },
      (err) => {
        console.warn('Firestore productos notice:', err);
        if (onError) onError(err);
      }
    );
  } catch (e: any) {
    console.warn('Error subscribing to productos:', e);
    return () => {};
  }
}

/**
 * Save single product to Firestore
 */
export async function saveProductToFirestore(prod: Producto): Promise<boolean> {
  try {
    const cleanProd: Record<string, any> = {
      id: prod.id,
      nombre: prod.nombre || '',
      precio: Number(prod.precio) || 0,
      codigo_barras: prod.codigo_barras || '',
      costo: prod.costo !== undefined ? Number(prod.costo) : 0,
      unidad_medida: prod.unidad_medida || 'UND',
      exento_iva: Boolean(prod.exento_iva),
      categoria: prod.categoria || 'General',
      descripcion: prod.descripcion || '',
      imagen: prod.imagen || '',
      destacadoTienda: prod.destacadoTienda !== undefined ? Boolean(prod.destacadoTienda) : true,
    };
    await setDoc(doc(db, 'productos', String(prod.id)), cleanProd, { merge: true });
    return true;
  } catch (err) {
    console.error('Error saving product to Firestore:', err);
    return false;
  }
}

/**
 * Delete product document from Firestore
 */
export async function deleteProductFromFirestore(prodId: number): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'productos', String(prodId)));
    return true;
  } catch (err) {
    console.error('Error deleting product from Firestore:', err);
    return false;
  }
}

/**
 * Save inventario stock to Firestore
 */
export async function saveInventarioToFirestore(inventario: InventarioItem[]): Promise<boolean> {
  try {
    await setDoc(doc(db, 'inventario', 'main'), {
      items: inventario,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (err) {
    console.error('Error saving inventario to Firestore:', err);
    return false;
  }
}

/**
 * Fetch inventario from Firestore
 */
export async function fetchInventarioFromFirestore(): Promise<InventarioItem[] | null> {
  try {
    const snap = await getDoc(doc(db, 'inventario', 'main'));
    if (snap.exists() && Array.isArray(snap.data().items)) {
      return snap.data().items as InventarioItem[];
    }
  } catch (err) {
    console.warn('Error fetching inventario from Firestore:', err);
  }
  return null;
}

/**
 * Synchronize full local product catalog and stock to Firestore
 * Overwrites Firestore products so it matches the exact current local catalog,
 * deleting any old/orphaned sample products from Firestore.
 */
export async function syncAllToFirestore({
  productos,
  empresaConfig,
  tiendaConfig,
  sucursales,
  inventario,
}: {
  productos: Producto[];
  empresaConfig: EmpresaConfig;
  tiendaConfig: TiendaConfig;
  sucursales: Sucursal[];
  inventario: InventarioItem[];
}): Promise<{ success: boolean; count: number; deletedCount: number; error?: string }> {
  try {
    // 1. Sync Empresa & Tienda config
    await saveEmpresaConfigToFirestore(empresaConfig);
    await saveTiendaConfigToFirestore(tiendaConfig);
    await saveInventarioToFirestore(inventario);

    // 2. Fetch existing products in Firestore to find items to delete
    const existingSnap = await getDocs(collection(db, 'productos'));
    const localIds = new Set(productos.map((p) => String(p.id)));

    const batch = writeBatch(db);
    let count = 0;
    let deletedCount = 0;

    // Delete products in Firestore that no longer exist locally (e.g. old sample products 2..8)
    existingSnap.forEach((d) => {
      if (!localIds.has(d.id)) {
        batch.delete(d.ref);
        deletedCount++;
      }
    });

    // Upsert current local products
    for (const prod of productos) {
      const prodRef = doc(db, 'productos', String(prod.id));
      const cleanProd: Record<string, any> = {
        id: prod.id,
        nombre: prod.nombre || '',
        precio: Number(prod.precio) || 0,
        codigo_barras: prod.codigo_barras || '',
        costo: prod.costo !== undefined ? Number(prod.costo) : 0,
        unidad_medida: prod.unidad_medida || 'UND',
        exento_iva: Boolean(prod.exento_iva),
        categoria: prod.categoria || 'General',
        descripcion: prod.descripcion || '',
        imagen: prod.imagen || '',
        destacadoTienda: prod.destacadoTienda !== undefined ? Boolean(prod.destacadoTienda) : true,
      };
      batch.set(prodRef, cleanProd, { merge: true });
      count++;
    }

    // 3. Batch write sucursales
    for (const suc of sucursales) {
      const sucRef = doc(db, 'sucursales', String(suc.id));
      batch.set(sucRef, suc, { merge: true });
    }

    await batch.commit();
    return { success: true, count, deletedCount };
  } catch (err: any) {
    console.error('Error syncing all to Firestore:', err);
    return { success: false, count: 0, deletedCount: 0, error: err?.message || String(err) };
  }
}

/**
 * Load initial data from Firestore if present
 */
export async function fetchAllFromFirestore(): Promise<{
  productos?: Producto[];
  inventario?: InventarioItem[];
  empresaConfig?: EmpresaConfig;
  tiendaConfig?: TiendaConfig;
  pedidos?: PedidoOnline[];
} | null> {
  try {
    const result: any = {};

    // 1. Fetch empresa config
    const empSnap = await getDoc(doc(db, 'empresa_config', 'main'));
    if (empSnap.exists()) {
      result.empresaConfig = empSnap.data() as EmpresaConfig;
    }

    // 2. Fetch tienda config
    const tiendaSnap = await getDoc(doc(db, 'tienda_config', 'main'));
    if (tiendaSnap.exists()) {
      result.tiendaConfig = tiendaSnap.data() as TiendaConfig;
    }

    // 3. Fetch inventario
    const invSnap = await getDoc(doc(db, 'inventario', 'main'));
    if (invSnap.exists() && Array.isArray(invSnap.data().items)) {
      result.inventario = invSnap.data().items;
    }

    // 4. Fetch productos
    const prodSnap = await getDocs(collection(db, 'productos'));
    if (!prodSnap.empty) {
      const prods: Producto[] = [];
      prodSnap.forEach((d) => prods.push(d.data() as Producto));
      result.productos = prods;
    }

    // 5. Fetch pedidos_online
    const pedSnap = await getDocs(collection(db, 'pedidos_online'));
    if (!pedSnap.empty) {
      const orders: PedidoOnline[] = [];
      pedSnap.forEach((d) => orders.push(d.data() as PedidoOnline));
      result.pedidos = orders;
    }

    return result;
  } catch (error) {
    console.error('Error fetching all from Firestore:', error);
    return null;
  }
}
