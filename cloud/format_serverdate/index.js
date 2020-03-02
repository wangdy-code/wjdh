const cloud = require('wx-server-sdk')
cloud.init()
// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const $ = db.command.aggregate
  return await cloud.database().collection(qj-data).aggregate()
    .project({
      formatDate: $.dateToString({
        _id:'74b140b45e1e848901f57ea72c03eadc',
        creatTime: '$date',
        format: '%Y-%m-%d %H:%M',
      })
    })
    .end()

}
