
const app = getApp();
const {userInfoDb} = require("../../utils/dbUtil/userInfo.js");
const {goodsDb} = require("../../utils/dbUtil/legoGoods.js");
Page({
  data: {
    activeMenu:"index",
    userInfo:null,
    wzUserInfo:null,

    getUserInfoBack:null,
    menuChange:null
  },
  onLoad: function () {
    let that = this;
    //获取用户openId
    this.onGetOpenid(openid=>{
      //获取用户信息
      userInfoDb.getUserById(openid).then(res => {
        console.info("---------------" + openid)
        console.info(res)
        if(res.data && res.data.length>0){
          userInfoDb.updateUserDate(openid);
          that.setData({
            wzUserInfo:res.data[0]
          })
          app.globalData.userInfo = res.data[0];
        }else{
          userInfoDb.insertUser(openid);
          that.setData({
            wzUserInfo: { _id: openid}
          })
        }
      });

      this.setData({
        getUserInfoBack: this.getUserInfoBack.bind(this),
        menuChange: this.menuChange.bind(this)
      })
    });
  },
  getUserInfoBack:function(userInfo){
    Object.assign(app.globalData.userInfo,userInfo);
    this.setData({
      userInfo: userInfo
    })
  },
  menuChange:function(menuCode){
    this.setData({
      activeMenu:menuCode
    })
  },

  //获取用户openiD
  onGetOpenid: function (callbk) {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.info("用户openid: "+res.result.openid);
        app.globalData.openid = res.result.openid;
        if (callbk) callbk(res.result.openid)
      },
      fail: err => {
        console.error('获取用户openID失败!', err)
      }
    })
  }
})