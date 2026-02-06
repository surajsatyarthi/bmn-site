'use client';

import { useState } from 'react';
import { StepProgress } from './StepProgress';
import { useRouter } from 'next/navigation';
import TradeRoleStep from './TradeRoleStep';
import ProductSelectionStep from './ProductSelectionStep';
import TradeInterestsStep from './TradeInterestsStep';
import BusinessDetailsStep from './BusinessDetailsStep';
import CertificationsStep from './CertificationsStep';
import ReviewStep from './ReviewStep';

interface OnboardingData {
  id: string;
  tradeRole?: 'exporter' | 'importer' | 'both';
  onboardingStep: number;
  targetCountries?: string[];
  companyName?: string;
  website?: string;
  yearEstablished?: string;
  products?: { hsCode: string; name: string }[];
  certifications?: string[];
}

interface OnboardingWizardProps {
  initialStep: number;
  initialData: OnboardingData;
}

export default function OnboardingWizard({ initialStep, initialData }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>(initialData);
  const router = useRouter();

  const handleStepComplete = async (stepData: Record<string, unknown>) => {
    setLoading(true);
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);

    try {
      const res = await fetch('/api/profile/onboarding', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: currentStep,
          data: stepData
        }),
      });

      if (!res.ok) throw new Error('Failed to save');

      const nextStep = currentStep + 1;
      
      if (currentStep === 6) { // Final step check
        router.push('/dashboard');
        router.refresh(); 
        return;
      }

      setCurrentStep(nextStep);
      router.refresh(); 
    } catch (error) {
      console.error(error);
      alert('Failed to save progress. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <TradeRoleStep 
            initialValue={formData?.tradeRole} 
            onNext={handleStepComplete} 
            loading={loading}
          />
        );
      case 2:
        return (
          <ProductSelectionStep 
            initialProducts={formData?.products}
            onNext={handleStepComplete}
            onBack={() => setCurrentStep(1)}
            loading={loading}
          />
        );
      case 3:
        return (
          <TradeInterestsStep 
            initialCountries={formData?.targetCountries}
            onNext={handleStepComplete}
            onBack={() => setCurrentStep(2)}
            loading={loading}
          />
        );
      case 4:
        return (
          <BusinessDetailsStep 
            initialData={{
              companyName: formData?.companyName,
              website: formData?.website,
              yearEstablished: formData?.yearEstablished
            }}
            onNext={handleStepComplete}
            onBack={() => setCurrentStep(3)}
            loading={loading}
          />
        );
      case 5:
        return (
          <CertificationsStep 
            initialCerts={formData?.certifications}
            onNext={handleStepComplete}
            onBack={() => setCurrentStep(4)}
            loading={loading}
          />
        );
      case 6:
        return (
          <ReviewStep 
            data={formData}
            onNext={() => handleStepComplete({})} // No extra data for finish
            onBack={() => setCurrentStep(5)}
            loading={loading}
          />
        );
      default:
        return <div>Unknown Step</div>;
    }
  };

  return (
    <div className="space-y-8">
      <StepProgress currentStep={currentStep} totalSteps={6} />
      
      <div className="bg-white rounded-xl border border-bmn-border p-8 shadow-sm">
        {renderStep()}

        {/* Temporary Navigation for Dev - Remove in final */}
        {/* <div className="mt-8 pt-8 border-t border-bmn-border flex justify-between text-xs text-gray-400">
           Dev Controls: 
           <button onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}>Prev</button>
           <button onClick={() => setCurrentStep(Math.min(6, currentStep + 1))}>Next</button>
        </div> */}
      </div>
    </div>
  );
}
