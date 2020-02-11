import { MagicVariable } from '.';

export class MagicTime extends MagicVariable {
  public constructor(value?: string) {
    super(value);
  }

  public getType(): string {
    return 'Time';
  }
}
