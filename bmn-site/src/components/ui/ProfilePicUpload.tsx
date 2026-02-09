
'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ProfilePicUploadProps {
  userId: string;
  url?: string | null;
  onUpload: (url: string) => void;
  size?: number;
}

export default function ProfilePicUpload({ userId, url, onUpload, size = 120 }: ProfilePicUploadProps) {
  const supabase = createClient();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(url || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (url) setAvatarUrl(url);
  }, [url]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        return; // User cancelled
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      onUpload(publicUrl);
      setAvatarUrl(publicUrl);
    } catch (error) {
      alert('Error uploading profile picture!');
      console.log(error);
    } finally {
      setUploading(false);
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* Clickable Avatar Area */}
      <div 
        className="relative group cursor-pointer transition-transform active:scale-95"
        onClick={triggerUpload}
      >
        {avatarUrl ? (
          <div className="relative rounded-full overflow-hidden border-4 border-white shadow-md ring-2 ring-gray-100" style={{ width: size, height: size }}>
             <Image
              src={avatarUrl}
              alt="Profile Picture"
              fill
              className="object-cover"
              sizes={`${size}px`}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center bg-gray-50 rounded-full border-2 border-dashed border-gray-300 hover:border-bmn-blue transition-colors" style={{ width: size, height: size }}>
            <User size={size / 2.5} className="icon-gradient-primary" />
          </div>
        )}
        
        {/* Helper overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
           <span className="text-white text-xs font-medium">Change Photo</span>
        </div>
      </div>

      {/* Hidden Input */}
      <input
        type="file"
        ref={fileInputRef}
        id="single"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="hidden"
      />

      {/* Clear Call-to-Action Button */}
      <div className="text-center space-y-3">
        <button 
            type="button" 
            onClick={triggerUpload}
            disabled={uploading}
            className="btn-secondary py-2 px-6 shadow-sm hover:shadow text-sm font-medium"
        >
          {uploading ? (
            <span className="flex items-center gap-2">
               <Loader2 className="h-4 w-4 animate-spin"/> Uploading...
            </span>
          ) : (
            'Upload Professional Photo'
          )}
        </button>
        
        <p className="text-xs text-text-secondary max-w-[220px] mx-auto leading-relaxed">
          <span className="font-semibold text-green-600 block mb-0.5">Build Trust with Partners</span>
          A professional photo increases response rates by 40%.
        </p>
      </div>
    </div>
  );
}
