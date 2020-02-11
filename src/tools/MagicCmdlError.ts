export class MagicCmdlError extends Error {
  constructor(
    message: string,
    private code: number = 0,
    private brokerHost: string = 'localhost',
    private brokerPort: number = 5115,
    private requestTime: string = '',
  ) {
    super(message);
  }

  public getCode(): number {
    return this.code;
  }

  public setCode(value: number): void {
    this.code = value;
  }

  public getBrokerHost(): string {
    return this.brokerHost;
  }

  public setBrokerHost(value: string): void {
    this.brokerHost = value;
  }

  public getBrokerPort(): number {
    return this.brokerPort;
  }

  public setBrokerPort(value: number): void {
    this.brokerPort = value;
  }

  public getRequestTime(): string {
    return this.requestTime;
  }

  public setRequestTime(value: string): void {
    this.requestTime = value;
  }

  public toString(): string {
    return `${this.message} (${this.code})`;
  }
}
