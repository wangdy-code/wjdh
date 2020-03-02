// pages/first/first.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: "",
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  test:function(e){
    

  },
  
  onLoad: function (options) {
    let that = this
    this.getOpenid();
    
  },

  dl_btn: function (e) {
    const db = wx.cloud.database()
    let that = this
    db.collection('is_test')
    .get().then(res => {
      console.log(res.data)
      if(res.data[0].isOpen==false){
        wx.reLaunch({
          url: '../test3/test3'
        })
      }else{
        db.collection('user-data').where({
          _openid: this.data.openid,// 填入当前用户 openid

        }).get().then(res => {
          console.log(res.data)
          console.log(this.data.name)
          console.log(this.data.phone)
          if (res.data == "") {
            wx.showToast({
              title: '请先注册',
            })
            wx.reLaunch({
              url: '../kouling/kouling'
            })
          } else {
            console.log(res.data[0].name)
            wx.showLoading({
              title: '登陆中',
            })
            wx.reLaunch({
              url: '../location/location'
            })
          }





        })
      }
    })
    

  },
  admin_login: function (e) {
    wx.reLaunch({
      url: '../denglu/denglu'
    })

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