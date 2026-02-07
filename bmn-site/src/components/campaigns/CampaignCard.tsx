'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronRight, Mail, Eye, MessageSquare, Calendar } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  targetDescription: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  emailsSent: number;
  emailsOpened: number;
  emailsReplied: number;
  meetingsBooked: number;
  metricsUpdatedAt: Date | string | null;
}

interface CampaignCardProps {
  campaign: Campaign;
}

const statusStyles = {
  active: 'bg-green-100 text-green-700',
  paused: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-gray-100 text-gray-600',
  draft: 'bg-blue-100 text-bmn-blue',
};

const statusLabels = {
  active: 'Active',
  paused: 'Paused',
  completed: 'Completed',
  draft: 'Draft',
};

function formatRelativeTime(date: Date | string | null): string {
  if (!date) return 'Never';
  
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return then.toLocaleDateString();
}

function calculatePercentage(part: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((part / total) * 100)}%`;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <div className="bg-white rounded-xl border border-bmn-border p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-text-primary truncate">
              {campaign.name}
            </h3>
            <span className={cn(
              'px-2.5 py-0.5 text-xs font-semibold rounded-full shrink-0',
              statusStyles[campaign.status]
            )}>
              {statusLabels[campaign.status]}
            </span>
          </div>
          <p className="text-sm text-text-secondary truncate">
            {campaign.targetDescription}
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Mail className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs text-text-secondary">Sent</span>
          </div>
          <p className="text-lg font-bold text-text-primary">{campaign.emailsSent}</p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Eye className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs text-text-secondary">Opened</span>
          </div>
          <p className="text-lg font-bold text-text-primary">
            {campaign.emailsOpened}
            <span className="text-xs font-normal text-text-secondary ml-1">
              ({calculatePercentage(campaign.emailsOpened, campaign.emailsSent)})
            </span>
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <MessageSquare className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs text-text-secondary">Replied</span>
          </div>
          <p className="text-lg font-bold text-text-primary">
            {campaign.emailsReplied}
            <span className="text-xs font-normal text-text-secondary ml-1">
              ({calculatePercentage(campaign.emailsReplied, campaign.emailsSent)})
            </span>
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Calendar className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs text-text-secondary">Meetings</span>
          </div>
          <p className="text-lg font-bold text-text-primary">{campaign.meetingsBooked}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-xs text-text-secondary">
          Last updated: {formatRelativeTime(campaign.metricsUpdatedAt)}
        </span>
        <Link
          href={`/campaigns/${campaign.id}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-bmn-blue hover:text-bmn-navy transition-colors"
        >
          View Details
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
