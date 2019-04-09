/**
 * Created by wangkai on 2019/4/3
 * 常用工具函数
 */
/**
 * 在转换为json和object的时候，将_id改为id,并且删除__v属性
 */
const omitPrivate = (doc, obj) => {
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj;
};
const options = {
  toObject: {
    transform: omitPrivate
  },
  toJSON: {
    transform: omitPrivate
  }
};

module.exports = options;
