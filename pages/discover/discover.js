const api = require("../../utils/api.js");
const labelModel = require("../../utils/modules/label.js");
Page({
  data: {
    page: 1,
    labelList: {},
    optionOpen: 0,
    optionSelect: {
      scene: {
        id: 0,
        title: ''
      },
      order: {
        value: 'downtime',
        label: '最新'
      },
      age: {
        id: 0,
        title: ''
      },
      target: {
        id: 0,
        title: ''
      }
    },
    list: [],
    windowHeight: 0,
    isMore: true,
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
    ageMap: [],
    targetMap: [],
    targetBuff: {
      oneTarget: 1,
      twoTarget: 1
    },
    sceneList: [],
    orderLabelList: [
      {'text': '热度', 'value': 'hot', 'label': '热度'},
      {'text': '上传时间从近到远', 'value': 'downtime', 'label': '最新'},
      {'text': '上传时间从远到近', 'value': 'uptime', 'label': '最早'}
    ],
    targetList: [
      {
        name:'观察力',
        fatherId: 14
      },
      {
        name:'计划力',
        fatherId: 5
      }
    ]
  },
  onLoad (event) {
    wx.hideTabBarRedDot({
      index: 1
    })
    this.getSystemInfo()
    this.getLabelList(event)
  },
  goCapsuleInfo (event) {
    wx.navigateTo({
      url:"/pages/capsuleInfo/capsuleInfo?capsuleId=" + event.currentTarget.dataset.id
    })
  },
  getLabelList(event) {
    api.label.getRootLabel()
      .then((data) => {
        var capsuleScenneParent
        for (var i = 0; i < data.list.length; i++) {
          if (data.list[i].code === 'capsuleScenne') {
            capsuleScenneParent = data.list[i].id
          }
        }
        labelModel.getLabelList()
          .then((list) => {
            this.setData({labelList: labelModel.getHashTable(list)})
            this.setData({sceneList: labelModel.getChildrenLabels(list,capsuleScenneParent)})
            this.setData({targetMap: labelModel.getChildrenLabels(list,1)})
            this.setData({ageMap: labelModel.getChildrenLabels(list, 2).slice(0, labelModel.getChildrenLabels(list, 2).length - 1)})
            console.log(this.data.targetMap)
            if (event.labelScene) {
              this.setData({'optionSelect.scene.id': parseInt(event.labelScene)})
              this.setData({'optionSelect.scene.title': this.data.labelList[parseInt(event.labelScene)].title})
            }
            this.getList()
          })
      })
  },
  changeTargetTop (event) {
    this.setData({'targetBuff.oneTarget': event.currentTarget.dataset.index})
  },
  changeTargetLeft (event) {
    this.setData({'targetBuff.twoTarget': event.currentTarget.dataset.index})
  },
  changeTargetRight (event) {
    this.setData({'optionSelect.target.title': event.currentTarget.dataset.title})
    this.setData({'optionSelect.target.id': event.currentTarget.dataset.id})
    this.setData({optionOpen: 0})
    this.setData({list: []})
    this.setData({page: 1})
    this.getList()
  },
  hideOption () {
    this.setData({optionOpen: 0})
  },
  targetAllClick (event) {
    this.setData({'optionSelect.target.title': ''})
    this.setData({'optionSelect.target.id': 0})
    this.setData({optionOpen: 0})
    this.setData({list: []})
    this.setData({page: 1})
    this.getList()
  },
  changeAge (event) {
    if (this.data.optionSelect.age.id == event.currentTarget.dataset.id) {
      return
    }
    this.setData({'optionSelect.age.id': event.currentTarget.dataset.id})
    this.setData({'optionSelect.age.title': event.currentTarget.dataset.title})
    this.setData({optionOpen: 0})
    this.setData({list: []})
    this.setData({page: 1})
    this.getList()
  },
  changeScene (event) {
    if (this.data.optionSelect.scene.id == event.currentTarget.dataset.id) {
      return
    }
    this.setData({'optionSelect.scene.id': event.currentTarget.dataset.id})
    this.setData({'optionSelect.scene.title': event.currentTarget.dataset.title})
    this.setData({optionOpen: 0})
    this.setData({list: []})
    this.setData({page: 1})
    this.getList()
  },
  changeOrder (event) {
    if (this.data.optionSelect.order.value == event.currentTarget.dataset.value) {
      return
    }
    this.setData({'optionSelect.order.value': event.currentTarget.dataset.value})
    this.setData({'optionSelect.order.label': event.currentTarget.dataset.label})
    this.setData({optionOpen: 0})
    this.setData({list: []})
    this.setData({page: 1})
    this.getList()
  },
  changeNav(event) {
    if (this.data.optionOpen == event.currentTarget.dataset.index) {
      this.setData({optionOpen: 0})
    } else {
      this.setData({optionOpen: event.currentTarget.dataset.index})
    }
  },
  scrolltolower () {
    if (!this.data.isMore) {
      return
    }
    this.setData({page: this.data.page + 1})
    this.getList()
  },
  getSystemInfo () {
    let _this = this
    wx.getSystemInfo({
      success: function (data) {
        let rem = data.windowWidth / 750
        _this.setData({windowHeight: data.windowHeight - 80 * rem})
      }
    })
  },
  getList() {
    wx.showLoading({title: '加载中'})
    var params = {
      length: 20,
      offset: (this.data.page - 1) * 20,
      orderType: this.data.optionSelect.order.value,
      labelTarget: this.data.optionSelect.target.id,
      labelAge: this.data.optionSelect.age.id,
      labelScene: this.data.optionSelect.scene.id
    }
    api.capsule.getList(params)
      .then((data) => {
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
          item.created_label = item.created_at.substring(0,10)
          return item
        })
        this.setData({list: this.data.list.concat(temp)})
        wx.hideLoading()
        if (temp.length == 0) {
          this.setData({isMore: false})
        }
      })
      .catch(() => {
        wx.hideLoading()
      })
  }
})