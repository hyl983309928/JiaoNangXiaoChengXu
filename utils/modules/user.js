

const api = require('../api.js')

var childrenInfo = null


function getChildrenInfo () {
  return new Promise((resole, reject) => {
    if (childrenInfo) {
      return resole(childrenInfo)
    } else {
      api.user.getChildrenInfo()
        .then((res) => {
          childrenInfo = res
          return resole(childrenInfo)
        })
        .catch((e) => {
          reject(e)
        })
    }
  })
}
module.exports = {
  getChildrenInfo
}