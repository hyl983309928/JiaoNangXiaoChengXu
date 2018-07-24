const userModules = require('../../utils/modules/user.js')
const api = require('../../utils/api.js')
const labelModel = require("../../utils/modules/label.js");
const common = require('../../utils/common.js')
Page({
  data: {
    childrenInfo: {},
    list: [],
    activeDayInfo: [],
    hashLable: {},
    sceneTypeMap: {
      1: '一起玩',
      2: '一起看',
      3: '一起聊'
    },
    showNewUserDialog: false,
    showOldUserDialog: false,
    showLockUserDialog: false,
    titleTarget: '',
    descriptionTitle: '',
    showTargetDialog: false,
    showNewTargetDialog: false,
    showYearActivity: false
  },
  onLoad (event) {
    if (event.isOldUser == 1) {
      var outTime = new Date(wx.getStorageSync('outTime'))
      var nowTime = new Date()
      if (nowTime.getTime() - outTime.getTime() >= 24 * 60 * 60 * 1000) {
        this.setData({showOldUserDialog: true})
        wx.hideTabBar({
          aniamtion: true
        })
      } else if (nowTime.getTime() - outTime.getTime() < 24 * 60 * 60 * 1000 && nowTime.getDate() != outTime.getDate()) {
        this.setData({showOldUserDialog: true})
        wx.hideTabBar({
          aniamtion: true
        })
      }
      wx.setStorageSync('outTime', nowTime.getTime())
    } else if (event.isOldUser == 2) {
      wx.hideTabBar({
        aniamtion: true
      })
      this.setData({showNewUserDialog: true})
    }
    this.getLabelList()
    this.saveNewCapsuleTime()
    this.yearActivity()
  },
  yearActivity () {
    var sTime = new Date('2018/02/7 00:00:00')
    var eTime = new Date('2018/02/25 00:00:00')
    var nowTime = new Date()
    if (nowTime.getTime() > sTime.getTime() && nowTime.getTime() < eTime.getTime()) {
      this.setData({showYearActivity: true})
    }
  },
  goYearActivity () {
    wx.navigateTo({
      url: '/pages/subjectYear/subjectYear'
    })
  },
  onShow () {
    this.getChildrenInfo()
    this.getTargetActiveDay()
    this.getMap()
  },
  onShareAppMessage (res) {
    return {
      title: '10分钟成为陪娃大师，给孩子真正优质的陪伴~~',
      path: '/pages/index/index',
      imageUrl: 'https://xinjijiaoyu.oss-cn-shenzhen.aliyuncs.com/Accompany%20capsule%20Pop-up/Pop-up%2010.png',
      success: function () {
      }
    }
  },
  showTargetDialog (event) {
    this.setData({titleTarget: this.data.hashLable[event.currentTarget.dataset.item.labelTarget].title + '（' + this.data.hashLable[event.currentTarget.dataset.item.labelAge].title + '）'})
    var desc
    if (this.data.hashLable[event.currentTarget.dataset.item.labelTarget].description[event.currentTarget.dataset.item.labelAge]) {
      desc = this.data.hashLable[event.currentTarget.dataset.item.labelTarget].description[event.currentTarget.dataset.item.labelAge]
    } else {
      desc = this.data.hashLable[event.currentTarget.dataset.item.labelTarget].description.default
    }
    this.setData({descriptionTitle: desc})
    this.setData({showTargetDialog: true})
  },
  hideTargetDialog () {
    this.setData({showTargetDialog: false})
  },
  saveNewCapsuleTime () {
    api.capsule.getCapsuleLastUpdateTime()
      .then((data) => {
        var oldTime = wx.getStorageSync('newCapsuleTime')
        if (oldTime) {
          oldTime = parseInt(oldTime)
        } else {
          oldTime = 0
        }
        var nowTime = new Date(data)
        if (oldTime < nowTime.getTime()) {
          wx.showTabBarRedDot({
            index: 1
          })
          wx.setStorageSync('newCapsuleTime', nowTime.getTime())
        }
      })
  },
  clickTarget (event) {
    wx.navigateTo({
      url: '/pages/cardList/cardList?id=' + event.currentTarget.dataset.id
    })
  },
  clickLockTarget () {
    wx.hideTabBar({
      aniamtion: true
    })
    this.setData({showLockUserDialog: true})
  },
  getLabelList() {
    labelModel.getLabelList()
      .then((list) => {
        this.setData({hashLable: labelModel.getHashTable(list)})
        this.getMap()
      })
  },
  getMap () {
    api.capsule.getUserTargetList()
      .then((data) => {
        var oldInfo = this.data.list
        var oldIndex
        for (let i = 0; i < oldInfo.length; i++) {
          if (oldInfo[i].capsuleInfo) {
            oldIndex = i + 1
          }
        }
        var nowIndex
        for (let i = 0; i < data.length; i++) {
          if (data[i].capsuleInfo) {
            nowIndex = i + 1
          }
        }
        if (nowIndex > oldIndex) {
          this.setData({showNewTargetDialog: true})
        }

        for (let i = 0; i < data.length; i++) {
          data[i].capsuleTargetInfo.index = 0
          for (let j = 0; j < i; j++) {
            if (data[j].capsuleTargetInfo.labelTarget == data[i].capsuleTargetInfo.labelTarget) {
              data[i].capsuleTargetInfo.index += 1
            }
          }
          if (data[i].capsuleTargetInfo.medalImgUrl.indexOf('./upload') != -1) {
            data[i].capsuleTargetInfo.medalImgUrl = 'http://wx.xinjijiaoyu.com' + data[i].capsuleTargetInfo.medalImgUrl.substring(1)
          }
        }
        console.log(data)
        this.setData({list: data})
      })
  },
  getTargetActiveDay () {
    api.capsule.getTargetActiveDay()
      .then((data) => {
        this.setData({activeDayInfo: data})
      })
  },
  hideDialog () {
    wx.showTabBar({
      aniamtion: true
    })
    this.setData({showNewUserDialog: false})
    this.setData({showOldUserDialog: false})
    this.setData({showLockUserDialog: false})
    this.setData({showNewTargetDialog: false})
  },
  getChildrenInfo() {
    userModules.getChildrenInfo()
      .then((res) => {
        res.childAge = common.countAge(res.childrenList[0].birthday)
        this.setData({childrenInfo: res})
      })
  }
})