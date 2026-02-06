import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { profiles, campaigns } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Eye, MessageSquare, Calendar, Clock, Play, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

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

function formatDate(date: Date | null): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateTime(date: Date | null): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function calculatePercentage(part: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((part / total) * 100)}%`;
}

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, user.id),
  });

  if (!profile) {
    redirect('/login');
  }

  if (!profile.onboardingCompleted) {
    redirect('/onboarding');
  }

  // Fetch the campaign
  const campaign = await db.query.campaigns.findFirst({
    where: and(eq(campaigns.id, id), eq(campaigns.profileId, user.id)),
  });

  if (!campaign) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link 
        href="/campaigns"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Campaigns
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-bmn-border p-6 shadow-sm">
        <div className="flex items-start gap-3 mb-2">
          <h1 className="text-2xl font-bold font-display text-text-primary flex-1">
            {campaign.name}
          </h1>
          <span className={cn(
            'px-3 py-1 text-sm font-semibold rounded-full',
            statusStyles[campaign.status]
          )}>
            {statusLabels[campaign.status]}
          </span>
        </div>
        <p className="text-text-secondary">
          {campaign.targetDescription}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-bmn-border p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Mail className="h-5 w-5 text-gray-600" />
            </div>
            <p className="text-sm font-medium text-text-secondary">Emails Sent</p>
          </div>
          <p className="text-3xl font-bold text-text-primary">{campaign.emailsSent}</p>
        </div>
        
        <div className="bg-white rounded-xl border border-bmn-border p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="h-5 w-5 text-bmn-blue" />
            </div>
            <p className="text-sm font-medium text-text-secondary">Opened</p>
          </div>
          <p className="text-3xl font-bold text-text-primary">
            {campaign.emailsOpened}
            <span className="text-lg font-normal text-text-secondary ml-2">
              ({calculatePercentage(campaign.emailsOpened, campaign.emailsSent)})
            </span>
          </p>
        </div>
        
        <div className="bg-white rounded-xl border border-bmn-border p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <MessageSquare className="h-5 w-5 text-teal-600" />
            </div>
            <p className="text-sm font-medium text-text-secondary">Replied</p>
          </div>
          <p className="text-3xl font-bold text-text-primary">
            {campaign.emailsReplied}
            <span className="text-lg font-normal text-text-secondary ml-2">
              ({calculatePercentage(campaign.emailsReplied, campaign.emailsSent)})
            </span>
          </p>
        </div>
        
        <div className="bg-white rounded-xl border border-bmn-border p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-sm font-medium text-text-secondary">Meetings Booked</p>
          </div>
          <p className="text-3xl font-bold text-text-primary">
            {campaign.meetingsBooked}
            <span className="text-lg font-normal text-text-secondary ml-2">
              ({calculatePercentage(campaign.meetingsBooked, campaign.emailsSent)})
            </span>
          </p>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white rounded-xl border border-bmn-border p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Campaign Timeline</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Clock className="h-4 w-4 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Created</p>
              <p className="text-sm text-text-secondary">{formatDate(campaign.createdAt)}</p>
            </div>
          </div>
          
          {campaign.startedAt && (
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Play className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Started</p>
                <p className="text-sm text-text-secondary">{formatDate(campaign.startedAt)}</p>
              </div>
            </div>
          )}
          
          {campaign.completedAt && (
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <CheckCircle className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Completed</p>
                <p className="text-sm text-text-secondary">{formatDate(campaign.completedAt)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Last Updated Notice */}
      <div className="text-center text-sm text-text-secondary">
        Last metrics update: {formatDateTime(campaign.metricsUpdatedAt)}
      </div>
    </div>
  );
}
