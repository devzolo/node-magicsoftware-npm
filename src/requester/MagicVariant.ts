import { MagicVariable } from '.';

export class MagicVariant extends MagicVariable {
  public constructor(value?: unknown) {
    super(value);
  }

  public getType(): string {
    return 'Whatever';
  }
}
