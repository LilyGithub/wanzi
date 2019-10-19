// components/index/index.js
const app = getApp();
const { goodsDb } = require("../../utils/dbUtil/legoGoods.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    goodsTypeList: [
      app.globalData.dic.goodsType[0],
      app.globalData.dic.goodsType[1],
      app.globalData.dic.goodsType[2],
      app.globalData.dic.goodsType[3],
      app.globalData.dic.goodsType[4],
      app.globalData.dic.goodsType[5],
      app.globalData.dic.goodsType[6],
      app.globalData.dic.goodsType[9],
      app.globalData.dic.goodsType[10],
      {
        name: "更多",
        code: -1,
        img: "iconmore",
        component: ""
      }
    ],
    currentPage:0,
    pageSize:10,
    popGoodsList: [
    ],
    tile2Height:30,
    showDetail: false,
    goodsItemClick: null,
    showGoods: null,
    closeGoodsDetail: null
  },
  lifetimes: {
    attached: function () {
      //获取最近上新列表
      let that = this;
      this.getGoodsList(0);
      //设置属性函数
      this.setData({
        goodsItemClick: this.goodsItemClick.bind(this),
        closeGoodsDetail: this.closeGoodsDetail.bind(this),
        //页面尺寸
        tile2Height:app.globalData.width * (76/870)
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    refreshList:function(){
      
    },
    loadNextList:function(isFirst){
      if (app.globalData.isLoad){
        return;
      }
      let {currentPage} = this.data;
      this.getGoodsList(currentPage + 1);
    },
    getGoodsList: function (currentPage){
      console.info(currentPage);
      if (app.globalData.isLoad) {
        return;
      }
      app.globalData.isLoad = true;
      let { pageSize} = this.data;
      let that = this;
      goodsDb.getRecentGoods({ currentPage , pageSize }).then(res => {
        console.info("获取最近上新成功！"); console.info(res);
        if(res.data && res.data.length>0){
          let curentList = that.data.popGoodsList;
          that.setData({
            popGoodsList: curentList.concat(res.data),
            currentPage: currentPage
          })
        }
        app.globalData.isLoad = false;
      });
    },
    goodsItemClick: function (goods) {
      this.setData({
        showDetail: true,
        showGoods: goods
      })
    },
    closeGoodsDetail: function () {
      this.setData({
        showDetail: false
      });
    },
    gotoSearchPage:function(){
      wx.navigateTo({ url: "../../views/searchList/searchList" });
    },
    gotoSortPage:function(e){
      let id = e.currentTarget.id; 
      wx.navigateTo({ url: "../../views/sortPage/sortPage?type="+id });
    }
  },
  onPullDownRefresh: function () {
    wx.showToast({
      title: 'jjjj',
    })
  },
})
