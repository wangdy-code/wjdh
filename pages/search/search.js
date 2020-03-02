// pages/search/search.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    date:"",
    zt:"",
    openid:"",
    search_list:[],
    start_date: '',
    end_date: '2019-12-30',
    dk_data:[],
    sbdk_data:"",
    xbdk_data:"",
    themeArr: { date: '日期',location: "地点" ,name:"姓名",time:"时间"},
    itemArr: ""

  },
  bindDateChange(e) {
    let that = this;
    console.log(e.detail.value)
    that.setData({
      start_date:e.detail.value
    })
  },
  bindDateChange1(e) {
    let that = this;
    console.log(e.detail.value)
    that.setData({
      end_date: e.detail.value
    })
  },
  search_btn: function (e) {
    if(this.data.start_date==""||this.data.end_start||this.data.start_date>this.data.end_date){
      wx.showModal({

        title: '提示',

        content: '请检查您的日期是否输入正确',


      })
    }else{
      let that = this
      const db = wx.cloud.database()
      const _ = db.command
      db.collection('sb-dk')
        .orderBy('date', 'desc')
        .where(_.and([
        {
          name: this.data.name
        },
        {
          date: _.gte(this.data.start_date)
        },
        {
          date: _.lte(this.data.end_date)
        }
      ])).field({
        name: true,
        location: true,
        date: true,
        time: true
      }).get().then(res => {
        console.log(res)
        console.log(res.data)
        var count = 0;
        for (var key in res.data) {
          console.log(key + '=' + res.data[key]);
          count++;
        }
        console.log("dic length=" + count);// 这样是才可以取到字典的长度
        for (var key in res.data) {
          delete res.data[key]._id


        }

        this.setData({
          sbdk_data: res.data
        })
        console.log('sbdk', this.data.sbdk_data)
        console.log('item1', this.data.itemArr)
      },
        err => {
          wx.showToast({
            title: '查询失败',
          })
        })

        
    
      //下班打卡查询
      db.collection('xb-dk')
        .orderBy('date', 'desc')
        .where(_.and([
        {
          name: this.data.name
        },
        {
          date: _.gte(this.data.start_date)
        },
        {
          date: _.lte(this.data.end_date)
        }
      ])).field({
        name: true,
        location: true,
        date: true,
        time: true
      }).get().then(res => {
          console.log(res)
          var count = 0;
          for (var key in res.data) {
            console.log(key + '=' + res.data[key]);
            count++;
          }
          console.log("dic length=" + count);// 这样是才可以取到字典的长度
          for (var key in res.data) {
            delete res.data[key]._id


          }
          this.setData({
            xbdk_data: res.data,
          })
          this.data.itemArr = this.data.sbdk_data.concat(this.data.xbdk_data)
          this.setData({
            itemArr: this.data.itemArr
          })
          console.log('xbdk', this.data.xbdk_data)
          console.log('item2', this.data.itemArr)
        },
        err => {
          wx.showToast({
            title: '查询失败',
          })
        })
      
        
      



    }
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var DATE = util.formatDate(new Date());

    this.setData({

      start_date: DATE,
      end_date:DATE

    });
    
    let that = this
    this.getOpenid();
    wx.cloud.init({
      env: 'wdy-zy'
    });
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
        console.log(res.data)
        that.setData({
          name: res.data[0].name,
          phone: res.data[0].phone
        })
      }





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
    that.onLoad()
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