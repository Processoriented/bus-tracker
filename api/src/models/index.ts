import { Agency, Calendar, CalendarDates, Frequencies } from './googleTransit';

export * from './ctaModels';
export * from './googleTransit';

export const FILE_MODEL_MAP = new Map<string, ((row: string) => any)>()
  .set('agency.txt', (row: string) => new Agency(row).toPlain())
  .set('calendar_dates.txt', (row: string) => new CalendarDates(row).toPlain())
  .set('calendar.txt', (row: string) => new Calendar(row).toPlain())
  .set('frequencies.txt', (row: string) => new Frequencies(row).toPlain());
