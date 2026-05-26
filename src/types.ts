export interface KeyTerm {
  term: string;
  value: string;
  clause_reference?: string;
  risk_level?: 'none' | 'low' | 'medium' | 'high';
}

export interface RedFlag {
  severity: 'CRITICAL' | 'WARNING' | 'FINE';
  clause_reference: string;
  clause_quote: string;
  plain_explanation: string;
  why_it_matters: string;
  recommended_action: string;
}

export interface AnalysisSummary {
  document_type?: string;
  parties?: {
    party_a?: string;
    party_b?: string;
  };
  key_terms?: KeyTerm[];
  duration?: {
    start_date?: string | null;
    end_date?: string | null;
    lock_in_period?: string | null;
    notice_period?: string | null;
  };
  obligations?: {
    party_a?: string[];
    party_b?: string[];
  };
  red_flags?: RedFlag[];
  overall_fairness_score?: number;
  summary_in_one_paragraph?: string;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}
