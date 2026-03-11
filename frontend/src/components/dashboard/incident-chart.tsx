import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const baseData = [
  {
    time: "15:00",
    logSignal: 5,
    policyEngine: 0,
    riskThreshold: 0,
    gradientKB: 0,
    aiRemediation: 0,
  },
  {
    time: "15:30",
    logSignal: 8,
    policyEngine: 0,
    riskThreshold: 0,
    gradientKB: 0,
    aiRemediation: 0,
  },
  {
    time: "16:00",
    logSignal: 12,
    policyEngine: 0,
    riskThreshold: 15,
    gradientKB: 0,
    aiRemediation: 0,
  },
  {
    time: "16:30",
    logSignal: 25,
    policyEngine: 20,
    riskThreshold: 15,
    gradientKB: 0,
    aiRemediation: 0,
  },
  {
    time: "17:00",
    logSignal: 45,
    policyEngine: 55,
    riskThreshold: 15,
    gradientKB: 0,
    aiRemediation: 0,
  },
  {
    time: "17:30",
    logSignal: 48,
    policyEngine: 70,
    riskThreshold: 15,
    gradientKB: 0,
    aiRemediation: 0,
  },
  {
    time: "18:00",
    logSignal: 50,
    policyEngine: 75,
    riskThreshold: 45,
    gradientKB: 0,
    aiRemediation: 0,
  },
  {
    time: "18:30",
    logSignal: 50,
    policyEngine: 75,
    riskThreshold: 45,
    gradientKB: 0,
    aiRemediation: 0,
  },
  {
    time: "19:00",
    logSignal: 50,
    policyEngine: 75,
    riskThreshold: 45,
    gradientKB: 0,
    aiRemediation: 0,
  },
  {
    time: "19:30",
    logSignal: 50,
    policyEngine: 75,
    riskThreshold: 45,
    gradientKB: 0,
    aiRemediation: 0,
  },
  {
    time: "20:00",
    logSignal: 50,
    policyEngine: 55,
    riskThreshold: 45,
    gradientKB: 0,
    aiRemediation: 0,
  },
  {
    time: "20:30",
    logSignal: 50,
    policyEngine: 55,
    riskThreshold: 45,
    gradientKB: 0,
    aiRemediation: 0,
  },
  {
    time: "21:00",
    logSignal: 50,
    policyEngine: 55,
    riskThreshold: 45,
    gradientKB: 0,
    aiRemediation: 0,
  },
  {
    time: "21:30",
    logSignal: 50,
    policyEngine: 55,
    riskThreshold: 45,
    gradientKB: 0,
    aiRemediation: 0,
  },
  {
    time: "22:00",
    logSignal: 50,
    policyEngine: 55,
    riskThreshold: 45,
    gradientKB: 60,
    aiRemediation: 55,
  },
  {
    time: "22:30",
    logSignal: 50,
    policyEngine: 55,
    riskThreshold: 45,
    gradientKB: 65,
    aiRemediation: 60,
  },
  {
    time: "23:00",
    logSignal: 50,
    policyEngine: 55,
    riskThreshold: 45,
    gradientKB: 68,
    aiRemediation: 65,
  },
  {
    time: "23:30",
    logSignal: 50,
    policyEngine: 55,
    riskThreshold: 45,
    gradientKB: 70,
    aiRemediation: 68,
  },
  {
    time: "24:00",
    logSignal: 50,
    policyEngine: 55,
    riskThreshold: 45,
    gradientKB: 72,
    aiRemediation: 70,
  },
  {
    time: "24:30",
    logSignal: 50,
    policyEngine: 55,
    riskThreshold: 45,
    gradientKB: 72,
    aiRemediation: 72,
  },
  {
    time: "25:00",
    logSignal: 50,
    policyEngine: 55,
    riskThreshold: 45,
    gradientKB: 73,
    aiRemediation: 72,
  },
  {
    time: "25:30",
    logSignal: 50,
    policyEngine: 55,
    riskThreshold: 45,
    gradientKB: 73,
    aiRemediation: 72,
  },
  {
    time: "26:00",
    logSignal: 50,
    policyEngine: 55,
    riskThreshold: 45,
    gradientKB: 73,
    aiRemediation: 72,
  },
];

const legendItems = [
  { label: "Log Signal", color: "#ef4444" },
  { label: "Policy Engine", color: "#a855f7" },
  { label: "Risk Threshold", color: "#f97316" },
  { label: "Gradient KB", color: "#22c55e" },
  { label: "AI Remediation", color: "#3bcaca" },
];

interface IncidentChartProps {
  isSimulating: boolean;
}

export function IncidentChart({ isSimulating }: IncidentChartProps) {
  const data = isSimulating ? baseData : baseData.slice(0, 6);

  return (
    <div className="bg-[#1c1d1f] rounded-xl p-5 border-2 border-gray-100/10">
      <h2 className="text-base font-semibold text-card-foreground mb-4">
        Incident Simulation Control
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2e2e48" />
          <XAxis
            dataKey="time"
            stroke="#6b6b8a"
            tick={{ fill: "#8888aa", fontSize: 12 }}
            axisLine={{ stroke: "#2e2e48" }}
          />
          <YAxis
            stroke="#6b6b8a"
            tick={{ fill: "#8888aa", fontSize: 12 }}
            axisLine={{ stroke: "#2e2e48" }}
            tickFormatter={(v) => `${v}%`}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e1e34",
              border: "1px solid #2e2e48",
              borderRadius: "8px",
              color: "#e0e0e0",
            }}
          />
          {isSimulating && (
            <>
              <ReferenceLine x="16:00" stroke="#f97316" strokeDasharray="3 3" />
              <ReferenceLine x="22:00" stroke="#3bcaca" strokeDasharray="3 3" />
            </>
          )}
          <Line
            type="monotone"
            dataKey="logSignal"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
            name="Log Signal"
          />
          <Line
            type="monotone"
            dataKey="policyEngine"
            stroke="#a855f7"
            strokeWidth={2}
            dot={false}
            name="Policy Engine"
          />
          <Line
            type="monotone"
            dataKey="riskThreshold"
            stroke="#f97316"
            strokeWidth={2}
            dot={false}
            name="Risk Threshold"
          />
          <Line
            type="monotone"
            dataKey="gradientKB"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
            name="Gradient KB"
          />
          <Line
            type="monotone"
            dataKey="aiRemediation"
            stroke="#3bcaca"
            strokeWidth={2}
            dot={false}
            name="AI Remediation"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-center gap-6 mt-3">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              className="inline-block w-4 h-1 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-200">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
