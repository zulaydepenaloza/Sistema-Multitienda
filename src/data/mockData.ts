import {
  Sucursal,
  Producto,
  InventarioItem,
  Venta,
  Usuario,
  Cliente,
  Proveedor,
  Compra,
  CuentaPorCobrar,
  CuentaPorPagar,
  ModuloPermisos,
  PedidoOnline,
  TiendaConfig,
} from '../types';

export const INITIAL_SUCURSALES: Sucursal[] = [
  { id: 1, nombre: 'Tienda A - Sector A', tipo: 'tienda' },
  { id: 2, nombre: 'Tienda A - Sector B', tipo: 'tienda' },
  { id: 3, nombre: 'Oficina Central & Almacén', tipo: 'oficina' },
];

export const DEFAULT_CASHIER_PERMISSIONS: ModuloPermisos = {
  dashboard: false,
  ventas: true,
  inventario: false,
  compras: false,
  clientes: false,
  proveedores: false,
  cxc: false,
  cxp: false,
  reportes: false,
  configuracion: false,
};

export const DEFAULT_ADMIN_PERMISSIONS: ModuloPermisos = {
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
};

export const INITIAL_USUARIOS: Usuario[] = [
  // 4 Usuarios para Tienda 1 (Centro)
  { id: 1, username: 'cajero1_t1', nombre_completo: 'Ana Morales', pin: '1001', rol: 'cajero', sucursal_id: 1, cargo: 'Cajera Principal', permisos: { ...DEFAULT_CASHIER_PERMISSIONS } },
  { id: 2, username: 'cajero2_t1', nombre_completo: 'Carlos Pérez', pin: '1002', rol: 'cajero', sucursal_id: 1, cargo: 'Cajero Turno Tarde', permisos: { ...DEFAULT_CASHIER_PERMISSIONS } },
  { id: 3, username: 'cajero3_t1', nombre_completo: 'Diana Castro', pin: '1003', rol: 'cajero', sucursal_id: 1, cargo: 'Cajera Fines de Semana', permisos: { ...DEFAULT_CASHIER_PERMISSIONS } },
  { id: 4, username: 'supervisor_t1', nombre_completo: 'Elena Rivas', pin: '1004', rol: 'supervisor', sucursal_id: 1, cargo: 'Supervisora Tienda 1', permisos: { ...DEFAULT_CASHIER_PERMISSIONS, reportes: true } },

  // 4 Usuarios para Tienda 2 (Norte)
  { id: 5, username: 'cajero1_t2', nombre_completo: 'Fernando Soto', pin: '2001', rol: 'cajero', sucursal_id: 2, cargo: 'Cajero Principal', permisos: { ...DEFAULT_CASHIER_PERMISSIONS } },
  { id: 6, username: 'cajero2_t2', nombre_completo: 'Gabriela Ruiz', pin: '2002', rol: 'cajero', sucursal_id: 2, cargo: 'Cajera Turno Tarde', permisos: { ...DEFAULT_CASHIER_PERMISSIONS } },
  { id: 7, username: 'cajero3_t2', nombre_completo: 'Hugo Mendoza', pin: '2003', rol: 'cajero', sucursal_id: 2, cargo: 'Cajero Fines de Semana', permisos: { ...DEFAULT_CASHIER_PERMISSIONS } },
  { id: 8, username: 'supervisor_t2', nombre_completo: 'Isabel Vargas', pin: '2004', rol: 'supervisor', sucursal_id: 2, cargo: 'Supervisora Tienda 2', permisos: { ...DEFAULT_CASHIER_PERMISSIONS, reportes: true } },

  // 4 Usuarios para Área de Inventario y Oficina Central
  { id: 9, username: 'inv_jefe', nombre_completo: 'Jorge Martínez', pin: '3001', rol: 'inventario', sucursal_id: 3, cargo: 'Jefe de Almacén e Inventarios', permisos: { ...DEFAULT_CASHIER_PERMISSIONS, inventario: true, compras: true, proveedores: true } },
  { id: 10, username: 'inv_operador1', nombre_completo: 'Karla Benítez', pin: '3002', rol: 'inventario', sucursal_id: 3, cargo: 'Auditora de Existencias', permisos: { ...DEFAULT_CASHIER_PERMISSIONS, inventario: true, compras: true } },
  { id: 11, username: 'inv_operador2', nombre_completo: 'Luis Navarro', pin: '3003', rol: 'inventario', sucursal_id: 3, cargo: 'Encargado de Traspasos y Recepción', permisos: { ...DEFAULT_CASHIER_PERMISSIONS, inventario: true, compras: true } },
  { id: 12, username: 'admin_general', nombre_completo: 'Administrador General', pin: '9999', rol: 'admin', sucursal_id: null, cargo: 'Gerente General / Admin Sistema', permisos: { ...DEFAULT_ADMIN_PERMISSIONS } },
];

