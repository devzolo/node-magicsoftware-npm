export declare class MagicCmdlError extends Error {
    private code;
    private brokerHost;
    private brokerPort;
    private requestTime;
    constructor(message: string, code?: number, brokerHost?: string, brokerPort?: number, requestTime?: string);
    getCode(): number;
    setCode(value: number): void;
    getBrokerHost(): string;
    setBrokerHost(value: string): void;
    getBrokerPort(): number;
    setBrokerPort(value: number): void;
    getRequestTime(): string;
    setRequestTime(value: string): void;
    toString(): string;
}
//# sourceMappingURL=MagicCmdlError.d.ts.map