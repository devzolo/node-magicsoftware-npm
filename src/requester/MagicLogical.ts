import { MagicVariable } from '.';

export class MagicLogical extends MagicVariable {
  public constructor(value?: boolean) {
    super(value);
  }

  public getType(): string {
    return 'Logical';
  }
}
