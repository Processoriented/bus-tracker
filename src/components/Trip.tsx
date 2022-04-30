import React, { useEffect, useState } from 'react';
import { Prediction } from '../models';
import { CTAParams, getPredictions } from '../shared/ctaService';

export interface TripProps {
  [key: string]: any;
};

export default function Trip(props: TripProps) {
  const [message, setMessage] = useState('Trip Rendered');
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    const params: CTAParams = { stpid: '11027,15021,18329' };
    getPredictions({ params }).then((resp: Prediction[]|any) => {
      const tGuard = (x: any) => x instanceof Prediction;
      if (!(Array.isArray(resp) && resp.some(tGuard))) return;
      const next = resp.filter(tGuard);
      setPredictions(next);
      setMessage(`Found ${next.length} predictions`)
    });
  }, []);

  return (
    <main>
      <h1>{message}</h1>
      {predictions.map((prd, idx) => (
        <div key={`prd-${idx}`}>
          <h2>{prd.stopName}</h2>
          <p>{`${prd.timeStamp}`}</p>
        </div>
      ))}
    </main>
  );
}
