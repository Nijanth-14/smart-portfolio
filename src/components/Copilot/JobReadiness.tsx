"use client";
import React, { useState } from 'react';
import { Briefcase, CheckCircle, XCircle, AlertCircle, ArrowRight, Code2, Upload, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function JobReadiness() {
  const [jobDescription, setJobDescription] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [readiness, setReadiness] = useState<any[] | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a valid PDF file.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to parse PDF');
      }

      const data = await response.json();
      setJobDescription((prev) => prev ? prev + '\n\n--- PDF Content ---\n\n' + data.text : data.text);
      toast.success('PDF text extracted successfully!');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Error extracting PDF text');
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = ''; // Reset input
    }
  };

  const handleCheck = async () => {
    if (!jobDescription.trim()) return;
    setIsChecking(true);
    
    try {
      const response = await fetch('/api/check-readiness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription })
      });
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to check readiness');
      }
      const data = await response.json();
      
      setReadiness(data.readiness);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to check job readiness');
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'strong': return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'moderate': return <CheckCircle className="w-5 h-5 text-amber-400" />;
      case 'weak': return <AlertCircle className="w-5 h-5 text-orange-400" />;
      case 'none': return <XCircle className="w-5 h-5 text-rose-400" />;
      default: return null;
    }
  };

  return (
    <div className="gradient-border glass rounded-3xl p-6 card-lift">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-teal-500/10 rounded-lg">
          <Briefcase className="w-6 h-6 text-cyan-300" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Job Readiness Checker</h2>
          <p className="text-slate-400 text-sm">Compare Job Requirements against your Evidence</p>
        </div>
      </div>

      {!readiness ? (
        <div className="space-y-4">
          <textarea 
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste Job Description here..."
            className="w-full h-32 glass rounded-2xl border border-white/10 p-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none"
          />
          
          <div className="flex items-center justify-between">
            <div className="relative">
              <input 
                type="file" 
                accept="application/pdf"
                onChange={handleFileUpload}
                disabled={isUploading || isChecking}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <button 
                type="button"
                disabled={isUploading || isChecking}
                className="flex items-center gap-2 px-4 py-2 bg-white/[.05] hover:bg-slate-700 disabled:opacity-50 text-slate-300 text-sm font-medium rounded-lg transition-colors border border-white/10"
              >
                {isUploading ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-300"></span> : <Upload className="w-4 h-4" />}
                {isUploading ? 'Extracting text...' : 'Upload PDF'}
              </button>
            </div>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <FileText className="w-3 h-3" /> PDF only
            </span>
          </div>

          <button 
            onClick={handleCheck}
            disabled={isChecking || !jobDescription.trim()}
            className="w-full py-2 bg-gradient-to-r from-cyan-400 to-violet-500 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isChecking ? (
              <span className="flex items-center gap-2">Checking Evidence... <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span></span>
            ) : (
              "Check Readiness"
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="overflow-hidden border border-white/10 rounded-lg bg-white/[.025]">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[.05]/80 text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Requirement</th>
                  <th className="px-4 py-3 font-medium">Your Evidence</th>
                  <th className="px-4 py-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {readiness.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/[.05]/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{item.skill}</td>
                    <td className="px-4 py-3 text-slate-400">{item.evidence}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <span className="capitalize text-slate-300">{item.status}</span>
                        {getStatusIcon(item.status)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-4 text-center">
            <h3 className="text-white font-bold mb-2">Close the Gap</h3>
            <p className="text-teal-200 text-sm mb-4">We found areas where your evidence is weak or missing. Take a targeted assessment to prove these skills.</p>
            <button 
              onClick={() => {
                const weaknesses = readiness.filter(r => r.status === 'weak' || r.status === 'none').map(r => r.skill).join(',');
                if (weaknesses) {
                   window.location.href = `/assessments?focus=${encodeURIComponent(weaknesses)}`;
                } else {
                   toast.success('You have strong evidence for everything! You are ready to apply.');
                }
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-400 to-violet-500 hover:brightness-110 text-white font-medium rounded-lg transition-all shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:shadow-[0_0_25px_rgba(20,184,166,0.5)]">
              <Code2 className="w-4 h-4" /> Prepare for this Job
            </button>
          </div>
          
          <button onClick={() => setReadiness(null)} className="text-sm text-slate-400 hover:text-white transition-colors w-full text-center">
            Check another job description
          </button>
        </div>
      )}
    </div>
  );
}
