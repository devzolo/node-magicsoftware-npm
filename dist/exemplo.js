"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requester_1 = require("./requester");
const requester = new requester_1.MagicRequester('localhost');
const request = requester.getSyncRequest('Example', 'PROGRAM');
try {
    request.execute({ teste: new requester_1.MagicAlpha('teste') });
    console.log(request.getOutput());
}
catch (e) {
    console.error(e.Code, e.Description);
}
//# sourceMappingURL=exemplo.js.map