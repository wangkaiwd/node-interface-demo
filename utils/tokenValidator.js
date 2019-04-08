/**
 * Created by wangkai on 2019-04-08
 * token校验
 */

const passport = require('passport');
const User = require('models/User');
const whiteList = {
  get: [],
  post: ['/users/login', '/users/register']
};
/**
 * token验证中间件：根据白名单过滤，将剩余接口进行token验证
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const tokenValidator = (req, res, next) => {
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
};
module.exports = tokenValidator;
