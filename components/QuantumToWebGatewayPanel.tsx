import React, { useState } from 'react';
import GlassPanel from './GlassPanel';
// Using specific lucide icons used elsewhere in the project (CheckCircle2Icon for success, XCircleIcon for error)
import { GlobeIcon, UploadCloudIcon, LinkIcon, CheckCircle2Icon, XCircleIcon } from './Icons';

const QuantumToWebGatewayPanel: React.FC = () => {
  const [chipsAppId, setChipsAppId] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDeploy = async () => {
    if (!chipsAppId || !serviceName) {
      setErrorMessage("Please fill in both CHIPS Application ID and Public Service Name.");
      setDeploymentStatus('error');
      return;
    }

    setIsDeploying(true);
    setDeployedUrl(null);
    setErrorMessage(null);
    setDeploymentStatus('idle');

    try {
      // In a real-world scenario, this would involve an asynchronous API call to the Quantum-to-Web Gateway backend service.
      // This service would perform the steps outlined above:
      // 1. Validate the chipsAppId against active CHIPS network deployments.
      // 2. Provision network resources and an HTTPS endpoint via the Quantum-to-Web Gateway (leveraging QNNs).
      // 3. Configure quantum-resistant security measures and QNN-optimized routing.
      // 4. Register the new URL assignment for the application.

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Simulate success and a generated URL
      const newUrl = `https://${serviceName.toLowerCase().replace(/\s/g, '-')}-${chipsAppId.substring(0, 4)}.qcos.pub`;
      
      setDeployedUrl(newUrl);
      setDeploymentStatus('success');

    } catch (e) {
      console.error("Deployment failed:", e);
      setErrorMessage("Deployment failed due to a network or backend error. Check the QCOS logs.");
      setDeploymentStatus('error');
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <GlassPanel title="Quantum-to-Web Gateway" icon={GlobeIcon} description="Establish public-facing, QNN-optimized access for your CHIPS network applications.">
      <div className="flex flex-col space-y-4">
        {/* CHIPS Application ID Input */}
        <div className="flex flex-col">
          <label htmlFor="chipsAppId" className="text-sm font-medium text-cyan-300 mb-1 flex items-center">
            <GlobeIcon className="h-4 w-4 mr-2" /> CHIPS Application ID (UUID)
          </label>
          <input
            id="chipsAppId"
            type="text"
            value={chipsAppId}
            onChange={(e) => setChipsAppId(e.target.value)}
            placeholder="e.g., d5a9e3f1-b8c7..."
            className="w-full p-2 text-sm bg-black/50 border border-cyan-700/50 rounded-md focus:border-cyan-500 focus:ring-cyan-500 transition-all text-white placeholder-cyan-500/50"
          />
          <p className="text-xs text-cyan-600 mt-1">This ID links to the QCOS App Container.</p>
        </div>

        {/* Public Service Name Input */}
        <div className="flex flex-col">
          <label htmlFor="serviceName" className="text-sm font-medium text-cyan-300 mb-1 flex items-center">
            <LinkIcon className="h-4 w-4 mr-2" /> Public Service Name
          </label>
          <input
            id="serviceName"
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            placeholder="e.g., my-quantum-model-api"
            className="w-full p-2 text-sm bg-black/50 border border-cyan-700/50 rounded-md focus:border-cyan-500 focus:ring-cyan-500 transition-all text-white placeholder-cyan-500/50"
          />
          <p className="text-xs text-cyan-600 mt-1">Used to generate the public sub-domain URL.</p>
        </div>

        {/* Deploy Button */}
        <button
          onClick={handleDeploy}
          disabled={isDeploying}
          className="w-full mt-4 holographic-button bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-900/50 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center"
        >
          {isDeploying ? (
            <div className="flex items-center">
              <UploadCloudIcon className="h-5 w-5 animate-pulse mr-2" /> Deploying...
            </div>
          ) : (
            <div className="flex items-center">
              <UploadCloudIcon className="h-5 w-5 mr-2" /> Deploy to Web Gateway
            </div>
          )}
        </button>

        {deploymentStatus === 'success' && deployedUrl && (
          <div className="border-t border-cyan-800 pt-4 mt-4 animate-fade-in">
            <h4 className="text-lg font-semibold text-cyan-300 mb-2 flex items-center">
              {/* Corrected to use CheckCircle2Icon */}
              <CheckCircle2Icon className="h-6 w-6 text-green-300 mr-2" /> Deployment Successful!
            </h4>
            <p className="text-sm flex items-center">
              <LinkIcon className="h-5 w-5 mr-2 text-green-300" />
              Public URL: <a href={deployedUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-green-300 hover:underline break-all">{deployedUrl}</a>
            </p>
          </div>
        )}

        {deploymentStatus === 'error' && errorMessage && (
          <div className="border-t border-red-800 pt-4 mt-4 animate-fade-in text-red-300">
            <h4 className="text-lg font-semibold mb-2 flex items-center">
              <XCircleIcon className="h-6 w-6 text-red-400 mr-2" /> Deployment Failed
            </h4>
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}
      </div>
    </GlassPanel>
  );
};

export default QuantumToWebGatewayPanel;