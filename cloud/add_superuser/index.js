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
    return await db.collection('user-data').where({
      name:event.name
    }).update({
      // data 传入需要局部更新的数据
      data: {
        superuser: 1
      }
    })
  } catch (e) {
    console.error(e)
  }
}
