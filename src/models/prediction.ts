import { CTA_TS_PATT } from './common';


export interface IPrediction {
  tmstmp: string;
  typ?: string;
  stpnm?: string;
  stpid?: string;
  vid?: string;
  dstp?: number;
  rt?: string;
  rtdd?: string;
  rtdir?: string;
  des?: string;
  prdtm?: string;
  tablockid?: string;
  tatripid?: string;
  dly?: boolean;
  prdctdn?: string;
  zone?: string;
}

export class Prediction {
  private tmstmp: string;
  private typ: 'A'|'D';
  private stpnm?: string;
  private stpid?: string;
  private vid?: string;
  private dstp?: number;
  private rt?: string;
  private rtdd?: string;
  private rtdir?: string;
  private des?: string;
  private prdtm?: string;
  private tablockid?: string;
  private tatripid?: string;
  private dly?: boolean;
  private prdctdn?: string;
  private zone?: string;

  constructor(prd: IPrediction) {
    Object.assign(this, prd);
    this.tmstmp = prd?.tmstmp ?? '19890930 01:11';
    this.typ = (prd?.typ ?? 'A') as 'A'|'D';
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
  get stopName() { return `${this?.stpnm ?? 'Unknown Stop'}`; }
  get predictionType() { return { A: 'arrival', D: 'departure' }[this?.typ ?? 'A']; }
}
