import { MagicRequester, MagicAlpha } from '../requester';

const requester: MagicRequester = new MagicRequester('Teste', 'localhost/5115');
const vExample = new MagicAlpha('TESTE');

requester.callByName('TEST', [vExample], function(err, result) {
  if (err) {
    console.log(err);
  } else {
    console.log('v_example = ' + vExample);
    console.log('result =  ' + result);
  }
});
