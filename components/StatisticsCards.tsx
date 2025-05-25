import React from 'react';
import type { SimulationDataPoint, SearParams, InitialConditions } from '../types';
import { UsersIcon, EyeIcon, ZapIcon, ShieldCheckIcon } from './icons';
import ExportFeature from './ExportFeature';

interface StatisticsCardsProps {
  simulationData: SimulationDataPoint[];
  hasIntervention: boolean;
  currentR0: number;
  N_initial: number;
  params: SearParams;
  initialConditions: InitialConditions;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  sparklineData: number[];
  trend?: 'up' | 'down' | 'stable';
  suffix?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color, 
  sparklineData, 
  trend,
  suffix = ''
}) => {
  const max = Math.max(...sparklineData);
  const min = Math.min(...sparklineData);
  const range = max - min || 1;

  const getTrendIcon = () => {
    if (trend === 'up') return '↗';
    if (trend === 'down') return '↘';
    return '→';
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <div className="bg-white dark:bg-slate-700 p-4 rounded-lg border border-slate-200 dark:border-slate-600 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className={`${color} p-2 rounded-lg`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {getTrendIcon()}
          </span>
        )}
      </div>
      
      <div className="mb-2">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {value.toLocaleString()}{suffix}
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          {title}
        </div>
      </div>

      {/* Mini sparkline */}
      <div className="h-8 flex items-end justify-between space-x-0.5">
        {sparklineData.slice(-20).map((point, index) => {
          const height = ((point - min) / range) * 100;
          return (
            <div
              key={index}
              className={`w-1 rounded-t ${color.replace('text-', 'bg-').replace('-500', '-300')} opacity-70`}
              style={{ height: `${Math.max(height, 2)}%` }}
            />
          );
        })}
      </div>
    </div>
  );
};

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ 
  simulationData, 
  hasIntervention, 
  currentR0, 
  N_initial,
  params,
  initialConditions
}) => {
  if (simulationData.length === 0) return null;

  const lastPoint = simulationData[simulationData.length - 1];
  const finalPopulation = Math.round(lastPoint.S + lastPoint.E + lastPoint.A + lastPoint.R);
  
  // Calculate trends (comparing last 10% vs previous 10%)
  const trendLength = Math.max(1, Math.floor(simulationData.length * 0.1));
  const recent = simulationData.slice(-trendLength);
  const previous = simulationData.slice(-trendLength * 2, -trendLength);
  
  const getAverageTrend = (compartment: keyof SimulationDataPoint): 'up' | 'down' | 'stable' => {
    if (previous.length === 0) return 'stable';
    const recentAvg = recent.reduce((sum, d) => sum + d[compartment], 0) / recent.length;
    const previousAvg = previous.reduce((sum, d) => sum + d[compartment], 0) / previous.length;
    
    if (recentAvg > previousAvg * 1.05) return 'up';
    if (recentAvg < previousAvg * 0.95) return 'down';
    return 'stable';
  };

  const stats = [
    {
      title: 'Susceptible',
      value: Math.round(lastPoint.S),
      icon: <UsersIcon className="w-5 h-5" />,
      color: 'text-blue-500',
      sparklineData: simulationData.map(d => d.S),
      trend: getAverageTrend('S')
    },
    {
      title: 'Exposed',
      value: Math.round(lastPoint.E),
      icon: <EyeIcon className="w-5 h-5" />,
      color: 'text-yellow-500',
      sparklineData: simulationData.map(d => d.E),
      trend: getAverageTrend('E')
    },
    {
      title: 'Addicted',
      value: Math.round(lastPoint.A),
      icon: <ZapIcon className="w-5 h-5" />,
      color: 'text-red-500',
      sparklineData: simulationData.map(d => d.A),
      trend: getAverageTrend('A')
    },
    {
      title: 'Recovered',
      value: Math.round(lastPoint.R),
      icon: <ShieldCheckIcon className="w-5 h-5" />,
      color: 'text-green-500',
      sparklineData: simulationData.map(d => d.R),
      trend: getAverageTrend('R')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-300 dark:border-slate-600">
        <h3 className="text-lg font-semibold text-blue-600 dark:text-sky-400 mb-3">Ringkasan Populasi</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Populasi Awal</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">{N_initial.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Populasi Akhir</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">{finalPopulation.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-slate-600 dark:text-slate-400">R₀ (Reproduksi)</div>
            <div className={`text-lg font-bold ${currentR0 < 1 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {currentR0.toFixed(3)}
            </div>
          </div>
          <div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Status Intervensi</div>
            <div className={`text-lg font-bold ${hasIntervention ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
              {hasIntervention ? 'Aktif' : 'Tidak Aktif'}
            </div>
          </div>
        </div>
      </div>      {/* Individual Compartment Statistics with Sparklines */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Export Feature */}
      <ExportFeature
        params={params}
        initialConditions={initialConditions}
        simulationData={simulationData}
        hasIntervention={hasIntervention}
        currentR0={currentR0}
      />
    </div>
  );
};

export default StatisticsCards;
