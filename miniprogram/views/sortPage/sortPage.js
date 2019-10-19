// miniprogram/views/sortPage/sortPage.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList: app.globalData.dic.goodsType,
    currentType: 0,
    contentHeight: 100
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type = 0;
    if(options.type){
      type = options.type;
    }
    let contentHeight = app.globalData.height  - 90;
    this.setData({
      currentType: type,
      contentHeight: contentHeight
    })
  },
  selectTypeList(e){
    let id = e.currentTarget.id;
    this.setData({
      currentType:id
    })
  },
  returnPre: function () {
    wx.navigateBack({ delta: 1 });
  },
  gotoSearchPage:function(e){
    let { currentType } = this.data;
    let subType = e.currentTarget.id;
    wx.navigateTo({ url: "../../views/searchList/searchList?isImt=true&mainType=" + currentType + "&subType=" + subType })
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