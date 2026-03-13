import { apiConfig } from "./api-config";
import axios from "./axios";
import { TIncidentRequestPayload, TIncidentResponsePayload } from "./types";

export const simulateIncidentSpike = async (
  payload: TIncidentRequestPayload,
): Promise<TIncidentResponsePayload> => {
  const { data } = await axios.post(apiConfig.ingest, payload);

  return data as TIncidentResponsePayload;
};
