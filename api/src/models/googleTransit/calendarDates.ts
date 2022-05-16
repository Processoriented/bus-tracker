import { GTBase } from './base';


export class CalendarDates extends GTBase {
  serviceID: number;
  date: Date;
  exceptionType: number;

  constructor(rowText: string = '') {
    super('calendar_dates.txt', new Date());
    const [
      service_id,
      _date,
      exception_type,
      ..._overflow
    ] = `${rowText},,`.split(',').map(x => `${x}`.trim());
    this.serviceID = GTBase.formatInt(service_id);
    this.date = GTBase.formatDate(_date);
    this.exceptionType = GTBase.formatInt(exception_type);
    this.overflow = _overflow;
  }
}
