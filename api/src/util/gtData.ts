import { config } from 'dotenv';
import { RequestHandler } from 'express';
import { ConnectionConfig, createConnection, format } from 'mysql';


const raw = { host: '', port: '', user: '', password: '', database: '' };

const mkConfig = (): ConnectionConfig => {
  config();
  raw.host = process.env.ARGUS_HOST ?? '';
  raw.port = process.env.ARGUS_PORT ?? '';
  raw.user = process.env.ARGUS_USER ?? '';
  raw.password = process.env.ARGUS_PW ?? '';
  raw.database = process.env.ARGUS_DB ?? '';

  const pattNum = /^(\d+?)$/;
  const port: number = pattNum.test(raw.port) ? parseInt(raw.port) : 31129;
  return { ...raw, port } as ConnectionConfig;
};

export const connection = createConnection(mkConfig());

const resourceToSQLQuery: { [key: string]: ((qs: any) => string) } = {
  agency: (() => 'SELECT * FROM `agency`'),
  routes: ((qs) => {
    const values = !qs?.route ? [] : Array.isArray(qs.route) ? qs.route : `${qs.route}`.split(',');
    const base = 'SELECT * FROM `routes`';
    if (!values.length) return base;
    const questionMarks = Array(values.length).fill('?').join(', ');
    return format(`${base} WHERE route_id IN (${questionMarks})`, values);
    }),
  unknown: (() => 'SELECT "Unknown Resource" AS resp'),
};

export const getGTData: RequestHandler = (req, res, next) => {
  const resource: string = req.params?.resource ?? 'unknown';
  const params = req.query;
  const sql = resourceToSQLQuery[resource](params);

  connection.query(sql, (err, rows, fields) => {
    if (err) return next(err);
    res.status(200).send({ sql, rows, fields });
  });
};
