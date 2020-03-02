const cloud = require('wx-server-sdk')
//环境变量 ID
cloud.init({
  env: 'wdy-zy'
})

const db = cloud.database()
// 云函数入口函数
//传递的参数可通过event.xxx得到
exports.main = async (event, context) => {
  try {
    return await db.collection('qj-data').doc(event._id).update({
      // data 传入需要局部更新的数据
      data: {
        start_time:event.start_time,
        end_time:event.end_time,
        qj:event.qj,
        isDelete: event.isDelete
      }
    })
  } catch (e) {
    console.error(e)
  }
}
