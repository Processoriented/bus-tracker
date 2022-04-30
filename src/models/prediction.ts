import { CTA_TS_PATT } from './common';


export type PredictionType = 'A'|'D';

export interface IPrediction {
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
}

export class Prediction {
  private tmstmp: string;
  private typ: PredictionType;
  private stpnm: string;
  private stpid: string;
  private vid: string;
  private dstp: number;
  private rt: string;
  private rtdd: string;
  private rtdir: string;
  private des: string;
  private prdtm: string;
  private tablockid: string;
  private tatripid: string;
  private dly: boolean;
  private prdctdn: string;
  private _zone: string;

  constructor(prd: Partial<IPrediction> = {}) {
    this.tmstmp = prd?.tmstmp ?? '19890930 01:11';
    this.typ = (prd?.typ ?? 'A');
    this.stpnm = prd?.stpnm ?? 'unknown';
    this.stpid = prd?.stpid ?? '-1';
    this.vid = prd?.vid ?? '-1';
    this.dstp = prd?.dstp ?? -1;
    this.rt = prd?.rt ?? 'UNK';
    this.rtdd = prd?.rtdd ?? 'unknown';
    this.rtdir = prd?.rtdir ?? 'unknown';
    this.des = prd?.des ?? 'unknown';
    this.prdtm = prd?.prdtm ?? '19890930 01:11';
    this.tablockid = prd?.tablockid ?? '';
    this.tatripid = prd?.tatripid ?? '';
    this.dly = prd?.dly ?? false;
    this.prdctdn = prd?.prdctdn ?? '';
    this._zone = prd?.zone ?? '';
  }

  private formatDate(ctaTs: string) {
    const pattTest = CTA_TS_PATT.test(ctaTs ?? '');
    if (!(pattTest && ctaTs)) return new Date(1989, 8, 30, 1, 11);
    const separated = ctaTs.replace(CTA_TS_PATT, '$1,$2,$3,$4,$5');
    const toInt = (x: string) => parseInt(x, 10);
    const asNums = separated.split(',').map(toInt).map((x, i) => i === 1 ? x - 1 : x);
    const [y, m, d, hh, mm] = [...asNums];
    console.log({ ctaTs, separated, asNums });
    return new Date(y, m, d, hh, mm);
  }

  get timeStamp(): Date { return this.formatDate(this.tmstmp); }
  get predictionType() { return this.typ; }
  get predictionTypeDesc() { return { A: 'arrival', D: 'departure' }[this.typ]; }
  get stopId() { return this.stpid; }
  get stopName() { return this.stpnm; }
  get vehicleId() { return this.vid; }
  get distance() { return this.dstp; }
  get route() { return this.rt; }
  get routeDir() { return this.rtdir; }
  get destination() { return this.des; }
  get predictedTime() { return this.formatDate(this.prdtm); }
  get delayed() { return this.dly; }
  get blockId() { return this.tablockid; }
  get tripId() { return this.tatripid; }
  get countdown() { return this.prdctdn; }
  get zone() { return this._zone; }
}
