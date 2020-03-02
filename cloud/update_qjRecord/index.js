const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('update_qjRecord').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        creatTIme:db.serverDate(),
        superuser_name:event.superuser_name,
        desc:event.desc

      }
    })
  } catch (e) {
    console.error(e)
  }
}