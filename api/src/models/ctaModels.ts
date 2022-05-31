import { ctaTsToDate } from '../util';


export type PointType = 'S'|'W';
export type PredictionType = 'A'|'D';

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
}

export class Pattern {
  pid: number;
  ln: number;
  rtdir: string;
  pt: Point[] | Partial<Point>[];

  constructor(ptr: Partial<Pattern> = {}) {
    this.pid = ptr?.pid ?? -1;
    this.ln = ptr?.ln ?? -1;
    this.rtdir = ptr?.rtdir ?? '';
    this.pt = [...(ptr?.pt ?? [])].map(p => new Point(p));
  }
}

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
    this.tmstmp = ctaTsToDate(`${prd?.tmstmp ?? ''}`);
    this.typ = prd?.typ ?? 'A';
    this.stpnm = prd?.stpnm ?? 'unknown';
    this.stpid = prd?.stpid ?? '-1';
    this.vid = prd?.vid ?? '-1';
    this.dstp = prd?.dstp ?? -1;
    this.rt = prd?.rt ?? 'UNK';
    this.rtdd = prd?.rtdd ?? 'unknown';
    this.rtdir = prd?.rtdir ?? 'unknown';
    this.des = prd?.des ?? 'unknown';
    this.prdtm = ctaTsToDate(`${prd?.prdtm ?? ''}`);
    this.tablockid = prd?.tablockid ?? '';
    this.tatripid = prd?.tatripid ?? '';
    this.dly = prd?.dly ?? false;
    this.prdctdn = prd?.prdctdn ?? '';
    this.zone = prd?.zone ?? '';
  }

}
