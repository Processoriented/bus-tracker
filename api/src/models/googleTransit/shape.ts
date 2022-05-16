import { GTBase } from './base';


export class Shape extends GTBase {
  shapeID: number;
  latitude: number;
  longitude: number;
  sequence: number;
  distTraveled: number;

  constructor(rowText: string = '') {
    super('shapes.txt', new Date());
    const [
      shape_id,
      shape_pt_lat,
      shape_pt_lon,
      shape_pt_sequence,
      shape_dist_traveled,
      ..._overflow
    ] = `${rowText},,,`.split(',').map(x => `${x}`.trim());
    this.shapeID = GTBase.formatInt(shape_id);
    this.latitude = GTBase.formatFloat(shape_pt_lat);
    this.longitude = GTBase.formatFloat(shape_pt_lon);
    this.sequence = GTBase.formatInt(shape_pt_sequence);
    this.distTraveled = GTBase.formatInt(shape_dist_traveled);
    this.overflow = _overflow;
  }
}
