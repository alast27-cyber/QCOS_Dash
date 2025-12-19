
import React from 'react';
import { BoxIcon } from './Icons';

const ApplicationHub: React.FC = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center text-cyan-500 p-4">
            <BoxIcon className="w-16 h-16 mb-4" />
            <h3 className="text-lg font-bold text-cyan-300">Application Hub</h3>
            <p>This component is a placeholder to resolve a module error.</p>
        </div>
    );
};
export default ApplicationHub;
