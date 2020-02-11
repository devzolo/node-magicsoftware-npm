"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sql_database_1 = require("sql-database");
class DBMSMicrosoftSQLServer extends _1.MagicDBMS {
    constructor(magicDatabaseInfo) {
        super(magicDatabaseInfo);
        this.db = new sql_database_1.MSSQLDatabase();
        //this.tedious = require("tedious");
    }
    connect(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            this.db.setUser(this.magicDatabaseInfo.userName);
            this.db.setPassword(this.magicDatabaseInfo.password);
            this.db.setServer(this.magicDatabaseInfo.server);
            this.db.setDatabase(this.magicDatabaseInfo.database);
            yield this.db.init();
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
        });
    }
    query(sql, args, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                //let resultRs = null;
                this.db.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof sql === 'object')
                        sql = sql.MSSQL;
                    sql = this.magicDatabaseInfo.config.translate(sql);
                    sql = sql.replace(/:/g, '@');
                    yield t.executeSql(sql, args, (t, rs) => __awaiter(this, void 0, void 0, function* () {
                        yield callback(null, rs);
                        resolve(rs);
                        //resultRs = rs;
                    }), (t, e) => __awaiter(this, void 0, void 0, function* () {
                        yield callback(e, null);
                        reject(e);
                    }));
                }), e => {
                    console.error('MSSQL tx ERR', e);
                    reject(e);
                }, () => {
                    console.log('MSSQL tx END');
                    //resolve(resultRs);
                });
            });
        });
    }
}
exports.DBMSMicrosoftSQLServer = DBMSMicrosoftSQLServer;
//# sourceMappingURL=DBMSMicrosoftSQLServer.js.map