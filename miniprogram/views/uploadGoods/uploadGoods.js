// miniprogram/views/uploadGoods/uploadGoods.js
const app = getApp();
const { goodsDb } = require("../../utils/dbUtil/legoGoods.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsData: { mainType: 0, subType: [], content: { detail: [] }, buyWay:3, imgs:[]},
    mainTypes:[],
    subTypes: app.globalData.dic.goodsType[0].subClass,
    subTypeCheckStatus:{},
    buyWayTypes: ["淘宝","天猫","自营"],
    mainImages:[],
    detailImage:[],
    showPreview:false,
    colosePreviewGoods:null

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { goodsData } = this.data;
    goodsData.wx = app.globalData.userInfo.wx;

    //函数设置
    this.setData({
      goodsData: goodsData,
      colosePreviewGoods: this.colosePreviewGoods.bind(this)
    })
    //商品主类型字典
    let tempMtypes = [];
    app.globalData.dic.goodsType.map(type=>{
      tempMtypes.push({name:type.name, code:type.code})
    })
    this.setData({
      mainTypes: tempMtypes
    })
  },
  inputName:function(e){
    let { goodsData } = this.data;
    goodsData.name = e.detail.value;
    this.setData({
      goodsData: goodsData
    });
    return e.detail.value;
  },
  inputWxh: function (e) {
    let { goodsData } = this.data;
    goodsData.wx = e.detail.value;
    this.setData({
      goodsData: goodsData
    })
    return e.detail.value;
  },
  inputBuyKey: function (e) {
    let { goodsData } = this.data;
    goodsData.buyKey = e.detail.value;
    this.setData({
      goodsData: goodsData
    })
    return e.detail.value;
  },
  inputReason: function (e) {
    let { goodsData } = this.data;
    goodsData.content.reason = e.detail.value;
    this.setData({
      goodsData: goodsData
    })
    return e.detail.value;
  },
  inputOrgPrice: function(e) {
    let { goodsData } = this.data;
    goodsData.orgPrice = e.detail.value;
    this.setData({
      goodsData: goodsData
    })
    return e.detail.value;
  },
  inputPrice: function (e) {
    let { goodsData } = this.data;
    goodsData.price = e.detail.value;
    this.setData({
      goodsData: goodsData
    })
    return e.detail.value;
  },
  bindGoodsTypePickerChange: function (e) {
    let {goodsData} = this.data;
    goodsData.mainType = e.detail.value;
    let subClassArr = app.globalData.dic.goodsType[goodsData.mainType].subClass;
    this.setData({
      goodsData: goodsData,
      subTypes:subClassArr,
      subTypeCheckStatus:{}
    })
  },
  bindGoodsSubTypePickerChange:function(e){
    let { goodsData } = this.data;
    goodsData.subType = e.detail.value;
    let subTypeCheckStatus = {};
    goodsData.subType.map(code=>{
      subTypeCheckStatus[code] = true;
    })
    console.info(goodsData.subType);
    this.setData({
      goodsData: goodsData,
      subTypeCheckStatus: subTypeCheckStatus
    })
  },
  bindBuyWayPickerChange:function(e){
    let { goodsData } = this.data;
    goodsData.buyWay = Number(e.detail.value) + 1;
    this.setData({
      goodsData: goodsData
    })
  },
  //选择主图片
  doUploadMainImages: function () {
    let that = this;
    let { mainImages} = this.data;
    if (mainImages.length>=5){
      return;
    }
    // 选择图片
    wx.chooseImage({
      count: 5-mainImages.length,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        mainImages = mainImages.concat(res.tempFilePaths);
        that.setData({
          mainImages: mainImages
        });
      },
      fail: e => {
        console.error(e)
      }
    })
  },
  //选择详情图片
  doUploadDetialImages: function () {
    let that = this;
    let { detailImage } = this.data;
    if (detailImage.length >= 10) {
      return;
    }
    // 选择图片
    wx.chooseImage({
      count: 10-detailImage.length,
      sizeType: ['original'],
      sourceType: ['album'],
      success: function (res) {
        detailImage = detailImage.concat(res.tempFilePaths);
        that.setData({
          detailImage: detailImage
        });
      },
      fail: e => {
        console.error(e)
      }
    })
  },
  uploadGoods:function(){
    let that = this;
    wx.showLoading({
      title: '上传中',
    })
    this.uploadAllImages(function(){
      goodsDb.insertGoods(that.data.goodsData).then(res=>{
        console.info(res);
        wx.hideLoading();
        wx.showToast({
          icon: 'success',
          title: '上传成功',
        });
        that.returnPre();
      });
    })
   // goodsDb.insertGoods(this.data.goodsData);
  },
  uploadAllImages:function(finish){
    let that = this;
    let { mainImages, detailImage, goodsData} = this.data;
    let allImages = mainImages.concat(detailImage);
    let count = allImages.length;
    let randomKey = Date.now().toString(36);
    //清空之前的本地图片
    goodsData.mainImg = "";
    goodsData.imgs = [];
    goodsData.content.detail = [];
    allImages.map((filePath,index)=> {
      let cloudPath = 'goodsimg-test/goods-img' + randomKey+"-"+index + filePath.match(/\.[^.]+?$/)[0];
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: res => {
          if (index > (mainImages.length-1)){ //详情图片
            goodsData.content.detail.push(res.fileID);
          }else{
            goodsData.imgs.push(res.fileID);
          }
          if(index==0){
            goodsData.mainImg = res.fileID;
          }
          that.setData({
            goodsData: goodsData
          });
          if (count<=1){
            if (finish) finish();
          }
          console.log('[上传文件] 成功：'+count, res)
        },
        fail: e => {
          console.error('[上传文件] 失败：', e)
          wx.showToast({
            icon: 'none',
            title: '图片'+index+'上传失败',
          })
        },
        complete: () => {
          count--;
          //wx.hideLoading()
        }
      })
    });
    
  },
  previewGoods:function(){
    let { mainImages, detailImage, goodsData } = this.data;
    goodsData.mainImg = mainImages[0];
    goodsData.imgs = mainImages;
    goodsData.content.detail = detailImage;
    this.setData({
      showPreview:true,
      goodsData: goodsData
    });
  },
  colosePreviewGoods:function(){
    this.setData({
      showPreview:false
    });
  },
  returnPre:function(){
    wx.navigateBack({ delta:1 });
  },
  mainImgClick:function(e){
    let {mainImages} = this.data;
    let id = e.currentTarget.id;
    mainImages.splice(Number(id),1);
    this.setData({
      mainImages: mainImages
    })
  },
  detialImgClick: function (e) {
    let { detailImage } = this.data;
    let id = e.currentTarget.id;
    detailImage.splice(Number(id), 1);
    this.setData({
      detailImage: detailImage
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})