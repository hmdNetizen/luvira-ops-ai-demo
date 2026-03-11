import { useEffect, useRef, useState } from "react";

interface RiskMeterProps {
  percentage: number;
  latency: string;
  traceId: string;
}

export function RiskMeter({ percentage, latency, traceId }: RiskMeterProps) {
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const duration = 1500;
    const start = performance.now();
    const from = 0;
    const to = percentage;

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedPercent(Math.round(from + (to - from) * eased));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [percentage]);

  const cx = 180;
  const cy = 160;
  const radius = 145;
  const strokeWidth = 20;
  const startAngle = 225;
  const endAngle = 495;
  const totalAngle = endAngle - startAngle;
  const filledAngle = startAngle + (totalAngle * animatedPercent) / 100;

  const toRad = (angle: number) => ((angle - 90) * Math.PI) / 180;

  const polarToCartesian = (angle: number, r: number = radius) => ({
    x: cx + r * Math.cos(toRad(angle)),
    y: cy + r * Math.sin(toRad(angle)),
  });

  const describeArc = (start: number, end: number, r: number = radius) => {
    const s = polarToCartesian(start, r);
    const e = polarToCartesian(end, r);
    const largeArc = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  };

  // Tick marks along the inner edge
  const tickCount = 40;
  const tickRadius = radius - 16;
  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const angle = startAngle + (totalAngle * i) / (tickCount - 1);
    const pos = polarToCartesian(angle, tickRadius);
    const isFilled = angle <= filledAngle;
    return { ...pos, isFilled, angle };
  });

  // Indicator dot position
  const dotPos = polarToCartesian(filledAngle);

  // Green accent bar: a short thick arc segment just past the indicator
  const greenStart = filledAngle + 3;
  const greenEnd = Math.min(filledAngle + 25, endAngle);

  // Circumference for stroke-dasharray animation
  const circumference = 2 * Math.PI * radius;
  const totalArcLength = (totalAngle / 360) * circumference;
  const filledArcLength = ((filledAngle - startAngle) / 360) * circumference;

  return (
    <div className="bg-[#1c1d1f] flex-2 rounded-xl border-2 border-gray-100/10 p-5">
      <h2 className="text-base font-semibold text-card-foreground mb-2">
        Risk Meter
      </h2>

      <div className="flex flex-col items-center">
        <svg width="360" height="260" viewBox="0 0 360 260">
          <defs>
            {/* <filter id="glow"> */}
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
            {/* </filter> */}
            <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3bcaca" />
              <stop offset="100%" stopColor="#2dd4a8" />
            </linearGradient>
          </defs>

          {/* Background arc */}
          <path
            d={describeArc(startAngle, endAngle)}
            fill="none"
            stroke="#2a2d30"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Filled arc with glow */}
          <path
            d={describeArc(startAngle, endAngle)}
            fill="none"
            stroke="url(#arcGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${filledArcLength} ${totalArcLength}`}
            // filter="url(#glow)"
          />

          {/* Tick dots */}
          {ticks.map((tick, i) => (
            <circle
              key={i}
              cx={tick.x}
              cy={tick.y}
              r={1.5}
              fill={tick.isFilled ? "#3bcaca" : "#3a3d42"}
              opacity={tick.isFilled ? 0.6 : 0.4}
            />
          ))}

          {/* Green accent bar */}
          {animatedPercent > 5 && (
            <path
              d={describeArc(greenStart, greenEnd, radius - 1)}
              fill="none"
              stroke="#4ade80"
              strokeWidth={14}
              strokeLinecap="round"
              opacity={0.7}
            />
          )}

          {/* Indicator dot */}
          <circle
            cx={dotPos.x}
            cy={dotPos.y}
            r={9}
            fill="#3bcaca"
            opacity={0.3}
          />
          <circle cx={dotPos.x} cy={dotPos.y} r={7} fill="#1c1d1f" />
          <circle cx={dotPos.x} cy={dotPos.y} r={4.5} fill="white" />

          {/* Percentage text */}
          <text
            x={cx}
            y={cy + 15}
            textAnchor="middle"
            fill="#e0e0e0"
            fontSize="48"
            fontWeight="bold"
            fontFamily="'Nunito Sans', sans-serif"
          >
            {animatedPercent}%
          </text>
        </svg>

        <div className="text-center -mt-4 space-y-1">
          <p className="text-sm text-muted-foreground">
            Total Latency:{" "}
            <span className="font-semibold text-foreground">{latency}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Trace ID:{" "}
            <span className="font-semibold text-foreground">{traceId}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
