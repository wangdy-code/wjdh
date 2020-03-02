// pages/worklist/worklist.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:"",
    date:"",
    count:0,
    manager:false

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
      date:DATE
    })
    const db = wx.cloud.database()

    db.collection('user-data').where({
      _openid: this.data.openid // 填入当前用户 openid
    }).get().then(res => {
      if (res.data == "") {
        wx.showToast({
          title: '请先上传个人信息',
          icon: 'none',
          duration: 5000
        })
      } else {
        console.log(res.data[0].name)
        this.setData({
          manager: res.data[0].manager
        })
      }
      console.log(
        this.data.manager
      )





    })
    if(this.data.manager==true){
      db.collection('gzhb').where({
        date: DATE
      }).count().then(res => {
        console.log(res.total)
        this.setData({
          count: res.total,
        })
      })
      wx.cloud.callFunction({
        name: 'search_worklist',
        data: {
          date: this.data.date,
          count: this.data.count,
        },
        complete: res => {
          console.log('result: ', res.result)
          this.setData({
            list: res.result.data
          })

        }
      })
    }else{
      db.collection('gzhb').where({
        date: DATE
      }).count().then(res => {
        console.log(res.total)
        this.setData({
          count: res.total
        })
      })
      wx.cloud.callFunction({
        name: 'search_worklist',
        data: {
          date: this.data.date,
          count: this.data.count,
          manager:false
        },
        complete: res => {
          console.log('result: ', res.result)
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
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    // 页数+1
    if(this.data.manager==true){
      wx.cloud.callFunction({
        name: 'search_worklist1',
        data: {
          date: this.data.date,
        },
        complete: res => {

          console.log('result: ', res.result)
          if (res.result.data != "") {
            this.data.list = this.data.list.concat(res.result.data)
            this.setData({
              list: this.data.list,
              date: res.result.data[0].date
            })
            console.log(res.result.data[0].date)
            console.log(this.data.list)
            wx.hideLoading();
          } else if (res.result.data == "") {
            wx.showToast({
              title: '已无记录',
              icon: 'none'
            })
          }
        }
      })
    }else{
      wx.cloud.callFunction({
        name: 'search_worklist1',
        data: {
          date: this.data.date,
          manager:false
        },
        complete: res => {

          console.log('result: ', res.result)
          if (res.result.data != "") {
            this.data.list = this.data.list.concat(res.result.data)
            this.setData({
              list: this.data.list,
              date: res.result.data[0].date
            })
            console.log(res.result.data[0].date)
            console.log(this.data.list)
            wx.hideLoading();
          } else if (res.result.data == "") {
            wx.showToast({
              title: '已无记录',
              icon: 'none'
            })
          }
        }
      })
    }
    
      

  },
  

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})