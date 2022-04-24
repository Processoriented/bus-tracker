import React, { useEffect, useState } from 'react';

export interface TripProps {
  [key: string]: any;
};

export default function Trip(props: TripProps) {
  const [message, setMessage] = useState('Trip Rendered');

  useEffect(() => {
    const apiKey: string = `${process.env.REACT_APP_CTA_API_KEY}`;
    setMessage(apiKey);
  }, []);

  return (
    <p>{message}</p>
  );
}
