"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MagicCmdlError extends Error {
    constructor(message, code = 0, brokerHost = 'localhost', brokerPort = 5115, requestTime = '') {
        super(message);
        this.code = code;
        this.brokerHost = brokerHost;
        this.brokerPort = brokerPort;
        this.requestTime = requestTime;
    }
    getCode() {
        return this.code;
    }
    setCode(value) {
        this.code = value;
    }
    getBrokerHost() {
        return this.brokerHost;
    }
    setBrokerHost(value) {
        this.brokerHost = value;
    }
    getBrokerPort() {
        return this.brokerPort;
    }
    setBrokerPort(value) {
        this.brokerPort = value;
    }
    getRequestTime() {
        return this.requestTime;
    }
    setRequestTime(value) {
        this.requestTime = value;
    }
    toString() {
        return `${this.message} (${this.code})`;
    }
}
exports.MagicCmdlError = MagicCmdlError;
//# sourceMappingURL=MagicCmdlError.js.map