"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class MagicNumeric extends _1.MagicVariable {
    constructor(value) {
        super(Number(value));
    }
    getType() {
        return 'Numeric';
    }
}
exports.MagicNumeric = MagicNumeric;
//# sourceMappingURL=MagicNumeric.js.map