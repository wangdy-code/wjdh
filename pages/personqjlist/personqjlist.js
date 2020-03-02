// pages/personqjlist/personqjlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOpenid()
    console.log(options)
    this.setData({
      openid:options.openid
    })
    if (this.data.openid == "") {
      console.log('kong')
    } else if (this.data.openid) {
      wx.cloud.callFunction({
        name: 'get_personqjdata',
        data: {
          _openid: this.data.openid
        },
        success: res => {
          console.log('result: ', res.result)
          var list = res.result.data

          for (var i = 0; i < list.length; i++) {
            if (list[i].qj == 'A') {
              list[i].qj = '病假' + '-' + list[i].name
            } else if (list[i].qj == 'B') {
              list[i].qj = '事假' + '-' + list[i].name
            } else if (list[i].qj == 'C') {
              list[i].qj = '丧假' + '-' + list[i].name
            } else if (list[i].qj == 'D') {
              list[i].qj = '婚假' + '-' + list[i].name
            } else if (list[i].qj == 'E') {
              list[i].qj = '产假' + '-' + list[i].name
            }
            list[i].start_time = list[i].start_time.substring(5, 10)
            list[i].end_time = list[i].end_time.substring(5, 10)
            list[i].creatTime = list[i].creatTime.substring(0, 10)
            list[i].content = list[i].start_time + '——' + list[i].end_time
            
          }
          for (var i = 0; i < list.length; i++) {
            if(list[i]._openid!=this.data.openid){
              list.splice(i,1)
            }
          }
          this.setData({
            list: res.result.data
          })
        }
      })
    }
    
    
    
    
    


  },
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})