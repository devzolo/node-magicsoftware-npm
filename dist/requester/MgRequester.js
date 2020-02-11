"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const edge_js_1 = require("edge-js");
const path_1 = __importDefault(require("path"));
const MgRequesterDll = path_1.default.resolve(__dirname, '..', '..', 'bin', process.platform, process.arch, 'MgRequester.dll');
exports.MgRequester = edge_js_1.func(`
    //#r "System.Core.dll"
    //#r "System.Data.dll"
    //#r "System.Data.DataSetExtensions.dll"
    //#r "System.Runtime.Serialization.dll"
    //#r "System.ServiceModel.dll"
    //#r "System.Xml.dll"
    //#r "System.Xml.Linq.dll"
    //#r "System.Text.Encoding.Extensions.dll"

    //#r "System.Web.Extensions.dll"
    //#r "${MgRequesterDll}"

    using System;
    using System.Dynamic;
    using System.Threading.Tasks;
    using System.Web.Script.Serialization;
    using MagicXpa.Requester.Programs;

    async (dynamic input) =>
    {
        dynamic instance = new ExpandoObject();

        instance.createRequestsFactory = (Func<object,Task<object>>)(
            async (dynamic i) =>
            {
                //Console.Write(i.address);
                var requestsFactory = RequestsFactory.GetInstance(i.address);
                return new {
                    getSyncMGRequest = (Func<object,Task<object>>)(
                        async (dynamic i2) =>
                        {
                            var request = requestsFactory.GetSyncMGRequest(i2.application, i2.program);
                            return new {
                                getMessageId = (Func<object,Task<object>>)(
                                    async (dynamic i3) =>
                                    {
                                        return request.MessageId;
                                    }
                                ),
                                addArgument = (Func<object,Task<object>>)(
                                    async (dynamic i3) =>
                                    {
                                        if(i3.type == "Whatever") {
                                            request.AddArgument(i3.argument, EArgType.tWhatever);
                                        }
                                        else if(i3.type == "Alpha") {
                                            request.AddArgument(i3.argument, EArgType.tAlpha);
                                        }
                                        else if(i3.type == "Unicode") {
                                            request.AddArgument(i3.argument, EArgType.tUnicode);
                                        }
                                        else if(i3.type == "Int64") {
                                            request.AddArgument(i3.argument, EArgType.tInt64);
                                        }
                                        else if(i3.type == "Int32") {
                                            request.AddArgument(i3.argument, EArgType.tInt32);
                                        }
                                        else if(i3.type == "Double") {
                                            request.AddArgument(i3.argument, EArgType.tDouble);
                                        }
                                        else if(i3.type == "Boolean") {
                                            request.AddArgument(i3.argument, EArgType.tBoolean);
                                        }
                                        else if(i3.type == "Date") {
                                            request.AddArgument(i3.argument, EArgType.tDate);
                                        }
                                        else if(i3.type == "Time") {
                                            request.AddArgument(i3.argument, EArgType.tTime);
                                        }
                                        else if(i3.type == "BLOB") {
                                            request.AddArgument(i3.argument, EArgType.tBLOB);
                                        }
                                        else {
                                            request.AddArgument(i3.argument);
                                        }
                                        return null;
                                    }
                                ),
                                getOutput = (Func<object,Task<object>>)(
                                    async (dynamic i3) =>
                                    {
                                        UnsafeByteArray ubArray = (UnsafeByteArray)request.GetOutput();
                                        if(ubArray != null) {
                                            var buffer = new byte[ubArray.GetSize()/2+1];
                                            for(var idx=0; idx < ubArray.GetSize() / 2; idx++) {
                                                buffer[idx] = ubArray[(idx+1)*2 -2];
                                            }
                                            return buffer;
                                        }
                                        else {
                                            return null;
                                        }
                                    }
                                ),
                                getReturnValue = (Func<object,Task<object>>)(
                                    async (dynamic i3) =>
                                    {
                                        return request.GetReturnValue();
                                    }
                                ),
                                getReturnedVariables = (Func<object,Task<object>>)(
                                    async (dynamic i3) =>
                                    {
                                        return request.GetReturnedVariables();
                                    }
                                ),
                                getReturnedArgument = (Func<object,Task<object>>)(
                                    async (dynamic i3) =>
                                    {
                                        return request.GetReturnedArgument(i3);
                                    }
                                ),
                                execute = (Func<object,Task<object>>)(
                                    async (dynamic i3) =>
                                    {
                                        request.Execute();
                                        return null;
                                    }
                                ),
                                dispose = (Func<object,Task<object>>)(
                                    async (dynamic i3) =>
                                    {
                                        request.Dispose();
                                        return null;
                                    }
                                )
                            };
                        }
                    ),

                    dispose = (Func<object,Task<object>>)(
                        async (dynamic i2) =>
                        {
                            requestsFactory.Dispose();
                            return null;
                        }
                    )
                };
            }
        );

        return instance;
    }
`);
//# sourceMappingURL=MgRequester.js.map