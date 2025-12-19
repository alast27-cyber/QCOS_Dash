import React from 'react';
import { ClockIcon, CheckCircle2Icon } from './Icons';

interface Task {
    id: number;
    title: string;
    status: 'pending' | 'in-progress' | 'complete';
    dueDate: Date;
}

const now = new Date();
const tasks: Task[] = [
    { id: 1, title: 'Recalibrate entanglement matrix', status: 'in-progress', dueDate: new Date(now.getTime() + 4 * 60 * 60 * 1000) }, // Due in 4 hours
    { id: 2, title: 'Flush quantum memory buffer', status: 'pending', dueDate: new Date(now.getTime() - 24 * 60 * 60 * 1000) }, // Overdue by 1 day
    { id: 3, title: 'Deploy cryptography patch Q-CRY-2', status: 'complete', dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) }, // Completed 2 days ago
    { id: 4, title: 'Run diagnostic on Core A7', status: 'pending', dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000) }, // Due in 2 days
    { id: 5, title: 'Optimize IAI heuristics engine', status: 'pending', dueDate: new Date(now.getTime() + 22 * 60 * 60 * 1000) }, // Due in 22 hours
    { id: 6, title: 'Submit weekly performance logs', status: 'pending', dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000) }, // Due in 5 days
];

type DueDateStatus = 'overdue' | 'due-soon' | 'normal' | 'complete';

const getDueDateStatus = (task: Task): DueDateStatus => {
    if (task.status === 'complete') {
        return 'complete';
    }
    const now = new Date();
    const dueDate = task.dueDate;
    const diffHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours < 0) return 'overdue';
    if (diffHours <= 24) return 'due-soon';
    return 'normal';
};

const formatDueDate = (date: Date): string => {
    const now = new Date();
    const diffMillis = date.getTime() - now.getTime();
    const diffSeconds = Math.round(diffMillis / 1000);
    const diffMinutes = Math.round(diffSeconds / 60);
    const diffHours = Math.round(diffMinutes / 60);
    const diffDays = Math.round(diffHours / 24);

    if (diffMillis < 0) {
        if (diffDays < -1) return `Overdue by ${-diffDays} days`;
        if (diffHours < -23) return `Overdue by 1 day`;
        if (diffHours < -1) return `Overdue by ${-diffHours} hours`;
        return 'Overdue';
    }

    if (diffHours < 1) return `Due in ${diffMinutes} minutes`;
    if (diffHours < 24) return `Due in ${diffHours} hours`;
    if (diffDays < 2) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
};

const AnomalyLog: React.FC = () => {
    const sortedTasks = [...tasks].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

    const statusConfig: Record<DueDateStatus, { barColor: string, textColor: string, icon: React.ReactNode }> = {
        overdue: { barColor: 'bg-red-500 animate-pulse-bg', textColor: 'text-red-400', icon: <ClockIcon className="w-4 h-4 text-red-400" /> },
        'due-soon': { barColor: 'bg-yellow-500', textColor: 'text-yellow-400', icon: <ClockIcon className="w-4 h-4 text-yellow-400" /> },
        normal: { barColor: 'bg-blue-500', textColor: 'text-blue-400', icon: <ClockIcon className="w-4 h-4 text-blue-400" /> },
        complete: { barColor: 'bg-slate-600', textColor: 'text-slate-400', icon: <CheckCircle2Icon className="w-4 h-4 text-green-400" /> },
    };

    return (
        <div className="h-full flex flex-col">
            <label className="block text-cyan-400 mb-1 text-sm font-semibold">
                System Tasks & Anomalies
            </label>
            <div className="overflow-y-auto flex-grow text-sm space-y-2 pr-2 h-full bg-black/30 border border-blue-500/50 rounded-md p-2">
                {sortedTasks.map(task => {
                    const dueDateStatus = getDueDateStatus(task);
                    const config = statusConfig[dueDateStatus];
                    const isComplete = task.status === 'complete';
                    
                    return (
                        <div key={task.id} className="flex items-center bg-black/20 p-2 rounded-md hover:bg-black/40 transition-colors overflow-hidden">
                            <div className={`w-1.5 h-10 mr-3 rounded-full ${config.barColor}`}></div>
                            <div className="flex items-center flex-grow">
                                <div className="mr-3 flex-shrink-0">{config.icon}</div>
                                <div className="flex-grow">
                                    <p className={`text-white ${isComplete ? 'line-through text-gray-500' : ''}`}>{task.title}</p>
                                    {!isComplete && (
                                        <p className={`text-xs ${config.textColor}`}>
                                            {formatDueDate(task.dueDate)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AnomalyLog;