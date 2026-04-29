export interface StartupReport {
  idea_deconstruction: {
    core_idea: string;
    real_problem: string;
    target_customer_segment: string;
    urgency_level: "low" | "medium" | "high" | "painkiller" | "must-have";
    execution_complexity: "low" | "medium" | "high" | "extreme";
    dependency_risks: string[];
  };
  market_intelligence: {
    total_addressable_market: string;
    serviceable_available_market: string;
    serviceable_obtainable_market: string;
    demand_strength: "weak" | "emerging" | "strong" | "explosive";
    trend_momentum: number; // -2 to +2
    market_timing: "too early" | "perfect" | "late";
  };
  competitive_analysis: {
    direct_competitors: string[];
    indirect_alternatives: string[];
    market_saturation: "low" | "medium" | "high";
    differentiation_strength: "weak" | "moderate" | "strong" | "defensible";
    moat_potential: string[];
  };
  legal_risk: {
    pakistan: string;
    usa: string;
    eu: string;
    compliance_barriers: string[];
    licensing_requirements: string[];
    data_privacy_risks: string[];
    high_risk_flags: string[];
    regulatory_score: number; // 0-100
  };
  monetization: {
    revenue_models: string[];
    pricing_strategy: string;
    cac_estimation: "low" | "medium" | "high";
    ltv_potential: "low" | "medium" | "high";
    gross_margin_estimate: string;
    break_even_feasibility: string;
    scalability_ceiling: string;
  };
  vc_decision: {
    investment_score: number;
    startup_stage_fit: "idea" | "MVP" | "seed" | "series A ready";
    risk_level: "low" | "medium" | "high" | "fatal";
    funding_recommendation: "STRONG INVEST" | "INVEST WITH CONDITIONS" | "WATCHLIST ONLY" | "DO NOT INVEST";
    reasoning: string;
    fatal_flaws: string[];
    hidden_risks: string[];
    growth_potential: "linear" | "exponential" | "breakout" | "unicorn potential";
    suggested_pivot: string;
    go_to_market_strategy: string;
  };
}
