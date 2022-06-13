import { useCallback, useState } from 'react';
import { Loader, LoaderOptions } from '@googlemaps/js-api-loader';


const opts: LoaderOptions = {
  apiKey: `${process.env.REACT_APP_GCP_KEY}`,
  version: 'weekly',
};

export function useGoogleMaps() {
  const [loader] = useState<Loader>(new Loader(opts));
  const load = useCallback(() => loader.load, [loader]);



  return { loader, load };
}