export const INITIAL_CLIENTES: Cliente[] = [
  { id: 1, nombre: 'Distribuidora Los Andes C.A.', rif_cedula: 'J-30492817-4', telefono: '+58 414-2345678', email: 'compras@losandes.com', direccion: 'Av. Libertador, Edif. Los Andes, Caracas', limiteCredito: 500, saldoPendiente: 120.50, fechaRegistro: '2026-01-15' },
  { id: 2, nombre: 'Panadería y Pastelería La Espiga', rif_cedula: 'J-40918273-1', telefono: '+58 424-9876543', email: 'laespiga@gmail.com', direccion: 'Calle Real de Sabana Grande, Local 12', limiteCredito: 300, saldoPendiente: 75.00, fechaRegistro: '2026-02-10' },
  { id: 3, nombre: 'Minimarket San Antonio', rif_cedula: 'J-50123984-7', telefono: '+58 412-5551122', email: 'sanantoniomarket@hotmail.com', direccion: 'Urb. San Antonio, Manzana 4, Los Teques', limiteCredito: 800, saldoPendiente: 0.00, fechaRegistro: '2026-03-01' },
  { id: 4, nombre: 'Restaurante Sabor Criollo C.A.', rif_cedula: 'J-29837461-9', telefono: '+58 416-3344556', email: 'administracion@saborcriollo.ve', direccion: 'Centro Comercial Tolón, Nivel Feria', limiteCredito: 600, saldoPendiente: 240.00, fechaRegistro: '2026-03-20' },
  { id: 5, nombre: 'María Elena Zambrano', rif_cedula: 'V-18492019', telefono: '+58 414-1112233', email: 'maria.zambrano@gmail.com', direccion: 'Residencias El Ávila, Apto 4-B, Chacao', limiteCredito: 100, saldoPendiente: 25.00, fechaRegistro: '2026-04-05' },
];

export const INITIAL_PROVEEDORES: Proveedor[] = [
  { id: 1, nombre: 'Alimentos Polar Comercial C.A.', rif: 'J-00041372-9', contacto: 'Marcos Delgado', telefono: '+58 212-2023111', email: 'pedidos@polar.com', direccion: 'Los Cortijos de Lourdes, Caracas', saldoPendiente: 850.00 },
  { id: 2, nombre: 'Cargill de Venezuela S.R.L.', rif: 'J-00054321-0', contacto: 'Beatriz Salazar', telefono: '+58 212-9051000', email: 'ventas.ve@cargill.com', direccion: 'Av. Francisco de Miranda, Edif Cavendes', saldoPendiente: 420.00 },
  { id: 3, nombre: 'Monaca (Molinos Nacionales C.A.)', rif: 'J-00012983-5', contacto: 'Ricardo Gómez', telefono: '+58 212-9993300', email: 'atencion@monaca.com.ve', direccion: 'Zona Industrial La Yaguara', saldoPendiente: 0.00 },
  { id: 4, nombre: 'Detergentes y Químicos del Caribe', rif: 'J-31982746-8', contacto: 'Claudia Méndez', telefono: '+58 241-8765432', email: 'distribucion@quimicoscaribe.com', direccion: 'Valencia, Edo. Carabobo', saldoPendiente: 310.00 },
];

export const INITIAL_COMPRAS: Compra[] = [
  {
    id: 1,
    proveedorId: 1,
    proveedorNombre: 'Alimentos Polar Comercial C.A.',
    sucursalId: 3,
    numeroFactura: 'FAC-POL-88392',
    fecha: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    total: 850.00,
    estado: 'completada',
    usuarioNombre: 'Jorge Martínez',
    detalles: [
      { productoId: 1, productoNombre: 'Arroz Integral 1kg', cantidad: 200, costoUnitario: 1.80, subtotal: 360.00 },
      { productoId: 4, productoNombre: 'Café Molido Premium 500g', cantidad: 100, costoUnitario: 4.90, subtotal: 490.00 },
    ]
  },
  {
    id: 2,
    proveedorId: 2,
    proveedorNombre: 'Cargill de Venezuela S.R.L.',
    sucursalId: 3,
    numeroFactura: 'FAC-CRG-10294',
    fecha: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    total: 420.00,
    estado: 'completada',
    usuarioNombre: 'Luis Navarro',
    detalles: [
      { productoId: 2, productoNombre: 'Aceite Vegetal 1L', cantidad: 120, costoUnitario: 3.50, subtotal: 420.00 },
    ]
  },
];

