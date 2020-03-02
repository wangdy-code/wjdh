var bmap = require('../../li b s/bmap-wx.js');
var util = require('../../utils/util.js');
var wxMarkerData = [];
Page({
  data: {
    disable: false,
    markers: [],
    latitude: '',
    longitude: '',
    rgcData: {},
    desc: '',
    openid: '',
    name: '',
    time: '',
    date: '',
    start_time0: "",
    end_time0: "",
    start_time1: "",
    end_time1: "",
    formId: "",
    disable1: false,
    qj: "",
  },
  clickFormView(event) {
    let formId = event.detail.formId;
    this.setData({
      formId: event.detail.formId
    })
    console.log(this.data.formId)




    console.log(formId)
    // 忽略开发者工具里边的formId
    if (formId && formId !== 'the formId is a mock one') {
      const db = wx.cloud.database()
      const _ = db.command
      db.collection('form-open').where({
        _openid: this.data.openid
      }).get().then(res => {
        if (res.data == "") {
          db.collection('form-open').add({
            data: {
              formId: formId,
            }
          })
        } else {
          wx.cloud.callFunction({
            // 云函数名称
            name: 'update_formId',
            // 传给云函数的参数
            data: {

              _openid: this.data.openid,
              formId: formId
            },
            success: function (res) {
              console.log(res)
            },
            fail: console.error
          })

        }
      })

    }
  },
  onLoad: function () {

    var that = this;
    var BMap = new bmap.BMapWX({
      ak: 'nUjcj9EfmqcL6Khzm7eSq9odMpBeDyYY'
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      wxMarkerData = data.wxMarkerData;
      that.setData({
        markers: wxMarkerData
      });
      that.setData({
        desc: wxMarkerData[0].desc
      });
      that.setData({
        latitude: wxMarkerData[0].latitude
      });
      that.setData({
        longitude: wxMarkerData[0].longitude
      });
    }
    this.getOpenid();
    wx.cloud.init({
      env: 'wdy-zy'
    });
    const db = wx.cloud.database()
    db.collection('setting_time').where({
    }).get().then(res => {
      for (var key in res.data) {
        delete res.data[key]._id
      }
      console.log(res.data)
      this.setData({
        start_time0: res.data[0].start_time,
        end_time0: res.data[0].end_time,
        start_time1: res.data[1].start_time,
        end_time1: res.data[1].end_time,
      })
      console.log(this.data.start_time1)
    })
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
        that.setData({
          name: res.data[0].name
        })
      }





    })



    BMap.regeocoding({
      fail: fail,
      success: success,
      iconPath: '../../img/marker_red.png',
      iconTapPath: '../../img/marker_red.png'
    });

  },

  showSearchInfo: function (data, i) {
    var that = this;
    that.setData({
      rgcData: {
        address: '地址：' + data[i].address + '\n',
        desc: '描述：' + data[i].desc + '\n',
        business: '商圈：' + data[i].business
      },
    });
  },
  qj: function (e) {
    var that = this;
    wx.showModal({
      title: '请假',
      content: '是否请假',
      success: (res) => {
        let that = this;
        if (res.confirm) {
          wx.showActionSheet({
            itemList: ['病假', '事假', '丧假', '婚假', '产假'],
            success: (res) => {
              console.log(res.tapIndex)
              if (res.tapIndex == 0) {
                this.setData({
                  qj: 'A'
                })
                wx.navigateTo({
                  url: '../qj/qj?qj=' + this.data.qj,
                })
              } else if (res.tapIndex == 1) {
                this.setData({
                  qj: 'B'
                })
                wx.navigateTo({
                  url: '../qj/qj?qj=' + this.data.qj,
                })
              } else if (res.tapIndex == 2) {
                this.setData({
                  qj: 'C'
                })
                wx.navigateTo({
                  url: '../qj/qj?qj=' + this.data.qj,
                })
              } else if (res.tapIndex == 3) {
                this.setData({
                  qj: 'D'
                })
                wx.navigateTo({
                  url: '../qj/qj?qj=' + this.data.qj,
                })
              } else if (res.tapIndex == 4) {
                this.setData({
                  qj: 'E'
                })
                wx.navigateTo({
                  url: '../qj/qj?qj=' + this.data.qj,
                })
              }

            },
            fail(res) {
              console.log(res.errMsg)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  daka: function (e) {
    var that = this;
    var TIME = util.formatTime(new Date());
    var DATE = util.formatDate(new Date());

    const templateId = 'FQAiSMdR5xibmnWL7zzIK26Px7vnHFY-40Oemx2rbOQ'; // 订阅消息模版id

    wx.requestSubscribeMessage({
      tmplIds: [templateId],
      success(res) {
        if (res[templateId] == 'accept') {
          //用户同意了订阅，允许订阅消息
          wx.showToast({
            title: '订阅成功'
          })
          wx.cloud.callFunction({
            // 云函数名称
            name: 'send_message',
            // 传给云函数的参数
            data: {

              openid: this.data.openid,
              formId: formId
            },
            success: function (res) {
              console.log(res)
            },
            fail: console.error
          })
        } else {
          //用户拒绝了订阅，禁用订阅消息
          wx.showToast({
            title: '订阅失败'
          })
        }
      },
      fail(res) {
        console.log(res)
      },
      complete(res) {
        console.log(res)
      }
    })
    this.setData({

      time: TIME,
      date: DATE,
      disable: true

    });
    console.log(this.data.time)
    console.log(this.data.date)
    if (this.data.desc == "") {
      wx.showToast({
        title: '定位缺失',
      })
    }
    else {
      if (this.data.start_time0 <= this.data.time && this.data.time <= this.data.end_time0) {
        const db = wx.cloud.database()
        db.collection('sb-dk').where({
          _openid: this.data.openid, // 填入当前用户 openid
          date: this.data.date
        }).get().then(res => {
          if (res.data == "") {
            var zt = '正常'
            wx.showToast({
              title: '早上好',
            });
            wx.cloud.init({
              env: 'wdy-zy'
            });

            const db = wx.cloud.database()
            db.collection('sb-dk').add({
              data: {
                name: this.data.name,
                date: this.data.date,
                time: this.data.time,
                location: this.data.desc,
                zt: zt,
                createTime: db.serverDate(),
                bq: 0



              },
              success: res => {
                // 在返回结果中会包含新创建的记录的 _id
                this.setData({
                  counterId: res._id,
                  count: 1,
                  disable: false
                })

                wx.showToast({
                  title: '打卡成功',
                })
                console.log('[数据库] [打卡] 成功，记录 _id: ', res._id)
              },
              fail: err => {
                wx.showToast({
                  icon: 'none',
                  title: '种种原因打卡失败~'
                })
                this.setData({
                  disable: false
                })
                console.error('[数据库] [新增记录] 失败：', err)
              }
            })
          } else {
            wx.showToast({
              title: '您已打过卡'

            })
            this.setData({
              disable: true
            })
          }



        })
      } else if (this.data.start_time1 <= this.data.time && this.data.time <= this.data.end_time1) {
        const db = wx.cloud.database()
        db.collection('xb-dk').where({
          _openid: this.data.openid, // 填入当前用户 openid
          date: this.data.date
        }).get().then(res => {
          if (res.data == "") {
            wx.showToast({
              title: '幸苦了',
            });
            var zt = '正常'
            wx.cloud.init({
              env: 'wdy-zy'
            });
            const db = wx.cloud.database()
            db.collection('xb-dk').add({
              data: {
                name: this.data.name,
                date: this.data.date,
                time: this.data.time,
                location: this.data.desc,
                createTime: db.serverDate(),
                bq: 0
              },
              success: res => {
                // 在返回结果中会包含新创建的记录的 _id
                this.setData({
                  counterId: res._id,
                  count: 1,

                })
                wx.showToast({
                  title: '打卡成功',
                })
                this.setData({
                  disable: false
                })
                console.log('[数据库] [打卡] 成功，记录 _id: ', res._id)
              },
              fail: err => {
                wx.showToast({
                  icon: 'none',
                  title: '种种原因打卡失败~'
                })
                this.setData({
                  disable: false
                })
                console.error('[数据库] [新增记录] 失败：', err)
              }
            })
          } else {
            wx.showToast({
              title: '您已打过卡',
              icon: 'none'

            })

          }



        })
      } else {
        wx.showToast({
          title: '现在不是打卡时间',
          icon: 'none',
          duration: 2000
        })
        this.setData({
          disable: false
        })
        console.log(this.data.time)
      }
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

})