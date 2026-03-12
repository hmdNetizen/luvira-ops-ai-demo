import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Follow", value: 12000, color: "#818ca1" },
  { name: "Unfollow", value: 23000, color: "#3bcaca" },
  { name: "Like", value: 50000, color: "#f97316" },
  { name: "Unlike", value: 88000, color: "#22c55e" },
  { name: "Repost", value: 2000, color: "#f59e0b" },
  { name: "Unrepost", value: 15000, color: "#ef4444" },
];

const formatNumber = (num: number) => {
  if (num >= 1000) return `${Math.round(num / 1000)}k`;
  return num.toString();
};

export function GrowthCampaignsChart() {
  return (
    <div className="bg-[#1c1d1f] rounded-xl border border-border p-5 w-72 shrink-0">
      <h3 className="text-sm font-semibold text-card-foreground mb-4">
        Total growth campaigns
      </h3>

      <div className="flex justify-center">
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="size-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-muted-foreground">{item.name}</span>
            <span className="text-xs font-semibold text-foreground ml-auto">
              {formatNumber(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
