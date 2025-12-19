// src/hooks/useRealtimeData.ts
import { useState, useEffect } from 'react';
// Use namespace import to bypass persistent module resolution error
import * as SystemTypes from '../types/SystemTypes.ts'; 

/**
 * useRealtimeData Hook
 * @param isMock - If true, falls back to local simulation. 
 * If false, connects to the QCOS AI-Bridge (FastAPI).
 */
const useRealtimeData = (isMock = false) => {
    // Initialize state with the standard MOCK_SYSTEM_HISTORY structure
    const [systemData, setSystemData] = useState<SystemTypes.SystemHistory>(SystemTypes.MOCK_SYSTEM_HISTORY);

    useEffect(() => {
        // --- SCENARIO 1: Real AI-Native Connection ---
        if (!isMock) {
            const fetchAIInference = async () => {
                try {
                    // Connect to the Python/FastAPI Bridge on port 8000
                    const response = await fetch('http://localhost:8000/v1/kernel/inference');
                    
                    if (!response.ok) throw new Error('Bridge unreachable');

                    const data = await response.json();

                    setSystemData(prevData => ({
                        ...prevData,
                        // Map C++ V-Score to the Qubit Error Rate (visualized as a gauge)
                        qubit_error_rate: data.v_score,
                        
                        // Map C++ Policy decision to the QKD Status string
                        qkd_status: data.policy.includes("ACT") ? 'ACTIVE' : 'STANDBY',
                        
                        // Derived metric: map v-score to 0-100 scale for system load
                        system_load: Math.min(100, data.v_score * 1000) 
                    }));
                } catch (err) {
                    console.warn("AI Bridge Offline. Check if 'python qcos_bridge.py' is running.");
                }
            };

            // Poll the C++ engine every 2 seconds
            const apiInterval = setInterval(fetchAIInference, 2000);
            return () => clearInterval(apiInterval);
        }

        // --- SCENARIO 2: Pure Mock Fallback ---
        if (isMock) {
            const mockInterval = setInterval(() => {
                setSystemData(prevData => ({
                    ...prevData,
                    qubit_error_rate: Math.max(0.001, Math.min(0.02, prevData.qubit_error_rate + (Math.random() - 0.5) * 0.001)),
                    system_load: Math.min(1.0, Math.max(0.1, prevData.system_load + (Math.random() - 0.5) * 0.1)),
                    qkd_status: Math.random() < 0.05 ? 'ERROR' : 'ACTIVE',
                }));
            }, 2000);

            return () => clearInterval(mockInterval);
        }
        
    }, [isMock]); 

    return systemData;
};

export default useRealtimeData;