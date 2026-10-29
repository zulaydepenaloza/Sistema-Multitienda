import { EmpresaConfig } from '../types';

export const DEFAULT_EMPRESA_CONFIG: EmpresaConfig = {
  nombreEmpresa: 'Inversiones Rondón, F.P.',
  rif: 'J-40982341-2',
  direccionFiscal: 'Av. Francisco de Miranda, Centro Empresarial Plaza, Nivel PB, Local 04, Caracas',
  telefono: '+58 (212) 555-0199 / +58 (414) 332-8890',
  logoUrl: '',
  tasaCambio: 850,
  fechaTasa: new Date().toLocaleDateString('es-VE'),
  nombreTienda1: 'Tienda A - Sector A',
  nombreTienda2: 'Tienda A - Sector B',
  nombreOficina: 'Oficina Central & Almacén',
};

export const CLEAN_EMPRESA_CONFIG: EmpresaConfig = {
  nombreEmpresa: '',
  rif: '',
  direccionFiscal: '',
  telefono: '',
  logoUrl: '',
  tasaCambio: 0,
  fechaTasa: new Date().toLocaleDateString('es-VE'),
  nombreTienda1: 'Tienda 1',
  nombreTienda2: 'Tienda 2',
  nombreOficina: 'Oficina Central / Almacén',
};

const STORAGE_KEY_EMPRESA = 'pos_empresa_config_v1';
const STORAGE_KEY_TASA_SET_DATE = 'pos_tasa_date_v1';

export function getStoredEmpresaConfig(): EmpresaConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EMPRESA);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading empresa config:', e);
  }
  return { ...DEFAULT_EMPRESA_CONFIG };
}

export function saveStoredEmpresaConfig(config: EmpresaConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_EMPRESA, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving empresa config:', e);
  }
}

export const saveEmpresaConfig = saveStoredEmpresaConfig;

export function hasSetTasaToday(): boolean {
  try {
    const storedDate = localStorage.getItem(STORAGE_KEY_TASA_SET_DATE);
    const today = new Date().toISOString().split('T')[0];
    return storedDate === today;
  } catch (e) {
    return false;
  }
}

export function markTasaSetToday(): void {
  try {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(STORAGE_KEY_TASA_SET_DATE, today);
  } catch (e) {
    console.error('Error saving tasa date:', e);
  }
}

/**
 * Format currency in USD and Bolívares with safe fallbacks
 */
export function formatUSD(amount?: number | null): string {
  const val = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatBs(amountUsd?: number | null, tasaCambio?: number | null): string {
  const val = typeof amountUsd === 'number' && !isNaN(amountUsd) ? amountUsd : 0;
  const rate = typeof tasaCambio === 'number' && !isNaN(tasaCambio) && tasaCambio > 0 ? tasaCambio : 36.5;
  const bs = val * rate;
  return `Bs. ${bs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDual(amountUsd?: number | null, tasaCambio?: number | null, separator = ' • '): string {
  return `${formatUSD(amountUsd)}${separator}${formatBs(amountUsd, tasaCambio)}`;
}

export function isMockDefaultPhone(phone?: string): boolean {
  if (!phone) return true;
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 8) return true;
  return (
    digits.includes('8765432') ||
    digits.includes('1234567') ||
    digits.includes('3328890') ||
    digits.includes('5550199') ||
    digits === '584128765432' ||
    digits === '04128765432' ||
    digits === '4128765432' ||
    digits === '584121234567' ||
    digits === '04121234567' ||
    digits === '4121234567' ||
    digits === '584143328890' ||
    digits === '04143328890' ||
    digits === '4143328890' ||
    digits.includes('582125550199') ||
    digits.includes('584143328890')
  );
}

export function cleanMobileDigits(phoneStr?: string): string {
  if (!phoneStr) return '';
  const digitsOnly = phoneStr.replace(/\D/g, '');
  // Search for Venezuelan mobile prefixes: 0412, 0414, 0424, 0416, 0426
  const mobileMatch = digitsOnly.match(/(?:58)?(4(?:12|14|24|16|26)\d{7})/);
  if (mobileMatch && mobileMatch[1]) {
    return `58${mobileMatch[1]}`;
  }
  if (digitsOnly.startsWith('58')) return digitsOnly;
  if (digitsOnly.startsWith('0')) return `58${digitsOnly.slice(1)}`;
  if (digitsOnly.length === 10) return `58${digitsOnly}`;
  return digitsOnly;
}
