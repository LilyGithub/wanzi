const db = wx.cloud.database();

const goodsDb = {
  getRecentGoods:function(params) {
    let skipIndex = params.pageSize*params.currentPage;
    return db.collection('lego_goods')
      .orderBy('date', 'desc')
      .skip(skipIndex)
      .limit(params.pageSize)
      .get();
  },
  queryGoodsByKey:function(params){
    let skipIndex = params.pageSize * params.currentPage;
    console.info(params);
    let queryData = {};
    if (params.keyWord){
      queryData.name = {
        $regex: '.*' + params.keyWord + '.*',
        $options: 'i'
      }
    }
    if(params.mainType && params.mainType>=0){
      queryData.mainType = params.mainType;
    }
    if (params.subType && params.subType >= 0){
      queryData.subType = params.subType;
    }
    return db.collection('lego_goods')
    .where(queryData)
    .orderBy('date', 'desc')
    .skip(skipIndex)
    .limit(params.pageSize)
    .get()
  },
  getGoodsById:function(id){
    return db.collection('lego_goods')
    .where({
      _id: id
    }).get()
  },
  insertGoods:function(goods){
    console.info(goods);
    goods.date = new Date();
    return wx.cloud.callFunction({
      // 云函数名称
      name: 'insertGoods',
      // 传给云函数的参数
      data: goods
    })
   // return db.collection('lego_goods').add({data:goods});
  }
}
module.exports.goodsDb = goodsDb;