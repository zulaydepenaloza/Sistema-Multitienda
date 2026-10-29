import { EmpresaConfig } from '../types';

export interface LicensePayload {
  machineId: string;
  empresa: string;
  rif: string;
  tipo: 'vitalicia' | 'anual' | 'semestral' | 'mensual' | 'demo';
  fechaEmision: string; // YYYY-MM-DD
  fechaVencimiento: string; // YYYY-MM-DD o 'VITALICIA'
  cajasMax: number;
  sucursalesMax: number;
}

export interface LicenseValidationResult {
  isValid: boolean;
  isExpired: boolean;
  isMachineMismatch: boolean;
  isTampered: boolean;
  status: 'active' | 'expired' | 'machine_mismatch' | 'invalid_signature' | 'unlicensed';
  message: string;
  license?: LicensePayload;
  daysRemaining?: number;
}

// Master Secret Salt for cryptographic HMAC validation (Developer Secret)
const LICENSE_SECRET_KEY = 'POS_CRYPT_SEC_KEY_VAL_2026_MULTI_BRANCH_LATAM_G82X';
const STORAGE_KEY_LICENSE = 'pos_app_crypto_license_v1';
const STORAGE_KEY_SEED = 'pos_machine_install_seed_v1';

// Pure JS SHA-256 Implementation for 100% offline & file:// protocol compatibility (UTF-8 compliant)
function sha256(str: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }

  // Convert string to utf-8 byte stream representation
  let ascii = '';
  try {
    ascii = unescape(encodeURIComponent(str));
  } catch (e) {
    ascii = str;
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i: number, j: number;
  let result = '';

  const words: number[] = [];
  const asciiBitLength = ascii[lengthProperty] * 8;

  let hash: number[] = [];
  const k: number[] = [];
  let primeCounter = 0;

  const isComposite: { [key: number]: number } = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  ascii += '\x80';
  while ((ascii[lengthProperty] % 64) - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    words[i >> 2] |= (j & 0xff) << (((3 - (i % 4))) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;

  for (j = 0; j < words[lengthProperty]; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15],
        w2 = w[i - 2];

      const a = hash[0],
        e = hash[4];
      const temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
        ((e & hash[5]) ^ (~e & hash[6])) +
        k[i] +
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
              0);
      const temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

// Generate Hardware Fingerprint (Machine ID)
export function getMachineFingerprint(): string {
  if (typeof window === 'undefined') return 'POS-SERVER-0000-0000';

  try {
    // 1. Get or create persistent install seed
    let installSeed = localStorage.getItem(STORAGE_KEY_SEED);
    if (!installSeed) {
      installSeed =
        Math.random().toString(36).substring(2, 15) +
        '-' +
        Date.now().toString(36);
      try {
        localStorage.setItem(STORAGE_KEY_SEED, installSeed);
      } catch (e) {}
    }

    // 2. Hardware and environment parameters
    const nav = window.navigator;
    const screen = window.screen;

    let webglInfo = 'no-webgl';
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') ||
        (canvas.getContext('experimental-webgl') as any);
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || '';
          const renderer =
            gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
          webglInfo = `${vendor}~${renderer}`;
        }
      }
    } catch (e) {}

    // 3. Canvas signature
    let canvasHash = 'no-canvas';
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 50;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = "14px 'Arial'";
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('POS Hardware ID Signature 2026', 2, 15);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText('POS Hardware ID Signature 2026', 4, 17);
        canvasHash = canvas.toDataURL().slice(-50);
      }
    } catch (e) {}

    const rawString = [
      nav.platform || '',
      nav.userAgent || '',
      nav.language || '',
      nav.hardwareConcurrency || 4,
      screen.width || 1920,
      screen.height || 1080,
      screen.colorDepth || 24,
      new Date().getTimezoneOffset(),
      webglInfo,
      canvasHash,
      installSeed,
    ].join('###');

    const hash = sha256(rawString);

    // Format as: POS-XXXX-XXXX-XXXX-XXXX
    const p1 = hash.substring(0, 4).toUpperCase();
    const p2 = hash.substring(4, 8).toUpperCase();
    const p3 = hash.substring(8, 12).toUpperCase();
    const p4 = hash.substring(12, 16).toUpperCase();

    return `POS-${p1}-${p2}-${p3}-${p4}`;
  } catch (err) {
    return 'POS-7A9B-44F2-88C1';
  }
}

