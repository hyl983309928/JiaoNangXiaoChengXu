
const api = require("../../utils/api.js");
const common = require("../../utils/common.js");
import WeCropper from '../../utils/we-cropper/we-cropper.js'
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50
Page({
  data: {
    title: '请完善宝宝资料',
    stepIndex: 1,
    focus: false,
    iscropper: false,
    info: {
      childrenList: [
        {
          birthday: '',
          headimgUrl: '',
          name: '',
          sex: -1
        }
      ],
      identity: '',
      name: '',
      telephone: ''
    },
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
  onLoad (event) {
    let _this = this
    api.user.getChildrenInfo()
      .then((data) => {
        _this.setData({info: data})
        if (data.childrenList[0].name || data.childrenList[0].headimgUrl || data.childrenList[0].birthday || (data.childrenList[0].sex === 0 || data.childrenList[0].sex === 1) || data.identity) {
          _this.setData({title: '请核对宝宝资料'})
        }
      })
  },
  changeImgSize: common.changeImgSize,
  countImgUrl: common.countImgUrl,
  changeSex (event) {
    this.setData({'info.childrenList[0].sex': event.currentTarget.dataset.sex})
  },
  nextStep (event) {
    console.log(event)
    if (!event.currentTarget.dataset.flag) {
      return
    }
    this.setData({'stepIndex': parseInt(event.currentTarget.dataset.index) + 1})
  },
  nameSend (event) {
    this.setData({'info.childrenList[0].name': event.detail.value})
  },
  chooseDate (event) {
    this.setData({'info.childrenList[0].birthday': event.detail.value})
  },
  chooseRelation (event) {
    console.log(event)
    this.setData({'info.identity': event.currentTarget.dataset.value})
  },
  selectIdentity (event) {
    var _this = this
    var list = ['爷爷', '奶奶', '外公', '外婆', '七大姑八大姨']
    wx.showActionSheet({
      itemList: list,
      success: function (res) {
        _this.setData({'info.identity': list[res.tapIndex]})
      }
    })
  },
  submit (event) {
    if (!event.currentTarget.dataset.flag) {
      return
    }
    if (!this.data.info.childrenList[0].headimgUrl) {
      this.setData({'info.childrenList[0].headimgUrl': 'http://xinjijiaoyu.oss-cn-shenzhen.aliyuncs.com/Accompany%20capsule%20Pop-up/Default%20head%20image.png'})
    }
    api.user.updateChildrenInfo(this.data.info)
      .then((res) => {
        wx.switchTab({
          url: '/pages/map/map',
          success: function () {
            api.capsule.receiveNewTarget()
              .then(() => {
                wx.reLaunch({
                  url: '/pages/map/map?isOldUser=2'
                })
              })
          }
        })
      })
      .catch(() => {
        wx.showToast({
          title: '创建信息失败',
          icon: 'none',
          duration: 1500
        })
      })
  },
  uploadImg () {
    var _this = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        // wx.showLoading({ title: "上传中"})
        _this.setData({iscropper: true})
        const src = res.tempFilePaths[0]
        _this.startUpload({src})
        // common.uploadImg(data.tempFilePaths[0])
        //   .then((data) => {
        //     // _this.data.info.childrenList[0].headimgUrl = data.url
        //     _this.setData({'info.childrenList[0].headimgUrl': data.url})
        //     wx.hideLoading()
        //   })
        //   .catch((e) => {
        //     wx.hideLoading()
        //     wx.showToast({
        //       title: '上传失败，请重新上传',
        //       icon: 'success',
        //       duration: 1500,
        //       mask: true
        //     })
        //   })
        // _this.data.childInfo.headImg =
        // _this.setData(_this.data)
      },
      fail: function () {
        wx.showToast({
          title: '已取消上传',
          icon: 'success',
          duration: 1500,
          mask: true
        })
      }
    })
  },
  closeUpload () {
    this.setData({iscropper: false})
  },
  getChildrenInfo() {
    api.user.getChildrenInfo()
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
            _this.setData({'info.childrenList[0].headimgUrl': data.url})
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