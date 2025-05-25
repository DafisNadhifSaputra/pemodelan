import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Simple test chart to verify Recharts is working
const SimpleChart: React.FC = () => {
  const testData = [
    { time: 0, S: 135, E: 40, A: 1, R: 0 },
    { time: 12, S: 120, E: 35, A: 15, R: 6 },
    { time: 24, S: 100, E: 30, A: 25, R: 21 },
    { time: 36, S: 85, E: 25, A: 35, R: 31 }
  ];

  return (
    <div className="w-full h-full border-2 border-green-500 bg-green-50 dark:bg-green-900/20">
      <h3 className="text-green-800 dark:text-green-300 mb-2 font-bold">Test Chart (Recharts Working)</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={testData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="S" stroke="#8884d8" />
          <Line type="monotone" dataKey="E" stroke="#82ca9d" />
          <Line type="monotone" dataKey="A" stroke="#ff7300" />
          <Line type="monotone" dataKey="R" stroke="#ff0000" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleChart;
