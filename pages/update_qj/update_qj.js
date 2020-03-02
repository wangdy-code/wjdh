// pages/qj/qj.js
var util = require('../../utils/util.js');
const date = new Date();
const years = [];
const months = [];
const days = [];
const hours = [];
const minutes = [];
for (let i = 2020; i <= date.getFullYear() + 5; i++) {
  years.push("" + i);
}
//获取月份
for (let i = 1; i <= 12; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  months.push("" + i);
}
//获取日期
for (let i = 1; i <= 31; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  days.push("" + i);
}
//获取小时
for (let i = 0; i < 24; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  hours.push("" + i);
}
//获取分钟
for (let i = 0; i < 60; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  minutes.push("" + i);
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    start_time: '',
    end_time: '',
    multiArray: [years, months, days, hours, minutes],
    multiIndex: [0, 0, 16, 10, 17],
    multiIndex1: [0, 0, 16, 10, 17],
    choose_year: '',
    name: '',
    qj: '',
    _id:'',
    start_time:"",
    end_time:"",
    name:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      _id: options._id
    })
    var DATE = util.formatDate(new Date());
    var TIME = util.formatTime(new Date());
    var time = DATE + ' ' + TIME
    var month = date.getMonth()
    var day = date.getDate() - 1
    console.log(day)
    var hour = date.getHours()
    var minute = date.getMinutes()
    this.setData({
      multiIndex: [0, month, day, hour, minute]
    })
    console.log(this.data._id)
    this.getOpenid();
    wx.cloud.init({
      env: 'wdy-zy'
    });

    const db = wx.cloud.database()
    let that = this
    db.collection('user-data').where({
      _openid: this.data.openid // 填入当前用户 openid
    }).get().then(res => {
      that.setData({
        name: res.data[0].name
      })
    })
    wx.cloud.callFunction({
      name: 'qjIDtocontent',
      data:{
        _id:this.data._id
      },
      success: res => {
        console.log(res.result)
        this.setData({
          start_time: res.result.data[0].start_time,
          end_time: res.result.data[0].end_time,
          qj: res.result.data[0].qj,
        })
      }
    })
    
  },
  bindMultiPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
    const index = this.data.multiIndex;
    const year = this.data.multiArray[0][index[0]];
    const month = this.data.multiArray[1][index[1]];
    const day = this.data.multiArray[2][index[2]];
    const hour = this.data.multiArray[3][index[3]];
    const minute = this.data.multiArray[4][index[4]];
    // console.log(`${year}-${month}-${day}-${hour}-${minute}`);
    this.setData({
      start_time: month + '-' + day + ' ' + hour + ':' + minute
    })
    console.log(this.data.start_time);
  },
  //监听picker的滚动事件
  bindMultiPickerColumnChange: function (e) {
    //获取年份
    if (e.detail.column == 0) {
      let choose_year = this.data.multiArray[e.detail.column][e.detail.value];
      console.log(choose_year);
      this.setData({
        choose_year
      })
    }
    //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    if (e.detail.column == 1) {
      let num = parseInt(this.data.multiArray[e.detail.column][e.detail.value]);
      let temp = [];
      if (num == 1 || num == 3 || num == 5 || num == 7 || num == 8 || num == 10 || num == 12) { //判断31天的月份
        for (let i = 1; i <= 31; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 4 || num == 6 || num == 9 || num == 11) { //判断30天的月份
        for (let i = 1; i <= 30; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 2) { //判断2月份天数
        let year = parseInt(this.data.choose_year);
        console.log(year);
        if (((year % 400 == 0) || (year % 100 != 0)) && (year % 4 == 0)) {
          for (let i = 1; i <= 29; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        } else {
          for (let i = 1; i <= 28; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        }
      }
      console.log(this.data.multiArray[2]);
    }
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  },

  bindMultiPickerChange1: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
    const index = this.data.multiIndex;
    const year = this.data.multiArray[0][index[0]];
    const month = this.data.multiArray[1][index[1]];
    const day = this.data.multiArray[2][index[2]];
    const hour = this.data.multiArray[3][index[3]];
    const minute = this.data.multiArray[4][index[4]];
    // console.log(`${year}-${month}-${day}-${hour}-${minute}`);
    this.setData({
      end_time: month + '-' + day + ' ' + hour + ':' + minute
    })
    console.log(this.data.end_time);
  },
  bindMultiPickerColumnChange1: function (e) {
    //获取年份
    if (e.detail.column == 0) {
      let choose_year = this.data.multiArray[e.detail.column][e.detail.value];
      console.log(choose_year);
      this.setData({
        choose_year
      })
    }
    //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    if (e.detail.column == 1) {
      let num = parseInt(this.data.multiArray[e.detail.column][e.detail.value]);
      let temp = [];
      if (num == 1 || num == 3 || num == 5 || num == 7 || num == 8 || num == 10 || num == 12) { //判断31天的月份
        for (let i = 1; i <= 31; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 4 || num == 6 || num == 9 || num == 11) { //判断30天的月份
        for (let i = 1; i <= 30; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 2) { //判断2月份天数
        let year = parseInt(this.data.choose_year);
        console.log(year);
        if (((year % 400 == 0) || (year % 100 != 0)) && (year % 4 == 0)) {
          for (let i = 1; i <= 29; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        } else {
          for (let i = 1; i <= 28; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        }
      }
      console.log(this.data.multiArray[2]);
    }
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  },
  bindViewTap: function (e) {
    if (this.data.start_time == "" || this.data.end_time == "" || this.data.start_time >= this.data.end_time) {
      wx.showToast({
        title: '时间输入错误',
        icon: 'none'

      })
    } else {
      wx.showLoading({
        title: '修改中',
      })
      wx.cloud.init({
        env: 'wdy-zy'
      });
      const db = wx.cloud.database()
      wx.cloud.callFunction({
        name: 'update_qjlist',
        data: {
          qj : this.data.qj,
          start_time:this.data.start_time,
          end_time:this.data.end_time,
          _id:this.data._id,
          isDelete:0,
        },
        success: res => {
          wx.hideLoading()
          wx.showToast({
            title: '修改成功',
          })
        
        }
      })
      wx.cloud.callFunction({
        name: 'update_qjRecord',
        data: {
          superuser_name: this.data.name,
          desc: {
            updateID: this.data._id,
            kinds: 'update'
          }

        },
        success: res => {
          wx.hideLoading()
          wx.showToast({
            title: '修改成功',
          })

        }
      })
    }



  },
  bindViewTap1: function (e) {
    wx.showLoading({
      title: '删除中',
    })
    wx.cloud.init({
      env: 'wdy-zy'
    });
    const db = wx.cloud.database()
    wx.cloud.callFunction({
      name: 'update_qjlist',
      data: {
        qj: this.data.qj,
        start_time: this.data.start_time,
        end_time: this.data.end_time,
        _id: this.data._id,
        isDelete: 1,
      },
      success: res => {
        wx.hideLoading()
        wx.showToast({
          title: '删除成功',
        })

      }
    })
    wx.cloud.callFunction({
      name: 'update_qjRecord',
      data: {
        superuser_name:this.data.name,
        desc: {
          updateID: this.data._id,
          kinds: 'delete'
        }

      },
      success: res => {
        wx.hideLoading()
        wx.showToast({
          title: '删除成功',
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