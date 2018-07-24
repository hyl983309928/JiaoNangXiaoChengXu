const api = require("../../utils/api.js");
const app = getApp()
const userModules = require('../../utils/modules/user.js')
const labelModel = require("../../utils/modules/label.js");
Page({
  data: {
    hashLable: {},
    id: 0,
    childrenInfo: {},
    list: [],
    capsuleInfo: {},
    bgColorList: ['#7adfe4','#75b4f4', '#bd75f4', '#e47a7a', '#fab87d', '#f4cc75', '#e47aa4'],
    sceneTypeMap: {
      1: 'game',
      2: 'look',
      3: 'speak'
    },
    preCard: 1,
    nowCard: 1,
    nowNav: 1,
    scaleNum: 0.8,
    num: 0,
    cardItemNum: 0,
    isMoving: false,
    showLockDialog: false,
    showTargetDialog: false,
    mouseInfo: {
      stX: 0, // 手指按下的X位置
      stTime: 0, // 手指按下的时间
      nowX: 0
    },
    cardmouseInfo: {
      stX: 0, // 手指按下的X位置
      stTime: 0, // 手指按下的时间
      nowX: 0
    }
  },
  onLoad(event) {
    var _this = this
    this.setData({id: event.id})
    wx.getSystemInfo({
      success(data) {
        _this.setData({num: parseInt((data.windowWidth / 750) * 187.5)})
        _this.setData({cardItemNum: parseInt((data.windowWidth / 750) * 661)})
      }
    })
    this.getLabelList()
    this.getChildrenInfo()
  },
  goDiscover () {
    wx.switchTab({
      url: '/pages/discover/discover'
    })
  },
  showTargetDescription () {
    this.setData({showTargetDialog: true})
  },
  hideTargetDialog () {
    this.setData({showTargetDialog: false})
  },
  getLabelList() {
    labelModel.getLabelList()
      .then((list) => {
        this.setData({hashLable: labelModel.getHashTable(list)})
        this.getList()
      })
  },
  getChildrenInfo() {
    userModules.getChildrenInfo()
      .then((res) => {
        this.setData({childrenInfo: res})
      })
  },
  getList () {
    api.capsule.getTargetCapsules(this.data.id)
      .then((data) => {

        data.description_title = ''
        let descriptionMap = this.data.hashLable[data.targetInfo.labelTarget].description
        if (descriptionMap[data.targetInfo.labelAge]) {
          data.description_title = descriptionMap[data.targetInfo.labelAge]
        } else {
          data.description_title = descriptionMap.default
        }

        this.setData({capsuleInfo: data})
        var list = data.capsuleInfo.list
        var nowCard = 0

        var temp = list.map((item, index) => {
          item.targetSceneLabelTitle = []
          var temp = item.labelTarget
          for (let j = 0; j < temp.length; j++) {
            item.targetSceneLabelTitle.push(this.data.hashLable[temp[j]].title)
          }
          item.targetSceneLabelTitle = item.targetSceneLabelTitle.slice(0, 3)
          if (item.cover && item.cover.indexOf('./upload') != -1) {
            item.cover = 'http://wx.xinjijiaoyu.com' + item.cover.substring(1)
          }

          if (item.completeStatus == false && !nowCard) {
            nowCard = index + 1
          }

          return item
        })
        this.setData({nowCard: nowCard || 1})
        this.changenav()
        this.setData({list: temp})
        this.setTitleColor()
      })
  },
  setTitleColor() {
    wx.setNavigationBarTitle({
      title: this.data.hashLable[this.data.capsuleInfo.targetInfo.labelTarget].title
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: this.data.bgColorList[this.data.nowCard - 1]
    })
    this.setData({preCard: this.data.nowCard})
  },
  changeNowCard (event) {
    this.setData({nowCard: parseInt(event.currentTarget.dataset.index)})
    this.setTitleColor()
  },
  changenav() {
    if (this.data.nowNav <= this.data.nowCard - 4) {
      this.setData({nowNav: this.data.nowCard - 3})
    } else if (this.data.nowNav > this.data.nowCard) {
      this.setData({nowNav: this.data.nowCard})
    }
  },
  goCapsuleInfo (event) {
    if (event.currentTarget.dataset.lock) {
      this.setData({showLockDialog: true})
    } else {
      let isWeek = false
      if (this.data.capsuleInfo.capsuleInfo.completeNum == 6) {
        isWeek = true
      }
      wx.navigateTo({
        url:"/pages/capsuleInfo/capsuleInfo?capsuleId=" + event.currentTarget.dataset.id + '&targetId=' + this.data.id + '&isWeek=' + isWeek
      })
    }
  },
  hideLockDialog () {
    this.setData({showLockDialog: false})
  },

  touchstartnav (event) {
    this.setData({isMoving: true})
    let stX = event.changedTouches[0].clientX
    this.data.cardmouseInfo.stX = stX
    let stTime = new Date()
    this.data.cardmouseInfo.stTime = stTime
    this.data.cardmouseInfo.nowX = this.data.nowNav
  },
  touchmovenav (event) {
    let moX = event.changedTouches[0].clientX
    let stX = this.data.cardmouseInfo.stX
    let dis = stX - moX
    this.setData({nowNav: this.data.cardmouseInfo.nowX + dis / this.data.num})
  },
  touchendnav (event) {
    this.setData({isMoving: false})
    if (this.data.nowNav < 1) {
      this.setData({nowNav: 1})
    } else if (this.data.nowNav > this.data.list.length - 3) {
      this.setData({nowNav: this.data.list.length - 3})
    } else {
      this.setData({nowNav: Math.round(this.data.nowNav)})
    }
    this.setTitleColor()
  },
  touchstartcard (event) {
    this.setData({isMoving: true})
    let stX = event.changedTouches[0].clientX
    this.data.cardmouseInfo.stX = stX
    let stTime = new Date()
    this.data.cardmouseInfo.stTime = stTime
    this.data.cardmouseInfo.nowX = this.data.nowCard
  },
  touchmovecard (event) {
    let moX = event.changedTouches[0].clientX
    let stX = this.data.cardmouseInfo.stX
    let dis = stX - moX
    this.setData({nowCard: this.data.cardmouseInfo.nowX + dis / this.data.cardItemNum})
  },
  touchendcard (event) {
    let endX = event.changedTouches[0].clientX
    let dis = this.data.cardmouseInfo.stX - endX
    let endTime = new Date()
    let disTime = endTime.getTime() - this.data.cardmouseInfo.stTime.getTime()
    this.setData({isMoving: false})
    if (Math.abs(dis / disTime) > 0.6) {
      if (dis > 0) {
        this.data.nowCard = parseInt(this.data.nowCard) + 1
      } else {
        this.data.nowCard = parseInt(this.data.nowCard)
      }
    } else {
      this.data.nowCard = Math.round(this.data.nowCard)
    }
    if (this.data.nowCard < 1) {
      this.data.nowCard = 1
    } else if (this.data.nowCard > this.data.list.length) {
      this.data.nowCard = this.data.list.length
    }
    this.setData({nowCard: this.data.nowCard})
    this.changenav()
    this.setTitleColor()
  },
  touchmove() {}
})