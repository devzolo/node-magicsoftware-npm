import { MagicTools } from './MagicTools';
import * as os from 'os';
import { MagicCmdlError } from './MagicCmdlError';

interface GetServersRowType {
  index: number;
  aplication: string;
  server: string;
  ip: string;
  pid: string;
  status: string;
  current: string;
  peak: string;
  max: string;
  contexts: string;
  requests: string;
}

interface GetRequestsQueueRowType {
  index: number;
  application: string;
  server: string;
  ip: string;
  status: string;
  current: string;
  peak: string;
  max: string;
  contexts: string;
  requests: string;
  pid: string;
}

export class MagicRequesterCmdl {
  private tools: MagicTools;
  constructor(tools: MagicTools, private host = '', private password = '') {
    this.tools = tools;
  }

  public setHost(host: string): void {
    this.host = host;
  }

  public setPassword(password: string): void {
    this.password = password;
  }

  public async getServers(): Promise<Array<GetServersRowType>> {
    const result: Array<GetServersRowType> = [];

    const cmdl = `${this.host ? '-HOST=' + this.host : ''} -QUERY=RT`;

    await this.tools
      .rqcmdl([cmdl])
      .then(res => {
        //result = res.data;
        console.log(res.data);
        const lines = res.data.split(os.EOL);
        const serverLines = lines.slice(7);
        serverLines.pop();
        for (const line of serverLines) {
          //console.log("line = ",line);
          const data = line.match(
            /([\w\s]+)\|(?:\s+)?([\w\-\/]+)\s+([\w\-\/.]+)\s+(\w+.)\s+([\w\s]+):\s([\w\s]+\s\|[\w]+|[\w]+)\s\s([\w\s]+\s\|[\w]+|[\w\s]+)\s\s([\w\s]+\s\|[\w]+|[\w]+)\s+,\s+(\w+)\s+,\s+(\w+)\s+\|([\w\s]+)/,
          );
          //console.log(data);

          if (data) {
            const index = Number(data[1]);
            const server = data[2]?.trim() ?? '';
            const ip = data[3]?.trim() ?? '';
            const pid = data[4]?.trim() ?? '';
            const status = data[5]?.trim() ?? '';
            const current = data[6]?.trim() ?? '';
            const peak = data[7]?.trim() ?? '';
            const max = data[8]?.trim() ?? '';
            const contexts = data[9]?.trim() ?? '';
            const requests = data[10]?.trim() ?? '';
            const aplication = data[11]?.trim() ?? '';

            result.push({
              index: index,
              aplication: aplication,
              server: server,
              ip: ip,
              pid: pid,
              status: status,
              current: current,
              peak: peak,
              max: max,
              contexts: contexts,
              requests: requests,
            });
          }
        }
      })
      .catch(e => {
        const lines = e.data.split(os.EOL);

        const brokerInfo = lines[2].match(/[^\(]+\(([\s\S]+)\)/);
        const brokerHostPort = brokerInfo[1];
        const brokerHostPortData = brokerHostPort.match(/([\s\S]+)\/([\s\S]+)/);
        const brokerHost = brokerHostPortData[1];
        const brokerPort = brokerHostPortData[2];

        const errorLines = lines.slice(6);
        const error = errorLines.join(os.EOL).trim();
        const errorData = error.split('"');
        const errorMessage = errorData[1];
        const errorCode = Number(errorData[2].replace(/[^\d-]/g, ''));

        throw new MagicCmdlError(errorMessage, errorCode, brokerHost, brokerPort);
      });

    return result;
  }

  //[(appname)] Requests in queue
  public async getRequestsQueue(): Promise<Array<GetRequestsQueueRowType>> {
    const result: Array<GetRequestsQueueRowType> = [];

    const cmdl = `${this.host ? '-HOST=' + this.host : ''} -QUERY=QUEUE`;

    await this.tools
      .rqcmdl([cmdl])
      .then(res => {
        //result = res.data;
        console.log(res.data);
        const lines = res.data.split(os.EOL);
        const serverLines = lines.slice(7);
        serverLines.pop();
        for (const line of serverLines) {
          //console.log("line = ",line);
          const data = line.match(
            /([\w\s]+)\|(?:\s+)?([\w\-\/]+)\s+([\w\-\/.]+)\s+(\w+.)\s+([\w\s]+):\s([\w\s]+\s\|[\w]+|[\w\s]+)\s\s([\w\s]+\s\|[\w]+|[\w\s]+)\s\s([\w\s]+\s\|[\w]+|[\w\s]+)\s+,\s+(\w+)\s+,\s+(\w+)\s+\|([\w\s]+)/,
          );
          //console.log(data);
          if (data) {
            const index = Number(data[1]);
            const server = data[2]?.trim() ?? '';
            const ip = data[3]?.trim() ?? '';
            const pid = data[4]?.trim() ?? '';
            const status = data[5]?.trim() ?? '';
            const current = data[6]?.trim() ?? '';
            const peak = data[7]?.trim() ?? '';
            const max = data[8]?.trim() ?? '';
            const contexts = data[9]?.trim() ?? '';
            const requests = data[10]?.trim() ?? '';
            const application = data[11]?.trim() ?? '';

            result.push({
              index: index,
              application: application,
              server: server,
              ip: ip,
              pid: pid,
              status: status,
              current: current,
              peak: peak,
              max: max,
              contexts: contexts,
              requests: requests,
            });
          }
        }
      })
      .catch(e => {
        const lines = e.data.split(os.EOL);
        const requestInfo = lines[2].match(/[^\(]+\(([\s\S]+)\)/);
        const requestInfoData = requestInfo[1];
        const requestData = requestInfoData.match(/([\s\S]+)\/([\s\S]+),\s([\s\S]+)/);

        const brokerHost = requestData[1];
        const brokerPort = requestData[2];
        const requestTime = requestData[3];

        const errorLines = lines.slice(6);
        const error = errorLines.join(os.EOL).trim();
        const errorData = error.split('"');
        const errorMessage = errorData[1];
        const errorCode = Number(errorData[2].replace(/[^\d-]/g, ''));

        throw new MagicCmdlError(errorMessage, errorCode, brokerHost, brokerPort, requestTime);
      });

    return result;
  }

  public async terminate(type: string): Promise<Array<unknown>> {
    const result: Array<unknown> = [];

    const cmdl = `${this.host ? ' -HOST=' + this.host : ''}${
      this.password ? ' -PASSWORD=' + this.password : ''
    } -TERMINATE=${type}`;

    await this.tools
      .rqcmdl([cmdl])
      .then(res => {
        console.log(res);
      })
      .catch(e => {
        const lines = e.data.split(os.EOL);
        const errorLines = lines;
        const error = errorLines.join(os.EOL).trim();
        const errorData = error.split('"');
        const errorMessage = errorData[1];
        const errorCode = Number(errorData[2].replace(/[^\d-]/g, ''));

        throw new MagicCmdlError(errorMessage, errorCode);
      });

    return result;
  }

  public async exe(exeEntry: string): Promise<Array<unknown>> {
    const result: Array<unknown> = [];

    const cmdl = `${this.host ? ' -HOST=' + this.host : ''}${
      this.password ? ' -PASSWORD=' + this.password : ''
    } -EXE=${exeEntry}`;

    await this.tools
      .rqcmdl([cmdl])
      .then(res => {
        console.log(res);
      })
      .catch(e => {
        const lines = e.data.split(os.EOL);
        const error = lines[1];
        const errorData = error.split('"');
        const errorMessage = errorData[1];
        const errorCode = Number(errorData[2].replace(/[^\d-]/g, ''));

        throw new MagicCmdlError(errorMessage, errorCode);
      });

    return result;
  }
}
