import React from 'react';
import type { SimulationDataPoint } from '../types';

interface DebugPanelProps {
  simulationData: SimulationDataPoint[];
  N_initial: number;
  isVisible: boolean;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ simulationData, N_initial, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-4">
      <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">Debug Panel</h3>
      <div className="text-xs space-y-1 text-red-700 dark:text-red-400">
        <p><strong>N_initial:</strong> {N_initial}</p>
        <p><strong>simulationData length:</strong> {simulationData?.length || 0}</p>
        <p><strong>simulationData exists:</strong> {simulationData ? 'Yes' : 'No'}</p>
        {simulationData && simulationData.length > 0 && (
          <>
            <p><strong>First data point:</strong></p>
            <pre className="bg-red-100 dark:bg-red-800/30 p-2 rounded text-xs overflow-x-auto">
              {JSON.stringify(simulationData[0], null, 2)}
            </pre>
            <p><strong>Last data point:</strong></p>
            <pre className="bg-red-100 dark:bg-red-800/30 p-2 rounded text-xs overflow-x-auto">
              {JSON.stringify(simulationData[simulationData.length - 1], null, 2)}
            </pre>
          </>
        )}
      </div>
    </div>
  );
};

export default DebugPanel;
