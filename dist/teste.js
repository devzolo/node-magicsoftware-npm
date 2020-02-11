"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const tools = new _1.MagicTools('C:/Program Files (x86)/MSE/Magic xpa 3.2/');
const cmdl = new _1.MagicRequesterCmdl(tools);
(() => __awaiter(void 0, void 0, void 0, function* () {
    /*
          tools.rqcmdl(['-HOST=192.168.0.10 -QUERY=QUEUE']).then((data)=>{
              console.log(data.data);
          }).catch((e) => {
              console.error(e.data);
          });
      */
    cmdl.setHost('192.168.0.10');
    cmdl.setPassword('vm-cigam//12-4-2017//11:02:50');
    cmdl
        .getServers()
        .then(data => {
        data.map((server) => __awaiter(void 0, void 0, void 0, function* () {
            if (server.aplication == 'CGPortalColaborativo') {
                try {
                    yield cmdl.terminate(server.server);
                }
                catch (e) {
                    console.log(e.toString());
                }
            }
        }));
        cmdl.exe('CGPortalColaborativo');
    })
        .catch(e => {
        console.error(e);
    });
    /*
      cmdl.getRequestsQueue().then((data)=>{
          data.map((request) => {
              console.log(request);
          });
      }).catch((e) => {
          console.error(e);
      });
      */
}))();
//# sourceMappingURL=teste.js.map