type TRisk = {
  score: number;
  threshold: number;
  triggered: boolean;
};

type TPlan = {
  steps: Array<string>;
};

type TKnowledgeMatch = {
  document: string;
  similarity: number;
  source: string;
};
export type TIncidentResponsePayload = {
  incident_id: string;
  risk: TRisk;
  analysis: string;
  knowledge_match: TKnowledgeMatch;
  plan: TPlan;
  observability: {
    trace_id: string;
    latency_ms: number;
    trace_steps: {
      ingest_event: number;
      policy_evaluation: number;
      kb_retrieval: number;
      ai_inference: number;
    };
  };
  mode: string;
  fallback: {
    used: boolean;
    reason: null;
  };
  errors: [];
};

export type TIncidentErrorResponsePayload = {
  detail: Array<{
    loc: [string, 0];
    msg: string;
    type: string;
    input: string;
    ctx: null;
  }>;
};

export type TIncidentRequestPayload = {
  error_rate: number;
  message: string;
  service_name: string;
};
