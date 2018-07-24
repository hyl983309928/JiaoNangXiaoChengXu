
const chartRadar = require('../../utils/chart/chartRadar.js')
Page({
  data: {
    rpx: 0,
    height: 0,
    pageHeight: 0,
    topic: '',
    evaluate: '2',
    childrenInfo: {},
    rateInfo: {},
    radarList: {},
    showDialog: false,
    preScrollTop: 0
  },
  onReady() {
    var _this = this
    var device = wx.getSystemInfoSync()
    this.setData({rpx: device.windowWidth / 750})
    this.setData({height: device.windowHeight})
    this.drawChart(this.data.radarList)
    var query = wx.createSelectorQuery()
    query.select('.page').boundingClientRect(function (res) {
      _this.setData({pageHeight: res.height})
    }).exec()
  },
  onLoad(event) {
    var params = JSON.parse(decodeURIComponent(event.params))
    this.setData({topic: params.topic})
    this.setData({evaluate: params.evaluate})
    this.setData({childrenInfo: params.childrenInfo})
    this.setData({rateInfo: params.rateInfo})
    this.setData({radarList: params.radarList})

  },
  hideDialog () {
    this.setData({showDialog: false})
  },
  startCapsule () {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  onPageScroll (e) {
    if (this.data.preScrollTop < e.scrollTop && !this.data.showDialog && e.scrollTop >= this.data.pageHeight - this.data.height - 50) {
      this.setData({showDialog: true})
    }
    this.setData({preScrollTop: e.scrollTop})
  },
  drawChart (data) {
    var map = {}
    for (var i = 0; i < data.length; i++) {
      map[data[i].id] = data[i]
    }
    var ctxRadar = wx.createCanvasContext('canvasRadar')
    var radarYMap = [
      {
        id: 15,
        label: '学会生活',
        color: '#F7B753',
        url: '/imgs/myInfo/live.png',
        value: 0.9,
        imgX: 25,
        imgY: 125
      },
      {
        id: 14,
        label: '学会相处',
        color: '#F75270',
        url: '/imgs/myInfo/getalong.png',
        value: 0.7,
        imgX: 125,
        imgY: 70
      },
      {
        id: 5,
        label: '学会学习',
        color: '#4290D9',
        url: '/imgs/myInfo/study.png',
        value: 0.3,
        imgX: -65,
        imgY: 70
      }
    ]
    for (var i = 0; i < radarYMap.length; i++) {
      var temp = map[radarYMap[i].id].count * 2 + 40
      if (temp > 100) {
        temp = 100
      }
      radarYMap[i].value = temp / 100
    }
    chartRadar.drawRader({context:ctxRadar, width:750, height:600, rpx:this.data.rpx, circleNum: 3,axisY: radarYMap})
    ctxRadar.draw()
  }
})