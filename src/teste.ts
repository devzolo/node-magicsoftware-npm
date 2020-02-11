import { MagicTools, MagicRequesterCmdl } from '.';

const tools = new MagicTools('C:/Program Files (x86)/MSE/Magic xpa 3.2/');

const cmdl = new MagicRequesterCmdl(tools);

(async (): Promise<void> => {
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
      data.map(async server => {
        if (server.aplication == 'CGPortalColaborativo') {
          try {
            await cmdl.terminate(server.server);
          } catch (e) {
            console.log(e.toString());
          }
        }
      });
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
})();
