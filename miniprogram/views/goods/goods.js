// miniprogram/views/goods/goods.js
const app = getApp();
const { goodsDb } = require("../../utils/dbUtil/legoGoods.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsInfo:null,
    closeGoodsDetail:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    if(options.goodsInfo){
      this.setData({
        goodsInfo:options.goodsInfo
      })
    }else if(options.id){
      //获取物品详情
      wx.showLoading({
        title: '加载中'
      })
      goodsDb.getGoodsById(options.id).then(res => {
        if (res.data && res.data.length > 0) {
          that.setData({
            goodsInfo: res.data[0]
          })
        } else {
          wx.showToast({
            title: '你访问的物品已经不存在'
          })
          wx.navigateTo({ url: "../../views/index/index" });
        }
        wx.hideLoading();
      })
    }else{
      wx.showToast({
        title:"参数错误"
      })
    }

    //方法绑定
    this.setData({
      closeGoodsDetail : this.closeGoodsDetail.bind(this)
    })
  },
  closeGoodsDetail: function(){
    wx.navigateBack({ delta: 1 });
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