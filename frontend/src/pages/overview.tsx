import { IncidentChart } from "../components/dashboard/incident-chart";
import { RiskMeter } from "../components/dashboard/risk-meter";
import { TraceWorkflow } from "../components/dashboard/track-workflow";
import ChartHeader from "../components/dashboard/chart-header";
import { useSimulation } from "@/hooks/use-simulation";

export default function Overview() {
  const { data, isPending } = useSimulation();

  const riskScore = data ? Math.round(data.risk.score * 100) : 0;
  const latency = data ? `${data.observability.latency_ms}ms` : "--";
  const traceId = data?.observability.trace_id ?? "--";

  const summary = data
    ? [data.analysis]
    : ["No incident data yet", "Simulate an incident to see results"];

  const steps = data
    ? [
        {
          label: "Ingest Event",
          value: `${data.observability.trace_steps.ingest_event}ms`,
        },
        {
          label: "Policy Evaluation",
          value: `${data.observability.trace_steps.policy_evaluation}ms`,
        },
        {
          label: "KB Retrieval",
          value: `${data.observability.trace_steps.kb_retrieval}ms`,
        },
        {
          label: "AI Inference",
          value: `${data.observability.trace_steps.ai_inference}ms`,
        },
      ]
    : [
        { label: "Ingest Event", value: "--" },
        { label: "Policy Evaluation", value: "--" },
        { label: "KB Retrieval", value: "--" },
        { label: "AI Inference", value: "--" },
      ];

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-4">
      <ChartHeader />
      <IncidentChart isSimulating={isPending} />

      <div className="flex w-full gap-5">
        <RiskMeter percentage={riskScore} latency={latency} traceId={traceId} />
        <TraceWorkflow
          summary={summary}
          steps={steps}
          triggered={data?.risk.triggered}
          plan={data?.plan.steps}
        />
      </div>
    </main>
  );
}
