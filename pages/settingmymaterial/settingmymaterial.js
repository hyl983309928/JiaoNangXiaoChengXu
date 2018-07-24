
const userModules = require('../../utils/modules/user.js')
const app = getApp()
import WeCropper from '../../utils/we-cropper/we-cropper.js'
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50
const common = require("../../utils/common.js");
const api = require("../../utils/api.js");
Page({
  data: {
    userInfo: {},
    childrenInfo: {},
    iscropper: false,
    showInput: false,
    inputMadel: {
      title: '请输入昵称',
      valur: ''
    },
    action: '',
    index: 1,
    endDate: '',
    identitylist: ['爸爸','妈妈','爷爷', '奶奶', '外公', '外婆', '七大姑八大姨'],
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 300) / 2,
        y: (height - 300) / 2,
        width: 300,
        height: 300
      }
    }
  },
  onReady () {
    let d = new Date()
    this.setData({endDate: d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()})
    this.getChildrenInfo()
    this.setData({userInfo: app.globalData.userInfo})
    console.log(app.globalData.userInfo)
  },
  submit () {
    api.user.updateChildrenInfo(this.data.childrenInfo)
      .then((res) => {
        wx.switchTab({
          url: '/pages/myInfo/myInfo',
          success: function () {
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 1500
            })
          }
        })
      })
      .catch(() => {
        wx.showToast({
          title: '修改失败',
          icon: 'none',
          duration: 1500
        })
      })
  },
  changeIdentity (e) {
    this.setData({'childrenInfo.identity': this.data.identitylist[e.detail.value]})
    api.user.updateChildrenInfo(this.data.childrenInfo)
  },
  changeBirthday (e) {
    this.setData({'childrenInfo.childrenList[0].birthday': e.detail.value})
    api.user.updateChildrenInfo(this.data.childrenInfo)
  },
  changeChildSex () {
    var _this = this
    wx.showActionSheet({
      itemList: ['男', '女'],
      success(e) {
        _this.setData({'childrenInfo.childrenList[0].sex': e.tapIndex})
        api.user.updateChildrenInfo(this.data.childrenInfo)
      }
    })
  },
  changeChildName (event) {
    this.setData({action: event.currentTarget.dataset.action})
    if (this.data.action == 'child') {
      this.setData({'inputMadel.title': '请输入孩子昵称'})
      this.setData({'inputMadel.value': this.data.childrenInfo.childrenList[0].name})
    } else {
      this.setData({'inputMadel.title': '请输入家长昵称'})
      this.setData({'inputMadel.value': this.data.childrenInfo.name})
    }
    this.setData({showInput: true})
  },
  bindinput (e) {
    this.setData({'inputMadel.value': e.detail.value})
  },
  cancelInput () {
    this.setData({showInput: false})
  },
  confimInput () {
    if (this.data.action == 'child') {
      this.setData({'childrenInfo.childrenList[0].name': this.data.inputMadel.value})
    } else {
      this.setData({'childrenInfo.name': this.data.inputMadel.value})
    }
    this.setData({showInput: false})
    api.user.updateChildrenInfo(this.data.childrenInfo)
  },
  changeHead (data) {
    var _this = this
    console.log(data)
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const src = res.tempFilePaths[0]
        _this.setData({action: data.currentTarget.dataset.action})
        _this.setData({iscropper: true})
        if (_this.data.index == 1) {
          _this.startUpload({src})
          _this.setData({index: 2})
        } else {
          console.log(111)
          _this.wecropper.pushOrign(src)
        }
      }
    })
  },
  closeUpload () {
    this.setData({iscropper: false})
  },
  getChildrenInfo() {
    userModules.getChildrenInfo()
      .then((res) => {
        this.setData({childrenInfo: res})
      })
  },
  touchStart (e) {
    this.wecropper.touchStart(e)
  },
  touchMove (e) {
    this.wecropper.touchMove(e)
  },
  touchEnd (e) {
    this.wecropper.touchEnd(e)
  },
  getCropperImage () {
    var _this = this
    this.wecropper.getCropperImage((avatar) => {
      if (avatar) {
        _this.setData({iscropper: false})
        wx.showLoading({ title: "上传中"})
        common.uploadImg(avatar)
          .then((data) => {
            if (this.data.action == 'child') {
              _this.setData({'childrenInfo.childrenList[0].headimgUrl': data.url})
            } else if (this.data.action == 'parent') {
              _this.setData({'childrenInfo.parentsPicture': data.url})
            }
            api.user.updateChildrenInfo(this.data.childrenInfo)
            wx.hideLoading()
          })
          .catch((e) => {
            wx.hideLoading()
            wx.showToast({
              title: '上传失败，请重新上传',
              icon: 'success',
              duration: 1500,
              mask: true
            })
          })
      } else {
        console.log('获取图片失败，请稍后重试')
      }
    })
  },
  uploadTap () {
    const self = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success (res) {
        const src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值

        self.wecropper.pushOrign(src)
      }
    })
  },
  startUpload (option) {
    const { cropperOpt } = this.data
    if (option.src) {
      cropperOpt.src = option.src
      new WeCropper(cropperOpt)
        .on('ready', (ctx) => {
          console.log(`wecropper is ready for work!`)
        })
        .on('beforeImageLoad', (ctx) => {
          console.log(`before picture loaded, i can do something`)
          console.log(`current canvas context:`, ctx)
          wx.showToast({
            title: '上传中',
            icon: 'loading',
            duration: 20000
          })
        })
        .on('imageLoad', (ctx) => {
          console.log(`picture loaded`)
          console.log(`current canvas context:`, ctx)
          wx.hideToast()
        })
        .on('beforeDraw', (ctx, instance) => {
          console.log(`before canvas draw,i can do something`)
          console.log(`current canvas context:`, ctx)
        })
        .updateCanvas()
    }
  }
})