const util = require('../../utils/util.js')

Page({
  data: {
    date: '2018-01-01',//默认起始时间  
    date2: '2018-01-24',//默认结束时间 

  },

  // 时间段选择  
  bindDateChange(e) {
    let that = this;
    console.log(e.detail.value)
    that.setData({
      date: e.detail.value,
    })
  },
  bindDateChange2(e) {
    let that = this;
    that.setData({
      date2: e.detail.value,
    })

  }
})