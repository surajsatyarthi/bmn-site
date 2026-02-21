import type { Metadata } from 'next';
import EditProfileForm from './EditProfileForm';

export const metadata: Metadata = {
  title: 'Edit Profile | BMN',
  description: 'Update your business profile, trade terms, and company details on BMN.',
};

export default function EditProfilePage() {
  return <EditProfileForm />;
}
