

const formatInt = (text: string) => {
  const patt = /^(\d+?)$/;
  return (patt.test(text)) ? parseInt(text, 10) : -1;
};

export class Time {
  hour: number;
  minute: number;
  second: number;

  constructor(timeString: string) {
    const patt = /^(\d{2}):(\d{2}):(\d{2})$/;
    if (!patt.test(timeString)) throw new TypeError(`Given "${timeString}" does not match ${patt}`);
    const [h, m, s] = `${timeString.replace(patt, '$1,$2,$3')},,`.split(',').map(formatInt);
    const hr = (h >= 0 && h < 24) ? h : ((h < 0) ? (24 + h) : (h - 24));
    const ms = (v: number) => (v >= 0 && v < 60) ? v : ((v < 0) ? (60 + v) : (v - 60));
    const min = ms(m);
    const sec = ms(s);
    this.hour = hr;
    this.minute = min;
    this.second = sec;
  }

  toString() {
    const mkStr = (num: number) => `00${num}`.slice(-2);
    return `${mkStr(this.hour)}:${mkStr(this.minute)}:${mkStr(this.second)}`;
  }
}

const fallbackTime = new Time('00:00:00');

export class GTBase {
  private _source: string;
  private _retrievalDate: Date;
  protected overflow: any[] = [];

  constructor(source: string, retrievalDate: Date) {
    this._source = source;
    this._retrievalDate = retrievalDate;
  }

  get source() { return this._source; }
  get retrievalDate() { return this._retrievalDate; }

  toPlain() {
    const blacklist = ['_source', '_retrievalDate', 'overflow']
    return Object.entries(this).filter(([k]) => !blacklist.includes(k))
      .reduce((p, [k, v]) => ({ ...p, [k]: v}), {});
  }

  static formatInt = formatInt;

  static formatFloat = (text: string) => {
    const patt = /^(\d+?)$|^(\d+?)(\.)(\d*?)$|^(\d*?)(\.)(\d+?)$/;
    return (patt.test(text)) ? parseFloat(text) : -1.0;
  };

  static formatQuoted = (text: string) => {
    const patt = /^"(.*?)"$/;
    if (!patt.test(text)) return text;
    return text.replace(patt, '$1');
  }

  static formatDate = (text: string) => {
    const patt = /^(\d{4})(\d{2})(\d{2})$/;
    if (!patt.test(text)) return new Date(1989, 8, 30, 1, 11);
    const [y, m, d] = `${text.replace(patt, '$1,$2,$3')},,`.split(',').map(GTBase.formatInt);
    return new Date(y, m - 1, d);
  }

  static formatTime = (text: string) => {
    try {
      const t = new Time(text);
      return t.toString();
    } catch (ex) {
      return fallbackTime.toString();
    }
  }

  static formatURL = (text: string) => {
    try {
      return new URL(text);
    } catch (ex) {
      return new URL('http://transitchicago.com');
    }
  }

  static patts = {
    TEST_INT: /^(\d+?)$/g,
    TEST_DATE_TIME: /^(\d{4})(\d{2})(\d{2}) (\d{2}):(\d{2})$/,
    TEST_DATE: /^(\d{4})(\d{2})(\d{2})$/,
  };
};
