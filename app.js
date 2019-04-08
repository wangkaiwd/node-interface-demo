require('./utils/pathAlias');
require('utils/mongoConnect');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const User = require('models/User');
const app = express();
const PORT = 5000;

const whiteList = {
  get: [],
  post: ['/users/login', '/users/register']
};
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(passport.initialize());
app.use('/api', (req, res, next) => {
  // const method = req.method.toLocaleLowerCase();
  const { method, url } = req;
  if (whiteList[method.toLowerCase()].includes(url)) return next();
  const clientToken = req.get('authorization');
  User.findOne({ token: clientToken })
    .then(
      user => {
        console.log('user', user);
        if (user) {
          passport.authenticate('jwt', { session: false });
          next();
        } else {
          res.status(401).json({ code: 10000, data: {}, msg: '用户身份失效' });
        }
      },
      err => console.log(err)
    );
});
require('utils/passport');
app.use('/api/users', require('routers/api/users'));
app.use('/api/profiles', require('routers/api/profiles'));

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});

