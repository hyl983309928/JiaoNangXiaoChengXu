//app.js
const api = require("./utils/api.js");
const labelModules = require('./utils/modules/label.js')
const userModules = require('./utils/modules/user.js')
App({
  globalData: {
    userInfo: '',
    token: '',
    login: false,
    isOneLogin: ''
  },
  onLaunch: function () {
    this.globalData.token = wx.getStorageSync('token')
    this.globalData.userInfo = wx.getStorageSync('userInfo') || {}
    this.getUserInfoWx()
  },
  getLabelList () {
    labelModules.getLabelList()
      .then((list) => {
        this.globalData.label = list
      })
  },
  getUserInfoWx: function () {
    if (!this.globalData.token) return this.wxLogin();
    // else this.loginComplete && this.loginComplete();
    wx.showLoading({ title: "加载中"});
    const _this = this;
    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
        _this.wxLogin();
      },
      fail: function () {
        //登录态过期
        _this.wxLogin();
      }
    })
  },
  wxLogin() {
    const _this = this;
    wx.login({
      success: function (rs) {
        wx.getUserInfo({
          success: function (res) {
            res.code = rs.code;
            _this.login(res);
          },
          fail: function (e) {
            wx.showToast({
              title: '已拒绝授权',
              icon: 'success',
              duration: 1500,
              mask: true
            })
          }
        })
      }
    })
  },
  login: function (obj) {
    /*获取session_key开始 */
    api.user.login({
      js_code: obj.code,
      rawData: obj.rawData,
      signature: obj.signature,
      encryptedData: obj.encryptedData,
      iv: obj.iv
    }).then(([res, header]) => {
      wx.hideLoading()
      var isOneLogin = this.globalData.token
      this.globalData.isOneLogin = isOneLogin
      if (header['set-cookie']) {
        this.globalData.token = header['set-cookie']
        wx.setStorageSync('token', header['set-cookie'])
      } else if (header['Set-Cookie']) {
        this.globalData.token = header['Set-Cookie']
        wx.setStorageSync('token', header['Set-Cookie'])
      }
      this.globalData.userInfo = res
      wx.setStorageSync('userInfo', res)
      this.getChildrenInfo(isOneLogin)
    },res=>{
      wx.hideLoading()
    })
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
    this.globalData.login = true
    var routeList = getCurrentPages()
    if (routeList[routeList.length - 1].route=="pages/capsuleInfoShare/capsuleInfoShare" || routeList[routeList.length - 1].route=="pages/everydayReportShare/everydayReportShare" || routeList[routeList.length - 1].route=="pages/weeklyReportShare/weeklyReportShare" || routeList[routeList.length - 1].route=="pages/discoverReportShare/discoverReportShare" || routeList[routeList.length - 1].route=="pages/capsuleInfo/capsuleInfo") {
    } else {
      if (isOneLogin && isChildrenInfo) {
        wx.reLaunch({
          url: '/pages/guide/guideOld?isOldUser=1'
        })
      } else {
        wx.redirectTo({
          url: '/pages/guide/guide?isChildrenInfo=' + isChildrenInfo + '&isOneLogin=' + isOneLogin
        })
      }
    }
  }
})