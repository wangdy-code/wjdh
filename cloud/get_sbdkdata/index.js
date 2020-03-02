// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const _ = db.command
  return await cloud.database().collection('sb-dk').limit(10000).where(_.and([
    {
      date: _.gte(event.start_date)
    },
    {
      date: _.lte(event.end_date)
    }
  ])).get();

}
