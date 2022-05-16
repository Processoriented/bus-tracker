import { config } from 'dotenv';
import { RequestHandler } from 'express';
import { camelCase } from 'lodash';
import { ConnectionConfig, createConnection } from 'mysql';
import { resourceToSQLQuery } from './gtQueries';


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

export const getGTData: RequestHandler = (req, res, next) => {
  const resource: string = req.params?.resource ?? 'unknown';
  const params = req.query;
  const sql = resourceToSQLQuery[resource](params);

  connection.query(sql, (err, rows, fields) => {
    if (err) return next(sql);
    const data = rows.map((row: any) => Object.entries(row).reduce(
      (p, [k, v]) => ({ ...p, [camelCase(k)]: v }), {}));
    res.status(200).send({ sql, data });
  });
};
