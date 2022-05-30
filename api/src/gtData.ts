import { config } from 'dotenv';
import { ErrorRequestHandler, RequestHandler } from 'express';
import { camelCase } from 'lodash';
import { ConnectionConfig, createConnection } from 'mysql';
import { resourceToSQLQuery } from './gtQueries';
import { NotFoundError, SQLError } from './util/appErrors';


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

export const gtDataErrorHandler: ErrorRequestHandler = (err, _, res, next) => {
  if (err instanceof NotFoundError) {
    res.status(404).send({ error: err.message });
    return;
  } else if (err instanceof SQLError) {
    res.status(500).send({ error: err?.message ?? err.code, sql: err?.sql });
    return;
  } else {
    return next(err);
  }
};

export const getGTData: RequestHandler = (req, res, next) => {
  const resource: string = req.params?.resource;
  if (!Object.keys(resourceToSQLQuery).includes(resource)) {
    const error = new NotFoundError(`No Resource available named '${resource}'.`);
    return gtDataErrorHandler(error, req, res, next);
  }
  const params = req.query;
  const resourceToSqlFn = resourceToSQLQuery[resource] ?? resourceToSQLQuery.unknown;
  const { sql, page, rowsPerPage, totalSql } = resourceToSqlFn(params);

  connection.query(sql, (err, rows, _fields) => {
    if (err) return gtDataErrorHandler(new SQLError(err), req, res, next);
    const data = rows.map((row: any) => Object.entries(row).reduce(
      (p, [k, v]) => ({ ...p, [camelCase(k)]: v }), {}));
    connection.query(totalSql, (err, rows, _fields) => {
      if (err) return gtDataErrorHandler(new SQLError(err), req, res, next);
      const base = { sql, page, rowsPerPage };
      const payload = Array.isArray(rows) && rows.length ? Object.entries(rows[0])
        .reduce((p, [k, v]) => ({ ...p, [camelCase(k)]: v}), base) : base;
      res.status(200).send({ ...payload, data });
    });
  });
};
