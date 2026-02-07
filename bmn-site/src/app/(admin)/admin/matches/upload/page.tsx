'use client';

import { useState, useEffect } from 'react';
// Removed unused useRouter
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming utils exists

interface UserOption {
  id: string;
  fullName: string;
  company?: { name: string };
  tradeRole: string;
}

export default function MatchUploadPage() {
  // Removed unused router
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true);
  const [result, setResult] = useState<{ success?: boolean; message?: string; count?: number } | null>(null);

  // Single Form State
  const [formData, setFormData] = useState({
    profileId: '',
    counterpartyName: '',
    counterpartyCountry: '',
    counterpartyCity: '',
    matchedProducts: '[]',
    matchScore: 85,
    matchTier: 'great', // best, great, good
    scoreBreakdown: '{"productMatch": 30, "marketMatch": 20, "history": 10}', // Default json
    matchReasons: '["High demand for your product in this region", "Buyer has strong credit history"]', // Default json
    matchWarnings: 'null',
    tradeData: '{"volume": "High", "frequency": "Monthly", "yearsActive": 5}',
    counterpartyContact: '{"name": "John Doe", "email": "john@example.com", "title": "Procurement Manager", "phone": "+123456789", "website": "example.com"}'
  });

  // Bulk State
  const [bulkJson, setBulkJson] = useState('[\n  {\n    "profileId": "UUID_HERE",\n    "counterpartyName": "Example Corp",\n    "counterpartyCountry": "USA",\n    "matchedProducts": [{"hsCode": "1234", "name": "Widgets"}],\n    "matchScore": 90,\n    "matchTier": "best",\n    "scoreBreakdown": {"total": 90},\n    "matchReasons": ["Perfect match"]\n  }\n]');

  // Fetch Users on Mount
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/admin/users');
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users || []);
        }
      } catch (err) {
        console.error('Failed to fetch users', err);
      } finally {
        setUsersLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Validate JSON fields
      const payload = {
        profileId: formData.profileId,
        counterpartyName: formData.counterpartyName,
        counterpartyCountry: formData.counterpartyCountry,
        counterpartyCity: formData.counterpartyCity || null,
        matchedProducts: JSON.parse(formData.matchedProducts),
        matchScore: Number(formData.matchScore),
        matchTier: formData.matchTier,
        scoreBreakdown: JSON.parse(formData.scoreBreakdown),
        matchReasons: JSON.parse(formData.matchReasons),
        matchWarnings: formData.matchWarnings && formData.matchWarnings !== 'null' ? JSON.parse(formData.matchWarnings) : null,
        tradeData: formData.tradeData ? JSON.parse(formData.tradeData) : null,
        counterpartyContact: formData.counterpartyContact ? JSON.parse(formData.counterpartyContact) : null,
      };

      const res = await fetch('/api/admin/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ match: payload }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult({ success: true, message: 'Match uploaded successfully!', count: 1 });
        // Reset form partially?
      } else {
        setResult({ success: false, message: data.error || 'Upload failed' });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setResult({ success: false, message: 'Invalid JSON in one of the fields. ' + msg });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSubmit = async () => {
    setLoading(true);
    setResult(null);

    try {
      const parsed = JSON.parse(bulkJson);
      if (!Array.isArray(parsed)) throw new Error('Root must be an array');

      const res = await fetch('/api/admin/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matches: parsed }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult({ success: true, message: 'Bulk upload successful!', count: data.count });
      } else {
        setResult({ success: false, message: data.error || 'Bulk upload failed' });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setResult({ success: false, message: 'Invalid JSON: ' + msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload Matches</h1>

      {/* Mode Switcher */}
      <div className="bg-white p-1 rounded-lg border border-gray-200 inline-flex mb-8">
        <button
          onClick={() => setMode('single')}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors",
            mode === 'single' ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"
          )}
        >
          <FileText className="h-4 w-4" /> Single Entry
        </button>
        <button
          onClick={() => setMode('bulk')}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors",
            mode === 'bulk' ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"
          )}
        >
          <Upload className="h-4 w-4" /> Bulk JSON
        </button>
      </div>

      {/* Result Message */}
      {result && (
        <div className={cn(
          "p-4 rounded-lg mb-6 flex items-start gap-3",
          result.success ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"
        )}>
          {result.success ? <CheckCircle2 className="h-5 w-5 mt-0.5" /> : <AlertCircle className="h-5 w-5 mt-0.5" />}
          <div>
            <h3 className="font-bold">{result.success ? 'Success' : 'Error'}</h3>
            <p className="text-sm">{result.message}</p>
          </div>
        </div>
      )}

      {mode === 'single' ? (
        <form onSubmit={handleSingleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             
             {/* Profile Selection */}
             <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">User (Profile)</label>
                {usersLoading ? (
                  <div className="h-10 bg-gray-100 rounded animate-pulse" />
                ) : (
                  <select 
                    required
                    className="w-full h-10 rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    value={formData.profileId}
                    onChange={e => setFormData({...formData, profileId: e.target.value})}
                  >
                     <option value="">Select a user...</option>
                     {users.map(u => (
                        <option key={u.id} value={u.id}>
                           {u.fullName} {u.company?.name ? `(${u.company.name})` : ''} - {u.tradeRole}
                        </option>
                     ))}
                  </select>
                )}
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Counterparty Name</label>
                <input 
                  required
                  type="text"
                  className="w-full h-10 rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  value={formData.counterpartyName}
                  onChange={e => setFormData({...formData, counterpartyName: e.target.value})}
                />
             </div>
             
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input 
                  required
                  type="text"
                  className="w-full h-10 rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  value={formData.counterpartyCountry}
                  onChange={e => setFormData({...formData, counterpartyCountry: e.target.value})}
                />
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input 
                  type="text"
                  className="w-full h-10 rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  value={formData.counterpartyCity}
                  onChange={e => setFormData({...formData, counterpartyCity: e.target.value})}
                />
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Match Score (0-100)</label>
                <input 
                  required
                  type="number"
                  min="0" max="100"
                  className="w-full h-10 rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  value={formData.matchScore}
                  onChange={e => setFormData({...formData, matchScore: Number(e.target.value)})}
                />
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Match Tier</label>
                <select 
                   required
                   className="w-full h-10 rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-gray-900"
                   value={formData.matchTier}
                   onChange={e => setFormData({...formData, matchTier: e.target.value})}
                >
                   <option value="best">Best</option>
                   <option value="great">Great</option>
                   <option value="good">Good</option>
                </select>
             </div>

             {/* JSON Fields */}
             <div className="col-span-2 space-y-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Matched Products (JSON Array of objects)</label>
                   <textarea 
                      required
                      className="w-full h-24 rounded-lg border border-gray-300 p-3 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-gray-900"
                      value={formData.matchedProducts}
                      onChange={e => setFormData({...formData, matchedProducts: e.target.value})}
                   />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Score Breakdown (JSON)</label>
                      <textarea 
                         required
                         className="w-full h-24 rounded-lg border border-gray-300 p-3 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-gray-900"
                         value={formData.scoreBreakdown}
                         onChange={e => setFormData({...formData, scoreBreakdown: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Match Reasons (JSON Array)</label>
                      <textarea 
                         required
                         className="w-full h-24 rounded-lg border border-gray-300 p-3 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-gray-900"
                         value={formData.matchReasons}
                         onChange={e => setFormData({...formData, matchReasons: e.target.value})}
                      />
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Counterparty Contact (JSON Object)</label>
                   <textarea 
                      required
                      className="w-full h-24 rounded-lg border border-gray-300 p-3 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-gray-900"
                      value={formData.counterpartyContact}
                      onChange={e => setFormData({...formData, counterpartyContact: e.target.value})}
                   />
                </div>

             </div>
          </div>
          
          <div className="pt-4 flex justify-end">
             <button
               type="submit"
               disabled={loading}
               className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
             >
               {loading && <Loader2 className="h-4 w-4 animate-spin" />}
               Upload Match
             </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Paste JSON Array of Match Objects</label>
              <p className="text-xs text-gray-500 mb-2">Each object must include <code>profileId</code>.</p>
              <textarea 
                className="w-full h-96 rounded-lg border border-gray-300 p-4 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-gray-900"
                value={bulkJson}
                onChange={e => setBulkJson(e.target.value)}
              />
           </div>
           
           <div className="flex justify-end">
             <button
               onClick={handleBulkSubmit}
               disabled={loading}
               className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
             >
               {loading && <Loader2 className="h-4 w-4 animate-spin" />}
               Upload All
             </button>
           </div>
        </div>
      )}
    </div>
  );
}
