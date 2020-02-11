import { MagicVariable } from '.';

export class MagicAlpha extends MagicVariable {
  public constructor(value?: string) {
    super(value);
  }

  public getType(): string {
    return 'Alpha';
  }
}
