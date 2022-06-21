import { Client, LatLng, TravelMode } from '@googlemaps/google-maps-services-js';
import { config } from 'dotenv';


config();
const key = `${process.env.GOOGLE_MAPS_API_KEY}`;
const client = new Client();

export const getGeocode = async (address: string) => {
  return client.geocode({ params: { key, address } }).then(gcResponse => {
      const str = JSON.stringify(gcResponse.data.results[0]);
      console.log(`First result is: ${str}`);
      return gcResponse.data.results;
    });
};

export const getLatLng = (address: string) => client
  .geocode({ params: { key, address } })
  .then(({ data }) => data)
  .then(({ results }) => results.map(({ geometry }) => geometry.location as LatLng))
  .then((locations) => { console.dir(locations); return locations; });

export const getDirs = (origin: LatLng, destination: LatLng) => {
  const mode = TravelMode.transit;
  const params = { key, origin, destination, mode };
  return client.directions({ params })
    .then(({ data }) => data)
    .then(({ routes }) => routes);
}
