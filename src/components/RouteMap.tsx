import { Status, Wrapper } from '@googlemaps/react-wrapper';
import React, { useEffect, useRef, useState } from 'react';

import { GTStop } from '../models';
import { getGTStops } from '../shared/ctaService';
import { useNavGeo } from '../shared/hooks';
import { Marker } from './Marker';


interface RouteMapProps {
  style: { [key: string]: string };
  children?: React.ReactNode | React.ReactNode[];
}

export const RouteMap: React.FC<RouteMapProps> = ({ style }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const { coords } = useNavGeo();
  // const [_routes, setRoutes] = useState<GTRoute[]>([]);
  const [stops, setStops] = useState<GTStop[]>([]);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 0, lng: 0});
  const [zoom] = useState<number>(14);
  const triggerRef = useRef(0);

  useEffect(() => {
    if (!(coords instanceof GeolocationCoordinates)) return;
    const { latitude: lat, longitude: lng } = coords;
    const nextCenter = { lat, lng };
    setCenter(nextCenter);
  }, [coords]);

  useEffect(() => {
    if (!(mapRef.current instanceof HTMLElement)) return;
    const nextMap = new window.google.maps.Map(mapRef.current, { center, zoom });
    const transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(nextMap);
    // transitLayer.addListener()
    const handleBC = () => triggerRef.current = triggerRef.current + 1;
    nextMap.addListener('bounds_changed', handleBC);
    setMap(nextMap);
    console.dir(transitLayer);
    return () => {
      setMap(undefined);
      // setStops([]);
    };
  }, [center, zoom]);
  
  const render = (status: Status) => {
    if (status === Status.FAILURE) return <div>{status.toString()}</div>;
    return <></>;
  };

  // useEffect(() => {
  //   getGTRoutes({}).then(setRoutes);
  // }, []);

  useEffect(() => {
    if (typeof map === 'undefined') return;
    const bounds = map.getBounds();
    if (typeof bounds === 'undefined') return;
    const ne = bounds.getNorthEast();
    if (typeof ne === 'undefined') return;
    const sw = bounds?.getSouthWest();
    if (typeof sw === 'undefined') return;
    const maxLat = `${ne?.lat() ?? ''}`;
    const minLat = `${sw?.lat() ?? ''}`;
    const maxLng = `${ne?.lng() ?? ''}`;
    const minLng = `${sw?.lng() ?? ''}`;
    const params = { maxLat, maxLng, minLat, minLng };
    getGTStops({ params }).then(setStops);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, map?.getBounds, mapRef.current, triggerRef.current]);

  return (
    <Wrapper apiKey={`${process.env.REACT_APP_GCP_KEY}`} render={render}>
      <div ref={mapRef} style={style} />
        {!center ? null : (
          <Marker position={center} map={map} label="Start" key="startMarker" draggable={true} />
        )}
        {/* {stops.filter(stop => !!stop?.position).map(({ icon, position, stopId }) => (
          <Marker key={stopId} position={position} map={map} icon={icon} />
        ))} */}
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