// Generate Cryptographic Activation Key from Payload
export function generateActivationKey(payload: LicensePayload): string {
  // Normalize payload
  const normalized: LicensePayload = {
    machineId: payload.machineId.trim().toUpperCase(),
    empresa: payload.empresa.trim(),
    rif: payload.rif.trim().toUpperCase(),
    tipo: payload.tipo,
    fechaEmision: payload.fechaEmision,
    fechaVencimiento: payload.fechaVencimiento,
    cajasMax: payload.cajasMax || 1,
    sucursalesMax: payload.sucursalesMax || 1,
  };

  const jsonStr = JSON.stringify(normalized);
  const base64Payload = btoa(unescape(encodeURIComponent(jsonStr)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  // Generate HMAC / SHA256 Signature over (base64Payload + LICENSE_SECRET_KEY)
  const signatureRaw = sha256(`${base64Payload}::${LICENSE_SECRET_KEY}::${normalized.machineId}`);
  const signatureShort = signatureRaw.substring(0, 16).toUpperCase();

  // Final activation key format: LIC-<PAYLOAD_B64>.<SIGNATURE_16>
  return `LIC-${base64Payload}.${signatureShort}`;
}

// Validate an Activation Key against the current or target Machine ID
export function validateActivationKey(
  key: string,
  targetMachineId?: string
): LicenseValidationResult {
  const currentMachineId = (targetMachineId || getMachineFingerprint()).trim().toUpperCase();

  if (!key || typeof key !== 'string' || !key.trim()) {
    return {
      isValid: false,
      isExpired: false,
      isMachineMismatch: false,
      isTampered: false,
      status: 'unlicensed',
      message: 'No se ha ingresado una clave de licencia.',
    };
  }

  const cleanKey = key.trim();

  // Check prefix
  if (!cleanKey.startsWith('LIC-') || !cleanKey.includes('.')) {
    return {
      isValid: false,
      isExpired: false,
      isMachineMismatch: false,
      isTampered: true,
      status: 'invalid_signature',
      message: 'Formato de clave de licencia inválido o corrupto.',
    };
  }

  try {
    const rawBody = cleanKey.substring(4); // Remove 'LIC-'
    const [base64Payload, providedSignature] = rawBody.split('.');

    if (!base64Payload || !providedSignature) {
      return {
        isValid: false,
        isExpired: false,
        isMachineMismatch: false,
        isTampered: true,
        status: 'invalid_signature',
        message: 'Estructura de licencia criptográfica incompleta.',
      };
    }

    // Decode Payload
    const standardB64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr = decodeURIComponent(escape(atob(standardB64)));
    const payload: LicensePayload = JSON.parse(jsonStr);

    if (!payload.machineId || !payload.empresa || !payload.fechaVencimiento) {
      return {
        isValid: false,
        isExpired: false,
        isMachineMismatch: false,
        isTampered: true,
        status: 'invalid_signature',
        message: 'Los datos contenidos en la licencia están corruptos.',
      };
    }

    // Verify Cryptographic Signature
    const expectedSignatureRaw = sha256(
      `${base64Payload}::${LICENSE_SECRET_KEY}::${payload.machineId.trim().toUpperCase()}`
    );
    const expectedSignatureShort = expectedSignatureRaw.substring(0, 16).toUpperCase();

    if (providedSignature.toUpperCase() !== expectedSignatureShort) {
      return {
        isValid: false,
        isExpired: false,
        isMachineMismatch: false,
        isTampered: true,
        status: 'invalid_signature',
        message: 'Firma criptográfica inválida. La licencia fue alterada o no fue emitida por el desarrollador.',
      };
    }

    // Check Machine ID matching
    if (payload.machineId.trim().toUpperCase() !== currentMachineId) {
      return {
        isValid: false,
        isExpired: false,
        isMachineMismatch: true,
        isTampered: false,
        status: 'machine_mismatch',
        message: `Esta licencia pertenece al equipo [${payload.machineId}], pero este equipo es [${currentMachineId}]. Copia no autorizada.`,
        license: payload,
      };
    }

    // Check Expiration
    let isExpired = false;
    let daysRemaining = 99999;

    if (payload.fechaVencimiento !== 'VITALICIA') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [y, m, d] = payload.fechaVencimiento.split('-').map(Number);
      const expDate = new Date(y, m - 1, d);
      expDate.setHours(23, 59, 59, 999);

      const diffTime = expDate.getTime() - today.getTime();
      daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (daysRemaining < 0) {
        isExpired = true;
      }
    }

    if (isExpired) {
      return {
        isValid: false,
        isExpired: true,
        isMachineMismatch: false,
        isTampered: false,
        status: 'expired',
        message: `La licencia expiró el ${payload.fechaVencimiento}. Contacte al desarrollador para renovar.`,
        license: payload,
        daysRemaining: 0,
      };
    }

    return {
      isValid: true,
      isExpired: false,
      isMachineMismatch: false,
      isTampered: false,
      status: 'active',
      message: 'Licencia activa y validada con éxito.',
      license: payload,
      daysRemaining,
    };
  } catch (err) {
    return {
      isValid: false,
      isExpired: false,
      isMachineMismatch: false,
      isTampered: true,
      status: 'invalid_signature',
      message: 'Error al procesar la clave de licencia.',
    };
  }
}

// Get Stored License Key
export function getStoredLicenseKey(): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(STORAGE_KEY_LICENSE) || '';
  } catch (e) {
    return '';
  }
}

// Save Stored License Key
export function saveLicenseKey(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_LICENSE, key.trim());
  } catch (e) {}
}

// Clear License Key (Deactivate)
export function removeLicenseKey(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY_LICENSE);
  } catch (e) {}
}

// Create a Quick Demo / Trial License for Current Machine (15 days)
export function createTrialLicenseForCurrentMachine(empresa: string = 'Cliente de Prueba', rif: string = 'V-00000000'): string {
  const machineId = getMachineFingerprint();
  const now = new Date();
  const exp = new Date();
  exp.setDate(exp.getDate() + 15);

  const format = (d: Date) => d.toISOString().split('T')[0];

  const payload: LicensePayload = {
    machineId,
    empresa,
    rif,
    tipo: 'demo',
    fechaEmision: format(now),
    fechaVencimiento: format(exp),
    cajasMax: 2,
    sucursalesMax: 2,
  };

  return generateActivationKey(payload);
}
