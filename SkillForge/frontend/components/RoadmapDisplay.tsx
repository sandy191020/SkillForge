'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Step {
    step_number: number;
    title: string;
    description: string;
    resources: string[];
    estimated_time: string;
}

interface RoadmapDisplayProps {
    steps: Step[];
}

export default function RoadmapDisplay({ steps }: RoadmapDisplayProps) {
    const [activeStep, setActiveStep] = useState(0);
    const [avatarPosition, setAvatarPosition] = useState(0);
    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        // Initialize refs array
        stepRefs.current = stepRefs.current.slice(0, steps.length);
    }, [steps]);

    const handleStepClick = (index: number) => {
        setActiveStep(index);
        setAvatarPosition(index);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-8 relative">
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-700 rounded-full hidden md:block"></div>

            {/* Avatar - Mobile: Fixed at bottom or top? Let's stick to desktop-first game logic for now, maybe simple vertical list for mobile */}
            <div
                className="hidden md:flex absolute left-6 w-6 h-6 bg-yellow-400 rounded-full border-4 border-yellow-200 shadow-[0_0_15px_rgba(250,204,21,0.6)] z-20 transition-all duration-700 ease-in-out items-center justify-center"
                style={{ top: `${(avatarPosition * 160) + 40}px` }} // Approximate height calculation
            >
                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            </div>

            <div className="space-y-12">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        ref={el => stepRefs.current[index] = el}
                        className={`relative pl-0 md:pl-16 transition-all duration-500 ${index <= activeStep ? 'opacity-100' : 'opacity-50 grayscale hover:grayscale-0 hover:opacity-80'}`}
                        onClick={() => handleStepClick(index)}
                    >
                        {/* Connector Node */}
                        <div className={`hidden md:block absolute left-6 top-6 w-4 h-4 rounded-full transform -translate-x-1/2 border-2 z-10 transition-colors duration-300 ${index <= activeStep ? 'bg-green-500 border-green-300 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-800 border-gray-600'}`}></div>

                        {/* Card */}
                        <div className={`p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer
              ${index === activeStep
                                ? 'bg-gray-800/80 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                                : 'bg-gray-900/50 border-gray-700 hover:border-gray-500'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-sm font-bold px-3 py-1 rounded-full ${index === activeStep ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                                    Level {step.step_number}
                                </span>
                                <span className="text-xs text-gray-400 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    {step.estimated_time}
                                </span>
                            </div>

                            <h3 className={`text-xl font-bold mb-2 ${index === activeStep ? 'text-white' : 'text-gray-300'}`}>
                                {step.title}
                            </h3>

                            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                                {step.description}
                            </p>

                            {/* Resources Section - Only show if active or completed */}
                            {(index <= activeStep || index === activeStep + 1) && (
                                <div className="mt-4 pt-4 border-t border-gray-700/50">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Loot / Resources</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {step.resources.map((res, i) => (
                                            <span key={i} className="px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs text-blue-300 hover:text-blue-200 hover:border-blue-400 transition-colors">
                                                {res}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Completion Message */}
            {activeStep === steps.length - 1 && (
                <div className="mt-12 text-center animate-bounce">
                    <div className="inline-block p-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-lg">
                        <span className="text-2xl font-bold text-white">🏆 Quest Complete!</span>
                    </div>
                </div>
            )}
        </div>
    );
}
