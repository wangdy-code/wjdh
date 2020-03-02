// pages/admin/admin.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    start_date: '2019-12-01',
    end_date: '2019-12-30',
    add_name:'',
    delete_name:'',
    add_id:"",
    delete_id:"",
    fileUrl:"",
    fileUrl1:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var DATE = util.formatDate(new Date());

    this.setData({

      start_date: DATE,
      end_date: DATE

    });
  },
  formSubmit: function (e) {
    this.setData({
      add_name: e.detail.value.add_name,
      delete_name: e.detail.value.delete_name,
      name_record : e.detail.value.name_record,
      date_record:e.detail.value.date_record,
      sb_xb:e.detail.value.sb_xb
    })
  
    
    console.log(this.data.name_record)
    
    let that = this
  },
  admin_btn:function(e){
    if (this.data.add_name != "" && this.data.delete_name == "") {
      wx.cloud.callFunction({
        // 云函数名称
        name: 'add_superuser',
        // 传给云函数的参数
        data: {

          name: this.data.add_name
        },
        success: function (res) {
          console.log(res)
          wx.showToast({
            title: '新增成功',
          })
        },
        fail: console.error
      })
      //删除
    } else if (this.data.add_name == "" && this.data.delete_name != ""){
      wx.cloud.callFunction({
        // 云函数名称
        name: 'delete_superuser',
        // 传给云函数的参数
        data: {

          name: this.data.delete_name
        },
        success: function (res) {
          console.log(res)
          wx.showToast({
            title: '删除成功',
          })
        },
        fail: console.error
      })

      //同时增加删除
    } else if (this.data.add_name != "" && this.data.delete_name != ""){
      wx.cloud.callFunction({
        // 云函数名称
        name: 'add_superuser',
        // 传给云函数的参数
        data: {

          name: this.data.add_name
        },
        success: function (res) {
          console.log(res)
          wx.showToast({
            title: '新增成功',
          })
        },
        fail: console.error
      })
      wx.cloud.callFunction({
        // 云函数名称
        name: 'delete_superuser',
        // 传给云函数的参数
        data: {

          name: this.data.delete_name
        },
        success: function (res) {
          console.log(res)
          wx.showToast({
            title: '删除成功',
          })
        },
        fail: console.error
      })
    }else{
      wx.showToast({
        title: '请输入内容',
        icon:none
      })
    }
    
    
    


    
    
      
    

  },
  xg_btn:function(e){
    if (this.data.sb_xb != "" && this.data.name_record != "" && this.data.date_record != "") {
      wx.cloud.init({
        env: 'wdy-zy'
      });
      const db = wx.cloud.database()
      if (this.data.sb_xb == "上班") {
        db.collection("sb-dk").add({
          data: {
            name: this.data.name_record,
            date: this.data.date_record,
            time: "08:00:00",
            bq: 1
          },
          success: res => {
            wx.showToast({
              title: '补签成功',
            })
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '种种原因补签失败~'
            })
          }
        })
      } else if (this.data.sb_xb == "下班") {
        db.collection("xb-dk").add({
          data: {
            name: this.data.name_record,
            date: this.data.date_record,
            time: "17:30:00",
            bq: 1
          },
          success: res => {
            wx.showToast({
              title: '补签成功',
            })
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '种种原因补签失败~'
            })
          }
        })
      } else {
        wx.showToast({
          title: '信息不完整',
        })
      }

    }
  },
  bindDateChange(e) {
    let that = this;
    console.log(e.detail.value)
    that.setData({
      start_date: e.detail.value
    })
  },
  bindDateChange1(e) {
    let that = this;
    console.log(e.detail.value)
    that.setData({
      end_date: e.detail.value
    })
  },
  search_btn:function(e){
    let that = this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'get_sbdkdata',
      // 传给云函数的参数
      data: {

        start_date: this.data.start_date,
        end_date:this.data.end_date
      },
      success: function (res) {
        console.log(res)
        that.savaExcel(res.result.data)
      },
      fail: console.error
    }),
    wx.cloud.callFunction({
      // 云函数名称
      name: 'get_xbdkdata',
      // 传给云函数的参数
      data: {

        start_date: this.data.start_date,
        end_date: this.data.end_date
      },
      success: function (res) {
        console.log(res)
        that.savaExcel1(res.result.data)
      },
      fail: console.error
    })
    
  },
  //把数据保存到excel里，并把excel保存到云存储
  savaExcel(userdata) {
    let that = this
    wx.cloud.callFunction({
      name: "excel",
      data: {
        userdata: userdata
      },
      success(res) {
        console.log("保存成功", res)
        that.getFileUrl(res.result.fileID)
      },
      fail(res) {
        console.log("保存失败", res)
      }
    })
  },
  savaExcel1(userdata) {
    let that = this
    wx.cloud.callFunction({
      name: "excel1",
      data: {
        userdata: userdata
      },
      success(res) {
        console.log("保存成功", res)
        that.getFileUrl1(res.result.fileID)
      },
      fail(res) {
        console.log("保存失败", res)
      }
    })
  },
  
  getFileUrl(fileID) {
    let that = this;
    wx.cloud.getTempFileURL({
      fileList: [fileID],
      success: res => {
        // get temp file URL
        console.log("文件下载链接", res.fileList[0].tempFileURL)
        that.setData({
          fileUrl: res.fileList[0].tempFileURL
        })
      },
      fail: err => {
        // handle error
      }
    })
  },
  getFileUrl1(fileID) {
    let that = this;
    wx.cloud.getTempFileURL({
      fileList: [fileID],
      success: res => {
        // get temp file URL
        console.log("文件下载链接", res.fileList[0].tempFileURL)
        that.setData({
          fileUrl1: res.fileList[0].tempFileURL
        })
      },
      fail: err => {
        // handle error
      }
    })
  },
  //复制excel文件下载链接
  copyFileUrl() {
    let that = this
    wx.setClipboardData({
      data: that.data.fileUrl,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log("复制成功", res.data) // data
          }
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