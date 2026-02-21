'use client';

import { useState } from 'react';
import { StepProgress } from './StepProgress';
import { useRouter } from 'next/navigation';
import TradeRoleStep from './TradeRoleStep';
import ProductSelectionStep from './ProductSelectionStep';
import TradeInterestsStep from './TradeInterestsStep';
import BusinessDetailsStep from './BusinessDetailsStep';
import CertificationsStep from './CertificationsStep';
import TradeTermsStep from './TradeTermsStep';
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
  avatarUrl?: string | null;
  
  // New Block 1.14 Fields
  businessType?: 'manufacturer' | 'trader' | 'both' | 'agent' | '' | null;
  employeeCount?: string | null;
  description?: string | null;
  moqValue?: number | null;
  moqUnit?: string | null;
  leadTime?: string | null;
  productionCapacity?: string | null;
  paymentTerms?: string[] | null;
  incoterms?: string[] | null;
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
      
      if (currentStep === 7) { // Final step check (now 7)
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
            userId={formData.id}
            initialData={{
              companyName: formData?.companyName ?? undefined,
              website: formData?.website ?? undefined,
              yearEstablished: formData?.yearEstablished ?? undefined,
              avatarUrl: formData?.avatarUrl ?? undefined,
              businessType: formData?.businessType ?? undefined,
              employeeCount: formData?.employeeCount ?? undefined,
              description: formData?.description ?? undefined,
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
          <TradeTermsStep
            initialData={{
              moqValue: formData?.moqValue ?? undefined,
              moqUnit: formData?.moqUnit ?? undefined,
              leadTime: formData?.leadTime ?? undefined,
              productionCapacity: formData?.productionCapacity ?? undefined,
              paymentTerms: formData?.paymentTerms ?? [],
              incoterms: formData?.incoterms ?? [],
            }}
            onNext={handleStepComplete}
            onBack={() => setCurrentStep(5)}
            loading={loading}
          />
        );
      case 7:
        return (
          <ReviewStep 
            data={formData}
            onNext={() => handleStepComplete({})}
            onBack={() => setCurrentStep(6)}
            loading={loading}
          />
        );
      default:
        return <div>Unknown Step</div>;
    }
  };

  return (
    <div className="space-y-8">
      <StepProgress currentStep={currentStep} totalSteps={7} />
      
      <div className="bg-white rounded-xl border border-bmn-border p-8 shadow-sm">
        {renderStep()}
      </div>
    </div>
  );
}
