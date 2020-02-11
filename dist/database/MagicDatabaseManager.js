"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class MagicDatabaseManager {
    constructor(config) {
        this.config = config;
        this.databases = {};
        return new Proxy({}, this);
    }
    get(target, p, _receiver) {
        const key = p.toString();
        if (!this.databases[key]) {
            if (this.config.ini.MAGIC_DATABASES[key]) {
                this.databases[key] = _1.MagicDBMS.getInstance(this.config, p.toString());
                if (!this.databases[key]) {
                    throw new Error('DBMS not implemented.');
                }
            }
            else {
                throw new Error(`Database ${key} not in MAGIC_DATABASES.`);
            }
        }
        return this.databases[key];
    }
}
exports.MagicDatabaseManager = MagicDatabaseManager;
//# sourceMappingURL=MagicDatabaseManager.js.map