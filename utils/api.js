let fetch = require("./fetch.js").fetch;

module.exports = {
  user: {
    login (data) { // 登入接口
      return fetch("/api/user/weAppLogin", "POST", data);
    },
    getOossSignature () { // 获取oss
      return fetch("/api/user/getOossSignature");
    },
    getChildrenInfo(userId) { // 获取孩子信息
      if (userId) {
        var params = {
          userId: userId
        }
        return fetch('/api/parent/getChildrenInfo', 'post', params)
      } else {
        return fetch('/api/parent/getChildrenInfo')
      }
    },
    createChildren() { // 创建学号
      return fetch('/api/parent/createChildren')
    },
    updateChildrenInfo(childrenInfo) { // 更新孩子信息
      return fetch('/api/parent/updateChildrenInfo', 'post', childrenInfo)
    },
  },
  capsule: {
    getList (data) {
      return fetch("/api/capsule/filterCapsuleList", "POST", data);
    },
    getCapsule (id) {
      return fetch('/api/capsule/getCapsule', "POST", {id})
    },
    addAction (data) {
      return fetch('/api/capsule/addAction', 'post', data)
    },
    getAction (data) {
      return fetch('/api/capsule/getAction', 'post', data)
    },
    delAction (data) {
      return fetch('/api/capsule/delAction', 'post', data)
    },
    addAnsAction (data) {
      return fetch('/api/capsule/addAnsAction', 'post', data)
    },
    getUserTargetList () {
      return fetch('/api/capsule/getUserTargetList')
    },
    receiveNewTarget () {
      return fetch('/api/capsule/receiveNewTarget')
    },
    getTargetActiveDay() {
      return fetch('/api/capsule/getTargetActiveDay')
    },
    getTargetCapsules(id) {
      return fetch('/api/capsule/getTargetCapsules', 'post', {userTargetId: id})
    },
    getDailyReport(data) {
      return fetch('/api/capsule/getDailyReport', 'post', data)
    },
    getWeeklyReport(data) {
      return fetch('/api/capsule/getWeeklyReport', 'post', data)
    },
    getActiveRate (userId) {
      return fetch('/api/capsule/getActiveRate','post', {userId})
    },
    getCapsuleListByAction (params) {
      return fetch('/api/capsule/getCapsuleListByAction','post', params)
    },
    getGrowInfo () {
      return fetch('/api/capsule/getGrowInfo')
    },
    getMedals () {
      return fetch('/api/capsule/getMedals')
    },
    getCapsuleLastUpdateTime () {
      return fetch('/api/capsule/getCapsuleLastUpdateTime')
    },
    getRadarList () {
      return fetch('/api/capsule/getRadarList')
    },
    getUser2018ActivityEverydayExerciseCount (userId) {
      return fetch('/api/capsule/getUser2018ActivityEverydayExerciseCount', 'post', { userId })
    }
  },
  label: {
    getList (params) {
      return fetch('/api/label/getLabelList', 'post', params)
    },
    getRootLabel () {
      return fetch('/api/label/getRootLabel')
    }
  }
}
