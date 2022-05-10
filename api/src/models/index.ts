import { Agency, Calendar, CalendarDates, Frequencies, Route, Shape, StopTime } from './googleTransit';

export * from './ctaModels';
export * from './googleTransit';

export const FILE_MODEL_MAP = new Map<string, ((row: string) => any)>()
  .set('agency.txt', (row: string) => new Agency(row).toPlain())
  .set('calendar_dates.txt', (row: string) => new CalendarDates(row).toPlain())
  .set('calendar.txt', (row: string) => new Calendar(row).toPlain())
  .set('frequencies.txt', (row: string) => new Frequencies(row).toPlain())
  .set('routes.txt', (row: string) => new Route(row).toPlain())
  .set('shapes.txt', (row: string) => new Shape(row).toPlain())
  .set('stop_times.txt', (row: string) => new StopTime(row).toPlain());
