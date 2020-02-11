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
class DBMSOracle extends _1.MagicDBMS {
    constructor(magicDatabaseInfo) {
        super(magicDatabaseInfo);
        this.db = new sql_database_1.OracleDatabase();
        //this.oracledb = require("oracledb");
    }
    connect(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            this.db.setUser(this.magicDatabaseInfo.userName);
            this.db.setPassword(this.magicDatabaseInfo.password);
            this.db.setServer(this.magicDatabaseInfo.server);
            this.db.setDatabase(this.magicDatabaseInfo.database);
            this.db.setConnectString(this.magicDatabaseInfo.connectString || this.magicDatabaseInfo.server);
            yield this.db.init();
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
        });
    }
    query(sql, args, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                //let resultRs = null;
                this.db.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof sql === 'object')
                        sql = sql.ORACLE;
                    sql = this.magicDatabaseInfo.config.translate(sql);
                    yield t.executeSql(sql, args, (t, rs) => __awaiter(this, void 0, void 0, function* () {
                        if (callback) {
                            yield callback(null, rs);
                        }
                        resolve(rs);
                        //resultRs = rs;
                    }), (t, e) => __awaiter(this, void 0, void 0, function* () {
                        if (callback) {
                            yield callback(e, null);
                        }
                        reject(e);
                    }));
                }), e => {
                    //console.error("Oracle tx ERR", e);
                    reject(e);
                }, () => {
                    //console.log("Oracle tx END");
                    //resolve(resultRs);
                });
            });
        });
    }
}
exports.DBMSOracle = DBMSOracle;
//# sourceMappingURL=DBMSOracle.js.map