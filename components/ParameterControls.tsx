
import React from 'react';
import type { SeirParams, InitialConditions, SeirParameterKey, InitialConditionKey } from '../types';
import { THETA_WITH_INTERVENTION, THETA_WITHOUT_INTERVENTION } from '../constants';

interface ParameterControlsProps {
  params: Omit<SeirParams, 'theta'>; 
  initialConditions: InitialConditions;
  hasIntervention: boolean;
  onParamChange: <K extends SeirParameterKey,>(paramName: K, value: number) => void;
  onInitialConditionChange: <K extends InitialConditionKey,>(conditionName: K, value: number) => void;
  onInterventionChange: (hasIntervention: boolean) => void;
  N_initial: number;
}

const ParameterInput: React.FC<{
  label: string;
  id: string; 
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  tooltip?: string;
}> = ({ label, id, value, min = 0, max = 1, step = 0.001, onChange, tooltip }) => (
  <div className="mb-5">
    <label htmlFor={`${id}-number`} className="block text-sm font-medium text-sky-300 mb-1.5" title={tooltip}>
      {label} {tooltip && <span className="text-xs text-slate-400 cursor-help">(?)</span>}
    </label>
    <div className="flex items-center space-x-3">
      <input
        type="range"
        id={`${id}-range`}
        name={`${id}-range`}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500"
        aria-label={`${label} slider`}
      />
      <input
        type="number"
        id={`${id}-number`}
        name={`${id}-number`}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-24 p-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-white placeholder-slate-400 text-sm text-right"
        aria-label={`${label} nilai`}
      />
    </div>
  </div>
);

const InitialConditionInput: React.FC<{
  label: string;
  id: string;
  value: number;
  onChange: (value: number) => void;
  tooltip?: string;
}> = ({ label, id, value, onChange, tooltip }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-sky-300 mb-1" title={tooltip}>
      {label} {tooltip && <span className="text-xs text-slate-400 cursor-help">(?)</span>}
    </label>
    <input
      type="number"
      id={id}
      name={id}
      value={value}
      min={0} 
      max={100000} 
      step={1} 
      onChange={(e) => onChange(Math.max(0, parseInt(e.target.value, 10)) || 0)}
      className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-white placeholder-slate-400"
    />
  </div>
);


const ParameterControls: React.FC<ParameterControlsProps> = ({
  params,
  initialConditions,
  hasIntervention,
  onParamChange,
  onInitialConditionChange,
  onInterventionChange,
  N_initial
}) => {
  const seirParamDetails: Array<{ key: SeirParameterKey; label: string; tooltip: string; min?:number; max?:number; step?:number;}> = [
    { key: 'mu1', label: 'μ1 (Faktor Rekrutmen)', tooltip: 'Faktor untuk laju masuk individu baru ke Susceptible (Λ = μ1 * N_awal). Proporsi dari N_awal per bulan.', min:0, max:1, step:0.001 },
    { key: 'mu2', label: 'μ2 (Laju Keluar Alami)', tooltip: 'Laju keluar alami dari semua kompartemen (misalnya, lulus sekolah, berhenti main game karena alasan lain selain pemulihan). Proporsi per bulan.', min:0, max:0.5, step:0.001 },
    { key: 'alpha', label: 'α (Laju Paparan)', tooltip: 'Laju individu Susceptible menjadi Exposed (terpapar/mulai mencoba game). Proporsi per bulan.', min:0, max:1, step:0.001 },
    { key: 'beta', label: 'β (Laju Infeksi/Kecanduan)', tooltip: 'Laju individu Exposed menjadi Infected (kecanduan game). Proporsi per bulan.', min:0, max:1, step:0.001 },
    { key: 'gamma', label: 'γ (Laju Pemulihan Alami)', tooltip: 'Laju individu Infected pulih secara alami (tanpa intervensi). Proporsi per bulan.', min:0, max:1, step:0.001 },
  ];

  const initialConditionDetails: Array<{ key: InitialConditionKey; label: string; tooltip: string; }> = [
    { key: 'S0', label: 'Jumlah Awal Susceptible (S0)', tooltip: 'Jumlah awal individu yang rentan.' },
    { key: 'E0', label: 'Jumlah Awal Exposed (E0)', tooltip: 'Jumlah awal individu yang mulai mencoba game.' },
    { key: 'I0', label: 'Jumlah Awal Infected (I0)', tooltip: 'Jumlah awal individu yang sudah kecanduan game.' },
    { key: 'R0', label: 'Jumlah Awal Recovered (R0)', tooltip: 'Jumlah awal individu yang sudah berhenti bermain/pulih.' },
  ];
  
  const lajuMasukBaru = params.mu1 * N_initial;

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-sky-400 mb-3 border-b border-slate-700 pb-2">Parameter Model</h3>
        {seirParamDetails.map(({ key, label, tooltip, min, max, step }) => (
          <ParameterInput
            key={key}
            label={label}
            id={key}
            value={params[key]}
            min={min}
            max={max}
            step={step}
            onChange={(val) => onParamChange(key, val)}
            tooltip={tooltip}
          />
        ))}
         <div className="mb-4 p-3 bg-slate-700/50 rounded-md">
            <p className="text-sm text-sky-300">Laju Masuk Susceptible Baru (Λ):</p>
            <p className="text-lg font-semibold text-white">{lajuMasukBaru.toFixed(2)} individu/bulan</p>
            <p className="text-xs text-slate-400">(Berdasarkan μ1 × N_awal, dimana N_awal = {N_initial})</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-sky-400 mb-3 border-b border-slate-700 pb-2">Populasi Awal</h3>
        {initialConditionDetails.map(({ key, label, tooltip }) => (
          <InitialConditionInput
            key={key}
            label={label}
            id={key}
            value={initialConditions[key]}
            onChange={(val) => onInitialConditionChange(key, val)}
            tooltip={tooltip}
          />
        ))}
         <div className="mt-2 p-3 bg-slate-700/50 rounded-md">
            <p className="text-sm text-sky-300">Total Populasi Awal (N_awal):</p>
            <p className="text-lg font-semibold text-white">{N_initial}</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-sky-400 mb-3 border-b border-slate-700 pb-2">Intervensi (θ)</h3>
        <div className="flex items-center justify-between bg-slate-700/50 p-3 rounded-md">
          <label htmlFor="interventionToggle" className="text-sm font-medium text-sky-300">
            Aktifkan Intervensi (Pengawasan & Konseling)
          </label>
          <button
            type="button"
            id="interventionToggle"
            onClick={() => onInterventionChange(!hasIntervention)}
            className={`${
              hasIntervention ? 'bg-sky-500' : 'bg-slate-600'
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800`}
            role="switch"
            aria-checked={hasIntervention}
            aria-label="Aktifkan Intervensi"
          >
            <span className="sr-only">Aktifkan Intervensi</span>
            <span
              aria-hidden="true"
              className={`${
                hasIntervention ? 'translate-x-5' : 'translate-x-0'
              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          θ (Faktor Laju Pemulihan dengan Intervensi): {hasIntervention ? THETA_WITH_INTERVENTION : THETA_WITHOUT_INTERVENTION}
        </p>
      </div>
    </form>
  );
};

export default ParameterControls;
