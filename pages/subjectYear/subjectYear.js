const api = require("../../utils/api.js");
const app = getApp()

Page({
  data: {
    day: 0,
    userInfo: {}
  },
  onLoad () {
    this.setData({userInfo: app.globalData.userInfo})
    this.getUser2018ActivityEverydayExerciseCount()
  },
  getUser2018ActivityEverydayExerciseCount () {
    api.capsule.getUser2018ActivityEverydayExerciseCount(this.data.userInfo.id)
      .then((data) => {
        var day = 0
        if (data.list.length > 7) {
          day = 7
        } else {
          day = data.list.length
        }
        this.setData({day: day})
      })
  },
  goDiscover (event) {
    wx.reLaunch({
      url: '/pages/discover/discover?labelScene=' + event.currentTarget.dataset.scene
    })
  }
})
