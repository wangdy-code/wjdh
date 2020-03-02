// pages/ft/ft.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    date:"",
    time:"",
    theme:"",
    content:"",
    manager:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOpenid();
    
    var DATE = util.formatDate(new Date());
    wx.cloud.init({
      env: 'wdy-zy'
    });
    const db = wx.cloud.database()
    let that = this

    db.collection('user-data').where({
      _openid: this.data.openid,// 填入当前用户 openid

    }).get().then(res => {
      console.log(res.data)
      this.setData({
        name:res.data[0].name,
        date:DATE,
        manager:res.data[0].manager
      })
    })
  },
  addwork(e){
    let that = this
    var TIME = util.formatTime(new Date());
    this.setData({
      theme:e.detail.value.theme,
      content:e.detail.value.content,
      time:TIME
    })
    console.log(this.data)
    if (this.data.theme != "" && this.data.content != ""&&this.data.manager==true){
      const db = wx.cloud.database()
      db.collection('gzhb').add({
        data: {
          name: this.data.name,
          date: this.data.date,
          time: this.data.time,
          manager:true,
          report: {
            theme: this.data.theme,
            content: this.data.content
          }
        },
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id

          wx.showToast({
            title: '已发布',
          })
          console.log('[数据库] [上传工作信息] 成功，记录 _id: ', res._id)
          wx.navigateTo({
            url: "../worklist/worklist"
          })
        },
        false: err => {
          wx.showToast({
            title: '发布失败',
          })
          console.log('[数据库] [上传工作信息] 失败')
        }
      })
    }
    if(this.data.theme!=""&&this.data.content!=""&&this.data.manager==false){
      const db = wx.cloud.database()
      db.collection('gzhb').add({
        data: {
          name: this.data.name,
          date: this.data.date,
          time: this.data.time,
          manager:false,
          report: {
            theme: this.data.theme,
            content: this.data.content
          }
        },
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id

          wx.showToast({
            title: '已发布',
          })
          console.log('[数据库] [上传工作信息] 成功，记录 _id: ', res._id)
          wx.navigateTo({
            url: "../worklist/worklist"
          })
        },
        false: err => {
          wx.showToast({
            title: '发布失败',
          })
          console.log('[数据库] [上传工作信息] 失败')
        }
      })
    }else{
      wx.showToast({
        title: '请填写内容',
        icon:"none"
      })
    }
    
    
  },
  bindDateChange(e){
    this.setData({
      date : e.detail.value
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