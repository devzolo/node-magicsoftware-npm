import path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.test') });
import { MagicRequester } from '../requester';

describe('MagicRequester Test', () => {
  it('The Requester could not connect to invalid broker host', () => {
    const requester = new MagicRequester('INVALID_BROKER_HOST');
    const request = requester.getSyncRequest('ExampleApplication', 'ExampleProgram');
    try {
      request.execute({});
    } catch (e) {
      expect(e.Code === -102 || e.Code === -147).toBe(true);
    }
    requester.dispose();
  });
});
