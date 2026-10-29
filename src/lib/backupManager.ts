import {
  BackupDatabasePayload,
  EmpresaConfig,
  Sucursal,
  Usuario,
  Producto,
  InventarioItem,
  Venta,
  Compra,
  Cliente,
  Proveedor,
  CuentaPorCobrar,
  CuentaPorPagar,
  RegistroAuditoria,
  PedidoOnline,
  TiendaConfig,
} from '../types';

export interface CreateBackupParams {
  empresaConfig: EmpresaConfig;
  sucursales: Sucursal[];
  usuarios: Usuario[];
  productos: Producto[];
  inventario: InventarioItem[];
  ventas: Venta[];
  compras: Compra[];
  clientes: Cliente[];
  proveedores: Proveedor[];
  cxcList: CuentaPorCobrar[];
  cxpList: CuentaPorPagar[];
  auditoriaLogs?: RegistroAuditoria[];
  pedidosOnline?: PedidoOnline[];
  tiendaConfig?: TiendaConfig;
  correlativoX?: number;
  correlativoZ?: number;
  currentUser?: Usuario | null;
}

/**
 * Genera el objeto de respaldo completo con metadatos y sumarios
 */
export function createBackupPayload(params: CreateBackupParams): BackupDatabasePayload {
  const now = new Date();
  const fechaLegible = now.toLocaleString('es-VE', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  return {
    version: '2.0.0',
    app: 'POS Multi-Sucursal Venezuela',
    timestamp: now.toISOString(),
    fechaLegible,
    generadoPor: params.currentUser ? `${params.currentUser.nombre_completo} (@${params.currentUser.username})` : 'Administrador',
    empresa: {
      nombre: params.empresaConfig.nombreEmpresa || 'Mi Empresa',
      rif: params.empresaConfig.rif || 'S/R',
    },
    resumen: {
      totalProductos: params.productos?.length || 0,
      totalVentas: params.ventas?.length || 0,
      totalCompras: params.compras?.length || 0,
      totalClientes: params.clientes?.length || 0,
      totalProveedores: params.proveedores?.length || 0,
      totalUsuarios: params.usuarios?.length || 0,
      totalPedidosOnline: params.pedidosOnline?.length || 0,
    },
    datos: {
      empresaConfig: params.empresaConfig,
      sucursales: params.sucursales || [],
      usuarios: params.usuarios || [],
      productos: params.productos || [],
      inventario: params.inventario || [],
      ventas: params.ventas || [],
      compras: params.compras || [],
      clientes: params.clientes || [],
      proveedores: params.proveedores || [],
      cxc: params.cxcList || [],
      cxp: params.cxpList || [],
      auditoria: params.auditoriaLogs || [],
      pedidosOnline: params.pedidosOnline || [],
      tiendaConfig: params.tiendaConfig,
      correlativoX: params.correlativoX ?? 0,
      correlativoZ: params.correlativoZ ?? 0,
    },
  };
}

/**
 * Descarga el respaldo en un archivo .json estructurado y legible
 */
export function downloadBackupJsonFile(payload: BackupDatabasePayload, customFilename?: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const safeEmpresa = (payload.empresa.nombre || 'pos')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .substring(0, 20);

  const defaultFilename = `respaldo_pos_${safeEmpresa}_${year}${month}${day}_${hours}${minutes}.json`;
  const filename = customFilename || defaultFilename;

  const jsonString = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return filename;
}

export interface ValidationBackupResult {
  isValid: boolean;
  error?: string;
  payload?: BackupDatabasePayload;
  resumen?: {
    empresa: string;
    rif: string;
    fecha: string;
    version: string;
    generadoPor?: string;
    totalProductos: number;
    totalVentas: number;
    totalCompras: number;
    totalClientes: number;
    totalProveedores: number;
    totalUsuarios: number;
    totalInventario: number;
    totalPedidosOnline: number;
  };
}

/**
 * Valida e interpreta un archivo JSON para restauración
 */
export function validateAndParseBackupJson(rawJson: string): ValidationBackupResult {
  if (!rawJson || !rawJson.trim()) {
    return { isValid: false, error: 'El archivo está completamente vacío.' };
  }

  let parsed: any;
  try {
    parsed = JSON.parse(rawJson);
  } catch (err: any) {
    return {
      isValid: false,
      error: `El archivo no contiene un formato JSON válido: ${err?.message || 'Error de sintaxis'}.`,
    };
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return { isValid: false, error: 'La estructura raíz del archivo JSON debe ser un objeto.' };
  }

  // Detectar formato estándar o plano
  let normalizedData: BackupDatabasePayload['datos'];
  let empresaName = '';
  let rif = '';
  let version = parsed.version || '1.0.0';
  let fecha = parsed.fechaLegible || parsed.timestamp || new Date().toLocaleString('es-VE');
  let generadoPor = parsed.generadoPor || 'Respaldo Externo';

  if (parsed.datos && typeof parsed.datos === 'object') {
    // Formato estándar con envoltorio
    normalizedData = parsed.datos;
    empresaName = parsed.empresa?.nombre || parsed.datos.empresaConfig?.nombreEmpresa || 'Empresa';
    rif = parsed.empresa?.rif || parsed.datos.empresaConfig?.rif || 'S/R';
  } else if (parsed.productos || parsed.ventas || parsed.empresaConfig) {
    // Formato plano
    normalizedData = {
      empresaConfig: parsed.empresaConfig || {},
      sucursales: parsed.sucursales || [],
      usuarios: parsed.usuarios || [],
      productos: parsed.productos || [],
      inventario: parsed.inventario || [],
      ventas: parsed.ventas || [],
      compras: parsed.compras || [],
      clientes: parsed.clientes || [],
      proveedores: parsed.proveedores || [],
      cxc: parsed.cxc || parsed.cxcList || [],
      cxp: parsed.cxp || parsed.cxpList || [],
      auditoria: parsed.auditoria || parsed.auditoriaLogs || [],
      pedidosOnline: parsed.pedidosOnline || [],
      tiendaConfig: parsed.tiendaConfig,
      correlativoX: parsed.correlativoX ?? 0,
      correlativoZ: parsed.correlativoZ ?? 0,
    };
    empresaName = parsed.empresaConfig?.nombreEmpresa || 'Empresa';
    rif = parsed.empresaConfig?.rif || 'S/R';
  } else {
    return {
      isValid: false,
      error: 'El archivo no contiene datos compatibles de la base de datos (faltan tablas de productos, ventas o configuración).',
    };
  }

  // Validaciones mínimas de integridad
  if (!Array.isArray(normalizedData.productos) && !Array.isArray(normalizedData.ventas)) {
    return {
      isValid: false,
      error: 'El archivo no contiene listados de productos ni ventas reconocibles.',
    };
  }

  const payload: BackupDatabasePayload = {
    version,
    app: parsed.app || 'POS Multi-Sucursal Venezuela',
    timestamp: parsed.timestamp || new Date().toISOString(),
    fechaLegible: fecha,
    generadoPor,
    empresa: {
      nombre: empresaName,
      rif,
    },
    resumen: {
      totalProductos: Array.isArray(normalizedData.productos) ? normalizedData.productos.length : 0,
      totalVentas: Array.isArray(normalizedData.ventas) ? normalizedData.ventas.length : 0,
      totalCompras: Array.isArray(normalizedData.compras) ? normalizedData.compras.length : 0,
      totalClientes: Array.isArray(normalizedData.clientes) ? normalizedData.clientes.length : 0,
      totalProveedores: Array.isArray(normalizedData.proveedores) ? normalizedData.proveedores.length : 0,
      totalUsuarios: Array.isArray(normalizedData.usuarios) ? normalizedData.usuarios.length : 0,
      totalPedidosOnline: Array.isArray(normalizedData.pedidosOnline) ? normalizedData.pedidosOnline.length : 0,
    },
    datos: normalizedData,
  };

  return {
    isValid: true,
    payload,
    resumen: {
      empresa: empresaName,
      rif,
      fecha,
      version,
      generadoPor,
      totalProductos: payload.resumen.totalProductos,
      totalVentas: payload.resumen.totalVentas,
      totalCompras: payload.resumen.totalCompras,
      totalClientes: payload.resumen.totalClientes,
      totalProveedores: payload.resumen.totalProveedores,
      totalUsuarios: payload.resumen.totalUsuarios,
      totalInventario: Array.isArray(normalizedData.inventario) ? normalizedData.inventario.length : 0,
      totalPedidosOnline: payload.resumen.totalPedidosOnline,
    },
  };
}
