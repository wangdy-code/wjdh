// pages/denglu/denglu.js
var app = getApp();
Page({
  

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    phone:"",
    openid:""
  },

  dl_btn:function(e){
    if(this.data.name == 'test'&&this.data.phone =='123456'){
      wx.reLaunch({
        url:"../test1/test1"
      })
    } else if (this.data.name == 'test' && this.data.phone == '654321'){
      wx.reLaunch({
        url: "../test/test"
      })
    }else{
      const db = wx.cloud.database()
      db.collection('user-data').where({
        _openid: this.data.openid,// 填入当前用户 openid
        name: this.data.name,
        phone: this.data.phone,

      }).get().then(res => {
        console.log(res.data)
        console.log(this.data.name)
        console.log(this.data.phone)
        if (res.data == "" && res.data[0].admin == 0 && res.data[0].superuser == 0) {
          wx.showToast({
            title: '你不是管理员',
          })
        } else if (res.data[0].admin == 1) {
          console.log(res.data[0].name)
          wx.showLoading({
            title: '登陆中',
          })
          wx.navigateTo({
            url: '../admin/admin'
          })
        }else if (res.data[0].superuser == 1) {
          wx.showActionSheet({
            itemList: ['打卡记录', '请假记录'],
            success: (res) => {
              if (res.tapIndex == 0) {

                wx.navigateTo({
                  url: '../superuser/superuser'
                })
                
              }else if(res.tapIndex == 1){
                wx.navigateTo({
                  url: '../qjlist/qjlist'
                })
              }
            }
          })
            
          
        }else{
          wx.showToast({
            title: '你不是管理员',
            icon:"none"
          })
        }





      })
    }
    
    
  },



  /**zc_btn:function(e){
    let that = this
    console.log(this.data.kouling)
    if(this.data.kl=="万家灯火"){
      wx.reLaunch({
        url: '../kouling/kouling'
      })
    }else{
      var x = getApp().globalData.test
      wx.showToast({
        title: x,
        icon:"none"
      })
    }

  },*/
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.getOpenid();
  },
  formSubmit: function (e) {
    this.setData({
      name: e.detail.value.name,
      phone: e.detail.value.phone,
      kl:e.detail.value.kouling
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