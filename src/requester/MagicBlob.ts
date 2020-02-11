import { MagicVariable } from '.';

export class MagicBlob extends MagicVariable {
  public constructor(value?: unknown) {
    super(value);
  }

  public getType(): string {
    return 'Blob';
  }
}
