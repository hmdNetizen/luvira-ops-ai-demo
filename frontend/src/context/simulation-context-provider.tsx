import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { simulateIncidentSpike } from "@/services/api";
import type {
  TIncidentRequestPayload,
  TIncidentResponsePayload,
} from "@/services/types";
import { SimulationContext } from "./simulation-context";

export function SimulationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, setData] = useState<TIncidentResponsePayload | null>(null);

  const mutation = useMutation({
    mutationFn: (payload: TIncidentRequestPayload) =>
      simulateIncidentSpike(payload),
    onSuccess: (response) => {
      setData(response);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <SimulationContext.Provider
      value={{
        data,
        isPending: mutation.isPending,
        isError: mutation.isError,
        simulate: mutation.mutate,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}
