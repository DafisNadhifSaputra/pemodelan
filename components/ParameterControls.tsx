
import React from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import type { SearParams, InitialConditions, SearParameterKey, InitialConditionKey } from '../types';
import { THETA_WITH_INTERVENTION, THETA_WITHOUT_INTERVENTION } from '../constants';
import HelpTooltip from './HelpTooltip';
import CollapsibleSection from './CollapsibleSection';
import { RefreshIcon } from './icons';

interface ParameterControlsProps {
  params: Omit<SearParams, 'theta'>; 
  initialConditions: InitialConditions;
  simulationDuration: number;
  hasIntervention: boolean;
  showEquilibrium: boolean;
  onParamChange: <K extends SearParameterKey,>(paramName: K, value: number) => void;
  onInitialConditionChange: <K extends InitialConditionKey,>(conditionName: K, value: number) => void;
  onSimulationDurationChange: (duration: number) => void;
  onInterventionChange: (hasIntervention: boolean) => void;
  onEquilibriumToggle: (show: boolean) => void;
  onReset: () => void;
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
    <label htmlFor={`${id}-number`} className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-sky-300 mb-1.5">
      {label}
      {tooltip && (
        <HelpTooltip content={tooltip}>
          <span></span>
        </HelpTooltip>
      )}
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
        className="w-full h-2 bg-slate-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-sky-500"
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
        className="w-24 p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-gray-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 text-sm text-right"
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
    <label htmlFor={id} className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-sky-300 mb-1">
      {label}
      {tooltip && (
        <HelpTooltip content={tooltip}>
          <span></span>
        </HelpTooltip>
      )}
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
      className="w-full p-2.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-gray-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400"
    />
  </div>
);


