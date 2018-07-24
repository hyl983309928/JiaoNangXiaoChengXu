const api = require("../../utils/api.js");
let WxParse = require('../../wxParse/wxParse.js');
const userModules = require('../../utils/modules/user.js')
const labelModel = require("../../utils/modules/label.js");

Page({
  data: {
    capsuleId: 0,
    targetId: 0,
    isWeek: false, // 是否跳转到周报
    isCollect: false, // 是否收藏
    hashLable: {},
    isExercise: true, //是否练习 打卡
    showEvaluateDialog: false,
    childrenInfo: {},
    info: {},
    sceneExample: '', // 场景示范，（快跟我动起来）
    keyPoint: '', // 要点（小提示）
    property: '', // 道具准备
    benefit: '', //好处
    evaluate: '3',
    targetList: [],
    capsuleActionId: 0 // 打卡的ID
  },
  onLoad(event) {
    console.log(event)
    this.setData({capsuleId:parseInt(event.capsuleId)})
    this.setData({targetId:parseInt(event.targetId)})
    this.setData({isWeek:event.isWeek})
    this.getLabelList()
    this.getAction()
    this.getChildrenInfo()
  },
  onShareAppMessage (res) {
    var sceneTypeMap = {
      1: '一起玩',
      2: '一起看',
      3: '一起聊'
    }
    var title = '【良心分享】陪娃小胶囊一个，适合和'+ this.data.info.labelAge_title +'的娃' + sceneTypeMap[this.data.info.sceneType] + '。'
    var params = {
      info: this.data.info,
      childrenInfo: this.data.childrenInfo,
      sceneExample: this.data.sceneExample,
      keyPoint: this.data.keyPoint,
      property: this.data.property,
      benefit: this.data.benefit,
      targetList: this.data.targetList
    }
    console.log(encodeURIComponent(JSON.stringify(params)))
    return {
      title: title,
      path: '/pages/capsuleInfoShare/capsuleInfoShare?params=' + encodeURIComponent(JSON.stringify(params)),
      success: function () {
      }
    }
  },
  getLabelList() {
    labelModel.getLabelList()
      .then((list) => {
        this.setData({hashLable: labelModel.getHashTable(list)})
        this.getCapsuleInfo()
      })
  },
  collectCapsule () {
     var params = {
       capsuleId: this.data.capsuleId,
       actionType: 'collect'
     }
     if (this.data.isCollect) {
       api.capsule.delAction(params)
         .then((res) => {
           this.setData({isCollect: false})
         })
     } else {
       api.capsule.addAction(params)
         .then((res) => {
           this.setData({isCollect: true})
           wx.showToast({
             title: '收藏成功',
             icon: 'success',
             duration: 1500
           })
           wx.reportAnalytics('capsule_collect', {
             capsule_id: this.data.capsuleId,
             is_discover_capsule: this.data.targetId ? '否' : '是',
             capsule_title: this.data.info.topic
           })
         })
     }

  },
  getAction () {
    var params1 = {
      capsuleId: this.data.capsuleId,
      actionType: 'collect'
    }
    api.capsule.getAction(params1)
      .then((res) => {
        if (res.id) {
          this.setData({isCollect: true})
        }
      })

    var params2 = {
      capsuleId: this.data.capsuleId,
      actionType: 'exercise'
    }
    api.capsule.getAction(params2)
      .then((res) => {
        if (res.id) {
          this.setData({isExercise: true})
        } else {
          this.setData({isExercise: false})
        }
      })
  },
  evaluateConfim () {
    var params = {
      capsuleActionId: this.data.capsuleActionId,
      actionType: 'performance',
      actionText: this.data.evaluate
    }
    api.capsule.addAnsAction(params)
      .then((data) => {
        wx.reportAnalytics('capsule_evaluate', {
          capsule_id: this.data.capsuleId,
          is_discover_capsule: this.data.targetId ? '否' : '是',
          capsule_title: this.data.info.topic,
          evaluate_title: this.data.evaluate=='3'?'很嗨':this.data.evaluate=='2'?'一般':this.data.evaluate=='1'?'没意思':'未知'
        })
        if (this.data.targetId) {
          if(String(this.data.isWeek) == 'true') {
            wx.navigateTo({
              url: '/pages/weeklyReport/weeklyReport?userTargetId=' + this.data.targetId + '&capsuleId=' + this.data.capsuleId
            })
          } else {
            wx.navigateTo({
              url: '/pages/everydayReport/everydayReport?userTargetId=' + this.data.targetId + '&capsuleId=' + this.data.capsuleId
            })
          }
        } else {
          this.setData({showEvaluateDialog: false})
          wx.navigateTo({
            url: '/pages/discoverReport/discoverReport?topic=' + this.data.info.topic + '&evaluate=' + this.data.evaluate
          })
        }
      })
  },
  answerExer () {
    if (this.data.isExercise) {
      // if (this.data.targetId) {
      //   if(String(this.data.isWeek) == 'true') {
      //     wx.navigateTo({
      //       url: '/pages/weeklyReport/weeklyReport?userTargetId=' + this.data.targetId + '&capsuleId=' + this.data.capsuleId
      //     })
      //   } else {
      //     wx.navigateTo({
      //       url: '/pages/everydayReport/everydayReport?userTargetId=' + this.data.targetId + '&capsuleId=' + this.data.capsuleId
      //     })
      //   }
      // }
      // wx.navigateTo({
      //   url: '/pages/discoverReport/discoverReport?topic=' + this.data.info.topic + '&evaluate=' + this.data.evaluate
      // })
      // wx.navigateTo({
      //   url: '/pages/weeklyReport/weeklyReport?userTargetId=' + this.data.targetId + '&capsuleId=' + this.data.capsuleId
      // })
      // wx.navigateTo({
      //   url: '/pages/everydayReport/everydayReport?userTargetId=' + this.data.targetId + '&capsuleId=' + this.data.capsuleId
      // })
      wx.showToast({
        title: '您已经打过卡了',
        icon: 'success',
        duration: 1500
      })
    } else {
      var params1 = {
        capsuleId: this.data.capsuleId,
        actionType: 'exercise',
        actionText: '{}',
        userTargetId: this.data.targetId
      }
      api.capsule.addAction(params1)
        .then((res) => {
          this.setData({isExercise: true})
          this.setData({capsuleActionId: res})
          this.setData({showEvaluateDialog: true})
          this.backValue()

          wx.reportAnalytics('capsule_exercise', {
            capsule_id: this.data.capsuleId,
            is_discover_capsule: this.data.targetId ? '否' : '是',
            capsule_title: this.data.info.topic
          })
        })
    }
  },
  backValue () {
    var routeList = getCurrentPages()
    if (routeList[routeList.length - 2].route == 'pages/discover/discover') {
      var temp
      for (var i = 0; i < routeList[routeList.length - 2].data.list.length; i++) {
        if (this.data.capsuleId == routeList[routeList.length - 2].data.list[i].id) {
          temp = i
        }
      }
      var label = 'list[' + temp + '].hasAnswer'
      routeList[routeList.length - 2].setData({[label]: true})
    } else if (routeList[routeList.length - 2].route == 'pages/cardList/cardList') {
      var temp
      for (var i = 0; i < routeList[routeList.length - 2].data.list.length; i++) {
        if (this.data.capsuleId == routeList[routeList.length - 2].data.list[i].id) {
          temp = i
        }
      }
      var label = 'list[' + temp + '].completeStatus'
      routeList[routeList.length - 2].setData({[label]: 1})
      routeList[routeList.length - 2].setData({'capsuleInfo.capsuleInfo.completeNum': routeList[routeList.length - 2].data.capsuleInfo.capsuleInfo.completeNum + 1})
    }
  }
  ,
  hideEvaluateDialog () {
    this.setData({showEvaluateDialog: false})
  },
  evaluateClick(event) {
    this.setData({evaluate: event.currentTarget.dataset.index})
  },
  getChildrenInfo() {
    userModules.getChildrenInfo()
      .then((res) => {
        this.setData({childrenInfo: res})
      })
  },
  getCapsuleInfo() {
    api.capsule.getCapsule(this.data.capsuleId)
      .then(data => {
        if (data.smallCover && data.smallCover.indexOf('./upload') != -1) {
          data.smallCover = 'http://wx.xinjijiaoyu.com' + data.smallCover.substring(1)
        }
        data.labelAge_title = ''
        var ageListTemp = []
        for (let i = 0; i < data.labelAge.length; i++) {
          let temp = this.data.hashLable[data.labelAge[i]].code.split('_')
          ageListTemp.push(parseInt(temp[0]))
          ageListTemp.push(parseInt(temp[1]))
        }
        ageListTemp.sort(function (a, b) {
          return a - b
        })
        data.labelAge_title = ageListTemp[0] + '-' + ageListTemp[ageListTemp.length - 1] + '岁'



        data.labelScene_title = []
        for (let i = 0; i < data.labelScene.length; i++) {
          data.labelScene_title.push(this.data.hashLable[data.labelScene[i]].title)
        }
        data.labelScene_title = data.labelScene_title.join('·')

        this.setData({targetList: this.countTargetTitle(data)})


        WxParse.wxParse('sceneExample' , 'html', data.sceneExample, this)
        WxParse.wxParse('keyPoint' , 'html', data.keyPoint, this)
        WxParse.wxParse('property' , 'html', data.property, this)
          WxParse.wxParse('benefit' , 'html', data.benefit, this)

        this.setData({info:data})
      })
  },
  countTargetTitle (data) {
    var targetIdList = []
    for (let i = 0; i < data.labelTarget.length; i++) {
      let temp = {}
      temp.id = data.labelTarget[i]
      temp.parentid =data.labelTarget[i]
      if (this.data.hashLable[temp.parentid].parent_id) {
        temp.parentid = this.data.hashLable[temp.parentid].parent_id
      }
      if (this.data.hashLable[temp.parentid].parent_id) {
        temp.parentid = this.data.hashLable[temp.parentid].parent_id
      }
      targetIdList.push(temp)
    }
    var targetList = [
      {
        target: 5,
        list: []
      },
      {
        target: 14,
        list: []
      },
      {
        target: 15,
        list: []
      }
    ]
    for (let i = 0; i < targetIdList.length; i++) {
      let temp = {}
      let item = targetIdList[i]
      for (let j = 0; j < targetList.length; j++) {
        if (item.parentid === targetList[j].target) {
          targetList[j].list.push(item.id)
          break
        }
      }
    }
    for (let i = 0; i < targetList.length; i++) {
      let list = targetList[i].list
      targetList[i].target = this.data.hashLable[targetList[i].target].title
      for (let j = 0; j < list.length; j++) {
        list[j] = this.data.hashLable[list[j]].title
      }
    }
    return targetList
  }
})