import { useState } from "react";
import { Bell, ChevronDown, Loader } from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useSimulation } from "@/hooks/use-simulation";
import type { TIncidentRequestPayload } from "@/services/types";

const errorOptions: TIncidentRequestPayload[] = [
  {
    error_rate: 0.92,
    message: "Auth API error rate exceeding 85%",
    service_name: "Auth API",
  },
  {
    error_rate: 0.78,
    message: "Payment Gateway timeout rate spiking",
    service_name: "Payment Gateway",
  },
  {
    error_rate: 0.85,
    message: "User Service 5xx errors above threshold",
    service_name: "User Service",
  },
  {
    error_rate: 0.67,
    message: "Notification Service delivery failures",
    service_name: "Notification Service",
  },
  {
    error_rate: 0.91,
    message: "Search Index latency exceeding SLA",
    service_name: "Search Index",
  },
];

export function Header() {
  const { simulate, isPending } = useSimulation();
  const [selectedError, setSelectedError] = useState<TIncidentRequestPayload>(
    errorOptions[0],
  );

  const onSimulateIncidentSpikeHandler = () => {
    simulate(selectedError);
  };

  const handleSelectChange = (serviceName: string) => {
    const found = errorOptions.find((e) => e.service_name === serviceName);
    if (found) setSelectedError(found);
  };

  return (
    <header className="border-b border-border px-6 bg-[#1c1d1f]">
      <div className="flex items-center justify-between h-16">
        <h1 className="text-lg font-semibold text-foreground">
          Luvira Ops AI Mission Control (Overview)
        </h1>

        <div className="flex items-center gap-4">
          <Select
            value={selectedError.service_name}
            onValueChange={handleSelectChange}
          >
            <SelectTrigger className="w-52 bg-[#1c1d1f] border-2 border-gray-100/10 text-foreground">
              <SelectValue placeholder="Select error" />
            </SelectTrigger>
            <SelectContent className="bg-[#1c1d1f] border-gray-100/10">
              {errorOptions.map((opt) => (
                <SelectItem
                  key={opt.service_name}
                  value={opt.service_name}
                  className="text-foreground focus:bg-white/5 focus:text-foreground"
                >
                  {opt.service_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={onSimulateIncidentSpikeHandler}
            className="bg-brand hover:bg-brand-dark text-white font-medium px-6 py-5 min-w-40 rounded-md"
          >
            {isPending ? (
              <Loader className="size-6 animate-spin" />
            ) : (
              "Simulate Incident Spike"
            )}
          </Button>

          <Button variant="outline" size="icon">
            <Bell />
          </Button>
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="size-9 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-medium">
              G
            </div>
            <span className="text-sm text-foreground">Garfield</span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* <div className="flex items-center justify-between -mb-px">
        <ul className="flex gap-0 py-2 bg-[#1c1d1f]">
          {tabs.map((tab, i) => (
            <li key={tab}>
              <Button
                variant="ghost"
                className={cn(
                  "px-5 py-2.5 text-sm font-medium border-b-2 transition-colors border-transparent text-muted-foreground hover:text-foreground",
                  // {
                  //   "border-brand text-foreground bg-secondary rounded-t-md":
                  //     i === 0,
                  // },
                )}
              >
                {tab}
              </Button>
            </li>
          ))}
        </ul>
        <span className="text-base text-muted-foreground">
          Powered by DigitalOcean Gradient AI
        </span>
      </div> */}
    </header>
  );
}
