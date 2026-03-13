interface TraceStep {
  label: string;
  value: string;
  highlight?: boolean;
}

interface TraceWorkflowProps {
  summary: string[];
  steps: TraceStep[];
  triggered?: boolean;
  plan?: string[];
}

export function TraceWorkflow({
  summary,
  steps,
  triggered,
  plan,
}: TraceWorkflowProps) {
  return (
    <div className="bg-[#1c1d1f] rounded-xl border-2 border-gray-100/10 p-5 flex-3">
      <div className="flex gap-6">
        {/* Left side - Trace Workflow */}
        <div className="flex-1">
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
                    <p
                      key={i}
                      className="text-sm font-semibold text-foreground"
                    >
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

        {/* Right side - Action Plan */}
        {triggered && plan && plan.length > 0 && (
          <div className="flex-1 border-l border-gray-100/10 pl-6">
            <h2 className="text-base font-semibold text-card-foreground mb-4">
              Remediation Plan
            </h2>
            <ol className="space-y-2 list-decimal list-inside">
              {plan.map((step, i) => (
                <li key={i} className="text-sm text-foreground">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
