import { MagicVariable } from '.';

export class MagicNumeric extends MagicVariable {
  public constructor(value?: number) {
    super(Number(value));
  }

  public getType(): string {
    return 'Numeric';
  }
}
