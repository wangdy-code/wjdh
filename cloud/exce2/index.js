const cloud = require('wx-server-sdk')
//这里最好也初始化一下你的云开发环境
cloud.init({
  env: "wdy-zy"
})
//操作excel用的类库
const xlsx = require('node-xlsx');

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let { userdata } = event

    //1,定义excel表格名
    let dataCVS = 'qj_data.xlsx'
    //2，定义存储数据的
    let alldata = [];
    let row = ['openid', 'name', 'qj', 'start_time', 'end_time', 'creatDate']; //表属性
    alldata.push(row);

    for (let key in userdata) {
      let arr = [];
      arr.push(userdata[key]._openid);
      arr.push(userdata[key].name);
      arr.push(userdata[key].qj);
      arr.push(userdata[key].start_time);
      arr.push(userdata[key].end_time);
      arr.push(userdata[key].creatDate);
      alldata.push(arr)
    }
    //3，把数据保存到excel里
    var buffer = await xlsx.build([{
      name: "mySheetName",
      data: alldata
    }]);
    //4，把excel文件保存到云存储里
    return await cloud.uploadFile({
      cloudPath: dataCVS,
      fileContent: buffer, //excel二进制文件
    })

  } catch (e) {
    console.error(e)
    return e
  }
}

