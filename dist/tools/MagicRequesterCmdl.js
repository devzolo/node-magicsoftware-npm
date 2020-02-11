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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const os = __importStar(require("os"));
const MagicCmdlError_1 = require("./MagicCmdlError");
class MagicRequesterCmdl {
    constructor(tools, host = '', password = '') {
        this.host = host;
        this.password = password;
        this.tools = tools;
    }
    setHost(host) {
        this.host = host;
    }
    setPassword(password) {
        this.password = password;
    }
    getServers() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            const cmdl = `${this.host ? '-HOST=' + this.host : ''} -QUERY=RT`;
            yield this.tools
                .rqcmdl([cmdl])
                .then(res => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
                //result = res.data;
                console.log(res.data);
                const lines = res.data.split(os.EOL);
                const serverLines = lines.slice(7);
                serverLines.pop();
                for (const line of serverLines) {
                    //console.log("line = ",line);
                    const data = line.match(/([\w\s]+)\|(?:\s+)?([\w\-\/]+)\s+([\w\-\/.]+)\s+(\w+.)\s+([\w\s]+):\s([\w\s]+\s\|[\w]+|[\w]+)\s\s([\w\s]+\s\|[\w]+|[\w\s]+)\s\s([\w\s]+\s\|[\w]+|[\w]+)\s+,\s+(\w+)\s+,\s+(\w+)\s+\|([\w\s]+)/);
                    //console.log(data);
                    if (data) {
                        const index = Number(data[1]);
                        const server = (_b = (_a = data[2]) === null || _a === void 0 ? void 0 : _a.trim(), (_b !== null && _b !== void 0 ? _b : ''));
                        const ip = (_d = (_c = data[3]) === null || _c === void 0 ? void 0 : _c.trim(), (_d !== null && _d !== void 0 ? _d : ''));
                        const pid = (_f = (_e = data[4]) === null || _e === void 0 ? void 0 : _e.trim(), (_f !== null && _f !== void 0 ? _f : ''));
                        const status = (_h = (_g = data[5]) === null || _g === void 0 ? void 0 : _g.trim(), (_h !== null && _h !== void 0 ? _h : ''));
                        const current = (_k = (_j = data[6]) === null || _j === void 0 ? void 0 : _j.trim(), (_k !== null && _k !== void 0 ? _k : ''));
                        const peak = (_m = (_l = data[7]) === null || _l === void 0 ? void 0 : _l.trim(), (_m !== null && _m !== void 0 ? _m : ''));
                        const max = (_p = (_o = data[8]) === null || _o === void 0 ? void 0 : _o.trim(), (_p !== null && _p !== void 0 ? _p : ''));
                        const contexts = (_r = (_q = data[9]) === null || _q === void 0 ? void 0 : _q.trim(), (_r !== null && _r !== void 0 ? _r : ''));
                        const requests = (_t = (_s = data[10]) === null || _s === void 0 ? void 0 : _s.trim(), (_t !== null && _t !== void 0 ? _t : ''));
                        const aplication = (_v = (_u = data[11]) === null || _u === void 0 ? void 0 : _u.trim(), (_v !== null && _v !== void 0 ? _v : ''));
                        result.push({
                            index: index,
                            aplication: aplication,
                            server: server,
                            ip: ip,
                            pid: pid,
                            status: status,
                            current: current,
                            peak: peak,
                            max: max,
                            contexts: contexts,
                            requests: requests,
                        });
                    }
                }
            })
                .catch(e => {
                const lines = e.data.split(os.EOL);
                const brokerInfo = lines[2].match(/[^\(]+\(([\s\S]+)\)/);
                const brokerHostPort = brokerInfo[1];
                const brokerHostPortData = brokerHostPort.match(/([\s\S]+)\/([\s\S]+)/);
                const brokerHost = brokerHostPortData[1];
                const brokerPort = brokerHostPortData[2];
                const errorLines = lines.slice(6);
                const error = errorLines.join(os.EOL).trim();
                const errorData = error.split('"');
                const errorMessage = errorData[1];
                const errorCode = Number(errorData[2].replace(/[^\d-]/g, ''));
                throw new MagicCmdlError_1.MagicCmdlError(errorMessage, errorCode, brokerHost, brokerPort);
            });
            return result;
        });
    }
    //[(appname)] Requests in queue
    getRequestsQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            const cmdl = `${this.host ? '-HOST=' + this.host : ''} -QUERY=QUEUE`;
            yield this.tools
                .rqcmdl([cmdl])
                .then(res => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
                //result = res.data;
                console.log(res.data);
                const lines = res.data.split(os.EOL);
                const serverLines = lines.slice(7);
                serverLines.pop();
                for (const line of serverLines) {
                    //console.log("line = ",line);
                    const data = line.match(/([\w\s]+)\|(?:\s+)?([\w\-\/]+)\s+([\w\-\/.]+)\s+(\w+.)\s+([\w\s]+):\s([\w\s]+\s\|[\w]+|[\w\s]+)\s\s([\w\s]+\s\|[\w]+|[\w\s]+)\s\s([\w\s]+\s\|[\w]+|[\w\s]+)\s+,\s+(\w+)\s+,\s+(\w+)\s+\|([\w\s]+)/);
                    //console.log(data);
                    if (data) {
                        const index = Number(data[1]);
                        const server = (_b = (_a = data[2]) === null || _a === void 0 ? void 0 : _a.trim(), (_b !== null && _b !== void 0 ? _b : ''));
                        const ip = (_d = (_c = data[3]) === null || _c === void 0 ? void 0 : _c.trim(), (_d !== null && _d !== void 0 ? _d : ''));
                        const pid = (_f = (_e = data[4]) === null || _e === void 0 ? void 0 : _e.trim(), (_f !== null && _f !== void 0 ? _f : ''));
                        const status = (_h = (_g = data[5]) === null || _g === void 0 ? void 0 : _g.trim(), (_h !== null && _h !== void 0 ? _h : ''));
                        const current = (_k = (_j = data[6]) === null || _j === void 0 ? void 0 : _j.trim(), (_k !== null && _k !== void 0 ? _k : ''));
                        const peak = (_m = (_l = data[7]) === null || _l === void 0 ? void 0 : _l.trim(), (_m !== null && _m !== void 0 ? _m : ''));
                        const max = (_p = (_o = data[8]) === null || _o === void 0 ? void 0 : _o.trim(), (_p !== null && _p !== void 0 ? _p : ''));
                        const contexts = (_r = (_q = data[9]) === null || _q === void 0 ? void 0 : _q.trim(), (_r !== null && _r !== void 0 ? _r : ''));
                        const requests = (_t = (_s = data[10]) === null || _s === void 0 ? void 0 : _s.trim(), (_t !== null && _t !== void 0 ? _t : ''));
                        const application = (_v = (_u = data[11]) === null || _u === void 0 ? void 0 : _u.trim(), (_v !== null && _v !== void 0 ? _v : ''));
                        result.push({
                            index: index,
                            application: application,
                            server: server,
                            ip: ip,
                            pid: pid,
                            status: status,
                            current: current,
                            peak: peak,
                            max: max,
                            contexts: contexts,
                            requests: requests,
                        });
                    }
                }
            })
                .catch(e => {
                const lines = e.data.split(os.EOL);
                const requestInfo = lines[2].match(/[^\(]+\(([\s\S]+)\)/);
                const requestInfoData = requestInfo[1];
                const requestData = requestInfoData.match(/([\s\S]+)\/([\s\S]+),\s([\s\S]+)/);
                const brokerHost = requestData[1];
                const brokerPort = requestData[2];
                const requestTime = requestData[3];
                const errorLines = lines.slice(6);
                const error = errorLines.join(os.EOL).trim();
                const errorData = error.split('"');
                const errorMessage = errorData[1];
                const errorCode = Number(errorData[2].replace(/[^\d-]/g, ''));
                throw new MagicCmdlError_1.MagicCmdlError(errorMessage, errorCode, brokerHost, brokerPort, requestTime);
            });
            return result;
        });
    }
    terminate(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            const cmdl = `${this.host ? ' -HOST=' + this.host : ''}${this.password ? ' -PASSWORD=' + this.password : ''} -TERMINATE=${type}`;
            yield this.tools
                .rqcmdl([cmdl])
                .then(res => {
                console.log(res);
            })
                .catch(e => {
                const lines = e.data.split(os.EOL);
                const errorLines = lines;
                const error = errorLines.join(os.EOL).trim();
                const errorData = error.split('"');
                const errorMessage = errorData[1];
                const errorCode = Number(errorData[2].replace(/[^\d-]/g, ''));
                throw new MagicCmdlError_1.MagicCmdlError(errorMessage, errorCode);
            });
            return result;
        });
    }
    exe(exeEntry) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            const cmdl = `${this.host ? ' -HOST=' + this.host : ''}${this.password ? ' -PASSWORD=' + this.password : ''} -EXE=${exeEntry}`;
            yield this.tools
                .rqcmdl([cmdl])
                .then(res => {
                console.log(res);
            })
                .catch(e => {
                const lines = e.data.split(os.EOL);
                const error = lines[1];
                const errorData = error.split('"');
                const errorMessage = errorData[1];
                const errorCode = Number(errorData[2].replace(/[^\d-]/g, ''));
                throw new MagicCmdlError_1.MagicCmdlError(errorMessage, errorCode);
            });
            return result;
        });
    }
}
exports.MagicRequesterCmdl = MagicRequesterCmdl;
//# sourceMappingURL=MagicRequesterCmdl.js.map