
const app = getApp()
const api = require("../../utils/api.js");
const userModules = require("../../utils/modules/user.js");
const chartRadar = require('../../utils/chart/chartRadar.js')
const device = wx.getSystemInfoSync()
const rpx = device.windowWidth / 750
Page({
  data: {
    rpx: rpx,
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
    topic: '',
    evaluate: '2',
    childrenInfo: {},
    rateInfo: {},
    radarList: {}
  },
  onLoad(event) {
    this.setData({topic: event.topic})
    this.setData({evaluate: event.evaluate})
    this.getChildrenInfo()
    this.getActiveRate()
    this.getRadarList()
  },
  onShareAppMessage (res) {
    var params = {
      topic: this.data.topic,
      evaluate: this.data.evaluate,
      childrenInfo: this.data.childrenInfo,
      rateInfo: this.data.rateInfo,
      radarList: this.data.radarList
    }
    console.log(encodeURIComponent(JSON.stringify(params)))
    return {
      title: '陪伴是最好的投资。每天好好陪娃10分钟，比什么都重要！',
      path: '/pages/discoverReportShare/discoverReportShare?params=' + encodeURIComponent(JSON.stringify(params)),
      success: function () {
      }
    }
  },
  goMoreCapsule () {
    wx.switchTab({
      url: '/pages/discover/discover'
    })
  },
  getRadarList () {
    api.capsule.getRadarList()
      .then((data) => {
        this.setData({radarList: data})
        this.drawChart(data)
      })
  },
  getChildrenInfo() {
    userModules.getChildrenInfo()
      .then((res) => {
        this.setData({childrenInfo: res})
      })
  },
  getActiveRate () {
    api.capsule.getActiveRate()
      .then((data) => {
        this.setData({rateInfo: data})
      })
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