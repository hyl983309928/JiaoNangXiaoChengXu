
const app = getApp()
const chartLine = require('../../utils/chart/chartLine.js')
const api = require("../../utils/api.js");
const labelModel = require("../../utils/modules/label.js");
Page({
  data: {
    capsuleId: 0,
    userTargetId: 0,
    hashLable: [],
    dayInfo: {},
    rateInfo: {},
    rpx: 1,
    chartMap: [
      {
        label: '陪伴力',
        color: '#FF6767'
      },
      {
        label: '观察力',
        color: '#67A4FF'
      },
      {
        label: '亲密度',
        color: '#FFD667'
      }
    ]
  },
  onLoad(event) {
    this.setData({capsuleId:parseInt(event.capsuleId)})
    this.setData({userTargetId:parseInt(event.userTargetId)})
    this.getLabelList()
    this.getActiveRate()
  },
  onUnload() {
    wx.navigateBack({
      delta: 9
    })
  },
  onShareAppMessage (res) {
    var params = {
      lableTargetTitle: this.data.hashLable[this.data.dayInfo.target.labelTarget].title,
      dayInfo: this.data.dayInfo,
      rateInfo: this.data.rateInfo
    }
    console.log(encodeURIComponent(JSON.stringify(params)))
    return {
      title: '不好意思，这周陪娃陪出价值感了，实在忍不住要嘚瑟一下~~！',
      path: '/pages/weeklyReportShare/weeklyReportShare?params=' + encodeURIComponent(JSON.stringify(params)),
      success: function () {
      }
    }
  },
  getLabelList() {
    labelModel.getLabelList()
      .then((list) => {
        this.setData({hashLable: labelModel.getHashTable(list)})
        this.getWeeklyReport()
      })
  },
  getWeeklyReport () {
    var params = {
      userTargetId: this.data.userTargetId,
      capsuleId: this.data.capsuleId
    }
    api.capsule.getWeeklyReport(params)
      .then((data) => {
        if (data.target.medalImgUrl.indexOf('./uploads') != -1) {
          data.target.medalImgUrl = 'http://wx.xinjijiaoyu.com' + data.target.medalImgUrl.substring(1)
        }
        this.setData({dayInfo: data})
        this.setData({'chartMap[1].label': this.data.hashLable[data.target.labelTarget].title})
        this.drawLine()
      })
  },
  getActiveRate () {
    api.capsule.getActiveRate()
      .then((data) => {
        this.setData({rateInfo: data})
      })
  },
  drawLine(){
    var _this = this
    wx.getSystemInfo({
      success: function(data) {
        _this.setData({rpx: data.windowWidth / 750},function() {
          var ctx = wx.createCanvasContext('canvas')
          let accompanyAxisY = [0.0702, 0.2891, 0.3729, 0.4891, 0.6729, 0.7729, 0.8702, 0.9783]
          let accompanyColor = '#FF6767'
          let lookAxisY = [0.0270, 0.1675, 0.2324, 0.2459, 0.3270, 0.4189, 0.5459, 0.7351]
          let lookColoe = "#67A4FF"
          let intimacyAxisY = [0.1837, 0.26, 0.3189, 0.4216, 0.4891, 0.5945, 0.6864, 0.9108]
          let intimacyColor = '#FFD667'
          chartLine.axisX({width: 660,height:450,context:ctx,axisX:[0,1,2,3,4,5,6,7],rpx:_this.data.rpx})
          chartLine.axisY({width: 660,height:450,context:ctx,axisY:[20,40,60,80,100],rpx:_this.data.rpx})
          chartLine.line({width: 660,height:450,context:ctx,rpx:_this.data.rpx,valueY:accompanyAxisY,lineColor:accompanyColor})
          chartLine.line({width: 660,height:450,context:ctx,rpx:_this.data.rpx,valueY:lookAxisY,lineColor:lookColoe})
          chartLine.line({width: 660,height:450,context:ctx,rpx:_this.data.rpx,valueY:intimacyAxisY,lineColor:intimacyColor})
          ctx.draw()
        })
      }
    })
  }
})