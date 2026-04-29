import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Rocket, CornerDownRight, Loader2, Sparkles } from 'lucide-react';
import { analyzeStartupIdea } from './lib/gemini';
import { StartupReport } from './types';
import ReportViewer from './components/ReportViewer';

export default function App() {
  const [idea, setIdea] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<StartupReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setReport(null);

    try {
      const data = await analyzeStartupIdea(idea);
      setReport(data);
      setTimeout(() => {
        reportRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      <nav className="border-b border-slate-800/60 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Brain className="w-6 h-6 text-indigo-500" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full animate-pulse blur-[1px]"></div>
            </div>
            <span className="font-display font-semibold tracking-wide text-white">VC AI System <span className="text-slate-600 font-mono text-xs ml-2 border border-slate-800 px-2 py-0.5 rounded-full">v3.1 PRO</span></span>
          </div>
          <div className="flex items-center gap-4 text-sm font-mono text-slate-500">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> System Online</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: INPUT */}
          <div className={`lg:col-span-4 transition-all duration-700 ease-in-out ${report ? 'opacity-50 hover:opacity-100' : 'lg:col-span-8 lg:col-start-3'}`}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl sticky top-24"
            >
              <div className="mb-6">
                <h1 className="text-2xl font-display font-bold text-white mb-2">Startup Evaluation Protocol</h1>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Submit a raw startup idea. Our multi-agent system will deconstruct it, analyze the market, verify regulatory compliance, and produce an investor-grade verdict.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <textarea
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="Describe the startup idea, problem, target market, and basic business model..."
                    className="relative w-full h-48 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none font-mono text-sm"
                    disabled={isAnalyzing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono text-slate-500 flex items-center gap-2">
                    <CornerDownRight className="w-4 h-4" /> Be specific for better output
                  </div>
                  <button
                    type="submit"
                    disabled={isAnalyzing || !idea.trim()}
                    className="bg-white text-slate-900 hover:bg-indigo-50 hover:text-indigo-900 px-6 py-2.5 rounded-lg font-semibold tracking-wide flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)]"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" /> Run Due Diligence
                      </>
                    )}
                  </button>
                </div>
              </form>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-4 bg-rose-950/30 border border-rose-900/50 rounded-lg text-rose-400 text-sm font-mono"
                >
                  ERROR: {error}
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* RIGHT: REPORT */}
          <AnimatePresence>
            {report && (
              <motion.div 
                ref={reportRef}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-8"
              >
                <ReportViewer report={report} />
              </motion.div>
            )}
          </AnimatePresence>
          
          {isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="lg:col-span-8 flex flex-col items-center justify-center py-20 text-slate-500"
            >
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping"></div>
                <div className="absolute inset-4 bg-slate-900 border border-indigo-500/50 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                   <Brain className="w-6 h-6 text-indigo-400 animate-pulse" />
                </div>
              </div>
              <div className="font-mono text-sm uppercase tracking-widest text-indigo-400 mb-2">Simulating Multi-Agent Analysis</div>
              <div className="flex items-center gap-4 text-xs font-mono opacity-50">
                <span className="animate-pulse delay-75">Market Intel...</span>
                <span className="animate-pulse delay-150">Competitor Scan...</span>
                <span className="animate-pulse delay-300">Unit Economics...</span>
              </div>
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
}
