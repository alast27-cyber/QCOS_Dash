
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import GlassPanel from './GlassPanel';
import { GlobeIcon, ArrowTrendingUpIcon, ShieldCheckIcon } from './Icons';

// --- Helper Components ---
const KpiCard = ({ title, value, unit, change, changeType }: { title: string, value: string, unit: string, change: string, changeType: 'increase' | 'decrease' }) => (
    <div className="bg-black/20 p-3 rounded-lg border border-cyan-900 text-center">
        <p className="text-sm text-cyan-400 tracking-wider">{title}</p>
        <p className="text-3xl font-mono text-white my-1">{value}<span className="text-base text-cyan-500 ml-1">{unit}</span></p>
        <p className={`text-xs font-bold ${changeType === 'increase' ? 'text-red-400' : 'text-green-400'}`}>
            {changeType === 'increase' ? '▲' : '▼'} {change}
        </p>
    </div>
);

const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/80 p-2 border border-cyan-400 text-white rounded-md text-sm font-mono">
          <p className="label">{`Day ${label}: $${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
};

const WorldMap = () => (
    <div className="relative w-full h-full bg-cyan-950/30 rounded-lg p-2 flex items-center justify-center">
        {/* Simplified world map SVG shape */}
        <svg viewBox="0 0 1000 500" className="w-full h-full opacity-30">
            <path d="M499.999,0.001c-15.006,0-29.352,1.52-42.909,4.41L457,4.407C328.056,32.964,213.923,111.45,142.167,216.51 C73.431,316.4,56.683,435.15,91.3,539.32l-9.15,29.17c-2.433,7.74-0.97,16.14,4.02,22.83c5,6.69,12.75,10.68,21.03,10.68h787.6 c8.28,0,16.03-3.99,21.03-10.68c5-6.69,6.46-15.09,4.02-22.83l-9.15-29.17c34.61-104.17,17.87-222.92-50.86-322.81 C787.076,111.45,671.944,32.964,543,4.407l-0.091,0.003C529.352,1.52,515.006,0.001,499.999,0.001z" fill="#083344" />
        </svg>
        {/* Risk Hotspots */}
        <div className="absolute w-4 h-4 rounded-full bg-red-500 animate-pulse" style={{ top: '45%', left: '75%' }} title="High ASF Risk: SE Asia"></div>
        <div className="absolute w-3 h-3 rounded-full bg-yellow-500 animate-pulse" style={{ top: '35%', left: '52%' }} title="Medium Risk: E. Europe"></div>

        {/* Trade Routes */}
        <svg className="absolute inset-0 w-full h-full overflow-visible">
            <defs><marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(0,255,255,0.7)" /></marker></defs>
            <path d="M 200 250 Q 500 150, 800 200" stroke="rgba(0,255,255,0.7)" strokeWidth="1.5" fill="none" strokeDasharray="5 5" className="animate-flow" markerEnd="url(#arrow)" />
            <path d="M 220 280 Q 400 400, 750 350" stroke="rgba(0,255,255,0.7)" strokeWidth="1.5" fill="none" strokeDasharray="5 5" className="animate-flow" style={{animationDelay: '0.5s'}} markerEnd="url(#arrow)" />
        </svg>
        <div className="absolute bottom-2 left-2 text-xs text-cyan-500">
            <p>Red/Yellow: Disease Risk Zones</p>
            <p>Blue Lines: Optimized Logistics Routes</p>
        </div>
    </div>
);

// --- Main Component ---
const GlobalSwineForesight: React.FC = () => {
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        const generateData = () => {
            let corn = 180; let soy = 450; let pork = 90;
            const data = Array.from({ length: 30 }, (_, i) => {
                corn += (Math.random() - 0.5) * 5;
                soy += (Math.random() - 0.5) * 10;
                pork += (Math.random() - 0.5) * 2;
                return { day: i + 1, corn: Math.max(150, corn), soy: Math.max(400, soy), pork: Math.max(80, pork) };
            });
            setChartData(data);
        };
        generateData();
        const interval = setInterval(generateData, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <GlassPanel title={<div className="flex items-center"><GlobeIcon className="w-6 h-6 mr-2" />Global Swine Foresight</div>}>
            <div className="p-4 h-full overflow-y-auto flex flex-col gap-4">
                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <KpiCard title="Biosecurity Threat Level" value="High" unit="" change="+2.1% this week" changeType="increase" />
                    <KpiCard title="Predicted Feed Cost Index" value="112.4" unit="pts" change="+0.8% this week" changeType="increase" />
                    <KpiCard title="Supply Chain Resilience" value="89.7" unit="%" change="-1.2% this week" changeType="decrease" />
                </div>

                {/* Main Content: Map and Charts */}
                <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
                    <div className="flex flex-col gap-4">
                        <div className="flex-1 bg-black/20 p-2 rounded-lg border border-cyan-900 min-h-[150px]">
                            <h4 className="text-sm font-semibold text-cyan-200 mb-1 flex items-center"><ArrowTrendingUpIcon className="w-4 h-4 mr-2" /> Commodity Forecasts (30-Day)</h4>
                            <p className="text-xs text-cyan-500 mb-2">Powered by Quantum Monte Carlo: Finance</p>
                            <ResponsiveContainer width="100%" height="85%">
                                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="1 1" stroke="rgba(0, 255, 255, 0.2)" />
                                    <XAxis dataKey="day" stroke="rgba(0, 255, 255, 0.7)" tick={{ fontSize: 10 }} />
                                    <YAxis stroke="rgba(0, 255, 255, 0.7)" tick={{ fontSize: 10 }} domain={['dataMin - 10', 'dataMax + 10']} />
                                    <Tooltip content={<CustomChartTooltip />} />
                                    <Line type="monotone" dataKey="corn" name="Corn" stroke="#facc15" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="soy" name="Soy" stroke="#86efac" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="pork" name="Pork" stroke="#f472b6" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="flex flex-col min-h-[300px] lg:min-h-0">
                        <h4 className="text-sm font-semibold text-cyan-200 mb-1 flex items-center"><ShieldCheckIcon className="w-4 h-4 mr-2" /> Global Risk & Logistics</h4>
                        <p className="text-xs text-cyan-500 mb-2">QNN Disease Modeling & Quantum Optimization</p>
                        <div className="flex-grow">
                             <WorldMap />
                        </div>
                    </div>
                </div>
            </div>
        </GlassPanel>
    );
};

export default GlobalSwineForesight;
