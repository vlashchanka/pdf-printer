'use strict';

let express = require('express');
let app = express();

app.use('/print', require('./printer').router);

let port = process.env.PORT || 3000;
app.set('port', port);

app.listen(app.get('port'), () => {
  console.log(`PDF printer was started on port ${app.get('port')}`);
});
