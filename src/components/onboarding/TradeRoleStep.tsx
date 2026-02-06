'use client';

import { useState } from 'react';
import { ArrowRight, Globe, Ship, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const options: { id: TradeRole; title: string; desc: string; icon: React.ElementType }[] = [
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
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold font-display text-text-primary">What do you do?</h2>
        <p className="mt-2 text-text-secondary">Select your primary role to help us find the right matches.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedRole === option.id;
          return (
            <button
              key={option.id}
              onClick={() => setSelectedRole(option.id)}
              disabled={loading}
              className={cn(
                "relative flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 text-center space-y-4 hover:border-bmn-blue/50 focus:outline-none",
                isSelected
                  ? "border-bmn-blue bg-blue-50/50"
                  : "border-bmn-border bg-white hover:bg-gray-50"
              )}
            >
              <div
                className={cn(
                  "p-3 rounded-full transition-colors",
                  isSelected ? "bg-bmn-blue text-white" : "bg-gray-100 text-text-secondary"
                )}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className={cn("font-bold text-lg", isSelected ? "text-bmn-blue" : "text-text-primary")}>
                  {option.title}
                </h3>
                <p className="text-xs text-text-secondary mt-1">{option.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSubmit}
          disabled={!selectedRole || loading}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? 'Saving...' : 'Next Step'}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
