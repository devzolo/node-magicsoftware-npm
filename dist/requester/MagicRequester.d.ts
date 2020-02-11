import { SyncRequest } from '.';
export declare class MagicRequester {
    private static requester;
    private impl;
    private disposed;
    private address;
    private requests;
    private static cleanupHook;
    constructor(address: string);
    dispose(): void;
    getSyncRequest(application: string, program: string): SyncRequest;
}
//# sourceMappingURL=MagicRequester.d.ts.map