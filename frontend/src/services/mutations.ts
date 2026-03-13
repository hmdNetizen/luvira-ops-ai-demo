import { useMutation } from "@tanstack/react-query";
import { TIncidentRequestPayload } from "./types";
import { simulateIncidentSpike } from "./api";

export const useSimulateIncidentSpike = () => {
  return useMutation({
    mutationFn: (data: TIncidentRequestPayload) => simulateIncidentSpike(data),
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
