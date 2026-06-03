import { create } from 'zustand';
import type { SimulationParams, SimulationResult } from '@/types';
import { 
  defaultSimulationParams, 
  runSimulation, 
  type SimulationScenario 
} from '@/utils/simulationEngine';
import { mockSKUs } from '@/data/mockSKUs';
import { mockSuppliers } from '@/data/mockSuppliers';

interface SimulationState {
  params: SimulationParams;
  currentScenario: SimulationScenario;
  results: SimulationResult | null;
  isSimulating: boolean;
  highlightedStep: string | null;
  activePath: string[];
  
  setParams: (params: Partial<SimulationParams>) => void;
  setScenario: (scenario: SimulationScenario) => void;
  runSimulation: () => void;
  resetParams: () => void;
  setHighlightedStep: (step: string | null) => void;
  setActivePath: (path: string[]) => void;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  params: { ...defaultSimulationParams },
  currentScenario: 'baseline',
  results: null,
  isSimulating: false,
  highlightedStep: null,
  activePath: [],

  setParams: (params) => {
    set(state => ({
      params: { ...state.params, ...params },
    }));
  },

  setScenario: (scenario) => {
    set({ currentScenario: scenario, results: null });
  },

  runSimulation: () => {
    set({ isSimulating: true });
    
    setTimeout(() => {
      const { currentScenario, params } = get();
      const result = runSimulation(
        currentScenario,
        mockSKUs,
        mockSuppliers,
        params
      );
      
      set({ 
        results: result, 
        isSimulating: false,
        activePath: generateActivePath(currentScenario),
      });
    }, 1500);
  },

  resetParams: () => {
    set({ params: { ...defaultSimulationParams }, results: null });
  },

  setHighlightedStep: (step) => set({ highlightedStep: step }),

  setActivePath: (path) => set({ activePath: path }),
}));

function generateActivePath(scenario: SimulationScenario): string[] {
  const paths: Record<SimulationScenario, string[]> = {
    baseline: ['detect', 'stock_check', 'supplier_check', 'threshold_check', 'normal'],
    stock_zero: ['detect', 'stock_check', 'emergency'],
    supplier_outage: ['detect', 'stock_check', 'supplier_check', 'supplier_alert'],
    demand_surge: ['detect', 'stock_check', 'supplier_check', 'threshold_check', 'noise_reduction'],
    lead_time_delay: ['detect', 'stock_check', 'supplier_check', 'threshold_check', 'normal'],
    multi_factor: ['detect', 'stock_check', 'supplier_check', 'threshold_check', 'noise_reduction'],
  };
  return paths[scenario] || paths.baseline;
}
