import { MysqlError } from 'mysql';

export class NotFoundError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = 'Not Found Error';
  }
}

function instanceOfMysqlError(obj: any): obj is MysqlError { return 'sqlMessage' in obj; }
function instanceOfError(obj: any): obj is Error { return 'message' in obj; }

export class SQLError extends Error {
  code: string;
  errno: number;
  sql: string | undefined;
  sqlMessage: string | undefined;

  constructor(err: MysqlError | Error | string | undefined) {
    const dflts = { code: 'UNK_ERR', errno: -1, message: 'Unknown SQL Error' };
    let inpts: Partial<SQLError>;
    if (!err) {
      inpts = dflts;
    } else if (instanceOfMysqlError(err)) {
      inpts = { ...err, message: err?.sqlMessage ?? dflts.message };
    } else if (instanceOfError(err)) {
      inpts = { ...dflts, ...err };
    } else if (typeof err === 'string') {
      inpts = { ...dflts, message: err };
    } else {
      inpts = dflts;
    }
    super(inpts?.message ?? dflts.message);
    this.name = 'SQL Error';
    this.code = inpts?.code ?? dflts.code;
    this.errno = inpts?.errno ?? dflts.errno;
    this.sql = inpts?.sql;
    this.sqlMessage = inpts?.sqlMessage;
  }
}
