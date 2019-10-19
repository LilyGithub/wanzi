const db = wx.cloud.database();
const { goodsDb } = require("../../utils/dbUtil/legoGoods.js");
let userInfoDb = {
  insertUser: function (openid) {
    console.info("需要保持的用户id" + openid)
    if (openid) {
      db.collection('user_info').add({
        data: {
          _id: openid,
          times: 1,
          vip:0,
          date: new Date()
        }
      })
        .then(res => {
          console.log(res)
        })
        .catch(console.error)
    }
  },
  updateUser:function(id,data){
    console.info(data);
    return db.collection('user_info').doc(id).update({data:data});
  },
  updateUserDate: function (openid){
    this.updateUser(openid, {
      times: 1,
      date: new Date()
    })
  },
  getUserById:function(openid){
    return db.collection('user_info').where({
      _id: openid
    }).get();
  }
}
module.exports.userInfoDb = userInfoDb;