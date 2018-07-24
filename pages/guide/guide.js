
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight

Page({
  data:{
    stepIndex: 0,
    width,
    height,
    isMoving: false,
    cardmouseInfo: {
      stX: 0, // 手指按下的X位置
      stTime: 0, // 手指按下的时间
      nowX: 0
    }
  },
  onLoad(event) {
    if (event.isOneLogin) {
      this.setData({stepIndex: 2})
    }
  },
  confim () {
    wx.redirectTo({
      url: '/pages/createChildInfo/createChildInfo'
    })
  },
  touchstartcard (event) {
    this.setData({isMoving: true})
    let stX = event.changedTouches[0].clientX
    this.data.cardmouseInfo.stX = stX
    let stTime = new Date()
    this.data.cardmouseInfo.stTime = stTime
    this.data.cardmouseInfo.nowX = this.data.stepIndex
  },
  touchmovecard (event) {
    let moX = event.changedTouches[0].clientX
    let stX = this.data.cardmouseInfo.stX
    let dis = stX - moX
    this.setData({stepIndex: this.data.cardmouseInfo.nowX + dis / this.data.width})
  },
  touchendcard (event) {
    let endX = event.changedTouches[0].clientX
    let dis = this.data.cardmouseInfo.stX - endX
    let endTime = new Date()
    let disTime = endTime.getTime() - this.data.cardmouseInfo.stTime.getTime()
    this.setData({isMoving: false})
    if (Math.abs(dis / disTime) > 0.6) {
      if (dis > 0) {
        this.data.stepIndex = parseInt(this.data.stepIndex) + 1
      } else {
        this.data.stepIndex = parseInt(this.data.stepIndex)
      }
    } else {
      this.data.stepIndex = Math.round(this.data.stepIndex)
    }
    if (this.data.stepIndex < 0) {
      this.data.stepIndex = 0
    } else if (this.data.stepIndex > 2) {
      this.data.stepIndex = 2
    }
    this.setData({stepIndex: this.data.stepIndex})
  },
  touchmove () {}
})