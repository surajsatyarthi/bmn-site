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
  tradeRole?: 'exporter' | 'importer' | 'both' | null;
  onboardingStep: number;
  targetCountries?: string[] | null;
  companyName?: string | null;
  website?: string | null;
  yearEstablished?: string | null;
  products?: { hsCode: string; name: string }[] | null;
  certifications?: string[] | null;
  certificationDocs?: { certId: string; name: string; url: string; uploadedAt: string }[] | null;
  avatarUrl?: string | null; // Added
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

  console.log('OnboardingWizard Render:', { currentStep, initialStep, formData }); // DEBUG LOG

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
            initialValue={formData?.tradeRole ?? undefined} 
            onNext={handleStepComplete} 
            loading={loading}
          />
        );
      case 2:
        return (
          <ProductSelectionStep 
            initialProducts={formData?.products ?? undefined}
            onNext={handleStepComplete}
            onBack={() => setCurrentStep(1)}
            loading={loading}
          />
        );
      case 3:
        return (
          <TradeInterestsStep 
            initialCountries={formData?.targetCountries ?? undefined}
            onNext={handleStepComplete}
            onBack={() => setCurrentStep(2)}
            loading={loading}
          />
        );
      case 4:
        return (
          <BusinessDetailsStep 
            userId={formData.id} // Added
            initialData={{
              companyName: formData?.companyName ?? undefined,
              website: formData?.website ?? undefined,
              yearEstablished: formData?.yearEstablished ?? undefined,
              avatarUrl: formData?.avatarUrl ?? undefined, // Added
            }}
            onNext={handleStepComplete}
            onBack={() => setCurrentStep(3)}
            loading={loading}
          />
        );
      case 5:
        return (
          <CertificationsStep 
            userId={formData.id}
            initialCerts={formData?.certifications ?? undefined}
            initialDocs={formData?.certificationDocs ?? undefined}
            onNext={handleStepComplete}
            onBack={() => setCurrentStep(4)}
            loading={loading}
          />
        );
      case 6:
        return (
          <ReviewStep 
            data={formData}
            onNext={() => handleStepComplete({})}
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
