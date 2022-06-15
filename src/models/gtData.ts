

export class GTBase {}

export class GTAgency extends GTBase {
  agencyId: string;
  agencyName?: string | null | undefined;
  agencyUrl?: string | null | undefined;
  agencyTimezone?: string | null | undefined;
  agencyLang?: string | null | undefined;
  agencyPhone?: string | null | undefined;
  agencyFareUrl?: string | null | undefined;
  agencyEmail?: string | null | undefined;

  constructor(obj: Partial<GTAgency> = {}) {
    super();
    const { agencyId } = { agencyId: null, ...obj };
    if (!agencyId) throw new TypeError('agencyId is required');
    this.agencyId = agencyId;
    Object.assign(this, obj);
  }
};

export class GTRoute extends GTBase {
  routeId: string;
  agencyId?: string | null | undefined;
  routeShortName?: string | null | undefined;
  routeLongName?: string | null | undefined;
  routeDesc?: string | null | undefined;
  routeType?: number | null | undefined;
  routeUrl?: string | null | undefined;
  routeColor?: string | null | undefined;
  routeSortOrder?: number | null | undefined;
  continuousPickup?: number | null | undefined;
  continousDropOff?: number | null | undefined;

  constructor(obj: Partial<GTRoute> = {}) {
    super();
    const { routeId } = { routeId: null, ...obj };
    if (!routeId) throw new TypeError('routeId is required');
    this.routeId = routeId;
    Object.assign(this, obj);
  }
};

export class GTShapePT extends GTBase {
  shapeId: string;
  shapePtLat?: number;
  shapePtLon?: number;
  shapePtSequence?: number;
  shapeDistTraveled?: number;

  constructor(obj: Partial<GTShapePT> = {}) {
    super();
    const { shapeId } = { shapeId: null, ...obj };
    if (!shapeId) throw new TypeError('shapeId is required');
    this.shapeId = shapeId;
    Object.assign(this, obj);
  }
}

export class GTShapes extends GTBase {
  [shapeId: string]: GTShapePT[];

  constructor(pts: Array<GTShapePT | Partial<GTShapePT>> = []) {
    super();
    const sorter: ((a: GTShapePT, b: GTShapePT) => number) = (
      { shapePtSequence: a },
      { shapePtSequence: b }
    ) => {
      if (typeof a === 'undefined' || typeof b === 'undefined') return 0;
      return a - b;
    };
    pts.map(pt => pt instanceof GTShapePT ? pt : new GTShapePT(pt)).forEach(pt => {
      const shapeArr = this[pt.shapeId] ?? [];
      shapeArr.push(pt);
      this[pt.shapeId] = shapeArr.sort(sorter);
    });
  }
}

export class GTStop extends GTBase {
  stopId: string;
  stopCode?: string;
  stopName?: string;
  stopDesc?: string;
  stopLat?: number;
  stopLon?: number;
  zoneId?: string;
  stopUrl?: string;
  locationType?: number;
  parentStation?: string;
  stopTimezone?: string;
  wheelchairBoarding?: number;
  levelId?: string;
  platformCode?: string;

  constructor(obj: Partial<GTStop> = {}) {
    super();
    const { stopId } = { stopId: null, ...obj };
    if (!stopId) throw new TypeError('stopId is required');
    this.stopId = stopId;
    Object.assign(this, obj);
  }

  get position() {
    if (!this?.stopLat || !this?.stopLon) return undefined;
    return { lat: this.stopLat, lng: this.stopLon } as google.maps.LatLngLiteral;
  }

  get icon() {
    const path = `M39.5,127.2H-33c-2.1,0-3.9-1.8-3.9-3.9c0-0.4,0.1-0.7,0.1-1l3.9-28.6c0.3-1.8,1.9-3.2,3.8-3.2h64.7c1.9,0,3.5,1.4,3.8,3.2
    l3.8,28.6c0.1,0.3,0.1,0.7,0.1,1C43.4,125.5,41.7,127.2,39.5,127.2 M36.6,158.4c-4.1,0-7.4-3.3-7.4-7.4s3.3-7.4,7.4-7.4
    c4,0,7.4,3.3,7.4,7.4S40.7,158.4,36.6,158.4 M-30.2,158.4c-4,0-7.4-3.3-7.4-7.4s3.3-7.4,7.4-7.4s7.4,3.3,7.4,7.4
    S-26.1,158.4-30.2,158.4 M-18.7,77.6h43.9c4.3,0,4.3,8.2,0,8.2h-43.9C-23,85.8-23,77.6-18.7,77.6 M47.1,87.1
    c-1.3-6.5-5.5-9.2-11.8-11.8c-6.3-2.6-21-5.8-32-5.8s-25.7,3.1-32,5.8c-6.3,2.6-10.5,5.2-11.8,11.8l-4.7,36.3v50h8.2v7.8
    c0,9.6,14,9.6,14,0v-7.8h52.8v7.8c0,9.6,14,9.6,14,0v-7.8h8.1v-50L47.1,87.1z`;
    const scale = 0.075;
    const fillColor = 'blue';
    const fillOpacity = 0.5;
    return { fillColor, fillOpacity, path, scale } as google.maps.Symbol;
  }
}
