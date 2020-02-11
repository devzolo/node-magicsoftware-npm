import fs from 'fs';
import os from 'os';

interface MagicIniData extends WeakMap<{}, Record<string, string>> {
  MAGIC_ENV: Record<string, string>;
  MAGIC_SERVERS: Record<string, string>;
  MAGIC_COMMS: Record<string, string>;
  MAGIC_DBMS: Record<string, string>;
  MAGIC_DATABASES: Record<string, string>;
  MAGIC_LOGICAL_NAMES: Record<string, string>;
  MAGIC_PRINTERS: Record<string, string>;
  MAGIC_LANGUAGE: Record<string, string>;
  MAGIC_SERVICES: Record<string, string>;
  MAGIC_GATEWAYS: Record<string, string>;
  MAGIC_JAVA: Record<string, string>;
  MAGIC_LOGGING: Record<string, string>;
  CRR_INTERFACES: Record<string, string>;
  TOOLS_MENU: Record<string, string>;
  MAGIC_BUILDERS: Record<string, string>;
  MAGIC_DEFAULTS: Record<string, string>;
  MAGIC_SPECIALS: Record<string, string>;
  MAGIC_SYSTEMS: Record<string, string>;
  translate(str: string): string;
}

export class MagicIni {
  public ini: MagicIniData;

  constructor(public iniFilePath: string) {
    this.ini = this.decode(fs.readFileSync(iniFilePath, 'latin1')) as MagicIniData;
  }

  private static EOL = os.EOL;

  private isQuoted(val: string): boolean {
    return (val.charAt(0) === '"' && val.slice(-1) === '"') || (val.charAt(0) === "'" && val.slice(-1) === "'");
  }

