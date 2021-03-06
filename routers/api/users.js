/**
 * Created by wangkai on 2019/4/1
 */
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const saltRounds = 10;
const { privateKey } = require('config/common');
const router = express.Router();
const User = require('models/User');
router.get('/test', (req, res) => {
  res.json({ code: 0, data: {}, msg: '成功' });
});

router.post('/register', (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then(
      user => {
        if (user) {return res.json({ code: 10000, data: {}, msg: '邮箱已被注册' });}
        bcrypt.hash(password, saltRounds).then(
          hash => {
            // 这里 d:'mm' 是什么意思？
            const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });
            return User.create({ ...req.body, password: hash, avatar });
          },
          err => Promise.reject(err)
        ).then(
          user => res.json({ code: 0, data: { ...user.toObject() }, msg: '成功' }),
          err => console.log(err)
        );
      },
      err => console.log(err)
    );
});
router.post('/login', (req, res) => {
  const { email, password, username } = req.body;
  User.findOne({ email })
    .then(
      user => {
        if (!user) {return res.json({ code: 10000, data: {}, msg: '邮箱未注册' });}
        const { password: hash, date, ...rest } = user.toObject();
        if (rest.username !== username) {
          return res.json({ code: 10000, data: {}, msg: '用户名错误' });
        }
        bcrypt.compare(password, hash).then(
          isMatch => {
            if (isMatch) {
              const token = jwt.sign(rest, privateKey, { expiresIn: '2h' });
              user.token = token;
              user.save();
              res.json({ code: 0, data: { ...rest, token }, msg: '成功' });
            } else {
              res.json({ code: 0, data: {}, msg: '密码错误' });
            }
          }
        );
      },
      err => console.log(err)
    );
});
router.get('/authentication',(req,res) => {
  const {password,date,...rest} = req.user
  const newToken = jwt.sign(rest,privateKey,{expiresIn: '2h'})
  User.findById(rest.id)
    .then(
      user => {
        user.token = newToken;
        user.save();
        res.json({code: 0,data: {token: newToken,...rest},msg:'成功'});
      },
      err => console.log(err)
    )
})
router.post('/logout', (req, res) => {
  User.findByIdAndUpdate(req.user.id)
    .then(
      user => {
        user.token = 0;
        return user.save();
      }
    )
    .then(
      () => res.json({ code: 0, data: {}, msg: '成功' })
    ).catch(err => console.log(err));
});

module.exports = router;