export const INITIAL_CXC: CuentaPorCobrar[] = [
  {
    id: 1,
    clienteId: 1,
    clienteNombre: 'Distribuidora Los Andes C.A.',
    ventaId: 101,
    concepto: 'Factura a Crédito #VTA-00101 - Mercancía Variada',
    fechaEmision: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
    fechaVencimiento: new Date(Date.now() + 3600000 * 24 * 5).toISOString(),
    montoTotal: 220.50,
    saldoRestante: 120.50,
    estado: 'parcial',
    abonos: [
      { id: 1, fecha: new Date(Date.now() - 3600000 * 24 * 4).toISOString(), monto: 100.00, metodoPago: 'Pago Móvil / Transferencia', referencia: 'PM-883920', usuarioNombre: 'Ana Morales' }
    ]
  },
  {
    id: 2,
    clienteId: 2,
    clienteNombre: 'Panadería y Pastelería La Espiga',
    ventaId: 102,
    concepto: 'Factura #VTA-00102 - 50x Harina de Trigo',
    fechaEmision: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
    fechaVencimiento: new Date(Date.now() + 3600000 * 24 * 11).toISOString(),
    montoTotal: 75.00,
    saldoRestante: 75.00,
    estado: 'pendiente',
    abonos: []
  },
  {
    id: 3,
    clienteId: 4,
    clienteNombre: 'Restaurante Sabor Criollo C.A.',
    ventaId: 103,
    concepto: 'Factura #VTA-00103 - Insumos Cocina',
    fechaEmision: new Date(Date.now() - 3600000 * 24 * 12).toISOString(),
    fechaVencimiento: new Date(Date.now() - 3600000 * 24 * 2).toISOString(), // Vencida
    montoTotal: 240.00,
    saldoRestante: 240.00,
    estado: 'pendiente',
    abonos: []
  },
  {
    id: 4,
    clienteId: 5,
    clienteNombre: 'María Elena Zambrano',
    ventaId: 104,
    concepto: 'Ticket #TK-9920 - Compra Víveres Quincena',
    fechaEmision: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    fechaVencimiento: new Date(Date.now() + 3600000 * 24 * 13).toISOString(),
    montoTotal: 25.00,
    saldoRestante: 25.00,
    estado: 'pendiente',
    abonos: []
  }
];

export const INITIAL_CXP: CuentaPorPagar[] = [
  {
    id: 1,
    proveedorId: 1,
    proveedorNombre: 'Alimentos Polar Comercial C.A.',
    compraId: 1,
    numeroFactura: 'FAC-POL-88392',
    fechaEmision: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    fechaVencimiento: new Date(Date.now() + 3600000 * 24 * 12).toISOString(),
    montoTotal: 850.00,
    saldoRestante: 850.00,
    estado: 'pendiente',
    pagos: []
  },
  {
    id: 2,
    proveedorId: 2,
    proveedorNombre: 'Cargill de Venezuela S.R.L.',
    compraId: 2,
    numeroFactura: 'FAC-CRG-10294',
    fechaEmision: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    fechaVencimiento: new Date(Date.now() + 3600000 * 24 * 8).toISOString(),
    montoTotal: 420.00,
    saldoRestante: 420.00,
    estado: 'pendiente',
    pagos: []
  },
  {
    id: 3,
    proveedorId: 4,
    proveedorNombre: 'Detergentes y Químicos del Caribe',
    numeroFactura: 'FAC-DQC-00481',
    fechaEmision: new Date(Date.now() - 3600000 * 24 * 15).toISOString(),
    fechaVencimiento: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
    montoTotal: 500.00,
    saldoRestante: 310.00,
    estado: 'parcial',
    pagos: [
      { id: 1, fecha: new Date(Date.now() - 3600000 * 24 * 5).toISOString(), monto: 190.00, metodoPago: 'Transferencia Bancaria', referencia: 'TRF-902194', usuarioNombre: 'Administrador General' }
    ]
  }
];


