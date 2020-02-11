"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
class MagicIni {
    constructor(iniFilePath) {
        this.iniFilePath = iniFilePath;
        this.ini = this.decode(fs_1.default.readFileSync(iniFilePath, 'latin1'));
    }
    isQuoted(val) {
        return (val.charAt(0) === '"' && val.slice(-1) === '"') || (val.charAt(0) === "'" && val.slice(-1) === "'");
    }
    safe(val) {
        return typeof val !== 'string' ||
            val.match(/[=\r\n]/) ||
            val.match(/^\[/) ||
            (val.length > 1 && this.isQuoted(val)) ||
            val !== val.trim()
            ? JSON.stringify(val)
            : val.replace(/;/g, '\\;').replace(/#/g, '\\#');
    }
    unsafe(val /*, doUnesc?: undefined*/) {
        val = (val || '').trim();
        if (this.isQuoted(val)) {
            // remove the single quotes before calling JSON.parse
            if (val.charAt(0) === "'") {
                val = val.substr(1, val.length - 2);
            }
            try {
                val = JSON.parse(val);
            }
            catch (_) { }
        }
        else {
            // walk the val to find the first not-escaped ; character
            let esc = false;
            let unesc = '';
            for (let i = 0, l = val.length; i < l; i++) {
                const c = val.charAt(i);
                if (esc) {
                    if ('\\;#'.indexOf(c) !== -1)
                        unesc += c;
                    else
                        unesc += '\\' + c;
                    esc = false;
                }
                else if (';#'.indexOf(c) !== -1) {
                    break;
                }
                else if (c === '\\') {
                    esc = true;
                }
                else {
                    unesc += c;
                }
            }
            if (esc)
                unesc += '\\';
            return unesc;
        }
        return val;
    }
    dotSplit(str) {
        return str
            .replace(/\1/g, '\u0002LITERAL\\1LITERAL\u0002')
            .replace(/\\\./g, '\u0001')
            .split(/\./)
            .map(function (part) {
            return part.replace(/\1/g, '\\.').replace(/\2LITERAL\\1LITERAL\2/g, '\u0001');
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    encode(obj, opt) {
        const children = [];
        let out = '';
        if (typeof opt === 'string') {
            opt = {
                section: opt,
                whitespace: false,
            };
        }
        else {
            opt = opt || {};
            opt.whitespace = opt.whitespace === true;
        }
        const separator = opt.whitespace ? ' = ' : '=';
        Object.keys(obj).forEach(k => {
            const val = obj[k];
            if (val && Array.isArray(val)) {
                val.forEach(item => {
                    out += this.safe(k + '[]') + separator + this.safe(item) + '\n';
                });
            }
            else if (val && typeof val === 'object') {
                children.push(k);
            }
            else {
                out += this.safe(k) + separator + this.safe(val) + MagicIni.EOL;
            }
        });
        if (opt.section && out.length) {
            out = '[' + this.safe(opt.section) + ']' + MagicIni.EOL + out;
        }
        children.forEach(k => {
            const nk = this.dotSplit(k).join('\\.');
            const section = (opt.section ? opt.section + '.' : '') + nk;
            const child = this.encode(obj[k], {
                section: section,
                whitespace: opt.whitespace,
            });
            if (out.length && child.length) {
                out += MagicIni.EOL;
            }
            out += child;
        });
        return out;
    }
    decode(str) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const out = {};
        let p = out;
        let section = null;
        //const state = 'START';
        // section     |key = value
        const re = /^\[([^\]]*)\]$|^([^=]+)(=(.*))?$/i;
        const lines = str.split(/[\r\n]+/g);
        /******************************************************************/
        lines.forEach(function (line, index) {
            if (line != null && line.trim().charAt(line.trim().length - 1) === '+') {
                lines[index] = line.slice(0, -1);
                for (let counter = 1;; counter++) {
                    if (lines[index + counter] != null &&
                        lines[index + counter].trim().charAt(lines[index + counter].trim().length - 1) === '+') {
                        lines[index] = String(lines[index]) + lines[index + counter].slice(0, -1);
                        lines[index + counter] = '';
                    }
                    else {
                        lines[index] = String(lines[index]) + String(lines[index + counter]);
                        lines[index + counter] = '';
                        break;
                    }
                }
            }
        });
        /******************************************************************/
        lines.forEach((line) => {
            if (!line || line.match(/^\s*[;#]/))
                return;
            const match = line.match(re);
            if (!match)
                return;
            if (match[1] !== undefined) {
                section = this.unsafe(match[1]);
                p = out[section] = out[section] || {};
                return;
            }
            let key = this.unsafe(match[2]), value = match[3] ? this.unsafe(match[4] || '') : true;
            switch (value) {
                case 'true':
                case 'false':
                case 'null':
                    value = JSON.parse(value);
            }
            // Convert keys with '[]' suffix to an array
            if (key.length > 2 && key.slice(-2) === '[]') {
                key = key.substring(0, key.length - 2);
                if (!p[key]) {
                    p[key] = [];
                }
                else if (!Array.isArray(p[key])) {
                    p[key] = [p[key]];
                }
            }
            // safeguard against resetting a previously defined
            // array by accidentally forgetting the brackets
            if (Array.isArray(p[key])) {
                p[key].push(value);
            }
            else {
                p[key] = value;
            }
        });
        // {a:{y:1},"a.b":{x:2}} --> {a:{y:1,b:{x:2}}}
        // use a filter to return the keys that have to be deleted.
        Object.keys(out)
            .filter(k => {
            var _a;
            if (!out[k] || typeof out[k] !== 'object' || Array.isArray(out[k]))
                return false;
            // see if the parent section is also an object.
            // if so, add it to that, and mark this one for deletion
            const parts = this.dotSplit(k);
            let p = out;
            const l = parts.pop();
            const nl = (_a = l) === null || _a === void 0 ? void 0 : _a.replace(/\\\./g, '.');
            parts.forEach((part) => {
                if (!p[part] || typeof p[part] !== 'object')
                    p[part] = {};
                p = p[part];
            });
            if (p === out && nl === l)
                return false;
            p[nl] = out[k];
            return true;
        })
            .forEach(del => {
            delete out[del];
        });
        out.translate = (source) => {
            const pat = /%.+?%/g;
            let mat = pat.exec(source);
            let result = source;
            while (mat != null) {
                const logical = mat[0];
                const logicalName = logical.substring(1, mat[0].length - 1);
                let logicalValue = null;
                if (logicalValue == null) {
                    logicalValue = out.MAGIC_LOGICAL_NAMES[logicalName];
                }
                if (logicalValue != null) {
                    logicalValue = out.translate(logicalValue);
                    result = result.replace(logical, logicalValue);
                }
                mat = pat.exec(source);
            }
            return result;
        };
        return out;
    }
    decodeAdd(str) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const out = {};
        let p = out;
        let section = null;
        //const state = 'START';
        // section     |key = value
        const re = /^\/?\[([^\]]*)\]$|^([^=]+)(=(.*))?$/i;
        const lines = str.split(/[\r\n]+/g);
        /******************************************************************/
        lines.forEach(function (line, index) {
            if (line != null && line.trim().charAt(line.trim().length - 1) === '+') {
                lines[index] = line.slice(0, -1);
                for (let counter = 1;; counter++) {
                    if (lines[index + counter] != null &&
                        lines[index + counter].trim().charAt(lines[index + counter].trim().length - 1) === '+') {
                        lines[index] = String(lines[index]) + lines[index + counter].slice(0, -1);
                        lines[index + counter] = '';
                    }
                    else {
                        lines[index] = String(lines[index]) + String(lines[index + counter]);
                        lines[index + counter] = '';
                        break;
                    }
                }
            }
        });
        /******************************************************************/
        lines.forEach((line) => {
            if (!line || line.match(/^\s*[;#]/))
                return;
            const match = line.match(re);
            if (!match)
                return;
            if (match[1] !== undefined) {
                section = this.unsafe(match[1]);
                p = out[section] = out[section] || {};
                return;
            }
            let key = this.unsafe(match[2]), value = match[3] ? this.unsafe(match[4] || '') : true;
            switch (value) {
                case 'true':
                case 'false':
                case 'null':
                    value = JSON.parse(value);
            }
            // Convert keys with '[]' suffix to an array
            if (key.length > 2 && key.slice(-2) === '[]') {
                key = key.substring(0, key.length - 2);
                if (!p[key]) {
                    p[key] = [];
                }
                else if (!Array.isArray(p[key])) {
                    p[key] = [p[key]];
                }
            }
            // safeguard against resetting a previously defined
            // array by accidentally forgetting the brackets
            if (Array.isArray(p[key])) {
                p[key].push(value);
            }
            else {
                p[key] = value;
            }
        });
        // {a:{y:1},"a.b":{x:2}} --> {a:{y:1,b:{x:2}}}
        // use a filter to return the keys that have to be deleted.
        Object.keys(out)
            .filter(k => {
            var _a;
            if (!out[k] || typeof out[k] !== 'object' || Array.isArray(out[k]))
                return false;
            // see if the parent section is also an object.
            // if so, add it to that, and mark this one for deletion
            const parts = this.dotSplit(k);
            let p = out;
            const l = parts.pop();
            const nl = (_a = l) === null || _a === void 0 ? void 0 : _a.replace(/\\\./g, '.');
            parts.forEach(function (part) {
                if (!p[part] || typeof p[part] !== 'object')
                    p[part] = {};
                p = p[part];
            });
            if (p === out && nl === l)
                return false;
            p[nl] = out[k];
            return true;
        })
            .forEach(del => {
            delete out[del];
        });
        return out;
    }
    /**
     * Translates all logical names, including nested logical names, in a string to their actual values.
     * If a logical name is not found, it will be removed from the returned string. Secret names are not translated.
     * @method translate
     * @param str str – An alpha value with logical names.
     * @returns The actual values represented by logical names and nested logical names.
     */
    translate(str) {
        return this.ini.translate(str);
    }
    add(iniFilePath) {
        const ini = this.decodeAdd(fs_1.default.readFileSync(this.translate(iniFilePath), 'latin1'));
        for (const k in ini) {
            const matchKey = k.match(/^\/?\[(.*)\](.*)/i);
            if (matchKey) {
                const section = matchKey[1];
                const key = matchKey[2];
                const val = ini[k];
                const matchValue = val.match(/^(\*)?(.*)/i);
                if (matchValue) {
                    //const fix = matchValue[1];
                    const value = matchValue[2];
                    //console.log(section, key, value);
                    this.ini[section][key] = value;
                }
            }
        }
    }
    get(section, key) {
        if (this.ini[section] == undefined) {
            return null;
        }
        return this.ini[section][key];
    }
}
exports.MagicIni = MagicIni;
MagicIni.EOL = os_1.default.EOL;
//# sourceMappingURL=index.js.map