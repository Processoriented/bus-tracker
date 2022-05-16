import { GTBase } from './base';


export class Route extends GTBase {
  routeID: string;
  routeShortName: string;
  routeLongName: string;
  routeType: number;
  routeURL: URL;
  routeColor: string;
  routeTextColor: string;

  constructor(rowText: string = '') {
    super('routes.txt', new Date());
    const [
      route_id,
      route_short_name,
      route_long_name,
      route_type,
      route_url,
      route_color,
      route_text_color,
      ..._overflow
    ] = `${rowText},,,,,,`.split(',').map(x => `${x}`.trim());
    this.routeID = route_id;
    this.routeShortName = GTBase.formatQuoted(route_short_name);
    this.routeLongName = GTBase.formatQuoted(route_long_name);
    this.routeType = GTBase.formatInt(route_type);
    this.routeURL = GTBase.formatURL(route_url);
    this.routeColor = route_color;
    this.routeTextColor = route_text_color;
    this.overflow = _overflow;
  }
}