export const INITIAL_PRODUCTOS: Producto[] = [
  {
    id: 1,
    codigo_barras: '123456',
    nombre: 'Arroz Integral 1kg',
    precio: 2.50,
    costo: 1.80,
    unidad_medida: 'KG',
    exento_iva: true,
    categoria: 'Víveres & Granos',
    descripcion: 'Arroz integral seleccionado de grano entero, alto en fibra y nutrientes.',
    imagen: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    destacadoTienda: true,
  },
  {
    id: 2,
    codigo_barras: '789012',
    nombre: 'Aceite Vegetal 1L',
    precio: 4.80,
    costo: 3.50,
    unidad_medida: 'L',
    exento_iva: false,
    categoria: 'Aceites & Condimentos',
    descripcion: 'Aceite vegetal refinado multiuso, ideal para freír y cocinar a altas temperaturas.',
    imagen: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    destacadoTienda: true,
  },
  {
    id: 3,
    codigo_barras: '345678',
    nombre: 'Harina de Trigo 1kg',
    precio: 1.75,
    costo: 1.20,
    unidad_medida: 'KG',
    exento_iva: true,
    categoria: 'Harinas & Panadería',
    descripcion: 'Harina de trigo enriquecida para repostería, masas y preparaciones caseras.',
    imagen: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    destacadoTienda: true,
  },
  {
    id: 4,
    codigo_barras: '901234',
    nombre: 'Café Molido Premium 500g',
    precio: 6.20,
    costo: 4.50,
    unidad_medida: 'UND',
    exento_iva: false,
    categoria: 'Bebidas & Desayuno',
    descripcion: 'Café 100% arábica tostado y molido gourmet con notas achocolatadas.',
    imagen: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80',
    destacadoTienda: true,
  },
  {
    id: 5,
    codigo_barras: '567890',
    nombre: 'Detergente Líquido 2L',
    precio: 5.90,
    costo: 4.10,
    unidad_medida: 'L',
    exento_iva: false,
    categoria: 'Limpieza & Hogar',
    descripcion: 'Detergente concentrado para ropa con fórmula biodegradable y aroma floral fresco.',
    imagen: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80',
    destacadoTienda: false,
  },
  {
    id: 6,
    codigo_barras: '770123',
    nombre: 'Pasta Larga Spaghetti 500g',
    precio: 1.40,
    costo: 0.95,
    unidad_medida: 'PQ',
    exento_iva: true,
    categoria: 'Víveres & Granos',
    descripcion: 'Pasta de sémola de trigo durum de cocción al dente, tradición italiana.',
    imagen: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
    destacadoTienda: true,
  },
  {
    id: 7,
    codigo_barras: '770456',
    nombre: 'Azúcar Blanca Refinada 1kg',
    precio: 1.60,
    costo: 1.15,
    unidad_medida: 'KG',
    exento_iva: true,
    categoria: 'Víveres & Granos',
    descripcion: 'Azúcar blanca extra pura para endulzar bebidas, postres y recetas.',
    imagen: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=600&q=80',
    destacadoTienda: false,
  },
  {
    id: 8,
    codigo_barras: '770789',
    nombre: 'Leche Líquida Entera 1L',
    precio: 2.10,
    costo: 1.50,
    unidad_medida: 'L',
    exento_iva: true,
    categoria: 'Lácteos & Refrigerados',
    descripcion: 'Leche entera pasteurizada enriquecida con vitaminas A y D.',
    imagen: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    destacadoTienda: true,
  },
];

export const INITIAL_INVENTARIO: InventarioItem[] = [
  // Tienda 1
  { id: 1, sucursal_id: 1, producto_id: 1, stock: 150 },
  { id: 2, sucursal_id: 1, producto_id: 2, stock: 80 },
  { id: 3, sucursal_id: 1, producto_id: 3, stock: 200 },
  { id: 4, sucursal_id: 1, producto_id: 4, stock: 45 },
  { id: 5, sucursal_id: 1, producto_id: 5, stock: 60 },
  { id: 6, sucursal_id: 1, producto_id: 6, stock: 110 },
  { id: 7, sucursal_id: 1, producto_id: 7, stock: 140 },
  { id: 8, sucursal_id: 1, producto_id: 8, stock: 75 },

  // Tienda 2
  { id: 9, sucursal_id: 2, producto_id: 1, stock: 120 },
  { id: 10, sucursal_id: 2, producto_id: 2, stock: 95 },
  { id: 11, sucursal_id: 2, producto_id: 3, stock: 180 },
  { id: 12, sucursal_id: 2, producto_id: 4, stock: 30 },
  { id: 13, sucursal_id: 2, producto_id: 5, stock: 40 },
  { id: 14, sucursal_id: 2, producto_id: 6, stock: 85 },
  { id: 15, sucursal_id: 2, producto_id: 7, stock: 90 },
  { id: 16, sucursal_id: 2, producto_id: 8, stock: 60 },

  // Oficina Central (Bodega)
  { id: 17, sucursal_id: 3, producto_id: 1, stock: 1000 },
  { id: 18, sucursal_id: 3, producto_id: 2, stock: 500 },
  { id: 19, sucursal_id: 3, producto_id: 3, stock: 1500 },
  { id: 20, sucursal_id: 3, producto_id: 4, stock: 400 },
  { id: 21, sucursal_id: 3, producto_id: 5, stock: 300 },
  { id: 22, sucursal_id: 3, producto_id: 6, stock: 600 },
  { id: 23, sucursal_id: 3, producto_id: 7, stock: 800 },
  { id: 24, sucursal_id: 3, producto_id: 8, stock: 350 },
];

