
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { SimulationDataPoint } from '../types';

interface SimulationChartProps {
  data: SimulationDataPoint[];
  hasIntervention?: boolean;
  showPaperReference?: boolean;
}

const SimulationChart: React.FC<SimulationChartProps> = ({ data, hasIntervention = false, showPaperReference = true }) => {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-slate-400">Tidak ada data simulasi untuk ditampilkan. Sesuaikan parameter dan populasi.</div>;
  }
  
  // Paper expected values at month 36
  const paperExpected = {
    withIntervention: { I: 26, R: 250, E: 290, S: 135 },
    withoutIntervention: { I: 200, R: 95, E: 290, S: 135 }
  };
  
  const expectedValues = hasIntervention ? paperExpected.withIntervention : paperExpected.withoutIntervention;
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 20, // Increased bottom margin for X-axis label
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#475569" /> {/* slate-600 */}
        <XAxis 
          dataKey="time" 
          label={{ value: 'Waktu (Bulan)', position: 'insideBottom', offset: -15, fill: '#94a3b8' }} // slate-400
          stroke="#94a3b8" // slate-400
          tick={{ fill: '#cbd5e1' }} // slate-300
        />
        <YAxis 
          label={{ value: 'Jumlah Individu', angle: -90, position: 'insideLeft', fill: '#94a3b8', dx: -10 }} // slate-400
          stroke="#94a3b8" // slate-400
          tick={{ fill: '#cbd5e1' }} // slate-300
          allowDataOverflow={true}
          domain={['auto', 'auto']}
          tickFormatter={(value) => Math.round(value).toString()}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem' }} // slate-800, slate-700
          labelStyle={{ color: '#60a5fa' }} // sky-400
          itemStyle={{ color: '#e2e8f0' }} // slate-200
          formatter={(value: number, name: string, props: any) => {
            const total = props.payload ? (props.payload.S + props.payload.E + props.payload.I + props.payload.R) : 0;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
            return [`${Math.round(value)} individu (${percentage}%)`, name];
          }}
          labelFormatter={(label: number) => `Bulan ke-${label}`}
        />
        <Legend wrapperStyle={{ color: '#e2e8f0', bottom: -5 }} /> {/* slate-200, adjusted legend position */}
        
        {/* Reference lines for paper expected values */}
        {showPaperReference && (
          <>
            <ReferenceLine y={expectedValues.I} stroke="#f43f5e" strokeDasharray="5 5" strokeOpacity={0.6} label={{ value: `Paper I: ${expectedValues.I}`, position: 'insideTopRight', fill: '#f43f5e', fontSize: 10 }} />
            <ReferenceLine y={expectedValues.R} stroke="#4ade80" strokeDasharray="5 5" strokeOpacity={0.6} label={{ value: `Paper R: ${expectedValues.R}`, position: 'insideTopRight', fill: '#4ade80', fontSize: 10 }} />
          </>
        )}
        
        <Line type="monotone" dataKey="S" stroke="#38bdf8" strokeWidth={2} dot={false} name="Susceptible (Rentan)" /> {/* sky-500 */}
        <Line type="monotone" dataKey="E" stroke="#facc15" strokeWidth={2} dot={false} name="Exposed (Terpapar)" /> {/* yellow-500 */}
        <Line type="monotone" dataKey="I" stroke="#f43f5e" strokeWidth={2} dot={false} name="Infected (Kecanduan)" /> {/* rose-500 */}
        <Line type="monotone" dataKey="R" stroke="#4ade80" strokeWidth={2} dot={false} name="Recovered (Pulih)" /> {/* green-500 */}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SimulationChart;
