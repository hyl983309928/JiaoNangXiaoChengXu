
const api = require("./api.js");

module.exports.changeImgSize = function (event) {
  let url = event.currentTarget.dataset.url
  let width = event.currentTarget.dataset.width
  if (width) {
    return url + '?x-oss-process=image/resize,w_' + width
  }
  return url
}

module.exports.countImgUrl = function (event) { // 判断是否为服务器图片
  let url = event.currentTarget.dataset.url
  if (url.indexOf('/uploads/') != -1) {
    return 'https://wx.xinjijiaoyu.com' + url.substring(1)
  }
  return url
}

module.exports.uploadImg = function (url) {
  return new Promise((resole, reject)=>{
    api.user.getOossSignature()
      .then((res) => {
        var key = res.dir + url.replace("http://tmp","xiaoChengXu/photo")
        res.host = res.host.replace("http://","https://")
        var backUrl = res.host+"/"+key
        wx.uploadFile({
          url: res.host,
          filePath: url,
          name: 'file',
          formData: {
            key: key,
            policy: res.policy,
            OSSAccessKeyId: res.accessid,
            signature: res.signature,
            success_action_status: "200"
          },
          success: function (rs) {
            resole({ url: backUrl});
          },
          fail: function (err) {
            console.log(22222)
            reject(err);
          }
        })
      })
  })
}

module.exports.countAge = function(birthday) {
  try {
    var birD = new Date(birthday)
    var birthdayArr = birthday.split('-')
    var birthYear = parseInt(birthdayArr[0])
    var birthMonth = parseInt(birthdayArr[1])
    var birthDay = parseInt(birthdayArr[2])
    var nowD = new Date()
    var nowYear = nowD.getFullYear()
    var nowMonth = nowD.getMonth() + 1
    var nowDay = nowD.getDate()

    var countYear
    var countMonth
    var countWeek
    var countDay

    var oneYearD = new Date((birthYear + 1) + '/' + birthMonth + '/' + birthDay)
    if (nowD.getTime() - oneYearD.getTime() > 0) { // 大于1岁
      countYear = nowYear - birthYear
      countMonth = nowMonth - birthMonth
      countDay = nowDay - birthDay
      if (countDay < 0) {
        countMonth -= 1
        countDay += 30
      }
      if (countMonth < 0) {
        countYear -= 1
        countMonth += 12
      }
      return countYear + '岁' + countMonth + '个月'
    } else {
      countYear = nowYear - birthYear
      countMonth = nowMonth - birthMonth
      countDay = nowDay - birthDay
      if (countYear > 0) {
        countMonth += 12
      }
      if (countDay < 0) {
        countMonth -= 1
        countDay += 30
      }
      countWeek = parseInt(countDay / 7)
      return countMonth + '月' + countWeek + '周'
    }
  } catch (e) {
    return '0岁'
  }
}


