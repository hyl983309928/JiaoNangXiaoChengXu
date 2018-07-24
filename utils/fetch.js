
const config = require("../config.js");
module.exports.fetch = (url = '', type = 'GET', data = {}, contentType ="application/json") => {
  url = config.baseUrl + url;
  return new Promise((resolve, reject)=>{
    const app = getApp();
    wx.request({
      url: url, 
      data: data,
      method: type,
      header: {
        'cookie': app&&app.globalData.token||"",
        'content-type': contentType
      },
      success: function (res) {
        console.log(res.header)
        if (res.data.code === 0) {
          if (url.indexOf('weAppLogin') !== -1) {
            resolve([res.data.data, res.header]);
          } else {
            resolve(res.data.data);
          }

        } else {
          reject(res.data);
          wx.showModal({
            title: '提示',
            content: '出错了！',
            showCancel: false,
            confirmText: '我知道了',
            success: function () {
            }
          })
        }
      },
      fail: function(res){
        reject();     
      }
    })
  })
}