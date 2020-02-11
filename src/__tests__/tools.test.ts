import path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.test') });
import { MagicTools, MagicRequesterCmdl, MagicCmdlError } from '../tools';

describe('MagicTools Test', () => {
  const TIMEOUT = 60 * 1000;

  const magicXpaDir: string = process.env.MAGIC_XPA_DIR as string;
  expect(magicXpaDir).not.toBeUndefined();
  expect(magicXpaDir).not.toBeNull();

  const tools = new MagicTools(magicXpaDir);

  it(
    'Create ECF from EDP',
    async () => {
      const edpPath = path.resolve(__dirname, 'example', 'ExampleApp', 'ExampleApp.edp');
      const result = await tools.createECF(edpPath);
      expect(result.code).toBe(0);

      await tools.createECF('InvalidExampleApp.edp').catch(err => {
        expect(err).toEqual({ code: 1, message: 'Magic xpa project file (edp) does not exist.' });
      });
    },
    TIMEOUT,
  );

  it(
    'Requester Commandline Test',
    async () => {
      const cmdl = new MagicRequesterCmdl(tools);
      expect(cmdl).not.toBeNull();

      await cmdl
        .getServers()
        .then(servers => {
          servers.forEach(server => {
            console.log(server);
          });
        })
        .catch(err => {
          expect(err).toBeInstanceOf(MagicCmdlError);
        });
    },
    TIMEOUT,
  );
});
