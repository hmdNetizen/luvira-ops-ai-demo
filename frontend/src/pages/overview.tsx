import { useState } from "react";
import { IncidentChart } from "../components/dashboard/incident-chart";
import { RiskMeter } from "../components/dashboard/risk-meter";
import { TraceWorkflow } from "../components/dashboard/track-workflow";
import ChartHeader from "../components/dashboard/chart-header";

export default function Overview() {
  const [isSimulating, setIsSimulating] = useState(true);

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-4">
      <ChartHeader />
      <IncidentChart isSimulating={isSimulating} />

      <div className="flex w-full gap-5">
        <RiskMeter percentage={88} latency="1355ms" traceId="UVIRA-C67DC4" />
        <TraceWorkflow
          summary={[
            "Auth API error spike detected",
            "Error rate exceeded threshold",
          ]}
          steps={[
            { label: "Ingest Event", value: "120ms" },
            { label: "Policy Evaluation", value: "45ms" },
            { label: "KB Retrieval", value: "320ms" },
            { label: "AI Inference", value: "870ms" },
          ]}
        />
      </div>
    </main>
  );
}
