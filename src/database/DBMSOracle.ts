import { MagicDBMS, MagicDatabaseInfo, DBMSQuery } from '.';
import { OracleDatabase, OracleResultSet, OracleTransaction } from 'sql-database';

export class DBMSOracle extends MagicDBMS {
  private connection: any;
  private oracledb: any;
  private pool: any;
  private db: OracleDatabase;

  public constructor(magicDatabaseInfo: MagicDatabaseInfo) {
    super(magicDatabaseInfo);
    this.db = new OracleDatabase();
    //this.oracledb = require("oracledb");
  }

  public async connect(callback: (err?: any) => void) {
    this.db.setUser(this.magicDatabaseInfo.userName);
    this.db.setPassword(this.magicDatabaseInfo.password);
    this.db.setServer(this.magicDatabaseInfo.server);
    this.db.setDatabase(this.magicDatabaseInfo.database);
    this.db.setConnectString(this.magicDatabaseInfo.connectString || this.magicDatabaseInfo.server);
    await this.db.init();
    this.db.connect(callback);

    /*
        let dbConfig = {
            user: this.magicDatabaseInfo.userName,
            password: this.magicDatabaseInfo.password,
            connectString: this.magicDatabaseInfo.connectString || this.magicDatabaseInfo.server,
            externalAuth: false
        };

        this.oracledb.createPool({
            user: dbConfig.user,
            password: dbConfig.password,
            connectString: dbConfig.connectString,
            poolMax: 1,
            poolMin: 1,
            poolIncrement: 0
        }, function (err, pool) {
            self.pool = pool;
            if (err) {
                return callback(err);
            }
            self.pool.getConnection(function (err, connection) {
                self.connection = connection;
                return callback(err);
            });
        });
        */
  }

  public async query(sql: string | DBMSQuery, args: Array<any>, callback: (err?: any, rs?) => any) {
    return new Promise((resolve, reject) => {
      //let resultRs = null;
      this.db.transaction(
        async t => {
          if (typeof sql === 'object') sql = sql.ORACLE as string;

          sql = this.magicDatabaseInfo.config.translate(sql);

          await t.executeSql(
            sql,
            args,
            async (t, rs) => {
              if (callback) {
                await callback(null, rs);
              }
              resolve(rs);
              //resultRs = rs;
            },
            async (t, e) => {
              if (callback) {
                await callback(e, null);
              }
              reject(e);
            },
          );
        },
        e => {
          //console.error("Oracle tx ERR", e);
          reject(e);
        },
        () => {
          //console.log("Oracle tx END");
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
                    sql = sql.ORACLE;
                sql = this.magicDatabaseInfo.config.translate(sql);
            }

            if (!this.connection) {
                reject(new Error('Not connected'));
                return;
            }

            if(!args) {
                args = [];
            }

            this.connection.execute(sql, args, { autoCommit: true, outFormat: this.oracledb.OBJECT }, async function (err2, result) {
                if (err2) {
                    reject(err2);
                    return;
                }

                if (callback) {
                    if (result.rows) {
                        if (result.rows.length > 0) {
                            for (var i = 0; i < result.rows.length; i++) {
                                await callback(null, { row: result.rows[i], size: result.rows.length });
                            }
                        }
                    }
                    else {
                        callback(null, { rowsAffected: result.rowsAffected });
                    }
                }
                resolve({ size: result.rows && result.rows.length || 0, rowsAffected: result.rowsAffected || 0 });
            });
        });
    }


    public execute(sql: string, args: Array<any>, callback: (err?: any, rec?: any, size?: number) => any): Promise<any> {

          return new Promise((resolve, reject) => {

            if (this.magicDatabaseInfo && this.magicDatabaseInfo.config) {
                sql = this.magicDatabaseInfo.config.translate(sql);
            }

            if (!this.connection) {
                reject(new Error('Not connected'));
                return;
            }

            this.connection.execute(sql, args, { autoCommit: true }, async function (err2, result) {
                if (err2) {
                    reject(err2);
                    return;
                }

                if (callback) {
                    callback(null, { rowsAffected: result.rowsAffected });
                }

                resolve({ rowsAffected: result.rowsAffected || 0 });
            });
        });
    }
    */
}
