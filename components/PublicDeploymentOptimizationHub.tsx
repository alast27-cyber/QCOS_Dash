import React, { useState } from 'react';
import GlassPanel from './GlassPanel';
import {
  GlobeIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  ClockIcon,
  BoxIcon, 
  ArrowTopRightOnSquareIcon,
  CubeIcon,
  Cog6ToothIcon,
} from './Icons';

// Interface for mock application data
interface App {
  id: string;
  name: string;
  icon: React.ElementType; // Icon component type
  isPublic: boolean;
  publicUrl?: string;
  optimizationStatus: 'Optimized' | 'Monitoring' | 'Action Recommended' | 'Initializing';
}

// Mock data for installed CHIPS applications
const mockApps: App[] = [
  {
    id: 'quantum-app-exchange',
    name: 'Quantum App Exchange',
    icon: BoxIcon,
    isPublic: true,
    publicUrl: 'https://qcos.apps.web/app-exchange',
    optimizationStatus: 'Optimized',
  },
  {
    id: 'qcos-system-evolution',
    name: 'QCOS System Evolution',
    icon: Cog6ToothIcon,
    isPublic: false,
    optimizationStatus: 'Monitoring',
  },
  {
    id: 'molecular-simulation-toolkit',
    name: 'Molecular Simulation Toolkit',
    icon: CubeIcon,
    isPublic: true,
    publicUrl: 'https://qcos.apps.web/mol-sim',
    optimizationStatus: 'Action Recommended',
  },
  {
    id: 'q-biomed-drug-discovery',
    name: 'Q-BioMed: Drug Discovery',
    icon: BoxIcon,
    isPublic: false,
    optimizationStatus: 'Initializing',
  },
  {
    id: 'global-abundance-engine',
    name: 'Global Abundance Engine',
    icon: GlobeIcon,
    isPublic: true,
    publicUrl: 'https://qcos.apps.web/abundance',
    optimizationStatus: 'Optimized',
  },
];

const PublicDeploymentOptimizationHub: React.FC = () => {
  const [apps, setApps] = useState<App[]>(mockApps);

  // Toggles the public status of an application
  const togglePublicStatus = (appId: string) => {
    setApps((prevApps) =>
      prevApps.map((app) =>
        app.id === appId
          ? {
              ...app,
              isPublic: !app.isPublic,
              // Generate a simple public URL if becoming public, clear if becoming private
              publicUrl: !app.isPublic
                ? `https://qcos.apps.web/${app.id.replace(/-/g, '')}`
                : undefined,
            }
          : app
      )
    );
  };

  // Returns the appropriate icon for the QNN optimization status
  const getOptimizationIcon = (status: App['optimizationStatus']) => {
    switch (status) {
      case 'Optimized':
        return <CheckCircle2Icon className="w-4 h-4 text-green-400 mr-1" />;
      case 'Monitoring':
        return <ClockIcon className="w-4 h-4 text-yellow-400 mr-1" />;
      case 'Action Recommended':
        return <AlertTriangleIcon className="w-4 h-4 text-red-400 mr-1" />;
      case 'Initializing':
        return <ClockIcon className="w-4 h-4 text-gray-400 mr-1" />;
      default:
        return null;
    }
  };

  // Simulates navigation to the QCOS System Evolution panel for an app
  const navigateToSystemEvolution = (appId: string, appName: string) => {
    console.log(`Navigating to QCOS System Evolution for app: ${appName} (ID: ${appId})`);
    // In a real QCOS environment, this would trigger a dashboard navigation or open a sub-panel.
    // For this demonstration, we use a console log.
    // alert(`Opening QCOS System Evolution details for ${appName}`);
  };

  return (
    <GlassPanel title="Public Deployment & Optimization Hub">
      <div className="p-4 space-y-4 text-sm h-full overflow-y-auto">
        <p className="text-cyan-200 mb-4">
          Manage public access for your CHIPS applications via the <span className="text-cyan-400 font-semibold">Quantum-to-Web Gateway</span> and monitor their <span className="text-cyan-400 font-semibold">QNN optimization status</span>.
        </p>

        {apps.map((app) => (
          <div
            key={app.id}
            className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 bg-black/20 rounded-lg border border-cyan-700/50 hover:border-cyan-500/50 transition-colors duration-200"
          >
            <div className="flex items-center flex-grow mb-2 md:mb-0 w-full md:w-auto">
              <app.icon className="w-6 h-6 text-cyan-300 mr-3" />
              <span className="font-medium text-cyan-100 flex-grow break-all">{app.name}</span>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
              {/* Public Gateway Toggle */}
              <div className="flex items-center">
                <GlobeIcon className="w-5 h-5 text-cyan-400 mr-2" />
                <label htmlFor={`toggle-${app.id}`} className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id={`toggle-${app.id}`}
                    className="sr-only peer"
                    checked={app.isPublic}
                    onChange={() => togglePublicStatus(app.id)}
                  />
                  <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-cyan-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-300">Public</span>
                </label>
              </div>

              {/* Public URL Display */}
              {app.isPublic && app.publicUrl && (
                <div className="flex items-center md:min-w-[150px]"> {/* Added min-width to help alignment */}
                  <a
                    href={app.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 text-xs hover:underline flex items-center whitespace-nowrap overflow-hidden text-ellipsis"
                    title={`Open ${app.publicUrl}`}
                  >
                    {app.publicUrl.replace('https://', '')}
                    <ArrowTopRightOnSquareIcon className="w-3 h-3 ml-1 flex-shrink-0" />
                  </a>
                </div>
              )}

              {/* QNN Optimization Status Indicator */}
              <button
                onClick={() => navigateToSystemEvolution(app.id, app.name)}
                className={`flex items-center px-2 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${
                  app.optimizationStatus === 'Optimized' ? 'bg-green-700/30 text-green-300' :
                  app.optimizationStatus === 'Monitoring' ? 'bg-yellow-700/30 text-yellow-300' :
                  app.optimizationStatus === 'Action Recommended' ? 'bg-red-700/30 text-red-300' :
                  'bg-gray-700/30 text-gray-300'
                } hover:bg-white/10 transition-colors duration-200`}
                title={`View QNN optimization details for ${app.name} in QCOS System Evolution`}
              >
                {getOptimizationIcon(app.optimizationStatus)}
                {app.optimizationStatus}
              </button>
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
};

export default PublicDeploymentOptimizationHub;
