'use client';

import { useState } from 'react';
import { ArrowRight, Globe, Ship, RefreshCw, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FeatureIcon } from '@/components/ui/FeatureIcon';
import { SelectableCard } from '@/components/ui/SelectableCard';

type TradeRole = 'exporter' | 'importer' | 'both';

interface TradeRoleStepProps {
  initialValue?: TradeRole;
  onNext: (data: { tradeRole: TradeRole }) => Promise<void>;
  loading?: boolean;
}

export default function TradeRoleStep({ initialValue, onNext, loading }: TradeRoleStepProps) {
  const [selectedRole, setSelectedRole] = useState<TradeRole | null>(initialValue || null);

  const handleSubmit = () => {
    if (selectedRole) {
      onNext({ tradeRole: selectedRole });
    }
  };

  const options: { id: TradeRole; title: string; desc: string; icon: LucideIcon }[] = [
    {
      id: 'exporter',
      title: 'I Export Goods',
      desc: 'I sell products to international buyers.',
      icon: Ship,
    },
    {
      id: 'importer',
      title: 'I Import Goods',
      desc: 'I buy products from international suppliers.',
      icon: Globe,
    },
    {
      id: 'both',
      title: 'I do Both',
      desc: 'I export local goods and import foreign products.',
      icon: RefreshCw,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-3xl font-bold font-display text-text-primary tracking-tight">What do you do?</h2>
        <p className="mt-3 text-text-secondary text-lg">Select your primary role to help us find the right matches.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {options.map((option) => {
          const isSelected = selectedRole === option.id;
          return (
            <SelectableCard
              key={option.id}
              selected={isSelected}
              onClick={() => setSelectedRole(option.id)}
              disabled={loading}
              className="h-full"
            >
              <FeatureIcon 
                icon={option.icon} 
                variant={isSelected ? 'solid' : 'outline'} 
                size="lg"
                className="mb-2"
              />
              <div>
                <h3 className={cn("font-bold text-xl mb-2", isSelected ? "text-bmn-blue" : "text-text-primary")}>
                  {option.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">{option.desc}</p>
              </div>
            </SelectableCard>
          );
        })}
      </div>

      <div className="flex justify-end pt-6">
        <button
          onClick={handleSubmit}
          disabled={!selectedRole || loading}
          className="btn-primary flex items-center gap-2 px-8 py-3 text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          {loading ? 'Saving...' : 'Next Step'}
          {!loading && <ArrowRight className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
