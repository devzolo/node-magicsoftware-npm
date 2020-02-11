/* eslint-disable @typescript-eslint/no-explicit-any */
import { MgRequester, SyncRequest } from '.';

export class MagicRequester {
  private static requester = new MgRequester(null, true);

  private impl: any;
  private disposed = false;
  private address: string;
  private requests = new Array<SyncRequest>();

  private static cleanupHook(callback): void {
    process.on('exit', () => {
      try {
        callback();
      } catch (e) {}
    });

    // catch ctrl+c event and exit normally
    // process.on('SIGINT', () => {
    //    process.exit(2);
    // });

    // catch uncaught exceptions, trace, then exit normally
    // process.on('uncaughtException', (e) => {
    //  process.exit(99);
    // });
  }

  public constructor(address: string) {
    this.address = address;
    this.impl = MagicRequester.requester.createRequestsFactory({ address: this.address }, true);
    MagicRequester.cleanupHook(() => {
      this.dispose();
    });
  }

  public dispose(): void {
    if (!this.disposed) {
      while (this.requests.length) {
        const request = this.requests.shift();
        request?.dispose();
      }
      this.impl.dispose();
      this.disposed = true;
    }
  }

  public getSyncRequest(application: string, program: string): SyncRequest {
    const request = new SyncRequest(this.impl.getSyncMGRequest({ application: application, program: program }, true));
    this.requests.push(request);
    return request;
  }
}
