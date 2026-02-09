import { createClient } from '@/lib/supabase/client';

export async function uploadCertification(
  userId: string,
  file: File
): Promise<string> {
  const supabase = createClient();
  const fileName = `${userId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`; // Sanitize filename
  
  const { error } = await supabase.storage
    .from('certification-documents')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from('certification-documents')
    .getPublicUrl(fileName);
    
  return publicUrlData.publicUrl;
}
