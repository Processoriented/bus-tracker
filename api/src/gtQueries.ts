import { format, raw } from 'mysql';
import { ParsedQs } from 'qs';


export type SQLMade = { sql: string, page: number, rowsPerPage: number, totalSql: string };
export type SQLMaker = ((_: ParsedQs) => SQLMade);
export interface SQLClauses {
  select?: string,
  from?: string,
  where?: string,
  limit?: string,
  values?: any[],
  stringifyObjects?: boolean,
  timeZone?: string;
}

const formatFromClauses = (clauses: SQLClauses): string => {
  const select = 'SELECT * ';
  const sql = [(clauses?.select ?? select), clauses?.from, clauses?.where, clauses?.limit]
    .filter(x => typeof x === 'string').map(x => `${x}`.trim()).join(' ');
  const { values, stringifyObjects, timeZone } = {
    values: [],
    stringifyObjects: undefined,
    timeZone: undefined,
    ...clauses,
  };
  if (timeZone) return format(sql, values, stringifyObjects, timeZone);
  if (typeof stringifyObjects !== 'undefined') return format(sql, values, stringifyObjects);
  if (Array.isArray(values) && values.length) return format(sql, values);
  return raw(sql).toSqlString();
}

const CURRENT_TIMESTAMP = raw('CURRENT_TIMESTAMP()');

const mkValsArr = (qp: string|ParsedQs|string[]|ParsedQs[]|undefined) => (!qp ? [] : (
  Array.isArray(qp) ? qp : `${qp}`.split(',').map(x => x.trim())
));

const parseLimitParams: SQLMaker = (qs) => {
  const [page, rowsPerPage] = [qs?.page, qs?.rowsPerPage]
    .map(val => typeof val === 'string' ? parseInt(val, 10) : 0);
  const offset = rowsPerPage > 0 ? (page * rowsPerPage) : 0;
  const offsetText = offset > 0 ? `${offset}, ` : '';
  const sql = rowsPerPage === 0 ? '' : `LIMIT ${offsetText}${rowsPerPage}`;
  return { sql, page, rowsPerPage, totalSql: '' };
};

const totalSelect = 'SELECT COUNT(*) AS TOTAL_ROWS ';

const agency: SQLMaker = (qs) => {
  const from = 'FROM `agency` ';
  const { sql: limit, page, rowsPerPage } = parseLimitParams(qs);
  const sql = formatFromClauses({ from, limit });
  const totalSql = formatFromClauses({ select: totalSelect, from });
  return { sql, page, rowsPerPage, totalSql };
};

const calendar: SQLMaker = (qs) => {
  const from = 'FROM `calendar`';
  const where = 'WHERE start_date < ? AND end_date > ?';
  const values = [CURRENT_TIMESTAMP, CURRENT_TIMESTAMP];
  const { sql: limit, page, rowsPerPage } = parseLimitParams(qs);
  const sql = formatFromClauses({ from, where, limit, values });
  const totalSql = formatFromClauses({ select: totalSelect, from, where, values });
  return { sql, page, rowsPerPage, totalSql };
};

const mkQuestMarks = (num: number) => Array(num).fill('?').join(', ');

const calendardates: SQLMaker = (qs) => {
  const from = 'FROM `calendar_dates`';
  const idVals = mkValsArr(qs?.service);
  const whereD = `WHERE date > ?`;
  const where = (idVals.length) ? `${whereD} AND service_id in (${mkQuestMarks(idVals.length)})` : whereD;
  const values = [CURRENT_TIMESTAMP, ...idVals];
  const { sql: limit, page, rowsPerPage } = parseLimitParams(qs);
  const sql = formatFromClauses({ from, where, limit, values });
  const totalSql = formatFromClauses({ select: totalSelect, where, values });
  return { sql, page, rowsPerPage, totalSql };
};

const routes: SQLMaker = (qs) => {
  const from = 'FROM `routes`';
  const values = !qs?.route ? [] : Array.isArray(qs.route) ? qs.route : `${qs.route}`.split(',');
  const where = values.length ? `WHERE route_id IN (${mkQuestMarks(values.length)})` : undefined;
  const { sql: limit, page, rowsPerPage } = parseLimitParams(qs);
  const sql = formatFromClauses({ from, where, limit, values });
  const totalSql = formatFromClauses({ select: totalSelect, from, where, values });
  return { sql, page, rowsPerPage, totalSql };
};

const unknown: SQLMaker = (qs) => {
  const sql = 'SELECT "Unknown Resource" AS resp';
  const { page, rowsPerPage } = parseLimitParams(qs);
  const totalSql = 'SELECT 0 AS TOTAL_ROWS';
  return { sql, page, rowsPerPage, totalSql };
}

const force: SQLMaker = (qs) => {
  const from = 'FROM `routes`';
  const values = !qs?.route ? [] : Array.isArray(qs.route) ? qs.route : `${qs.route}`.split(',');
  const where = values.length ? `WHERE route_id IN (${mkQuestMarks(values.length)})` : undefined;
  const { sql: limit, page, rowsPerPage } = parseLimitParams(qs);
  const sql = formatFromClauses({ from, where, limit, values });
  const totalSql = formatFromClauses({ select: totalSelect, from, where, values });
  return { sql, page, rowsPerPage, totalSql };
};

const inBoundsSubQuery = () => {
  const select = 'SELECT DISTINCT b.shape_id';
  const from = 'FROM `shapes` b';
  const checks = ['lat', 'lon']
    .map(d => `b.shape_pt_${d}`)
    .map(f => ([`${f} < ?`, `${f} > ?`]))
    .flat(1)
    .join(' AND ');
  const where = `WHERE ${checks}`;
  return formatFromClauses({ select, from, where });
};

const shapes: SQLMaker = (qs) => {
  const values = [qs?.maxLat, qs?.minLat, qs?.maxLng, qs?.minLng];
  if (!values.every(val => !!val)) throw new Error('Missing params');
  const from = 'FROM `shapes`';
  const where = `WHERE shape_id IN (${inBoundsSubQuery()})`;
  const { sql: limit, page, rowsPerPage } = parseLimitParams(qs);
  const sql = formatFromClauses({ from, where, limit, values });
  const totalSql = formatFromClauses({ select: totalSelect, from, where, values });
  return { sql, page, rowsPerPage, totalSql };
};

const stops: SQLMaker = (qs) => {
  const values = [qs?.minLat, qs?.maxLat, qs?.minLng, qs?.maxLng];
  if (!values.every(val => !!val)) throw new Error('Missing params');
  const from = 'FROM `stops`';
  const where = 'WHERE stop_lat BETWEEN ? AND ? AND stop_lon BETWEEN ? AND ?';
  const { sql: limit, page, rowsPerPage } = parseLimitParams(qs);
  const sql = formatFromClauses({ from, where, limit, values });
  const totalSql = formatFromClauses({ select: totalSelect, from, where, values });
  return { sql, page, rowsPerPage, totalSql };
};

export type SQLDict = { [key: string]: SQLMaker };

export const resourceToSQLQuery: SQLDict = {
  agency,
  calendar,
  calendardates,
  force,
  routes,
  shapes,
  stops,
  unknown,
};
