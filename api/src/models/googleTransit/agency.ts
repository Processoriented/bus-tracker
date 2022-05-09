import { GTBase } from './base';


export class Agency extends GTBase {
  agencyName: string;
  agencyUrl: URL;
  agencyTimezone: string;
  agencyLang: string;
  agencyPhone: string;
  agencyFareUrl: URL;

  constructor(rowText: string = '') {
    super('agency.txt', new Date());
    const [
      agency_name,
      agency_url,
      agency_timezone,
      agency_lang,
      agency_phone,
      agency_fare_url,
      ..._overflow
    ] = `${rowText},,,,,`.split(',').map(x => `${x}`.trim());
    this.agencyName = agency_name;
    this.agencyUrl = GTBase.formatURL(agency_url);
    this.agencyTimezone = agency_timezone;
    this.agencyLang = agency_lang;
    this.agencyPhone = agency_phone;
    this.agencyFareUrl = GTBase.formatURL(agency_fare_url);
    this.overflow = _overflow;
  }
}
