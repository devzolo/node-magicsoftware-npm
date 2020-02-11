export declare class MagicTools {
    private mgDir;
    constructor(mgDir: string);
    /**
     * Creating a cabinet file without using the Studio  (Since version: 3.1)
     * You can also create a cabinet file using the MgxpaSettings utility. This utility lets you create cabinet files from the project sources without using the Studio. This functionality is often required if you create the cabinet files in a customer location where you do not have the Studio installed.
     * @param {string} edpPath - The file path of the source .edp file.
     * @param {string} ecfPath - The destination path of the .ecf file (optional). If not specified, the .ecf file will be created in the same folder as the .edp file.
     */
    createECF(edpPath: string, ecfPath?: string): Promise<{
        code: number;
        data: string;
    }>;
    /** Command Line Requester, Version Magic xpa 3.2e-0 12-345-6789
     *
     *	-APPNAME -PRGNAME : Application and program names
     *	[-ARGUMENTS  ]    : Program arguments, separated by commas
     *	[-VARIABLES  ]    : Named variables, separated by commas
     *	[-PRIORITY   ]    : Priority of execution (0 - 9)
     *	[-USERNAME   ]    : Username required by the application
     *	[-PASSWORD   ]    : Password required by the application or by the Broker
     *	CTXS      : (host/port) Contexts supported by the Magic xpa Server
     *	QUEUE     : [(appname)] Requests in queue
     *	LOG       : [(appname)][=reqid[-reqid]] Historic information
     *	LOAD      : [(appname)] Statistics about application or the Broker
     *	PENDING   : =<reqid> : Number of requests pending before the request
     *	-REQID      : =<reqid> : Request manipulation (priority, removal)
     *	-CLEAR      : Removing a request from the queue
     *	-EXE        : =<ExeEntry>[/<args>] Activating an executable by the Broker
     *	-TERMINATE  : Termination requests -
     *	ALL       : all Magic xpa Servers, including the Broker
     * 	RTS       : all Magic xpa Servers, but not the Broker
     * 	host/port : a specific Magic xpa Server
     *	TIMEOUT   : terminate the engine within this time period (seconds)
     *
     *	Examples : -QUERY=RT      -QUERY=RT(Pet Shop Demo)   -QUERY=APP(my_server/1500)
     *			-QUERY=QUEUE   -QUERY=LOG=100-90          -QUERY=LOAD(Pet Shop Demo)
     *			-EXE=Background//LoadBalancingPriority=5
     *			-TERMINATE=ALL    -TERMINATE=my_server/1500
     *			-CLEAR -REQID=1
     */
    rqcmdl(args?: string[]): Promise<{
        code: number;
        data: string;
    }>;
}
//# sourceMappingURL=MagicTools.d.ts.map