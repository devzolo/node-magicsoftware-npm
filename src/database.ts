/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/interface-name-prefix */
import { MagicIni } from './ini';

export class MagicDatabaseInfo {
  private raw: Array<string>;
  public dataSourceType: string;
  public dbmsType: number;
  public database: string;
  public server: string;
  public userName: string;
  public password: string;
  public connectString: string;
  private nop: string;

  private get(index: number): string {
    return this.config.translate(this.raw[index] || '').trim();
  }

  private getInt(index: number): number {
    return Number(this.get(index));
  }

  public constructor(public config: MagicIni, public key: string) {
    this.raw = (config.ini.MAGIC_DATABASES[key] || '').split(',');
    this.dataSourceType = this.get(0);
    this.dbmsType = this.getInt(1);
    this.database = this.get(2);
    this.nop = this.get(3);
    this.server = this.get(4);
    this.nop = this.get(5);
    this.userName = this.get(6);
    this.password = this.get(7);
    this.nop = this.get(8);
    this.nop = this.get(9);
    this.nop = this.get(10);
    this.nop = this.get(11);
    this.nop = this.get(12);
    this.nop = this.get(13);
    this.nop = this.get(14);
    this.nop = this.get(15);
    this.nop = this.get(16);
    this.connectString = this.get(17);
  }
}

export interface IMagicDBMS {
  connect(callback: (err?: any) => void);
  query(sql: string, args: Array<any>, callback: (err?: any, rec?: any, size?: number) => any);
}

export abstract class MagicDBMS implements IMagicDBMS {
  abstract connect(callback: (err?: any) => void);
  abstract query(sql: string, args: Array<any>, callback: (err?: any, rec?: any, size?: number) => any);

  public constructor(public magicDatabaseInfo: MagicDatabaseInfo) {}

  public static getInstance(data: any, databaseName?: string) {
    let info: any;

    if (databaseName !== undefined && data instanceof MagicIni) {
      info = new MagicDatabaseInfo(data, databaseName);
    } else {
      info = data;
    }

    if (info instanceof MagicDatabaseInfo) {
      if (info.dataSourceType === 'DBMS') {
        switch (info.dbmsType) {
          case 14:
            return new DBMSOracle(info);
          case 21:
            return new DBMSMicrosoftSQLServer(info);
          default:
            return null;
        }
      }
    }
  }
}

export class DBMSOracle extends MagicDBMS {
  private connection: any;
  private oracledb: any;
  private pool: any;

  public constructor(magicDatabaseInfo: MagicDatabaseInfo) {
    super(magicDatabaseInfo);
    this.oracledb = require('oracledb');
  }

  public connect(callback: (err?: any) => void): void {
    const dbConfig = {
      user: this.magicDatabaseInfo.userName,
      password: this.magicDatabaseInfo.password,
      connectString: this.magicDatabaseInfo.connectString || this.magicDatabaseInfo.server,
      externalAuth: false,
    };

    this.oracledb.createPool(
      {
        user: dbConfig.user,
        password: dbConfig.password,
        connectString: dbConfig.connectString,
        poolMax: 1,
        poolMin: 1,
        poolIncrement: 0,
      },
      (err, pool) => {
        this.pool = pool;
        if (err) {
          return callback(err);
        }
        this.pool.getConnection((err, connection) => {
          this.connection = connection;
          return callback(err);
        });
      },
    );
  }

  public query(sql: string, args: Array<any>, callback: (err?: any, rec?: any, size?: number) => any) {
    if (!this.connection) {
      callback(new Error('Not connected'));
      return;
    }
    this.connection.execute(sql, args, { outFormat: this.oracledb.OBJECT }, function(err2, result) {
      if (err2) {
        callback(err2);
        return;
      }

      if (callback) {
        if (result.rows.length > 0) {
          for (let i = 0; i < result.rows.length; i++) {
            callback(null, result.rows[i], result.rows.length);
          }
        }
      }
    });
  }
}

export class DBMSMicrosoftSQLServer extends MagicDBMS {
  private connection: any;
  private tedious: any;

  public constructor(magicDatabaseInfo: MagicDatabaseInfo) {
    super(magicDatabaseInfo);
    this.tedious = require('tedious');
  }

  private getSqlParameters(source) {
    const result: Array<string> = [];
    const pat = /@.+?(\W|$)/g;
    let mat = pat.exec(source);
    while (mat != null) {
      const param = mat[0];
      const paramName = param.substring(1, mat[0].length);
      if (!(result.indexOf(paramName) > -1)) {
        result.push(paramName);
      }
      mat = pat.exec(source);
    }
    return result;
  }

  public connect(callback: (err?: any) => void) {
    const config = {
      userName: this.magicDatabaseInfo.userName,
      password: this.magicDatabaseInfo.password,
      server: this.magicDatabaseInfo.server,
      options: {
        rowCollectionOnRequestCompletion: true,
        database: this.magicDatabaseInfo.database,
      },
    };
    this.connection = new this.tedious.Connection(config);
    this.connection.on('connect', callback);
  }

  public query(sql: string, args: Array<any>, callback: (err?: any, rec?: any, size?: number) => any) {
    const params = this.getSqlParameters(sql);
    const request = new this.tedious.Request(sql, function(err, rowCount, rows) {
      if (err) {
        callback(err);
      } else {
        let data;
        for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
          data = rows[rowIndex];
          const obj = {};
          data.forEach(function(column) {
            obj[column.metadata.colName] = column.value;
          });
          callback(null, obj, rowCount);
        }
      }
    });

    params.forEach((value, index) => {
      request.addParameter(params[index], this.tedious.TYPES.VarChar, args[index]);
    });

    this.connection.execSql(request);
  }
}
