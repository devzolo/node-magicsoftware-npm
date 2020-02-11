import { MagicDBMS, MagicDatabaseInfo, DBMSQuery } from '.';
import { MSSQLDatabase, MSSQLResultSet, MSSQLTransaction } from 'sql-database';

export class DBMSMicrosoftSQLServer extends MagicDBMS {
  private connection: any;
  private tedious: any;
  private db: MSSQLDatabase;

  public constructor(magicDatabaseInfo: MagicDatabaseInfo) {
    super(magicDatabaseInfo);
    this.db = new MSSQLDatabase();
    //this.tedious = require("tedious");
  }

  public async connect(callback: (err?: any) => void) {
    this.db.setUser(this.magicDatabaseInfo.userName);
    this.db.setPassword(this.magicDatabaseInfo.password);
    this.db.setServer(this.magicDatabaseInfo.server);
    this.db.setDatabase(this.magicDatabaseInfo.database);
    await this.db.init();
    this.db.connect(callback);
    /*
        let config = {
            userName: this.magicDatabaseInfo.userName,
            password: this.magicDatabaseInfo.password,
            server: this.magicDatabaseInfo.server,
            options: {
                rowCollectionOnRequestCompletion: true,
                database: this.magicDatabaseInfo.database,
                encrypt: false
            }
        }
        this.connection = new this.tedious.Connection(config);
        this.connection.on('connect', callback);

*/
  }

  public async query(sql: string | DBMSQuery, args: Array<any>, callback: (err?: any, rs?) => any) {
    return new Promise((resolve, reject) => {
      //let resultRs = null;
      this.db.transaction(
        async t => {
          if (typeof sql === 'object') sql = sql.MSSQL as string;

          sql = this.magicDatabaseInfo.config.translate(sql);

          sql = sql.replace(/:/g, '@');

          await t.executeSql(
            sql,
            args,
            async (t, rs) => {
              await callback(null, rs);
              resolve(rs);
              //resultRs = rs;
            },
            async (t, e) => {
              await callback(e, null);
              reject(e);
            },
          );
        },
        e => {
          console.error('MSSQL tx ERR', e);
          reject(e);
        },
        () => {
          console.log('MSSQL tx END');
          //resolve(resultRs);
        },
      );
    });
  }

  /*
    public query(sql: string|DBMSQuery, args: Array<any>, callback: (err?: any, rec?: any, size?: number) => any): Promise<any> {
        return new Promise((resolve, reject) => {

            if (this.magicDatabaseInfo && this.magicDatabaseInfo.config) {
                if(typeof(sql) === "object")
                    sql = sql.MSSQL;
                sql = this.magicDatabaseInfo.config.translate(sql);
                sql = sql.replace(/:/g, "@");
            }

            let params = this.getSqlParameters(sql);
            let request = new this.tedious.Request(sql, function (err, rowCount, rows) {
                if (err) {
                    reject(err);
                } else {
                    try {
                        let data;
                        for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
                            data = rows[rowIndex];
                            let obj = {};
                            if (data) {
                                data.forEach(function (column) {
                                    obj[column.metadata.colName] = column.value;
                                });
                            }
                            callback(null, { row: obj, size: rowCount });
                        }

                        resolve({ size: rowCount });
                    }
                    catch (e) {
                        reject(e);
                    }
                }
            });

            params.forEach((value, index) => {
                console.log(params[index], " = ", args[index]);
                request.addParameter(params[index], this.tedious.TYPES.VarChar, args[index]);
            });

            this.connection.execSql(request);
        });
    }
    */
}
