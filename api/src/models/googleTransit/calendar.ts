import { GTBase } from './base';


export class Calendar extends GTBase {
  serviceID: number;
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
  startDate: Date;
  endDate: Date;

  constructor(rowText: string = '') {
    super('calendar.txt', new Date());
    const [
      service_id,
      _monday,
      _tuesday,
      _wednesday,
      _thursday,
      _friday,
      _saturday,
      _sunday,
      start_date,
      end_date,
      ..._overflow
    ] = `${rowText},,,,,,,,,`.split(',').map(x => `${x}`.trim());
    this.serviceID = GTBase.formatInt(service_id);
    this.monday = GTBase.formatInt(_monday);
    this.tuesday = GTBase.formatInt(_tuesday);
    this.wednesday = GTBase.formatInt(_wednesday);
    this.thursday = GTBase.formatInt(_thursday);
    this.friday = GTBase.formatInt(_friday);
    this.saturday = GTBase.formatInt(_saturday);
    this.sunday = GTBase.formatInt(_sunday);
    this.startDate = GTBase.formatDate(start_date);
    this.endDate = GTBase.formatDate(end_date);
    this.overflow = _overflow;
  }
}
