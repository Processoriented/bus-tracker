


export type PointType = 'S'|'W';

export class Point {
  seq: number;
  lat: number;
  lon: number;
  typ: PointType;
  stpid: string;
  stpnm: string;
  pdist: number;

  constructor(p: Partial<Point> = {}) {
    this.seq = p?.seq ?? -1;
    this.lat = p?.lat ?? -1;
    this.lon = p?.lon ?? -1;
    this.typ = p?.typ ?? 'W';
    this.stpid = p?.stpid ?? '-1';
    this.stpnm = p?.stpnm ?? 'Unknown';
    this.pdist = p?.pdist ?? -1;
  }

  get sequence() { return this.seq; }
  get pointType() { return this.typ; }
  get pointTypeDesc() { return { W: 'waypoint', S: 'stop' }[this.typ]; }
  get latitude() { return this.lat; }
  get longitude() { return this.lon; }
  get geoCoords() { return { lat: this.lat, lon: this.lon }; }
  get stopId() { return this.stpid; }
  get stopName() { return this.stpnm; }
  get distance() { return this.pdist; }
}

export class Pattern {
  pid: number;
  ln: number;
  rtdir: string;
  pt: Point[];

  constructor(ptr: Partial<Pattern> = {}) {
    this.pid = ptr?.pid ?? -1;
    this.ln = ptr?.ln ?? -1;
    this.rtdir = ptr?.rtdir ?? '';
    this.pt = [...(ptr?.pt ?? [])].map(p => new Point(p));
  }

  get patternId() { return this.pid; }
  get length() { return this.ln; };
  get direction() { return this.rtdir; }
  get points() { return this.pt.sort(({ sequence: a }, { sequence: b }) => a - b); }
  get waypoints() { return this.points.filter(p => p.pointType === 'W'); }
  get stops() { return this.points.filter(p => p.pointType === 'S'); }

  get firstStop() { return [...this.stops, null].shift(); }
  get lastStop() { return [null, ...this.stops].pop(); }
  
  getStopsAfter(sequence: number) { return this.stops.filter(p => p.sequence > sequence); }
  
  getStopsBetween(start: number, end: number) {
    return this.getStopsAfter(start).filter(p => p.sequence < end);
  }
}
