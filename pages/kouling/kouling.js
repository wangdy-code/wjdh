 Page({



  /**
  * 页面的初始数据
  */

  data: {


    name: "",

    phone: "",
    openid:''

  

  },

  onLoad: function (){
    this.getOpenid();
  },
  // 判定输入为非空字符

  formSubmit: function (e) {
    this.setData({
      name: e.detail.value.name,
      phone:e.detail.value.phone
    })
    let that = this
    
  

    // mobile

    if (this.data.name == "" || this.data.phone == "" ) {

      wx.showModal({

        title: '提示',

        content: '请输入完整信息！',

        success: function (res) {

          if (res.confirm) {

            console.log('用户点击确定')

          }

        }

      })

    } else {

      console.log(e.detail.value)

      // detail

    };
    
    if(this.data.openid==""){
      wx.showModal({

        title: '提示',

        content: '请重试'
      })
      }else{
      wx.cloud.init({
      env: 'wdy-zy'
    });
    if(this.data.name==""||this.data.phone==""){
      wx.showToast({
        title: '请输入完整信息',
        icon:"none"
      })
    }else{
      const db = wx.cloud.database()
      db.collection('user-data').add({
        data: {
          _id: this.data.openid,
          name: this.data.name,
          phone: this.data.phone,
          superuser:0,
          admin:0,
          manager:false
        },
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          this.setData({
            counterId: res._id,
            count: 1
          })

          wx.showToast({
            title: '已提交',
          })
          console.log('[数据库] [上传用户信息] 成功，记录 _id: ', res._id)
          wx.reLaunch({
            url: '../location/location'
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '您已上传过本人信息，请不要重复上传',
            duration: 4000
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })
    }

  }
  },

  

  // 手机号部分

  inputPhoneNum: function (e) {

    let phoneNumber = e.detail.value

    if (phoneNumber.length === 11) {

      let checkedNum = this.checkPhoneNum(phoneNumber)

    }

  },

  checkPhoneNum: function (phoneNumber) {

    let str = /^1\d{10}$/

    if (str.test(phoneNumber)) {

      return true

    } else {

      wx.showToast({

        title: '手机号不正确',

        image: 'none'

      })

      return false

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
  search:function(){
    
  },

  


  onShareAppMessage: function () {

  }

 

  

})