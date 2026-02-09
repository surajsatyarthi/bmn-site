'use client';

import { useState } from 'react';
import { AlertCircle, FileText, Info, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Notice {
  id: string;
  type: 'document_upload_request' | 'general' | 'urgent';
  title: string;
  message: string;
  dismissed: boolean;
  createdAt: Date | string;
}

interface AdminNoticeProps {
  notices: Notice[];
}

export function AdminNotice({ notices }: AdminNoticeProps) {
  const router = useRouter();
  const [activeNotices, setActiveNotices] = useState(notices.filter(n => !n.dismissed));

  if (activeNotices.length === 0) return null;

  const handleDismiss = async (id: string, type: string) => {
    // Urgent notices cannot be dismissed
    if (type === 'urgent') return;

    try {
      // Optimistic update
      setActiveNotices(prev => prev.filter(n => n.id !== id));

      const response = await fetch(`/api/notices/${id}/dismiss`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to dismiss notice');
      }
      
      router.refresh();
    } catch (error) {
      console.error(error);
      // Revert if failed (optional, but good UX)
      router.refresh(); 
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'document_upload_request':
        return <FileText className="h-5 w-5 text-yellow-600" />;
      case 'urgent':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'general':
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getStyles = (type: string) => {
    switch (type) {
      case 'document_upload_request':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'urgent':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'general':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="space-y-4 mb-6">
      {activeNotices.map((notice) => (
        <div
          key={notice.id}
          className={`flex items-start gap-4 p-4 rounded-lg border ${getStyles(notice.type)} relative`}
          role="alert"
        >
          <div className="shrink-0 mt-0.5">{getIcon(notice.type)}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">{notice.title}</h3>
            <p className="text-sm opacity-90">{notice.message}</p>
          </div>
          {notice.type !== 'urgent' && (
            <button
              onClick={() => handleDismiss(notice.id, notice.type)}
              className="absolute top-4 right-4 p-1 hover:bg-black/5 rounded-full transition-colors"
              aria-label="Dismiss notice"
            >
              <X className="h-4 w-4 opacity-60 hover:opacity-100" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
