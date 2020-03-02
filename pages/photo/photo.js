// camera.js
Page({
  data: {
    openid: '',
    userName:""
  },
  onLoad: function () {
    this.getOpenid();
  },
  // 获取用户openid
  getOpenid() {
    let that = this;
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
        console.log('云函数获取到的openid: ', res.result.openId)
        var openid = res.result.openId;
        that.setData({
          openid: openid
        })
      }
    })
  },
  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  loginBtnClick: function (e) {
    let userName = this.data.userName
    console.log("用户名：" + userName);
  },
       
  xuanzezp(){
    let that=this
    wx.chooseImage({
      count: 1,
      sizeType:["compressed"],
      sourceType:['camera'],
      success(res){
        const tempFilePaths = res.tempFilePaths
        console.log("临时链接",tempFilePaths)
        that.uploadFile(tempFilePaths[0])
      }

    })
  },
  
  
  
  //上传云图片到云存储
  uploadFile(tempFile){
    let userName = this.data.userName
    wx.cloud.uploadFile({
      cloudPath: this.data.userName + ".jpg", 
      filePath: tempFile,
      success: res=>{
        console.log("上传图片成功", res.fileID)
      },
      fail:err=>{
        console.log("上传图片失败",err)
      }
    })
  }
})