const ParameterControls: React.FC<ParameterControlsProps> = ({
  params,
  initialConditions,
  simulationDuration,
  hasIntervention,
  showEquilibrium,
  onParamChange,
  onInitialConditionChange,
  onSimulationDurationChange,
  onInterventionChange,
  onEquilibriumToggle,
  onReset,
  N_initial
}) => {
  const searParamDetails: Array<{ key: SearParameterKey; label: string; tooltip: string; min?:number; max?:number; step?:number; isAdvanced?: boolean;}> = [
    { key: 'alpha', label: 'α (Laju Paparan)', tooltip: 'Laju individu Susceptible menjadi Exposed (terpapar/mulai mencoba game). Proporsi per bulan.', min:0, max:1, step:0.001 },
    { key: 'beta', label: 'β (Laju Infeksi/Kecanduan)', tooltip: 'Laju individu Exposed menjadi Infected (kecanduan game). Proporsi per bulan.', min:0, max:1, step:0.001 },
    { key: 'gamma', label: 'γ (Laju Pemulihan Alami)', tooltip: 'Laju individu Infected pulih secara alami (tanpa intervensi). Proporsi per bulan.', min:0, max:1, step:0.001 },
    { key: 'mu1', label: 'μ₁ (Faktor Rekrutmen)', tooltip: 'Faktor untuk laju masuk individu baru ke Susceptible (Λ = μ₁ × N₀). Proporsi dari N₀ per bulan.', min:0, max:1, step:0.001, isAdvanced: true },
    { key: 'mu2', label: 'μ₂ (Laju Keluar Alami)', tooltip: 'Laju keluar alami dari semua kompartemen (misalnya, lulus sekolah, berhenti main game karena alasan lain selain pemulihan). Proporsi per bulan.', min:0, max:0.5, step:0.001, isAdvanced: true },
  ];

  const basicParams = searParamDetails.filter(param => !param.isAdvanced);
  const advancedParams = searParamDetails.filter(param => param.isAdvanced);

  const initialConditionDetails: Array<{ key: InitialConditionKey; label: string; tooltip: string; }> = [
    { key: 'S0', label: 'Jumlah Awal Susceptible (S₀)', tooltip: 'Jumlah awal individu yang rentan.' },
    { key: 'E0', label: 'Jumlah Awal Exposed (E₀)', tooltip: 'Jumlah awal individu yang mulai mencoba game.' },
    { key: 'A0', label: 'Jumlah Awal Addicted (A₀)', tooltip: 'Jumlah awal individu yang sudah kecanduan game.' },
    { key: 'R0', label: 'Jumlah Awal Recovered (R₀)', tooltip: 'Jumlah awal individu yang sudah berhenti bermain/pulih.' },
  ];
  
  const lajuMasukBaru = params.mu1 * N_initial;

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-blue-600 dark:text-sky-400 border-b border-slate-300 dark:border-slate-700 pb-2 flex-1">Parameter Model</h3>
          <button
            type="button"
            onClick={onReset}
            className="ml-3 inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            aria-label="Reset ke nilai default"
          >
            <RefreshIcon className="w-4 h-4" />
            Reset Default
          </button>
        </div>
        
        {/* Basic Parameters */}
        {basicParams.map(({ key, label, tooltip, min, max, step }) => (
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

        {/* Advanced Parameters in Collapsible Section */}
        <CollapsibleSection 
          title="Parameter Lanjutan"
          defaultOpen={false}
        >
          {advancedParams.map(({ key, label, tooltip, min, max, step }) => (
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
        </CollapsibleSection>
        
         <div className="mb-4 p-3 bg-slate-100 dark:bg-slate-700/50 rounded-md">
            <p className="text-sm text-blue-600 dark:text-sky-300">Laju Masuk Susceptible Baru (<InlineMath math="\Lambda" />):</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{lajuMasukBaru.toFixed(2)} individu/bulan</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">(Berdasarkan <InlineMath math="\mu_1 \times N_0" />, dimana <InlineMath math="N_0 = " />{N_initial})</p>
        </div>
      </div>

      <CollapsibleSection 
        title="Populasi Awal"
        defaultOpen={true}
      >
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
         <div className="mt-2 p-3 bg-slate-100 dark:bg-slate-700/50 rounded-md">
            <p className="text-sm text-blue-600 dark:text-sky-300">Total Populasi Awal (<InlineMath math="N_0" />):</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{N_initial}</p>
        </div>
      </CollapsibleSection>
      
      <div>
        <h3 className="text-lg font-semibold text-blue-600 dark:text-sky-400 mb-3 border-b border-slate-300 dark:border-slate-700 pb-2">Durasi Simulasi</h3>
        <div className="mb-4">
          <label htmlFor="simulationDuration" className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-sky-300 mb-1.5">
            Durasi Simulasi (Bulan)
            <HelpTooltip content="Durasi simulasi dalam bulan. Menentukan berapa lama simulasi akan berjalan.">
              <span></span>
            </HelpTooltip>
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              id="simulationDuration-range"
              name="simulationDuration-range"
              value={simulationDuration}
              min={12}
              max={120}
              step={1}
              onChange={(e) => onSimulationDurationChange(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-sky-500"
              aria-label="Durasi simulasi slider"
            />
            <input
              type="number"
              id="simulationDuration-number"
              name="simulationDuration-number"
              value={simulationDuration}
              min={12}
              max={120}
              step={1}
              onChange={(e) => onSimulationDurationChange(parseInt(e.target.value, 10) || 36)}
              className="w-24 p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-gray-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 text-sm text-right"
              aria-label="Durasi simulasi nilai"
            />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-blue-600 dark:text-sky-400 mb-3 border-b border-slate-300 dark:border-slate-700 pb-2">Intervensi (<InlineMath math="\theta" />)</h3>
        <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-700/50 p-3 rounded-md">
          <label htmlFor="interventionToggle" className="text-sm font-medium text-blue-600 dark:text-sky-300">
            Aktifkan Intervensi (Pengawasan & Konseling)
          </label>
          <button
            type="button"
            id="interventionToggle"
            onClick={() => onInterventionChange(!hasIntervention)}
            className={`${
              hasIntervention ? 'bg-sky-500' : 'bg-slate-300 dark:bg-slate-600'
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800`}
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
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          <InlineMath math="\theta" /> (Faktor Laju Pemulihan dengan Intervensi): {hasIntervention ? THETA_WITH_INTERVENTION : THETA_WITHOUT_INTERVENTION}
        </p>
      </div>

      {/* Equilibrium Analysis Toggle */}
      <div>
        <h3 className="text-lg font-semibold text-blue-600 dark:text-sky-400 mb-3 border-b border-slate-300 dark:border-slate-700 pb-2">Analisis Titik Keseimbangan</h3>
        <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-700/50 p-3 rounded-md">
          <label htmlFor="equilibriumToggle" className="text-sm font-medium text-blue-600 dark:text-sky-300">
            Tampilkan Analisis Equilibrium
          </label>
          <button
            type="button"
            id="equilibriumToggle"
            onClick={() => onEquilibriumToggle(!showEquilibrium)}
            className={`${
              showEquilibrium ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800`}
            role="switch"
            aria-checked={showEquilibrium}
            aria-label="Tampilkan Analisis Equilibrium"
          >
            <span className="sr-only">Tampilkan Analisis Equilibrium</span>
            <span
              aria-hidden="true"
              className={`${
                showEquilibrium ? 'translate-x-5' : 'translate-x-0'
              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
          </button>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Menampilkan titik keseimbangan endemik teoretis dari model SEAR dan estimasi waktu konvergensi.
        </p>
        {showEquilibrium && (
          <div className="mt-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-700">
            <p className="text-xs text-purple-700 dark:text-purple-300">
              <strong>Mode Aktif:</strong> Simulasi akan disesuaikan untuk mengarahkan ke titik keseimbangan endemik. 
              Kondisi awal akan dimodifikasi agar hasil simulasi konvergen ke equilibrium endemik yang diharapkan.
            </p>
            <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-700">
              <p className="text-xs text-amber-700 dark:text-amber-300">
                <strong>Catatan Matematis:</strong> Model SEAR dengan transmisi kontinu (α &gt; 0) hanya memiliki keseimbangan endemik. 
                "Keseimbangan bebas penyakit" tidak valid secara matematis karena dE/dt = αS ≠ 0 ketika E = 0 dan S &gt; 0.
              </p>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default ParameterControls;
