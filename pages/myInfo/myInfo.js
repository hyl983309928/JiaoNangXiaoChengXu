const api = require("../../utils/api.js");
const chartLine = require('../../utils/chart/chartLine.js')
const app = getApp()
const userModules = require('../../utils/modules/user.js')
const labelModel = require("../../utils/modules/label.js");
const commonModules = require('../../utils/common.js')
const chartRadar = require('../../utils/chart/chartRadar.js')
const chartBar = require('../../utils/chart/chartBar.js')

Page({
  data: {
    flag: false, // 判断当前是否为第一次打开
    pageExer: 1,
    pageColl: 1,
    rpx: 0,
    labelList: {},
    userInfo: {},
    childrenInfo: {},
    tabIndex: 1,
    height: 0,
    capsuleList: [], // 已评论的list
    collectList: [], // 已收藏的list
    medalsList: [], // 勋章list
    growInfo: {},
    isMoreExer: false,
    isMoreCollect: false,
    targetColorMap: {
      5: '#4290D9', // 学会学习
      14: '#F75372', // 学会相处
      15: '#f7b753' // 学会生活
    },
    capsuleTypeColorMap: {
      1: '#F7B753',
      2: '#4290D9',
      3: '#F75372'
    },
    chartMapLine: [
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
  onReady() {
    var device = wx.getSystemInfoSync()
    this.setData({rpx: device.windowWidth / 750})
    this.setData({height: device.windowHeight})
    this.setData({flag: true})
  },
  onLoad () {
    this.setData({userInfo: app.globalData.userInfo})
    this.getChildrenInfo()
    this.getLabelList()
    this.getGrowInfo()
    this.getMedals()
  },
  onShow () {
    if (this.data.flag) {
      this.setData({pageColl: 1})
      this.setData({pageExer: 1})
      this.setData({isMoreExer: false})
      this.setData({isMoreCollect: false})

      this.setData({capsuleList: []})
      this.setData({collectList: []})
      this.setData({medalsList: []})

      this.getChildrenInfo()
      this.getGrowInfo()
      this.getMedals()
      this.getCapsuleListByActionExer()
      this.getCapsuleListByActionCollect()
    }
  },
  goSetting () {
    wx.navigateTo({
      url: '/pages/settingmymaterial/settingmymaterial'
    })
  },
  goCapsuleInfo (event) {
    wx.navigateTo({
      url:"/pages/capsuleInfo/capsuleInfo?capsuleId=" + event.currentTarget.dataset.id
    })
  },
  goDiscover() {
    wx.switchTab({
      url: "/pages/discover/discover"
    })
  },
  scrolltolowerExer () {
    if (this.data.isMoreExer) {
      return
    }
    this.setData({pageExer: this.data.pageExer + 1})
    this.getCapsuleListByActionExer()
  },
  scrolltolowerCollect () {
    if (this.data.isMoreCollect) {
      return
    }
    this.setData({pageColl: this.data.pageColl + 1})
    this.getCapsuleListByActionCollect()
  },
  getCapsuleListByActionCollect () {
    wx.showLoading({title: '加载中'})
    var params = {
      offset: (this.data.pageColl - 1) * 20,
      length: 20,
      actionType: 'collect'
    }
    api.capsule.getCapsuleListByAction(params)
      .then((data) => {
        if (data.list.length < 20) {
          this.setData({isMoreCollect: true})
        }
        this.setData({collectList: this.data.collectList.concat(this.countCapsuleInfo(data.list))})
        wx.hideLoading()
      })
      .catch(() => {
        wx.hideLoading()
      })
  },
  getCapsuleListByActionExer () {
    wx.showLoading({title: '加载中'})
    var params = {
      offset: (this.data.pageExer - 1) * 20,
      length: 20,
      actionType: 'exercise'
    }
    api.capsule.getCapsuleListByAction(params)
      .then((data) => {
        if (data.list.length < 20) {
          this.setData({isMoreExer: true})
        }
        this.setData({capsuleList: this.data.capsuleList.concat(this.countCapsuleInfo(data.list))})
        wx.hideLoading()
      })
      .catch(() => {
        wx.hideLoading()
      })
  },
  getGrowInfo () {
    api.capsule.getGrowInfo()
      .then((data) => {
        this.setData({growInfo: data})
      })
  },
  getMedals () {
    api.capsule.getMedals()
      .then((data) => {
        data.map(function (item) {
          if (item.medalImgUrl && item.medalImgUrl.indexOf('./upload') != -1) {
            item.medalImgUrl = 'http://wx.xinjijiaoyu.com' + item.medalImgUrl.substring(1)
          }
          item.time_title = ''
          item.time_title = item.time.substring(0, 10)
          return item
        })
        this.setData({medalsList: data})
      })
  },
  getLabelList() {
    labelModel.getLabelList()
      .then((list) => {
        this.setData({labelList: labelModel.getHashTable(list)})
        this.getCapsuleListByActionExer()
        this.getCapsuleListByActionCollect()
      })
  },
  changeTab (event) {
    if (this.data.tabIndex == event.currentTarget.dataset.index) {
      return
    }
    this.setData({tabIndex: event.currentTarget.dataset.index})
  },
  getChildrenInfo() {
    userModules.getChildrenInfo()
      .then((res) => {
        res.childAge = commonModules.countAge(res.childrenList[0].birthday)
        this.setData({childrenInfo: res})
      })
  },
  countCapsuleInfo(data) {
    var temp = data.map((item, index) => {

      item.labelAge_title = ''
      var ageListTemp = []
      for (let i = 0; i < item.labelAge.length; i++) {
        let temp = this.data.labelList[item.labelAge[i]].code.split('_')
        ageListTemp.push(parseInt(temp[0]))
        ageListTemp.push(parseInt(temp[1]))
      }
      ageListTemp.sort(function (a, b) {
        return a - b
      })
      item.labelAge_title = ageListTemp[0] + '-' + ageListTemp[ageListTemp.length - 1] + '岁'

      item.labelTarget_title = []
      for (let i = 0; i < item.labelTarget.length; i++) {
        let targetTemp = {}
        targetTemp.name = this.data.labelList[item.labelTarget[i]].title
        targetTemp.fatherId = item.labelTarget[i]
        if (this.data.labelList[targetTemp.fatherId].parent_id) {
          targetTemp.fatherId = this.data.labelList[item.labelTarget[i]].parent_id
        }
        if (this.data.labelList[targetTemp.fatherId].parent_id) {
          targetTemp.fatherId = this.data.labelList[targetTemp.fatherId].parent_id
        }
        item.labelTarget_title.push(targetTemp)
      }
      item.labelTarget_title = item.labelTarget_title.slice(0, 2)

      item.labelScene_title = []
      for (let i = 0; i < item.labelScene.length; i++) {
        item.labelScene_title.push(this.data.labelList[item.labelScene[i]].title)
      }
      item.labelScene_title = item.labelScene_title.slice(0, 2)
      item.labelScene_title = item.labelScene_title.join('·')

      if (item.cover && item.cover.indexOf('./upload') != -1) {
        item.cover = 'http://wx.xinjijiaoyu.com' + item.cover.substring(1)
      }
      item.created_label = item.action_time.substring(0,10)
      return item
    })
    return temp
  },
  drawChart() {
    var _this = this
    wx.getSystemInfo({
      success: function(data) {
        _this.setData({rpx: data.windowWidth / 750},function() {
          var ctx = wx.createCanvasContext('canvasLine')
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

          var ctxRadar = wx.createCanvasContext('canvasRadar')
          var radarYMap = [
            {
              label: '学会生活',
              color: '#F7B753',
              url: '/imgs/myInfo/live.png',
              value: 0.9,
              imgX: 125,
              imgY: 85
            },
            {
              label: '学会相处',
              color: '#F75270',
              url: '/imgs/myInfo/getalong.png',
              value: 0.7,
              imgX: 125,
              imgY: 70
            },
            {
              label: '学会学习',
              color: '#4290D9',
              url: '/imgs/myInfo/study.png',
              value: 0.3,
              imgX: -65,
              imgY: 70
            }
          ]
          chartRadar.drawRader({context:ctxRadar, width:750, height:600, rpx:_this.data.rpx, circleNum: 3,axisY: radarYMap})
          ctxRadar.draw()

          var ctxBar = wx.createCanvasContext('canvasBar')
          var ctxBarValue = [
            {
              label: '学会学习',
              color: '#4290D9',
              value: 0.6
            },
            {
              label: '学会相处',
              color: '#F75270',
              value: 0.9
            },
            {
              label: '学会生活',
              color: '#F7B753',
              url: '/imgs/myInfo/live.png',
              value: 0.7
            }
          ]
          chartBar.axisX({width: 750,height:460,context:ctxBar,axisX:['学会学习','学会相处','学会生活'],rpx:_this.data.rpx})
          chartBar.axisY({width: 750,height:460,context:ctxBar,axisY:[0,20,40,60,80,100],rpx:_this.data.rpx})
          chartBar.drawBar({width: 750,height:460,context:ctxBar,valueY:ctxBarValue,rpx:_this.data.rpx})
          ctxBar.draw()
        })
      }
    })
  },
  touchmove() {}
})
