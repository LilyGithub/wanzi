// miniprogram/views/searchList/searchList.js
/**
 * 跳转参数： mainType 
 */
const app = getApp();
const { goodsDb } = require("../../utils/dbUtil/legoGoods.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList:[],
    keyWord:"",
    showSearchRecord:false,
    noData:false,
    mainType:null,
    subType:null,
    currentPage:0,
    pageSize:10,


    itemClick:null,
    loadFunc:null
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      //方法绑定
      itemClick: this.itemClick.bind(this),
      loadFunc: this.loadFunc.bind(this),
       //参数处理
      mainType:options.mainType,
      subType:options.subType
    });
    if (options.isImt){
      this.queryGoodsByKeyWord();
    }
  },
  itemClick: function (goods) {
    wx.navigateTo({ url: "../../views/goods/goods?id="+goods._id });
  },
  inputkeyWord:function(e){
    let keyWord = e.detail.value;
    this.setData({
      keyWord: keyWord
    });
  },
  loadFunc:function(){
    let { currentPage } = this.data;
    this.loadPageData(currentPage+1);
  },
  returnPre:function(){
    wx.navigateBack({ delta: 1 });
  },
  compuletePageSize(){

  },
  queryGoodsByKeyWord(){
      this.loadPageData(0);
  },
  loadPageData(currentPage){
    console.info(currentPage);
    if (!currentPage)currentPage = 0;
    if (app.globalData.isLoad) {
      return;
    }
    app.globalData.isLoad = true;
    let { mainType, subType, pageSize } = this.data;
    this.setData({
      showSearchRecord: false
    })
    if (currentPage == 0){
      wx.showLoading({
      title: '搜索中...',
      })
    }
    let that = this;
    goodsDb.queryGoodsByKey({
      mainType: mainType,
      subType: subType,
      keyWord: this.data.keyWord,
      pageSize: pageSize,
      currentPage: currentPage
    }).then(res => {
      console.info(res);
      if (res.data && res.data.length > 0) {
        let { goodsList } = this.data;
        goodsList = goodsList.concat(res.data)
        that.setData({
          noData: false,
          currentPage: currentPage,
          goodsList: goodsList
        });
      } else if (currentPage==0){
        that.setData({
          noData: true
        });
      }
      wx.hideLoading();
      app.globalData.isLoad = false;
    })
  },
  startInputKeyWord:function(){
    this.setData({
      showSearchRecord:true
    })
  }
})