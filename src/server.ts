import { MagicIni } from './ini';
import { MagicRequester } from './requester';

class MagicServerInfo {
  private raw: Array<string>;

  private get(index: number): string {
    return this.config.translate(this.raw[index] || '').trim();
  }

  private getInt(index: number): number {
    return Number(this.get(index));
  }

  public serverType: string;
  public serverAddress: string;
  public username: string;
  public password: string;
  public timeout: number;
  public alternateServer: string;
  private communicationManager: string;

  public constructor(public config: MagicIni, public key: string) {
    this.raw = (config.get('MAGIC_SERVERS', key) || '').split(',');
    this.serverType = this.get(0);
    this.serverAddress = this.get(1);
    this.username = this.get(2);
    this.password = this.get(3);
    this.timeout = this.getInt(4);
    this.alternateServer = this.get(5);
    this.communicationManager = this.get(6);
  }
}

export class MagicServer {
  private _requester!: MagicRequester;

  static getInstance(config: MagicIni, serverName = ''): MagicServer {
    if (!serverName) {
      serverName = config.get('MAGIC_ENV', 'MessagingServer') as string;
    }
    const server = new MagicServer(new MagicServerInfo(config, serverName));
    return server;
  }

  public constructor(public magicServerInfo: MagicServerInfo) {
    this.requester = new MagicRequester(magicServerInfo.serverAddress);
  }

  public get requester(): MagicRequester {
    return this._requester;
  }

  public set requester(value: MagicRequester) {
    this._requester = value;
  }
}
