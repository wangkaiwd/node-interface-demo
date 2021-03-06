require('./utils/pathAlias');
require('utils/mongoConnect');
const express = require('express');
const bodyParser = require('body-parser');
const tokenValidator = require('utils/tokenValidator');
const app = express();
const PORT = 5000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use('/api', tokenValidator);
app.use('/api/users', require('routers/api/users'));
app.use('/api/profiles', require('routers/api/profiles'));

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});

