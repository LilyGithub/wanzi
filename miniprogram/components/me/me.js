// components/me/me.js
const app = getApp();
const { userInfoDb } = require("../../utils/dbUtil/userInfo.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userInfo:Object, //微信用户信息
    wzUserInfo: Object //平台用户信息
  },

  /**
   * 组件的初始数据
   */
  data: {
    showUpGoods:false,
    showUsers:false
  },
  lifetimes: {
    attached: function () {
      if(this.data.wzUserInfo.adminLevel){
        let showUpGoods = false;
        let showUsers = false;
        //上传物品权限
        if (this.data.wzUserInfo.adminLevel >= app.globalData.dic.adminLevel.normal) {
          showUpGoods = true
        }
        //用户管理权限
        if (this.data.wzUserInfo.adminLevel >= app.globalData.dic.adminLevel.level2) {
          showUsers = true
        }
        this.setData({
          showUpGoods: showUpGoods,
          showUsers: showUsers
        })
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    gotoUploadGoods:function(){
      wx.navigateTo({ url:"../../views/uploadGoods/uploadGoods"});
    }
  }
})
