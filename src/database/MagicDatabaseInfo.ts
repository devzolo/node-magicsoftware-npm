import { MagicIni } from '..';

export class MagicDatabaseInfo {
  private raw: Array<string>;
  public dataSourceType: string;
  public dbmsType: number;
  public database: string;
  public server: string;
  public userName: string;
  public password: string;
  public connectString: string;
  private nop: string;

  private get(index: number) {
    return this.config.translate(this.raw[index] || '').trim();
  }

  private getInt(index: number) {
    return Number(this.get(index));
  }

  public constructor(public config: MagicIni, public key: string) {
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
}
