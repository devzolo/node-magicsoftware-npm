export declare abstract class MagicVariable {
    protected id: number;
    protected value: unknown;
    constructor(value?: unknown);
    getId(): number;
    setId(id: number): void;
    getValue(): unknown;
    setValue(value: unknown): void;
    getType(): string;
    toString(): string;
}
//# sourceMappingURL=MagicVariable.d.ts.map