import { IPattern } from './patterns';
import { IPrediction } from './prediction';


export interface BustimeResponse {
  error?: any,
  prd?: IPrediction[],
  ptr?: IPattern[],
}

export interface CTAResponse {
  'bustime-response'?: BustimeResponse,
}
