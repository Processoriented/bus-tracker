import React, { useEffect, useRef, useState } from 'react';
import { Status, Wrapper } from '@googlemaps/react-wrapper';
import { GTRoute } from '../models';
import { getGTRoutes } from '../shared/ctaService';
import { useNavGeo } from '../shared/hooks';
import { Marker } from './Marker';


interface RouteMapProps {
  style: { [key: string]: string };
  children?: React.ReactChild | React.ReactChild[];
}

export const RouteMap: React.FC<RouteMapProps> = ({ style }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const { coords } = useNavGeo();
  const [routes, setRoutes] = useState<GTRoute[]>([]);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 0, lng: 0});
  const [zoom] = useState<number>(14);

  useEffect(() => {
    if (!(coords instanceof GeolocationCoordinates)) return;
    const { latitude: lat, longitude: lng } = coords;
    const nextCenter = { lat, lng };
    setCenter(nextCenter);
  }, [coords]);

  useEffect(() => {
    if (!(mapRef.current instanceof HTMLElement)) return;
    setMap(new window.google.maps.Map(mapRef.current, { center, zoom }));
  }, [center, zoom]);
  
  const render = (status: Status) => {
    if (status === Status.FAILURE) return <div>{status.toString()}</div>;
    return <></>;
  };

  useEffect(() => {
    getGTRoutes({}).then(setRoutes);
  }, []);

  useEffect(() => console.dir(routes), [routes]);

  return (
    <Wrapper apiKey={`${process.env.REACT_APP_GCP_KEY}`} render={render}>
      <div ref={mapRef} style={style} />
        {!center ? null : (
          <Marker position={center} map={map} label="Start" />
        )}
      {/* {routes
        .map((route, idx) => {
          return (
            <div key={`route${idx}`}>
              {Object.entries(route)
                .map(([k, v], i) => {
                  return (
                    <React.Fragment key={`${k}${i}`}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </React.Fragment>
                  );
                })
              }
            </div>
          );
        })
      } */}
    </Wrapper>
  );
}
