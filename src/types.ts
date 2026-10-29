export interface Sucursal {
  id: number;
  nombre: string;
  tipo: 'tienda' | 'oficina';
}

export interface Producto {
  id: number;
  codigo_barras: string;
  nombre: string;
  precio: number;
  costo?: number;
  unidad_medida?: 'UND' | 'KG' | 'L' | 'PQ' | string; // Presentación: Unidad/Pieza, Kilogramo, Litro, Paquete
  exento_iva?: boolean; // true = Exento de IVA (0%), false/undefined = Gravado con IVA (16%)
  categoria?: string;
  descripcion?: string;
  imagen?: string;
  destacadoTienda?: boolean;
}

export interface InventarioItem {
  id: number;
  sucursal_id: number;
  producto_id: number;
  stock: number;
}

export interface ModuloPermisos {
  dashboard: boolean;
  ventas: boolean;
  inventario: boolean;
  compras: boolean;
  clientes: boolean;
  proveedores: boolean;
  cxc: boolean;
  cxp: boolean;
  reportes: boolean;
  configuracion: boolean;
  pedidos_web?: boolean;
}

export interface Usuario {
  id: number;
  username: string;
  nombre_completo: string;
  pin: string;
  rol: 'cajero' | 'supervisor' | 'inventario' | 'admin';
  sucursal_id: number | null; // null = acceso a todas las sucursales (admin)
  cargo: string;
  permisos?: ModuloPermisos;
}

export interface DetallePagoVenta {
  metodo: 'pago_movil' | 'efectivo_usd' | 'efectivo_bs' | 'tarjeta' | 'mixto';
  referencia_pago_movil?: string;
  monto_usd: number;
  monto_bs: number;
  efectivo_usd_recibido?: number;
  efectivo_bs_recibido?: number;
  pago_movil_monto_bs?: number;
  tarjeta_tipo?: 'debito' | 'credito' | 'internacional';
  tarjeta_banco?: string;
  tarjeta_referencia?: string;
  tarjeta_lote?: string;
  tarjeta_monto_bs?: number;
  tarjeta_monto_usd?: number;
  vuelto_usd?: number;
  vuelto_bs?: number;
}

export interface Venta {
  id: number;
  sucursal_id: number;
  usuario_id?: number;
  usuario_nombre?: string;
  cliente_id?: number | null;
  cliente_nombre?: string;
  cliente_rif?: string;
  fecha: string;
  subtotal_neto?: number;
  base_imponible?: number;
  monto_exento?: number;
  monto_iva?: number;
  total: number;
  metodo_pago?: string;
  referencia_pago?: string;
  pago_detalle?: DetallePagoVenta;
  detalles: DetalleVenta[];
}

export interface DetalleVenta {
  id: number;
  venta_id: number;
  producto_id: number;
  producto_nombre: string;
  codigo_barras?: string;
  unidad_medida?: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  exento_iva?: boolean;
  monto_iva?: number;
}

export interface Cliente {
  id: number;
  nombre: string;
  rif_cedula: string;
  telefono: string;
  email?: string;
  direccion?: string;
  limiteCredito: number; // en USD
  saldoPendiente: number; // en USD
  fechaRegistro: string;
}

export interface Proveedor {
  id: number;
  nombre: string;
  rif: string;
  contacto: string;
  telefono: string;
  email?: string;
  direccion?: string;
  saldoPendiente: number; // en USD
}

export interface DetalleCompra {
  productoId: number;
  productoNombre: string;
  codigo_barras?: string;
  unidad_medida?: 'UND' | 'KG' | 'L' | 'PQ' | string;
  cantidad: number; // admite fracciones / decimales
  costoUnitario: number;
  precioVenta?: number; // PVP venta al público
  subtotal: number;
  exentoIva?: boolean;
  montoIva?: number;
}

export interface Compra {
  id: number;
  proveedorId: number;
  proveedorNombre: string;
  sucursalId: number;
  numeroFactura?: string;
  numeroControl?: string;
  fecha: string;
  fechaVencimiento?: string;
  condicionPago?: 'credito' | 'contado';
  subtotalNeto?: number;
  baseImponible?: number;
  montoExento?: number;
  montoIva?: number;
  total: number;
  estado: 'completada' | 'pendiente';
  usuarioNombre?: string;
  detalles: DetalleCompra[];
}

export interface AbonoCxC {
  id: number;
  fecha: string;
  monto: number; // USD
  metodoPago: string;
  referencia?: string;
  usuarioNombre: string;
}

export interface CuentaPorCobrar {
  id: number;
  clienteId: number;
  clienteNombre: string;
  ventaId?: number;
  concepto: string;
  fechaEmision: string;
  fechaVencimiento: string;
  montoTotal: number; // USD
  saldoRestante: number; // USD
  estado: 'pendiente' | 'parcial' | 'pagada';
  abonos: AbonoCxC[];
}

export interface PagoCxP {
  id: number;
  fecha: string;
  monto: number; // USD
  metodoPago: string;
  referencia?: string;
  usuarioNombre: string;
}

