import { MagicIni } from './ini';
import { MagicRequester } from './requester';
declare class MagicServerInfo {
    config: MagicIni;
    key: string;
    private raw;
    private get;
    private getInt;
    serverType: string;
    serverAddress: string;
    username: string;
    password: string;
    timeout: number;
    alternateServer: string;
    private communicationManager;
    constructor(config: MagicIni, key: string);
}
export declare class MagicServer {
    magicServerInfo: MagicServerInfo;
    private _requester;
    static getInstance(config: MagicIni, serverName?: string): MagicServer;
    constructor(magicServerInfo: MagicServerInfo);
    get requester(): MagicRequester;
    set requester(value: MagicRequester);
}
export {};
//# sourceMappingURL=server.d.ts.map