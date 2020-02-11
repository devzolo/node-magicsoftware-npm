"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const _1 = require(".");
class SyncRequest {
    constructor(impl) {
        this.impl = impl;
        this.argId = 0;
        this.argList = [];
        this.disposed = false;
    }
    dispose() {
        if (!this.disposed) {
            this.impl.dispose();
            this.disposed = true;
        }
    }
    addArgument(argument, type) {
        if (argument instanceof _1.MagicVariable) {
            argument.setId(this.argId++);
            this.argList.push(argument);
            const value = argument.getValue();
            const type = argument.getType();
            this.impl.addArgument({ argument: value, type: type }, true);
        }
        else {
            this.impl.addArgument({ argument: argument, type: type }, true);
            this.argId++;
        }
    }
    addaddParameters(parameters) {
        if (parameters) {
            for (const k in parameters) {
                this.addArgument(parameters[k]);
            }
        }
    }
    execute(parameters, callback) {
        this.parameters = parameters;
        this.addaddParameters(parameters);
        this.impl.execute(null, true);
        this.argList.forEach(arg => {
            arg.setValue(this.getReturnedArgument(arg.getId()));
        });
        if (callback)
            callback(this);
        this.dispose();
    }
    getParameters() {
        return this.parameters;
    }
    getMessageId() {
        return this.impl.getMessageId(null, true);
    }
    getOutput() {
        return this.impl.getOutput(null, true);
    }
    getReturnValue() {
        return this.impl.getReturnValue(null, true);
    }
    getReturnedArgument(index) {
        return this.impl.getReturnedArgument(index, true);
    }
    getReturnedVariables() {
        return this.impl.getReturnedVariables(null, true);
    }
}
exports.SyncRequest = SyncRequest;
//# sourceMappingURL=SyncRequest.js.map