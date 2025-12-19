
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
  { name: 'Wk-4', temp: 11.2, fidelity: 99.7 },
  { name: 'Wk-3', temp: 11.5, fidelity: 99.65 },
  { name: 'Wk-2', temp: 10.9, fidelity: 99.78 },
  { name: 'Wk-1', temp: 10.8, fidelity: 99.85 },
  { name: 'Now', temp: 10.8, fidelity: 99.9 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/80 p-2 border border-cyan-400 text-white rounded-md text-sm">
          <p className="label">{`${label}`}</p>
          <p className="text-blue-400">{`Avg Temp: ${payload[0].value.toFixed(2)} mK`}</p>
          <p className="text-green-400">{`Fidelity: ${payload[1].value.toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };

const HistoricalTrendsChart: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <h3 className="text-cyan-300 text-sm tracking-widest flex-shrink-0 text-center">HISTORICAL QPU TRENDS</h3>
      <div className="flex-grow w-full h-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="1 1" stroke="rgba(0, 255, 255, 0.2)" />
            <XAxis dataKey="name" stroke="rgba(0, 255, 255, 0.7)" tick={{ fontSize: 10 }} />
            <YAxis yAxisId="left" stroke="#38bdf8" domain={[10, 12]} tick={{ fontSize: 10 }}/>
            <YAxis yAxisId="right" orientation="right" stroke="#4ade80" domain={[99.5, 100]} tick={{ fontSize: 10 }}/>
            <Tooltip content={<CustomTooltip />} cursor={{stroke: 'cyan', strokeWidth: 1}}/>
            <Line yAxisId="left" type="monotone" dataKey="temp" name="Avg Temp" stroke="#38bdf8" strokeWidth={2} dot={{r: 3}} />
            <Line yAxisId="right" type="monotone" dataKey="fidelity" name="Fidelity" stroke="#4ade80" strokeWidth={2} dot={{r: 3}} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HistoricalTrendsChart;