export const INITIAL_TIENDA_CONFIG: TiendaConfig = {
  habilitada: true,
  nombreTienda: 'Supermarket & Bodegón Express',
  whatsappContacto: '+58 412 8765432',
  mensajeBienvenida: '¡Bienvenido a nuestro catálogo digital! Haz tu pedido en línea y recibe a domicilio o retira en tienda sin colas.',
  costoDeliveryFijo: 2.50, // USD
  deliveryGratisMinimo: 30.00, // USD
  permitePickup: true,
  permiteDelivery: true,
  bannerPromo: '⚡ Envíos gratis por compras superiores a $30.00 · Pagos en Bs. a Tasa Oficial o Divisas en Efectivo / Zelle',
  pagoMovilBanco: 'Banesco (0134)',
  pagoMovilTelefono: '0412-8765432',
  pagoMovilRif: 'J-12345678-0',
  zelleTitular: 'Corporación Los Andes LLC',
  zelleCorreo: 'pagos@supermarketexpress.com',
  horarioAtencion: 'Lunes a Domingo: 8:00 AM – 7:30 PM',
};

export const INITIAL_PEDIDOS_ONLINE: PedidoOnline[] = [
  {
    id: 'PED-1001',
    numeroPedido: 'WEB-2026-001',
    fecha: new Date(Date.now() - 3600000 * 2).toISOString(),
    clienteNombre: 'Valentina Mendoza',
    clienteRif: 'V-24589120',
    clienteTelefono: '+58 414-9988776',
    clienteEmail: 'valentina.m@gmail.com',
    tipoEntrega: 'delivery',
    sucursalId: 1,
    sucursalNombre: 'Tienda 1 - Centro',
    direccionEntrega: 'Urb. La Castellana, Calle El Bosque, Res. Los Samanes, Apto 5-A',
    puntoReferencia: 'Al lado de la panadería francesa',
    costoDelivery: 2.50,
    detalles: [
      { productoId: 4, productoNombre: 'Café Molido Premium 500g', cantidad: 2, precioUnitario: 6.20, subtotal: 12.40, exentoIva: false },
      { productoId: 8, productoNombre: 'Leche Líquida Entera 1L', cantidad: 3, precioUnitario: 2.10, subtotal: 6.30, exentoIva: true },
      { productoId: 6, productoNombre: 'Pasta Larga Spaghetti 500g', cantidad: 4, precioUnitario: 1.40, subtotal: 5.60, exentoIva: true },
    ],
    subtotalNeto: 24.30,
    baseImponible: 12.40,
    montoExento: 11.90,
    montoIva: 1.98,
    total: 28.78, // 24.30 + 1.98 + 2.50
    totalBs: 28.78 * 800,
    tasaCambio: 800,
    metodoPago: 'pago_movil',
    referenciaPago: 'PM-982144',
    bancoOrigen: 'Mercantil',
    notas: 'Por favor entregar después de las 3:00 PM',
    estado: 'pendiente',
    creadoEn: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'PED-1002',
    numeroPedido: 'WEB-2026-002',
    fecha: new Date(Date.now() - 3600000 * 6).toISOString(),
    clienteNombre: 'Carlos Eduardo Rivas',
    clienteRif: 'V-19283746',
    clienteTelefono: '+58 424-5544332',
    clienteEmail: 'carlos.rivas@hotmail.com',
    tipoEntrega: 'pickup',
    sucursalId: 2,
    sucursalNombre: 'Tienda 2 - Norte',
    costoDelivery: 0,
    detalles: [
      { productoId: 1, productoNombre: 'Arroz Integral 1kg', cantidad: 6, precioUnitario: 2.50, subtotal: 15.00, exentoIva: true },
      { productoId: 2, productoNombre: 'Aceite Vegetal 1L', cantidad: 3, precioUnitario: 4.80, subtotal: 14.40, exentoIva: false },
      { productoId: 3, productoNombre: 'Harina de Trigo 1kg', cantidad: 4, precioUnitario: 1.75, subtotal: 7.00, exentoIva: true },
    ],
    subtotalNeto: 36.40,
    baseImponible: 14.40,
    montoExento: 22.00,
    montoIva: 2.30,
    total: 38.70,
    totalBs: 38.70 * 800,
    tasaCambio: 800,
    metodoPago: 'zelle',
    referenciaPago: 'ZLL-903120',
    bancoOrigen: 'Chase Bank',
    notas: 'Retiro en persona en Tienda Norte',
    estado: 'confirmado',
    creadoEn: new Date(Date.now() - 3600000 * 6).toISOString(),
  }
];

