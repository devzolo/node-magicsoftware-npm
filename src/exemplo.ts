import { MagicRequester, MagicAlpha } from './requester';

const requester = new MagicRequester('localhost');
const request = requester.getSyncRequest('Example', 'PROGRAM');
try {
  request.execute({ teste: new MagicAlpha('teste') });
  console.log(request.getOutput());
} catch (e) {
  console.error(e.Code, e.Description);
}
