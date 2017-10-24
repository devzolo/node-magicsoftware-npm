### Installation Windows

```bash
npm install magicsoftware
```

## Quick Examples

```javascript

import {
    MagicRequester, 
    MagicException,
    MagicVariable,
    MagicAlpha,
    MagicNumeric,
    MagicLogical,
    MagicDate,
    MagicTime,
    MagicBlob,
    MagicVariant
} from "magicsoftware/requester"

var requester = new MagicRequester("Teste", "localhost/5115");
var v_example = new MagicAlpha("TESTE");

requester.callByName("TEST", [v_example], function(err, result) {
    if(err) {
        console.log(err);   
    }
    else {
        console.log("v_example = " + v_example);
        console.log("result =  " + result);
    }
});

```