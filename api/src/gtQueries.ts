import { format, raw } from 'mysql';
import { ParsedQs } from 'qs';


export type SQLMaker = ((_: ParsedQs) => string);

const CURRENT_TIMESTAMP = raw('CURRENT_TIMESTAMP()');

const mkValsArr = (qp: string|ParsedQs|string[]|ParsedQs[]|undefined) => (!qp ? [] : (
  Array.isArray(qp) ? qp : `${qp}`.split(',').map(x => x.trim())
));

const agency: SQLMaker = (_) => 'SELECT * FROM `agency`';

const calendar: SQLMaker = (_) => {
  const base = 'SELECT * from `calendar` WHERE start_date < ? AND end_date > ?';
  return format(base, [CURRENT_TIMESTAMP, CURRENT_TIMESTAMP]);
};

const calendardates: SQLMaker = (qs) => {
  const values = mkValsArr(qs?.service);
  const base = 'SELECT * from `calendar_dates` WHERE date > ?';
  if (!values.length) return format(base, [CURRENT_TIMESTAMP]);
  const questionMarks = Array(values.length).fill('?').join(', ');
  return format(`${base} AND service_id in (${questionMarks})`, [CURRENT_TIMESTAMP, ...values]);
};

const routes: SQLMaker = (qs) => {
  const values = !qs?.route ? [] : Array.isArray(qs.route) ? qs.route : `${qs.route}`.split(',');
  const base = 'SELECT * FROM `routes`';
  if (!values.length) return base;
  const questionMarks = Array(values.length).fill('?').join(', ');
  return format(`${base} WHERE route_id IN (${questionMarks})`, values);
};

const unknown: SQLMaker = (_) => 'SELECT "Unknown Resource" AS resp';

export type SQLDict = { [key: string]: SQLMaker };

export const resourceToSQLQuery: SQLDict = { agency, calendar, calendardates, routes, unknown };
