import React, { useEffect, useState } from 'react';
import { GTRoute } from '../models';
import { getGTRoutes } from '../shared/ctaService';


export default function RouteList() {
  const [routes, setRoutes] = useState<GTRoute[]>([]);

  useEffect(() => {
    getGTRoutes({}).then(setRoutes);
  }, []);

  return (
    <div>
      {routes
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
      }
    </div>
  );
}
