import { MagicIni } from '..';
import { MagicDBMS } from '.';

export class MagicDatabaseManager {
  [index: number]: MagicDBMS;

  private databases = {};

  constructor(private config: MagicIni) {
    return new Proxy({}, this);
  }

  public get(target: any, p: PropertyKey, _receiver: any): MagicDBMS {
    const key: string = p.toString();
    if (!this.databases[key]) {
      if (this.config.ini.MAGIC_DATABASES[key]) {
        this.databases[key] = MagicDBMS.getInstance(this.config, p.toString());
        if (!this.databases[key]) {
          throw new Error('DBMS not implemented.');
        }
      } else {
        throw new Error(`Database ${key} not in MAGIC_DATABASES.`);
      }
    }
    return this.databases[key];
  }
}
