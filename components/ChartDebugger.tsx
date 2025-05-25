import React from 'react';
import type { SimulationDataPoint } from '../types';

interface ChartDebuggerProps {
  data: SimulationDataPoint[];
  title?: string;
}

const ChartDebugger: React.FC<ChartDebuggerProps> = ({ data, title = "Chart Debug" }) => {
  // Add console logging for debugging
  console.log(`${title} - Data length:`, data?.length || 0);
  console.log(`${title} - Has data:`, data && data.length > 0);
  if (data && data.length > 0) {
    console.log(`${title} - First point:`, data[0]);
    console.log(`${title} - Last point:`, data[data.length - 1]);
  }
  
  return (    <div className="p-4 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-400 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">🐛 {title}</h3>
      <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
        <p><strong>Data Length:</strong> {data?.length || 0}</p>
        <p><strong>Has Data:</strong> {data && data.length > 0 ? '✅ Yes' : '❌ No'}</p>
        <p><strong>Data Type:</strong> {typeof data} {Array.isArray(data) ? '(Array)' : ''}</p>
        {data && data.length > 0 && (
          <>
            <p><strong>First Point:</strong> {JSON.stringify(data[0])}</p>
            <p><strong>Last Point:</strong> {JSON.stringify(data[data.length - 1])}</p>
            <p><strong>Sample Values (First Point):</strong></p>
            <ul className="ml-4 space-y-1">
              <li>S: {data[0]?.S || 'undefined'} (type: {typeof data[0]?.S})</li>
              <li>E: {data[0]?.E || 'undefined'} (type: {typeof data[0]?.E})</li>
              <li>A: {data[0]?.A || 'undefined'} (type: {typeof data[0]?.A})</li>
              <li>R: {data[0]?.R || 'undefined'} (type: {typeof data[0]?.R})</li>
              <li>Time: {data[0]?.time || 'undefined'} (type: {typeof data[0]?.time})</li>
            </ul>
            <p><strong>Total at start:</strong> {(data[0]?.S || 0) + (data[0]?.E || 0) + (data[0]?.A || 0) + (data[0]?.R || 0)}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ChartDebugger;
