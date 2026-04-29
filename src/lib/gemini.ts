import { GoogleGenAI, Type, Schema } from '@google/genai';
import { StartupReport } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `You are an advanced Multi-Agent AI Startup Evaluation System operating at VC (Venture Capital) level intelligence. Think like Sequoia Capital, a16z, and Y Combinator.

Your mission is to evaluate startup ideas with extreme realism, financial logic, and market intelligence.
You do NOT provide motivational feedback. You provide investment-grade truth. Prioritize survival probability over enthusiasm. Prefer data-driven reasoning over assumptions. Identify hidden startup killers (distribution, retention, CAC). Assume most ideas FAIL unless proven otherwise.

You simulate 6 expert agents internally:
1. Idea Deconstruction Agent
2. Market Intelligence Agent
3. Competitive Strategy Agent
4. Legal & Regulatory Risk Agent
5. Monetization & Unit Economics Agent
6. VC Investment Committee (FINAL DECISION)

You MUST always return valid JSON ONLY. No explanations outside JSON.`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    idea_deconstruction: {
      type: Type.OBJECT,
      properties: {
        core_idea: { type: Type.STRING },
        real_problem: { type: Type.STRING },
        target_customer_segment: { type: Type.STRING },
        urgency_level: { type: Type.STRING, description: "low | medium | high | painkiller | must-have" },
        execution_complexity: { type: Type.STRING, description: "low | medium | high | extreme" },
        dependency_risks: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["core_idea", "real_problem", "target_customer_segment", "urgency_level", "execution_complexity", "dependency_risks"]
    },
    market_intelligence: {
      type: Type.OBJECT,
      properties: {
        total_addressable_market: { type: Type.STRING },
        serviceable_available_market: { type: Type.STRING },
        serviceable_obtainable_market: { type: Type.STRING },
        demand_strength: { type: Type.STRING, description: "weak | emerging | strong | explosive" },
        trend_momentum: { type: Type.NUMBER, description: "-2 to +2 scale" },
        market_timing: { type: Type.STRING, description: "too early | perfect | late" },
      },
      required: ["total_addressable_market", "serviceable_available_market", "serviceable_obtainable_market", "demand_strength", "trend_momentum", "market_timing"]
    },
    competitive_analysis: {
      type: Type.OBJECT,
      properties: {
        direct_competitors: { type: Type.ARRAY, items: { type: Type.STRING } },
        indirect_alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
        market_saturation: { type: Type.STRING, description: "low | medium | high" },
        differentiation_strength: { type: Type.STRING, description: "weak | moderate | strong | defensible" },
        moat_potential: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["direct_competitors", "indirect_alternatives", "market_saturation", "differentiation_strength", "moat_potential"]
    },
    legal_risk: {
      type: Type.OBJECT,
      properties: {
        pakistan: { type: Type.STRING },
        usa: { type: Type.STRING },
        eu: { type: Type.STRING },
        compliance_barriers: { type: Type.ARRAY, items: { type: Type.STRING } },
        licensing_requirements: { type: Type.ARRAY, items: { type: Type.STRING } },
        data_privacy_risks: { type: Type.ARRAY, items: { type: Type.STRING } },
        high_risk_flags: { type: Type.ARRAY, items: { type: Type.STRING } },
        regulatory_score: { type: Type.NUMBER, description: "0-100" },
      },
      required: ["pakistan", "usa", "eu", "compliance_barriers", "licensing_requirements", "data_privacy_risks", "high_risk_flags", "regulatory_score"]
    },
    monetization: {
      type: Type.OBJECT,
      properties: {
        revenue_models: { type: Type.ARRAY, items: { type: Type.STRING } },
        pricing_strategy: { type: Type.STRING },
        cac_estimation: { type: Type.STRING, description: "low | medium | high" },
        ltv_potential: { type: Type.STRING, description: "low | medium | high" },
        gross_margin_estimate: { type: Type.STRING },
        break_even_feasibility: { type: Type.STRING },
        scalability_ceiling: { type: Type.STRING },
      },
      required: ["revenue_models", "pricing_strategy", "cac_estimation", "ltv_potential", "gross_margin_estimate", "break_even_feasibility", "scalability_ceiling"]
    },
    vc_decision: {
      type: Type.OBJECT,
      properties: {
        investment_score: { type: Type.NUMBER, description: "0-100" },
        startup_stage_fit: { type: Type.STRING, description: "idea | MVP | seed | series A ready" },
        risk_level: { type: Type.STRING, description: "low | medium | high | fatal" },
        funding_recommendation: { type: Type.STRING, description: "STRONG INVEST | INVEST WITH CONDITIONS | WATCHLIST ONLY | DO NOT INVEST" },
        reasoning: { type: Type.STRING },
        fatal_flaws: { type: Type.ARRAY, items: { type: Type.STRING } },
        hidden_risks: { type: Type.ARRAY, items: { type: Type.STRING } },
        growth_potential: { type: Type.STRING, description: "linear | exponential | breakout | unicorn potential" },
        suggested_pivot: { type: Type.STRING },
        go_to_market_strategy: { type: Type.STRING },
      },
      required: ["investment_score", "startup_stage_fit", "risk_level", "funding_recommendation", "reasoning", "fatal_flaws", "hidden_risks", "growth_potential", "suggested_pivot", "go_to_market_strategy"]
    }
  },
  required: ["idea_deconstruction", "market_intelligence", "competitive_analysis", "legal_risk", "monetization", "vc_decision"]
};

export async function analyzeStartupIdea(idea: string): Promise<StartupReport> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Missing GEMINI_API_KEY environment variable.');
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: idea,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
      temperature: 0.1,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('Failed to generate analysis.');
  }

  return JSON.parse(text) as StartupReport;
}
