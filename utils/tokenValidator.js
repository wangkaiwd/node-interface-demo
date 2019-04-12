/**
 * Created by wangkai on 2019-04-08
 * token校验
 */

const User = require('models/User');
const jwt = require('jsonwebtoken');
const { privateKey } = require('config/common');
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
  const token = req.get('authorization');
  if (!token) {res.status(401).json({ code: 10000, dat: {}, msg: 'there is no token, please to login' });}
  // 退出之后token变为0，就查询到内容
  User.findOne({ token })
    .then(
      user => {
        if (user) {
          // 即使查到了用户，但是也有可能token失效
          jwt.verify(token, privateKey, (error, decode) => {
            if (error) {
              res.status(401).json({ code: 0, data: {}, msg: 'token error' });
            }
            req.user = user.toObject();
            next();
          });
        } else {
          res.status(401).json({ code: 10000, data: {}, msg: '用户身份失效' });
        }
      },
      err => console.log(err)
    );
};
module.exports = tokenValidator;
