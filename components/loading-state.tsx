'use client';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, Target, FileCheck, Layout } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const steps = [
  { icon: FileCheck, label: 'Parsing resume content', duration: 2000 },
  { icon: Target, label: 'Analyzing job requirements', duration: 1500 },
  { icon: Brain, label: 'AI processing and comparison', duration: 3000 },
  { icon: Layout, label: 'Generating recommendations', duration: 1500 },
];

export function LoadingState() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progressTimer: NodeJS.Timeout;
    let stepTimer: NodeJS.Timeout;

    const startProgress = () => {
      const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
      const currentStepDuration = steps[currentStep].duration;
      const stepProgress = (currentStep / steps.length) * 100;
      
      let stepProgressValue = 0;
      progressTimer = setInterval(() => {
        stepProgressValue += (100 / steps.length) / (currentStepDuration / 50);
        setProgress(stepProgress + Math.min(stepProgressValue, 100 / steps.length));
      }, 50);

      stepTimer = setTimeout(() => {
        clearInterval(progressTimer);
        if (currentStep < steps.length - 1) {
          setCurrentStep(prev => prev + 1);
        }
      }, currentStepDuration);
    };

    startProgress();

    return () => {
      clearInterval(progressTimer);
      clearTimeout(stepTimer);
    };
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <Brain className="h-10 w-10 text-blue-600 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analyzing Your Resume</h1>
          <p className="text-gray-600">
            Our AI is carefully reviewing your resume against the job requirements
          </p>
        </motion.div>

        <Card className="p-8">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Analysis Progress</span>
                <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0.5 }}
                    animate={{ 
                      opacity: isActive ? 1 : isCompleted ? 0.7 : 0.4,
                      scale: isActive ? 1.02 : 1
                    }}
                    className={`
                      flex items-center p-4 rounded-lg transition-all duration-300
                      ${isActive ? 'bg-blue-50 border border-blue-200' : ''}
                    `}
                  >
                    <div className={`
                      shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4
                      ${isCompleted ? 'bg-green-100' : isActive ? 'bg-blue-100' : 'bg-gray-100'}
                    `}>
                      <StepIcon className={`
                        h-5 w-5
                        ${isCompleted ? 'text-green-600' : isActive ? 'text-blue-600 animate-pulse' : 'text-gray-400'}
                      `} />
                    </div>
                    <div>
                      <p className={`
                        font-medium
                        ${isActive ? 'text-blue-900' : isCompleted ? 'text-green-800' : 'text-gray-600'}
                      `}>
                        {step.label}
                      </p>
                      {isActive && (
                        <p className="text-sm text-blue-600">In progress...</p>
                      )}
                      {isCompleted && (
                        <p className="text-sm text-green-600">Completed</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-500">
            This usually takes 30-60 seconds. Please keep this tab open.
          </p>
        </motion.div>
      </div>
    </div>
  );
}