export interface CuentaPorPagar {
  id: number;
  proveedorId: number;
  proveedorNombre: string;
  compraId?: number;
  numeroFactura: string;
  fechaEmision: string;
  fechaVencimiento: string;
  montoTotal: number; // USD
  saldoRestante: number; // USD
  estado: 'pendiente' | 'parcial' | 'pagada';
  pagos: PagoCxP[];
}

export interface EmpresaConfig {
  nombreEmpresa: string;
  rif: string;
  direccionFiscal: string;
  telefono: string;
  logoUrl?: string;
  tasaCambio: number; // Bolívares por USD (ej. 36.50)
  fechaTasa: string;
  ultimaActualizacionTasa?: string;
  nombreTienda1: string;
  nombreTienda2: string;
  nombreOficina: string;
}

export interface RegistroAuditoria {
  id: string;
  fecha: string; // YYYY-MM-DD o DD/MM/YYYY
  hora: string; // HH:mm:ss AM/PM
  timestamp: string; // ISO String for ordering
  usuario_id?: number;
  usuario_nombre: string;
  usuario_username?: string;
  usuario_rol: string;
  usuario_cargo?: string;
  sucursal_id?: number | null;
  sucursal_nombre?: string;
  modulo:
    | 'POS / Ventas'
    | 'Inventario'
    | 'Compras'
    | 'Clientes'
    | 'Proveedores'
    | 'CxC'
    | 'CxP'
    | 'Reportes / Fiscal'
    | 'Configuración'
    | 'Seguridad'
    | 'Tasa de Cambio'
    | 'Usuarios'
    | 'Auditoría';
  tipo_accion:
    | 'CREAR'
    | 'MODIFICAR'
    | 'ELIMINAR'
    | 'VENTA'
    | 'COMPRA'
    | 'TRASPASO'
    | 'COBRO'
    | 'PAGO'
    | 'CORTE_FISCAL'
    | 'ACCESO'
    | 'SISTEMA'
    | 'LOGIN'
    | 'LOGOUT'
    | 'RESET'
    | 'LIMPIAR'
    | 'ABONO'
    | 'CORTE_X'
    | 'CORTE_Z';
  descripcion: string;
  detalles?: string;
}

export interface DetallePedidoOnline {
  productoId: number;
  productoNombre: string;
  codigo_barras?: string;
  unidad_medida?: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  exentoIva?: boolean;
}

export interface PedidoOnline {
  id: string; // ej. "PED-1001"
  numeroPedido: string;
  fecha: string;
  clienteNombre: string;
  clienteRif: string;
  clienteTelefono: string;
  clienteEmail?: string;
  tipoEntrega: 'pickup' | 'delivery';
  sucursalId?: number; // Para pickup o asignación de despacho
  sucursalNombre?: string;
  direccionEntrega?: string;
  puntoReferencia?: string;
  costoDelivery: number; // en USD
  detalles: DetallePedidoOnline[];
  subtotalNeto: number; // USD
  baseImponible: number; // USD
  montoExento: number; // USD
  montoIva: number; // USD
  total: number; // USD
  totalBs: number; // Bs al cambio
  tasaCambio: number;
  metodoPago: 'pago_movil' | 'zelle' | 'efectivo_usd' | 'efectivo_bs' | 'punto';
  referenciaPago?: string;
  bancoOrigen?: string;
  notas?: string;
  estado: 'pendiente' | 'confirmado' | 'preparando' | 'despachado' | 'entregado' | 'cancelado';
  ventaIdGenerada?: number;
  creadoEn: string;
}

export interface TiendaConfig {
  habilitada: boolean;
  nombreTienda: string;
  whatsappContacto: string; // ej. "+58 412 1234567"
  mensajeBienvenida: string;
  costoDeliveryFijo: number; // USD
  deliveryGratisMinimo: number; // USD (0 si no aplica)
  permitePickup: boolean;
  permiteDelivery: boolean;
  bannerPromo?: string;
  pagoMovilBanco: string;
  pagoMovilTelefono: string;
  pagoMovilRif: string;
  zelleTitular: string;
  zelleCorreo: string;
  horarioAtencion?: string;
}

export interface BackupDatabasePayload {
  version: string;
  app: string;
  timestamp: string;
  fechaLegible: string;
  generadoPor?: string;
  empresa: {
    nombre: string;
    rif: string;
  };
  resumen: {
    totalProductos: number;
    totalVentas: number;
    totalCompras: number;
    totalClientes: number;
    totalProveedores: number;
    totalUsuarios: number;
    totalPedidosOnline: number;
  };
  datos: {
    empresaConfig: EmpresaConfig;
    sucursales: Sucursal[];
    usuarios: Usuario[];
    productos: Producto[];
    inventario: InventarioItem[];
    ventas: Venta[];
    compras: Compra[];
    clientes: Cliente[];
    proveedores: Proveedor[];
    cxc: CuentaPorCobrar[];
    cxp: CuentaPorPagar[];
    auditoria?: RegistroAuditoria[];
    pedidosOnline?: PedidoOnline[];
    tiendaConfig?: TiendaConfig;
    correlativoX?: number;
    correlativoZ?: number;
  };
}

