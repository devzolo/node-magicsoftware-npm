import { spawn, exec } from 'child_process';
import path from 'path';
import fs from 'fs';

//var Q = require('q');
//var os = require('os');
//var events = require('events');

/*
(function() {
    var childProcess = require("child_process");
    var oldSpawn = childProcess.spawn;
    function mySpawn() {
        console.log('spawn called');
        console.log(arguments);
        var result = oldSpawn.apply(this, arguments);
        return result;
    }
    childProcess.spawn = mySpawn;
})();
*/

export class MagicTools {
  constructor(private mgDir: string) {}

  /**
   * Creating a cabinet file without using the Studio  (Since version: 3.1)
   * You can also create a cabinet file using the MgxpaSettings utility. This utility lets you create cabinet files from the project sources without using the Studio. This functionality is often required if you create the cabinet files in a customer location where you do not have the Studio installed.
   * @param {string} edpPath - The file path of the source .edp file.
   * @param {string} ecfPath - The destination path of the .ecf file (optional). If not specified, the .ecf file will be created in the same folder as the .edp file.
   */
  public async createECF(edpPath: string, ecfPath?: string): Promise<{ code: number; data: string }> {
    //Syntax: MgxpaSettings.exe [/CreateECF edp_path=xxx [,ecf_path=yyy]]
    //Example: MgxpaSettings.exe /CreateECF edp_path=c:\myapp\myapp.edp ,ecf_path=c:\myapp\app.
    //http://kb.magicsoftware.com/articles/bl_Reference/MgxpaSettings-Utility-xpa-3x
    //http://kb.magicsoftware.com/articles/bl_Reference/Command-Line-Options-xpa-3x
    const toolExe = 'MgxpaSettings.exe';

    return new Promise((resolve, reject) => {
      console.log(edpPath);
      const edpFileExists = fs.existsSync(edpPath);
      if (!edpFileExists) {
        reject({ code: 1, message: 'Magic xpa project file (edp) does not exist.' });
        return;
      }

      const ecfDirExists = fs.existsSync(path.dirname(ecfPath ?? edpPath));
      if (!ecfDirExists) {
        reject({ code: 1, message: 'Error in opening file for saving.' });
        return;
      }

      const tool = path.resolve(this.mgDir, toolExe);
      const cp = exec(`"${tool}" /CreateECF edp_path=${edpPath}${(ecfPath && ` ,ecf_path=${ecfPath}`) ?? ''}`);

      const result = { code: 0, data: '' };

      cp.stdout?.on('data', data => {
        result.data = data.toString();
      });

      cp.stderr?.on('data', data => {
        result.data = data.toString();
      });

      cp.on('error', err => {
        reject(new Error(toolExe + ' failed. ' + err.message));
      });

      cp.on('close', (code, signal) => {
        signal;
        result.code = code;
        if (code != 0) {
          reject(result);
        } else {
          resolve(result);
        }
      });
    });
  }

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
  public async rqcmdl(args?: string[]): Promise<{ code: number; data: string }> {
    const toolExe = 'MGrqcmdl.exe';
    //let toolPath = path.join(this.mgDir, toolExe).replace(/\\/g,"/");

    return new Promise((resolve, reject) => {
      //const cp = spawn(toolExe, args || [], { cwd: `${this.mgDir}`, stdio: ['pipe', 'pipe', 'ignore'] });
      const cp = spawn(toolExe, args || [], { cwd: `${this.mgDir}`, stdio: ['pipe', 'pipe', 'pipe'] });

      const result = { code: 0, data: '' };

      cp.stdout?.on('data', function(data) {
        result.data = data.toString();
      });

      cp.stderr?.on('data', function(data) {
        result.data = data.toString();
      });

      cp.on('error', function(err) {
        reject(new Error(toolExe + ' failed. ' + err.message));
      });

      cp.on('close', function(code, signal) {
        signal;
        result.code = code;
        if (code != 0) {
          reject(result);
        } else {
          resolve(result);
        }
      });
    });

    /*
        return new Promise((resolve, reject) => {
            exec("MGrqcmdl.exe", { cwd: this.mgDir }, (error, stdout, stderr) => {
                if (error) resolve(stderr);
                else resolve(stdout);
            });
        });
        */
  }
}

/*

    var outFile = __dirname+'/out.log';
    var errFile = __dirname+'/err.log';
    var out = fs.openSync(outFile, 'a');
    var err = fs.openSync(errFile, 'a');

    var init = spawn('dir', [ '.' ], {stdio: [ 'ignore', out, err ]});
    init.on('stdout', function(data) {
         //DO SOMETHING
    });
    init.on('stderr',function (err) {
         //DO SOMETHING
    });
    init.on('close', function (code) {
        try {
            if (fs.existsSync(errFile)) {
                init.emit('stderr', fs.readFileSync(errFile));
                fs.closeSync(err);
                fs.unlinkSync(errFile)
            }
            if (fs.existsSync(outFile)) {
                init.emit('stdout', code, fs.readFileSync(outFile));
                fs.closeSync(out);
                fs.unlinkSync(outFile)
            }
        } catch (err) {
            //DO SOMETHING
        }
    })


*/
