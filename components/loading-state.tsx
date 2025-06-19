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
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-8"
      >
        <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Brain className="h-10 w-10 text-primary animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Working on Your Resume</h1>
        <p className="text-muted-foreground">
        We&apos;re matching your resume to the job description and preparing tailored insights.
        </p>
      </motion.div>

      <Card className="p-8">
        <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Progress</span>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          // Assign a unique color for each step
          const iconColors = [
            'text-blue-500',
            'text-yellow-500',
            'text-purple-500',
            'text-green-600'
          ];
          const bgColors = [
            'bg-blue-100',
            'bg-yellow-100',
            'bg-purple-100',
            'bg-green-100'
          ];

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
              ${isActive ? 'bg-primary/10 border border-primary/20' : ''}
            `}
            >
            <div className={`
              shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4
              ${isCompleted ? 'bg-success/10' : isActive ? bgColors[index] : 'bg-muted'}
            `}>
              <StepIcon className={`
              h-5 w-5
              ${isCompleted ? 'text-success' : isActive ? iconColors[index] + ' animate-pulse' : 'text-muted-foreground'}
              `} />
            </div>
            <div>
              <p className={`
              font-medium
              ${isActive ? iconColors[index] : isCompleted ? 'text-success' : 'text-muted-foreground'}
              `}>
              {step.label}
              </p>
              {isActive && (
              <p className={`text-sm ${iconColors[index]}`}>In progress...</p>
              )}
              {isCompleted && (
              <p className="text-sm text-success">Completed</p>
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
        <p className="text-sm text-muted-foreground">
        This process usually takes less than a minute. Please keep this tab open.
        </p>
      </motion.div>
      </div>
    </div>
  );
}