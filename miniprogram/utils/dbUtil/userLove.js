const db = wx.cloud.database();
const userLoveDb = {
  addLove:function(goodsId){
    return db.collection('user_love_goods').add({
      data:{
        goodsId: goodsId
      }
    })
  }
}

module.exports.userLoveDb = userLoveDb;