export type CalculatorMode = 'basic' | 'it' | 'percentage' | 'credit' | 'geometry' | 'math' | 'school' | 'system';

export type CalculationType = 
  | 'basic' 
  | 'binary' 
  | 'dataSizes' 
  | 'pixels'
  | 'percentage'
  | 'credit'
  | 'geometry'
  | 'math'
  | 'school'
  | 'system';

export interface CalculationHistory {
  input: string
  result: string
  calculation?: string
  type: CalculatorMode
  timestamp: Date
  date?: string
}