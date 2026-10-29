# 🛒 Sistema POS & ERP Administrativo Multisucursal

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase" alt="Firebase" />
  <img src="https://img.shields.io/badge/Licensing-Anti--Theft-red?style=for-the-badge" alt="Anti-Theft" />
</p>

<p align="center">
  <strong>Solución integral de punto de venta (POS), control de inventario en tiempo real, gestión financiera multidivisa y tienda online para operaciones de una o múltiples sucursales con soporte 100% Offline.</strong>
</p>

---

## 🌟 Características Principales

### 💳 1. Punto de Venta (POS) Táctil y Rápido
- **Multimoneda Dinámica:** Facturación simultánea en USD ($), Moneda Local (Bs) y divisas secundarias con tasa de cambio diaria en tiempo real.
- **Pagos Mixtos y Fraccionados:** Cobro combinado en efectivo, tarjetas de débito/crédito, Pago Móvil / transferencias y crédito a clientes.
- **Tickets en Espera (Hold):** Pausa de ventas activas para atender a otro cliente y reanudación con un solo clic.
- **Búsqueda Inteligente:** Catálogo interactivo con lectura de código de barras, búsqueda predictiva y selección rápida de productos frecuentes.
- **Impresión de Tickets Térmicos:** Formato estándar de 58mm y 80mm listo para impresoras térmicas ESC/POS.

### 🏢 2. Gestión Multisucursal e Inventario Centralizado
- **Control de Sucursales:** Gestión independiente o sincronizada por tienda, sucursal o almacén.
- **Stock en Tiempo Real:** Alertas visuales de stock mínimo, agotados y valorización monetaria del inventario (al costo y a la venta).
- **Carga de Facturas y Compras:** Registro de proveedores, costos de adquisición y actualización masiva de inventarios.
- **🏷️ Habladores de Góndola y Etiquetas de Precios para Anaqueles:** Generador e impresor integrado de etiquetas para estanterías en múltiples formatos (Estándar 6.5x3.5cm, Grandes de Oferta 9x5cm, Joyería/Mini 5x2.5cm y rollo continuo de ticketera térmica 58/80mm) con doble precio (USD / Bs), código de barras y empaque.

### 💰 3. Módulo Financiero y Créditos
- **Cuentas por Cobrar (CxC):** Estado de cuenta de clientes, registro de abonos parciales, cálculo de saldos pendientes e historial.
- **Cuentas por Pagar (CxP):** Gestión de deudas con proveedores, control de fechas de vencimiento y pagos.
- **Cierres y Cortes Fiscales:** Arqueo de caja, reporte X y reporte Z por turno, cajero y forma de pago con cálculo de diferencias de caja.

### 🛍️ 4. Tienda Online Integrada & Pedidos Web
- **Catálogo Digital para Clientes:** Vista de tienda e-commerce conectada al inventario del sistema.
- **Gestión de Pedidos Entrantes:** Recepción de pedidos web para confirmación, preparación y despacho directo al POS.

### 🛡️ 5. Seguridad, Auditoría y Sistema Anti-Robo de Licencias
- **Bitácora de Auditoría Forense:** Registro inmutable de cada venta, modificación de precio, anulación, apertura de caja y acceso de usuarios con dirección IP y marcas de tiempo.
- **Bloqueo Inteligente de Licencia:** Verificación criptográfica con control de expiración o revocación remota para prevenir distribución no autorizada.

### ⚡ 6. Arquitectura Híbrida (Nube + 100% Offline)
- **Modo Standalone (.HTML Portable):** Generador de archivo único autónomo ejecutable en cualquier computadora o laptop sin necesidad de internet ni servidores instalados.
- **Respaldo y Restauración Instantánea:** Exportación e importación de copias de seguridad de la base de datos en formato JSON / SQL cifrado.

---

## 🏗️ Arquitectura Tecnológica

```
├── public/                 # Archivos estáticos y versión standalone .html
├── data/                   # Almacén de datos local (server_db.json)
├── src/
│   ├── components/         # Módulos principales del sistema
│   │   ├── PosSimulator.tsx              # Terminal de venta POS
│   │   ├── InventoryManager.tsx          # Control de inventario y precios
│   │   ├── ClientesManager.tsx           # Directorio y gestión de clientes
│   │   ├── ProveedoresManager.tsx        # Directorio de proveedores
│   │   ├── ComprasManager.tsx            # Recepción de mercancía y facturas
│   │   ├── CxcManager.tsx                # Cuentas por cobrar
│   │   ├── CxpManager.tsx                # Cuentas por pagar
│   │   ├── FiscalCortesView.tsx          # Cortes X y Z de caja
│   │   ├── TiendaOnlineView.tsx          # Catálogo e-commerce
│   │   ├── AuditoriaView.tsx             # Registro forense de acciones
│   │   ├── BackupRestoreView.tsx         # Respaldos y restauración
│   │   └── LicenseManagerView.tsx        # Control de licencias y activación
│   ├── lib/                # Utilidades (Criptografía, Firebase, Divisas, Logger)
│   ├── types.ts            # Definiciones de tipos TypeScript
│   └── App.tsx             # Enrutador principal y layout
├── server.ts               # Servidor backend Express con APIs REST
└── firestore.rules         # Reglas de seguridad para Firestore
```

---

## 🚀 Puesta en Marcha (Instalación Rápida)

### Prerrequisitos
- **Node.js** v18 o superior
- **NPM** o **Bun**

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/sistema-pos-multisucursal.git
cd sistema-pos-multisucursal
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Copia el archivo de ejemplo:
```bash
cp .env.example .env
```
*(Opcional: Si deseas enlazarlo con tu proyecto de Firebase, añade tus credenciales en el archivo `.env`).*

### 4. Iniciar en modo desarrollo
```bash
npm run dev
```
Abre tu navegador en: **`http://localhost:3000`**

### 5. Compilar para Producción
```bash
npm run build
npm start
```

---

## 📱 Ejecución en Android (Termux)
Este proyecto está optimizado para poder ser gestionado, versionado y ejecutado directamente desde un dispositivo móvil Android usando la terminal **Termux**.

---

## 📄 Licencia y Derechos de Autor
Desarrollado como solución de grado empresarial para comercios, distribuidoras y cadenas de tiendas minoristas.  
Todos los derechos reservados.
