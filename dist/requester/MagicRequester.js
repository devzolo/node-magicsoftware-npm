"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const _1 = require(".");
class MagicRequester {
    constructor(address) {
        this.disposed = false;
        this.requests = new Array();
        this.address = address;
        this.impl = MagicRequester.requester.createRequestsFactory({ address: this.address }, true);
        MagicRequester.cleanupHook(() => {
            this.dispose();
        });
    }
    static cleanupHook(callback) {
        process.on('exit', () => {
            try {
                callback();
            }
            catch (e) { }
        });
        // catch ctrl+c event and exit normally
        // process.on('SIGINT', () => {
        //    process.exit(2);
        // });
        // catch uncaught exceptions, trace, then exit normally
        // process.on('uncaughtException', (e) => {
        //  process.exit(99);
        // });
    }
    dispose() {
        var _a;
        if (!this.disposed) {
            while (this.requests.length) {
                const request = this.requests.shift();
                (_a = request) === null || _a === void 0 ? void 0 : _a.dispose();
            }
            this.impl.dispose();
            this.disposed = true;
        }
    }
    getSyncRequest(application, program) {
        const request = new _1.SyncRequest(this.impl.getSyncMGRequest({ application: application, program: program }, true));
        this.requests.push(request);
        return request;
    }
}
exports.MagicRequester = MagicRequester;
MagicRequester.requester = new _1.MgRequester(null, true);
//# sourceMappingURL=MagicRequester.js.map