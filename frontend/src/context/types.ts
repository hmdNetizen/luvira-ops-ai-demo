import {
  TIncidentRequestPayload,
  TIncidentResponsePayload,
} from "@/services/types";

export type SimulationContextValue = {
  data: TIncidentResponsePayload | null;
  isPending: boolean;
  isError: boolean;
  simulate: (payload: TIncidentRequestPayload) => void;
};
