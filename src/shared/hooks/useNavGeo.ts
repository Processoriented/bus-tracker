import { useEffect, useState } from 'react';


export function useNavGeo() {
  const [available, setAvailable] = useState<boolean>(false);
  const [coords, setCoords] = useState<GeolocationCoordinates>();

  useEffect(() => {
    const isAvailable = ('geolocation' in navigator);
    if (!isAvailable) console.warn('geolocation not available');
    setAvailable(isAvailable);
  }, []);

  useEffect(() => {
    if (!available) return;
    navigator.geolocation.getCurrentPosition((position) => {
      const { coords: c } = position;
      setCoords(c);
    });
  }, [available]);

  return { available, coords };
}
