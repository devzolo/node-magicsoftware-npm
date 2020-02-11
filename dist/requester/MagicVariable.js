"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MagicVariable {
    constructor(value) {
        this.id = 0;
        this.value = value;
    }
    getId() {
        return this.id;
    }
    setId(id) {
        this.id = id;
    }
    getValue() {
        return this.value;
    }
    setValue(value) {
        this.value = value;
    }
    getType() {
        return 'Whatever';
    }
    toString() {
        return String(this.value);
    }
}
exports.MagicVariable = MagicVariable;
//# sourceMappingURL=MagicVariable.js.map