

export type PredictionType = 'A'|'D';

export class Prediction {
  tmstmp: string;
  typ: PredictionType;
  stpnm: string;
  stpid: string;
  vid: string;
  dstp: number;
  rt: string;
  rtdd: string;
  rtdir: string;
  des: string;
  prdtm: string;
  tablockid: string;
  tatripid: string;
  dly: boolean;
  prdctdn: string;
  zone: string;

  constructor(prd: Partial<Prediction> = {}) {
    this.tmstmp = prd?.tmstmp ?? new Date(1989, 8, 30, 1, 11).toISOString();
    this.typ = (prd?.typ ?? 'A');
    this.stpnm = prd?.stpnm ?? 'unknown';
    this.stpid = prd?.stpid ?? '-1';
    this.vid = prd?.vid ?? '-1';
    this.dstp = prd?.dstp ?? -1;
    this.rt = prd?.rt ?? 'UNK';
    this.rtdd = prd?.rtdd ?? 'unknown';
    this.rtdir = prd?.rtdir ?? 'unknown';
    this.des = prd?.des ?? 'unknown';
    this.prdtm = prd?.prdtm ?? new Date(1989, 8, 30, 1, 11).toISOString();
    this.tablockid = prd?.tablockid ?? '';
    this.tatripid = prd?.tatripid ?? '';
    this.dly = prd?.dly ?? false;
    this.prdctdn = prd?.prdctdn ?? '';
    this.zone = prd?.zone ?? '';
  }

  get timeStamp() { return new Date(this.tmstmp); }
  get predictionType() { return this.typ; }
  get predictionTypeDesc() { return { A: 'arrival', D: 'departure' }[this.typ]; }
  get stopId() { return this.stpid; }
  get stopName() { return this.stpnm; }
  get vehicleId() { return this.vid; }
  get distance() { return this.dstp; }
  get route() { return this.rt; }
  get routeDir() { return this.rtdir; }
  get destination() { return this.des; }
  get predictedTime() { return new Date(this.prdtm); }
  get delayed() { return this.dly; }
  get blockId() { return this.tablockid; }
  get tripId() { return this.tatripid; }
  get countdown() { return this.prdctdn; }
  get time() { return this.predictedTime.toLocaleTimeString(); }
}
