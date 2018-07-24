
const app = getApp()
const chartLine = require('../../utils/chart/chartLine.js')
const api = require("../../utils/api.js");
const labelModel = require("../../utils/modules/label.js");
const userModules = require('../../utils/modules/user.js')
Page({
  data: {
    capsuleId: 0,
    userTargetId: 0,
    hashLable: [],
    childrenInfo: {},
    dayInfo: {},
    rateInfo: {},
    day: 1,
    rpx: 1,
    pointsX: [],
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
    this.getChildrenInfo()
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
      rateInfo: this.data.rateInfo,
      childrenInfo: this.data.childrenInfo,
      day: this.data.day
    }
    console.log(encodeURIComponent(JSON.stringify(params)))
    return {
      title: '陪伴是最好的投资。每天好好陪娃10分钟，比什么都重要！',
      path: '/pages/everydayReportShare/everydayReportShare?params=' + encodeURIComponent(JSON.stringify(params)),
      success: function () {
      }
    }
  },
  getLabelList() {
    labelModel.getLabelList()
      .then((list) => {
        this.setData({hashLable: labelModel.getHashTable(list)})
        this.getDailyReport()
      })
  },
  getDailyReport () {
    var params = {
      userTargetId: this.data.userTargetId,
      capsuleId: this.data.capsuleId
    }
    api.capsule.getDailyReport(params)
      .then((data) => {
        this.setData({dayInfo: data})
        this.setData({day: data.dayNum})
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
  getChildrenInfo() {
    userModules.getChildrenInfo()
      .then((res) => {
        this.setData({childrenInfo: res})
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

          chartLine.line({width: 660,height:450,context:ctx,rpx:_this.data.rpx,valueY:accompanyAxisY})
          chartLine.line({width: 660,height:450,context:ctx,rpx:_this.data.rpx,valueY:lookAxisY})
          chartLine.line({width: 660,height:450,context:ctx,rpx:_this.data.rpx,valueY:intimacyAxisY})

          chartLine.line({width: 660,height:450,context:ctx,rpx:_this.data.rpx,valueY:accompanyAxisY.slice(0, _this.data.day + 1),lineColor:accompanyColor})
          chartLine.line({width: 660,height:450,context:ctx,rpx:_this.data.rpx,valueY:lookAxisY.slice(0, _this.data.day + 1),lineColor:lookColoe})
          chartLine.line({width: 660,height:450,context:ctx,rpx:_this.data.rpx,valueY:intimacyAxisY.slice(0, _this.data.day + 1),lineColor:intimacyColor})

          ctx.draw()
        })
      }
    })
  }
})