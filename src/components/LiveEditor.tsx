'use client';

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Check, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LiveEditor({ question, initialCode }: { question: any, initialCode?: string }) {
  const router = useRouter();
  const [code, setCode] = useState(initialCode || `// Write your ${question.language} solution here\n// IMPORTANT: You must console.log() your final result at the bottom of the script!\n// Example: console.log(myFunction([1,2,3]));\n\n`);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<'pending' | 'passed' | 'failed'>('pending');

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running code in Piston sandbox...\n');
    setStatus('pending');

    try {
      const res = await fetch('/api/assessments/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: question.id, code })
      });

      const data = await res.json();
      
      if (res.ok) {
        setOutput(data.output || 'No output.');
        setStatus(data.status);
      } else {
        setOutput(`Error: ${data.error}`);
        setStatus('failed');
      }
    } catch (err: any) {
      setOutput(`Failed to execute code: ${err.message}`);
      setStatus('failed');
    } finally {
      setIsRunning(false);
      router.refresh(); // Refresh to update dashboard status if needed
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-950 text-slate-200 border-t border-slate-800">
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left pane: Question Description */}
        <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col bg-slate-900/30 overflow-y-auto">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-2">{question.title}</h1>
            <div className="flex gap-2 mb-6">
              <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-semibold rounded uppercase tracking-wider border border-indigo-500/30">
                {question.language}
              </span>
            </div>
            
            <div className="prose prose-invert prose-slate max-w-none">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {question.description}
              </p>
            </div>
            
            <div className="mt-8 bg-slate-900/80 rounded-xl p-4 border border-slate-800">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Expected Output</h3>
              <code className="text-teal-400 font-mono text-sm block">
                {question.test_cases?.[0]?.expected_output || 'No specific output expected.'}
              </code>
            </div>
          </div>
        </div>

        {/* Right pane: Editor & Terminal */}
        <div className="w-full lg:w-2/3 flex flex-col h-full">
          {/* Editor Header */}
          <div className="h-14 flex items-center justify-between px-4 bg-slate-900 border-b border-slate-800 shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              <span className="ml-4 text-sm font-mono text-slate-400">solution.{question.language === 'typescript' ? 'ts' : question.language}</span>
            </div>
            
            <button 
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
            >
              {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {isRunning ? 'Running...' : 'Run & Submit'}
            </button>
          </div>
          
          {/* Monaco Editor */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={question.language === 'typescript' ? 'typescript' : question.language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
              }}
            />
          </div>

          {/* Terminal Output */}
          <div className="h-64 border-t border-slate-800 bg-black flex flex-col shrink-0">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Terminal Output</span>
              
              {status === 'passed' && (
                <span className="flex items-center gap-1 text-teal-400 text-xs font-bold bg-teal-400/10 px-2 py-0.5 rounded border border-teal-400/20">
                  <Check className="w-3 h-3" /> PASSED
                </span>
              )}
              {status === 'failed' && (
                <span className="flex items-center gap-1 text-rose-400 text-xs font-bold bg-rose-400/10 px-2 py-0.5 rounded border border-rose-400/20">
                  <X className="w-3 h-3" /> FAILED
                </span>
              )}
            </div>
            <div className="flex-1 p-4 overflow-y-auto font-mono text-sm text-slate-300 whitespace-pre-wrap">
              {output || <span className="text-slate-600">No output yet. Run your code to see results.</span>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
