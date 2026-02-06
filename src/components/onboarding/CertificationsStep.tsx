'use client';

import { useState } from 'react';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const CERTIFICATIONS = [
  { id: 'iso9001', name: 'ISO 9001', description: 'Quality Management' },
  { id: 'iso14001', name: 'ISO 14001', description: 'Environmental Management' },
  { id: 'haccp', name: 'HACCP', description: 'Food Safety' },
  { id: 'gmp', name: 'GMP', description: 'Good Manufacturing Practice' },
  { id: 'ce', name: 'CE Mark', description: 'European Conformity' },
  { id: 'halal', name: 'Halal', description: 'Halal Certified' },
  { id: 'organic', name: 'Organic', description: 'Organic Certified' },
  { id: 'fairtrade', name: 'Fair Trade', description: 'Ethical Trade' },
];

interface CertificationsStepProps {
  initialCerts?: string[];
  onNext: (data: { certifications: string[] }) => Promise<void>;
  onBack: () => void;
  loading?: boolean;
}

export default function CertificationsStep({ 
  initialCerts = [], 
  onNext, 
  onBack, 
  loading 
}: CertificationsStepProps) {
  const [selectedCerts, setSelectedCerts] = useState<string[]>(initialCerts);

  const toggleCert = (id: string) => {
    if (selectedCerts.includes(id)) {
      setSelectedCerts(selectedCerts.filter(c => c !== id));
    } else {
      setSelectedCerts([...selectedCerts, id]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold font-display text-text-primary">Certifications</h2>
        <p className="mt-2 text-text-secondary">Select any business or product certifications you hold.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CERTIFICATIONS.map((cert) => {
          const isSelected = selectedCerts.includes(cert.id);
          return (
            <button
              key={cert.id}
              onClick={() => toggleCert(cert.id)}
              className={cn(
                "flex items-start gap-4 p-4 rounded-xl border transition-all text-left",
                isSelected 
                  ? "border-bmn-blue bg-blue-50 ring-1 ring-bmn-blue" 
                  : "border-bmn-border bg-white hover:bg-gray-50"
              )}
            >
              <div className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded border mt-0.5",
                isSelected ? "bg-bmn-blue border-bmn-blue text-white" : "border-bmn-border bg-gray-50"
              )}>
                {isSelected && <Check className="h-3 w-3" />}
              </div>
              <div>
                <div className={cn("font-bold text-sm", isSelected ? "text-bmn-blue" : "text-text-primary")}>
                  {cert.name}
                </div>
                <div className="text-xs text-text-secondary mt-1">{cert.description}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
        <button
          onClick={() => onNext({ certifications: selectedCerts })}
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? 'Saving...' : 'Next Step'}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
