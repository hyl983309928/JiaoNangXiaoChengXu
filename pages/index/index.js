
const app = getApp()
const api = require("../../utils/api.js");
const userModules = require('../../utils/modules/user.js')
Page({
  data: {
  },
  onReady: function () {
    if (app.globalData.login) {
      this.getChildrenInfo(app.globalData.isOneLogin)
    }
  },
  getChildrenInfo(isOneLogin) {
    var isChildrenInfo  // 孩子信息是否完整
    api.user.getChildrenInfo()
      .then((data) => {
        if (data.childrenList.length === 0) {
          isChildrenInfo = false
          api.user.createChildren()
            .then(() => {
              this.goWhere(isOneLogin, isChildrenInfo)
            })
        } else {
          if (data.childrenList[0].name && data.childrenList[0].headimgUrl && data.childrenList[0].birthday && (data.childrenList[0].sex === 0 || data.childrenList[0].sex === 1) && data.identity){
            isChildrenInfo = true
          } else {
            isChildrenInfo = false
          }
          this.goWhere(isOneLogin, isChildrenInfo)
        }
      })
  },
  goWhere (isOneLogin, isChildrenInfo) {
    if (isChildrenInfo) {
      wx.reLaunch({
        url: '/pages/guide/guideOld?isOldUser=1'
      })
    } else {
      wx.redirectTo({
        url: '/pages/guide/guide?isChildrenInfo=' + isChildrenInfo + '&isOneLogin=' + isOneLogin
      })
    }
  }
})
