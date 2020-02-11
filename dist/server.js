"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requester_1 = require("./requester");
class MagicServerInfo {
    constructor(config, key) {
        this.config = config;
        this.key = key;
        this.raw = (config.get('MAGIC_SERVERS', key) || '').split(',');
        this.serverType = this.get(0);
        this.serverAddress = this.get(1);
        this.username = this.get(2);
        this.password = this.get(3);
        this.timeout = this.getInt(4);
        this.alternateServer = this.get(5);
        this.communicationManager = this.get(6);
    }
    get(index) {
        return this.config.translate(this.raw[index] || '').trim();
    }
    getInt(index) {
        return Number(this.get(index));
    }
}
class MagicServer {
    constructor(magicServerInfo) {
        this.magicServerInfo = magicServerInfo;
        this.requester = new requester_1.MagicRequester(magicServerInfo.serverAddress);
    }
    static getInstance(config, serverName = '') {
        if (!serverName) {
            serverName = config.get('MAGIC_ENV', 'MessagingServer');
        }
        const server = new MagicServer(new MagicServerInfo(config, serverName));
        return server;
    }
    get requester() {
        return this._requester;
    }
    set requester(value) {
        this._requester = value;
    }
}
exports.MagicServer = MagicServer;
//# sourceMappingURL=server.js.map