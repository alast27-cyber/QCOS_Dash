import React, { useState, useEffect } from 'react';

const THREAD_COUNT = 4;
const MAX_TASKS_PER_THREAD = 3;

interface Task {
    id: number;
    width: number; // percentage
    left: number; // percentage
    color: string;
}

const colors = ['bg-purple-500', 'bg-green-500', 'bg-yellow-500'];

const KernelScheduler: React.FC = () => {
    const [threads, setThreads] = useState<Task[][]>(() => 
        Array.from({ length: THREAD_COUNT }, () => [])
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setThreads(prevThreads => {
                const newThreads = prevThreads.map(thread => 
                    thread.map(task => ({ ...task, left: task.left - 2 })).filter(task => task.left > -task.width)
                );

                const threadIndex = Math.floor(Math.random() * THREAD_COUNT);
                if (newThreads[threadIndex].length < MAX_TASKS_PER_THREAD) {
                    const lastTask = newThreads[threadIndex][newThreads[threadIndex].length - 1];
                    if (!lastTask || lastTask.left + lastTask.width < 90) {
                        newThreads[threadIndex].push({
                            id: Date.now() + Math.random(),
                            width: 10 + Math.random() * 20,
                            left: 100,
                            color: colors[Math.floor(Math.random() * colors.length)]
                        });
                    }
                }
                return newThreads;
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full flex flex-col p-2">
            <h3 className="text-base font-bold tracking-widest text-cyan-300 mb-4 text-center">IAI KERNEL SCHEDULER</h3>
            <div className="space-y-4">
                {threads.map((tasks, i) => (
                    <div key={i} className="flex items-center">
                        <span className="text-xs text-cyan-400 w-16 font-mono">Thread {i}</span>
                        <div className="flex-grow h-6 bg-black/30 rounded-md border border-cyan-900 overflow-hidden relative">
                            {tasks.map(task => (
                                <div
                                    key={task.id}
                                    className={`absolute h-full ${task.color} transition-all duration-100 linear`}
                                    style={{ left: `${task.left}%`, width: `${task.width}%` }}
                                ></div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KernelScheduler;
