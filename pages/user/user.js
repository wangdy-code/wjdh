Page({
  data: {
    name:"",
    phone:"",
    openid:"",
    list: [{
      name: '工作汇报',
      color: 'black'
    },
    {
      name: '查询打卡记录',
      color: 'orange'
    },
    {
      name: '汇报记录',
      color: 'green'
    }, {
      name: '个人汇报记录',
      color: 'cyan'
    },
    {
      name: '请假记录',
      color: 'blue'
    },
    
    ],
    toggleDelay: false
  },
  qjlist:function(e){
    wx.navigateTo({
      url: '../personqjlist/personqjlist?openid=' + this.data.openid,
    })
  },
  onLoad: function () {
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
          phone:res.data[0].phone
        })
      }





    })
    
    this.setData({
      toggleDelay: true
    })
    setTimeout(function () {
      that.setData({
        toggleDelay: false
      })
    }, 1000)
  },
  btn0() {
    wx.navigateTo({
      url: '../ft/ft',
    })
  },
  btn1() {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  btn2() {
    wx.navigateTo({
      url: '../worklist/worklist',
    })
  },
  btn3() {
    wx.navigateTo({
      url: '../personlist/personlist',
    })
  },
  btn4() {
    wx.navigateTo({
      url: '../personqjlist/personqjlist?openid=' + this.data.openid,
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
})