'use client';

import * as Progress from '@radix-ui/react-progress';


interface StepProgressProps {
  currentStep: number;
  totalSteps?: number;
}

export function StepProgress({ currentStep, totalSteps = 6 }: StepProgressProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm font-medium text-text-secondary">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{Math.round(progress)}% Complete</span>
      </div>
      <Progress.Root
        className="relative h-2 w-full overflow-hidden rounded-full bg-bmn-border"
        value={progress}
      >
        <Progress.Indicator
          className="h-full w-full flex-1 bg-bmn-blue transition-all duration-500 ease-in-out"
          style={{ transform: `translateX(-${100 - progress}%)` }}
        />
      </Progress.Root>
    </div>
  );
}
