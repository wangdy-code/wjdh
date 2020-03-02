// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const _ = db.command
  return await cloud.database().collection('qj-data').orderBy('creatTime', 'desc').where({
    date: event.date,
    isDelete:0
  }).get();
}