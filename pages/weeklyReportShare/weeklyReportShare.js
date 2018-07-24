
const chartLine = require('../../utils/chart/chartLine.js')
Page({
  data: {
    rpx: 0,
    height: 0,
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
    ],
    lableTargetTitle: '',
    dayInfo: '',
    rateInfo: '',
    showDialog: false,
    pageHeight: 0,
    preScrollTop: 0
  },
  onReady() {
    var _this = this
    var device = wx.getSystemInfoSync()
    this.setData({rpx: device.windowWidth / 750})
    this.setData({height: device.windowHeight})
    this.drawLine()
    var query = wx.createSelectorQuery()
    query.select('.page').boundingClientRect(function (res) {
      _this.setData({pageHeight: res.height})
    }).exec()
  },
  onLoad(event) {
    console.log(JSON.parse(decodeURIComponent(event.params)))
    var params = JSON.parse(decodeURIComponent(event.params))
    this.setData({lableTargetTitle: params.lableTargetTitle})
    this.setData({dayInfo: params.dayInfo})
    this.setData({rateInfo: params.rateInfo})
  },
  onPageScroll (e) {
    if (this.data.preScrollTop < e.scrollTop && !this.data.showDialog && e.scrollTop >= this.data.pageHeight - this.data.height - 50) {
      this.setData({showDialog: true})
    }
    this.setData({preScrollTop: e.scrollTop})
  },
  scrolltolower (event) {
  },
  hideDialog () {
    this.setData({showDialog: false})
  },
  startCapsule () {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  drawLine(){
    var _this = this
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
  }
})