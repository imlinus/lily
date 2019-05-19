# Portr

🌌🚪 Check if port is available, otherwise suggest nearby

Note: This is version `0.0.2`, though it seems to work quite nicely.


### Setup
```
$ npm i -S portr
```

```js
const portr = require('portr')
const port = 1234

portr(port).then(port => {
  console.log('First available port', port) // 1235
})
```

Normally it checks the assigned port, plus the next ascending 5 ones.

Though you can change the limit by simply adding another parameter.

I.e. `portr(8080, 20)`


Cheers,

imlinus