  private safe(val: string): string {
    return typeof val !== 'string' ||
      val.match(/[=\r\n]/) ||
      val.match(/^\[/) ||
      (val.length > 1 && this.isQuoted(val)) ||
      val !== val.trim()
      ? JSON.stringify(val)
      : val.replace(/;/g, '\\;').replace(/#/g, '\\#');
  }

  private unsafe(val: string /*, doUnesc?: undefined*/): string {
    val = (val || '').trim();
    if (this.isQuoted(val)) {
      // remove the single quotes before calling JSON.parse
      if (val.charAt(0) === "'") {
        val = val.substr(1, val.length - 2);
      }
      try {
        val = JSON.parse(val);
      } catch (_) {}
    } else {
      // walk the val to find the first not-escaped ; character
      let esc = false;
      let unesc = '';
      for (let i = 0, l = val.length; i < l; i++) {
        const c = val.charAt(i);
        if (esc) {
          if ('\\;#'.indexOf(c) !== -1) unesc += c;
          else unesc += '\\' + c;
          esc = false;
        } else if (';#'.indexOf(c) !== -1) {
          break;
        } else if (c === '\\') {
          esc = true;
        } else {
          unesc += c;
        }
      }
      if (esc) unesc += '\\';
      return unesc;
    }
    return val;
  }

  private dotSplit(str: string): Array<string> {
    return str
      .replace(/\1/g, '\u0002LITERAL\\1LITERAL\u0002')
      .replace(/\\\./g, '\u0001')
      .split(/\./)
      .map(function(part: string) {
        return part.replace(/\1/g, '\\.').replace(/\2LITERAL\\1LITERAL\2/g, '\u0001');
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  private encode(obj: { [x: string]: any }, opt: { section?: any; whitespace?: any }): string {
    const children: Array<string> = [];
    let out = '';

    if (typeof opt === 'string') {
      opt = {
        section: opt,
        whitespace: false,
      };
    } else {
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
      } else if (val && typeof val === 'object') {
        children.push(k);
      } else {
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

  private decode(str: string): unknown {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const out: any = {};
    let p = out;
    let section: string | null = null;
    //const state = 'START';
    // section     |key = value
    const re = /^\[([^\]]*)\]$|^([^=]+)(=(.*))?$/i;
    const lines = str.split(/[\r\n]+/g);

    /******************************************************************/
    lines.forEach(function(line, index) {
      if (line != null && line.trim().charAt(line.trim().length - 1) === '+') {
        lines[index] = line.slice(0, -1);
        for (let counter = 1; ; counter++) {
          if (
            lines[index + counter] != null &&
            lines[index + counter].trim().charAt(lines[index + counter].trim().length - 1) === '+'
          ) {
            lines[index] = String(lines[index]) + lines[index + counter].slice(0, -1);
            lines[index + counter] = '';
          } else {
            lines[index] = String(lines[index]) + String(lines[index + counter]);
            lines[index + counter] = '';
            break;
          }
        }
      }
    });
    /******************************************************************/

    lines.forEach((line: string) => {
      if (!line || line.match(/^\s*[;#]/)) return;
      const match = line.match(re);
      if (!match) return;
      if (match[1] !== undefined) {
        section = this.unsafe(match[1]);
        p = out[section] = out[section] || {};
        return;
      }
      let key = this.unsafe(match[2]),
        value = match[3] ? this.unsafe(match[4] || '') : true;
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
        } else if (!Array.isArray(p[key])) {
          p[key] = [p[key]];
        }
      }

      // safeguard against resetting a previously defined
      // array by accidentally forgetting the brackets
      if (Array.isArray(p[key])) {
        p[key].push(value);
      } else {
        p[key] = value;
      }
    });

    // {a:{y:1},"a.b":{x:2}} --> {a:{y:1,b:{x:2}}}
    // use a filter to return the keys that have to be deleted.
    Object.keys(out)
      .filter(k => {
        if (!out[k] || typeof out[k] !== 'object' || Array.isArray(out[k])) return false;
        // see if the parent section is also an object.
        // if so, add it to that, and mark this one for deletion
        const parts = this.dotSplit(k);
        let p = out;
        const l = parts.pop();
        const nl = l?.replace(/\\\./g, '.') as string;
        parts.forEach((part: string | number) => {
          if (!p[part] || typeof p[part] !== 'object') p[part] = {};
          p = p[part];
        });
        if (p === out && nl === l) return false;
        p[nl] = out[k];
        return true;
      })
      .forEach(del => {
        delete out[del];
      });

    out.translate = (source: string): string => {
      const pat = /%.+?%/g;
      let mat = pat.exec(source);
      let result = source;
      while (mat != null) {
        const logical = mat[0];
        const logicalName = logical.substring(1, mat[0].length - 1);
        let logicalValue: string | null = null;
        if (logicalValue == null) {
          logicalValue = out.MAGIC_LOGICAL_NAMES[logicalName];
        }
        if (logicalValue != null) {
          logicalValue = out.translate(logicalValue);
          result = result.replace(logical, logicalValue as string);
        }
        mat = pat.exec(source);
      }
      return result;
    };

    return out;
  }

  private decodeAdd(str: string): unknown {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const out: any = {};
    let p = out;
    let section: string | null = null;
    //const state = 'START';
    // section     |key = value
    const re = /^\/?\[([^\]]*)\]$|^([^=]+)(=(.*))?$/i;
    const lines = str.split(/[\r\n]+/g);

    /******************************************************************/
    lines.forEach(function(line, index) {
      if (line != null && line.trim().charAt(line.trim().length - 1) === '+') {
        lines[index] = line.slice(0, -1);
        for (let counter = 1; ; counter++) {
          if (
            lines[index + counter] != null &&
            lines[index + counter].trim().charAt(lines[index + counter].trim().length - 1) === '+'
          ) {
            lines[index] = String(lines[index]) + lines[index + counter].slice(0, -1);
            lines[index + counter] = '';
          } else {
            lines[index] = String(lines[index]) + String(lines[index + counter]);
            lines[index + counter] = '';
            break;
          }
        }
      }
    });
    /******************************************************************/

    lines.forEach((line: string) => {
      if (!line || line.match(/^\s*[;#]/)) return;
      const match = line.match(re);
      if (!match) return;
      if (match[1] !== undefined) {
        section = this.unsafe(match[1]);
        p = out[section] = out[section] || {};
        return;
      }
      let key = this.unsafe(match[2]),
        value = match[3] ? this.unsafe(match[4] || '') : true;
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
        } else if (!Array.isArray(p[key])) {
          p[key] = [p[key]];
        }
      }

      // safeguard against resetting a previously defined
      // array by accidentally forgetting the brackets
      if (Array.isArray(p[key])) {
        p[key].push(value);
      } else {
        p[key] = value;
      }
    });

    // {a:{y:1},"a.b":{x:2}} --> {a:{y:1,b:{x:2}}}
    // use a filter to return the keys that have to be deleted.
    Object.keys(out)
      .filter(k => {
        if (!out[k] || typeof out[k] !== 'object' || Array.isArray(out[k])) return false;
        // see if the parent section is also an object.
        // if so, add it to that, and mark this one for deletion
        const parts = this.dotSplit(k);
        let p = out;
        const l = parts.pop();
        const nl = l?.replace(/\\\./g, '.') as string;
        parts.forEach(function(part: string | number) {
          if (!p[part] || typeof p[part] !== 'object') p[part] = {};
          p = p[part];
        });
        if (p === out && nl === l) return false;
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
  public translate(str: string): string {
    return this.ini.translate(str);
  }

  public add(iniFilePath: string): void {
    const ini = this.decodeAdd(fs.readFileSync(this.translate(iniFilePath), 'latin1')) as MagicIniData;
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

  public get(section: string, key: string): string | null {
    if (this.ini[section] == undefined) {
      return null;
    }
    return this.ini[section][key];
  }
}
