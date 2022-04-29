

export interface IPrediction {
  tmstmp?: string,
  typ?: string,
  stpnm?: string,
  stpid?: string,
  vid?: string,
  dstp?: number,
  rt?: string,
  rtdd?: string,
  rtdir?: string,
  des?: string,
  prdtm?: string,
  tablockid?: string,
  tatripid?: string,
  dly?: boolean,
  prdctdn?: string,
  zone?: string,
}

export interface BustimeResponse {
  prd?: IPrediction[],
}

export interface CTAResponse {
  'bustime-response'?: BustimeResponse,
}

export class Prediction {
  private tmstmp?: string;
  private typ?: string;
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
  }

  private formatDate(tmstmpStr: string|undefined) {
    console.log(tmstmpStr);
    if (!(tmstmpStr)) return null; //  && /(\d+8) (\d+2):(\d+2)/.test(tmstmpStr)
    const [dt, tm] = tmstmpStr.split(' ');
    const yyyy = parseInt(dt.slice(0, 4), 10);
    const mm = parseInt(dt.slice(4, 6), 10) - 1;
    const dd = parseInt(dt.slice(6), 10);
    const [hh, nn] = tm.split(':').map(x => parseInt(x, 10));
    console.log({ dt, tm, yyyy, mm, m: dt.slice(4, 6), dd, hh, nn });
    return new Date(yyyy, mm, dd, hh, nn, 0, 0);
  }

  get timeStamp() { return this.formatDate(this.tmstmp); }
  get stopName() { return `${this?.stpnm ?? 'Unknown Stop'}`; }
}
