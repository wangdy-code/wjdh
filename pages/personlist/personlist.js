// pages/worklist/worklist.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: "",
    date: "",
    openid:"",
    list_num:0

  },
  onPullDownRefresh() {
    this.onShow();
    console.log("上拉刷新");
    wx.showNavigationBarLoading() //在标题栏中显示加载

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOpenid();
    var DATE = util.formatDate(new Date());
    this.setData({
      date: DATE
    })
    let list_num = this.data.list_num+20
    wx.cloud.init({
      env: "wdy-zy",
      traceUser: true // 用户信息会显示在云开发控制台的用户面板中
    });
    const db = wx.cloud.database()
    db.collection('gzhb').where({
      _openid: this.data.openid
    }).orderBy('date', 'desc').orderBy('time', 'desc').get().then(res => {
      this.setData({
        list: res.data,
        list_num:list_num
      })
      console.log(res.data)
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
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    // 页数+1
    const db = wx.cloud.database()
    const _ = db.command
    let list_num = this.data.list_num+20
    db.collection('gzhb').where({
      
      _openid: this.data.openid
    }).orderBy('date', 'desc').orderBy('time', 'desc').skip(this.data.list_num).get().then(res => {
      if (res.data != "") {
        this.data.list = this.data.list.concat(res.data)
        this.setData({
          list: this.data.list,
          date: res.data[0].date,
          list_num:list_num
        })
        console.log(res.data[0].date)
        console.log(this.data.list)
        wx.hideLoading();
      } else if (res.data == "") {
        wx.showToast({
          title: '已无记录',
          icon: 'none'
        })
      }

    })

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})