export const INITIAL_VENTAS: Venta[] = [
  // Tienda 1 - Centro (Ana Morales)
  {
    id: 1,
    sucursal_id: 1,
    usuario_id: 1,
    usuario_nombre: 'Ana Morales',
    cliente_id: 1,
    cliente_nombre: 'Abastos y Víveres La Candelaria C.A.',
    cliente_rif: 'J-31049281-9',
    fecha: new Date(Date.now() - 3600000 * 6).toISOString(),
    subtotal_neto: 24.15,
    base_imponible: 9.35,
    monto_exento: 14.80,
    monto_iva: 1.50,
    total: 25.65,
    metodo_pago: 'pago_movil',
    referencia_pago: 'PM-883921',
    pago_detalle: {
      metodo: 'pago_movil',
      monto_usd: 25.65,
      monto_bs: 25.65 * 45.50,
      pago_movil_monto_bs: 25.65 * 45.50,
      referencia_pago_movil: 'PM-883921'
    },
    detalles: [
      { id: 1, venta_id: 1, producto_id: 1, producto_nombre: 'Arroz Integral 1kg', cantidad: 4, precio_unitario: 2.50, subtotal: 10.00, exento_iva: true },
      { id: 2, venta_id: 1, producto_id: 3, producto_nombre: 'Harina de Trigo 1kg', cantidad: 4, precio_unitario: 1.75, subtotal: 7.00, exento_iva: true },
      { id: 3, venta_id: 1, producto_id: 2, producto_nombre: 'Aceite Vegetal 1L', cantidad: 2, precio_unitario: 4.80, subtotal: 9.60, exento_iva: false }
    ]
  },
  {
    id: 2,
    sucursal_id: 1,
    usuario_id: 1,
    usuario_nombre: 'Ana Morales',
    cliente_id: 2,
    cliente_nombre: 'Inversiones El Sol Radiante F.P.',
    cliente_rif: 'V-14920381-0',
    fecha: new Date(Date.now() - 3600000 * 4).toISOString(),
    subtotal_neto: 31.20,
    base_imponible: 21.00,
    monto_exento: 10.20,
    monto_iva: 3.36,
    total: 34.56,
    metodo_pago: 'efectivo_usd',
    pago_detalle: {
      metodo: 'efectivo_usd',
      monto_usd: 34.56,
      monto_bs: 34.56 * 45.50,
      efectivo_usd_recibido: 40.00,
      vuelto_usd: 5.44
    },
    detalles: [
      { id: 4, venta_id: 2, producto_id: 4, producto_nombre: 'Café Molido Premium 500g', cantidad: 3, precio_unitario: 6.20, subtotal: 18.60, exento_iva: false },
      { id: 5, venta_id: 2, producto_id: 5, producto_nombre: 'Detergente Líquido 2L', cantidad: 1, precio_unitario: 5.90, subtotal: 5.90, exento_iva: false },
      { id: 6, venta_id: 2, producto_id: 1, producto_nombre: 'Arroz Integral 1kg', cantidad: 4, precio_unitario: 2.50, subtotal: 10.00, exento_iva: true }
    ]
  },
  {
    id: 3,
    sucursal_id: 1,
    usuario_id: 1,
    usuario_nombre: 'Ana Morales',
    cliente_nombre: 'Cliente Contado / Consumidor Final',
    cliente_rif: 'V-00000000-0',
    fecha: new Date(Date.now() - 3600000 * 1).toISOString(),
    subtotal_neto: 18.00,
    base_imponible: 18.00,
    monto_exento: 0.00,
    monto_iva: 2.88,
    total: 20.88,
    metodo_pago: 'tarjeta',
    referencia_pago: 'POS-009142',
    pago_detalle: {
      metodo: 'tarjeta',
      monto_usd: 20.88,
      monto_bs: 20.88 * 45.50,
      tarjeta_banco: '0134 - Banesco (Terminal #1)',
      tarjeta_referencia: 'POS-009142',
      tarjeta_monto_bs: 20.88 * 45.50,
      tarjeta_monto_usd: 20.88,
      tarjeta_tipo: 'debito'
    },
    detalles: [
      { id: 7, venta_id: 3, producto_id: 4, producto_nombre: 'Café Molido Premium 500g', cantidad: 2, precio_unitario: 6.20, subtotal: 12.40, exento_iva: false },
      { id: 8, venta_id: 3, producto_id: 2, producto_nombre: 'Aceite Vegetal 1L', cantidad: 1, precio_unitario: 4.80, subtotal: 4.80, exento_iva: false }
    ]
  },

  // Tienda 2 - Norte (Fernando Soto)
  {
    id: 4,
    sucursal_id: 2,
    usuario_id: 5,
    usuario_nombre: 'Fernando Soto',
    cliente_id: 3,
    cliente_nombre: 'Supermercado Central Guayana S.A.',
    cliente_rif: 'J-40918273-4',
    fecha: new Date(Date.now() - 3600000 * 5).toISOString(),
    subtotal_neto: 42.50,
    base_imponible: 25.00,
    monto_exento: 17.50,
    monto_iva: 4.00,
    total: 46.50,
    metodo_pago: 'mixto',
    pago_detalle: {
      metodo: 'mixto',
      monto_usd: 46.50,
      monto_bs: 46.50 * 45.50,
      efectivo_usd_recibido: 20.00,
      pago_movil_monto_bs: 26.50 * 45.50,
      referencia_pago_movil: 'PM-990142',
      vuelto_usd: 0
    },
    detalles: [
      { id: 9, venta_id: 4, producto_id: 1, producto_nombre: 'Arroz Integral 1kg', cantidad: 7, precio_unitario: 2.50, subtotal: 17.50, exento_iva: true },
      { id: 10, venta_id: 4, producto_id: 5, producto_nombre: 'Detergente Líquido 2L', cantidad: 3, precio_unitario: 5.90, subtotal: 17.70, exento_iva: false },
      { id: 11, venta_id: 4, producto_id: 2, producto_nombre: 'Aceite Vegetal 1L', cantidad: 2, precio_unitario: 4.80, subtotal: 9.60, exento_iva: false }
    ]
  },
  {
    id: 5,
    sucursal_id: 2,
    usuario_id: 5,
    usuario_nombre: 'Fernando Soto',
    cliente_nombre: 'Carlos Alberto Rondón',
    cliente_rif: 'V-18294012-3',
    fecha: new Date(Date.now() - 3600000 * 2).toISOString(),
    subtotal_neto: 18.60,
    base_imponible: 18.60,
    monto_exento: 0.00,
    monto_iva: 2.98,
    total: 21.58,
    metodo_pago: 'efectivo_usd',
    pago_detalle: {
      metodo: 'efectivo_usd',
      monto_usd: 21.58,
      monto_bs: 21.58 * 45.50,
      efectivo_usd_recibido: 30.00,
      vuelto_usd: 8.42
    },
    detalles: [
      { id: 12, venta_id: 5, producto_id: 4, producto_nombre: 'Café Molido Premium 500g', cantidad: 3, precio_unitario: 6.20, subtotal: 18.60, exento_iva: false }
    ]
  }
];

