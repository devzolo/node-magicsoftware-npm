import { MagicTools } from './MagicTools';
interface GetServersRowType {
    index: number;
    aplication: string;
    server: string;
    ip: string;
    pid: string;
    status: string;
    current: string;
    peak: string;
    max: string;
    contexts: string;
    requests: string;
}
interface GetRequestsQueueRowType {
    index: number;
    application: string;
    server: string;
    ip: string;
    status: string;
    current: string;
    peak: string;
    max: string;
    contexts: string;
    requests: string;
    pid: string;
}
export declare class MagicRequesterCmdl {
    private host;
    private password;
    private tools;
    constructor(tools: MagicTools, host?: string, password?: string);
    setHost(host: string): void;
    setPassword(password: string): void;
    getServers(): Promise<Array<GetServersRowType>>;
    getRequestsQueue(): Promise<Array<GetRequestsQueueRowType>>;
    terminate(type: string): Promise<Array<unknown>>;
    exe(exeEntry: string): Promise<Array<unknown>>;
}
export {};
//# sourceMappingURL=MagicRequesterCmdl.d.ts.map