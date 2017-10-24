"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ini_1 = require("ini");
var MagicDatabaseInfo = /** @class */ (function () {
    function MagicDatabaseInfo(config, key) {
        this.config = config;
        this.key = key;
        this.raw = (config.ini.MAGIC_DATABASES[key] || "").split(",");
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
    MagicDatabaseInfo.prototype.get = function (index) {
        return this.config.translate(this.raw[index] || "").trim();
    };
    MagicDatabaseInfo.prototype.getInt = function (index) {
        return Number(this.get(index));
    };
    return MagicDatabaseInfo;
}());
exports.MagicDatabaseInfo = MagicDatabaseInfo;
var MagicDBMS = /** @class */ (function () {
    function MagicDBMS(magicDatabaseInfo) {
        this.magicDatabaseInfo = magicDatabaseInfo;
    }
    MagicDBMS.getInstance = function (data, databaseName) {
        var info;
        if (databaseName !== undefined && data instanceof ini_1.MagicIni) {
            info = new MagicDatabaseInfo(data, databaseName);
        }
        else {
            info = data;
        }
        if (info instanceof MagicDatabaseInfo) {
            if (info.dataSourceType === "DBMS") {
                switch (info.dbmsType) {
                    case 14: return new DBMSOracle(info);
                    case 21: return new DBMSMicrosoftSQLServer(info);
                    default: return null;
                }
            }
        }
    };
    return MagicDBMS;
}());
exports.MagicDBMS = MagicDBMS;
var DBMSOracle = /** @class */ (function (_super) {
    __extends(DBMSOracle, _super);
    function DBMSOracle(magicDatabaseInfo) {
        var _this = _super.call(this, magicDatabaseInfo) || this;
        _this.oracledb = require("oracledb");
        return _this;
    }
    DBMSOracle.prototype.connect = function (callback) {
        var self = this;
        var dbConfig = {
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
    };
    DBMSOracle.prototype.query = function (sql, args, callback) {
        if (!this.connection) {
            callback(new Error('Not connected'));
            return;
        }
        this.connection.execute(sql, args, { outFormat: this.oracledb.OBJECT }, function (err2, result) {
            if (err2) {
                callback(err2);
                return;
            }
            if (callback) {
                if (result.rows.length > 0) {
                    for (var i = 0; i < result.rows.length; i++) {
                        callback(null, result.rows[i], result.rows.length);
                    }
                }
            }
        });
    };
    return DBMSOracle;
}(MagicDBMS));
exports.DBMSOracle = DBMSOracle;
var DBMSMicrosoftSQLServer = /** @class */ (function (_super) {
    __extends(DBMSMicrosoftSQLServer, _super);
    function DBMSMicrosoftSQLServer(magicDatabaseInfo) {
        var _this = _super.call(this, magicDatabaseInfo) || this;
        _this.tedious = require("tedious");
        return _this;
    }
    DBMSMicrosoftSQLServer.prototype.getSqlParameters = function (source) {
        var result = [];
        var pat = /@.+?(\W|$)/g;
        var mat = pat.exec(source);
        while (mat != null) {
            var param = mat[0];
            var paramName = param.substring(1, mat[0].length);
            if (!(result.indexOf(paramName) > -1)) {
                result.push(paramName);
            }
            mat = pat.exec(source);
        }
        return result;
    };
    DBMSMicrosoftSQLServer.prototype.connect = function (callback) {
        var config = {
            userName: this.magicDatabaseInfo.userName,
            password: this.magicDatabaseInfo.password,
            server: this.magicDatabaseInfo.server,
            options: {
                rowCollectionOnRequestCompletion: true,
                database: this.magicDatabaseInfo.database
            }
        };
        this.connection = new this.tedious.Connection(config);
        this.connection.on('connect', callback);
    };
    DBMSMicrosoftSQLServer.prototype.query = function (sql, args, callback) {
        var _this = this;
        var params = this.getSqlParameters(sql);
        var request = new this.tedious.Request(sql, function (err, rowCount, rows) {
            if (err) {
                callback(err);
            }
            else {
                var data = void 0;
                var _loop_1 = function () {
                    data = rows[rowIndex];
                    var obj = {};
                    data.forEach(function (column) {
                        obj[column.metadata.colName] = column.value;
                    });
                    callback(null, obj, rowCount);
                };
                for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
                    _loop_1();
                }
            }
        });
        params.forEach(function (value, index) {
            request.addParameter(params[index], _this.tedious.TYPES.VarChar, args[index]);
        });
        this.connection.execSql(request);
    };
    return DBMSMicrosoftSQLServer;
}(MagicDBMS));
exports.DBMSMicrosoftSQLServer = DBMSMicrosoftSQLServer;
