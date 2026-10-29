import { STANDALONE_HTML_SOURCE } from '../data/standaloneHtmlSource';
import {
  Usuario,
  EmpresaConfig,
  Producto,
  InventarioItem,
  Venta,
  Compra,
  Cliente,
  Proveedor,
  CuentaPorCobrar,
  CuentaPorPagar,
  Sucursal,
  RegistroAuditoria,
} from '../types';

export interface AppExportData {
  empresaConfig?: EmpresaConfig;
  usuarios?: Usuario[];
  productos?: Producto[];
  inventario?: InventarioItem[];
  ventas?: Venta[];
  compras?: Compra[];
  clientes?: Cliente[];
  proveedores?: Proveedor[];
  cxc?: CuentaPorCobrar[];
  cxp?: CuentaPorPagar[];
  sucursales?: Sucursal[];
  currentUser?: Usuario | null;
  auditoria?: RegistroAuditoria[];
}

/**
 * Generates the complete standalone HTML source code with the current live React state
 * injected into INITIAL_DATA so the downloaded file is 100% up to date with any modifications
 * made in the preview (users, permissions, PINs, fiscal info, products, stock, exchange rate, etc.)
 */
export function generateLiveStandaloneHtml(liveData?: AppExportData): string {
  let html = STANDALONE_HTML_SOURCE;

  if (!liveData) {
    return html;
  }

  try {
    // Construct the live initial data object
    const exportPayload: Record<string, any> = {};

    if (liveData.empresaConfig) {
      exportPayload.empresaConfig = {
        nombreEmpresa: liveData.empresaConfig.nombreEmpresa || "Corporación Los Andes C.A.",
        rif: liveData.empresaConfig.rif || "J-31045892-0",
        direccionFiscal: liveData.empresaConfig.direccionFiscal || "Av. Las Américas, Centro Empresarial Torre A, Piso 4",
        telefono: liveData.empresaConfig.telefono || "+58 274 263-4411",
        tasaCambio: liveData.empresaConfig.tasaCambio || 36.50,
        nombreTienda1: liveData.empresaConfig.nombreTienda1 || "Tienda 1 (Av. Principal)",
        nombreTienda2: liveData.empresaConfig.nombreTienda2 || "Tienda 2 (C.C. Sambil)",
        nombreOficina: liveData.empresaConfig.nombreOficina || "Oficina Central / Almacén",
      };
    }

    if (liveData.sucursales && liveData.sucursales.length > 0) {
      exportPayload.sucursales = liveData.sucursales.map(s => ({
        id: s.id,
        nombre: s.nombre,
        tipo: s.tipo || (s.id === 3 ? 'oficina' : 'tienda')
      }));
    } else {
      exportPayload.sucursales = [
        { id: 1, nombre: liveData.empresaConfig?.nombreTienda1 || "Tienda 1 (Av. Principal)", tipo: "tienda" },
        { id: 2, nombre: liveData.empresaConfig?.nombreTienda2 || "Tienda 2 (C.C. Sambil)", tipo: "tienda" },
        { id: 3, nombre: liveData.empresaConfig?.nombreOficina || "Oficina Central / Almacén", tipo: "oficina" }
      ];
    }

    if (liveData.usuarios && liveData.usuarios.length > 0) {
      exportPayload.usuarios = liveData.usuarios.map(u => ({
        id: u.id,
        username: u.username || `user_${u.id}`,
        nombre_completo: u.nombre_completo,
        cargo: u.cargo || (u.rol === 'admin' ? 'Gerente General' : 'Cajero / Operador'),
        rol: u.rol,
        pin: u.pin,
        sucursal_id: u.sucursal_id,
        permisos: u.permisos || {
          dashboard: u.rol === 'admin',
          ventas: true,
          inventario: u.rol === 'admin' || u.rol === 'inventario',
          compras: u.rol === 'admin' || u.rol === 'inventario',
          clientes: u.rol === 'admin',
          proveedores: u.rol === 'admin' || u.rol === 'inventario',
          cxc: u.rol === 'admin',
          cxp: u.rol === 'admin',
          reportes: u.rol === 'admin' || u.rol === 'supervisor',
          configuracion: u.rol === 'admin',
        }
      }));

      // Set current active user
      if (liveData.currentUser) {
        const found = exportPayload.usuarios.find((u: any) => u.id === liveData.currentUser?.id);
        exportPayload.currentUser = found || exportPayload.usuarios[0];
      } else {
        exportPayload.currentUser = exportPayload.usuarios[0];
      }
    }

    if (liveData.productos && liveData.productos.length > 0) {
      exportPayload.productos = liveData.productos.map(p => ({
        id: p.id,
        codigo_barras: p.codigo_barras,
        nombre: p.nombre,
        precio: p.precio,
        costo: p.costo || +(p.precio * 0.7).toFixed(2),
        exento_iva: !!p.exento_iva,
        categoria: p.categoria || 'Víveres & Granos',
        unidad_medida: p.unidad_medida || 'UND',
        imagen: p.imagen || '',
        descripcion: p.descripcion || '',
        destacadoTienda: p.destacadoTienda !== undefined ? p.destacadoTienda : true,
      }));
    }

    if (liveData.inventario && liveData.inventario.length > 0) {
      exportPayload.inventario = liveData.inventario.map(i => ({
        sucursal_id: i.sucursal_id,
        producto_id: i.producto_id,
        stock: i.stock
      }));
    }

    if (liveData.ventas) {
      exportPayload.ventas = liveData.ventas;
    }

    if (liveData.compras) {
      exportPayload.compras = liveData.compras.map(c => ({
        id: c.id,
        proveedorNombre: c.proveedorNombre || 'Proveedor General',
        numeroFactura: c.numeroFactura || `FAC-${c.id}`,
        sucursalId: c.sucursalId || 1,
        fecha: c.fecha || new Date().toISOString().split('T')[0],
        total: c.total || 0,
        exento_iva: (c.montoExento && c.montoExento > 0) || false
      }));
    }

    if (liveData.clientes) {
      exportPayload.clientes = liveData.clientes.map(c => ({
        id: c.id,
        nombre: c.nombre,
        rif: c.rif_cedula || 'V-00000000',
        telefono: c.telefono || 'N/A',
        email: c.email || '',
        limiteCredito: c.limiteCredito || 0,
        saldoPendiente: c.saldoPendiente || 0
      }));
    }

    if (liveData.proveedores) {
      exportPayload.proveedores = liveData.proveedores.map(p => ({
        id: p.id,
        nombre: p.nombre || 'Proveedor General',
        rif: p.rif || 'J-00000000-0',
        contacto: p.contacto || '',
        telefono: p.telefono || '',
        email: p.email || '',
        direccion: p.direccion || '',
        saldoPendiente: p.saldoPendiente || 0
      }));
    }

    if (liveData.cxc) {
      exportPayload.cxc = liveData.cxc.map(item => ({
        id: item.id,
        factura: item.concepto || (item.ventaId ? `FAC-${item.ventaId}` : `DOC-${item.id}`),
        clienteNombre: item.clienteNombre,
        fecha: item.fechaEmision,
        montoTotal: item.montoTotal,
        saldoRestante: item.saldoRestante,
        estado: item.estado
      }));
    }

    if (liveData.cxp) {
      exportPayload.cxp = liveData.cxp.map(item => ({
        id: item.id,
        factura: item.numeroFactura || `FAC-${item.id}`,
        proveedorNombre: item.proveedorNombre,
        fecha: item.fechaEmision,
        montoTotal: item.montoTotal,
        saldoRestante: item.saldoRestante,
        estado: item.estado
      }));
    }

    exportPayload.auditoria = (liveData.auditoria && liveData.auditoria.length > 0) ? liveData.auditoria : [];

    const serializedData = JSON.stringify(exportPayload, null, 6);

    // Replace INITIAL_DATA in the HTML code with precise boundary markers
    const markerPattern = /\/\* __INITIAL_DATA_START__ \*\/[\s\S]*?\/\* __INITIAL_DATA_END__ \*\//;
    if (markerPattern.test(html)) {
      html = html.replace(markerPattern, `/* __INITIAL_DATA_START__ */\n    const INITIAL_DATA = ${serializedData};\n    /* __INITIAL_DATA_END__ */`);
    } else {
      // Fallback regex if markers not found
      const fallbackPattern = /const INITIAL_DATA = \{[\s\S]*?\n\s*\};\s*\n\s*\/\/\s*Load State/;
      if (fallbackPattern.test(html)) {
        html = html.replace(fallbackPattern, `const INITIAL_DATA = ${serializedData};\n\n    // Load State`);
      }
    }

    // Update dynamic storage key to guarantee freshly exported state in browser
    html = html.replace(
      /const DB_KEY = '[^']+';/,
      `const DB_KEY = 'pos_multisucursal_db_${Date.now()}';`
    );

    return html;
  } catch (err) {
    console.error('Error generating live standalone HTML:', err);
    return STANDALONE_HTML_SOURCE;
  }
}

/**
 * Direct file download trigger for the generated HTML file
 */
export function downloadStandaloneHtmlFile(
  liveData?: AppExportData,
  filename = 'pos_multisucursal.html'
) {
  try {
    const finalHtml = generateLiveStandaloneHtml(liveData);
    const blob = new Blob([finalHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (e) {
    console.error('Error al descargar archivo HTML:', e);
  }
}
