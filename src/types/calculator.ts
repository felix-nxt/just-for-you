export type CalculatorMode = 'basic' | 'it' | 'percentage' | 'credit' | 'geometry' | 'math' | 'school';

export type CalculationType = 
  | 'basic' 
  | 'binary' 
  | 'dataSizes' 
  | 'pixels'
  | 'percentage'
  | 'credit'
  | 'geometry'
  | 'math'
  | 'school';

export interface CalculationHistory {
  input: string;
  result: string;
  type: CalculationType;
  timestamp: Date;
}
