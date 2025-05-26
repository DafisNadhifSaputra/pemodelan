import React from 'react';
import type { EquilibriumAnalysis, EquilibriumPoint as EquilibriumPointType } from '../types';
import { formatEquilibriumPoint, isNearEquilibrium } from '../utils/equilibriumAnalysis';
import { TargetIcon, TrendingUpIcon, TrendingDownIcon, ClockIcon } from './icons';
import HelpTooltip from './HelpTooltip';

interface EquilibriumDisplayProps {
  equilibriumAnalysis: EquilibriumAnalysis | null;
  currentState?: { S: number; E: number; A: number; R: number };
  isVisible: boolean;
  isEquilibriumMode?: boolean; // New prop to indicate if we're in equilibrium simulation mode
}

const EquilibriumPointComponent: React.FC<{
  point: EquilibriumPointType;
  title: string;
  description: string;
  currentState?: { S: number; E: number; A: number; R: number };
}> = ({ point, title, description, currentState }) => {
  const isNear = currentState ? isNearEquilibrium(currentState, point) : false;
  
  return (
    <div className={`p-3 rounded-lg border-2 ${
      point.type === 'disease-free' 
        ? 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
        : 'border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className={`font-semibold text-sm ${
          point.type === 'disease-free' 
            ? 'text-green-700 dark:text-green-300'
            : 'text-orange-700 dark:text-orange-300'
        }`}>
          {title}
        </h4>
        <div className="flex items-center space-x-1">
          {point.stability === 'stable' ? (
            <TrendingDownIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
          ) : (
            <TrendingUpIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
          )}
          {isNear && (
            <TargetIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          )}
        </div>
      </div>
      
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
        {description}
      </p>
      
      <div className="text-xs font-mono bg-white dark:bg-slate-800 p-2 rounded border">
        {formatEquilibriumPoint(point, 1)}
      </div>
      
      <div className="flex items-center justify-between mt-2 text-xs">
        <span className={`px-2 py-1 rounded ${
          point.stability === 'stable'
            ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300'
            : 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300'
        }`}>
          {point.stability === 'stable' ? 'Stabil' : 'Tidak Stabil'}
        </span>
        
        {isNear && (
          <span className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300">
            Mendekati
          </span>
        )}
      </div>
    </div>
  );
};

const EquilibriumDisplay: React.FC<EquilibriumDisplayProps> = ({
  equilibriumAnalysis,
  currentState,
  isVisible,
  isEquilibriumMode = false
}) => {
  if (!isVisible || !equilibriumAnalysis) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Mode Indicator */}
      {isEquilibriumMode && (
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <TargetIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Mode Simulasi Equilibrium Aktif
            </span>
          </div>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
            Simulasi telah disesuaikan untuk mengarahkan ke titik keseimbangan teoritis
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-blue-600 dark:text-sky-400 flex items-center">
          <TargetIcon className="w-5 h-5 mr-2" />
          Analisis Titik Keseimbangan
        </h3>
          <HelpTooltip content="⚠️ PERINGATAN MATEMATIKA: Penelitian terbaru menunjukkan bahwa model SEAR dengan continuous environmental transmission (α > 0) TIDAK memiliki disease-free equilibrium yang valid. Hanya endemic equilibrium yang secara matematika konsisten. Disease-free yang ditampilkan adalah asumsi teoritis yang keliru dalam paper original.">
          <span className="text-slate-400 dark:text-slate-500 text-sm cursor-help">
            ⚠️
          </span>
        </HelpTooltip>
      </div>

      {/* R0 Analysis */}
      <div className={`p-3 rounded-lg border-2 ${
        equilibriumAnalysis.R0 < 1
          ? 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
          : 'border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-sm">Basic Reproduction Number</span>
          <span className={`text-lg font-bold ${
            equilibriumAnalysis.R0 < 1
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          }`}>
            R₀ = {equilibriumAnalysis.R0.toFixed(3)}
          </span>
        </div>        <p className="text-xs text-slate-600 dark:text-slate-400">
          {equilibriumAnalysis.R0 < 1 
            ? "Kecanduan akan berkurang"
            : "Kecanduan akan menetap dalam populasi"
          }
        </p>
      </div>      {/* Disease-Free Equilibrium - DENGAN WARNING */}
      {equilibriumAnalysis.diseaseFreePoint && (
        <div className="border-2 border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          <div className="flex items-center mb-2">
            <span className="text-red-600 dark:text-red-400 text-sm font-semibold">⚠️ TIDAK VALID SECARA MATEMATIKA</span>
          </div>          <EquilibriumPointComponent
            point={equilibriumAnalysis.diseaseFreePoint}
            title="Disease-Free (Tidak Valid)"
            description="Model SEAR dengan α > 0 tidak memiliki disease-free equilibrium yang valid."
            currentState={currentState}          />
        </div>
      )}

      {/* Endemic Equilibrium */}
      {equilibriumAnalysis.endemicExists && equilibriumAnalysis.endemicPoint && (        <EquilibriumPointComponent
          point={equilibriumAnalysis.endemicPoint}
          title="Endemic Equilibrium"
          description="Kondisi dimana kecanduan menetap dalam populasi pada tingkat stabil."
          currentState={currentState}
        />
      )}

      {/* Time to Equilibrium */}
      {equilibriumAnalysis.timeToEquilibrium && (
        <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center mb-2">
            <ClockIcon className="w-4 h-4 mr-2 text-slate-600 dark:text-slate-400" />
            <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">
              Estimasi Waktu Konvergensi
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Sistem diperkirakan mencapai keseimbangan dalam ~{equilibriumAnalysis.timeToEquilibrium} bulan
          </p>
        </div>
      )}      {/* Information Note */}
      <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
        <p>
          <strong>Catatan:</strong> Model SEAR dengan α &gt; 0 hanya memiliki endemic equilibrium yang valid. 
          Fokus pada pengendalian tingkat kecanduan, bukan eliminasi total.
        </p>
      </div>
    </div>
  );
};

export default EquilibriumDisplay;
