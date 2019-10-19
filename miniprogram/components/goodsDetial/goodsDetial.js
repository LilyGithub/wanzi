// components/goodsDetial.js
const app = getApp();
const { userInfoDb } = require("../../utils/dbUtil/userInfo.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsInfo:Object,
    closeFun:{
      type:Function
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    detailHeight:[100,100,100,100,100,100,100,100,100,100],
    userInfo: app.globalData.userInfo,
    isLove: false
  },
  lifetimes:{
    attached:function(){
      let isLove = false;
      let {goodsInfo} = this.data;
      if (app.globalData.userInfo.loveGoods && app.globalData.userInfo.loveGoods.indexOf(goodsInfo._id)>-1){
        isLove = true;
      }
      this.setData({
        userInfo:app.globalData.userInfo,
        isLove: isLove
      })
      this.setDetailSize();
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    closeFun:function(){
      this.data.closeFun();
    },
    setDetailSize:function(){
      let { content } = this.properties.goodsInfo;
      let that = this;
      content.detail.map( (item,index)=>{
        wx.getImageInfo({
          src: item,
          success(res) {
            let { detailHeight } = that.data;
            let imgWidth = res.width;
            let imgHeight = res.height;
            let whPer = imgHeight / imgWidth;
            let tempHeight = app.globalData.width * whPer;
            detailHeight[index] = tempHeight;
            that.setData({
              detailHeight: detailHeight
            });
          }
        })
      })
      
    },
    copyBuyBz:function(){
      wx.setClipboardData({
        data: this.data.goodsInfo.buyKey,
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              wx.showToast({
                icon: "none",
                title: '下单备注复制成功！'
              })
            }
          })
        }
      })
    },
    copyBuyKey: function (e) {
      if (this.data.goodsInfo.buyWay==3){
        wx.showToast({
          icon:"none",
          title: "赞无优惠劵"
        })
        return;
      }
      wx.setClipboardData({
        data: this.data.goodsInfo.buyKey,
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              wx.showToast({
                icon:"none",
                title: '口令复制成功！打开淘宝领券购买'
              })
            }
          })
        }
      })
    },
    copyBuyWx:function(e) {
      wx.setClipboardData({
        data: this.data.goodsInfo.wx,
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              wx.showToast({
                title: '已复制微信号！'
              })
            }
          })
        }
      })
    },
    addLove:function(){
      let { goodsInfo } = this.data;
      if (!app.globalData.userInfo.loveGoods) app.globalData.userInfo.loveGoods=[];
      
      let index = app.globalData.userInfo.loveGoods.indexOf(goodsInfo._id);
      let tipsMsg;
      let isLove;
      if (index>-1){
        app.globalData.userInfo.loveGoods.splice(index,1);
        tipsMsg = "取消收藏"
        isLove = false;
      }else{
        app.globalData.userInfo.loveGoods.push(goodsInfo._id);
        tipsMsg = "添加成功";
        isLove = true;
      }
      userInfoDb.updateUser(app.globalData.openid, { loveGoods: app.globalData.userInfo.loveGoods} ).then(res=>{
        wx.showToast({
          icon:"none",
          title: tipsMsg
        })
      })
      this.setData({
        isLove:isLove
      })
    }
  }
})
