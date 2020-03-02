// pages/qjlist/qjlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: "",
    date: "",
    count: 0,
    search:'',
  },
  onPullDownRefresh() {
    this.onShow();
    console.log("上拉刷新");
    wx.showNavigationBarLoading() //在标题栏中显示加载

  },
  search:function(e){
    console.log(e.detail.value)
    this.setData({
      search: e.detail.value
    })
  },
  
  search_btn:function(e){
    console.log(this.data.search)
    wx.showLoading({
      title: '疯狂搜索中',
    })
    wx.cloud.callFunction({
      name: 'cx_jzqj',
      data: {
        search: this.data.search,

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
          list[i].creatTime = list[i].creatTime.substring(0,10)
          list[i].content = list[i].start_time + '——' + list[i].end_time
        }
        this.setData({
          list: res.result.data
        })
        wx.hideLoading()


      }
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'admin_qjlist',
      data: {

      },
      success: res => {
        console.log('result: ', res.result)
        var list = res.result.data
        
        for(var i=0;i<list.length;i++){
          if(list[i].qj == 'A'){
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
          list[i].start_time = list[i].start_time.substring(5,10)
          list[i].end_time = list[i].end_time.substring(5, 10)
          list[i].creatTime = list[i].creatTime.substring(0, 10)
          list[i].content = list[i].start_time + '——' + list[i].end_time
        }
        this.setData({
          list: res.result.data
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