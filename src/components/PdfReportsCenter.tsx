import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { 
  FileText, 
  Download, 
  Printer, 
  Briefcase, 
  Code2, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  Sparkles,
  Building2,
  DollarSign,
  TrendingUp,
  Cpu,
  Server,
  Zap,
  Lock,
  ArrowRight,
  Code,
  Receipt
} from 'lucide-react';
import { StandaloneHtmlDownloader } from './StandaloneHtmlDownloader';
import { FiscalCortesView } from './FiscalCortesView';
import { downloadStandaloneHtmlFile } from '../lib/downloadHtml';
import { Usuario, Venta, Sucursal, EmpresaConfig } from '../types';
import { AITechFooter } from './AITechFooter';

interface PdfReportsCenterProps {
  currentUser?: Usuario | null;
  ventas?: Venta[];
  sucursales?: Sucursal[];
  empresaConfig?: EmpresaConfig;
  usuarios?: Usuario[];
  correlativoX?: number;
  correlativoZ?: number;
  onIncrementCorrelativoX?: () => void;
  onIncrementCorrelativoZ?: () => void;
}

export const PdfReportsCenter: React.FC<PdfReportsCenterProps> = ({
  currentUser,
  ventas = [],
  sucursales = [],
  empresaConfig,
  usuarios = [],
  correlativoX,
  correlativoZ,
  onIncrementCorrelativoX,
  onIncrementCorrelativoZ,
}) => {
  const isGeneralManager = currentUser?.rol === 'admin';
  const [activeDoc, setActiveDoc] = useState<'cortes' | 'gerencia' | 'tecnico' | 'html'>('cortes');
  const [generatingPdf, setGeneratingPdf] = useState(false);

  // Function to generate the Technical PDF using jsPDF
  const generateTechnicalPdf = () => {
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

      const checkPageBreak = (spaceNeeded: number) => {
        if (y + spaceNeeded > 275) {
          doc.addPage();
          y = 20;
          // Add header on subsequent pages
          doc.setFontSize(8);
          doc.setTextColor(140, 140, 140);
          doc.text('INFORME TÉCNICO • SISTEMA POS MULTI-SUCURSAL & GERENCIA', margin, 10);
          doc.text('CONFIDENCIAL', pageWidth - margin - 22, 10);
          doc.setDrawColor(220, 220, 220);
          doc.line(margin, 12, pageWidth - margin, 12);
        }
      };

      // --- COVER / HEADER ---
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(margin, y, contentWidth, 32, 'F');
      
      doc.setFillColor(16, 185, 129); // emerald-500
      doc.rect(margin, y, 4, 32, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.setTextColor(255, 255, 255);
      doc.text('INFORME TÉCNICO DE ARQUITECTURA Y DESPLIEGUE', margin + 8, y + 11);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(167, 243, 208); // emerald-200
      doc.text('Sistema Multi-Sucursal POS, Control de Inventario y Cuadro de Mando en Tiempo Real', margin + 8, y + 18);
      
      doc.setFontSize(8);
      doc.setTextColor(203, 213, 225); // slate-300
      doc.text('Versión: 2.4.0 (Supabase PostgreSQL + Client Standalone) | Fecha: ' + new Date().toLocaleDateString('es-ES'), margin + 8, y + 26);

      y += 40;

      // SECTION 1: RESUMEN EJECUTIVO TÉCNICO
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('1. Resumen Ejecutivo de la Solución Técnica', margin, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      const textSec1 = 
        'El presente sistema implementa una arquitectura Serverless / BaaS (Backend-as-a-Service) de alta disponibilidad ' +
        'y latencia ultrabaja, diseñada para interconectar dos sucursales de venta retail y una oficina central de gerencia/inventario. ' +
        'Elimina por completo la necesidad de mantener servidores físicos locales o IPs públicas fijas en las tiendas, ' +
        'centralizando el estado de datos en una base de datos relacional PostgreSQL en la nube (Supabase) con costo de infraestructura $0/mes.';
      const splitSec1 = doc.splitTextToSize(textSec1, contentWidth);
      doc.text(splitSec1, margin, y);
      y += splitSec1.length * 4.8 + 4;

      // SECTION 2: STACK TECNOLÓGICO
      checkPageBreak(40);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('2. Especificación del Stack Tecnológico', margin, y);
      y += 6;

      const techStack = [
        ['Capa de Base de Datos:', 'PostgreSQL 15+ gestionado en Supabase con soporte JSONB y Row Level Security (RLS).'],
        ['Capa de Conexión & API:', '@supabase/supabase-js v2 vía HTTPS/WSS (WebSockets para cambios en vivo).'],
        ['Capa de Aplicación POS:', 'Frontend Standalone Web SPA autónomo (HTML5, JavaScript ES6+, Tailwind CSS v4 CDN).'],
        ['Módulo Analítico Gerencial:', 'Chart.js & Recharts con procesamiento matemático de KPIs (Ingresos, Margen, Ticket).'],
        ['Periféricos Compatibles:', 'Lectores de códigos de barras USB/Bluetooth en modo emulación de teclado (HID).']
      ];

      techStack.forEach(([label, desc]) => {
        checkPageBreak(8);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(16, 185, 129);
        doc.text('• ' + label, margin + 2, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        doc.text(desc, margin + 46, y);
        y += 5.5;
      });
      y += 4;

      // SECTION 3: MODELO DE DATOS Y ESQUEMA RELACIONAL
      checkPageBreak(50);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('3. Modelo Relacional de Base de Datos (Tablas Principales)', margin, y);
      y += 6;

      const tables = [
        ['sucursales', 'id (PK), nombre, tipo (tienda | oficina), direccion, created_at'],
        ['usuarios', 'id (PK), nombre_completo, rol (cajero | supervisor | inventario | admin), pin, sucursal_id (FK)'],
        ['productos', 'id (PK), codigo_barras (UNIQUE), nombre, descripcion, precio, costo_estimado'],
        ['inventario', 'id (PK), sucursal_id (FK), producto_id (FK), stock (INT >= 0), stock_minimo'],
        ['ventas', 'id (PK), sucursal_id (FK), usuario_id (FK), total, fecha (TIMESTAMP), estado'],
        ['detalle_ventas', 'id (PK), venta_id (FK), producto_id (FK), cantidad, precio_unitario, subtotal']
      ];

      tables.forEach(([tbl, cols]) => {
        checkPageBreak(8);
        doc.setFillColor(241, 245, 249);
        doc.rect(margin, y - 3.5, contentWidth, 6, 'F');
        doc.setFont('courier', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42);
        doc.text(tbl, margin + 3, y);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        doc.text(cols, margin + 35, y);
        y += 7;
      });
      y += 4;

      // SECTION 4: SEGURIDAD Y CONTROL DE ACCESO
      checkPageBreak(45);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('4. Modelo de Seguridad y Auditoría de Usuarios (12 Cuentas)', margin, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      const textSec4 = 
        'El sistema cuenta con segregación estricta de privilegios por perfil de usuario y sucursal. ' +
        'Los cajeros únicamente tienen acceso al módulo de punto de venta y solo pueden vender ítems con stock positivo. ' +
        'Las transferencias de inventario requieren autorización de Supervisión o Almacén Central. ' +
        'Cada venta queda auditada con el ID del operador que ejecutó la transacción para trazabilidad exacta.';
      const splitSec4 = doc.splitTextToSize(textSec4, contentWidth);
      doc.text(splitSec4, margin, y);
      y += splitSec4.length * 4.5 + 4;

      // SECTION 5: PROCEDIMIENTO DE DESPLIEGUE EN LOS 3 EQUIPOS
      checkPageBreak(55);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('5. Protocolo de Despliegue e Interconexión de los 3 Equipos', margin, y);
      y += 6;

      const steps = [
        ['Paso 1: Aprovisionamiento Cloud', 'Crear proyecto en Supabase y ejecutar el script SQL con DDL y datos de semillas.'],
        ['Paso 2: Distribución del Binario HTML', 'Distribuir el archivo pos_multisucursal.html en las 3 computadoras (vía USB o red).'],
        ['Paso 3: Configuración de Credenciales', 'Abrir en Chrome/Edge, hacer clic en "Supabase Keys" y guardar Project URL y Anon Key.'],
        ['Paso 4: Asignación de Roles por Equipo', 'Equipo 1: Tienda 1 (PINs 1001-1004) | Equipo 2: Tienda 2 (PINs 2001-2004) | Equipo 3: Gerencia (PIN 9999).'],
        ['Paso 5: Verificación de Latencia', 'Escanear una venta de prueba y confirmar el descuento de stock inmediato en la consola central.']
      ];

      steps.forEach(([step, desc]) => {
        checkPageBreak(9);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42);
        doc.text(step + ':', margin + 2, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        doc.text(desc, margin + 58, y);
        y += 5.8;
      });

      // FOOTER
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(140, 140, 140);
        doc.text(`Página ${i} de ${totalPages} • Documento Técnico de Ingeniería de Software`, margin, 290);
      }

      doc.save('Informe_Tecnico_Arquitectura_POS_MultiSucursal.pdf');
    } catch (err) {
      console.error('Error generating technical PDF:', err);
    } finally {
      setGeneratingPdf(false);
    }
  };

  // Function to generate the Executive Presentation PDF using jsPDF
  const generateExecutivePdf = () => {
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

      const checkPageBreak = (spaceNeeded: number) => {
        if (y + spaceNeeded > 275) {
          doc.addPage();
          y = 20;
          doc.setFontSize(8);
          doc.setTextColor(140, 140, 140);
          doc.text('PRESENTACIÓN EJECUTIVA • SISTEMA INTEGRAL DE GESTIÓN MULTI-TIENDA', margin, 10);
          doc.text('GERENCIA GENERAL', pageWidth - margin - 35, 10);
          doc.setDrawColor(220, 220, 220);
          doc.line(margin, 12, pageWidth - margin, 12);
        }
      };

      // --- COVER / HEADER ---
      doc.setFillColor(88, 28, 135); // purple-900
      doc.rect(margin, y, contentWidth, 34, 'F');
      
      doc.setFillColor(168, 85, 247); // purple-500
      doc.rect(margin, y, 4, 34, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.setTextColor(255, 255, 255);
      doc.text('PRESENTACIÓN EJECUTIVA PARA LA GERENCIA', margin + 8, y + 12);

      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(233, 213, 255); // purple-200
      doc.text('Modernización, Control de Ventas en Vivo e Inventario Unificado para Nuestras Tiendas', margin + 8, y + 19);
      
      doc.setFontSize(8);
      doc.setTextColor(216, 180, 254); // purple-300
      doc.text('Documento de Orientación Estratégica • Cero Complicaciones Técnicas', margin + 8, y + 27);

      y += 42;

      // SECTION 1: ¿QUÉ ES ESTE SISTEMA Y QUÉ PROBLEMA RESUELVE?
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(88, 28, 135);
      doc.text('1. ¿Qué es este sistema y qué soluciones nos brinda?', margin, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      const textSec1 = 
        'Es una plataforma moderna y fácil de usar diseñada para que la Gerencia General tenga el control absoluto y ' +
        'en tiempo real de lo que ocurre en la Tienda 1 (Centro), Tienda 2 (Norte) y el Almacén Central desde una sola pantalla.\n\n' +
        'Elimina por completo la necesidad de hacer llamadas telefónicas para consultar existencias, evita fugas de dinero ' +
        'y suprime las diferencias entre el inventario físico y lo que se vende en caja.';
      const splitSec1 = doc.splitTextToSize(textSec1, contentWidth);
      doc.text(splitSec1, margin, y);
      y += splitSec1.length * 4.8 + 4;

      // SECTION 2: LOS 5 GRANDES BENEFICIOS
      checkPageBreak(55);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(88, 28, 135);
      doc.text('2. Los 5 Grandes Beneficios para el Negocio', margin, y);
      y += 6;

      const benefits = [
        ['1. Control Total de Ventas en Vivo:', 'Usted puede ver desde su oficina o celular cuánto dinero está ingresando en cada tienda al instante.'],
        ['2. Cero Pérdidas de Mercadería:', 'Cada producto vendido descuenta su stock en el acto. Sabrá exactamente qué mercancía falta y cuál reponer.'],
        ['3. Cuadro de Mando Gerencial:', 'Gráficas claras con sus ingresos, margen de ganancia real (35%), ticket promedio y productos más vendidos.'],
        ['4. Facilidad para los Cajeros:', 'Cobro rápido estilo supermercado usando lectores de código de barras. No requiere cursos largos.'],
        ['5. Ahorro Radical ($0 en Servidores):', 'No requiere comprar costosos servidores ni pagar mensualidades de software abusivas.']
      ];

      benefits.forEach(([title, desc]) => {
        checkPageBreak(10);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(88, 28, 135);
        doc.text('✓ ' + title, margin + 2, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        const splitB = doc.splitTextToSize(desc, contentWidth - 8);
        doc.text(splitB, margin + 6, y + 4.5);
        y += splitB.length * 4.5 + 4;
      });

      // SECTION 3: CÓMO OPERA EL PERSONAL
      checkPageBreak(50);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(88, 28, 135);
      doc.text('3. Roles Claros y Seguridad para el Personal', margin, y);
      y += 6;

      const roles = [
        ['Cajeros (Tiendas 1 y 2):', 'Solo tienen acceso a cobrar. Ingresan con su PIN personal de 4 dígitos. Cada ticket queda registrado con su nombre.'],
        ['Supervisores de Tienda:', 'Autorizan ajustes, validan cajas y asisten a los cajeros en sus turnos.'],
        ['Encargado de Inventario:', 'Controla el stock del almacén central y despacha la mercancía a las tiendas mediante traspasos digitales auditados.'],
        ['Gerente General (Usted):', 'Visión 360° de todo el negocio: ingresos globales, comparativas entre tiendas, rentabilidad y auditoría completa.']
      ];

      roles.forEach(([rol, desc]) => {
        checkPageBreak(10);
        doc.setFillColor(250, 245, 255);
        doc.rect(margin, y - 3, contentWidth, 9, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(88, 28, 135);
        doc.text(rol, margin + 3, y + 1);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        const splitR = doc.splitTextToSize(desc, contentWidth - 55);
        doc.text(splitR, margin + 50, y + 1);
        y += 10.5;
      });

      // SECTION 4: EL FLUJO DEL DÍA A DÍA
      checkPageBreak(45);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(88, 28, 135);
      doc.text('4. ¿Cómo es el Día a Día en la Práctica?', margin, y);
      y += 6;

      const dailyFlow = [
        '1. En la Mañana: Los cajeros abren su pantalla, seleccionan su nombre y escriben su PIN de 4 dígitos.',
        '2. Durante el Día: Al pasar un producto por el lector de código de barras, el sistema lo añade al ticket y descuenta el stock en la nube.',
        '3. En Almacén: Cuando una tienda necesita más existencias, Almacén Central hace un traspaso digital con 2 clics.',
        '4. Al Final del Día: La Gerencia revisa su cuadro de mando con los ingresos totales del día, utilidades y nivel de inventario.'
      ];

      dailyFlow.forEach((item) => {
        checkPageBreak(7);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        doc.text(item, margin + 3, y);
        y += 5.5;
      });

      // FOOTER
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(140, 140, 140);
        doc.text(`Página ${i} de ${totalPages} • Resumen Ejecutivo para la Gerencia General`, margin, 290);
      }

      doc.save('Presentacion_Ejecutiva_Gerencia_POS_MultiSucursal.pdf');
    } catch (err) {
      console.error('Error generating executive PDF:', err);
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-500/20 via-emerald-500/20 to-blue-500/20 border border-purple-500/30 text-purple-300 shadow-inner">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-white tracking-tight">Centro de Documentos & Reportes PDF</h2>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  Descarga Instantánea
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Genera e imprime los dos informes oficiales: el **Informe Técnico Completo** y la **Presentación Ejecutiva para Gerencia**.
              </p>
            </div>
          </div>

          {/* Quick Action Buttons for Direct PDF Downloads */}
          <div className="flex flex-wrap items-center gap-2.5">
            {isGeneralManager && (
              <button
                onClick={() => downloadStandaloneHtmlFile()}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
                title="Descargar archivo pos_multisucursal.html listo para usar (Exclusivo Gerente General)"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Descargar .HTML Autónomo</span>
              </button>
            )}

            <button
              onClick={generateExecutivePdf}
              disabled={generatingPdf}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Descargar PDF Gerencia</span>
            </button>

            <button
              onClick={generateTechnicalPdf}
              disabled={generatingPdf}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Descargar PDF Técnico</span>
            </button>

            <button
              onClick={() => window.print()}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              title="Imprimir vista actual"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>Imprimir</span>
            </button>
          </div>
        </div>

        {/* Tab Toggle for On-Screen Reading */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={() => setActiveDoc('cortes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeDoc === 'cortes'
                ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Receipt className="w-4 h-4" />
            1. Cortes Fiscales de Caja (Corte X & Z)
          </button>

          <button
            onClick={() => setActiveDoc('gerencia')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeDoc === 'gerencia'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            2. Presentación para Gerencia General
          </button>

          <button
            onClick={() => setActiveDoc('tecnico')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeDoc === 'tecnico'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            3. Informe Técnico Detallado (Arquitectura & SQL)
          </button>

          {isGeneralManager && (
            <button
              onClick={() => setActiveDoc('html')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeDoc === 'html'
                  ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950 text-emerald-400 hover:text-emerald-300 border border-slate-800'
              }`}
            >
              <Code className="w-4 h-4" />
              4. Archivo Único Autónomo (.html)
            </button>
          )}
        </div>
      </div>

      {/* DOCUMENT PREVIEW CONTAINER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* DOCUMENT 0: CORTES FISCALES X & Z */}
        {activeDoc === 'cortes' && (
          <div className="p-4 sm:p-6">
            <FiscalCortesView
              ventas={ventas}
              sucursales={sucursales}
              empresaConfig={empresaConfig}
              usuarios={usuarios}
              currentUser={currentUser}
              correlativoX={correlativoX}
              correlativoZ={correlativoZ}
              onIncrementCorrelativoX={onIncrementCorrelativoX}
              onIncrementCorrelativoZ={onIncrementCorrelativoZ}
            />
          </div>
        )}

        {/* DOCUMENT 1: GERENCIA GENERAL */}
        {activeDoc === 'gerencia' && (
          <div className="p-6 sm:p-10 space-y-8 max-w-4xl mx-auto">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 border border-purple-500/30 rounded-2xl p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                  Documento Estratégico para Gerencia
                </span>
                <span className="text-xs text-slate-400 font-mono">Lectura: 4 minutos</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Propuesta y Presentación del Sistema Integral de Ventas, Inventario y Gestión Multi-Tienda
              </h1>
              <p className="text-sm text-purple-200">
                Modernización, visibilidad en tiempo real y blindaje operativo para Tienda 1, Tienda 2 y Almacén Central.
              </p>
            </div>

            {/* Section 1 */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                1. ¿Qué es este sistema y qué problema resuelve en nuestro negocio?
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Este sistema es una <strong>herramienta moderna, ágil y visual</strong> diseñada para resolver los dolores de cabeza más comunes en negocios con múltiples tiendas:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-rose-400 font-bold text-xs flex items-center gap-1.5">
                    <span>❌ Antes:</span>
                  </div>
                  <p className="text-xs text-slate-400">Llamadas telefónicas constantes entre tiendas para preguntar si hay mercancía disponible.</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-rose-400 font-bold text-xs flex items-center gap-1.5">
                    <span>❌ Antes:</span>
                  </div>
                  <p className="text-xs text-slate-400">Descuadres de dinero al final del día sin saber qué cajero cometió el error.</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-rose-400 font-bold text-xs flex items-center gap-1.5">
                    <span>❌ Antes:</span>
                  </div>
                  <p className="text-xs text-slate-400">No saber la ganancia real ni los productos más vendidos hasta cerrar el mes.</p>
                </div>
              </div>
              <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-xl mt-3 text-xs text-emerald-200 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <span>
                  <strong>Solución con este sistema:</strong> Todo queda interconectado en vivo. Si Tienda 1 vende una unidad, Almacén y Gerencia lo ven reflejado en menos de 1 segundo.
                </span>
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                2. Los 5 Grandes Beneficios para la Empresa
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <DollarSign className="w-4 h-4" />
                    <span>1. Control de Ingresos en Vivo</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Usted puede abrir el sistema desde su computadora o laptop y ver segundo a segundo cuánto dinero está entrando por caja y por sucursal.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>2. Inventario Blindado y Exacto</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Cero pérdidas de mercancía. El inventario se descuenta automáticamente con cada venta escaneada y las transferencias de mercancía requieren firma y autorización.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                    <Briefcase className="w-4 h-4" />
                    <span>3. Cuadro de Mando Estratégico</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Muestra gráficas de utilidad real estimada (margen del 35%), ticket promedio por cliente, comparativa entre tiendas y ranking de productos estrella.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <Zap className="w-4 h-4" />
                    <span>4. Facilidad Total para los Cajeros</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Sistema ultra rápido tipo supermercado. El cajero solo usa la pistola lectora de código de barras USB y presiona "Cobrar". No requiere cursos largos.
                  </p>
                </div>

                <div className="md:col-span-2 bg-gradient-to-r from-emerald-950/40 to-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>5. Ahorro Radical ($0 en Servidores y Licencias)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Aprovecha las computadoras existentes y utiliza la infraestructura en la nube de alta seguridad de PostgreSQL en Supabase sin costo fijo mensual.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                <Lock className="w-5 h-5 text-amber-400" />
                3. Organización del Personal y Control por PIN (12 Cuentas)
              </h3>
              <p className="text-xs text-slate-300">
                Cada empleado cuenta con su usuario y un <strong>PIN confidencial de 4 dígitos</strong>, garantizando que cada venta o movimiento quede registrado con su nombre:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="font-bold text-emerald-400 border-b border-slate-800 pb-1 flex justify-between">
                    <span>Tienda 1 - Centro</span>
                    <span className="text-[10px] bg-emerald-500/20 px-1.5 rounded">4 Cajeros</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Ana Morales, Carlos Pérez, Diana Castro y Elena Rivas (Supervisora).</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="font-bold text-emerald-400 border-b border-slate-800 pb-1 flex justify-between">
                    <span>Tienda 2 - Norte</span>
                    <span className="text-[10px] bg-emerald-500/20 px-1.5 rounded">4 Cajeros</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Fernando Soto, Gabriela Ruiz, Hugo Mendoza e Isabel Vargas (Supervisora).</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="font-bold text-purple-400 border-b border-slate-800 pb-1 flex justify-between">
                    <span>Inventario & Gerencia</span>
                    <span className="text-[10px] bg-purple-500/20 px-1.5 rounded">4 Cuentas</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Jorge Martínez (Almacén), Karla Benítez, Luis Navarro y Admin General (Director).</p>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                <ArrowRight className="w-5 h-5 text-blue-400" />
                4. ¿Cómo Funciona el Día a Día en la Práctica?
              </h3>
              <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside bg-slate-950 p-4 rounded-xl border border-slate-800 leading-relaxed">
                <li><strong className="text-white">Al abrir la tienda:</strong> El cajero entra al sistema, selecciona la tienda, su nombre y coloca su PIN.</li>
                <li><strong className="text-white">Al atender un cliente:</strong> Pasa los artículos por el lector de código de barras USB y presiona "Cobrar". El sistema registra la venta y descuenta el stock en la nube.</li>
                <li><strong className="text-white">Cuando falta mercancía:</strong> El encargado de almacén hace una transferencia digital desde la Oficina Central a la Tienda con 2 clics.</li>
                <li><strong className="text-white">En cualquier momento:</strong> La Gerencia General revisa en su pantalla los ingresos globales, el ticket promedio y las ganancias acumuladas.</li>
              </ol>
            </div>

            {/* Action Card */}
            <div className="bg-purple-950/40 border border-purple-500/30 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-white text-sm">¿Desea descargar esta presentación en PDF para imprimir?</h4>
                <p className="text-xs text-purple-200">Archivo listo para imprimir o enviar por correo a socios y directivos.</p>
              </div>
              <button
                onClick={generateExecutivePdf}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Descargar PDF Gerencial</span>
              </button>
            </div>

            {/* Attribution Footer */}
            <div className="pt-4 border-t border-slate-800">
              <AITechFooter variant="compact" />
            </div>
          </div>
        )}

        {/* DOCUMENT 2: INFORME TÉCNICO COMPLETO */}
        {activeDoc === 'tecnico' && (
          <div className="p-6 sm:p-10 space-y-8 max-w-4xl mx-auto">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  Especificación de Ingeniería de Software
                </span>
                <span className="text-xs text-slate-400 font-mono">Versión 2.4.0</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Informe Técnico de Arquitectura, Modelo Relacional y Despliegue Multi-Sucursal
              </h1>
              <p className="text-sm text-emerald-200 font-mono">
                PostgreSQL (Supabase BaaS) • Client Standalone Runtime • Concurrencia Multi-Tienda • Seguridad PIN
              </p>
            </div>

            {/* Tech Specs */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                <Server className="w-5 h-5 text-emerald-400" />
                1. Arquitectura del Sistema y Topología de Red
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                El sistema adopta un patrón <strong>BaaS (Backend-as-a-Service) Serverless</strong>. Los clientes ejecutan una aplicación de una sola página (SPA) ligera e independiente que se comunica directamente con el clúster de base de datos PostgreSQL alojado en Supabase mediante llamadas seguras HTTPS REST y WebSockets para sincronización reactiva.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-2">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase font-mono block">Base de Datos:</span>
                  <span className="font-bold text-white text-sm">PostgreSQL 15+</span>
                  <span className="text-[11px] text-emerald-400 block">Supabase Managed Cloud</span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase font-mono block">Cliente / Runtime:</span>
                  <span className="font-bold text-white text-sm">Standalone HTML5</span>
                  <span className="text-[11px] text-emerald-400 block">Zero-Install en Navegador</span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase font-mono block">Librería de Gráficas:</span>
                  <span className="font-bold text-white text-sm">Chart.js 4.x</span>
                  <span className="text-[11px] text-purple-400 block">Cálculo de KPI en cliente</span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase font-mono block">Periféricos:</span>
                  <span className="font-bold text-white text-sm">Escáner USB HID</span>
                  <span className="text-[11px] text-blue-400 block">Emulación de Teclado</span>
                </div>
              </div>
            </div>

            {/* DDL Schema Details */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                2. Esquema Relacional de Base de Datos (DDL)
              </h3>
              
              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-3">Tabla</th>
                      <th className="p-3">Llave Primaria</th>
                      <th className="p-3">Llaves Foráneas (FK)</th>
                      <th className="p-3">Propósito & Integridad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-950/40 text-slate-300 font-mono text-[11px]">
                    <tr>
                      <td className="p-3 text-emerald-400 font-bold">sucursales</td>
                      <td className="p-3">id (SERIAL)</td>
                      <td className="p-3 text-slate-500">—</td>
                      <td className="p-3 font-sans text-slate-300">Catálogo de tiendas físicas y almacén central.</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-emerald-400 font-bold">usuarios</td>
                      <td className="p-3">id (SERIAL)</td>
                      <td className="p-3 text-purple-400">sucursal_id ➔ sucursales(id)</td>
                      <td className="p-3 font-sans text-slate-300">Directorio de 12 colaboradores, roles y PINs de autenticación.</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-emerald-400 font-bold">productos</td>
                      <td className="p-3">id (SERIAL)</td>
                      <td className="p-3 text-slate-500">codigo_barras (UNIQUE)</td>
                      <td className="p-3 font-sans text-slate-300">Maestro de artículos, precios de venta y costo estimado.</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-emerald-400 font-bold">inventario</td>
                      <td className="p-3">id (SERIAL)</td>
                      <td className="p-3 text-purple-400">sucursal_id, producto_id</td>
                      <td className="p-3 font-sans text-slate-300">Matriz de existencias en tiempo real por sucursal.</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-emerald-400 font-bold">ventas</td>
                      <td className="p-3">id (SERIAL)</td>
                      <td className="p-3 text-purple-400">sucursal_id, usuario_id</td>
                      <td className="p-3 font-sans text-slate-300">Encabezado de tickets de venta con auditoría de cajero.</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-emerald-400 font-bold">detalle_ventas</td>
                      <td className="p-3">id (SERIAL)</td>
                      <td className="p-3 text-purple-400">venta_id, producto_id</td>
                      <td className="p-3 font-sans text-slate-300">Líneas de productos vendidos, cantidades y subtotales.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Deployment Steps */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                <Layers className="w-5 h-5 text-blue-400" />
                3. Guía de Interconexión en los 3 Equipos
              </h3>
              
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-emerald-400 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[11px] font-mono">1</span>
                    <span>Equipo Tienda 1 (Caja Centro):</span>
                  </div>
                  <p className="text-slate-400 pl-7">Abrir `pos_multisucursal.html`, configurar llaves de Supabase, e iniciar sesión seleccionando "Tienda 1 - Centro" con el PIN del cajero (ej. 1001).</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-emerald-400 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[11px] font-mono">2</span>
                    <span>Equipo Tienda 2 (Caja Norte):</span>
                  </div>
                  <p className="text-slate-400 pl-7">Abrir `pos_multisucursal.html`, pegar las mismas llaves, e iniciar sesión seleccionando "Tienda 2 - Norte" con el PIN del cajero (ej. 2001).</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-purple-400 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[11px] font-mono">3</span>
                    <span>Equipo Oficina Central (Gerencia / Inventario):</span>
                  </div>
                  <p className="text-slate-400 pl-7">Abrir `pos_multisucursal.html` e iniciar sesión como "Admin General" (PIN: 9999) o "Jorge Martínez" (PIN: 3001) para supervisión estratégica y transferencias de stock.</p>
                </div>
              </div>
            </div>

            {/* Action Card */}
            <div className="bg-emerald-950/40 border border-emerald-500/30 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-white text-sm">¿Desea descargar el informe técnico formal en PDF?</h4>
                <p className="text-xs text-emerald-200">Incluye modelo relacional completo, DDL SQL y especificaciones de seguridad.</p>
              </div>
              <button
                onClick={generateTechnicalPdf}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Descargar PDF Técnico</span>
              </button>
            </div>

            {/* Attribution Footer */}
            <div className="pt-4 border-t border-slate-800">
              <AITechFooter variant="compact" />
            </div>
          </div>
        )}

        {/* DOCUMENT 3: STANDALONE HTML FILE DOWNLOADER */}
        {activeDoc === 'html' && (
          <div className="p-6">
            <StandaloneHtmlDownloader />
          </div>
        )}
      </div>
    </div>
  );
};
