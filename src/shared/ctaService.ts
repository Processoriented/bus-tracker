import { CTAResponse, BustimeResponse, IPrediction, Prediction, IPattern } from '../models';


export type ServiceInterfaces = IPrediction | IPattern;
export type ServiceInterface<T> = Extract<T, ServiceInterfaces> 
export type ServicePlucker<T = any> = ((resp: CTAResponse) => T[] | PromiseLike<T[]>);
export type ServiceFormatter<T = any, U = any> = ((plucked: T[]) => U[] | PromiseLike<U[]>);
export type ServiceCatcher = ((reason: any) => void | PromiseLike<void>);

export interface CTAParams {
  [k: string]: string|number;
};

export interface ServiceOptions<T = any, U = any> {
  resource: string;
  params?: CTAParams;
  plucker: ServicePlucker<T>;
  formatter: ServiceFormatter<T, U>;
  catcher?: ServiceCatcher;
}

const baseUrl: string = `${process.env.REACT_APP_API_BASE_URL}`;

const defaultCatcher: ServiceCatcher = error => console.error({ error });

export function getData(options: ServiceOptions) {
  const { resource, params, plucker, formatter } = options;
  const catcher = options?.catcher ?? defaultCatcher;
  const requestOptions = { method: 'GET' };
  const endpoint = new URL(`${baseUrl}/${resource}`);
  Object.entries({ ...params }).forEach(([k, v]) => endpoint.searchParams.append(k, `${v}`));
  return fetch(endpoint.href, requestOptions)
    .then(response => response.json() as CTAResponse)
    .then(plucker)
    .then(formatter)
    .catch(catcher);
};

const makePlucker = <T>(key: keyof BustimeResponse) => {
  return (response: CTAResponse) => {
    const prop = { [key]: [], ...(response['bustime-response']) }[key];
    return (prop ?? []) as T[];
  };
};

export const getPredictions = (options: Partial<ServiceOptions>) => {
  const resource = 'getpredictions';
  const params = { ...(options.params) } as CTAParams;
  const plucker: ServicePlucker<IPrediction> = makePlucker('prd');
  const formatter: ServiceFormatter<IPrediction, Prediction> = (prds) => ([...(prds ?? [])]
    .map(prd => new Prediction(prd)));
  const opts: ServiceOptions<IPrediction, Prediction> = { ...options, resource, params, plucker, formatter };
  return getData(opts) as Promise<Prediction[]>;
};