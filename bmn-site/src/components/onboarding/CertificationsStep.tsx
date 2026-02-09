import { useState, useRef } from 'react';
import { ArrowRight, ArrowLeft, Check, Upload, X, FileText, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import MobileStickyNav from './MobileStickyNav';
import { uploadCertification } from '@/lib/supabase/storage';

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

interface UploadedDoc {
  certId: string;
  name: string;
  url: string;
  uploadedAt: string;
}

interface CertificationsStepProps {
  userId: string;
  initialCerts?: string[];
  initialDocs?: UploadedDoc[];
  onNext: (data: { certifications: string[]; certificationDocs: UploadedDoc[] }) => Promise<void>;
  onBack: () => void;
  loading?: boolean;
}

export default function CertificationsStep({ 
  userId,
  initialCerts = [], 
  initialDocs = [],
  onNext, 
  onBack, 
  loading 
}: CertificationsStepProps) {
  const [selectedCerts, setSelectedCerts] = useState<string[]>(initialCerts);
  const [documents, setDocuments] = useState<Record<string, UploadedDoc>>(() => {
    const docMap: Record<string, UploadedDoc> = {};
    initialDocs.forEach(doc => {
      if (doc.certId) {
        docMap[doc.certId] = doc;
      }
    });
    return docMap;
  });
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const toggleCert = (id: string) => {
    if (selectedCerts.includes(id)) {
      setSelectedCerts(selectedCerts.filter(c => c !== id));
    } else {
      setSelectedCerts([...selectedCerts, id]);
    }
  };

  const handleFileSelect = async (certId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(prev => ({ ...prev, [certId]: true }));

    try {
      const url = await uploadCertification(userId, file);
      const newDoc: UploadedDoc = {
        certId,
        name: file.name,
        url,
        uploadedAt: new Date().toISOString()
      };

      setDocuments(prev => ({ ...prev, [certId]: newDoc }));
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload document. Please try again.');
    } finally {
      setUploading(prev => ({ ...prev, [certId]: false }));
      if (fileInputRefs.current[certId]) {
        fileInputRefs.current[certId]!.value = ''; 
      }
    }
  };

  const removeDoc = (certId: string) => {
    const newDocs = { ...documents };
    delete newDocs[certId];
    setDocuments(newDocs);
  };

  const handleSubmit = () => {
    const docsArray = Object.values(documents);
    onNext({ 
      certifications: selectedCerts,
      certificationDocs: docsArray
    });
  };

  return (
    <div className="space-y-8 pb-32 sm:pb-0">
      <div className="text-center">
        <h2 className="text-2xl font-bold font-display text-text-primary">Certifications</h2>
        <p className="mt-2 text-text-secondary">
          Select any business or product certifications you hold. 
          <span className="block text-xs text-gray-400 mt-1">
            (Document uploads are optional - you can add them later)
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CERTIFICATIONS.map((cert) => {
          const isSelected = selectedCerts.includes(cert.id);
          const doc = documents[cert.id];
          const isUploading = uploading[cert.id];

          return (
            <div 
              key={cert.id}
              className={cn(
                "rounded-xl border transition-all",
                isSelected 
                  ? "border-bmn-blue bg-blue-50/50 ring-1 ring-bmn-blue" 
                  : "border-bmn-border bg-white hover:bg-gray-50",
                "flex flex-col"
              )}
            >
              <button
                onClick={() => toggleCert(cert.id)}
                className="flex items-start gap-4 p-4 w-full text-left"
              >
                <div className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded border mt-0.5 transition-colors",
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

              {/* Upload Section (Only visible if selected) */}
              {isSelected && (
                <div className="px-4 pb-4 pt-0 pl-13">
                  <div className="mt-2 pt-3 border-t border-blue-100/50">
                    {!doc ? (
                      <div>
                        <input
                          type="file"
                          id={`file-${cert.id}`}
                          ref={el => { fileInputRefs.current[cert.id] = el; }} // No return, direct assignment
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileSelect(cert.id, e)}
                          disabled={isUploading}
                        />
                        <button
                          onClick={() => fileInputRefs.current[cert.id]?.click()}
                          disabled={isUploading}
                          className="text-xs font-semibold text-bmn-blue hover:text-blue-700 flex items-center gap-1.5 transition-colors"
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-3 w-3" />
                              Upload Certificate
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 bg-white border border-blue-100 rounded-lg p-2 pr-3">
                        <div className="bg-blue-50 p-1.5 rounded">
                          <FileText className="h-4 w-4 text-bmn-blue" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-text-primary truncate max-w-[140px]">
                            {doc.name}
                          </p>
                          <p className="text-[10px] text-text-secondary">Uploaded</p>
                        </div>
                        <button
                          onClick={() => removeDoc(cert.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="hidden sm:flex justify-between pt-4">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? 'Saving...' : 'Next Step'}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>
      </div>

      <MobileStickyNav 
        onBack={onBack}
        onNext={handleSubmit}
        loading={loading}
      />
    </div>
  );
}
