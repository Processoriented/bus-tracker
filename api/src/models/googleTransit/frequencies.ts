import { GTBase } from './base';


export class Frequencies extends GTBase {
  tripID: string;
  startTime: string;
  endTime: string;
  headwaySecs: number;

  constructor(rowText: string = '') {
    super('frequencies.txt', new Date());
    const [
      trip_id,
      start_time,
      end_time,
      headway_secs,
      ..._overflow
    ] = `${rowText},,,`.split(',').map(x => `${x}`.trim());
    this.tripID = trip_id;
    this.startTime = GTBase.formatTime(start_time);
    this.endTime = GTBase.formatTime(end_time);
    this.headwaySecs = GTBase.formatInt(headway_secs);
    this.overflow = _overflow;
  }
}
