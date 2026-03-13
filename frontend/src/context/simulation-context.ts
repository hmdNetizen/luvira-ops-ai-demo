import { createContext } from "react";
import { SimulationContextValue } from "./types";

export const SimulationContext = createContext<SimulationContextValue | null>(
  null,
);
