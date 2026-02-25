
import { Suspense } from 'react';
import PageContent from './PageContent';

export const metadata = {
  title: 'Business Market Network',
  description: 'AI-Powered Business Network',
};

export default function Page() {
  return (
    <Suspense>
      <PageContent />
    </Suspense>
  );
}
