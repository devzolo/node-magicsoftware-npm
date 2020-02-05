/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';

const eol = process.platform === 'win32' ? '\r\n' : '\n';

function isQuoted(val: string): boolean {
  return (val.charAt(0) === '"' && val.slice(-1) === '"') || (val.charAt(0) === "'" && val.slice(-1) === "'");
}

function dotSplit(str: string): string[] {
  return str
    .replace(/\1/g, '\u0002LITERAL\\1LITERAL\u0002')
    .replace(/\\\./g, '\u0001')
    .split(/\./)
    .map(function(part) {
      return part.replace(/\1/g, '\\.').replace(/\2LITERAL\\1LITERAL\2/g, '\u0001');
    });
}

function safe(val: string): string {
  return typeof val !== 'string' ||
    val.match(/[=\r\n]/) ||
    val.match(/^\[/) ||
    (val.length > 1 && isQuoted(val)) ||
    val !== val.trim()
    ? JSON.stringify(val)
    : val.replace(/;/g, '\\;').replace(/#/g, '\\#');
}

function unsafe(val: string, doUnesc?: boolean): string {
  val = (val || '').trim();
  if (isQuoted(val)) {
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

function encode(obj, opt): string {
  const children: string[] = [];
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

  Object.keys(obj).forEach(function(k, _, __) {
    const val = obj[k];
    if (val && Array.isArray(val)) {
      val.forEach(function(item) {
        out += safe(k + '[]') + separator + safe(item) + '\n';
      });
    } else if (val && typeof val === 'object') {
      children.push(k);
    } else {
      out += safe(k) + separator + safe(val) + eol;
    }
  });

  if (opt.section && out.length) {
    out = '[' + safe(opt.section) + ']' + eol + out;
  }

  children.forEach(function(k, _, __) {
    const nk = dotSplit(k).join('\\.');
    const section = (opt.section ? opt.section + '.' : '') + nk;
    const child = encode(obj[k], {
      section: section,
      whitespace: opt.whitespace,
    });
    if (out.length && child.length) {
      out += eol;
    }
    out += child;
  });

  return out;
}

function decode(str: string): any {
  const out: any = {};
  let p = out;
  const state = 'START';
  // section     |key = value
  const re = /^\[([^\]]*)\]$|^([^=]+)(=(.*))?$/i;
  const lines = str.split(/[\r\n]+/g);
  const section = null;

  /******************************************************************/

  lines.forEach(function(line, index, object) {
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

  lines.forEach(function(line, _, __) {
    if (!line || line.match(/^\s*[;#]/)) return;
    const match = line.match(re);
    if (!match) return;
    if (match[1] !== undefined) {
      const section = unsafe(match[1]);
      p = out[section] = out[section] || {};
      return;
    }
    let key = unsafe(match[2]),
      value = match[3] ? unsafe(match[4] || '') : true;
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
    .filter(function(k, _, __) {
      if (!out[k] || typeof out[k] !== 'object' || Array.isArray(out[k])) return false;
      // see if the parent section is also an object.
      // if so, add it to that, and mark this one for deletion
      const parts = dotSplit(k);
      let p = out;
      const l = parts.pop();
      const nl: string | undefined = l?.replace(/\\\./g, '.');
      parts.forEach(function(part, _, __) {
        if (!p[part] || typeof p[part] !== 'object') p[part] = {};
        p = p[part];
      });
      if (p === out && nl === l) return false;
      if (nl) p[nl] = out[k];
      return true;
    })
    .forEach(function(del, _, __) {
      delete out[del];
    });

  out.translate = function(source): string {
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

interface MagicIniData {
  MAGIC_ENV: any;
  MAGIC_SERVERS: any;
  MAGIC_COMMS: any;
  MAGIC_DBMS: any;
  MAGIC_DATABASES: any;
  MAGIC_LOGICAL_NAMES: any;
  MAGIC_PRINTERS: any;
  MAGIC_LANGUAGE: any;
  MAGIC_SERVICES: any;
  MAGIC_GATEWAYS: any;
  MAGIC_JAVA: any;
  MAGIC_LOGGING: any;
  CRR_INTERFACES: any;
  TOOLS_MENU: any;
  MAGIC_BUILDERS: any;
  MAGIC_DEFAULTS: any;
  MAGIC_SPECIALS: any;
  MAGIC_SYSTEMS: any;
  translate(str: string): string;
}

export class MagicIni {
  public ini: MagicIniData;

  constructor(public iniFilePath: string) {
    this.ini = decode(fs.readFileSync(iniFilePath, 'latin1'));
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
}
