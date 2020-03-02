// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const _ = db.command
  return await cloud.database().collection('gzhb').orderBy('time', 'desc').skip(event.count).where({
    date:event.date,
    manager:event.manager
  }).get();
}