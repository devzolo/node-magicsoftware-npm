import { MagicVariable } from '.';
export declare class SyncRequest {
    private impl;
    private argId;
    private argList;
    private parameters;
    private disposed;
    constructor(impl: any);
    dispose(): void;
    addArgument(argument: MagicVariable | any, type?: string): void;
    addaddParameters(parameters: Record<string, unknown> | any): void;
    execute(parameters?: Record<string, MagicVariable>, callback?: (request: SyncRequest) => void): void;
    getParameters(): unknown;
    getMessageId(): number;
    getOutput(): string;
    getReturnValue(): string;
    getReturnedArgument(index: number): string;
    getReturnedVariables(): Array<unknown>;
}
//# sourceMappingURL=SyncRequest.d.ts.map