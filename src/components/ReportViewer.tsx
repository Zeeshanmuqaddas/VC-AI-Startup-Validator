import React from 'react';
import { StartupReport } from '../types';
import { motion } from 'motion/react';
import {
  Brain,
  TrendingUp,
  Swords,
  Scale,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Crosshair,
  Globe,
  Briefcase
} from 'lucide-react';

interface ReportViewerProps {
  report: StartupReport;
}

const ScoreRing = ({ score }: { score: number }) => {
  const isHigh = score >= 80;
  const isMed = score >= 50 && score < 80;
  const color = isHigh ? 'text-emerald-500' : isMed ? 'text-amber-500' : 'text-rose-500';

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
        <path
          className="text-slate-800"
          strokeWidth="3"
          stroke="currentColor"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: score / 100 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={color}
          strokeWidth="3"
          strokeDasharray="100, 100"
          strokeLinecap="round"
          stroke="currentColor"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <div className={`absolute text-2xl font-display font-bold ${color}`}>{score}</div>
    </div>
  );
};

export default function ReportViewer({ report }: ReportViewerProps) {
  const renderList = (items: string[], emptyText = "None identified") => {
    if (!items || items.length === 0) return <span className="text-slate-500 italic text-sm">{emptyText}</span>;
    return (
      <ul className="list-disc pl-4 space-y-1 mt-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-slate-300">{item}</li>
        ))}
      </ul>
    );
  };

  const getFundingRecColor = (rec: string) => {
    if (rec === "STRONG INVEST") return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    if (rec === "INVEST WITH CONDITIONS") return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    if (rec === "WATCHLIST ONLY") return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    return "bg-rose-500/20 text-rose-400 border-rose-500/30";
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-emerald-400';
      case 'medium': return 'text-amber-400';
      case 'high': return 'text-orange-400';
      case 'fatal':
      case 'extreme': return 'text-rose-500 font-bold';
      default: return 'text-slate-400';
    }
  };

  const SectionCard = ({ title, icon: Icon, children, delay }: { title: string, icon: any, children: React.ReactNode, delay: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl"
    >
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-800">
        <div className="p-2 bg-slate-800 rounded-lg">
          <Icon className="w-5 h-5 text-indigo-400" />
        </div>
        <h2 className="text-lg font-display font-semibold text-slate-100 tracking-wide uppercase text-sm">{title}</h2>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </motion.div>
  );

  const Block = ({ label, value, valueClass = "text-slate-200" }: { label: string, value: string | React.ReactNode, valueClass?: string }) => (
    <div>
      <div className="text-xs font-mono text-slate-500 mb-1 uppercase tracking-wider">{label}</div>
      <div className={`text-sm ${valueClass}`}>{value}</div>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-20">
      
      {/* FINAL DECISION SECTION (HERO) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-slate-900 border border-indigo-900/50 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="w-6 h-6 text-indigo-400" />
              <h1 className="text-2xl font-display font-bold text-white">VC Investment Committee Verdict</h1>
            </div>
            
            <div className={`inline-flex items-center px-4 py-1.5 rounded-full border text-sm font-bold tracking-wider ${getFundingRecColor(report.vc_decision.funding_recommendation)}`}>
              {report.vc_decision.funding_recommendation}
            </div>
            
            <p className="text-slate-300 leading-relaxed max-w-2xl text-lg">
              {report.vc_decision.reasoning}
            </p>
          </div>
          
          <div className="flex items-center gap-8 bg-slate-950/50 p-6 rounded-2xl border border-slate-800 shrink-0">
            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-500 font-mono tracking-wider mb-2">VC SCORE</span>
              <ScoreRing score={report.vc_decision.investment_score} />
            </div>
            <div className="w-px h-16 bg-slate-800" />
            <div className="flex flex-col gap-4">
              <div>
                <span className="text-xs text-slate-500 font-mono block mb-1">RISK LEVEL</span>
                <span className={`text-lg font-display uppercase tracking-widest ${getRiskColor(report.vc_decision.risk_level)}`}>
                  {report.vc_decision.risk_level}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-mono block mb-1">STAGE FIT</span>
                <span className="text-sm text-slate-200 capitalize font-mono text-indigo-300">
                  {report.vc_decision.startup_stage_fit}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-slate-800 relative z-10">
          <div className="bg-rose-950/20 rounded-lg p-4 border border-rose-900/30">
            <div className="flex items-center gap-2 text-rose-400 font-semibold mb-2 text-sm">
              <XCircle className="w-4 h-4" /> Fatal Flaws
            </div>
            {renderList(report.vc_decision.fatal_flaws)}
          </div>
          <div className="bg-amber-950/20 rounded-lg p-4 border border-amber-900/30">
            <div className="flex items-center gap-2 text-amber-400 font-semibold mb-2 text-sm">
              <AlertTriangle className="w-4 h-4" /> Hidden Risks
            </div>
            {renderList(report.vc_decision.hidden_risks)}
          </div>
          <div className="bg-indigo-950/20 rounded-lg p-4 border border-indigo-900/30">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-2 text-sm">
              <CheckCircle2 className="w-4 h-4" /> Go-to-Market
            </div>
            <p className="text-sm text-slate-300">{report.vc_decision.go_to_market_strategy}</p>
          </div>
        </div>
      </motion.div>

      {/* TWO COLUMN LAYOUT FOR DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Deconstruction */}
        <SectionCard title="Idea Deconstruction" icon={Brain} delay={0.1}>
          <div className="mb-4">
            <p className="text-sm text-slate-300 font-medium">{report.idea_deconstruction.core_idea}</p> 
          </div>
          <div className="grid grid-cols-2 gap-4 bg-slate-950/50 p-4 rounded-lg">
            <Block label="Urgency Level" value={report.idea_deconstruction.urgency_level} valueClass="uppercase font-mono text-indigo-400" />
            <Block label="Exec Complexity" value={report.idea_deconstruction.execution_complexity} valueClass="uppercase font-mono text-orange-400" />
          </div>
          <Block label="Target Segment" value={report.idea_deconstruction.target_customer_segment} />
          <Block label="Real Problem Solved" value={report.idea_deconstruction.real_problem} />
          <div className="pt-2">
            <div className="text-xs font-mono text-slate-500 mb-1 uppercase tracking-wider">Dependency Risks</div>
            {renderList(report.idea_deconstruction.dependency_risks)}
          </div>
        </SectionCard>

        {/* Market */}
        <SectionCard title="Market Intelligence" icon={Globe} delay={0.2}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Block label="Demand Strength" value={report.market_intelligence.demand_strength} valueClass="capitalize text-emerald-400 font-semibold" />
            <Block label="Market Timing" value={report.market_intelligence.market_timing} valueClass="capitalize text-indigo-400 font-semibold" />
          </div>
          <div className="space-y-3 bg-slate-950/50 p-4 rounded-lg">
            <Block label="TAM (Total)" value={report.market_intelligence.total_addressable_market} />
            <Block label="SAM (Serviceable)" value={report.market_intelligence.serviceable_available_market} />
            <Block label="SOM (Obtainable)" value={report.market_intelligence.serviceable_obtainable_market} />
          </div>
          <Block 
            label="Trend Momentum" 
            value={
              <div className="flex items-center gap-2 mt-1">
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="w-1/2 flex justify-end">
                    <div 
                      className="h-full bg-rose-500" 
                      style={{ width: report.market_intelligence.trend_momentum < 0 ? `${Math.abs(report.market_intelligence.trend_momentum) * 50}%` : '0%' }}
                    />
                  </div>
                  <div className="w-1/2 flex justify-start">
                    <div 
                      className="h-full bg-emerald-500" 
                      style={{ width: report.market_intelligence.trend_momentum > 0 ? `${report.market_intelligence.trend_momentum * 50}%` : '0%' }}
                    />
                  </div>
                </div>
                <span className="text-xs font-mono w-8 text-right">{report.market_intelligence.trend_momentum}</span>
              </div>
            } 
          />
        </SectionCard>

        {/* Competition */}
        <SectionCard title="Competitive Strategy" icon={Swords} delay={0.3}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Block label="Market Saturation" value={report.competitive_analysis.market_saturation} valueClass="uppercase font-mono text-purple-400" />
            <Block label="Differentiation" value={report.competitive_analysis.differentiation_strength} valueClass="uppercase font-mono text-sky-400" />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <div className="text-xs font-mono text-slate-500 mb-1 uppercase tracking-wider">Direct Competitors</div>
              {renderList(report.competitive_analysis.direct_competitors)}
            </div>
            <div>
              <div className="text-xs font-mono text-slate-500 mb-1 uppercase tracking-wider">Indirect Alternatives</div>
              {renderList(report.competitive_analysis.indirect_alternatives)}
            </div>
          </div>
          <div className="pt-2">
            <div className="text-xs font-mono text-slate-500 mb-1 uppercase tracking-wider">Defensible Moats</div>
            {renderList(report.competitive_analysis.moat_potential)}
          </div>
        </SectionCard>

        {/* Monetization */}
        <SectionCard title="Monetization & Economics" icon={DollarSign} delay={0.4}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Block label="CAC Estimate" value={report.monetization.cac_estimation} valueClass="uppercase font-mono text-rose-400" />
            <Block label="LTV Potential" value={report.monetization.ltv_potential} valueClass="uppercase font-mono text-emerald-400" />
          </div>
          <div className="bg-slate-950/50 p-4 rounded-lg space-y-3 mb-4">
            <Block label="Pricing Strategy" value={report.monetization.pricing_strategy} />
            <Block label="Gross Margin Est." value={report.monetization.gross_margin_estimate} />
            <Block label="Scalability Ceiling" value={report.monetization.scalability_ceiling} />
          </div>
          <div>
            <div className="text-xs font-mono text-slate-500 mb-1 uppercase tracking-wider">Revenue Models</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {report.monetization.revenue_models.map((model, i) => (
                <span key={i} className="text-xs px-2.5 py-1 bg-emerald-950/40 text-emerald-400 border border-emerald-900/50 rounded-md font-mono">
                  {model}
                </span>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Legal & Risk */}
        <SectionCard title="Legal & Regulatory Risk" icon={Scale} delay={0.5}>
          <div className="flex items-center gap-4 mb-4 bg-slate-950/50 p-4 rounded-lg">
             <div className="text-center w-24">
                <div className="text-xs font-mono text-slate-500 mb-1 uppercase tracking-wider">Safety Score</div>
                <div className={`text-2xl font-display font-bold ${report.legal_risk.regulatory_score > 70 ? 'text-emerald-400' : report.legal_risk.regulatory_score > 40 ? 'text-amber-400' : 'text-rose-500'}`}>
                  {report.legal_risk.regulatory_score}/100
                </div>
             </div>
             <div className="flex-1 space-y-1 text-sm text-slate-300 border-l border-slate-800 pl-4">
                <div className="flex gap-2"><span className="text-slate-500 font-mono w-8">US:</span> {report.legal_risk.usa}</div>
                <div className="flex gap-2"><span className="text-slate-500 font-mono w-8">EU:</span> {report.legal_risk.eu}</div>
                <div className="flex gap-2"><span className="text-slate-500 font-mono w-8">PK:</span> {report.legal_risk.pakistan}</div>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-mono text-slate-500 mb-1 uppercase tracking-wider">High Risk Flags</div>
              {renderList(report.legal_risk.high_risk_flags)}
            </div>
            <div>
              <div className="text-xs font-mono text-slate-500 mb-1 uppercase tracking-wider">Compliance Barriers</div>
              {renderList(report.legal_risk.compliance_barriers)}
            </div>
          </div>
        </SectionCard>
      </div>

    </div>
  );
}
