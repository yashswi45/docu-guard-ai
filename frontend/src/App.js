import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
// Removed AlertTriangle here so Vercel stops crashing your builds!
import { ShieldCheck, Cpu, Code2, Terminal, Loader2, Zap } from 'lucide-react';

function App() {
  const [code, setCode] = useState('');
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);

  // Dynamically switch between Render (Production) and Localhost (Development)
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

  const handleAudit = async () => {
    setLoading(true);
    setReport('');
    try {
      // Now pointing to the dynamic URL!
      const response = await axios.post(`${API_BASE_URL}/audit`, { code });
      setReport(response.data.report);
    } catch (error) {
      setReport(`## ❌ Connection Error\nCould not connect to the backend at ${API_BASE_URL}. Check if the FastAPI server is running and CORS is configured.`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8 font-sans">
      {/* Header Animation */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12"
      >
        <div className="flex justify-center items-center gap-3 mb-2">
          <div className="bg-blue-500/20 p-3 rounded-2xl">
            <ShieldCheck className="text-blue-400 w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">DOCU-GUARD <span className="text-blue-500">AI</span></h1>
        </div>
        <p className="text-slate-400 text-lg">Multi-Agent Autonomous Security Orchestrator</p>
      </motion.header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* LEFT: INPUT AREA */}
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-slate-800/50 border border-slate-700 p-6 rounded-3xl backdrop-blur-xl shadow-2xl"
        >
          <div className="flex items-center gap-2 mb-4 text-blue-400">
            <Code2 size={20} />
            <h2 className="font-semibold uppercase tracking-widest text-sm">Source Code Input</h2>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-[450px] bg-[#020617] text-blue-300 font-mono p-6 rounded-2xl border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none shadow-inner"
            placeholder="paste your code snippet here..."
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAudit}
            disabled={loading}
            className={`w-full mt-6 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${
              loading ? 'bg-slate-700 text-slate-400' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
            }`}
          >
            {loading ? (
              <><Loader2 className="animate-spin" /> Agents are Auditing...</>
            ) : (
              <><Zap size={20} /> Initialize Security Crew</>
            )}
          </motion.button>
        </motion.div>

        {/* RIGHT: OUTPUT AREA */}
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-slate-900/50 border border-slate-700 p-6 rounded-3xl backdrop-blur-xl relative flex flex-col h-[610px]"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <Terminal size={20} />
              <h2 className="font-semibold uppercase tracking-widest text-sm">Audit Intelligence</h2>
            </div>
            {loading && <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>}
          </div>

          <div className="overflow-y-auto pr-2 custom-scrollbar flex-grow">
            <AnimatePresence mode="wait">
              {report ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="prose prose-invert prose-blue max-w-none"
                >
                  <ReactMarkdown>{report}</ReactMarkdown>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600">
                  <Cpu size={48} className="mb-4 opacity-20" />
                  <p>Awaiting code submission for analysis...</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

      {/* FOOTER STATUS */}
      <footer className="mt-12 text-center text-slate-500 text-xs uppercase tracking-[0.2em]">
        Status: <span className="text-emerald-500">Nodes Active</span> | Engine: <span className="text-blue-500">CrewAI 1.13</span> | Model: <span className="text-blue-500">Llama 3.3</span>
      </footer>
    </div>
  );
}

export default App;
