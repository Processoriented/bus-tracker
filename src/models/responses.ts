import { IPattern } from './patterns';
import { IPrediction } from './prediction';


export interface BustimeResponse {
  error?: string,
  prd?: IPrediction[],
  ptr?: IPattern[],
}

export interface CTAResponse {
  'bustime-response'?: BustimeResponse,
}
