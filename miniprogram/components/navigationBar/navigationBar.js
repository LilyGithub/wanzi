// components/navigationBar/navigationBar.js
const app = getApp();
const { userInfoDb } = require("../../utils/dbUtil/userInfo.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    menuChange:{
      type:Function
    },
    getUserInfoBack:{
      type:Function
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    activeMenu: "index"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    gotoPage(e) {
      let id = e.currentTarget.id;
      this.setData({
        activeMenu: id
      });
      if(this.properties.menuChange)this.properties.menuChange(id);
    },
    //获取用户信息
    getUserInfo: function () {
      if (this.data.userInfo) {
        return;
      }
      console.info("点击授权");
      var that = this
      wx.getSetting({
        success(res) {
          console.info(res);
          if (!res.authSetting['scope.userInfo']) {
            wx.authorize({
              scope: 'scope.userInfo',
              success() {
                that.UserLogin();
              }
            })
          }
          else {
            that.UserLogin();
          }
        }
      })
    },
    UserLogin: function () {
      let that = this;
      console.info("获取用户信息");
      wx.getUserInfo({
        success: res => {
          console.info(res);
          userInfoDb.updateUser(app.globalData.openid, res.userInfo).then(res => console.info(res));
          if (this.properties.getUserInfoBack)this.properties.getUserInfoBack(res.userInfo);
          /*that.setData({
            userInfo: res.userInfo
          })*/
        }
      })
    }
  }
})
