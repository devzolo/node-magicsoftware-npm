export abstract class MagicVariable {
  protected id = 0;
  protected value: unknown;

  public constructor(value?: unknown) {
    this.value = value;
  }

  public getId(): number {
    return this.id;
  }

  public setId(id: number): void {
    this.id = id;
  }

  public getValue(): unknown {
    return this.value;
  }

  public setValue(value: unknown): void {
    this.value = value;
  }

  public getType(): string {
    return 'Whatever';
  }

  public toString(): string {
    return String(this.value);
  }
}
