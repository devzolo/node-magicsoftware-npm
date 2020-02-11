"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const __1 = require("..");
class MagicDBMS {
    constructor(magicDatabaseInfo) {
        this.magicDatabaseInfo = magicDatabaseInfo;
    }
    static getInstance(data, databaseName) {
        let info;
        if (databaseName !== undefined && data instanceof __1.MagicIni) {
            info = new _1.MagicDatabaseInfo(data, databaseName);
        }
        else {
            info = data;
        }
        if (info instanceof _1.MagicDatabaseInfo) {
            if (info.dataSourceType === 'DBMS') {
                switch (info.dbmsType) {
                    case 0:
                        return null; //XML
                    case 1:
                        return null; //Btrieve
                    case 2:
                        return null; //Pervasive
                    case 3:
                        return null; //
                    case 4:
                        return null; //MySQL
                    case 5:
                        return null; //
                    case 6:
                        return null; //
                    case 7:
                        return null; //DB2/400
                    case 8:
                        return null; //
                    case 9:
                        return null; //
                    case 10:
                        return null; //SQLite
                    case 11:
                        return null; //Local
                    case 12:
                        return null; //
                    case 13:
                        return null; //
                    case 14:
                        return new _1.DBMSOracle(info); //Oracle
                    case 15:
                        return null; //
                    case 16:
                        return null; //
                    case 17:
                        return null; //AS400
                    case 18:
                        return null; //
                    case 19:
                        return null; //DB2
                    case 20:
                        return null; //ODBC
                    case 21:
                        return new _1.DBMSMicrosoftSQLServer(info); //MicrosoftSQLServer
                    case 22:
                        return null; //Memory Tables
                    default:
                        return null;
                }
            }
        }
    }
}
exports.MagicDBMS = MagicDBMS;
//# sourceMappingURL=MagicDBMS.js.map