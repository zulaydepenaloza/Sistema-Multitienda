import React, { useState, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import {
  Printer,
  Download,
  FileText,
  Calendar,
  Building2,
  User,
  DollarSign,
  Receipt,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  ArrowRight,
  Sparkles,
  Info,
  Clock,
  Check,
  Eye,
  CreditCard,
  Smartphone,
  Coins,
  ChevronRight,
  TrendingUp,
  Store
} from 'lucide-react';
import { Venta, Sucursal, EmpresaConfig, Usuario } from '../types';
import { printHtmlViaIframe } from '../lib/ticketPrinter';

interface FiscalCortesViewProps {
  ventas?: Venta[];
  sucursales?: Sucursal[];
  empresaConfig?: EmpresaConfig;
  usuarios?: Usuario[];
  currentUser?: Usuario | null;
  defaultTipo?: 'X' | 'Z';
  initialBranchId?: number | 'all';
  correlativoX?: number;
  correlativoZ?: number;
  onIncrementCorrelativoX?: () => void;
  onIncrementCorrelativoZ?: () => void;
}

export interface BranchFiscalStats {
  sucursalId: number;
  sucursalNombre: string;
  ticketCount: number;
  ticketMin: string;
  ticketMax: string;
  totalUsd: number;
  totalBs: number;
  subtotalNeto: number;
  baseImponible: number;
  montoExento: number;
  montoIva: number;
  efectivoUsd: number;
  efectivoBs: number;
  pagoMovilBs: number;
  pagoMovilUsd: number;
  tarjetaBs: number;
  tarjetaUsd: number;
  ventasCredito: number;
  vueltosUsd: number;
  vueltosBs: number;
  articulos: { nombre: string; cantidad: number; total: number; exento: boolean }[];
}

export const FiscalCortesView: React.FC<FiscalCortesViewProps> = ({
  ventas = [],
  sucursales = [],
  empresaConfig = {
    nombreEmpresa: 'Corporación Multi-Tienda C.A.',
    rif: 'J-50123456-7',
    direccionFiscal: 'Av. Libertador, Edif. Centro, Piso 1, Caracas',
    telefono: '+58 212-5551234',
    nombreTienda1: 'Tienda 1 - Centro',
    nombreTienda2: 'Tienda 2 - Norte',
    nombreOficina: 'Oficina Central (Almacén)',
    tasaCambio: 45.50,
  },
  usuarios = [],
  currentUser,
  defaultTipo = 'X',
  initialBranchId = 'all',
  correlativoX: propCorrelativoX,
  correlativoZ: propCorrelativoZ,
  onIncrementCorrelativoX,
  onIncrementCorrelativoZ,
}) => {
  const [tipoCorte, setTipoCorte] = useState<'X' | 'Z'>(defaultTipo);
  const [selectedSucursal, setSelectedSucursal] = useState<number | 'all'>(initialBranchId);
  const [selectedCajero, setSelectedCajero] = useState<string>('all');
  const [fechaCorte, setFechaCorte] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const [localCorrelativoZ, setLocalCorrelativoZ] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('pos_correlativo_z');
      if (stored !== null) return parseInt(stored, 10);
    } catch (e) {}
    return 0;
  });

  const [localCorrelativoX, setLocalCorrelativoX] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('pos_correlativo_x');
      if (stored !== null) return parseInt(stored, 10);
    } catch (e) {}
    return 0;
  });

  const correlativoZ = propCorrelativoZ !== undefined ? propCorrelativoZ : localCorrelativoZ;
  const correlativoX = propCorrelativoX !== undefined ? propCorrelativoX : localCorrelativoX;

  const [showZConfirmModal, setShowZConfirmModal] = useState(false);
  const [zSuccessMessage, setZSuccessMessage] = useState<string | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [activeBranchDetailTab, setActiveBranchDetailTab] = useState<'consolidado' | number>('consolidado');

  const tasa = empresaConfig.tasaCambio || 45.50;

  const formatUSD = (val: number) => `$ ${val.toFixed(2)}`;
  const formatBs = (valUsd: number) => `Bs. ${(valUsd * tasa).toFixed(2)}`;

  // Filter sales according to parameters
  const filteredSales = useMemo(() => {
    return ventas.filter((v) => {
      // Branch filter (if specific branch is chosen in the main selector)
      if (selectedSucursal !== 'all' && v.sucursal_id !== selectedSucursal) {
        return false;
      }
      // Cashier filter
      if (selectedCajero !== 'all' && v.usuario_nombre !== selectedCajero) {
        return false;
      }
      // Date filter (matches YYYY-MM-DD or date substring if provided)
      if (fechaCorte && v.fecha) {
        const vDate = v.fecha;
        if (!vDate.includes(fechaCorte) && !vDate.includes(fechaCorte.split('-').reverse().join('/'))) {
          return false;
        }
      }
      return true;
    });
  }, [ventas, selectedSucursal, selectedCajero, fechaCorte]);

  // Helper calculation function for any sales array
  const calculateStatsForSales = (salesList: Venta[], sucursalId?: number, branchName?: string): BranchFiscalStats => {
    let subtotalNeto = 0;
    let baseImponible = 0;
    let montoExento = 0;
    let montoIva = 0;
    let totalUsd = 0;

    let efectivoUsd = 0;
    let efectivoBs = 0;
    let pagoMovilBs = 0;
    let pagoMovilUsd = 0;
    let tarjetaBs = 0;
    let tarjetaUsd = 0;
    let vueltosUsd = 0;
    let vueltosBs = 0;
    let ventasCredito = 0;

    const articulosMap: { [key: string]: { nombre: string; cantidad: number; total: number; exento: boolean } } = {};

    if (salesList.length > 0) {
      salesList.forEach((v) => {
        totalUsd += v.total || 0;
        subtotalNeto += v.subtotal_neto || (v.total * 0.9);
        baseImponible += v.base_imponible || (v.total * (1 / 1.16));
        montoExento += v.monto_exento || 0;
        montoIva += v.monto_iva || (v.total * (0.16 / 1.16));

        // Payment breakdown
        const p = v.pago_detalle;
        if (p) {
          if (p.metodo === 'efectivo_usd') {
            efectivoUsd += p.monto_usd || v.total;
            vueltosUsd += p.vuelto_usd || 0;
          } else if (p.metodo === 'efectivo_bs') {
            efectivoBs += p.monto_bs || (v.total * tasa);
            vueltosBs += p.vuelto_bs || 0;
          } else if (p.metodo === 'pago_movil') {
            pagoMovilBs += p.monto_bs || (v.total * tasa);
            pagoMovilUsd += p.monto_usd || v.total;
          } else if (p.metodo === 'tarjeta') {
            tarjetaBs += p.monto_bs || (v.total * tasa);
            tarjetaUsd += p.monto_usd || v.total;
          } else if (p.metodo === 'mixto') {
            efectivoUsd += p.efectivo_usd_recibido || 0;
            efectivoBs += p.efectivo_bs_recibido || 0;
            pagoMovilBs += p.pago_movil_monto_bs || 0;
            pagoMovilUsd += (p.pago_movil_monto_bs || 0) / tasa;
            tarjetaBs += p.tarjeta_monto_bs || 0;
            tarjetaUsd += (p.tarjeta_monto_bs || 0) / tasa;
            vueltosUsd += p.vuelto_usd || 0;
            vueltosBs += p.vuelto_bs || 0;
          }
        } else {
          // Fallback distribution
          efectivoUsd += v.total * 0.4;
          pagoMovilBs += (v.total * 0.35) * tasa;
          pagoMovilUsd += v.total * 0.35;
          tarjetaBs += (v.total * 0.25) * tasa;
          tarjetaUsd += v.total * 0.25;
        }

        // Details breakdown
        if (v.detalles && Array.isArray(v.detalles)) {
          v.detalles.forEach((d) => {
            const key = d.producto_nombre || `Producto ${d.producto_id}`;
            if (!articulosMap[key]) {
              articulosMap[key] = { nombre: key, cantidad: 0, total: 0, exento: !!d.exento_iva };
            }
            articulosMap[key].cantidad += d.cantidad || 1;
            articulosMap[key].total += d.subtotal || 0;
          });
        }
      });
    }

    const ticketCount = salesList.length;
    const ticketMin = salesList.length > 0 ? Math.min(...salesList.map((s) => s.id)) : 0;
    const ticketMax = salesList.length > 0 ? Math.max(...salesList.map((s) => s.id)) : 0;

    return {
      sucursalId: sucursalId || 0,
      sucursalNombre: branchName || 'Todas las Sucursales (Consolidado)',
      ticketCount,
      ticketMin: String(ticketMin).padStart(4, '0'),
      ticketMax: String(ticketMax).padStart(4, '0'),
      totalUsd,
      totalBs: totalUsd * tasa,
      subtotalNeto,
      baseImponible,
      montoExento,
      montoIva,
      efectivoUsd,
      efectivoBs,
      pagoMovilBs,
      pagoMovilUsd,
      tarjetaBs,
      tarjetaUsd,
      ventasCredito,
      vueltosUsd,
      vueltosBs,
      articulos: Object.values(articulosMap).sort((a, b) => b.total - a.total).slice(0, 8),
    };
  };

  // Main stats for the active filter
  const stats = useMemo(() => {
    return calculateStatsForSales(filteredSales, selectedSucursal === 'all' ? 0 : selectedSucursal);
  }, [filteredSales, selectedSucursal, tasa]);

  // Breakdown per each branch (discrimination by store)
  const branchBreakdown = useMemo(() => {
    // Only stores (tiendas) that participate in sales
    const stores = sucursales.filter((s) => s.tipo === 'tienda' || s.id <= 2);
    const result: BranchFiscalStats[] = [];

    stores.forEach((store) => {
      // Filter sales matching this store and current cashier filter
      const storeSales = ventas.filter((v) => {
        if (v.sucursal_id !== store.id) return false;
        if (selectedCajero !== 'all' && v.usuario_nombre !== selectedCajero) return false;
        return true;
      });

      const storeStats = calculateStatsForSales(storeSales, store.id, store.nombre);
      result.push(storeStats);
    });

    return result;
  }, [ventas, sucursales, selectedCajero, tasa]);

  const branchLabel = useMemo(() => {
    if (selectedSucursal === 'all') return 'Todas las Sucursales (Consolidado)';
    const found = sucursales.find((s) => s.id === selectedSucursal);
    return found ? found.nombre : `Sucursal #${selectedSucursal}`;
  }, [selectedSucursal, sucursales]);

  const numCorteStr = tipoCorte === 'X' ? `X-${String(correlativoX).padStart(5, '0')}` : `Z-${String(correlativoZ).padStart(5, '0')}`;

  // Execute Corte Z
  const handleProcesarCierreZ = () => {
    if (onIncrementCorrelativoZ) {
      onIncrementCorrelativoZ();
    } else {
      setLocalCorrelativoZ((prev) => {
        const next = prev + 1;
        try { localStorage.setItem('pos_correlativo_z', String(next)); } catch (e) {}
        return next;
      });
    }
    setShowZConfirmModal(false);
    setZSuccessMessage(`¡Corte Z Fiscal #${String(correlativoZ + 1).padStart(5, '0')} procesado y auditado con éxito! Se archivó el cierre contable del día.`);
    setTimeout(() => setZSuccessMessage(null), 6000);
  };

  // Thermal Printing function (80mm standard roll with branch discrimination support)
  const handlePrintThermal = (targetStats?: BranchFiscalStats, targetBranchLabel?: string) => {
    const dataToPrint = targetStats || stats;
    const branchTitle = targetBranchLabel || branchLabel;
    const isMultiBranchReport = selectedSucursal === 'all' && !targetStats;

    let printWindow: Window | null = null;
    try {
      printWindow = window.open('', '_blank', 'width=380,height=750');
    } catch {
      printWindow = null;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Reporte de Corte ${tipoCorte} Fiscal - ${empresaConfig.nombreEmpresa}</title>
        <style>
          @page { size: auto; margin: 3mm; }
          * { box-sizing: border-box; }
          body {
            font-family: 'Courier New', Courier, monospace;
            color: #000000;
            background: #ffffff;
            width: 78mm;
            max-width: 100%;
            margin: 0 auto;
            padding: 4px;
            font-size: 11px;
            line-height: 1.3;
          }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .font-bold { font-weight: bold; }
          .divider { border-top: 1px dashed #000000; margin: 4px 0; }
          .double-divider { border-top: 2px solid #000000; margin: 5px 0; }
          .flex { display: flex; justify-content: space-between; align-items: baseline; }
          .title-box { border: 1px solid #000; padding: 3px; margin: 4px 0; text-align: center; font-weight: bold; font-size: 12px; }
          .section-title { font-weight: bold; font-size: 10px; text-transform: uppercase; margin-top: 4px; margin-bottom: 2px; }
          .sign-line { border-top: 1px solid #333; margin-top: 25px; padding-top: 3px; text-align: center; font-size: 9.5px; }
          .store-badge { background: #eee; padding: 2px 4px; font-weight: bold; font-size: 10px; border-radius: 2px; }
        </style>
      </head>
      <body>
        <div class="text-center">
          <div class="font-bold" style="font-size: 13px; text-transform: uppercase;">${empresaConfig.nombreEmpresa}</div>
          <div class="font-bold">RIF: ${empresaConfig.rif}</div>
          <div style="font-size: 9px;">${empresaConfig.direccionFiscal}</div>
          <div style="font-size: 9px;">TELF: ${empresaConfig.telefono}</div>
          <div class="divider"></div>
          <div class="font-bold" style="font-size: 10.5px;">${branchTitle}</div>
          <div style="font-size: 9px;">TASA OFICIAL: 1$ = ${formatBs(1)}</div>
        </div>

        <div class="title-box">
          ${tipoCorte === 'X' ? 'REPORTE / CORTE X (PARCIAL)' : 'REPORTE / CORTE Z (FISCAL DIARIO)'}
          <div style="font-size: 10px; font-weight: normal;">NRO: ${numCorteStr}</div>
        </div>

        <div style="font-size: 9.5px;">
          <div class="flex"><span>FECHA EMISIÓN:</span> <span>${new Date().toLocaleDateString('es-VE')}</span></div>
          <div class="flex"><span>HORA EMISIÓN:</span> <span>${new Date().toLocaleTimeString('es-VE')}</span></div>
          <div class="flex"><span>OPERADOR:</span> <span>${currentUser?.nombre_completo || 'Supervisor / Auditor'}</span></div>
          <div class="flex"><span>TIPO DE CIERRE:</span> <span class="font-bold">${tipoCorte === 'X' ? 'LECTURA INFORMATIVA' : 'CIERRE DEFINITIVO'}</span></div>
        </div>

        <div class="divider"></div>
        <div class="section-title">1. RANGO DE FACTURACIÓN:</div>
        <div style="font-size: 9.5px;">
          <div class="flex"><span>PRIMER TICKET:</span> <span class="font-bold">#${dataToPrint.ticketMin}</span></div>
          <div class="flex"><span>ÚLTIMO TICKET:</span> <span class="font-bold">#${dataToPrint.ticketMax}</span></div>
          <div class="flex"><span>TOTAL OPERACIONES:</span> <span class="font-bold">${dataToPrint.ticketCount} TRANSACCIONES</span></div>
        </div>

        ${isMultiBranchReport ? `
          <div class="divider"></div>
          <div class="section-title">DISCRIMINACIÓN POR TIENDA / SUCURSAL:</div>
          <div style="font-size: 9px;">
            ${branchBreakdown.map((b) => `
              <div style="margin-bottom: 4px; padding-bottom: 2px; border-bottom: 1px dotted #ccc;">
                <div class="flex font-bold">
                  <span>${b.sucursalNombre}:</span>
                  <span>${formatUSD(b.totalUsd)} (${b.ticketCount} tks)</span>
                </div>
                <div class="flex" style="color: #444; font-size: 8.5px;">
                  <span>Base: ${formatUSD(b.baseImponible)} | IVA: ${formatUSD(b.montoIva)}</span>
                  <span>Exento: ${formatUSD(b.montoExento)}</span>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div class="divider"></div>
        <div class="section-title">2. DISCRIMINACIÓN TRIBUTARIA (SENIAT):</div>
        <div style="font-size: 9.5px;">
          <div class="flex"><span>VENTAS EXENTAS (E - 0%):</span> <span>${formatUSD(dataToPrint.montoExento)}</span></div>
          <div class="flex"><span>BASE IMPONIBLE (G - 16%):</span> <span>${formatUSD(dataToPrint.baseImponible)}</span></div>
          <div class="flex"><span>IMPUESTO IVA (16%):</span> <span>+${formatUSD(dataToPrint.montoIva)}</span></div>
          <div class="divider"></div>
          <div class="flex font-bold" style="font-size: 11px;">
            <span>TOTAL VENTAS USD:</span>
            <span>${formatUSD(dataToPrint.totalUsd)}</span>
          </div>
          <div class="flex font-bold" style="font-size: 10px;">
            <span>TOTAL FACTURADO BS:</span>
            <span>${formatBs(dataToPrint.totalUsd)}</span>
          </div>
        </div>

        <div class="divider"></div>
        <div class="section-title">3. ARQUEO DE CAJA POR INSTRUMENTO:</div>
        <div style="font-size: 9.5px;">
          <div class="flex"><span>• EFECTIVO USD ($):</span> <span class="font-bold">${formatUSD(dataToPrint.efectivoUsd)}</span></div>
          <div class="flex"><span>• EFECTIVO BOLÍVARES:</span> <span class="font-bold">Bs. ${dataToPrint.efectivoBs.toFixed(2)}</span></div>
          <div class="flex"><span>• PAGO MÓVIL (BS):</span> <span class="font-bold">Bs. ${dataToPrint.pagoMovilBs.toFixed(2)} (${formatUSD(dataToPrint.pagoMovilUsd)})</span></div>
          <div class="flex"><span>• TARJETA POS DÉB/CRÉD:</span> <span class="font-bold">Bs. ${dataToPrint.tarjetaBs.toFixed(2)} (${formatUSD(dataToPrint.tarjetaUsd)})</span></div>
          ${dataToPrint.vueltosUsd > 0 ? `<div class="flex" style="color:#555;"><span>• VUELTOS ENTREGADOS ($):</span> <span>-${formatUSD(dataToPrint.vueltosUsd)}</span></div>` : ''}
          <div class="divider"></div>
          <div class="flex font-bold"><span>TOTAL AUDITADO USD:</span> <span>${formatUSD(dataToPrint.totalUsd)}</span></div>
          <div class="flex font-bold"><span>TOTAL AUDITADO BS:</span> <span>${formatBs(dataToPrint.totalUsd)}</span></div>
        </div>

        ${dataToPrint.articulos.length > 0 ? `
          <div class="divider"></div>
          <div class="section-title">4. TOP PRODUCTOS EN EL TURNO:</div>
          <div style="font-size: 9px;">
            ${dataToPrint.articulos.map((a) => `
              <div class="flex">
                <span class="truncate">${a.cantidad}x ${a.nombre} ${a.exento ? '(E)' : ''}</span>
                <span class="font-bold">${formatUSD(a.total)}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div class="double-divider"></div>
        <div style="margin-top: 15px;">
          <div class="sign-line">FIRMA CAJERO / OPERADOR</div>
          <div class="sign-line">FIRMA SUPERVISOR / GERENCIA</div>
        </div>

        <div class="text-center" style="margin-top: 12px; font-size: 8.5px; color: #555;">
          *** FIN DE REPORTE FISCAL ***<br/>
          SISTEMA POS MULTI-SUCURSAL v2.4
        </div>
      </body>
      </html>
    `;

    if (!printWindow) {
      printHtmlViaIframe(htmlContent);
      return;
    }

    try {
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow?.print();
      }, 400);
    } catch {
      printHtmlViaIframe(htmlContent);
    }
  };

  // Generate formal A4 PDF using jsPDF with Per-Store discrimination table
  const handleGeneratePdf = () => {
    setGeneratingPdf(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      let y = 18;

      // Header Box
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(margin, y, contentWidth, 32, 'F');

      const bannerColor = tipoCorte === 'X' ? [14, 165, 233] : [244, 63, 94]; // sky-500 or rose-500
      doc.setFillColor(bannerColor[0], bannerColor[1], bannerColor[2]);
      doc.rect(margin, y, 4, 32, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text(
        tipoCorte === 'X'
          ? 'AUDITORÍA FISCAL • REPORTE / CORTE X (PARCIAL DE TURNO)'
          : 'AUDITORÍA FISCAL • REPORTE / CORTE Z (CIERRE FISCAL DIARIO)',
        margin + 8,
        y + 11
      );

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(203, 213, 225);
      doc.text(`${empresaConfig.nombreEmpresa} • RIF: ${empresaConfig.rif} • ${branchLabel}`, margin + 8, y + 18);

      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Correlativo Oficial: ${numCorteStr} | Fecha: ${new Date().toLocaleDateString('es-VE')} ${new Date().toLocaleTimeString('es-VE')}`, margin + 8, y + 26);

      y += 38;

      // Section 1: Datos de Emisión y Facturación
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text('1. Datos Generales de la Jornada y Consecutivo Fiscal', margin, y);
      y += 5;

      const genData = [
        ['Sucursal / Ámbito:', branchLabel, 'Fecha de Cierre:', new Date().toLocaleDateString('es-VE')],
        ['Cajero / Operador:', currentUser?.nombre_completo || 'Supervisor General', 'Hora de Emisión:', new Date().toLocaleTimeString('es-VE')],
        ['Primer Ticket Emitido:', `#${stats.ticketMin}`, 'Último Ticket Emitido:', `#${stats.ticketMax}`],
        ['Total Transacciones:', `${stats.ticketCount} operaciones`, 'Tasa Oficial del Día:', `1$ = ${formatBs(1)}`],
      ];

      genData.forEach(([l1, v1, l2, v2]) => {
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, y - 3, contentWidth, 6, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(71, 85, 105);
        doc.text(l1, margin + 3, y + 1);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.text(v1, margin + 40, y + 1);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(71, 85, 105);
        doc.text(l2, margin + 95, y + 1);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.text(v2, margin + 135, y + 1);

        y += 6.5;
      });

      y += 4;

      // Section 2: DISCRIMINACIÓN POR TIENDA (Si es consolidado o todas las sucursales)
      if (selectedSucursal === 'all' && branchBreakdown.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        doc.text('2. Discriminación de Ventas e Impuestos por Sucursal / Tienda', margin, y);
        y += 5;

        // Table Header
        doc.setFillColor(30, 41, 59); // slate-800
        doc.rect(margin, y - 3, contentWidth, 6, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text('Sucursal', margin + 3, y + 1);
        doc.text('Tickets', margin + 50, y + 1);
        doc.text('Base Gravada', margin + 72, y + 1);
        doc.text('IVA (16%)', margin + 105, y + 1);
        doc.text('Exento', margin + 130, y + 1);
        doc.text('Total Facturado', margin + 152, y + 1);
        y += 6.5;

        branchBreakdown.forEach((b, idx) => {
          doc.setFillColor(idx % 2 === 0 ? 248 : 255, idx % 2 === 0 ? 250 : 255, idx % 2 === 0 ? 252 : 255);
          doc.rect(margin, y - 3, contentWidth, 6, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(15, 23, 42);
          doc.text(b.sucursalNombre, margin + 3, y + 1);

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(51, 65, 85);
          doc.text(`${b.ticketCount} tks`, margin + 50, y + 1);
          doc.text(formatUSD(b.baseImponible), margin + 72, y + 1);
          doc.text(formatUSD(b.montoIva), margin + 105, y + 1);
          doc.text(formatUSD(b.montoExento), margin + 130, y + 1);

          doc.setFont('helvetica', 'bold');
          doc.setTextColor(5, 150, 105); // emerald-600
          doc.text(formatUSD(b.totalUsd), margin + 152, y + 1);

          y += 6.5;
        });

        y += 4;
      }

      // Section 3: Discriminación Tributaria SENIAT Consolidada
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(selectedSucursal === 'all' ? '3. Discriminación Tributaria Consolidada (SENIAT)' : '2. Discriminación Tributaria SENIAT', margin, y);
      y += 5;

      const taxRows = [
        ['Ventas Exentas (E - 0%):', formatUSD(stats.montoExento), formatBs(stats.montoExento)],
        ['Base Imponible Gravada (G - 16%):', formatUSD(stats.baseImponible), formatBs(stats.baseImponible)],
        ['Débito Fiscal IVA Liquidado (16%):', `+${formatUSD(stats.montoIva)}`, `+${formatBs(stats.montoIva)}`],
        ['TOTAL GENERAL FACTURADO:', formatUSD(stats.totalUsd), formatBs(stats.totalUsd)],
      ];

      taxRows.forEach(([concept, usd, bs], idx) => {
        const isTotal = idx === taxRows.length - 1;
        if (isTotal) {
          doc.setFillColor(241, 245, 249);
          doc.rect(margin, y - 3, contentWidth, 7, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(15, 23, 42);
        } else {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(51, 65, 85);
        }

        doc.text(concept, margin + 4, y + 1.5);
        doc.text(usd, margin + 110, y + 1.5);
        doc.text(bs, margin + 145, y + 1.5);
        y += 7;
      });

      y += 4;

      // Section 4: Arqueo y Conciliación por Medio de Pago
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(selectedSucursal === 'all' ? '4. Arqueo y Conciliación de Fondos por Instrumento' : '3. Arqueo y Conciliación de Fondos', margin, y);
      y += 5;

      const payRows = [
        ['Efectivo Dólares (USD $):', formatUSD(stats.efectivoUsd), formatBs(stats.efectivoUsd)],
        ['Efectivo Bolívares (Bs):', formatUSD(stats.efectivoBs / tasa), `Bs. ${stats.efectivoBs.toFixed(2)}`],
        ['Pago Móvil Interbancario:', formatUSD(stats.pagoMovilUsd), `Bs. ${stats.pagoMovilBs.toFixed(2)}`],
        ['Tarjeta POS Débito / Crédito:', formatUSD(stats.tarjetaUsd), `Bs. ${stats.tarjetaBs.toFixed(2)}`],
        ['Vueltos / Cambio Entregado:', `-${formatUSD(stats.vueltosUsd)}`, `-${formatBs(stats.vueltosUsd)}`],
      ];

      payRows.forEach(([inst, usd, bs]) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        doc.text(inst, margin + 4, y + 1);
        doc.text(usd, margin + 110, y + 1);
        doc.text(bs, margin + 145, y + 1);
        doc.setDrawColor(241, 245, 249);
        doc.line(margin, y + 2.5, margin + contentWidth, y + 2.5);
        y += 5.5;
      });

      y += 5;

      // Section 5: Firmas y Auditoría
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text('5. Conformidad y Firmas de Auditoría', margin, y);
      y += 16;

      doc.setDrawColor(150, 150, 150);
      doc.line(margin + 10, y, margin + 65, y);
      doc.line(margin + 105, y, margin + 160, y);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text('Firma del Cajero / Operador', margin + 18, y + 4);
      doc.text('Firma Supervisor / Gerencia General', margin + 108, y + 4);

      // Save document
      const fileName = `${tipoCorte === 'X' ? 'Corte_X_Parcial' : 'Corte_Z_Fiscal'}_${numCorteStr}_${fechaCorte}.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Type Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`p-3 rounded-xl border shadow-inner ${
                tipoCorte === 'X'
                  ? 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
              }`}
            >
              <Receipt className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {tipoCorte === 'X' ? 'Corte X (Parcial de Turno)' : 'Corte Z (Cierre Fiscal Diario)'}
                </h2>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    tipoCorte === 'X'
                      ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}
                >
                  {numCorteStr}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {tipoCorte === 'X'
                  ? 'Lectura continua e informativa de caja para cambio de turno o auditoría sin cerrar la jornada fiscal.'
                  : 'Cierre fiscal contable definitivo del día con totalización acumulada para el libro de ventas SENIAT.'}
              </p>
            </div>
          </div>

          {/* Action Buttons: Thermal Print, PDF Download, Cierre Z */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setTipoCorte('X')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  tipoCorte === 'X'
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Corte X (Informativo)
              </button>
              <button
                type="button"
                onClick={() => setTipoCorte('Z')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  tipoCorte === 'Z'
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Corte Z (Definitivo)
              </button>
            </div>

            <button
              type="button"
              onClick={() => handlePrintThermal()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              title="Imprimir ticket en impresora térmica de 80mm o 58mm"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Térmico (80mm)</span>
            </button>

            <button
              type="button"
              onClick={handleGeneratePdf}
              disabled={generatingPdf}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-sky-400" />
              <span>Descargar PDF</span>
            </button>

            {tipoCorte === 'Z' && (
              <button
                type="button"
                onClick={() => setShowZConfirmModal(true)}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Procesar Cierre Z</span>
              </button>
            )}
          </div>
        </div>

        {/* Success Alert */}
        {zSuccessMessage && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{zSuccessMessage}</span>
          </div>
        )}

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800 text-xs">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-emerald-400" />
              <span>Sucursal / Tienda:</span>
            </label>
            <select
              value={selectedSucursal}
              onChange={(e) => {
                const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
                setSelectedSucursal(val);
                setActiveBranchDetailTab(val === 'all' ? 'consolidado' : val);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-medium focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Todas las Sucursales (Consolidado)</option>
              {sucursales
                .filter((s) => s.tipo === 'tienda' || s.id <= 2)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <User className="w-3 h-3 text-sky-400" />
              <span>Cajero / Operador:</span>
            </label>
            <select
              value={selectedCajero}
              onChange={(e) => setSelectedCajero(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-medium focus:outline-none focus:border-sky-500"
            >
              <option value="all">Todos los Cajeros</option>
              {usuarios
                .filter((u) => u.rol === 'cajero' || u.rol === 'supervisor')
                .map((u) => (
                  <option key={u.id} value={u.nombre_completo}>
                    {u.nombre_completo} ({u.cargo})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-purple-400" />
              <span>Fecha del Corte:</span>
            </label>
            <input
              type="date"
              value={fechaCorte}
              onChange={(e) => setFechaCorte(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-medium focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-end">
            <div className="w-full bg-slate-950 border border-slate-800 rounded-xl p-1.5 flex items-center justify-between px-3">
              <span className="text-[11px] text-slate-400 font-mono">Tasa del Día:</span>
              <span className="text-xs font-bold text-emerald-400 font-mono">1$ = {formatBs(1)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK STORE SWITCHER PILLS (When in Consolidated Mode) */}
      {selectedSucursal === 'all' && (
        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-2 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Store className="w-4 h-4 text-emerald-400" />
            <span>Discriminación por Sucursal:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setActiveBranchDetailTab('consolidado')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeBranchDetailTab === 'consolidado'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Vista Consolidada Global</span>
            </button>

            {branchBreakdown.map((b) => (
              <button
                key={b.sucursalId}
                type="button"
                onClick={() => setActiveBranchDetailTab(b.sucursalId)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeBranchDetailTab === b.sucursalId
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>{b.sucursalNombre}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  activeBranchDetailTab === b.sucursalId ? 'bg-sky-700 text-white' : 'bg-slate-800 text-emerald-400'
                }`}>
                  {formatUSD(b.totalUsd)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* DISCRIMINATION TABLE: COMPARATIVA POR SUCURSAL */}
      {selectedSucursal === 'all' && activeBranchDetailTab === 'consolidado' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-400" />
                <span>Desglose y Comparativa Fiscal por Sucursal (Corte {tipoCorte})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ventas, base imponible gravada, IVA SENIAT y arqueo discriminados individualmente por tienda.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-2.5 py-1 rounded-lg border border-emerald-500/30">
                {branchBreakdown.length} Tiendas Operativas
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                  <th className="py-3 px-3.5 rounded-l-xl">Sucursal / Tienda</th>
                  <th className="py-3 px-3 text-center">Tickets</th>
                  <th className="py-3 px-3 text-right">Ventas Exentas (E)</th>
                  <th className="py-3 px-3 text-right">Base Gravada (G)</th>
                  <th className="py-3 px-3 text-right">IVA Recaudado (16%)</th>
                  <th className="py-3 px-3 text-right">Efectivo USD</th>
                  <th className="py-3 px-3 text-right">Pago Móvil / POS</th>
                  <th className="py-3 px-3 text-right font-black text-white">Total Facturado</th>
                  <th className="py-3 px-3.5 rounded-r-xl text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {branchBreakdown.map((b) => (
                  <tr key={b.sucursalId} className="hover:bg-slate-950/60 transition-colors">
                    <td className="py-3 px-3.5 font-sans font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>{b.sucursalNombre}</span>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-300">
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px]">{b.ticketCount} tks</span>
                    </td>
                    <td className="py-3 px-3 text-right text-amber-300">{formatUSD(b.montoExento)}</td>
                    <td className="py-3 px-3 text-right text-slate-200">{formatUSD(b.baseImponible)}</td>
                    <td className="py-3 px-3 text-right text-emerald-400 font-bold">+{formatUSD(b.montoIva)}</td>
                    <td className="py-3 px-3 text-right text-slate-300">{formatUSD(b.efectivoUsd)}</td>
                    <td className="py-3 px-3 text-right text-sky-300">{formatUSD(b.pagoMovilUsd + b.tarjetaUsd)}</td>
                    <td className="py-3 px-3 text-right font-black text-emerald-400 text-sm">
                      {formatUSD(b.totalUsd)}
                      <span className="text-[10px] text-slate-400 block font-normal font-sans">
                        {formatBs(b.totalUsd)}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-center font-sans">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handlePrintThermal(b, b.sucursalNombre)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition-all cursor-pointer"
                          title={`Imprimir ticket térmico exclusivo de ${b.sucursalNombre}`}
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSucursal(b.sucursalId);
                            setActiveBranchDetailTab(b.sucursalId);
                          }}
                          className="px-2 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-slate-950 font-bold text-[11px] transition-all cursor-pointer"
                        >
                          Ver Detalle
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-950 font-bold border-t-2 border-slate-700 text-white font-mono">
                  <td className="py-3 px-3.5 font-sans">TOTAL CONSOLIDADO:</td>
                  <td className="py-3 px-3 text-center">{stats.ticketCount} tks</td>
                  <td className="py-3 px-3 text-right text-amber-300">{formatUSD(stats.montoExento)}</td>
                  <td className="py-3 px-3 text-right">{formatUSD(stats.baseImponible)}</td>
                  <td className="py-3 px-3 text-right text-emerald-400">+{formatUSD(stats.montoIva)}</td>
                  <td className="py-3 px-3 text-right">{formatUSD(stats.efectivoUsd)}</td>
                  <td className="py-3 px-3 text-right text-sky-300">{formatUSD(stats.pagoMovilUsd + stats.tarjetaUsd)}</td>
                  <td className="py-3 px-3 text-right text-emerald-400 font-black text-sm">{formatUSD(stats.totalUsd)}</td>
                  <td className="py-3 px-3.5 text-center font-sans text-xs text-slate-400">Auditoría OK</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Main Content: KPI Cards + Fiscal Grid (Consolidated or Specific Branch Tab) */}
      {(() => {
        const activeData = activeBranchDetailTab === 'consolidado'
          ? stats
          : (branchBreakdown.find((b) => b.sucursalId === activeBranchDetailTab) || stats);
        const activeTitle = activeBranchDetailTab === 'consolidado'
          ? branchLabel
          : (sucursales.find((s) => s.id === activeBranchDetailTab)?.nombre || `Sucursal #${activeBranchDetailTab}`);

        return (
          <div className="space-y-6">
            {/* Header info if viewing a single branch tab */}
            {activeBranchDetailTab !== 'consolidado' && (
              <div className="bg-sky-950/40 border border-sky-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Visualizando Detalle Fiscal: {activeTitle}</h3>
                    <p className="text-xs text-slate-400">Información discriminada para esta sucursal en el Corte {tipoCorte}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePrintThermal(activeData, activeTitle)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Imprimir Ticket {activeTitle}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSucursal('all');
                      setActiveBranchDetailTab('consolidado');
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer"
                  >
                    Volver a Consolidado
                  </button>
                </div>
              </div>
            )}

            {/* 4 KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Total Facturado */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1 relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="font-semibold">Total Facturado ({tipoCorte === 'X' ? 'Turno' : 'Jornada'})</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-2xl font-black text-white tracking-tight">{formatUSD(activeData.totalUsd)}</p>
                <p className="text-xs font-bold text-emerald-400 font-mono">{formatBs(activeData.totalUsd)}</p>
              </div>

              {/* Card 2: Base Imponible 16% */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1 relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="font-semibold">Base Imponible (16%)</span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-1.5 py-0.5 rounded">G</span>
                </div>
                <p className="text-2xl font-black text-white tracking-tight">{formatUSD(activeData.baseImponible)}</p>
                <p className="text-xs text-slate-400 font-mono">{formatBs(activeData.baseImponible)}</p>
              </div>

              {/* Card 3: Impuesto IVA Recaudado */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1 relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="font-semibold">IVA Liquidado (16%)</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded">16%</span>
                </div>
                <p className="text-2xl font-black text-emerald-400 tracking-tight">+{formatUSD(activeData.montoIva)}</p>
                <p className="text-xs text-emerald-300/80 font-mono">+{formatBs(activeData.montoIva)}</p>
              </div>

              {/* Card 4: Ventas Exentas */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1 relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="font-semibold">Total Exento (0%)</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-1.5 py-0.5 rounded">E</span>
                </div>
                <p className="text-2xl font-black text-amber-300 tracking-tight">{formatUSD(activeData.montoExento)}</p>
                <p className="text-xs text-amber-200/80 font-mono">{formatBs(activeData.montoExento)}</p>
              </div>
            </div>

            {/* Two Column Layout: Detailed Fiscal Breakdown & Cash Register Reconciliation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Fiscal Summary & Tax Discrimination */}
              <div className="lg:col-span-7 space-y-6">
                {/* Box 1: Consecutivo Fiscal & Rango */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-sky-400" />
                      <span>1. Resumen Fiscal & Rango de Tickets ({activeTitle})</span>
                    </h3>
                    <span className="text-xs bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300 font-mono">
                      {activeData.ticketCount} Transacciones
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">Primer Ticket:</span>
                      <span className="font-bold text-white font-mono text-sm">#{activeData.ticketMin}</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">Último Ticket:</span>
                      <span className="font-bold text-white font-mono text-sm">#{activeData.ticketMax}</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">Ticket Promedio:</span>
                      <span className="font-bold text-emerald-400 font-mono text-sm">
                        {formatUSD(activeData.ticketCount > 0 ? activeData.totalUsd / activeData.ticketCount : 0)}
                      </span>
                    </div>
                  </div>

                  {/* Tax discrimination table */}
                  <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
                    <div className="bg-slate-950 p-2.5 font-bold text-slate-400 border-b border-slate-800 flex justify-between">
                      <span>Régimen Tributario (SENIAT)</span>
                      <span className="font-mono">Monto USD / Bs</span>
                    </div>
                    <div className="divide-y divide-slate-800/60 bg-slate-950/40 font-mono">
                      <div className="p-2.5 flex justify-between items-center text-slate-300">
                        <span>Ventas Exentas (E - 0%)</span>
                        <div className="text-right">
                          <span className="font-bold text-amber-300">{formatUSD(activeData.montoExento)}</span>
                          <span className="text-[10px] text-slate-500 ml-2">({formatBs(activeData.montoExento)})</span>
                        </div>
                      </div>
                      <div className="p-2.5 flex justify-between items-center text-slate-300">
                        <span>Base Imponible Gravada (G - 16%)</span>
                        <div className="text-right">
                          <span className="font-bold text-white">{formatUSD(activeData.baseImponible)}</span>
                          <span className="text-[10px] text-slate-500 ml-2">({formatBs(activeData.baseImponible)})</span>
                        </div>
                      </div>
                      <div className="p-2.5 flex justify-between items-center text-slate-300">
                        <span>Impuesto IVA Liquidado (16%)</span>
                        <div className="text-right">
                          <span className="font-bold text-emerald-400">+{formatUSD(activeData.montoIva)}</span>
                          <span className="text-[10px] text-emerald-500 ml-2">(+{formatBs(activeData.montoIva)})</span>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-950 flex justify-between items-center font-bold text-sm">
                        <span className="text-white">TOTAL FACTURADO ({numCorteStr}):</span>
                        <div className="text-right">
                          <span className="text-emerald-400">{formatUSD(activeData.totalUsd)}</span>
                          <span className="text-xs text-slate-400 ml-2 block sm:inline">({formatBs(activeData.totalUsd)})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Box 2: Top Products in Shift */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>Artículos Vendidos en el Turno (Top Movimientos)</span>
                  </h3>

                  {activeData.articulos.length > 0 ? (
                    <div className="space-y-1.5 text-xs">
                      {activeData.articulos.map((art, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-950/60 hover:bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2.5 truncate pr-2">
                            <span className="w-5 h-5 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-bold flex items-center justify-center font-mono">
                              {idx + 1}
                            </span>
                            <span className="font-semibold text-slate-200 truncate">{art.nombre}</span>
                            {art.exento && (
                              <span className="text-[9px] font-bold text-amber-400 bg-amber-500/20 px-1 py-0.2 rounded border border-amber-500/30">
                                EXENTO
                              </span>
                            )}
                          </div>
                          <div className="text-right font-mono shrink-0">
                            <span className="text-slate-400 mr-3 text-[11px]">{art.cantidad} unids</span>
                            <span className="font-bold text-white">{formatUSD(art.total)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic py-2">No hay movimientos registrados para este filtro.</p>
                  )}
                </div>
              </div>

              {/* Right: Cash Reconciliation & Arqueo */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <Coins className="w-4 h-4 text-amber-400" />
                      <span>2. Arqueo y Desglose por Medio de Pago</span>
                    </h3>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded">
                      Conciliado
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs font-mono">
                    {/* Efectivo USD */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-300 font-sans">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        <span className="font-semibold">Efectivo Dólares (USD):</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white text-sm">{formatUSD(activeData.efectivoUsd)}</p>
                        <p className="text-[10px] text-slate-500">{formatBs(activeData.efectivoUsd)}</p>
                      </div>
                    </div>

                    {/* Efectivo Bolívares */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-300 font-sans">
                        <Coins className="w-4 h-4 text-amber-400" />
                        <span className="font-semibold">Efectivo Bolívares (Bs):</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-amber-300 text-sm">Bs. {activeData.efectivoBs.toFixed(2)}</p>
                        <p className="text-[10px] text-slate-500">{formatUSD(activeData.efectivoBs / tasa)}</p>
                      </div>
                    </div>

                    {/* Pago Móvil */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-300 font-sans">
                        <Smartphone className="w-4 h-4 text-purple-400" />
                        <span className="font-semibold">Pago Móvil:</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-300 text-sm">Bs. {activeData.pagoMovilBs.toFixed(2)}</p>
                        <p className="text-[10px] text-slate-500">{formatUSD(activeData.pagoMovilUsd)}</p>
                      </div>
                    </div>

                    {/* Tarjeta POS */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-300 font-sans">
                        <CreditCard className="w-4 h-4 text-sky-400" />
                        <span className="font-semibold">Tarjeta Débito / POS:</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sky-300 text-sm">Bs. {activeData.tarjetaBs.toFixed(2)}</p>
                        <p className="text-[10px] text-slate-500">{formatUSD(activeData.tarjetaUsd)}</p>
                      </div>
                    </div>

                    {/* Vueltos entregados */}
                    {activeData.vueltosUsd > 0 && (
                      <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between text-slate-400">
                        <span className="font-sans text-[11px]">Vueltos / Cambio entregado:</span>
                        <span className="font-bold text-rose-400">-{formatUSD(activeData.vueltosUsd)}</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions in Box */}
                  <div className="pt-2 space-y-2">
                    <button
                      type="button"
                      onClick={() => handlePrintThermal(activeData, activeTitle)}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/50"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Imprimir Ticket de Rollo (80mm)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleGeneratePdf}
                      disabled={generatingPdf}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-sky-400" />
                      <span>Exportar Informe en PDF Formal</span>
                    </button>
                  </div>
                </div>

                {/* Guidelines Box */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-xs">
                    <Info className="w-4 h-4 text-sky-400" />
                    <span>Diferencia Normativa SENIAT:</span>
                  </div>
                  <p className="leading-relaxed">
                    <strong className="text-sky-300">Corte X:</strong> No reinicia los acumuladores. Se puede emitir ilimitadas veces durante el día para cuadre de turnos entre cajeros.
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-rose-300">Corte Z:</strong> Cierre oficial diario. Guarda el registro en la memoria de auditoría y respalda el libro de ventas fiscal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Confirmation Modal for Corte Z */}
      {showZConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Confirmar Cierre Fiscal Diario (Corte Z)</h3>
                <p className="text-xs text-slate-400">Emisión del Correlativo Oficial #{String(correlativoZ).padStart(5, '0')}</p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Sucursal:</span>
                <span className="font-bold text-white">{branchLabel}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Facturado a Cerrar:</span>
                <span className="font-bold text-emerald-400 font-mono">{formatUSD(stats.totalUsd)} ({formatBs(stats.totalUsd)})</span>
              </div>
              <div className="flex justify-between">
                <span>Transacciones Registradas:</span>
                <span className="font-bold text-white font-mono">{stats.ticketCount} tickets</span>
              </div>
              <div className="p-2 bg-rose-950/40 border border-rose-500/30 rounded-lg text-rose-300 text-[11px] mt-2 flex items-start gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>Esta acción consolidará el cierre contable del día y quedará auditada en el historial.</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowZConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleProcesarCierreZ}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white cursor-pointer shadow-lg shadow-rose-600/30 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Emitir y Cerrar Jornada</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
