import { MagicVariable } from '.';

export class MagicDate extends MagicVariable {
  public constructor(value?: Date) {
    super(value);
  }

  public getType(): string {
    return 'Date';
  }
}
