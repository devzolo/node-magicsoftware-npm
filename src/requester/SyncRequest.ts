/* eslint-disable @typescript-eslint/no-explicit-any */
import { MagicVariable } from '.';

export class SyncRequest {
  private argId = 0;
  private argList: Array<MagicVariable> = [];
  private parameters: any;
  private disposed = false;

  public constructor(private impl: any) {}

  public dispose(): void {
    if (!this.disposed) {
      this.impl.dispose();
      this.disposed = true;
    }
  }

  public addArgument(argument: MagicVariable | any, type?: string): void {
    if (argument instanceof MagicVariable) {
      argument.setId(this.argId++);
      this.argList.push(argument);
      const value = argument.getValue();
      const type = argument.getType();
      this.impl.addArgument({ argument: value, type: type }, true);
    } else {
      this.impl.addArgument({ argument: argument, type: type }, true);
      this.argId++;
    }
  }

  public addaddParameters(parameters: Record<string, unknown> | any): void {
    if (parameters) {
      for (const k in parameters) {
        this.addArgument(parameters[k]);
      }
    }
  }

  public execute(parameters?: Record<string, MagicVariable>, callback?: (request: SyncRequest) => void): void {
    this.parameters = parameters;
    this.addaddParameters(parameters);

    this.impl.execute(null, true);

    this.argList.forEach(arg => {
      arg.setValue(this.getReturnedArgument(arg.getId()));
    });

    if (callback) callback(this);
    this.dispose();
  }

  public getParameters(): unknown {
    return this.parameters;
  }

  public getMessageId(): number {
    return this.impl.getMessageId(null, true);
  }

  public getOutput(): string {
    return this.impl.getOutput(null, true);
  }

  public getReturnValue(): string {
    return this.impl.getReturnValue(null, true);
  }

  public getReturnedArgument(index: number): string {
    return this.impl.getReturnedArgument(index, true);
  }

  public getReturnedVariables(): Array<unknown> {
    return this.impl.getReturnedVariables(null, true);
  }
}
