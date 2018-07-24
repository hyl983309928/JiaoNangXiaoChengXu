
Page({
  data: {
    height: 0,
    info: {},
    childrenInfo: {},
    sceneExample: '', // 场景示范，（快跟我动起来）
    keyPoint: '', // 要点（小提示）
    property: '', // 道具准备
    benefit: '', //好处
    targetList: [],
    showDialog: false
  },
  onReady() {
    var device = wx.getSystemInfoSync()
    this.setData({height: device.windowHeight})
  },
  onLoad(event) {
    console.log(JSON.parse(decodeURIComponent(event.params)))
    var params = JSON.parse(decodeURIComponent(event.params))
    this.setData({info: params.info})
    this.setData({childrenInfo: params.childrenInfo})
    this.setData({sceneExample: params.sceneExample})
    this.setData({keyPoint: params.keyPoint})
    this.setData({property: params.property})
    this.setData({benefit: params.benefit})
    this.setData({targetList: params.targetList})
  },
  startCapsule () {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  scrolltolower () {
    this.setData({showDialog: true})
  },
  hideDialog () {
    this.setData({showDialog: false})
  }
})