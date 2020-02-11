"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MagicDatabaseInfo {
    constructor(config, key) {
        this.config = config;
        this.key = key;
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
    get(index) {
        return this.config.translate(this.raw[index] || '').trim();
    }
    getInt(index) {
        return Number(this.get(index));
    }
}
exports.MagicDatabaseInfo = MagicDatabaseInfo;
//# sourceMappingURL=MagicDatabaseInfo.js.map