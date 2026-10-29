import { EmpresaConfig } from '../types';
import { generateBarcodeSvgString } from '../components/BarcodeSvg';

export interface PrintableTicketItem {
  nombre: string;
  cantidad: number;
  precio: number; // USD
  codigo_barras?: string;
  unidad_medida?: string;
}

export interface PrintableTicketData {
  numeroFactura: string;
  sucursalNombre: string;
  cajeroNombre?: string;
  clienteNombre: string;
  clienteRif: string;
  items: PrintableTicketItem[];
  subtotalNeto: number;
  baseImponible?: number;
  montoExento?: number;
  montoIva: number;
  totalUsd: number;
  tasa: number;
  fecha: string;
  pagoDetalle?: any;
}

function escapeHtml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Builds standard 80mm / 58mm thermal receipt HTML
 * Monospace, crisp contrast, proper thermal page rules
 */
export function generateThermalTicketHtml(
  ticket: PrintableTicketData,
  empresaConfig: EmpresaConfig
): string {
  const totalBs = ticket.totalUsd * ticket.tasa;
  const barcodeValue = `FAC-${ticket.numeroFactura}-${ticket.clienteRif.replace(/[^A-Za-z0-9]/g, '')}`;
  const barcodeSvg = generateBarcodeSvgString(barcodeValue, 38, '#000000', true);

  const itemsHtml = ticket.items
    .map((it) => {
      const lineTotalUsd = it.cantidad * it.precio;
      const lineTotalBs = lineTotalUsd * ticket.tasa;
      return `
        <div style="margin-bottom: 5px; padding-bottom: 4px; border-bottom: 1px dotted #ccc;">
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11px;">
            <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 190px;">
              ${it.cantidad}x ${escapeHtml(it.nombre)}
            </span>
            <span>$${lineTotalUsd.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #333;">
            <span>CÓD: ${escapeHtml(it.codigo_barras || 'N/A')}</span>
            <span>($${it.precio.toFixed(2)} c/u | Bs. ${lineTotalBs.toFixed(2)})</span>
          </div>
        </div>
      `;
    })
    .join('');

  // Payment Breakdown details
  let paymentHtml = '';
  if (ticket.pagoDetalle) {
    const pd = ticket.pagoDetalle;
    const paymentRows: string[] = [];

    if (pd.metodo === 'efectivo_usd' || pd.efectivo_usd_recibido) {
      paymentRows.push(`
        <div style="display: flex; justify-content: space-between;">
          <span>Efectivo Divisas:</span>
          <span>$${(pd.efectivo_usd_recibido || ticket.totalUsd).toFixed(2)}</span>
        </div>
      `);
      if (pd.vuelto_usd && pd.vuelto_usd > 0) {
        paymentRows.push(`
          <div style="display: flex; justify-content: space-between; color: #444;">
            <span>Vuelto Divisas:</span>
            <span>$${pd.vuelto_usd.toFixed(2)}</span>
          </div>
        `);
      }
    }

    if (pd.metodo === 'pago_movil' || pd.pago_movil_monto_bs) {
      paymentRows.push(`
        <div style="display: flex; justify-content: space-between;">
          <span>Pago Móvil:</span>
          <span>Bs. ${(pd.pago_movil_monto_bs || totalBs).toFixed(2)}</span>
        </div>
      `);
      if (pd.referencia_pago_movil) {
        paymentRows.push(`
          <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #444;">
            <span>Ref. Pago Móvil:</span>
            <span>${escapeHtml(pd.referencia_pago_movil)}</span>
          </div>
        `);
      }
    }

    if (pd.metodo === 'tarjeta' || pd.tarjeta_monto_bs) {
      paymentRows.push(`
        <div style="display: flex; justify-content: space-between;">
          <span>Punto de Venta:</span>
          <span>Bs. ${(pd.tarjeta_monto_bs || totalBs).toFixed(2)}</span>
        </div>
      `);
      if (pd.tarjeta_referencia || pd.tarjeta_lote) {
        paymentRows.push(`
          <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #444;">
            <span>Ref/Lote Tarjeta:</span>
            <span>${escapeHtml(pd.tarjeta_referencia || '')} ${pd.tarjeta_lote ? `(L:${escapeHtml(pd.tarjeta_lote)})` : ''}</span>
          </div>
        `);
      }
    }

    if (pd.vuelto_bs && pd.vuelto_bs > 0) {
      paymentRows.push(`
        <div style="display: flex; justify-content: space-between; color: #444;">
          <span>Vuelto en Bolívares:</span>
          <span>Bs. ${pd.vuelto_bs.toFixed(2)}</span>
        </div>
      `);
    }

    if (paymentRows.length > 0) {
      paymentHtml = `
        <div style="border-top: 1px dashed #666; margin-top: 6px; padding-top: 5px; font-size: 10px;">
          <div style="font-weight: bold; text-transform: uppercase; margin-bottom: 2px;">Forma de Pago:</div>
          ${paymentRows.join('')}
        </div>
      `;
    }
  }

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Ticket Fiscal #${escapeHtml(ticket.numeroFactura)}</title>
  <style>
    @page {
      size: auto;
      margin: 2mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background: #ffffff !important;
      color: #000000 !important;
      font-family: 'Courier New', Courier, monospace;
      font-size: 11px;
      line-height: 1.3;
      width: 76mm;
      max-width: 100%;
      margin: 0 auto;
      padding: 4px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .font-bold { font-weight: bold; }
    .divider { border-top: 1px dashed #444; margin: 5px 0; }
    .double-divider { border-top: 2px solid #000; margin: 6px 0; }
  </style>
</head>
<body>
  <div class="text-center font-bold">
    <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">${escapeHtml(empresaConfig.nombreEmpresa)}</div>
    <div style="font-size: 11px;">RIF: ${escapeHtml(empresaConfig.rif)}</div>
    ${(empresaConfig.direccionFiscal || (empresaConfig as any).direccion) ? `<div style="font-size: 9.5px; color: #222;">${escapeHtml(empresaConfig.direccionFiscal || (empresaConfig as any).direccion)}</div>` : ''}
    <div style="font-size: 10px; margin-top: 2px;">SUCURSAL: ${escapeHtml(ticket.sucursalNombre)}</div>
    <div style="font-size: 10.5px; margin-top: 2px; background: #000; color: #fff; padding: 2px 4px; display: inline-block;">
      FACTURA FISCAL: #${escapeHtml(ticket.numeroFactura)}
    </div>
  </div>

  <div class="divider"></div>

  <div style="font-size: 10.5px; line-height: 1.35;">
    <div><strong>FECHA:</strong> ${escapeHtml(ticket.fecha)}</div>
    <div><strong>CLIENTE:</strong> ${escapeHtml(ticket.clienteNombre)}</div>
    <div><strong>RIF/CÉDULA:</strong> ${escapeHtml(ticket.clienteRif)}</div>
    ${ticket.cajeroNombre ? `<div><strong>CAJERO:</strong> ${escapeHtml(ticket.cajeroNombre)}</div>` : ''}
  </div>

  <div class="divider"></div>
  <div style="font-weight: bold; font-size: 9.5px; display: flex; justify-content: space-between; text-transform: uppercase; margin-bottom: 4px;">
    <span>CANT / DESCRIPCIÓN</span>
    <span>TOTAL</span>
  </div>

  <div style="margin-bottom: 4px;">
    ${itemsHtml}
  </div>

  <div class="divider"></div>

  <div style="font-size: 11px; line-height: 1.4;">
    <div style="display: flex; justify-content: space-between;">
      <span>SUBTOTAL:</span>
      <span>$${ticket.subtotalNeto.toFixed(2)}</span>
    </div>
    ${(ticket.montoExento && ticket.montoExento > 0) ? `
    <div style="display: flex; justify-content: space-between;">
      <span>EXENTO (E 0%):</span>
      <span>$${ticket.montoExento.toFixed(2)}</span>
    </div>` : ''}
    ${(ticket.baseImponible && ticket.baseImponible > 0) ? `
    <div style="display: flex; justify-content: space-between;">
      <span>BASE IMP. (G 16%):</span>
      <span>$${ticket.baseImponible.toFixed(2)}</span>
    </div>` : ''}
    <div style="display: flex; justify-content: space-between;">
      <span>IVA (16%):</span>
      <span>+$${ticket.montoIva.toFixed(2)}</span>
    </div>

    <div class="double-divider"></div>

    <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: bold;">
      <span>TOTAL USD:</span>
      <span>$${ticket.totalUsd.toFixed(2)}</span>
    </div>
    <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: bold; margin-top: 2px;">
      <span>TOTAL BS:</span>
      <span>Bs. ${totalBs.toFixed(2)}</span>
    </div>
    <div style="text-align: right; font-size: 9px; color: #444; margin-top: 1px;">
      Tasa Oficial BCV: Bs. ${ticket.tasa.toFixed(2)} / USD
    </div>
  </div>

  ${paymentHtml}

  <div class="divider"></div>

  <div class="text-center" style="margin-top: 6px;">
    <div style="font-size: 9px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">
      VALIDACIÓN DE FACTURA
    </div>
    ${barcodeSvg}
    <div style="font-size: 9px; font-weight: bold; margin-top: 6px;">
      *** GRACIAS POR SU COMPRA ***
    </div>
    <div style="font-size: 8.5px; color: #444; margin-top: 2px;">
      Conserve este ticket para devoluciones o reclamos
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Triggers thermal ticket printing directly through a dedicated hidden iframe.
 * Avoids browser popup blockers and guarantees zero styling/overlay bleed.
 */
export function printTicketViaIframe(
  ticket: PrintableTicketData,
  empresaConfig: EmpresaConfig
): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      let iframe = document.getElementById('sales-ticket-print-frame') as HTMLIFrameElement;
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'sales-ticket-print-frame';
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        iframe.style.zIndex = '-9999';
        document.body.appendChild(iframe);
      }

      const html = generateThermalTicketHtml(ticket, empresaConfig);
      const doc = iframe.contentWindow?.document || iframe.contentDocument;

      if (!doc) {
        console.warn('Iframe document not accessible, falling back to window.print');
        window.print();
        resolve(true);
        return;
      }

      doc.open();
      doc.write(html);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          resolve(true);
        } catch (err) {
          console.error('Error invoking print inside iframe, fallback to window.print', err);
          window.print();
          resolve(true);
        }
      }, 150);
    } catch (e) {
      console.error('printTicketViaIframe error:', e);
      window.print();
      resolve(false);
    }
  });
}

/**
 * Helper to print arbitrary HTML through the hidden thermal iframe
 */
export function printHtmlViaIframe(htmlContent: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      let iframe = document.getElementById('sales-ticket-print-frame') as HTMLIFrameElement;
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'sales-ticket-print-frame';
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        iframe.style.zIndex = '-9999';
        document.body.appendChild(iframe);
      }

      const doc = iframe.contentWindow?.document || iframe.contentDocument;
      if (!doc) {
        window.print();
        resolve(true);
        return;
      }

      doc.open();
      doc.write(htmlContent);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          resolve(true);
        } catch (err) {
          console.error('Error printing html in iframe:', err);
          window.print();
          resolve(true);
        }
      }, 150);
    } catch (err) {
      console.error('printHtmlViaIframe failed:', err);
      window.print();
      resolve(false);
    }
  });
}
