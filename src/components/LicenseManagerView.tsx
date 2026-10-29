import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Copy,
  Check,
  Building2,
  Calendar,
  AlertCircle,
  Sparkles,
  Terminal,
  RefreshCw,
  Cpu,
  Fingerprint,
  Lock,
  Unlock,
  CheckCircle2,
  Trash2,
  Laptop,
} from 'lucide-react';
import {
  getMachineFingerprint,
  validateActivationKey,
  generateActivationKey,
  saveLicenseKey,
  removeLicenseKey,
  getStoredLicenseKey,
  createTrialLicenseForCurrentMachine,
  LicenseValidationResult,
  LicensePayload,
} from '../lib/licensing';

interface LicenseManagerViewProps {
  validationResult: LicenseValidationResult;
  onLicenseChanged: () => void;
}

export const LicenseManagerView: React.FC<LicenseManagerViewProps> = ({
  validationResult,
  onLicenseChanged,
}) => {
  const [machineId, setMachineId] = useState<string>('');
  const [copiedMachineId, setCopiedMachineId] = useState<boolean>(false);
  const [newKeyInput, setNewKeyInput] = useState<string>('');
  const [isChangingKey, setIsChangingKey] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Developer Generator Tab / Section
  const [showDevGenerator, setShowDevGenerator] = useState<boolean>(false);
  const [devPin, setDevPin] = useState<string>('');
  const [devUnlocked, setDevUnlocked] = useState<boolean>(false);

  // Generator Fields
  const [genTargetMachineId, setGenTargetMachineId] = useState<string>('');
  const [genEmpresa, setGenEmpresa] = useState<string>('Corporación Ejemplo C.A.');
  const [genRif, setGenRif] = useState<string>('J-12345678-9');
  const [genTipo, setGenTipo] = useState<'vitalicia' | 'anual' | 'semestral' | 'mensual' | 'demo'>('vitalicia');
  const [genCustomDate, setGenCustomDate] = useState<string>('');
  const [genCajas, setGenCajas] = useState<number>(3);
  const [genSucursales, setGenSucursales] = useState<number>(2);
  const [generatedKeyResult, setGeneratedKeyResult] = useState<string>('');
  const [copiedGenKey, setCopiedGenKey] = useState<boolean>(false);

  useEffect(() => {
    const id = getMachineFingerprint();
    setMachineId(id);
    setGenTargetMachineId(id);
  }, []);

  const handleCopyMachineId = (idToCopy?: string) => {
    const text = idToCopy || machineId;
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedMachineId(true);
    setTimeout(() => setCopiedMachineId(false), 2500);
  };

  const handleApplyNewKey = () => {
    if (!newKeyInput.trim()) {
      setActionError('Por favor ingrese la clave de activación provista por el desarrollador.');
      return;
    }

    const test = validateActivationKey(newKeyInput.trim());
    if (!test.isValid) {
      setActionError(test.message);
      setActionSuccess(null);
      return;
    }

    saveLicenseKey(newKeyInput.trim());
    setActionError(null);
    setActionSuccess('¡Licencia aplicada y validada exitosamente!');
    setIsChangingKey(false);
    setNewKeyInput('');
    onLicenseChanged();
  };

  const handleDeactivate = () => {
    if (confirm('¿Está seguro de desactivar la licencia de este equipo? El sistema se bloqueará hasta que ingrese una clave válida.')) {
      removeLicenseKey();
      onLicenseChanged();
    }
  };

  const handleDevUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (devPin === '9900' || devPin.toUpperCase() === 'ADMIN') {
      setDevUnlocked(true);
      setActionError(null);
    } else {
      setActionError('PIN de desarrollador incorrecto.');
    }
  };

  const handleGenerateKey = () => {
    if (!genTargetMachineId.trim()) {
      setActionError('Debe ingresar el ID de Hardware del equipo destino.');
      return;
    }
    if (!genEmpresa.trim()) {
      setActionError('Debe ingresar la Razón Social de la Empresa.');
      return;
    }

    const now = new Date();
    let expStr = 'VITALICIA';

    if (genTipo === 'vitalicia') {
      expStr = 'VITALICIA';
    } else if (genTipo === 'anual') {
      const exp = new Date();
      exp.setFullYear(exp.getFullYear() + 1);
      expStr = exp.toISOString().split('T')[0];
    } else if (genTipo === 'semestral') {
      const exp = new Date();
      exp.setMonth(exp.getMonth() + 6);
      expStr = exp.toISOString().split('T')[0];
    } else if (genTipo === 'mensual') {
      const exp = new Date();
      exp.setDate(exp.getDate() + 30);
      expStr = exp.toISOString().split('T')[0];
    } else if (genTipo === 'demo') {
      const exp = new Date();
      exp.setDate(exp.getDate() + 15);
      expStr = exp.toISOString().split('T')[0];
    }

    const payload: LicensePayload = {
      machineId: genTargetMachineId.trim().toUpperCase(),
      empresa: genEmpresa.trim(),
      rif: genRif.trim().toUpperCase(),
      tipo: genTipo,
      fechaEmision: now.toISOString().split('T')[0],
      fechaVencimiento: expStr,
      cajasMax: genCajas,
      sucursalesMax: genSucursales,
    };

    const key = generateActivationKey(payload);
    setGeneratedKeyResult(key);
    setActionError(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
              validationResult.isValid
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}>
              {validationResult.isValid ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Estado de la Licencia del Software
                </h3>
                <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full uppercase tracking-wide border ${
                  validationResult.isValid
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}>
                  {validationResult.isValid ? 'Activa y Autorizada' : 'Inactiva / Bloqueada'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {validationResult.message}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsChangingKey(!isChangingKey)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <KeyRound className="w-3.5 h-3.5" />
              {isChangingKey ? 'Cancelar' : 'Cambiar / Activar Clave'}
            </button>
            {validationResult.isValid && (
              <button
                onClick={handleDeactivate}
                className="px-3 py-2 bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 rounded-xl text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1"
                title="Desactivar licencia de este equipo"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Desactivar
              </button>
            )}
          </div>
        </div>

        {/* Change Key Form */}
        {isChangingKey && (
          <div className="mt-6 pt-6 border-t border-slate-800 space-y-3 animate-in fade-in">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              Pegar Nueva Clave de Activación Criptográfica:
            </label>
            <textarea
              rows={2}
              value={newKeyInput}
              onChange={(e) => setNewKeyInput(e.target.value)}
              placeholder="LIC-eyJtYWNoaW5lSWQi..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsChangingKey(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleApplyNewKey}
                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                Guardar y Activar
              </button>
            </div>
          </div>
        )}

        {actionError && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {actionSuccess && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}
      </div>

      {/* Grid Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Machine Hardware Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              Huella de Hardware del Equipo
            </h4>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
              SHA-256 Engine
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">ID de esta Máquina:</span>
              <button
                onClick={() => handleCopyMachineId()}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
              >
                {copiedMachineId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
            <p className="font-mono text-base font-bold text-emerald-400 tracking-wider">
              {machineId}
            </p>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Este identificador se calcula con la combinación única del hardware, resolución de pantalla, procesador y perfil gráfico de este equipo. Si la app se copia a otra computadora, el ID cambiará y requerirá una nueva activación.
          </p>
        </div>

        {/* License Payload Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              Datos de la Licencia Emitida
            </h4>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
              HMAC Firmada
            </span>
          </div>

          {validationResult.license ? (
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Empresa / Razón Social:</span>
                <span className="font-bold text-white">{validationResult.license.empresa}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">RIF / Identificación:</span>
                <span className="font-mono font-bold text-slate-300">{validationResult.license.rif}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Tipo de Licencia:</span>
                <span className="font-semibold text-indigo-400 uppercase">{validationResult.license.tipo}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Vigencia / Expiración:</span>
                <span className="font-bold text-emerald-400">
                  {validationResult.license.fechaVencimiento === 'VITALICIA'
                    ? 'Vitalicia (Permanente)'
                    : validationResult.license.fechaVencimiento}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Cajas / Sucursales Autorizadas:</span>
                <span className="font-medium text-slate-200">
                  {validationResult.license.cajasMax} Cajas / {validationResult.license.sucursalesMax} Sucursales
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-center py-6 text-xs text-slate-500">
              <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-600" />
              No hay una licencia activa instalada en este equipo.
            </div>
          )}
        </div>
      </div>

      {/* Developer Master License Generator */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/30 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Generador Maestro de Licencias (Solo Desarrollador)
              </h4>
              <p className="text-xs text-slate-400">
                Emite claves criptográficas autorizadas para enviar a tus clientes.
              </p>
            </div>
          </div>

          {!devUnlocked && (
            <form onSubmit={handleDevUnlock} className="flex items-center gap-2">
              <input
                type="password"
                placeholder="PIN Maestro"
                value={devPin}
                onChange={(e) => setDevPin(e.target.value)}
                className="w-36 bg-slate-950 border border-slate-700 text-xs px-3 py-2 rounded-xl text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Acceder
              </button>
            </form>
          )}
        </div>

        {devUnlocked ? (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  ID de Hardware Destino (Cliente):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={genTargetMachineId}
                    onChange={(e) => setGenTargetMachineId(e.target.value)}
                    placeholder="POS-XXXX-XXXX-XXXX-XXXX"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-emerald-400"
                  />
                  <button
                    type="button"
                    onClick={() => setGenTargetMachineId(machineId)}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] rounded-lg border border-slate-700"
                    title="Usar ID de este equipo"
                  >
                    Este Equipo
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Razón Social / Nombre del Negocio:
                </label>
                <input
                  type="text"
                  value={genEmpresa}
                  onChange={(e) => setGenEmpresa(e.target.value)}
                  placeholder="Ej: Inversiones El Éxito C.A."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  RIF / Cédula:
                </label>
                <input
                  type="text"
                  value={genRif}
                  onChange={(e) => setGenRif(e.target.value)}
                  placeholder="J-12345678-9"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Tipo de Licencia:
                </label>
                <select
                  value={genTipo}
                  onChange={(e) => setGenTipo(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="vitalicia">Vitalicia (Sin Vencimiento)</option>
                  <option value="anual">Anual (1 Año)</option>
                  <option value="semestral">Semestral (6 Meses)</option>
                  <option value="mensual">Mensual (30 Días)</option>
                  <option value="demo">Demo / Prueba (15 Días)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Cajas Máximas:
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={genCajas}
                  onChange={(e) => setGenCajas(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Sucursales Máximas:
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={genSucursales}
                  onChange={(e) => setGenSucursales(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleGenerateKey}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  Generar Clave
                </button>
              </div>
            </div>

            {generatedKeyResult && (
              <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/40 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    ¡Clave Criptográfica Generada con Éxito!
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedKeyResult);
                      setCopiedGenKey(true);
                      setTimeout(() => setCopiedGenKey(false), 2500);
                    }}
                    className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedGenKey ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>¡Copiada!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Clave</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-black/50 p-3 rounded-lg border border-slate-800">
                  <p className="font-mono text-xs text-slate-200 break-all select-all leading-relaxed">
                    {generatedKeyResult}
                  </p>
                </div>
                <p className="text-[11px] text-slate-400">
                  Copie y envíe esta clave a su cliente. Al ingresarla en su equipo con el ID <strong className="text-slate-300 font-mono">{genTargetMachineId}</strong>, su sistema se activará inmediatamente.
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-500">
            Ingrese el PIN Maestro de Desarrollador para emitir licencias a nuevos clientes o extender vencimientos.
          </p>
        )}
      </div>
    </div>
  );
};