export const SQL_ETAPA1_SCRIPT = `-- ========================================================
-- SISTEMA MULTI-SUCURSAL EN LÍNEA ($0 COSTO)
-- SCRIPT DE INICIALIZACIÓN CON USUARIOS Y SEGURIDAD (POSTGRESQL / SUPABASE)
-- ========================================================

-- 1. Eliminar tablas previas en orden de dependencia (si existen)
DROP TABLE IF EXISTS detalle_ventas CASCADE;
DROP TABLE IF EXISTS ventas CASCADE;
DROP TABLE IF EXISTS inventario CASCADE;
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS sucursales CASCADE;

-- 2. Tabla de Sucursales (Tiendas físicas y Oficina Central)
CREATE TABLE sucursales (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) DEFAULT 'tienda',
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Usuarios con Autenticación por PIN y Rol
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    nombre_completo VARCHAR(120) NOT NULL,
    pin VARCHAR(20) NOT NULL,
    rol VARCHAR(30) NOT NULL CHECK (rol IN ('cajero', 'supervisor', 'inventario', 'admin')),
    sucursal_id INT REFERENCES sucursales(id) ON DELETE SET NULL,
    cargo VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla de Productos (Catálogo global)
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    codigo_barras VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    precio NUMERIC(10, 2) NOT NULL CHECK (precio >= 0),
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabla de Inventario por Sucursal
CREATE TABLE inventario (
    id SERIAL PRIMARY KEY,
    sucursal_id INT NOT NULL REFERENCES sucursales(id) ON DELETE CASCADE,
    producto_id INT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    CONSTRAINT uq_sucursal_producto UNIQUE (sucursal_id, producto_id)
);

-- 6. Tabla de Encabezado de Ventas con Auditoría de Cajero/Usuario
CREATE TABLE ventas (
    id SERIAL PRIMARY KEY,
    sucursal_id INT NOT NULL REFERENCES sucursales(id) ON DELETE RESTRICT,
    usuario_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    total NUMERIC(10, 2) NOT NULL CHECK (total >= 0)
);

-- 7. Tabla de Detalle de Ventas
CREATE TABLE detalle_ventas (
    id SERIAL PRIMARY KEY,
    venta_id INT NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
    producto_id INT NOT NULL REFERENCES productos(id) ON DELETE RESTRICT,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(10, 2) NOT NULL CHECK (precio_unitario >= 0)
);

-- 8. Índices de rendimiento
CREATE INDEX idx_productos_codigo_barras ON productos(codigo_barras);
CREATE INDEX idx_inventario_busqueda ON inventario(sucursal_id, producto_id);
CREATE INDEX idx_ventas_sucursal_fecha ON ventas(sucursal_id, fecha DESC);
CREATE INDEX idx_usuarios_username_pin ON usuarios(username, pin);

-- ========================================================
-- INSERCIÓN DE USUARIOS Y DATOS INICIALES
-- ========================================================

INSERT INTO sucursales (id, nombre, tipo) VALUES
(1, 'Tienda 1 - Centro', 'tienda'),
(2, 'Tienda 2 - Norte', 'tienda'),
(3, 'Oficina Central / Inventario', 'oficina');

SELECT setval('sucursales_id_seq', (SELECT MAX(id) FROM sucursales));

-- 4 Usuarios Tienda 1
INSERT INTO usuarios (id, username, nombre_completo, pin, rol, sucursal_id, cargo) VALUES
(1, 'cajero1_t1', 'Ana Morales', '1001', 'cajero', 1, 'Cajera Principal'),
(2, 'cajero2_t1', 'Carlos Pérez', '1002', 'cajero', 1, 'Cajero Turno Tarde'),
(3, 'cajero3_t1', 'Diana Castro', '1003', 'cajero', 1, 'Cajera Fines de Semana'),
(4, 'supervisor_t1', 'Elena Rivas', '1004', 'supervisor', 1, 'Supervisora Tienda 1');

-- 4 Usuarios Tienda 2
INSERT INTO usuarios (id, username, nombre_completo, pin, rol, sucursal_id, cargo) VALUES
(5, 'cajero1_t2', 'Fernando Soto', '2001', 'cajero', 2, 'Cajero Principal'),
(6, 'cajero2_t2', 'Gabriela Ruiz', '2002', 'cajero', 2, 'Cajera Turno Tarde'),
(7, 'cajero3_t2', 'Hugo Mendoza', '2003', 'cajero', 2, 'Cajero Fines de Semana'),
(8, 'supervisor_t2', 'Isabel Vargas', '2004', 'supervisor', 2, 'Supervisora Tienda 2');

-- 4 Usuarios Inventario / Oficina Central
INSERT INTO usuarios (id, username, nombre_completo, pin, rol, sucursal_id, cargo) VALUES
(9, 'inv_jefe', 'Jorge Martínez', '3001', 'inventario', 3, 'Jefe de Almacén e Inventarios'),
(10, 'inv_operador1', 'Karla Benítez', '3002', 'inventario', 3, 'Auditora de Existencias'),
(11, 'inv_operador2', 'Luis Navarro', '3003', 'inventario', 3, 'Encargado de Traspasos y Recepción'),
(12, 'admin_general', 'Administrador General', '9999', 'admin', NULL, 'Director General / Admin Sistema');

SELECT setval('usuarios_id_seq', (SELECT MAX(id) FROM usuarios));

-- Productos Básicos
INSERT INTO productos (id, codigo_barras, nombre, precio) VALUES
(1, '123456', 'Arroz Integral 1kg', 2.50),
(2, '789012', 'Aceite Vegetal 1L', 4.80),
(3, '345678', 'Harina de Trigo 1kg', 1.75),
(4, '901234', 'Café Molido Premium 500g', 6.20),
(5, '567890', 'Detergente Líquido 2L', 5.90);

SELECT setval('productos_id_seq', (SELECT MAX(id) FROM productos));

-- Stock Inicial
INSERT INTO inventario (sucursal_id, producto_id, stock) VALUES
(1, 1, 150), (1, 2, 80), (1, 3, 200), (1, 4, 45), (1, 5, 60),
(2, 1, 120), (2, 2, 95), (2, 3, 180), (2, 4, 30), (2, 5, 40),
(3, 1, 1000), (3, 2, 500), (3, 3, 1500), (3, 4, 400), (3, 5, 300);
`;
