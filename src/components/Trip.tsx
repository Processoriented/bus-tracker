import React, { useEffect, useState } from 'react';
import { BustimeResponse, CTAResponse, Prediction } from '../models';

export interface TripProps {
  [key: string]: any;
};

export default function Trip(props: TripProps) {
  const [message, setMessage] = useState('Trip Rendered');
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    const baseUrl: string = `${process.env.REACT_APP_API_BASE_URL}`;
    const requestOptions = { method: 'GET' };
    const endpoint = new URL(`${baseUrl}/getpredictions`);
    endpoint.searchParams.append('stpid', '11027,15021,18329');
    fetch(endpoint.href, requestOptions)
      .then(response => response.json() as CTAResponse)
      .then((result) => result['bustime-response'])
      .then((btr) => ({ prd: [], ...btr } as BustimeResponse))
      .then(({ prd: prds }) => ([...(prds ?? [])].map(prd => new Prediction(prd))))
      .then(setPredictions)
      .catch(error => console.error('error', error));
  }, []);

  return (
    <main>
      <h1>{message}</h1>
      {predictions.map((prd, idx) => (
        <div key={`prd-${idx}`}>
          <h2>{prd.stopName}</h2>
          <p>{prd.timeStamp?.toTimeString()}</p>
        </div>
      ))}
    </main>
  );
}
