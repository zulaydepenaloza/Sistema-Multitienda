import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { ZipArchive } from 'archiver';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const rootDir = process.cwd();

const app = express();
const PORT = 3000;

// Persistent Server JSON Database file
const DB_DIR = path.join(rootDir, 'data');
const DB_FILE = path.join(DB_DIR, 'server_db.json');

interface ServerDatabase {
  pedidos: any[];
  empresaConfig: any | null;
  tiendaConfig: any | null;
  productos: any[] | null;
  inventario: any[] | null;
}

function readServerDb(): ServerDatabase {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading server DB:', err);
  }
  return {
    pedidos: [],
    empresaConfig: null,
    tiendaConfig: null,
    productos: null,
    inventario: null,
  };
}

function saveServerDb(db: ServerDatabase) {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving server DB:', err);
  }
}

// Middleware for parsing JSON with generous limit for images and PDFs
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// API: Consulta automática de Tasa Oficial BCV en tiempo real con caché
let cachedBcvRate: { tasa: number; fecha: string; lastFetched: number } | null = null;

app.get('/api/bcv-rate', async (req, res) => {
  try {
    const now = Date.now();
    // Cache de 10 minutos para proteger cuota y responder a alta velocidad
    if (cachedBcvRate && now - cachedBcvRate.lastFetched < 10 * 60 * 1000) {
      return res.json({
        success: true,
        tasa: cachedBcvRate.tasa,
        fecha: cachedBcvRate.fecha,
        fuente: 'Banco Central de Venezuela (BCV Oficial - Caché)',
      });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch('https://ve.dolarapi.com/v1/dolares/oficial', {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Respuesta HTTP ${response.status} de la API oficial`);
    }

    const data: any = await response.json();
    const tasa = typeof data.promedio === 'number' ? data.promedio : parseFloat(data.promedio);

    if (tasa && !isNaN(tasa) && tasa > 0) {
      cachedBcvRate = {
        tasa: +tasa.toFixed(2),
        fecha: data.fechaActualizacion || new Date().toISOString(),
        lastFetched: now,
      };

      return res.json({
        success: true,
        tasa: cachedBcvRate.tasa,
        fecha: cachedBcvRate.fecha,
        fuente: 'Banco Central de Venezuela (BCV Oficial en Vivo)',
      });
    }

    throw new Error('Formato de tasa inválido devuelto por el servicio.');
  } catch (err: any) {
    console.warn('Aviso: Consulta de tasa BCV en vivo:', err.message);
    if (cachedBcvRate) {
      return res.json({
        success: true,
        tasa: cachedBcvRate.tasa,
        fecha: cachedBcvRate.fecha,
        fuente: 'Banco Central de Venezuela (Última Tasa Registrada)',
      });
    }
    return res.status(503).json({
      success: false,
      error: 'No se pudo obtener la tasa BCV automáticamente: ' + err.message,
    });
  }
});

// API: Obtener todos los pedidos web / online
app.get('/api/pedidos', (req, res) => {
  try {
    const db = readServerDb();
    res.json({ success: true, pedidos: db.pedidos || [] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// API: Guardar nuevo pedido (creado desde el celular, tablet o laptop)
app.post('/api/pedidos', (req, res) => {
  try {
    const pedido = req.body;
    if (!pedido || !pedido.clienteNombre) {
      return res.status(400).json({ success: false, error: 'Datos de pedido inválidos' });
    }
    const db = readServerDb();
    if (!Array.isArray(db.pedidos)) {
      db.pedidos = [];
    }
    const existingIndex = db.pedidos.findIndex((p: any) => p.id === pedido.id);
    if (existingIndex >= 0) {
      db.pedidos[existingIndex] = pedido;
    } else {
      db.pedidos.unshift(pedido);
    }
    saveServerDb(db);
    console.log(`[PEDIDO RECIBIDO] ${pedido.numeroPedido} por ${pedido.clienteNombre} ($${pedido.totalUsd})`);
    return res.json({ success: true, pedido });
  } catch (err: any) {
    console.error('Error al guardar pedido online:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// API: Actualizar estado de pedido (aprobado, en camino, facturado, cancelado)
app.patch('/api/pedidos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { estado, detallePago, correlativoFactura } = req.body;
    const db = readServerDb();
    if (!Array.isArray(db.pedidos)) db.pedidos = [];
    const index = db.pedidos.findIndex((p: any) => p.id === id);
    if (index >= 0) {
      if (estado) db.pedidos[index].estado = estado;
      if (detallePago) db.pedidos[index].detallePago = detallePago;
      if (correlativoFactura) db.pedidos[index].correlativoFactura = correlativoFactura;
      saveServerDb(db);
      return res.json({ success: true, pedido: db.pedidos[index] });
    }
    return res.status(404).json({ success: false, error: 'Pedido no encontrado' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// API: Sincronización de estado general entre dispositivos (productos, tasa, config)
app.get('/api/sync/state', (req, res) => {
  try {
    const db = readServerDb();
    res.json({
      success: true,
      pedidos: db.pedidos || [],
      empresaConfig: db.empresaConfig || null,
      tiendaConfig: db.tiendaConfig || null,
      productos: db.productos || null,
      inventario: db.inventario || null,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/sync/state', (req, res) => {
  try {
    const { empresaConfig, tiendaConfig, productos, inventario, pedidos } = req.body;
    const db = readServerDb();
    if (empresaConfig) db.empresaConfig = empresaConfig;
    if (tiendaConfig) db.tiendaConfig = tiendaConfig;
    if (productos) db.productos = productos;
    if (inventario) db.inventario = inventario;
    if (Array.isArray(pedidos)) {
      const map = new Map();
      (db.pedidos || []).forEach((p: any) => map.set(p.id, p));
      pedidos.forEach((p: any) => map.set(p.id, p));
      db.pedidos = Array.from(map.values()).sort(
        (a, b) => new Date(b.fecha || 0).getTime() - new Date(a.fecha || 0).getTime()
      );
    }
    saveServerDb(db);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Download full repository as a .zip file (Protected - requires developer authorization token)
app.get('/api/download-zip', (req, res) => {
  try {
    const devToken = (req.query.token as string) || (req.headers['x-admin-token'] as string);
    const validSecret = process.env.ADMIN_DEV_KEY || 'OmniPosDev2026MasterKey';

    // Verify developer credential to prevent unauthorized source code downloads
    if (!devToken || devToken !== validSecret) {
      return res.status(403).json({
        success: false,
        error: 'Acceso denegado: Se requiere autorización de desarrollador para descargar el código fuente.',
      });
    }

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="sistema-pos-multisucursal.zip"'
    );

    const archive = new ZipArchive({
      zlib: { level: 9 },
    });

    archive.on('error', (err: any) => {
      console.error('Archiver error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Error generating zip: ' + err.message });
      }
    });

    archive.pipe(res);

    // Glob files, excluding sensitive data, customer records, secrets and environment configs
    archive.glob('**/*', {
      cwd: rootDir,
      ignore: [
        'node_modules/**',
        'dist/**',
        '.git/**',
        '.aistudio/**',
        'data/**',
        '.env*',
        'firebase-applet-config.json',
        '**/*.zip',
        '**/*.tar.gz',
      ],
      dot: true,
    });

    archive.finalize();
  } catch (err: any) {
    console.error('Error generating zip:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error generating zip: ' + err.message });
    }
  }
});

// Protected Developer License Generator Endpoint (Requires Master Developer Secret)
app.post('/api/developer/license/generate', (req, res) => {
  try {
    const { machineId, empresa, rif, tipo, fechaEmision, fechaVencimiento, cajasMax, sucursalesMax, devSecret } = req.body;
    const token = devSecret || (req.headers['x-admin-token'] as string);
    const validSecret = process.env.ADMIN_DEV_KEY || 'OmniPosDev2026MasterKey';

    if (!token || token !== validSecret) {
      return res.status(403).json({
        success: false,
        error: 'Acceso denegado: Se requiere la clave maestra de desarrollador para emitir licencias.',
      });
    }

    if (!machineId || !empresa) {
      return res.status(400).json({ success: false, error: 'machineId y empresa son campos requeridos.' });
    }

    const payload = {
      machineId: String(machineId).trim().toUpperCase(),
      empresa: String(empresa).trim(),
      rif: String(rif || 'J-00000000-0').trim().toUpperCase(),
      tipo: tipo || 'vitalicia',
      fechaEmision: fechaEmision || new Date().toISOString().split('T')[0],
      fechaVencimiento: fechaVencimiento || 'VITALICIA',
      cajasMax: Number(cajasMax) || 1,
      sucursalesMax: Number(sucursalesMax) || 1,
    };

    const jsonStr = JSON.stringify(payload);
    const base64Payload = Buffer.from(jsonStr, 'utf-8')
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const secretKey = process.env.LICENSE_MASTER_KEY || 'POS_CRYPT_SEC_KEY_VAL_2026_MULTI_BRANCH_LATAM_G82X';
    const hash = crypto.createHash('sha256')
      .update(`${base64Payload}::${secretKey}::${payload.machineId}`)
      .digest('hex');
    const signatureShort = hash.substring(0, 16).toUpperCase();

    const activationKey = `LIC-${base64Payload}.${signatureShort}`;
    return res.json({ success: true, key: activationKey, payload });
  } catch (err: any) {
    console.error('Error generating developer license:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('La variable de entorno GEMINI_API_KEY no está configurada en los Secrets del servidor.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Parse invoice image or PDF using Gemini 3.8 Flash
app.post('/api/compras/parse-invoice', async (req, res) => {
  try {
    const { fileBase64, mimeType } = req.body;

    if (!fileBase64 || !mimeType) {
      return res.status(400).json({
        success: false,
        error: 'Debe proporcionar la imagen o archivo PDF en formato base64 y su tipo MIME.',
      });
    }

    const ai = getGenAI();

    // Clean base64 string if it contains data URI prefix
    const cleanBase64 = fileBase64.includes(',') ? fileBase64.split(',')[1] : fileBase64;

    const filePart = {
      inlineData: {
        data: cleanBase64,
        mimeType: mimeType,
      },
    };

    const promptText = `
Eres un asistente contable y administrativo de alta precisión especializado en facturas comerciales y notas de entrega de proveedores (incluyendo facturación venezolana con IVA 16%, exentos (E), gravados (G), RIF, número de control, y códigos de barra).

Analiza detalladamente este documento (imagen o archivo PDF de factura de proveedor) y extrae de forma estructurada:
1. Nombre o razón social del proveedor emisor (proveedorNombre).
2. RIF o identificación fiscal del proveedor (proveedorRif), ej: J-12345678-0 o V-12345678.
3. Número de factura (numeroFactura), correlativo o folio (ej: FAC-00984, 0001234).
4. Número de control (numeroControl) si está presente.
5. Fecha de emisión (fechaFactura) en formato YYYY-MM-DD. Si no tiene año, asume el año actual.
6. Condición de pago (condicionPago): 'contado' o 'credito'.
7. Fecha de vencimiento (fechaVencimiento) en formato YYYY-MM-DD si la factura es a crédito o tiene fecha de vencimiento explícita (ej: "Vence:", "Fecha Vcto:", "Vencimiento:"). Si no tiene fecha explícita pero indica días de crédito (ej: "Crédito 7 días", "Plazo 15 días"), calcula la fecha de vencimiento sumando esos días a fechaFactura.
8. Días de crédito (diasCredito): Número entero de días de crédito concedidos por el proveedor (ej: 7, 14, 15, 21, 30). Si la factura tiene fecha de emisión y fecha de vencimiento, calcula exactamente la diferencia en días entre ambas (por ejemplo: si emite el día 13 y vence el día 20, son exactamente 7 días).
9. Lista completa de renglones o productos facturados (items):
   - codigo_barras: Código de barra numérico, SKU o código de producto impreso. Si no tiene, déjalo como cadena vacía "".
   - descripcion: Nombre completo, marca o descripción del producto.
   - unidad_medida: Presentación ('UND' para unidades/piezas, 'KG' para kilogramos/peso, 'L' para litros, 'PQ' para paquetes/bultos).
   - cantidad: Cantidad adquirida numérica (soporta decimales ej: 0.500, 1.250).
   - precio_unitario: Costo unitario antes o con descuento (en USD o moneda base).
   - subtotal: Subtotal del renglón (cantidad * precio_unitario).
   - exento: booleano (true si el producto está marcado como exento de IVA o tasa 0%, false si está gravado con IVA 16%).
10. Totales de la factura:
   - subtotalNeto: suma de subtotales de todos los renglones.
   - baseImponible: monto sujeto al 16% de IVA.
   - montoExento: monto total exento de IVA (tasa 0%).
   - totalIva: monto total de impuesto IVA (16%).
   - totalFactura: monto total final a pagar de la factura.

Asegúrate de que los cálculos numéricos sean consistentes. Extrae todos los renglones posibles con fidelidad.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          filePart,
          { text: promptText },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            proveedorNombre: {
              type: Type.STRING,
              description: 'Nombre o razón social del proveedor emisor',
            },
            proveedorRif: {
              type: Type.STRING,
              description: 'RIF o número fiscal del proveedor',
            },
            numeroFactura: {
              type: Type.STRING,
              description: 'Número de factura o serie',
            },
            numeroControl: {
              type: Type.STRING,
              description: 'Número de control fiscal si existe',
            },
            fechaFactura: {
              type: Type.STRING,
              description: 'Fecha de emisión en formato YYYY-MM-DD',
            },
            fechaVencimiento: {
              type: Type.STRING,
              description: 'Fecha de vencimiento en formato YYYY-MM-DD',
            },
            diasCredito: {
              type: Type.INTEGER,
              description: 'Días de crédito entre emisión y vencimiento (ej: 7, 15, 30)',
            },
            condicionPago: {
              type: Type.STRING,
              description: 'Condición de pago: contado o credito',
            },
            items: {
              type: Type.ARRAY,
              description: 'Renglones o productos de la factura',
              items: {
                type: Type.OBJECT,
                properties: {
                  codigo_barras: {
                    type: Type.STRING,
                    description: 'Código de barras o SKU',
                  },
                  descripcion: {
                    type: Type.STRING,
                    description: 'Descripción detallada del producto',
                  },
                  unidad_medida: {
                    type: Type.STRING,
                    description: 'Unidad de medida: UND, KG, L, PQ',
                  },
                  cantidad: {
                    type: Type.NUMBER,
                    description: 'Cantidad numérica facturada',
                  },
                  precio_unitario: {
                    type: Type.NUMBER,
                    description: 'Costo unitario del producto',
                  },
                  subtotal: {
                    type: Type.NUMBER,
                    description: 'Subtotal del producto',
                  },
                  exento: {
                    type: Type.BOOLEAN,
                    description: 'true si es exento de IVA, false si es gravado con IVA 16%',
                  },
                },
                required: ['descripcion', 'cantidad', 'precio_unitario', 'subtotal', 'exento'],
              },
            },
            subtotalNeto: {
              type: Type.NUMBER,
              description: 'Subtotal neto de la factura',
            },
            baseImponible: {
              type: Type.NUMBER,
              description: 'Base imponible para IVA 16%',
            },
            montoExento: {
              type: Type.NUMBER,
              description: 'Monto total exento de IVA',
            },
            totalIva: {
              type: Type.NUMBER,
              description: 'Total monto de IVA 16%',
            },
            totalFactura: {
              type: Type.NUMBER,
              description: 'Total final a pagar de la factura',
            },
          },
          required: ['proveedorNombre', 'numeroFactura', 'items', 'totalFactura'],
        },
      },
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error('El modelo no devolvió una respuesta de texto con el formato esperado.');
    }

    const parsedData = JSON.parse(rawJson.trim());

    // Validate and compute credit days and expiration dates consistently
    if (parsedData.condicionPago === 'credito' || parsedData.fechaVencimiento || parsedData.diasCredito) {
      if (!parsedData.condicionPago) parsedData.condicionPago = 'credito';

      const emision = parsedData.fechaFactura ? new Date(parsedData.fechaFactura) : new Date();
      if (parsedData.fechaVencimiento && parsedData.fechaFactura) {
        const vcto = new Date(parsedData.fechaVencimiento);
        const diffDays = Math.round((vcto.getTime() - emision.getTime()) / (1000 * 3600 * 24));
        if (diffDays > 0) {
          parsedData.diasCredito = diffDays;
        }
      } else if (parsedData.diasCredito && parsedData.diasCredito > 0 && parsedData.fechaFactura) {
        const vcto = new Date(emision.getTime() + parsedData.diasCredito * 24 * 3600 * 1000);
        parsedData.fechaVencimiento = vcto.toISOString().split('T')[0];
      } else if (parsedData.condicionPago === 'credito') {
        parsedData.diasCredito = parsedData.diasCredito || 7;
        const vcto = new Date(emision.getTime() + parsedData.diasCredito * 24 * 3600 * 1000);
        parsedData.fechaVencimiento = vcto.toISOString().split('T')[0];
      }
    }

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error processing invoice with Gemini:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Error al procesar y extraer los datos de la factura.',
    });
  }
});

// Vite middleware setup
async function startServer() {
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    process.argv.some(arg => arg.includes('server.cjs') || arg.includes('dist')) ||
    (typeof __filename !== 'undefined' && __filename.endsWith('server.cjs')) ||
    (fs.existsSync(path.join(rootDir, 'dist', 'index.html')) && process.env.NODE_ENV !== 'development');

  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        watch: {
          ignored: ['**/data/**', '**/server_db.json'],
        },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} [Modo: ${isProduction ? 'Producción' : 'Desarrollo'}]`);
  });
}

startServer();

