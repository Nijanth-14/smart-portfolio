'use client';

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Check, X, Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LiveEditor({ question, initialCode }: { question: any, initialCode?: string }) {
  const router = useRouter();
  const [code, setCode] = useState(initialCode || `// Write your ${question.language} solution here\n// IMPORTANT: You must console.log() your final result at the bottom of the script!\n// Example: console.log(myFunction([1,2,3]));\n\n`);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<'pending' | 'passed' | 'failed'>('pending');
  const [executionResult, setExecutionResult] = useState<any>(null);
  
  const [explanation, setExplanation] = useState('');
  const [grade, setGrade] = useState<any>(null);
  const [isGrading, setIsGrading] = useState(false);

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
        setExecutionResult(data.executionResult);
      } else {
        setOutput(`Error: ${data.error}`);
        setStatus('failed');
        setExecutionResult(null);
      }
    } catch (err: any) {
      setOutput(`Failed to execute code: ${err.message}`);
      setStatus('failed');
    } finally {
      setIsRunning(false);
      router.refresh(); // Refresh to update dashboard status if needed
    }
  };

  const explainCode = async () => {
    setIsGrading(true);
    try {
      const res = await fetch('/api/assessments/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: question.id, explanation })
      });
      const data = await res.json();
      if (res.ok) {
        setGrade(data.grade);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGrading(false);
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

          {/* Terminal / Result Output */}
          <div className="h-64 border-t border-slate-800 bg-black flex flex-col shrink-0">
            {status === 'pending' && !executionResult && (
               <div className="flex-1 p-4 overflow-y-auto font-mono text-sm text-slate-300 whitespace-pre-wrap">
                 {output || <span className="text-slate-600">No output yet. Run your code to see results.</span>}
               </div>
            )}
            
            {executionResult && (
              <div className="flex-1 overflow-y-auto p-4">
                <div className={`p-4 rounded-lg border ${executionResult.all_passed ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
                  <h4 className={`font-bold mb-3 ${executionResult.all_passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {executionResult.all_passed ? '🎉 All hidden checks passed' : `${executionResult.passed}/${executionResult.total} checks passed`}
                  </h4>
                  
                  <div className="space-y-2">
                    {(executionResult.details || []).map((d: any, i: number) => (
                      <div key={i} className="flex items-start gap-3 bg-slate-900/50 p-2 rounded text-sm font-mono">
                        <span className={d.passed ? 'text-emerald-400' : 'text-rose-400'}>
                          {d.passed ? '✓' : '×'}
                        </span>
                        <div className="flex-1 text-slate-300">
                          <div><span className="text-slate-500">Input:</span> {d.input}</div>
                          <div className={d.passed ? 'text-emerald-300/70' : 'text-rose-300/70'}>
                            {d.passed ? 'Passed successfully' : (d.stderr || 'Output mismatch')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Far Right Pane: AI Reasoning (Appears on pass) */}
        {executionResult?.all_passed && (
          <div className="w-full lg:w-1/4 border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900 flex flex-col">
            <div className="p-4 border-b border-slate-800 bg-indigo-500/10">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> PROVE YOU UNDERSTAND IT
              </span>
            </div>
            
            <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
              <p className="text-sm text-slate-400">
                Why does your solution work? Mention complexity and one edge case.
              </p>
              <textarea
                className="w-full flex-1 min-h-[150px] bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 resize-none focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="My solution uses..."
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
              />
              <button
                onClick={explainCode}
                disabled={isGrading || !explanation.trim()}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {isGrading ? 'Grading...' : 'Grade my reasoning'}
              </button>
              
              {grade && (
                <div className="mt-4 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">{grade.score}<span className="text-sm text-emerald-500/50">/100</span></div>
                  <p className="text-sm text-emerald-100">{grade.feedback}</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
