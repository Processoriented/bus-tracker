// import { isLatLngLiteral } from '@googlemaps/typescript-guards';
import { createCustomEqual } from 'fast-equals';
import { EffectCallback, useEffect, useRef } from 'react';


const deepCompareEqualsForMaps = createCustomEqual(
  (deepEqual) => (a: any, b: any) => {
    // if (isLatLngLiteral(a) || isLatLngLiteral(b)) {
    //   return new google.maps.LatLng(a).equals(new google.maps.LatLng(b));
    // }

    // TODO extend to other types

    // use fast-equals for other objects
    return deepEqual(a, b);
  }
);

function useDeepCompareMemoize(value: any) {
  const ref = useRef();

  if (!deepCompareEqualsForMaps(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

export function useDeepCompareEffectForMaps(
  callback: EffectCallback,
  dependencies: any[]
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(callback, dependencies.map(useDeepCompareMemoize));
}
