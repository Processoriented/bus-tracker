import React, { useEffect, useState } from 'react';
// import Trip from './components/Trip';
// import Route from './components/Route';
import { RouteMap } from './components/RouteMap';
import './App.scss';
import { useNavGeo } from './shared/hooks';

interface LatLngLiteral {
  lat: number,
  lng: number,
};

function App() {
  const { coords } = useNavGeo();
  const [center, setCenter] = useState<LatLngLiteral>({ lat: 0, lng: 0 });

  useEffect(() => {
    if (!coords) return;
    const { latitude: lat, longitude: lng } = coords;
    setCenter({ lat, lng });
  }, [coords]);

  return (
    <div className="App">
      <RouteMap style={{ height: '100%', width: '100%' }} center={center} zoom={14} />
    </div>
  );
}

export default App;
