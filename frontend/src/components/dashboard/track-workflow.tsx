interface TraceStep {
  label: string;
  value: string;
  highlight?: boolean;
}

interface TraceWorkflowProps {
  summary: string[];
  steps: TraceStep[];
}

export function TraceWorkflow({ summary, steps }: TraceWorkflowProps) {
  return (
    <div className="bg-[#1c1d1f] rounded-xl border-2 border-gray-100/10 p-5 flex-3">
      <h2 className="text-base font-semibold text-card-foreground mb-4">
        Trace Workflow
      </h2>

      <div className="space-y-4">
        <div>
          <div className="flex gap-x-4">
            <span className="text-sm text-muted-foreground shrink-0">
              Incident Summary:
            </span>
            <div>
              {summary.map((line, i) => (
                <p key={i} className="text-sm font-semibold text-foreground">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>

        {steps.map((step) => (
          <div key={step.label} className="flex gap-x-4">
            <span className="text-sm text-muted-foreground shrink-0">
              {step.label}:
            </span>
            <span className="text-sm font-semibold text-brand">
              {step.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
