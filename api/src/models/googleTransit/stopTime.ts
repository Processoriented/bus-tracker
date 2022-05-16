import { GTBase } from './base';


export class StopTime extends GTBase {
  tripID: number;
  arrivalTime: string;
  departureTime: string;
  stopID: number;
  sequence: number;
  headsign: string;
  pickupType: number;
  distTraveled: number;

  constructor(rowText: string = '') {
    super('frequencies.txt', new Date());
    const [
      trip_id,
      arrival_time,
      departure_time,
      stop_id,
      stop_sequence,
      stop_headsign,
      pickup_type,
      shape_dist_traveled,
      ..._overflow
    ] = `${rowText},,,`.split(',').map(x => `${x}`.trim());
    this.tripID = GTBase.formatInt(trip_id);
    this.arrivalTime = GTBase.formatTime(arrival_time);
    this.departureTime = GTBase.formatTime(departure_time);
    this.stopID = GTBase.formatInt(stop_id);
    this.sequence = GTBase.formatInt(stop_sequence);
    this.headsign = GTBase.formatQuoted(stop_headsign);
    this.pickupType = GTBase.formatInt(pickup_type);
    this.distTraveled = GTBase.formatInt(shape_dist_traveled);
    this.overflow = _overflow;
  }
}
