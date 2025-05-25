import React from 'react';
import type { SearParams, InitialConditions } from '../types';
import { ZapIcon, BookOpenIcon, ShieldCheckIcon } from './icons';

interface Preset {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  params: Omit<SearParams, 'theta'>;
  initialConditions: InitialConditions;
  hasIntervention: boolean;
}

interface PresetConfigurationsProps {
  onPresetSelect: (preset: Preset) => void;
}

const presets: Preset[] = [
  {
    id: 'default',
    name: 'Skenario Default',
    description: 'Parameter sesuai paper asli dengan intervensi',
    icon: <BookOpenIcon className="w-5 h-5" />,
    params: {
      mu1: 0.409,
      mu2: 0.097,
      alpha: 0.438,
      beta: 0.102,
      gamma: 0.051,
    },
    initialConditions: {
      S0: 72,  // Sesuai paper asli
      E0: 77,  // Sesuai paper asli
      A0: 18,  // Sesuai paper asli
      R0: 9,   // Sesuai paper asli
    },
    hasIntervention: true,
  },
  {
    id: 'high-risk',
    name: 'Skenario Risiko Tinggi',
    description: 'Parameter tinggi tanpa intervensi',
    icon: <ZapIcon className="w-5 h-5" />,
    params: {
      mu1: 0.409,
      mu2: 0.050,
      alpha: 0.600,
      beta: 0.200,
      gamma: 0.030,
    },
    initialConditions: {
      S0: 72,  // Sesuai paper asli
      E0: 77,  // Sesuai paper asli
      A0: 18,  // Sesuai paper asli
      R0: 9,   // Sesuai paper asli
    },
    hasIntervention: false,
  },
  {
    id: 'controlled',
    name: 'Skenario Terkendali',
    description: 'Parameter rendah dengan intervensi optimal',
    icon: <ShieldCheckIcon className="w-5 h-5" />,
    params: {
      mu1: 0.409,
      mu2: 0.120,
      alpha: 0.200,
      beta: 0.050,
      gamma: 0.100,
    },
    initialConditions: {
      S0: 72,  // Sesuai paper asli
      E0: 77,  // Sesuai paper asli
      A0: 18,  // Sesuai paper asli
      R0: 9,   // Sesuai paper asli
    },
    hasIntervention: true,
  },
];

const PresetConfigurations: React.FC<PresetConfigurationsProps> = ({ onPresetSelect }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-blue-600 dark:text-sky-400 mb-3">
        Konfigurasi Cepat
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onPresetSelect(preset)}
            className="p-3 text-left bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm hover:shadow-md hover:border-sky-400 dark:hover:border-sky-500 transition-all duration-200 group min-h-[90px] flex flex-col justify-between"
          >
            <div className="flex items-start gap-2 mb-2">
              <div className="text-sky-500 group-hover:text-sky-600 transition-colors flex-shrink-0 mt-0.5">
                {preset.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm leading-tight mb-1">
                  {preset.name}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed break-words">
                  {preset.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PresetConfigurations;
export type { Preset };
